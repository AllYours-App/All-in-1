/* ==========================================================================
   WEDGING — Application complète en un seul fichier JS (SPA, vanilla JS)
   Fusion : coquille (routage, thème) + fonctionnalités portées de l'ancienne
   version fonctionnelle (wedge_2.js + extraits de shared-core_3.js pour le SG).
   Sections :
   1. Constantes partagées
   2. WedgeStorage (localStorage)
   3. WedgeAnalytics (Strokes Gained, niceScale, radar SVG générique)
   4. WedgeUI (icônes, toast, layout, popup générique, roues de zones)
   5. État global "Wedge" + toutes les fonctions d'interaction (Parcours + Créatif)
   6. Vues (une fonction render par écran)
   7. Routeur (navigation par hash, sans rechargement de page)
   ========================================================================== */

/* ============================ 1. CONSTANTES ================================ */

// Cases de distance à faire (Journal Parcours), par paliers de 5m de 30m à 110m.
// Limites d'un coup de wedge : 30 m (comprise) à 110 m (comprise). En dessous de 30 m, c'est un coup autour du green
// (APP. dans Stats). Les paliers couvrent 5 m (30-34m ... 100-104m), sauf le dernier qui prend aussi la limite haute : 105-110m.
// stats.js lit ces deux valeurs pour classer ses coups "wedging" : on ne les modifie qu'ici.
const WEDGE_MIN_DISTANCE = 30;
const WEDGE_MAX_DISTANCE = 110;
const WEDGE_BUCKETS = (() => { const arr = []; for (let d = WEDGE_MIN_DISTANCE; d < WEDGE_MAX_DISTANCE; d += 5) arr.push(d); return arr; })();
// Ordre des 8 directions périphériques (hors centre), dans le sens horaire en partant du haut
const WEDGE_RADAR_ORDER = ['Long', 'Long-Droite', 'Droite', 'Court-Droite', 'Court', 'Court-Gauche', 'Gauche', 'Long-Gauche'];
// 9 zones sélectionnables au total : les 8 directions + le centre ("Green" = coup rentré)
const WEDGE_ZONES = [...WEDGE_RADAR_ORDER, 'Green'];
// Distances proposées pour construire un exercice Créatif (paliers de 5m, de WEDGE_MIN_DISTANCE à WEDGE_MAX_DISTANCE compris)
const WEDGE_EXERCISE_DISTANCES = (() => { const arr = []; for (let d = WEDGE_MIN_DISTANCE; d <= WEDGE_MAX_DISTANCE; d += 5) arr.push(d); return arr; })();
const WEDGE_SHOTS_LIMIT_OPTIONS = [[20, '20'], [50, '50'], [100, '100'], ['all', 'Tous']];
const WEDGE_EX_REVIEW_LIMIT_OPTIONS = [10, 20, 50, 'all'];

/* Unité de distance : celle de Menu > Unité utilisée (m ou yd), relue à chaque affichage.
   Les données restent enregistrées en MÈTRES (coups, distances et rayons des exercices) :
   seuls l'affichage et la saisie changent d'unité, rien n'est converti dans le stockage. */
const WEDGE_M_TO_YD = 1.09361;
function wedgeUnit() { const md = window.MenuData; return md && md.settings ? md.distanceUnit : 'm'; } // "m" ou "yd"
function wedgeIsYd() { return wedgeUnit() === 'yd'; }
// mètres -> valeur affichée : yards arrondis à l'entier, mètres inchangés
function wedgeToDisplay(m) { const n = Number(m); return isFinite(n) ? (wedgeIsYd() ? Math.round(n * WEDGE_M_TO_YD) : Math.round(n * 10) / 10) : m; }
// idem pour les moyennes et résultats libres : mètres inchangés, yards à 0,1 près
function wedgeToDisplayAvg(m) { const n = Number(m); return isFinite(n) ? (wedgeIsYd() ? Math.round(n * WEDGE_M_TO_YD * 10) / 10 : n) : m; }
// une décimale dans les deux unités (jauges et dispersion)
function wedgeToDisplay1(m) { const n = Number(m); return isFinite(n) ? Math.round(n * (wedgeIsYd() ? WEDGE_M_TO_YD : 1) * 10) / 10 : m; }
// valeur saisie dans l'unité affichée -> mètres enregistrés
function wedgeFromInput(v) { const n = Number(v); return isFinite(n) ? (wedgeIsYd() ? Math.round(n / WEDGE_M_TO_YD * 100) / 100 : n) : v; }
function wedgeFmt(m) { return `${wedgeToDisplay(m)}${wedgeUnit()}`; }          // "30m" / "33yd"
function wedgeFmtSp(m) { return `${wedgeToDisplay(m)} ${wedgeUnit()}`; }       // "30 m" / "33 yd"
function wedgeFmtAvg(m) { return `${wedgeToDisplayAvg(m)}${wedgeUnit()}`; }
function wedgeFmt1(m) { return `${wedgeToDisplay1(m)}${wedgeUnit()}`; }
// Rayon de validation : en mètres enregistrés, ou en % de la distance à faire
function wedgeRadiusText(r, u) { return u === '%' ? `${r}%` : wedgeFmtAvg(r); }

/* Paliers de distance : mêmes limites basse et haute dans les deux unités (55 m = 60 yd, 110 m = 120 yd).
   Un premier bouton « < » regroupe tout ce qui est plus court (un coup à 30 m y entre en mètres comme en yards).
   La clé d'un palier est sa borne basse dans l'unité affichée (0 pour « < »).
   12 boutons, utilisés pour la saisie du Journal comme pour les analyses (Dispersion, Distance, SG) :
   - mètres : <55, 55-59 ... 100-104, 105-110
   - yards : <60, 60-69, 70-74 ... 110-114, 115-120 (12 boutons de 5 ne tiennent pas entre 60 et 120 : 60-69 couvre 10 yd)
   Les coups restent enregistrés en mètres : un bouton enregistre la distance du milieu de sa fourchette (« < » : 50 m). */
const WEDGE_BUCKET_EDGES = {
  m:  [0, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105],
  yd: [0, 60, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115],
};
const WEDGE_LOW_LIMIT = { m: 55, yd: 60 };    // « < 55 m » / « < 60 yd »
const WEDGE_HIGH_LIMIT = { m: 110, yd: 120 }; // 110 m = 120 yd : limite haute, comprise dans le dernier palier
const WEDGE_SHORT_SHOT_M = 50;                // distance enregistrée pour un coup du bouton « < »
function wedgeUnitKey() { return wedgeIsYd() ? 'yd' : 'm'; }
function wedgeBucketList() { return WEDGE_BUCKET_EDGES[wedgeUnitKey()]; }
// Palier (borne basse, unité affichée) d'une distance enregistrée en mètres
function wedgeBucketFor(distanceM) {
  const v = wedgeIsYd() ? Number(distanceM) * WEDGE_M_TO_YD : Number(distanceM);
  let key = 0;
  wedgeBucketList().forEach(e => { if (v + 1e-6 >= e) key = e; });
  return key;
}
// Libellé d'un palier : "<55m", "55-59m" ... "105-110m" (ou "<60yd", "60-69yd" ... "115-120yd")
function wedgeBucketLabel(b) {
  const list = wedgeBucketList();
  if (b === 0) return `<${WEDGE_LOW_LIMIT[wedgeUnitKey()]}${wedgeUnit()}`;
  const next = list[list.indexOf(b) + 1];
  return `${b}-${next === undefined ? WEDGE_HIGH_LIMIT[wedgeUnitKey()] : next - 1}${wedgeUnit()}`;
}
// Libellé du palier d'un coup enregistré
function wedgeShotBucketLabel(w) { return wedgeBucketLabel(wedgeBucketFor(w.distanceToCover)); }
// Distance (en mètres) enregistrée quand on touche le bouton b : le milieu de sa fourchette
function wedgeButtonMeters(b) {
  if (b === 0) return WEDGE_SHORT_SHOT_M;
  const list = wedgeBucketList();
  const next = list[list.indexOf(b) + 1];
  return wedgeFromInput((b + (next === undefined ? WEDGE_HIGH_LIMIT[wedgeUnitKey()] : next)) / 2); // milieu, unité affichée -> mètres
}
// Distances proposées pour construire un exercice (en mètres enregistrés) : 30 à 110 m, ou 40 à 120 yd, par 5
function wedgeExerciseDistanceChoices(selected) {
  const out = [];
  for (let d = wedgeIsYd() ? 40 : 30; d <= WEDGE_HIGH_LIMIT[wedgeUnitKey()]; d += 5) out.push(wedgeFromInput(d)); // distances réelles : 30 à 110 m, 40 à 120 yd
  (selected ? Array.from(selected) : []).forEach(d => { if (!out.includes(d)) out.push(d); }); // distances d'une autre unité déjà cochées
  return out.sort((a, b) => a - b);
}
function wedgeRadarShortLabel(zone) { return zone.split('-').map(w => w[0]).join('-'); }
function wedgeZoneDisplayLabel(zone) { return zone === 'Green' ? 'Trou' : zone; }

/* ============================== 2. STORAGE ================================= */

const WedgeStorage = (function () {
  const KEYS = { SHOTS: "golfevolution_wedging_shots", EXERCISES: "golfevolution_wedging_exercises", IN_PROGRESS: "golfevolution_wedging_in_progress_sessions" };
  function read(key) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : []; }
    catch (e) { console.error("Wedging: lecture impossible", key, e); return []; }
  }
  function write(key, val) {
    // appSafeSetItem (commun.js) prévient la personne si le stockage est plein ou indisponible.
    return appSafeSetItem(key, JSON.stringify(val));
  }
  return {
    getShots: () => read(KEYS.SHOTS),
    writeShots: (arr) => write(KEYS.SHOTS, arr),
    getExercises: () => read(KEYS.EXERCISES),
    writeExercises: (arr) => write(KEYS.EXERCISES, arr),
    getInProgress: () => read(KEYS.IN_PROGRESS),
    writeInProgress: (arr) => write(KEYS.IN_PROGRESS, arr)
  };
})();

/* ============================== 3. ANALYTICS ================================ */

