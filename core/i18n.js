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
   - quand le texte exact n'existe pas, il essaie : la même entrée en MAJUSCULES ou avec une
     minuscule initiale (« PARCOURS », « rapide »), puis le texte découpé en morceaux de
     mots (« Poids 62,5 kg » : seul « Poids » est traduit), puis les noms de mois et de jours ;
   - un texte coupé par des <br> (« Exercice<br>rapide ») est traduit en un seul bloc ;
   - une entrée « § Texte » (pastille ou icône devant le texte) sert aussi pour « Texte » seul ;
   - une entrée avec « (m) » ou « §m » existe aussi en « yd » et « ft » : l'unité de distance (Menu)
     ne dépend pas de la langue.
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
  var LETTER = 'A-Za-z\u00C0-\u00FF';
  var LETTER_RX = new RegExp('[' + LETTER + ']');
  var LETTER_START_RX = new RegExp('^[' + LETTER + ']');
  var LETTER_END_RX = new RegExp('[' + LETTER + ']$');
  var WORD3_RX = new RegExp('[' + LETTER + ']{3}');

  function norm(s) { return s.replace(/\s+/g, ' ').trim(); }
  function escapeRx(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  (function buildDictionary() {
    var rows = (window.APP_I18N_DICT || []).slice();
    // Unités : le dictionnaire est écrit en mètres (« (m) », « §m »). Le même texte existe aussi en yards,
    // l'unité choisie dans Menu ne dépend pas de la langue : on ajoute les variantes « yd » et « ft ».
    var UNIT_ROW_RX = /\(m\)|§ ?m(?![A-Za-z\u00C0-\u00FF])/;
    function withUnit(str, u) {
      return str.replace(/\(m\)/g, '(' + u + ')').replace(/§( ?)m(?![A-Za-z\u00C0-\u00FF])/g, '§$1' + u);
    }
    for (var u = 0, base = rows.length; u < base; u++) {
      if (!UNIT_ROW_RX.test(rows[u][0])) continue;
      ['yd', 'ft'].forEach(function (unit) {
        rows.push([withUnit(rows[u][0], unit), withUnit(rows[u][1], unit), withUnit(rows[u][2], unit)]);
      });
    }
    var stripped = []; // « § Texte » -> « Texte » (voir plus bas)
    for (var i = 0; i < rows.length; i++) {
      var fr = norm(rows[i][0]);
      var tr = rows[i][col];
      if (!tr || tr === fr) continue;
      if (/§|\{\{\w+\}\}/.test(fr)) {
        var literal = fr.replace(/§|\{\{\w+\}\}/g, '');
        var letters = (literal.match(/[A-Za-zÀ-ÿ]/g) || []).length;
        if (letters < 3) continue; // trop vague
        // chaque § ou {{x}} devient un groupe de capture, dans l'ordre ; on note ce qui touche le §
        var tokens = fr.split(/(§|\{\{\w+\}\})/);
        var rx = '', checks = [], g = 0;
        for (var t = 0; t < tokens.length; t++) {
          if (t % 2 === 0) { rx += escapeRx(tokens[t]); continue; }
          var before = tokens[t - 1] || '', after = tokens[t + 1] || '';
          checks.push({
            // § collé à la fin d'un mot (« coup§ ») : n'accepte que « s » / « x » ou un non-lettre
            suffix: LETTER_END_RX.test(before),
            // § collé au début d'un mot (« §Réussi ») : la valeur ne doit pas finir par une lettre
            prefix: LETTER_START_RX.test(after)
          });
          rx += tokens[t] === '§' ? '(.*?)' : '(.+?)';
          g++;
        }
        patterns.push({
          rx: new RegExp('^' + rx + '$'), tr: tr, weight: literal.length, checks: checks,
          // « § coup§ » : texte très court qui commence par une valeur, la valeur doit rester courte
          short: letters < 10 && fr.indexOf('§') === 0
        });
        // « § Texte » (icône ou pastille devant) : le texte seul se traduit aussi
        var mFr = /^§ ([^§{]+)$/.exec(fr), mTr = /^§ ([^§{]+)$/.exec(tr);
        if (mFr && mTr) stripped.push([mFr[1], mTr[1]]);
        var mFr2 = /^([^§{]+) §$/.exec(fr), mTr2 = /^([^§{]+) §$/.exec(tr);
        if (mFr2 && mTr2) stripped.push([mFr2[1], mTr2[1]]);
      } else {
        exact[fr] = tr;
      }
    }
    // les entrées écrites telles quelles dans le dictionnaire gardent la priorité
    for (var k = 0; k < stripped.length; k++) {
      if (!exact[stripped[k][0]] && stripped[k][0] !== stripped[k][1]) exact[stripped[k][0]] = stripped[k][1];
    }
    patterns.sort(function (a, b) { return b.weight - a.weight; }); // le plus précis d'abord
  })();

  function patternOk(p, m) {
    for (var c = 0; c < p.checks.length; c++) {
      var v = m[c + 1] || '';
      if (p.checks[c].suffix && v && !/^[sx]$/.test(v) && LETTER_START_RX.test(v)) return false;
      if (p.checks[c].prefix && v && LETTER_END_RX.test(v)) return false;
      if (c === 0 && p.short && WORD3_RX.test(v)) return false;
    }
    return true;
  }

  /* Texte exact, en acceptant les MAJUSCULES (« PARCOURS ») et la minuscule initiale (« rapide ») */
  function capFirst(x) { return x.charAt(0).toUpperCase() + x.slice(1); }
  function lowFirst(x) { return /^[A-ZÀ-Þ]{2}/.test(x) ? x : x.charAt(0).toLowerCase() + x.slice(1); }
  function lookupExact(text) {
    if (exact[text]) return exact[text];
    var low = text.toLowerCase();
    if (text.length > 1 && text === text.toUpperCase() && text !== low) {
      var hit = exact[capFirst(low)] || exact[low];
      return hit ? hit.toUpperCase() : null;
    }
    var f = text.charAt(0);
    if (f !== f.toUpperCase()) { // « rapide » -> « Rapide » -> « quick »
      var up = exact[capFirst(text)];
      return up ? lowFirst(up) : null;
    }
    if (f !== f.toLowerCase()) { // « Rapide » absent mais « rapide » présent
      var dn = exact[lowFirst(text)];
      return dn ? capFirst(dn) : null;
    }
    return null;
  }

  // Mois et jours : repli mot à mot pour les dates fabriquées par le code
  var WORDS = {
    en: { janvier: 'January', 'février': 'February', mars: 'March', avril: 'April', mai: 'May', juin: 'June', juillet: 'July', 'août': 'August', septembre: 'September', octobre: 'October', novembre: 'November', 'décembre': 'December', lundi: 'Monday', mardi: 'Tuesday', mercredi: 'Wednesday', jeudi: 'Thursday', vendredi: 'Friday', samedi: 'Saturday', dimanche: 'Sunday' },
    es: { janvier: 'enero', 'février': 'febrero', mars: 'marzo', avril: 'abril', mai: 'mayo', juin: 'junio', juillet: 'julio', 'août': 'agosto', septembre: 'septiembre', octobre: 'octubre', novembre: 'noviembre', 'décembre': 'diciembre', lundi: 'lunes', mardi: 'martes', mercredi: 'miércoles', jeudi: 'jueves', vendredi: 'viernes', samedi: 'sábado', dimanche: 'domingo' }
  }[lang];
  var WORDS_RX = new RegExp('(^|[^A-Za-zÀ-ÿ])(' + Object.keys(WORDS).join('|') + ')(?![A-Za-zÀ-ÿ])', 'gi');
  var ES_MONTHS = 'enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre';
  function translateWords(text) {
    var out = text.replace(WORDS_RX, function (m, pre, word) {
      var t = WORDS[word.toLowerCase()];
      if (!t) return m;
      if (word.charAt(0) !== word.charAt(0).toLowerCase()) t = t.charAt(0).toUpperCase() + t.slice(1);
      return pre + t;
    });
    if (lang === 'es' && out !== text) { // « 30 octubre 2026 » -> « 30 de octubre de 2026 »
      out = out.replace(new RegExp('(\\d)\\s+(' + ES_MONTHS + ')\\b', 'gi'), '$1 de $2')
               .replace(new RegExp('\\b(' + ES_MONTHS + ')\\s+(\\d{4})\\b', 'gi'), '$1 de $2');
    }
    return out;
  }

  /* --- Traduction d'un texte (sans espaces de début / fin) ----------------- */
  // Suites de mots (« Poids », « Court-Gauche », « Mètres rentrés ») séparées par des chiffres ou de la ponctuation
  var RUN_RX = new RegExp('[' + LETTER + ']+(?:[\\s\'\u2019\\-][' + LETTER + ']+)*', 'g');
  function translateRuns(text) {
    var changed = false;
    var out = text.replace(RUN_RX, function (run) {
      var t = lookupExact(run);
      if (t && t !== run) { changed = true; return t; }
      return run;
    });
    return changed ? out : null;
  }

  /* Pluriel espagnol d'un mot seul : sesión -> sesiones, indicador -> indicadores, vez -> veces, bola -> bolas */
  function pluralEs(word) {
    if (/[aeiouáéíóú]$/i.test(word)) return word + 's';
    if (/ón$/i.test(word)) return word.slice(0, -2) + 'ones';
    if (/z$/i.test(word)) return word.slice(0, -1) + 'ces';
    return word + 'es';
  }

  function translateCore(text, depth) {
    var direct = lookupExact(text);
    if (direct) return direct;
    for (var i = 0; i < patterns.length; i++) {
      var m = patterns[i].rx.exec(text);
      if (!m || !patternOk(patterns[i], m)) continue;
      var n = 0;
      var out = patterns[i].tr.replace(/§|\{\{\w+\}\}/g, function (ph, offset, whole) {
        var captured = m[++n] || '';
        // « s » collé à un mot espagnol : le pluriel dépend de la lettre finale (sesión -> sesiones)
        if (lang === 'es' && captured === 's' && offset > 0 && LETTER_RX.test(whole.charAt(offset - 1))) return '\u0001s';
        // la valeur captée peut elle-même être un texte à traduire (date, libellé...)
        return depth < 2 ? translateCore(captured, depth + 1) : captured;
      });
      return out.indexOf('\u0001') < 0 ? out : out.replace(/([A-Za-z\u00C0-\u00FF]+)\u0001s/g, function (all, word) { return pluralEs(word); });
    }
    var words = translateWords(text);
    if (depth >= 2) return words;
    return translateRuns(words) || words;
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

  // Le contenu d'un <textarea> n'est pas traduit, mais son placeholder oui
  function skippedAttr(el) { return skipped(el.tagName === 'TEXTAREA' ? el.parentNode : el); }

  function processAttr(el, name) {
    var v = el.getAttribute(name);
    if (!v) return;
    var mine = el.__i18nA && el.__i18nA[name];
    if (mine === v) return;
    if (skippedAttr(el)) return;
    var out = translate(v);
    if (out !== v) {
      (el.__i18nA = el.__i18nA || {})[name] = out;
      el.setAttribute(name, out);
    } else if (el.__i18nA) { delete el.__i18nA[name]; }
  }

  // Texte coupé par des <br> (« Exercice<br>rapide ») : traduit en un seul bloc, puis recoupé
  function processBreaks(root) {
    if (!root.querySelectorAll) return;
    var brs = root.nodeName === 'BR' ? [root] : root.querySelectorAll('br');
    var done = [];
    for (var b = 0; b < brs.length; b++) {
      var parent = brs[b].parentNode;
      if (!parent || done.indexOf(parent) >= 0) continue;
      done.push(parent);
      if (skipped(parent)) continue;
      var nodes = [], simple = true;
      for (var c = 0; c < parent.childNodes.length; c++) {
        var child = parent.childNodes[c];
        if (child.nodeType === 3) { if (norm(child.nodeValue)) nodes.push(child); }
        else if (child.nodeName !== 'BR' && child.nodeType !== 8) { simple = false; break; }
      }
      if (!simple || nodes.length < 2) continue;
      var already = true;
      for (var d = 0; d < nodes.length; d++) if (!(nodes[d].__i18n && nodes[d].__i18n === nodes[d].nodeValue)) already = false;
      if (already) continue;
      var joined = nodes.map(function (x) { return norm(x.nodeValue); }).join(' ');
      var out = translate(joined);
      if (out === joined) continue;
      var words = out.split(' ');
      if (words.length < nodes.length) continue;
      for (var e = 0; e < nodes.length; e++) {
        var part = words.slice(Math.round(e * words.length / nodes.length), Math.round((e + 1) * words.length / nodes.length)).join(' ');
        var raw = nodes[e].nodeValue;
        var value = raw.match(/^\s*/)[0] + part + raw.match(/\s*$/)[0];
        nodes[e].__i18n = value;
        nodes[e].nodeValue = value;
      }
    }
  }

  function processTree(root) {
    if (!root) return;
    if (root.nodeType === 3) { processText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    processBreaks(root);
    if (root.nodeType === 1) {
      for (var a = 0; a < ATTRS.length; a++) processAttr(root, ATTRS[a]);
      if (skipped(root)) return;
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
