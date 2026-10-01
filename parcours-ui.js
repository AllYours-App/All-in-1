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
   Réglages (unité de distance m / yd), persistés dans le navigateur
   -------------------------------------------------------------------------- */
const M_TO_YD = 1.09361;
const PARCOURS_SETTINGS_KEY = "parcours-settings";

let parcoursSettings = { distanceUnit: "m" };
(function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(PARCOURS_SETTINGS_KEY) || "{}");
    if (saved && saved.distanceUnit === "m") parcoursSettings.distanceUnit = "m";
    else if (saved && (saved.distanceUnit === "yd" || saved.distanceUnit === "ft")) parcoursSettings.distanceUnit = "yd"; // "ft" : ancienne valeur, migrée en yards
  } catch (e) { /* localStorage indisponible : on garde la valeur par défaut */ }
})();

function saveSettings() {
  try { localStorage.setItem(PARCOURS_SETTINGS_KEY, JSON.stringify(parcoursSettings)); } catch (e) { /* pas grave */ }
}

function convertDistance(meters, unit) {
  return unit === "yd" ? meters * M_TO_YD : meters;
}
function distanceToMeters(value, unit) {
  if (value === null || value === undefined || value === "" || isNaN(value)) return null;
  return unit === "yd" ? Number(value) / M_TO_YD : Number(value);
}
function distanceUnitLabel() {
  return parcoursSettings.distanceUnit === "yd" ? "yd" : "m";
}
function setDistanceUnit(u) {
  parcoursSettings.distanceUnit = u;
  saveSettings();
  renderCourseModals();
}
// Unité du fairway ET du green : m <-> yd (indépendante du réglage m/yd des calculs Vent / Dénivelé)
const TRACK_UNIT_KEY = "parcours-fairway-unit";
let trackUnit = "m";
try { if (localStorage.getItem(TRACK_UNIT_KEY) === "yd") trackUnit = "yd"; } catch (e) { /* défaut : m */ }
function trackDistance(meters) {
  return Math.round(trackUnit === "yd" ? meters * M_TO_YD : meters);
}
function toggleTrackUnit() {
  trackUnit = trackUnit === "m" ? "yd" : "m";
  try { localStorage.setItem(TRACK_UNIT_KEY, trackUnit); } catch (e) { /* pas grave */ }
  renderFairway();
  renderGreen();
}
function unitToggleHtml() {
  return `
    <div class="segmented unit-toggle">
      <button type="button" class="${parcoursSettings.distanceUnit === "m" ? "active" : ""}" onclick="setDistanceUnit('m')">m</button>
      <button type="button" class="${parcoursSettings.distanceUnit === "yd" ? "active" : ""}" onclick="setDistanceUnit('yd')">yd</button>
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
let distancesCalcOpen = false;
let trackInfoOpen = false;

let windCalc = { angle: 0, speedKmh: 20, distanceInput: 150 };
let elevCalc = { angleHorizon: 0, angleCible: null, distanceInput: 150, permissionGranted: false, listening: false };
let lastBeta = null;

/* --------------------------------------------------------------------------
   Pavé numérique — remplace les inputs type="number" natifs (vent, dénivelé)
   pour toute saisie manuelle de chiffres. Utilise appKeypad() (commun.js).
   Le résultat se met à jour en direct à chaque pression, comme le faisaient
   les oninput des inputs natifs qu'il remplace.
   -------------------------------------------------------------------------- */
let courseKeypadPopup = null; // { title, target, value, unit, mode?, min?, max?, trackerType?, hole?, index? }

function openCourseKeypad(title, target, currentValue, unit) {
  const start = (currentValue === null || currentValue === undefined || currentValue === "") ? "" : String(currentValue);
  courseKeypadPopup = { title: title, target: target, value: start, unit: unit || "" };
  renderCourseModals();
}
// Pavé numérique dédié à la renumérotation d'un point (Fairway/Green) : borné 1-18, validation explicite
// La valeur part vide (et non pré-remplie) : un pavé qui n'ajoute que des chiffres à la suite
// d'une valeur déjà bornée à 18 finissait sans ça par rejeter silencieusement toute frappe.
function openHoleNumberKeypad(trackerType, hole, index) {
  courseKeypadPopup = {
    title: "Trou " + (hole + 1) + " → déplacer vers le trou n°",
    mode: "renumber",
    trackerType: trackerType,
    hole: hole,
    index: index,
    value: "",
    unit: "",
    min: 1,
    max: 18
  };
  renderCourseModals();
}
// Pavé numérique dédié à la calibration de la distance générique tee → green (fairway)
function openFwDistanceKeypad() {
  courseKeypadPopup = {
    title: "Longueur du trou (tee → green)",
    mode: "fwDistance",
    value: "",
    unit: distanceUnitLabel(),
    min: 1,
    max: 999
  };
  renderCourseModals();
}
function closeCourseKeypad() {
  courseKeypadPopup = null;
  renderCourseModals();
}
function courseKeypadPress(d) {
  const p = courseKeypadPopup;
  if (!p) return;
  const maxLen = p.max ? String(p.max).length : 5;
  if (p.value.length >= maxLen) return;
  const candidate = p.value + d;
  if (p.max && Number(candidate) > p.max) return; // borne haute (ex: trou 18)
  p.value = candidate;
  if (p.mode) { renderCourseModals(); return; } // les modes "confirmés" attendent le bouton Valider
  applyCourseKeypadValue();
  renderCourseModals();
}
function courseKeypadBackspace() {
  const p = courseKeypadPopup;
  if (!p) return;
  p.value = p.value.slice(0, -1);
  if (p.mode) { renderCourseModals(); return; }
  applyCourseKeypadValue();
  renderCourseModals();
}
function courseKeypadClear() {
  const p = courseKeypadPopup;
  if (!p) return;
  p.value = "";
  if (p.mode) { renderCourseModals(); return; }
  applyCourseKeypadValue();
  renderCourseModals();
}
// Pousse la valeur en cours de saisie vers le champ visé par "target" (modes "live", sans bouton Valider)
function applyCourseKeypadValue() {
  const p = courseKeypadPopup;
  if (!p) return;
  if (p.target === "windSpeed") updateWindSpeed(p.value);
  else if (p.target === "windDistance") updateWindDistance(p.value);
  else if (p.target === "elevDistance") updateElevationInputDistance(p.value);
}
// Aiguille le bouton Valider vers le bon traitement selon le mode du pavé ouvert
function confirmCourseKeypadValue() {
  const p = courseKeypadPopup;
  if (!p || !p.mode) return;
  if (p.mode === "renumber") return confirmCourseKeypadRenumber();
  if (p.mode === "fwDistance") return confirmFwDistance();
}
// Valide la renumérotation : déplace le point du trou source vers le trou saisi (1-18)
function confirmCourseKeypadRenumber() {
  const p = courseKeypadPopup;
  const n = parseInt(p.value, 10);
  if (!n || n < (p.min || 1) || n > (p.max || 18)) return;
  const destIndex = n - 1;
  if (destIndex === p.hole) { closeCourseKeypad(); return; }

  if (p.trackerType === "fw") {
    const [shot] = fwHoles[p.hole].shots.splice(p.index, 1);
    fwHoles[destIndex].shots.push(shot);
    fwSave();
    closeCourseKeypad();
    fwShowToast(destIndex, "renuméroté");
  } else {
    const [mark] = grHoles[p.hole].marks.splice(p.index, 1);
    grHoles[destIndex].marks.push(mark);
    grSave();
    closeCourseKeypad();
    grShowToast(destIndex, "renuméroté");
  }
}
// Valide la nouvelle longueur du trou : les coups déjà posés conservent leur distance réelle
// (leur position sur la règle est donc recalculée au prorata de l'ancien/nouveau repère)
function confirmFwDistance() {
  const p = courseKeypadPopup;
  const n = parseFloat(p.value.replace(",", "."));
  if (!n || n <= 0) { closeCourseKeypad(); return; }
  const oldMaxM = fwRulerMaxM;
  const newMaxM = distanceToMeters(n, parcoursSettings.distanceUnit);
  fwHoles.forEach((h) => h.shots.forEach((s) => {
    s.y = 100 - (100 - s.y) * (oldMaxM / newMaxM);
    s.y = Math.max(0, Math.min(100, s.y));
  }));
  fwRulerMaxM = newMaxM;
  fwSave();
  closeCourseKeypad();
  renderFairway();
}
function courseKeypadHtml() {
  const p = courseKeypadPopup;
  return `
    <div class="modal-overlay" onclick="closeCourseKeypad()">
      <div class="modal-sheet keypad-sheet" onclick="event.stopPropagation()">
        <div class="modal-head">
          <h3>${p.title}</h3>
          <button class="icon-btn" aria-label="Fermer" onclick="closeCourseKeypad()">✕</button>
        </div>
        <div class="app-keypad-value">${p.value === "" ? "--" : p.value}${p.value !== "" && p.unit ? " " + p.unit : ""}</div>
        ${appKeypad("courseKeypadPress", "courseKeypadBackspace", "courseKeypadClear", null)}
        ${p.mode ? `<button type="button" class="btn btn-primary keypad-confirm-btn" onclick="confirmCourseKeypadValue()">Valider</button>` : ""}
      </div>
    </div>
  `;
}

function renderCourseModals() {
  const root = document.getElementById("course-modal-root");
  if (!root) return;
  const previousCount = root.querySelectorAll(".modal-overlay").length;
  root.innerHTML = [
    windCalcOpen ? windCalcHtml() : "",
    windInfoOpen ? windInfoHtml() : "",
    windDetailOpen ? windDetailHtml() : "",
    elevationOpen ? elevationCalcHtml() : "",
    distancesCalcOpen ? distancesCalcHtml() : "",
    trackInfoOpen ? trackInfoHtml() : "",
    historyOpen ? historyModalHtml() : "",
    tendanceEditState ? tendanceEditHtml() : "",
    courseKeypadPopup ? courseKeypadHtml() : ""
  ].join("");
  // Les modales déjà affichées sont recréées à chaque rendu : on coupe leur
  // animation d'entrée, sinon l'overlay repart de opacity 0 et fait clignoter la page derrière
  root.querySelectorAll(".modal-overlay").forEach((el, i) => {
    if (i < previousCount) el.classList.add("no-anim");
  });
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
        <p>
          <strong>+</strong> : ajoute un point à l'endroit touché<br>
          <strong>−</strong> : touche un point pour le retirer<br>
          <strong>Modifier</strong> : touche un point pour changer son numéro de trou<br>
          <strong>Reset</strong> : efface le parcours et repart du trou 1<br>
          <strong>Par 3</strong> (fairway) : passe le trou en cours<br>
          <strong>Hors green</strong> : le prochain point posé compte hors green<br>
          <strong>m / yd</strong> : change l'unité des distances
        </p>
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
  const distanceM = distanceToMeters(parseFloat(windCalc.distanceInput), parcoursSettings.distanceUnit);
  return computeWindResult(distanceM, windCalc.speedKmh, windCalc.angle);
}
function windResultDistanceLabel() {
  const r = windCalcResult();
  if (r.distance === null || isNaN(r.distance)) return "--";
  return Math.round(convertDistance(r.distance, parcoursSettings.distanceUnit)) + " " + distanceUnitLabel();
}
function windResultDeviationLabel() {
  const r = windCalcResult();
  if (r.deviation === null || isNaN(r.deviation)) return "--";
  const v = Math.round(convertDistance(r.deviation, parcoursSettings.distanceUnit));
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
            <button type="button" class="input-box-value" onclick="openCourseKeypad('Vitesse du vent (km/h)', 'windSpeed', '${windCalc.speedKmh}', 'km/h')">${windCalc.speedKmh}</button>
          </div>
          <div class="input-box">
            <span class="input-box-label">Distance du coup (${distanceUnitLabel()})</span>
            <button type="button" class="input-box-value" onclick="openCourseKeypad('Distance du coup', 'windDistance', '${windCalc.distanceInput}', '${distanceUnitLabel()}')">${windCalc.distanceInput}</button>
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
    const dDisplay = Math.round(convertDistance(dM, parcoursSettings.distanceUnit));
    const cells = WIND_CHART_SPEEDS.map((speed) => {
      const r = computeWindResult(dM, speed, angleDeg);
      const raw = valueKey === "distance" ? r.distance : Math.abs(r.deviation);
      return Math.round(convertDistance(raw, parcoursSettings.distanceUnit));
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
  const distanceM = distanceToMeters(parseFloat(windCalc.distanceInput), parcoursSettings.distanceUnit);
  const unit = distanceUnitLabel();
  return WIND_DETAIL_DIRECTIONS.map((d) => {
    const r = computeWindResult(distanceM, windCalc.speedKmh, d.angle);
    const dist = (r.distance === null || isNaN(r.distance)) ? "--" : Math.round(convertDistance(r.distance, parcoursSettings.distanceUnit)) + " " + unit;
    let dev = "--";
    if (r.deviation !== null && !isNaN(r.deviation)) {
      const v = Math.round(Math.abs(convertDistance(r.deviation, parcoursSettings.distanceUnit)));
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
  const distanceM = distanceToMeters(parseFloat(elevCalc.distanceInput), parcoursSettings.distanceUnit);
  if (distanceM === null || isNaN(distanceM)) return { deniv: null, angle };
  const deniv = distanceM * Math.tan(angle * Math.PI / 180);
  return { deniv, angle };
}
function elevationResultLabel() {
  const r = computeElevationResult();
  if (r.deniv === null || isNaN(r.deniv)) return "--";
  const distanceM = distanceToMeters(parseFloat(elevCalc.distanceInput), parcoursSettings.distanceUnit);
  if (distanceM === null || isNaN(distanceM)) return "--";
  const distanceAJouer = distanceM + r.deniv;
  return Math.round(convertDistance(distanceAJouer, parcoursSettings.distanceUnit)) + " " + distanceUnitLabel();
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
            <button type="button" class="input-box-value" onclick="openCourseKeypad('Distance du coup', 'elevDistance', '${elevCalc.distanceInput}', '${distanceUnitLabel()}')">${elevCalc.distanceInput}</button>
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

/* --------------------------------------------------------------------------
   Distances perso — lecture des distances saisies dans Menu > Mes distances.
   State géré par menu.js (golfBag, personalDistances, golfClubCatalog,
   settings.distanceUnit) : les deux scripts partagent le scope global de
   la page, donc on lit directement ces variables sans dupliquer le state.
   -------------------------------------------------------------------------- */
function openDistancesCalc() { distancesCalcOpen = true; renderCourseModals(); }
function closeDistancesCalc() { distancesCalcOpen = false; renderCourseModals(); }

function goToMenuDistances() {
  closeDistancesCalc();
  if (typeof showPage === "function") showPage("menu");
  if (typeof goToDistances === "function") goToDistances();
}

// Dans Menu, l'unité "Yards/Feet" représente des yards pour tous les clubs de
// cet écran (le putter, en feet, n'a plus de distance suivie et est exclu ici).
function distancesMenuIsYards() {
  return typeof settings !== "undefined" && settings.distanceUnit === "ft";
}
function distancesMenuValueToMeters(value) {
  return distancesMenuIsYards() ? Number(value) / M_TO_YD : Number(value);
}
function metersToDistancesMenuUnit(meters) {
  return distancesMenuIsYards() ? meters * M_TO_YD : meters;
}

// Clubs du sac ayant une distance renseignée (hors putter), triés du plus
// long au plus court coup réel (en mètres). Les wedges peuvent apporter
// plusieurs lignes (une par distance nommée saisie dans Menu).
function distancesCalcRows() {
  if (typeof golfBag === "undefined" || typeof golfClubCatalog === "undefined") {
    return [];
  }
  const unit = distancesMenuIsYards() ? "yd" : "m";
  const rows = [];

  golfClubCatalog
    .filter((c) => c.id !== "putter" && golfBag.clubs.includes(c.id))
    .forEach((c) => {
      if (c.id.startsWith("wedge")) {
        const entries = (typeof wedgeDistances !== "undefined" && wedgeDistances[c.id]) || [];
        entries.forEach((e) => {
          if (e.value === null || e.value === undefined || e.value === "") return;
          const meters = distancesMenuValueToMeters(e.value);
          rows.push({ name: `${c.name} · ${e.label}`, meters, unit, display: Math.round(metersToDistancesMenuUnit(meters)) });
        });
        return;
      }
      const raw = (typeof personalDistances !== "undefined") ? personalDistances[c.id] : null;
      if (raw === null || raw === undefined || raw === "") return;
      const meters = distancesMenuValueToMeters(raw);
      rows.push({ name: c.name, meters, unit, display: Math.round(metersToDistancesMenuUnit(meters)) });
    });

  return rows.sort((a, b) => b.meters - a.meters);
}

function distancesCalcHtml() {
  const rows = distancesCalcRows();
  const max = rows.length ? Math.max(...rows.map((r) => r.meters)) : 0;

  return `
    <div class="modal-overlay" onclick="closeDistancesCalc()">
      <div class="modal-sheet" onclick="event.stopPropagation()">
        <div class="modal-head">
          <h3>Mes distances</h3>
          <button class="icon-btn" aria-label="Fermer" onclick="closeDistancesCalc()">✕</button>
        </div>

        ${rows.length === 0 ? `
          <p class="hint-text">Aucune distance renseignée. Ajoute-les dans Menu &rsaquo; Mes distances.</p>
          <button class="btn btn-primary" onclick="goToMenuDistances()">Renseigner mes distances</button>
        ` : rows.map((r) => `
          <div class="progress-row">
            <div class="progress-labels">
              <span>${r.name}</span>
              <span>${r.display} ${r.unit}</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width:${max ? (r.meters / max) * 100 : 0}%;"></div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

/* ==========================================================================
   Icônes partagées (reset / crayon) pour Fairway et Green
   ========================================================================== */
const TRACK_RESET_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v6h6"></path><path d="M20 20v-6h-6"></path><path d="M5.5 15A9 9 0 0 0 20 14M18.5 9A9 9 0 0 0 4 10"></path></svg>`;
const TRACK_PENCIL_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>`;

/* --------------------------------------------------------------------------
   Pinch-to-zoom générique (façon Maps), utilisable pour le fairway et le green.
   Un seul point de contact = comportement normal (tap pour placer un point).
   Deux points de contact = zoom + déplacement de la couche de contenu.
   -------------------------------------------------------------------------- */
function pinchTouchDist(a, b) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}
function pinchClamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

/* --------------------------------------------------------------------------
   Règle de distance générique (repère visuel tee → green), affichée en fond
   du fairway et en anneaux concentriques sur le green. Ce ne sont pas des
   distances réelles du trou (non stockées ici) mais un repère d'échelle.
   -------------------------------------------------------------------------- */
let fwRulerMaxM = 300; // distance tee → green : calibrable en tapant un repère (mode Modifier), 300 par défaut
const FW_RULER_MARKS_M = [100, 150, 225, 300]; // repères affichés (mètres)
const FW_RULER_Y_FIRST_PCT = 80; // hauteur du 1er repère (100 m), en % depuis le haut : bas du fairway
const FW_RULER_Y_LAST_PCT = 14; // hauteur du dernier repère (300 m) : marge gardée en haut (zone du green)

function fwRulerHtml() {
  let html = "";
  FW_RULER_MARKS_M.forEach((d) => {
    const y = FW_RULER_Y_FIRST_PCT + ((d - FW_RULER_MARKS_M[0]) / (FW_RULER_MARKS_M[FW_RULER_MARKS_M.length - 1] - FW_RULER_MARKS_M[0])) * (FW_RULER_Y_LAST_PCT - FW_RULER_Y_FIRST_PCT);
    html += `<div class="fw-ruler-line" style="top:${y}%;"></div><span class="fw-ruler-label" style="top:${y}%;">${trackDistance(d)} ${trackUnit}</span>`;
  });
  return html;
}

// Repères fixes et génériques (distance en mètres, convertie à l'affichage ; diamètre en cqmin).
// Le "30+" est placé juste avant la limite du green, et aucune distance n'est affichée sur la limite elle-même.
const GR_RINGS = [
  { m: 5, diameter: 28 },
  { m: 15, diameter: 56 },
  { m: 30, diameter: 84, plus: true }
];
const GR_GREEN_DIAMETER_CQMIN = 94; // même diamètre que .gr-green
const GR_GREEN_RADIUS_PCT = GR_GREEN_DIAMETER_CQMIN / 2; // rayon du green, en % de la zone

function grRingsHtml() {
  return GR_RINGS.map((r) => {
    const label = trackDistance(r.m) + (r.plus ? "+" : "");
    return `<div class="gr-ring" style="width:${r.diameter}cqmin;height:${r.diameter}cqmin;"></div><span class="gr-ring-label" style="top:calc(50% - ${r.diameter / 2}cqmin);">${label} ${trackUnit}</span>`;
  }).join("");
}

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
      if (saved.maxDistanceM) fwRulerMaxM = saved.maxDistanceM;
      return saved.holes;
    }
  } catch (e) { /* localStorage indisponible : on repart d'un parcours vide */ }
  return fwDefaultHoles();
}

function fwSave() {
  try { localStorage.setItem(FW_STORAGE_KEY, JSON.stringify({ holes: fwHoles, maxDistanceM: fwRulerMaxM })); } catch (e) { /* pas grave */ }
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

/* --- Pinch-to-zoom (2 doigts) : état de vue + gestion tactile --- */
let fwView = { scale: 1, tx: 0, ty: 0 };
let fwPinch = { active: false, justPinched: false, startDist: 0, startScale: 1, startMidX: 0, startMidY: 0, startTx: 0, startTy: 0, rectW: 0, rectH: 0 };

function fwTouchStart(e) {
  if (e.touches.length !== 2) return;
  e.preventDefault();
  const rect = e.currentTarget.getBoundingClientRect();
  const [a, b] = e.touches;
  fwPinch.active = true;
  fwPinch.startDist = pinchTouchDist(a, b);
  fwPinch.startScale = fwView.scale;
  fwPinch.startMidX = (a.clientX + b.clientX) / 2 - rect.left;
  fwPinch.startMidY = (a.clientY + b.clientY) / 2 - rect.top;
  fwPinch.startTx = fwView.tx;
  fwPinch.startTy = fwView.ty;
  fwPinch.rectW = rect.width;
  fwPinch.rectH = rect.height;
}
function fwTouchMove(e) {
  if (!fwPinch.active || e.touches.length !== 2) return;
  e.preventDefault();
  const rect = e.currentTarget.getBoundingClientRect();
  const [a, b] = e.touches;
  const scale = pinchClamp(fwPinch.startScale * (pinchTouchDist(a, b) / fwPinch.startDist), 1, 4);
  const midX = (a.clientX + b.clientX) / 2 - rect.left;
  const midY = (a.clientY + b.clientY) / 2 - rect.top;
  // Le point du contenu situé sous les doigts au départ du geste doit rester sous les doigts
  // pendant tout le pinch : c'est ce qui ancre le zoom sur le point pincé (et non sur le coin
  // haut-gauche) et permet, à distance constante entre les doigts, un simple déplacement (pan).
  const anchorX = (fwPinch.startMidX - fwPinch.startTx) / fwPinch.startScale;
  const anchorY = (fwPinch.startMidY - fwPinch.startTy) / fwPinch.startScale;
  fwView.scale = scale;
  fwView.tx = pinchClamp(midX - anchorX * scale, -(scale - 1) * fwPinch.rectW, 0);
  fwView.ty = pinchClamp(midY - anchorY * scale, -(scale - 1) * fwPinch.rectH, 0);
  const layer = e.currentTarget.querySelector(".fw-zoom-layer");
  if (layer) layer.style.transform = `translate(${fwView.tx}px, ${fwView.ty}px) scale(${fwView.scale})`;
}
function fwTouchEnd(e) {
  if (fwPinch.active) fwPinch.justPinched = true; // évite qu'un doigt relevé ne déclenche un tap-placement
  if (e.touches.length < 2) fwPinch.active = false;
}

function fwZoneTap(event) {
  if (fwPinch.justPinched) { fwPinch.justPinched = false; return; }
  const zone = event.currentTarget;
  const rect = zone.getBoundingClientRect(); // conteneur non transformé : le zoom porte sur .fw-zoom-layer
  const rawX = event.clientX - rect.left;
  const rawY = event.clientY - rect.top;
  const contentX = (rawX - fwView.tx) / fwView.scale;
  const contentY = (rawY - fwView.ty) / fwView.scale;
  let x = (contentX / rect.width) * 100;
  let y = (contentY / rect.height) * 100;
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
    openHoleNumberKeypad("fw", hit.hole, hit.index);
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
  fwTendanceOverride = null;
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

function fwVisualHtml() {
  const holeNum = Math.min(fwCurrentHoleIndex() + 1, 18);

  return `
    <div class="fw-visual" onclick="fwZoneTap(event)" ontouchstart="fwTouchStart(event)" ontouchmove="fwTouchMove(event)" ontouchend="fwTouchEnd(event)" ontouchcancel="fwTouchEnd(event)">
      <div class="fw-zoom-layer" style="transform:translate(${fwView.tx}px, ${fwView.ty}px) scale(${fwView.scale});">
        <div class="fw-stripe fw-stripe-rough-left"></div>
        <div class="fw-stripe fw-stripe-fairway"></div>
        <div class="fw-stripe fw-stripe-rough-right"></div>

        ${fwRulerHtml()}

        <div class="fw-flag">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21V4"></path><path d="M6 4h11l-3 4 3 4H6"></path></svg>
        </div>

        ${fwAllMarksHtml()}
      </div>

      <span class="hole-counter track-hole-badge">${holeNum}<em>/18</em></span>
      <div class="track-corner-bl">
        <button type="button" class="mode-btn mode-btn-offgreen" onclick="event.stopPropagation(); fwPar3Tap();">Par 3</button>
      </div>

      <div class="track-rail track-rail-right">
        <div class="track-rail-row">
          <button type="button" class="mode-btn ${fwMode === "plus" ? "active" : ""}" onclick="event.stopPropagation(); fwSetMode('plus');" aria-label="Ajouter un coup">+</button>
          <button type="button" class="mode-btn mode-btn-minus ${fwMode === "minus" ? "active" : ""}" onclick="event.stopPropagation(); fwSetMode('minus');" aria-label="Retirer un coup">−</button>
        </div>
        <button type="button" class="mode-btn mode-btn-edit ${fwMode === "edit" ? "active" : ""}" onclick="event.stopPropagation(); fwSetMode('edit');" aria-label="Renuméroter un coup">${TRACK_PENCIL_ICON}</button>
        <button type="button" class="track-reset-btn track-reset-inline" aria-label="Nouveau parcours fairway" onclick="event.stopPropagation(); resetFairwayRound();">${TRACK_RESET_ICON}</button>
      </div>

      ${fwLastLogged ? `<div class="fw-toast">Trou ${fwLastLogged.hole + 1} — ${fwLastLogged.label}</div>` : ""}
    </div>
  `;
}

function renderFairway() {
  const root = document.getElementById("fairway-root");
  if (root) root.innerHTML = fwVisualHtml();
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
let grOffNext = false; // prochain point posé = hors green (se désarme après la pose)

// Un point est sur le green sauf s'il est forcé "hors green" (off) ou situé hors du cercle affiché
function grMarkOnGreen(m) {
  if (m.off) return false;
  return Math.sqrt(Math.pow(m.x - 50, 2) + Math.pow(m.y - 50, 2)) <= GR_GREEN_RADIUS_PCT;
}

function grToggleOffNext() {
  grOffNext = !grOffNext;
  if (grOffNext) grMode = "plus";
  renderGreen();
}

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
  grOffNext = false;
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

/* --- Pinch-to-zoom (2 doigts) : état de vue + gestion tactile --- */
let grView = { scale: 1, tx: 0, ty: 0 };
let grPinch = { active: false, justPinched: false, startDist: 0, startScale: 1, startMidX: 0, startMidY: 0, startTx: 0, startTy: 0, rectW: 0, rectH: 0 };

function grTouchStart(e) {
  if (e.touches.length !== 2) return;
  e.preventDefault();
  const rect = e.currentTarget.getBoundingClientRect();
  const [a, b] = e.touches;
  grPinch.active = true;
  grPinch.startDist = pinchTouchDist(a, b);
  grPinch.startScale = grView.scale;
  grPinch.startMidX = (a.clientX + b.clientX) / 2 - rect.left;
  grPinch.startMidY = (a.clientY + b.clientY) / 2 - rect.top;
  grPinch.startTx = grView.tx;
  grPinch.startTy = grView.ty;
  grPinch.rectW = rect.width;
  grPinch.rectH = rect.height;
}
function grTouchMove(e) {
  if (!grPinch.active || e.touches.length !== 2) return;
  e.preventDefault();
  const rect = e.currentTarget.getBoundingClientRect();
  const [a, b] = e.touches;
  const scale = pinchClamp(grPinch.startScale * (pinchTouchDist(a, b) / grPinch.startDist), 1, 4);
  const midX = (a.clientX + b.clientX) / 2 - rect.left;
  const midY = (a.clientY + b.clientY) / 2 - rect.top;
  const anchorX = (grPinch.startMidX - grPinch.startTx) / grPinch.startScale;
  const anchorY = (grPinch.startMidY - grPinch.startTy) / grPinch.startScale;
  grView.scale = scale;
  grView.tx = pinchClamp(midX - anchorX * scale, -(scale - 1) * grPinch.rectW, 0);
  grView.ty = pinchClamp(midY - anchorY * scale, -(scale - 1) * grPinch.rectH, 0);
  const layer = e.currentTarget.querySelector(".gr-zoom-layer");
  if (layer) layer.style.transform = `translate(${grView.tx}px, ${grView.ty}px) scale(${grView.scale})`;
}
function grTouchEnd(e) {
  if (grPinch.active) grPinch.justPinched = true;
  if (e.touches.length < 2) grPinch.active = false;
}

function grZoneTap(event) {
  if (grPinch.justPinched) { grPinch.justPinched = false; return; }
  const zone = event.currentTarget;
  const rect = zone.getBoundingClientRect();
  const rawX = event.clientX - rect.left;
  const rawY = event.clientY - rect.top;
  const contentX = (rawX - grView.tx) / grView.scale;
  const contentY = (rawY - grView.ty) / grView.scale;
  let x = (contentX / rect.width) * 100;
  let y = (contentY / rect.height) * 100;
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
    openHoleNumberKeypad("gr", hit.hole, hit.index);
    return;
  }

  // mode "plus" (par défaut) : ajoute une marque sur le trou en cours
  const idx = grCurrentHoleIndex();
  if (idx >= 18) return;
  const off = grOffNext;
  grHoles[idx].marks.push(off ? { x, y, off: true } : { x, y });
  grOffNext = false;
  grSave();
  grShowToast(idx, off ? "enregistré hors green" : "enregistré");
  renderGreen();
}

function resetGreenRound() {
  const hasData = grHoles.some((h) => h.marks.length > 0);
  if (hasData && !confirm("Effacer les greens enregistrés et recommencer à zéro ?")) return;
  grHoles = grDefaultHoles();
  grMode = "plus";
  grOffNext = false;
  grLastLogged = null;
  grTendanceOverride = null;
  grSave();
  renderGreen();
}

function grAllMarksHtml() {
  let html = "";
  for (let i = 0; i < 18; i++) {
    grHoles[i].marks.forEach((m, mi) => {
      let cls = "gr-mark";
      if (!grMarkOnGreen(m)) cls += " is-outside";
      else if (mi > 0) cls += " is-extra";
      html += `<div class="${cls}" style="left:${m.x}%;top:${m.y}%;">${i + 1}</div>`;
    });
  }
  return html;
}

function grVisualHtml() {
  const holeNum = Math.min(grCurrentHoleIndex() + 1, 18);

  return `
    <div class="gr-visual" onclick="grZoneTap(event)" ontouchstart="grTouchStart(event)" ontouchmove="grTouchMove(event)" ontouchend="grTouchEnd(event)" ontouchcancel="grTouchEnd(event)">
      <div class="gr-zoom-layer" style="transform:translate(${grView.tx}px, ${grView.ty}px) scale(${grView.scale});">
        <div class="gr-green"></div>
        ${grRingsHtml()}
        <div class="gr-flag">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21V4"></path><path d="M6 4h11l-3 4 3 4H6"></path></svg>
        </div>
        ${grAllMarksHtml()}
      </div>

      <span class="hole-counter track-hole-badge">${holeNum}<em>/18</em></span>
      <button type="button" class="track-reset-btn track-reset-corner" aria-label="Nouveau parcours green" onclick="event.stopPropagation(); resetGreenRound();">${TRACK_RESET_ICON}</button>

      <div class="track-rail track-rail-right">
        <div class="track-rail-row">
          <button type="button" class="mode-btn ${grMode === "plus" ? "active" : ""}" onclick="event.stopPropagation(); grSetMode('plus');" aria-label="Ajouter une marque">+</button>
          <button type="button" class="mode-btn mode-btn-minus ${grMode === "minus" ? "active" : ""}" onclick="event.stopPropagation(); grSetMode('minus');" aria-label="Retirer une marque">−</button>
        </div>
        <button type="button" class="mode-btn mode-btn-edit ${grMode === "edit" ? "active" : ""}" onclick="event.stopPropagation(); grSetMode('edit');" aria-label="Renuméroter une marque">${TRACK_PENCIL_ICON}</button>
      </div>

      <div class="track-corner-bl">
        <button type="button" class="mode-btn track-unit-btn" onclick="event.stopPropagation(); toggleTrackUnit();" aria-label="Changer l'unité de distance">${trackUnit}</button>
        <button type="button" class="mode-btn mode-btn-offgreen ${grOffNext ? "active" : ""}" onclick="event.stopPropagation(); grToggleOffNext();" aria-label="Prochain point hors green">Hors green</button>
      </div>

      <span class="quick-action-info track-info-corner" aria-label="À propos du suivi fairway et green" onclick="event.stopPropagation(); openTrackInfo();">i</span>

      ${grLastLogged !== null ? `<div class="fw-toast">Trou ${grLastLogged.hole + 1} — ${grLastLogged.label}</div>` : ""}
    </div>
  `;
}

function renderGreen() {
  const root = document.getElementById("green-root");
  if (root) root.innerHTML = grVisualHtml();
}

/* ==========================================================================
   HISTORIQUE — bilan du parcours en cours (fairways/greens touchés, tendance
   dominante) + historique de progression, enregistrés en localStorage.
   ========================================================================== */
let historyOpen = false;
const CAPTURE_STORAGE_KEY = "parcours-captures";

function openHistoryModal() { historyOpen = true; renderCourseModals(); }
function closeHistoryModal() { historyOpen = false; renderCourseModals(); }

function fwHitPercent() {
  let eligible = 0, hit = 0;
  fwHoles.forEach((h) => {
    if (h.par3 || h.shots.length === 0) return;
    eligible++;
    if (h.shots[0].zone === "fairway") hit++;
  });
  return eligible === 0 ? null : Math.round((hit / eligible) * 100);
}

function grHitPercent() {
  let total = 0, hit = 0;
  grHoles.forEach((h) => h.marks.forEach((m) => {
    total++;
    if (grMarkOnGreen(m)) hit++;
  }));
  return total === 0 ? null : Math.round((hit / total) * 100);
}

const TENDANCE_LABELS = {
  left: "Gauche", right: "Droite", short: "Court", long: "Long",
  short_left: "Court + gauche", short_right: "Court + droite",
  long_left: "Long + gauche", long_right: "Long + droite"
};

// Chaque point vote pour l'axe (gauche/droite ou court/long) où son écart au centre est le plus marqué
function addTendanceVote(votes, point) {
  const dx = point.x - 50;
  const dy = point.y - 50;
  if (Math.abs(dx) >= Math.abs(dy)) {
    if (dx < 0) votes.left++; else if (dx > 0) votes.right++;
  } else {
    if (dy > 0) votes.short++; else if (dy < 0) votes.long++;
  }
}
function tendanceFromVotes(votes) {
  const best = Object.keys(votes).reduce((a, b) => (votes[a] >= votes[b] ? a : b));
  return votes[best] > 0 ? TENDANCE_LABELS[best] : null;
}
// Fairway : uniquement gauche ou droite (selon le côté de l'axe central où tombe le point)
function fwTendance() {
  const votes = { left: 0, right: 0 };
  fwHoles.forEach((h) => h.shots.forEach((s) => {
    if (s.x < 50) votes.left++;
    else if (s.x > 50) votes.right++;
  }));
  return tendanceFromVotes(votes);
}
// Green : 8 secteurs de 45° autour du drapeau (4 axes + 4 diagonales)
const GR_DIAGONAL_RATIO = Math.tan(Math.PI / 8); // en dessous : l'écart est sur un seul axe
function addGreenTendanceVote(votes, point) {
  const dx = point.x - 50;
  const dy = point.y - 50;
  if (dx === 0 && dy === 0) return;
  const ax = Math.abs(dx), ay = Math.abs(dy);
  const vertical = dy > 0 ? "short" : "long";
  const horizontal = dx < 0 ? "left" : "right";
  let key;
  if (Math.min(ax, ay) / Math.max(ax, ay) > GR_DIAGONAL_RATIO) key = vertical + "_" + horizontal;
  else key = ax >= ay ? horizontal : vertical;
  votes[key] = (votes[key] || 0) + 1;
}
function grTendance() {
  const votes = { left: 0, right: 0, short: 0, long: 0, short_left: 0, short_right: 0, long_left: 0, long_right: 0 };
  grHoles.forEach((h) => h.marks.forEach((m) => addGreenTendanceVote(votes, m)));
  return tendanceFromVotes(votes);
}

// Correction manuelle du texte de tendance, en cas de désaccord avec le calcul automatique
let fwTendanceOverride = null;
let grTendanceOverride = null;
let tendanceEditState = null; // { key: "fw" | "gr" }

function fwTendanceDisplay() { return fwTendanceOverride !== null ? fwTendanceOverride : fwTendance(); }
function grTendanceDisplay() { return grTendanceOverride !== null ? grTendanceOverride : grTendance(); }

function openTendanceEdit(key) {
  tendanceEditState = { key: key, value: key === "fw" ? (fwTendanceDisplay() || "") : (grTendanceDisplay() || "") };
  renderCourseModals();
}
function closeTendanceEdit() { tendanceEditState = null; renderCourseModals(); }
function confirmTendanceEdit() {
  const t = tendanceEditState;
  if (!t) return;
  const input = document.getElementById("tendance-edit-input");
  const val = input ? input.value.trim() : "";
  if (t.key === "fw") fwTendanceOverride = val === "" ? null : val;
  else grTendanceOverride = val === "" ? null : val;
  tendanceEditState = null;
  renderCourseModals();
}
function tendanceEditHtml() {
  const t = tendanceEditState;
  const title = t.key === "fw" ? "Tendance fairway" : "Tendance green";
  return `
    <div class="modal-overlay" onclick="closeTendanceEdit()">
      <div class="modal-sheet keypad-sheet" onclick="event.stopPropagation()">
        <div class="modal-head">
          <h3>${title}</h3>
          <button class="icon-btn" aria-label="Fermer" onclick="closeTendanceEdit()">✕</button>
        </div>
        <input type="text" id="tendance-edit-input" class="tendance-edit-input" value="${t.value.replace(/"/g, "&quot;")}" placeholder="Ex : Gauche, Court…" autofocus>
        <button type="button" class="btn btn-primary keypad-confirm-btn" onclick="confirmTendanceEdit()">Valider</button>
      </div>
    </div>
  `;
}

function loadHistoryEntries() {
  try { return JSON.parse(localStorage.getItem(CAPTURE_STORAGE_KEY) || "[]"); } catch (e) { return []; }
}

function historyModalHtml() {
  const fw = fwHitPercent();
  const gr = grHitPercent();
  const history = loadHistoryEntries().slice(-10).reverse();

  return `
    <div class="modal-overlay" onclick="closeHistoryModal()">
      <div class="modal-sheet" onclick="event.stopPropagation()">
        <div class="modal-head">
          <h3>Historique</h3>
          <button class="icon-btn" aria-label="Fermer" onclick="closeHistoryModal()">✕</button>
        </div>

        <p class="table-title">Ce parcours</p>
        <div class="field-grid-2">
          <div class="result-box">
            <span class="result-label">Fairways touchés</span>
            <span class="result-value">${fw === null ? "--" : fw + " %"}</span>
          </div>
          <div class="result-box">
            <span class="result-label">Greens touchés</span>
            <span class="result-value">${gr === null ? "--" : gr + " %"}</span>
          </div>
        </div>
        <div class="field-grid-2">
          <div class="result-box tendance-box" onclick="openTendanceEdit('fw')">
            <span class="result-label">Tendance fairway</span>
            <span class="result-value">${fwTendanceDisplay() || "--"} ${TRACK_PENCIL_ICON}</span>
          </div>
          <div class="result-box tendance-box" onclick="openTendanceEdit('gr')">
            <span class="result-label">Tendance green</span>
            <span class="result-value">${grTendanceDisplay() || "--"} ${TRACK_PENCIL_ICON}</span>
          </div>
        </div>
        <button type="button" class="btn btn-primary" onclick="saveHistoryEntry()">Enregistrer ce bilan</button>

        <p class="table-title">Progression</p>
        ${history.length === 0 ? `<p class="hint-text">Aucun bilan enregistré pour l'instant.</p>` : `
          <table class="data-table">
            <thead>
              <tr><th class="col-left">Date</th><th>Fairway</th><th>Green</th><th>Tend. fairway</th><th>Tend. green</th></tr>
            </thead>
            <tbody>
              ${history.map((h) => `
                <tr>
                  <td class="col-left">${new Date(h.date).toLocaleDateString()}</td>
                  <td>${h.fairwayPercent === null || h.fairwayPercent === undefined ? "--" : h.fairwayPercent + "%"}</td>
                  <td>${h.greenPercent === null || h.greenPercent === undefined ? "--" : h.greenPercent + "%"}</td>
                  <td>${h.fwTendance || h.tendance || "--"}</td>
                  <td>${h.grTendance || "--"}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        `}
      </div>
    </div>
  `;
}

function saveHistoryEntry() {
  const snapshot = {
    date: new Date().toISOString(),
    fairwayPercent: fwHitPercent(),
    greenPercent: grHitPercent(),
    fwTendance: fwTendanceDisplay(),
    grTendance: grTendanceDisplay()
  };
  let list = [];
  try { list = JSON.parse(localStorage.getItem(CAPTURE_STORAGE_KEY) || "[]"); } catch (e) { list = []; }
  list.push(snapshot);
  try { localStorage.setItem(CAPTURE_STORAGE_KEY, JSON.stringify(list)); } catch (e) { /* pas grave */ }
  renderCourseModals(); // rafraîchit la modale : la progression affiche immédiatement le nouveau bilan
}
