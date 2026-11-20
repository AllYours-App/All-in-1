/* ===========================================================================
   COMMUN — JS partagé entre plusieurs modules
   Chargé sur toutes les pages, après app-shell.js et avant le JS de chaque
   module.
   =========================================================================== */

/* ---------------------------------------------------------------------------
   THÈME — sombre (par défaut) ou clair. Le thème clair est défini dans
   theme-light.css et s'active avec <html data-theme="light">. Le réglage est
   enregistré dans golfevolution_app_state.settings.theme (Menu > Apparence) ; un petit
   script dans le <head> d'index.html le pose avant le premier affichage.
   --------------------------------------------------------------------------- */
function applyAppTheme(theme) {
  const isLight = theme === "light";
  document.documentElement.setAttribute("data-theme", isLight ? "light" : "dark");
  // Couleur de la barre du navigateur (Android, Safari)
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", isLight ? "#f1f3ea" : "#050505");
}

/* ---------------------------------------------------------------------------
   PAVÉ NUMÉRIQUE — clavier numérique réutilisable (distance finale, rayon de
   validation, etc.). Nécessite les classes .app-keypad / .app-keypad-value
   (voir commun.css). Couleurs communes à tous les modules (tokens --wg-*
   définis en :root dans base.css).

   pressFn, backspaceFn, clearFn : noms (string) de fonctions globales,
   appelées par les boutons via onclick.
   extraKey (optionnel) : { fn, label } pour remplacer le bouton "C" par
   défaut (ex : bouton "," pour un champ décimal). fn est un nom de fonction
   globale, avec ou sans parenthèses ("menuKeypadDecimal" ou
   "menuKeypadDecimal()"). Quand extraKey est fourni, clearFn n'est pas
   utilisé (peut valoir null).
   --------------------------------------------------------------------------- */
function appKeypad(pressFn, backspaceFn, clearFn, extraKey) {
  const extraCall = extraKey && (extraKey.fn.includes("(") ? extraKey.fn : `${extraKey.fn}()`);
  const extra = extraKey
    ? `<button type="button" onclick="${extraCall}">${extraKey.label}</button>`
    : `<button type="button" onclick="${clearFn}()">C</button>`;
  return `<div class="app-keypad">
    ${[1,2,3,4,5,6,7,8,9].map(n => `<button type="button" onclick="${pressFn}('${n}')">${n}</button>`).join('')}
    ${extra}
    <button type="button" onclick="${pressFn}('0')">0</button>
    <button type="button" aria-label="Effacer" onclick="${backspaceFn}()">&larr;</button>
  </div>`;
}

/* ---------------------------------------------------------------------------
   ÉCHAPPEMENT HTML — à utiliser pour tout texte saisi par la personne (noms
   de programmes, d'exercices, d'objectifs, descriptions...) avant de
   l'injecter dans un gabarit HTML (innerHTML, attributs value="...").
   Remplace les trois copies qui existaient (escapeHtml dans menu.js, escHtml
   dans putting.js, esc dans stats.js), à rediriger ici au fil des
   modifications.
   --------------------------------------------------------------------------- */
function appEscapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/* ---------------------------------------------------------------------------
   ÉCRITURE localStorage AVEC ALERTE — remplace les `try { setItem } catch {}`
   qui ignoraient l'erreur : quand le stockage est plein ou indisponible
   (QuotaExceededError, navigation privée), la personne est prévenue au lieu de
   croire que sa saisie est enregistrée.
   Renvoie true si l'écriture a réussi, false sinon. Le message n'apparaît
   qu'une fois toutes les 8 secondes pour ne pas empiler les alertes pendant
   une saisie.
   --------------------------------------------------------------------------- */
var appStorageAlertAt = 0;

function appNotifyStorageError() {
  var now = Date.now();
  if (now - appStorageAlertAt < 8000) return;
  appStorageAlertAt = now;
  if (!document.body) return;
  var toast = document.createElement('div');
  toast.setAttribute('role', 'alert');
  toast.textContent = "Enregistrement impossible : le stockage de l'appareil est plein ou indisponible. Les dernières modifications ne sont pas sauvegardées.";
  toast.style.cssText = 'position:fixed;left:16px;right:16px;bottom:calc(16px + env(safe-area-inset-bottom, 0px));' +
    'z-index:10000;padding:14px 16px;border-radius:14px;background:#2a1215;color:#ffd9d9;' +
    'border:1px solid rgba(255,120,120,.45);font-size:14px;line-height:1.35;text-align:center;' +
    'box-shadow:0 8px 24px rgba(0,0,0,.45);';
  document.body.appendChild(toast);
  setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 6000);
}

function appSafeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    // Synchronisation avec Supabase (core/data.js, chargé après ce fichier : absent pendant le chargement)
    if (window.appData) window.appData.onWrite(key);
    return true;
  } catch (e) {
    console.warn('Écriture localStorage impossible (' + key + ') :', e);
    appNotifyStorageError();
    return false;
  }
}

/* ---------------------------------------------------------------------------
   POPUPS DE L'APPLI — remplacent confirm(), alert() et prompt() natifs, qui
   jurent avec le design et s'affichent mal dans une appli installée.
   Elles renvoient une Promise : on les attend avec `await` dans une fonction
   `async`.
     await appConfirm(message, { confirmLabel, cancelLabel, danger })  -> true | false
     await appAlert(message, { okLabel })                              -> undefined
     await appPrompt(label, valeurInitiale, { multiline })             -> texte | null
   Le message passe par textContent : aucun HTML interprété (un nom de
   programme saisi par la personne ne peut pas casser la popup).
   Échap et un appui sur le fond = annuler.
   --------------------------------------------------------------------------- */
function appDialog(opts) {
  return new Promise(function (resolve) {
    var previousFocus = document.activeElement;
    var overlay = document.createElement('div');
    overlay.className = 'app-dialog_overlay';

    var box = document.createElement('div');
    box.className = 'app-dialog';
    box.setAttribute('role', opts.kind === 'alert' ? 'alertdialog' : 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-labelledby', 'app-dialog-message');

    var message = document.createElement('p');
    message.className = 'app-dialog_message';
    message.id = 'app-dialog-message';
    message.textContent = opts.message;
    box.appendChild(message);

    var input = null;
    if (opts.kind === 'prompt') {
      input = document.createElement(opts.multiline ? 'textarea' : 'input');
      if (!opts.multiline) input.type = 'text';
      input.className = 'app-dialog_input';
      input.value = opts.defaultValue || '';
      input.maxLength = opts.multiline ? 2000 : 200;
      input.setAttribute('aria-labelledby', 'app-dialog-message');
      box.appendChild(input);
    }

    var actions = document.createElement('div');
    actions.className = 'app-dialog_actions';
    var cancelBtn = null;
    if (opts.kind !== 'alert') {
      cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className = 'app-dialog_btn';
      cancelBtn.textContent = opts.cancelLabel || 'Annuler';
      actions.appendChild(cancelBtn);
    }
    var okBtn = document.createElement('button');
    okBtn.type = 'button';
    okBtn.className = 'app-dialog_btn ' + (opts.danger ? 'is-danger' : 'is-primary');
    okBtn.textContent = opts.confirmLabel || (opts.kind === 'alert' ? 'OK' : 'Continuer');
    actions.appendChild(okBtn);
    box.appendChild(actions);
    overlay.appendChild(box);

    var closed = false;
    function close(result) {
      if (closed) return;
      closed = true;
      document.removeEventListener('keydown', onKey, true);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      if (previousFocus && previousFocus.focus) { try { previousFocus.focus(); } catch (e) { /* élément disparu */ } }
      resolve(result);
    }
    function accept() {
      if (opts.kind === 'prompt') close(input.value);
      else if (opts.kind === 'alert') close(undefined);
      else close(true);
    }
    function cancel() {
      if (opts.kind === 'prompt') close(null);
      else if (opts.kind === 'alert') close(undefined);
      else close(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cancel(); return; }
      if (e.key === 'Enter' && input && !opts.multiline && document.activeElement === input) {
        e.preventDefault(); accept(); return;
      }
      if (e.key === 'Tab') {
        // garde le focus dans la popup
        var items = box.querySelectorAll('input, textarea, button');
        if (!items.length) return;
        var first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    okBtn.addEventListener('click', accept);
    if (cancelBtn) cancelBtn.addEventListener('click', cancel);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) cancel(); });
    document.addEventListener('keydown', onKey, true);

    document.body.appendChild(overlay);
    if (input) { input.focus(); input.select(); } else { (cancelBtn || okBtn).focus(); }
  });
}

function appConfirm(message, options) {
  return appDialog(Object.assign({ kind: 'confirm', message: message }, options || {}));
}

function appAlert(message, options) {
  return appDialog(Object.assign({ kind: 'alert', message: message }, options || {}));
}

function appPrompt(label, defaultValue, options) {
  return appDialog(Object.assign({ kind: 'prompt', message: label, defaultValue: defaultValue }, options || {}));
}

/* ---------------------------------------------------------------------------
   PRÉFÉRENCES PAR MODULE — réglages d'affichage choisis depuis le menu "3 points"
   des headers (Putting, Wedging, Parcours, Gym). Une seule clé localStorage,
   golfevolution_module_prefs, de la forme { putting: {...}, wedging: {...}, ... }.
   Volontairement séparée de golfevolution_app_state (gérée par menu.js, qui la réécrit en
   entier depuis sa propre copie en mémoire).
     appPrefGet(module, clé, valeurParDéfaut)  -> valeur enregistrée ou défaut
     appPrefSet(module, clé, valeur)           -> true | false (écriture via appSafeSetItem)
   --------------------------------------------------------------------------- */
