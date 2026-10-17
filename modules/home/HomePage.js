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

// Accueil : écran fixe, sans défilement ni rebond. La classe html.home-locked n'existe que tant que
// #page-home est affichée (le module la retire lui-même en la quittant, voir HomePage.css).
(function () {
  const page = document.getElementById("page-home");
  if (!page) return;
  // Appli installée sur iPhone : le viewport de mise en page (innerHeight, 100dvh, bas d'un élément fixed) peut être
  // plus court que l'écran de la hauteur de la zone de sécurité haute (50 pt sur iPhone mini) : un vide noir restait
  // en bas de l'accueil. On mesure cet écart et on l'ajoute à la hauteur de l'accueil (--home-viewport-gap).
  const syncHomeViewportGap = () => {
    const standalone = (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
    const gap = Math.round((window.screen ? window.screen.height : 0) - window.innerHeight);
    const usable = standalone && window.innerWidth <= 600 && window.innerHeight > window.innerWidth && gap > 0 && gap <= 120;
    page.style.setProperty("--home-viewport-gap", usable ? gap + "px" : "0px");
  };
  const syncHomeLock = () => {
    document.documentElement.classList.toggle("home-locked", page.classList.contains("active"));
    syncHomeViewportGap();
  };
  new MutationObserver(syncHomeLock).observe(page, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("resize", syncHomeViewportGap);
  window.addEventListener("orientationchange", syncHomeViewportGap);
  syncHomeLock();
})();

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
