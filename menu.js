/* ==========================================================================
   Références DOM globales (utilisées par toutes les fonctions render*)
   ========================================================================== */
const menuRoot = document.getElementById("root");
const backBtn = document.getElementById("backBtn");
const headerTitle = document.getElementById("headerTitle");

/* ==========================================================================
   State global de l'app + persistance localStorage
   ========================================================================== */
let userProfile = {
  name: "Thomas Martin",
  index: null,
};

let settings = {
  temperatureC: 20,
  altitudeM: 0,
  radarUnit: "mps",
  speedUnit: "mph",
  distanceUnit: "m",
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

let personalDistances = {}; // { clubId: distanceValue } — un club = une distance

let wedgeDistances = {}; // { clubId: [{ id, label, value }, ...] } — les wedges acceptent plusieurs distances

let driverSettings = { length: null, weight: null };

// Cible appelée par le bouton retour, réassignée par chaque écran qui en a besoin.
let backTarget = () => showPage('home');

function saveStateToLocalStorage() {
  const data = { userProfile, settings, radars, golfBag, driverSettings, personalDistances, wedgeDistances };
  localStorage.setItem("golfAppState", JSON.stringify(data));
}

function loadStateFromLocalStorage() {
  try {
    const raw = localStorage.getItem("golfAppState");
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.userProfile) Object.assign(userProfile, data.userProfile);
    if (data.settings) Object.assign(settings, data.settings);
    if (Array.isArray(data.radars) && data.radars.length) radars = data.radars;
    if (data.golfBag) Object.assign(golfBag, data.golfBag);
    if (data.driverSettings) Object.assign(driverSettings, data.driverSettings);
    if (data.personalDistances) Object.assign(personalDistances, data.personalDistances);
    if (data.wedgeDistances) Object.assign(wedgeDistances, data.wedgeDistances);
  } catch (e) {
    console.error("Erreur de lecture du localStorage", e);
  }
}

/* ==========================================================================
   Carte profil réutilisée en haut de chaque écran
   ========================================================================== */
// Libellé sous le nom : index saisi, sinon texte de remplacement
function indexLabel() {
  return userProfile.index === null ? "Index non renseigné" : `Index ${userProfile.index}`;
}

function topRowHtml() {
  return `
    <section class="profile_card">
      <div class="profile_cover"></div>
      <div class="profile_card-content">
        <div class="profile_avatar-wrapper">
          <div class="profile_avatar-image">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.5c-3.5 0-10.4 1.8-10.4 5.3v2h20.8v-2c0-3.5-6.9-5.3-10.4-5.3z"/></svg>
          </div>
        </div>
        <div class="profile_info">
          <h2 class="profile_name">${userProfile.name}</h2>
          <p class="profile_index" id="profileIndex" onclick="editProfileIndex()">${indexLabel()}</p>
        </div>
      </div>
    </section>
  `;
}
/* ==========================================================================
   Écran Menu (paramètres)
   ========================================================================== */
