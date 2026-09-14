/* ==========================================================================
   GYM — Bibliothèque d'icônes SVG inline
   Style : outline, stroke=currentColor, cohérent avec le design system.
   Utilisation : ICONS.dumbbell, ICONS.chevronRight, etc.
   ========================================================================== */

const ICONS = {
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`,

  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,

  more: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>`,

  dumbbell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 7v10M4 9v6M17.5 7v10M20 9v6M8.5 12h7"/></svg>`,

  running: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="15.5" cy="5" r="1.6" fill="currentColor" stroke="none"/><path d="M9 21l2-5 2.3-2M4 13l4-2.5 2.7 1.8L14.5 9l3 1.5M11.3 12.3L9.5 17l-4 1.5"/></svg>`,

  muscle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 20c-1-3.5 0-7 2-9.5C8.5 8 9 5.5 8 4c2.5-1 5 .5 5.5 3 2-1 4 0 4.5 2.5.6 3-1 6-3 7.5-1 .8-1.5 1.7-1.5 3"/><path d="M9 20h8"/></svg>`,

  bolt: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2L4 14h6l-1 8 9-13h-6l1-7z"/></svg>`,

  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>`,

  calendarPlus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17M12 14v5M9.5 16.5h5"/></svg>`,

  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>`,

  timer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2h4M12 5v3"/><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5"/></svg>`,

  tempo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 11-3-6.7"/><path d="M21 3v5h-5"/></svg>`,

  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`,

  chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`,

  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>`,

  checkCircle: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.2 14.3L6.5 12l1.4-1.4 2.9 2.9 5.9-5.9 1.4 1.4-7.3 7.3z"/></svg>`,

  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`,

  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4.5h6V7M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>`,

  target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>`,

  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.6-9.7-9.3C.8 7.8 2.5 4.5 6 4c2-.3 3.7.7 6 3 2.3-2.3 4-3.3 6-3 3.5.5 5.2 3.8 3.7 7.2C19.5 15.9 12 20.5 12 20.5z"/></svg>`,

  trendUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8M15 7h6v6"/></svg>`,

  trendDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l6 6 4-4 8 8M15 17h6v-6"/></svg>`,

  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V7a4 4 0 018 0v3.5"/></svg>`,

  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>`,

  sliders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h10M18 6h2M4 12h2M8 12h12M4 18h14M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>`,

  star: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2.5l2.9 6.2 6.6.7-5 4.6 1.4 6.6L12 17.6l-5.9 3 1.4-6.6-5-4.6 6.6-.7z"/></svg>`,

  barChart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19V10M12 19V5M19 19v-6"/></svg>`,

  play: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M7 4.5v15l13-7.5z"/></svg>`,

  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l.9-4.3L16.6 4.9a1.6 1.6 0 012.3 0l.2.2a1.6 1.6 0 010 2.3L8.3 19.1 4 20z"/></svg>`,

  doc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>`,

  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>`,

  legs: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6l.6 9.5.9 8a1.5 1.5 0 01-1.5 1.5h-.6a1.5 1.5 0 01-1.5-1.3L12 13l-.9 7.7a1.5 1.5 0 01-1.5 1.3h-.6A1.5 1.5 0 017.5 20l.9-8z"/></svg>`,

  torso: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4L4 6.5 5.5 10 8 8.5V20h8V8.5l2.5 1.5L20 6.5 16 4c-1 1-2.5 1.5-4 1.5S9 5 8 4z"/></svg>`,

  abs: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="4" width="10" height="16" rx="3"/><path d="M7 9.5h10M7 14.5h10M12 4v16"/></svg>`,

  backMuscle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c-2 2-2.5 3-6 3.5M12 3c2 2 2.5 3 6 3.5M6 6.5c-1 4 0 9-2 13M18 6.5c1 4 0 9 2 13M9 10c1 3 1 7-.5 10M15 10c-1 3-1 7 .5 10M12 3v8"/></svg>`,

  shoulders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15c0-4 2-6 4-6M21 15c0-4-2-6-4-6M7 9a5 5 0 0110 0M4 20c1-3 2-5 5-5M20 20c-1-3-2-5-5-5"/></svg>`,

  arms: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4v6c0 3 1.5 5 3 5.5M7 4c2 0 3 1 3 3M14 20l-1-6-3-1.5"/><circle cx="15" cy="18" r="2.2"/></svg>`,

  glutes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5c-3 0-5 3-5 7 0 4.5 2.5 8 5.5 8 1.8 0 2.3-1.5 3.5-1.5s1.7 1.5 3.5 1.5c3 0 5.5-3.5 5.5-8 0-4-2-7-5-7-2 0-3 1-4 1s-2-1-4-1z"/></svg>`,

  mobility: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="1.6" fill="currentColor" stroke="none"/><path d="M12 6v6l-4 6M12 12l4.5 2M8 8l4 2 5-2.5"/></svg>`,

  functional: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18c2-1 2-3 4-3s2 2 4 2 2-2 4-2 2 2 4 2M4 8l3 3M17 8l3 3M9 9l3 3 3-3"/></svg>`,

  equipment: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9v6M22 9v6M6 6v12M18 6v12M6 12h12"/></svg>`,

  bodyweight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4.5" r="2"/><path d="M12 7v6M12 13l-4 6M12 13l4 6M7 9l5-2 5 2"/></svg>`,

  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 8v.01"/></svg>`,

  arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,

  sparkles: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M11 2l1.2 3.8L16 7l-3.8 1.2L11 12l-1.2-3.8L6 7l3.8-1.2z"/><path d="M18.5 13l.7 2.1L21.3 16l-2.1.7-.7 2.1-.7-2.1L15.7 16l2.1-.9z"/></svg>`,

  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-7 8 7"/><path d="M6 9.5V20h12V9.5"/></svg>`,

  pause: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg>`,

  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="6" rx="7" ry="2.6"/><path d="M5 6v5c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6"/><path d="M5 11v5c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-5"/></svg>`,
};


/* ==========================================================================
   GYM — Données mockées
   Aucune donnée ne vient d'un backend : tout est généré ici pour permettre
   à chaque page de fonctionner de façon autonome.
   ========================================================================== */

/* ---- Utilitaires de date --------------------------------------------------
   Les séances/objectifs sont calculés par rapport à "aujourd'hui" pour que
   la démo reste cohérente peu importe la date à laquelle elle est ouverte. */

function gymAddDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function gymFormatDate(date) {
  const mois = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
  ];
  return `${date.getDate().toString().padStart(2, "0")} ${mois[date.getMonth()]} ${date.getFullYear()}`;
}

function gymFormatMonthYear(date) {
  const mois = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
  ];
  return `${mois[date.getMonth()]} ${date.getFullYear()}`;
}

const GYM_TODAY = new Date();

/* ---- 20 exercices ---------------------------------------------------------- */