var APP_PREFS_KEY = 'golfevolution_module_prefs';

function appPrefsRead() {
  try {
    var data = JSON.parse(localStorage.getItem(APP_PREFS_KEY) || '{}');
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
  } catch (e) {
    return {};
  }
}

function appPrefGet(module, key, fallback) {
  var mod = appPrefsRead()[module];
  if (mod && typeof mod === 'object' && Object.prototype.hasOwnProperty.call(mod, key) && mod[key] !== undefined) return mod[key];
  return fallback;
}

function appPrefSet(module, key, value) {
  var data = appPrefsRead();
  if (!data[module] || typeof data[module] !== 'object' || Array.isArray(data[module])) data[module] = {};
  data[module][key] = value;
  return appSafeSetItem(APP_PREFS_KEY, JSON.stringify(data));
}

/* ---------------------------------------------------------------------------
   BOTTOM SHEET — feuille qui monte du bas de l'écran, partagée par les menus
   "3 points" des modules. Chaque module fournit ses entrées ; le rendu, la
   fermeture (Échap, appui sur le fond, bouton Fermer) et l'accessibilité sont ici.
   Tous les textes passent par textContent : un nom saisi par la personne (nom de
   programme, de parcours...) ne peut pas injecter de HTML.

     appSheet({ title, info, sections: [ { title, items: [ ... ] } ] })  -> fonction close()
     info (optionnel) : texte d'aide. Un bouton « i » à côté du titre l'affiche / le masque.

   Types d'entrées (items) :
     { type: 'toggle',  label, hint, value: bool, onChange(valeur) }
     { type: 'segment', label, hint, value, options: [{ value, label }], onChange(valeur) }
     { type: 'action',  label, hint, selected: bool, danger: bool, keepOpen: bool, onClick() }
     { type: 'check',   label, hint, value: bool, onChange(valeur) }
        -> ligne à cocher (encoche verte quand elle est cochée). onChange peut renvoyer false pour refuser
           le changement : la ligne garde alors son état.
     { type: 'note',    text }
        -> message affiché dans la feuille (rien si le texte est vide) ; modifiable dans onChange d'une autre ligne
     { type: 'reorder', label, hint, items: [{ key, label, visible }], onChange(items) }
        -> liste dont chaque ligne a un oeil (afficher / masquer) et des flèches haut / bas ;
           onChange reçoit la liste complète dans le nouvel ordre : [{ key, label, visible }]
   Les toggles, segments et listes restent ouverts après un changement ; une action
   ferme la feuille avant d'appeler onClick (sauf keepOpen: true).
   Une seule feuille à la fois : en ouvrir une ferme la précédente.
   --------------------------------------------------------------------------- */
var appSheetCurrent = null;

function appSheetEl(tag, className, text) {
  var el = document.createElement(tag);
  if (className) el.className = className;
  if (text != null) el.textContent = text;
  return el;
}

