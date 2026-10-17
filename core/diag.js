/* ===========================================================================
   DIAGNOSTIC TEMPORAIRE — à supprimer une fois le vide de l'accueil résolu
   (retirer ce fichier et sa balise <script> dans index.html).
   Appui long (1,2 s) dans le coin haut gauche de n'importe quelle page : affiche les mesures
   du viewport et quatre repères colorés en bas de l'écran. Un nouvel appui long le masque.
   =========================================================================== */
(function () {
  let panel = null;
  let marks = [];
  let timer = null;
  let refresher = null;

  const probe = (css) => {
    const el = document.createElement("div");
    el.style.cssText = "position:fixed;left:0;top:0;width:1px;visibility:hidden;pointer-events:none;" + css;
    document.body.appendChild(el);
    const h = el.getBoundingClientRect().height;
    el.remove();
    return Math.round(h);
  };
  const safe = (side) => {
    const el = document.createElement("div");
    el.style.cssText = "position:fixed;left:0;top:0;visibility:hidden;padding-" + side + ":env(safe-area-inset-" + side + ",0px)";
    document.body.appendChild(el);
    const v = parseFloat(getComputedStyle(el)["padding" + side[0].toUpperCase() + side.slice(1)]) || 0;
    el.remove();
    return Math.round(v);
  };
  const rect = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return "absent";
    const r = el.getBoundingClientRect();
    return "top " + Math.round(r.top) + " / bas " + Math.round(r.bottom) + " / h " + Math.round(r.height);
  };
  const mark = (css, color) => {
    const el = document.createElement("div");
    el.style.cssText = "position:fixed;height:6px;pointer-events:none;z-index:100000;background:" + color + ";" + css;
    document.body.appendChild(el);
    marks.push(el);
  };

  function render() {
    if (!panel) return;
    const vv = window.visualViewport;
    const home = document.getElementById("page-home");
    const lines = [
      "DIAGNOSTIC (appui long coin haut gauche pour fermer)",
      "CSS accueil : " + ((document.querySelector('link[href*="HomePage.css"]') || {}).href || "?").split("/").pop(),
      "JS accueil : " + ((document.querySelector('script[src*="HomePage.js"]') || {}).src || "?").split("/").pop(),
      "mode installé : " + (window.matchMedia("(display-mode: standalone)").matches ? "oui" : "non") + " / navigator.standalone : " + String(window.navigator.standalone),
      "innerWidth x innerHeight : " + innerWidth + " x " + innerHeight,
      "outerHeight : " + outerHeight,
      "screen : " + screen.width + " x " + screen.height + " (avail " + screen.availHeight + ")",
      "visualViewport : " + (vv ? Math.round(vv.width) + " x " + Math.round(vv.height) + " (offsetTop " + Math.round(vv.offsetTop) + ")" : "absent"),
      "html.clientHeight : " + document.documentElement.clientHeight + " / body.clientHeight : " + document.body.clientHeight,
      "sonde fixed : 100vh " + probe("height:100vh") + " / 100svh " + probe("height:100svh") + " / 100lvh " + probe("height:100lvh") + " / 100dvh " + probe("height:100dvh"),
      "zones de sécurité haut/bas : " + safe("top") + " / " + safe("bottom"),
      "html.className : " + (document.documentElement.className || "(vide)"),
      "--home-viewport-gap : " + (home ? getComputedStyle(home).getPropertyValue("--home-viewport-gap") || "(vide)" : "n/a"),
      "wrapper : " + rect("#page-home .page-wrapper"),
      "photo : " + rect("#page-home .home-screen_component"),
      "panneau : " + rect("#page-home .bottom-panel_wrapper"),
      "repères en bas : rouge = bottom:0 / bleu = 100vh / vert = 100lvh / jaune = screen.height"
    ];
    panel.textContent = lines.join("\n");
  }

  function show() {
    panel = document.createElement("pre");
    panel.style.cssText = "position:fixed;left:8px;right:8px;top:calc(env(safe-area-inset-top,0px) + 60px);z-index:100001;margin:0;padding:10px;" +
      "background:rgba(0,0,0,.88);color:#b8ff3d;font:11px/1.35 ui-monospace,Menlo,monospace;white-space:pre-wrap;border-radius:10px;pointer-events:none;";
    document.body.appendChild(panel);
    mark("bottom:0;left:0;width:30%", "#ff2d2d");
    mark("top:calc(100vh - 6px);left:30%;width:30%", "#2d7dff");
    mark("top:calc(100lvh - 6px);left:60%;width:20%", "#2dff6a");
    mark("top:" + (screen.height - 6) + "px;left:80%;width:20%", "#ffe92d");
    render();
    refresher = setInterval(render, 1000);
  }
  function hide() {
    clearInterval(refresher);
    if (panel) panel.remove();
    marks.forEach((m) => m.remove());
    panel = null;
    marks = [];
  }

  let startX = 0, startY = 0;
  document.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    if (e.touches.length !== 1 || t.clientX > 110 || t.clientY > 140) return;
    startX = t.clientX; startY = t.clientY;
    clearTimeout(timer);
    timer = setTimeout(() => (panel ? hide() : show()), 1200);
  }, { passive: true });
  // Un léger tremblement du doigt n'annule pas l'appui long ; un vrai déplacement, si
  document.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (Math.abs(t.clientX - startX) > 15 || Math.abs(t.clientY - startY) > 15) clearTimeout(timer);
  }, { passive: true });
  ["touchend", "touchcancel"].forEach((n) => document.addEventListener(n, () => clearTimeout(timer), { passive: true }));
})();
