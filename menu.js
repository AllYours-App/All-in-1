/* ==========================================================================
   Références DOM globales
   ========================================================================== */
const menuRoot = document.getElementById("root");
const backBtn = document.getElementById("backBtn");
const headerTitle = document.getElementById("headerTitle");
const backLabel = document.querySelector(".nav_back-label");

/* ==========================================================================
   State global de l'app + persistance localStorage
   ========================================================================== */
const STORAGE_KEY = "golfAppState";

let userProfile = { firstName: "", index: null };

let settings = {
  temperatureC: 20,
  altitudeM: 0,
  radarUnit: "mps",
  speedUnit: "mph",
  distanceUnit: "m", // "ft" = yards (voir MENU_M_TO_YD)
  defaultRadarId: "radar_default",
};

let radars = [
  {
    id: "radar_default",
    label: "Radar principal",
    clubOffsetValue: 0,
    clubOffsetUnit: "pct",
    ballOffsetValue: 0,
    ballOffsetUnit: "pct",
  },
];

let golfBag = { clubs: [] };
let personalDistances = {}; // { clubId: distance } — un club = une distance
let wedgeDistances = {};    // { clubId: [{ id, label, value }, ...] } — un wedge = plusieurs distances
let driverSettings = { length: null, weight: null };

function saveMenuState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      userProfile, settings, radars, golfBag, driverSettings, personalDistances, wedgeDistances,
    }));
  } catch (e) {
    console.error("Erreur d'écriture du localStorage", e);
  }
}

function loadMenuState() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!data) return;
    // Object.assign ignore undefined/null : pas besoin de tester chaque clé
    Object.assign(userProfile, data.userProfile);
    Object.assign(settings, data.settings);
    Object.assign(golfBag, data.golfBag);
    Object.assign(driverSettings, data.driverSettings);
    Object.assign(personalDistances, data.personalDistances);
    Object.assign(wedgeDistances, data.wedgeDistances);
    if (Array.isArray(data.radars) && data.radars.length) radars = data.radars;
  } catch (e) {
    console.error("Erreur de lecture du localStorage", e);
  }
}

// Échappe une saisie libre avant injection dans innerHTML ou dans un attribut
function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function toNumberOrNull(raw) {
  const n = parseFloat(raw);
  return isNaN(n) ? null : n;
}

/* ==========================================================================
   Navigation : chaque écran s'enregistre via enterScreen(), ce qui permet
   de le re-render (ex. pavé numérique) sans connaître son nom.
   ========================================================================== */
const backToHome = () => showPage('home');
const backToMenu = () => { showPage('menu'); renderMenuTab(); };

let backTarget = backToHome;
let currentRender = renderMenuTab;

function enterScreen(renderFn, title, back = backToMenu) {
  currentRender = renderFn;
  backTarget = back;
  headerTitle.textContent = title;
  backLabel.textContent = back === backToHome ? "Home" : "Menu";
  backBtn.classList.remove("is-hidden");
}

// Écrit l'écran + la popup pavé numérique si elle est ouverte
function paint(html) {
  menuRoot.innerHTML = html + (menuKeypadPopup ? menuKeypadHtml() : '');
}

// Prénom : enregistré à chaque frappe, sans re-render (le champ garde le focus
// et un re-render au blur ferait perdre le clic sur le bouton tapé ensuite)
function updateFirstName(value) {
  userProfile.firstName = value.trim().slice(0, 20);
  saveMenuState();
  if (window.renderHomeGreeting) window.renderHomeGreeting();
}

/* ==========================================================================
   Pavé numérique générique — remplace les <input type="number">.
   Un bouton déclencheur porte ses paramètres en data-* (échappés, donc sûrs
   même avec un libellé contenant une apostrophe) et appelle openMenuKeypad(this).
   "target" ("type:param1:param2") identifie le champ à mettre à jour (voir
   applyMenuKeypadValue). Utilise appKeypad() de commun.js.
   ========================================================================== */
let menuKeypadPopup = null; // { title, target, value, decimal, allowSign, unit }

function keypadAttrs({ title, target, value, decimal = false, sign = false, unit = '' }) {
  return `data-title="${escapeHtml(title)}" data-target="${escapeHtml(target)}" data-value="${escapeHtml(value)}" data-unit="${escapeHtml(unit)}"${decimal ? ' data-decimal' : ''}${sign ? ' data-sign' : ''}`;
}

