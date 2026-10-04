/**
 * script.js — Golf Stats
 * Fichier unique (données + composants + logique d'écran + navigation SPA).
 * Nécessite Chart.js (chargé en CDN dans index.html).
 */
(function () {
  'use strict';

  /* ========================================================================
     1) DONNÉES MOCKÉES — à remplacer par vos appels API (voir commentaires)
     ======================================================================== */

  // API: GET /api/stats/strokes-gained?period=30d
  const strokesGained = {
    total: null,
    categories: [
      { key: 'driving', label: 'Driving', value: null, icon: 'club' },
      { key: 'green', label: 'A.G.', value: null, icon: 'arc' },
      { key: 'wedging', label: 'Wedging', value: null, icon: 'wedge' },
      { key: 'approches', label: 'Approches', value: null, icon: 'bowl' },
      { key: 'putting', label: 'Putting', value: null, icon: 'putter' },
    ],
  };

  // API: GET /api/stats/kpis?period=30d
  const kpiCards = [
    { key: 'fairways', title: 'Fairways touchés', value: null, unit: '%', icon: 'flag' },
    { key: 'gir', title: 'Green touchés', value: null, unit: '%', icon: 'target' },
    { key: 'putts', title: 'Putts par tour', value: null, unit: '', icon: 'putter' },
    { key: 'birdies', title: 'Birdies par tour', value: null, unit: '', icon: 'bird' },
  ];

  // API: GET /api/stats/analyses
  const detailedAnalyses = [
    { key: 'par-club', title: 'Par club', description: 'Performance par club, coups moyens, dispersion, etc.', icon: 'bag', goto: 'par-club' },
    { key: 'par-distance', title: 'Par distance', description: 'Résultats selon la distance initiale : GIR, proximité du trou, score, etc.', icon: 'arc', goto: 'par-distance' },
    { key: 'statistiques', title: 'Statistiques', description: "Vue d'ensemble : scoring, putting, scrambling, tendances, etc.", icon: 'bars', goto: 'statistiques' },
  ];

  // API: GET /api/rounds?limit=6&sort=date_desc
  const roundsHistory = [];

  // API: GET /api/rounds/summary
  const roundsSummary = {
    avgScore: null, avgScoreDelta: null, bestScore: null, bestScoreDelta: null, played: null,
    avgGrossScore: null, avgGrossDelta: null, birdiesTotal: null, doubleBogeyPlus: null,
  };

  // API: GET /api/stats/overview?period=30d&course=all&lie=all
  // Écran "Statistiques" — onglet Multi (aperçu : score, fairway, greens, approches, putts)
  const statsOverview = {
    score: {
      avgGross: null, avgGrossDelta: null, avgNet: null, avgNetDelta: null, avgToPar: null,
      best: null, bestToPar: null, worst: null, worstToPar: null, played: null,
      byDistance: [],
      // Moyenne par partie (nombre de trous de chaque résultat)
      perRound: { eagle: null, birdie: null, par: null, bogey: null, double: null, triple: null },
      // Score moyen par type de trou (par 4 courts / longs = sous / au-dessus de la médiane des par 4)
      byHoleType: { par3: null, par4: null, par5: null, par4Short: null, par4Long: null },
      // Score moyen par portion de parcours (par trou)
      bySegment: { front9: null, back9: null, first6: null, mid6: null, last6: null },
    },
    fairway: {
      hitPct: null, leftPct: null, rightPct: null, avgDistanceHit: null, avgDistanceMiss: null, penaltyPct: null,
      hitPar4: null, hitPar5: null, scoreAfterHit: null, scoreAfterMiss: null,
    },
    approach: {
      girPct: null, proximity: null, under10: null, under20: null, over50: null,
      zones: { center: null, top: null, left: null, right: null, bottom: null },
      greenHitPct: null, girPar3: null, girPar4: null, girPar5: null,
      // Nombre d'attaques de green par zone : 'Centre', 'Green-<dir>', 'Hors-<dir>', 'ND' (raté sans zone précisée)
      zoneCounts: {},
    },
    approches: {
      avgDistance: null, proximity: null, upDownPct: null, upDownBunker: null, upDownNonBunker: null,
      byDistance: [],
      proximityBands: [],
      // [{ type: 'Approches' | 'S. Bunker', count: 0, upDownPct: 0 }]
      byType: [],
      // Approches de récupération (après green raté), 9 zones : 'Centre' + 8 directions
      zoneCounts: { all: {}, nonBunker: {}, bunker: {} },
    },
    putts: {
      perHole: null, perRound: null, perHoleGir: null, perHoleNonGir: null,
      onePutt: null, twoPutt: null, threePlusPutt: null, avgFirstPuttDistance: null,
      byDistance: [],
    },
  };

  // API: GET /api/stats/trends?course=all&rounds=all
  // Onglets Traditionnel et SG de "Statistiques" : une entrée par partie, ordre chronologique.
  // Exemple : { date: '2026-09-12', course: 'Nom du parcours', avgDrive: 231, firPct: 57, girPct: 44,
  //             putts: 32, puttsPerGir: 1.78, sg: { total: 0.4, driving: 0.1, approach: -0.2, shortGame: 0.3, putting: 0.2 } }
  const trendRounds = [];

  // API: GET /api/stats/par-club?tabs=driving&rounds=all&course=all&lie=all
  // Écran "Par club". Chaque métrique = { All: valeur, '<club>': valeur } (null tant que non disponible).
  const clubInsights = {
    clubs: [], // clubs réellement joués (ordre du sac) ; vide → repli sur Menu > Mon sac de golf
    metrics: {
      sg: {}, distance: {}, fairways: {}, gir: {}, birdies: {}, scrambling: {}, upDown: {}, shotsPerRound: {},
    },
    // Putting : clés = tranches de distance (PUTT_BUCKETS)
    putting: { sg: {}, makeRate: {}, threePutt: {}, puttsPerGir: {}, holesPer3Putt: {} },
    // Attaques de green par club : { All: { 'Centre': n, 'Green-Long': n, 'Hors-Court': n, 'ND': n, ... }, '<club>': {...} }
    zoneCounts: {},
  };

  // API: GET /api/stats/par-distance?rounds=all&course=all&lie=all
  // Écran "Par distance". Tableaux de 11 valeurs, dans l'ordre de DISTANCE_BUCKETS.
  const distanceInsights = {
    sg: [], proximity: [], shotsPerRound: [],
    // Attaques de green par tranche : { '<tranche>': { 'Centre': n, 'Green-Long': n, ... } }
    zoneCounts: {},
  };

  // API: GET /api/stats/putting?range=20-rounds
  const puttingPerformance = {
    value: null, delta: null, compareLabel: 'vs période précédente',
    points: [],
  };

  // Note : la liste de parcours doit être alimentée dynamiquement (parcours réellement joués par l'utilisateur).
  const DEFAULT_FILTERS = {
    period: { key: 'period', icon: 'calendar', label: '30 derniers jours', options: ['7 derniers jours', '30 derniers jours', '90 derniers jours', 'Cette saison', 'Tout'] },
    course: { key: 'course', icon: 'flag', label: 'Tous parcours', options: ['Tous parcours'] },
    lie: { key: 'lie', icon: 'sliders', label: 'Tous lies', options: ['Tous lies', 'Fairway', 'Rough', 'Bunker'] },
  };

  // Listes et valeurs par défaut du popup "Nouveau parcours" (les parcours viennent de l'API, voir loadNearbyCourses)
  const newRoundOptions = {
    tee: [
      { value: 'black', label: 'Noir', color: '#05070A', edge: 'rgba(255,255,255,0.7)' },
      { value: 'white', label: 'Blanc', color: '#FFFFFF' },
      { value: 'yellow', label: 'Jaune', color: '#FFE600' },
      { value: 'blue', label: 'Bleu', color: '#0A6EF0' },
      { value: 'red', label: 'Rouge', color: '#E0141E' },
    ],
    // Premier trou joué, puis nombre de trous (18 depuis le 10 enchaîne sur le 1)
    start: [
      { value: '1', label: '1*', aria: 'Commencer au trou 1' },
      { value: '10', label: '10*', aria: 'Commencer au trou 10' },
    ],
    count: [
      { value: '9', label: '9', aria: '9 trous' },
      { value: '18', label: '18', aria: '18 trous' },
    ],
    weather: [
      { value: 'current', label: 'Conditions actuelles' },
      { value: 'sunny', label: 'Ensoleillé' },
      { value: 'cloudy', label: 'Nuageux' },
      { value: 'rain', label: 'Pluie' },
    ],
    wind: [
      { value: 'low', label: 'Faible' },
      { value: 'medium', label: 'Modéré' },
      { value: 'strong', label: 'Fort' },
    ],
    defaults: {
      mode: 'saisie-rapide', // ou 'saisie-detaillee'
      tee: 'yellow', start: '1', count: '18', weather: 'current', wind: 'low',
    },
  };

  /* ========================================================================
     2) ICÔNES SVG INLINE
     ======================================================================== */

  const STROKE = 'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"';
  const ICONS = {
    back: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M15 18l-6-6 6-6"/></svg>`,
    menu: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>`,
    chevronRight: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M9 18l6-6-6-6"/></svg>`,
    chevronDown: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M6 9l6 6 6-6"/></svg>`,
    trendUp: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M4 16l6-6 4 4 6-8"/><path d="M14 6h6v6"/></svg>`,
    trendDown: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M4 8l6 6 4-4 6 8"/><path d="M14 18h6v-6"/></svg>`,
    club: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M6 21l7-16"/><path d="M13 5l4 1.2-1 3.2-4.2-1.1"/></svg>`,
    flag: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M6 21V4"/><path d="M6 4l11 3-11 3"/></svg>`,
    bowl: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M4 12h16a8 6 0 01-16 0z"/><path d="M9 8c0-1.7 1.3-3 3-3s3 1.3 3 3"/></svg>`,
    wedge: `<svg viewBox="0 0 24 24" ${STROKE}><line x1="18" y1="3" x2="9" y2="17"/><path d="M9 17l-4 4.2"/><path d="M5 21.2c1.6.5 3.4-.2 4-1.6"/></svg>`,
    putter: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M8 21l6-17"/><path d="M14 4l3 1-.8 2.6L13 6.6"/><path d="M5.5 20.5h5"/></svg>`,
    target: `<svg viewBox="0 0 24 24" ${STROKE}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.6" fill="currentColor"/></svg>`,
    bird: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M4 13c2-4 6-6 10-5-1-2 0-3 2-3 0 2 1 3 3 3-1 3-3 5-6 5-1 3-4 5-9 5 2-1 3-2 3-4-1 0-2-.4-3-1z"/></svg>`,
    bag: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M7 21V9a5 5 0 0110 0v12"/><path d="M4 21h16"/><path d="M9 9V6a3 3 0 016 0v3"/></svg>`,
    arc: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M4 18c2-8 6-13 10-13"/><path d="M20 18l-6-4"/><path d="M14 14l3-1 1 3"/></svg>`,
    bars: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M5 20V11"/><path d="M12 20V6"/><path d="M19 20v-7"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24" ${STROKE}><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17"/><path d="M8 3v4M16 3v4"/></svg>`,
    sliders: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M4 6h9M17 6h3M4 12h3M9 12h11M4 18h13M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="7" cy="12" r="2"/><circle cx="17" cy="18" r="2"/></svg>`,
    info: `<svg viewBox="0 0 24 24" ${STROKE}><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5"/><circle cx="12" cy="8" r="0.6" fill="currentColor"/></svg>`,
    search: `<svg viewBox="0 0 24 24" ${STROKE}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>`,
    sort: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M7 4v16M7 4l-3 3M7 4l3 3"/><path d="M17 20V4M17 20l3-3M17 20l-3-3"/></svg>`,
    close: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M6 6l12 12M18 6L6 18"/></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>`,
    weather: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M7 20h8.5a3.5 3.5 0 00.3-7A5 5 0 006.4 14.3 3.1 3.1 0 007 20z"/><circle cx="17" cy="6.5" r="2.4"/><path d="M17 2v1M21.5 6.5h-1M12.5 6.5h1M20.2 3.3l-.7.7M13.8 3.3l.7.7"/></svg>`,
    wind: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M3 8h10a2.5 2.5 0 10-2.5-2.5"/><path d="M3 12h15a2.5 2.5 0 11-2.5 2.5"/><path d="M3 16h7a2 2 0 11-2 2"/></svg>`,
  };
  function icon(name) { return ICONS[name] || ''; }

  /* ========================================================================
     3) UTILITAIRES
     ======================================================================== */

  function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

  // Affiche "--" tant qu'une donnée n'est pas encore disponible (null/undefined), sinon valeur + suffixe.
  function fmt(value, suffix) {
    if (value === null || value === undefined || Number.isNaN(value)) return '--';
    return `${value}${suffix || ''}`;
  }

  // Valeur signée pour les Strokes Gained (+0.4 / -0.2 / --).
  function fmtSigned(value) {
    if (value === null || value === undefined || Number.isNaN(value)) return '--';
    return `${value > 0 ? '+' : ''}${value}`;
  }

  function hexToRgba(hex, alpha) {
    const h = hex.replace('#', '');
    const bigint = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
    const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function mulberry32(a) {
    return function () {
      let t = (a += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /** Anime la montée des valeurs [data-count-to] présentes dans `root`. */
  function animateCounters(root, duration) {
    duration = duration || 700;
    root.querySelectorAll('[data-count-to]').forEach((el) => {
      const target = parseFloat(el.dataset.countTo);
      if (Number.isNaN(target)) return;
      const decimals = (el.dataset.countTo.split('.')[1] || '').length;
      const suffix = el.dataset.countSuffix || '';
      const prefix = el.dataset.countPrefix || '';
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${prefix}${(target * eased).toFixed(decimals)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  function applyChartDefaults() {
    if (typeof Chart === 'undefined') return;
    Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = cssVar('--color-text-secondary') || 'rgba(255,255,255,0.65)';
    Chart.defaults.plugins.legend.display = false;
    Chart.defaults.animation.easing = 'easeOutQuart';
  }

  /* ========================================================================
     4) COMPOSANT — Sparkline (mini graphique KPI)
     ======================================================================== */

  // Ne casse jamais l'écran si Chart.js n'a pas pu se charger (CDN bloqué,
  // hors-ligne...) : le graphique est simplement ignoré, le reste de l'UI reste intact.
  function createSparkline(canvas, values, positive) {
    if (typeof Chart === 'undefined' || !canvas) return null;
    const color = positive ? cssVar('--color-accent') : cssVar('--color-negative');
    try {
      return new Chart(canvas, {
      type: 'line',
      data: {
        labels: values.map((_, i) => i),
        datasets: [{
          data: values, borderColor: color, borderWidth: 2, pointRadius: 0, tension: 0.35, fill: true,
          backgroundColor: (ctx) => {
            const { chartArea, ctx: c } = ctx.chart;
            if (!chartArea) return 'transparent';
            const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, hexToRgba(color, 0.35));
            gradient.addColorStop(1, hexToRgba(color, 0));
            return gradient;
          },
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 700, easing: 'easeOutQuart' },
        interaction: { intersect: false },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
      },
      });
    } catch (err) {
      console.warn('Sparkline non créée :', err);
      return null;
    }
  }

  /* ========================================================================
     5) COMPOSANT — KPI Card
     ======================================================================== */

  function renderKpiCard(kpi, index) {
    // Carte non interactive : symbole, titre, valeur (dimensions identiques via CSS).
    return `
      <article class="card kpi-card fade-up" style="--fade-index:${index}" data-kpi="${kpi.key}">
        <div class="kpi-card__top">
          <div class="icon-badge">${icon(kpi.icon)}</div>
          <div class="kpi-card__value">${fmt(kpi.value)}<sup>${kpi.unit}</sup></div>
        </div>
        <div class="kpi-card__title">${kpi.title}</div>
      </article>
    `;
  }

  /* ========================================================================
     6) COMPOSANT — Segmented Control
     ======================================================================== */

  function initSegmentedControl(root, items, active, onChange) {
    root.style.setProperty('--seg-count', items.length);
    root.setAttribute('role', 'tablist');
    root.innerHTML = `
      <div class="segmented__thumb" style="--seg-index:${active}" aria-hidden="true"></div>
      ${items.map((label, i) => `<button type="button" class="segmented__btn" role="tab" aria-selected="${i === active}" data-index="${i}">${label}</button>`).join('')}
    `;
    const thumb = root.querySelector('.segmented__thumb');
    const buttons = [...root.querySelectorAll('.segmented__btn')];
    function setActive(index) {
      buttons.forEach((btn, i) => btn.setAttribute('aria-selected', String(i === index)));
      thumb.style.setProperty('--seg-index', index);
    }
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = Number(btn.dataset.index);
        setActive(i);
        if (onChange) onChange(i, items[i]);
      });
    });
  }

  /* ========================================================================
     7) COMPOSANT — Filter Bar
     ======================================================================== */

  // Boutons de tri (style du putting) : petit titre au-dessus, valeur courante en dessous
  const FILTER_TITLES = { rounds: 'Période', period: 'Période', range: 'Période', course: 'Parcours', lie: 'Lie', distance: 'Distance' };
  function chipValue(label) {
    return String(label)
      .replace(/^Tous parcours$/, 'Tous')
      .replace(/^Tous lies$/, 'Tous')
      .replace(/^Toutes distances$/, 'Toutes')
      .replace(/^(\d+) derniers (?:parcours|rounds)$/, '$1 derniers')
      .replace(/^(\d+) derniers jours$/, '$1 jours');
  }

  function renderFilterBar(root, filters, onChange) {
    root.innerHTML = filters.map((f) => `
      <div class="filter-chip-wrap" style="position:relative; flex:1 1 0; min-width:0;">
        <button type="button" class="analyse-filter${FILTER_TITLES[f.key] === 'Période' ? ' is-active' : ''}" data-key="${f.key}" aria-haspopup="listbox" aria-expanded="false">
          <span class="analyse-filter_label">${FILTER_TITLES[f.key] || f.key}</span>
          <span class="analyse-filter_value"><span class="filter-value-text" data-label>${chipValue(f.label)}</span>${icon('chevronDown')}</span>
        </button>
      </div>
    `).join('');

    function closeAll() {
      root.querySelectorAll('.filter-dropdown').forEach((d) => d.remove());
      root.querySelectorAll('.analyse-filter').forEach((c) => c.setAttribute('aria-expanded', 'false'));
    }

    filters.forEach((f) => {
      const chip = root.querySelector(`.analyse-filter[data-key="${f.key}"]`);
      const wrap = chip.parentElement;
      chip.addEventListener('click', () => {
        const existing = wrap.querySelector('.filter-dropdown');
        closeAll();
        if (existing) return;
        const dropdown = document.createElement('div');
        dropdown.className = 'filter-dropdown';
        Object.assign(dropdown.style, {
          position: 'absolute', top: 'calc(100% + 6px)',
          ...(wrap === root.lastElementChild && filters.length > 2 ? { right: '0' } : { left: '0' }),
          background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)', padding: '6px', zIndex: 'var(--z-dropdown)',
          minWidth: '160px', boxShadow: 'var(--shadow-card-hover)',
        });
        dropdown.innerHTML = f.options.map((opt) => `
          <button type="button" class="filter-dropdown__opt" style="display:block;width:100%;text-align:left;
            background:none;border:none;color:var(--color-text-primary);padding:8px 10px;font-size:var(--fs-sm);
            border-radius:var(--radius-sm);cursor:pointer;">${opt}</button>
        `).join('');
        dropdown.querySelectorAll('.filter-dropdown__opt').forEach((btn, i) => {
          btn.addEventListener('mouseenter', () => btn.style.background = 'var(--color-bg-card-hover)');
          btn.addEventListener('mouseleave', () => btn.style.background = 'transparent');
          btn.addEventListener('click', () => {
            chip.querySelector('[data-label]').textContent = chipValue(f.options[i]);
            if (onChange) onChange(f.key, f.options[i]);
            dropdown.remove();
            chip.setAttribute('aria-expanded', 'false');
          });
        });
        wrap.appendChild(dropdown);
        chip.setAttribute('aria-expanded', 'true');
      });
    });

    document.addEventListener('click', (e) => { if (!root.contains(e.target)) closeAll(); });
  }

  /* ========================================================================
     8) COMPOSANT — Historical List (carte / tableau)
     ======================================================================== */

  function scoreDiffHtml(vsPar) {
    const cls = vsPar > 0 ? 'round-row__score-diff--pos' : 'round-row__score-diff--neg';
    return `<span class="round-row__score-diff ${cls}">${vsPar > 0 ? '+' : ''}${vsPar}</span>`;
  }

  function renderRoundList(container, rounds, onSelect) {
    container.innerHTML = rounds.length ? `
      <div class="round-list">
        ${rounds.map((r) => `
          <div class="round-row" role="button" tabindex="0" data-id="${r.id}">
            <div class="round-row__thumb" style="display:flex;align-items:center;justify-content:center;color:var(--color-text-tertiary);">${icon('flag')}</div>
            <div class="round-row__info">
              <div class="round-row__course">${r.course}</div>
              <div class="round-row__location">${r.city.split(',')[0]}</div>
            </div>
            <div class="round-row__stat"><div class="round-row__stat-value">${r.fir}/14</div><div class="round-row__stat-label">FIR</div></div>
            <div class="round-row__stat"><div class="round-row__stat-value">${r.gir}/18</div><div class="round-row__stat-label">GIR</div></div>
            <div class="round-row__score"><div class="round-row__score-value">${r.score}</div>${scoreDiffHtml(r.vsPar)}</div>
            <div class="round-row__chevron">${icon('chevronRight')}</div>
          </div>
        `).join('')}
      </div>
    ` : '<p style="color:var(--color-text-tertiary); text-align:center; padding:var(--space-xl) 0;">Aucun round trouvé.</p>';
    if (onSelect) {
      container.querySelectorAll('[data-id]').forEach((row) => {
        const round = rounds.find((r) => r.id === row.dataset.id);
        row.addEventListener('click', () => onSelect(round));
      });
    }
  }

  function renderRoundTable(container, rounds, onSelect) {
    const fmtDate = (iso) => new Date(iso).toLocaleDateString('fr-FR');
    container.innerHTML = rounds.length ? `
      <div class="round-list">
        ${rounds.map((r) => `
          <div class="round-row round-row--table" role="button" tabindex="0" data-id="${r.id}">
            <div class="round-row__date">${fmtDate(r.date)}</div>
            <div class="round-row__info">
              <div class="round-row__course">${r.course}</div>
              <div class="round-row__location">${r.city}</div>
            </div>
            <div class="round-row__score"><div class="round-row__score-value">${r.score}</div>${scoreDiffHtml(r.vsPar)}</div>
            <div class="round-row__chevron">${icon('chevronRight')}</div>
          </div>
        `).join('')}
      </div>
    ` : '<p style="color:var(--color-text-tertiary); text-align:center; padding:var(--space-xl) 0;">Aucun round trouvé.</p>';
    if (onSelect) {
      container.querySelectorAll('[data-id]').forEach((row) => {
        const round = rounds.find((r) => r.id === row.dataset.id);
        row.addEventListener('click', () => onSelect(round));
      });
    }
  }

  /* ========================================================================
     9) COMPOSANT — Performance Chart (générique)
     ======================================================================== */

  const dataLabelPlugin = {
    id: 'valueLabels',
    afterDatasetsDraw(chart) {
      const opts = chart.options.plugins.valueLabels;
      if (opts && opts.display === false) return;
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(chart.data.datasets.length - 1);
      ctx.save();
      ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = cssVar('--color-text-primary') || '#fff';
      ctx.textAlign = 'center';
      meta.data.forEach((point, i) => {
        const val = chart.data.datasets[chart.data.datasets.length - 1].data[i];
        if (val === null || val === undefined) return;
        ctx.fillText(String(val), point.x, point.y - 12);
      });
      ctx.restore();
    },
  };

  function createPerformanceChart(canvas, points, variant, axisTitles) {
    if (typeof Chart === 'undefined' || !canvas) return null;
    variant = variant || 'line';
    const accent = cssVar('--color-accent');
    const gridColor = cssVar('--color-border');
    const textColor = cssVar('--color-text-secondary');
    const labels = points.map((p) => p.x);
    const values = points.map((p) => p.y);

    const lineDataset = {
      type: 'line', label: 'Valeur', data: values, borderColor: accent, backgroundColor: hexToRgba(accent, 0.15),
      borderWidth: 2.5, pointRadius: 4, pointBackgroundColor: accent, pointBorderColor: cssVar('--color-bg-card'),
      pointBorderWidth: 2, pointHoverRadius: 6, tension: 0.35, fill: variant === 'line', order: 1,
    };
    const datasets = [lineDataset];
    if (variant === 'bar-line') {
      datasets.unshift({ type: 'bar', label: 'Volume', data: values, backgroundColor: hexToRgba(accent, 0.18), borderRadius: 6, barPercentage: 0.5, order: 2 });
    }

    try {
      return new Chart(canvas, {
      type: variant === 'bar-line' ? 'bar' : 'line',
      data: { labels, datasets },
      plugins: [dataLabelPlugin],
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 900, easing: 'easeOutQuart' },
        interaction: { mode: 'index', intersect: false },
        layout: { padding: { top: 24 } },
        plugins: {
          legend: { display: false },
          valueLabels: { display: points.length <= 10 },
          tooltip: { backgroundColor: cssVar('--color-bg-elevated'), borderColor: gridColor, borderWidth: 1, titleColor: textColor, bodyColor: '#fff', padding: 10, cornerRadius: 10, displayColors: false },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: textColor, font: { size: 11 } }, title: { display: !!(axisTitles && axisTitles.xTitle), text: axisTitles && axisTitles.xTitle, color: textColor, font: { size: 11 } } },
          y: { grid: { color: gridColor, drawTicks: false }, border: { display: false }, ticks: { color: textColor, font: { size: 11 } }, title: { display: !!(axisTitles && axisTitles.yTitle), text: axisTitles && axisTitles.yTitle, color: textColor, font: { size: 11 } } },
        },
      },
      });
    } catch (err) {
      console.warn('Graphique de performance non créé :', err);
      return null;
    }
  }

  /* ========================================================================
     10) COMPOSANT — Analysis Card + schémas Fairway / Approach / Dispersion
     ======================================================================== */

  function renderAnalysisCard(item, index) {
    const disabled = !item.goto;
    const tag = disabled ? 'div' : 'button';
    const attrs = disabled
      ? 'class="card analysis-card analysis-card--disabled fade-up"'
      : `type="button" data-goto="${item.goto}" class="card card--interactive analysis-card fade-up"`;
    return `
      <${tag} ${attrs} style="--fade-index:${index};">
        <div class="analysis-card__top">
          <div class="analysis-card__icon">${icon(item.icon)}</div>
          <span class="analysis-card__info" role="button" aria-label="${item.description}" onclick="event.stopPropagation(); var o = this.classList.contains('is-open'); document.querySelectorAll('.analysis-card__info.is-open').forEach(function (el) { el.classList.remove('is-open'); }); if (!o) this.classList.add('is-open');">i</span>
        </div>
        <div class="analysis-card__title">${item.title}</div>
        <div class="analysis-card__arrow">${icon('chevronRight')}</div>
      </${tag}>
    `;
  }

  // Multi réutilise les images de la saisie (FondFairwaySaisieRapide, FondGreenRond) via findImage()
  const multiImages = { fairway: null, green: { url: null, ratio: 1 } };
  let multiImagesPromise = null;
  function loadMultiImages() {
    if (!multiImagesPromise) {
      multiImagesPromise = Promise.all([findImage(FAIRWAY_BG_BASE), findImage(GREEN_BG_BASE)]).then(([fairwayUrl, greenUrl]) => {
        multiImages.fairway = fairwayUrl;
        multiImages.green.url = greenUrl;
        if (!greenUrl) return null;
        return new Promise((resolve) => {
          const probe = new Image();
          probe.onload = () => {
            if (probe.naturalWidth > 0 && probe.naturalHeight > 0) multiImages.green.ratio = probe.naturalWidth / probe.naturalHeight;
            resolve();
          };
          probe.onerror = resolve;
          probe.src = greenUrl;
        });
      });
    }
    return multiImagesPromise;
  }

  // Variables CSS lues par .saisie-rapide_map.is-green (image + proportions)
  const greenMapStyle = () => `style="--qr-green-ratio:${multiImages.green.ratio};${multiImages.green.url ? ` --qr-green-bg:url('${multiImages.green.url}');` : ''}"`;

  function renderFairwayMap(data) {
    const fairwayStyle = multiImages.fairway ? ` style="background-image:url('${multiImages.fairway}')"` : '';
    const item = (value, caption) => `<div class="multi-fairway_item"><span class="multi-fairway_value">${value}</span><span class="multi-fairway_caption">${caption}</span></div>`;
    return `
      <div class="field-map-layout">
        <div class="saisie-detaillee_fairway-stage">
          <div class="saisie-rapide_map is-fairway"${fairwayStyle}></div>
          <div class="multi-fairway_labels">
            ${item(fmt(data.leftPct, '%'), 'Gauche')}
            ${item(fmt(data.hitPct, '%'), 'Touchés')}
            ${item(fmt(data.rightPct, '%'), 'Droite')}
          </div>
        </div>
        <div class="field-map__side-table">
          <div class="field-map__row"><span class="field-map__row-label">Fairways touchés</span><span class="field-map__row-value">${fmt(data.hitPct, '%')}</span></div>
          <div class="field-map__row"><span class="field-map__row-label">Ratés gauche</span><span class="field-map__row-value">${fmt(data.leftPct, '%')}</span></div>
          <div class="field-map__row"><span class="field-map__row-label">Ratés droite</span><span class="field-map__row-value">${fmt(data.rightPct, '%')}</span></div>
          <div class="field-map__row"><span class="field-map__row-label">Distance moy. (touché)</span><span class="field-map__row-value">${fmt(data.avgDistanceHit, ' m')}</span></div>
          <div class="field-map__row"><span class="field-map__row-label">Distance moy. (raté)</span><span class="field-map__row-value">${fmt(data.avgDistanceMiss, ' m')}</span></div>
          <div class="field-map__row"><span class="field-map__row-label">Penalty</span><span class="field-map__row-value">${fmt(data.penaltyPct, '%')}</span></div>
        </div>
      </div>
    `;
  }

  function renderApproachMap(data) {
    const z = data.zones;
    const label = (pos, value, caption) => `<div class="field-map__label" style="${pos}"><span class="field-map__label-value">${value}</span><span class="field-map__label-caption">${caption}</span></div>`;
    return `
      <div class="field-map-layout">
        <div class="saisie-rapide_map is-green" ${greenMapStyle()}>
          <div class="multi-green_overlay">
            ${label('top:10%; left:50%; transform:translateX(-50%);', fmt(z.top, '%'), 'Long')}
            ${label('top:46%; left:12%;', fmt(z.left, '%'), 'Gauche')}
            ${label('top:44%; left:50%; transform:translateX(-50%);', fmt(z.center, '%'), 'GIR')}
            ${label('top:46%; right:10%;', fmt(z.right, '%'), 'Droite')}
            ${label('bottom:6%; left:50%; transform:translateX(-50%);', fmt(z.bottom, '%'), 'Court')}
          </div>
        </div>
        <div class="field-map__side-table">
          <div class="field-map__row"><span class="field-map__row-label">Greens en régulation</span><span class="field-map__row-value">${fmt(data.girPct, '%')}</span></div>
          <div class="field-map__row"><span class="field-map__row-label">Proximité du trou</span><span class="field-map__row-value">${fmt(data.proximity, ' m')}</span></div>
          <div class="field-map__row"><span class="field-map__row-label">Approches &lt; 10 m</span><span class="field-map__row-value">${fmt(data.under10, '%')}</span></div>
          <div class="field-map__row"><span class="field-map__row-label">Approches &lt; 20 m</span><span class="field-map__row-value">${fmt(data.under20, '%')}</span></div>
          <div class="field-map__row"><span class="field-map__row-label">Approches &gt; 50 m</span><span class="field-map__row-value">${fmt(data.over50, '%')}</span></div>
        </div>
      </div>
    `;
  }

  /**
   * Roue de dispersion de Multi : mêmes image et même découpage que la roue de la saisie
   * (trou 7 %, green 60 % de l'image, 8 secteurs prolongés jusqu'au bord), avec des pourcentages au lieu d'une sélection.
   * mode 'green17' : Centre + Green-<dir> + Hors-<dir> ; mode 'nine' : Centre + 8 directions.
   */
  function renderGreenWheelMap(counts, mode) {
    counts = counts || {};
    const nine = mode === 'nine';
    const keys = nine
      ? ['Centre', ...WHEEL_DIRECTIONS]
      : ['Centre', ...WHEEL_DIRECTIONS.map((d) => `Green-${d}`), ...WHEEL_DIRECTIONS.map((d) => `Hors-${d}`)];
    const nd = nine ? 0 : (counts.ND || 0);
    const total = keys.reduce((sum, k) => sum + (counts[k] || 0), 0) + nd;
    const pctOf = (k) => (total ? Math.round(((counts[k] || 0) / total) * 100) : null);
    const opacity = (pct) => (pct === null ? 0 : Math.min(0.75, 0.08 + pct / 100 * 0.9)).toFixed(2);

    const vw = 200, vh = vw / multiImages.green.ratio, cx = vw / 2, cy = vh / 2;
    const base = Math.min(vw, vh);
    const rGreen = base * 0.6 / 2, rHole = base * 0.07 / 2, rFar = Math.hypot(vw, vh);
    const rad = (d) => (d - 90) * Math.PI / 180;
    const pt = (r, d) => `${(cx + r * Math.cos(rad(d))).toFixed(2)} ${(cy + r * Math.sin(rad(d))).toFixed(2)}`;
    const sector = (rIn, rOut, a0, a1) => `M ${pt(rOut, a0)} A ${rOut} ${rOut} 0 0 1 ${pt(rOut, a1)} L ${pt(rIn, a1)} A ${rIn} ${rIn} 0 0 0 ${pt(rIn, a0)} Z`;
    const edge = (deg) => {
      const s = Math.abs(Math.sin(deg * Math.PI / 180)), c = Math.abs(Math.cos(deg * Math.PI / 180));
      return Math.min(s > 1e-9 ? cx / s : Infinity, c > 1e-9 ? cy / c : Infinity);
    };
    const text = (r, deg, pct, extra) => {
      const a = rad(deg);
      return `<text x="${(cx + r * Math.cos(a)).toFixed(2)}" y="${(cy + r * Math.sin(a)).toFixed(2)}" class="multi-wheel_text${pct === null ? ' is-empty' : ''}${extra || ''}" text-anchor="middle" dominant-baseline="central">${pct === null ? '--' : `${pct}%`}</text>`;
    };

    let paths = '', labels = '';
    WHEEL_DIRECTIONS.forEach((dir, i) => {
      const mid = i * 45, a0 = mid - 22.5, a1 = a0 + 45, e = edge(mid);
      if (nine) {
        const p = pctOf(dir);
        paths += `<path d="${sector(rHole, rFar, a0, a1)}" class="multi-wheel_sector" style="fill-opacity:${opacity(p)}"/>`;
        labels += text((rHole + e) / 2, mid, p);
      } else {
        const pOut = pctOf(`Hors-${dir}`), pIn = pctOf(`Green-${dir}`);
        paths += `<path d="${sector(rGreen, rFar, a0, a1)}" class="multi-wheel_sector" style="fill-opacity:${opacity(pOut)}"/>`;
        paths += `<path d="${sector(rHole, rGreen, a0, a1)}" class="multi-wheel_sector" style="fill-opacity:${opacity(pIn)}"/>`;
        labels += text((rGreen + e) / 2, mid, pOut) + text((rHole + rGreen) / 2, mid, pIn);
      }
    });
    const pCenter = pctOf('Centre');
    const ndPct = total ? Math.round((nd / total) * 100) : null;

    return `
      <div class="saisie-rapide_map is-green" ${greenMapStyle()}>
        <svg viewBox="0 0 ${vw} ${vh.toFixed(2)}" class="saisie-rapide_wheel" role="img" aria-label="Dispersion des coups">
          ${paths}
          <circle cx="${cx}" cy="${cy}" r="${rHole}" class="multi-wheel_sector" style="fill-opacity:${opacity(pCenter)}"/>
          ${labels}
          ${text(0, 0, pCenter, ' is-center')}
        </svg>
      </div>
      ${!nine ? `<div class="multi-wheel_note">Hors green non précisé : ${ndPct === null ? '--' : `${ndPct}%`}</div>` : ''}
    `;
  }

  const DISPERSION_COLORS = { under10: '#8fd13f', under20: '#6fa82f', under50: '#4c7a22', over50: 'rgba(255,255,255,0.35)' };

  function renderDispersionLegend(proximityBands) {
    return `<div class="dot-legend">${proximityBands.map((b) => `
      <span class="dot-legend__item"><span class="dot-legend__dot" style="background:${DISPERSION_COLORS[b.key]}"></span>${b.label} · ${b.pct}%</span>
    `).join('')}</div>`;
  }

  function createDispersionChart(canvas, proximityBands) {
    if (typeof Chart === 'undefined' || !canvas) return null;
    const rand = mulberry32(42);
    const groups = proximityBands.map((band) => ({
      ...band, color: DISPERSION_COLORS[band.key],
      points: Array.from({ length: Math.max(3, Math.round(band.pct / 4)) }, () => {
        const radius = { under10: 0.4, under20: 0.7, under50: 1, over50: 1.3 }[band.key];
        const angle = rand() * Math.PI * 2;
        const r = rand() * radius;
        return { x: Math.cos(angle) * r, y: Math.sin(angle) * r };
      }),
    }));
    try {
      return new Chart(canvas, {
        type: 'scatter',
        data: { datasets: groups.map((g) => ({ label: g.label, data: g.points, backgroundColor: g.color, pointRadius: 4, pointHoverRadius: 5 })) },
        options: {
          responsive: true, maintainAspectRatio: false, animation: { duration: 700 },
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false, min: -1.4, max: 1.4 }, y: { display: false, min: -1.4, max: 1.4 } },
        },
      });
    } catch (err) {
      console.warn('Graphique de dispersion non créé :', err);
      return null;
    }
  }

  /* ========================================================================
     10 bis) HELPERS "INSIGHTS" — barres horizontales, puces, roue du green, tableaux
     Partagés par les écrans Par club, Par distance et Statistiques.
     ======================================================================== */

  function fmtNum(value, decimals, suffix) {
    if (value === null || value === undefined || Number.isNaN(value)) return '--';
    const f = Math.pow(10, decimals === undefined ? 1 : decimals);
    return `${Math.round(value * f) / f}${suffix || ''}`;
  }

  const fmtSG = (v) => `${v > 0 ? '+' : ''}${v.toFixed(2)}`;
  const pickValue = (map, key) => (map && map[key] !== undefined ? map[key] : null);
  const isEmptyValue = (v) => v === null || v === undefined || Number.isNaN(v);

  // Échelle lisible (pas de 1 / 2 / 5 × 10^n, ~4 intervalles) pour l'axe des graphes en barres.
  function niceScale(min, max) {
    const span = (max - min) || 1;
    const rawStep = span / 4;
    const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const norm = rawStep / mag;
    const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
    const niceMin = Math.floor(min / step) * step;
    const niceMax = Math.ceil(max / step) * step;
    const count = Math.round((niceMax - niceMin) / step);
    const ticks = Array.from({ length: count + 1 }, (_, i) => +(niceMin + i * step).toFixed(6));
    return { min: niceMin, max: niceMax, step, ticks };
  }

  /**
   * Graphe en barres horizontales (une ligne = { label, value }).
   * opts.centered : barres centrées sur 0 (strokes gained) ; sinon depuis 0.
   * opts.unit     : suffixe collé aux valeurs affichées ('%', ' m'…).
   * opts.caption  : légende d'unité sous le titre, comme dans les cartes de tendance, ex. "(%)".
   * opts.format   : formatage du nombre (avant ajout de l'unité).
   */
  function renderBarChart(title, rows, opts) {
    opts = opts || {};
    const centered = !!opts.centered;
    const unit = opts.unit || '';
    const format = opts.format || ((v) => v.toFixed(1));
    const defined = rows.filter((r) => !isEmptyValue(r.value));
    const maxAbs = defined.length ? Math.max(...defined.map((r) => Math.abs(r.value)), 0.01) : 0.01;

    // Échelle lisible ; les graduations sont placées en % de la piste pour tomber pile sous les barres
    const nice = niceScale(0, maxAbs);
    const scaleMax = nice.max || maxAbs;
    let ticks = nice.ticks;
    if (centered) {
      const n = Math.round(nice.max / nice.step);
      ticks = Array.from({ length: n * 2 + 1 }, (_, i) => +((i - n) * nice.step).toFixed(6));
    }
    const tickPos = (t) => (centered ? 50 + (t / scaleMax) * 50 : (t / scaleMax) * 100);
    const axisHtml = `
      <div class="insights_bar-axis">
        <span></span>
        <div class="insights_bar-ticks">${ticks.map((t) => `<span style="left:${tickPos(t).toFixed(2)}%">${fmtSigned0(t, centered)}</span>`).join('')}</div>
        <span></span>
      </div>`;

    const rowsHtml = rows.map((r) => {
      const empty = isEmptyValue(r.value);
      let fill = '';
      if (!empty) {
        if (centered) {
          const pct = Math.min(50, Math.abs(r.value) / scaleMax * 50);
          fill = `<div class="insights_bar-fill ${r.value >= 0 ? 'is-pos' : 'is-neg'}" style="${r.value >= 0 ? 'left' : 'right'}:50%;width:${pct}%;"></div>`;
        } else {
          fill = `<div class="insights_bar-fill is-pos" style="left:0;width:${Math.min(100, r.value / scaleMax * 100)}%;"></div>`;
        }
      }
      return `
        <div class="insights_bar-row">
          <div class="insights_bar-label">${esc(r.label)}</div>
          <div class="insights_bar-track">${centered ? '<div class="insights_bar-center"></div>' : ''}${fill}</div>
          <div class="insights_bar-value${empty ? ' is-empty' : ''}">${empty ? '--' : `${format(r.value)}${unit}`}</div>
        </div>
      `;
    }).join('');

    const caption = opts.caption ? `<div class="chart-card__unit">${opts.caption}</div>` : '';
    return `
      <article class="card chart-card insights_chart">
        <div class="chart-card__head"><div class="chart-card__titles"><div class="chart-card__title">${title}</div>${caption}</div></div>
        <div class="insights_bar-chart">${axisHtml}${rowsHtml}</div>
      </article>
    `;
  }

  // Graduation de l'axe : signe explicite pour les valeurs centrées sur 0 (strokes gained)
  const fmtSigned0 = (t, centered) => (centered && t > 0 ? `+${t}` : String(t));

  // Groupe de puces cliquables ({ value, label }) ; `selected` = valeurs actives.
  function chipGroupHtml(items, selected, attr) {
    return items.map((it) => `<button type="button" class="insights_chip" aria-pressed="${selected.includes(it.value)}" ${attr || 'data-value'}="${esc(it.value)}">${esc(it.label)}</button>`).join('');
  }

  // Sélection multiple avec "Tous" exclusif : cliquer une valeur l'ajoute / la retire, au moins une reste active.
  function toggleMulti(list, value) {
    if (value === 'All') return ['All'];
    let next = list.filter((v) => v !== 'All');
    next = next.includes(value) ? next.filter((v) => v !== value) : [...next, value];
    return next.length ? next : ['All'];
  }

  function sumZoneCounts(list) {
    const out = {};
    list.forEach((counts) => {
      Object.keys(counts || {}).forEach((k) => { out[k] = (out[k] || 0) + (counts[k] || 0); });
    });
    return out;
  }

  /**
   * Roue de dispersion (même découpage que la saisie : trou + 8 secteurs sur le green + 8 secteurs hors green).
   * mode 'green17' : 'Centre', 'Green-<dir>', 'Hors-<dir>' (+ 'ND' = raté sans zone précisée).
   * mode 'nine'    : 'Centre' + 8 directions (approches de récupération, sans distinction sur / hors green).
   * counts         : nombre de coups par zone ; les pourcentages sont calculés ici.
   */
  const WHEEL_DIRECTIONS = ['Long', 'Long-Droite', 'Droite', 'Court-Droite', 'Court', 'Court-Gauche', 'Gauche', 'Long-Gauche'];

  function renderZoneWheel(counts, mode) {
    counts = counts || {};
    const nine = mode === 'nine';
    const keys = nine
      ? ['Centre', ...WHEEL_DIRECTIONS]
      : ['Centre', ...WHEEL_DIRECTIONS.map((d) => `Green-${d}`), ...WHEEL_DIRECTIONS.map((d) => `Hors-${d}`)];
    const nd = nine ? 0 : (counts.ND || 0);
    const total = keys.reduce((sum, k) => sum + (counts[k] || 0), 0) + nd;
    const pctOf = (k) => (total ? Math.round(((counts[k] || 0) / total) * 100) : null);

    const c = 150, rHole = 22, rGreen = 78, rOuter = 146;
    const rad = (deg) => (deg - 90) * Math.PI / 180;
    const pt = (r, deg) => `${(c + r * Math.cos(rad(deg))).toFixed(2)} ${(c + r * Math.sin(rad(deg))).toFixed(2)}`;
    const sector = (rIn, rOut, a0, a1) => `M ${pt(rOut, a0)} A ${rOut} ${rOut} 0 0 1 ${pt(rOut, a1)} L ${pt(rIn, a1)} A ${rIn} ${rIn} 0 0 0 ${pt(rIn, a0)} Z`;
    const label = (r, deg, pct) => `<text x="${(c + r * Math.cos(rad(deg))).toFixed(2)}" y="${(c + r * Math.sin(rad(deg))).toFixed(2)}" class="insights_wheel-text${pct === null ? ' is-empty' : ''}" text-anchor="middle" dominant-baseline="central">${pct === null ? '--' : `${pct}%`}</text>`;
    const opacity = (pct) => (pct === null ? 0.04 : Math.min(0.75, 0.08 + pct / 100 * 0.9)).toFixed(2);

    let paths = '';
    let labels = '';
    WHEEL_DIRECTIONS.forEach((dir, i) => {
      const mid = i * 45, a0 = mid - 22.5, a1 = mid + 22.5;
      if (nine) {
        const p = pctOf(dir);
        paths += `<path d="${sector(rHole, rGreen + 40, a0, a1)}" class="insights_wheel-sector is-on" style="fill-opacity:${opacity(p)}"/>`;
        labels += label((rHole + rGreen + 40) / 2, mid, p);
      } else {
        const pOut = pctOf(`Hors-${dir}`), pIn = pctOf(`Green-${dir}`);
        paths += `<path d="${sector(rGreen, rOuter, a0, a1)}" class="insights_wheel-sector is-off" style="fill-opacity:${opacity(pOut)}"/>`;
        paths += `<path d="${sector(rHole, rGreen, a0, a1)}" class="insights_wheel-sector is-on" style="fill-opacity:${opacity(pIn)}"/>`;
        labels += label((rGreen + rOuter) / 2, mid, pOut) + label((rHole + rGreen) / 2, mid, pIn);
      }
    });
    const pCenter = pctOf('Centre');
    const ndPct = total ? Math.round((nd / total) * 100) : null;

    return `
      <div class="insights_wheel">
        <svg viewBox="0 0 300 300" role="img" aria-label="Dispersion des coups">
          ${paths}
          <circle cx="${c}" cy="${c}" r="${rHole}" class="insights_wheel-sector is-on" style="fill-opacity:${opacity(pCenter)}"/>
          ${labels}
          ${label(0, 0, pCenter)}
        </svg>
        ${!nine ? `<div class="insights_wheel-note">Hors green non précisé : ${ndPct === null ? '--' : `${ndPct}%`}</div>` : ''}
      </div>
    `;
  }

  function kvTable(head, rows) {
    return `
      <table class="data-table">
        <thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${rows.map((r) => `<tr>${r.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    `;
  }

  function subtitle(text) { return `<div class="insights_subtitle">${text}</div>`; }

  /* ========================================================================
     11) BLOCS "PAR DISTANCE" — SCORE / FAIRWAY / APPROACH / APPROCHES / PUTTS
     ======================================================================== */

  // `inverted = true` : une baisse est une bonne nouvelle (ex : score) → couleur inversée.
  // `suffix` : unité optionnelle (' m', '%'...) ajoutée uniquement si la valeur est présente.
  function metric(label, value, delta, inverted, suffix, sub) {
    const hasDelta = delta !== undefined && delta !== null;
    const isGood = !hasDelta ? null : (inverted ? delta <= 0 : delta >= 0);
    return `
      <div class="metric">
        <div class="metric__label">${label}</div>
        <div class="metric__value">${fmt(value, suffix)}</div>
        ${hasDelta ? `<div class="metric__delta ${isGood ? 'metric__delta--pos' : 'metric__delta--neg'}">${delta > 0 ? '+' : ''}${delta}</div>` : ''}
        ${sub ? `<div class="metric__sub">${sub}</div>` : ''}
      </div>
    `;
  }

  // Chevron décoratif ("SCORE >", "FAIRWAY >"...) : présent dans la maquette
  // mais aucune navigation associée n'y est montrée → non cliquable.
  function statBlockHeader(titleIcon, title) {
    return `
      <div class="stat-block__header">
        <div class="stat-block__title">
          ${icon(titleIcon)}<span class="stat-block__title-text">${title}</span>
          <span class="stat-block__title__chevron">${icon('chevronRight')}</span>
        </div>
        <div class="stat-block__dropdown">Toutes distances ${icon('chevronDown')}</div>
      </div>
    `;
  }

  // Sous-ligne "+7 au par" sous le meilleur / le moins bon score
  const toParSub = (toPar) => (isEmptyValue(toPar) ? '' : `${fmtSigned(toPar)} au par`);

  function renderScoreBlock(data) {
    const p = data.perRound, t = data.byHoleType, s = data.bySegment;
    return `
      <section class="stat-block fade-up">
        ${statBlockHeader('bars', 'Score')}
        <div class="stat-block__metrics">
          ${metric('Brut moyen', data.avgGross, data.avgGrossDelta, true)}
          ${metric('Vs par moyen', fmtSigned(data.avgToPar))}
          ${metric('Meilleur score', data.best, undefined, undefined, undefined, toParSub(data.bestToPar))}
          ${metric('Pire score', data.worst, undefined, undefined, undefined, toParSub(data.worstToPar))}
          ${metric('Parties jouées', data.played)}
        </div>
        ${subtitle('Moyenne par partie')}
        ${kvTable(['Résultat', 'Trous'], [
          ['Eagle ou mieux', fmtNum(p.eagle, 2)], ['Birdie', fmtNum(p.birdie, 2)], ['Par', fmtNum(p.par, 2)],
          ['Bogey', fmtNum(p.bogey, 2)], ['Double bogey ou pire', fmtNum(isEmptyValue(p.double) && isEmptyValue(p.triple) ? null : (p.double || 0) + (p.triple || 0), 2)],
        ])}
        ${subtitle('Par type de trou')}
        ${kvTable(['Trou', 'Score moyen'], [
          ['Par 3', fmtNum(t.par3)], ['Par 4', fmtNum(t.par4)], ['Par 5', fmtNum(t.par5)],
          ['Par 4 courts', fmtNum(t.par4Short)], ['Par 4 longs', fmtNum(t.par4Long)],
        ])}
        ${subtitle('Par portion de parcours')}
        ${kvTable(['Portion', 'Score moyen'], [
          ['Aller (trous 1-9)', fmtNum(s.front9)], ['Retour (trous 10-18)', fmtNum(s.back9)],
          ['6 premiers trous', fmtNum(s.first6)], ['6 trous du milieu', fmtNum(s.mid6)], ['6 derniers trous', fmtNum(s.last6)],
        ])}
      </section>
    `;
  }

  function renderFairwayBlock(data) {
    return `
      <section class="stat-block fade-up">
        ${statBlockHeader('flag', 'Fairway')}
        ${renderFairwayMap(data)}
        ${subtitle('Touchés par type de trou')}
        ${kvTable(['Trou', '%'], [['Global', fmt(data.hitPct, '%')], ['Par 4', fmt(data.hitPar4, '%')], ['Par 5', fmt(data.hitPar5, '%')]])}
        ${subtitle('Score selon le fairway')}
        ${kvTable(['Situation', 'Score moyen'], [['Après fairway touché', fmtNum(data.scoreAfterHit)], ['Après fairway raté', fmtNum(data.scoreAfterMiss)]])}
      </section>
    `;
  }

  function renderApproachBlock(data) {
    return `
      <section class="stat-block fade-up">
        ${statBlockHeader('target', 'Approach')}
        ${renderApproachMap(data)}
        ${subtitle('Attaque de green réussie')}
        ${kvTable(['Trou', '%'], [['Global', fmt(data.greenHitPct, '%')]])}
        ${subtitle('GIR par type de trou')}
        ${kvTable(['Trou', '%'], [['Global', fmt(data.girPct, '%')], ['Par 3', fmt(data.girPar3, '%')], ['Par 4', fmt(data.girPar4, '%')], ['Par 5', fmt(data.girPar5, '%')]])}
        ${subtitle('Dispersion sur le green')}
        ${renderGreenWheelMap(data.zoneCounts, 'green17')}
      </section>
    `;
  }

  const APPROCHES_TYPES = [
    { value: 'all', label: 'Toutes' },
    { value: 'nonBunker', label: 'Approches' },
    { value: 'bunker', label: 'S. Bunker' },
  ];
  let approchesType = 'all';

  function renderApprochesBlock(data) {
    return `
      <section class="stat-block fade-up">
        ${statBlockHeader('putter', 'Approches')}
        <div class="stat-block__metrics">
          ${metric('Up & Down', data.upDownPct, undefined, undefined, '%')}
          ${metric('U&D bunker', data.upDownBunker, undefined, undefined, '%')}
          ${metric('U&D fairway', data.upDownNonBunker, undefined, undefined, '%')}
        </div>
        <div>
          <div class="chart-canvas-wrap chart-canvas-wrap--sm" style="height:180px;"><canvas data-dispersion></canvas></div>
          ${renderDispersionLegend(data.proximityBands)}
        </div>
        ${subtitle('Dispersion après green raté')}
        <div class="insights_chips" data-approches-types>${chipGroupHtml(APPROCHES_TYPES, [approchesType])}</div>
        <div data-approches-wheel>${renderGreenWheelMap(data.zoneCounts[approchesType], 'nine')}</div>
      </section>
    `;
  }

  function renderPuttsBlock(data) {
    return `
      <section class="stat-block fade-up">
        ${statBlockHeader('putter', 'Putts')}
        <div class="stat-block__metrics">
          ${metric('1 putt', data.onePutt, undefined, undefined, '%')}
          ${metric('2 putts', data.twoPutt, undefined, undefined, '%')}
          ${metric('3 putts ou +', data.threePlusPutt, undefined, undefined, '%')}
        </div>
        ${kvTable(['Moyenne', 'Putts'], [
          ['Par partie', fmtNum(data.perRound)], ['Par trou', fmtNum(data.perHole, 2)],
          ['Par trou, GIR', fmtNum(data.perHoleGir, 2)], ['Par trou, hors GIR', fmtNum(data.perHoleNonGir, 2)],
        ])}
        <table class="data-table">
          <thead><tr><th>1er putt (m)</th><th>Moy.</th><th>1 putt</th><th>2 putts</th><th>3+</th></tr></thead>
          <tbody>${data.byDistance.map((row) => `<tr><td>${row.label}</td><td>${row.avgPutts.toFixed(2)}</td><td>${row.one}%</td><td>${row.two}%</td><td>${row.threePlus}%</td></tr>`).join('')}</tbody>
        </table>
      </section>
    `;
  }

  /* ========================================================================
     12) INITIALISATION DES ÉCRANS (appelée une seule fois, au premier accès)
     ======================================================================== */

  function initDashboard() {
    const hasTotal = strokesGained.total !== null && strokesGained.total !== undefined;
    const totalValueHtml = hasTotal
      ? `<div class="sg-card__value" data-count-to="${strokesGained.total}" data-count-prefix="${strokesGained.total > 0 ? '+' : ''}">+0.0</div>`
      : `<div class="sg-card__value">--</div>`;

    document.getElementById('dash-strokesGained').innerHTML = `
      <div class="sg-card__main">
        <div class="icon-badge">${icon('trendUp')}</div>
        <div class="sg-card__total">
          <div class="sg-card__label">SG total</div>
          ${totalValueHtml}
        </div>
      </div>
      <div class="sg-card__breakdown">
        ${strokesGained.categories.map((c) => `
          <div class="sg-item">
            <div class="sg-item__label">${c.label}</div>
            <div class="sg-item__icon">${icon(c.icon)}</div>
            <div class="sg-item__value">${fmtSigned(c.value)}</div>
          </div>
        `).join('')}
      </div>
    `;

    // Tout le HTML (y compris les 3 cartes "Analyses détaillées") est injecté
    // AVANT la création des graphiques : si Chart.js échoue à charger (CDN
    // bloqué, hors-ligne...), le reste de l'écran reste visible et cliquable.
    const kpiGrid = document.getElementById('dash-kpiGrid');
    kpiGrid.innerHTML = kpiCards.map((k, i) => renderKpiCard(k, i)).join('');

    document.getElementById('dash-analysesGrid').innerHTML = detailedAnalyses.map((a, i) => renderAnalysisCard(a, i)).join('');

    renderRoundList(document.getElementById('dash-historyList'), roundsHistory, () => showScreen('historique'));

    animateCounters(document.getElementById('screen-dashboard'), 800);

    // Bouton flottant unique : ouvre le popup de paramétrage (voir openNewRound)
    const fabRow = document.createElement('div');
    fabRow.className = 'fab-row';
    fabRow.innerHTML = `<button class="fab" type="button" data-new-round>${icon('flag')} Nouveau parcours</button>`;
    document.getElementById('screen-dashboard').appendChild(fabRow);
  }

  /* ========================================================================
     ÉCRAN "PAR CLUB" — graphes par club (Driving / Approach / Short Game / Putting)
     ======================================================================== */

  const INSIGHTS_ROUNDS = ['5 derniers parcours', '10 derniers parcours', '15 derniers parcours', '20 derniers parcours', 'Tout'];
  const CLUB_LIES = ['Tous lies', 'Tee', 'Fairway', 'Rough', 'Sand', 'Recover', 'Green'];
  const DISTANCE_LIES = ['Tous lies', 'Tee', 'Fringe', 'Fairway', 'Sand', 'Rough', 'Recover'];
  const CLUB_TABS = [
    { value: 'driving', label: 'Driving' },
    { value: 'approach', label: 'Approach' },
    { value: 'shortGame', label: 'Short Game' },
    { value: 'putting', label: 'Putting' },
  ];
  // Distance du 1er putt, en mètres : chaque borne haute est la borne basse de la tranche suivante
  const PUTT_BUCKETS = ['≤ 1 m', '1–2 m', '2–3 m', '3–5 m', '5–9 m', '> 9 m'];

  // Filtres communs (Time / Parcours / Lie). À chaque changement : recharger les données avec ces valeurs.
  const clubState = { tabs: ['driving'], greenClubs: ['All'], filters: { rounds: 'Tout', course: 'Tous parcours', lie: 'Tous lies' } };

  function renderInsightsFilters(rootId, lieOptions, onChange) {
    renderFilterBar(document.getElementById(rootId), [
      { key: 'rounds', icon: 'calendar', label: 'Tout', options: INSIGHTS_ROUNDS },
      { key: 'course', icon: 'flag', label: 'Tous parcours', options: DEFAULT_FILTERS.course.options },
      { key: 'lie', icon: 'sliders', label: 'Tous lies', options: lieOptions },
    ], onChange);
  }

  function initParClub() {
    renderClubTabs();
    renderInsightsFilters('pc-filters', CLUB_LIES, (key, value) => {
      clubState.filters[key] = value;
      // À brancher : GET /api/stats/par-club avec clubState.tabs et clubState.filters, puis remplacer clubInsights
      renderClubCharts();
    });
    renderClubCharts();
  }

  function renderClubTabs() {
    const root = document.getElementById('pc-tabs');
    root.innerHTML = chipGroupHtml(CLUB_TABS, clubState.tabs);
    root.querySelectorAll('.insights_chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tabs = clubState.tabs;
        const i = tabs.indexOf(btn.dataset.value);
        if (i === -1) tabs.push(btn.dataset.value);
        else if (tabs.length > 1) tabs.splice(i, 1); // au moins un onglet reste actif
        renderClubTabs();
        renderClubCharts();
      });
    });
  }

  function renderClubCharts() {
    const root = document.getElementById('pc-charts');
    const tabs = clubState.tabs;
    const has = (k) => tabs.includes(k);
    const only = (k) => tabs.length === 1 && tabs[0] === k;
    const m = clubInsights.metrics, put = clubInsights.putting;
    const played = clubInsights.clubs.length ? clubInsights.clubs : getSdClubs().map((c) => c.name);

    const rowsOf = (map, keys) => keys.map((k) => ({ label: k === 'All' ? 'Tous' : k, value: pickValue(map, k) }));
    const clubRows = (map) => [...rowsOf(map, ['All']), ...clubsOnly(map)];
    const bucketRows = (map) => rowsOf(map, ['All', ...PUTT_BUCKETS]);
    const hasData = (r) => !isEmptyValue(r.value);
    const fx = (v) => v.toFixed(1); // m, %, coups par partie : 0.1 (les SG sont à 0.01 via fmtSG)
    const pct = fx;
    // Clubs : seuls ceux qui ont des données
    const clubsOnly = (map) => rowsOf(map, played).filter(hasData);

    const out = [];
    const add = (title, rows, opts) => out.push(renderBarChart(title, rows, opts));
    const sgLabel = tabs.length === 1 ? CLUB_TABS.find((t) => t.value === tabs[0]).label : '';
    const PCT = { unit: '%', format: pct, caption: '(%)' };
    const SG_CAPTION = '(Vs Tour)';

    // Strokes gained : par tranche de distance pour le putting seul, sinon par club
    if (only('putting')) {
      add('SG Putting', bucketRows(put.sg), { centered: true, format: fmtSG, caption: '(Vs Tour)' });
    } else {
      const sgRows = clubRows(m.sg);
      // Les putts n'ont pas de club : une barre dédiée "Putting" s'ajoute à côté de "Tous"
      if (has('putting')) sgRows.push({ label: 'Putting', value: pickValue(m.sg, 'Putting') });
      add(`SG${sgLabel ? ` ${sgLabel}` : ''}`, sgRows, { centered: true, format: fmtSG, caption: SG_CAPTION });
    }

    if (only('driving')) {
      add('Distance moyenne', clubsOnly(m.distance), { unit: ' m', format: pct, caption: '(m)' });
      add('Fairways touchés', clubRows(m.fairways), PCT);
    }
    if (only('approach')) {
      add('Distance moyenne', clubsOnly(m.distance), { unit: ' m', format: pct, caption: '(m)' });
      add('Greens en régulation', clubRows(m.gir), PCT);
      add('Chances de birdie', clubRows(m.birdies), { format: fx, caption: '(par partie)' });
    }
    if (only('shortGame')) {
      add('Scrambling', clubRows(m.scrambling), PCT);
      add('Up & Down', clubRows(m.upDown), PCT);
    }
    if (only('putting')) add('Putts rentrés', bucketRows(put.makeRate), PCT);

    if (!only('putting')) {
      const shotRows = clubRows(m.shotsPerRound);
      if (has('putting')) shotRows.push({ label: 'Putting', value: pickValue(m.shotsPerRound, 'Putting') });
      add('Coups par partie', shotRows, { format: fx });
    }
    if (only('putting')) {
      add('3 putts', bucketRows(put.threePutt), { ...PCT, caption: '(% des trous)' });
      add('Putts par GIR', bucketRows(put.puttsPerGir), { format: fx });
      add('Fréquence des 3 putts', bucketRows(put.holesPer3Putt), { format: fx, caption: '(trous pour 1 three-putt)' });
      add('Coups par partie', rowsOf(m.shotsPerRound, ['All']), { format: fx });
    }

    // Dispersion sur le green : onglet Approach seul, un ou plusieurs clubs
    let dispersion = '';
    if (only('approach')) {
      const zc = clubInsights.zoneCounts;
      const withData = played.filter((c) => Object.values(zc[c] || {}).some((n) => n > 0));
      const counts = clubState.greenClubs.includes('All') ? (zc.All || {}) : sumZoneCounts(clubState.greenClubs.map((c) => zc[c]));
      dispersion = `
        <article class="card chart-card insights_chart">
          <div class="chart-card__head"><div><div class="chart-card__title">Dispersion sur le green</div><div class="chart-card__unit">(% des attaques)</div></div></div>
          <div class="insights_chips" data-green-clubs>${chipGroupHtml([{ value: 'All', label: 'Tous' }, ...withData.map((c) => ({ value: c, label: c }))], clubState.greenClubs)}</div>
          ${renderZoneWheel(counts, 'green17')}
        </article>
      `;
    }

    root.innerHTML = out.join('') + dispersion;
    root.querySelectorAll('[data-green-clubs] .insights_chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        clubState.greenClubs = toggleMulti(clubState.greenClubs, btn.dataset.value);
        renderClubCharts();
      });
    });
  }

  /* ========================================================================
     ÉCRAN "PAR DISTANCE" — graphes par tranche de distance avant le coup
     ======================================================================== */

  // Distance au drapeau avant le coup, en mètres (pas de 25 yards ≈ 22,86 m, arrondis) : bornes continues, sans trou ni chevauchement
  const DISTANCE_BUCKETS = ['< 23 m', '23–46 m', '46–69 m', '69–91 m', '91–114 m', '114–137 m', '137–160 m', '160–183 m', '183–206 m', '206–229 m', '> 229 m'];
  const distanceState = { buckets: ['All'], filters: { rounds: 'Tout', course: 'Tous parcours', lie: 'Tous lies' } };

  function initParDistance() {
    renderInsightsFilters('pd-filters', DISTANCE_LIES, (key, value) => {
      distanceState.filters[key] = value;
      // À brancher : GET /api/stats/par-distance avec distanceState.filters, puis remplacer distanceInsights
      renderDistanceCharts();
    });
    renderDistanceCharts();
  }

  function renderDistanceCharts() {
    const root = document.getElementById('pd-charts');
    const d = distanceInsights;
    const rows = (arr) => DISTANCE_BUCKETS.map((label, i) => ({ label, value: arr[i] === undefined ? null : arr[i] }));

    const selected = distanceState.buckets.includes('All') ? DISTANCE_BUCKETS : distanceState.buckets;
    const counts = sumZoneCounts(selected.map((b) => d.zoneCounts[b]));

    root.innerHTML = `
      ${renderBarChart('Strokes gained', rows(d.sg), { centered: true, format: fmtSG, caption: '(Vs Tour)' })}
      ${renderBarChart('Proximité médiane', rows(d.proximity), { unit: ' m', format: (v) => v.toFixed(1), caption: '(m)' })}
      ${renderBarChart('Coups par partie', rows(d.shotsPerRound))}
      <article class="card chart-card insights_chart">
        <div class="chart-card__head"><div><div class="chart-card__title">Dispersion sur le green</div><div class="chart-card__unit">(% des attaques)</div></div></div>
        <div class="insights_chips" data-green-buckets>${chipGroupHtml([{ value: 'All', label: 'Toutes' }, ...DISTANCE_BUCKETS.map((b) => ({ value: b, label: b }))], distanceState.buckets)}</div>
        ${renderZoneWheel(counts, 'green17')}
      </article>
    `;
    root.querySelectorAll('[data-green-buckets] .insights_chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        distanceState.buckets = toggleMulti(distanceState.buckets, btn.dataset.value);
        renderDistanceCharts();
      });
    });
  }

  /* ========================================================================
     ÉCRAN "STATISTIQUES" — Multi (aperçu) / Traditionnel / SG
     ======================================================================== */

  function initStatistiques() {
    // Le segmented control change le pane affiché ; il ne change pas d'écran.
    initSegmentedControl(document.getElementById('st-modeTabs'), ['Multi', 'Traditionnel', 'SG'], 0, (i, label) => {
      showStatistiquesPane(label);
    });

    renderStatistiquesMulti();
    initTrendPane('traditional');
    initTrendPane('sg');
    showStatistiquesPane('Multi');
  }

  function showStatistiquesPane(label) {
    const panes = { Multi: 'st-pane-multi', Traditionnel: 'st-pane-traditionnel', SG: 'st-pane-sg' };
    Object.values(panes).forEach((id) => document.getElementById(id).classList.remove('is-active'));
    document.getElementById(panes[label]).classList.add('is-active');
    // Graphiques tracés une fois le pane visible (Chart.js mesure le conteneur)
    if (label === 'Traditionnel') renderTrendPane('traditional');
    if (label === 'SG') renderTrendPane('sg');
  }

  // Pane "Multi" : aperçu score / fairway / greens / approches / putts
  let dispersionChart = null;

  function renderStatistiquesMulti() {
    renderFilterBar(document.getElementById('st-multi-filters'), [DEFAULT_FILTERS.period, DEFAULT_FILTERS.course, DEFAULT_FILTERS.lie]);
    // Les blocs fairway / green utilisent les images de la saisie : on attend leur chargement (proportions du green)
    loadMultiImages().then(buildStatistiquesMulti);
  }

  function buildStatistiquesMulti() {
    const blocksEl = document.getElementById('st-multi-blocks');
    blocksEl.innerHTML =
      renderScoreBlock(statsOverview.score) +
      renderFairwayBlock(statsOverview.fairway) +
      renderApproachBlock(statsOverview.approach) +
      renderApprochesBlock(statsOverview.approches) +
      renderPuttsBlock(statsOverview.putts);

    const dispersionCanvas = blocksEl.querySelector('[data-dispersion]');
    if (dispersionCanvas) dispersionChart = createDispersionChart(dispersionCanvas, statsOverview.approches.proximityBands);

    // Dispersion des approches de récupération : Toutes / Approches / S. Bunker
    const typesEl = blocksEl.querySelector('[data-approches-types]');
    const wheelEl = blocksEl.querySelector('[data-approches-wheel]');
    typesEl.querySelectorAll('.insights_chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        approchesType = btn.dataset.value;
        typesEl.querySelectorAll('.insights_chip').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        wheelEl.innerHTML = renderGreenWheelMap(statsOverview.approches.zoneCounts[approchesType], 'nine');
      });
    });

    animateCounters(document.getElementById('st-pane-multi'), 800);
  }

  // Panes "Traditionnel" et "SG" : une courbe par statistique, un point par partie
  // unit    : suffixe des valeurs ; pts : la progression d'un pourcentage s'exprime en points, pas en %
  // caption : légende d'unité sous le titre, seulement quand le titre ne la dit pas déjà ("Putts par partie" n'en a pas)
  const TREND_PANES = {
    traditional: {
      filters: 'st-trad-filters', charts: 'st-trad-charts',
      defs: [
        { key: 'avgDrive', title: 'Distance du drive', unit: ' m', caption: '(m)', decimals: 1, better: 'high', get: (r) => r.avgDrive },
        { key: 'firPct', title: 'Fairways touchés', unit: '%', pts: true, caption: '(%)', decimals: 1, better: 'high', get: (r) => r.firPct },
        { key: 'girPct', title: 'Greens en régulation', unit: '%', pts: true, caption: '(%)', decimals: 1, better: 'high', get: (r) => r.girPct },
        { key: 'putts', title: 'Putts par partie', unit: '', caption: '', decimals: 1, better: 'low', get: (r) => r.putts },
        { key: 'puttsPerGir', title: 'Putts par GIR', unit: '', caption: '', decimals: 2, better: 'low', get: (r) => r.puttsPerGir },
      ],
    },
    sg: {
      filters: 'st-sg-filters', charts: 'st-sg-charts',
      defs: [
        { key: 'sgTotal', title: 'SG Total', unit: '', caption: '', decimals: 2, better: 'high', signed: true, get: (r) => r.sg && r.sg.total },
        { key: 'sgDriving', title: 'SG Driving', unit: '', caption: '', decimals: 2, better: 'high', signed: true, get: (r) => r.sg && r.sg.driving },
        { key: 'sgApproach', title: 'SG Approach', unit: '', caption: '', decimals: 2, better: 'high', signed: true, get: (r) => r.sg && r.sg.approach },
        { key: 'sgShortGame', title: 'SG Short Game', unit: '', caption: '', decimals: 2, better: 'high', signed: true, get: (r) => r.sg && r.sg.shortGame },
        { key: 'sgPutting', title: 'SG Putting', unit: '', caption: '', decimals: 2, better: 'high', signed: true, get: (r) => r.sg && r.sg.putting },
      ],
    },
  };
  const trendFilters = { traditional: { course: 'Tous parcours', rounds: 'Tout' }, sg: { course: 'Tous parcours', rounds: 'Tout' } };
  const trendCharts = { traditional: [], sg: [] };

  function initTrendPane(key) {
    renderFilterBar(document.getElementById(TREND_PANES[key].filters), [
      { key: 'course', icon: 'flag', label: 'Tous parcours', options: DEFAULT_FILTERS.course.options },
      { key: 'rounds', icon: 'calendar', label: 'Tout', options: INSIGHTS_ROUNDS },
    ], (filterKey, value) => {
      trendFilters[key][filterKey] = value;
      // À brancher : GET /api/stats/trends avec trendFilters[key], puis remplacer trendRounds
      renderTrendPane(key);
    });
  }

  // Parties filtrées par parcours puis limitées aux N dernières, en ordre chronologique
  function filteredTrendRounds(key) {
    const f = trendFilters[key];
    let list = trendRounds.slice().sort((a, b) => String(a.date).localeCompare(String(b.date)));
    if (f.course !== 'Tous parcours') list = list.filter((r) => r.course === f.course);
    const n = parseInt(f.rounds, 10);
    if (!Number.isNaN(n)) list = list.slice(-n);
    return list;
  }

  function trendPoints(def, list) {
    const f = Math.pow(10, def.decimals);
    return list
      .map((r) => ({ y: def.get(r), date: r.date }))
      .filter((p) => !isEmptyValue(p.y))
      .map((p, i) => ({ x: i + 1, y: Math.round(p.y * f) / f, date: p.date }));
  }

  function fmtDateFr(iso) {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? '--' : d.toLocaleDateString('fr-FR');
  }

  function trendCardHtml(def, pts) {
    const head = `<div class="chart-card__head"><div class="chart-card__titles"><div class="chart-card__title">${def.title}</div>${def.caption ? `<div class="chart-card__unit">${def.caption}</div>` : ''}</div></div>`;
    if (!pts.length) return `<article class="card chart-card">${head}<div class="insights_empty">Pas assez de données</div></article>`;

    const ys = pts.map((p) => p.y);
    const avg = ys.reduce((a, b) => a + b, 0) / ys.length;
    const isBetter = (a, b) => (def.better === 'low' ? a < b : a > b);
    const best = pts.reduce((a, b) => (isBetter(b.y, a.y) ? b : a));
    const worst = pts.reduce((a, b) => (isBetter(b.y, a.y) ? a : b));
    const progression = pts.length > 1 ? pts[pts.length - 1].y - pts[0].y : null;

    const show = (v) => (def.signed ? fmtSigned(fmtNum(v, def.decimals)) : fmtNum(v, def.decimals, def.unit));
    // Une variation de pourcentage se dit en points ("+7 pts"), pas en "%"
    const showDelta = (v) => `${fmtSigned(fmtNum(v, def.decimals))}${def.pts ? ' pts' : def.unit}`;

    return `
      <article class="card chart-card">
        ${head}
        <div class="chart-canvas-wrap"><canvas data-trend="${def.key}" role="img" aria-label="${def.title}"></canvas></div>
        <div class="chart-stats-row">
          <div class="chart-stats-row__item">
            <div class="chart-stats-row__label">Progression</div>
            <div class="chart-progression">${icon('trendUp')}<span>${progression === null ? '--' : showDelta(progression)}</span></div>
          </div>
          <div class="chart-stats-row__item">
            <div class="chart-stats-row__label">Moyenne</div>
            <div class="chart-stats-row__value">${show(avg)}</div>
          </div>
          <div class="chart-stats-row__item">
            <div class="chart-stats-row__label">Meilleure partie</div>
            <div class="chart-stats-row__value chart-stats-row__value--accent">${show(best.y)}</div>
            <div class="chart-stats-row__sub">${fmtDateFr(best.date)}</div>
          </div>
          <div class="chart-stats-row__item">
            <div class="chart-stats-row__label">Moins bonne partie</div>
            <div class="chart-stats-row__value">${show(worst.y)}</div>
            <div class="chart-stats-row__sub">${fmtDateFr(worst.date)}</div>
          </div>
        </div>
      </article>
    `;
  }

  function renderTrendPane(key) {
    const pane = TREND_PANES[key];
    const root = document.getElementById(pane.charts);
    trendCharts[key].forEach((chart) => chart && chart.destroy());
    trendCharts[key] = [];

    const list = filteredTrendRounds(key);
    const series = pane.defs.map((def) => ({ def, pts: trendPoints(def, list) }));
    root.innerHTML = series.map(({ def, pts }) => trendCardHtml(def, pts)).join('');
    series.forEach(({ def, pts }) => {
      if (!pts.length) return;
      trendCharts[key].push(createPerformanceChart(root.querySelector(`[data-trend="${def.key}"]`), pts, 'line', { xTitle: 'Partie n°', yTitle: def.caption || '' }));
    });
  }

  function initHistorique() {
    const summary = [
      ['Score moyen', roundsSummary.avgScore, roundsSummary.avgScoreDelta, 'sliders'],
      ['Meilleur score', roundsSummary.bestScore, roundsSummary.bestScoreDelta, 'target'],
      ['Parties jouées', roundsSummary.played, null, 'flag'],
      ['Score brut moy.', roundsSummary.avgGrossScore, roundsSummary.avgGrossDelta, 'trendUp'],
      ['Birdies (total)', roundsSummary.birdiesTotal, null, 'bird'],
      ['Double bogeys+', roundsSummary.doubleBogeyPlus, null, 'club'],
    ];
    document.getElementById('hist-summaryStrip').innerHTML = summary.map(([label, value, delta, ic]) => `
      <div class="mini-stat fade-up">
        <div class="mini-stat__icon">${icon(ic)}</div>
        <div class="mini-stat__label">${label}</div>
        <div class="mini-stat__value">${fmt(value)}</div>
        ${delta !== null ? `<div class="mini-stat__delta ${delta <= 0 ? 'mini-stat__delta--pos' : 'mini-stat__delta--neg'}">${delta > 0 ? '+' : ''}${delta}</div>` : ''}
      </div>
    `).join('');

    const SORTS = [{ key: 'date', label: 'Date', icon: 'calendar' }, { key: 'course', label: 'Parcours', icon: 'flag' }, { key: 'score', label: 'Score', icon: 'sort' }];
    let activeSort = 'date', query = '', visibleCount = 6;

    const sortBar = document.getElementById('hist-sortBar');
    sortBar.innerHTML = SORTS.map((s) => `<button type="button" class="sort-chip" data-key="${s.key}" aria-pressed="${s.key === activeSort}">${icon(s.icon)} ${s.label}</button>`).join('');
    sortBar.querySelectorAll('.sort-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        activeSort = chip.dataset.key;
        sortBar.querySelectorAll('.sort-chip').forEach((c) => c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'));
        render();
      });
    });

    document.getElementById('hist-search').addEventListener('input', (e) => {
      query = e.target.value.trim().toLowerCase();
      visibleCount = 6;
      render();
    });
    document.getElementById('hist-loadMore').addEventListener('click', () => { visibleCount += 6; render(); });

    function getFilteredSorted() {
      const list = roundsHistory.filter((r) => r.course.toLowerCase().includes(query));
      list.sort((a, b) => {
        if (activeSort === 'date') return new Date(b.date) - new Date(a.date);
        if (activeSort === 'course') return a.course.localeCompare(b.course);
        if (activeSort === 'score') return a.score - b.score;
        return 0;
      });
      return list;
    }

    function render() {
      const list = getFilteredSorted();
      const visible = list.slice(0, visibleCount);
      renderRoundTable(document.getElementById('hist-roundTable'), visible);
      document.getElementById('hist-loadMore').style.display = visibleCount >= list.length ? 'none' : 'inline-flex';
    }
    render();
  }

  function initPutting() {
    renderFilterBar(document.getElementById('put-filters'), [
      DEFAULT_FILTERS.course,
      { key: 'distance', icon: 'target', label: 'Toutes distances', options: ['Toutes distances', '< 3 m', '3 – 5 m', '5 – 10 m', '> 10 m'] },
      { key: 'range', icon: 'calendar', label: '20 derniers rounds', options: ['10 derniers rounds', '20 derniers rounds', '50 derniers rounds'] },
    ]);

    const hasValue = puttingPerformance.value !== null && puttingPerformance.value !== undefined;
    const valueEl = document.getElementById('put-value');
    if (hasValue) {
      valueEl.dataset.countTo = puttingPerformance.value;
    } else {
      valueEl.textContent = '--';
    }

    const deltaEl = document.getElementById('put-delta');
    const hasDelta = puttingPerformance.delta !== null && puttingPerformance.delta !== undefined;
    if (hasDelta) {
      const isGood = puttingPerformance.delta <= 0; // baisse des putts = amélioration
      deltaEl.className = `kpi-card__trend ${isGood ? 'kpi-card__trend--good' : 'kpi-card__trend--bad'}`;
      deltaEl.textContent = `${puttingPerformance.delta > 0 ? '+' : ''}${puttingPerformance.delta} ${puttingPerformance.compareLabel}`;
    } else {
      deltaEl.className = 'kpi-card__trend';
      deltaEl.textContent = puttingPerformance.compareLabel;
    }

    const points = puttingPerformance.points.map((y, i) => ({ x: String(i + 1), y }));
    createPerformanceChart(document.getElementById('put-chart'), points, 'line');

    animateCounters(document.getElementById('screen-putting'), 800);
  }

  /* ========================================================================
     COMPOSANT — Popup "Nouveau parcours"
     Paramètres de la partie + choix du mode de saisie (rapide / détaillée).
     "Commencer la partie" enregistre les paramètres dans currentRound et ferme le popup.
     ======================================================================== */

  // Paramètres en cours d'édition (remis aux valeurs par défaut à chaque ouverture)
  const newRound = {};
  // Paramètres validés de la partie en cours
  let currentRound = null;
  let newRoundEl = null;
  let newRoundTrigger = null;

  const optionLabel = (key, value) => (newRoundOptions[key].find((o) => o.value === value) || {}).label || '';

  // Texte affiché (ligne haute / ligne basse) pour chaque champ à liste déroulante
  const NEW_ROUND_VIEW = {
    weather: (s) => ['Météo', optionLabel('weather', s.weather)],
    wind: (s) => ['Vent', optionLabel('wind', s.wind)],
  };

  /* --- Recherche de parcours (API FlyAway Golf, comme dans l'ancienne version) ---
     GET /golfs n'accepte pas de recherche texte (lat / long / limit / skip seulement) :
     1) on charge une fois les parcours proches de la position de l'utilisateur,
     2) on filtre cette liste localement à chaque frappe,
     3) au choix d'un parcours, on charge son profil (par, handicap, distances par départ). */
  const COURSE_API = 'https://api.flyawaygolf.com/v2';
  let nearbyCourses = [];
  let nearbyStatus = 'idle'; // 'idle' | 'loading' | 'ready' | 'error'
  let nearbyError = '';
  let courseLoading = false;
  let courseError = '';
  let courseToken = 0; // invalide la réponse d'un chargement devenu obsolète

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // Comparaison sans accents ni majuscules ("evian" trouve "Évian")
  const fold = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Libellé de départ renvoyé par l'API → clé de newRoundOptions.tee
  function normalizeTeeKey(raw) {
    const s = fold(raw);
    if (s.includes('black') || s.includes('noir')) return 'black';
    if (s.includes('white') || s.includes('blanc')) return 'white';
    if (s.includes('yellow') || s.includes('jaune')) return 'yellow';
    if (s.includes('blue') || s.includes('bleu')) return 'blue';
    if (s.includes('red') || s.includes('rouge')) return 'red';
    return null;
  }

  // Profil FlyAway → { name, holes: [{ par, hcp }] x18, tees: { couleur: [distance x18] } }
  // On prend la carte 18 trous si elle existe, sinon la première disponible.
  function mapCourseProfile(data) {
    const cards = data.scorecards || [];
    const card = cards.find((s) => s.holesCount === 18) || cards[0];
    const grid = card ? (card.grid || [])[0] : null;
    const pick = (arr, i) => (arr && arr[i] !== undefined ? arr[i] : null);

    const holes = Array.from({ length: 18 }, (_, i) => ({ par: pick(grid && grid.par, i), hcp: pick(grid && grid.handicap, i) }));
    const tees = {};
    ((grid && grid.teeboxes) || []).forEach((t) => {
      const key = normalizeTeeKey((t.color && t.color.name) || t.name);
      if (key) tees[key] = Array.from({ length: 18 }, (_, i) => pick(t.distances, i));
    });
    return { name: data.name || '', city: data.city || '', holes, tees };
  }

  function loadNearbyCourses() {
    if (nearbyStatus === 'loading' || nearbyStatus === 'ready') return;
    if (!navigator.geolocation) {
      nearbyStatus = 'error';
      nearbyError = 'Géolocalisation indisponible, saisissez le parcours manuellement.';
      refreshCourseStatus();
      return;
    }
    nearbyStatus = 'loading';
    refreshCourseStatus();
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`${COURSE_API}/golfs?lat=${latitude}&long=${longitude}&limit=100`);
          if (!res.ok) throw new Error('HTTP ' + res.status);
          const json = await res.json();
          nearbyCourses = (json.data && json.data.golfs && json.data.golfs.items) || [];
          nearbyStatus = 'ready';
        } catch (err) {
          nearbyStatus = 'error';
          nearbyError = 'Recherche indisponible, saisissez le parcours manuellement.';
        }
        renderCourseResults();
        refreshCourseStatus();
      },
      () => {
        nearbyStatus = 'error';
        nearbyError = 'Position refusée, saisissez le parcours manuellement.';
        refreshCourseStatus();
      },
      { timeout: 10000 }
    );
  }

  // Parcours proches correspondant au texte saisi (nom ou ville, 2 caractères minimum)
  function findCourses() {
    const q = fold(newRound.courseQuery).trim();
    if (q.length < 2 || nearbyStatus !== 'ready' || newRound.course) return [];
    return nearbyCourses.filter((c) => fold(c.name).includes(q) || fold(c.city).includes(q)).slice(0, 8);
  }

  function renderCourseResults() {
    const list = newRoundEl && newRoundEl.querySelector('.new-round_results');
    if (!list) return;
    const matches = findCourses();
    list.innerHTML = matches.map((c) => `
      <li><button type="button" class="new-round_result" data-course-slug="${esc(c.slug)}">
        <span class="new-round_result-name">${esc(c.name)}</span>
        ${c.city ? `<span class="new-round_result-city">${esc(c.city)}</span>` : ''}
      </button></li>`).join('');
    list.hidden = !matches.length;
    refreshCourseStatus();
  }

  // Ligne basse du champ : ville du parcours choisi, ou état de la recherche
  function refreshCourseStatus() {
    const el = newRoundEl && newRoundEl.querySelector('[data-course-status]');
    if (!el) return;
    const typed = fold(newRound.courseQuery).trim().length >= 2;
    let text = '';
    if (courseLoading) text = 'Chargement du parcours…';
    else if (newRound.course) text = newRound.course.city;
    else if (courseError) text = courseError;
    else if (nearbyStatus === 'loading') text = 'Recherche des parcours proches…';
    else if (nearbyStatus === 'error') text = nearbyError;
    else if (nearbyStatus === 'ready' && typed && !findCourses().length) text = 'Aucun parcours trouvé près de vous';
    el.textContent = text;
  }

  // Seuls les départs existant sur le parcours choisi restent cliquables
  function applyCourseTees() {
    const available = newRound.course ? Object.keys(newRound.course.tees) : [];
    const restricted = available.length > 0;
    if (restricted && !available.includes(newRound.tee)) {
      newRound.tee = newRoundOptions.tee.find((t) => available.includes(t.value)).value;
    }
    newRoundEl.querySelectorAll('[data-tee]').forEach((b) => {
      b.disabled = restricted && !available.includes(b.dataset.tee);
      b.setAttribute('aria-checked', String(b.dataset.tee === newRound.tee));
    });
  }

  async function pickCourse(slug) {
    const picked = nearbyCourses.find((c) => c.slug === slug);
    if (!picked) return;
    const token = ++courseToken;
    const input = newRoundEl.querySelector('input[name="course"]');
    input.value = picked.name;
    newRound.courseQuery = picked.name;
    newRound.course = null;
    courseError = '';
    courseLoading = true;
    renderCourseResults(); // liste masquée : le parcours choisi n'est plus une suggestion

    try {
      const res = await fetch(`${COURSE_API}/golfs/profile/${encodeURIComponent(slug)}`);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      if (token !== courseToken) return; // l'utilisateur a modifié le champ entre-temps
      const mapped = mapCourseProfile(json.data);
      newRound.course = { ...mapped, name: mapped.name || picked.name, city: picked.city || mapped.city };
    } catch (err) {
      if (token !== courseToken) return;
      courseError = 'Impossible de charger ce parcours, saisissez-le manuellement.';
    }
    courseLoading = false;
    applyCourseTees();
    refreshCourseStatus();
  }

  function newRoundGroup(label, content) {
    return `<div class="new-round_group"><div class="new-round_label">${label}</div>${content}</div>`;
  }

  // Champ cliquable : le <select> natif est posé en transparent par-dessus la ligne,
  // ce qui ouvre directement le sélecteur du système (mobile compris)
  function newRoundField(name, ic, label, chevron, combo) {
    const [top, bottom] = NEW_ROUND_VIEW[name](newRound);
    return `
      <label class="new-round_field${combo || ''}">
        <span class="new-round_field-icon">${icon(ic)}</span>
        <span class="new-round_field-text">
          <span class="new-round_field-top" data-top="${name}">${top}</span>
          <span class="new-round_field-bottom" data-bottom="${name}">${bottom}</span>
        </span>
        <span class="new-round_field-chevron">${icon(chevron || 'chevronRight')}</span>
        <select class="new-round_field-select" name="${name}" aria-label="${label}">
          ${newRoundOptions[name].map((o) => `<option value="${o.value}"${o.value === newRound[name] ? ' selected' : ''}>${o.label}</option>`).join('')}
        </select>
      </label>`;
  }

  function renderNewRound() {
    const o = newRoundOptions;
    const modal = newRoundEl.querySelector('.new-round_modal');

    const tees = o.tee.map((t) => `
      <button type="button" role="radio" class="new-round_tee" data-tee="${t.value}" aria-checked="${t.value === newRound.tee}">
        <span class="new-round_tee-ring"><span class="new-round_tee-dot" style="--tee-color:${t.color};--tee-edge:${t.edge || 'transparent'}"></span></span>
        ${t.label}
      </button>`).join('');

    const pills = (key) => o[key].map((p) => `
      <button type="button" role="radio" class="new-round_pill" data-${key}="${p.value}" aria-label="${p.aria}" aria-checked="${p.value === newRound[key]}">${p.label}</button>`).join('');

    modal.innerHTML = `
      <div class="new-round_header">
        <span class="new-round_icon">${icon('flag')}</span>
        <div class="new-round_heading">
          <h2 class="new-round_title" id="nr-title">Nouvelle partie</h2>
          <p class="new-round_subtitle">Réglez les paramètres de votre partie</p>
        </div>
        <button type="button" class="new-round_close" data-nr-close aria-label="Fermer">${icon('close')}</button>
      </div>
      <div class="new-round_form">
        ${newRoundGroup('Mode de saisie', '<div class="segmented" id="nr-mode"></div>')}
        ${newRoundGroup('Parcours', `
          <div class="new-round_search">
            <label class="new-round_field is-course">
              <span class="new-round_field-icon">${icon('search')}</span>
              <span class="new-round_field-text">
                <input class="new-round_field-input" name="course" type="text" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="Rechercher un parcours" aria-label="Rechercher un parcours" value="${esc(newRound.courseQuery)}">
                <span class="new-round_field-bottom" data-course-status></span>
              </span>
              <span class="new-round_field-chevron">${icon('chevronDown')}</span>
            </label>
            <ul class="new-round_results" hidden></ul>
          </div>`)}
        ${newRoundGroup('Départ', `<div class="new-round_tee-list" role="radiogroup" aria-label="Départ">${tees}</div>`)}
        <div class="new-round_grid">
          ${newRoundGroup('Premier trou', `<div class="new-round_pill-list" role="radiogroup" aria-label="Premier trou">${pills('start')}</div>`)}
          ${newRoundGroup('Nombre de trous', `<div class="new-round_pill-list" role="radiogroup" aria-label="Nombre de trous">${pills('count')}</div>`)}
        </div>
        <div class="new-round_grid">
          ${newRoundGroup('Météo', newRoundField('weather', 'weather', 'Météo'))}
          ${newRoundGroup('Vent', newRoundField('wind', 'wind', 'Vent'))}
        </div>
      </div>
      <button type="button" class="new-round_cta" data-nr-submit>Commencer la partie ${icon('arrowRight')}</button>
    `;

    initSegmentedControl(
      modal.querySelector('#nr-mode'),
      ['Rapide', 'Détaillée'],
      newRound.mode === 'saisie-detaillee' ? 1 : 0,
      (i) => { newRound.mode = i === 0 ? 'saisie-rapide' : 'saisie-detaillee'; }
    );
    applyCourseTees();
    refreshCourseStatus();
  }

  function ensureNewRound() {
    if (newRoundEl) return;
    newRoundEl = document.createElement('div');
    newRoundEl.className = 'new-round_overlay';
    newRoundEl.innerHTML = '<div class="new-round_modal" role="dialog" aria-modal="true" aria-labelledby="nr-title"></div>';
    getStatsRoot().appendChild(newRoundEl);

    // Un seul écouteur de clic pour tout le popup (le contenu est re-rendu à chaque ouverture)
    newRoundEl.addEventListener('click', (e) => {
      if (e.target === newRoundEl || e.target.closest('[data-nr-close]')) { closeNewRound(); return; }

      const result = e.target.closest('[data-course-slug]');
      if (result) { pickCourse(result.dataset.courseSlug); return; }
      if (!e.target.closest('.new-round_search')) newRoundEl.querySelector('.new-round_results').hidden = true;

      const tee = e.target.closest('[data-tee]');
      if (tee) {
        newRound.tee = tee.dataset.tee;
        newRoundEl.querySelectorAll('[data-tee]').forEach((b) => b.setAttribute('aria-checked', String(b === tee)));
        return;
      }

      const pill = e.target.closest('[data-start], [data-count]');
      if (pill) {
        const key = pill.hasAttribute('data-start') ? 'start' : 'count';
        newRound[key] = pill.dataset[key];
        pill.parentElement.querySelectorAll('.new-round_pill').forEach((b) => b.setAttribute('aria-checked', String(b === pill)));
        return;
      }

      if (e.target.closest('[data-nr-submit]')) startNewRound();
    });

    // Recherche de parcours : la géolocalisation ne se demande qu'au premier focus du champ
    newRoundEl.addEventListener('focusin', (e) => {
      if (e.target.name === 'course') loadNearbyCourses();
    });

    newRoundEl.addEventListener('input', (e) => {
      if (e.target.name !== 'course') return;
      courseToken++; // annule un chargement de parcours en cours
      courseLoading = false;
      courseError = '';
      newRound.courseQuery = e.target.value;
      if (newRound.course) { newRound.course = null; applyCourseTees(); } // texte modifié : le parcours chargé n'est plus valable
      renderCourseResults();
    });

    // Échap referme d'abord la liste de suggestions, puis seulement le popup
    newRoundEl.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || e.target.name !== 'course') return;
      const list = newRoundEl.querySelector('.new-round_results');
      if (!list.hidden) { list.hidden = true; e.stopPropagation(); }
    });

    newRoundEl.addEventListener('change', (e) => {
      const field = e.target;
      if (field.matches('select')) {
        newRound[field.name] = field.value;
        const [top, bottom] = NEW_ROUND_VIEW[field.name](newRound);
        newRoundEl.querySelector(`[data-top="${field.name}"]`).textContent = top;
        newRoundEl.querySelector(`[data-bottom="${field.name}"]`).textContent = bottom;
      }
    });
  }

  function onNewRoundKeydown(e) {
    if (e.key === 'Escape') closeNewRound();
  }

  function openNewRound(trigger) {
    ensureNewRound();
    Object.assign(newRound, newRoundOptions.defaults, { course: null, courseQuery: '' });
    courseToken++;
    courseLoading = false;
    courseError = '';
    if (nearbyStatus === 'error') nearbyStatus = 'idle'; // la réouverture retente la recherche
    renderNewRound();
    newRoundTrigger = trigger || null;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onNewRoundKeydown);
    newRoundEl.classList.add('is-open');
    newRoundEl.querySelector('[data-nr-close]').focus();
  }

  function closeNewRound() {
    newRoundEl.classList.remove('is-open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onNewRoundKeydown);
    if (newRoundTrigger) newRoundTrigger.focus();
  }

  function startNewRound() {
    // À brancher : POST /api/rounds avec currentRound pour créer la partie
    const startHole = Number(newRound.start);
    const holeCount = Number(newRound.count);
    const course = newRound.course;
    // Un trou par entrée : numéro réel sur le parcours (le 18 enchaîne sur le 1), par, handicap, distance du départ choisi
    const holes = Array.from({ length: holeCount }, (_, i) => {
      const idx = (startHole - 1 + i) % 18;
      return {
        number: idx + 1,
        par: course ? course.holes[idx].par : null,
        hcp: course ? course.holes[idx].hcp : null,
        distance: course && course.tees[newRound.tee] ? course.tees[newRound.tee][idx] : null,
      };
    });
    // Sans parcours choisi dans la liste, on garde le nom saisi à la main
    const courseName = course ? course.name : (newRound.courseQuery.trim() || null);
    currentRound = { ...newRound, courseName, holeCount, startHole, holes };
    closeNewRound();
    // Ouvre l'écran de saisie du mode choisi (rapide ou détaillé)
    const screenName = newRound.mode === 'saisie-detaillee' ? 'saisie-detaillee' : 'saisie-rapide';
    const firstOpen = !initialized.has(screenName); // 1ʳᵉ ouverture : l'init charge déjà currentRound
    showScreen(screenName);
    const api = screenName === 'saisie-detaillee' ? saisieDetaillee : saisieRapide;
    if (!firstOpen && api) api.load(); // sinon on repart de la nouvelle partie
  }

  /* ========================================================================
     SAISIE RAPIDE — écran de saisie trou par trou
     Les données du trou (numéro, par, handicap, distance) viennent de
     currentRound, construit au clic sur "Commencer la partie" avec le parcours
     et le départ choisis dans les réglages. Chaque trou garde sa propre saisie
     (score, putts, fairway, green) ; elle est retrouvée en naviguant.
     ======================================================================== */

  // Images de fond (dossier "images") : Green = FondGreenRond, Fairway = FondFairwaySaisieRapide.
  // L'extension est détectée automatiquement parmi IMAGE_EXT.
  const GREEN_BG_BASE = 'images/FondGreenRond';
  const FAIRWAY_BG_BASE = 'images/FondFairwaySaisieRapide';
  const IMAGE_EXT = ['png', 'webp', 'jpg', 'jpeg', 'svg', 'PNG', 'WEBP', 'JPG', 'JPEG', 'SVG'];

  // Renvoie (en promesse) l'URL de la première image existante, ou null
  function findImage(base) {
    return new Promise((resolve) => {
      let i = 0;
      const tryNext = () => {
        if (i >= IMAGE_EXT.length) { console.warn(`Image introuvable : ${base}.(${IMAGE_EXT.join('|')})`); resolve(null); return; }
        const url = `${base}.${IMAGE_EXT[i++]}`;
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = tryNext;
        img.src = url;
      };
      tryNext();
    });
  }

  // API de l'écran (renseignée par initSaisieRapide) : load() recharge currentRound
  let saisieRapide = null;

  function initSaisieRapide() {
    const screen = document.getElementById('screen-saisie-rapide');
    const q = (sel) => screen.querySelector(sel);
    const setText = (el, text) => { if (el) el.textContent = text; };

    // Éléments déjà présents dans le HTML
    const titleEl = q('.saisie-rapide_hole-title');
    const metaEl = q('.saisie-rapide_hole-meta');
    const scoreBtn = q('.saisie-rapide_hole-score');
    const badgeEl = q('.saisie-rapide_score-badge');
    const puttsEl = q('[data-qr="putts-value"]');
    const statList = q('.saisie-rapide_stat-list');
    const liveTitle = q('.saisie-rapide_live-title');
    if (liveTitle) liveTitle.textContent = liveTitle.textContent.replace(/\s*live\s*$/i, '').trim();
    const greenRoot = document.getElementById('qr-green-root');
    const fairwayRoot = document.getElementById('qr-fairway-root');
    const fairwayCard = fairwayRoot && fairwayRoot.closest('.saisie-rapide_card');
    const fairwayOptions = [...screen.querySelectorAll('[role="radio"]')];
    const [prevBtn, nextBtn] = screen.querySelectorAll('.saisie-rapide_nav-button');

    /* ---------- État ---------- */
    let round = null;    // partie en cours (currentRound)
    let entries = [];    // une saisie par trou : { score, putts, fairway, green }
    let idx = 0;         // trou affiché (index dans round.holes, dans l'ordre de jeu)

    const blankEntry = () => ({ score: null, putts: null, fairway: null, green: null });
    const entry = () => entries[idx];

    function ensureRound() {
      // Écran ouvert sans passer par le popup : partie vierge de 18 trous
      if (!currentRound) {
        currentRound = {
          courseName: null, tee: newRoundOptions.defaults.tee, holeCount: 18, startHole: 1,
          holes: Array.from({ length: 18 }, (_, i) => ({ number: i + 1, par: null, hcp: null, distance: null })),
        };
      }
      return currentRound;
    }

    function load() {
      round = ensureRound();
      entries = round.holes.map(blankEntry);
      round.entries = entries; // lu à la fin de la partie
      idx = 0;
      renderHole();
    }

    /* ---------- Affichage ---------- */
    function renderBadge() {
      if (!badgeEl) return;
      const score = entry().score;
      badgeEl.textContent = score === null ? '–' : score;
      badgeEl.classList.toggle('is-empty', score === null);
    }

    function renderStats() {
      if (!statList) return;
      let vsPar = 0, vsParHoles = 0, fir = 0, firHoles = 0, gir = 0, girHoles = 0, putts = 0, puttsHoles = 0;
      entries.forEach((e, i) => {
        const par = round.holes[i].par;
        if (e.score !== null && par !== null) { vsPar += e.score - par; vsParHoles++; }
        if (e.fairway !== null && par !== 3) { firHoles++; if (e.fairway === FAIRWAY_HIT) fir++; }
        if (e.green !== null) { girHoles++; if (isOnGreen(e.green)) gir++; }
        if (e.putts !== null) { putts += e.putts; puttsHoles++; }
      });
      const pct = (n, total) => (total ? `${Math.round((n / total) * 100)}%` : '--');
      const rows = [
        ['Score', vsParHoles ? (vsPar > 0 ? `+${vsPar}` : vsPar === 0 ? 'E' : String(vsPar)) : '--', true],
        ['FIR', pct(fir, firHoles)],
        ['GIR', pct(gir, girHoles)],
        ['Putts', puttsHoles ? (putts / puttsHoles).toFixed(1) : '--'],
      ];
      statList.innerHTML = rows.map(([label, value, accent]) => `
        <div class="saisie-rapide_stat"><span class="saisie-rapide_stat-label">${label}</span><span class="saisie-rapide_stat-value${accent ? ' is-accent' : ''}">${value}</span></div>`).join('');
    }

    // Remplace uniquement le texte d'un bouton (les icônes SVG du HTML sont conservées)
    function setLabel(btn, text) {
      const node = [...btn.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
      if (node) node.textContent = `\n        ${text}\n        `;
      else btn.insertBefore(document.createTextNode(text), btn.querySelector('svg:last-child'));
    }

    // Un trou est complet quand score, putts, fairway et green sont renseignés (pas de fairway sur un par 3)
    const isComplete = (e, par) => e.score !== null && e.putts !== null && e.green !== null && (par === 3 || e.fairway !== null);
    const allComplete = () => entries.every((e, i) => isComplete(e, round.holes[i].par));

    function renderNav() {
      const last = idx === round.holes.length - 1;
      if (prevBtn) prevBtn.disabled = idx === 0;
      if (!nextBtn) return;
      // Dernier trou : "Enregistrer" n'apparaît que si tous les trous sont complets
      nextBtn.classList.toggle('is-hidden', last && !allComplete());
      setLabel(nextBtn, last ? 'Enregistrer' : 'Trou suivant');
    }

    // Met à jour résumé + bouton après chaque saisie
    function refresh() { renderStats(); renderNav(); }

    function renderHole() {
      const hole = round.holes[idx];
      const e = entry();

      setText(titleEl, `Trou ${hole.number}`);
      const meta = [];
      if (hole.par !== null) meta.push(`Par ${hole.par}`);
      if (hole.distance !== null) meta.push(`${hole.distance} m`);
      if (hole.hcp !== null) meta.push(`Hcp ${hole.hcp}`);
      setText(metaEl, meta.length ? meta.join(' · ') : `Trou ${idx + 1} sur ${round.holes.length}`);

      renderBadge();
      // Par 3 : pas de fairway → carte grisée et choix désactivés
      const noFairway = hole.par === 3;
      if (fairwayCard) fairwayCard.classList.toggle('is-na', noFairway);
      fairwayOptions.forEach((o) => {
        o.disabled = noFairway;
        o.setAttribute('aria-checked', String(!noFairway && optionKey(o) === e.fairway));
      });
      setText(puttsEl, e.putts === null ? '–' : e.putts);
      renderGreenWheel();
      renderStats();
      renderNav();
    }

    // Libellé d'un choix de fairway (sert de valeur enregistrée)
    const FAIRWAY_HIT = 'Centre'; // choix Gauche / Centre / Droite : Centre = fairway touché
    const optionKey = (el) => (el.textContent || el.getAttribute('aria-label') || '').trim();

    /* ---------- Fairway : sélection unique ; un second clic désélectionne ---------- */
    screen.addEventListener('click', (e) => {
      const option = e.target.closest('[role="radio"]');
      if (!option || !round) return;
      const wasChecked = option.getAttribute('aria-checked') === 'true';
      option.closest('[role="radiogroup"]').querySelectorAll('[role="radio"]')
        .forEach((el) => el.setAttribute('aria-checked', 'false'));
      option.setAttribute('aria-checked', String(!wasChecked));
      entry().fairway = wasChecked ? null : optionKey(option);
      refresh();
    });

    /* ---------- Putts : flèches, de 0 à 9 ---------- */
    screen.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-qr-putts]');
      if (!btn || !round) return;
      const e0 = entry();
      e0.putts = Math.min(9, Math.max(0, (e0.putts === null ? 0 : e0.putts) + Number(btn.dataset.qrPutts)));
      setText(puttsEl, e0.putts);
      refresh();
    });

    /* ---------- Roue du green ----------
       Le SVG recouvre toute l'image. Au centre, 9 zones = sur le green :
         - le trou (5 % de l'image) → 'Centre'
         - 8 secteurs autour du trou, jusqu'à 50 % de l'image → 'Green-<direction>'
       Les traits des 8 secteurs sont prolongés jusqu'au bord de l'image : tout ce qui est hors
       des 9 zones centrales est hors green, découpé en 8 zones → 'Hors-<direction>' */
    const DIRECTIONS = ['Long', 'Long-Droite', 'Droite', 'Court-Droite', 'Court', 'Court-Gauche', 'Gauche', 'Long-Gauche'];
    const GREEN_SIZE = 0.6;   // diamètre du green cliquable, part de l'image
    const HOLE_SIZE = 0.07;   // diamètre du trou, part de l'image
    let greenRatio = 1;       // largeur / hauteur de l'image (mis à jour au chargement de l'image)

    // Vrai si la zone est sur le green (trou ou secteur intérieur) : sert au calcul du GIR
    const isOnGreen = (zone) => zone === 'Centre' || String(zone).startsWith('Green-');

    // Tracé d'un secteur d'anneau entre deux angles (0° = haut, sens horaire)
    function sectorPath(cx, cy, rIn, rOut, a0, a1) {
      const rad = (d) => (d - 90) * Math.PI / 180;
      const pt = (r, d) => `${(cx + r * Math.cos(rad(d))).toFixed(2)} ${(cy + r * Math.sin(rad(d))).toFixed(2)}`;
      return `M ${pt(rOut, a0)} A ${rOut} ${rOut} 0 0 1 ${pt(rOut, a1)} L ${pt(rIn, a1)} A ${rIn} ${rIn} 0 0 0 ${pt(rIn, a0)} Z`;
    }

    // Distance du centre au bord de l'image dans la direction deg (0° = haut)
    function edgeDistance(deg, halfW, halfH) {
      const s = Math.abs(Math.sin(deg * Math.PI / 180)), c = Math.abs(Math.cos(deg * Math.PI / 180));
      return Math.min(s > 1e-9 ? halfW / s : Infinity, c > 1e-9 ? halfH / c : Infinity);
    }

    function renderGreenWheel() {
      if (!greenRoot || !round) return;
      const greenZone = entry().green;
      const vw = 200, vh = vw / greenRatio, cx = vw / 2, cy = vh / 2;
      const base = Math.min(vw, vh);
      const rGreen = base * GREEN_SIZE / 2;
      const rHole = base * HOLE_SIZE / 2;
      const rFar = Math.hypot(vw, vh); // assez grand pour atteindre les coins de l'image
      let sectors = '';
      let ball = '';
      const ballAt = (r, deg) => {
        const a = (deg - 90) * Math.PI / 180;
        return `<circle cx="${(cx + r * Math.cos(a)).toFixed(2)}" cy="${(cy + r * Math.sin(a)).toFixed(2)}" r="7" class="saisie-rapide_wheel-ball"/>`;
      };
      DIRECTIONS.forEach((dir, i) => {
        const mid = i * 45, a0 = mid - 22.5, a1 = a0 + 45;
        const inKey = `Green-${dir}`, outKey = `Hors-${dir}`;
        sectors += `<path d="${sectorPath(cx, cy, rGreen, rFar, a0, a1)}" class="saisie-rapide_wheel-sector is-outer${greenZone === outKey ? ' is-selected' : ''}" data-zone="${outKey}"/>`;
        sectors += `<path d="${sectorPath(cx, cy, rHole, rGreen, a0, a1)}" class="saisie-rapide_wheel-sector${greenZone === inKey ? ' is-selected' : ''}" data-zone="${inKey}"/>`;
        if (greenZone === inKey) ball = ballAt((rHole + rGreen) / 2, mid);
        if (greenZone === outKey) ball = ballAt((rGreen + edgeDistance(mid, cx, cy)) / 2, mid);
      });
      const centerSel = greenZone === 'Centre';
      if (centerSel) ball = `<circle cx="${cx}" cy="${cy}" r="7" class="saisie-rapide_wheel-ball"/>`;
      greenRoot.innerHTML = `<svg viewBox="0 0 ${vw} ${vh.toFixed(2)}" class="saisie-rapide_wheel" role="group" aria-label="Green en régulation">
        ${sectors}
        <circle cx="${cx}" cy="${cy}" r="${rHole}" class="saisie-rapide_wheel-center${centerSel ? ' is-selected' : ''}" data-zone="Centre"/>
        ${ball}
      </svg>`;
    }

    if (greenRoot) {
      greenRoot.addEventListener('click', (e) => {
        const zone = e.target.closest('[data-zone]');
        if (!zone || !round) return;
        const e0 = entry();
        e0.green = e0.green === zone.dataset.zone ? null : zone.dataset.zone; // second clic = désélection
        renderGreenWheel();
        refresh();
      });
    }

    // Fonds d'image posés en CSS. Green : sur la même zone que la roue → même centre, même taille.
    findImage(GREEN_BG_BASE).then((url) => {
      if (!url || !greenRoot) return;
      greenRoot.style.setProperty('--qr-green-bg', `url("${url}")`);
      // Proportions réelles de l'image : le SVG la recouvre exactement (green = 50 %, trou = 5 %)
      const probe = new Image();
      probe.onload = () => {
        if (probe.naturalWidth > 0 && probe.naturalHeight > 0) {
          greenRatio = probe.naturalWidth / probe.naturalHeight;
          greenRoot.style.setProperty('--qr-green-ratio', greenRatio);
          renderGreenWheel();
        }
      };
      probe.src = url;
    });
    findImage(FAIRWAY_BG_BASE).then((url) => { if (url && fairwayRoot) fairwayRoot.style.backgroundImage = `url("${url}")`; });

    /* ---------- Navigation entre les trous ---------- */
    function go(step) {
      const next = idx + step;
      if (next < 0) return;
      if (next >= round.holes.length) { if (allComplete()) finishRound(); return; }
      idx = next;
      renderHole();
    }

    function finishRound() {
      // À brancher : POST /api/rounds avec round (round.entries contient la saisie de chaque trou)
      document.dispatchEvent(new CustomEvent('stats:round-finished', { detail: round }));
      showScreen('dashboard');
    }

    if (prevBtn) prevBtn.addEventListener('click', () => go(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => go(1));

    /* ---------- Pavé numérique du score ---------- */
    const pad = { el: null, value: '', fresh: false };
    const PAD_MAX = 20;

    function padLabel(n) {
      const par = round.holes[idx].par;
      if (!n || par === null) return '';
      if (n === 1) return 'Trou en 1';
      const d = n - par;
      if (d <= -3) return 'Albatros';
      return { '-2': 'Eagle', '-1': 'Birdie', '0': 'Par', '1': 'Bogey', '2': 'Double bogey' }[d] || `+${d}`;
    }

    function renderPad() {
      const n = Number(pad.value) || 0;
      pad.el.querySelector('[data-pad-value]').textContent = pad.value || '–';
      pad.el.querySelector('[data-pad-result]').textContent = padLabel(n);
    }

    // Touches du pavé (data-pad-key / data-pad-back / data-pad-clear), gérées par délégation dans ensurePad
    function padDigit(d) {
      if (pad.fresh) { pad.value = ''; pad.fresh = false; } // premier chiffre : remplace le score existant
      const next = pad.value + d;
      if (next === '0' || Number(next) > PAD_MAX) return;
      pad.value = next;
      renderPad();
    }

    function padBackspace() {
      pad.fresh = false;
      pad.value = pad.value.slice(0, -1);
      renderPad();
    }

    function padClear() {
      pad.fresh = false;
      pad.value = '';
      renderPad();
    }

    function padConfirm() {
      entry().score = pad.value ? Number(pad.value) : null;
      closePad();
      renderBadge();
      refresh();
    }

    function onPadKeydown(e) {
      if (e.key === 'Escape') closePad();
      else if (e.key === 'Enter') { e.preventDefault(); padConfirm(); }
      else if (e.key === 'Backspace') padBackspace();
      else if (/^[0-9]$/.test(e.key)) padDigit(e.key);
    }

    function ensurePad() {
      if (pad.el) return;
      const digitKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        .map((d) => `<button type="button" class="saisie-rapide_pad-key" data-pad-key="${d}">${d}</button>`).join('');
      const backIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 5H9l-6 7 6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z"/><path d="M17 9l-5 6M12 9l5 6"/></svg>';

      pad.el = document.createElement('div');
      pad.el.className = 'saisie-rapide_pad-overlay';
      pad.el.innerHTML = `
        <div class="saisie-rapide_pad" role="dialog" aria-modal="true" aria-labelledby="qr-pad-title">
          <div class="saisie-rapide_pad-head">
            <div class="saisie-rapide_pad-heading">
              <h2 class="saisie-rapide_pad-title" id="qr-pad-title"></h2>
              <p class="saisie-rapide_pad-sub"></p>
            </div>
            <button type="button" class="saisie-rapide_pad-close" data-pad-close aria-label="Fermer">${icon('close')}</button>
          </div>
          <div class="saisie-rapide_pad-display" aria-live="polite">
            <div class="saisie-rapide_pad-value" data-pad-value></div>
            <span class="saisie-rapide_pad-result" data-pad-result></span>
          </div>
          <div class="saisie-rapide_pad-keys" role="group" aria-label="Pavé numérique">
            ${digitKeys}
            <button type="button" class="saisie-rapide_pad-key" data-pad-clear aria-label="Tout effacer">C</button>
            <button type="button" class="saisie-rapide_pad-key" data-pad-key="0">0</button>
            <button type="button" class="saisie-rapide_pad-key" data-pad-back aria-label="Effacer le dernier chiffre">${backIcon}</button>
          </div>
          <button type="button" class="qr-submit" data-pad-ok>Valider</button>
        </div>`;
      getStatsRoot().appendChild(pad.el);

      pad.el.addEventListener('click', (e) => {
        if (e.target === pad.el || e.target.closest('[data-pad-close]')) { closePad(); return; }
        const key = e.target.closest('[data-pad-key]');
        if (key) { padDigit(key.dataset.padKey); return; }
        if (e.target.closest('[data-pad-back]')) { padBackspace(); return; }
        if (e.target.closest('[data-pad-clear]')) { padClear(); return; }
        if (e.target.closest('[data-pad-ok]')) padConfirm();
      });
    }

    function openPad() {
      if (!round) return;
      ensurePad();
      const hole = round.holes[idx];
      const current = entry().score;
      pad.value = current === null ? '' : String(current);
      pad.fresh = pad.value !== '';
      pad.el.querySelector('.saisie-rapide_pad-title').textContent = `Score · Trou ${hole.number}`;
      pad.el.querySelector('.saisie-rapide_pad-sub').textContent = hole.par !== null ? `Par ${hole.par}` : 'Nombre de coups';
      renderPad();
      document.addEventListener('keydown', onPadKeydown);
      pad.el.classList.add('is-open');
      pad.el.querySelector('[data-pad-ok]').focus();
    }

    function closePad() {
      if (!pad.el || !pad.el.classList.contains('is-open')) return;
      pad.el.classList.remove('is-open');
      document.removeEventListener('keydown', onPadKeydown);
      if (scoreBtn) scoreBtn.focus();
    }

    // Clic (ou Entrée / Espace) sur le score en haut à droite → pavé numérique
    if (scoreBtn) {
      scoreBtn.setAttribute('role', 'button');
      scoreBtn.setAttribute('tabindex', '0');
      scoreBtn.setAttribute('aria-haspopup', 'dialog');
      scoreBtn.setAttribute('aria-label', 'Saisir le score du trou');
      scoreBtn.addEventListener('click', openPad);
      scoreBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPad(); }
      });
    }

    saisieRapide = { load };
    load();
  }

  /* ========================================================================
     SAISIE DÉTAILLÉE — écran de saisie coup par coup
     Chaque trou a sa liste de coups { club, lie, distance, penalty, result, green } et un fairway (celui du coup de départ).
     Le résultat ne concerne que les coups joués du green.
     Un coup avec distance restante > 0 ajoute automatiquement le coup suivant ;
     une distance de 0 = balle rentrée (fin du trou).
     Les encadrés Green / Fairway fonctionnent comme dans la saisie rapide.
     ======================================================================== */

  // Sac du joueur = clubs cochés dans Menu > Mon sac de golf (golfBag / golfClubCatalog de menu.js)
  // type : wood | iron | putter
  const sdClubType = (id) => (id === 'putter' ? 'putter' : /^(fer|wedge)/.test(id) ? 'iron' : 'wood');
  const getSdClubs = () => (typeof golfBag === 'undefined' || typeof golfClubCatalog === 'undefined' ? [] : golfClubCatalog.filter((c) => golfBag.clubs.includes(c.id)));
  const SD_MAX_SHOTS = 15;

  // API de l'écran (renseignée par initSaisieDetaillee) : load() recharge currentRound
  let saisieDetaillee = null;

  function initSaisieDetaillee() {
    const screen = document.getElementById('screen-saisie-detaillee');
    const d = (name) => screen.querySelector(`[data-sd="${name}"]`);
    const setText = (el, text) => { if (el) el.textContent = text; };

    const holeTitle = d('hole-number');
    const holeMeta = d('hole-meta');
    const shotList = d('shot-list');
    const holedBtn = screen.querySelector('[data-sd-holed]');
    const clubIcon = d('club-icon');
    const clubText = d('club-text');
    const clubSelect = d('club-select');
    const lieBtn = d('lie-button');
    const lieIcon = d('lie-icon');
    const lieText = d('lie-text');
    const distInput = d('distance');
    const penaltyInput = d('penalty');
    const penaltyGroup = d('penalty-group');
    const resultGroup = d('result-group');
    const resultText = d('result-text');
    const popupRoot = d('popup-root');
    const greenRoot = d('green-root');
    const fairwayRoot = d('fairway-root');
    const fairwayCard = fairwayRoot.closest('.saisie-rapide_card');
    const fairwayOptions = [...screen.querySelectorAll('[data-sd-fairway]')];
    const headerToggle = screen.querySelector('[data-sd-header-toggle]');
    const [prevBtn, nextBtn] = screen.querySelectorAll('[data-sd-nav]');

    // En-tête masqué par défaut : un appui en haut de l'écran l'affiche
    function setHeader(open) {
      screen.classList.toggle('is-header-open', open);
      headerToggle.setAttribute('aria-expanded', String(open));
    }

    // Lie : un appui = lie suivant (Tee → Fairway → Rough → Bunker → Green → vide)
    const LIES = ['Tee', 'Fairway', 'Rough', 'Bunker', 'Green'];
    const LIE_CLASS = { Fairway: 'is-fairway', Rough: 'is-rough', Tee: 'is-tee', Bunker: 'is-bunker', Green: 'is-green' };
    const LIE_ICON = {
      Fairway: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M4.5 20c.5-4 .5-7-.5-10"/><path d="M8.5 20c0-3-.5-5-1.5-7"/><path d="M12 20V6"/><path d="M15.5 20c0-3 .5-5 1.5-7"/><path d="M19.5 20c-.5-4-.5-7 .5-10"/></svg>`,
      Rough: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M4 20l1-10"/><path d="M8 20l1-15"/><path d="M12 20V8"/><path d="M16 20l-1-13"/><path d="M20 20l-1-9"/></svg>`,
      Tee: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M6 5h12c0 2.2-2 4-5 4v9l-1 2.5-1-2.5V9C8 9 6 7.2 6 5z"/></svg>`,
      Bunker: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M3 18c0-3 2-4.5 4.5-4.5 1-2.2 3-3.5 5.5-3 2 .4 3 1.6 3.5 3 2.5 0 4.5 1.5 4.5 4.5z"/></svg>`,
      Green: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M9 18V4"/><path d="M9 4l7 2.6-7 2.6"/><ellipse cx="9" cy="19" rx="5" ry="1.8"/></svg>`,
    };

    const FAIRWAY_HIT = 'Centre'; // Gauche / Centre / Droite : Centre = fairway touché

    // Résultat d'un coup joué du green : grille 3x3, "Rentré" au centre (mêmes valeurs que la saisie putting)
    const RESULTS = [
      { value: 'long_gauche', label: 'Long gauche' }, { value: 'long', label: 'Long' }, { value: 'long_droite', label: 'Long droite' },
      { value: 'gauche', label: 'Gauche' }, { value: 'made', label: 'Rentré' }, { value: 'droite', label: 'Droite' },
      { value: 'court_gauche', label: 'Court gauche' }, { value: 'court', label: 'Court' }, { value: 'court_droite', label: 'Court droite' },
    ];
    const resultLabel = (v) => (RESULTS.find((r) => r.value === v) || {}).label || '--';
    const ICON_OF = { wood: icon('club'), iron: icon('club'), putter: icon('putter') };

    /* ---------- État ---------- */
    let round = null;   // partie en cours (currentRound)
    let holes = [];     // holes[i] = liste des coups du trou i
    let fairways = [];  // fairways[i] = fairway du trou i (Gauche / Centre / Droite), saisi depuis n'importe quel coup
    let idx = 0;        // trou affiché
    let sel = 0;        // coup sélectionné dans le trou

    const blankShot = (first = false) => ({ club: null, lie: first ? 'Tee' : null, distance: null, penalty: 0, result: null, green: null });
    const isBlank = (s) => s.club === null && s.lie === null && s.distance === null && s.penalty === 0 && s.result === null && s.green === null;
    const shots = () => holes[idx];
    const shot = () => holes[idx][sel];
    const clubType = (s) => { const c = golfClubCatalog.find((x) => x.name === s.club); return c ? sdClubType(c.id) : 'wood'; };
    // Options du select = clubs cochés dans Menu > Mon sac de golf
    function fillClubOptions() {
      clubSelect.innerHTML = '<option value="">Choisir un club</option>'
        + getSdClubs().map((c) => `<option value="${c.name}">${c.name}</option>`).join('');
    }

    function ensureRound() {
      // Écran ouvert sans passer par le popup : partie vierge de 18 trous
      if (!currentRound) {
        currentRound = {
          courseName: null, tee: newRoundOptions.defaults.tee, holeCount: 18, startHole: 1,
          holes: Array.from({ length: 18 }, (_, i) => ({ number: i + 1, par: null, hcp: null, distance: null })),
        };
      }
      return currentRound;
    }

    function load() {
      round = ensureRound();
      holes = round.holes.map(() => [blankShot(true)]);
      fairways = round.holes.map(() => null);
      idx = 0;
      sel = 0;
      setHeader(false);
      popupRoot.innerHTML = '';
      renderAll();
    }

    /* ---------- Formats ---------- */
    const num = (v) => String(v).replace('.', ',');                 // 0.8 → "0,8"
    const round1 = (v) => Math.round(v * 10) / 10;
    const shotName = (s, i) => (s.club === 'Driver' ? 'Drive' : s.club === 'Putter' ? 'Putt' : s.club || `Coup ${i + 1}`);
    // Distance approximativement parcourue par le coup i.
    // before = distance au drapeau avant le coup (distance du trou pour le coup 1, sinon distance restante du coup précédent) ;
    // after = distance restante après le coup. Sans direction connue : before − after (jamais négatif).
    // Avec une direction (roue du green, relative à la ligne départ → drapeau), la balle n'est plus sur la ligne :
    // loi des cosinus, θ = angle du secteur (0° = Long, 90° = Droite, 180° = Court). Ex. : 100 m, finit à 5 m
    // sur le côté → ≈ 100 m ; à 5 m derrière → 105 m ; à 5 m devant → 95 m.
    function traveled(list, i) {
      const before = i === 0 ? round.holes[idx].distance : list[i - 1].distance;
      const after = list[i].distance;
      if (before === null || before === undefined || after === null) return '--';
      const dir = DIRECTIONS.indexOf(String(list[i].green).replace(/^(Green|Hors)-/, ''));
      const dist = dir === -1
        ? Math.max(0, before - after)
        : Math.sqrt(before ** 2 + after ** 2 + 2 * before * after * Math.cos(dir * Math.PI / 4));
      return `${num(round1(dist))} m`;
    }

    /* ---------- Roue du green (même principe que la saisie rapide) ----------
       9 zones sur le green (le trou + 8 secteurs) et 8 zones hors green jusqu'au bord de l'image */
    const DIRECTIONS = ['Long', 'Long-Droite', 'Droite', 'Court-Droite', 'Court', 'Court-Gauche', 'Gauche', 'Long-Gauche'];
    const GREEN_SIZE = 0.6;   // diamètre du green cliquable, part de l'image
    const HOLE_SIZE = 0.07;   // diamètre du trou, part de l'image
    let greenRatio = 1;       // largeur / hauteur de l'image (mis à jour au chargement)
    const isOnGreen = (zone) => zone === 'Centre' || String(zone).startsWith('Green-');

    // Tracé d'un secteur d'anneau entre deux angles (0° = haut, sens horaire)
    function sectorPath(cx, cy, rIn, rOut, a0, a1) {
      const rad = (deg) => (deg - 90) * Math.PI / 180;
      const pt = (r, deg) => `${(cx + r * Math.cos(rad(deg))).toFixed(2)} ${(cy + r * Math.sin(rad(deg))).toFixed(2)}`;
      return `M ${pt(rOut, a0)} A ${rOut} ${rOut} 0 0 1 ${pt(rOut, a1)} L ${pt(rIn, a1)} A ${rIn} ${rIn} 0 0 0 ${pt(rIn, a0)} Z`;
    }

    // Distance du centre au bord de l'image dans la direction deg (0° = haut)
    function edgeDistance(deg, halfW, halfH) {
      const s = Math.abs(Math.sin(deg * Math.PI / 180)), c = Math.abs(Math.cos(deg * Math.PI / 180));
      return Math.min(s > 1e-9 ? halfW / s : Infinity, c > 1e-9 ? halfH / c : Infinity);
    }

    function renderGreenWheel() {
      const zone = shot().green;
      const vw = 200, vh = vw / greenRatio, cx = vw / 2, cy = vh / 2;
      const base = Math.min(vw, vh);
      const rGreen = base * GREEN_SIZE / 2;
      const rHole = base * HOLE_SIZE / 2;
      const rFar = Math.hypot(vw, vh);
      let sectors = '';
      let ball = '';
      const ballAt = (r, deg) => {
        const a = (deg - 90) * Math.PI / 180;
        return `<circle cx="${(cx + r * Math.cos(a)).toFixed(2)}" cy="${(cy + r * Math.sin(a)).toFixed(2)}" r="7" class="saisie-rapide_wheel-ball"/>`;
      };
      DIRECTIONS.forEach((dir, i) => {
        const mid = i * 45, a0 = mid - 22.5, a1 = a0 + 45;
        const inKey = `Green-${dir}`, outKey = `Hors-${dir}`;
        sectors += `<path d="${sectorPath(cx, cy, rGreen, rFar, a0, a1)}" class="saisie-rapide_wheel-sector is-outer${zone === outKey ? ' is-selected' : ''}" data-zone="${outKey}"/>`;
        sectors += `<path d="${sectorPath(cx, cy, rHole, rGreen, a0, a1)}" class="saisie-rapide_wheel-sector${zone === inKey ? ' is-selected' : ''}" data-zone="${inKey}"/>`;
        if (zone === inKey) ball = ballAt((rHole + rGreen) / 2, mid);
        if (zone === outKey) ball = ballAt((rGreen + edgeDistance(mid, cx, cy)) / 2, mid);
      });
      const centerSel = zone === 'Centre';
      if (centerSel) ball = `<circle cx="${cx}" cy="${cy}" r="7" class="saisie-rapide_wheel-ball"/>`;
      greenRoot.innerHTML = `<svg viewBox="0 0 ${vw} ${vh.toFixed(2)}" class="saisie-rapide_wheel" role="group" aria-label="Attaque green">
        ${sectors}
        <circle cx="${cx}" cy="${cy}" r="${rHole}" class="saisie-rapide_wheel-center${centerSel ? ' is-selected' : ''}" data-zone="Centre"/>
        ${ball}
      </svg>`;
    }

    /* ---------- Résumé d'un trou (sert aux stats et à l'enregistrement) ---------- */
    function holeSummary(i) {
      const list = holes[i];
      const par = round.holes[i].par;
      const holedAt = list.findIndex((s) => s.distance === 0);
      const holed = holedAt !== -1;
      const played = holed ? list.slice(0, holedAt + 1) : list;
      // GIR : le coup numéro par − 2 (pénalités comprises) doit finir sur le green, sinon le green est raté.
      // Surégulation : la balle y était déjà plus tôt (zone sur un coup antérieur, coup joué depuis le green
      // ou balle rentrée) → GIR aussi. Les autres attaques de green (balle perdue, par 4 en 1…) restent libres :
      // la zone saisie ne compte pour le GIR que sur les coups numérotés ≤ par − 2.
      // Sans par connu, atteindre le green suffit (comme dans la saisie rapide).
      const limit = par !== null ? par - 2 : Infinity;
      let before = 0, gir = false, known = holed;
      played.forEach((s, k) => {
        const n = k + 1 + before; // numéro du coup, pénalités comprises
        if (n <= limit && (isOnGreen(s.green) || s.distance === 0 || s.lie === 'Green')) gir = true;
        if (n >= limit && (s.distance !== null || s.green !== null)) known = true; // coup par − 2 joué : réussi ou raté
        before += s.penalty;
      });
      return {
        holed,
        score: holed ? played.length + before : null,
        putts: holed ? played.filter((s) => s.club === 'Putter').length : null,
        fairway: fairways[i],
        gir: gir || known ? gir : null,
        shots: list,
      };
    }

    /* ---------- Affichage ---------- */
    function renderShots() {
      shotList.innerHTML = shots().map((s, i) => `
        <li class="saisie-detaillee_shot">
          <span class="saisie-detaillee_shot-number${i === sel ? ' is-selected' : ''}">${i + 1}</span>
          <button type="button" class="saisie-detaillee_shot-button" data-sd-shot="${i}"${i === sel ? ' aria-current="true"' : ''}>
            <span class="saisie-detaillee_shot-text">
              <span class="saisie-detaillee_shot-title">${shotName(s, i)}</span>
              <span class="saisie-detaillee_shot-sub">${traveled(shots(), i)}</span>
            </span>
            <span class="saisie-detaillee_shot-chevron">${icon('chevronRight')}</span>
          </button>
        </li>`).join('');
      // Garde le coup sélectionné visible dans la liste
      const el = shotList.children[sel];
      if (el) {
        if (el.offsetTop < shotList.scrollTop) shotList.scrollTop = el.offsetTop;
        else if (el.offsetTop + el.offsetHeight > shotList.scrollTop + shotList.clientHeight) {
          shotList.scrollTop = el.offsetTop + el.offsetHeight - shotList.clientHeight;
        }
      }
    }

    function renderDetail() {
      const s = shot();
      const type = clubType(s);
      clubIcon.className = `saisie-detaillee_icon is-${type}`;
      clubIcon.innerHTML = ICON_OF[type];
      setText(clubText, s.club || 'Choisir un club');
      clubText.classList.toggle('is-empty', !s.club);
      fillClubOptions(); // sac relu à chaque rendu
      if (s.club && ![...clubSelect.options].some((o) => o.value === s.club)) clubSelect.add(new Option(s.club, s.club)); // club hors sac (ex. putter auto)
      clubSelect.value = s.club || '';
      lieBtn.className = `saisie-detaillee_lie${s.lie ? ` ${LIE_CLASS[s.lie]}` : ''}`;
      lieIcon.innerHTML = s.lie ? LIE_ICON[s.lie] : '';
      setText(lieText, s.lie || '--');
      distInput.value = s.distance === null ? '' : num(s.distance);
      penaltyInput.value = s.penalty;
      // Lie Green : la ligne "Pénalité" laisse place à "Résultat"
      const onGreen = s.lie === 'Green';
      penaltyGroup.hidden = onGreen;
      resultGroup.hidden = !onGreen;
      setText(resultText, s.result ? resultLabel(s.result) : 'Choisir');
      resultText.classList.toggle('is-empty', !s.result);
      holedBtn.setAttribute('aria-pressed', String(s.distance === 0));
    }

    function renderFairway() {
      const noFairway = round.holes[idx].par === 3; // pas de fairway sur un par 3
      fairwayCard.classList.toggle('is-na', noFairway);
      fairwayOptions.forEach((o) => {
        o.disabled = noFairway;
        o.setAttribute('aria-checked', String(!noFairway && o.dataset.sdFairway === fairways[idx]));
      });
    }

    function renderStats() {
      let fir = 0, gir = 0, putts = 0, puttsHoles = 0;
      holes.forEach((_, i) => {
        const h = holeSummary(i);
        if (round.holes[i].par !== 3 && h.fairway === FAIRWAY_HIT) fir++;
        if (h.gir) gir++;
        if (h.putts !== null) { putts += h.putts; puttsHoles++; }
      });
      // FIR sur les trous hors par 3 (par inconnu = compté), GIR sur tous les trous, putts = total de la partie
      const firTotal = round.holes.filter((h) => h.par !== 3).length;
      setText(d('fir'), `${fir}/${firTotal}`);
      setText(d('gir'), `${gir}/${round.holes.length}`);
      setText(d('putts'), puttsHoles ? String(putts) : '--');
      // Strokes gained (d('sg'), d('sg-driving'), d('sg-green'), d('sg-approach'), d('sg-putting')) :
      // à brancher, aucun barème de référence n'est encore disponible
    }

    const isLastHole = () => idx === round.holes.length - 1;
    const allHoled = () => holes.every((_, i) => holeSummary(i).holed);

    function renderNav() {
      prevBtn.disabled = idx === 0;
      // Dernier trou : "Enregistrer" n'apparaît que si tous les trous sont rentrés
      nextBtn.classList.toggle('is-hidden', isLastHole() && !allHoled());
      setText(d('next-label'), isLastHole() ? 'Enregistrer' : 'Trou suivant');
    }

    // Numéro du trou, par, distance, hcp (comme la saisie rapide)
    function renderHole() {
      const hole = round.holes[idx];
      setText(holeTitle, `Trou ${hole.number}`);
      const meta = [];
      if (hole.par !== null) meta.push(`Par ${hole.par}`);
      if (hole.distance !== null) meta.push(`${hole.distance} m`);
      if (hole.hcp !== null) meta.push(`Hcp ${hole.hcp}`);
      setText(holeMeta, meta.length ? meta.join(' · ') : `Trou ${idx + 1} sur ${round.holes.length}`);
    }

    function renderAll() {
      renderHole();
      renderShots();
      renderDetail();
      renderFairway();
      renderGreenWheel();
      renderStats();
      renderNav();
    }

    // Après toute modification : balle rentrée → retire les coups vides en trop ;
    // sinon, si le dernier coup a une distance restante, ajoute le coup suivant
    function afterChange() {
      const list = shots();
      const holedAt = list.findIndex((s) => s.distance === 0);
      if (holedAt !== -1) {
        while (list.length - 1 > holedAt && isBlank(list[list.length - 1])) list.pop();
      } else if (list[list.length - 1].distance > 0 && list.length < SD_MAX_SHOTS) {
        list.push(blankShot());
      }
      sel = Math.min(sel, list.length - 1);
      reconcile(list[sel]);
      renderAll();
    }

    // Cohérence du coup affiché : pénalité et résultat s'excluent selon le lie,
    // et "Rentré" = distance restante 0 (bouton Holed)
    function reconcile(s) {
      if (s.lie === 'Green') {
        s.penalty = 0; // la ligne pénalité est masquée : on n'en garde pas de valeur cachée
        if (s.distance === 0) s.result = 'made';
        else if (s.result === 'made') s.result = null;
      } else s.result = null;
    }

    /* ---------- Popup résultat (grille 3x3) ---------- */
    function renderResultPopup(open) {
      if (!open) { popupRoot.innerHTML = ''; return; }
      const current = shot().result;
      popupRoot.innerHTML = `
        <div class="saisie-detaillee_popup-overlay">
          <div class="saisie-detaillee_popup" role="dialog" aria-modal="true" aria-label="Résultat du coup">
            <div class="saisie-detaillee_popup-head">
              <h3 class="saisie-detaillee_popup-title">Résultat du coup</h3>
              <button type="button" class="saisie-detaillee_popup-close" data-sd-popup-close aria-label="Fermer">
                <svg viewBox="0 0 24 24" ${STROKE}><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>
            <div class="saisie-detaillee_result-grid">
              ${RESULTS.map((r) => `<button type="button" class="saisie-detaillee_result-btn${r.value === 'made' ? ' is-center' : ''}${current === r.value ? ' is-active' : ''}" data-sd-result-pick="${r.value}">${r.label}</button>`).join('')}
            </div>
          </div>
        </div>`;
    }

    /* ---------- Saisie ---------- */
    function deleteShot() {
      const list = shots();
      if (list.length > 1) {
        list.splice(sel, 1);
        if (sel === 0) list[0].lie = 'Tee'; // le coup suivant devient le coup de départ
      } else list[0] = blankShot(true);
      afterChange();
    }

    screen.addEventListener('click', (e) => {
      const t = e.target;
      // En-tête : un appui en haut de l'écran l'affiche, tout autre appui le referme
      if (t.closest('[data-sd-header-toggle]')) { setHeader(true); return; }
      if (screen.classList.contains('is-header-open')) {
        setHeader(false);
        if (!t.closest('.page-header')) return;
      }
      if (!round) return;
      let el;
      if ((el = t.closest('[data-sd-shot]'))) { sel = Number(el.dataset.sdShot); renderAll(); return; }
      // Lie : un appui passe au lie suivant
      if (t.closest('[data-sd-lie-cycle]')) {
        const s = shot();
        s.lie = LIES[LIES.indexOf(s.lie) + 1] || null;
        if (s.lie === 'Green') s.club = 'Putter'; // lie green → putter
        afterChange();
        return;
      }
      if (t.closest('[data-sd-delete]')) { deleteShot(); return; }
      // Popup résultat
      if (t.closest('[data-sd-result-open]')) { renderResultPopup(true); return; }
      if ((el = t.closest('[data-sd-result-pick]'))) {
        const s = shot();
        s.result = s.result === el.dataset.sdResultPick ? null : el.dataset.sdResultPick; // second appui = désélection
        // "Rentré" = balle au fond du trou ; tout autre résultat annule un Holed
        if (s.result === 'made') s.distance = 0;
        else if (s.distance === 0) s.distance = null;
        renderResultPopup(false);
        afterChange();
        return;
      }
      if (t.closest('[data-sd-popup-close]') || t === popupRoot.firstElementChild) { renderResultPopup(false); return; }
      // Holed : distance 0 = trou terminé, plus aucun coup n'est ajouté ; un second appui annule
      if (t.closest('[data-sd-holed]')) {
        const s = shot();
        s.distance = s.distance === 0 ? null : 0;
        afterChange();
        return;
      }
      // Fairway : sélection unique ; un second clic désélectionne
      if ((el = t.closest('[data-sd-fairway]')) && !el.disabled) {
        fairways[idx] = fairways[idx] === el.dataset.sdFairway ? null : el.dataset.sdFairway;
        afterChange();
        return;
      }
      // Green : un second clic sur la même zone désélectionne
      if ((el = t.closest('[data-zone]'))) {
        const s = shot();
        s.green = s.green === el.dataset.zone ? null : el.dataset.zone;
        afterChange();
      }
    });

    clubSelect.addEventListener('change', () => {
      if (!round) return;
      const s = shot();
      s.club = clubSelect.value || null;
      if (s.club === 'Putter') s.lie = 'Green'; // putter → lie green
      afterChange();
    });

    // Distance saisie au clavier (virgule ou point)
    distInput.addEventListener('change', () => {
      if (!round) return;
      const raw = distInput.value.trim().replace(',', '.');
      const v = parseFloat(raw);
      shot().distance = raw === '' || Number.isNaN(v) ? null : Math.max(0, round1(v));
      afterChange();
    });
    distInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') distInput.blur(); });

    // Pénalité saisie au clavier numérique (0 à 9)
    penaltyInput.addEventListener('change', () => {
      if (!round) return;
      const v = parseInt(penaltyInput.value, 10);
      shot().penalty = Number.isNaN(v) ? 0 : Math.min(9, Math.max(0, v));
      afterChange();
    });
    penaltyInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') penaltyInput.blur(); });

    /* ---------- Navigation entre les trous ---------- */
    function go(step) {
      const next = idx + step;
      if (next < 0) return;
      if (next >= round.holes.length) { if (allHoled()) finishRound(); return; }
      idx = next;
      sel = 0;
      renderAll();
    }

    function finishRound() {
      // À brancher : POST /api/rounds avec round (round.entries contient la saisie de chaque trou)
      round.entries = holes.map((_, i) => holeSummary(i));
      document.dispatchEvent(new CustomEvent('stats:round-finished', { detail: round }));
      showScreen('dashboard');
    }

    prevBtn.addEventListener('click', () => go(-1));
    nextBtn.addEventListener('click', () => go(1));

    // Fonds d'image (mêmes images que la saisie rapide)
    findImage(GREEN_BG_BASE).then((url) => {
      if (!url) return;
      greenRoot.style.setProperty('--qr-green-bg', `url("${url}")`);
      const probe = new Image();
      probe.onload = () => {
        if (probe.naturalWidth > 0 && probe.naturalHeight > 0) {
          greenRatio = probe.naturalWidth / probe.naturalHeight;
          greenRoot.style.setProperty('--qr-green-ratio', greenRatio);
          if (round) renderGreenWheel();
        }
      };
      probe.src = url;
    });
    findImage(FAIRWAY_BG_BASE).then((url) => { if (url) fairwayRoot.style.backgroundImage = `url("${url}")`; });

    saisieDetaillee = { load };
    load();
  }

  const SCREEN_INIT = {
    dashboard: initDashboard,
    'par-club': initParClub,
    'par-distance': initParDistance,
    statistiques: initStatistiques,
    historique: initHistorique,
    putting: initPutting,
    'saisie-rapide': initSaisieRapide,
    'saisie-detaillee': initSaisieDetaillee,
  };

  /* ========================================================================
     13) NAVIGATION SPA — bascule entre écrans, init différée (une fois)
     ======================================================================== */

  const initialized = new Set();

  // Portée sur #page-stats : évite toute interférence avec les autres
  // modules de l'app (Parcours, etc.) qui utilisent aussi des éléments
  // [data-goto] et .screen en dehors du module Stats.
  function getStatsRoot() {
    return document.getElementById('page-stats');
  }

  function showScreen(name) {
    if (!SCREEN_INIT[name]) return;
    const root = getStatsRoot();
    if (!root) return;
    root.querySelectorAll('.screen').forEach((el) => el.classList.remove('is-active'));
    root.querySelector(`#screen-${name}`).classList.add('is-active');
    if (!initialized.has(name)) {
      SCREEN_INIT[name]();
      initialized.add(name);
    }
    window.scrollTo(0, 0);
  }

  function initNav() {
    document.addEventListener('click', (e) => {
      const root = getStatsRoot();
      if (!root || !root.contains(e.target)) return;
      const openBtn = e.target.closest('[data-new-round]');
      if (openBtn) { openNewRound(openBtn); return; }
      const btn = e.target.closest('[data-goto]');
      if (btn) showScreen(btn.dataset.goto);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyChartDefaults();
    initNav();
    showScreen('dashboard');
  });

  // Exposé pour permettre à un autre module de naviguer directement vers un écran Stats.
  window.showStatsScreen = showScreen;
})();
