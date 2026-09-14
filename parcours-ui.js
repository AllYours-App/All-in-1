/* ==========================================================================
   PARCOURS — UI interactions (front-end only, aucune logique métier)
   Les écrans mockés (Distances, Ajouter un coup, Détail, Dashboard)
   utilisent des valeurs statiques écrites directement dans le HTML —
   à remplacer par le moteur de calcul réel de l'application.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     Dropdown premium
     ------------------------------------------------------------------------ */
  function initDropdowns() {
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      const trigger = dropdown.querySelector(".dropdown-trigger");
      const menu = dropdown.querySelector(".dropdown-menu");
      if (!trigger || !menu) return;

      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains("open");
        closeAllDropdowns();
        if (!isOpen) dropdown.classList.add("open");
      });

      menu.querySelectorAll(".dropdown-option").forEach((option) => {
        option.addEventListener("click", (e) => {
          e.stopPropagation();
          menu.querySelectorAll(".dropdown-option").forEach((o) => o.classList.remove("selected"));
          option.classList.add("selected");
          const label = trigger.querySelector(".trigger-label");
          if (label) {
            label.textContent = option.querySelector("span")?.textContent || option.textContent.trim();
            label.classList.remove("placeholder");
          }
          dropdown.classList.remove("open");
        });
      });
    });

    document.addEventListener("click", closeAllDropdowns);
  }

  function closeAllDropdowns() {
    document.querySelectorAll(".dropdown.open").forEach((d) => d.classList.remove("open"));
  }

  /* ------------------------------------------------------------------------
     Segmented controls
     ------------------------------------------------------------------------ */
  function initSegmentedControls() {
    document.querySelectorAll(".segmented").forEach((group) => {
      group.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", () => {
          group.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     Cartes sélectionnables (club, position finale, résultat...)
     ------------------------------------------------------------------------ */
  function initSelectCards() {
    document.querySelectorAll(".select-grid").forEach((grid) => {
      const multi = grid.dataset.multi === "true";
      grid.querySelectorAll(".select-card").forEach((card) => {
        card.setAttribute("tabindex", "0");
        card.addEventListener("click", () => toggleSelectCard(grid, card, multi));
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleSelectCard(grid, card, multi);
          }
        });
      });
    });
  }

  function toggleSelectCard(grid, card, multi) {
    if (!multi) {
      grid.querySelectorAll(".select-card").forEach((c) => c.classList.remove("selected"));
    }
    card.classList.toggle("selected");
  }

  /* ------------------------------------------------------------------------
     Slider premium (distance / dénivelé)
     ------------------------------------------------------------------------ */
  function initSliders() {
    document.querySelectorAll('input[type="range"]').forEach((slider) => {
      const valueEl = document.querySelector(`[data-slider-value-for="${slider.id}"]`);
      const unit = slider.dataset.unit || "";

      function update() {
        const min = Number(slider.min || 0);
        const max = Number(slider.max || 100);
        const pct = ((Number(slider.value) - min) / (max - min)) * 100;
        slider.style.setProperty("--fill", pct + "%");
        if (valueEl) valueEl.innerHTML = slider.value + (unit ? ` <span class="unit">${unit}</span>` : "");
      }

      slider.addEventListener("input", update);
      update();
    });
  }

  /* ------------------------------------------------------------------------
     Routeur d'écrans — permet de garder les 7 écrans dans un seul fichier
     HTML. Chaque écran est un <div class="screen-view" data-screen="id">
     et tout élément avec [data-goto="id"] navigue vers cet écran.
     ------------------------------------------------------------------------ */
  function goToScreen(id) {
    const target = document.querySelector(`.screen-view[data-screen="${id}"]`);
    if (!target) return;

    document.querySelectorAll(".screen-view").forEach((s) => s.classList.remove("active"));
    target.classList.add("active");
    document.body.classList.toggle("no-scroll", id === "home");

    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    history.replaceState(null, "", `#${id}`);
  }

  function initRouter() {
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-goto]");
      if (!trigger) return;
      e.preventDefault();
      goToScreen(trigger.dataset.goto);
    });

    const initial = (window.location.hash || "#home").replace("#", "");
    goToScreen(document.querySelector(`.screen-view[data-screen="${initial}"]`) ? initial : "home");
  }

  /* ------------------------------------------------------------------------
     Init
     ------------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    initDropdowns();
    initSegmentedControls();
    initSelectCards();
    initSliders();
    initRouter();
    renderFairway();
    renderGreen();

    document.dispatchEvent(new CustomEvent("parcours:ready"));
  });
})();

/* ==========================================================================
   COURSE — Vent & Dénivelé : fonctionnalités réelles (adapté de course.js)
   Ces fonctions sont volontairement en dehors de l'IIFE ci-dessus car elles
   sont appelées depuis des attributs onclick="" dans le HTML.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Réglages (unité de distance m / ft), persistés dans le navigateur
   -------------------------------------------------------------------------- */