// Bouton numérique : affiche `text` (par défaut la valeur, ou « — » si vide)
function numButton(opts, text = opts.value ?? '—', extraClass = '') {
  return `<button type="button" class="field-num-btn ${extraClass}" ${keypadAttrs(opts)} onclick="openMenuKeypad(this)">${text}</button>`;
}

function openMenuKeypad(el) {
  const d = el.dataset;
  menuKeypadPopup = {
    title: d.title,
    target: d.target,
    value: d.value.replace('.', ','),
    decimal: 'decimal' in d,
    allowSign: 'sign' in d,
    unit: d.unit,
  };
  currentRender();
}

function closeMenuKeypad() {
  menuKeypadPopup = null;
  currentRender();
}

function editKeypad(fn) {
  if (!menuKeypadPopup) return;
  fn(menuKeypadPopup);
  currentRender();
}

function menuKeypadPress(d) {
  editKeypad(p => { if (p.value.length < 7) p.value += d; });
}
function menuKeypadDecimal() {
  editKeypad(p => {
    if (!p.decimal || p.value.includes(',')) return;
    p.value += (p.value === '' || p.value === '-') ? '0,' : ',';
  });
}
function menuKeypadSign() {
  editKeypad(p => {
    if (p.allowSign) p.value = p.value.startsWith('-') ? p.value.slice(1) : '-' + p.value;
  });
}
function menuKeypadBackspace() {
  editKeypad(p => { p.value = p.value.slice(0, -1); });
}
function menuKeypadClear() {
  editKeypad(p => { p.value = ''; });
}

function confirmMenuKeypad() {
  if (!menuKeypadPopup) return;
  applyMenuKeypadValue(menuKeypadPopup.target, menuKeypadPopup.value.replace(',', '.'));
  closeMenuKeypad();
}

// Pousse la valeur saisie vers le champ visé par "target"
function applyMenuKeypadValue(target, raw) {
  const [kind, a, b] = target.split(':');
  if (kind === 'setting') updateMenuSetting(a, raw);
  else if (kind === 'driver') updateDriverField(a, raw);
  else if (kind === 'radar') updateRadarField(a, b, raw);
  else if (kind === 'profileIndex') updateProfileIndex(raw);
  else if (kind === 'distance') updateDistance(a, raw);
  else if (kind === 'wedgeDistance') updateWedgeDistanceValue(a, b, raw);
}

function menuKeypadHtml() {
  const p = menuKeypadPopup;
  const displayVal = (p.value === '' || p.value === '-') ? '0' : p.value;
  const extraKey = p.decimal ? { fn: 'menuKeypadDecimal', label: ',' } : null;
  return `
    <div class="keypad-overlay" onclick="closeMenuKeypad()">
      <div class="keypad-sheet" onclick="event.stopPropagation()">
        <div class="keypad-head">
          <h3 class="keypad-title">${escapeHtml(p.title)}</h3>
          <button type="button" class="keypad-close" onclick="closeMenuKeypad()" aria-label="Fermer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <div class="app-keypad-value">
          ${p.allowSign ? `<button type="button" class="keypad-sign-btn" onclick="menuKeypadSign()">${p.value.startsWith('-') ? '\u2212' : '+'}</button>` : ''}
          ${displayVal}${p.unit ? ' ' + escapeHtml(p.unit) : ''}
        </div>
        ${appKeypad('menuKeypadPress', 'menuKeypadBackspace', 'menuKeypadClear', extraKey)}
        <button type="button" class="btn btn-primary" onclick="confirmMenuKeypad()">Valider</button>
      </div>
    </div>
  `;
}

/* ==========================================================================
   Carte profil réutilisée en haut de chaque écran
   ========================================================================== */
function indexLabel() {
  return userProfile.index === null ? "Index non renseigné" : `Index ${userProfile.index}`;
}

function updateProfileIndex(raw) {
  userProfile.index = toNumberOrNull(raw);
  saveMenuState();
}