function appSheet(config) {
  if (appSheetCurrent) appSheetCurrent();
  var previousFocus = document.activeElement;
  var sections = (config && config.sections) || [];

  var overlay = appSheetEl('div', 'app-sheet_overlay');
  var sheet = appSheetEl('div', 'app-sheet');
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-modal', 'true');
  sheet.setAttribute('aria-labelledby', 'app-sheet-title');
  sheet.tabIndex = -1;

  var handle = appSheetEl('div', 'app-sheet_handle');
  handle.setAttribute('aria-hidden', 'true');
  var head = appSheetEl('div', 'app-sheet_head');
  var titleEl = appSheetEl('h2', 'app-sheet_title', (config && config.title) || 'Options');
  titleEl.id = 'app-sheet-title';
  var closeBtn = appSheetEl('button', 'app-sheet_close', 'Fermer');
  closeBtn.type = 'button';
  var titleWrap = appSheetEl('div', 'app-sheet_title-wrap');
  titleWrap.appendChild(titleEl);
  var infoPanel = null;
  if (config && config.info) {
    var infoBtn = appSheetEl('button', 'app-sheet_info-btn');
    infoBtn.type = 'button';
    infoBtn.setAttribute('aria-label', 'À quoi ça sert ?');
    infoBtn.setAttribute('aria-expanded', 'false');
    infoBtn.setAttribute('aria-controls', 'app-sheet-info');
    // Icône « i » dans un cercle (SVG fixe, aucun texte saisi par la personne)
    infoBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.6v.1"/></svg>';
    infoPanel = appSheetEl('p', 'app-sheet_info', config.info);
    infoPanel.id = 'app-sheet-info';
    infoPanel.hidden = true;
    infoBtn.addEventListener('click', function () {
      infoPanel.hidden = !infoPanel.hidden;
      infoBtn.setAttribute('aria-expanded', infoPanel.hidden ? 'false' : 'true');
      infoBtn.classList.toggle('is-on', !infoPanel.hidden);
    });
    titleWrap.appendChild(infoBtn);
  }
  head.appendChild(titleWrap);
  head.appendChild(closeBtn);
  var body = appSheetEl('div', 'app-sheet_body');
  sheet.appendChild(handle);
  sheet.appendChild(head);
  if (infoPanel) sheet.appendChild(infoPanel);
  sheet.appendChild(body);
  overlay.appendChild(sheet);

  var closed = false;
  function close() {
    if (closed) return;
    closed = true;
    appSheetCurrent = null;
    document.removeEventListener('keydown', onKey, true);
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    if (previousFocus && previousFocus.focus) { try { previousFocus.focus(); } catch (e) { /* élément disparu */ } }
  }
  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
    if (e.key === 'Tab') {
      var items = sheet.querySelectorAll('button');
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function rowText(item) {
    var wrap = appSheetEl('span', 'app-sheet_row-text');
    wrap.appendChild(appSheetEl('span', 'app-sheet_row-label', item.label));
    if (item.hint) wrap.appendChild(appSheetEl('span', 'app-sheet_row-hint', item.hint));
    return wrap;
  }

  function buildToggle(item) {
    var row = appSheetEl('button', 'app-sheet_row app-sheet_row--toggle');
    row.type = 'button';
    row.setAttribute('role', 'switch');
    row.setAttribute('aria-checked', item.value ? 'true' : 'false');
    row.appendChild(rowText(item));
    var track = appSheetEl('span', 'app-sheet_switch' + (item.value ? ' is-on' : ''));
    track.appendChild(appSheetEl('span', 'app-sheet_switch-knob'));
    row.appendChild(track);
    row.addEventListener('click', function () {
      item.value = !item.value;
      if (item.onChange) item.onChange(item.value);
      render();
    });
    return row;
  }

  // Ligne à cocher : encoche verte dans un rond quand elle est cochée
  function buildCheck(item) {
    var row = appSheetEl('button', 'app-sheet_row app-sheet_row--check' + (item.value ? ' is-on' : ''));
    row.type = 'button';
    row.setAttribute('role', 'checkbox');
    row.setAttribute('aria-checked', item.value ? 'true' : 'false');
    row.appendChild(rowText(item));
    var box = appSheetEl('span', 'app-sheet_box' + (item.value ? ' is-on' : ''));
    box.setAttribute('aria-hidden', 'true');
    box.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
    row.appendChild(box);
    row.addEventListener('click', function () {
      var next = !item.value;
      var accepted = item.onChange ? item.onChange(next) : true;
      if (accepted !== false) item.value = next;
      render();
    });
    return row;
  }

  function buildSegment(item) {
    var wrap = appSheetEl('div', 'app-sheet_block');
    wrap.appendChild(rowText(item));
    var group = appSheetEl('div', 'app-sheet_segment');
    group.setAttribute('role', 'radiogroup');
    group.setAttribute('aria-label', item.label);
    (item.options || []).forEach(function (opt) {
      var on = opt.value === item.value;
      var btn = appSheetEl('button', 'app-sheet_segment-btn' + (on ? ' is-on' : ''), opt.label);
      btn.type = 'button';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', on ? 'true' : 'false');
      btn.addEventListener('click', function () {
        if (item.value === opt.value) return;
        item.value = opt.value;
        if (item.onChange) item.onChange(opt.value);
        render();
      });
      group.appendChild(btn);
    });
    wrap.appendChild(group);
    return wrap;
  }

  function buildAction(item) {
    var row = appSheetEl('button', 'app-sheet_row app-sheet_row--action' + (item.danger ? ' is-danger' : '') + (item.selected ? ' is-selected' : ''));
    row.type = 'button';
    row.appendChild(rowText(item));
    if (item.selected) {
      var mark = appSheetEl('span', 'app-sheet_check', '✓');
      mark.setAttribute('aria-label', 'Sélectionné');
      row.appendChild(mark);
    }
    row.addEventListener('click', function () {
      if (!item.keepOpen) close();
      if (item.onClick) item.onClick();
    });
    return row;
  }

  function buildReorder(item) {
    var wrap = appSheetEl('div', 'app-sheet_block');
    wrap.appendChild(rowText(item));
    var list = appSheetEl('ul', 'app-sheet_list');
    var rows = item.items || [];
    function commit() { if (item.onChange) item.onChange(rows.map(function (r) { return { key: r.key, label: r.label, visible: !!r.visible }; })); render(); }
    rows.forEach(function (r, i) {
      var li = appSheetEl('li', 'app-sheet_list-row' + (r.visible ? '' : ' is-off'));
      var eye = appSheetEl('button', 'app-sheet_list-eye' + (r.visible ? ' is-on' : ''), r.label);
      eye.type = 'button';
      eye.setAttribute('role', 'switch');
      eye.setAttribute('aria-checked', r.visible ? 'true' : 'false');
      eye.addEventListener('click', function () { r.visible = !r.visible; commit(); });
      var up = appSheetEl('button', 'app-sheet_list-move', '↑');
      up.type = 'button';
      up.setAttribute('aria-label', 'Monter ' + r.label);
      up.disabled = i === 0;
      up.addEventListener('click', function () { rows.splice(i - 1, 0, rows.splice(i, 1)[0]); commit(); });
      var down = appSheetEl('button', 'app-sheet_list-move', '↓');
      down.type = 'button';
      down.setAttribute('aria-label', 'Descendre ' + r.label);
      down.disabled = i === rows.length - 1;
      down.addEventListener('click', function () { rows.splice(i + 1, 0, rows.splice(i, 1)[0]); commit(); });
      li.appendChild(eye);
      li.appendChild(up);
      li.appendChild(down);
      list.appendChild(li);
    });
    wrap.appendChild(list);
    return wrap;
  }

  function render() {
    var scroll = body.scrollTop;
    var focusIndex = -1;
    var buttons = Array.prototype.slice.call(sheet.querySelectorAll('button'));
    if (buttons.indexOf(document.activeElement) !== -1) focusIndex = buttons.indexOf(document.activeElement);
    body.textContent = '';
    sections.forEach(function (section) {
      var block = appSheetEl('section', 'app-sheet_section');
      if (section.title) block.appendChild(appSheetEl('h3', 'app-sheet_section-title', section.title));
      (section.items || []).forEach(function (item) {
        if (item.type === 'toggle') block.appendChild(buildToggle(item));
        else if (item.type === 'segment') block.appendChild(buildSegment(item));
        else if (item.type === 'action') block.appendChild(buildAction(item));
        else if (item.type === 'reorder') block.appendChild(buildReorder(item));
        else if (item.type === 'check') block.appendChild(buildCheck(item));
        else if (item.type === 'note' && item.text) {
          var note = appSheetEl('p', 'app-sheet_note', item.text);
          note.setAttribute('role', 'status');
          block.appendChild(note);
        }
      });
      body.appendChild(block);
    });
    body.scrollTop = scroll;
    // Le contenu est reconstruit à chaque changement : on redonne le focus au même rang de bouton (navigation au clavier)
    if (focusIndex !== -1) {
      var after = sheet.querySelectorAll('button');
      if (after[focusIndex]) after[focusIndex].focus();
    }
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  document.addEventListener('keydown', onKey, true);
  appSheetCurrent = close;
  render();
  document.body.appendChild(overlay);
  // déclenche la transition d'entrée au prochain affichage
  requestAnimationFrame(function () { overlay.classList.add('is-open'); });
  closeBtn.focus();
  return close;
}

/* ---------------------------------------------------------------------------
   GRAPHIQUES COMMUNS (Putting, Wedging) : un seul dessin, un seul fonctionnement.
   - appChartSvg() dessine un graphique (courbes et/ou barres, un ou deux axes verticaux) avec au plus
     5 valeurs fixes par axe (appChartNiceScale) et des libellés horizontaux espacés ;
   - un appui sur un point (ou sur sa colonne) affiche une bulle reliée au point avec la valeur exacte,
     un deuxième appui ou un appui ailleurs la ferme (gestionnaire unique en bas, rien à brancher) ;
   - le dessin est fait à la largeur réelle du conteneur : 1 unité du dessin = 1 px à l'écran, donc les tailles
     de police du CSS (commun.css, classes app-chart-*) sont les tailles vues par le joueur.
   --------------------------------------------------------------------------- */

// Largeur (px) où dessiner un graphique. Si le conteneur n'est pas encore dans la page (graphe construit en
// texte puis inséré) ou est masqué, estimation : largeur d'une carte pleine largeur.
function appChartWidth(el) {
  const measured = el && el.clientWidth;
  if (measured > 0) return measured;
  const cs = getComputedStyle(document.documentElement);
  const pad = parseFloat(cs.getPropertyValue('--app-padding-x')) || 20;
  const max = parseFloat(cs.getPropertyValue('--app-max-width')) || 430;
  return Math.max(260, Math.min(window.innerWidth, max) - 2 * pad);
}

// Nombre affiché avec 2 décimales au plus, séparateur décimal de la langue
function appChartNum(v) {
  const r = Math.round(v * 100) / 100;
  const sep = typeof appDecimalSep === 'function' ? appDecimalSep() : ',';
  return String(r).replace('.', sep);
}

// Échelle de 0 à 100 % : toujours les mêmes 5 valeurs
function appChartPercentScale() {
  return { min: 0, max: 100, ticks: [0, 25, 50, 75, 100] };
}

// Échelle "propre" couvrant lo → hi en `intervals` intervalles égaux (4 par défaut = 5 valeurs).
// integer : pas entiers seulement (comptes de trous, mètres). Renvoie { min, max, ticks }.
function appChartNiceScale(lo, hi, intervals, integer) {
  intervals = intervals || 4;
  if (!isFinite(lo) || !isFinite(hi)) { lo = 0; hi = 1; }
  if (hi <= lo) hi = lo + (integer ? 1 : Math.max(Math.abs(lo) * 0.1, 1)); // plage nulle
  const raw = (hi - lo) / intervals;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const mults = integer ? [1, 2, 5, 10] : [1, 2, 2.5, 5, 10];
  let step = null, min = lo;
  for (let m = mag / 10; step === null && m <= mag * 100; m *= 10) {
    for (let i = 0; i < mults.length; i++) {
      const s = mults[i] * m;
      if (integer && s < 1) continue;
      const mn = Math.floor(lo / s + 1e-9) * s;
      if (mn + s * intervals >= hi - 1e-9) { step = s; min = mn; break; }
    }
  }
  const ticks = [];
  for (let k = 0; k <= intervals; k++) ticks.push(Math.round((min + step * k) * 1e6) / 1e6);
  return { min: ticks[0], max: ticks[intervals], ticks: ticks };
}

// Légende à placer SOUS le graphique : items = [{ label, cls }] (cls 'b' = 2e couleur)
function appChartLegend(items) {
  return '<div class="app-chart-legend">' + items.map(function (it) {
    return '<span class="app-chart-legend-item"><i class="app-chart-swatch' + (it.cls === 'b' ? ' is-b' : '') + '"></i>' + appEscapeHtml(it.label) + '</span>';
  }).join('') + '</div>';
}

/* Dessine un graphique et renvoie son HTML (conteneur + svg).
   o.width       largeur de dessin en px (appChartWidth)
   o.height      hauteur en px (230 par défaut)
   o.labels      libellés sous l'axe horizontal (un par point), au plus ~5 affichés
   o.tipTitles   titre de la bulle pour chaque point (sinon le libellé)
   o.zeroLine    trait renforcé à la valeur 0 (graphe centré sur 0)
   o.emptyText   texte si aucune donnée
   o.series      [{ values, kind: 'line' | 'bar', cls: 'a' | 'b', label, scale, axis: 'left' | 'right',
                    fmt (graduations), tipFmt (bulle), area }]
                 scale = { min, max, ticks } (appChartNiceScale ou appChartPercentScale) ; deux axes : mêmes
                 nombres d'intervalles pour que les graduations de droite tombent sur les traits de gauche. */
function appChartSvg(o) {
  const W = Math.round(o.width) || 360, H = o.height || 230;
  const series = (o.series || []).filter(function (s) { return s.scale; });
  const labels = o.labels || [];
  const isNum = function (v) { return v != null && !isNaN(v); };
  const n = Math.max.apply(null, [labels.length].concat(series.map(function (s) { return s.values.length; })));
  const fmtOf = function (s) { return s.fmt || appChartNum; };
  const leftS = series.filter(function (s) { return s.axis !== 'right'; })[0];
  const rightS = series.filter(function (s) { return s.axis === 'right'; })[0];
  const refS = leftS || rightS;
  const padT = 14, padB = 30;
  const tickChars = function (s) {
    return s ? Math.max.apply(null, s.scale.ticks.map(function (t) { return String(fmtOf(s)(t)).length; })) : 0;
  };
  const padL = leftS ? Math.max(34, Math.ceil(tickChars(leftS) * 8) + 16) : 12;   // 8 px par caractère (police 13 px) + écart + marge
  const padR = rightS ? Math.max(34, Math.ceil(tickChars(rightS) * 8) + 18) : 14;
  const plotW = W - padL - padR, plotH = H - padT - padB, base = padT + plotH;
  const svgOpen = '<div class="app-chart-wrap"><svg viewBox="0 0 ' + W + ' ' + H + '" class="app-chart-svg" xmlns="http://www.w3.org/2000/svg">';
  const svgClose = '</svg></div>';

  // Pas de données : cadre vide et message
  if (!refS || !n || !series.some(function (s) { return s.values.some(isNum); })) {
    let g = '';
    for (let k = 0; k <= 4; k++) {
      const y = padT + (plotH * k) / 4;
      g += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + y.toFixed(1) + '" class="' + (k === 4 ? 'app-chart-axis' : 'app-chart-grid') + '"/>';
    }
    return svgOpen + g + '<text x="' + (W / 2) + '" y="' + (padT + plotH / 2) + '" text-anchor="middle" class="app-chart-empty">' + appEscapeHtml(o.emptyText || 'Pas encore de données') + '</text>' + svgClose;
  }

  const hasBars = series.some(function (s) { return s.kind === 'bar'; });
  const inset = hasBars ? 0 : 10;
  const slot = hasBars ? plotW / n : (n > 1 ? (plotW - 2 * inset) / (n - 1) : plotW);
  const xAt = function (i) { return hasBars ? padL + slot * (i + 0.5) : (n > 1 ? padL + inset + slot * i : padL + plotW / 2); };
  const yAt = function (s, v) { return padT + plotH - ((v - s.scale.min) / (s.scale.max - s.scale.min)) * plotH; };

  // Traits horizontaux et graduations (gauche, et droite si un deuxième axe)
  let grid = '', ticksTxt = '';
  refS.scale.ticks.forEach(function (t, k) {
    const y = yAt(refS, t);
    grid += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + y.toFixed(1) + '" class="' + (k === 0 ? 'app-chart-axis' : 'app-chart-grid') + '"/>';
  });
  if (o.zeroLine && refS.scale.min < 0 && refS.scale.max > 0) {
    const zy = yAt(refS, 0);
    grid += '<line x1="' + padL + '" y1="' + zy.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + zy.toFixed(1) + '" class="app-chart-axis"/>';
  }
  if (leftS) {
    leftS.scale.ticks.forEach(function (t) {
      ticksTxt += '<text x="' + (padL - 8) + '" y="' + (yAt(leftS, t) + 4).toFixed(1) + '" text-anchor="end" class="app-chart-tick' + (leftS.cls === 'b' ? ' is-b' : '') + '">' + appEscapeHtml(fmtOf(leftS)(t)) + '</text>';
    });
  }
  if (rightS) {
    rightS.scale.ticks.forEach(function (t) {
      ticksTxt += '<text x="' + (W - padR + 8) + '" y="' + (yAt(rightS, t) + 4).toFixed(1) + '" text-anchor="start" class="app-chart-tick is-b">' + appEscapeHtml(fmtOf(rightS)(t)) + '</text>';
    });
  }

  // Libellés horizontaux : au plus un tous les ~64 px, répartis de façon régulière
  const maxLabels = Math.max(2, Math.floor(plotW / 64));
  const idx = [];
  if (n <= maxLabels) { for (let i = 0; i < n; i++) idx.push(i); }
  else {
    // de préférence un nombre de libellés qui tombe juste (premier et dernier points inclus), sinon un pas régulier
    let count = 0;
    for (let c = maxLabels; c >= 3 && !count; c--) { if ((n - 1) % (c - 1) === 0) count = c; }
    if (count) { for (let k = 0; k < count; k++) idx.push((k * (n - 1)) / (count - 1)); }
    else { const step = Math.ceil((n - 1) / (maxLabels - 1)); for (let i = 0; i < n; i += step) idx.push(i); }
  }
  const xTxt = idx.map(function (i) {
    return labels[i] == null ? '' : '<text x="' + xAt(i).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" class="app-chart-tick">' + appEscapeHtml(labels[i]) + '</text>';
  }).join('');

  // Courbes et barres ; on retient, pour chaque point, le haut du dessin (ancre de la bulle) et les valeurs
  const tops = [], tips = [];
  for (let i = 0; i < n; i++) { tops.push(Infinity); tips.push([]); }
  const barSeries = series.filter(function (s) { return s.kind === 'bar'; });
  const barW = Math.min(22, (slot * 0.7) / Math.max(barSeries.length, 1)), barGap = 3;
  const groupW = barSeries.length * barW + (barSeries.length - 1) * barGap;
  let shapes = '';
  series.forEach(function (s) {
    const c = s.cls === 'b' ? ' is-b' : '';
    const tipFmt = s.tipFmt || s.fmt || appChartNum;
    const j = barSeries.indexOf(s);
    const pts = [];
    s.values.forEach(function (v, i) {
      if (!isNum(v)) return;
      const y = yAt(s, v);
      tops[i] = Math.min(tops[i], y);
      tips[i].push({ l: s.label || '', v: tipFmt(v), c: s.cls === 'b' ? 'b' : 'a' });
      if (s.kind === 'bar') {
        const h = ((v - s.scale.min) / (s.scale.max - s.scale.min)) * plotH;
        if (h > 0) shapes += '<rect x="' + (xAt(i) - groupW / 2 + j * (barW + barGap)).toFixed(1) + '" y="' + (base - h).toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="3" class="app-chart-bar' + c + '"/>';
        tops[i] = Math.min(tops[i], base - h);
      } else {
        pts.push({ x: xAt(i), y: y });
      }
    });
    if (s.kind !== 'bar' && pts.length) {
      const d = pts.map(function (p, k) { return (k ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1); }).join(' ');
      if (s.area && pts.length > 1) {
        shapes += '<path d="M' + pts[0].x.toFixed(1) + ' ' + base + ' ' + pts.map(function (p) { return 'L' + p.x.toFixed(1) + ' ' + p.y.toFixed(1); }).join(' ') + ' L' + pts[pts.length - 1].x.toFixed(1) + ' ' + base + ' Z" class="app-chart-area' + c + '"/>';
      }
      if (pts.length > 1) shapes += '<path d="' + d + '" class="app-chart-line' + c + '"/>';
      shapes += pts.map(function (p) { return '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="4.5" class="app-chart-dot' + c + '"/>'; }).join('');
    }
  });

  // Zones d'appui invisibles : une colonne par point, d'au moins 36 px de large (le point seul est trop petit au doigt)
  let hits = '';
  const hw = Math.max(slot, 36);
  for (let i = 0; i < n; i++) {
    if (!tips[i].length) continue;
    const x0 = Math.max(padL, xAt(i) - hw / 2), x1 = Math.min(W - padR, xAt(i) + hw / 2);
    const tip = { t: (o.tipTitles && o.tipTitles[i]) || labels[i] || '', v: tips[i] };
    hits += '<rect x="' + x0.toFixed(1) + '" y="' + (padT - 8) + '" width="' + (x1 - x0).toFixed(1) + '" height="' + (plotH + 8) + '" class="app-chart-hit" data-ax="' + xAt(i).toFixed(1) + '" data-ay="' + tops[i].toFixed(1) + '" data-tip="' + appEscapeHtml(JSON.stringify(tip)) + '"/>';
  }
  return svgOpen + grid + ticksTxt + xTxt + shapes + hits + svgClose;
}

// Bulle au toucher : un seul gestionnaire pour tous les graphiques de l'appli (délégation sur document)
document.addEventListener('click', function (e) {
  const hit = e.target && e.target.closest ? e.target.closest('.app-chart-hit') : null;
  const wasSelected = !!hit && hit.classList.contains('is-selected');
  document.querySelectorAll('.app-chart-bubble').forEach(function (b) { b.remove(); });
  document.querySelectorAll('.app-chart-hit.is-selected').forEach(function (h) { h.classList.remove('is-selected'); });
  if (!hit || wasSelected) return;
  let tip;
  try { tip = JSON.parse(hit.getAttribute('data-tip')); } catch (err) { return; }
  const wrap = hit.closest('.app-chart-wrap'), svg = hit.ownerSVGElement;
  if (!wrap || !svg) return;
  hit.classList.add('is-selected');

  const bubble = document.createElement('div');
  bubble.className = 'app-chart-bubble';
  bubble.innerHTML =
    (tip.t ? '<div class="app-chart-bubble-title">' + appEscapeHtml(tip.t) + '</div>' : '') +
    tip.v.map(function (r) {
      return '<div class="app-chart-bubble-row"><i class="app-chart-bubble-dot' + (r.c === 'b' ? ' is-b' : '') + '"></i>' +
        (r.l ? '<span class="app-chart-bubble-label">' + appEscapeHtml(r.l) + '</span>' : '') +
        '<span>' + appEscapeHtml(r.v) + '</span></div>';
    }).join('');
  wrap.appendChild(bubble);

  // Position : au-dessus du point (en dessous s'il n'y a pas la place), bulle gardée dans le cadre,
  // pointe (flèche) toujours dirigée vers le point.
  const vb = svg.viewBox.baseVal, sr = svg.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
  const k = sr.width / vb.width;
  const px = sr.left - wr.left + (parseFloat(hit.getAttribute('data-ax')) - vb.x) * k;
  const py = sr.top - wr.top + (parseFloat(hit.getAttribute('data-ay')) - vb.y) * k;
  const bw = bubble.offsetWidth, bh = bubble.offsetHeight, m = 6;
  const cx = Math.min(Math.max(px, bw / 2 + m), wr.width - bw / 2 - m);
  const below = py - bh - 16 < 0;
  bubble.style.left = cx + 'px';
  bubble.style.top = (below ? py + 12 : py - 12) + 'px';
  bubble.style.setProperty('--arrow-dx', (px - cx) + 'px');
  bubble.classList.toggle('is-below', below);
});