function renderMenuTab() {
  backTarget = () => showPage('home');
  backBtn.classList.remove("is-hidden");
  headerTitle.textContent = "Menu";
  menuRoot.innerHTML = `
    ${topRowHtml()}
    <div class="field-list">
      <h3>Profil</h3>
      <div class="field-row field-row-link" onclick="goToGolfBag()"><span class="label">Mon sac de golf</span><span class="val">${golfBag.clubs.length} club${golfBag.clubs.length > 1 ? 's' : ''} &#8250;</span></div>
      <div class="field-row field-row-link" onclick="goToDistances()"><span class="label">Mes distances</span><span class="val">&#8250;</span></div>
    </div>
    <div class="field-list">
      <h3>Conditions de référence</h3>
      <div class="field-row"><span class="label">Température (°C)</span><span class="val">
        <input type="number" id="set-temp" value="${settings.temperatureC}" step="1" onchange="updateMenuSetting('temperatureC',this.value)">
      </span></div>
      <div class="field-row"><span class="label">Altitude (m)</span><span class="val">
        <input type="number" id="set-alt" value="${settings.altitudeM}" step="10" onchange="updateMenuSetting('altitudeM',this.value)">
      </span></div>
    </div>
    <div class="field-list">
      <h3>Unité de distance</h3>
      <div class="field-row"><span class="label">Distance</span><span class="val">
        <select id="set-distance-unit" onchange="updateMenuSetting('distanceUnit',this.value)">
          <option value="m" ${settings.distanceUnit==='m'?'selected':''}>Mètres (m)</option>
          <option value="ft" ${settings.distanceUnit==='ft'?'selected':''}>Yards/Feet</option>
        </select>
      </span></div>
    </div>
    <div class="field-list">
      <h3>Unités de vitesse</h3>
      <div class="field-row"><span class="label">Unité du radar</span><span class="val">
        <select id="set-radar-unit" onchange="updateMenuSetting('radarUnit',this.value)">
          <option value="mps" ${settings.radarUnit==='mps'?'selected':''}>MPS (m/s)</option>
          <option value="mph" ${settings.radarUnit==='mph'?'selected':''}>MPH</option>
          <option value="kph" ${settings.radarUnit==='kph'?'selected':''}>KPH</option>
        </select>
      </span></div>

      <div class="field-row"><span class="label">Unité affichée</span><span class="val">
        <select id="set-speed-unit" onchange="updateMenuSetting('speedUnit',this.value)">
          <option value="mph" ${settings.speedUnit==='mph'?'selected':''}>MPH</option>
          <option value="kph" ${settings.speedUnit==='kph'?'selected':''}>KPH</option>
        </select>
      </span></div>
    </div>
    <div class="field-list">
      <h3>Radars</h3>
      ${radars.map(r => `
        <div class="field-row"><span class="label">
          <input type="text" value="${r.label}" onchange="updateRadarField('${r.id}','label',this.value)" class="w-full">
        </span></div>
        <div class="field-row"><span class="label">Écart Club Speed</span><span class="val">
          <select onchange="updateRadarSign('${r.id}','clubOffsetValue',this.value)">
            <option value="1" ${r.clubOffsetValue>=0?'selected':''}>+</option>
            <option value="-1" ${r.clubOffsetValue<0?'selected':''}>-</option>
          </select>
          <input type="number" step="0.1" min="0" value="${Math.abs(r.clubOffsetValue)}" onchange="updateRadarField('${r.id}','clubOffsetValue',this.value)" class="w-70">
          <select onchange="updateRadarField('${r.id}','clubOffsetUnit',this.value)">
            <option value="pct" ${r.clubOffsetUnit==='pct'?'selected':''}>%</option>
            <option value="mph" ${r.clubOffsetUnit==='mph'?'selected':''}>MPH</option>
            <option value="mps" ${r.clubOffsetUnit==='mps'?'selected':''}>MPS</option>
            <option value="kph" ${r.clubOffsetUnit==='kph'?'selected':''}>KPH</option>
          </select>
        </span></div>
        <div class="field-row"><span class="label">Écart Ball Speed</span><span class="val">
          <select onchange="updateRadarSign('${r.id}','ballOffsetValue',this.value)">
            <option value="1" ${r.ballOffsetValue>=0?'selected':''}>+</option>
            <option value="-1" ${r.ballOffsetValue<0?'selected':''}>-</option>
          </select>
          <input type="number" step="0.1" min="0" value="${Math.abs(r.ballOffsetValue)}" onchange="updateRadarField('${r.id}','ballOffsetValue',this.value)" class="w-70">
          <select onchange="updateRadarField('${r.id}','ballOffsetUnit',this.value)">
            <option value="pct" ${r.ballOffsetUnit==='pct'?'selected':''}>%</option>
            <option value="mph" ${r.ballOffsetUnit==='mph'?'selected':''}>MPH</option>
            <option value="mps" ${r.ballOffsetUnit==='mps'?'selected':''}>MPS</option>
            <option value="kph" ${r.ballOffsetUnit==='kph'?'selected':''}>KPH</option>
          </select>
        </span></div>
        <div class="field-row"><span class="label">Radar actif</span><span class="val">
          <label class="radio-select">
            <input type="radio" name="default-radar" ${settings.defaultRadarId===r.id?'checked':''} onchange="setDefaultRadar('${r.id}')">
            <span class="radio-select-dot"></span>
          </label>
          ${radars.length > 1 ? `<button onclick="removeRadar('${r.id}')">Suppr.</button>` : ''}
        </span></div>
      `).join('')}
      <div class="resume-row"><button class="add-radar-btn" onclick="addRadar()"><span class="add-radar-plus">+</span>Ajouter un radar</button></div>
    </div>
    <div class="field-list">
      <h3>Driver</h3>
      <div class="field-row"><span class="label">Taille (cm)</span><span class="val">
        <input type="number" id="driver-length" value="${driverSettings.length ?? ''}" step="0.5" onchange="updateDriverField('length',this.value)">
      </span></div>
      <div class="field-row"><span class="label">Poids (g)</span><span class="val">
        <input type="number" id="driver-weight" value="${driverSettings.weight ?? ''}" step="1" onchange="updateDriverField('weight',this.value)">
      </span></div>
    </div>
    <nav class="menu_list">
      <button class="menu_item" type="button" onclick="goToHelp()">
        <span class="menu_icon-wrapper"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.5 2.5 0 0 1 4.9.8c0 1.7-2.4 1.7-2.4 3.4"/><circle cx="12" cy="16.8" r="0.2" fill="currentColor"/></svg></span>
        <span class="menu_content">
          <span class="menu_title">Aide &amp; support</span>
          <span class="menu_description">FAQ, contact, conditions d'utilisation.</span>
        </span>
        <svg class="menu_chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </nav>
  `;
}