const EXERCISES = [
  { id: "e01", name: "Squat", muscle: "Quadriceps", categoryGroup: "jambes", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "e02", name: "Presse à cuisses", muscle: "Quadriceps", categoryGroup: "jambes", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "e03", name: "Fentes marchées", muscle: "Quadriceps", categoryGroup: "jambes", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "e04", name: "Leg curl", muscle: "Ischio-jambiers", categoryGroup: "jambes", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "e05", name: "Élévations mollets", muscle: "Mollets", categoryGroup: "jambes", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "e06", name: "Soulevé de terre", muscle: "Ischio-jambiers, dos", categoryGroup: "dos", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "e07", name: "Développé couché", muscle: "Pectoraux", categoryGroup: "haut-du-corps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "e08", name: "Tractions", muscle: "Dos", categoryGroup: "dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "e09", name: "Développé militaire", muscle: "Épaules", categoryGroup: "epaules", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "e10", name: "Rowing barre", muscle: "Dos", categoryGroup: "dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "e11", name: "Curl biceps haltères", muscle: "Biceps", categoryGroup: "bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "e12", name: "Extension triceps poulie", muscle: "Triceps", categoryGroup: "bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "e13", name: "Élévations latérales", muscle: "Épaules", categoryGroup: "epaules", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "e14", name: "Planche", muscle: "Gainage", categoryGroup: "abdos", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "e15", name: "Crunch", muscle: "Abdominaux", categoryGroup: "abdos", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "e16", name: "Hip thrust", muscle: "Fessiers", categoryGroup: "fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "glutes" },
  { id: "e17", name: "Gainage latéral", muscle: "Obliques", categoryGroup: "abdos", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "e18", name: "Dips", muscle: "Triceps, pectoraux", categoryGroup: "bras", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "e19", name: "Fentes bulgares", muscle: "Quadriceps, fessiers", categoryGroup: "jambes", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "e20", name: "Tirage vertical", muscle: "Dos", categoryGroup: "dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
];

function gymGetExercise(id) {
  return EXERCISES.find((e) => e.id === id);
}

/* ---- Catégories (page Exercices) ------------------------------------------- */

const EXERCISE_CATEGORIES = [
  { id: "haut-du-corps", name: "Haut du corps", count: 78, description: "Pectoraux, dos, épaules, bras.", icon: "torso", regions: ["haut-du-corps"] },
  { id: "bas-du-corps", name: "Bas du corps", count: 64, description: "Cuisses, fessiers, mollets.", icon: "legs", regions: ["bas-du-corps"] },
  { id: "gainage", name: "Gainage", count: 28, description: "Abdominaux, dos, stabilité.", icon: "abs", regions: ["gainage"] },
  { id: "mobilite", name: "Mobilité", count: 32, description: "Souplesse, posture, prévention.", icon: "mobility", regions: ["mobilite"] },
  { id: "fonctionnel", name: "Fonctionnel", count: 46, description: "Mouvements complets, coordination.", icon: "functional", regions: ["haut-du-corps", "bas-du-corps"] },
  { id: "avec-materiel", name: "Avec matériel", count: 89, description: "Haltères, machines, kettlebells, etc.", icon: "equipment", regions: ["haut-du-corps", "bas-du-corps"] },
  { id: "poids-du-corps", name: "Poids du corps", count: 57, description: "Sans matériel, partout.", icon: "bodyweight", regions: ["haut-du-corps", "bas-du-corps", "gainage"] },
];

/* ---- Objectifs de séance / programme --------------------------------------- */

const TRAINING_GOALS = [
  { id: "force", label: "Force", icon: "dumbbell" },
  { id: "endurance", label: "Endurance", icon: "running" },
  { id: "hypertrophie", label: "Hypertrophie", icon: "muscle" },
  { id: "vitesse", label: "Vitesse", icon: "bolt" },
];

/* ---- Catégories musculaires (Créer séance) ---------------------------------- */

const SESSION_CATEGORIES = [
  { id: "tout", label: "Tout", icon: "grid" },
  { id: "jambes", label: "Jambes", icon: "legs" },
  { id: "haut-du-corps", label: "Haut du corps", icon: "torso" },
  { id: "abdos", label: "Abdos", icon: "abs" },
  { id: "dos", label: "Dos", icon: "backMuscle" },
  { id: "epaules", label: "Épaules", icon: "shoulders" },
  { id: "bras", label: "Bras", icon: "arms" },
  { id: "fessiers", label: "Fessiers", icon: "glutes" },
];

const REST_OPTIONS = [
  { value: "30s", label: "30 sec" },
  { value: "45s", label: "45 sec" },
  { value: "60s", label: "1 min" },
  { value: "90s", label: "1 min 30" },
  { value: "120s", label: "2 min" },
];
const TEMPO_OPTIONS = ["2-0-2-0", "3-1-1-0", "4-0-1-0"];

/* ---- 5 programmes ------------------------------------------------------------
   L'application démarre vierge : aucun programme, séance, objectif ou
   historique n'est pré-rempli. Tout est créé par la personne qui utilise
   le module (via "Créer un programme" / "Créer une séance" / "Créer un
   objectif"), à partir de zéro, comme une application jamais utilisée. */

const PROGRAMS = [];

function gymGetProgram(id) {
  return PROGRAMS.find((p) => p.id === id);
}

/**
 * Supprime un programme (et toutes ses séances) après confirmation.
 */
function gymDeleteProgram(programId) {
  if (!confirm("Supprimer ce programme et toutes ses séances ? Cette action est irréversible.")) return;
  const index = GYM_DATA.programs.findIndex((p) => p.id === programId);
  if (index === -1) return;
  GYM_DATA.programs.splice(index, 1);
  gymNavigate("programmes");
}

/**
 * Supprime une séance d'un programme après confirmation, puis renumérote
 * et redéverrouille séquentiellement les séances restantes.
 */
function gymDeleteSession(programId, sessionId) {
  const program = gymGetProgram(programId);
  if (!program) return;
  if (!confirm("Supprimer cette séance ? Cette action est irréversible.")) return;

  program.sessions = program.sessions.filter((s) => s.id !== sessionId);

  let unlockedAssigned = false;
  program.sessions.forEach((s, i) => {
    s.index = i + 1;
    if (s.status === "terminee") return;
    s.status = unlockedAssigned ? "verrouillee" : "en-cours";
    unlockedAssigned = true;
  });

  gymNavigate("programme-detail", { id: programId });
}

/* ---- Bibliothèque de modèles de programmes (onglet "Bibliothèque") --------------
   Ceci reste : c'est le catalogue fourni par l'application (comme une
   bibliothèque d'exercices), pas une donnée d'usage personnelle. */

const PROGRAM_LIBRARY = [
  { id: "lib-01", name: "Prise de masse débutant", goal: "hypertrophie", sessionsCount: 8, frequencyPerWeek: 3, level: "Débutant", icon: "muscle", description: "Une introduction progressive au volume d'entraînement pour construire du muscle en toute sécurité." },
  { id: "lib-02", name: "Powerlifting essentiel", goal: "force", sessionsCount: 16, frequencyPerWeek: 4, level: "Avancé", icon: "dumbbell", description: "Squat, développé couché et soulevé de terre au centre d'un programme de force pure." },
  { id: "lib-03", name: "Callisthénie & poids du corps", goal: "endurance", sessionsCount: 10, frequencyPerWeek: 3, level: "Intermédiaire", icon: "bodyweight", description: "Tractions, dips et gainage pour développer force et contrôle sans matériel." },
  { id: "lib-04", name: "Sprint & explosivité", goal: "vitesse", sessionsCount: 6, frequencyPerWeek: 2, level: "Intermédiaire", icon: "bolt", description: "Un cycle court centré sur la puissance et la vitesse de réaction." },
];

/* ---- Objectifs personnels (page Objectifs) --------------------------------------
   Vide au départ : la personne crée ses propres objectifs via le bouton
   "Créer un nouvel objectif". */

const GOALS = [];

/* ---- Historique ------------------------------------------------------------------
   Vide au départ : rempli uniquement par les séances réellement effectuées. */

const HISTORY = [];

function gymGroupHistoryByMonth(entries) {
  const groups = new Map();
  entries.forEach((entry) => {
    const key = gymFormatMonthYear(entry.date);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  });
  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
}

/* ---- Détail générique d'une séance active ----------------------------------------
   Construit le détail (séries / répétitions / repos / statut) d'une séance à
   partir de ses exercices et de son objectif, quelle que soit la séance —
   il n'y a plus de séance figée en dur. */

const REST_BY_GOAL = { force: "1 min 30", endurance: "45 sec", hypertrophie: "1 min", vitesse: "2 min", mobilite: "30 sec" };
const REPS_BY_GOAL = { force: "6-8", endurance: "15-20", hypertrophie: "10-12", vitesse: "8-10", mobilite: "10-12" };
const SETS_BY_GOAL = { force: 4, endurance: 3, hypertrophie: 4, vitesse: 3, mobilite: 3 };

function gymGetSessionDetail(session) {
  if (!session) return [];
  // Si la séance a été créée avec des exercices détaillés (séries/répétitions
  // choisies par la personne), on les utilise telles quelles.
  if (Array.isArray(session.exercises) && session.exercises.length) {
    return session.exercises.map((item, index) => {
      const exo = gymGetExercise(item.exerciseId);
      return {
        exerciseId: item.exerciseId,
        name: exo ? exo.name : "Exercice",
        sets: item.sets,
        reps: item.reps,
        rest: session.rest ? GYM_DATA.restOptions.find((r) => r.value === session.rest)?.label || session.rest : REST_BY_GOAL[session.goal] || "1 min",
        status: index === 0 ? "en-cours" : "a-venir",
      };
    });
  }

  // Repli pour un ancien format de séance sans détail par exercice.
  return session.exerciseIds.map((exerciseId, index) => {
    const exo = gymGetExercise(exerciseId);
    return {
      exerciseId,
      name: exo ? exo.name : "Exercice",
      sets: SETS_BY_GOAL[session.goal] || 3,
      reps: REPS_BY_GOAL[session.goal] || "10-12",
      rest: REST_BY_GOAL[session.goal] || "1 min",
      status: index === 0 ? "en-cours" : "a-venir",
    };
  });
}

/**
 * Retrouve une séance (et son programme parent) par son id, quel que soit
 * le programme. Renvoie { program: null, session: null } si rien n'existe
 * encore (cas normal d'une application vierge).
 */
function gymFindSessionById(sessionId) {
  for (const program of PROGRAMS) {
    const session = program.sessions.find((s) => s.id === sessionId);
    if (session) return { program, session };
  }
  return { program: null, session: null };
}

/* ---- Export global ---------------------------------------------------------------- */

const GYM_DATA = {
  today: GYM_TODAY,
  exercises: EXERCISES,
  categories: EXERCISE_CATEGORIES,
  trainingGoals: TRAINING_GOALS,
  sessionCategories: SESSION_CATEGORIES,
  restOptions: REST_OPTIONS,
  tempoOptions: TEMPO_OPTIONS,
  programs: PROGRAMS,
  programLibrary: PROGRAM_LIBRARY,
  goals: GOALS,
  history: HISTORY,
};

/* ==========================================================================
   GYM — Fonctions utilitaires partagées
   ========================================================================== */

/**
 * Exécute une fonction dès que le DOM est prêt.
 */
function gymOnReady(fn) {
  if (document.readyState !== "loading") fn();
  else document.addEventListener("DOMContentLoaded", fn);
}

/**
 * Anime le remplissage d'une barre de progression (largeur en %).
 * On force un léger délai pour laisser le navigateur peindre l'état à 0
 * avant de déclencher la transition CSS vers la valeur cible.
 */
function gymAnimateProgress(el, percent, delay = 80) {
  if (!el) return;
  el.style.width = "0%";
  window.requestAnimationFrame(() => {
    setTimeout(() => {
      el.style.width = `${Math.max(0, Math.min(100, percent))}%`;
    }, delay);
  });
}

/**
 * Anime un compteur numérique de 0 (ou start) jusqu'à une valeur cible.
 * `formatFn` permet d'ajouter un suffixe (%, kg, etc.).
 */
function gymAnimateCounter(el, target, { duration = 900, start = 0, formatFn } = {}) {
  if (!el) return;
  const format = formatFn || ((v) => `${v}`);
  const startTime = performance.now();
  const isFloat = !Number.isInteger(target);

  function tick(now) {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = start + (target - start) * eased;
    el.textContent = format(isFloat ? Math.round(value * 10) / 10 : Math.round(value));
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/**
 * Calcule les attributs SVG (circonférence / offset) pour un anneau de
 * progression circulaire en fonction d'un pourcentage.
 */
function gymRingProgress(percent, radius = 21) {
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, percent)) / 100) * circumference;
  return { circumference, offset };
}

/**
 * Met en place un groupe d'onglets pill (.tabs > .tab) : gère la classe
 * is-active et déclenche un callback avec l'id de l'onglet sélectionné.
 */
function gymSetupTabs(container, onChange) {
  if (!container) return;
  container.addEventListener("click", (e) => {
    const tab = e.target.closest(".tab");
    if (!tab || !container.contains(tab)) return;
    container.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    if (typeof onChange === "function") onChange(tab.dataset.value, tab);
  });
}

/**
 * Met en place une grille de choix (.choice) en sélection simple ou multiple.
 */
function gymSetupChoiceGrid(container, { multiple = false, onChange } = {}) {
  if (!container) return;
  container.addEventListener("click", (e) => {
    const choice = e.target.closest(".choice");
    if (!choice || !container.contains(choice)) return;
    if (!multiple) {
      container.querySelectorAll(".choice").forEach((c) => c.classList.remove("is-active"));
      choice.classList.add("is-active");
    } else {
      choice.classList.toggle("is-active");
    }
    if (typeof onChange === "function") {
      const active = Array.from(container.querySelectorAll(".choice.is-active")).map((c) => c.dataset.value);
      onChange(multiple ? active : active[0], choice);
    }
  });
}

