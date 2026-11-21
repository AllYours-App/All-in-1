/* ============================================================
   SERVICE WORKER — permet d'ouvrir et d'utiliser l'appli sans réseau.

   Il ne garde que les fichiers de l'appli (même origine). Les appels à Supabase, à l'API
   FlyAway et à Photon ne passent jamais par lui : la synchronisation des données est faite par core/data.js.

   Deux copies gardées sur l'appareil :
   - CACHE_APP (nom lié à VERSION) : la page, les CSS et les JS de l'appli, le manifeste ;
   - CACHE_STATIC (nom lié à STATIC_REV) : images/, fonts/, vendor/. Ces fichiers changent presque jamais :
     une nouvelle version de l'appli ne les retélécharge pas (économie de données mobiles).

   Installation (première ouverture après la connexion, puis à chaque nouvelle VERSION) :
   tout est téléchargé AVANT l'activation, et la progression est envoyée à la page (messages
   'sw-progress' et 'sw-done', affichés par core/offline.js).
   - Première installation : activation immédiate.
   - Mise à jour : la nouvelle version attend (l'ancienne continue de servir l'appli, sans mélange de fichiers).
     La page propose « Redémarrer » (message 'skip-waiting') ; sinon elle s'active à la fermeture de l'appli.
   Une installation interrompue (réseau coupé) échoue en bloc et sera réessayée ; les images ou polices
   qui manquent encore sont rattrapées en arrière-plan (message 'top-up', envoyé par la page quand le réseau est là).

   Stratégies de lecture :
   - Page (index.html) : réseau d'abord, copie gardée si le réseau est absent ou trop lent (4 s).
   - CSS et JS de l'appli : copie gardée tout de suite, rafraîchie en arrière-plan. Un fichier modifié
     dont le ?v= n'a pas été incrémenté est donc corrigé au lancement suivant (et non bloqué à jamais).
   - Images, polices, vendor : copie gardée d'abord (ils ne changent presque jamais).

   Mise en ligne :
   - À chaque dépôt qui modifie des fichiers : incrémenter VERSION (c'est ce qui déclenche le téléchargement
     complet chez les utilisateurs et le message « Mise à jour disponible »).
   - Après l'ajout ou le remplacement d'une image, d'une police ou d'un fichier de vendor/ : compléter IMAGES ou FONTS,
     et incrémenter STATIC_REV (sinon la copie déjà gardée est conservée).
   ============================================================ */
'use strict';

const VERSION = 'golfevolution-v9';
const STATIC_REV = 1;
const CACHE_APP = VERSION + '-app';
const CACHE_STATIC = 'golfevolution-static-' + STATIC_REV;
const NAV_TIMEOUT_MS = 4000;
const PARALLEL = 6;               // téléchargements simultanés à l'installation (réseau mobile)

// Chemins relatifs au dossier du service worker (la racine du site)
const IMAGES = [
  'images/FondBoutonExercices.webp', 'images/FondBoutonHistorique.webp', 'images/FondBoutonProgrammes.webp',
  'images/FondBoutonProgression.webp', 'images/FondEcranHomePageMatin.webp', 'images/FondEcranHomePageMidi.webp',
  'images/FondEcranHomePageNuit.webp', 'images/FondEcranHomePageSoir.webp', 'images/FondFairwaySaisieRapide.webp',
  'images/FondGreenRond.webp', 'images/FondGymHeader.webp', 'images/GreenPuttDG.webp', 'images/GreenPuttGD.webp',
  'images/GreenPuttM.webp', 'images/GreenPuttMDG.webp', 'images/GreenPuttMGD.webp', 'images/GreenPuttP.webp',
  'images/GreenPuttPDG.webp', 'images/GreenPuttPGD.webp', 'images/ProgrammeEndurance.webp',
  'images/ProgrammeForce.webp', 'images/ProgrammeHypertrophie.webp', 'images/ProgrammeVitesse.webp',
  'images/icon.png', 'images/popupareprendre.webp',
];
// Polices citées par les @font-face de core/base.css (index.html ne les cite pas)
const FONTS = ['fonts/inter-latin-wght-normal.woff2'];

