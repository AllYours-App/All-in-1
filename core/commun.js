/* ===========================================================================
   COMMUN — JS partagé entre plusieurs modules
   Chargé sur toutes les pages, après app-shell.js et avant le JS de chaque
   module.
   =========================================================================== */

/* ---------------------------------------------------------------------------
   THÈME — sombre (par défaut) ou clair. Le thème clair est défini dans
   theme-light.css et s'active avec <html data-theme="light">. Le réglage est
   enregistré dans golfAppState.settings.theme (Menu > Apparence) ; un petit
   script dans le <head> d'index.html le pose avant le premier affichage.
   --------------------------------------------------------------------------- */
function applyAppTheme(theme) {
  const isLight = theme === "light";
  document.documentElement.setAttribute("data-theme", isLight ? "light" : "dark");
  // Couleur de la barre du navigateur (Android, Safari)
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", isLight ? "#f2f5ef" : "#050505");
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
   golfModulePrefs, de la forme { putting: {...}, wedging: {...}, ... }.
   Volontairement séparée de golfAppState (gérée par menu.js, qui la réécrit en
   entier depuis sa propre copie en mémoire).
     appPrefGet(module, clé, valeurParDéfaut)  -> valeur enregistrée ou défaut
     appPrefSet(module, clé, valeur)           -> true | false (écriture via appSafeSetItem)
   --------------------------------------------------------------------------- */
var APP_PREFS_KEY = 'golfModulePrefs';

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

     appSheet({ title, sections: [ { title, items: [ ... ] } ] })  -> fonction close()

   Types d'entrées (items) :
     { type: 'toggle',  label, hint, value: bool, onChange(valeur) }
     { type: 'segment', label, hint, value, options: [{ value, label }], onChange(valeur) }
     { type: 'action',  label, hint, selected: bool, danger: bool, keepOpen: bool, onClick() }
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
  head.appendChild(titleEl);
  head.appendChild(closeBtn);
  var body = appSheetEl('div', 'app-sheet_body');
  sheet.appendChild(handle);
  sheet.appendChild(head);
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