/**
 * Anti-rebond simple, utilisé pour la barre de recherche.
 */
function gymDebounce(fn, delay = 200) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Formate une durée en minutes (ex : 45 -> "45 min").
 */
function gymFormatDuration(minutes) {
  return `${minutes} min`;
}

/**
 * Retourne l'icône SVG correspondant à une clé, avec repli silencieux.
 */
function gymIcon(key) {
  return (typeof ICONS !== "undefined" && ICONS[key]) || "";
}

/* ==========================================================================
   GYM — Routeur SPA
   Le module tient dans un seul fichier HTML : chaque "page" est une section
   masquée/affichée par JS plutôt qu'un vrai fichier séparé. gymNavigate()
   remplace la navigation par fichier utilisée dans la version multi-pages.
   ========================================================================== */

const GymViews = {};
let currentParams = {};

/**
 * Lit un paramètre "virtuel" de la navigation courante (équivalent d'un
 * paramètre d'URL dans la version multi-pages).
 */
function gymGetParam(name, fallback) {
  return currentParams && currentParams[name] != null ? currentParams[name] : fallback;
}

/**
 * Affiche une vue et déclenche son rendu, sans toucher à l'historique
 * (utilisé en interne par gymNavigate et par la gestion du bouton retour).
 */
function gymActivateView(view, params) {
  if (!GymViews[view]) view = "gym-home";
  currentParams = params || {};

  document.querySelectorAll(".gym-view").forEach((el) => {
    el.hidden = true;
  });
  const section = document.getElementById(`view-${view}`);
  if (section) section.hidden = false;

  // Filet de sécurité : referme toute bottom-sheet restée ouverte en quittant sa vue.
  document.querySelectorAll(".sheet.is-open, .sheet-overlay.is-open").forEach((el) => {
    el.classList.remove("is-open");
  });

  window.scrollTo(0, 0);

  if (GymViews[view] && typeof GymViews[view].render === "function") {
    GymViews[view].render(currentParams);
  }
}

/**
 * Point d'entrée public de navigation entre les "pages" du module.
 * Équivalent de l'ancien window.location.href = 'page.html?...'.
 */
function gymNavigate(view, params) {
  gymActivateView(view, params);
  const hash = `#${view}`;
  const state = { view, params: currentParams };
  if (location.hash !== hash) history.pushState(state, "", hash);
  else history.replaceState(state, "", hash);
}

window.addEventListener("popstate", (e) => {
  if (e.state && e.state.view) {
    gymActivateView(e.state.view, e.state.params);
  } else {
    const view = (location.hash || "#gym-home").replace("#", "");
    gymActivateView(view, {});
  }
});

/* ==========================================================================
   GYM — Générateurs de composants HTML
   Chaque fonction retourne une chaîne HTML prête à être injectée via
   innerHTML. Elles ne font aucun appel réseau : uniquement du templating
   à partir des données mockées ci-dessus. La navigation se fait via
   gymNavigate() (routeur interne) plutôt que par de vrais href de fichiers.
   ========================================================================== */

/**
 * Vignette "image" : comme le module n'a pas de vraies photos, on simule
 * une vignette premium avec un dégradé sombre + un pictogramme de la
 * catégorie/muscle concerné, plutôt qu'une image cassée.
 */
function gymThumb(iconKey, sizeClass = "thumb--sm") {
  return `<div class="thumb ${sizeClass}">${gymIcon(iconKey)}</div>`;
}

/**
 * Badge de statut pour une séance de programme.
 * Statuts possibles : "terminee" | "en-cours" | "verrouillee".
 */
function gymBadgeSessionStatus(status) {
  if (status === "terminee") {
    return `<span class="badge badge--done">${gymIcon("check")} Terminée</span>`;
  }
  if (status === "en-cours") {
    return `<span class="badge badge--current">En cours</span>`;
  }
  return `<span class="badge badge--locked">${gymIcon("lock")} Verrouillée</span>`;
}

/**
 * Delta chiffré avec flèche (+12% / -3%).
 */
function gymDelta(value) {
  const isUp = value >= 0;
  return `<span class="delta ${isUp ? "delta--up" : "delta--down"}">${gymIcon(isUp ? "trendUp" : "trendDown")}${isUp ? "+" : ""}${value}%</span>`;
}

/**
 * Carte "programme" utilisée sur la page Programmes.
 */
function gymRenderProgramCard(program) {
  const total = program.sessions.length;
  const done = program.sessions.filter((s) => s.status === "terminee").length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  const progressBlock = total
    ? `<div class="progress-track"><div class="progress-fill" data-progress="${percent}" style="width:0%"></div></div>
       <span class="list-row__meta">${done} séance${done > 1 ? "s" : ""} terminée${done > 1 ? "s" : ""} sur ${total}</span>`
    : `<span class="list-row__meta">Aucune séance ajoutée pour l'instant</span>`;

  return `
    <a class="card card--interactive list-row" href="#" onclick="gymNavigate('programme-detail', {id:'${program.id}'}); return false;" style="align-items:flex-start; flex-direction:column; gap:16px;">
      <div class="list-row" style="width:100%;">
        ${gymThumb(program.icon, "thumb--sm")}
        <div class="list-row__body">
          <span class="list-row__title">${program.name}</span>
          <span class="list-row__meta">${program.sessionsCount} séances · ${program.frequencyPerWeek}x/semaine</span>
        </div>
        <button type="button" class="icon-btn icon-btn--sm" title="Supprimer le programme" onclick="event.preventDefault(); event.stopPropagation(); gymDeleteProgram('${program.id}');">${gymIcon("trash")}</button>
      </div>
      <div style="width:100%; display:flex; flex-direction:column; gap:8px;">
        ${progressBlock}
      </div>
    </a>
  `;
}

/**
 * Ligne de séance dans le détail d'un programme.
 */
function gymRenderSessionRow(session, programId) {
  const isLocked = session.status === "verrouillee";
  const wrapperTag = isLocked ? "div" : "a";
  const hrefAttr = isLocked
    ? ""
    : `href="#" onclick="gymNavigate('seance-active', {session:'${session.id}'}); return false;"`;
  const activeStyle = session.status === "en-cours" ? "border-color: var(--gym-accent-border);" : "";

  return `
    <${wrapperTag} class="card card--interactive list-row" ${hrefAttr} style="${activeStyle}">
      <div class="icon-circle icon-circle--sm" style="background:${session.status === "en-cours" ? "var(--gym-accent)" : "rgba(255,255,255,0.06)"}; color:${session.status === "en-cours" ? "var(--gym-accent-text-on)" : "var(--gym-text)"};">
        <span style="font-weight:800; font-size:13px; color:${session.status === "en-cours" ? "var(--gym-accent-text-on)" : "var(--gym-text)"};">${session.index}</span>
      </div>
      <div class="list-row__body">
        <span class="list-row__title">Séance ${session.index}</span>
        <span class="list-row__meta">${gymFormatDate(session.date)}</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
        <span class="list-row__meta">${gymFormatDuration(session.duration)} · ${session.exerciseIds.length} exercices</span>
        <div style="display:flex; align-items:center; gap:6px;">
          ${gymBadgeSessionStatus(session.status)}
          <button type="button" class="icon-btn icon-btn--sm" title="Supprimer la séance" onclick="event.preventDefault(); event.stopPropagation(); gymDeleteSession('${programId}','${session.id}');">${gymIcon("trash")}</button>
        </div>
      </div>
    </${wrapperTag}>
  `;
}

/**
 * Ligne d'exercice dans le formulaire "Créer une séance" (avec suppression).
 * La suppression passe par un data-attribute + délégation d'événement côté
 * page (plutôt qu'un onclick inline) pour rester compatible avec la vue en
 * module (fonction de suppression scopée à la page, pas globale).
 */
function gymRenderEditableExerciseRow(exerciseId, sets, reps, rowIndex) {
  const exo = gymGetExercise(exerciseId);
  if (!exo) return "";
  return `
    <div class="exercise-row" data-row-index="${rowIndex}">
      ${gymThumb(exo.icon, "thumb--sm")}
      <div class="exercise-row__info">
        <span class="exercise-row__name">${exo.name}</span>
        <span class="badge badge--tag">${exo.muscle}</span>
      </div>
      <button class="icon-btn" aria-label="Supprimer l'exercice" data-remove-index="${rowIndex}">${gymIcon("trash")}</button>
      <div class="exercise-row__stats">
        <div class="exercise-row__stat">
          <label>Séries</label>
          <select class="select-chip" data-field="sets">
            ${[2, 3, 4, 5].map((n) => `<option value="${n}" ${n === sets ? "selected" : ""}>${n}</option>`).join("")}
          </select>
        </div>
        <div class="exercise-row__stat">
          <label>Répétitions</label>
          <select class="select-chip" data-field="reps">
            ${["6-8", "8-10", "10-12", "12-15", "15-20"].map((r) => `<option value="${r}" ${r === reps ? "selected" : ""}>${r}</option>`).join("")}
          </select>
        </div>
      </div>
    </div>
  `;
}

/**
 * Carte "catégorie" pour la page Exercices.
 */
function gymRenderCategoryRow(category) {
  return `
    <a class="card card--interactive list-row" href="#" onclick="gymNavigate('exercices', {filtre:'${category.id}'}); return false;">
      ${gymThumb(category.icon, "thumb--sm")}
      <div class="list-row__body">
        <span class="list-row__title">${category.name}</span>
        <span class="list-row__meta">${category.count} exercices</span>
        <span class="list-row__meta">${category.description}</span>
      </div>
      <span class="list-row__chevron">${gymIcon("chevronRight")}</span>
    </a>
  `;
}

/**
 * Carte "objectif" avec anneau de progression circulaire.
 */
