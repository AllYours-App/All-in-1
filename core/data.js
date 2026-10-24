/* ============================================================
   DONNÉES — synchronisation des données de l'utilisateur avec Supabase
   Expose window.appData. Chargé après commun.js et avant les modules.

   Principe : les données appartiennent au COMPTE, pas à l'appareil.
   - Le serveur (Supabase) est la référence. Le localStorage en est la copie de travail :
     les modules continuent de lire et d'écrire dedans comme avant.
   - Écriture : appSafeSetItem (commun.js) prévient ce module à chaque écriture d'une clé connue.
     La clé est notée "en attente" (golfevolution_sync_pending, dans le localStorage : elle survit à la fermeture
     de l'appli). Dès que le réseau et les données du serveur sont là, il compare avec ce que le serveur
     contient et n'envoie que ce qui a changé. Un élément retiré d'une liste est effacé du serveur
     (delete réel de la ligne).
   - MODE HORS LIGNE : sans réseau, tout continue de fonctionner sur la copie locale. Les clés modifiées
     restent en attente et partent au retour du réseau, même si l'appli a été fermée entre-temps.
   - Lecture : au démarrage avec une session, tout est relu depuis le serveur. Une clé sans modification
     en attente est remplacée par la version du serveur. Une clé avec modifications en attente est
     FUSIONNÉE élément par élément (voir "Fusion") : rien de ce qui a été saisi hors ligne n'est perdu.
   - Changement de compte ou déconnexion : la copie locale est vidée. Rien n'est partagé entre comptes.

   Fusion (clé avec modifications en attente). Pour chaque élément, on compare 3 versions :
     base (ce que le serveur contenait la dernière fois que cet appareil s'est synchronisé, golfevolution_sync_base),
     locale, serveur.
   - modifié ici seulement          -> la version locale part sur le serveur
   - modifié sur le serveur seulement -> la version du serveur est reprise
   - modifié des deux côtés         -> la dernière modification gagne : date de la dernière écriture locale
                                       de la clé (golfevolution_sync_pending) contre updated_at du serveur
   La date locale est celle de la clé entière, pas de chaque élément : deux appareils qui modifient le
   MÊME élément, dont un hors ligne, peuvent se départager à tort.

   Mise à jour en cours d'utilisation ("late") : si les données du serveur arrivent alors que la personne
   utilise déjà l'appli (retour du réseau après un démarrage hors ligne, ou réponse très lente), la copie
   locale n'est PAS remplacée : les modules gardent leurs données en mémoire et les réécriraient par-dessus.
   Seules les modifications locales sont envoyées ; si le serveur a des données plus récentes, l'événement
   'appdata:status' passe en état 'reload' et offline.js propose d'actualiser. Aucun rechargement forcé.

   Tables (supabase/schema.sql) :
   - 10 tables de listes : user_id, id (texte), occurred_at, data (jsonb), created_at, updated_at, deleted_at.
     Clé primaire (user_id, id). Une ligne = un élément de la liste. deleted_at ne sert plus : l'ancienne
     suppression douce a été remplacée par un delete réel (supabase/suppression-compte.sql efface les
     lignes encore marquées) ; la lecture ignore par prudence toute ligne où deleted_at est renseigné.
   - profiles : une ligne par personne, une colonne par clé de réglages, plus deletion_requested_at
     (suppression du compte programmée, voir plus bas).

   Suppression du compte (30 jours pour changer d'avis) :
   - requestDeletion() inscrit la date dans profiles.deletion_requested_at : le serveur garde le compte et
     les données ; supabase/suppression-compte.sql supprime le compte (auth.users) et ses lignes au bout de
     DELETION_DELAY_DAYS jours, chaque nuit (pg_cron). Le délai doit rester le même des deux côtés.
   - À chaque lecture du profil, l'événement 'appdata:account' (detail : { deletionRequestedAt, purgeAt })
     prévient auth.js, qui propose d'annuler la suppression ou de se déconnecter.
   - cancelDeletion() remet la colonne à null : le compte et toutes les données sont conservés.

   Hors périmètre (reste sur l'appareil) : brouillons et parties en cours (golfevolution_stats_round_draft,
   golfevolution_gym_session_draft, golfevolution_putting_resume*, golfevolution_wedging_in_progress_sessions, golfevolution_parcours_fairway_round,
   golfevolution_parcours_green_round).

   Événement window 'appdata:status' (detail : { state, pending, reload }) :
     state = 'pending' (modifications à envoyer), 'syncing' (envoi en cours), 'error' (envoi impossible,
     nouvel essai automatique), 'idle' (tout est envoyé), 'reload' (données plus récentes sur le serveur).
   ============================================================ */
