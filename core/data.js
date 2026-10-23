/* ============================================================
   DONNÉES — synchronisation des données de l'utilisateur avec Supabase
   Expose window.appData. Chargé après commun.js et avant les modules.

   Principe : les données appartiennent au COMPTE, pas à l'appareil.
   - Le serveur (Supabase) est la référence. Le localStorage n'en est qu'une copie de travail :
     les modules continuent de lire et d'écrire dedans comme avant.
   - Écriture : appSafeSetItem (commun.js) prévient ce module à chaque écriture d'une clé connue.
     Il compare avec ce que le serveur a déjà et n'envoie que ce qui a changé.
     Une suppression n'efface pas la ligne : elle renseigne deleted_at (suppression douce).
   - Lecture : au démarrage avec une session, tout est relu depuis le serveur. Si la copie locale
     diffère, elle est remplacée et la page se recharge une fois (les modules gardent leurs
     données en mémoire).
   - Changement de compte ou déconnexion : la copie locale est vidée. Rien n'est partagé entre comptes.

   Tables (supabase/schema.sql) :
   - 10 tables de listes : user_id, id (texte), occurred_at, data (jsonb), created_at, updated_at, deleted_at.
     Clé primaire (user_id, id). Une ligne = un élément de la liste.
   - profiles : une ligne par personne, une colonne par clé de réglages.

   Hors périmètre (reste sur l'appareil) : brouillons et parties en cours (golfStatsRoundDraft,
   gym-session-draft, putting_resume*, wedgingInProgressSessions, parcours-fairway-round,
   parcours-green-round).
   Pas de mode hors ligne : sans réseau, la copie locale reste utilisable mais rien n'est envoyé,
   et la copie est remplacée par celle du serveur à la prochaine ouverture avec réseau.
   ============================================================ */