// showLogout : true uniquement sur l'écran Menu principal
function topRowHtml(showLogout = false) {
  const indexAttrs = keypadAttrs({ title: 'Index', target: 'profileIndex', value: userProfile.index, decimal: true, sign: true });
  return `
    <section class="profile_card">
      <div class="profile_cover"></div>
      ${showLogout ? `
      <button class="profile_logout-button" type="button" aria-label="Se déconnecter" onclick="window.authLogout()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <path d="M16 17l5-5-5-5"/>
          <path d="M21 12H9"/>
        </svg>
      </button>` : ''}
      <div class="profile_card-content">
        <div class="profile_avatar-wrapper">
          <div class="profile_avatar-image">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.5c-3.5 0-10.4 1.8-10.4 5.3v2h20.8v-2c0-3.5-6.9-5.3-10.4-5.3z"/></svg>
          </div>
        </div>
        <div class="profile_info">
          <h2 class="profile_name"><input type="text" class="profile_name-input" value="${escapeHtml(userProfile.firstName)}" maxlength="20" placeholder="Ajouter mon prénom" aria-label="Prénom" oninput="updateFirstName(this.value)"></h2>
          <button type="button" class="profile_index" id="profileIndex" ${indexAttrs} onclick="openMenuKeypad(this)">${indexLabel()}</button>
        </div>
      </div>
    </section>
  `;
}

/* ==========================================================================
   Écran Menu (paramètres)
   ========================================================================== */
const DISTANCE_UNITS = [['m', 'Mètres (m)'], ['ft', 'Yards/Feet']];
const RADAR_UNITS    = [['mps', 'MPS (m/s)'], ['mph', 'MPH'], ['kph', 'KPH']];
const SPEED_UNITS    = [['mph', 'MPH'], ['kph', 'KPH']];
const OFFSET_UNITS   = [['pct', '%'], ['mph', 'MPH'], ['mps', 'MPS'], ['kph', 'KPH']];

function optionsHtml(options, current) {
  return options.map(([value, label]) => `<option value="${value}" ${value === current ? 'selected' : ''}>${label}</option>`).join('');
}

function settingSelectRow(label, key, options) {
  return `
      <div class="field-row"><span class="label">${label}</span><span class="val">
        <select aria-label="${label}" onchange="updateMenuSetting('${key}',this.value)">${optionsHtml(options, settings[key])}</select>
      </span></div>`;
}

const formatSigned = v => (v > 0 ? '+' + v : String(v));

// key : 'clubOffset' ou 'ballOffset'. Le signe se saisit directement dans le pavé.
function radarOffsetRowHtml(r, label, key) {
  const value = r[key + 'Value'];
  const unit = r[key + 'Unit'];
  const symbol = unit === 'pct' ? '%' : unit.toUpperCase();
  return `
        <div class="field-row"><span class="label">${label}</span><span class="val">
          ${numButton({ title: label, target: `radar:${r.id}:${key}Value`, value, decimal: true, sign: true, unit: symbol }, formatSigned(value), 'w-70')}
          <select aria-label="Unité" onchange="updateRadarField('${r.id}','${key}Unit',this.value);renderMenuTab()">${optionsHtml(OFFSET_UNITS, unit)}</select>
        </span></div>`;
}

function radarBlockHtml(r) {
  return `
        <div class="field-row"><span class="label">
          <input type="text" class="w-full" value="${escapeHtml(r.label)}" aria-label="Nom du radar" onchange="renameRadar('${r.id}',this)">
        </span></div>
        ${radarOffsetRowHtml(r, 'Écart Club Speed', 'clubOffset')}
        ${radarOffsetRowHtml(r, 'Écart Ball Speed', 'ballOffset')}
        <div class="field-row"><span class="label">Radar actif</span><span class="val">
          <label class="radio-select">
            <input type="radio" name="default-radar" ${settings.defaultRadarId === r.id ? 'checked' : ''} onchange="setDefaultRadar('${r.id}')">
            <span class="radio-select-dot"></span>
          </label>
          ${radars.length > 1 ? `<button type="button" onclick="removeRadar('${r.id}')">Suppr.</button>` : ''}
        </span></div>`;
}

