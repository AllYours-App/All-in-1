/* ==========================================================================
   WEDGING — Application complète en un seul fichier JS (SPA, vanilla JS)
   Fusion : coquille (routage, thème) + fonctionnalités portées de l'ancienne
   version fonctionnelle (wedge_2.js + extraits de shared-core_3.js pour le SG).
   Sections :
   1. Constantes partagées
   2. Storage (localStorage)
   3. Analytics (Strokes Gained, niceScale, radar SVG générique)
   4. UI (icônes, toast, layout, popup générique, roues de zones)
   5. État global "Wedge" + toutes les fonctions d'interaction (Parcours + Créatif)
   6. Vues (une fonction render par écran)
   7. Routeur (navigation par hash, sans rechargement de page)
   ========================================================================== */

/* ============================ 1. CONSTANTES ================================ */

// Cases de distance à faire (Journal Parcours), par paliers de 5m à partir de 50m
const WEDGE_BUCKETS = (() => { const arr = []; for (let d = 50; d <= 105; d += 5) arr.push(d); return arr; })();
// Ordre des 8 directions périphériques (hors centre), dans le sens horaire en partant du haut
const WEDGE_RADAR_ORDER = ['Long', 'Long-Droite', 'Droite', 'Court-Droite', 'Court', 'Court-Gauche', 'Gauche', 'Long-Gauche'];
// 9 zones sélectionnables au total : les 8 directions + le centre ("Green" = coup rentré)
const WEDGE_ZONES = [...WEDGE_RADAR_ORDER, 'Green'];
// Distances proposées pour construire un exercice Créatif (paliers de 5m, 10 à 100m)
const WEDGE_EXERCISE_DISTANCES = (() => { const arr = []; for (let d = 50; d <= 100; d += 5) arr.push(d); return arr; })();
const WEDGE_SHOTS_LIMIT_OPTIONS = [[20, '20'], [50, '50'], [100, '100'], ['all', 'Tous']];
const WEDGE_EX_REVIEW_LIMIT_OPTIONS = [10, 20, 50, 'all'];

function wedgeRadarShortLabel(zone) { return zone.split('-').map(w => w[0]).join('-'); }
function wedgeZoneDisplayLabel(zone) { return zone === 'Green' ? 'Trou' : zone; }

/* ============================== 2. STORAGE ================================= */

const Storage = (function () {
  const KEYS = { SHOTS: "wedgingShots", EXERCISES: "wedgingExercises" };
  function read(key) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : []; }
    catch (e) { console.error("Wedging: lecture impossible", key, e); return []; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; }
    catch (e) { console.error("Wedging: écriture impossible", key, e); return false; }
  }
  return {
    getShots: () => read(KEYS.SHOTS),
    writeShots: (arr) => write(KEYS.SHOTS, arr),
    getExercises: () => read(KEYS.EXERCISES),
    writeExercises: (arr) => write(KEYS.EXERCISES, arr)
  };
})();

/* ============================== 3. ANALYTICS ================================ */