(function () {
  'use strict';

  const sb = window.appSupabase;
  const SESSION_KEY = window.APP_SESSION_KEY || 'golfSupabaseAuth';
  // Compte auquel appartient la copie locale (permet de la vider quand un autre compte se connecte)
  const ACCOUNT_KEY = 'golfAccountUserId';

  const SEND_DELAY_MS = 200;     // regroupe les écritures rapprochées en un seul envoi
  const RETRY_DELAY_MS = 5000;   // nouvel essai après un échec d'envoi
  const PAGE_SIZE = 1000;        // PostgREST renvoie au plus 1000 lignes par requête
  const UPSERT_CHUNK = 50;       // une partie Stats peut être lourde : paquets de 50 lignes
  const DELETE_CHUNK = 100;

  // Clé localStorage -> table. newestFirst : le module range les plus récents en premier (unshift)
  const LISTS = {
    'golfStatsRounds':    { table: 'stats_rounds' },
    'parcours-captures':  { table: 'parcours_captures' },
    'putting_combines':   { table: 'putting_combines' },
    'putting_sessions':   { table: 'putting_sessions' },
    'putting_rounds':     { table: 'putting_rounds' },
    'wedgingShots':       { table: 'wedging_shots' },
    'wedgingExercises':   { table: 'wedging_exercises' },
    'gym-programs-saved': { table: 'gym_programs' },
    'gym-history':        { table: 'gym_history', newestFirst: true },
    'gym-goals':          { table: 'gym_goals', newestFirst: true },
  };

  // Clé localStorage -> colonne de profiles. json : valeur JSON ; sinon texte brut. empty : valeur "vide" du serveur
  const PROFILE = {
    'golfAppState':          { col: 'app_state', json: true, empty: {} },
    'golfModulePrefs':       { col: 'module_prefs', json: true, empty: {} },
    'parcours-settings':     { col: 'parcours_settings', json: true, empty: {} },
    'golfStatsKpis':         { col: 'stats_kpis', json: true, empty: [] },
    'parcours-fairway-unit': { col: 'parcours_fairway_unit', json: false },
    'gym-active-program-id': { col: 'gym_active_program_id', json: false },
  };

  let userId = null;
  let ready = false;          // vrai une fois les données du serveur lues : avant, aucune écriture n'est envoyée
  let startPromise = null;
  const snaps = {};           // clé de liste -> Map(id -> { canon, occurredAt }) : ce que le serveur contient
  const profileSnap = {};     // colonne -> forme canonique de ce que le serveur contient
  const dirty = new Set();    // clés modifiées en attente d'envoi
  let sendTimer = null;
  let retryTimer = null;
  let chain = Promise.resolve();
  let lastWarnAt = 0;

  /* ---------- Utilitaires ---------- */

  // Forme canonique d'une valeur (clés triées) : jsonb ne garde pas l'ordre des clés, on compare donc sur cette forme
  function canon(v) {
    if (v === null || typeof v !== 'object') return JSON.stringify(v) === undefined ? 'null' : JSON.stringify(v);
    if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
    return '{' + Object.keys(v).filter((k) => v[k] !== undefined).sort()
      .map((k) => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
  }

  function parse(raw) {
    try { return raw === null || raw === undefined ? null : JSON.parse(raw); } catch (e) { return undefined; }
  }

  // Tableau stocké sous une clé : [] si la clé est absente, null si le contenu est illisible (on n'envoie alors rien)
  function readArray(key) {
    const raw = localStorage.getItem(key);
    if (raw === null) return [];
    const value = parse(raw);
    return Array.isArray(value) ? value : null;
  }

  const isEmptyJson = (v) => v === null || v === undefined ||
    (Array.isArray(v) ? v.length === 0 : (typeof v === 'object' && Object.keys(v).length === 0));

  // Identifiant d'un élément : id, sinon statsKey, sinon sa date (les captures Parcours n'ont pas d'id)
  function idOf(item) {
    const v = item.id !== undefined && item.id !== null ? item.id
      : (item.statsKey || item.date || item.dateISO);
    return v === undefined || v === null || v === '' ? null : String(v);
  }

  // Date de l'élément pour la colonne occurred_at (null si aucune date exploitable)
  function occurredOf(item, id) {
    const fields = [item.dateISO, item.date, item.createdAt, item.startedAt, item.endedAt, item.completedAt, item.timestamp];
    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      if (f === undefined || f === null || f === '') continue;
      const d = new Date(f);
      if (!isNaN(d.getTime()) && d.getFullYear() >= 2000 && d.getFullYear() <= 2100) return d.toISOString();
    }
    // Ids créés avec Date.now() : l'id est lui-même un horodatage
    if (/^\d{13}$/.test(id)) return new Date(Number(id)).toISOString();
    return null;
  }

  function storedUserId() {
    try {
      const s = JSON.parse(localStorage.getItem(SESSION_KEY));
      return (s && s.user && s.user.id) || null;
    } catch (e) { return null; }
  }

  // Message court, sans empiler les alertes
  function notify(message) {
    const now = Date.now();
    if (now - lastWarnAt < 30000 || !document.body) return;
    lastWarnAt = now;
    const toast = document.createElement('div');
    toast.setAttribute('role', 'alert');
    toast.textContent = message;
    toast.style.cssText = 'position:fixed;left:16px;right:16px;bottom:calc(16px + env(safe-area-inset-bottom, 0px));' +
      'z-index:10000;padding:14px 16px;border-radius:14px;background:#2a1215;color:#ffd9d9;' +
      'border:1px solid rgba(255,120,120,.45);font-size:14px;line-height:1.35;text-align:center;';
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 6000);
  }

  /* ---------- Copie locale ---------- */

  // Supprime toutes les données de l'appli du localStorage (sauf la session et le marqueur de compte).
  // Renvoie le nombre de clés supprimées.
  function wipeApp() {
    let n = 0;
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k === SESSION_KEY || k === ACCOUNT_KEY) return;
        localStorage.removeItem(k);
        n++;
      });
    } catch (e) { console.warn('Données : nettoyage local impossible', e); }
    return n;
  }

  // La copie locale appartient-elle à ce compte ? Sinon on la vide. Renvoie true si des données ont été retirées.
  function adoptAccount(uid) {
    try {
      if (localStorage.getItem(ACCOUNT_KEY) === uid) return false;
      const removed = wipeApp();
      localStorage.setItem(ACCOUNT_KEY, uid);
      return removed > 0;
    } catch (e) { return false; }
  }

  // Déconnexion : vide la copie locale. Renvoie true si elle appartenait à un compte (la page doit être rechargée).
  function clearLocal() {
    let had = false;
    try { had = !!localStorage.getItem(ACCOUNT_KEY); } catch (e) {}
    wipeApp();
    try { localStorage.removeItem(ACCOUNT_KEY); } catch (e) {}
    userId = null; ready = false; startPromise = null;
    dirty.clear();
    return had;
  }

  /* ---------- Lecture (serveur -> appareil) ---------- */

  async function fetchAll(key) {
    const cfg = LISTS[key];
    const asc = !cfg.newestFirst;
    const rows = [];
    for (let from = 0; ; from += PAGE_SIZE) {
      const { data, error } = await sb.from(cfg.table)
        .select('id,data,occurred_at')
        .is('deleted_at', null)
        .order('occurred_at', { ascending: asc, nullsFirst: false })
        .order('created_at', { ascending: asc })
        .order('id', { ascending: asc })
        .range(from, from + PAGE_SIZE - 1);
      if (error) throw error;
      rows.push(...data);
      if (data.length < PAGE_SIZE) break;
    }
    return rows;
  }

  async function fetchProfile() {
    const { data, error } = await sb.from('profiles').select('*').eq('user_id', userId).maybeSingle();
    if (error) throw error;
    return data; // null si la ligne n'existe pas encore
  }

  // Remplace la copie locale par les données du serveur. Renvoie true si quelque chose a changé.
  async function pull() {
    const keys = Object.keys(LISTS);
    const [lists, profile] = await Promise.all([Promise.all(keys.map(fetchAll)), fetchProfile()]);
    let changed = false;

    keys.forEach((key, i) => {
      const rows = lists[i];
      const server = rows.map((r) => r.data);
      const local = readArray(key) || [];
      const a = local.map(canon).sort().join('\n');
      const b = server.map(canon).sort().join('\n');
      if (a !== b) {
        try {
          if (server.length) localStorage.setItem(key, JSON.stringify(server)); else localStorage.removeItem(key);
          changed = true;
        } catch (e) { console.warn('Données : écriture locale impossible (' + key + ')', e); }
      }
      snaps[key] = new Map(rows.map((r) => [String(r.id), { canon: canon(r.data), occurredAt: r.occurred_at }]));
    });

    Object.keys(PROFILE).forEach((key) => {
      const cfg = PROFILE[key];
      const serverVal = profile ? profile[cfg.col] : null;
      const localRaw = localStorage.getItem(key);
      let same;
      let serverEmpty;
      if (cfg.json) {
        serverEmpty = isEmptyJson(serverVal);
        const localVal = parse(localRaw);
        const localEmpty = isEmptyJson(localVal);
        same = (serverEmpty && localEmpty) || (!serverEmpty && !localEmpty && canon(serverVal) === canon(localVal));
        profileSnap[cfg.col] = profile ? canon(serverEmpty ? cfg.empty : serverVal) : undefined;
      } else {
        serverEmpty = serverVal === null || serverVal === undefined || serverVal === '';
        same = serverEmpty ? !localRaw : serverVal === localRaw;
        profileSnap[cfg.col] = profile ? canon(serverEmpty ? null : serverVal) : undefined;
      }
      if (!same) {
        try {
          if (serverEmpty) localStorage.removeItem(key);
          else localStorage.setItem(key, cfg.json ? JSON.stringify(serverVal) : serverVal);
          changed = true;
        } catch (e) { console.warn('Données : écriture locale impossible (' + key + ')', e); }
      }
    });

    return changed;
  }

  /* ---------- Écriture (appareil -> serveur) ---------- */

  async function pushList(key) {
    const cfg = LISTS[key];
    const snap = snaps[key] || (snaps[key] = new Map());
    const items = readArray(key);
    if (items === null) return; // contenu illisible : on ne touche à rien côté serveur

    const seen = new Set();
    const rows = [];
    const marks = [];
    let order = 0;
    items.forEach((item) => {
      if (!item || typeof item !== 'object') return;
      const id = idOf(item);
      if (id === null) { console.warn('Données : élément sans identifiant ignoré (' + key + ')'); return; }
      if (seen.has(id)) return;
      seen.add(id);
      const c = canon(item);
      const prev = snap.get(id);
      if (prev && prev.canon === c) return; // déjà à jour sur le serveur
      // Éléments sans date : on garde l'ordre d'insertion grâce à un horodatage croissant, conservé ensuite
      const occurredAt = occurredOf(item, id) || (prev && prev.occurredAt) || new Date(Date.now() + order++).toISOString();
      // deleted_at: null : ré-ajouter un élément supprimé auparavant le fait réapparaître
      rows.push({ user_id: userId, id, occurred_at: occurredAt, data: item, deleted_at: null });
      marks.push([id, { canon: c, occurredAt }]);
    });

    for (let i = 0; i < rows.length; i += UPSERT_CHUNK) {
      const { error } = await sb.from(cfg.table).upsert(rows.slice(i, i + UPSERT_CHUNK), { onConflict: 'user_id,id' });
      if (error) throw error;
      marks.slice(i, i + UPSERT_CHUNK).forEach(([id, m]) => snap.set(id, m));
    }

    // Éléments retirés de la liste : suppression douce (deleted_at), la ligne reste sur le serveur
    const gone = Array.from(snap.keys()).filter((id) => !seen.has(id));
    for (let i = 0; i < gone.length; i += DELETE_CHUNK) {
      const part = gone.slice(i, i + DELETE_CHUNK);
      const { error } = await sb.from(cfg.table)
        .update({ deleted_at: new Date().toISOString() })
        .eq('user_id', userId)
        .in('id', part);
      if (error) throw error;
      part.forEach((id) => snap.delete(id));
    }
  }

  async function pushProfile(keys) {
    const row = { user_id: userId };
    const marks = [];
    keys.forEach((key) => {
      const cfg = PROFILE[key];
      const raw = localStorage.getItem(key);
      let value;
      if (cfg.json) {
        value = parse(raw);
        if (value === undefined) return; // contenu illisible
        if (value === null) value = cfg.empty;
      } else {
        value = raw || null;
      }
      const c = canon(value);
      if (c === profileSnap[cfg.col]) return;
      row[cfg.col] = value;
      marks.push([cfg.col, c]);
    });
    if (!marks.length) return;
    const { error } = await sb.from('profiles').upsert(row, { onConflict: 'user_id' });
    if (error) throw error;
    marks.forEach(([col, c]) => { profileSnap[col] = c; });
  }

  async function sendPending() {
    if (!ready || !userId) return;
    const keys = Array.from(dirty);
    dirty.clear();
    let failed = false;
    const profileKeys = keys.filter((k) => PROFILE[k]);
    for (const key of keys.filter((k) => LISTS[k])) {
      try { await pushList(key); } catch (e) { failed = true; dirty.add(key); console.warn('Données : envoi impossible (' + key + ')', e); }
    }
    if (profileKeys.length) {
      try { await pushProfile(profileKeys); } catch (e) { failed = true; profileKeys.forEach((k) => dirty.add(k)); console.warn('Données : envoi impossible (profil)', e); }
    }
    if (failed) {
      notify('Synchronisation impossible pour le moment. Les modifications sont gardées sur cet appareil, nouvel essai automatique.');
      clearTimeout(retryTimer);
      retryTimer = setTimeout(flush, RETRY_DELAY_MS);
    }
  }

  // Envoie tout de suite ce qui est en attente. La promesse se termine quand l'envoi est fini.
  function flush() {
    clearTimeout(sendTimer);
    sendTimer = null;
    chain = chain.then(sendPending).catch((e) => console.warn('Données : envoi', e));
    return chain;
  }

  // Appelé par appSafeSetItem (commun.js) après chaque écriture dans le localStorage
  function onWrite(key) {
    if (!ready || !userId || (!LISTS[key] && !PROFILE[key])) return;
    dirty.add(key);
    clearTimeout(sendTimer);
    sendTimer = setTimeout(flush, SEND_DELAY_MS);
  }

  /* ---------- Démarrage ---------- */

  // À appeler quand un compte est connecté (connexion, inscription, lien e-mail). Renvoie une promesse :
  // true si la copie locale a été remplacée, la page doit alors être rechargée.
  function start(uid) {
    if (!sb || !uid) return Promise.resolve(false);
    if (userId === uid && startPromise) return startPromise;
    userId = uid;
    ready = false;
    startPromise = (async () => {
      let changed = adoptAccount(uid);
      try {
        changed = (await pull()) || changed;
        ready = true;
      } catch (e) {
        console.warn('Données : lecture du serveur impossible', e);
        notify('Synchronisation impossible : vérifiez votre connexion. Les données affichées peuvent ne pas être à jour.');
        startPromise = null;
      }
      return changed;
    })();
    return startPromise;
  }

  // Rechargement unique : évite toute boucle si la copie locale ne se stabilise pas
  function reloadOnce() {
    try {
      const last = Number(sessionStorage.getItem('golfSyncReload')) || 0;
      if (Date.now() - last < 15000) return;
      sessionStorage.setItem('golfSyncReload', String(Date.now()));
    } catch (e) {}
    location.reload();
  }

  /* ---------- Suppression de toutes les données du compte ---------- */

  // Efface sur le serveur toutes les lignes de l'utilisateur (suppression réelle, pas douce).
  // La suppression du compte lui-même demande une Edge Function (auth.admin.deleteUser), voir menu.js.
  async function deleteRemote() {
    const uid = userId || storedUserId();
    if (!sb || !uid) throw new Error('Aucun compte connecté');
    clearTimeout(sendTimer);
    dirty.clear();
    const tables = Object.keys(LISTS).map((k) => LISTS[k].table).concat('profiles');
    for (const table of tables) {
      const { error } = await sb.from(table).delete().eq('user_id', uid);
      if (error) throw error;
    }
  }

  window.appData = {
    start, flush, onWrite, clearLocal, deleteRemote,
    isReady: () => ready,
  };

  /* ---------- Au chargement ---------- */

  const initialUid = storedUserId();
  if (initialUid && sb) {
    // Avant que les modules ne lisent leurs données : si la copie locale est celle d'un autre compte, on la vide
    adoptAccount(initialUid);
    start(initialUid).then((changed) => { if (changed) reloadOnce(); });
  }

  window.addEventListener('online', () => {
    const uid = userId || storedUserId();
    if (uid && !ready) start(uid).then((changed) => { if (changed) reloadOnce(); });
    else flush();
  });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
  window.addEventListener('pagehide', flush);
})();