// 1 mètre en yards (utilisé pour "Yards/Feet" : yards pour les coups pleins,
// le putter n'ayant plus de distance suivie dans cet écran).
const MENU_M_TO_YD = 1.09361;

function convertMenuDistanceValue(value, fromUnit, toUnit){
  if(value === null || value === undefined || value === '' || fromUnit === toUnit) return value;
  const meters = fromUnit === 'ft' ? value / MENU_M_TO_YD : value;
  const converted = toUnit === 'ft' ? meters * MENU_M_TO_YD : meters;
  return Math.round(converted * 10) / 10;
}

// Auto-save générique pour les champs simples (température/altitude/unités) : appelé au onchange
// de chaque input/select, sans re-render (évite d'effacer une saisie en cours dans un autre champ).
// Cas particulier "distanceUnit" : les distances déjà enregistrées sont converties vers la
// nouvelle unité pour rester justes (au lieu de garder l'ancien nombre avec un nouveau libellé).
function updateMenuSetting(key, value){
  if(key === 'distanceUnit' && value !== settings.distanceUnit){
    const fromUnit = settings.distanceUnit, toUnit = value;
    Object.keys(personalDistances).forEach(id => {
      personalDistances[id] = convertMenuDistanceValue(personalDistances[id], fromUnit, toUnit);
    });
    Object.keys(wedgeDistances).forEach(id => {
      (wedgeDistances[id] || []).forEach(entry => {
        entry.value = convertMenuDistanceValue(entry.value, fromUnit, toUnit);
      });
    });
  }
  settings[key] = (key === 'temperatureC' || key === 'altitudeM') ? (parseFloat(value) || 0) : value;
  saveStateToLocalStorage();
}

// Édition inline de l'index : un clic sur la carte profil remplace le texte par un input.
function editProfileIndex(){
  const el = document.getElementById('profileIndex');
  if(!el || el.querySelector('input')) return; // déjà en édition
  el.onclick = null;
  el.innerHTML = `<input type="number" id="profile-index-input" value="${userProfile.index ?? ''}" step="0.1">`;
  const input = document.getElementById('profile-index-input');
  input.addEventListener('click', (e) => e.stopPropagation());
  input.addEventListener('blur', saveProfileIndex);
  input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') input.blur();
    if(e.key === 'Escape'){ input.onblur = null; renderProfileIndexDisplay(); }
  });
  input.focus();
  input.select();
}

// Sauvegarde l'index saisi et remet l'affichage en mode lecture (champ vide → null).
function saveProfileIndex(){
  const input = document.getElementById('profile-index-input');
  if(!input) return;
  const num = parseFloat(input.value);
  userProfile.index = isNaN(num) ? null : num;
  saveStateToLocalStorage();
  renderProfileIndexDisplay();
}

function renderProfileIndexDisplay(){
  const el = document.getElementById('profileIndex');
  if(!el) return;
  el.textContent = indexLabel();
  el.onclick = editProfileIndex;
}
// Auto-save des champs Driver (taille/poids), même principe que updateMenuSetting.
function updateDriverField(key, value){
  const num = parseFloat(value);
  driverSettings[key] = isNaN(num) ? null : num;
  saveStateToLocalStorage();
}