const ROOT = new URL('./', self.registration.scope).href;

const isStatic = (url) => /\/(?:images|fonts|vendor)\//.test(new URL(url).pathname);
const cacheNameOf = (url) => (isStatic(url) ? CACHE_STATIC : CACHE_APP);

/* ---------- Liste des fichiers à garder ---------- */

// Fichiers cités par index.html (<link href>, <script src>, <img src>), avec leur ?v= exact
function assetsOf(html) {
  const found = new Set(['manifest.webmanifest']);
  const re = /<(?:link|script|img|source)\b[^>]*?\b(?:href|src)="([^"]+)"/gi;
  let m;
  while ((m = re.exec(html))) {
    const raw = m[1];
    if (/^(?:data:|mailto:|javascript:|#)/i.test(raw)) continue;
    const url = new URL(raw, ROOT);
    if (url.origin === self.location.origin) found.add(url.href);
  }
  return Array.from(found).map((u) => new URL(u, ROOT).href);
}

// { url, must } : « must » = indispensable (sinon l'installation échoue) ; les images et polices sont « au mieux »
function precacheList(html) {
  const seen = new Set();
  const list = [];
  const add = (u, must) => {
    const href = new URL(u, ROOT).href;
    if (seen.has(href)) return;
    seen.add(href);
    list.push({ url: href, must });
  };
  assetsOf(html).forEach((u) => add(u, true));
  IMAGES.concat(FONTS).forEach((p) => add(p, false));
  return list;
}

// Garde la réponse sous son ?v= exact et retire les anciennes versions du même fichier
async function keep(cache, req, res) {
  await cache.put(req, res);
  const url = new URL(req.url);
  const keys = await cache.keys();
  await Promise.all(keys.filter((k) => {
    const u = new URL(k.url);
    return u.pathname === url.pathname && u.search !== url.search;
  }).map((k) => cache.delete(k)));
}

// Télécharge un fichier dans le bon cache ; un fichier statique déjà gardé n'est pas retéléchargé
async function fetchInto(url) {
  const cache = await caches.open(cacheNameOf(url));
  if (isStatic(url) && await cache.match(url)) return;
  const res = await fetch(new Request(url, { cache: 'reload' }));
  if (!res.ok || res.type !== 'basic') throw new Error(url + ' : ' + res.status);
  await keep(cache, new Request(url), res);
}

// Exécute fn sur chaque élément, `limit` à la fois
async function pool(items, limit, fn) {
  let next = 0;
  const worker = async () => { while (next < items.length) { const i = next++; await fn(items[i]); } };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
}

// Prévient les pages ouvertes (même celles que ce service worker ne contrôle pas encore)
async function notify(msg) {
  const all = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  all.forEach((c) => c.postMessage(msg));
}

/* ---------- Installation : tout télécharger, puis activer ---------- */

self.addEventListener('install', (event) => { event.waitUntil(install()); });

async function install() {
  const update = !!self.registration.active;        // une version est déjà en service : c'est une mise à jour
  const app = await caches.open(CACHE_APP);

  // 1) La page : indispensable (si elle échoue, le service worker n'est pas installé et sera réessayé)
  const page = await fetch(ROOT, { cache: 'reload' });
  if (!page.ok) throw new Error('Page indisponible : ' + page.status);
  const html = await page.clone().text();
  await app.put(ROOT, page);

  // 2) Tout le reste, quelques fichiers à la fois ; la progression part vers la page à chaque fichier
  const list = precacheList(html);
  const total = list.length + 1;
  let done = 1;
  let failed = 0;
  const progress = () => notify({ type: 'sw-progress', version: VERSION, update, done, total });
  await progress();
  await pool(list, PARALLEL, async (item) => {
    try { await fetchInto(item.url); } catch (e) { if (item.must) throw e; failed++; }
    done++;
    await progress();
  });
  await notify({ type: 'sw-done', version: VERSION, update, failed });

  // Première installation : rien à protéger, on active tout de suite. Mise à jour : on attend le choix (ou la fermeture de l'appli)
  if (!update) await self.skipWaiting();
}

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((n) => n !== CACHE_APP && n !== CACHE_STATIC).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

/* ---------- Messages de la page ---------- */

self.addEventListener('message', (event) => {
  const type = event.data && event.data.type;
  if (type === 'skip-waiting') self.skipWaiting();
  else if (type === 'top-up') event.waitUntil(topUp());
});

// Télécharge en silence ce qui manque encore (installation incomplète, image ajoutée après coup)
async function topUp() {
  try {
    const app = await caches.open(CACHE_APP);
    const page = await app.match(ROOT);
    if (!page) return;
    const missing = [];
    for (const item of precacheList(await page.text())) {
      const cache = await caches.open(cacheNameOf(item.url));
      if (!(await cache.match(item.url))) missing.push(item);
    }
    await pool(missing, 3, (item) => fetchInto(item.url).catch(() => {}));
  } catch (e) { /* hors ligne ou page absente : rien à rattraper maintenant */ }
}

/* ---------- Requêtes ---------- */

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;          // Supabase, FlyAway, Photon : jamais interceptés
  if (url.pathname === new URL('sw.js', ROOT).pathname) return;

  if (req.mode === 'navigate') {
    event.respondWith(fromNetworkFirst(event));
  } else if (/\.(?:css|js)$/i.test(url.pathname) && !isStatic(req.url)) {
    event.respondWith(fromCacheThenUpdate(event));
  } else {
    event.respondWith(fromCacheFirst(event));
  }
});

