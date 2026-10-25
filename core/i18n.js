/* ===========================================================================
   I18N — Langue de l'appli (français, anglais, espagnol)

   Principe : le français est la langue d'origine, écrite telle quelle dans le
   HTML et dans le JS. Quand la langue choisie n'est pas le français, ce
   fichier traduit tout ce qui s'affiche, sans toucher aux modules :
   - il parcourt le texte de la page (nœuds de texte, placeholder, aria-label,
     title, alt) puis surveille les ajouts avec un MutationObserver ;
   - il cherche chaque texte dans le dictionnaire (core/i18n-dict.js :
     [français, anglais, espagnol]) ;
   - les textes avec une valeur variable sont écrits avec § (ou {{nom}} pour
     les textes légaux) : « § séances » traduit « 5 séances » en « 5 sessions ».
   En français, rien n'est actif : aucun risque pour l'appli d'origine.

   Changer de langue : Menu > Réglages > Apparence > Langue. Le choix est
   enregistré dans settings.language (synchronisé avec le compte) et dans
   golfevolution_language (lu avant tout le reste), puis la page est rechargée.

   API globale :
   - appLang()          : 'fr' | 'en' | 'es'
   - appT(texte)        : traduit un texte français (pour les textes qui ne
                          passent pas par la page : mail, partage, titre...)
   - appSetLanguage(l)  : enregistre la langue puis recharge la page
   - appLocale()        : 'fr-FR' | 'en-GB' | 'es-ES' (dates et nombres)
   Pour ajouter un texte : ajouter une ligne [fr, en, es] dans i18n-dict.js.
   Pour ajouter une langue : ajouter son code ici (SUPPORTED, LOCALES) et une
   colonne dans le dictionnaire.
   =========================================================================== */
