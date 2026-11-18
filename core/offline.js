/* ============================================================
   HORS LIGNE — service worker + indications de connexion
   Chargé après data.js. Trois rôles :
   1) installer sw.js (copie complète de l'appli pour l'ouvrir et l'utiliser sans réseau) : le téléchargement
      démarre à la première connexion, avec une barre de chargement ;
   2) proposer « Redémarrer » quand une nouvelle version de l'appli est téléchargée (sans jamais l'imposer) ;
   3) prévenir la personne, sans jamais la gêner, quand la connexion tombe ou revient.

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

  /* ---------- Service worker : installation, progression, mises à jour ---------- */

  const SW_OK = 'serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost');
  const UPDATE_CHECK_MS = 30 * 60 * 1000;   // au plus une vérification de nouvelle version toutes les 30 min (retour dans l'appli)

  const install = { running: false, done: 0, total: 0 };   // première installation en cours : barre de chargement
  let swReg = null;
  let swStarted = false;
  let updateWorker = null;      // nouvelle version téléchargée, en attente de « Redémarrer »
  let restarting = false;       // « Redémarrer » choisi : on recharge quand la nouvelle version prend la main
  let lastUpdateCheck = Date.now();

  // Démarre l'installation (ou la mise à jour) du service worker
  function startServiceWorker() {
    if (swStarted) return;
    swStarted = true;
    navigator.serviceWorker.register('sw.js').then(function (reg) {
      swReg = reg;
      if (reg.waiting && navigator.serviceWorker.controller) offerUpdate(reg.waiting);   // une version attendait déjà
      if (reg.installing) trackWorker(reg.installing);
      reg.addEventListener('updatefound', function () { if (reg.installing) trackWorker(reg.installing); });
      if (reg.active) askTopUp();
    }, function (e) { swStarted = false; console.warn('Hors ligne : service worker non enregistré', e); });
  }

  // Suit un service worker en cours d'installation
  function trackWorker(worker) {
    worker.addEventListener('statechange', function () {
      // Une version est déjà en service : la nouvelle est téléchargée et attend (aucun mélange de fichiers)
      if (worker.state === 'installed' && navigator.serviceWorker.controller) offerUpdate(worker);
      // Installation abandonnée (réseau coupé...) : elle reprendra à la prochaine ouverture avec du réseau
      if (worker.state === 'redundant' && install.running) installFailed();
    });
  }

  // Messages du service worker : progression de la première installation
  function onSwMessage(e) {
    const m = e.data || {};
    if (m.update) return;                    // mise à jour : téléchargement silencieux, « Redémarrer » est proposé à la fin
    if (m.type === 'sw-progress') {
      install.running = true;
      install.done = m.done;
      install.total = m.total;
      renderInstall();
    } else if (m.type === 'sw-done') {
      install.running = false;
      renderInstall();
      showToast('Appli prête : elle s\'ouvre maintenant même sans connexion.', 4500);
      if (m.failed) askTopUp();
    }
  }

  function installFailed() {
    install.running = false;
    renderInstall();
    showToast('Le téléchargement pour le mode hors ligne n\'a pas abouti. Il reprendra à la prochaine ouverture avec du réseau.', 8000);
  }

  // Demande au service worker de rattraper en silence les fichiers qui manquent encore (réseau présent)
  function askTopUp() {
    if (!SW_OK || navigator.onLine === false) return;
    const sw = navigator.serviceWorker.controller || (swReg && swReg.active);
    if (sw && sw.postMessage) sw.postMessage({ type: 'top-up' });
  }

  function checkForUpdate() {
    if (!swReg || navigator.onLine === false || Date.now() - lastUpdateCheck < UPDATE_CHECK_MS) return;
    lastUpdateCheck = Date.now();
    swReg.update().catch(function () { /* réseau instable : on réessaiera plus tard */ });
  }

  if (SW_OK) {
    navigator.serviceWorker.addEventListener('message', onSwMessage);
    if (navigator.serviceWorker.startMessages) navigator.serviceWorker.startMessages();
    // « Redémarrer » : la page ne se recharge que sur ce choix (jamais à la première installation)
    navigator.serviceWorker.addEventListener('controllerchange', function () { if (restarting) location.reload(); });
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') checkForUpdate(); });

    // Après "load" : l'installation (copie des fichiers) ne ralentit pas l'affichage de l'appli
    window.addEventListener('load', function () {
      navigator.serviceWorker.getRegistration().then(function (reg) {
        const sb = window.appSupabase;
        // Déjà installé (mise à jour) ou service de connexion absent : on démarre tout de suite.
        // Sinon le téléchargement complet attend la première connexion (après la création du compte).
        if (reg || !sb || !sb.auth) startServiceWorker();
        else sb.auth.onAuthStateChange(function (event, session) { if (session) setTimeout(startServiceWorker, 0); });
      }).catch(function () { startServiceWorker(); });
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
    'font:600 13px/1 system-ui,-apple-system,sans-serif;color:#10200f;background:#9bd35a}' +
    '.app-net_install{position:fixed;left:16px;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:9999;' +
    'display:none;flex-direction:column;gap:8px;padding:12px 14px;border-radius:14px;pointer-events:none;' +
    'font:500 14px/1.35 system-ui,-apple-system,sans-serif;color:#f3f1e6;background:rgba(28,34,28,.96);' +
    'border:1px solid rgba(255,255,255,.16);box-shadow:0 8px 24px rgba(0,0,0,.45)}' +
    '.app-net_install.is-visible{display:flex}' +
    '.app-net_install-row{display:flex;justify-content:space-between;gap:12px}' +
    '.app-net_install-pct{font-weight:600;font-variant-numeric:tabular-nums}' +
    '.app-net_install-track{height:6px;border-radius:999px;background:rgba(255,255,255,.16);overflow:hidden}' +
    '.app-net_install-fill{height:100%;width:0;border-radius:999px;background:#9bd35a;transition:width .25s ease}' +
    'html.app-net-installing .app-net_toast{bottom:calc(92px + env(safe-area-inset-bottom,0px))}';
  document.head.appendChild(css);

  const pill = document.createElement('div');
  pill.className = 'app-net_pill';
  pill.setAttribute('role', 'status');
  pill.setAttribute('aria-live', 'polite');

  const toast = document.createElement('div');
  toast.className = 'app-net_toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  // Barre de chargement de la première installation (ne capte aucun appui : l'appli reste utilisable)
  const installCard = document.createElement('div');
  installCard.className = 'app-net_install';
  installCard.setAttribute('role', 'status');
  installCard.setAttribute('aria-live', 'polite');
  installCard.innerHTML =
    '<div class="app-net_install-row"><span>Préparation du mode hors ligne…</span><span class="app-net_install-pct"></span></div>' +
    '<div class="app-net_install-track"><div class="app-net_install-fill"></div></div>';
  const installPct = installCard.querySelector('.app-net_install-pct');
  const installFill = installCard.querySelector('.app-net_install-fill');

  function renderInstall() {
    const pct = install.total ? Math.min(100, Math.round((install.done / install.total) * 100)) : 0;
    installPct.textContent = pct + ' %';
    installFill.style.width = pct + '%';
    installCard.classList.toggle('is-visible', install.running);
    document.documentElement.classList.toggle('app-net-installing', install.running);
  }

  const homeActive = function () {
    const home = document.getElementById('page-home');
    return !!home && home.classList.contains('active');
  };

  function mount() {
    document.body.appendChild(pill);
    document.body.appendChild(installCard);
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
        if (isHome) { reloadAwayShown = false; offerReload(); if (updateWorker) offerUpdate(updateWorker); }
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

  // Nouvelle version prête : message au choix de la personne (10 s hors accueil ; il revient en retournant à l'accueil)
  function offerUpdate(worker) {
    updateWorker = worker;
    reloadShown = true;   // choix affiché : les autres messages ne le remplacent pas (voir showToast)
    showToast('Mise à jour disponible. Tes saisies sont déjà enregistrées.', homeActive() ? 0 : 10000, {
      label: 'Redémarrer',
      onClick: restartApp,
    });
  }

  function restartApp() {
    hideToast();
    restarting = true;
    // On envoie d'abord ce qui reste à envoyer, puis la nouvelle version prend la main et la page se recharge
    const done = window.appData ? window.appData.flush() : Promise.resolve();
    Promise.race([done, new Promise(function (r) { setTimeout(r, 4000); })]).then(function () {
      if (updateWorker && updateWorker.state === 'installed') updateWorker.postMessage({ type: 'skip-waiting' });
      else location.reload();
      setTimeout(function () { location.reload(); }, 3000);   // sécurité : si le changement de version tarde
    });
  }

  function offerReload() {
    if (reloadDismissed || !data.reload || reloadShown || updateWorker) return;   // « Redémarrer » recharge aussi les données
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
    askTopUp();
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