function gymRenderGoalCard(goal) {
  const { circumference, offset } = gymRingProgress(goal.percent, 15.5);
  return `
    <a class="card card--interactive" href="#" onclick="gymNavigate('objectifs'); return false;" style="display:flex; flex-direction:column; gap:12px;">
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="ring">
            <svg viewBox="0 0 40 40">
              <circle class="ring__track" cx="20" cy="20" r="15.5"></circle>
              <circle class="ring__fill" cx="20" cy="20" r="15.5" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}" data-offset="${offset}"></circle>
            </svg>
            <span class="ring__icon">${gymIcon(goal.icon)}</span>
          </div>
          <span class="list-row__title">${goal.title}</span>
        </div>
        <span class="list-row__chevron">${gymIcon("chevronRight")}</span>
      </div>
      <span style="font-size:22px; font-weight:800;" data-counter="${goal.percent}">0%</span>
      <span class="list-row__meta">${goal.progressLabel}</span>
      <div class="progress-track progress-track--thin"><div class="progress-fill" data-progress="${goal.percent}" style="width:0%"></div></div>
      <span class="list-row__meta">${gymIcon("calendar")} Objectif : ${gymFormatDate(goal.deadline)}</span>
    </a>
  `;
}

/**
 * Ligne d'historique groupée par mois.
 */
function gymRenderHistoryRow(entry) {
  const metaLine = entry.duration
    ? `${gymIcon("calendar")} ${gymFormatDate(entry.date)} · ${gymFormatDuration(entry.duration)}`
    : `${gymIcon("calendar")} ${gymFormatDate(entry.date)}`;
  const targetView = entry.type === "programme" ? "programme-detail" : "historique";
  return `
    <a class="card card--interactive list-row" href="#" onclick="gymNavigate('${targetView}'); return false;">
      ${gymThumb(entry.icon, "thumb--sm")}
      <div class="list-row__body">
        <span class="list-row__title">${entry.typeLabel}</span>
        <span class="list-row__meta">${entry.sessionLabel}</span>
        <span class="badge badge--tag" style="width:fit-content; margin-top:2px;">${entry.tag}</span>
        <span class="list-row__meta">${metaLine}</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
        ${gymDelta(entry.delta)}
        <span class="list-row__meta" style="font-size:11.5px;">${entry.deltaLabel}</span>
      </div>
    </a>
  `;
}

/* ==========================================================================
   GYM — Vue : Accueil
   Contenu statique défini directement dans le HTML, aucun rendu JS requis.
   ========================================================================== */

/* ==========================================================================
   GYM — Vue : Programmes
   ========================================================================== */

(function () {
  function renderMyPrograms() {
    const list = document.getElementById("programmes-list");
    list.innerHTML = GYM_DATA.programs.length
      ? GYM_DATA.programs.map((p) => gymRenderProgramCard(p)).join("")
      : `<div class="card" style="text-align:center; color:var(--gym-text-secondary); font-size:14px;">Aucun programme pour l'instant. Crée le premier avec le bouton ci-dessus.</div>`;
    animateProgressBars();
  }

  function renderLibrary() {
    const list = document.getElementById("programmes-list");
    list.innerHTML = GYM_DATA.programLibrary
      .map(
        (tpl) => `
        <a class="card card--interactive list-row" href="#" onclick="gymNavigate('creer-programme', {objectif:'${tpl.goal}'}); return false;">
          ${gymThumb(tpl.icon, "thumb--sm")}
          <div class="list-row__body">
            <span class="list-row__title">${tpl.name}</span>
            <span class="list-row__meta">${tpl.sessionsCount} séances · ${tpl.frequencyPerWeek}x/semaine · ${tpl.level}</span>
            <span class="list-row__meta">${tpl.description}</span>
          </div>
          <span class="list-row__chevron">${gymIcon("chevronRight")}</span>
        </a>
      `
      )
      .join("");
  }

  function animateProgressBars() {
    document.querySelectorAll("#view-programmes .progress-fill[data-progress]").forEach((el) => {
      gymAnimateProgress(el, Number(el.dataset.progress));
    });
  }

  // Liaison unique : les onglets existent dès le chargement du document.
  gymSetupTabs(document.getElementById("programmes-tabs"), (value) => {
    if (value === "bibliotheque") renderLibrary();
    else renderMyPrograms();
  });

  function render() {
    const tabs = document.getElementById("programmes-tabs");
    tabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
    tabs.querySelector('[data-value="mes-programmes"]').classList.add("is-active");
    renderMyPrograms();
  }

  GymViews["programmes"] = { render };
})();

/* ==========================================================================
   GYM — Vue : Détail d'un programme
   ========================================================================== */

(function () {
  function renderHero(program) {
    document.getElementById("program-hero").innerHTML = `
      <div class="hero-photo">
        <div class="hero-photo__silhouette">${gymIcon(program.icon)}</div>
        <div class="hero-photo__content">
          <span class="gym-eyebrow">Programme</span>
          <h1 class="gym-title-xl" style="margin:6px 0 8px;">${program.name}</h1>
          <p class="gym-subtitle">${program.description}</p>
        </div>
      </div>
    `;
  }

  function renderEmptyState() {
    document.getElementById("program-hero").innerHTML = `
      <div class="card" style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:12px; padding:32px 20px;">
        <div class="icon-circle">${gymIcon("dumbbell")}</div>
        <div>
          <p class="list-row__title">Programme introuvable</p>
          <p class="list-row__meta">Il n'existe pas encore de programme à afficher ici.</p>
        </div>
        <a class="btn btn-primary" href="#" onclick="gymNavigate('programmes'); return false;" style="width:auto; padding:12px 22px; font-size:13.5px;">Retour aux programmes</a>
      </div>
    `;
    document.getElementById("program-info-row").innerHTML = "";
    document.getElementById("program-progress-card").innerHTML = "";
    document.getElementById("icon-add-session").innerHTML = "";
    document.getElementById("program-sessions-list").innerHTML = "";
  }

  function renderInfoRow(program) {
    document.getElementById("program-info-row").innerHTML = `
      <div style="display:flex; justify-content:space-between; gap:8px; text-align:center;">
        <div class="summary-item">${gymIcon("dumbbell")}<span class="summary-item__value">${program.sessionsCount} séances</span><span class="summary-item__label">${program.frequencyPerWeek}x/semaine</span></div>
        <div class="summary-item">${gymIcon("target")}<span class="summary-item__value">Objectif</span><span class="summary-item__label">${program.objectiveLabel}</span></div>
        <div class="summary-item">${gymIcon("barChart")}<span class="summary-item__value">Niveau</span><span class="summary-item__label">${program.level}</span></div>
      </div>
    `;
  }

  function renderProgressCard(program) {
    const total = program.sessions.length;
    const done = program.sessions.filter((s) => s.status === "terminee").length;
    const currentSession = program.sessions.find((s) => s.status === "en-cours");
    const percent = total ? Math.round((done / total) * 100) : 0;

    const primaryCta = currentSession
      ? `<button class="btn btn-primary" onclick="gymNavigate('seance-active', {session:'${currentSession.id}'});">${gymIcon("play")} Continuer la séance</button>`
      : `<button class="btn btn-primary" onclick="gymNavigate('creer-seance', {programme:'${program.id}'});">${gymIcon("plus")} Créer ta première séance</button>`;

    document.getElementById("program-progress-card").innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:baseline;">
        <span class="gym-section-title">Progression</span>
        <span class="list-row__meta">${total ? `${done} sur ${total} séances terminées` : "Aucune séance"}</span>
      </div>
      <div class="progress-row">
        <div class="progress-track"><div class="progress-fill" data-progress="${percent}" style="width:0%"></div></div>
        <span class="progress-row__value">${percent}%</span>
      </div>
      ${primaryCta}
      <div class="btn-row">
        <button class="btn btn-secondary" onclick="gymNavigate('programme-detail', {id:'${program.id}'});">${gymIcon("doc")} Voir le programme complet</button>
        <button class="btn btn-secondary" onclick="gymNavigate('creer-programme', {id:'${program.id}'});">${gymIcon("edit")} Modifier le programme</button>
      </div>
      <button class="btn btn-danger" onclick="gymDeleteProgram('${program.id}');">${gymIcon("trash")} Supprimer le programme</button>
    `;
  }

  function renderSessionsList(program) {
    document.getElementById("icon-add-session").innerHTML = gymIcon("plus");
    const container = document.getElementById("program-sessions-list");
    container.innerHTML = program.sessions.length
      ? program.sessions.map((s) => gymRenderSessionRow(s, program.id)).join("")
      : `<div class="card" style="text-align:center; color:var(--gym-text-secondary); font-size:14px;">Tu n'as pas encore ajouté de séance à ce programme.</div>`;
  }

  function animateProgressBars() {
    document.querySelectorAll("#view-programme-detail .progress-fill[data-progress]").forEach((el) => {
      gymAnimateProgress(el, Number(el.dataset.progress));
    });
  }

  function render(params) {
    const program = gymGetProgram(params.id);
    if (!program) {
      renderEmptyState();
      return;
    }
    renderHero(program);
    renderInfoRow(program);
    renderProgressCard(program);
    renderSessionsList(program);
    animateProgressBars();
  }

  GymViews["programme-detail"] = { render };
})();

/* ==========================================================================
   GYM — Vue : Créer un programme
   ========================================================================== */

