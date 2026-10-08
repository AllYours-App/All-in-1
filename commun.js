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
