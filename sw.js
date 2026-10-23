/* ============================================================
   SERVICE WORKER — permet d'ouvrir et d'utiliser l'appli sans réseau.

   Il ne garde que les fichiers de l'appli (même origine). Les appels à Supabase et à l'API
   FlyAway ne passent jamais par lui : la synchronisation des données est faite par core/data.js.

   Stratégies :
   - Page (index.html) : réseau d'abord, copie gardée si le réseau est absent ou trop lent (4 s).
   - CSS et JS de l'appli : copie gardée tout de suite, rafraîchie en arrière-plan. Un fichier modifié
     dont le ?v= n'a pas été incrémenté est donc corrigé au lancement suivant (et non bloqué à jamais).
   - Images, polices, vendor : copie gardée d'abord (ils ne changent presque jamais).

   Mise en ligne : pour forcer le rechargement complet des fichiers gardés, ou après l'ajout d'une
   image dans images/, incrémenter VERSION et compléter IMAGES.
   ============================================================ */
'use strict';

const VERSION = 'golf-v1';
const CACHE = VERSION;
const NAV_TIMEOUT_MS = 4000;

// Chemins relatifs au dossier du service worker (la racine du site)
const IMAGES = [
  'images/FondBoutonExercices.webp', 'images/FondBoutonHistorique.webp', 'images/FondBoutonProgrammes.webp',
  'images/FondBoutonProgression.webp', 'images/FondEcranBoutonDenivele.webp', 'images/FondEcranBoutonDistance.webp',
  'images/FondEcranBoutonVent.webp', 'images/FondEcranHomePageMatin.webp', 'images/FondEcranHomePageMidi.webp',
  'images/FondEcranHomePageNuit.webp', 'images/FondEcranHomePageSoir.webp', 'images/FondFairwaySaisieRapide.webp',
  'images/FondGreenRond.webp', 'images/FondGymHeader.webp', 'images/GreenPuttDG.webp', 'images/GreenPuttGD.webp',
  'images/GreenPuttM.webp', 'images/GreenPuttMDG.webp', 'images/GreenPuttMGD.webp', 'images/GreenPuttP.webp',
  'images/GreenPuttPDG.webp', 'images/GreenPuttPGD.webp', 'images/ProgrammeEndurance.webp',
  'images/ProgrammeForce-1.webp', 'images/ProgrammeHypertrophie.webp', 'images/ProgrammeVitesse.webp',
  'images/icon.png', 'images/popupareprendre.webp',
];

const ROOT = new URL('./', self.registration.scope).href;

/* ---------- Installation : copie de la page et de tous les fichiers qu'elle charge ---------- */

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

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);

    // 1) La page : indispensable (si elle échoue, le service worker n'est pas installé et sera réessayé)
    const page = await fetch(ROOT, { cache: 'reload' });
    if (!page.ok) throw new Error('Page indisponible : ' + page.status);
    const html = await page.clone().text();
    await cache.put(ROOT, page);

    // 2) CSS, JS, manifeste, vendor : indispensables aussi
    await Promise.all(assetsOf(html).map((u) => cache.add(u)));

    // 3) Images : au mieux (une image manquante ne bloque pas l'installation)
    await Promise.allSettled(IMAGES.map((p) => cache.add(new URL(p, ROOT).href)));

    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((n) => n !== CACHE).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

/* ---------- Requêtes ---------- */

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;          // Supabase, FlyAway : jamais interceptés
  if (url.pathname === new URL('sw.js', ROOT).pathname) return;

  if (req.mode === 'navigate') {
    event.respondWith(fromNetworkFirst(event));
  } else if (/\.(?:css|js)$/i.test(url.pathname) && !/\/vendor\//.test(url.pathname)) {
    event.respondWith(fromCacheThenUpdate(event));
  } else {
    event.respondWith(fromCacheFirst(event));
  }
});

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

const cacheable = (res) => res && res.ok && res.type === 'basic' && !res.redirected;

// Page : réseau d'abord ; si le réseau est absent ou lent, la copie gardée (la page est la même quelle que soit l'adresse)
async function fromNetworkFirst(event) {
  const cache = await caches.open(CACHE);
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
    return new Response('Hors ligne : ouvrez l\'appli une première fois avec du réseau.', {
      status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

// CSS et JS de l'appli : copie gardée tout de suite, rafraîchie en arrière-plan
async function fromCacheThenUpdate(event) {
  const cache = await caches.open(CACHE);
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
  const cache = await caches.open(CACHE);
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