const Analytics = (function () {
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

  /* ---------- Moteur Strokes Gained (tables PGA Tour, copiées telles quelles) ---------- */
  const SG_EXPECTED_PUTTS_TABLE = [
    [1,1.001],[2,1.009],[3,1.053],[4,1.147],[5,1.256],[6,1.357],[7,1.443],[8,1.515],[9,1.575],[10,1.626],
    [11,1.665],[12,1.705],[13,1.735],[14,1.765],[15,1.806],[16,1.848],[17,1.829],[18,1.811],[19,1.837],[20,1.863],
    [21,1.875],[22,1.886],[23,1.897],[24,1.909],[25,1.921],[26,1.932],[27,1.944],[28,1.955],[29,1.966],[30,1.978],
    [31,1.986],[32,1.993],[33,2.001],[34,2.009],[35,2.017],[36,2.024],[37,2.032],[38,2.04],[39,2.047],[40,2.055],
    [45,2.089],[50,2.12],[60,2.174],[70,2.221],[80,2.261],[90,2.297],[100,2.328]
  ];
  function expectedPuttsForM(m) {
    const ft = (m === null || m === undefined || isNaN(m)) ? null : m * 3.28084;
    const table = SG_EXPECTED_PUTTS_TABLE;
    if (ft === null) return table[0][1];
    if (ft <= table[0][0]) return table[0][1];
    if (ft >= table[table.length - 1][0]) return table[table.length - 1][1];
    for (let i = 0; i < table.length - 1; i++) {
      const a = table[i], b = table[i + 1];
      if (ft >= a[0] && ft <= b[0]) { const t = (ft - a[0]) / (b[0] - a[0]); return a[1] + t * (b[1] - a[1]); }
    }
    return table[table.length - 1][1];
  }
  function expectedStrokesFromTable(table, x) {
    if (x === null || x === undefined || isNaN(x)) return table[0][1];
    if (x <= table[0][0]) return table[0][1];
    if (x >= table[table.length - 1][0]) return table[table.length - 1][1];
    for (let i = 0; i < table.length - 1; i++) {
      const a = table[i], b = table[i + 1];
      if (x >= a[0] && x <= b[0]) { const t = (x - a[0]) / (b[0] - a[0]); return a[1] + t * (b[1] - a[1]); }
    }
    return table[table.length - 1][1];
  }
  // Table Rough (yards) — seule table réellement utilisée par le Wedging (coup avant, depuis l'herbe)
  const SG_ROUGH_TABLE = [
    [10,2.34],[11,2.365],[12,2.39],[13,2.415],[14,2.44],[15,2.465],[16,2.49],[17,2.515],[18,2.54],[19,2.565],
    [20,2.59],[25,2.645],[30,2.7],[35,2.74],[40,2.78],[45,2.825],[50,2.87],[55,2.89],[60,2.91],[65,2.92],
    [70,2.93],[75,2.945],[80,2.96],[85,2.975],[90,2.99],[95,3.005],[100,3.02],[110,3.05],[120,3.08],[130,3.115],
    [140,3.15],[150,3.19],[160,3.23],[170,3.27],[180,3.31],[190,3.365],[200,3.42],[220,3.53],[240,3.64],[260,3.74],
    [280,3.83],[300,3.9],[320,3.95],[340,4.02],[360,4.11],[380,4.21],[400,4.3],[420,4.34],[440,4.39],[460,4.48],
    [480,4.59],[500,4.72],[520,4.85],[540,4.97],[560,5.05],[580,5.1],[600,5.13]
  ];
  const METERS_TO_YARDS = 1.09361;
  const SG_TABLES_BY_LIE = { Rough: SG_ROUGH_TABLE };
  function expectedStrokesForLie(lie, distanceMeters) {
    if (distanceMeters === null || distanceMeters === undefined) return null;
    if (lie === 'Green') return expectedPuttsForM(distanceMeters);
    const table = SG_TABLES_BY_LIE[lie];
    if (!table) return null;
    return expectedStrokesFromTable(table, distanceMeters * METERS_TO_YARDS);
  }
  function fmtSG(v) { return (v === null || v === undefined || Number.isNaN(v)) ? '--' : (v >= 0 ? '+' : '') + v.toFixed(2); }
  // SG d'un coup de wedge : coups attendus depuis l'herbe (distance à faire) - coups attendus après
  // (le résultat final traité comme un putt ; 0 si à moins de 5cm, assimilé à un coup rentré) - 1 coup joué.
  function wedgeShotSG(w) {
    const before = expectedStrokesForLie('Rough', w.distanceToCover);
    if (before === null) return null;
    const after = w.finalDistance <= 0.05 ? 0 : expectedPuttsForM(w.finalDistance);
    return before - after - 1;
  }

  /* ---------- Graphique radar générique (toile d'araignée) ---------- */
  function buildRadarChartSvg(items) {
    const n = items.length;
    const validVals = items.filter(it => it.value !== null && it.value !== undefined).map(it => it.value);
    const scaleMin = validVals.length ? Math.min(...validVals) : 0;
    const scaleMax = validVals.length ? Math.max(...validVals) : 1;
    const W = 320, H = 380, cx = W / 2, cy = 190, R = 105;
    const angleFor = i => (Math.PI * 2 * i / n) - Math.PI / 2;
    const radiusFor = v => {
      if (v === null || v === undefined) return 0;
      if (scaleMax === scaleMin) return R;
      return R * (v - scaleMin) / (scaleMax - scaleMin);
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

/* ================================ 4. UI ===================================== */

const UI = (function () {
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
      <div class="wg-header-side"><button class="wg-back-btn" onclick="${backHash === 'app-home' ? "showPage('home')" : "Router.go('" + backHash + "')"}">${ICONS.back} ${backLabel}</button></div>
      <h1 class="wg-title" style="${title === "WEDGING" ? "" : "font-size:16px;letter-spacing:2px;"}">${title}</h1>
      <div class="wg-header-side wg-header-right">${rightIcon ? `<button class="wg-icon-btn" id="headerRightBtn">${rightIcon}</button>` : ""}</div>
    </header>`;
  }
  function topbar(label, backHash, rightIcon) {
    return `<div class="wg-topbar">
      <button class="wg-back-btn" onclick="Router.go('${backHash}')">${ICONS.back} ${label}</button>
      <button class="wg-icon-btn" style="${rightIcon ? "" : "visibility:hidden;"}">${rightIcon || ""}</button>
    </div>`;
  }
  function analysisHeader(eyebrow, title, subtitle) {
    return `<div class="wg-analysis-header"><p class="wg-eyebrow">${eyebrow}</p><h1 class="wg-page-title">${title}</h1><p class="wg-page-subtitle">${subtitle}</p></div>`;
  }
  function navCards(active) {
    return `<nav class="wg-nav-cards">
      <div class="wg-nav-card ${active === "parcours" ? "active" : ""}" onclick="Router.go('parcours')"><div class="wg-nav-card-head">${ICONS.flag}<span class="wg-nav-card-title">PARCOURS</span></div><span class="wg-nav-card-desc">Saisie réelle ou test</span></div>
      <div class="wg-nav-card ${active === "exercices" ? "active" : ""}" onclick="Router.go('exercices')"><div class="wg-nav-card-head">${ICONS.target}<span class="wg-nav-card-title">EXERCICES</span></div><span class="wg-nav-card-desc">Entraînement structuré</span></div>
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
      `<button class="wg-bottom-nav-item ${it.key === activeKey ? "active" : ""}" onclick="Router.go('${it.route}')">${it.icon}<span>${it.label}</span></button>`
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
  /* ---------- Clavier numérique réutilisable (distance finale, rayon de validation) ---------- */
  function keypad(pressFn, backspaceFn, extraKey) {
    const extra = extraKey ? `<button type="button" onclick="${extraKey.fn}">${extraKey.label}</button>` : `<button type="button" onclick="wedgeKeypadClear()">C</button>`;
    return `<div class="wg-keypad">
      ${[1,2,3,4,5,6,7,8,9].map(n => `<button type="button" onclick="${pressFn}('${n}')">${n}</button>`).join('')}
      ${extra}
      <button type="button" onclick="${pressFn}('0')">0</button>
      <button type="button" onclick="${backspaceFn}()">&larr;</button>
    </div>`;
  }

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
  function twoRingWheelSvg(currentResult) {
    const cx = 100, cy = 100;
    const selDir = currentResult && typeof currentResult === 'object' ? currentResult.direction : null;
    const selRing = currentResult && typeof currentResult === 'object' ? currentResult.ring : null;
    const sectorsHtml = WEDGE_RADAR_ORDER.map((dir, i) => {
      const startDeg = i * 45 + CIRCLE_ANGLE_OFFSET, endDeg = startDeg + 45;
      const innerPath = sectorPath(cx, cy, R_HOLE, R_IN, startDeg, endDeg);
      const outerPath = sectorPath(cx, cy, R_IN, R_OUT, startDeg, endDeg);
      const [ix, iy] = sectorCentroid(cx, cy, R_HOLE, R_IN, startDeg, endDeg);
      const [ox, oy] = sectorCentroid(cx, cy, R_IN, R_OUT, startDeg, endDeg);
      return `<path d="${innerPath}" class="wg-wheel-sector wg-wheel-sector--in" onclick="setWedgeExCircleZone('${dir}','in')"/>
        <path d="${outerPath}" class="wg-wheel-sector wg-wheel-sector--out" onclick="setWedgeExCircleZone('${dir}','out')"/>
        ${selDir === dir && selRing === 'in' ? `<circle cx="${ix.toFixed(2)}" cy="${iy.toFixed(2)}" r="7" class="wg-wheel-ball"/>` : ''}
        ${selDir === dir && selRing === 'out' ? `<circle cx="${ox.toFixed(2)}" cy="${oy.toFixed(2)}" r="7" class="wg-wheel-ball"/>` : ''}`;
    }).join('');
    return `<svg viewBox="0 0 200 200" class="wg-wheel">${sectorsHtml}<circle cx="${cx}" cy="${cy}" r="${R_HOLE}" class="wg-wheel-hole"/></svg>`;
  }

  return { ICONS, toast, formatDate, header, topbar, analysisHeader, navCards, bottomNav, modal, keypad, wheelSvg, twoRingWheelSvg };
})();

/* ==================== 5. ÉTAT GLOBAL WEDGE + INTERACTIONS ==================== */
/* Reprend fidèlement la logique de l'ancienne version : état mutable en mémoire,
   persisté à chaque modification, et un simple "rerender()" (= re-rendu de la
   route courante) après chaque action, exactement comme l'ancien renderWedgeTab(). */

function rerender() { Router.render(); }

// --- Journal (Parcours) ---
let wedgeRounds = normalizeWedgeRounds(Storage.getShots());
let wedgeNewShotBucket = WEDGE_BUCKETS[0];
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

function persistWedgeRounds() { Storage.writeShots(wedgeRounds); }

function setWedgeNewShotBucket(b) { wedgeNewShotBucket = b; rerender(); }
function wedgeKeypadPress(digit) { if (wedgeNewShotFinal.length >= 3) return; wedgeNewShotFinal += digit; rerender(); }
function wedgeKeypadBackspace() { wedgeNewShotFinal = wedgeNewShotFinal.slice(0, -1); rerender(); }
function wedgeKeypadClear() { wedgeNewShotFinal = ''; rerender(); }
function setWedgeNewShotZone(z) { wedgeNewShotZone = z; rerender(); }
function openWedgeFinalPopup() { wedgeFinalPopupOpen = true; rerender(); }
function closeWedgeFinalPopup() { wedgeFinalPopupOpen = false; rerender(); }
function wedgeFinalPopupHtml() {
  return UI.modal('Distance finale', `
    <div class="wg-keypad-value">${wedgeNewShotFinal ? wedgeNewShotFinal : '0'}m</div>
    ${UI.keypad('wedgeKeypadPress', 'wedgeKeypadBackspace')}
    <button class="wg-btn-primary mt-10" onclick="closeWedgeFinalPopup()">OK</button>
  `, 'closeWedgeFinalPopup');
}
function addWedgeRound() {
  if (wedgeNewShotBucket === null || wedgeNewShotFinal === '' || !wedgeNewShotZone) return;
  wedgeRounds.push({ id: Date.now(), date: new Date().toISOString(), distanceToCover: wedgeNewShotBucket, zone: wedgeNewShotZone, finalDistance: parseFloat(wedgeNewShotFinal) });
  wedgeNewShotBucket = null; wedgeNewShotFinal = ''; wedgeNewShotZone = null;
  persistWedgeRounds();
  UI.toast('Coup ajouté');
  rerender();
}
function deleteWedgeRound(id) { wedgeRounds = wedgeRounds.filter(w => w.id !== id); persistWedgeRounds(); rerender(); }

function wedgeBucketFor(distance) { return Math.round(distance / 5) * 5; }
function wedgeLimitedRounds() {
  const sorted = wedgeRounds.slice().sort((a, b) => b.id - a.id);
  return wedgeShotsLimit === 'all' ? sorted : sorted.slice(0, wedgeShotsLimit);
}
function openWedgeShotsLimitPopup() { wedgeShotsLimitPopupOpen = true; rerender(); }
function closeWedgeShotsLimitPopup() { wedgeShotsLimitPopupOpen = false; rerender(); }
function chooseWedgeShotsLimit(l) { wedgeShotsLimit = l; wedgeShotsLimitPopupOpen = false; rerender(); }
function wedgeShotsLimitButtonHtml() {
  const label = wedgeShotsLimit === 'all' ? 'Tous' : wedgeShotsLimit;
  return `<button class="wg-chip ${wedgeShotsLimit !== 'all' ? 'active' : ''}" onclick="openWedgeShotsLimitPopup()">Nombre de coups (${label})</button>`;
}
function wedgeShotsLimitPopupHtml() {
  return UI.modal('Nombre de coups', `
    <div class="wg-chip-row">${WEDGE_SHOTS_LIMIT_OPTIONS.map(([v, label]) => `<button type="button" class="wg-chip ${wedgeShotsLimit === v ? 'active' : ''}" onclick="chooseWedgeShotsLimit(${typeof v === 'number' ? v : `'${v}'`})">${label}</button>`).join('')}</div>
  `, 'closeWedgeShotsLimitPopup');
}
function wedgeShotsLimitRowHtml() {
  return `<div class="wg-chip-row">${wedgeShotsLimitButtonHtml()}</div>${wedgeShotsLimitPopupOpen ? wedgeShotsLimitPopupHtml() : ''}`;
}
function wedgeShotsWithResult() { return wedgeLimitedRounds().filter(w => w.zone); }

function wedgeHistoryFilteredRounds() {
  return wedgeLimitedRounds().filter(w => {
    const okDistance = wedgeHistoryDistanceFilter.size === 0 || wedgeHistoryDistanceFilter.has(w.distanceToCover);
    const okZone = wedgeHistoryZoneFilter.size === 0 || wedgeHistoryZoneFilter.has(w.zone);
    return okDistance && okZone;
  });
}
function resetWedgeHistoryFilters() { wedgeHistoryDistanceFilter = new Set(); wedgeHistoryZoneFilter = new Set(); rerender(); }
function openWedgeHistoryDistancePopup() { wedgeHistoryDistancePopupOpen = true; rerender(); }
function closeWedgeHistoryDistancePopup() { wedgeHistoryDistancePopupOpen = false; rerender(); }
function toggleWedgeHistoryDistance(d) { wedgeHistoryDistanceFilter.has(d) ? wedgeHistoryDistanceFilter.delete(d) : wedgeHistoryDistanceFilter.add(d); rerender(); }
function wedgeHistoryDistancePopupHtml() {
  const buckets = Array.from(new Set(wedgeRounds.map(w => w.distanceToCover))).sort((a, b) => a - b);
  return UI.modal('Trier par distance', `
    <div class="wg-chip-row">${buckets.length ? buckets.map(b => `<button type="button" class="wg-chip ${wedgeHistoryDistanceFilter.has(b) ? 'active' : ''}" onclick="toggleWedgeHistoryDistance(${b})">${b}-${b + 4}m</button>`).join('') : '<p class="wg-text-muted">Aucun coup enregistré.</p>'}</div>
    <button class="wg-btn-primary mt-10" onclick="closeWedgeHistoryDistancePopup()">OK</button>
  `, 'closeWedgeHistoryDistancePopup');
}
function openWedgeHistoryZonePopup() { wedgeHistoryZonePopupOpen = true; rerender(); }
function closeWedgeHistoryZonePopup() { wedgeHistoryZonePopupOpen = false; rerender(); }
function toggleWedgeHistoryZone(z) { wedgeHistoryZoneFilter.has(z) ? wedgeHistoryZoneFilter.delete(z) : wedgeHistoryZoneFilter.add(z); rerender(); }
function wedgeHistoryZonePopupHtml() {
  return UI.modal('Trier par type de raté', `
    <div class="wg-grid-3">${WEDGE_ZONES.map(z => `<button type="button" class="wg-chip" style="${wedgeHistoryZoneFilter.has(z) ? 'background:var(--wg-accent);color:#0B0F14;border-color:var(--wg-accent);font-weight:700;' : ''}" onclick="toggleWedgeHistoryZone('${z}')">${wedgeZoneDisplayLabel(z)}</button>`).join('')}</div>
    <button class="wg-btn-primary mt-10" onclick="closeWedgeHistoryZonePopup()">OK</button>
  `, 'closeWedgeHistoryZonePopup');
}
function wedgeHistoryFiltersRowHtml() {
  const anyFilter = wedgeHistoryDistanceFilter.size || wedgeHistoryZoneFilter.size;
  return `<div class="wg-chip-row wg-chip-row--scroll">
      ${wedgeShotsLimitButtonHtml()}
      <button class="wg-chip ${wedgeHistoryDistanceFilter.size ? 'active' : ''}" onclick="openWedgeHistoryDistancePopup()">Distance${wedgeHistoryDistanceFilter.size ? ` (${wedgeHistoryDistanceFilter.size})` : ''}</button>
      <button class="wg-chip ${wedgeHistoryZoneFilter.size ? 'active' : ''}" onclick="openWedgeHistoryZonePopup()">Type de raté${wedgeHistoryZoneFilter.size ? ` (${wedgeHistoryZoneFilter.size})` : ''}</button>
      ${anyFilter ? `<button class="wg-chip" onclick="resetWedgeHistoryFilters()">Réinitialiser</button>` : ''}
    </div>
    ${wedgeShotsLimitPopupOpen ? wedgeShotsLimitPopupHtml() : ''}`;
}

// --- Toile d'araignée (Dispersion) ---
function setWedgeRadarDistance(b) {
  if (wedgeRadarDistances.has(b)) { if (wedgeRadarDistances.size > 1) wedgeRadarDistances.delete(b); }
  else wedgeRadarDistances.add(b);
  rerender();
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
  return (Array.isArray(list) ? list : [])
    .filter(w => w && typeof w.distanceToCover === 'number' && typeof w.zone === 'string' && typeof w.finalDistance === 'number');
}
let wedgeExercises = normalizeWedgeExercises(Storage.getExercises());
let wedgeExerciseModalOpen = false;
let editingWedgeExerciseId = null;
let wedgeExerciseForm = null;
let wedgeDistancesPopupOpen = false;
let wedgeResultModePopupOpen = false;
let wedgeRadiusPopupOpen = false;
let wedgeRadiusInput = '';
let selectedWedgeExerciseId = null;
let wedgeReviewExerciseId = null;
let wedgeReviewChartIndex = 0;
let wedgeViewedLogId = null;
let wedgeExRadarDistance = null;
let wedgeExReviewLimit = 20;
let wedgeExSession = null;

function persistWedgeExercises() { Storage.writeExercises(wedgeExercises); }

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
function resultModeLabel(mode) { return mode === 'zone' ? '9 zones' : mode === 'distance' ? 'Distance libre' : mode === 'elevator' ? 'Ascenseur' : 'In / Out'; }

function saveWedgeExercise() {
  const f = wedgeExerciseForm;
  if (!f.name || !f.name.trim()) { UI.toast('Donne un titre à ton exercice.'); return; }
  if (!f.distances.size) { UI.toast('Sélectionne au moins une distance.'); return; }
  if (f.resultMode === 'elevator' && f.distances.size < 2) { UI.toast("Choisis au moins 2 distances pour l'ascenseur."); return; }
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
    if (existing) Object.assign(existing, payload);
  } else {
    wedgeExercises.push({ id: Date.now(), logs: [], ...payload });
  }
  persistWedgeExercises();
  closeWedgeExerciseModal();
}
let wedgeConfirmDeleteExerciseId = null;
function askDeleteWedgeExercise(id) { wedgeConfirmDeleteExerciseId = id; rerender(); }
function cancelDeleteWedgeExercise() { wedgeConfirmDeleteExerciseId = null; rerender(); }
function confirmDeleteWedgeExercise() {
  const id = wedgeConfirmDeleteExerciseId;
  wedgeExercises = wedgeExercises.filter(e => e.id !== id);
  if (wedgeExSession && wedgeExSession.exerciseId === id) wedgeExSession = null;
  if (selectedWedgeExerciseId === id) selectedWedgeExerciseId = null;
  if (wedgeReviewExerciseId === id) { wedgeReviewExerciseId = null; wedgeViewedLogId = null; }
  wedgeConfirmDeleteExerciseId = null;
  persistWedgeExercises(); rerender();
}
function wedgeConfirmDeleteModalHtml() {
  const ex = wedgeExercises.find(e => e.id === wedgeConfirmDeleteExerciseId);
  return UI.modal('Supprimer l\'exercice', `
    <p class="wg-text-muted mb-10">Supprimer définitivement « ${ex ? ex.name : ''} » ? Cette action est irréversible.</p>
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
  return UI.modal('Distances', `
    <div class="wg-chip-row">${WEDGE_EXERCISE_DISTANCES.map(d => `<button type="button" class="wg-chip ${f.distances.has(d) ? 'active' : ''}" onclick="toggleWedgeExerciseDistance(${d})">${d}m</button>`).join('')}</div>
    <button class="wg-btn-primary mt-10" onclick="closeWedgeDistancesPopup()">OK</button>
  `, 'closeWedgeDistancesPopup');
}
function openWedgeResultModePopup() { wedgeResultModePopupOpen = true; rerender(); }
function closeWedgeResultModePopup() { wedgeResultModePopupOpen = false; rerender(); }
function setWedgeExerciseResultMode(mode) { wedgeExerciseForm.resultMode = mode; rerender(); }
function setWedgeExerciseRadiusUnit(u) { wedgeExerciseForm.radiusUnit = u; rerender(); }
function openWedgeRadiusPopup() { wedgeRadiusInput = String(wedgeExerciseForm.radius || ''); wedgeRadiusPopupOpen = true; rerender(); }
function closeWedgeRadiusPopup() { wedgeRadiusPopupOpen = false; rerender(); }
function wedgeRadiusKeyPress(k) { if (k === '.' && wedgeRadiusInput.includes('.')) return; if (wedgeRadiusInput.length >= 5) return; wedgeRadiusInput += k; rerender(); }
function wedgeRadiusBackspace() { wedgeRadiusInput = wedgeRadiusInput.slice(0, -1); rerender(); }
function confirmWedgeRadius() { const n = parseFloat(wedgeRadiusInput); if (!isNaN(n) && n > 0) wedgeExerciseForm.radius = n; closeWedgeRadiusPopup(); }
function wedgeRadiusPopupHtml() {
  return UI.modal('Rayon de validation', `
    <div class="wg-keypad-value">${wedgeRadiusInput || '0'}${wedgeExerciseForm.radiusUnit}</div>
    ${UI.keypad('wedgeRadiusKeyPress', 'wedgeRadiusBackspace', { fn: "wedgeRadiusKeyPress('.')", label: '.' })}
    <button class="wg-btn-primary mt-10" onclick="confirmWedgeRadius()">OK</button>
  `, 'closeWedgeRadiusPopup');
}
function incWedgeExerciseBalls(delta) {
  const f = wedgeExerciseForm; f.ballsPerDistance = Math.max(1, Math.min(30, f.ballsPerDistance + delta)); rerender();
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
      <div class="wg-modal-head"><h3>${editingWedgeExerciseId !== null ? "Éditer l'exercice" : 'Nouvel exercice'}</h3><button class="wg-modal-close" onclick="closeWedgeExerciseModal()">${UI.ICONS.close}</button></div>
      <div class="wg-field"><label>Titre</label><input type="text" class="wg-input" placeholder="Titre de l'exercice" value="${f.name}" oninput="updateWedgeExerciseName(this.value)"></div>
      <div class="wg-field"><label>Description</label><textarea class="wg-textarea" placeholder="Description (optionnel)" rows="2" oninput="updateWedgeExerciseDescription(this.value)">${f.description}</textarea></div>
      <div class="wg-field-box-grid">
        <div class="wg-field-box ${f.resultMode === 'elevator' ? 'wg-col-span-full' : ''}" onclick="openWedgeDistancesPopup()">
          <div class="wg-field-box-label">${f.resultMode === 'elevator' ? 'Paliers (du plus court au plus long)' : 'Distances'}</div>
          <div class="wg-field-box-value">${distList.length ? distList.map(d => d + 'm').join(', ') : 'Choisir'}</div>
        </div>
        ${f.resultMode === 'elevator' ? '' : `<div class="wg-stepper"><div class="wg-field-box-label">Balles / distance</div><div class="wg-stepper-controls"><button type="button" onclick="incWedgeExerciseBalls(-1)">−</button><span class="wg-stepper-value">${f.ballsPerDistance}</span><button type="button" onclick="incWedgeExerciseBalls(1)">+</button></div></div>`}
      </div>
      <div class="wg-field-box-grid">
        <div class="wg-field-box wg-col-span-full" onclick="openWedgeResultModePopup()">
          <div class="wg-field-box-label">Enregistrement du résultat</div>
          <div class="wg-field-box-value">${resultModeLabel(f.resultMode)}${(f.resultMode === 'inout' || f.resultMode === 'zone') ? ` — rayon ${f.radius}${f.radiusUnit}` : ''}</div>
        </div>
      </div>
      <button class="wg-btn-primary" onclick="saveWedgeExercise()">${editingWedgeExerciseId !== null ? 'Enregistrer les modifications' : 'Enregistrer'}</button>
    </div>
  </div>`;
}
function wedgeResultModePopupHtml() {
  const f = wedgeExerciseForm;
  const options = [['zone', '9 zones'], ['distance', 'Distance libre'], ['inout', 'In / Out'], ['elevator', 'Ascenseur']];
  return `${UI.modal('Enregistrement du résultat', `
    <div class="wg-chip-row">${options.map(([v, label]) => `<button type="button" class="wg-chip ${f.resultMode === v ? 'active' : ''}" onclick="setWedgeExerciseResultMode('${v}')">${label}</button>`).join('')}</div>
    ${f.resultMode === 'elevator' ? `
      <p class="wg-info-note mt-10">Balles illimitées. Choisis au moins 2 distances pour former les paliers.</p>
      <div class="mt-12">
        <div class="wg-field-box-label wg-text-center mb-6">Validation du palier</div>
        <div class="wg-toggle-pair"><button type="button" class="${f.elevatorMode !== 'xy' ? 'active' : ''}" onclick="setWedgeElevatorMode('single')">1 balle</button><button type="button" class="${f.elevatorMode === 'xy' ? 'active' : ''}" onclick="setWedgeElevatorMode('xy')">X sur Y</button></div>
        <p class="wg-info-note mt-8">${f.elevatorMode === 'xy' ? "Réussis X balles sur une série de Y pour monter d'un palier. Sinon tu redescends d'un palier. Le changement n'a lieu qu'une fois la série terminée." : "Une réussite fait monter d'un palier, un raté fait redescendre d'un palier, immédiatement."}</p>
      </div>
      ${f.elevatorMode === 'xy' ? `
        <div class="wg-field-box-grid mt-10">
          <div class="wg-stepper"><div class="wg-field-box-label">Balles réussies requises (X)</div><div class="wg-stepper-controls"><button type="button" onclick="incWedgeElevatorX(-1)">−</button><span class="wg-stepper-value">${f.elevatorX}</span><button type="button" onclick="incWedgeElevatorX(1)">+</button></div></div>
          <div class="wg-stepper"><div class="wg-field-box-label">Sur combien de balles (Y)</div><div class="wg-stepper-controls"><button type="button" onclick="incWedgeElevatorY(-1)">−</button><span class="wg-stepper-value">${f.elevatorY}</span><button type="button" onclick="incWedgeElevatorY(1)">+</button></div></div>
        </div>` : ''}
    ` : ''}
    ${(f.resultMode === 'inout' || f.resultMode === 'zone') ? `
      <div class="wg-field-box-grid mt-10">
        <div class="wg-field-box" onclick="openWedgeRadiusPopup()"><div class="wg-field-box-label">Rayon de validation</div><div class="wg-field-box-value">${f.radius}${f.radiusUnit}</div></div>
        <div><div class="wg-field-box-label wg-text-center">Unité</div><div class="wg-toggle-pair"><button type="button" class="${f.radiusUnit === 'm' ? 'active' : ''}" onclick="setWedgeExerciseRadiusUnit('m')">m</button><button type="button" class="${f.radiusUnit === '%' ? 'active' : ''}" onclick="setWedgeExerciseRadiusUnit('%')">%</button></div></div>
      </div>` : ''}
    <button class="wg-btn-primary mt-10" onclick="closeWedgeResultModePopup()">OK</button>
  `, 'closeWedgeResultModePopup')}${wedgeRadiusPopupOpen ? wedgeRadiusPopupHtml() : ''}`;
}
function wedgeExerciseCardHtml(ex) {
  const lastLog = ex.logs.length ? ex.logs[ex.logs.length - 1] : null;
  const selected = selectedWedgeExerciseId === ex.id;
  const formatLabel = ex.resultMode === 'elevator'
    ? `${ex.distances.map(d => d + 'm').join(' → ')} — Ascenseur (${ex.elevatorMode === 'xy' ? `${ex.elevatorX} sur ${ex.elevatorY} balles` : '1 balle, balles illimitées'})`
    : `${ex.distances.map(d => d + 'm').join('/')} — ${ex.ballsPerDistance} balles/distance — ${resultModeLabel(ex.resultMode)}${(ex.resultMode === 'inout' || ex.resultMode === 'zone') ? ` (${ex.radius}${ex.radiusUnit})` : ''}`;
  return `<div class="wg-exercise-card2 ${selected ? 'selected' : ''}" onclick="selectWedgeExercise(${ex.id})">
    <div class="wg-exercise-card2-head">
      <b>${ex.name}</b>
      ${selected ? `<div class="wg-exercise-actions">
          <button title="Supprimer" onclick="event.stopPropagation(); askDeleteWedgeExercise(${ex.id})">${UI.ICONS.close}</button>
          <button title="Dupliquer" onclick="event.stopPropagation(); duplicateWedgeExercise(${ex.id})">${UI.ICONS.duplicate}</button>
          <button title="Modifier" onclick="event.stopPropagation(); openWedgeExerciseModal(${ex.id})">${UI.ICONS.edit}</button>
          <button title="Graphe" onclick="event.stopPropagation(); reviewWedgeExercise(${ex.id})">${UI.ICONS.chart}</button>
        </div>` : `<span class="wg-text-muted-sm">${lastLog ? UI.formatDate(lastLog.date) : ''}</span>`}
    </div>
    ${ex.description ? `<span class="wg-text-muted">${ex.description}</span>` : ''}
    <span class="wg-text-muted">${formatLabel}</span>
    ${lastLog ? `<div class="wg-text-muted-sm">Dernière session : ${UI.formatDate(lastLog.date)} — ${wedgeLogSummaryText(ex, lastLog)}</div>` : ''}
  </div>`;
}
function selectWedgeExercise(id) { selectedWedgeExerciseId = selectedWedgeExerciseId === id ? null : id; rerender(); }
function wedgeLogSummaryText(ex, log) {
  const s = log.summary;
  if (ex.resultMode === 'zone') return `${s.greenCount}/${s.total} réussis`;
  if (ex.resultMode === 'distance') return `distance moyenne ${s.avgDistance}m`;
  if (ex.resultMode === 'elevator') return `palier max ${s.maxDistance}m (${s.total} balles)`;
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
  if (!selectedWedgeExerciseId) { UI.toast("Sélectionne d'abord un exercice dans la liste."); return; }
  startWedgeExerciseSession(selectedWedgeExerciseId);
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
  else finishWedgeExSession();
}
function setWedgeExInOut(made) { setWedgeExAttemptResult(!!made); }
function submitWedgeExDistanceResult() {
  const el = document.getElementById('wedge-ex-session-distance-input');
  const val = parseFloat(el.value); if (isNaN(val)) return;
  setWedgeExAttemptResult(val);
}
function wedgeExResultDotClass(ex, r) {
  if (r === null || r === undefined) return '';
  if (ex.resultMode === 'inout') return r ? 'made' : 'missed';
  if (ex.resultMode === 'zone') return r.made ? 'made' : 'missed';
  return 'made';
}
function setWedgeExCircleZone(direction, ring) {
  const made = ring === 'in';
  const zone = made ? `${direction}-Proche` : direction;
  setWedgeExAttemptResult({ zone, direction, ring, made });
}
function wedgeExResultInputHtml(ex, currentResult) {
  if (ex.resultMode === 'zone') return `<div class="wg-text-muted wg-text-center mb-6">Vise le trou au centre — anneau intérieur = réussite, anneau extérieur = raté</div><div class="wg-wheel-wrap">${UI.twoRingWheelSvg(currentResult)}</div>`;
  if (ex.resultMode === 'distance') return `<div class="wg-field"><label>Distance obtenue (m)</label><input type="number" class="wg-input" id="wedge-ex-session-distance-input" placeholder="Distance (m)" min="0" value="${currentResult !== null && currentResult !== undefined ? currentResult : ''}"></div><button class="wg-btn-primary" onclick="submitWedgeExDistanceResult()">Valider le tir</button>`;
  return `<div class="wg-field-row"><button class="wg-result-btn ${currentResult === true ? 'success active' : 'success'}" onclick="setWedgeExInOut(true)">In</button><button class="wg-result-btn ${currentResult === false ? 'fail active' : 'fail'}" onclick="setWedgeExInOut(false)">Aller</button></div>`;
}
function wedgeExSessionScreenHtml() {
  const s = wedgeExSession; const ex = wedgeExercises.find(e => e.id === s.exerciseId);
  if (!ex) { wedgeExSession = null; return wedgeExercisesListHtml(); }
  const dist = s.distances[s.activeDistanceIdx]; const progress = wedgeExSessionProgress(s);
  const attemptsHtml = dist.results.map((r, idx) => `<button class="wg-attempt-btn ${idx === s.activeAttempt ? 'active' : ''}" onclick="setWedgeExActiveAttempt(${idx})"><span>${idx + 1}</span><span class="wg-dot ${wedgeExResultDotClass(ex, r)}"></span></button>`).join('');
  const distTabsHtml = s.distances.map((dd, idx) => `<button class="wg-ladder-item ${idx === s.activeDistanceIdx ? 'active' : ''}" onclick="setWedgeExActiveDistance(${idx})">${dd.distance}m</button>`).join('');
  const currentResult = dist.results[s.activeAttempt];
  return `<div class="wg-topbar"><button class="wg-back-btn" onclick="cancelWedgeExerciseSession()">${UI.ICONS.back} Quitter</button></div>
    <div class="wg-session-title">${ex.name}</div>
    <div class="wg-section-desc wg-text-center">${dist.distance}m — Balle ${s.activeAttempt + 1}/${dist.results.length}</div>
    <section class="wg-section"><h4 class="mb-8">Balles</h4><div class="wg-attempts-grid">${attemptsHtml}</div></section>
    <section class="wg-section">${wedgeExResultInputHtml(ex, currentResult)}</section>
    <div class="wg-bottom-stats-bar"><div><b>${progress.done} / ${progress.total}</b>Progression</div></div>
    <div class="wg-ladder-grid">${distTabsHtml}</div>
    <div style="height:24px;"></div>`;
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
  let summary;
  if (!shots.length) summary = ex.resultMode === 'distance' ? { avgDistance: 0, total: 0 } : { made: 0, greenCount: 0, total: 0, pct: 0 };
  else if (ex.resultMode === 'zone') { const greenCount = shots.filter(x => x.made).length; summary = { greenCount, total: shots.length, pct: Math.round((greenCount / shots.length) * 100) }; }
  else if (ex.resultMode === 'distance') summary = { avgDistance: Math.round((shots.reduce((n, x) => n + x.resultDistance, 0) / shots.length) * 100) / 100, total: shots.length };
  else { const made = shots.filter(x => x.made).length; summary = { made, total: shots.length, pct: Math.round((made / shots.length) * 100) }; }
  ex.logs.push({ id: Date.now(), date: new Date().toISOString(), shots, summary });
  wedgeExSession = null; persistWedgeExercises(); UI.toast('Session terminée'); rerender();
}
function wedgeExElevatorScreenHtml() {
  const s = wedgeExSession; const ex = wedgeExercises.find(e => e.id === s.exerciseId);
  if (!ex) { wedgeExSession = null; return wedgeExercisesListHtml(); }
  const distance = s.levels[s.currentLevelIdx]; const isXY = s.validationMode === 'xy';
  const ladderHtml = s.levels.map((d, idx) => `<div class="wg-ladder-item ${idx === s.currentLevelIdx ? 'active' : ''} ${idx > s.maxLevelIdx ? 'dim' : ''}">${d}m</div>`).join('');
  const recentDotsHtml = s.history.slice(-10).map(h => `<span class="wg-dot ${h.made ? 'made' : 'missed'}"></span>`).join('');
  const seriesHtml = isXY ? `<div class="wg-series-dots">${Array.from({ length: s.xyY }, (_, i) => { const r = s.levelAttempts[i]; const cls = r === true ? 'filled' : (r === false ? 'missed' : ''); return `<span class="wg-series-dot ${cls}"></span>`; }).join('')}</div>
    <div class="wg-info-note mb-10">Balle ${Math.min(s.levelAttempts.length + 1, s.xyY)} / ${s.xyY} — besoin de ${s.xyX} réussies pour monter</div>` : '';
  return `<div class="wg-topbar"><button class="wg-back-btn" onclick="cancelWedgeExerciseSession()">${UI.ICONS.back} Quitter</button></div>
    <div class="wg-session-title">${ex.name}</div>
    <div class="wg-section-desc wg-text-center">Palier ${s.currentLevelIdx + 1}/${s.levels.length} — ${distance}m</div>
    <p class="wg-text-muted wg-text-center mb-10">${isXY ? `Réussis ${s.xyX} balles sur ${s.xyY} pour monter d'un palier, sinon tu redescends — balles illimitées` : `Réussis pour monter d'un palier, rate pour redescendre — balles illimitées`}</p>
    <div class="wg-ladder-grid">${ladderHtml}</div>
    ${seriesHtml}
    <div class="wg-recent-dots">${recentDotsHtml || `<span class="wg-text-muted-sm">Aucun tir pour l'instant</span>`}</div>
    <div class="wg-field-row"><button class="wg-result-btn success" onclick="setWedgeExElevatorResult(true)">Réussi${isXY ? '' : ' ↑'}</button><button class="wg-result-btn fail" onclick="setWedgeExElevatorResult(false)">Raté${isXY ? '' : ' ↓'}</button></div>
    <div class="wg-bottom-stats-bar"><div><b>${s.history.length}</b>Balles</div><div><b>${s.levels[s.maxLevelIdx]}m</b>Meilleur palier</div></div>
    <button class="wg-btn-secondary mt-10" onclick="finishWedgeExElevatorSession()">Terminer la session</button>
    <div style="height:24px;"></div>`;
}
function setWedgeExElevatorResult(made) {
  const s = wedgeExSession; s.history.push({ levelIdx: s.currentLevelIdx, distance: s.levels[s.currentLevelIdx], made });
  if (s.validationMode === 'xy') {
    s.levelAttempts.push(made);
    if (s.levelAttempts.length >= s.xyY) {
      const successCount = s.levelAttempts.filter(Boolean).length; const passed = successCount >= s.xyX;
      if (passed) { s.currentLevelIdx = Math.min(s.currentLevelIdx + 1, s.levels.length - 1); s.maxLevelIdx = Math.max(s.maxLevelIdx, s.currentLevelIdx); }
      else s.currentLevelIdx = Math.max(s.currentLevelIdx - 1, 0);
      s.levelAttempts = [];
    }
  } else {
    if (made) { s.currentLevelIdx = Math.min(s.currentLevelIdx + 1, s.levels.length - 1); s.maxLevelIdx = Math.max(s.maxLevelIdx, s.currentLevelIdx); }
    else s.currentLevelIdx = Math.max(s.currentLevelIdx - 1, 0);
  }
  rerender();
}
function finishWedgeExElevatorSession() {
  const s = wedgeExSession; if (!s.history.length) { cancelWedgeExerciseSession(); return; }
  const ex = wedgeExercises.find(e => e.id === s.exerciseId); if (!ex) return;
  const shots = s.history.map(h => ({ distance: h.distance, made: h.made }));
  const summary = { total: shots.length, maxLevelIdx: s.maxLevelIdx, maxDistance: s.levels[s.maxLevelIdx], finalDistance: s.levels[s.currentLevelIdx] };
  ex.logs.push({ id: Date.now(), date: new Date().toISOString(), shots, summary });
  wedgeExSession = null; persistWedgeExercises(); UI.toast('Session terminée'); rerender();
}

function reviewWedgeExercise(id) { wedgeReviewExerciseId = id; wedgeReviewChartIndex = 0; wedgeViewedLogId = null; wedgeExRadarDistance = null; rerender(); }
function closeWedgeExerciseReview() { wedgeReviewExerciseId = null; wedgeViewedLogId = null; rerender(); }
function setWedgeReviewChart(i) { wedgeReviewChartIndex = i; rerender(); }
function viewWedgeExerciseLog(id) { wedgeViewedLogId = id; rerender(); }
function closeWedgeExerciseLog() { wedgeViewedLogId = null; rerender(); }
function wedgeReviewChartsFor(ex) {
  const charts = [];
  if (ex.resultMode === 'zone') charts.push({ title: "Toile d'araignée", build: () => wedgeExRadarHtml(ex) });
  charts.push({ title: 'Évolution', build: () => wedgeExEvolutionHtml(ex) });
  return charts;
}
function setWedgeExRadarDistance(d) { wedgeExRadarDistance = d; rerender(); }
function setWedgeExReviewLimit(v) { wedgeExReviewLimit = v; rerender(); }
function wedgeExRadarHtml(ex) {
  if (!wedgeExRadarDistance || !ex.distances.includes(wedgeExRadarDistance)) wedgeExRadarDistance = ex.distances[0];
  const limitedLogs = wedgeExReviewLimit === 'all' ? ex.logs : ex.logs.slice(-wedgeExReviewLimit);
  const shots = limitedLogs.flatMap(l => l.shots).filter(s => s.distance === wedgeExRadarDistance);
  const items = WEDGE_RADAR_ORDER.map(zone => {
    const count = shots.filter(s => s.zone === zone).length;
    const pct = shots.length ? Math.round((count / shots.length) * 100) : null;
    return { label: wedgeRadarShortLabel(zone), value: pct, display: pct !== null ? `${pct}%` : '—' };
  });
  return `<div class="wg-chip-row">${ex.distances.map(d => `<button class="wg-chip ${wedgeExRadarDistance === d ? 'active' : ''}" onclick="setWedgeExRadarDistance(${d})">${d}m</button>`).join('')}</div>
    <div class="wg-chip-row">${WEDGE_EX_REVIEW_LIMIT_OPTIONS.map(v => `<button class="wg-chip ${wedgeExReviewLimit === v ? 'active' : ''}" onclick="setWedgeExReviewLimit(${typeof v === 'number' ? v : `'${v}'`})">${v === 'all' ? 'Tous' : v}</button>`).join('')}</div>
    ${shots.length ? `<div class="wg-insight-card"><div class="wg-insight-card-title">Répartition à ${wedgeExRadarDistance}m (${shots.length} balle${shots.length > 1 ? 's' : ''})</div><div class="wg-insight-card-body">${Analytics.buildRadarChartSvg(items)}</div></div>` : ``}`;
}
function wedgeExEvolutionHtml(ex) {
  const valueFn = ex.resultMode === 'distance' ? l => l.summary.avgDistance : ex.resultMode === 'elevator' ? l => l.summary.maxDistance : l => l.summary.pct;
  const unitLabel = ex.resultMode === 'distance' ? 'Distance moyenne (m)' : ex.resultMode === 'elevator' ? 'Meilleur palier atteint (m)' : 'Réussite (%)';
  return wedgeExLineChart(ex.logs, valueFn, unitLabel);
}
function wedgeExLineChart(history, valueFn, unitLabel) {
  if (!history.length) return ``;
  const values = history.map(valueFn); const n = values.length;
  const scale = Analytics.niceScale(Math.min(...values), Math.max(...values));
  const W = 340, H = 260, padL = 40, padR = 14, padT = 14, padB = 30;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const xFor = i => padL + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const yFor = v => padT + plotH - ((v - scale.min) / ((scale.max - scale.min) || 1)) * plotH;
  const pointsAttr = values.map((v, i) => `${xFor(i)},${yFor(v)}`).join(' ');
  const dotsHtml = values.map((v, i) => `<circle cx="${xFor(i)}" cy="${yFor(v)}" r="5" class="wg-radar-dot" onclick="viewWedgeExerciseLog(${history[i].id})" style="cursor:pointer;"/>`).join('');
  const yGridHtml = scale.ticks.map(t => { const y = yFor(t); return `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" class="wg-radar-grid"/><text x="${padL - 6}" y="${y + 4}" class="wg-chart-axis-text" text-anchor="end">${t}</text>`; }).join('');
  const xStep = Math.max(1, Math.ceil(n / 6));
  const xLabelsHtml = values.map((_, i) => { if (i % xStep !== 0 && i !== n - 1) return ''; return `<text x="${xFor(i)}" y="${H - padB + 18}" class="wg-chart-axis-text" text-anchor="middle">${i + 1}</text>`; }).join('');
  return `<div class="wg-chart-axis-title">${unitLabel}</div><svg viewBox="0 0 ${W} ${H}" class="wg-radar-svg">${yGridHtml}<polyline points="${pointsAttr}" fill="none" class="wg-radar-shape" style="fill:none;"/>${dotsHtml}${xLabelsHtml}</svg>`;
}
function wedgeExerciseReviewHtml() {
  const ex = wedgeExercises.find(e => e.id === wedgeReviewExerciseId);
  if (!ex) { wedgeReviewExerciseId = null; return wedgeExercisesListHtml(); }
  if (wedgeViewedLogId !== null) return wedgeExerciseLogDetailHtml(ex);
  const logs = ex.logs; const charts = wedgeReviewChartsFor(ex);
  const chartHtml = charts[wedgeReviewChartIndex].build(logs);
  const dotsHtml = charts.map((c, i) => `<span class="${i === wedgeReviewChartIndex ? 'active' : ''}" onclick="setWedgeReviewChart(${i})"></span>`).join('');
  const sessionRows = logs.slice().reverse().map(l => `<li onclick="viewWedgeExerciseLog(${l.id})"><span>${UI.formatDate(l.date)}<br><span class="wg-text-muted-sm">${wedgeLogSummaryText(ex, l)}</span></span><span class="wg-text-muted-sm">${l.summary.total} balles</span></li>`).join('');
  return `<div class="wg-topbar"><button class="wg-back-btn" onclick="closeWedgeExerciseReview()">${UI.ICONS.back} Exercices</button></div>
    <div class="wg-session-title">${ex.name}</div>
    <div class="wg-insight-card-title wg-text-center mt-10">${charts[wedgeReviewChartIndex].title}</div>
    ${chartHtml}
    <div class="wg-carousel-dots">${dotsHtml}</div>
    <div class="wg-section-desc mt-10">Voir les sessions précédentes</div>
    <ul class="wg-session-list">${sessionRows || '<li>Aucune session pour cet exercice.</li>'}</ul>
    <div style="height:24px;"></div>`;
}
function wedgeExerciseLogDetailHtml(ex) {
  const log = ex.logs.find(l => l.id === wedgeViewedLogId);
  if (!log) return wedgeExerciseReviewHtml();
  const shotRows = log.shots.map((s, i) => {
    let resultLabel, dotClass = '';
    if (ex.resultMode === 'zone') { const dirLabel = s.direction || s.zone; resultLabel = `${dirLabel} — ${s.made ? 'Réussi' : 'Raté'}`; dotClass = s.made ? 'made' : 'missed'; }
    else if (ex.resultMode === 'distance') resultLabel = `${s.resultDistance}m`;
    else { resultLabel = s.made ? 'Réussi' : 'Raté'; dotClass = s.made ? 'made' : 'missed'; }
    return `<li>${dotClass ? `<span class="wg-dot ${dotClass}"></span>` : ''}<span>Tir ${i + 1} — ${s.distance}m</span><span class="wg-text-muted-sm">${resultLabel}</span></li>`;
  }).join('');
  return `<div class="wg-topbar"><button class="wg-back-btn" onclick="closeWedgeExerciseLog()">${UI.ICONS.back} Retour</button></div>
    <div class="wg-session-title">${ex.name}</div>
    <div class="wg-section-desc wg-text-center">${UI.formatDate(log.date)}</div>
    <div class="wg-insight-card-title mt-10">${wedgeLogSummaryText(ex, log)}</div>
    <ul class="wg-session-list">${shotRows}</ul>
    <div style="height:24px;"></div>`;
}

/* =============================== 6. VUES ===================================== */

const Views = {};

Views.home = function () {
  return `${UI.header({ title: "WEDGING", backLabel: "Home", backHash: "app-home" })}<p class="wg-subtitle">Maîtrisez vos distances, contrôlez vos approches.</p>${UI.navCards(null)}`;
};

/* --- PARCOURS = Journal (ajout de coup + historique filtrable) --- */
Views.parcours = function () {
  const filtered = wedgeHistoryFilteredRounds();
  return `
    ${UI.header({ title: "WEDGING", backLabel: "Home", backHash: "app-home", rightIcon: UI.ICONS.more })}
    ${UI.navCards("parcours")}

    <section class="wg-section">
      <h4>Nouveau coup</h4>
      <label class="wg-label mt-8">Distance à faire</label>
      <div class="wg-range-grid">${WEDGE_BUCKETS.map(b => `<button type="button" class="wg-range-btn ${wedgeNewShotBucket === b ? 'active' : ''}" onclick="setWedgeNewShotBucket(${b})">${b}-${b + 4}m</button>`).join('')}</div>

      <label class="wg-label mt-12">Distance finale (m)</label>
      <div class="wg-field-box wg-field-box--center" onclick="openWedgeFinalPopup()">
        <div class="wg-field-box-value">${wedgeNewShotFinal ? wedgeNewShotFinal : '0'}m</div>
        <div class="wg-field-box-label">Toucher pour saisir</div>
      </div>

      <label class="wg-label mt-12">Zone</label>
      <div class="wg-wheel-wrap">${UI.wheelSvg(wedgeNewShotZone, 'setWedgeNewShotZone')}</div>

      <button class="wg-btn-primary mt-12" ${(wedgeNewShotBucket === null || wedgeNewShotFinal === '' || !wedgeNewShotZone) ? 'disabled' : ''} onclick="addWedgeRound()">Ajouter</button>
    </section>

    <div class="wg-toolbar"><span class="wg-toolbar-title">HISTORIQUE</span></div>
    <div class="wg-list">
      ${wedgeHistoryFiltersRowHtml()}
      ${filtered.map(w => `
        <div class="wg-history-item">
          <span class="wg-history-bar"></span>
          <div class="wg-history-mid">
            <b>${w.distanceToCover}-${w.distanceToCover + 4}m</b>
            <span class="wg-text-muted-sm">${wedgeZoneDisplayLabel(w.zone)} — ${w.finalDistance}m — ${UI.formatDate(w.date)}</span>
          </div>
          <button class="wg-btn-danger" onclick="deleteWedgeRound(${w.id})">${UI.ICONS.close}</button>
        </div>
      `).join('') || '<p class="wg-empty-state">Aucun coup enregistré.</p>'}
    </div>

    ${UI.bottomNav(null)}
    ${wedgeHistoryDistancePopupOpen ? wedgeHistoryDistancePopupHtml() : ''}
    ${wedgeHistoryZonePopupOpen ? wedgeHistoryZonePopupHtml() : ''}
    ${wedgeFinalPopupOpen ? wedgeFinalPopupHtml() : ''}
  `;
};

/* --- DISPERSION = Toile d'araignée --- */
Views.dispersionAnalysis = function () {
  const shots = wedgeShotsWithResult();
  const buckets = Array.from(new Set(shots.map(w => wedgeBucketFor(w.distanceToCover)))).sort((a, b) => a - b);
  wedgeRadarDistances = new Set(Array.from(wedgeRadarDistances).filter(d => buckets.includes(d)));
  if (!wedgeRadarDistances.size && buckets.length) wedgeRadarDistances.add(buckets[0]);
  const selected = buckets.filter(b => wedgeRadarDistances.has(b));
  const cardsHtml = selected.map(b => {
    const bucketShots = shots.filter(w => wedgeBucketFor(w.distanceToCover) === b);
    const items = WEDGE_RADAR_ORDER.map(zone => {
      const vals = bucketShots.filter(w => w.zone === zone).map(w => w.finalDistance);
      const value = vals.length ? vals.reduce((a, b2) => a + b2, 0) / vals.length : null;
      return { label: wedgeRadarShortLabel(zone), value, display: value !== null ? `${Math.round(value * 10) / 10}m` : '—' };
    });
    return `<div class="wg-insight-card"><div class="wg-insight-card-title">Dispersion à ${b}m (${bucketShots.length} coup${bucketShots.length > 1 ? 's' : ''})</div><div class="wg-insight-card-body">${Analytics.buildRadarChartSvg(items)}</div></div>`;
  }).join('');
  return `
    ${UI.topbar("Wedging", "parcours", UI.ICONS.more)}
    ${UI.analysisHeader("ANALYSE", "Dispersion", "Dispersion de vos coups sur le parcours, par distance à faire.")}
    <section class="wg-section"><div class="wg-chip-row wg-chip-row--scroll">${wedgeShotsLimitButtonHtml()}${buckets.map(b => `<button class="wg-chip ${wedgeRadarDistances.has(b) ? 'active' : ''}" onclick="setWedgeRadarDistance(${b})">${b}m</button>`).join('')}</div></section>
    ${wedgeShotsLimitPopupOpen ? wedgeShotsLimitPopupHtml() : ''}
    ${buckets.length ? cardsHtml : `<p class="wg-empty-state">Aucun coup enregistré pour le moment.</p>`}
    ${UI.bottomNav("dispersion")}
  `;
};

/* --- DISTANCE = Jauges --- */
Views.distanceAnalysis = function () {
  const shots = wedgeShotsWithResult();
  const rows = WEDGE_BUCKETS.map(b => {
    const vals = shots.filter(w => wedgeBucketFor(w.distanceToCover) === b).map(w => w.finalDistance);
    const avg = vals.length ? vals.reduce((a, b2) => a + b2, 0) / vals.length : null;
    return { label: `${b}m`, avg: avg !== null ? Math.round(avg * 10) / 10 : null };
  });
  const maxVal = Math.max(1, ...rows.filter(r => r.avg !== null).map(r => r.avg));
  const rowsHtml = rows.map(r => {
    if (r.avg === null) return `<div class="wg-gauge-row"><div class="wg-gauge-label">${r.label}</div><div class="wg-gauge-track"><div class="wg-gauge-fill wg-gauge-fill--empty"></div></div></div>`;
    const pct = Math.max(4, Math.round((r.avg / maxVal) * 100));
    return `<div class="wg-gauge-row"><div class="wg-gauge-label">${r.label}</div><div class="wg-gauge-track"><div class="wg-gauge-fill" style="width:${pct}%"></div><div class="wg-gauge-value" style="left:${pct}%">${r.avg}m</div></div></div>`;
  }).join('');
  return `
    ${UI.topbar("Wedging", "parcours", UI.ICONS.more)}
    ${UI.analysisHeader("ANALYSE", "Distance", "Distance finale moyenne par palier de distance à faire.")}
    <section class="wg-section">${wedgeShotsLimitRowHtml()}</section>
    <section class="wg-section"><div class="wg-gauge-axis"><span>Distance à faire (paliers de 5m)</span><span>Résultat moyen (m)</span></div>${rowsHtml}</section>
    ${UI.bottomNav("distance")}
  `;
};

/* --- SG (Strokes Gained), par palier de distance à faire --- */
Views.sgAnalysis = function () {
  const shots = wedgeShotsWithResult();
  const entries = WEDGE_BUCKETS.map(b => {
    const bucketShots = shots.filter(w => wedgeBucketFor(w.distanceToCover) === b);
    const vals = bucketShots.map(Analytics.wedgeShotSG).filter(v => v !== null);
    const avg = vals.length ? vals.reduce((a, c) => a + c, 0) / vals.length : null;
    return { label: `${b}-${b + 4}m`, value: avg };
  });
  const maxAbs = Math.max(0.5, ...entries.filter(e => e.value !== null).map(e => Math.abs(e.value)));
  const rowsHtml = entries.map(e => {
    if (e.value === null) return `<div class="wg-sg-bar-row"><div class="wg-sg-bar-label">${e.label}</div><div class="wg-sg-bar-track"><div class="wg-sg-bar-center"></div></div><div class="wg-sg-bar-value">--</div></div>`;
    const pct = Math.min(50, Math.abs(e.value) / maxAbs * 50);
    const side = e.value >= 0 ? 'pos' : 'neg';
    const style = e.value >= 0 ? `left:50%;width:${pct}%;` : `right:50%;width:${pct}%;`;
    return `<div class="wg-sg-bar-row"><div class="wg-sg-bar-label">${e.label}</div><div class="wg-sg-bar-track"><div class="wg-sg-bar-center"></div><div class="wg-sg-bar-fill ${side}" style="${style}"></div></div><div class="wg-sg-bar-value">${Analytics.fmtSG(e.value)}</div></div>`;
  }).join('');
  return `
    ${UI.topbar("Wedging", "parcours", UI.ICONS.more)}
    ${UI.analysisHeader("ANALYSE", "Strokes Gained", "Estimation du gain de coups par palier de distance à faire (référence PGA Tour).")}
    <section class="wg-section">${wedgeShotsLimitRowHtml()}</section>
    <section class="wg-section">${rowsHtml}</section>
    ${UI.bottomNav("sg")}
  `;
};

/* --- EXERCICES = Créatif : liste, modale, session, revue (état en cascade, comme l'ancienne version) --- */
function wedgeExercisesListHtml() {
  return `
    ${UI.header({ title: "WEDGING", backLabel: "Home", backHash: "app-home", rightIcon: UI.ICONS.more })}
    ${UI.navCards("exercices")}
    <div class="wg-toolbar"><span class="wg-toolbar-title">MES EXERCICES</span><button class="wg-chip active" onclick="openWedgeExerciseModal()">${UI.ICONS.plus} Créer</button></div>
    <div class="wg-list mb-70">${wedgeExercises.length ? wedgeExercises.map(ex => wedgeExerciseCardHtml(ex)).join('') : '<p class="wg-empty-state">Aucun exercice pour le moment.</p>'}</div>
    <div class="wg-fab"><button class="wg-btn-primary" onclick="startSelectedWedgeExercise()">Lancer l'exercice →</button></div>
    ${wedgeExerciseModalOpen ? wedgeExerciseModalHtml() : ''}
    ${wedgeDistancesPopupOpen ? wedgeDistancesPopupHtml() : ''}
    ${wedgeResultModePopupOpen ? wedgeResultModePopupHtml() : ''}
    ${wedgeConfirmDeleteExerciseId !== null ? wedgeConfirmDeleteModalHtml() : ''}
  `;
}
Views.exercices = function () {
  if (wedgeExSession) return wedgeExSession.elevator ? wedgeExElevatorScreenHtml() : wedgeExSessionScreenHtml();
  if (wedgeReviewExerciseId !== null) return wedgeExerciseReviewHtml();
  return wedgeExercisesListHtml();
};

/* =============================== 7. ROUTEUR =================================== */

const Router = (function () {
  let lastPath = null;
  window.addEventListener("resize", () => {
    if (document.getElementById("page-wedging")?.classList.contains("active")) {
      document.body.classList.remove("no-scroll", "gym-home-locked", "gym-view-fit");
    }
  });
  const ROUTES = {
    "home": { view: Views.home },
    "parcours": { view: Views.parcours },
    "dispersion-analysis": { view: Views.dispersionAnalysis },
    "distance-analysis": { view: Views.distanceAnalysis },
    "sg-analysis": { view: Views.sgAnalysis },
    "exercices": { view: Views.exercices }
  };
  function parseHash() {
    const hash = location.hash.replace(/^#/, "");
    const [path, query] = hash.split("?");
    return { path: (path && path !== "home") ? path : "parcours", params: new URLSearchParams(query || "") };
  }
  function render() {
    const { path, params } = parseHash();
    const route = ROUTES[path] || ROUTES["parcours"];
    const changed = path !== lastPath;
    lastPath = path;
    document.body.classList.remove("no-scroll", "gym-home-locked", "gym-view-fit");
    try {
      document.getElementById("app").innerHTML = route.view(params);
    } catch (e) {
      const detail = (e && e.stack) ? e.stack : String(e);
      console.error(e);
      try { UI.toast('Erreur : ' + (e && e.message ? e.message : e)); } catch (_) {}
      document.getElementById("app").innerHTML =
        '<div style="padding:30px 20px;color:#fff;max-width:520px;margin:0 auto;">' +
        '<h3 style="color:#FF5C5C;margin-bottom:10px;">Erreur de rendu</h3>' +
        '<p style="color:#B6B6B6;font-size:13px;margin-bottom:14px;">Copie ce message pour le signaler :</p>' +
        '<pre style="white-space:pre-wrap;word-break:break-word;font-size:11.5px;color:#B6B6B6;background:#0B0F14;border:1px solid #1A2330;border-radius:12px;padding:14px;">' +
        detail.replace(/</g, '&lt;') + '</pre>' +
        '<button class="wg-btn-secondary" style="margin-top:14px;" onclick="Router.go(\'parcours\')">Retour à l\'accueil</button>' +
        '</div>';
    }
    if (changed) requestAnimationFrame(() => window.scrollTo(0, 0));
  }
  function go(hash) { location.hash = "#" + hash; }
  window.addEventListener("hashchange", render);
  window.addEventListener("DOMContentLoaded", render);
  window.addEventListener("error", (e) => { try { UI.toast('Erreur JS : ' + e.message); } catch (_) {} });
  return { go, render };
})();