(function () {
  const state = {
    titre: "",
    goal: "force",
    seances: null,
    duree: null,
  };

  function fillIcons() {
    document.getElementById("cp-hero-icon").innerHTML = gymIcon("dumbbell");
    document.getElementById("icon-field-titre").innerHTML = gymIcon("edit");
    document.getElementById("icon-field-seances").innerHTML = gymIcon("calendar");
    document.getElementById("icon-field-duree").innerHTML = gymIcon("calendar");
    document.getElementById("icon-recap-target").innerHTML = gymIcon("target");
    document.getElementById("icon-recap-1").innerHTML = gymIcon("dumbbell");
    document.getElementById("icon-recap-2").innerHTML = gymIcon("calendar");
    document.getElementById("icon-recap-3").innerHTML = gymIcon("calendar");
  }

  function renderGoalGrid() {
    const grid = document.getElementById("objectif-grid");
    grid.innerHTML = GYM_DATA.trainingGoals
      .map(
        (goal) => `
        <button type="button" class="choice choice--radio ${goal.id === state.goal ? "is-active" : ""}" data-value="${goal.id}">
          ${gymIcon(goal.icon)}
          <span class="choice__label">${goal.label}</span>
          <span class="choice__radio"></span>
        </button>
      `
      )
      .join("");
  }

  function updateRecap() {
    const goal = GYM_DATA.trainingGoals.find((g) => g.id === state.goal);
    document.getElementById("recap-objectif").textContent = goal ? goal.label : "—";
    document.getElementById("recap-seances").textContent = state.seances ? `${state.seances}/semaine` : "—";
    document.getElementById("recap-duree").textContent = state.duree ? `${state.duree} sem.` : "—";
  }

  function onGenerate() {
    if (!state.seances || !state.duree) {
      // Pas de séances/durée renseignées : on met en avant le champ à compléter.
      if (!state.seances) document.getElementById("input-seances").focus();
      else document.getElementById("input-duree").focus();
      return;
    }
    const goal = GYM_DATA.trainingGoals.find((g) => g.id === state.goal);
    const customTitle = state.titre.trim();
    const newProgram = {
      id: `prog-${Date.now()}`,
      name: customTitle || `Programme ${goal ? goal.label : ""}`.trim(),
      goal: state.goal,
      description: "Ton programme personnalisé. Ajoute tes premières séances pour commencer à progresser.",
      sessionsCount: state.seances * state.duree,
      frequencyPerWeek: state.seances,
      level: "Débutant",
      objectiveLabel: goal ? goal.label : "",
      currentIndex: 1,
      icon: goal ? goal.icon : "dumbbell",
      sessions: [],
    };
    GYM_DATA.programs.push(newProgram);
    gymNavigate("programme-detail", { id: newProgram.id });
  }

  gymSetupChoiceGrid(document.getElementById("objectif-grid"), {
    onChange: (value) => {
      state.goal = value;
      updateRecap();
    },
  });
  document.getElementById("input-titre").addEventListener("input", (e) => {
    state.titre = e.target.value;
  });
  document.getElementById("input-seances").addEventListener("input", (e) => {
    state.seances = e.target.value ? Number(e.target.value) : null;
    updateRecap();
  });
  document.getElementById("input-duree").addEventListener("input", (e) => {
    state.duree = e.target.value ? Number(e.target.value) : null;
    updateRecap();
  });
  document.getElementById("btn-generer").addEventListener("click", onGenerate);

  function render(params) {
    state.titre = "";
    state.goal = (params && params.objectif) || "force";
    state.seances = null;
    state.duree = null;
    document.getElementById("input-titre").value = "";
    document.getElementById("input-seances").value = "";
    document.getElementById("input-duree").value = "";

    fillIcons();
    renderGoalGrid();
    updateRecap();
  }

  GymViews["creer-programme"] = { render };
})();

/* ==========================================================================
   GYM — Vue : Créer une séance
   ========================================================================== */

(function () {
  const state = {
    programId: null,
    categories: [],
    goals: [],
    rest: "90s",
    tempo: "2-0-2-0",
    exercises: [],
  };

  function closeIconSvg() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
  }

  function fillIcons() {
    document.getElementById("program-picker-chevron").innerHTML = gymIcon("chevronDown");
    document.getElementById("icon-plus-add").innerHTML = gymIcon("plus");
    document.getElementById("icon-rest").innerHTML = gymIcon("timer");
    document.getElementById("icon-tempo").innerHTML = gymIcon("tempo");
    document.getElementById("tempo-info").innerHTML = gymIcon("info");
    document.getElementById("icon-check-create").innerHTML = gymIcon("check");
    document.getElementById("sheet-close").innerHTML = closeIconSvg();
    document.getElementById("program-sheet-close").innerHTML = closeIconSvg();
    document.getElementById("icon-sheet-search").innerHTML = gymIcon("search");
    document.getElementById("creer-seance-empty-icon").innerHTML = gymIcon("dumbbell");
  }

  /* ---- Étape 1 : sélection du programme (bottom sheet, toujours au premier plan) --- */

  function renderProgramPicker() {
    const program = gymGetProgram(state.programId);
    if (!program) return;
    document.getElementById("program-picker-icon").innerHTML = gymIcon("calendarPlus");
    document.getElementById("program-picker-name").textContent = program.name;
    document.getElementById("program-picker-meta").textContent = `${program.sessionsCount} séances · ${program.frequencyPerWeek} séances / semaine`;
  }

  function openProgramSheet() {
    document.getElementById("program-sheet-body").innerHTML = GYM_DATA.programs
      .map(
        (p) => `
        <button type="button" class="sheet__row" data-program-id="${p.id}">
          <div class="icon-circle icon-circle--sm">${gymIcon(p.icon)}</div>
          <div class="list-row__body">
            <span class="list-row__title">${p.name}</span>
            <span class="list-row__meta">${p.sessionsCount} séances · ${p.frequencyPerWeek}x/semaine</span>
          </div>
          ${p.id === state.programId ? `<span style="color:var(--gym-accent); flex-shrink:0;">${gymIcon("check")}</span>` : ""}
        </button>
      `
      )
      .join("");

    document.querySelectorAll("#program-sheet-body [data-program-id]").forEach((row) => {
      row.addEventListener("click", () => {
        state.programId = row.dataset.programId;
        renderProgramPicker();
        closeProgramSheet();
      });
    });

    document.getElementById("program-sheet-overlay").classList.add("is-open");
    document.getElementById("program-sheet").classList.add("is-open");
  }

  function closeProgramSheet() {
    document.getElementById("program-sheet-overlay").classList.remove("is-open");
    document.getElementById("program-sheet").classList.remove("is-open");
  }

  /* ---- Étape 2 : catégorie (choix multiple) -------------------------------------- */

  function renderCategoryGrid() {
    const grid = document.getElementById("category-grid");
    grid.innerHTML = GYM_DATA.sessionCategories
      .map(
        (cat) => `
        <button type="button" class="choice ${state.categories.includes(cat.id) ? "is-active" : ""}" data-value="${cat.id}">
          ${gymIcon(cat.icon)}
          <span class="choice__label">${cat.label}</span>
        </button>
      `
      )
      .join("");
  }

  /* ---- Étape 3 : objectif (choix multiple) ---------------------------------------- */

  function renderGoalGrid() {
    const grid = document.getElementById("goal-grid");
    grid.innerHTML = GYM_DATA.trainingGoals
      .map(
        (goal) => `
        <button type="button" class="choice ${state.goals.includes(goal.id) ? "is-active" : ""}" data-value="${goal.id}">
          ${gymIcon(goal.icon)}
          <span class="choice__label">${goal.label}</span>
        </button>
      `
      )
      .join("");
  }

  /* ---- Étape 4 : liste des exercices --------------------------------------------- */

  function renderExerciseList() {
    const container = document.getElementById("exercise-list");
    container.innerHTML = state.exercises.length
      ? state.exercises.map((item, index) => gymRenderEditableExerciseRow(item.exerciseId, item.sets, item.reps, index)).join("")
      : `<div class="card" style="text-align:center; color:var(--gym-text-secondary); font-size:14px;">Aucun exercice ajouté pour l'instant.</div>`;

    container.querySelectorAll(".exercise-row").forEach((row) => {
      const index = Number(row.dataset.rowIndex);
      row.querySelector('[data-field="sets"]').addEventListener("change", (e) => {
        state.exercises[index].sets = Number(e.target.value);
      });
      row.querySelector('[data-field="reps"]').addEventListener("change", (e) => {
        state.exercises[index].reps = e.target.value;
      });
      row.querySelector("[data-remove-index]").addEventListener("click", () => {
        state.exercises.splice(index, 1);
        renderExerciseList();
      });
    });
  }

  /* ---- Bottom sheet : ajout d'exercice — recherche manuelle, jamais restreinte --- */

  function renderExerciseSheetList(query) {
    const q = query.trim().toLowerCase();
    const list = q
      ? EXERCISES.filter((e) => e.name.toLowerCase().includes(q) || e.muscle.toLowerCase().includes(q))
      : EXERCISES;

    document.getElementById("sheet-body").innerHTML = list.length
      ? list
          .map(
            (exo) => `
        <button type="button" class="sheet__row" data-exercise-id="${exo.id}">
          ${gymThumb(exo.icon, "thumb--sm")}
          <div class="list-row__body">
            <span class="list-row__title">${exo.name}</span>
            <span class="badge badge--tag">${exo.muscle}</span>
          </div>
          <span class="list-row__chevron" style="color:var(--gym-accent);">${gymIcon("plus")}</span>
        </button>
      `
          )
          .join("")
      : `<div class="card" style="text-align:center; color:var(--gym-text-secondary); font-size:14px;">Aucun exercice ne correspond à ta recherche.</div>`;

    document.querySelectorAll("#sheet-body [data-exercise-id]").forEach((row) => {
      row.addEventListener("click", () => {
        state.exercises.push({ exerciseId: row.dataset.exerciseId, sets: 3, reps: "10-12" });
        renderExerciseList();
        closeExerciseSheet();
      });
    });
  }

  function openExerciseSheet() {
    const searchInput = document.getElementById("sheet-search-input");
    searchInput.value = "";
    renderExerciseSheetList("");
    document.getElementById("sheet-overlay").classList.add("is-open");
    document.getElementById("exercise-sheet").classList.add("is-open");
    searchInput.focus();
  }

  function closeExerciseSheet() {
    document.getElementById("sheet-overlay").classList.remove("is-open");
    document.getElementById("exercise-sheet").classList.remove("is-open");
  }

  /* ---- Étape 5 : repos & tempo ---------------------------------------------------- */

  function renderRestTempoSelects() {
    const restSelect = document.getElementById("select-repos");
    restSelect.innerHTML = GYM_DATA.restOptions
      .map((r) => `<option value="${r.value}" ${r.value === state.rest ? "selected" : ""}>${r.label}</option>`)
      .join("");

    const tempoSelect = document.getElementById("select-tempo");
    tempoSelect.innerHTML = GYM_DATA.tempoOptions
      .map((t) => `<option value="${t}" ${t === state.tempo ? "selected" : ""}>${t}</option>`)
      .join("");
  }

  function toggleTempoInfo() {
    const popover = document.getElementById("tempo-info-popover");
    popover.style.display = popover.style.display === "none" ? "block" : "none";
  }

  /* ---- Validation finale ------------------------------------------------------------ */

  function onCreateSession() {
    const program = gymGetProgram(state.programId);
    if (!program) return;

    const categoryLabels = GYM_DATA.sessionCategories.filter((c) => state.categories.includes(c.id)).map((c) => c.label);
    const goalLabels = GYM_DATA.trainingGoals.filter((g) => state.goals.includes(g.id)).map((g) => g.label);
    const nextIndex = program.sessions.length + 1;

    const newSession = {
      id: `${program.id}-s${nextIndex}`,
      index: nextIndex,
      title: [categoryLabels.join(", "), goalLabels.join(", ")].filter(Boolean).join(" · "),
      date: new Date(),
      duration: 45,
      exerciseIds: state.exercises.map((e) => e.exerciseId),
      exercises: state.exercises.map((e) => ({ exerciseId: e.exerciseId, sets: e.sets, reps: e.reps })),
      rest: state.rest,
      tempo: state.tempo,
      status: nextIndex === 1 ? "en-cours" : "verrouillee",
      goal: state.goals[0] || null,
      focusLabel: goalLabels.join(", "),
      level: program.level,
    };

    program.sessions.push(newSession);
    program.sessionsCount = Math.max(program.sessionsCount, program.sessions.length);
    if (newSession.status === "en-cours") program.currentIndex = newSession.index;

    gymNavigate("programme-detail", { id: program.id });
  }

  // Liaisons statiques (une seule fois, les éléments existent dès le chargement).
  document.getElementById("program-picker-btn").addEventListener("click", openProgramSheet);
  document.getElementById("program-sheet-overlay").addEventListener("click", closeProgramSheet);
  document.getElementById("program-sheet-close").addEventListener("click", closeProgramSheet);
  gymSetupChoiceGrid(document.getElementById("category-grid"), {
    multiple: true,
    onChange: (values) => (state.categories = values),
  });
  gymSetupChoiceGrid(document.getElementById("goal-grid"), {
    multiple: true,
    onChange: (values) => (state.goals = values),
  });
  document.getElementById("btn-add-exercise").addEventListener("click", openExerciseSheet);
  document.getElementById("sheet-overlay").addEventListener("click", closeExerciseSheet);
  document.getElementById("sheet-close").addEventListener("click", closeExerciseSheet);
  document.getElementById("sheet-search-input").addEventListener(
    "input",
    gymDebounce((e) => renderExerciseSheetList(e.target.value), 120)
  );
  document.getElementById("select-repos").addEventListener("change", (e) => (state.rest = e.target.value));
  document.getElementById("select-tempo").addEventListener("change", (e) => (state.tempo = e.target.value));
  document.getElementById("tempo-info").addEventListener("click", toggleTempoInfo);
  document.getElementById("btn-create-session").addEventListener("click", onCreateSession);

  function render(params) {
    fillIcons();

    if (!GYM_DATA.programs.length) {
      document.getElementById("creer-seance-empty").style.display = "flex";
      document.getElementById("creer-seance-form").style.display = "none";
      return;
    }
    document.getElementById("creer-seance-empty").style.display = "none";
    document.getElementById("creer-seance-form").style.display = "flex";

    state.programId = (params && params.programme && gymGetProgram(params.programme) && params.programme) || GYM_DATA.programs[0].id;
    state.categories = [];
    state.goals = [];
    state.rest = "90s";
    state.tempo = "2-0-2-0";
    state.exercises = [];
    document.getElementById("tempo-info-popover").style.display = "none";

    renderProgramPicker();
    renderCategoryGrid();
    renderGoalGrid();
    renderExerciseList();
    renderRestTempoSelects();
  }

  GymViews["creer-seance"] = { render };
})();

