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
    firstName = JSON.parse(localStorage.getItem("golfAppState"))?.userProfile?.firstName ?? "";
  } catch (e) {
    console.error("Erreur de lecture du localStorage", e);
  }
  el.textContent = firstName;
}

// Expose la fonction pour que le menu puisse la rappeler après saisie
window.renderHomeGreeting = renderHomeGreeting;

document.addEventListener("DOMContentLoaded", () => {
  applyBackground();
  renderHomeGreeting();
  // Le panneau du bas (objectif + dernière séance) est rempli par renderGolfHome() dans putting.js

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