function renderMenuTab() {
  enterScreen(renderMenuTab, "Menu", backToHome);
  const nbClubs = golfBag.clubs.length;
  paint(`
    ${topRowHtml(true)}
    <div class="field-list">
      <h3>Profil</h3>
      <div class="field-row field-row-link" onclick="renderGolfBagScreen()"><span class="label">Mon sac de golf</span><span class="val">${nbClubs} club${nbClubs > 1 ? 's' : ''} &#8250;</span></div>
      <div class="field-row field-row-link" onclick="renderDistancesScreen()"><span class="label">Mes distances</span><span class="val">&#8250;</span></div>
    </div>
    <div class="field-list">
      <h3>Conditions de référence</h3>
      <div class="field-row"><span class="label">Température (°C)</span><span class="val">
        ${numButton({ title: 'Température', target: 'setting:temperatureC', value: settings.temperatureC, sign: true, unit: '°C' }, `${settings.temperatureC}°C`)}
      </span></div>
      <div class="field-row"><span class="label">Altitude (m)</span><span class="val">
        ${numButton({ title: 'Altitude', target: 'setting:altitudeM', value: settings.altitudeM, unit: 'm' }, `${settings.altitudeM} m`)}
      </span></div>
    </div>
    <div class="field-list">
      <h3>Unité de distance</h3>
      ${settingSelectRow('Distance', 'distanceUnit', DISTANCE_UNITS)}
    </div>
    <div class="field-list">
      <h3>Unités de vitesse</h3>
      ${settingSelectRow('Unité du radar', 'radarUnit', RADAR_UNITS)}
      ${settingSelectRow('Unité affichée', 'speedUnit', SPEED_UNITS)}
    </div>
    <div class="field-list">
      <h3>Radars</h3>
      ${radars.map(radarBlockHtml).join('')}
      <div class="resume-row"><button type="button" class="add-radar-btn" onclick="addRadar()"><span class="add-radar-plus">+</span>Ajouter un radar</button></div>
    </div>
    <div class="field-list">
      <h3>Driver</h3>
      <div class="field-row"><span class="label">Taille (cm)</span><span class="val">
        ${numButton({ title: 'Taille du driver', target: 'driver:length', value: driverSettings.length, decimal: true, unit: 'cm' })}
      </span></div>
      <div class="field-row"><span class="label">Poids (g)</span><span class="val">
        ${numButton({ title: 'Poids du driver', target: 'driver:weight', value: driverSettings.weight, unit: 'g' })}
      </span></div>
    </div>
    <nav class="menu_list">
      <button class="menu_item" type="button" onclick="renderHelpScreen()">
        <span class="menu_icon-wrapper"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.5 2.5 0 0 1 4.9.8c0 1.7-2.4 1.7-2.4 3.4"/><circle cx="12" cy="16.8" r="0.2" fill="currentColor"/></svg></span>
        <span class="menu_content">
          <span class="menu_title">Aide &amp; support</span>
          <span class="menu_description">FAQ, contact, conditions d'utilisation.</span>
        </span>
        <svg class="menu_chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </nav>
  `);
}

// 1 mètre en yards ("ft" = yards pour les coups pleins ; le putter n'a pas de distance suivie ici)
const MENU_M_TO_YD = 1.09361;

function convertMenuDistanceValue(value, fromUnit, toUnit) {
  if (value == null || fromUnit === toUnit) return value;
  const converted = toUnit === 'ft' ? value * MENU_M_TO_YD : value / MENU_M_TO_YD;
  return Math.round(converted * 10) / 10;
}

// Les distances déjà enregistrées suivent le changement d'unité (au lieu de garder
// l'ancien nombre avec un nouveau libellé)
function convertStoredDistances(fromUnit, toUnit) {
  Object.keys(personalDistances).forEach(id => {
    personalDistances[id] = convertMenuDistanceValue(personalDistances[id], fromUnit, toUnit);
  });
  Object.values(wedgeDistances).forEach(entries => {
    entries.forEach(entry => { entry.value = convertMenuDistanceValue(entry.value, fromUnit, toUnit); });
  });
}

// Auto-save des réglages simples, sans re-render (évite d'effacer une saisie en cours ailleurs)
function updateMenuSetting(key, value) {
  if (key === 'distanceUnit' && value !== settings.distanceUnit) {
    convertStoredDistances(settings.distanceUnit, value);
  }
  settings[key] = (key === 'temperatureC' || key === 'altitudeM') ? (parseFloat(value) || 0) : value;
  saveMenuState();
}

function updateDriverField(key, value) {
  driverSettings[key] = toNumberOrNull(value);
  saveMenuState();
}

/* --- Radars ------------------------------------------------------------- */
// Les re-renders sont gérés par l'appelant : le pavé re-render à sa fermeture,
// et le changement d'unité (qui figure dans le pavé) re-render dans son onchange.
function updateRadarField(id, field, value) {
  const radar = radars.find(r => r.id === id);
  if (!radar) return;
  radar[field] = field.endsWith('OffsetValue') ? (parseFloat(value) || 0) : value;
  saveMenuState();
}

function renameRadar(id, input) {
  const radar = radars.find(r => r.id === id);
  if (!radar) return;
  radar.label = input.value.trim() || radar.label;
  input.value = radar.label;
  saveMenuState();
}