const WedgeAnalytics = (function () {
  /* ---------- Échelle "jolie" pour graphiques (axes Y) ---------- */
  function niceNum(range, round) {
    const exponent = Math.floor(Math.log10(range || 1));
    const fraction = range / Math.pow(10, exponent);
    let niceFraction;
    if (round) { niceFraction = fraction < 1.5 ? 1 : fraction < 3 ? 2 : fraction < 7 ? 5 : 10; }
    else { niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10; }
    return niceFraction * Math.pow(10, exponent);
  }
  function niceScale(min, max, maxTicks = 5) {
    if (min === max) { min -= 1; max += 1; }
    const range = niceNum(max - min, false);
    const step = niceNum(range / (maxTicks - 1), true);
    const niceMin = Math.floor(min / step) * step;
    const niceMax = Math.ceil(max / step) * step;
    const ticks = [];
    for (let v = niceMin; v <= niceMax + 1e-9; v += step) ticks.push(Math.round(v * 100) / 100);
    return { min: niceMin, max: niceMax, step, ticks };
  }

  /* ---------- Moteur Strokes Gained ----------
     Tables et interpolation : sg-data.js / strokes-gained.js (sgExpected, distances en mètres). */
  // Coups attendus depuis un lie ('Rough' ou 'Green') et une distance en mètres ; null si lie ou distance invalide
  function expectedStrokesForLie(lie, distanceMeters) {
    const key = { Rough: 'rough', Green: 'green' }[lie];
    return key ? sgExpected(key, distanceMeters) : null;
  }
  function fmtSG(v) { return (v === null || v === undefined || Number.isNaN(v)) ? '--' : (v >= 0 ? '+' : '') + v.toFixed(2); }
  // SG d'un coup de wedge : coups attendus depuis l'herbe (distance à faire) - coups attendus après
  // (le résultat final traité comme un putt ; 0 si à moins de 5cm, assimilé à un coup rentré) - 1 coup joué.
  function wedgeShotSG(w) {
    const before = expectedStrokesForLie('Rough', w.distanceToCover);
    if (before === null) return null;
    const after = w.finalDistance <= 0.05 ? 0 : expectedStrokesForLie('Green', w.finalDistance);
    if (after === null) return null;
    return before - after - 1;
  }

  /* ---------- Graphique radar générique (toile d'araignée) ---------- */
  function buildRadarChartSvg(items) {
    const n = items.length;
    const validVals = items.filter(it => it.value !== null && it.value !== undefined).map(it => it.value);
    const scaleMax = validVals.length ? Math.max(...validVals) : 1;
    const W = 320, H = 380, cx = W / 2, cy = 190, R = 105;
    const angleFor = i => (Math.PI * 2 * i / n) - Math.PI / 2;
    // le centre = 0m (le trou), pas la valeur min du lot
    const radiusFor = v => {
      if (v === null || v === undefined) return 0;
      if (scaleMax === 0) return 0;
      return R * v / scaleMax;
    };
    const pointsAttr = items.map((it, i) => { const r = radiusFor(it.value), a = angleFor(i); return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`; }).join(' ');
    const dotsHtml = items.map((it, i) => { const r = radiusFor(it.value), a = angleFor(i); return `<circle cx="${cx + r * Math.cos(a)}" cy="${cy + r * Math.sin(a)}" r="5" class="wg-radar-dot"/>`; }).join('');
    const ringsHtml = [0.33, 0.66, 1].map(f => {
      const pts = Array.from({ length: n }, (_, i) => { const a = angleFor(i); return `${cx + R * f * Math.cos(a)},${cy + R * f * Math.sin(a)}`; }).join(' ');
      return `<polygon points="${pts}" class="wg-radar-grid"/>`;
    }).join('');
    const spokesHtml = Array.from({ length: n }, (_, i) => { const a = angleFor(i); return `<line x1="${cx}" y1="${cy}" x2="${cx + R * Math.cos(a)}" y2="${cy + R * Math.sin(a)}" class="wg-radar-axis"/>`; }).join('');
    const labelsHtml = items.map((it, i) => {
      const a = angleFor(i), cos = Math.cos(a);
      const lx = cx + (R + 30) * cos, ly = cy + (R + 30) * Math.sin(a);
      let anchor = 'middle';
      if (cos > 0.35) anchor = 'start'; else if (cos < -0.35) anchor = 'end';
      return `<text x="${lx}" y="${ly - 6}" class="wg-radar-label-num" text-anchor="${anchor}">${it.label}</text>
              <text x="${lx}" y="${ly + 10}" class="wg-radar-label-name" text-anchor="${anchor}">${it.display}</text>`;
    }).join('');
    return `<svg viewBox="0 0 ${W} ${H}" class="wg-radar-svg" style="display:block;width:100%;max-width:400px;height:auto;margin:0 auto;">
      ${ringsHtml}${spokesHtml}
      <polygon points="${pointsAttr}" class="wg-radar-shape"/>
      ${dotsHtml}${labelsHtml}
    </svg>`;
  }

  return { niceScale, wedgeShotSG, fmtSG, buildRadarChartSvg };
})();

/* ================================ 4. WedgeUI ===================================== */

const WedgeUI = (function () {
  const ICONS = {
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V4"/><path d="M4 4h13l-2.5 4L17 12H4"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
    ruler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l14-14 4 4-14 14H3z"/><path d="M14.5 6.5l2 2"/><path d="M11.5 9.5l2 2"/><path d="M8.5 12.5l2 2"/></svg>',
    bar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M12 20V4"/><path d="M20 20v-7"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>',
    duplicate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 20V10M12 20V4M19 20v-7"/></svg>'
  };

  function toast(message) {
    let el = document.querySelector(".wg-toast");
    if (!el) { el = document.createElement("div"); el.className = "wg-toast"; document.body.appendChild(el); }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove("show"), 2200);
  }
  function formatDate(iso) {
    const d = new Date(iso);
    return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();
  }

  function header({ title, backLabel, backHash, rightIcon }) {
    return `<header class="wg-header">
      <div class="wg-header-side"><button class="wg-back-btn" onclick="${backHash === 'app-home' ? "showPage('home')" : "WedgeRouter.go('" + backHash + "')"}">${ICONS.back} ${backLabel}</button></div>
      <h1 class="wg-title" style="${title === "WEDGING" ? "" : "font-size:16px;letter-spacing:2px;"}">${title}</h1>
      <div class="wg-header-side wg-header-right">${rightIcon ? `<button class="wg-icon-btn" id="wedgingMenuBtn" aria-label="Options" aria-haspopup="dialog" onclick="openWedgingMenu()">${rightIcon}</button>` : ""}</div>
    </header>`;
  }
  function topbar(label, backHash, rightIcon) {
    return `<div class="wg-topbar">
      <button class="wg-back-btn" onclick="WedgeRouter.go('${backHash}')">${ICONS.back} ${label}</button>
      <button class="wg-icon-btn" style="${rightIcon ? "" : "visibility:hidden;"}" ${rightIcon ? 'aria-label="Options" aria-haspopup="dialog" onclick="openWedgingMenu()"' : 'tabindex="-1" aria-hidden="true"'}>${rightIcon || ""}</button>
    </div>`;
  }
  function analysisHeader(eyebrow, title, subtitle) {
    return `<div class="wg-analysis-header"><p class="wg-eyebrow">${eyebrow}</p><h1 class="wg-page-title">${title}</h1><p class="wg-page-subtitle">${subtitle}</p></div>`;
  }
  function navCards(active) {
    return `<nav class="wg-nav-cards">
      <div class="wg-nav-card ${active === "parcours" ? "active" : ""}" onclick="WedgeRouter.go('parcours')"><div class="wg-nav-card-head">${ICONS.flag}<span class="wg-nav-card-title">PARCOURS</span></div></div>
      <div class="wg-nav-card ${active === "exercices" ? "active" : ""}" onclick="WedgeRouter.go('exercices')"><div class="wg-nav-card-head">${ICONS.target}<span class="wg-nav-card-title">EXERCICES</span></div></div>
    </nav>`;
  }
  // Barre basse : Toile d'araignée / Jauges / SG — le Journal (Parcours) n'y figure pas,
  // il s'ouvre directement via la carte "PARCOURS" du haut.
  function bottomNav(activeKey) {
    const items = [
      { key: "dispersion", label: "DISPERSION", icon: ICONS.target, route: "dispersion-analysis" },
      { key: "distance", label: "DISTANCE", icon: ICONS.ruler, route: "distance-analysis" },
      { key: "sg", label: "SG", icon: ICONS.bar, route: "sg-analysis" }
    ];
    return `<nav class="wg-bottom-nav">` + items.map(it =>
      `<button class="wg-bottom-nav-item ${it.key === activeKey ? "active" : ""}" onclick="WedgeRouter.go('${it.route}')">${it.icon}<span>${it.label}</span></button>`
    ).join("") + `</nav>`;
  }

  /* ---------- Popup générique (overlay + carte), réutilisée pour tous les sous-menus ---------- */
  function modal(title, bodyHtml, closeFn) {
    return `<div class="wg-modal-overlay" onclick="${closeFn}()">
      <div class="wg-modal" onclick="event.stopPropagation()">
        <div class="wg-modal-head"><h3>${title}</h3><button class="wg-modal-close" onclick="${closeFn}()">${ICONS.close}</button></div>
        ${bodyHtml}
      </div>
    </div>`;
  }
  /* Clavier numérique (distance finale, rayon de validation) : appKeypad() dans commun.js */

  /* ---------- Roue à 9 zones (Journal Parcours) : centre = Green (trou), 8 secteurs = directions ---------- */
  const CIRCLE_ANGLE_OFFSET = -22.5;
  function sectorPath(cx, cy, rInner, rOuter, startDeg, endDeg) {
    const toRad = d => (d - 90) * Math.PI / 180;
    const pt = (r, deg) => `${(cx + r * Math.cos(toRad(deg))).toFixed(2)} ${(cy + r * Math.sin(toRad(deg))).toFixed(2)}`;
    return `M ${pt(rOuter, startDeg)} A ${rOuter} ${rOuter} 0 0 1 ${pt(rOuter, endDeg)} L ${pt(rInner, endDeg)} A ${rInner} ${rInner} 0 0 0 ${pt(rInner, startDeg)} Z`;
  }
  function sectorCentroid(cx, cy, rInner, rOuter, startDeg, endDeg) {
    const rMid = (rInner + rOuter) / 2;
    const rad = ((startDeg + endDeg) / 2 - 90) * Math.PI / 180;
    return [cx + rMid * Math.cos(rad), cy + rMid * Math.sin(rad)];
  }
  function wheelSvg(selectedZone, onClickFnName) {
    const cx = 100, cy = 100, rHole = 42, rOut = 100;
    const sectorsHtml = WEDGE_RADAR_ORDER.map((dir, i) => {
      const startDeg = i * 45 + CIRCLE_ANGLE_OFFSET, endDeg = startDeg + 45;
      const path = sectorPath(cx, cy, rHole, rOut, startDeg, endDeg);
      const [mx, my] = sectorCentroid(cx, cy, rHole, rOut, startDeg, endDeg);
      return `<path d="${path}" class="wg-wheel-sector" onclick="${onClickFnName}('${dir}')"/>
        ${selectedZone === dir ? `<circle cx="${mx.toFixed(2)}" cy="${my.toFixed(2)}" r="7" class="wg-wheel-ball"/>` : ''}`;
    }).join('');
    const poleX = cx - 13, poleTop = cy - 16, poleBottom = cy + 18;
    const flagPoints = `${poleX.toFixed(2)},${poleTop.toFixed(2)} ${(cx + 11).toFixed(2)},${(cy - 9).toFixed(2)} ${poleX.toFixed(2)},${(cy - 2).toFixed(2)}`;
    return `<svg viewBox="0 0 200 200" class="wg-wheel">
      ${sectorsHtml}
      <circle cx="${cx}" cy="${cy}" r="${rHole}" class="wg-wheel-center ${selectedZone === 'Green' ? 'selected' : ''}" onclick="${onClickFnName}('Green')"/>
      <line x1="${poleX.toFixed(2)}" y1="${poleBottom.toFixed(2)}" x2="${poleX.toFixed(2)}" y2="${poleTop.toFixed(2)}" class="wg-wheel-pole"/>
      <polygon points="${flagPoints}" class="wg-wheel-flag"/>
      ${selectedZone === 'Green' ? `<circle cx="${cx}" cy="${cy}" r="7" class="wg-wheel-ball"/>` : ''}
    </svg>`;
  }
  /* ---------- Roue à 2 anneaux (session d'exercice, mode "9 zones") : intérieur = réussite, extérieur = raté ---------- */
  const R_HOLE = 8, R_IN = 55, R_OUT = 100;
  function twoRingWheelSvg(currentResult, onClickFnName) {
    onClickFnName = onClickFnName || 'setWedgeExCircleZone';
    const cx = 100, cy = 100;
    const selDir = currentResult && typeof currentResult === 'object' ? currentResult.direction : null;
    const selRing = currentResult && typeof currentResult === 'object' ? currentResult.ring : null;
    const sectorsHtml = WEDGE_RADAR_ORDER.map((dir, i) => {
      const startDeg = i * 45 + CIRCLE_ANGLE_OFFSET, endDeg = startDeg + 45;
      const innerPath = sectorPath(cx, cy, R_HOLE, R_IN, startDeg, endDeg);
      const outerPath = sectorPath(cx, cy, R_IN, R_OUT, startDeg, endDeg);
      const [ix, iy] = sectorCentroid(cx, cy, R_HOLE, R_IN, startDeg, endDeg);
      const [ox, oy] = sectorCentroid(cx, cy, R_IN, R_OUT, startDeg, endDeg);
      return `<path d="${innerPath}" class="wg-wheel-sector wg-wheel-sector--in" onclick="${onClickFnName}('${dir}','in')"/>
        <path d="${outerPath}" class="wg-wheel-sector wg-wheel-sector--out" onclick="${onClickFnName}('${dir}','out')"/>
        ${selDir === dir && selRing === 'in' ? `<circle cx="${ix.toFixed(2)}" cy="${iy.toFixed(2)}" r="7" class="wg-wheel-ball"/>` : ''}
        ${selDir === dir && selRing === 'out' ? `<circle cx="${ox.toFixed(2)}" cy="${oy.toFixed(2)}" r="7" class="wg-wheel-ball wg-wheel-ball--miss"/>` : ''}`;
    }).join('');
    // Bouton circulaire central : coup rentré directement (pas besoin de direction)
    return `<svg viewBox="0 0 200 200" class="wg-wheel">${sectorsHtml}
      <circle cx="${cx}" cy="${cy}" r="${R_HOLE}" class="wg-wheel-hole" onclick="${onClickFnName}('Green','in')"/>
      ${selDir === 'Green' ? `<circle cx="${cx}" cy="${cy}" r="6" class="wg-wheel-ball"/>` : ''}
    </svg>`;
  }

  return { ICONS, toast, formatDate, header, topbar, analysisHeader, navCards, bottomNav, modal, keypad: appKeypad, wheelSvg, twoRingWheelSvg };
})();

/* ==================== 5. ÉTAT GLOBAL WEDGE + INTERACTIONS ==================== */
/* Reprend fidèlement la logique de l'ancienne version : état mutable en mémoire,
   persisté à chaque modification, et un simple "rerender()" (= re-rendu de la
   route courante) après chaque action, exactement comme l'ancien renderWedgeTab(). */

function rerender() { if (wedgeExSession) saveCurrentSessionAsInProgress(); WedgeRouter.render(); }

// --- Journal (Parcours) ---
let wedgeRounds = normalizeWedgeRounds(WedgeStorage.getShots());
let wedgeNewShotBucket; // borne basse du palier choisi (unité affichée) ; undefined = premier palier, null = aucun
let wedgeNewShotFinal = '';
let wedgeNewShotZone = null;
let wedgeFinalPopupOpen = false;
let wedgeShotsLimit = 'all';
let wedgeHistoryDistanceFilter = new Set();
let wedgeHistoryZoneFilter = new Set();
let wedgeHistoryDistancePopupOpen = false;
let wedgeHistoryZonePopupOpen = false;
let wedgeShotsLimitPopupOpen = false;
let wedgeRadarDistances = new Set();

function persistWedgeRounds() { WedgeStorage.writeShots(wedgeRounds); }

function setWedgeNewShotBucket(b) { wedgeNewShotBucket = b; rerender(); }
function wedgeKeypadPress(digit) { if (wedgeNewShotFinal.length >= 3) return; wedgeNewShotFinal += digit; rerender(); }
function wedgeKeypadBackspace() { wedgeNewShotFinal = wedgeNewShotFinal.slice(0, -1); rerender(); }
function wedgeKeypadClear() { wedgeNewShotFinal = ''; rerender(); }
function setWedgeNewShotZone(z) {
  const wasGreen = wedgeNewShotZone === 'Green';
  wedgeNewShotZone = z;
  if (z === 'Green') wedgeNewShotFinal = '0'; // coup rentré : distance finale = 0, pas de saisie
  else if (wasGreen) wedgeNewShotFinal = ''; // on quitte le centre : redemande une distance
  rerender();
}
function openWedgeFinalPopup() { wedgeFinalPopupOpen = true; rerender(); }
function closeWedgeFinalPopup() { wedgeFinalPopupOpen = false; rerender(); }
function wedgeFinalPopupHtml() {
  return WedgeUI.modal('Distance finale', `
    <div class="app-keypad-value">${wedgeNewShotFinal ? wedgeNewShotFinal : '0'}${wedgeUnit()}</div>
    ${WedgeUI.keypad('wedgeKeypadPress', 'wedgeKeypadBackspace', 'wedgeKeypadClear')}
    <button class="wg-btn-primary mt-8" onclick="closeWedgeFinalPopup()">OK</button>
  `, 'closeWedgeFinalPopup');
}
function addWedgeRound() {
  if (wedgeNewShotBucket === null || wedgeNewShotFinal === '' || !wedgeNewShotZone) return;
  // Le bouton enregistre le milieu de sa fourchette, la distance finale est saisie dans l'unité affichée ; tout est enregistré en mètres
  const shot = { id: Date.now(), date: new Date().toISOString(), distanceToCover: wedgeButtonMeters(wedgeNewShotBucket), zone: wedgeNewShotZone, finalDistance: wedgeFromInput(parseFloat(wedgeNewShotFinal)) };
  wedgeRounds.push(shot);
  wedgeNewShotBucket = null; wedgeNewShotFinal = ''; wedgeNewShotZone = null;
  persistWedgeRounds();
  WedgeUI.toast('Coup ajouté');
  rerender();
}
function deleteWedgeRound(id) { wedgeRounds = wedgeRounds.filter(w => w.id !== id); persistWedgeRounds(); rerender(); }

// Import depuis Stats (saisie détaillée) : reçoit des coups déjà convertis au format du Journal
// { distanceToCover (palier de 5 m), zone, finalDistance, date, statsKey }.
// Passe par la mémoire de ce module (wedgeRounds) : écrire directement dans le localStorage serait
// écrasé au prochain persistWedgeRounds(). statsKey évite d'importer deux fois le même coup.
function importWedgeShotsFromStats(list) {
  if (!Array.isArray(list) || !list.length) return 0;
  const knownKeys = new Set(wedgeRounds.map(w => w.statsKey).filter(Boolean));
  const usedIds = new Set(wedgeRounds.map(w => w.id));
  let nextId = Date.now();
  let added = 0;
  list.forEach(s => {
    if (!s || !s.statsKey || knownKeys.has(s.statsKey)) return;
    // Mêmes contraintes que la saisie manuelle : palier connu, zone connue, distance finale valide
    if (!WEDGE_BUCKETS.includes(s.distanceToCover) || !WEDGE_ZONES.includes(s.zone)) return;
    if (typeof s.finalDistance !== 'number' || !isFinite(s.finalDistance) || s.finalDistance < 0) return;
    while (usedIds.has(nextId)) nextId++;
    usedIds.add(nextId);
    knownKeys.add(s.statsKey);
    wedgeRounds.push({
      id: nextId, date: s.date || new Date().toISOString(),
      distanceToCover: s.distanceToCover, zone: s.zone, finalDistance: s.finalDistance,
      source: 'stats', statsKey: s.statsKey
    });
    added++;
  });
  if (added) {
    persistWedgeRounds();
    if (document.getElementById('wedging-app')) WedgeRouter.render(); // la vue Wedging reste à jour même masquée
  }
  return added;
}
window.importWedgeShotsFromStats = importWedgeShotsFromStats;

// Suppression côté Stats (point 31) : retire les coups importés d'une partie (statsKey = `${idPartie}:trou:coup`).
function removeWedgeShotsFromStats(roundId) {
  if (!roundId) return 0;
  const prefix = roundId + ':';
  const before = wedgeRounds.length;
  wedgeRounds = wedgeRounds.filter(w => !(typeof w.statsKey === 'string' && w.statsKey.startsWith(prefix)));
  const removed = before - wedgeRounds.length;
  if (removed) {
    persistWedgeRounds();
    if (document.getElementById('wedging-app')) WedgeRouter.render(); // la vue Wedging reste à jour même masquée
  }
  return removed;
}
window.removeWedgeShotsFromStats = removeWedgeShotsFromStats;


// Paliers des écrans d'analyse (Dispersion, Distance, SG) : les mêmes 12 paliers que la saisie du Journal
function wedgeAnalysisBuckets() { return wedgeBucketList(); }
function wedgeAnalysisBucketFor(distance) { return wedgeBucketFor(distance); }
function wedgeAnalysisBucketLabel(b) { return wedgeBucketLabel(b); }
// Libellé court (barres et titres) : "60m" pour un palier de 5, sinon la plage ("<55m", "60-69yd", "105-110m")
function wedgeAnalysisShortLabel(b) {
  const list = wedgeBucketList();
  const next = list[list.indexOf(b) + 1];
  return (b !== 0 && next !== undefined && next - b === 5) ? `${b}${wedgeUnit()}` : wedgeBucketLabel(b);
}
function wedgeLimitedRounds() {
  const sorted = wedgeRounds.slice().sort((a, b) => b.id - a.id);
  return wedgeShotsLimit === 'all' ? sorted : sorted.slice(0, wedgeShotsLimit);
}
function openWedgeShotsLimitPopup() { wedgeShotsLimitPopupOpen = true; rerender(); }
function closeWedgeShotsLimitPopup() { wedgeShotsLimitPopupOpen = false; rerender(); }
function chooseWedgeShotsLimit(l) { wedgeShotsLimit = l; wedgeShotsLimitPopupOpen = false; rerender(); }
function wedgeShotsLimitButtonHtml() {
  return `<button class="wg-chip ${wedgeShotsLimit !== 'all' ? 'active' : ''}" onclick="openWedgeShotsLimitPopup()">Nombre de coups</button>`;
}
function wedgeShotsLimitPopupHtml() {
  return WedgeUI.modal('Nombre de coups', `
    <div class="wg-chip-row">${WEDGE_SHOTS_LIMIT_OPTIONS.map(([v, label]) => `<button type="button" class="wg-chip ${wedgeShotsLimit === v ? 'active' : ''}" onclick="chooseWedgeShotsLimit(${typeof v === 'number' ? v : `'${v}'`})">${label}</button>`).join('')}</div>
  `, 'closeWedgeShotsLimitPopup');
}
function wedgeShotsLimitRowHtml() {
  return `<div class="wg-chip-row">${wedgeShotsLimitButtonHtml()}</div>${wedgeShotsLimitPopupOpen ? wedgeShotsLimitPopupHtml() : ''}`;
}
function wedgeShotsWithResult() { return wedgeLimitedRounds().filter(w => w.zone); }

function wedgeHistoryFilteredRounds() {
  return wedgeLimitedRounds().filter(w => {
    const okDistance = wedgeHistoryDistanceFilter.size === 0 || wedgeHistoryDistanceFilter.has(wedgeBucketFor(w.distanceToCover));
    const okZone = wedgeHistoryZoneFilter.size === 0 || wedgeHistoryZoneFilter.has(w.zone);
    return okDistance && okZone;
  });
}
// Historique du Journal regroupé par jour (le plus récent en haut, coups du jour du plus récent au plus ancien)
function wedgeDayKey(iso) {
  const d = new Date(iso);
  return isNaN(d) ? 'inconnue' : d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function wedgeDayLabel(key, iso) {
  if (key === 'inconnue') return 'Date inconnue';
  const today = new Date(), yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (key === wedgeDayKey(today.toISOString())) return "Aujourd'hui";
  if (key === wedgeDayKey(yesterday.toISOString())) return 'Hier';
  return WedgeUI.formatDate(iso);
}
// Jours dépliés dans l'historique (conservés d'un rendu à l'autre : rerender() reconstruit tout le HTML)
const wedgeOpenStacks = new Set();
function wedgeHistoryItemHtml(w) {
  return `
    <div class="wg-history-item">
      <span class="wg-history-bar"></span>
      <div class="wg-history-mid">
        <b>${wedgeShotBucketLabel(w)}</b>
        <span class="wg-text-muted-sm">${wedgeZoneDisplayLabel(w.zone)} — ${wedgeFmt(w.finalDistance)}</span>
      </div>
      <button class="wg-btn-danger" onclick="deleteWedgeRound(${w.id})">${WedgeUI.ICONS.close}</button>
    </div>`;
}
function wedgeHistoryGroupedHtml(rounds) {
  const groups = new Map();
  rounds.forEach(w => {
    const key = wedgeDayKey(w.date);
    if (!groups.has(key)) groups.set(key, { key, iso: w.date, shots: [] });
    groups.get(key).shots.push(w);
  });
  return Array.from(groups.values()).sort((a, b) => b.key.localeCompare(a.key)).map(g => {
    const label = wedgeDayLabel(g.key, g.iso);
    const count = `${g.shots.length} coup${g.shots.length > 1 ? 's' : ''}`;
    // Un seul coup ce jour-là : pas de pile
    if (g.shots.length === 1) {
      return `
    <div class="wg-history-day"><span class="wg-history-day-title">${label}</span><span class="wg-history-day-count">${count}</span></div>
    ${wedgeHistoryItemHtml(g.shots[0])}`;
    }
    // Plusieurs coups : pile façon notifications iPhone (le plus récent devant), un appui déplie / replie
    const open = wedgeOpenStacks.has(g.key);
    return `
    <div class="wg-stack ${open ? 'is-open' : ''}" data-day="${g.key}">
      <button type="button" class="wg-history-day wg-stack-head" aria-expanded="${open}" onclick="toggleWedgeStack('${g.key}')">
        <span class="wg-history-day-title">${label}</span>
        <span class="wg-history-day-count">${count}<span class="wg-stack-chevron">${WedgeUI.ICONS.chevron}</span></span>
      </button>
      <div class="wg-stack-list" onclick="openWedgeStackFromList(event, '${g.key}')">
        ${g.shots.map(w => `<div class="wg-stack-item">${wedgeHistoryItemHtml(w)}</div>`).join('')}
      </div>
    </div>`;
  }).join('');
}
// Mise en page d'une pile : cartes empilées (3 visibles, décalées de 10 px) ou dépliées (une sous l'autre).
// Les cartes sont en position absolue : on calcule leur décalage vertical et la hauteur de la liste à partir de leur hauteur réelle.
const WEDGE_STACK_PEEK = 10, WEDGE_STACK_GAP = 8, WEDGE_STACK_VISIBLE = 3;
function wedgeLayoutStack(stack) {
  const list = stack.querySelector('.wg-stack-list');
  if (!list) return;
  const open = stack.classList.contains('is-open');
  const items = Array.from(list.children);
  const heights = items.map(el => el.firstElementChild.offsetHeight);
  if (!heights.length || !heights[0]) return; // page masquée : rien à mesurer (recalculé à l'affichage, voir ResizeObserver)
  let total = 0;
  items.forEach((el, i) => {
    el.style.zIndex = String(items.length - i);
    if (open) {
      el.style.transform = `translateY(${total}px) scale(1)`;
      el.style.opacity = '1';
      total += heights[i] + (i < items.length - 1 ? WEDGE_STACK_GAP : 0);
    } else {
      const depth = Math.min(i, WEDGE_STACK_VISIBLE - 1);
      // origine en bas : le bord bas de chaque carte arrière dépasse de WEDGE_STACK_PEEK sous la carte devant
      el.style.transform = `translateY(${depth * WEDGE_STACK_PEEK}px) scale(${1 - depth * 0.05})`;
      el.style.opacity = i < WEDGE_STACK_VISIBLE ? '1' : '0';
      total = Math.max(total, heights[i] + depth * WEDGE_STACK_PEEK);
    }
  });
  list.style.height = total + 'px';
}
function wedgeLayoutAllStacks() {
  document.querySelectorAll('#page-wedging .wg-stack').forEach(wedgeLayoutStack);
}
function toggleWedgeStack(key) {
  const stack = document.querySelector(`#page-wedging .wg-stack[data-day="${key}"]`);
  if (!stack) return;
  const open = !stack.classList.contains('is-open');
  stack.classList.toggle('is-open', open);
  stack.querySelector('.wg-stack-head').setAttribute('aria-expanded', String(open));
  if (open) wedgeOpenStacks.add(key); else wedgeOpenStacks.delete(key);
  wedgeLayoutStack(stack);
}
// Appui sur la pile repliée : elle se déplie (une fois dépliée, les cartes gardent leurs propres boutons)
function openWedgeStackFromList(event, key) {
  const stack = event.currentTarget.closest('.wg-stack');
  if (stack && !stack.classList.contains('is-open')) toggleWedgeStack(key);
}
function openWedgeHistoryDistancePopup() { wedgeHistoryDistancePopupOpen = true; rerender(); }
function closeWedgeHistoryDistancePopup() { wedgeHistoryDistancePopupOpen = false; rerender(); }
function toggleWedgeHistoryDistance(d) { wedgeHistoryDistanceFilter.has(d) ? wedgeHistoryDistanceFilter.delete(d) : wedgeHistoryDistanceFilter.add(d); rerender(); }
function wedgeHistoryDistancePopupHtml() {
  const buckets = Array.from(new Set(wedgeRounds.map(w => wedgeBucketFor(w.distanceToCover)))).sort((a, b) => a - b);
  return WedgeUI.modal('Trier par distance', `
    <div class="wg-chip-row">${buckets.length ? buckets.map(b => `<button type="button" class="wg-chip ${wedgeHistoryDistanceFilter.has(b) ? 'active' : ''}" onclick="toggleWedgeHistoryDistance(${b})">${wedgeBucketLabel(b)}</button>`).join('') : '<p class="wg-text-muted">Aucun coup enregistré.</p>'}</div>
    <button class="wg-btn-primary mt-8" onclick="closeWedgeHistoryDistancePopup()">OK</button>
  `, 'closeWedgeHistoryDistancePopup');
}
function openWedgeHistoryZonePopup() { wedgeHistoryZonePopupOpen = true; rerender(); }
function closeWedgeHistoryZonePopup() { wedgeHistoryZonePopupOpen = false; rerender(); }
function toggleWedgeHistoryZone(z) { wedgeHistoryZoneFilter.has(z) ? wedgeHistoryZoneFilter.delete(z) : wedgeHistoryZoneFilter.add(z); rerender(); }
function wedgeHistoryZonePopupHtml() {
  return WedgeUI.modal('Trier par type de raté', `
    <div class="wg-grid-3">${WEDGE_ZONES.map(z => `<button type="button" class="wg-chip ${wedgeHistoryZoneFilter.has(z) ? 'active' : ''}" onclick="toggleWedgeHistoryZone('${z}')">${wedgeZoneDisplayLabel(z)}</button>`).join('')}</div>
    <button class="wg-btn-primary mt-8" onclick="closeWedgeHistoryZonePopup()">OK</button>
  `, 'closeWedgeHistoryZonePopup');
}
function wedgeHistoryFiltersRowHtml() {
  // Libellés fixes : un bouton vert signale qu'une sélection est en cours (le détail se lit dans la fenêtre du bouton)
  return `<div class="wg-chip-row wg-chip-row--scroll">
      ${wedgeShotsLimitButtonHtml()}
      <button class="wg-chip ${wedgeHistoryDistanceFilter.size ? 'active' : ''}" onclick="openWedgeHistoryDistancePopup()">Distance</button>
      <button class="wg-chip ${wedgeHistoryZoneFilter.size ? 'active' : ''}" onclick="openWedgeHistoryZonePopup()">Type de raté</button>
    </div>
    ${wedgeShotsLimitPopupOpen ? wedgeShotsLimitPopupHtml() : ''}`;
}

// --- Toile d'araignée (Dispersion) ---
function setWedgeRadarDistance(b) {
  if (wedgeRadarDistances.has(b)) { if (wedgeRadarDistances.size > 1) wedgeRadarDistances.delete(b); }
  else wedgeRadarDistances.add(b);
}

// --- Créatif (Exercices) ---
// Filtre/normalise les données existantes : d'anciennes versions de l'app ont pu écrire
// des objets sous les mêmes clés localStorage avec un format différent (ex. sans `logs`,
// sans `distances`/`resultMode`). On les écarte pour éviter un plantage au rendu.
function normalizeWedgeExercises(list) {
  return (Array.isArray(list) ? list : [])
    .filter(e => e && Array.isArray(e.distances) && typeof e.resultMode === 'string')
    .map(e => Object.assign({}, e, { logs: Array.isArray(e.logs) ? e.logs : [] }));
}
function normalizeWedgeRounds(list) {
  // Les coups enregistrés avec l'ancien palier "110m" (seul) passent dans le dernier palier, 105-110m
  const lastBucket = WEDGE_BUCKETS[WEDGE_BUCKETS.length - 1];
  return (Array.isArray(list) ? list : [])
    .filter(w => w && typeof w.distanceToCover === 'number' && typeof w.zone === 'string' && typeof w.finalDistance === 'number')
    .map(w => w.distanceToCover >= WEDGE_MAX_DISTANCE ? Object.assign({}, w, { distanceToCover: lastBucket }) : w);
}
let wedgeExercises = normalizeWedgeExercises(WedgeStorage.getExercises());
let wedgeExerciseModalOpen = false;
let editingWedgeExerciseId = null;
let wedgeExerciseForm = null;
let wedgeDistancesPopupOpen = false;
let wedgeResultModePopupOpen = false;
let wedgeRadiusPopupOpen = false;
let wedgeRadiusInput = '';
let selectedWedgeExerciseId = null;
let wedgeReviewExerciseId = null;
let wedgeViewedLogId = null;
let wedgeExReviewLimit = 20;
let wedgeExSession = null;
let wedgeExRecap = null;
let wedgeRecapDistanceEditIdx = null;
let wedgeRecapDistanceInput = '';
let wedgeRecapZoneEditIdx = null;
let wedgeRecapEditMode = false;
let wedgeInProgressSessions = Array.isArray(WedgeStorage.getInProgress()) ? WedgeStorage.getInProgress() : [];
wedgeInProgressSessions = wedgeInProgressSessions.filter(e => e && wedgeExercises.some(x => x.id === e.exerciseId));
let wedgeResumePopupExerciseId = null;
let wedgeEditConflictPopupOpen = false;
let wedgePendingEditPayload = null;
let wedgeBallsPopupOpen = false;
let wedgeBallsInput = '';
let wedgeConfirmDeleteLogId = null;
let wedgeConfirmDeleteLogExerciseId = null;
let wedgeExercisesTab = 'list';
let wedgeExercisesSort = null; // null = ordre de création | 'az' | 'type'

/* ---------- Boutons de tri génériques ----------
   Un bouton "Libellé (valeur)" qui ouvre une popup de choix, même style (.wg-chip)
   et même fonctionnement que l'historique Parcours.
   multi:false = un seul choix, la popup se ferme toute seule.
   multi:true  = plusieurs choix + bouton OK. */
let wedgeSortPopupKey = null;
const WEDGE_EXERCISES_SORT_LABELS = { az: 'A → Z', type: 'Type' };

function wedgeRadarBuckets() {
  return Array.from(new Set(wedgeShotsWithResult().map(w => wedgeAnalysisBucketFor(w.distanceToCover)))).sort((a, b) => a - b);
}

const WEDGE_SORTS = {
  // Dispersion : distances affichées (multi, minimum 1)
  radarDistance: () => ({
    label: 'Distance', title: 'Trier par distance', multi: true,
    options: wedgeRadarBuckets().map(b => [b, wedgeAnalysisShortLabel(b)]),
    isSelected: v => wedgeRadarDistances.has(v),
    valueText: wedgeRadarDistances.size || '',
    active: wedgeRadarDistances.size > 0,
    onPick: v => setWedgeRadarDistance(v)
  }),
  // Revue d'un exercice : nombre de sessions prises en compte
  exReviewLimit: () => ({
    label: 'Nombre de séances', title: 'Nombre de séances', multi: false,
    options: WEDGE_EX_REVIEW_LIMIT_OPTIONS.map(v => [v, v === 'all' ? 'Tous' : String(v)]),
    isSelected: v => wedgeExReviewLimit === v,
    valueText: wedgeExReviewLimit === 'all' ? 'Tous' : wedgeExReviewLimit,
    active: wedgeExReviewLimit !== 'all',
    onPick: v => { wedgeExReviewLimit = v; }
  }),
  // Liste d'exercices : ordre d'affichage
  exercisesSort: () => ({
    label: 'Tri', title: 'Trier les exercices', multi: false,
    options: [[null, 'Ordre de création'], ['az', 'A → Z'], ['type', "Type d'exercice"]],
    isSelected: v => wedgeExercisesSort === v,
    valueText: WEDGE_EXERCISES_SORT_LABELS[wedgeExercisesSort] || 'Création',
    active: wedgeExercisesSort !== null,
    onPick: v => { wedgeExercisesSort = v; }
  })
};

function wedgeSortBtnHtml(key) {
  const c = WEDGE_SORTS[key]();
  return `<button type="button" class="wg-chip ${c.active ? 'active' : ''}" onclick="openWedgeSortPopup('${key}')">${c.label}${c.valueText !== '' ? ` (${c.valueText})` : ''}</button>`;
}
function openWedgeSortPopup(key) { wedgeSortPopupKey = key; rerender(); }
function closeWedgeSortPopup() { wedgeSortPopupKey = null; rerender(); }
function pickWedgeSort(i) {
  const c = WEDGE_SORTS[wedgeSortPopupKey](); const opt = c.options[i]; if (!opt) return;
  c.onPick(opt[0]);
  if (!c.multi) wedgeSortPopupKey = null;
  rerender();
}
function wedgeSortPopupHtml() {
  if (!wedgeSortPopupKey) return '';
  const c = WEDGE_SORTS[wedgeSortPopupKey]();
  const chips = c.options.map(([v, label], i) => `<button type="button" class="wg-chip ${c.isSelected(v) ? 'active' : ''}" onclick="pickWedgeSort(${i})">${label}</button>`).join('');
  return WedgeUI.modal(c.title, `
    <div class="wg-chip-row">${chips || '<p class="wg-text-muted">Aucun coup enregistré.</p>'}</div>
    ${c.multi ? '<button class="wg-btn-primary mt-8" onclick="closeWedgeSortPopup()">OK</button>' : ''}
  `, 'closeWedgeSortPopup');
}

function persistWedgeExercises() { WedgeStorage.writeExercises(wedgeExercises); }
function persistWedgeInProgressSessions() { WedgeStorage.writeInProgress(wedgeInProgressSessions); }
function wedgeInProgressFor(exId) { return wedgeInProgressSessions.find(s => s.exerciseId === exId) || null; }
function removeInProgressFor(exId) {
  wedgeInProgressSessions = wedgeInProgressSessions.filter(s => s.exerciseId !== exId);
  persistWedgeInProgressSessions();
}
// Sauvegarde la session en cours dès qu'au moins un tir a été enregistré, pour pouvoir
// la retrouver (badge "En cours" + popup de reprise) même après avoir quitté l'écran.
function saveCurrentSessionAsInProgress() {
  const s = wedgeExSession; if (!s) return;
  const hasProgress = s.elevator ? s.history.length > 0 : s.distances.some(d => d.results.some(r => r !== null));
  if (!hasProgress) { removeInProgressFor(s.exerciseId); return; }
  const idx = wedgeInProgressSessions.findIndex(e => e.exerciseId === s.exerciseId);
  const entry = { exerciseId: s.exerciseId, session: s };
  if (idx === -1) wedgeInProgressSessions.push(entry); else wedgeInProgressSessions[idx] = entry;
  persistWedgeInProgressSessions();
}

function openWedgeExerciseModal(id) {
  editingWedgeExerciseId = id !== undefined ? id : null;
  const existing = editingWedgeExerciseId !== null ? wedgeExercises.find(e => e.id === editingWedgeExerciseId) : null;
  wedgeExerciseForm = existing ? {
    name: existing.name, description: existing.description || '', distances: new Set(existing.distances),
    ballsPerDistance: existing.ballsPerDistance, resultMode: existing.resultMode,
    radius: existing.radius || 1, radiusUnit: existing.radiusUnit || 'm',
    elevatorMode: existing.elevatorMode || 'single', elevatorX: existing.elevatorX || 3, elevatorY: existing.elevatorY || 5
  } : { name: '', description: '', distances: new Set(), ballsPerDistance: 5, resultMode: 'zone', radius: 1, radiusUnit: 'm', elevatorMode: 'single', elevatorX: 3, elevatorY: 5 };
  wedgeExerciseModalOpen = true; rerender();
}
function closeWedgeExerciseModal() { wedgeExerciseModalOpen = false; wedgeExerciseForm = null; editingWedgeExerciseId = null; rerender(); }
function updateWedgeExerciseName(v) { wedgeExerciseForm.name = v; }
function updateWedgeExerciseDescription(v) { wedgeExerciseForm.description = v; }
function resultModeLabel(mode) { return mode === 'zone' ? '9 zones' : mode === 'distance' ? 'Distance libre' : mode === 'elevator' ? 'Ascenseur' : 'Dans / Hors'; }

function saveWedgeExercise() {
  const f = wedgeExerciseForm;
  if (!f.name || !f.name.trim()) { WedgeUI.toast('Donne un titre à ton exercice.'); return; }
  if (!f.distances.size) { WedgeUI.toast('Sélectionne au moins une distance.'); return; }
  if (f.resultMode === 'elevator' && f.distances.size < 2) { WedgeUI.toast("Choisis au moins 2 distances pour l'ascenseur."); return; }
  if (f.resultMode === 'elevator' && f.elevatorMode === 'xy' && f.elevatorX > f.elevatorY) f.elevatorX = f.elevatorY;
  const payload = {
    name: f.name.trim(), description: f.description.trim(), distances: Array.from(f.distances).sort((a, b) => a - b),
    ballsPerDistance: f.ballsPerDistance, resultMode: f.resultMode,
    radius: (f.resultMode === 'inout' || f.resultMode === 'zone') ? f.radius : null,
    radiusUnit: (f.resultMode === 'inout' || f.resultMode === 'zone') ? f.radiusUnit : null,
    elevatorMode: f.resultMode === 'elevator' ? f.elevatorMode : null,
    elevatorX: f.resultMode === 'elevator' ? f.elevatorX : null,
    elevatorY: f.resultMode === 'elevator' ? f.elevatorY : null
  };
  if (editingWedgeExerciseId !== null) {
    const existing = wedgeExercises.find(e => e.id === editingWedgeExerciseId);
    if (existing && existing.logs.length) {
      wedgePendingEditPayload = payload;
      wedgeEditConflictPopupOpen = true;
      rerender();
      return;
    }
    if (existing) {
      const struct = o => JSON.stringify([o.distances, o.ballsPerDistance, o.resultMode, o.elevatorMode, o.elevatorX, o.elevatorY]);
      if (struct(existing) !== struct(payload)) removeInProgressFor(existing.id); // la session en cours ne correspond plus à l'exercice
      Object.assign(existing, payload);
    }
  } else {
    wedgeExercises.push({ id: Date.now(), logs: [], ...payload });
  }
  persistWedgeExercises();
  closeWedgeExerciseModal();
}
function cancelEditConflict() { wedgeEditConflictPopupOpen = false; wedgePendingEditPayload = null; rerender(); }
function confirmEditAsNewExercise() {
  wedgeExercises.push({ id: Date.now(), logs: [], ...wedgePendingEditPayload });
  wedgeEditConflictPopupOpen = false; wedgePendingEditPayload = null;
  persistWedgeExercises();
  closeWedgeExerciseModal();
}
function confirmEditOverwriteExercise() {
  const existing = wedgeExercises.find(e => e.id === editingWedgeExerciseId);
  if (existing) { Object.assign(existing, wedgePendingEditPayload); existing.logs = []; }
  removeInProgressFor(editingWedgeExerciseId);
  wedgeEditConflictPopupOpen = false; wedgePendingEditPayload = null;
  persistWedgeExercises();
  closeWedgeExerciseModal();
}
function wedgeEditConflictPopupHtml() {
  return WedgeUI.modal("Exercice déjà utilisé", `
    <p class="wg-text-muted mb-10">Cet exercice a déjà des séances enregistrées. Tes modifications peuvent créer un nouvel exercice (l'historique actuel est conservé) ou remplacer celui-ci (son historique sera effacé).</p>
    <div class="wg-field-row"><button class="wg-btn-secondary" onclick="confirmEditAsNewExercise()">Nouvel exercice</button><button class="wg-btn-primary" onclick="confirmEditOverwriteExercise()">Remplacer (efface l'historique)</button></div>
  `, 'cancelEditConflict');
}
let wedgeConfirmDeleteExerciseId = null;
function askDeleteWedgeExercise(id) { wedgeConfirmDeleteExerciseId = id; rerender(); }
function cancelDeleteWedgeExercise() { wedgeConfirmDeleteExerciseId = null; rerender(); }
function confirmDeleteWedgeExercise() {
  const id = wedgeConfirmDeleteExerciseId;
  wedgeExercises = wedgeExercises.filter(e => e.id !== id);
  if (wedgeExSession && wedgeExSession.exerciseId === id) wedgeExSession = null;
  if (wedgeExRecap && wedgeExRecap.exerciseId === id) wedgeExRecap = null;
  removeInProgressFor(id);
  if (selectedWedgeExerciseId === id) selectedWedgeExerciseId = null;
  if (wedgeReviewExerciseId === id) { wedgeReviewExerciseId = null; wedgeViewedLogId = null; }
  wedgeConfirmDeleteExerciseId = null;
  persistWedgeExercises(); rerender();
}
function wedgeConfirmDeleteModalHtml() {
  const ex = wedgeExercises.find(e => e.id === wedgeConfirmDeleteExerciseId);
  return WedgeUI.modal('Supprimer l\'exercice', `
    <p class="wg-text-muted mb-10">Supprimer définitivement « ${ex ? appEscapeHtml(ex.name) : ''} » ? Cette action est irréversible.</p>
    <div class="wg-field-row"><button class="wg-btn-secondary" onclick="cancelDeleteWedgeExercise()">Annuler</button><button class="wg-btn-primary" onclick="confirmDeleteWedgeExercise()">Supprimer</button></div>
  `, 'cancelDeleteWedgeExercise');
}
function duplicateWedgeExercise(id) {
  const ex = wedgeExercises.find(e => e.id === id);
  if (!ex) return;
  const copy = JSON.parse(JSON.stringify(ex));
  copy.id = Date.now(); copy.name = ex.name + ' (copie)'; copy.logs = [];
  wedgeExercises.push(copy); selectedWedgeExerciseId = copy.id;
  persistWedgeExercises(); rerender();
}
function openWedgeDistancesPopup() { wedgeDistancesPopupOpen = true; rerender(); }
function closeWedgeDistancesPopup() { wedgeDistancesPopupOpen = false; rerender(); }
function toggleWedgeExerciseDistance(d) { const f = wedgeExerciseForm; f.distances.has(d) ? f.distances.delete(d) : f.distances.add(d); rerender(); }
function wedgeDistancesPopupHtml() {
  const f = wedgeExerciseForm;
  return WedgeUI.modal('Distances', `
    <div class="wg-chip-row">${wedgeExerciseDistanceChoices(f.distances).map(d => `<button type="button" class="wg-chip ${f.distances.has(d) ? 'active' : ''}" onclick="toggleWedgeExerciseDistance(${d})">${wedgeFmt(d)}</button>`).join('')}</div>
    <button class="wg-btn-primary mt-8" onclick="closeWedgeDistancesPopup()">OK</button>
  `, 'closeWedgeDistancesPopup');
}
function openWedgeResultModePopup() { wedgeResultModePopupOpen = true; rerender(); }
function closeWedgeResultModePopup() { wedgeResultModePopupOpen = false; rerender(); }
function setWedgeExerciseResultMode(mode) { wedgeExerciseForm.resultMode = mode; rerender(); }
function setWedgeExerciseRadiusUnit(u) { wedgeExerciseForm.radiusUnit = u; rerender(); }
function openWedgeRadiusPopup() { const f = wedgeExerciseForm; wedgeRadiusInput = String(f.radius ? (f.radiusUnit === '%' ? f.radius : wedgeToDisplayAvg(f.radius)) : ''); wedgeRadiusPopupOpen = true; rerender(); }
function closeWedgeRadiusPopup() { wedgeRadiusPopupOpen = false; rerender(); }
function wedgeRadiusKeyPress(k) { if (k === '.' && wedgeRadiusInput.includes('.')) return; if (wedgeRadiusInput.length >= 5) return; wedgeRadiusInput += k; rerender(); }
function wedgeRadiusBackspace() { wedgeRadiusInput = wedgeRadiusInput.slice(0, -1); rerender(); }
function confirmWedgeRadius() { const n = parseFloat(wedgeRadiusInput); if (!isNaN(n) && n > 0) wedgeExerciseForm.radius = wedgeExerciseForm.radiusUnit === '%' ? n : wedgeFromInput(n); closeWedgeRadiusPopup(); }
function wedgeRadiusPopupHtml() {
  return WedgeUI.modal('Rayon de validation', `
    <div class="app-keypad-value">${wedgeRadiusInput || '0'}${wedgeExerciseForm.radiusUnit === '%' ? '%' : wedgeUnit()}</div>
    ${WedgeUI.keypad('wedgeRadiusKeyPress', 'wedgeRadiusBackspace', null, { fn: "wedgeRadiusKeyPress('.')", label: '.' })}
    <button class="wg-btn-primary mt-8" onclick="confirmWedgeRadius()">OK</button>
  `, 'closeWedgeRadiusPopup');
}
function incWedgeExerciseBalls(delta) {
  const f = wedgeExerciseForm; f.ballsPerDistance = Math.max(1, Math.min(30, f.ballsPerDistance + delta)); rerender();
}
function openWedgeBallsPopup() { wedgeBallsInput = String(wedgeExerciseForm.ballsPerDistance || ''); wedgeBallsPopupOpen = true; rerender(); }
function closeWedgeBallsPopup() { wedgeBallsPopupOpen = false; rerender(); }
function wedgeBallsKeyPress(k) { if (wedgeBallsInput.length >= 3) return; wedgeBallsInput += k; rerender(); }
function wedgeBallsBackspace() { wedgeBallsInput = wedgeBallsInput.slice(0, -1); rerender(); }
function confirmWedgeBalls() {
  const n = parseInt(wedgeBallsInput, 10);
  if (!isNaN(n) && n > 0) wedgeExerciseForm.ballsPerDistance = Math.max(1, Math.min(30, n));
  closeWedgeBallsPopup();
}
function wedgeBallsPopupHtml() {
  return WedgeUI.modal('Balles par distance', `
    <div class="app-keypad-value">${wedgeBallsInput || '0'}</div>
    ${WedgeUI.keypad('wedgeBallsKeyPress', 'wedgeBallsBackspace', null)}
    <button class="wg-btn-primary mt-8" onclick="confirmWedgeBalls()">OK</button>
  `, 'closeWedgeBallsPopup');
}
function setWedgeElevatorMode(mode) { wedgeExerciseForm.elevatorMode = mode; rerender(); }
function incWedgeElevatorX(delta) {
  const f = wedgeExerciseForm; f.elevatorX = Math.max(1, Math.min(f.elevatorY, f.elevatorX + delta)); rerender();
}
function incWedgeElevatorY(delta) {
  const f = wedgeExerciseForm; f.elevatorY = Math.max(1, Math.min(30, f.elevatorY + delta));
  if (f.elevatorX > f.elevatorY) f.elevatorX = f.elevatorY; rerender();
}
function wedgeExerciseModalHtml() {
  const f = wedgeExerciseForm;
  const distList = Array.from(f.distances).sort((a, b) => a - b);
  return `<div class="wg-modal-overlay" onclick="closeWedgeExerciseModal()">
    <div class="wg-modal" onclick="event.stopPropagation()">
      <div class="wg-modal-head"><h3>${editingWedgeExerciseId !== null ? "Éditer l'exercice" : 'Nouvel exercice'}</h3><button class="wg-modal-close" onclick="closeWedgeExerciseModal()">${WedgeUI.ICONS.close}</button></div>
      <div class="wg-field"><label>Titre</label><input type="text" class="wg-input" placeholder="Titre de l'exercice" value="${appEscapeHtml(f.name)}" oninput="updateWedgeExerciseName(this.value)"></div>
      <div class="wg-field"><label>Description</label><textarea class="wg-textarea" placeholder="Description (optionnel)" rows="2" oninput="updateWedgeExerciseDescription(this.value)">${appEscapeHtml(f.description)}</textarea></div>
      <div class="wg-field-box-grid">
        <div class="wg-field-box ${f.resultMode === 'elevator' ? 'wg-col-span-full' : ''}" onclick="openWedgeDistancesPopup()">
          <div class="wg-field-box-label">${f.resultMode === 'elevator' ? 'Paliers (du plus court au plus long)' : 'Distances'}</div>
          <div class="wg-field-box-value">${distList.length ? distList.map(d => wedgeFmt(d)).join(', ') : 'Choisir'}</div>
        </div>
        ${f.resultMode === 'elevator' ? '' : `<div class="wg-stepper"><div class="wg-field-box-label">Balles / distance</div><div class="wg-stepper-controls"><button type="button" onclick="incWedgeExerciseBalls(-1)">−</button><span class="wg-stepper-value" style="cursor:pointer;" onclick="openWedgeBallsPopup()">${f.ballsPerDistance}</span><button type="button" onclick="incWedgeExerciseBalls(1)">+</button></div></div>`}
      </div>
      <div class="wg-field-box-grid">
        <div class="wg-field-box wg-col-span-full" onclick="openWedgeResultModePopup()">
          <div class="wg-field-box-label">Enregistrement du résultat</div>
          <div class="wg-field-box-value">${resultModeLabel(f.resultMode)}${(f.resultMode === 'inout' || f.resultMode === 'zone') ? ` — rayon ${wedgeRadiusText(f.radius, f.radiusUnit)}` : ''}</div>
        </div>
      </div>
      <button class="wg-btn-primary" onclick="saveWedgeExercise()">${editingWedgeExerciseId !== null ? 'Enregistrer les modifications' : 'Enregistrer'}</button>
    </div>
  </div>`;
}
function wedgeResultModePopupHtml() {
  const f = wedgeExerciseForm;
  const options = [['zone', '9 zones'], ['distance', 'Distance libre'], ['inout', 'Dans / Hors'], ['elevator', 'Ascenseur']];
  return `${WedgeUI.modal('Enregistrement du résultat', `
    <div class="wg-chip-row">${options.map(([v, label]) => `<button type="button" class="wg-chip ${f.resultMode === v ? 'active' : ''}" onclick="setWedgeExerciseResultMode('${v}')">${label}</button>`).join('')}</div>
    ${f.resultMode === 'elevator' ? `
      <p class="wg-info-note mt-8">Balles illimitées. Choisis au moins 2 distances pour former les paliers.</p>
      <div class="mt-8">
        <div class="wg-field-box-label wg-text-center mb-6">Validation du palier</div>
        <div class="wg-toggle-pair"><button type="button" class="${f.elevatorMode !== 'xy' ? 'active' : ''}" onclick="setWedgeElevatorMode('single')">1 balle</button><button type="button" class="${f.elevatorMode === 'xy' ? 'active' : ''}" onclick="setWedgeElevatorMode('xy')">X sur Y</button></div>
        <p class="wg-info-note mt-6">${f.elevatorMode === 'xy' ? "Réussis X balles sur une série de Y pour monter d'un palier. Sinon tu redescends d'un palier. Le changement n'a lieu qu'une fois la série terminée." : "Une réussite fait monter d'un palier, un raté fait redescendre d'un palier, immédiatement."}</p>
      </div>
      ${f.elevatorMode === 'xy' ? `
        <div class="wg-field-box-grid mt-8">
          <div class="wg-stepper"><div class="wg-field-box-label">Balles réussies requises (X)</div><div class="wg-stepper-controls"><button type="button" onclick="incWedgeElevatorX(-1)">−</button><span class="wg-stepper-value">${f.elevatorX}</span><button type="button" onclick="incWedgeElevatorX(1)">+</button></div></div>
          <div class="wg-stepper"><div class="wg-field-box-label">Sur combien de balles (Y)</div><div class="wg-stepper-controls"><button type="button" onclick="incWedgeElevatorY(-1)">−</button><span class="wg-stepper-value">${f.elevatorY}</span><button type="button" onclick="incWedgeElevatorY(1)">+</button></div></div>
        </div>` : ''}
    ` : ''}
    ${(f.resultMode === 'inout' || f.resultMode === 'zone') ? `
      <div class="wg-field-box-grid mt-8">
        <div class="wg-field-box" onclick="openWedgeRadiusPopup()"><div class="wg-field-box-label">Rayon de validation</div><div class="wg-field-box-value">${wedgeRadiusText(f.radius, f.radiusUnit)}</div></div>
        <div><div class="wg-field-box-label wg-text-center">Unité</div><div class="wg-toggle-pair"><button type="button" class="${f.radiusUnit === 'm' ? 'active' : ''}" onclick="setWedgeExerciseRadiusUnit('m')">${wedgeUnit()}</button><button type="button" class="${f.radiusUnit === '%' ? 'active' : ''}" onclick="setWedgeExerciseRadiusUnit('%')">%</button></div></div>
      </div>` : ''}
    <button class="wg-btn-primary mt-8" onclick="closeWedgeResultModePopup()">OK</button>
  `, 'closeWedgeResultModePopup')}${wedgeRadiusPopupOpen ? wedgeRadiusPopupHtml() : ''}`;
}
function wedgeExerciseCardHtml(ex) {
  const lastLog = ex.logs.length ? ex.logs[ex.logs.length - 1] : null;
  const selected = selectedWedgeExerciseId === ex.id;
  const inProgress = !!wedgeInProgressFor(ex.id);
  const formatLabel = ex.resultMode === 'elevator'
    ? `${ex.distances.map(d => wedgeFmt(d)).join(' → ')} — Ascenseur (${ex.elevatorMode === 'xy' ? `${ex.elevatorX} sur ${ex.elevatorY} balles` : '1 balle, balles illimitées'})`
    : `${ex.distances.map(d => wedgeFmt(d)).join(' / ')} — ${ex.ballsPerDistance} balles/distance — ${resultModeLabel(ex.resultMode)}${(ex.resultMode === 'inout' || ex.resultMode === 'zone') ? ` (${wedgeRadiusText(ex.radius, ex.radiusUnit)})` : ''}`;
  return `<div class="wg-exercise-card2 ${selected ? 'selected' : ''}" onclick="selectWedgeExercise(${ex.id})">
    <div class="wg-exercise-card2-head">
      <span class="wg-exercise-card2-title-wrap"><b>${appEscapeHtml(ex.name)}</b>${inProgress ? `<span class="wg-badge-progress" onclick="event.stopPropagation(); openWedgeResumePopup(${ex.id})">En cours</span>` : ''}</span>
      ${selected ? `<div class="wg-exercise-actions">
          <button title="Supprimer" onclick="event.stopPropagation(); askDeleteWedgeExercise(${ex.id})">${WedgeUI.ICONS.close}</button>
          <button title="Dupliquer" onclick="event.stopPropagation(); duplicateWedgeExercise(${ex.id})">${WedgeUI.ICONS.duplicate}</button>
          <button title="Modifier" onclick="event.stopPropagation(); openWedgeExerciseModal(${ex.id})">${WedgeUI.ICONS.edit}</button>
          <button title="Graphe" onclick="event.stopPropagation(); reviewWedgeExercise(${ex.id})">${WedgeUI.ICONS.chart}</button>
        </div>` : `<span class="wg-text-muted-sm">${lastLog ? WedgeUI.formatDate(lastLog.date) : ''}</span>`}
    </div>
    ${ex.description ? `<span class="wg-text-muted">${appEscapeHtml(ex.description)}</span>` : ''}
    <span class="wg-text-muted">${formatLabel}</span>
    ${lastLog ? `<div class="wg-text-muted-sm">Dernière séance : ${WedgeUI.formatDate(lastLog.date)} — ${wedgeLogSummaryText(ex, lastLog)}</div>` : ''}
  </div>`;
}
function selectWedgeExercise(id) { selectedWedgeExerciseId = selectedWedgeExerciseId === id ? null : id; rerender(); }
function wedgeLogSummaryText(ex, log) {
  const s = log.summary;
  if (ex.resultMode === 'zone') return `${s.greenCount}/${s.total} réussis`;
  if (ex.resultMode === 'distance') return `distance moyenne ${wedgeFmtAvg(s.avgDistance)}`;
  if (ex.resultMode === 'elevator') return `palier max ${wedgeFmt(s.maxDistance)} (${s.total} balles)`;
  return `${s.made}/${s.total} réussis (${s.pct}%)`;
}

function startWedgeExerciseSession(id) {
  const ex = wedgeExercises.find(e => e.id === id);
  if (!ex) return;
  if (ex.resultMode === 'elevator') {
    wedgeExSession = { exerciseId: ex.id, elevator: true, levels: ex.distances.slice().sort((a, b) => a - b), currentLevelIdx: 0, maxLevelIdx: 0, history: [], validationMode: ex.elevatorMode === 'xy' ? 'xy' : 'single', xyX: ex.elevatorX || 3, xyY: ex.elevatorY || 5, levelAttempts: [] };
    rerender(); return;
  }
  wedgeExSession = { exerciseId: ex.id, activeDistanceIdx: 0, activeAttempt: 0, distances: ex.distances.map(d => ({ distance: d, results: Array.from({ length: ex.ballsPerDistance }, () => null) })) };
  rerender();
}
function startSelectedWedgeExercise() {
  if (!selectedWedgeExerciseId) { WedgeUI.toast("Sélectionne d'abord un exercice dans la liste."); return; }
  if (wedgeInProgressFor(selectedWedgeExerciseId)) { openWedgeResumePopup(selectedWedgeExerciseId); return; }
  startWedgeExerciseSession(selectedWedgeExerciseId);
}
function openWedgeResumePopup(id) { wedgeResumePopupExerciseId = id; rerender(); }
function closeWedgeResumePopup() { wedgeResumePopupExerciseId = null; rerender(); }
function resumeWedgeExerciseFromPopup() {
  const entry = wedgeInProgressFor(wedgeResumePopupExerciseId);
  if (entry) { wedgeExSession = entry.session; selectedWedgeExerciseId = entry.exerciseId; }
  wedgeResumePopupExerciseId = null;
  rerender();
}
function restartWedgeExerciseFromPopup() {
  const id = wedgeResumePopupExerciseId;
  removeInProgressFor(id);
  wedgeResumePopupExerciseId = null;
  startWedgeExerciseSession(id);
}
function wedgeResumePopupHtml() {
  const ex = wedgeExercises.find(e => e.id === wedgeResumePopupExerciseId);
  return WedgeUI.modal('Séance en cours', `
    <p class="wg-text-muted mb-10">Tu as une séance en cours pour « ${ex ? appEscapeHtml(ex.name) : ''} ». Reprendre où tu t'es arrêté, ou recommencer à zéro ?</p>
    <div class="wg-field-row"><button class="wg-btn-secondary" onclick="restartWedgeExerciseFromPopup()">Recommencer</button><button class="wg-btn-primary" onclick="resumeWedgeExerciseFromPopup()">Reprendre</button></div>
  `, 'closeWedgeResumePopup');
}
function cancelWedgeExerciseSession() { wedgeExSession = null; rerender(); }
function setWedgeExActiveAttempt(idx) { wedgeExSession.activeAttempt = idx; rerender(); }
function setWedgeExActiveDistance(idx) {
  const s = wedgeExSession; s.activeDistanceIdx = idx;
  const dist = s.distances[idx]; const firstEmpty = dist.results.findIndex(r => r === null);
  s.activeAttempt = firstEmpty === -1 ? 0 : firstEmpty; rerender();
}
function wedgeExSessionProgress(s) {
  const total = s.distances.reduce((n, d) => n + d.results.length, 0);
  const done = s.distances.reduce((n, d) => n + d.results.filter(r => r !== null).length, 0);
  return { done, total };
}
function setWedgeExAttemptResult(value) {
  const s = wedgeExSession; const dist = s.distances[s.activeDistanceIdx];
  dist.results[s.activeAttempt] = value;
  if (s.activeAttempt < dist.results.length - 1) { s.activeAttempt += 1; rerender(); }
  else if (s.activeDistanceIdx < s.distances.length - 1) { s.activeDistanceIdx += 1; s.activeAttempt = 0; rerender(); }
  else if (s.distances.every(d => d.results.every(r => r !== null))) finishWedgeExSession();
  else {
    // Dernier tir saisi alors que des tirs précédents sont vides : on y retourne au lieu d'enregistrer une session incomplète
    const di = s.distances.findIndex(d => d.results.some(r => r === null));
    s.activeDistanceIdx = di; s.activeAttempt = s.distances[di].results.findIndex(r => r === null); rerender();
  }
}
function setWedgeExInOut(made) { setWedgeExAttemptResult(!!made); }

/* ---------- Popup "Distance obtenue" (résultat en mètres, mode "distance") ---------- */
let wedgeExDistancePopupOpen = false;
let wedgeExDistanceInput = '';
function openWedgeExDistancePopup() {
  const s = wedgeExSession; const dist = s.distances[s.activeDistanceIdx];
  const current = dist.results[s.activeAttempt];
  wedgeExDistanceInput = (current !== null && current !== undefined) ? String(wedgeToDisplayAvg(current)) : '';
  wedgeExDistancePopupOpen = true; rerender();
}
function closeWedgeExDistancePopup() { wedgeExDistancePopupOpen = false; rerender(); }
function wedgeExDistanceKeyPress(k) { if (k === '.' && wedgeExDistanceInput.includes('.')) return; if (wedgeExDistanceInput.length >= 5) return; wedgeExDistanceInput += k; rerender(); }
function wedgeExDistanceBackspace() { wedgeExDistanceInput = wedgeExDistanceInput.slice(0, -1); rerender(); }
function confirmWedgeExDistance() {
  const val = parseFloat(wedgeExDistanceInput); if (isNaN(val)) return;
  closeWedgeExDistancePopup();
  setWedgeExAttemptResult(wedgeFromInput(val)); // saisi dans l'unité affichée, enregistré en mètres
}
function wedgeExDistancePopupHtml() {
  return WedgeUI.modal('Distance obtenue', `
    <div class="app-keypad-value">${wedgeExDistanceInput || '0'}${wedgeUnit()}</div>
    ${WedgeUI.keypad('wedgeExDistanceKeyPress', 'wedgeExDistanceBackspace', null, { fn: "wedgeExDistanceKeyPress('.')", label: '.' })}
    <button class="wg-btn-primary mt-8" onclick="confirmWedgeExDistance()">Valider le coup</button>
  `, 'closeWedgeExDistancePopup');
}
function wedgeExResultDotClass(ex, r) {
  if (r === null || r === undefined) return '';
  if (ex.resultMode === 'inout') return r ? 'made' : 'missed';
  if (ex.resultMode === 'zone') return r.made ? 'made' : 'missed';
  return 'made';
}
function setWedgeExCircleZone(direction, ring) {
  const made = direction === 'Green' || ring === 'in';
  setWedgeExAttemptResult({ zone: direction, direction, ring, made });
}
// Distance réelle à réussir (courte, affichée dans le sous-titre) : directe en mètres, ou calculée depuis un % de la distance à faire
function wedgeExSuccessDistanceLabel(ex, distance) {
  if ((ex.resultMode !== 'zone' && ex.resultMode !== 'inout') || !ex.radius) return '';
  if (ex.radiusUnit === '%') {
    const meters = Math.round(distance * (ex.radius / 100) * 100) / 100;
    return `< ${wedgeFmtAvg(meters)} pour réussir`;
  }
  return `< ${wedgeFmtAvg(ex.radius)} pour réussir`;
}
function wedgeExResultInputHtml(ex, currentResult, distance) {
  if (ex.resultMode === 'zone') return `<div class="wg-text-muted wg-text-center mb-6">Vise le trou au centre — anneau intérieur = réussite, anneau extérieur = raté</div><div class="wg-wheel-wrap">${WedgeUI.twoRingWheelSvg(currentResult)}</div>`;
  if (ex.resultMode === 'distance') return `<div class="wg-field"><label>Distance obtenue (${wedgeUnit()})</label><button type="button" class="wg-input wg-input-btn" onclick="openWedgeExDistancePopup()">${currentResult !== null && currentResult !== undefined ? wedgeToDisplayAvg(currentResult) + ' ' + wedgeUnit() : 'Toucher pour saisir'}</button></div>`;
  return `<div class="wg-field-row"><button class="wg-result-btn ${currentResult === true ? 'success active' : 'success'}" onclick="setWedgeExInOut(true)">Réussi</button><button class="wg-result-btn ${currentResult === false ? 'fail active' : 'fail'}" onclick="setWedgeExInOut(false)">Manqué</button></div>`;
}
function wedgeExSessionScreenHtml() {
  const s = wedgeExSession; const ex = wedgeExercises.find(e => e.id === s.exerciseId);
  if (!ex) { wedgeExSession = null; return wedgeExercisesListHtml(); }
  const dist = s.distances[s.activeDistanceIdx]; const progress = wedgeExSessionProgress(s);
  const attemptsHtml = dist.results.map((r, idx) => `<button class="wg-attempt-btn ${idx === s.activeAttempt ? 'active' : ''}" onclick="setWedgeExActiveAttempt(${idx})"><span>${idx + 1}</span>${ex.resultMode === 'distance' && r !== null && r !== undefined ? `<span class="wg-attempt-value">${wedgeToDisplayAvg(r)}</span>` : `<span class="wg-dot ${wedgeExResultDotClass(ex, r)}"></span>`}</button>`).join('');
  const distTabsHtml = s.distances.map((dd, idx) => `<button class="wg-ladder-item ${idx === s.activeDistanceIdx ? 'active' : ''}" onclick="setWedgeExActiveDistance(${idx})">${wedgeFmt(dd.distance)}</button>`).join('');
  const currentResult = dist.results[s.activeAttempt];
  return `<div class="wg-topbar is-session"><button class="wg-back-btn" onclick="cancelWedgeExerciseSession()">${WedgeUI.ICONS.back} Quitter</button></div>
    <div class="wg-session-title">${appEscapeHtml(ex.name)}</div>
    <div class="wg-session-subtitle">${wedgeFmt(dist.distance)} - ${s.activeAttempt + 1}/${dist.results.length}${wedgeExSuccessDistanceLabel(ex, dist.distance) ? ' · ' + wedgeExSuccessDistanceLabel(ex, dist.distance) : ''}</div>
    <section class="wg-section"><h4 class="mb-8">Balles</h4><div class="wg-attempts-grid">${attemptsHtml}</div></section>
    <section class="wg-section">${wedgeExResultInputHtml(ex, currentResult, dist.distance)}</section>
    <div class="wg-bottom-stats-bar"><div><b>${progress.done} / ${progress.total}</b>Progression</div></div>
    <div class="wg-ladder-grid">${distTabsHtml}</div>
    <div style="height:24px;"></div>
    ${wedgeExDistancePopupOpen ? wedgeExDistancePopupHtml() : ''}`;
}
function computeWedgeShotsSummary(ex, shots) {
  if (!shots.length) return ex.resultMode === 'distance' ? { avgDistance: 0, total: 0 } : { made: 0, greenCount: 0, total: 0, pct: 0 };
  if (ex.resultMode === 'zone') { const greenCount = shots.filter(x => x.made).length; return { greenCount, total: shots.length, pct: Math.round((greenCount / shots.length) * 100) }; }
  if (ex.resultMode === 'distance') return { avgDistance: Math.round((shots.reduce((n, x) => n + x.resultDistance, 0) / shots.length) * 100) / 100, total: shots.length };
  const made = shots.filter(x => x.made).length; return { made, total: shots.length, pct: Math.round((made / shots.length) * 100) };
}
function finishWedgeExSession() {
  const s = wedgeExSession; const ex = wedgeExercises.find(e => e.id === s.exerciseId); if (!ex) return;
  const shots = [];
  s.distances.forEach(d => d.results.forEach(r => {
    if (r === null) return;
    if (ex.resultMode === 'zone') shots.push({ distance: d.distance, zone: r.zone, direction: r.direction, ring: r.ring, made: r.made });
    else if (ex.resultMode === 'distance') shots.push({ distance: d.distance, resultDistance: r });
    else shots.push({ distance: d.distance, made: r });
  }));
  wedgeExRecap = { exerciseId: ex.id, elevator: false, shots, summary: computeWedgeShotsSummary(ex, shots) };
  wedgeRecapEditMode = false;
  rerender();
}
function wedgeExElevatorScreenHtml() {
  const s = wedgeExSession; const ex = wedgeExercises.find(e => e.id === s.exerciseId);
  if (!ex) { wedgeExSession = null; return wedgeExercisesListHtml(); }
  const distance = s.levels[s.currentLevelIdx]; const isXY = s.validationMode === 'xy';
  const ladderHtml = s.levels.map((d, idx) => `<div class="wg-ladder-item ${idx === s.currentLevelIdx ? 'active' : ''} ${idx > s.maxLevelIdx ? 'dim' : ''}">${wedgeFmt(d)}</div>`).join('');
  const recentDotsHtml = s.history.slice(-10).map(h => `<span class="wg-dot ${h.made ? 'made' : 'missed'}"></span>`).join('');
  const seriesHtml = isXY ? `<div class="wg-series-dots">${Array.from({ length: s.xyY }, (_, i) => { const r = s.levelAttempts[i]; const cls = r === true ? 'filled' : (r === false ? 'missed' : ''); return `<span class="wg-series-dot ${cls}"></span>`; }).join('')}</div>
    <div class="wg-info-note mb-10">Balle ${Math.min(s.levelAttempts.length + 1, s.xyY)} / ${s.xyY} — besoin de ${s.xyX} réussies pour monter</div>` : '';
  return `<div class="wg-topbar is-session"><button class="wg-back-btn" onclick="cancelWedgeExerciseSession()">${WedgeUI.ICONS.back} Quitter</button></div>
    <div class="wg-session-title">${appEscapeHtml(ex.name)}</div>
    <div class="wg-section-desc wg-text-center">Palier ${s.currentLevelIdx + 1}/${s.levels.length} — ${wedgeFmt(distance)}</div>
    <p class="wg-text-muted wg-text-center mb-10">${isXY ? `Réussis ${s.xyX} balles sur ${s.xyY} pour monter d'un palier, sinon tu redescends — balles illimitées` : `Réussis pour monter d'un palier, rate pour redescendre — balles illimitées`}</p>
    <div class="wg-ladder-grid">${ladderHtml}</div>
    ${seriesHtml}
    <div class="wg-recent-dots">${recentDotsHtml || `<span class="wg-text-muted-sm">Aucun coup pour l'instant</span>`}</div>
    <div class="wg-field-row"><button class="wg-result-btn success" onclick="setWedgeExElevatorResult(true)">Réussi${isXY ? '' : ' ↑'}</button><button class="wg-result-btn fail" onclick="setWedgeExElevatorResult(false)">Raté${isXY ? '' : ' ↓'}</button></div>
    <div class="wg-bottom-stats-bar"><div><b>${s.history.length}</b>Balles</div><div><b>${wedgeFmt(s.levels[s.maxLevelIdx])}</b>Meilleur palier</div></div>
    <button class="wg-btn-secondary mt-8" onclick="finishWedgeExElevatorSession()">Terminer la séance</button>
    <div style="height:24px;"></div>`;
}
function setWedgeExElevatorResult(made) {
  const s = wedgeExSession; s.history.push({ levelIdx: s.currentLevelIdx, distance: s.levels[s.currentLevelIdx], made });
  const lastIdx = s.levels.length - 1; let topValidated = false;
  if (s.validationMode === 'xy') {
    s.levelAttempts.push(made);
    if (s.levelAttempts.length >= s.xyY) {
      const successCount = s.levelAttempts.filter(Boolean).length; const passed = successCount >= s.xyX;
      if (passed) { if (s.currentLevelIdx === lastIdx) topValidated = true; s.currentLevelIdx = Math.min(s.currentLevelIdx + 1, s.levels.length - 1); s.maxLevelIdx = Math.max(s.maxLevelIdx, s.currentLevelIdx); }
      else s.currentLevelIdx = Math.max(s.currentLevelIdx - 1, 0);
      s.levelAttempts = [];
    }
  } else {
    if (made) { if (s.currentLevelIdx === lastIdx) topValidated = true; s.currentLevelIdx = Math.min(s.currentLevelIdx + 1, s.levels.length - 1); s.maxLevelIdx = Math.max(s.maxLevelIdx, s.currentLevelIdx); }
    else s.currentLevelIdx = Math.max(s.currentLevelIdx - 1, 0);
  }
  if (topValidated) { finishWedgeExElevatorSession(); return; }
  rerender();
}
function finishWedgeExElevatorSession() {
  const s = wedgeExSession; if (!s.history.length) { cancelWedgeExerciseSession(); return; }
  const ex = wedgeExercises.find(e => e.id === s.exerciseId); if (!ex) return;
  const shots = s.history.map(h => ({ distance: h.distance, made: h.made }));
  const summary = { total: shots.length, maxLevelIdx: s.maxLevelIdx, maxDistance: s.levels[s.maxLevelIdx], finalDistance: s.levels[s.currentLevelIdx] };
  wedgeExRecap = { exerciseId: ex.id, elevator: true, shots, summary };
  wedgeRecapEditMode = false;
  rerender();
}

/* ---------- Récapitulatif modifiable avant enregistrement ---------- */
function wedgeExRecapShotLabel(ex, s) {
  // La pastille (verte / rouge) indique déjà réussi ou raté : pas de mot en plus
  if (ex.resultMode === 'zone') return `${s.direction || s.zone}`;
  if (ex.resultMode === 'distance') return wedgeFmtAvg(s.resultDistance);
  return '';
}
function toggleWedgeRecapShot(i) {
  const ex = wedgeExercises.find(e => e.id === wedgeExRecap.exerciseId); if (!ex) return;
  if (ex.resultMode === 'zone') { openWedgeRecapZoneEdit(i); return; }
  if (ex.resultMode === 'distance') { openWedgeRecapDistanceEdit(i); return; }
  // In/Out et Ascenseur : il faut d'abord activer le mode édition (crayon) pour éviter les corrections accidentelles
  if (!wedgeRecapEditMode) return;
  const s = wedgeExRecap.shots[i];
  s.made = !s.made;
  if (!wedgeExRecap.elevator) wedgeExRecap.summary = computeWedgeShotsSummary(ex, wedgeExRecap.shots);
  rerender();
}
function toggleWedgeRecapEditMode() { wedgeRecapEditMode = !wedgeRecapEditMode; rerender(); }
function openWedgeRecapZoneEdit(i) { wedgeRecapZoneEditIdx = i; rerender(); }
function closeWedgeRecapZoneEdit() { wedgeRecapZoneEditIdx = null; rerender(); }
function setWedgeRecapZone(direction, ring) {
  const ex = wedgeExercises.find(e => e.id === wedgeExRecap.exerciseId); if (!ex) return;
  const made = direction === 'Green' || ring === 'in';
  wedgeExRecap.shots[wedgeRecapZoneEditIdx] = { ...wedgeExRecap.shots[wedgeRecapZoneEditIdx], zone: direction, direction, ring, made };
  wedgeExRecap.summary = computeWedgeShotsSummary(ex, wedgeExRecap.shots);
  wedgeRecapZoneEditIdx = null;
  rerender();
}
function wedgeRecapZonePopupHtml() {
  const s = wedgeExRecap.shots[wedgeRecapZoneEditIdx];
  return WedgeUI.modal('Corriger le coup', `
    <div class="wg-text-muted wg-text-center mb-6">Touche la zone où est vraiment tombée la balle</div>
    <div class="wg-wheel-wrap">${WedgeUI.twoRingWheelSvg(s, 'setWedgeRecapZone')}</div>
  `, 'closeWedgeRecapZoneEdit');
}
function openWedgeRecapDistanceEdit(i) {
  wedgeRecapDistanceEditIdx = i;
  wedgeRecapDistanceInput = String(wedgeToDisplayAvg(wedgeExRecap.shots[i].resultDistance));
  rerender();
}
function closeWedgeRecapDistanceEdit() { wedgeRecapDistanceEditIdx = null; rerender(); }
function wedgeRecapDistanceKeyPress(k) { if (k === '.' && wedgeRecapDistanceInput.includes('.')) return; if (wedgeRecapDistanceInput.length >= 5) return; wedgeRecapDistanceInput += k; rerender(); }
function wedgeRecapDistanceBackspace() { wedgeRecapDistanceInput = wedgeRecapDistanceInput.slice(0, -1); rerender(); }
function confirmWedgeRecapDistance() {
  const ex = wedgeExercises.find(e => e.id === wedgeExRecap.exerciseId);
  const val = parseFloat(wedgeRecapDistanceInput);
  if (!isNaN(val) && ex) {
    wedgeExRecap.shots[wedgeRecapDistanceEditIdx].resultDistance = wedgeFromInput(val); // saisi dans l'unité affichée, enregistré en mètres
    wedgeExRecap.summary = computeWedgeShotsSummary(ex, wedgeExRecap.shots);
  }
  wedgeRecapDistanceEditIdx = null; rerender();
}
function wedgeRecapDistancePopupHtml() {
  return WedgeUI.modal('Distance obtenue', `
    <div class="app-keypad-value">${wedgeRecapDistanceInput || '0'}${wedgeUnit()}</div>
    ${WedgeUI.keypad('wedgeRecapDistanceKeyPress', 'wedgeRecapDistanceBackspace', null, { fn: "wedgeRecapDistanceKeyPress('.')", label: '.' })}
    <button class="wg-btn-primary mt-8" onclick="confirmWedgeRecapDistance()">Valider</button>
  `, 'closeWedgeRecapDistanceEdit');
}
function discardWedgeExRecap() {
  if (wedgeExRecap && !wedgeExRecap.logId) removeInProgressFor(wedgeExRecap.exerciseId);
  wedgeExRecap = null; wedgeExSession = null; wedgeRecapEditMode = false; wedgeRecapZoneEditIdx = null;
  rerender();
}
function saveWedgeExRecap() {
  const ex = wedgeExercises.find(e => e.id === wedgeExRecap.exerciseId); if (!ex) return;
  if (wedgeExRecap.logId) {
    const log = ex.logs.find(l => l.id === wedgeExRecap.logId);
    if (log) { log.shots = wedgeExRecap.shots; log.summary = wedgeExRecap.summary; }
  } else {
    ex.logs.push({ id: Date.now(), date: new Date().toISOString(), shots: wedgeExRecap.shots, summary: wedgeExRecap.summary });
    removeInProgressFor(ex.id);
  }
  wedgeExRecap = null; wedgeExSession = null; wedgeRecapEditMode = false; wedgeRecapZoneEditIdx = null;
  persistWedgeExercises();
  WedgeUI.toast('Séance enregistrée');
  rerender();
}
// Modifier une session déjà enregistrée depuis l'onglet Historique
function editWedgeExerciseLog(exerciseId, logId) {
  const ex = wedgeExercises.find(e => e.id === exerciseId); const log = ex && ex.logs.find(l => l.id === logId);
  if (!ex || !log) return;
  wedgeExRecap = { exerciseId: ex.id, elevator: ex.resultMode === 'elevator', logId: log.id, shots: log.shots.map(s => ({ ...s })), summary: { ...log.summary } };
  wedgeRecapEditMode = false;
  rerender();
}
function wedgeAllExerciseLogs() {
  const rows = [];
  wedgeExercises.forEach(ex => ex.logs.forEach(log => rows.push({ ex, log })));
  rows.sort((a, b) => new Date(b.log.date) - new Date(a.log.date));
  return rows;
}
function setWedgeExercisesTab(tab) { wedgeExercisesTab = tab; rerender(); }
function wedgeSortedExercises() {
  const list = wedgeExercises.slice();
  const byName = (a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' });
  const typeOrder = ['zone', 'distance', 'inout', 'elevator'];
  if (wedgeExercisesSort === 'az') list.sort(byName);
  else if (wedgeExercisesSort === 'type') list.sort((a, b) => (typeOrder.indexOf(a.resultMode) - typeOrder.indexOf(b.resultMode)) || byName(a, b));
  return list;
}
function wedgeExerciseHistoryHtml() {
  const rows = wedgeAllExerciseLogs();
  const rowsHtml = rows.map(({ ex, log }) => `<li onclick="editWedgeExerciseLog(${ex.id}, ${log.id})">
      <span>${appEscapeHtml(ex.name)}<br><span class="wg-text-muted-sm">${WedgeUI.formatDate(log.date)} — ${wedgeLogSummaryText(ex, log)}</span></span>
      <span class="wg-log-row-right"><button class="wg-btn-danger" onclick="event.stopPropagation(); askDeleteWedgeLog(${log.id}, ${ex.id})">${WedgeUI.ICONS.trash}</button></span>
    </li>`).join('');
  return `<ul class="wg-session-list mb-70">${rowsHtml || '<li>Aucune séance enregistrée pour le moment.</li>'}</ul>`;
}
function wedgeExRecapScreenHtml() {
  const ex = wedgeExercises.find(e => e.id === wedgeExRecap.exerciseId);
  if (!ex) { wedgeExRecap = null; return wedgeExercisesListHtml(); }
  const needsEditMode = ex.resultMode === 'inout' || ex.resultMode === 'elevator';
  const hasDot = ex.resultMode !== 'distance';
  const rows = wedgeExRecap.shots.map((s, i) => `<li class="wg-recap-row${hasDot ? '' : ' no-dot'}" onclick="toggleWedgeRecapShot(${i})">${hasDot ? `<span class="wg-dot ${s.made ? 'made' : 'missed'}"></span>` : ''}<span class="wg-recap-shot">Coup ${i + 1}</span><span class="wg-recap-dist">${wedgeFmtSp(s.distance)}</span><span class="wg-recap-result wg-text-muted-sm">${wedgeExRecapShotLabel(ex, s)}</span></li>`).join('');
  return `<div class="wg-topbar is-session">
      <button class="wg-back-btn" onclick="discardWedgeExRecap()">${WedgeUI.ICONS.back} Annuler</button>
      ${needsEditMode ? `<button class="wg-icon-btn ${wedgeRecapEditMode ? 'active' : ''}" onclick="toggleWedgeRecapEditMode()">${WedgeUI.ICONS.edit}</button>` : ''}
    </div>
    <div class="wg-session-title">${appEscapeHtml(ex.name)}</div>
    <div class="wg-section-desc wg-text-center">${needsEditMode ? (wedgeRecapEditMode ? 'Touche un coup pour changer son résultat' : 'Récapitulatif — touche le crayon pour corriger') : 'Récapitulatif — touche un coup pour le corriger'}</div>
    <div class="wg-insight-card-title wg-text-center mt-8">${wedgeLogSummaryText(ex, { summary: wedgeExRecap.summary })}</div>
    <ul class="wg-session-list">${rows}</ul>
    <button class="wg-btn-primary mt-8" onclick="saveWedgeExRecap()">Enregistrer</button>
    <div style="height:24px;"></div>
    ${wedgeRecapDistanceEditIdx !== null ? wedgeRecapDistancePopupHtml() : ''}
    ${wedgeRecapZoneEditIdx !== null ? wedgeRecapZonePopupHtml() : ''}`;
}

function askDeleteWedgeLog(logId, exerciseId) {
  wedgeConfirmDeleteLogId = logId;
  wedgeConfirmDeleteLogExerciseId = exerciseId !== undefined ? exerciseId : wedgeReviewExerciseId;
  rerender();
}
function cancelDeleteWedgeLog() { wedgeConfirmDeleteLogId = null; wedgeConfirmDeleteLogExerciseId = null; rerender(); }
function confirmDeleteWedgeLog() {
  const ex = wedgeExercises.find(e => e.id === wedgeConfirmDeleteLogExerciseId);
  if (ex) {
    ex.logs = ex.logs.filter(l => l.id !== wedgeConfirmDeleteLogId);
    persistWedgeExercises();
  }
  if (wedgeViewedLogId === wedgeConfirmDeleteLogId) wedgeViewedLogId = null;
  wedgeConfirmDeleteLogId = null; wedgeConfirmDeleteLogExerciseId = null;
  WedgeUI.toast('Séance supprimée');
  rerender();
}
function wedgeConfirmDeleteLogModalHtml() {
  return WedgeUI.modal('Supprimer la séance', `
    <p class="wg-text-muted mb-10">Supprimer définitivement cette séance ? Cette action est irréversible.</p>
    <div class="wg-field-row"><button class="wg-btn-secondary" onclick="cancelDeleteWedgeLog()">Annuler</button><button class="wg-btn-primary" onclick="confirmDeleteWedgeLog()">Supprimer</button></div>
  `, 'cancelDeleteWedgeLog');
}
function reviewWedgeExercise(id) { wedgeReviewExerciseId = id; wedgeViewedLogId = null; rerender(); }
function closeWedgeExerciseReview() { wedgeReviewExerciseId = null; wedgeViewedLogId = null; rerender(); }
function viewWedgeExerciseLog(id) { wedgeViewedLogId = id; rerender(); }
function closeWedgeExerciseLog() { wedgeViewedLogId = null; rerender(); }
function wedgeExAvgDistanceForDistance(log, d) {
  const shots = log.shots.filter(s => s.distance === d);
  if (!shots.length) return 0;
  return Math.round((shots.reduce((n, s) => n + s.resultDistance, 0) / shots.length) * 100) / 100;
}
function wedgeExPctForDistance(log, d) {
  const shots = d === null ? log.shots : log.shots.filter(s => s.distance === d);
  if (!shots.length) return 0;
  return Math.round((shots.filter(s => s.made).length / shots.length) * 100);
}
// Un graphe par distance de l'exercice (évolution round après round) + un graphe de moyenne toutes distances confondues.
function wedgeExPerDistanceCharts(ex, unitLabel, valueFn, opts, distanceLabel) {
  const charts = [];
  ex.distances.slice().sort((a, b) => a - b).forEach(d => {
    const logs = ex.logs.filter(l => l.shots.some(s => s.distance === d));
    if (!logs.length) return;
    charts.push({ title: distanceLabel ? distanceLabel(d) : wedgeFmt(d), build: () => wedgeExLineChart(logs, l => valueFn(l, d), unitLabel, opts) });
  });
  return charts;
}
function wedgeReviewChartsFor(ex) {
  const charts = [];
  const pct = { percent: true }; // axe fixe 0–100
  if (ex.resultMode === 'zone') {
    charts.push({ title: "Toile d'araignée", build: () => wedgeExRadarHtml(ex) });
    charts.push({ title: 'Évolution', build: () => wedgeExEvolutionHtml(ex) });
    return charts;
  }
  if (ex.resultMode === 'distance') {
    charts.push(...wedgeExPerDistanceCharts(ex, `Distance obtenue (${wedgeUnit()})`, (l, d) => wedgeToDisplayAvg(wedgeExAvgDistanceForDistance(l, d)), { showValues: true, valueSuffix: wedgeUnit() }));
    if (ex.logs.length) charts.push({ title: 'Moyenne — toutes distances', build: () => wedgeExLineChart(ex.logs, l => wedgeToDisplayAvg(l.summary.avgDistance), `Distance moyenne (${wedgeUnit()})`, { showValues: true, valueSuffix: wedgeUnit() }) });
    return charts;
  }
  if (ex.resultMode === 'inout') {
    charts.push(...wedgeExPerDistanceCharts(ex, 'Réussite (%)', wedgeExPctForDistance, pct));
    if (ex.logs.length) charts.push({ title: 'Moyenne — toutes distances', build: () => wedgeExLineChart(ex.logs, l => l.summary.pct, 'Réussite (%)', pct) });
    return charts;
  }
  if (ex.resultMode === 'elevator') {
    charts.push(...wedgeExPerDistanceCharts(ex, 'Réussite (%)', wedgeExPctForDistance, pct, d => `Palier ${wedgeFmt(d)}`));
    if (ex.logs.length) charts.push({ title: 'Moyenne — tous paliers', build: () => wedgeExLineChart(ex.logs, l => wedgeExPctForDistance(l, null), 'Réussite (%)', pct) });
    return charts;
  }
  charts.push({ title: 'Évolution', build: () => wedgeExEvolutionHtml(ex) });
  return charts;
}
function wedgeExRadarHtml(ex) {
  // Dispersion globale : toutes distances et toutes sessions confondues.
  // La carte (titre + cadre) est générée par la revue, le bouton de limite est au-dessus.
  const shots = ex.logs.flatMap(l => l.shots); // ex.logs est déjà limité par la revue (voir wedgeExerciseReviewHtml)
  if (!shots.length) return '';
  const holedCount = shots.filter(s => s.direction === 'Green').length;
  const items = WEDGE_RADAR_ORDER.map(zone => {
    const pct = Math.round((shots.filter(s => s.direction === zone).length / shots.length) * 100);
    return { label: wedgeRadarShortLabel(zone), value: pct, display: `${pct}%` };
  });
  return `<div class="wg-chart-axis-title">${shots.length} balle${shots.length > 1 ? 's' : ''}${holedCount ? ` — dont ${holedCount} dans le trou` : ''}</div>${WedgeAnalytics.buildRadarChartSvg(items)}`;
}
function wedgeExEvolutionHtml(ex) {
  const valueFn = ex.resultMode === 'distance' ? l => wedgeToDisplayAvg(l.summary.avgDistance) : ex.resultMode === 'elevator' ? l => wedgeToDisplay(l.summary.maxDistance) : l => l.summary.pct;
  const unitLabel = ex.resultMode === 'distance' ? `Distance moyenne (${wedgeUnit()})` : ex.resultMode === 'elevator' ? `Meilleur palier atteint (${wedgeUnit()})` : 'Réussite (%)';
  // Test libre (distance) : on affiche la distance de chaque session plutôt qu'un simple point.
  return wedgeExLineChart(ex.logs, valueFn, unitLabel, {
    showValues: ex.resultMode === 'distance',
    valueSuffix: wedgeUnit(),
    percent: ex.resultMode === 'zone' || ex.resultMode === 'inout'
  });
}
function wedgeExLineChart(history, valueFn, unitLabel, opts) {
  if (!history.length) return ``;
  const showValues = !!(opts && opts.showValues);
  const valueSuffix = (opts && opts.valueSuffix) || '';
  const values = history.map(valueFn); const n = values.length;
  // Graphes en % : axe fixe de 0 à 100, sinon échelle automatique
  const scale = (opts && opts.percent) ? { min: 0, max: 100, ticks: [0, 25, 50, 75, 100] } : WedgeAnalytics.niceScale(Math.min(...values), Math.max(...values));
  const W = 340, H = 260, padL = 40, padR = 14, padT = 14, padB = 30;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const xFor = i => padL + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const yFor = v => padT + plotH - ((v - scale.min) / ((scale.max - scale.min) || 1)) * plotH;
  const pointsAttr = values.map((v, i) => `${xFor(i)},${yFor(v)}`).join(' ');
  const dotsHtml = values.map((v, i) => {
    const x = xFor(i), y = yFor(v);
    if (showValues) {
      return `<g onclick="viewWedgeExerciseLog(${history[i].id})" style="cursor:pointer;"><circle cx="${x}" cy="${y}" r="11" fill="transparent"/><circle cx="${x}" cy="${y}" r="3" class="wg-radar-dot"/><text x="${x}" y="${y - 10}" class="wg-radar-value" text-anchor="middle">${v}${valueSuffix}</text></g>`;
    }
    return `<circle cx="${x}" cy="${y}" r="5" class="wg-radar-dot" onclick="viewWedgeExerciseLog(${history[i].id})" style="cursor:pointer;"/>`;
  }).join('');
  const yGridHtml = scale.ticks.map(t => { const y = yFor(t); return `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" class="wg-radar-grid"/><text x="${padL - 6}" y="${y + 4}" class="wg-chart-axis-text" text-anchor="end">${t}</text>`; }).join('');
  const xStep = Math.max(1, Math.ceil(n / 6));
  const xLabelsHtml = values.map((_, i) => { if (i % xStep !== 0 && i !== n - 1) return ''; return `<text x="${xFor(i)}" y="${H - padB + 18}" class="wg-chart-axis-text" text-anchor="middle">${i + 1}</text>`; }).join('');
  return `<div class="wg-chart-axis-title">${unitLabel}</div><svg viewBox="0 0 ${W} ${H}" class="wg-radar-svg">${yGridHtml}<polyline points="${pointsAttr}" fill="none" class="wg-radar-shape" style="fill:none;"/>${dotsHtml}${xLabelsHtml}</svg>`;
}
function wedgeExerciseReviewHtml() {
  const ex = wedgeExercises.find(e => e.id === wedgeReviewExerciseId);
  if (!ex) { wedgeReviewExerciseId = null; return wedgeExercisesListHtml(); }
  if (wedgeViewedLogId !== null) return wedgeExerciseLogDetailHtml(ex);
  const logs = ex.logs;
  // La limite de sessions s'applique à tous les graphes ; la liste des sessions plus bas reste complète
  const exView = Object.assign({}, ex, { logs: wedgeExReviewLimit === 'all' ? ex.logs : ex.logs.slice(-wedgeExReviewLimit) });
  const charts = wedgeReviewChartsFor(exView);
  // Même carte que les graphes de Dispersion (Parcours) ; les graphes vides sont ignorés
  const chartsHtml = charts.map(c => {
    const body = c.build(logs);
    return body ? `<div class="wg-insight-card"><div class="wg-insight-card-title">${c.title}</div><div>${body}</div></div>` : '';
  }).join('');
  const sessionRows = logs.slice().reverse().map(l => `<li onclick="viewWedgeExerciseLog(${l.id})"><span>${WedgeUI.formatDate(l.date)}<br><span class="wg-text-muted-sm">${wedgeLogSummaryText(ex, l)}</span></span><span class="wg-log-row-right"><span class="wg-text-muted-sm">${l.summary.total} balles</span><button class="wg-btn-danger" onclick="event.stopPropagation(); askDeleteWedgeLog(${l.id})">${WedgeUI.ICONS.trash}</button></span></li>`).join('');
  return `<div class="wg-topbar"><button class="wg-back-btn" onclick="closeWedgeExerciseReview()">${WedgeUI.ICONS.back} Exercices</button></div>
    <div class="wg-session-title">${appEscapeHtml(ex.name)}</div>
    ${logs.length ? `<section class="wg-section"><div class="wg-chip-row">${wedgeSortBtnHtml('exReviewLimit')}</div></section>` : ''}
    ${chartsHtml}
    <div class="wg-section-desc mt-8">Voir les séances précédentes</div>
    <ul class="wg-session-list">${sessionRows || '<li>Aucune séance pour cet exercice.</li>'}</ul>
    <div style="height:24px;"></div>
    ${wedgeConfirmDeleteLogId !== null ? wedgeConfirmDeleteLogModalHtml() : ''}
    ${wedgeSortPopupHtml()}`;
}
function wedgeExerciseLogDetailHtml(ex) {
  const log = ex.logs.find(l => l.id === wedgeViewedLogId);
  if (!log) return wedgeExerciseReviewHtml();
  // Même grille que le récapitulatif : pastille | tir | distance | résultat
  const hasDot = ex.resultMode !== 'distance';
  const shotRows = log.shots.map((s, i) => `<li class="wg-recap-row${hasDot ? '' : ' no-dot'}">${hasDot ? `<span class="wg-dot ${s.made ? 'made' : 'missed'}"></span>` : ''}<span class="wg-recap-shot">Coup ${i + 1}</span><span class="wg-recap-dist">${wedgeFmtSp(s.distance)}</span><span class="wg-recap-result wg-text-muted-sm">${wedgeExRecapShotLabel(ex, s)}</span></li>`).join('');
  return `<div class="wg-topbar"><button class="wg-back-btn" onclick="closeWedgeExerciseLog()">${WedgeUI.ICONS.back} Retour</button><button class="wg-icon-btn" onclick="askDeleteWedgeLog(${log.id})">${WedgeUI.ICONS.trash}</button></div>
    <div class="wg-session-title">${appEscapeHtml(ex.name)}</div>
    <div class="wg-section-desc wg-text-center">${WedgeUI.formatDate(log.date)}</div>
    <div class="wg-insight-card-title wg-log-summary mt-8">${wedgeLogSummaryText(ex, log)}</div>
    <ul class="wg-session-list">${shotRows}</ul>
    <div style="height:24px;"></div>
    ${wedgeConfirmDeleteLogId !== null ? wedgeConfirmDeleteLogModalHtml() : ''}`;
}

/* =============================== 6. VUES ===================================== */

const WedgeViews = {};

WedgeViews.home = function () {
  return `${WedgeUI.header({ title: "WEDGING", backLabel: "Accueil", backHash: "app-home" })}<p class="wg-subtitle">Maîtrise tes distances, contrôle tes approches.</p>${WedgeUI.navCards(null)}`;
};

// Boutons de distance du nouveau coup : les 12 paliers
function wedgeNewShotButtonsHtml() {
  const list = wedgeBucketList();
  if (wedgeNewShotBucket === undefined) wedgeNewShotBucket = list[0];
  else if (wedgeNewShotBucket !== null && !list.includes(wedgeNewShotBucket)) wedgeNewShotBucket = null;
  return list.map(b => `<button type="button" class="wg-range-btn ${wedgeNewShotBucket === b ? 'active' : ''}" onclick="setWedgeNewShotBucket(${b})">${wedgeBucketLabel(b)}</button>`).join('');
}

/* --- PARCOURS = Journal (ajout de coup + historique filtrable) --- */
WedgeViews.parcours = function () {
  const filtered = wedgeHistoryFilteredRounds();
  return `
    ${WedgeUI.header({ title: "WEDGING", backLabel: "Accueil", backHash: "app-home", rightIcon: WedgeUI.ICONS.more })}
    ${WedgeUI.navCards("parcours")}

    <section class="wg-section">
      <h4>Nouveau coup</h4>
      <div class="wg-range-grid wg-range-grid--3 mt-6">${wedgeNewShotButtonsHtml()}</div>

      <label class="wg-label mt-8">Distance finale (${wedgeUnit()})</label>
      ${wedgeNewShotZone === 'Green' ? `
      <div class="wg-field-box wg-field-box--center wg-field-box--locked">
        <div class="wg-field-box-value">0${wedgeUnit()}</div>
        <div class="wg-field-box-label">Coup rentré</div>
      </div>` : `
      <div class="wg-field-box wg-field-box--center" onclick="openWedgeFinalPopup()">
        <div class="wg-field-box-value">${wedgeNewShotFinal ? wedgeNewShotFinal : '0'}${wedgeUnit()}</div>
        <div class="wg-field-box-label">Toucher pour saisir</div>
      </div>`}

      <label class="wg-label mt-8">Zone</label>
      <div class="wg-wheel-wrap">${WedgeUI.wheelSvg(wedgeNewShotZone, 'setWedgeNewShotZone')}</div>

      <button class="wg-btn-primary mt-8" ${(wedgeNewShotBucket === null || wedgeNewShotFinal === '' || !wedgeNewShotZone) ? 'disabled' : ''} onclick="addWedgeRound()">Ajouter</button>
    </section>

    <div class="wg-toolbar"><span class="wg-toolbar-title">HISTORIQUE</span></div>
    <div class="wg-list">
      ${wedgeHistoryFiltersRowHtml()}
      ${wedgeHistoryGroupedHtml(filtered) || '<p class="wg-empty-state">Aucun coup enregistré.</p>'}
    </div>

    ${WedgeUI.bottomNav(null)}
    ${wedgeHistoryDistancePopupOpen ? wedgeHistoryDistancePopupHtml() : ''}
    ${wedgeHistoryZonePopupOpen ? wedgeHistoryZonePopupHtml() : ''}
    ${wedgeFinalPopupOpen ? wedgeFinalPopupHtml() : ''}
  `;
};

/* --- DISPERSION = Toile d'araignée --- */
WedgeViews.dispersionAnalysis = function () {
  const shots = wedgeShotsWithResult();
  const buckets = Array.from(new Set(shots.map(w => wedgeAnalysisBucketFor(w.distanceToCover)))).sort((a, b) => a - b);
  wedgeRadarDistances = new Set(Array.from(wedgeRadarDistances).filter(d => buckets.includes(d)));
  if (!wedgeRadarDistances.size && buckets.length) wedgeRadarDistances.add(buckets[0]);
  const selected = buckets.filter(b => wedgeRadarDistances.has(b));
  const cardsHtml = selected.map(b => {
    const bucketShots = shots.filter(w => wedgeAnalysisBucketFor(w.distanceToCover) === b);
    const items = WEDGE_RADAR_ORDER.map(zone => {
      const vals = bucketShots.filter(w => w.zone === zone).map(w => w.finalDistance);
      const value = vals.length ? vals.reduce((a, b2) => a + b2, 0) / vals.length : null;
      return { label: wedgeRadarShortLabel(zone), value, display: value !== null ? wedgeFmt1(value) : '—' };
    });
    return `<div class="wg-insight-card"><div class="wg-insight-card-title">Dispersion à ${wedgeAnalysisShortLabel(b)} (${bucketShots.length} coup${bucketShots.length > 1 ? 's' : ''})</div><div class="wg-insight-card-body">${WedgeAnalytics.buildRadarChartSvg(items)}</div></div>`;
  }).join('');
  return `
    ${WedgeUI.topbar("Wedging", "parcours", WedgeUI.ICONS.more)}
    ${WedgeUI.analysisHeader("ANALYSE", "Dispersion", "Dispersion de vos coups sur le parcours, par distance à faire.")}
    <section class="wg-section"><div class="wg-chip-row">${wedgeShotsLimitButtonHtml()}${wedgeSortBtnHtml('radarDistance')}</div></section>
    ${wedgeShotsLimitPopupOpen ? wedgeShotsLimitPopupHtml() : ''}
    ${wedgeSortPopupHtml()}
    ${buckets.length ? cardsHtml : `<p class="wg-empty-state">Aucun coup enregistré pour le moment.</p>`}
    ${WedgeUI.bottomNav("dispersion")}
  `;
};

/* --- DISTANCE = Jauges --- */
WedgeViews.distanceAnalysis = function () {
  const shots = wedgeShotsWithResult();
  const rows = wedgeAnalysisBuckets().map(b => {
    const vals = shots.filter(w => wedgeAnalysisBucketFor(w.distanceToCover) === b).map(w => w.finalDistance);
    const avg = vals.length ? vals.reduce((a, b2) => a + b2, 0) / vals.length : null;
    return { label: wedgeAnalysisShortLabel(b), avg: avg !== null ? wedgeToDisplay1(avg) : null };
  });
  const maxVal = Math.max(1, ...rows.filter(r => r.avg !== null).map(r => r.avg));
  const rowsHtml = rows.map(r => {
    if (r.avg === null) return `<div class="wg-gauge-row"><div class="wg-gauge-label">${r.label}</div><div class="wg-gauge-track"><div class="wg-gauge-fill wg-gauge-fill--empty"></div></div></div>`;
    const pct = Math.max(4, Math.round((r.avg / maxVal) * 100));
    return `<div class="wg-gauge-row"><div class="wg-gauge-label">${r.label}</div><div class="wg-gauge-track"><div class="wg-gauge-fill" style="width:${pct}%"></div><div class="wg-gauge-value" style="left:${pct}%">${r.avg}${wedgeUnit()}</div></div></div>`;
  }).join('');
  return `
    ${WedgeUI.topbar("Wedging", "parcours", WedgeUI.ICONS.more)}
    ${WedgeUI.analysisHeader("ANALYSE", "Distance", "Distance finale moyenne par palier de distance à faire.")}
    <section class="wg-section">${wedgeShotsLimitRowHtml()}</section>
    <section class="wg-section"><div class="wg-gauge-axis"><span>Distance à faire</span><span>Résultat moyen (${wedgeUnit()})</span></div>${rowsHtml}</section>
    ${WedgeUI.bottomNav("distance")}
  `;
};

/* --- SG (Strokes Gained), par palier de distance à faire --- */
WedgeViews.sgAnalysis = function () {
  const shots = wedgeShotsWithResult();
  const entries = wedgeAnalysisBuckets().map(b => {
    const bucketShots = shots.filter(w => wedgeAnalysisBucketFor(w.distanceToCover) === b);
    const vals = bucketShots.map(WedgeAnalytics.wedgeShotSG).filter(v => v !== null);
    const avg = vals.length ? vals.reduce((a, c) => a + c, 0) / vals.length : null;
    return { label: wedgeAnalysisBucketLabel(b), value: avg };
  });
  const maxAbs = Math.max(0.5, ...entries.filter(e => e.value !== null).map(e => Math.abs(e.value)));
  const rowsHtml = entries.map(e => {
    if (e.value === null) return `<div class="wg-sg-bar-row"><div class="wg-sg-bar-label">${e.label}</div><div class="wg-sg-bar-track"><div class="wg-sg-bar-center"></div></div><div class="wg-sg-bar-value">--</div></div>`;
    const pct = Math.min(50, Math.abs(e.value) / maxAbs * 50);
    const side = e.value >= 0 ? 'pos' : 'neg';
    const style = e.value >= 0 ? `left:50%;width:${pct}%;` : `right:50%;width:${pct}%;`;
    return `<div class="wg-sg-bar-row"><div class="wg-sg-bar-label">${e.label}</div><div class="wg-sg-bar-track"><div class="wg-sg-bar-center"></div><div class="wg-sg-bar-fill ${side}" style="${style}"></div></div><div class="wg-sg-bar-value">${WedgeAnalytics.fmtSG(e.value)}</div></div>`;
  }).join('');
  return `
    ${WedgeUI.topbar("Wedging", "parcours", WedgeUI.ICONS.more)}
    ${WedgeUI.analysisHeader("ANALYSE", "Strokes Gained", "Estimation du gain de coups par palier de distance à faire (référence PGA Tour).")}
    <section class="wg-section">${wedgeShotsLimitRowHtml()}</section>
    <section class="wg-section">${rowsHtml}</section>
    ${WedgeUI.bottomNav("sg")}
  `;
};

/* --- EXERCICES = Créatif : liste, modale, session, revue (état en cascade, comme l'ancienne version) --- */
// Carte "À reprendre" en tête de la liste des exercices : une par session interrompue (la plus récente en premier)
function wedgeSessionProgressText(session) {
  if (session.elevator) { const n = session.history.length; return `${n} balle${n > 1 ? 's' : ''} jouée${n > 1 ? 's' : ''}`; }
  const total = session.distances.reduce((n, d) => n + d.results.length, 0);
  const done = session.distances.reduce((n, d) => n + d.results.filter(r => r !== null).length, 0);
  return `${done} / ${total} balles`;
}
function resumeWedgeExercise(id) { wedgeResumePopupExerciseId = id; resumeWedgeExerciseFromPopup(); }
function wedgeResumeCardsHtml() {
  const cards = wedgeInProgressSessions.slice().reverse().map(entry => {
    const ex = wedgeExercises.find(e => e.id === entry.exerciseId);
    if (!ex || !entry.session) return '';
    return `<div class="wg-resume-card">
      <span class="wg-resume-card-label">À reprendre</span>
      <b class="wg-resume-card-name">${appEscapeHtml(ex.name)}</b>
      <span class="wg-text-muted-sm">${wedgeSessionProgressText(entry.session)}</span>
      <button class="wg-btn-primary mt-8" onclick="resumeWedgeExercise(${ex.id})">Reprendre</button>
    </div>`;
  }).join('');
  return cards ? `<div class="wg-list mb-10">${cards}</div>` : '';
}
function wedgeExercisesListHtml() {
  const isHistory = wedgeExercisesTab === 'history';
  return `
    ${WedgeUI.header({ title: "WEDGING", backLabel: "Accueil", backHash: "app-home", rightIcon: WedgeUI.ICONS.more })}
    ${WedgeUI.navCards("exercices")}
    <div class="wg-chip-row mb-10">
      <button class="wg-chip ${isHistory ? '' : 'active'}" onclick="setWedgeExercisesTab('list')">Exercices</button>
      <button class="wg-chip ${isHistory ? 'active' : ''}" onclick="setWedgeExercisesTab('history')">Historique</button>
    </div>
    ${isHistory ? wedgeExerciseHistoryHtml() : `
      ${wedgeResumeCardsHtml()}
      <div class="wg-toolbar"><span class="wg-toolbar-title">MES EXERCICES</span><button class="wg-chip active" onclick="openWedgeExerciseModal()">${WedgeUI.ICONS.plus} Créer</button></div>
      <div class="wg-chip-row mb-10">${wedgeSortBtnHtml('exercisesSort')}</div>
      <div class="wg-list mb-70">${wedgeExercises.length ? wedgeSortedExercises().map(ex => wedgeExerciseCardHtml(ex)).join('') : '<p class="wg-empty-state">Aucun exercice pour le moment.</p>'}</div>
    `}
    ${!isHistory ? `<div class="wg-fab"><button class="wg-btn-primary" onclick="startSelectedWedgeExercise()">Lancer l'exercice →</button></div>` : ''}
    ${wedgeExerciseModalOpen ? wedgeExerciseModalHtml() : ''}
    ${wedgeDistancesPopupOpen ? wedgeDistancesPopupHtml() : ''}
    ${wedgeResultModePopupOpen ? wedgeResultModePopupHtml() : ''}
    ${wedgeBallsPopupOpen ? wedgeBallsPopupHtml() : ''}
    ${wedgeConfirmDeleteExerciseId !== null ? wedgeConfirmDeleteModalHtml() : ''}
    ${wedgeResumePopupExerciseId !== null ? wedgeResumePopupHtml() : ''}
    ${wedgeEditConflictPopupOpen ? wedgeEditConflictPopupHtml() : ''}
    ${wedgeConfirmDeleteLogId !== null ? wedgeConfirmDeleteLogModalHtml() : ''}
    ${wedgeSortPopupHtml()}
  `;
}
WedgeViews.exercices = function () {
  if (wedgeExRecap) return wedgeExRecapScreenHtml();
  if (wedgeExSession) return wedgeExSession.elevator ? wedgeExElevatorScreenHtml() : wedgeExSessionScreenHtml();
  if (wedgeReviewExerciseId !== null) return wedgeExerciseReviewHtml();
  return wedgeExercisesListHtml();
};

/* ============================ MENU 3 POINTS ================================ */
// Réglages d'affichage enregistrés dans golfevolution_module_prefs.wedging (voir commun.js) :
//   defaultAnalysis : 'dispersion' | 'distance' | 'sg'  — analyse ouverte par "Voir mes analyses"
//   step            : 5 | 10                            — pas des paliers des analyses (affichage seulement)
// Ce menu est aussi le seul accès aux écrans d'analyse depuis le Journal et les Exercices.
const WEDGE_ANALYSIS_VIEWS = [
  { value: 'dispersion', label: 'Dispersion', route: 'dispersion-analysis' },
  { value: 'distance', label: 'Distance', route: 'distance-analysis' },
  { value: 'sg', label: 'SG', route: 'sg-analysis' },
];
function wedgeDefaultAnalysis() {
  const saved = appPrefGet('wedging', 'defaultAnalysis', 'dispersion');
  return WEDGE_ANALYSIS_VIEWS.find(v => v.value === saved) || WEDGE_ANALYSIS_VIEWS[0];
}
function openWedgingMenu() {
  const current = wedgeDefaultAnalysis();
  const hintFor = v => `Ouvre « ${v.label} » (vue par défaut).`;
  const openItem = {
    type: 'action', label: 'Voir mes analyses', hint: hintFor(current),
    onClick: () => WedgeRouter.go(wedgeDefaultAnalysis().route)
  };
  appSheet({
    title: 'Wedging',
    sections: [
      {
        title: 'Analyses',
        items: [
          openItem,
          {
            type: 'segment', label: 'Vue d\'analyse par défaut', value: current.value,
            options: WEDGE_ANALYSIS_VIEWS.map(v => ({ value: v.value, label: v.label })),
            onChange: v => {
              appPrefSet('wedging', 'defaultAnalysis', v);
              openItem.hint = hintFor(wedgeDefaultAnalysis());
            }
          },
        ]
      }
    ]
  });
}
window.openWedgingMenu = openWedgingMenu;

/* =============================== 7. ROUTEUR =================================== */

const WedgeRouter = (function () {
  let lastPath = null;
  // Dernière route Wedging affichée : sert quand le hash appartient à un autre module (Gym écrit aussi dans location.hash)
  let current = { path: "parcours", params: new URLSearchParams() };
  // Wedging ne touche ni au body ni au scroll tant que sa page n'est pas celle affichée
  function isActive() { return !!document.getElementById("page-wedging")?.classList.contains("active"); }
  const ROUTES = {
    "home": { view: WedgeViews.home },
    "parcours": { view: WedgeViews.parcours },
    "dispersion-analysis": { view: WedgeViews.dispersionAnalysis },
    "distance-analysis": { view: WedgeViews.distanceAnalysis },
    "sg-analysis": { view: WedgeViews.sgAnalysis },
    "exercices": { view: WedgeViews.exercices }
  };
  function parseHash() {
    const hash = location.hash.replace(/^#/, "");
    const [path, query] = hash.split("?");
    return { path: (path && path !== "home") ? path : "parcours", params: new URLSearchParams(query || "") };
  }
  function render() {
    const parsed = parseHash();
    // Hash étranger (ex. #programmes de Gym) : on garde la route Wedging courante au lieu de retomber sur Parcours
    if (Object.prototype.hasOwnProperty.call(ROUTES, parsed.path)) current = parsed;
    const { path, params } = current;
    const route = ROUTES[path];
    const active = isActive();
    const changed = path !== lastPath;
    lastPath = path;
    try {
      document.getElementById("wedging-app").innerHTML = route.view(params);
    } catch (e) {
      const detail = (e && e.stack) ? e.stack : String(e);
      console.error(e);
      try { WedgeUI.toast('Erreur : ' + (e && e.message ? e.message : e)); } catch (_) {}
      document.getElementById("wedging-app").innerHTML =
        '<div style="padding:30px 20px;color:#fff;max-width:520px;margin:0 auto;">' +
        '<h3 style="color:#FF5C5C;margin-bottom:10px;">Erreur de rendu</h3>' +
        '<p style="color:#B6B6B6;font-size:13px;margin-bottom:14px;">Copie ce message pour le signaler :</p>' +
        '<pre style="white-space:pre-wrap;word-break:break-word;font-size:11.5px;color:#B6B6B6;background:#0B0F14;border:1px solid #1A2330;border-radius:12px;padding:14px;">' +
        detail.replace(/</g, '&lt;') + '</pre>' +
        '<button class="wg-btn-secondary" style="margin-top:14px;" onclick="WedgeRouter.go(\'parcours\')">Retour à l\'accueil</button>' +
        '</div>';
    }
    // Piles de l'historique : mise en page sans animation au rendu, puis transitions activées pour les dépliages
    try {
      wedgeLayoutAllStacks();
      requestAnimationFrame(() => document.querySelectorAll('#page-wedging .wg-stack').forEach(el => el.classList.add('is-ready')));
    } catch (_) {}
    if (changed && active) requestAnimationFrame(() => window.scrollTo(0, 0));
  }
  function go(hash) { location.hash = "#" + hash; }
  // Un changement de hash n'est traité que si Wedging est affiché : sinon c'est un autre module (Gym, liens #...) qui navigue
  window.addEventListener("hashchange", () => { if (isActive()) render(); });
  window.addEventListener("DOMContentLoaded", render);
  // Recalcule les piles quand la page devient visible (display:none -> mesures à 0 au rendu) ou change de largeur
  window.addEventListener("DOMContentLoaded", () => {
    const appEl = document.getElementById("wedging-app");
    if (appEl && window.ResizeObserver) new ResizeObserver(() => wedgeLayoutAllStacks()).observe(appEl);
  });
  // Toast d'erreur : uniquement pour une erreur levée par wedging.js pendant que Wedging est affiché
  window.addEventListener("error", (e) => {
    if (!isActive() || !/wedging\.js/.test(e.filename || "")) return;
    try { WedgeUI.toast('Erreur JS : ' + e.message); } catch (_) {}
  });
  return { go, render };
})();

// Unité de distance changée (Menu ou Parcours) : la vue Wedging se redessine dans la nouvelle unité, même masquée
window.addEventListener('golf-units-changed', () => {
  wedgeRadarDistances = new Set(); wedgeHistoryDistanceFilter = new Set(); wedgeNewShotBucket = undefined; // les paliers choisis ou cochés étaient dans l'ancienne unité
  if (document.getElementById('wedging-app')) WedgeRouter.render();
});
