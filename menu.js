/* ==========================================================================
   Références DOM globales (utilisées par toutes les fonctions render*)
   ========================================================================== */
const root = document.getElementById("root");
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

let golfBag = { size: 0 };

let driverSettings = { length: null, weight: null };

// Cible appelée par le bouton retour. Le Menu n'a plus d'écran de détail
// interne ("Mon sac de golf" redirige désormais vers Stats > Saisie détaillée),
// donc ce bouton ramène toujours à l'accueil.
let backTarget = () => showPage('home');

function saveStateToLocalStorage() {
  const data = { userProfile, settings, radars, golfBag, driverSettings };
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
  root.innerHTML = `
    ${topRowHtml()}
    <div class="field-list">
      <h3>Profil</h3>
      <div class="field-row"><span class="label">Mon sac de golf</span><span class="val">
        <button onclick="goToGolfBag()">${golfBag.size}/14 clubs &#8250;</button>
      </span></div>
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
          <option value="ft" ${settings.distanceUnit==='ft'?'selected':''}>Feet (ft)</option>
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
      <button class="menu_item" type="button" onclick="console.log('Navigation → Aide & support')">
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

// Auto-save générique pour les champs simples (température/altitude/unités) : appelé au onchange
// de chaque input/select, sans re-render (évite d'effacer une saisie en cours dans un autre champ).
function updateMenuSetting(key, value){
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
   Sac de golf — la gestion des clubs se fait désormais dans le module Stats
   (écran "Saisie détaillée"), voir showStatsScreen() exposé par stats.js.
   ========================================================================== */
function goToGolfBag(){
  showPage('stats');
  if (typeof showStatsScreen === 'function') showStatsScreen('saisie-detaillee');
}

/* ==========================================================================
   Initialisation
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  loadStateFromLocalStorage();

  backBtn.addEventListener('click', () => backTarget());

  renderMenuTab();
});