const M_TO_FT = 3.28084;
const PARCOURS_SETTINGS_KEY = "parcours-settings";

let settings = { distanceUnit: "m" };
(function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(PARCOURS_SETTINGS_KEY) || "{}");
    if (saved && (saved.distanceUnit === "m" || saved.distanceUnit === "ft")) {
      settings.distanceUnit = saved.distanceUnit;
    }
  } catch (e) { /* localStorage indisponible : on garde la valeur par défaut */ }
})();

function saveSettings() {
  try { localStorage.setItem(PARCOURS_SETTINGS_KEY, JSON.stringify(settings)); } catch (e) { /* pas grave */ }
}

function convertDistance(meters, unit) {
  return unit === "ft" ? meters * M_TO_FT : meters;
}
function distanceToMeters(value, unit) {
  if (value === null || value === undefined || value === "" || isNaN(value)) return null;
  return unit === "ft" ? Number(value) / M_TO_FT : Number(value);
}
function distanceUnitLabel() {
  return settings.distanceUnit === "ft" ? "ft" : "m";
}
function setDistanceUnit(u) {
  settings.distanceUnit = u;
  saveSettings();
  renderCourseModals();
}
function unitToggleHtml() {
  return `
    <div class="segmented unit-toggle">
      <button type="button" class="${settings.distanceUnit === "m" ? "active" : ""}" onclick="setDistanceUnit('m')">m</button>
      <button type="button" class="${settings.distanceUnit === "ft" ? "active" : ""}" onclick="setDistanceUnit('ft')">ft</button>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   État des modales
   -------------------------------------------------------------------------- */
let windCalcOpen = false;
let windInfoOpen = false;
let windDetailOpen = false;
let elevationOpen = false;
let trackInfoOpen = false;

let windCalc = { angle: 0, speedKmh: 20, distanceInput: 150 };
let elevCalc = { angleHorizon: 0, angleCible: null, distanceInput: 150, permissionGranted: false, listening: false };
let lastBeta = null;

function renderCourseModals() {
  const root = document.getElementById("course-modal-root");
  if (!root) return;
  root.innerHTML = [
    windCalcOpen ? windCalcHtml() : "",
    windInfoOpen ? windInfoHtml() : "",
    windDetailOpen ? windDetailHtml() : "",
    elevationOpen ? elevationCalcHtml() : "",
    trackInfoOpen ? trackInfoHtml() : ""
  ].join("");
}

function openTrackInfo() { trackInfoOpen = true; renderCourseModals(); }
function closeTrackInfo() { trackInfoOpen = false; renderCourseModals(); }

function trackInfoHtml() {
  return `
    <div class="modal-overlay" onclick="closeTrackInfo()">
      <div class="modal-sheet" onclick="event.stopPropagation()">
        <div class="modal-head">
          <h3>Fairway &amp; Green</h3>
          <button class="icon-btn" aria-label="Fermer" onclick="closeTrackInfo()">✕</button>
        </div>
        <p>Suivi de la dispersion pendant un parcours</p>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   Calculateur de vent — mêmes coefficients que course.js
   (règle TrackMan 1%/mph face, 0.5%/mph dos, 1yd/mph travers)
   -------------------------------------------------------------------------- */
const WIND_HEAD_COEF = 0.006214;
const WIND_TAIL_COEF = 0.003107;
const WIND_CROSS_COEF = 0.003789;

function computeWindResult(distanceM, speedKmh, angleDeg) {
  if (distanceM === null || isNaN(distanceM)) return { distance: null, deviation: null };
  const rad = angleDeg * Math.PI / 180;
  const face = Math.cos(rad) * speedKmh;
  const travers = Math.sin(rad) * speedKmh;
  const distance = face >= 0
    ? distanceM * (1 + WIND_HEAD_COEF * face)
    : distanceM * (1 - WIND_TAIL_COEF * Math.abs(face));
  const ratio = distance / distanceM;
  const deviation = WIND_CROSS_COEF * travers * distanceM * ratio;
  return { distance, deviation };
}

function windDirectionLabel(angle) {
  const sectors = ["Face", "3/4 face (droite)", "Travers droit", "3/4 dos (droite)", "Dos", "3/4 dos (gauche)", "Travers gauche", "3/4 face (gauche)"];
  const idx = Math.round(angle / 45) % 8;
  return sectors[idx];
}

function windCalcResult() {
  const distanceM = distanceToMeters(parseFloat(windCalc.distanceInput), settings.distanceUnit);
  return computeWindResult(distanceM, windCalc.speedKmh, windCalc.angle);
}
function windResultDistanceLabel() {
  const r = windCalcResult();
  if (r.distance === null || isNaN(r.distance)) return "--";
  return Math.round(convertDistance(r.distance, settings.distanceUnit)) + " " + distanceUnitLabel();
}
function windResultDeviationLabel() {
  const r = windCalcResult();
  if (r.deviation === null || isNaN(r.deviation)) return "--";
  const v = Math.round(convertDistance(r.deviation, settings.distanceUnit));
  const side = v > 0 ? "droite" : v < 0 ? "gauche" : "";
  return Math.abs(v) + " " + distanceUnitLabel() + (side ? "<br>" + side : "");
}
function updateWindCalcOutputs() {
  const distEl = document.getElementById("wind-result-distance");
  const devEl = document.getElementById("wind-result-deviation");
  if (distEl) distEl.textContent = windResultDistanceLabel();
  if (devEl) devEl.innerHTML = windResultDeviationLabel();
}
function updateWindSpeed(v) {
  windCalc.speedKmh = parseFloat(v) || 0;
  updateWindCalcOutputs();
}
function updateWindDistance(v) {
  windCalc.distanceInput = v;
  updateWindCalcOutputs();
}

function openWindCalc() { windCalcOpen = true; renderCourseModals(); }
function closeWindCalc() { windCalcOpen = false; renderCourseModals(); }

/* --- Rotation de la flèche par glissement (souris et tactile) --- */
function windCompassPointerDown(e) {
  e.preventDefault();
  updateWindAngleFromEvent(e);
  document.addEventListener("pointermove", windCompassPointerMove);
  document.addEventListener("pointerup", windCompassPointerUp);
}
function windCompassPointerMove(e) {
  e.preventDefault();
  updateWindAngleFromEvent(e);
}
function windCompassPointerUp() {
  document.removeEventListener("pointermove", windCompassPointerMove);
  document.removeEventListener("pointerup", windCompassPointerUp);
}
function updateWindAngleFromEvent(e) {
  const svg = document.getElementById("wind-compass-svg");
  if (!svg) return;
  const rect = svg.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = e.clientX - cx;
  const dy = e.clientY - cy;
  let angle = -Math.atan2(dx, dy) * 180 / Math.PI;
  if (angle < 0) angle += 360;
  windCalc.angle = Math.round(angle);

  const arrowGroup = document.getElementById("wind-arrow-group");
  if (arrowGroup) arrowGroup.setAttribute("transform", `rotate(${windCalc.angle} 110 110)`);
  const labelEl = document.getElementById("wind-direction-label");
  if (labelEl) labelEl.textContent = windDirectionLabel(windCalc.angle);
  updateWindCalcOutputs();
}

function windCalcHtml() {
  return `
    <div class="modal-overlay" onclick="closeWindCalc()">
      <div class="modal-sheet" onclick="event.stopPropagation()">
        <div class="modal-head">
          <h3>Calculateur de vent</h3>
          <div class="modal-head-actions">
            ${unitToggleHtml()}
            <button class="icon-btn" aria-label="Écarts par direction" onclick="openWindDetail()">i</button>
            <button class="icon-btn" aria-label="Fermer" onclick="closeWindCalc()">✕</button>
          </div>
        </div>

        <div class="compass-wrap">
          <svg id="wind-compass-svg" viewBox="0 0 220 220" width="220" height="220" onpointerdown="windCompassPointerDown(event)">
            <circle cx="110" cy="110" r="100" fill="var(--card-alt)" stroke="var(--border)" stroke-width="2"/>
            <circle cx="110" cy="110" r="70" fill="none" stroke="var(--border)" stroke-width="1"/>
            <circle cx="110" cy="110" r="40" fill="none" stroke="var(--border)" stroke-width="1"/>
            <g transform="translate(110,20)">
              <line x1="0" y1="0" x2="0" y2="16" stroke="var(--text-muted)" stroke-width="2"/>
              <circle cx="0" cy="0" r="4" fill="var(--text-muted)"/>
            </g>
            <circle cx="110" cy="200" r="6" fill="var(--text-muted)"/>
            <g id="wind-arrow-group" transform="rotate(${windCalc.angle} 110 110)">
              <line x1="110" y1="110" x2="110" y2="186" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/>
              <path d="M110,200 L98,178 L122,178 Z" fill="var(--accent)"/>
            </g>
            <circle cx="110" cy="110" r="5" fill="var(--text)"/>
          </svg>
        </div>
        <p class="compass-caption">
          Fais glisser la flèche pour indiquer d'où souffle le vent — <strong id="wind-direction-label">${windDirectionLabel(windCalc.angle)}</strong>
        </p>

        <div class="field-grid-2">
          <div class="input-box">
            <span class="input-box-label">Vitesse du vent (km/h)</span>
            <input type="number" inputmode="numeric" value="${windCalc.speedKmh}" min="0" step="1" oninput="updateWindSpeed(this.value)">
          </div>
          <div class="input-box">
            <span class="input-box-label">Distance du coup (${distanceUnitLabel()})</span>
            <input type="number" inputmode="numeric" value="${windCalc.distanceInput}" min="0" step="1" oninput="updateWindDistance(this.value)">
          </div>
        </div>

        <div class="field-grid-2">
          <div class="result-box">
            <span class="result-label">Distance à jouer</span>
            <span class="result-value" id="wind-result-distance">${windResultDistanceLabel()}</span>
          </div>
          <div class="result-box">
            <span class="result-label">Déviation latérale</span>
            <span class="result-value" id="wind-result-deviation">${windResultDeviationLabel()}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* --- Charte de vent générale (face / dos / travers), toutes distances --- */
const WIND_CHART_SPEEDS = [10, 20, 30, 40];
const WIND_CHART_DISTANCES_M = (() => {
  const arr = [];
  for (let d = 50; d <= 250; d += 20) arr.push(d);
  return arr;
})();

function openWindInfo() { windInfoOpen = true; renderCourseModals(); }
function closeWindInfo() { windInfoOpen = false; renderCourseModals(); }

function windChartTableHtml(title, angleDeg, valueKey) {
  const unit = distanceUnitLabel();
  const rows = WIND_CHART_DISTANCES_M.map((dM) => {
    const dDisplay = Math.round(convertDistance(dM, settings.distanceUnit));
    const cells = WIND_CHART_SPEEDS.map((speed) => {
      const r = computeWindResult(dM, speed, angleDeg);
      const raw = valueKey === "distance" ? r.distance : Math.abs(r.deviation);
      return Math.round(convertDistance(raw, settings.distanceUnit));
    });
    return { dDisplay, cells };
  });
  return `
    <p class="table-title">${title}</p>
    <table class="data-table">
      <thead>
        <tr>
          <th class="col-left">${unit}</th>
          ${WIND_CHART_SPEEDS.map((s) => `<th>${s} km/h</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${rows.map((r) => `<tr><td class="col-left">${r.dDisplay}</td>${r.cells.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>
  `;
}

function windInfoHtml() {
  return `
    <div class="modal-overlay" onclick="closeWindInfo()">
      <div class="modal-sheet" onclick="event.stopPropagation()">
        <div class="modal-head">
          <h3>Charte de vent</h3>
          <div class="modal-head-actions">
            ${unitToggleHtml()}
            <button class="icon-btn" aria-label="Fermer" onclick="closeWindInfo()">✕</button>
          </div>
        </div>
        ${windChartTableHtml("↓ Vent de face", 0, "distance")}
        ${windChartTableHtml("↑ Vent dans le dos", 180, "distance")}
        ${windChartTableHtml("← Travers →", 90, "deviation")}
      </div>
    </div>
  `;
}

/* --- Écarts par direction, pour la distance/vitesse actuellement saisies --- */
const WIND_DETAIL_DIRECTIONS = [
  { angle: 0, label: "↓ Face" },
  { angle: 45, label: "↙ 3/4 face" },
  { angle: 90, label: "← Travers" },
  { angle: 135, label: "↖ 3/4 dos" },
  { angle: 180, label: "↑ Dos" }
];

function openWindDetail() { windDetailOpen = true; renderCourseModals(); }
function closeWindDetail() { windDetailOpen = false; renderCourseModals(); }

function windDetailRows() {
  const distanceM = distanceToMeters(parseFloat(windCalc.distanceInput), settings.distanceUnit);
  const unit = distanceUnitLabel();
  return WIND_DETAIL_DIRECTIONS.map((d) => {
    const r = computeWindResult(distanceM, windCalc.speedKmh, d.angle);
    const dist = (r.distance === null || isNaN(r.distance)) ? "--" : Math.round(convertDistance(r.distance, settings.distanceUnit)) + " " + unit;
    let dev = "--";
    if (r.deviation !== null && !isNaN(r.deviation)) {
      const v = Math.round(Math.abs(convertDistance(r.deviation, settings.distanceUnit)));
      dev = v === 0 ? "—" : v + " " + unit;
    }
    return { label: d.label, dist, dev };
  });
}

function windDetailHtml() {
  const rows = windDetailRows();
  const distDisplay = windCalc.distanceInput + " " + distanceUnitLabel();
  return `
    <div class="modal-overlay" onclick="closeWindDetail()">
      <div class="modal-sheet" onclick="event.stopPropagation()">
        <div class="modal-head">
          <h3>Écarts par direction</h3>
          <button class="icon-btn" aria-label="Fermer" onclick="closeWindDetail()">✕</button>
        </div>
        <p class="hint-text">${distDisplay} · ${windCalc.speedKmh} km/h</p>
        <table class="data-table">
          <thead>
            <tr><th class="col-left">Direction</th><th>Distance</th><th>Déviation</th></tr>
          </thead>
          <tbody>
            ${rows.map((r) => `<tr><td class="col-left">${r.label}</td><td>${r.dist}</td><td>${r.dev}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   Dénivelé — clinomètre basé sur les capteurs de mouvement du téléphone
   -------------------------------------------------------------------------- */
function openElevationCalc() {
  elevationOpen = true;
  if (elevCalc.permissionGranted) startElevationListening();
  renderCourseModals();
}
function closeElevationCalc() {
  elevationOpen = false;
  window.removeEventListener("deviceorientation", handleElevationOrientation);
  elevCalc.listening = false;
  renderCourseModals();
}

/* iOS 13+ exige une autorisation explicite déclenchée par un clic */
async function requestElevationPermission() {
  if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
    try {
      const res = await DeviceOrientationEvent.requestPermission();
      elevCalc.permissionGranted = (res === "granted");
    } catch (e) {
      elevCalc.permissionGranted = false;
    }
  } else {
    // Android / anciens iOS : pas de permission explicite nécessaire
    elevCalc.permissionGranted = true;
  }
  if (elevCalc.permissionGranted) startElevationListening();
  renderCourseModals();
}

function handleElevationOrientation(event) {
  lastBeta = event.beta;
  const rawEl = document.getElementById("elev-raw-angle");
  if (rawEl) rawEl.textContent = lastBeta !== null ? lastBeta.toFixed(1) + "°" : "--";
}
function startElevationListening() {
  if (elevCalc.listening) return;
  window.addEventListener("deviceorientation", handleElevationOrientation);
  elevCalc.listening = true;
}

function captureElevationCible() {
  if (lastBeta === null) return;
  elevCalc.angleCible = lastBeta;
}
function handleElevationMainButton() {
  captureElevationCible();
  renderCourseModals();
}
function resetElevationCalc() {
  elevCalc.angleCible = null;
  renderCourseModals();
}
function updateElevationInputDistance(v) {
  elevCalc.distanceInput = v;
  updateElevationOutputs();
}

/* Dénivelé = distance horizontale x tan(angle d'inclinaison entre l'horizon calibré et la cible) */
function computeElevationResult() {
  if (elevCalc.angleHorizon === null || elevCalc.angleCible === null) return { deniv: null, angle: null };
  const angle = elevCalc.angleCible - elevCalc.angleHorizon;
  const distanceM = distanceToMeters(parseFloat(elevCalc.distanceInput), settings.distanceUnit);
  if (distanceM === null || isNaN(distanceM)) return { deniv: null, angle };
  const deniv = distanceM * Math.tan(angle * Math.PI / 180);
  return { deniv, angle };
}
function elevationResultLabel() {
  const r = computeElevationResult();
  if (r.deniv === null || isNaN(r.deniv)) return "--";
  const distanceM = distanceToMeters(parseFloat(elevCalc.distanceInput), settings.distanceUnit);
  if (distanceM === null || isNaN(distanceM)) return "--";
  const distanceAJouer = distanceM + r.deniv;
  return Math.round(convertDistance(distanceAJouer, settings.distanceUnit)) + " " + distanceUnitLabel();
}
function updateElevationOutputs() {
  const cibleEl = document.getElementById("elev-cible-value");
  const resultEl = document.getElementById("elev-result-value");
  if (cibleEl) cibleEl.textContent = elevCalc.angleCible !== null ? elevCalc.angleCible.toFixed(1) + "°" : "--";
  if (resultEl) resultEl.textContent = elevationResultLabel();
}

function elevationCalcHtml() {
  return `
    <div class="modal-overlay" onclick="closeElevationCalc()">
      <div class="modal-sheet" onclick="event.stopPropagation()">
        <div class="modal-head">
          <h3>Dénivelé</h3>
          <div class="modal-head-actions">
            ${unitToggleHtml()}
            <button class="icon-btn" aria-label="Fermer" onclick="closeElevationCalc()">✕</button>
          </div>
        </div>

        ${!elevCalc.permissionGranted ? `
          <p class="hint-text">Autorise l'accès aux capteurs de mouvement pour utiliser le clinomètre. Vise le drapeau avec le haut de ton téléphone, comme pour viser avec un appareil photo.</p>
          <button class="btn btn-primary" onclick="requestElevationPermission()">Autoriser les capteurs</button>
        ` : `
          <div class="elev-live">Angle brut en temps réel : <strong id="elev-raw-angle">--</strong></div>

          <div class="elev-actions">
            <button class="btn btn-primary" onclick="handleElevationMainButton()">Viser le drapeau</button>
            <button class="elev-reset-btn" aria-label="Réinitialiser" onclick="resetElevationCalc()">
              <svg viewBox="0 0 24 24" width="20" height="20"><path d="M4 4 v6 h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 20 v-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.5 15 A9 9 0 0 0 20 14 M18.5 9 A9 9 0 0 0 4 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>

          <div class="input-box">
            <span class="input-box-label">Distance du coup (${distanceUnitLabel()})</span>
            <input type="number" inputmode="numeric" value="${elevCalc.distanceInput}" min="0" step="1" oninput="updateElevationInputDistance(this.value)">
          </div>

          <div class="field-grid-2">
            <div class="result-box">
              <span class="result-label">Angle capté</span>
              <span class="result-value" id="elev-cible-value">${elevCalc.angleCible !== null ? elevCalc.angleCible.toFixed(1) + "°" : "--"}</span>
            </div>
            <div class="result-box">
              <span class="result-label">Distance à jouer</span>
              <span class="result-value" id="elev-result-value">${elevationResultLabel()}</span>
            </div>
          </div>
        `}
      </div>
    </div>
  `;
}

/* ==========================================================================
   Icônes partagées (reset / crayon) pour Fairway et Green
   ========================================================================== */
const TRACK_RESET_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v6h6"></path><path d="M20 20v-6h-6"></path><path d="M5.5 15A9 9 0 0 0 20 14M18.5 9A9 9 0 0 0 4 10"></path></svg>`;
const TRACK_PENCIL_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>`;

/* ==========================================================================
   FAIRWAY — suivi des mises en jeu sur 18 trous (front-end uniquement,
   juste de l'état local + persistance navigateur, aucun calcul de stats)
   ========================================================================== */
const FW_STORAGE_KEY = "parcours-fairway-round";
const MARK_HIT_RADIUS_PX = 22; // tolérance de tap pour sélectionner un point déjà placé

function fwDefaultHoles() {
  return Array.from({ length: 18 }, () => ({ shots: [], par3: false }));
}

let fwHoles = fwLoad();
let fwMode = "plus"; // 'plus' (ajoute) | 'minus' (retire un point tapé) | 'edit' (renumérote un point tapé)
let fwLastLogged = null;
let fwToastTimer = null;

function fwLoad() {
  try {
    const saved = JSON.parse(localStorage.getItem(FW_STORAGE_KEY) || "null");
    if (saved && Array.isArray(saved.holes) && saved.holes.length === 18) {
      return saved.holes;
    }
  } catch (e) { /* localStorage indisponible : on repart d'un parcours vide */ }
  return fwDefaultHoles();
}

function fwSave() {
  try { localStorage.setItem(FW_STORAGE_KEY, JSON.stringify({ holes: fwHoles })); } catch (e) { /* pas grave */ }
}

function fwCurrentHoleIndex() {
  for (let i = 0; i < 18; i++) {
    if (!fwHoles[i].par3 && fwHoles[i].shots.length === 0) return i;
  }
  return 18; // les 18 trous sont renseignés
}

function fwZoneLabel(zone) {
  if (zone === "fairway") return "Fairway";
  if (zone === "rough-left") return "Rough gauche";
  return "Rough droit";
}

function fwZoneFromX(xPercent) {
  if (xPercent < 27) return "rough-left";
  if (xPercent > 73) return "rough-right";
  return "fairway";
}

function fwShowToast(hole, label) {
  fwLastLogged = { hole, label };
  clearTimeout(fwToastTimer);
  fwToastTimer = setTimeout(() => {
    fwLastLogged = null;
    renderFairway();
  }, 900);
}

function fwSetMode(mode) {
  fwMode = mode;
  renderFairway();
}

// Cherche le point déjà placé le plus proche du tap (tous trous confondus), en pixels réels
function fwFindShotNear(xPercent, yPercent, rect) {
  let best = null;
  let bestDist = Infinity;
  for (let i = 0; i < 18; i++) {
    fwHoles[i].shots.forEach((s, si) => {
      const dx = ((s.x - xPercent) / 100) * rect.width;
      const dy = ((s.y - yPercent) / 100) * rect.height;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= MARK_HIT_RADIUS_PX && dist < bestDist) {
        bestDist = dist;
        best = { hole: i, index: si };
      }
    });
  }
  return best;
}

function fwZoneTap(event) {
  const zone = event.currentTarget;
  const rect = zone.getBoundingClientRect();
  let x = ((event.clientX - rect.left) / rect.width) * 100;
  let y = ((event.clientY - rect.top) / rect.height) * 100;
  x = Math.max(0, Math.min(100, x));
  y = Math.max(0, Math.min(100, y));

  if (fwMode === "minus") {
    const hit = fwFindShotNear(x, y, rect);
    if (!hit) return;
    fwHoles[hit.hole].shots.splice(hit.index, 1);
    fwSave();
    fwShowToast(hit.hole, "retiré");
    renderFairway();
    return;
  }

  if (fwMode === "edit") {
    const hit = fwFindShotNear(x, y, rect);
    if (!hit) return;
    const [shot] = fwHoles[hit.hole].shots.splice(hit.index, 1);
    const nextHole = hit.hole >= 17 ? 0 : hit.hole + 1;
    fwHoles[nextHole].shots.push(shot);
    fwSave();
    fwShowToast(nextHole, "renuméroté");
    renderFairway();
    return;
  }

  // mode "plus" (par défaut) : ajoute un coup sur le trou en cours
  const idx = fwCurrentHoleIndex();
  if (idx >= 18) return;
  const shotZone = fwZoneFromX(x);
  fwHoles[idx].shots.push({ x, y, zone: shotZone });
  fwSave();
  fwShowToast(idx, fwZoneLabel(shotZone));
  renderFairway();
}

function fwPar3Tap() {
  const idx = fwCurrentHoleIndex();
  if (idx >= 18) return;
  fwHoles[idx].par3 = true;
  fwSave();
  fwShowToast(idx, "Par 3");
  renderFairway();
}

function resetFairwayRound() {
  const hasData = fwHoles.some((h) => h.shots.length > 0 || h.par3);
  if (hasData && !confirm("Effacer le parcours en cours et recommencer à zéro ?")) return;
  fwHoles = fwDefaultHoles();
  fwMode = "plus";
  fwLastLogged = null;
  fwSave();
  renderFairway();
}

function fwAllMarksHtml() {
  let html = "";
  for (let i = 0; i < 18; i++) {
    fwHoles[i].shots.forEach((s, si) => {
      const cls = ["fw-mark", s.zone !== "fairway" ? "fw-mark--rough" : "", si > 0 ? "is-extra" : ""].filter(Boolean).join(" ");
      html += `<div class="${cls}" style="left:${s.x}%;top:${s.y}%;">${i + 1}</div>`;
    });
  }
  return html;
}

function renderFairway() {
  const root = document.getElementById("fairway-root");
  if (!root) return;

  const holeNum = Math.min(fwCurrentHoleIndex() + 1, 18);

  const html = `
    <div class="fw-visual" onclick="fwZoneTap(event)">
      <button type="button" class="track-reset-btn" aria-label="Nouveau parcours fairway" onclick="event.stopPropagation(); resetFairwayRound();">${TRACK_RESET_ICON}</button>

      <div class="fw-stripe fw-stripe-rough-left"></div>
      <div class="fw-stripe fw-stripe-fairway"></div>
      <div class="fw-stripe fw-stripe-rough-right"></div>

      <div class="fw-flag">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21V4"></path><path d="M6 4h11l-3 4 3 4H6"></path></svg>
      </div>

      ${fwAllMarksHtml()}

      <div class="track-rail track-rail-left">
        <span class="hole-counter">${holeNum}<em>/18</em></span>
        <button type="button" class="btn btn-secondary track-par3-btn" onclick="event.stopPropagation(); fwPar3Tap();">Par 3</button>
      </div>

      <div class="track-rail track-rail-right">
        <button type="button" class="mode-btn ${fwMode === "plus" ? "active" : ""}" onclick="event.stopPropagation(); fwSetMode('plus');" aria-label="Ajouter un coup">+</button>
        <button type="button" class="mode-btn ${fwMode === "minus" ? "active" : ""}" onclick="event.stopPropagation(); fwSetMode('minus');" aria-label="Retirer un coup">−</button>
        <button type="button" class="mode-btn ${fwMode === "edit" ? "active" : ""}" onclick="event.stopPropagation(); fwSetMode('edit');" aria-label="Renuméroter un coup">${TRACK_PENCIL_ICON}</button>
      </div>

      ${fwLastLogged ? `<div class="fw-toast">Trou ${fwLastLogged.hole + 1} — ${fwLastLogged.label}</div>` : ""}
    </div>
  `;

  root.innerHTML = html;
}

/* ==========================================================================
   GREEN — repérage des attaques de green sur 18 trous (même principe que
   Fairway, mais une seule zone non divisée : on place une marque à
   l'endroit exact touché, qui reste affichée sur le green du round entier)
   ========================================================================== */
const GR_STORAGE_KEY = "parcours-green-round";

function grDefaultHoles() {
  return Array.from({ length: 18 }, () => ({ marks: [] }));
}

let grHoles = grLoad();
let grMode = "plus"; // 'plus' (ajoute) | 'minus' (retire un point tapé) | 'edit' (renumérote un point tapé)
let grLastLogged = null;
let grToastTimer = null;

function grLoad() {
  try {
    const saved = JSON.parse(localStorage.getItem(GR_STORAGE_KEY) || "null");
    if (saved && Array.isArray(saved.holes) && saved.holes.length === 18) {
      return saved.holes;
    }
  } catch (e) { /* localStorage indisponible : on repart d'un parcours vide */ }
  return grDefaultHoles();
}

function grSave() {
  try { localStorage.setItem(GR_STORAGE_KEY, JSON.stringify({ holes: grHoles })); } catch (e) { /* pas grave */ }
}

function grCurrentHoleIndex() {
  for (let i = 0; i < 18; i++) {
    if (grHoles[i].marks.length === 0) return i;
  }
  return 18;
}

function grShowToast(hole, label) {
  grLastLogged = { hole, label };
  clearTimeout(grToastTimer);
  grToastTimer = setTimeout(() => {
    grLastLogged = null;
    renderGreen();
  }, 900);
}

function grSetMode(mode) {
  grMode = mode;
  renderGreen();
}

// Cherche le point déjà placé le plus proche du tap (tous trous confondus), en pixels réels
function grFindMarkNear(xPercent, yPercent, rect) {
  let best = null;
  let bestDist = Infinity;
  for (let i = 0; i < 18; i++) {
    grHoles[i].marks.forEach((m, mi) => {
      const dx = ((m.x - xPercent) / 100) * rect.width;
      const dy = ((m.y - yPercent) / 100) * rect.height;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= MARK_HIT_RADIUS_PX && dist < bestDist) {
        bestDist = dist;
        best = { hole: i, index: mi };
      }
    });
  }
  return best;
}

function grZoneTap(event) {
  const zone = event.currentTarget;
  const rect = zone.getBoundingClientRect();
  let x = ((event.clientX - rect.left) / rect.width) * 100;
  let y = ((event.clientY - rect.top) / rect.height) * 100;
  x = Math.max(0, Math.min(100, x));
  y = Math.max(0, Math.min(100, y));

  if (grMode === "minus") {
    const hit = grFindMarkNear(x, y, rect);
    if (!hit) return;
    grHoles[hit.hole].marks.splice(hit.index, 1);
    grSave();
    grShowToast(hit.hole, "retiré");
    renderGreen();
    return;
  }

  if (grMode === "edit") {
    const hit = grFindMarkNear(x, y, rect);
    if (!hit) return;
    const [mark] = grHoles[hit.hole].marks.splice(hit.index, 1);
    const nextHole = hit.hole >= 17 ? 0 : hit.hole + 1;
    grHoles[nextHole].marks.push(mark);
    grSave();
    grShowToast(nextHole, "renuméroté");
    renderGreen();
    return;
  }

  // mode "plus" (par défaut) : ajoute une marque sur le trou en cours
  const idx = grCurrentHoleIndex();
  if (idx >= 18) return;
  grHoles[idx].marks.push({ x, y });
  grSave();
  grShowToast(idx, "enregistré");
  renderGreen();
}

function resetGreenRound() {
  const hasData = grHoles.some((h) => h.marks.length > 0);
  if (hasData && !confirm("Effacer les greens enregistrés et recommencer à zéro ?")) return;
  grHoles = grDefaultHoles();
  grMode = "plus";
  grLastLogged = null;
  grSave();
  renderGreen();
}

function grAllMarksHtml() {
  let html = "";
  for (let i = 0; i < 18; i++) {
    grHoles[i].marks.forEach((m, mi) => {
      const cls = mi > 0 ? "gr-mark is-extra" : "gr-mark";
      html += `<div class="${cls}" style="left:${m.x}%;top:${m.y}%;">${i + 1}</div>`;
    });
  }
  return html;
}

function renderGreen() {
  const root = document.getElementById("green-root");
  if (!root) return;

  const holeNum = Math.min(grCurrentHoleIndex() + 1, 18);

  const html = `
    <div class="gr-visual" onclick="grZoneTap(event)">
      <button type="button" class="track-reset-btn" aria-label="Nouveau parcours green" onclick="event.stopPropagation(); resetGreenRound();">${TRACK_RESET_ICON}</button>

      <div class="gr-green"></div>
      <div class="gr-flag">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21V4"></path><path d="M6 4h11l-3 4 3 4H6"></path></svg>
      </div>
      ${grAllMarksHtml()}

      <div class="track-rail track-rail-left">
        <span class="hole-counter">${holeNum}<em>/18</em></span>
      </div>

      <div class="track-rail track-rail-right">
        <button type="button" class="mode-btn ${grMode === "plus" ? "active" : ""}" onclick="event.stopPropagation(); grSetMode('plus');" aria-label="Ajouter une marque">+</button>
        <button type="button" class="mode-btn ${grMode === "minus" ? "active" : ""}" onclick="event.stopPropagation(); grSetMode('minus');" aria-label="Retirer une marque">−</button>
        <button type="button" class="mode-btn ${grMode === "edit" ? "active" : ""}" onclick="event.stopPropagation(); grSetMode('edit');" aria-label="Renuméroter une marque">${TRACK_PENCIL_ICON}</button>
      </div>

      ${grLastLogged !== null ? `<div class="fw-toast">Trou ${grLastLogged.hole + 1} — ${grLastLogged.label}</div>` : ""}
    </div>
  `;

  root.innerHTML = html;
}