(function () {
  'use strict';

  var STORAGE_KEY = 'golfevolution_language';
  var APP_STATE_KEY = 'golfevolution_app_state';
  var SUPPORTED = ['fr', 'en', 'es'];
  var LOCALES = { fr: 'fr-FR', en: 'en-GB', es: 'es-ES' };
  var COLUMN = { en: 1, es: 2 }; // colonne du dictionnaire pour chaque langue

  /* --- Langue en cours : réglage du compte, sinon choix de l'appareil ---- */
  function readLanguage() {
    try {
      var st = (JSON.parse(localStorage.getItem(APP_STATE_KEY)) || {}).settings;
      if (st && SUPPORTED.indexOf(st.language) >= 0) return st.language;
    } catch (e) { /* lecture impossible : on passe à la suite */ }
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED.indexOf(v) >= 0) return v;
    } catch (e) { /* idem */ }
    return 'fr';
  }

  var lang = readLanguage();

  window.appLang = function () { return lang; };
  window.appLocale = function () { return LOCALES[lang] || LOCALES.fr; };
  window.appT = function (text) { return lang === 'fr' ? text : translate(text); };
  window.appSetLanguage = function (next) {
    if (SUPPORTED.indexOf(next) < 0) return;
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* stockage plein */ }
    // petit délai : laisse partir l'enregistrement du réglage avant de recharger
    setTimeout(function () { location.reload(); }, 250);
  };

  if (lang === 'fr') return; // français : rien à faire
  document.documentElement.setAttribute('lang', lang);

  /* --- Dictionnaire -------------------------------------------------------- */
  var col = COLUMN[lang];
  var exact = Object.create(null); // texte exact -> traduction
  var patterns = [];               // textes avec § ou {{x}}
  var cache = Object.create(null);

  function norm(s) { return s.replace(/\s+/g, ' ').trim(); }
  function escapeRx(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  (function buildDictionary() {
    var rows = window.APP_I18N_DICT || [];
    for (var i = 0; i < rows.length; i++) {
      var fr = norm(rows[i][0]);
      var tr = rows[i][col];
      if (!tr || tr === fr) continue;
      if (/§|\{\{\w+\}\}/.test(fr)) {
        // chaque § ou {{x}} devient un groupe de capture, dans l'ordre
        var literal = fr.replace(/§|\{\{\w+\}\}/g, '');
        if ((literal.match(/[A-Za-zÀ-ÿ]/g) || []).length < 3) continue; // trop vague
        var rx = escapeRx(fr).replace(/§/g, '(.*?)').replace(/\\\{\\\{\w+\\\}\\\}/g, '(.+?)');
        patterns.push({ rx: new RegExp('^' + rx + '$'), tr: tr, weight: literal.length });
      } else {
        exact[fr] = tr;
      }
    }
    patterns.sort(function (a, b) { return b.weight - a.weight; }); // le plus précis d'abord
  })();

  // Mois et jours : repli mot à mot pour les dates fabriquées par le code
  var WORDS = {
    en: { janvier: 'January', 'février': 'February', mars: 'March', avril: 'April', mai: 'May', juin: 'June', juillet: 'July', 'août': 'August', septembre: 'September', octobre: 'October', novembre: 'November', 'décembre': 'December', lundi: 'Monday', mardi: 'Tuesday', mercredi: 'Wednesday', jeudi: 'Thursday', vendredi: 'Friday', samedi: 'Saturday', dimanche: 'Sunday' },
    es: { janvier: 'enero', 'février': 'febrero', mars: 'marzo', avril: 'abril', mai: 'mayo', juin: 'junio', juillet: 'julio', 'août': 'agosto', septembre: 'septiembre', octobre: 'octubre', novembre: 'noviembre', 'décembre': 'diciembre', lundi: 'lunes', mardi: 'martes', mercredi: 'miércoles', jeudi: 'jueves', vendredi: 'viernes', samedi: 'sábado', dimanche: 'domingo' }
  }[lang];
  var WORDS_RX = new RegExp('(^|[^A-Za-zÀ-ÿ])(' + Object.keys(WORDS).join('|') + ')(?![A-Za-zÀ-ÿ])', 'gi');
  function translateWords(text) {
    return text.replace(WORDS_RX, function (m, pre, word) {
      var t = WORDS[word.toLowerCase()];
      if (!t) return m;
      if (word.charAt(0) !== word.charAt(0).toLowerCase()) t = t.charAt(0).toUpperCase() + t.slice(1);
      return pre + t;
    });
  }

  /* --- Traduction d'un texte (sans espaces de début / fin) ----------------- */
  function translateCore(text, depth) {
    if (exact[text]) return exact[text];
    for (var i = 0; i < patterns.length; i++) {
      var m = patterns[i].rx.exec(text);
      if (!m) continue;
      var n = 0;
      return patterns[i].tr.replace(/§|\{\{\w+\}\}/g, function () {
        var captured = m[++n] || '';
        // la valeur captée peut elle-même être un texte à traduire (date, libellé...)
        return depth < 2 ? translateCore(captured, depth + 1) : captured;
      });
    }
    return translateWords(text);
  }

  function translate(raw) {
    if (typeof raw !== 'string' || !raw) return raw;
    if (raw in cache) return cache[raw];
    var lead = raw.match(/^\s*/)[0];
    var trail = raw.match(/\s*$/)[0];
    var core = norm(raw);
    var out = core ? lead + translateCore(core, 0) + trail : raw;
    cache[raw] = out;
    return out;
  }

  /* --- Parcours du DOM ----------------------------------------------------- */
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1, CODE: 1, PRE: 1 };
  var ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];

  function skipped(el) {
    for (var n = el; n && n.nodeType === 1; n = n.parentNode) {
      if (SKIP_TAGS[n.tagName]) return true;
      if (n.hasAttribute && (n.hasAttribute('data-i18n-skip') || n.classList.contains('notranslate'))) return true;
    }
    return false;
  }

  function processText(node) {
    var v = node.nodeValue;
    if (node.__i18n && node.__i18n === v) return; // déjà notre traduction
    if (!v || !/[A-Za-zÀ-ÿ]/.test(v)) { node.__i18n = null; return; }
    if (node.parentNode && skipped(node.parentNode)) return;
    var out = translate(v);
    if (out !== v) { node.__i18n = out; node.nodeValue = out; } else { node.__i18n = null; }
  }

  function processAttr(el, name) {
    var v = el.getAttribute(name);
    if (!v) return;
    var mine = el.__i18nA && el.__i18nA[name];
    if (mine === v) return;
    if (skipped(el)) return;
    var out = translate(v);
    if (out !== v) {
      (el.__i18nA = el.__i18nA || {})[name] = out;
      el.setAttribute(name, out);
    } else if (el.__i18nA) { delete el.__i18nA[name]; }
  }

  function processTree(root) {
    if (!root) return;
    if (root.nodeType === 3) { processText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1) {
      if (skipped(root)) return;
      for (var a = 0; a < ATTRS.length; a++) processAttr(root, ATTRS[a]);
    }
    var walker = document.createTreeWalker(root, 1 | 4, null);
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === 3) processText(node);
      else for (var b = 0; b < ATTRS.length; b++) processAttr(node, ATTRS[b]);
    }
  }

  function observe() {
    var observer = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === 'childList') {
          for (var j = 0; j < m.addedNodes.length; j++) processTree(m.addedNodes[j]);
        } else if (m.type === 'characterData') {
          processText(m.target);
        } else if (m.type === 'attributes') {
          processAttr(m.target, m.attributeName);
        }
      }
    });
    observer.observe(document.documentElement, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ATTRS
    });
  }

  function start() {
    processTree(document.documentElement);
    document.title = translate(document.title);
    observe();
  }
  // les scripts sont en fin de <body> : le DOM statique est déjà là
  start();

  /* --- Dates et nombres : les appels en 'fr-FR' suivent la langue choisie -- */
  function localeOf(arg) {
    if (arg === undefined || arg === 'fr' || arg === 'fr-FR') return LOCALES[lang];
    return arg;
  }
  ['toLocaleDateString', 'toLocaleTimeString', 'toLocaleString'].forEach(function (name) {
    var original = Date.prototype[name];
    Date.prototype[name] = function (loc, opts) { return original.call(this, localeOf(loc), opts); };
  });
  var originalNumber = Number.prototype.toLocaleString;
  Number.prototype.toLocaleString = function (loc, opts) { return originalNumber.call(this, localeOf(loc), opts); };
  if (window.Intl && Intl.DateTimeFormat) {
    var OriginalDTF = Intl.DateTimeFormat;
    var PatchedDTF = function (loc, opts) { return new OriginalDTF(localeOf(loc), opts); };
    PatchedDTF.prototype = OriginalDTF.prototype;
    PatchedDTF.supportedLocalesOf = OriginalDTF.supportedLocalesOf;
    Intl.DateTimeFormat = PatchedDTF;
  }

  /* --- Chart.js : les libellés des graphiques ne sont pas dans la page ------ */
  function translateChart(cfg) {
    if (!cfg) return;
    var data = cfg.data || {};
    if (Array.isArray(data.labels)) data.labels = data.labels.map(function (l) { return typeof l === 'string' ? translate(l) : l; });
    (data.datasets || []).forEach(function (ds) { if (typeof ds.label === 'string') ds.label = translate(ds.label); });
    var scales = (cfg.options && cfg.options.scales) || {};
    Object.keys(scales).forEach(function (k) {
      var t = scales[k] && scales[k].title;
      if (t && typeof t.text === 'string') t.text = translate(t.text);
    });
  }
  if (window.Chart && !window.Chart.__i18n) {
    var OriginalChart = window.Chart;
    var PatchedChart = function (ctx, cfg) {
      try { translateChart(cfg); } catch (e) { /* sans traduction plutôt qu'un graphique cassé */ }
      return new OriginalChart(ctx, cfg);
    };
    Object.setPrototypeOf(PatchedChart, OriginalChart);
    PatchedChart.prototype = OriginalChart.prototype;
    PatchedChart.__i18n = true;
    window.Chart = PatchedChart;
  }
})();
