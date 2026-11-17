// Retourne le nom du fichier de fond selon l'heure de l'appareil
function getBackgroundByHour() {
  const hour = new Date().getHours();
  if (hour >= 7 && hour < 11) return "images/FondEcranHomePageMatin.webp";
  if (hour >= 11 && hour < 17) return "images/FondEcranHomePageMidi.webp";
  if (hour >= 17 && hour < 21) return "images/FondEcranHomePageSoir.webp";
  return "images/FondEcranHomePageNuit.webp";
}

// Applique le fond correspondant sur le composant principal
function applyBackground() {
  const el = document.querySelector("#page-home .home-screen_component");
  if (!el) return;
  el.style.backgroundImage = `url("${getBackgroundByHour()}")`;
}

// Affiche le prénom enregistré dans le menu (localStorage) dans le titre d'accueil
function renderHomeGreeting() {
  const el = document.querySelector("#page-home [data-user-firstname], #page-home .header_title-highlight");
  if (!el) return;
  let firstName = "";
  try {
    // Même clé que STORAGE_KEY dans menu.js
    firstName = JSON.parse(localStorage.getItem("golfevolution_app_state"))?.userProfile?.firstName ?? "";
  } catch (e) {
    console.error("Erreur de lecture du localStorage", e);
  }
  el.textContent = firstName;
}

// Expose la fonction pour que le menu puisse la rappeler après saisie
window.renderHomeGreeting = renderHomeGreeting;

// Accueil : écran fixe, sans défilement ni rebond. La classe html.home-locked n'existe que tant que
// #page-home est affichée (le module la retire lui-même en la quittant, voir HomePage.css).
(function () {
  const page = document.getElementById("page-home");
  if (!page) return;
  const syncHomeLock = () => {
    document.documentElement.classList.toggle("home-locked", page.classList.contains("active"));
  };
  new MutationObserver(syncHomeLock).observe(page, { attributes: true, attributeFilter: ["class"] });
  syncHomeLock();
})();

// Appui sur « Objectif semaine » : feuille de choix des modules dont les séances comptent dans l'objectif
function openGoalModulesSheet() {
  if (typeof appSheet !== "function" || !window.GOLF_GOAL_MODULES) return;
  const selected = new Set(window.golfGoalModules());
  const note = { type: "note", text: "" };
  const items = window.GOLF_GOAL_MODULES.map((m) => ({
    type: "check",
    label: m.label,
    hint: m.hint,
    value: selected.has(m.id),
    onChange(next) {
      // Au moins un module reste coché : sans module, l'objectif ne pourrait jamais avancer
      if (!next && selected.size === 1) {
        note.text = "Garde au moins un module coché.";
        return false;
      }
      note.text = "";
      if (next) selected.add(m.id); else selected.delete(m.id);
      window.setGolfGoalModules(Array.from(selected));
      return true;
    },
  }));
  appSheet({
    title: "Séances comptées",
    info: "Choisis les modules dont les séances comptent dans « Objectif semaine ». Un module décoché n'ajoute rien à l'objectif. « Dernière séance » continue d'afficher l'activité de tous les modules.",
    sections: [{ title: "Modules pris en compte", items: items.concat([note]) }],
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyBackground();
  const goalColumn = document.querySelector("#page-home .bottom-panel_column.is-goal");
  if (goalColumn) {
    goalColumn.addEventListener("click", openGoalModulesSheet);
    goalColumn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGoalModulesSheet(); }
    });
  }
  renderHomeGreeting();
  // Le panneau du bas (objectif + dernière séance) est calculé par renderGolfHome() dans putting.js.
  // Appel ici : tous les scripts (menu.js compris) sont chargés, donc l'objectif réglé dans le Menu est connu.
  if (typeof renderGolfHome === "function") renderGolfHome();

  // Retour visuel au toucher/clic sur les éléments interactifs
  document.querySelectorAll("#page-home .orbit-button, #page-home .profile_button").forEach((el) => {
    el.addEventListener("pointerdown", () => el.classList.add("is-pressed"));
    ["pointerup", "pointerleave", "pointercancel"].forEach((type) =>
      el.addEventListener(type, () => el.classList.remove("is-pressed"))
    );
  });
});

// Appli restée ouverte en arrière-plan : le fond doit suivre l'heure au retour
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) applyBackground();
});