function setDefaultRadar(id) {
  settings.defaultRadarId = id;
  saveMenuState();
  renderMenuTab();
}

function addRadar() {
  radars.push({ id: 'radar_' + Date.now(), label: 'Nouveau radar', clubOffsetValue: 0, clubOffsetUnit: 'pct', ballOffsetValue: 0, ballOffsetUnit: 'pct' });
  saveMenuState();
  renderMenuTab();
}

function removeRadar(id) {
  if (radars.length <= 1) return;
  radars = radars.filter(r => r.id !== id);
  if (settings.defaultRadarId === id) settings.defaultRadarId = radars[0].id;
  saveMenuState();
  renderMenuTab();
}

/* ==========================================================================
   Écran Sac de golf — sélection par case à cocher parmi un catalogue fixe
   ========================================================================== */
const golfClubCatalog = [
  { id: 'driver', name: 'Driver' },
  { id: 'bois2', name: 'Bois 2' },
  { id: 'bois3', name: 'Bois 3' },
  { id: 'bois4', name: 'Bois 4' },
  { id: 'bois5', name: 'Bois 5' },
  { id: 'bois6', name: 'Bois 6' },
  { id: 'bois7', name: 'Bois 7' },
  { id: 'bois8', name: 'Bois 8' },
  { id: 'bois9', name: 'Bois 9' },
  { id: 'hybride1', name: 'Hybride 1' },
  { id: 'hybride2', name: 'Hybride 2' },
  { id: 'hybride3', name: 'Hybride 3' },
  { id: 'hybride4', name: 'Hybride 4' },
  { id: 'hybride5', name: 'Hybride 5' },
  { id: 'hybride6', name: 'Hybride 6' },
  { id: 'hybride7', name: 'Hybride 7' },
  { id: 'fer1', name: 'Fer 1' },
  { id: 'fer2', name: 'Fer 2' },
  { id: 'fer3', name: 'Fer 3' },
  { id: 'fer4', name: 'Fer 4' },
  { id: 'fer5', name: 'Fer 5' },
  { id: 'fer6', name: 'Fer 6' },
  { id: 'fer7', name: 'Fer 7' },
  { id: 'fer8', name: 'Fer 8' },
  { id: 'fer9', name: 'Fer 9' },
  { id: 'wedge46', name: 'Wedge 46°' },
  { id: 'wedge48', name: 'Wedge 48°' },
  { id: 'wedge50', name: 'Wedge 50°' },
  { id: 'wedge52', name: 'Wedge 52°' },
  { id: 'wedge54', name: 'Wedge 54°' },
  { id: 'wedge56', name: 'Wedge 56°' },
  { id: 'wedge58', name: 'Wedge 58°' },
  { id: 'wedge60', name: 'Wedge 60°' },
  { id: 'wedge62', name: 'Wedge 62°' },
  { id: 'wedge64', name: 'Wedge 64°' },
  { id: 'putter', name: 'Putter' },
];

function renderGolfBagScreen() {
  enterScreen(renderGolfBagScreen, "Mon sac");
  paint(`
    ${topRowHtml()}
    <div class="field-list">
      <h3>Clubs (<span id="bag-count">${golfBag.clubs.length}</span>)</h3>
      ${golfClubCatalog.map(c => `
        <div class="field-row"><span class="label">${c.name}</span><span class="val">
          <label class="radio-select">
            <input type="checkbox" aria-label="${c.name}" ${golfBag.clubs.includes(c.id) ? 'checked' : ''} onchange="toggleClub('${c.id}',this.checked)">
            <span class="radio-select-dot"></span>
          </label>
        </span></div>`).join('')}
    </div>
    <button type="button" class="btn btn-primary menu-save-btn" onclick="backTarget()">Enregistrer</button>
  `);
}

// Pas de re-render : la case est déjà dans le bon état, on ne met à jour que le compteur
function toggleClub(id, isChecked) {
  const others = golfBag.clubs.filter(cid => cid !== id);
  golfBag.clubs = isChecked ? [...others, id] : others;
  saveMenuState();
  document.getElementById('bag-count').textContent = golfBag.clubs.length;
}

/* ==========================================================================
   Écran Mes distances — un champ par club du sac (hors putter) ; les wedges
   acceptent plusieurs distances nommées (3/4 swing, plein swing...).
   ========================================================================== */
const isWedge = clubId => clubId.startsWith('wedge');