const cacheable = (res) => res && res.ok && res.type === 'basic' && !res.redirected;

// Page : réseau d'abord ; si le réseau est absent ou lent, la copie gardée (la page est la même quelle que soit l'adresse)
async function fromNetworkFirst(event) {
  const cache = await caches.open(CACHE_APP);
  const network = fetch(event.request).then((res) => {
    if (cacheable(res)) event.waitUntil(cache.put(ROOT, res.clone()));
    return res;
  });
  const timeout = new Promise((resolve) => setTimeout(() => resolve(null), NAV_TIMEOUT_MS));
  try {
    const res = await Promise.race([network, timeout]);
    if (res) return res;
  } catch (e) { /* réseau absent : on passe à la copie gardée */ }

  const cached = await cache.match(ROOT);
  if (cached) {
    network.catch(() => {});                  // si la requête lente aboutit, elle met la copie à jour
    event.waitUntil(network.catch(() => {}));
    return cached;
  }
  try { return await network; } catch (e) {
    return new Response('Hors ligne : ouvre l\'appli une première fois avec du réseau.', {
      status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

// CSS et JS de l'appli : copie gardée tout de suite, rafraîchie en arrière-plan
async function fromCacheThenUpdate(event) {
  const cache = await caches.open(CACHE_APP);
  const cached = await cache.match(event.request);
  const update = fetch(event.request).then(async (res) => {
    if (cacheable(res)) await keep(cache, event.request, res.clone());
    return res;
  });
  if (cached) { event.waitUntil(update.catch(() => {})); return cached; }
  try { return await update; } catch (e) {
    const older = await cache.match(event.request, { ignoreSearch: true });   // mieux vaut une ancienne version que rien
    return older || new Response('', { status: 504, statusText: 'Hors ligne' });
  }
}

// Images, polices, vendor : copie gardée d'abord
async function fromCacheFirst(event) {
  const cache = await caches.open(cacheNameOf(event.request.url));
  const cached = await cache.match(event.request);
  if (cached) return cached;
  try {
    const res = await fetch(event.request);
    if (cacheable(res)) event.waitUntil(keep(cache, event.request, res.clone()));
    return res;
  } catch (e) {
    const older = await cache.match(event.request, { ignoreSearch: true });
    return older || new Response('', { status: 504, statusText: 'Hors ligne' });
  }
}
