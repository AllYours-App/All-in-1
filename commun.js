/* ===========================================================================
   COMMUN — JS partagé entre plusieurs modules
   Chargé sur toutes les pages, après app-shell.js et avant le JS de chaque
   module.
   =========================================================================== */

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