function updateRadarField(id, field, value){
  const radar = radars.find(r => r.id === id);
  if(!radar) return;
  if(field === 'clubOffsetValue' || field === 'ballOffsetValue'){
    const sign = radar[field] < 0 ? -1 : 1;
    radar[field] = sign * Math.abs(parseFloat(value) || 0);
  } else {
    radar[field] = value;
  }
  saveStateToLocalStorage();
  renderMenuTab();
}

function updateRadarSign(id, field, signValue){
  const radar = radars.find(r => r.id === id);
  if(!radar) return;
  const sign = parseInt(signValue, 10);
  radar[field] = sign * Math.abs(radar[field]);
  saveStateToLocalStorage();
  renderMenuTab();
}

function setDefaultRadar(id){
  settings.defaultRadarId = id;
  saveStateToLocalStorage();
  renderMenuTab();
}

function addRadar(){
  const id = 'radar_' + Date.now();
  radars.push({ id, label: 'Nouveau radar', clubOffsetValue: 0, clubOffsetUnit: 'pct', ballOffsetValue: 0, ballOffsetUnit: 'pct' });
  saveStateToLocalStorage();
  renderMenuTab();
}

function removeRadar(id){
  if(radars.length <= 1) return;
  radars = radars.filter(r => r.id !== id);
  if(settings.defaultRadarId === id) settings.defaultRadarId = radars[0].id;
  saveStateToLocalStorage();
  renderMenuTab();
}

/* ==========================================================================
   Écran Sac de golf — sélection par case à cocher parmi un catalogue fixe
   (aucune limite de nombre de clubs)
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

function goToGolfBag(){
  renderGolfBagScreen();
}

function renderGolfBagScreen(){
  backTarget = () => { showPage('menu'); renderMenuTab(); };
  backBtn.classList.remove("is-hidden");
  headerTitle.textContent = "Mon sac";
  menuRoot.innerHTML = `
    ${topRowHtml()}
    <div class="field-list">
      <h3>Clubs (${golfBag.clubs.length})</h3>
      ${golfClubCatalog.map(c => {
        const checked = golfBag.clubs.includes(c.id);
        return `
        <div class="field-row"><span class="label">${c.name}</span><span class="val">
          <label class="radio-select">
            <input type="checkbox" ${checked ? 'checked' : ''} onchange="toggleClub('${c.id}',this.checked)">
            <span class="radio-select-dot"></span>
          </label>
        </span></div>`;
      }).join('')}
    </div>
    <button type="button" class="btn btn-primary menu-save-btn" onclick="backTarget()">Enregistrer</button>
  `;
}

function toggleClub(id, isChecked){
  if(isChecked){
    if(golfBag.clubs.includes(id)) return;
    golfBag.clubs.push(id);
  } else {
    golfBag.clubs = golfBag.clubs.filter(cid => cid !== id);
  }
  saveStateToLocalStorage();
  renderGolfBagScreen();
}

/* ==========================================================================
   Écran Mes distances — un champ de distance par club présent dans le sac
   (source de vérité pour la sélection : golfBag.clubs). Le putter n'a pas
   de distance suivie ici (jeu au feeling). Les wedges acceptent plusieurs
   distances nommées (3/4 swing, plein swing...).
   ========================================================================== */
function goToDistances(){
  renderDistancesScreen();
}

function isWedge(clubId){
  return clubId.startsWith('wedge');
}

function renderDistancesScreen(){
  backTarget = () => { showPage('menu'); renderMenuTab(); };
  backBtn.classList.remove("is-hidden");
  headerTitle.textContent = "Mes distances";
  // "Yards/Feet" = yards pour tous les clubs de cet écran (le putter, en feet, n'y figure pas)
  const unitLabel = settings.distanceUnit === 'ft' ? 'yd' : 'm';
  const selectedClubs = golfClubCatalog.filter(c => c.id !== 'putter' && golfBag.clubs.includes(c.id));
  menuRoot.innerHTML = `
    ${topRowHtml()}
    <div class="field-list">
      <h3>Distances par club</h3>
      ${selectedClubs.length === 0 ? `
        <div class="field-row"><span class="label">Aucun club dans le sac</span></div>
      ` : selectedClubs.map(c => isWedge(c.id) ? wedgeDistanceRowsHtml(c, unitLabel) : `
        <div class="field-row"><span class="label">${c.name}</span><span class="val">
          <input type="number" step="1" value="${personalDistances[c.id] ?? ''}" onchange="updateDistance('${c.id}',this.value)"> ${unitLabel}
        </span></div>
      `).join('')}
    </div>
    <button type="button" class="btn btn-primary menu-save-btn" onclick="backTarget()">Enregistrer</button>
  `;
}

