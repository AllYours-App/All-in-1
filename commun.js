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