/* ==========================================================================
   GYM — Vue : Exercices
   ========================================================================== */

(function () {
  // Certaines catégories (Mobilité, Fonctionnel) ne correspondent à aucun champ
  // unique des exercices : on définit ici une sélection éditoriale cohérente.
  const CATEGORY_EXERCISE_OVERRIDE = {
    mobilite: ["e14", "e17", "e05", "e03"],
    fonctionnel: ["e01", "e06", "e16", "e19", "e10", "e09"],
  };

  const state = {
    region: "tous",
    search: "",
    equipment: "tous",
    activeCategory: null,
  };

  function emptyState(message) {
    return `<div class="card" style="text-align:center; color:var(--gym-text-secondary); font-size:14px;">${message}</div>`;
  }

  function renderCategoriesList() {
    document.getElementById("region-tabs").style.display = "flex";
    let categories = GYM_DATA.categories;

    if (state.region !== "tous") {
      categories = categories.filter((c) => c.regions.includes(state.region));
    }
    if (state.search) {
      categories = categories.filter(
        (c) => c.name.toLowerCase().includes(state.search) || c.description.toLowerCase().includes(state.search)
      );
    }

    const list = document.getElementById("category-list");
    list.innerHTML = categories.length
      ? categories.map((c) => gymRenderCategoryRow(c)).join("")
      : emptyState("Aucune catégorie ne correspond à ta recherche.");
  }

  function renderCategoryDrilldown(categoryId) {
    const category = GYM_DATA.categories.find((c) => c.id === categoryId);
    if (!category) {
      state.activeCategory = null;
      renderView();
      return;
    }

    document.getElementById("region-tabs").style.display = "none";

    let pool;
    if (CATEGORY_EXERCISE_OVERRIDE[categoryId]) {
      pool = CATEGORY_EXERCISE_OVERRIDE[categoryId].map((id) => gymGetExercise(id));
    } else if (categoryId === "avec-materiel" || categoryId === "poids-du-corps") {
      pool = EXERCISES.filter((e) => e.equipment === categoryId);
    } else {
      pool = EXERCISES.filter((e) => e.bodyRegion === categoryId);
    }

    if (state.equipment !== "tous") {
      pool = pool.filter((e) => e.equipment === state.equipment);
    }
    if (state.search) {
      pool = pool.filter(
        (e) => e.name.toLowerCase().includes(state.search) || e.muscle.toLowerCase().includes(state.search)
      );
    }

    const list = document.getElementById("category-list");
    const backRow = `
      <button type="button" class="gym-link" id="back-to-categories" style="margin-bottom:4px;">
        ${gymIcon("back")} Toutes les catégories
      </button>
    `;

    if (!pool.length) {
      list.innerHTML = backRow + emptyState("Aucun exercice ne correspond à ces filtres pour l'instant.");
    } else {
      list.innerHTML =
        backRow +
        `<span class="list-row__meta" style="margin-bottom:-4px;">${category.name} · ${pool.length} exercices</span>` +
        pool
          .map(
            (exo) => `
          <div class="card card--interactive list-row">
            ${gymThumb(exo.icon, "thumb--sm")}
            <div class="list-row__body">
              <span class="list-row__title">${exo.name}</span>
              <span class="badge badge--tag" style="width:fit-content;">${exo.muscle}</span>
            </div>
            <span class="list-row__chevron">${gymIcon("chevronRight")}</span>
          </div>
        `
          )
          .join("");
    }

    document.getElementById("back-to-categories").addEventListener("click", () => {
      state.activeCategory = null;
      renderView();
    });
  }

  function renderView() {
    if (state.activeCategory) renderCategoryDrilldown(state.activeCategory);
    else renderCategoriesList();
  }

  document.getElementById("ex-hero-icon").innerHTML = gymIcon("running");
  document.getElementById("icon-search").innerHTML = gymIcon("search");
  document.getElementById("icon-sliders").innerHTML = gymIcon("sliders");
  document.getElementById("icon-chevron-filter").innerHTML = gymIcon("chevronDown");

  gymSetupTabs(document.getElementById("region-tabs"), (value) => {
    state.region = value;
    renderView();
  });
  gymSetupTabs(document.getElementById("equipment-filter"), (value) => {
    state.equipment = value;
    renderView();
  });
  gymSetupTabs(document.getElementById("level-filter"), () => {
    /* Niveau : filtre illustratif, sans donnée de niveau par exercice. */
  });
  document.getElementById("search-input").addEventListener(
    "input",
    gymDebounce((e) => {
      state.search = e.target.value.trim().toLowerCase();
      renderView();
    }, 150)
  );
  document.getElementById("advanced-filter-toggle").addEventListener("click", (e) => {
    const panel = document.getElementById("advanced-filter-panel");
    const isOpen = panel.style.display === "flex";
    panel.style.display = isOpen ? "none" : "flex";
    e.currentTarget.classList.toggle("is-open", !isOpen);
  });

  function render(params) {
    state.activeCategory = (params && params.filtre) || null;
    state.region = "tous";
    state.search = "";
    state.equipment = "tous";
    document.getElementById("search-input").value = "";

    const regionTabs = document.getElementById("region-tabs");
    regionTabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
    regionTabs.querySelector('[data-value="tous"]').classList.add("is-active");

    const equipmentTabs = document.getElementById("equipment-filter");
    equipmentTabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
    equipmentTabs.querySelector('[data-value="tous"]').classList.add("is-active");

    renderView();
  }

  GymViews["exercices"] = { render };
})();

/* ==========================================================================
   GYM — Vue : Séance active
   ========================================================================== */