// Auto-save de la distance saisie pour un club donné (hors wedges)
function updateDistance(clubId, value){
  const num = parseFloat(value);
  personalDistances[clubId] = isNaN(num) ? null : num;
  saveStateToLocalStorage();
}

// Garantit au moins une distance ("Distance 1") pour un wedge du sac
function ensureWedgeEntries(clubId){
  if(!Array.isArray(wedgeDistances[clubId]) || wedgeDistances[clubId].length === 0){
    wedgeDistances[clubId] = [{ id: 'd1', label: 'Distance 1', value: null }];
  }
}

// Bloc "nom du wedge" + une ligne éditable par distance + bouton d'ajout
function wedgeDistanceRowsHtml(c, unitLabel){
  ensureWedgeEntries(c.id);
  const entries = wedgeDistances[c.id];
  return `
    <div class="field-row"><span class="label">${c.name}</span></div>
    ${entries.map(e => `
      <div class="field-row wedge-distance-row"><span class="label">
        <input type="text" value="${e.label}" onchange="updateWedgeDistanceLabel('${c.id}','${e.id}',this.value)">
      </span><span class="val">
        <input type="number" step="1" value="${e.value ?? ''}" onchange="updateWedgeDistanceValue('${c.id}','${e.id}',this.value)"> ${unitLabel}
        ${entries.length > 1 ? `<button type="button" onclick="removeWedgeDistance('${c.id}','${e.id}')">Suppr.</button>` : ''}
      </span></div>
    `).join('')}
    <div class="resume-row"><button type="button" class="add-radar-btn" onclick="addWedgeDistance('${c.id}')"><span class="add-radar-plus">+</span>Ajouter une distance</button></div>
  `;
}

function addWedgeDistance(clubId){
  ensureWedgeEntries(clubId);
  const n = wedgeDistances[clubId].length + 1;
  wedgeDistances[clubId].push({ id: 'd' + Date.now(), label: 'Distance ' + n, value: null });
  saveStateToLocalStorage();
  renderDistancesScreen();
}

function removeWedgeDistance(clubId, entryId){
  if(!wedgeDistances[clubId] || wedgeDistances[clubId].length <= 1) return;
  wedgeDistances[clubId] = wedgeDistances[clubId].filter(e => e.id !== entryId);
  saveStateToLocalStorage();
  renderDistancesScreen();
}

// Le nom de la distance se modifie librement ; pas de re-render pour ne pas perdre le focus
function updateWedgeDistanceLabel(clubId, entryId, value){
  const entry = (wedgeDistances[clubId] || []).find(e => e.id === entryId);
  if(!entry) return;
  entry.label = value.trim() || entry.label;
  saveStateToLocalStorage();
}

function updateWedgeDistanceValue(clubId, entryId, value){
  const entry = (wedgeDistances[clubId] || []).find(e => e.id === entryId);
  if(!entry) return;
  const num = parseFloat(value);
  entry.value = isNaN(num) ? null : num;
  saveStateToLocalStorage();
}

/* ==========================================================================
   Écran Aide & support
   ========================================================================== */
function goToHelp(){
  renderHelpScreen();
}

function renderHelpScreen(){
  backTarget = () => { showPage('menu'); renderMenuTab(); };
  backBtn.classList.remove("is-hidden");
  headerTitle.textContent = "Aide & support";
  menuRoot.innerHTML = `
    ${topRowHtml()}
    <div class="field-list">
      <h3>FAQ</h3>
    </div>
    <div class="field-list">
      <h3>Contact</h3>
    </div>
    <div class="field-list">
      <h3>Conditions d'utilisation</h3>
    </div>
  `;
}

// Expose renderMenuTab globalement pour être appelée depuis index.html
window.renderMenuTab = renderMenuTab;

/* ==========================================================================
   Initialisation
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  loadStateFromLocalStorage();

  backBtn.addEventListener('click', () => backTarget());

  renderMenuTab();
});
