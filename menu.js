/* ==========================================================================
   Références DOM globales
   ========================================================================== */
const menuRoot = document.getElementById("root");
const menuBackBtn = document.getElementById("backBtn");
const menuHeaderTitle = document.getElementById("headerTitle");
const backLabel = document.querySelector(".nav_back-label");

/* ==========================================================================
   State global de l'app + persistance localStorage
   ========================================================================== */
const MENU_STORAGE_KEY = "golfAppState";

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
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify({
      userProfile, settings, radars, golfBag, driverSettings, personalDistances, wedgeDistances,
    }));
  } catch (e) {
    console.error("Erreur d'écriture du localStorage", e);
  }
}

function loadMenuState() {
  try {
    const data = JSON.parse(localStorage.getItem(MENU_STORAGE_KEY) || "null");
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
const backToHelp = () => renderHelpScreen();

let backTarget = backToHome;
let currentRender = renderMenuTab;

function enterScreen(renderFn, title, back = backToMenu, label = back === backToHome ? "Home" : "Menu") {
  currentRender = renderFn;
  backTarget = back;
  menuHeaderTitle.textContent = title;
  backLabel.textContent = label;
  menuBackBtn.classList.remove("is-hidden");
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
          <span class="menu_description">FAQ, contact, informations légales et données.</span>
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
   Aide & support — FAQ, contact, textes légaux, gestion des données, à propos.
   Les textes légaux lisent MENU_LEGAL : tout champ "[À COMPLÉTER ...]" doit être
   renseigné avant la mise en ligne (un avertissement s'affiche dans la console).
   ========================================================================== */
const menuTodo = (label) => `[À COMPLÉTER : ${label}]`;

const MENU_LEGAL = {
  appName: "All-in-1",
  appVersion: "1.0.0",
  updatedAt: "6 octobre 2026",
  editorName: "Pierre-Antton Ducoin",
  editorStatus: "éditeur non professionnel",
  contactEmail: "contactgolfevolution@gmail.com",
  backendName: "Supabase",
  backendRegion: menuTodo("région du projet Supabase, de préférence dans l'Union européenne"),
  hostName: menuTodo("hébergeur de l'application, en remplacement de Vercel"),
  hostAddress: menuTodo("adresse de l'hébergeur"),
  hostUrl: menuTodo("site web de l'hébergeur"),
};

function warnMenuLegalPlaceholders() {
  const missing = Object.entries(MENU_LEGAL).filter(([, v]) => String(v).includes("[À COMPLÉTER"));
  if (missing.length) console.warn("MENU_LEGAL : champs à compléter avant publication :", missing.map(([k]) => k).join(", "));
}

// Échappe le texte, puis remplace les jetons {{clé}} par les valeurs de MENU_LEGAL (échappées aussi)
function menuLegalText(str) {
  return escapeHtml(str).replace(/\{\{(\w+)\}\}/g, (_, key) => escapeHtml(MENU_LEGAL[key] ?? ""));
}

// Affiche l'écran en haut de page (les écrans d'aide sont longs)
function menuPaintPage(html) {
  paint(html);
  window.scrollTo(0, 0);
}

/* --- Routeur des écrans d'aide ------------------------------------------- */
// "from" : page à laquelle revenir ('login', 'signup') quand l'écran est ouvert hors du Menu
const MENU_HELP_PAGES = {
  faq: (back, label) => renderFaqScreen(back, label),
  contact: (back, label) => renderContactScreen(back, label),
  cgu: (back, label) => renderLegalDoc("cgu", back, label),
  confidentialite: (back, label) => renderLegalDoc("confidentialite", back, label),
  mentions: (back, label) => renderLegalDoc("mentions", back, label),
  donnees: (back, label) => openDataScreen(back, label),
  apropos: (back, label) => renderAboutScreen(back, label),
};

function openHelpPage(id, from) {
  const open = MENU_HELP_PAGES[id];
  if (!open) return;
  showPage("menu");
  open(from ? () => showPage(from) : backToHelp, from ? "Retour" : "Aide");
}

/* --- Écran principal Aide & support -------------------------------------- */
function menuHelpRow(label, id, extra = "") {
  const action = `openHelpPage('${id}')`;
  return `
      <div class="field-row field-row-link" role="button" tabindex="0" onclick="${action}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${action}}"><span class="label">${label}</span><span class="val">${extra}&#8250;</span></div>`;
}

function renderHelpScreen() {
  enterScreen(renderHelpScreen, "Aide & support");
  menuPaintPage(`
    <div class="field-list">
      <h3>Assistance</h3>
      ${menuHelpRow("FAQ", "faq")}
      ${menuHelpRow("Contacter le support", "contact")}
    </div>
    <div class="field-list">
      <h3>Informations légales</h3>
      ${menuHelpRow("Conditions d'utilisation", "cgu")}
      ${menuHelpRow("Politique de confidentialité", "confidentialite")}
      ${menuHelpRow("Mentions légales", "mentions")}
    </div>
    <div class="field-list">
      <h3>Mes données</h3>
      ${menuHelpRow("Exporter ou supprimer mes données", "donnees")}
    </div>
    <div class="field-list">
      <h3>Application</h3>
      ${menuHelpRow("À propos", "apropos", `Version ${escapeHtml(MENU_LEGAL.appVersion)} `)}
    </div>
  `);
}

/* ==========================================================================
   FAQ — accordéon natif <details> (accessible au clavier, sans JS)
   ========================================================================== */
const MENU_FAQ = [
  {
    title: "Compte et données",
    items: [
      ["Où sont enregistrées mes données ?", "Sur nos serveurs sécurisés, liées à votre compte, avec une copie de travail sur votre téléphone. Désinstaller l'application n'efface donc pas votre compte : reconnectez-vous pour tout retrouver."],
      ["Comment changer de téléphone sans tout perdre ?", "Connectez-vous avec le même compte sur le nouvel appareil : vos données sont retrouvées. Vous pouvez aussi conserver une copie depuis Aide & support, rubrique Mes données."],
      ["Comment supprimer mon compte ?", "Menu, Aide & support, Mes données, puis Supprimer mon compte et mes données. Votre compte et vos données sont effacés de nos serveurs et de l'appareil, de façon définitive."],
      ["Mes données sont-elles revendues ?", "Non. Vos données ne sont ni vendues, ni utilisées à des fins publicitaires."],
    ],
  },
  {
    title: "Fonctions",
    items: [
      ["Pourquoi l'application demande-t-elle la position et les capteurs ?", "La position sert uniquement à rechercher les golfs proches quand vous créez une partie dans Stats. L'orientation du téléphone sert à mesurer le dénivelé. Ces accès sont facultatifs et révocables dans les réglages du téléphone : seules les fonctions concernées deviennent indisponibles."],
      ["Pourquoi mes statistiques sont-elles vides ?", "Les statistiques sont calculées à partir des parties que vous saisissez dans Stats, en saisie rapide ou détaillée. Enregistrez une partie terminée pour les voir apparaître."],
      ["D'où viennent les distances affichées dans Parcours ?", "Des clubs de votre sac et des distances renseignées dans Menu, rubriques Mon sac de golf et Mes distances. L'unité (mètres ou yards) se règle aussi dans le Menu."],
      ["Que signifie Strokes Gained ?", "Le Strokes Gained compare chacun de vos coups à une référence statistique. Un résultat positif signifie que vous avez fait mieux que la référence, un résultat négatif moins bien. Il est calculé par catégorie : driving, attaque de green, approches et putting."],
      ["Puis-je utiliser le vent et le dénivelé en compétition ?", "Pas forcément. Les Règles de golf (règle 4.3) interdisent en principe de mesurer le dénivelé ou d'évaluer le vent avec un appareil, sauf règle locale qui l'autorise. Renseignez-vous auprès du comité de l'épreuve avant de jouer."],
      ["Les programmes de gym conviennent-ils à tout le monde ?", "Ils sont donnés à titre informatif et ne remplacent pas l'avis d'un médecin ou d'un coach. Demandez un avis avant de commencer et arrêtez en cas de douleur."],
    ],
  },
  {
    title: "Application",
    items: [
      ["L'application est-elle gratuite ?", "Oui. Elle ne contient ni publicité ni abonnement. Si cela devait changer, vous en seriez informé dans l'application avant toute mise en place, et rien ne serait facturé sans votre accord."],
      ["Sur quels appareils est-elle disponible ?", "Sur Android, via Google Play. Une version iOS est prévue ensuite."],
      ["Comment signaler un problème ou proposer une idée ?", "Depuis Aide & support, rubrique Contacter le support, en choisissant Problème technique ou Suggestion."],
    ],
  },
];

function renderFaqScreen(back = backToHelp, label = "Aide") {
  enterScreen(() => renderFaqScreen(back, label), "FAQ", back, label);
  menuPaintPage(`
    <div class="faq_component">
      ${MENU_FAQ.map(group => `
      <section class="faq_group">
        <h3 class="faq_group-title">${escapeHtml(group.title)}</h3>
        ${group.items.map(([q, a]) => `
        <details class="faq_item">
          <summary class="faq_question">
            <span>${escapeHtml(q)}</span>
            <svg class="faq_chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
          </summary>
          <p class="faq_answer">${escapeHtml(a)}</p>
        </details>`).join("")}
      </section>`).join("")}
    </div>
  `);
}

/* ==========================================================================
   Contact — pas de serveur : le message ouvre l'application e-mail du téléphone
   ========================================================================== */
const MENU_CONTACT_TOPICS = [
  ["question", "Question"],
  ["bug", "Problème technique"],
  ["suggestion", "Suggestion"],
  ["donnees", "Mes données personnelles"],
  ["autre", "Autre"],
];

// Brouillon conservé si l'utilisateur quitte l'écran puis revient
let menuContactDraft = { topic: "question", message: "" };

function menuSetContactTopic(value) { menuContactDraft.topic = value; }

function menuSetContactMessage(value) {
  menuContactDraft.message = value;
  const error = document.getElementById("contactError");
  if (error) error.textContent = "";
}

function renderContactScreen(back = backToHelp, label = "Aide") {
  enterScreen(() => renderContactScreen(back, label), "Contact", back, label);
  const email = escapeHtml(MENU_LEGAL.contactEmail);
  menuPaintPage(`
    <div class="contact_component">
      <p class="contact_text">Une question, un problème ou une idée ? Écrivez-nous : votre application de messagerie s'ouvrira avec le message prêt à envoyer.</p>
      <label class="contact_field">
        <span class="contact_label">Sujet</span>
        <select class="contact_select" aria-label="Sujet" onchange="menuSetContactTopic(this.value)">${optionsHtml(MENU_CONTACT_TOPICS, menuContactDraft.topic)}</select>
      </label>
      <label class="contact_field">
        <span class="contact_label">Message</span>
        <textarea class="contact_textarea" maxlength="2000" placeholder="Décrivez votre demande" oninput="menuSetContactMessage(this.value)">${escapeHtml(menuContactDraft.message)}</textarea>
      </label>
      <p class="contact_error" id="contactError" role="alert"></p>
      <button type="button" class="btn btn-primary" onclick="menuSendContactMessage()">Envoyer</button>
      <p class="contact_note">La version de l'application et le type d'appareil sont ajoutés au message pour faciliter le diagnostic. Vous pouvez aussi écrire directement à <a class="contact_link" href="mailto:${email}">${email}</a>.</p>
    </div>
  `);
}

function menuSendContactMessage() {
  const message = menuContactDraft.message.trim();
  if (message.length < 10) {
    document.getElementById("contactError").textContent = "Écrivez un message d'au moins 10 caractères.";
    return;
  }
  const topicLabel = (MENU_CONTACT_TOPICS.find(([value]) => value === menuContactDraft.topic) || [])[1] || "Contact";
  const subject = `[${MENU_LEGAL.appName}] ${topicLabel}`;
  const body = `${message}\n\n---\nVersion : ${MENU_LEGAL.appVersion}\nAppareil : ${navigator.userAgent}`;
  window.location.href = `mailto:${MENU_LEGAL.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* ==========================================================================
   Textes légaux — CGU, politique de confidentialité, mentions légales.
   Structure : { title (en-tête court), heading, sections: [{ h, p: [], ul: [] }] }
   Tout nouveau service tiers ou toute nouvelle donnée collectée doit être
   ajouté à la politique de confidentialité avant la mise en ligne.
   ========================================================================== */
const MENU_DOCS = {
  cgu: {
    title: "CGU",
    heading: "Conditions générales d'utilisation",
    sections: [
      { h: "1. Objet", p: [
        "Les présentes conditions générales d'utilisation (les « CGU ») encadrent l'usage de l'application {{appName}} (l'« Application »), un carnet d'entraînement et de jeu pour golfeurs : parcours, putting, wedging, statistiques, gym et profil.",
        "En créant un compte ou en utilisant l'Application, vous acceptez les CGU.",
      ] },
      { h: "2. Éditeur", p: [
        "L'Application est éditée par {{editorName}}, à titre non professionnel. Contact : {{contactEmail}}. Les mentions légales complètes sont disponibles dans Aide & support.",
      ] },
      { h: "3. Accès et compte", ul: [
        "Vous devez avoir au moins 15 ans, ou disposer de l'accord de vos représentants légaux.",
        "Les informations que vous fournissez doivent être exactes.",
        "Vous êtes responsable de la confidentialité de votre mot de passe et de l'usage de votre compte, qui est strictement personnel.",
      ] },
      { h: "4. Gratuité", p: [
        "L'Application est gratuite et ne contient ni publicité ni abonnement.",
        "Si une offre payante ou de la publicité devait un jour être introduite, les CGU, la politique de confidentialité et les mentions légales seraient mises à jour au préalable, vous en seriez informé dans l'Application avant son entrée en vigueur, et aucun paiement ne serait déclenché sans votre accord explicite.",
      ] },
      { h: "5. Usage autorisé", p: [
        "L'Application est réservée à un usage personnel et non commercial. Il est interdit de :",
      ], ul: [
        "perturber son fonctionnement ou tenter d'accéder à des données qui ne vous appartiennent pas ;",
        "extraire ses contenus ou ses données de manière automatisée ;",
        "copier, modifier ou redistribuer l'Application ou son code ;",
        "l'utiliser à des fins illicites.",
      ] },
      { h: "6. Vos données", p: [
        "Les données que vous saisissez vous appartiennent. Vous nous accordez uniquement les droits nécessaires pour les faire fonctionner dans l'Application.",
        "Elles sont enregistrées sur nos serveurs, liées à votre compte, avec une copie de travail sur votre appareil. Vous pouvez en conserver une copie depuis Aide & support, rubrique Mes données, et supprimer votre compte à tout moment.",
        "Le traitement de vos données personnelles est détaillé dans la politique de confidentialité.",
      ] },
      { h: "7. Outils indicatifs", p: [
        "Les calculs de vent, de dénivelé et de distance, le Strokes Gained et les statistiques sont des aides indicatives, fondées sur vos saisies, sur les capteurs de votre téléphone et sur des modèles statistiques. Ils peuvent comporter des écarts. Vous restez seul juge de vos choix de jeu.",
        "En compétition, les Règles de golf (règle 4.3) ou une règle locale peuvent interdire l'usage d'appareils mesurant le dénivelé ou évaluant le vent. Il vous appartient de vous renseigner avant de jouer.",
      ] },
      { h: "8. Santé et sécurité", p: [
        "Les programmes de gym et d'entraînement sont fournis à titre informatif. Ils ne remplacent pas l'avis d'un médecin ou d'un coach. Demandez un avis avant de commencer, surtout en cas de problème de santé, et arrêtez en cas de douleur.",
        "Sur le parcours, restez attentif à votre environnement et aux autres joueurs, et ne laissez pas l'Application nuire à votre sécurité ou au rythme de jeu.",
      ] },
      { h: "9. Propriété intellectuelle", p: [
        "L'Application, son nom, son design, ses textes, ses images et son code appartiennent à l'éditeur ou à ses concédants. Vous bénéficiez d'un droit d'usage personnel, non exclusif, non cessible et révocable, pour l'usage prévu par les CGU. Les composants tiers restent soumis à leurs propres licences.",
      ] },
      { h: "10. Disponibilité et évolution", p: [
        "Nous nous efforçons de maintenir l'Application accessible, sans pouvoir garantir une disponibilité continue. Elle peut être interrompue pour maintenance ou évolution, et ses fonctions peuvent être modifiées ou retirées.",
      ] },
      { h: "11. Responsabilité", p: [
        "Dans les limites permises par la loi, l'éditeur n'est pas responsable des dommages indirects, de la perte de données due à une cause qui ne nous est pas imputable, ni d'une décision de jeu prise sur la base des indications de l'Application.",
        "Ces limites ne s'appliquent pas en cas de faute lourde ou dolosive, ni aux droits que la loi vous reconnaît.",
      ] },
      { h: "12. Suppression du compte et suspension", p: [
        "Vous pouvez cesser d'utiliser l'Application et supprimer votre compte à tout moment depuis Aide & support, rubrique Mes données. L'éditeur peut suspendre l'accès en cas de manquement grave aux CGU.",
      ] },
      { h: "13. Modification des CGU", p: [
        "Les CGU peuvent évoluer. La date de dernière mise à jour figure en haut de cette page. En cas de changement important, vous serez informé dans l'Application. Continuer à l'utiliser après cette information vaut acceptation ; sinon, vous pouvez supprimer votre compte.",
      ] },
      { h: "14. Droit applicable et litiges", p: [
        "Les CGU sont soumises au droit français. En cas de litige, contactez-nous d'abord à {{contactEmail}}. Vous conservez la possibilité de saisir le tribunal compétent selon la loi applicable.",
      ] },
    ],
  },

  confidentialite: {
    title: "Confidentialité",
    heading: "Politique de confidentialité",
    sections: [
      { h: "1. Responsable du traitement", p: [
        "Le responsable du traitement de vos données personnelles est {{editorName}}, {{editorStatus}}. Contact : {{contactEmail}}.",
      ] },
      { h: "2. Données concernées", ul: [
        "Compte : adresse e-mail et mot de passe. Le mot de passe est stocké sous forme chiffrée (hachée) par notre prestataire d'authentification et n'est jamais lisible par nous.",
        "Profil : prénom et index de golf.",
        "Réglages : température, altitude, unités, radars, sac de golf, distances par club, caractéristiques du driver.",
        "Jeu et entraînement : parties, coups, putts, wedging, programmes et séances de gym, objectifs et historiques.",
        "Capteurs et position, avec votre autorisation : orientation du téléphone pour le dénivelé, position pour rechercher les golfs proches.",
        "Données techniques : adresse IP, type d'appareil et date de la requête, vues par nos prestataires lors de l'utilisation de l'Application.",
      ] },
      { h: "3. Où vos données sont stockées", p: [
        "Vos données de compte, de profil, de réglages, de jeu et d'entraînement sont enregistrées sur nos serveurs, hébergés par {{backendName}} (région : {{backendRegion}}). Elles sont ainsi liées à votre compte et retrouvées si vous changez d'appareil.",
        "Une copie de travail est conservée sur votre appareil pour le fonctionnement de l'Application.",
      ] },
      { h: "4. Prestataires et services tiers", p: [
        "Nous faisons appel aux prestataires suivants, qui peuvent recevoir tout ou partie de vos données :",
      ], ul: [
        "{{backendName}} : base de données et authentification. Il agit comme sous-traitant, pour notre compte.",
        "{{hostName}} : hébergement de l'Application. Il voit les données techniques de connexion, dont l'adresse IP.",
        "FlyAway Golf (api.flyawaygolf.com) : lorsque vous recherchez un golf proche dans Stats, les coordonnées de votre position sont envoyées à ce service pour retrouver les parcours voisins. Rien n'est envoyé sans cette action de votre part.",
        "cdnjs (Cloudflare) : fournit la bibliothèque de graphiques et voit l'adresse IP de votre appareil au chargement.",
        "Google et Apple : si vous vous connectez avec votre compte Google ou Apple, ils nous transmettent votre adresse e-mail et un identifiant, selon leurs propres politiques.",
        "Google Play, et plus tard l'App Store : distribution de l'Application, selon leurs propres politiques.",
      ] },
      { h: "5. Ce que nous ne faisons pas", p: [
        "Nous ne vendons pas vos données, nous ne les utilisons pas à des fins publicitaires et l'Application n'intègre pas d'outil de mesure d'audience à ce jour.",
      ] },
      { h: "6. Finalités et bases légales", ul: [
        "Créer et gérer votre compte, fournir l'Application, enregistrer et synchroniser vos données : exécution du contrat formé par les CGU.",
        "Assurer la sécurité et le bon fonctionnement du service, prévenir les abus : intérêt légitime.",
        "Utiliser votre position et les capteurs : votre consentement, donné via l'autorisation du système et retirable à tout moment dans les réglages du téléphone.",
        "Répondre à vos messages et demandes : intérêt légitime et exécution du contrat.",
        "Respecter nos obligations légales.",
      ] },
      { h: "7. Durées de conservation", ul: [
        "Données du compte, du profil, des réglages et d'entraînement : conservées tant que votre compte existe. À sa suppression, elles sont effacées de nos serveurs ; d'éventuelles sauvegardes techniques sont purgées à l'issue de leur cycle de rotation.",
        "Messages envoyés au support : conservés le temps nécessaire au traitement de votre demande, puis au maximum 3 ans.",
        "Données techniques de connexion : conservées par nos prestataires pour une durée limitée, selon leurs politiques.",
      ] },
      { h: "8. Transferts hors Union européenne", p: [
        "Vos données de compte sont hébergées dans la région indiquée plus haut. Certains de nos prestataires étant établis hors de l'Union européenne, des transferts peuvent avoir lieu, notamment vers les États-Unis. Ils sont encadrés par les garanties prévues par la réglementation, telles que le cadre de protection des données UE-États-Unis ou les clauses contractuelles types.",
      ] },
      { h: "9. Vos droits", p: [
        "Vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité, de limitation et d'opposition, ainsi que du droit de retirer votre consentement et de définir des directives sur le sort de vos données après votre décès.",
        "Vous pouvez exporter ou supprimer vos données vous-même dans Aide & support, rubrique Mes données, ou nous écrire à {{contactEmail}}. Nous répondons dans un délai d'un mois.",
        "Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la CNIL (cnil.fr).",
      ] },
      { h: "10. Sécurité", p: [
        "Les échanges avec nos serveurs sont chiffrés (HTTPS) et l'accès aux données est limité aux personnes et services qui en ont besoin. Aucun système n'est infaillible : en cas de violation de données présentant un risque pour vous, nous vous en informerons et préviendrons la CNIL conformément à la loi.",
        "Pensez aussi à verrouiller votre téléphone et à choisir un mot de passe unique.",
      ] },
      { h: "11. Mineurs", p: [
        "L'Application s'adresse aux personnes de 15 ans et plus. En dessous, l'accord d'un représentant légal est nécessaire.",
      ] },
      { h: "12. Évolutions", p: [
        "Si nous ajoutons un nouveau prestataire, un nouvel usage de vos données (mesure d'audience ou publicité, par exemple) ou une offre payante, cette politique sera mise à jour avant son entrée en vigueur et vous en serez informé dans l'Application.",
      ] },
    ],
  },

  mentions: {
    title: "Mentions légales",
    heading: "Mentions légales",
    sections: [
      { h: "Éditeur", p: [
        "L'Application est éditée par {{editorName}}, à titre non professionnel. Son identité complète est communiquée à l'hébergeur indiqué ci-dessous.",
      ], ul: [
        "Contact : {{contactEmail}}",
      ] },
      { h: "Hébergement de l'application", ul: [
        "{{hostName}}",
        "{{hostAddress}}",
        "{{hostUrl}}",
      ] },
      { h: "Base de données et authentification", ul: [
        "{{backendName}}, région : {{backendRegion}}",
      ] },
      { h: "Distribution", p: [
        "L'Application est distribuée via Google Play, puis ultérieurement via l'App Store.",
      ] },
      { h: "Propriété intellectuelle", p: [
        "L'ensemble des éléments de l'Application (nom, design, textes, images, code) est protégé par le droit de la propriété intellectuelle. Toute reproduction ou réutilisation sans autorisation écrite est interdite.",
      ] },
      { h: "Données personnelles", p: [
        "Le traitement de vos données est décrit dans la politique de confidentialité, accessible dans Aide & support.",
      ] },
    ],
  },
};

function renderLegalDoc(id, back = backToHelp, label = "Aide") {
  const doc = MENU_DOCS[id];
  enterScreen(() => renderLegalDoc(id, back, label), doc.title, back, label);
  menuPaintPage(`
    <article class="legal_component">
      <h2 class="legal_title">${menuLegalText(doc.heading)}</h2>
      <p class="legal_updated">Dernière mise à jour : ${menuLegalText("{{updatedAt}}")}</p>
      ${doc.sections.map(s => `
      <section class="legal_section">
        <h3 class="legal_heading">${menuLegalText(s.h)}</h3>
        ${(s.p || []).map(t => `<p class="legal_text">${menuLegalText(t)}</p>`).join("")}
        ${s.ul ? `<ul class="legal_list">${s.ul.map(t => `<li>${menuLegalText(t)}</li>`).join("")}</ul>` : ""}
      </section>`).join("")}
    </article>
  `);
}

/* ==========================================================================
   Mes données — export (droit à la portabilité) et suppression du compte
   ========================================================================== */
let menuDeleteConfirm = false;

function openDataScreen(back = backToHelp, label = "Aide") {
  menuDeleteConfirm = false;
  renderDataScreen(back, label);
}

function renderDataScreen(back, label) {
  enterScreen(() => renderDataScreen(back, label), "Mes données", back, label);
  menuPaintPage(`
    <div class="data_component">
      <section class="data_card">
        <h2 class="data_title">Exporter mes données</h2>
        <p class="data_text">Enregistrez une copie de votre profil, de vos réglages et de vos données de jeu et d'entraînement dans un fichier lisible (JSON).</p>
        <button type="button" class="data_button" onclick="exportMenuData()">Exporter mes données</button>
        <p class="data_feedback" id="dataFeedback" role="status"></p>
      </section>
      <section class="data_card is-danger">
        <h2 class="data_title">Supprimer mon compte et mes données</h2>
        <p class="data_text">Efface définitivement votre compte et toutes vos données, sur nos serveurs et sur cet appareil : profil, réglages, sac, distances, parties, putting, wedging et gym. Cette action est irréversible.</p>
        ${menuDeleteConfirm ? `
        <p class="data_text is-strong">Confirmer la suppression définitive ?</p>
        <div class="data_actions">
          <button type="button" class="data_button is-neutral" onclick="cancelDeleteMenuData()">Annuler</button>
          <button type="button" class="data_button is-danger" onclick="deleteMenuData()">Supprimer</button>
        </div>` : `
        <button type="button" class="data_button is-outline-danger" onclick="askDeleteMenuData()">Supprimer mon compte et mes données</button>`}
      </section>
      <p class="data_text">Vous pouvez aussi demander l'accès à vos données ou leur effacement par e-mail à ${escapeHtml(MENU_LEGAL.contactEmail)}. Nous répondons dans un délai d'un mois.</p>
    </div>
  `);
}

function menuSetDataFeedback(text) {
  const el = document.getElementById("dataFeedback");
  if (el) el.textContent = text;
}

async function exportMenuData() {
  // Toutes les clés du localStorage appartiennent à l'app (une origine = une app)
  const data = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const raw = localStorage.getItem(key);
      try { data[key] = JSON.parse(raw); } catch (e) { data[key] = raw; }
    }
  } catch (e) {
    menuSetDataFeedback("Impossible de lire les données de l'appareil.");
    return;
  }
  const payload = { app: MENU_LEGAL.appName, version: MENU_LEGAL.appVersion, exportedAt: new Date().toISOString(), data };
  const fileName = `${MENU_LEGAL.appName.toLowerCase()}-export-${payload.exportedAt.slice(0, 10)}.json`;
  const file = new File([JSON.stringify(payload, null, 2)], fileName, { type: "application/json" });

  // Feuille de partage du téléphone si disponible, sinon téléchargement direct
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: `Export ${MENU_LEGAL.appName}` });
      menuSetDataFeedback("Export terminé.");
      return;
    }
  } catch (e) {
    if (e && e.name === "AbortError") return; // l'utilisateur a fermé la feuille de partage
  }
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  menuSetDataFeedback("Fichier exporté.");
}

function askDeleteMenuData() { menuDeleteConfirm = true; currentRender(); }
function cancelDeleteMenuData() { menuDeleteConfirm = false; currentRender(); }

function deleteMenuData() {
  // TODO Supabase : appeler d'abord une Edge Function qui supprime l'utilisateur (auth.admin.deleteUser) et ses lignes,
  // et n'effacer en local qu'après sa confirmation. Tant que ce n'est pas fait, la suppression ne touche que l'appareil.
  try { localStorage.clear(); sessionStorage.clear(); } catch (e) {}
  // Rechargement : remet à zéro l'état gardé en mémoire par tous les modules ; sans session, la page de connexion s'affiche
  location.replace(location.pathname);
}

/* ==========================================================================
   À propos
   ========================================================================== */
function renderAboutScreen(back = backToHelp, label = "Aide") {
  enterScreen(() => renderAboutScreen(back, label), "À propos", back, label);
  menuPaintPage(`
    <div class="field-list">
      <h3>Application</h3>
      <div class="field-row"><span class="label">Nom</span><span class="val">${escapeHtml(MENU_LEGAL.appName)}</span></div>
      <div class="field-row"><span class="label">Version</span><span class="val">${escapeHtml(MENU_LEGAL.appVersion)}</span></div>
    </div>
    <article class="legal_component">
      <section class="legal_section">
        <h3 class="legal_heading">Crédits</h3>
        <ul class="legal_list">
          <li>Graphiques : Chart.js (licence MIT).</li>
          <li>Tables de référence Strokes Gained : d'après le dépôt open source dgtaillie/python_strokes_gained.</li>
          <li>Recherche de golfs : API FlyAway Golf.</li>
        </ul>
      </section>
    </article>
  `);
}

/* ==========================================================================
   Liens directs vers les textes légaux, accessibles sans compte :
   ?legal=cgu | confidentialite | mentions | donnees
   (URL publiques à renseigner dans la fiche Google Play / App Store)
   ========================================================================== */
window.addEventListener("load", () => {
  const id = new URLSearchParams(location.search).get("legal");
  if (!["cgu", "confidentialite", "mentions", "donnees"].includes(id)) return;
  let hasSession = false;
  try { hasSession = !!localStorage.getItem("golfSession"); } catch (e) {}
  openHelpPage(id, hasSession ? null : "login");
});

// Appelée depuis index.html (liens des écrans de connexion et d'inscription)
window.openHelpPage = openHelpPage;

// Appelée depuis index.html
window.renderMenuTab = renderMenuTab;

// API publique lue par parcours-ui.js et stats.js (remplace les `typeof golfBag`).
// Getters : toujours la valeur courante, même si une variable interne est réassignée.
// Renommer une variable de ce fichier ne casse plus rien tant que ces getters suivent.
window.MenuData = {
  get bag() { return golfBag; },
  get catalog() { return golfClubCatalog; },
  get personalDistances() { return personalDistances; },
  get wedgeDistances() { return wedgeDistances; },
  get settings() { return settings; },
};

/* ==========================================================================
   Initialisation
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  loadMenuState();
  warnMenuLegalPlaceholders();
  menuBackBtn.addEventListener('click', () => backTarget());
  renderMenuTab();
});