function renderDistancesScreen() {
  enterScreen(renderDistancesScreen, "Mes distances");
  const unit = settings.distanceUnit === 'ft' ? 'yd' : 'm';
  const clubs = golfClubCatalog.filter(c => c.id !== 'putter' && golfBag.clubs.includes(c.id));
  paint(`
    ${topRowHtml()}
    <div class="field-list">
      <h3>Distances par club</h3>
      ${clubs.length === 0 ? `
        <div class="field-row"><span class="label">Aucun club dans le sac</span></div>
      ` : clubs.map(c => isWedge(c.id) ? wedgeDistanceRowsHtml(c, unit) : `
        <div class="field-row"><span class="label">${c.name}</span><span class="val">
          ${numButton({ title: c.name, target: `distance:${c.id}`, value: personalDistances[c.id], unit })} ${unit}
        </span></div>
      `).join('')}
    </div>
    <button type="button" class="btn btn-primary menu-save-btn" onclick="backTarget()">Enregistrer</button>
  `);
}

function updateDistance(clubId, value) {
  personalDistances[clubId] = toNumberOrNull(value);
  saveMenuState();
}

// Garantit au moins une distance ("Distance 1") pour un wedge du sac
function ensureWedgeEntries(clubId) {
  if (!Array.isArray(wedgeDistances[clubId]) || wedgeDistances[clubId].length === 0) {
    wedgeDistances[clubId] = [{ id: 'd1', label: 'Distance 1', value: null }];
  }
}

// Bloc "nom du wedge" + une ligne éditable par distance + bouton d'ajout
function wedgeDistanceRowsHtml(c, unit) {
  ensureWedgeEntries(c.id);
  const entries = wedgeDistances[c.id];
  return `
    <div class="field-row"><span class="label">${c.name}</span></div>
    ${entries.map(e => `
      <div class="field-row wedge-distance-row"><span class="label">
        <input type="text" value="${escapeHtml(e.label)}" aria-label="Nom de la distance" onchange="updateWedgeDistanceLabel('${c.id}','${e.id}',this)">
      </span><span class="val">
        ${numButton({ title: e.label, target: `wedgeDistance:${c.id}:${e.id}`, value: e.value, unit })} ${unit}
        ${entries.length > 1 ? `<button type="button" onclick="removeWedgeDistance('${c.id}','${e.id}')">Suppr.</button>` : ''}
      </span></div>
    `).join('')}
    <div class="resume-row"><button type="button" class="add-radar-btn" onclick="addWedgeDistance('${c.id}')"><span class="add-radar-plus">+</span>Ajouter une distance</button></div>
  `;
}

function addWedgeDistance(clubId) {
  ensureWedgeEntries(clubId);
  const n = wedgeDistances[clubId].length + 1;
  wedgeDistances[clubId].push({ id: 'd' + Date.now(), label: 'Distance ' + n, value: null });
  saveMenuState();
  renderDistancesScreen();
}

function removeWedgeDistance(clubId, entryId) {
  if (!wedgeDistances[clubId] || wedgeDistances[clubId].length <= 1) return;
  wedgeDistances[clubId] = wedgeDistances[clubId].filter(e => e.id !== entryId);
  saveMenuState();
  renderDistancesScreen();
}

// Pas de re-render pour ne pas perdre le focus ; un nom vide retombe sur l'ancien
function updateWedgeDistanceLabel(clubId, entryId, input) {
  const entry = (wedgeDistances[clubId] || []).find(e => e.id === entryId);
  if (!entry) return;
  entry.label = input.value.trim() || entry.label;
  input.value = entry.label;
  saveMenuState();
}

function updateWedgeDistanceValue(clubId, entryId, value) {
  const entry = (wedgeDistances[clubId] || []).find(e => e.id === entryId);
  if (!entry) return;
  entry.value = toNumberOrNull(value);
  saveMenuState();
}

/* ==========================================================================
   Écran Aide & support
   ========================================================================== */
function renderHelpScreen() {
  enterScreen(renderHelpScreen, "Aide & support");
  paint(`
    ${topRowHtml()}
    <div class="field-list"><h3>FAQ</h3></div>
    <div class="field-list"><h3>Contact</h3></div>
    <div class="field-list"><h3>Conditions d'utilisation</h3></div>
  `);
}

// Appelée depuis index.html
window.renderMenuTab = renderMenuTab;

/* ==========================================================================
   Initialisation
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  loadMenuState();
  backBtn.addEventListener('click', () => backTarget());
  renderMenuTab();
});