(function () {
  const state = {
    program: null,
    session: null,
    exercises: [], // [{ exerciseId, name, repsLabel, restLabel, sets: [{weight, reps, target, valid, status}] }]
    exerciseIndex: 0,
    elapsedMs: 0,
    timerStart: null,
    timerInterval: null,
    isPaused: false,
  };

  /**
   * Déduit une répétition cible à partir d'une chaîne du type "8-12" ou "10"
   * (on retient la borne haute d'une plage saisie à la création).
   */
  function parseRepsTarget(reps) {
    if (typeof reps === "number") return reps;
    const match = String(reps || "").match(/(\d+)(?!.*\d)/);
    return match ? Number(match[1]) : 10;
  }

  /**
   * Construit, pour chaque exercice de la séance, le détail de ses séries
   * (poids/répétitions saisis pendant l'exécution, initialement vides).
   */
  function buildExerciseState(session) {
    return gymGetSessionDetail(session).map((item) => {
      const target = parseRepsTarget(item.reps);
      const setsCount = Math.max(1, Number(item.sets) || 1);
      return {
        exerciseId: item.exerciseId,
        name: item.name,
        repsLabel: item.reps,
        restLabel: item.rest,
        sets: Array.from({ length: setsCount }, (_, i) => ({
          weight: "",
          reps: 0,
          target,
          valid: false,
          status: i === 0 ? "en-cours" : "a-venir",
        })),
      };
    });
  }

  /* ---- Minuteur de séance ---------------------------------------------------- */

  function formatElapsed(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(Math.floor(totalSeconds / 3600))}:${pad(Math.floor((totalSeconds % 3600) / 60))}:${pad(totalSeconds % 60)}`;
  }

  function tickTimer() {
    const elapsed = state.elapsedMs + (state.timerStart ? Date.now() - state.timerStart : 0);
    document.getElementById("session-timer").textContent = formatElapsed(elapsed);
  }

  function stopTimerInterval() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  }

  function startTimer() {
    stopTimerInterval();
    state.timerStart = Date.now();
    state.isPaused = false;
    document.getElementById("icon-session-pause").innerHTML = gymIcon("pause");
    state.timerInterval = setInterval(tickTimer, 1000);
    tickTimer();
  }

  function togglePause() {
    if (state.isPaused) {
      startTimer();
      return;
    }
    state.elapsedMs += state.timerStart ? Date.now() - state.timerStart : 0;
    state.timerStart = null;
    state.isPaused = true;
    stopTimerInterval();
    document.getElementById("icon-session-pause").innerHTML = gymIcon("play");
  }

  document.getElementById("icon-session-timer").innerHTML = gymIcon("clock");
  document.getElementById("btn-toggle-timer").addEventListener("click", togglePause);

  /* ---- En-tête ---------------------------------------------------------------- */

  function renderHead() {
    document.getElementById("session-eyebrow").textContent = `${state.program.name.toUpperCase()} · SÉANCE ${state.session.index}`;

    const backLink = document.getElementById("seance-active-back");
    backLink.onclick = (e) => {
      e.preventDefault();
      gymNavigate("programme-detail", { id: state.program.id });
    };
  }

  function currentExercise() {
    return state.exercises[state.exerciseIndex];
  }

  /* ---- Exercice courant : photo, titre, navigation ----------------------------- */

  function renderExerciseHero() {
    const total = state.exercises.length;
    const exo = currentExercise();
    const exerciseData = gymGetExercise(exo.exerciseId);

    document.getElementById("session-exo-position").textContent = `EXERCICE ${state.exerciseIndex + 1} / ${total}`;
    document.getElementById("session-exercise-title").textContent = exo.name;

    // Photo propre à l'exercice affiché : à renseigner via un champ `image`
    // sur l'exercice correspondant dans EXERCISES. Laissée vide sinon.
    const media = document.getElementById("session-exercise-media");
    media.style.backgroundImage = exerciseData && exerciseData.image ? `url('${exerciseData.image}')` : "none";
    media.style.backgroundSize = "cover";
    media.style.backgroundPosition = "center";

    document.getElementById("btn-prev-exercise").disabled = state.exerciseIndex === 0;
    document.getElementById("btn-next-exercise").disabled = state.exerciseIndex === total - 1;
  }

  function goToExercise(index) {
    if (index < 0 || index >= state.exercises.length) return;
    state.exerciseIndex = index;
    renderExerciseHero();
    renderSummary();
    renderSetsList();
  }

  document.getElementById("btn-prev-exercise").addEventListener("click", () => goToExercise(state.exerciseIndex - 1));
  document.getElementById("btn-next-exercise").addEventListener("click", () => goToExercise(state.exerciseIndex + 1));

  /* ---- Résumé séries / répétitions / repos -------------------------------------- */

  function renderSummary() {
    const exo = currentExercise();
    const validCount = exo.sets.filter((s) => s.valid).length;
    document.getElementById("session-info-row").innerHTML = `
      <div class="session-summary__item">
        <span class="session-summary__icon">${gymIcon("layers")}</span>
        <span class="session-summary__text">
          <span class="session-summary__label">Séries</span>
          <span class="session-summary__value">${validCount} / ${exo.sets.length}</span>
        </span>
      </div>
      <div class="session-summary__item">
        <span class="session-summary__icon">${gymIcon("dumbbell")}</span>
        <span class="session-summary__text">
          <span class="session-summary__label">Répétitions</span>
          <span class="session-summary__value">${exo.repsLabel}</span>
        </span>
      </div>
      <div class="session-summary__item">
        <span class="session-summary__icon">${gymIcon("clock")}</span>
        <span class="session-summary__text">
          <span class="session-summary__label">Temps de repos</span>
          <span class="session-summary__value">${exo.restLabel}</span>
        </span>
      </div>
    `;
  }

  /* ---- Liste des séries --------------------------------------------------------- */

  function statusBadge(status) {
    if (status === "terminee") return `${gymIcon("checkCircle")} Terminée`;
    if (status === "en-cours") return `${gymIcon("timer")} En cours`;
    return `${gymIcon("timer")} À venir`;
  }

  function updateNextButtonLabel() {
    const exo = currentExercise();
    const exerciseComplete = !exo.sets.some((s) => s.status === "en-cours");
    const isLastExercise = state.exerciseIndex === state.exercises.length - 1;
    document.getElementById("session-next-label").textContent = exerciseComplete && isLastExercise ? "Terminer la séance" : "Série suivante";
  }

  function renderSetsList() {
    const exo = currentExercise();
    const list = document.getElementById("session-sets-list");

    list.innerHTML = exo.sets
      .map((set, index) => {
        const stateClass = set.status === "terminee" ? "is-terminee" : set.status === "en-cours" ? "is-en-cours" : "is-a-venir";
        return `
      <div class="set-card ${stateClass}">
        <div class="set-card__top">
          <span class="set-card__number">${index + 1}</span>
          <span class="set-card__label">Série ${index + 1}</span>
          <span class="set-card__status">${statusBadge(set.status)}</span>
        </div>
        <div class="set-card__body">
          <div class="set-card__field set-card__field--weight">
            <span class="set-card__field-label">Poids</span>
            <div class="set-card__weight-row">
              <input type="number" inputmode="decimal" class="set-card__weight-input" placeholder="—" value="${set.weight}" data-set-index="${index}" data-field="weight" />
              <span class="set-card__unit">kg</span>
              <span class="set-card__valid-dot">${set.valid ? gymIcon("checkCircle") : gymIcon("timer")}</span>
            </div>
          </div>
          <div class="set-card__field set-card__field--reps">
            <span class="set-card__field-label">Répétitions</span>
            <div class="set-card__reps-row">
              <input type="number" class="set-card__reps-input" value="${set.reps}" data-set-index="${index}" data-field="reps" />
              <span class="set-card__reps-target">/ ${set.target}</span>
            </div>
          </div>
          <button type="button" class="set-card__validate ${set.valid ? "is-valid" : ""}" data-set-index="${index}">
            ${set.valid ? gymIcon("check") : gymIcon("timer")} ${set.valid ? "Série validée" : "À compléter"}
          </button>
        </div>
      </div>
    `;
      })
      .join("");

    list.querySelectorAll('[data-field="weight"]').forEach((input) => {
      input.addEventListener("input", (e) => {
        exo.sets[Number(e.target.dataset.setIndex)].weight = e.target.value;
      });
    });
    list.querySelectorAll('[data-field="reps"]').forEach((input) => {
      input.addEventListener("input", (e) => {
        exo.sets[Number(e.target.dataset.setIndex)].reps = Number(e.target.value) || 0;
      });
    });
    list.querySelectorAll(".set-card__validate").forEach((btn) => {
      btn.addEventListener("click", () => toggleSetValid(Number(btn.dataset.setIndex)));
    });

    updateNextButtonLabel();
  }

  /**
   * Coche/décoche manuellement une série (bouton "Série validée"/"À compléter").
   */
  function toggleSetValid(index) {
    const exo = currentExercise();
    const set = exo.sets[index];
    set.valid = !set.valid;

    if (set.valid) {
      set.status = "terminee";
      if (!set.reps) set.reps = set.target;
      const next = exo.sets[index + 1];
      if (next && next.status === "a-venir") next.status = "en-cours";
    } else {
      set.status = index === 0 || exo.sets[index - 1].valid ? "en-cours" : "a-venir";
      const next = exo.sets[index + 1];
      if (next && !next.valid) next.status = "a-venir";
    }

    renderSetsList();
    renderSummary();
    updateOverallProgress();
  }

  function updateOverallProgress() {
    const totalSets = state.exercises.reduce((sum, e) => sum + e.sets.length, 0);
    const validSets = state.exercises.reduce((sum, e) => sum + e.sets.filter((s) => s.valid).length, 0);
    const percent = totalSets ? Math.round((validSets / totalSets) * 100) : 0;
    gymAnimateProgress(document.getElementById("session-progress-fill"), percent);
  }

  /* ---- Actions basses : série suivante / terminer la séance ---------------------- */

  /**
   * Valide la série en cours et passe à la suivante ; enchaîne sur
   * l'exercice suivant une fois toutes les séries validées, ou termine la
   * séance si c'était le dernier exercice.
   */
  function goToNextSeries() {
    const exo = currentExercise();
    const current = exo.sets.find((s) => s.status === "en-cours");

    if (current) {
      const index = exo.sets.indexOf(current);
      current.valid = true;
      current.status = "terminee";
      if (!current.reps) current.reps = current.target;
      const next = exo.sets[index + 1];
      if (next) {
        next.status = "en-cours";
        renderExerciseHero();
        renderSummary();
        renderSetsList();
        updateOverallProgress();
        return;
      }
    }

    if (state.exerciseIndex < state.exercises.length - 1) {
      goToExercise(state.exerciseIndex + 1);
      updateOverallProgress();
      return;
    }

    finalizeSession();
  }

  /**
   * Marque la séance comme terminée dans les données, déverrouille la
   * séance suivante du programme (si elle existe) et revient au détail
   * du programme pour voir la progression mise à jour.
   */
  function finalizeSession() {
    if (!state.session || !state.program) return;
    stopTimerInterval();
    state.session.status = "terminee";
    const next = state.program.sessions.find((s) => s.index === state.session.index + 1);
    if (next && next.status === "verrouillee") {
      next.status = "en-cours";
      state.program.currentIndex = next.index;
    }
    gymNavigate("programme-detail", { id: state.program.id });
  }

  document.getElementById("btn-next-series").addEventListener("click", goToNextSeries);

  document.getElementById("btn-finish-session").addEventListener("click", () => {
    const totalSets = state.exercises.reduce((sum, e) => sum + e.sets.length, 0);
    const validSets = state.exercises.reduce((sum, e) => sum + e.sets.filter((s) => s.valid).length, 0);
    if (validSets < totalSets && !confirm("Il reste des séries non validées. Terminer la séance maintenant ?")) return;
    finalizeSession();
  });

  /* ---- États vide / actif -------------------------------------------------------- */

  function renderEmptyState() {
    stopTimerInterval();
    state.program = null;
    state.session = null;
    state.exercises = [];

    document.getElementById("session-eyebrow").textContent = "";
    document.getElementById("session-empty").style.display = "flex";
    document.getElementById("session-content").style.display = "none";
    document.getElementById("session-actions").style.display = "none";
    document.getElementById("session-timer").textContent = "00:00:00";
    document.getElementById("session-progress-fill").style.width = "0%";

    const backLink = document.getElementById("seance-active-back");
    backLink.onclick = (e) => {
      e.preventDefault();
      gymNavigate("gym-home");
    };
  }

  function render(params) {
    const sessionId = params && params.session;
    const found = sessionId ? gymFindSessionById(sessionId) : { program: null, session: null };

    if (!found.program || !found.session) {
      renderEmptyState();
      return;
    }

    const { program, session } = found;
    state.program = program;
    state.session = session;
    state.exercises = buildExerciseState(session);
    state.exerciseIndex = 0;
    state.elapsedMs = 0;

    document.getElementById("session-empty").style.display = "none";
    document.getElementById("session-content").style.display = "flex";
    document.getElementById("session-actions").style.display = "flex";

    renderHead();
    renderExerciseHero();
    renderSummary();
    renderSetsList();
    updateOverallProgress();
    startTimer();
  }

  GymViews["seance-active"] = { render };
})();

/* ==========================================================================
   GYM — Vue : Progression
   ========================================================================== */
(function () {
  function fillIcons() {
    document.getElementById("progression-empty-icon").innerHTML = gymIcon("trendUp");
  }

  function render() {
    fillIcons();
  }

  GymViews["progression"] = { render };
})();

/* ==========================================================================
   GYM — Vue : Historique
   ========================================================================== */

(function () {
  const state = {
    filter: "tous",
    pageSize: 6,
    visibleCount: 6,
  };

  function getFilteredEntries() {
    if (state.filter === "tous") return GYM_DATA.history;
    return GYM_DATA.history.filter((e) => e.type === state.filter);
  }

  function renderList() {
    const all = getFilteredEntries();
    const visible = all.slice(0, state.visibleCount);
    const groups = gymGroupHistoryByMonth(visible);
    const container = document.getElementById("history-groups");

    if (!visible.length) {
      container.innerHTML = `<div class="card" style="text-align:center; color:var(--gym-text-secondary); font-size:14px;">Aucune séance dans cette catégorie pour le moment.</div>`;
    } else {
      container.innerHTML = groups
        .map(
          (group) => `
          <div class="month-group">
            <span class="month-group__label">${group.label}</span>
            <div class="gym-stagger" style="display:flex; flex-direction:column; gap:12px;">
              ${group.items.map((entry) => gymRenderHistoryRow(entry)).join("")}
            </div>
          </div>
        `
        )
        .join("");
    }

    document.getElementById("load-more-btn").style.display = visible.length < all.length ? "flex" : "none";
  }

  function loadMore() {
    const skeleton = document.getElementById("history-skeleton");
    const btn = document.getElementById("load-more-btn");
    skeleton.style.display = "flex";
    btn.style.display = "none";

    // Chargement progressif simulé : un court délai avant de révéler la suite.
    setTimeout(() => {
      skeleton.style.display = "none";
      state.visibleCount += state.pageSize;
      renderList();
    }, 550);
  }

  document.getElementById("icon-doc-more").innerHTML = gymIcon("doc");
  document.getElementById("icon-chevron-more").innerHTML = gymIcon("chevronDown");
  gymSetupTabs(document.getElementById("history-tabs"), (value) => {
    state.filter = value;
    state.visibleCount = state.pageSize;
    renderList();
  });
  document.getElementById("load-more-btn").addEventListener("click", loadMore);

  function render() {
    state.filter = "tous";
    state.visibleCount = state.pageSize;
    const tabs = document.getElementById("history-tabs");
    tabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
    tabs.querySelector('[data-value="tous"]').classList.add("is-active");
    renderList();
  }

  GymViews["historique"] = { render };
})();

/* ==========================================================================
   GYM — Vue : Objectifs
   ========================================================================== */

(function () {
  const GOAL_TYPES = [
    { id: "poids", label: "Perdre du poids", icon: "dumbbell" },
    { id: "muscle", label: "Gagner en muscle", icon: "muscle" },
    { id: "endurance", label: "Endurance", icon: "running" },
    { id: "sante", label: "Santé", icon: "heart" },
    { id: "performance", label: "Performance", icon: "barChart" },
    { id: "bienetre", label: "Bien-être", icon: "star" },
  ];

  const state = {
    goals: [...GYM_DATA.goals],
    newGoalType: GOAL_TYPES[0].id,
  };

  function closeIconSvg() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
  }

  function fillIcons() {
    document.getElementById("hero-target-icon").innerHTML = gymIcon("target");
    document.getElementById("hero-photo-icon").innerHTML = gymIcon("star");
    document.getElementById("icon-voir-tous").innerHTML = gymIcon("chevronRight");
    document.getElementById("icon-plus-goal").innerHTML = gymIcon("plus");
    document.getElementById("icon-goal-title").innerHTML = gymIcon("edit");
    document.getElementById("icon-goal-target").innerHTML = gymIcon("target");
    document.getElementById("goal-sheet-close").innerHTML = closeIconSvg();
  }

  function renderGoals() {
    const grid = document.getElementById("objectifs-grid");

    if (!state.goals.length) {
      grid.innerHTML = `
        <div class="card" style="grid-column: 1 / -1; text-align:center; color:var(--gym-text-secondary); font-size:14px;">
          Tu n'as pas encore défini d'objectif.
        </div>
      `;
      return;
    }

    grid.innerHTML = state.goals.map((goal) => gymRenderGoalCard(goal)).join("");

    // Animation : anneaux, compteurs et barres de progression.
    grid.querySelectorAll(".ring__fill[data-offset]").forEach((circle) => {
      const target = Number(circle.dataset.offset);
      circle.style.transition = "none";
      circle.style.strokeDashoffset = circle.getAttribute("stroke-dasharray");
      requestAnimationFrame(() => {
        circle.style.transition = `stroke-dashoffset 900ms var(--gym-ease)`;
        circle.style.strokeDashoffset = `${target}`;
      });
    });
    grid.querySelectorAll("[data-counter]").forEach((el) => {
      gymAnimateCounter(el, Number(el.dataset.counter), { formatFn: (v) => `${v}%` });
    });
    grid.querySelectorAll(".progress-fill[data-progress]").forEach((el) => {
      gymAnimateProgress(el, Number(el.dataset.progress));
    });
  }

  function renderHowto() {
    const steps = [
      { icon: "target", label: "1. Choisissez votre objectif" },
      { icon: "sliders", label: "2. Configurez vos critères" },
      { icon: "barChart", label: "3. Suivez vos progrès" },
      { icon: "star", label: "4. Atteignez vos résultats" },
    ];

    document.getElementById("howto-steps").innerHTML = steps
      .map(
        (step, index) => `
        <div class="howto__step">
          <div class="icon-circle icon-circle--sm">${gymIcon(step.icon)}</div>
          <span>${step.label}</span>
        </div>
        ${index < steps.length - 1 ? `<span class="howto__arrow">${gymIcon("chevronRight")}</span>` : ""}
      `
      )
      .join("");
  }

  function renderGoalTypeGrid() {
    const grid = document.getElementById("goal-type-grid");
    grid.innerHTML = GOAL_TYPES.map(
      (type) => `
        <button type="button" class="choice ${type.id === state.newGoalType ? "is-active" : ""}" data-value="${type.id}">
          ${gymIcon(type.icon)}
          <span class="choice__label">${type.label}</span>
        </button>
      `
    ).join("");
  }

  function openGoalSheet() {
    document.getElementById("goal-sheet-overlay").classList.add("is-open");
    document.getElementById("goal-sheet").classList.add("is-open");
  }

  function closeGoalSheet() {
    document.getElementById("goal-sheet-overlay").classList.remove("is-open");
    document.getElementById("goal-sheet").classList.remove("is-open");
  }

  function createGoal() {
    const titleInput = document.getElementById("goal-title-input");
    const progressInput = document.getElementById("goal-progress-input");
    const type = GOAL_TYPES.find((t) => t.id === state.newGoalType);

    const title = titleInput.value.trim() || type.label;
    const progressLabel = progressInput.value.trim() || "0%";

    state.goals.unshift({
      id: `g-new-${Date.now()}`,
      title,
      icon: type.icon,
      percent: 5,
      progressLabel,
      deadline: gymAddDays(GYM_DATA.today, 30),
    });

    renderGoals();
    closeGoalSheet();
    titleInput.value = "";
    progressInput.value = "";
  }

  gymSetupChoiceGrid(document.getElementById("goal-type-grid"), {
    onChange: (value) => {
      state.newGoalType = value;
    },
  });
  document.getElementById("btn-new-goal").addEventListener("click", openGoalSheet);
  document.getElementById("goal-sheet-overlay").addEventListener("click", closeGoalSheet);
  document.getElementById("goal-sheet-close").addEventListener("click", closeGoalSheet);
  document.getElementById("btn-create-goal").addEventListener("click", createGoal);

  function render() {
    fillIcons();
    renderGoals();
    renderHowto();
    renderGoalTypeGrid();
  }

  GymViews["objectifs"] = { render };
})();

/* ==========================================================================
   GYM — Démarrage de l'application
   ========================================================================== */

(function () {
  const initialView = (location.hash || "#gym-home").replace("#", "") || "gym-home";
  const resolvedView = GymViews[initialView] ? initialView : "gym-home";
  gymActivateView(resolvedView, {});
  history.replaceState({ view: resolvedView, params: {} }, "", `#${resolvedView}`);
})();
