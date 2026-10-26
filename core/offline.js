/* ============================================================
   HORS LIGNE — service worker + indications de connexion
   Chargé après data.js. Deux rôles :
   1) enregistrer sw.js (copie de l'appli pour l'ouvrir et l'utiliser sans réseau) ;
   2) prévenir la personne, sans jamais la gêner, quand la connexion tombe ou revient.

   Affichage : un message en bas de l'écran apparaît quelques secondes quand la connexion tombe ou
   revient, sur n'importe quelle page. La pastille « Hors ligne » en haut de l'écran, elle, reste affichée
   SEULEMENT sur la page d'accueil (#page-home) tant que la situation dure ; ailleurs elle est masquée.

   Rien ici ne bloque l'écran : les messages ne captent aucun appui (pointer-events: none), sauf le
   bouton « Actualiser », et la perte de connexion n'impose PAS de redémarrer l'appli. Tout est déjà
   chargé en mémoire et les saisies sont gardées sur l'appareil (voir data.js). Le seul message qui
   propose de relancer la page (« Actualiser ») apparaît quand le serveur a des données plus récentes
   (autre appareil) ; il est toujours au choix de la personne.

   Expose window.appNet = { isOnline() }.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Service worker ---------- */

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    // Après "load" : l'installation (copie des fichiers) ne ralentit pas l'affichage de l'appli
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function (e) { console.warn('Hors ligne : service worker non enregistré', e); });
    });
  }

  /* ---------- Connexion ---------- */

  let online = navigator.onLine !== false;
  let data = { state: 'idle', pending: 0, reload: false };
  let hadWork = false;          // des modifications attendaient d'être envoyées : on confirmera l'envoi
  let reloadDismissed = false;
  let reloadShown = false;      // le message « Actualiser » est affiché : les autres ne le remplacent pas
  let reloadAwayShown = false;  // déjà proposé (10 s) hors de l'accueil : pas de répétition à chaque événement

  window.appNet = { isOnline: function () { return online; } };

  /* ---------- Affichage ---------- */

  const css = document.createElement('style');
  css.textContent =
    '.app-net_pill{position:fixed;top:calc(env(safe-area-inset-top,0px) + 6px);left:50%;transform:translateX(-50%);' +
    'z-index:8000;display:none;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;pointer-events:none;' +
    'font:600 11px/1.3 system-ui,-apple-system,sans-serif;letter-spacing:.02em;color:#f3f1e6;background:rgba(28,34,28,.86);' +
    'border:1px solid rgba(255,255,255,.14);box-shadow:0 2px 8px rgba(0,0,0,.35);white-space:nowrap}' +
    '.app-net_pill.is-visible{display:inline-flex}' +
    '.app-net_pill::before{content:"";width:7px;height:7px;border-radius:50%;background:#e0a23b}' +
    '.app-net_pill.is-syncing::before{background:#6fb3ff}' +
    '.app-net_toast{position:fixed;left:16px;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:10000;' +
    'display:none;align-items:center;justify-content:center;gap:12px;padding:12px 14px;border-radius:14px;pointer-events:none;' +
    'font:500 14px/1.35 system-ui,-apple-system,sans-serif;text-align:center;color:#f3f1e6;background:rgba(28,34,28,.96);' +
    'border:1px solid rgba(255,255,255,.16);box-shadow:0 8px 24px rgba(0,0,0,.45)}' +
    '.app-net_toast.is-visible{display:flex}' +
    '.app-net_toast button{pointer-events:auto;flex:none;padding:7px 14px;border-radius:999px;border:0;cursor:pointer;' +
    'font:600 13px/1 system-ui,-apple-system,sans-serif;color:#10200f;background:#9bd35a}';
  document.head.appendChild(css);

  const pill = document.createElement('div');
  pill.className = 'app-net_pill';
  pill.setAttribute('role', 'status');
  pill.setAttribute('aria-live', 'polite');

  const toast = document.createElement('div');
  toast.className = 'app-net_toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  const homeActive = function () {
    const home = document.getElementById('page-home');
    return !!home && home.classList.contains('active');
  };

  function mount() {
    document.body.appendChild(pill);
    document.body.appendChild(toast);
    render();
    // La pastille suit la page affichée (showPage change la classe "active" des pages)
    const home = document.getElementById('page-home');
    if (home && window.MutationObserver) {
      let wasHome = homeActive();
      new MutationObserver(function () {
        const isHome = homeActive();
        if (isHome === wasHome) return;
        wasHome = isHome;
        render();
        if (isHome) { reloadAwayShown = false; offerReload(); }
        else if (reloadShown) hideToast();   // on quitte l'accueil : le choix « Actualiser » est retiré, il reviendra au retour
      }).observe(home, { attributes: true, attributeFilter: ['class'] });
    }
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  let toastTimer = null;
  function showToast(message, ms, action) {
    if (reloadShown && !action) return;   // le choix « Actualiser » reste affiché jusqu'à la décision
    clearTimeout(toastTimer);
    toast.textContent = '';
    const text = document.createElement('span');
    text.textContent = message;
    toast.appendChild(text);
    if (action) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = action.label;
      btn.addEventListener('click', action.onClick);
      toast.appendChild(btn);
    }
    toast.classList.add('is-visible');
    if (ms) toastTimer = setTimeout(hideToast, ms);
  }
  function hideToast() {
    clearTimeout(toastTimer);
    reloadShown = false;
    toast.classList.remove('is-visible');
  }

  // Pastille d'état en haut de l'écran : visible seulement sur la page d'accueil, et seulement quand quelque chose est à signaler
  function render() {
    if (!pill.parentNode) return;
    let label = '';
    let syncing = false;
    if (!online) label = data.pending ? 'Hors ligne · à envoyer' : 'Hors ligne';
    else if (data.state === 'syncing') { label = 'Synchronisation…'; syncing = true; }
    else if (data.state === 'error') label = 'Envoi en attente';
    pill.textContent = label;
    pill.classList.toggle('is-visible', !!label && homeActive());
    pill.classList.toggle('is-syncing', syncing);
  }

  function offerReload() {
    if (reloadDismissed || !data.reload || reloadShown) return;
    if (!homeActive()) { if (reloadAwayShown) return; reloadAwayShown = true; }
    reloadShown = true;
    // Sur l'accueil le choix reste affiché ; ailleurs il disparaît au bout de quelques secondes (il revient en retournant à l'accueil)
    showToast('Des données plus récentes sont disponibles. Tes saisies sont déjà enregistrées.', homeActive() ? 0 : 10000, {
      label: 'Actualiser',
      onClick: function () {
        reloadDismissed = true;
        hideToast();
        // On envoie d'abord ce qui reste à envoyer, puis on recharge
        const done = window.appData ? window.appData.flush() : Promise.resolve();
        Promise.race([done, new Promise(function (r) { setTimeout(r, 4000); })]).then(function () { location.reload(); });
      },
    });
  }

  /* ---------- Événements ---------- */

  window.addEventListener('offline', function () {
    online = false;
    render();
    showToast('Hors ligne. Continue normalement : tes saisies sont gardées sur l\'appareil et seront envoyées au retour du réseau.', 7000);
  });

  window.addEventListener('online', function () {
    online = true;
    render();
    if (hadWork || data.pending) showToast('Connexion rétablie, envoi des données…', 3000);
    else showToast('Connexion rétablie.', 2500);
  });

  window.addEventListener('appdata:status', function (e) {
    const prev = data;
    data = e.detail || data;
    if (data.pending) hadWork = true;
    render();

    if (data.state === 'idle' && hadWork && online && !data.pending) {
      hadWork = false;
      if (prev.state === 'syncing') showToast('Données synchronisées.', 2500);
    }
    if (data.reload) offerReload();
  });

  // data.js a pu publier son état avant que ce fichier n'écoute (lecture du serveur au chargement)
  if (window.appData && window.appData.status) {
    const s = window.appData.status();
    data = { state: s.reload ? 'reload' : (s.pending ? 'pending' : 'idle'), pending: s.pending, reload: s.reload };
    if (s.pending) hadWork = true;
    window.addEventListener('load', function () { render(); offerReload(); });
  }

  // Démarrage hors ligne : prévenir une fois
  if (!online) {
    window.addEventListener('load', function () {
      showToast('Mode hors ligne. Tes saisies sont gardées sur l\'appareil et seront envoyées au retour du réseau.', 6000);
    });
  }
})();
