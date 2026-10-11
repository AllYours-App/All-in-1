/* ===========================================================================
   STROKES-GAINED — moteur SG partagé entre les modules (putting, approche, etc.)
   Dépend de sg-data.js (SG_BASELINES). Aucune dépendance au DOM ni à l'état de l'appli.
   Ordre de chargement : commun.js, sg-data.js, strokes-gained.js, puis le JS du module.

   Lies disponibles : 'tee', 'fairway', 'rough', 'sand', 'recovery', 'green'.
   Toutes les distances passées à ces fonctions sont en MÈTRES ; la conversion vers
   l'unité native de la table (yards, ou pieds pour le green) est faite ici.
   =========================================================================== */

const SG_YD_PER_M = 1.0936133;
const SG_FT_PER_M = 3.2808399;

// Distance en mètres -> unité native de la table du lie
function sgToNative(lie, distanceM) {
  return distanceM * (SG_BASELINES[lie].unit === 'ft' ? SG_FT_PER_M : SG_YD_PER_M);
}

// Coups attendus pour finir le trou depuis (lie, distance en mètres).
// Interpolation linéaire entre deux points de la table ; hors table (avant le premier
// ou après le dernier point), on garde la valeur du point le plus proche.
// Retourne null si le lie est inconnu ou la distance invalide.
function sgExpected(lie, distanceM) {
  const base = SG_BASELINES[lie];
  if (!base || distanceM == null || isNaN(distanceM) || distanceM < 0) return null;
  const pts = base.pts;
  const d = sgToNative(lie, distanceM);
  if (d <= pts[0][0]) return pts[0][1];
  const last = pts[pts.length - 1];
  if (d >= last[0]) return last[1];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    if (d >= a[0] && d <= b[0]) {
      return a[1] + ((d - a[0]) / (b[0] - a[0])) * (b[1] - a[1]);
    }
  }
  return last[1];
}

// SG d'un coup = E(départ) - E(arrivée) - coups utilisés.
// endLie = null (ou 'hole') : balle dans le trou, E(arrivée) = 0.
// strokesUsed vaut 1 par défaut ; 2 si le coup a une pénalité (1 coup + 1 de pénalité).
// Retourne null si une entrée est invalide.
function sgShot(startLie, startM, endLie, endM, strokesUsed) {
  const eStart = sgExpected(startLie, startM);
  if (eStart == null) return null;
  let eEnd = 0;
  if (endLie != null && endLie !== 'hole') {
    eEnd = sgExpected(endLie, endM);
    if (eEnd == null) return null;
  }
  const used = strokesUsed == null ? 1 : strokesUsed;
  return eStart - eEnd - used;
}