(function () {
  'use strict';

  const sb = window.appSupabase;
  const SESSION_KEY = window.APP_SESSION_KEY || 'golfevolution_auth';
  // Compte auquel appartient la copie locale (permet de la vider quand un autre compte se connecte)
  const ACCOUNT_KEY = 'golfevolution_account_user_id';
  // Clés d'état de la synchronisation. Vidées avec le reste des données (wipeApp), sauf si la clé est protégée.
  const BASE_KEY = 'golfevolution_sync_base';        // { v, uid, lists: { clé: { id: [hash, occurred_at] } }, profile: { colonne: hash } }
  const PENDING_KEY = 'golfevolution_sync_pending';  // { clé: date (ms) de la dernière modification locale non envoyée }

  const SEND_DELAY_MS = 200;      // regroupe les écritures rapprochées en un seul envoi
  const RETRY_MIN_MS = 5000;      // nouvel essai après un échec d'envoi, doublé à chaque échec...
  const RETRY_MAX_MS = 60000;     // ...jusqu'à une minute
  const FLUSH_WAIT_MS = 6000;     // attente maximale de l'envoi avant de recharger la page
  const DELETION_DELAY_DAYS = 30; // délai avant la suppression réelle du compte (identique dans supabase/suppression-compte.sql)
  const PAGE_SIZE = 1000;         // PostgREST renvoie au plus 1000 lignes par requête
  const UPSERT_CHUNK = 50;        // une partie Stats peut être lourde : paquets de 50 lignes
  const DELETE_CHUNK = 100;

  // Clé localStorage -> table. newestFirst : le module range les plus récents en premier (unshift)
  const LISTS = {
    'golfevolution_stats_rounds':    { table: 'stats_rounds' },
    'golfevolution_parcours_captures':  { table: 'parcours_captures' },
    'golfevolution_putting_combines':   { table: 'putting_combines' },
    'golfevolution_putting_sessions':   { table: 'putting_sessions' },
    'golfevolution_putting_rounds':     { table: 'putting_rounds' },
    'golfevolution_wedging_shots':       { table: 'wedging_shots' },
    'golfevolution_wedging_exercises':   { table: 'wedging_exercises' },
    'golfevolution_gym_programs_saved': { table: 'gym_programs' },
    'golfevolution_gym_history':        { table: 'gym_history', newestFirst: true },
    'golfevolution_gym_goals':          { table: 'gym_goals', newestFirst: true },
  };

  // Clé localStorage -> colonne de profiles. json : valeur JSON ; sinon texte brut. empty : valeur "vide" du serveur
  const PROFILE = {
    'golfevolution_app_state':          { col: 'app_state', json: true, empty: {} },
    'golfevolution_module_prefs':       { col: 'module_prefs', json: true, empty: {} },
    'golfevolution_parcours_settings':     { col: 'parcours_settings', json: true, empty: {} },
    'golfevolution_stats_kpis':         { col: 'stats_kpis', json: true, empty: [] },
    'golfevolution_parcours_fairway_unit': { col: 'parcours_fairway_unit', json: false },
    'golfevolution_gym_active_program_id': { col: 'gym_active_program_id', json: false },
  };

  let userId = null;
  let ready = false;          // vrai une fois les données du serveur lues : avant, aucun envoi
  let startPromise = null;
  let syncing = false;
  let needsReload = false;    // le serveur a des données plus récentes que celles affichées (mode "late")
  let deletionAt = null;      // date (ISO) à laquelle la suppression du compte a été demandée, null sinon
  let pending = {};           // clé -> date (ms) de la dernière modification locale non envoyée (copie de golfevolution_sync_pending)
  const base = {};            // clé de liste -> Map(id -> { h, o }) : hash de l'élément tel que le serveur le contenait, occurred_at
  const profBase = {};        // colonne -> hash de la valeur que le serveur contenait
  let sendTimer = null;
  let retryTimer = null;
  let retryDelay = RETRY_MIN_MS;
  let chain = Promise.resolve();

  /* ---------- Utilitaires ---------- */

  // Forme canonique d'une valeur (clés triées) : jsonb ne garde pas l'ordre des clés, on compare donc sur cette forme
  function canon(v) {
    if (v === null || typeof v !== 'object') return JSON.stringify(v) === undefined ? 'null' : JSON.stringify(v);
    if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
    return '{' + Object.keys(v).filter((k) => v[k] !== undefined).sort()
      .map((k) => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
  }

  // Empreinte courte d'une chaîne (cyrb53 + longueur) : de quoi retrouver si un élément a changé sans garder son contenu
  function hash(str) {
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return str.length.toString(36) + '.' + (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
  }

  const hashOf = (value) => hash(canon(value));

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

  const isOnline = () => navigator.onLine !== false;
  const isKnownKey = (k) => !!(LISTS[k] || PROFILE[k]);
  const pendingKeys = () => Object.keys(pending).filter(isKnownKey);

  /* ---------- État de la synchronisation (survit à la fermeture de l'appli) ---------- */

  function savePending() {
    try {
      if (pendingKeys().length) localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
      else localStorage.removeItem(PENDING_KEY);
    } catch (e) { console.warn('Données : file d\'attente non enregistrée', e); }
  }

  function saveBase() {
    if (!userId) return;
    try {
      const lists = {};
      Object.keys(base).forEach((k) => {
        const o = {};
        base[k].forEach((v, id) => { o[id] = [v.h, v.o]; });
        lists[k] = o;
      });
      localStorage.setItem(BASE_KEY, JSON.stringify({ v: 1, uid: userId, lists, profile: profBase }));
    } catch (e) { console.warn('Données : état de synchronisation non enregistré', e); }
  }

  function loadState(uid) {
    pending = {};
    Object.keys(base).forEach((k) => delete base[k]);
    Object.keys(profBase).forEach((c) => delete profBase[c]);
    const p = parse(localStorage.getItem(PENDING_KEY));
    if (p && typeof p === 'object' && !Array.isArray(p)) {
      Object.keys(p).forEach((k) => { if (isKnownKey(k) && typeof p[k] === 'number') pending[k] = p[k]; });
    }
    const b = parse(localStorage.getItem(BASE_KEY));
    if (b && b.v === 1 && b.uid === uid) {
      Object.keys(b.lists || {}).forEach((k) => {
        if (!LISTS[k]) return;
        base[k] = new Map(Object.keys(b.lists[k]).map((id) => [id, { h: b.lists[k][id][0], o: b.lists[k][id][1] }]));
      });
      Object.assign(profBase, b.profile || {});
    }
  }

  /* ---------- État visible par l'interface (offline.js) ---------- */

  function status() {
    return { pending: pendingKeys().length, syncing, ready, reload: needsReload, online: isOnline() };
  }

  function emit(state) {
    const s = status();
    if (!state) state = needsReload && !s.pending ? 'reload' : (s.syncing ? 'syncing' : (s.pending ? 'pending' : 'idle'));
    try { window.dispatchEvent(new CustomEvent('appdata:status', { detail: { state, pending: s.pending, reload: s.reload } })); } catch (e) {}
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
    userId = null; ready = false; startPromise = null; needsReload = false; deletionAt = null;
    clearTimeout(sendTimer); clearTimeout(retryTimer);
    pending = {};
    Object.keys(base).forEach((k) => delete base[k]);
    Object.keys(profBase).forEach((c) => delete profBase[c]);
    return had;
  }

  /* ---------- Lecture (serveur -> appareil) ---------- */

  async function fetchAll(key) {
    const cfg = LISTS[key];
    const asc = !cfg.newestFirst;
    const rows = [];
    for (let from = 0; ; from += PAGE_SIZE) {
      const { data, error } = await sb.from(cfg.table)
        .select('id,data,occurred_at,updated_at')
        .is('deleted_at', null)   // ancienne suppression douce : ces lignes sont ignorées (et effacées par supabase/suppression-compte.sql)
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

  const sortedHashes = (hashes) => hashes.slice().sort().join('\n');

  function writeLocal(key, value) {
    try {
      if (value === null || (Array.isArray(value) && !value.length)) localStorage.removeItem(key);
      else localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      return true;
    } catch (e) { console.warn('Données : écriture locale impossible (' + key + ')', e); return false; }
  }

  // Une liste avec modifications en attente : fusion élément par élément (voir l'en-tête du fichier).
  // Renvoie { final, differs } : la liste fusionnée et si elle diffère de la copie locale.
  function mergeList(key, rows, serverMap, localItems, late) {
    const cfg = LISTS[key];
    const b = base[key] || new Map();
    const localTs = pending[key] || 0;

    const localMap = new Map();
    localItems.forEach((item) => {
      if (!item || typeof item !== 'object') return;
      const id = idOf(item);
      if (id === null || localMap.has(id)) return;
      localMap.set(id, { item, h: hashOf(item) });
    });

    const ids = new Set([...localMap.keys(), ...serverMap.keys(), ...b.keys()]);
    const merged = new Map();   // id -> élément retenu
    ids.forEach((id) => {
      const L = localMap.get(id);
      const S = serverMap.get(id);
      const B = b.get(id);
      const lh = L ? L.h : null;
      const sh = S ? S.h : null;
      const bh = B ? B.h : null;
      if (lh === sh) { if (L) merged.set(id, L.item); return; }   // identiques (ou absents des deux côtés)
      const lChanged = lh !== bh;
      const sChanged = sh !== bh;
      let localWins;
      if (lChanged && !sChanged) localWins = true;
      else if (!lChanged && sChanged) localWins = false;
      else localWins = late || !S || !S.u || localTs >= S.u;   // modifié des deux côtés : la dernière modification gagne
      if (localWins) { if (L) merged.set(id, L.item); }         // absent en local : suppression locale, envoyée ensuite
      else if (S) merged.set(id, S.data);                       // absent du serveur : supprimé là-bas
    });

    // Ordre : celui du serveur ; les éléments créés ici s'ajoutent là où le module les met (fin, ou début si newestFirst)
    const ordered = [];
    const used = new Set();
    rows.forEach((r) => {
      const id = String(r.id);
      if (merged.has(id)) { ordered.push(merged.get(id)); used.add(id); }
    });
    const extra = [];
    localItems.forEach((item) => {
      if (!item || typeof item !== 'object') return;
      const id = idOf(item);
      if (id !== null && merged.has(id) && !used.has(id)) { extra.push(merged.get(id)); used.add(id); }
    });
    const final = cfg.newestFirst ? extra.concat(ordered) : ordered.concat(extra);
    const differs = sortedHashes(final.map(hashOf)) !== sortedHashes(localItems.filter((i) => i && typeof i === 'object').map(hashOf));
    return { final, differs };
  }

  // Lit le serveur et met la copie locale au même état (voir l'en-tête). isLate() est évalué une fois les données reçues.
  // Renvoie { changed, reload } : changed = la copie locale a été modifiée (la page doit être rechargée) ;
  // reload = le serveur a des données plus récentes mais la copie locale n'a pas été touchée (mode "late").
  async function pull(isLate) {
    const keys = Object.keys(LISTS);
    const [lists, profile] = await Promise.all([Promise.all(keys.map(fetchAll)), fetchProfile()]);
    const late = !!isLate();
    let changed = false;
    let reload = false;
    deletionAt = profile && profile.deletion_requested_at ? profile.deletion_requested_at : null;

    keys.forEach((key, i) => {
      const rows = lists[i];
      const serverMap = new Map(rows.map((r) => {
        const c = canon(r.data);
        return [String(r.id), { data: r.data, h: hash(c), o: r.occurred_at, u: r.updated_at ? Date.parse(r.updated_at) : null }];
      }));
      const serverBase = () => new Map(Array.from(serverMap, ([id, s]) => [id, { h: s.h, o: s.o }]));
      const localItems = readArray(key);

      // Aucune modification en attente (ou contenu local illisible) : la version du serveur remplace la copie locale
      if (!pending[key] || localItems === null) {
        const local = localItems || [];
        const differs = sortedHashes(local.map(hashOf)) !== sortedHashes(rows.map((r) => serverMap.get(String(r.id)).h));
        if (!differs) { base[key] = serverBase(); return; }
        if (late) { reload = true; return; }   // la copie locale n'est pas touchée, la base non plus
        if (writeLocal(key, rows.map((r) => r.data))) { changed = true; base[key] = serverBase(); }
        return;
      }

      // Modifications en attente : fusion
      const { final, differs } = mergeList(key, rows, serverMap, localItems, late);
      if (late) {
        // La copie locale reste telle quelle. La base ne retient que ce qui est identique des deux côtés :
        // le reste est envoyé par pushList (modifié ici : on envoie) ou attend l'actualisation (modifié là-bas)
        const b = base[key] || (base[key] = new Map());
        localItems.forEach((item) => {
          if (!item || typeof item !== 'object') return;
          const id = idOf(item);
          const s = id === null ? null : serverMap.get(id);
          if (s && s.h === hashOf(item)) b.set(id, { h: s.h, o: s.o });
        });
        if (differs) reload = true;
        return;
      }
      if (differs && !writeLocal(key, final)) return;
      if (differs) changed = true;
      base[key] = serverBase();   // pushList enverra la différence entre la copie locale fusionnée et le serveur
    });

    Object.keys(PROFILE).forEach((key) => {
      const cfg = PROFILE[key];
      const serverRaw = profile ? profile[cfg.col] : null;
      const serverEmpty = cfg.json ? isEmptyJson(serverRaw) : (serverRaw === null || serverRaw === undefined || serverRaw === '');
      const serverVal = serverEmpty ? (cfg.json ? cfg.empty : null) : serverRaw;
      const sh = hashOf(serverVal);

      const localRaw = localStorage.getItem(key);
      let localVal;
      let localEmpty;
      if (cfg.json) {
        localVal = parse(localRaw);
        if (localVal === undefined || localVal === null) localVal = cfg.empty;
        localEmpty = isEmptyJson(localVal);
      } else {
        localVal = localRaw || null;
        localEmpty = !localRaw;
      }
      const lh = hashOf(localVal);
      if (lh === sh) { profBase[cfg.col] = sh; return; }

      // Modification locale en attente : garde-t-elle le dessus ?
      let localWins = false;
      if (pending[key]) {
        const bh = profBase[cfg.col];
        if (bh === undefined) {
          localWins = serverEmpty && !localEmpty;   // base inconnue : on ne remplace jamais une valeur du serveur
        } else {
          const lChanged = lh !== bh;
          const sChanged = sh !== bh;
          if (lChanged && !sChanged) localWins = true;
          else if (lChanged && sChanged) localWins = late || !profile || !profile.updated_at || pending[key] >= Date.parse(profile.updated_at);
        }
      }
      if (localWins) { profBase[cfg.col] = sh; return; }   // l'envoi partira avec le reste de la file

      if (late) { reload = true; return; }                  // copie locale et base inchangées
      if (writeLocal(key, serverEmpty ? null : (cfg.json ? JSON.stringify(serverVal) : serverVal))) {
        changed = true;
        profBase[cfg.col] = sh;
      }
    });

    saveBase();
    return { changed, reload };
  }

  /* ---------- Écriture (appareil -> serveur) ---------- */

  async function pushList(key) {
    const cfg = LISTS[key];
    const b = base[key] || (base[key] = new Map());
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
      const h = hashOf(item);
      const prev = b.get(id);
      if (prev && prev.h === h) return; // déjà à jour sur le serveur
      // Éléments sans date : on garde l'ordre d'insertion grâce à un horodatage croissant, conservé ensuite
      const occurredAt = occurredOf(item, id) || (prev && prev.o) || new Date(Date.now() + order++).toISOString();
      // deleted_at: null : une ligne encore marquée par l'ancienne suppression douce redevient visible
      rows.push({ user_id: userId, id, occurred_at: occurredAt, data: item, deleted_at: null });
      marks.push([id, { h, o: occurredAt }]);
    });

    for (let i = 0; i < rows.length; i += UPSERT_CHUNK) {
      const { error } = await sb.from(cfg.table).upsert(rows.slice(i, i + UPSERT_CHUNK), { onConflict: 'user_id,id' });
      if (error) throw error;
      marks.slice(i, i + UPSERT_CHUNK).forEach(([id, m]) => b.set(id, m));
    }

    // Éléments retirés de la liste : la ligne est effacée du serveur.
    // Seuls les éléments connus de cet appareil (la base) sont concernés : un élément arrivé d'un autre appareil
    // et pas encore affiché ici n'est jamais supprimé.
    const gone = Array.from(b.keys()).filter((id) => !seen.has(id));
    for (let i = 0; i < gone.length; i += DELETE_CHUNK) {
      const part = gone.slice(i, i + DELETE_CHUNK);
      const { error } = await sb.from(cfg.table)
        .delete()
        .eq('user_id', userId)
        .in('id', part);
      if (error) throw error;
      part.forEach((id) => b.delete(id));
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
      const h = hashOf(value);
      if (h === profBase[cfg.col]) return;
      row[cfg.col] = value;
      marks.push([cfg.col, h]);
    });
    if (!marks.length) return;
    const { error } = await sb.from('profiles').upsert(row, { onConflict: 'user_id' });
    if (error) throw error;
    marks.forEach(([col, h]) => { profBase[col] = h; });
  }

  // Nouvel essai automatique : l'envoi si les données du serveur sont lues, sinon leur lecture (qui envoie ensuite).
  // Après un retour du réseau, supabase-js peut refuser le renouvellement de la session pendant une minute
  // environ : le premier essai échoue alors et les suivants réussissent.
  function scheduleRetry() {
    clearTimeout(retryTimer);
    retryTimer = null;
    if (!isOnline()) return;   // sans réseau, l'envoi reprend à l'événement 'online'
    retryTimer = setTimeout(() => { retryTimer = null; if (ready) flush(); else resume(); }, retryDelay);
    retryDelay = Math.min(retryDelay * 2, RETRY_MAX_MS);
  }

  async function sendPending() {
    if (!ready || !userId) return;
    const snapshot = pendingKeys().map((k) => [k, pending[k]]);
    if (!snapshot.length) { emit(); return; }

    syncing = true;
    emit('syncing');
    let failed = false;
    const profileKeys = [];
    for (const [key, ts] of snapshot) {
      if (!LISTS[key]) { profileKeys.push([key, ts]); continue; }
      try {
        await pushList(key);
        if (pending[key] === ts) delete pending[key];   // une écriture arrivée pendant l'envoi garde la clé en attente
      } catch (e) { failed = true; console.warn('Données : envoi impossible (' + key + ')', e); }
    }
    if (profileKeys.length) {
      try {
        await pushProfile(profileKeys.map((p) => p[0]));
        profileKeys.forEach(([k, ts]) => { if (pending[k] === ts) delete pending[k]; });
      } catch (e) { failed = true; console.warn('Données : envoi impossible (profil)', e); }
    }
    syncing = false;
    savePending();
    saveBase();
    if (failed) {
      scheduleRetry();
      emit('error');
    } else {
      retryDelay = RETRY_MIN_MS;
      emit();
    }
  }

  // Envoie tout de suite ce qui est en attente. La promesse se termine quand l'envoi est fini.
  function flush() {
    clearTimeout(sendTimer);
    sendTimer = null;
    chain = chain.then(sendPending).catch((e) => { syncing = false; console.warn('Données : envoi', e); });
    return chain;
  }

  // Appelé par appSafeSetItem (commun.js) après chaque écriture dans le localStorage.
  // La clé est notée en attente même sans réseau ou avant la lecture du serveur : elle sera envoyée plus tard.
  function onWrite(key) {
    if (!userId || !isKnownKey(key)) return;
    pending[key] = Date.now();
    savePending();
    emit(syncing ? 'syncing' : 'pending');
    if (!ready || !isOnline()) return;
    clearTimeout(sendTimer);
    sendTimer = setTimeout(flush, SEND_DELAY_MS);
  }

  /* ---------- Démarrage ---------- */

  // À appeler quand un compte est connecté (connexion, inscription, lien e-mail). Renvoie une promesse :
  // true si la copie locale a été remplacée, la page doit alors être rechargée.
  // opts.late : les données du serveur arrivent en cours d'utilisation (copie locale non remplacée, voir l'en-tête).
  // opts.lateAfterMs : idem si la réponse arrive plus de N ms après le chargement de la page.
  function start(uid, opts) {
    opts = opts || {};
    if (!sb || !uid) return Promise.resolve(false);
    if (userId === uid && startPromise) return startPromise;
    userId = uid;
    ready = false;
    startPromise = (async () => {
      let changed = adoptAccount(uid);
      loadState(uid);
      try {
        const isLate = () => opts.late === true || (opts.lateAfterMs > 0 && performance.now() > opts.lateAfterMs);
        const res = await pull(isLate);
        changed = res.changed || changed;
        needsReload = res.reload;
        ready = true;
        announceAccount();
        // Modifications faites hors ligne : envoyées avant un éventuel rechargement de la page
        if (pendingKeys().length) {
          await Promise.race([flush(), new Promise((r) => setTimeout(r, FLUSH_WAIT_MS))]);
        }
        emit();
      } catch (e) {
        console.warn('Données : lecture du serveur impossible', e);
        startPromise = null;
        scheduleRetry();
        emit(pendingKeys().length ? 'pending' : 'idle');
      }
      return changed;
    })();
    return startPromise;
  }

  // Rechargement unique : évite toute boucle si la copie locale ne se stabilise pas
  function reloadOnce() {
    try {
      const last = Number(sessionStorage.getItem('golfevolution_sync_reload')) || 0;
      if (Date.now() - last < 15000) return;
      sessionStorage.setItem('golfevolution_sync_reload', String(Date.now()));
    } catch (e) {}
    location.reload();
  }

  /* ---------- Suppression du compte (programmée, 30 jours pour changer d'avis) ---------- */

  const purgeDate = (requestedAt) => new Date(Date.parse(requestedAt) + DELETION_DELAY_DAYS * 86400000).toISOString();

  // Prévient auth.js de l'état de la suppression du compte (à chaque lecture du profil et après chaque changement)
  function announceAccount() {
    const detail = { deletionRequestedAt: deletionAt, purgeAt: deletionAt ? purgeDate(deletionAt) : null };
    try { window.dispatchEvent(new CustomEvent('appdata:account', { detail })); } catch (e) {}
  }

  // Programme la suppression du compte : le serveur garde tout pendant DELETION_DELAY_DAYS jours, puis supprime
  // le compte et ses données. Demande du réseau. Renvoie la date de suppression définitive (ISO).
  // L'appelant (menu.js) déconnecte ensuite l'appareil et vide la copie locale.
  async function requestDeletion() {
    if (!sb || !userId) throw new Error('Aucun compte connecté');
    // Ce qui n'est pas encore envoyé part d'abord : l'annulation de la suppression doit tout retrouver
    await Promise.race([flush(), new Promise((r) => setTimeout(r, FLUSH_WAIT_MS))]);
    if (pendingKeys().length) throw new Error('Des données ne sont pas encore envoyées');
    const at = new Date().toISOString();
    const { error } = await sb.from('profiles').upsert({ user_id: userId, deletion_requested_at: at }, { onConflict: 'user_id' });
    if (error) throw error;
    deletionAt = at;
    return purgeDate(at);
  }

  // Annule la suppression programmée : le compte et toutes les données sont conservés
  async function cancelDeletion() {
    if (!sb || !userId) throw new Error('Aucun compte connecté');
    const { error } = await sb.from('profiles').upsert({ user_id: userId, deletion_requested_at: null }, { onConflict: 'user_id' });
    if (error) throw error;
    deletionAt = null;
    announceAccount();
  }

  window.appData = {
    start, flush, onWrite, clearLocal, requestDeletion, cancelDeletion, status,
    isReady: () => ready,
    hasPending: () => pendingKeys().length > 0,
    deletionRequestedAt: () => deletionAt,
  };

  /* ---------- Au chargement ---------- */

  function resume() {
    const uid = userId || storedUserId();
    if (!uid || !sb || !isOnline()) return;
    if (!ready) start(uid, { late: true });   // démarrage hors ligne : on est déjà en train d'utiliser l'appli
    else if (pendingKeys().length) flush();
  }

  const initialUid = storedUserId();
  if (initialUid && sb) {
    // Avant que les modules ne lisent leurs données : si la copie locale est celle d'un autre compte, on la vide
    adoptAccount(initialUid);
    // Hors ligne, la lecture échoue : l'appli démarre sur la copie locale et les écritures sont mises en attente
    start(initialUid, { lateAfterMs: 4000 }).then((changed) => { if (changed) reloadOnce(); });
  }

  window.addEventListener('online', resume);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush(); else resume();
  });
  window.addEventListener('pagehide', flush);
})();
