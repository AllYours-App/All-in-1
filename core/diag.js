/* ===========================================================================
   DIAGNOSTIC TEMPORAIRE — à supprimer une fois le vide de l'accueil résolu
   (retirer ce fichier et sa balise <script> dans index.html).
   Appui long (1,2 s) dans le coin haut gauche de n'importe quelle page : affiche les mesures
   du viewport et quatre repères colorés en bas de l'écran. Un nouvel appui long le masque.
   =========================================================================== */
(function () {
  let panel = null;
  let output = null;
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
    if (!output) return;
    const vv = window.visualViewport;
    const home = document.getElementById("page-home");
    const lines = [
      "DIAGNOSTIC (appui long coin haut gauche pour fermer, ça remet tout en état)",
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
      "meta viewport : " + ((document.querySelector('meta[name="viewport"]') || {}).content || "?"),
      "modes d'affichage : " + ["standalone", "fullscreen", "minimal-ui", "browser"].filter((m) => window.matchMedia("(display-mode: " + m + ")").matches).join(", "),
      "scrollY : " + Math.round(window.scrollY) + " / scrollHeight : " + document.documentElement.scrollHeight,
      "dernier essai : " + lastAction,
      "html.className : " + (document.documentElement.className || "(vide)"),
      "--home-viewport-gap : " + (home ? getComputedStyle(home).getPropertyValue("--home-viewport-gap") || "(vide)" : "n/a"),
      "wrapper : " + rect("#page-home .page-wrapper"),
      "photo : " + rect("#page-home .home-screen_component"),
      "panneau : " + rect("#page-home .bottom-panel_wrapper"),
      "repères en bas : rouge = bottom:0 / bleu = 100vh / vert = 100lvh / jaune = screen.height",
      "--- journal depuis le chargement (ih = innerHeight, vv = visualViewport, sy = scrollY) ---"
    ].concat(window.__diagLog && window.__diagLog.length ? window.__diagLog.slice(-16) : ["(aucun journal : index.html pas à jour)"]);
    output.textContent = lines.join("\n");
  }

  const VIEWPORT_ORIGINAL = (document.querySelector('meta[name="viewport"]') || {}).content || "";
  let lastAction = "aucun essai";
  const setViewport = (content) => {
    const m = document.querySelector('meta[name="viewport"]');
    if (m) m.setAttribute("content", content);
  };
  const resetAll = () => {
    setViewport(VIEWPORT_ORIGINAL);
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.height = "";
    const home = document.getElementById("page-home");
    document.documentElement.classList.toggle("home-locked", !!(home && home.classList.contains("active")));
  };
  const EXPERIMENTS = [
    ["Viewport sans scale", () => setViewport("width=device-width, initial-scale=1, viewport-fit=cover")],
    ["Viewport sans cover", () => setViewport("width=device-width, initial-scale=1")],
    ["Viewport minimal", () => setViewport("width=device-width")],
    ["Scroll libre", () => {
      document.documentElement.classList.remove("home-locked");
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    }],
    ["Tout remettre", () => resetAll()]
  ];

  function show() {
    panel = document.createElement("div");
    panel.style.cssText = "position:fixed;left:8px;right:8px;top:calc(env(safe-area-inset-top,0px) + 60px);z-index:100001;" +
      "background:rgba(0,0,0,.9);border-radius:10px;padding:10px;max-height:calc(100vh - 150px);overflow-y:auto;-webkit-overflow-scrolling:touch;";
    output = document.createElement("pre");
    output.style.cssText = "margin:0 0 8px;color:#b8ff3d;font:11px/1.35 ui-monospace,Menlo,monospace;white-space:pre-wrap;pointer-events:none;";
    panel.appendChild(output);
    const row = document.createElement("div");
    row.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;";
    EXPERIMENTS.forEach(([label, fn]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.style.cssText = "font:12px -apple-system,sans-serif;padding:8px 10px;border-radius:8px;border:1px solid #b8ff3d;background:#14210a;color:#fff;";
      b.addEventListener("click", () => {
        lastAction = label;
        fn();
        setTimeout(render, 150);
        setTimeout(render, 700);
      });
      row.appendChild(b);
    });
    panel.appendChild(row);
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
    resetAll();
    if (panel) panel.remove();
    output = null;
    marks.forEach((m) => m.remove());
    panel = null;
    marks = [];
  }

  let startX = 0, startY = 0;
  document.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    if (e.touches.length !== 1 || t.clientX > 110 || t.clientY > 140) return;
    startX = t.clientX; startY = t.clientY;
    document.documentElement.style.webkitUserSelect = "none";
    document.documentElement.style.webkitTouchCallout = "none";
    clearTimeout(timer);
    timer = setTimeout(() => (panel ? hide() : show()), 1200);
  }, { passive: true });
  // Un léger tremblement du doigt n'annule pas l'appui long ; un vrai déplacement, si
  document.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (Math.abs(t.clientX - startX) > 15 || Math.abs(t.clientY - startY) > 15) clearTimeout(timer);
  }, { passive: true });
  ["touchend", "touchcancel"].forEach((n) => document.addEventListener(n, () => {
    clearTimeout(timer);
    setTimeout(() => {
      document.documentElement.style.webkitUserSelect = "";
      document.documentElement.style.webkitTouchCallout = "";
    }, 400);
  }, { passive: true }));
})();
