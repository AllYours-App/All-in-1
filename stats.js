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
    total: 1.8,
    comparisonLabel: 'vs joueur 12 HCP',
    categories: [
      { key: 'driving', label: 'Driving', value: 0.5, icon: 'club' },
      { key: 'approach', label: 'Approche', value: 0.6, icon: 'flag' },
      { key: 'shortgame', label: 'Petit jeu', value: 0.2, icon: 'bowl' },
      { key: 'putting', label: 'Putting', value: 0.5, icon: 'putter' },
    ],
  };

  // API: GET /api/stats/kpis?period=30d
  const kpiCards = [
    { key: 'fairways', title: 'Fairways', subtitle: 'Touchés', value: 64, unit: '%', delta: 4, goodWhen: 'up',
      compareLabel: 'vs période précédente', sparkline: [52, 55, 58, 54, 60, 63, 61, 64, 66, 64], icon: 'flag' },
    { key: 'gir', title: 'Greens en', subtitle: 'Régulation', value: 53, unit: '%', delta: 3, goodWhen: 'up',
      compareLabel: 'vs période précédente', sparkline: [44, 46, 45, 48, 50, 49, 51, 52, 51, 53], icon: 'target' },
    { key: 'putts', title: 'Putts', subtitle: 'Par tour', value: 32.1, unit: '', delta: -0.8, goodWhen: 'down',
      compareLabel: 'vs période précédente', sparkline: [34.2, 33.8, 34.5, 33.9, 33.1, 33.4, 32.8, 32.5, 32.9, 32.1], icon: 'putter' },
    { key: 'birdies', title: 'Birdies', subtitle: 'Par tour', value: 1.1, unit: '', delta: 0.2, goodWhen: 'up',
      compareLabel: 'vs période précédente', sparkline: [0.7, 0.8, 0.9, 0.8, 1.0, 0.9, 1.0, 1.1, 1.0, 1.1], icon: 'bird' },
  ];

  // API: GET /api/stats/analyses
  const detailedAnalyses = [
    // "Par club" : aucun écran dédié fourni dans les maquettes → carte non interactive (voir note de livraison).
    { key: 'par-club', title: 'Par club', description: 'Performance par club, coups moyens, dispersion, etc.', icon: 'bag', goto: null },
    { key: 'par-distance', title: 'Par distance', description: 'Résultats selon la distance initiale : GIR, proximité du trou, score, etc.', icon: 'arc', goto: 'par-distance' },
    { key: 'statistiques', title: 'Statistiques', description: "Vue d'ensemble : scoring, putting, scrambling, tendances, etc.", icon: 'bars', goto: 'putting' },
  ];

  // API: GET /api/rounds?limit=6&sort=date_desc
  const roundsHistory = [
    { id: 'r1', course: 'Golf de Chantilly', city: 'Chantilly, France', date: '2025-05-16', score: 76, vsPar: -2, fir: 11, gir: 12 },
    { id: 'r2', course: 'Golf de Saint-Nom-la-Bretèche', city: 'Saint-Nom-la-Bretèche, France', date: '2025-05-13', score: 81, vsPar: 9, fir: 9, gir: 10 },
    { id: 'r3', course: 'Golf de Fontainebleau', city: 'Fontainebleau, France', date: '2025-05-09', score: 79, vsPar: 5, fir: 10, gir: 11 },
    { id: 'r4', course: 'Golf National', city: 'Guyancourt, France', date: '2025-05-06', score: 74, vsPar: -1, fir: 12, gir: 13 },
    { id: 'r5', course: 'Golf de Joyenval', city: 'Chambourcy, France', date: '2025-05-02', score: 83, vsPar: 11, fir: 8, gir: 9 },
    { id: 'r6', course: 'Golf de Saint-Germain', city: 'Saint-Germain-en-Laye, France', date: '2025-04-29', score: 80, vsPar: 8, fir: 10, gir: 10 },
  ];

  // API: GET /api/rounds/summary
  const roundsSummary = {
    avgScore: 79.8, avgScoreDelta: -1.4, bestScore: 74, bestScoreDelta: -2, played: 24,
    avgGrossScore: 82.6, avgGrossDelta: -1.9, birdiesTotal: 31, doubleBogeyPlus: 9,
  };

  // API: GET /api/stats/par-distance?mode=multi&period=30d&course=all&lie=all
  const distanceAnalysis = {
    score: {
      avgGross: 82.6, avgGrossDelta: -1.9, avgNet: 77.4, avgNetDelta: -2.1,
      best: 74, worst: 91, played: 24,
      byDistance: [
        { label: 'Moins de 150 m', avg: 3.0, vsPar: 0.0, holes: 48 },
        { label: '150 – 350 m', avg: 4.1, vsPar: 0.1, holes: 132 },
        { label: 'Plus de 350 m', avg: 5.2, vsPar: 0.2, holes: 84 },
      ],
    },
    fairway: { hitPct: 64, leftPct: 22, rightPct: 14, avgDistanceHit: 238, avgDistanceMiss: 205, penaltyPct: 2 },
    approach: { girPct: 53, proximity: 13.1, under10: 55, under20: 74, over50: 11,
      zones: { center: 32, top: 14, left: 24, right: 12, bottom: 18 } },
    approches: {
      avgDistance: 79, proximity: 13.1, upDownPct: 46,
      byDistance: [
        { label: '< 50 m', proximity: 2.6, success: 71 },
        { label: '50 – 100 m', proximity: 6.1, success: 55 },
        { label: '100 – 150 m', proximity: 10.8, success: 41 },
        { label: '150 – 200 m', proximity: 17.9, success: 26 },
        { label: '> 200 m', proximity: 26.4, success: 14 },
      ],
      proximityBands: [
        { key: 'under10', label: '< 10 m', pct: 55 },
        { key: 'under20', label: '10 – 20 m', pct: 22 },
        { key: 'under50', label: '20 – 50 m', pct: 14 },
        { key: 'over50', label: '> 50 m', pct: 9 },
      ],
    },
    putts: {
      perHole: 1.69, onePutt: 40, twoPutt: 52, threePlusPutt: 8, avgFirstPuttDistance: 7.2,
      byDistance: [
        { label: '< 3 m', avgPutts: 1.10, one: 90, two: 9, threePlus: 1 },
        { label: '3 – 5 m', avgPutts: 1.42, one: 55, two: 42, threePlus: 3 },
        { label: '5 – 10 m', avgPutts: 1.85, one: 27, two: 65, threePlus: 8 },
        { label: '> 10 m', avgPutts: 2.28, one: 9, two: 55, threePlus: 36 },
      ],
    },
  };

  // API: GET /api/stats/trend?metric=fairways-touches&range=3m
  const trendSeries = {
    label: 'Fairways touchés', unit: '%',
    ranges: ['1M', '3M', '6M', '1A', 'TOUT'], activeRange: '3M',
    points: [
      { x: '15/04', y: 50 }, { x: '29/04', y: 55 }, { x: '13/05', y: 59 },
      { x: '27/05', y: 53 }, { x: '10/06', y: 57 }, { x: '24/06', y: 62 },
      { x: '08/07', y: 68 }, { x: '22/07', y: 65 }, { x: '05/08', y: 69 },
      { x: '19/08', y: 73 }, { x: '02/09', y: 71 }, { x: '16/09', y: 76 },
    ],
    progressionPts: 26, average: 63, best: { value: 76, date: '16/09' }, worst: { value: 50, date: '15/04' },
    footnote: 'Pourcentage de fairways touchés depuis le tee de départ.',
  };

  // API: GET /api/stats/putting?range=20-rounds
  const puttingPerformance = {
    value: 1.69, delta: -0.15, compareLabel: 'vs période précédente',
    points: [1.92, 1.84, 1.98, 1.87, 1.74, 1.81, 1.69, 1.72, 1.66, 1.78, 1.64, 1.75, 1.61, 1.56, 1.60, 1.53, 1.66, 1.58, 1.62, 1.69],
  };

  const DEFAULT_FILTERS = {
    period: { key: 'period', icon: 'calendar', label: '30 derniers jours', options: ['7 derniers jours', '30 derniers jours', '90 derniers jours', 'Cette saison', 'Tout'] },
    course: { key: 'course', icon: 'flag', label: 'Tous parcours', options: ['Tous parcours', 'Golf National', 'Golf de Chantilly', 'Fontainebleau'] },
    lie: { key: 'lie', icon: 'sliders', label: 'Tous lies', options: ['Tous lies', 'Fairway', 'Rough', 'Bunker'] },
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
  };
  function icon(name) { return ICONS[name] || ''; }

  /* ========================================================================
     3) UTILITAIRES
     ======================================================================== */

  function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

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
    Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
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
    const isUp = kpi.delta > 0;
    const trendIcon = isUp ? icon('trendUp') : icon('trendDown');
    const isGood = kpi.goodWhen === 'down' ? !isUp : isUp;
    const trendClass = isGood ? 'kpi-card__trend--good' : 'kpi-card__trend--bad';
    const sign = kpi.delta > 0 ? '+' : '';
    // Carte non interactive : les maquettes ne montrent aucune navigation
    // déclenchée par les cartes KPI de l'écran Dashboard.
    return `
      <article class="card kpi-card fade-up" style="--fade-index:${index}" data-kpi="${kpi.key}">
        <div class="kpi-card__head">
          <div class="icon-badge">${icon(kpi.icon)}</div>
          <div class="kpi-card__titles">
            <div class="kpi-card__title">${kpi.title}</div>
            <div class="kpi-card__subtitle">${kpi.subtitle}</div>
          </div>
        </div>
        <div class="kpi-card__value">${kpi.value}<sup>${kpi.unit}</sup></div>
        <div class="kpi-card__trend ${trendClass}">
          ${trendIcon} ${sign}${kpi.delta}${kpi.unit}
          <span class="kpi-card__compare">${kpi.compareLabel}</span>
        </div>
        <div class="kpi-card__sparkline"><canvas aria-hidden="true" data-sparkline="${kpi.key}"></canvas></div>
      </article>
    `;
  }

  function mountKpiCharts(container, kpis) {
    kpis.forEach((kpi) => {
      const canvas = container.querySelector(`canvas[data-sparkline="${kpi.key}"]`);
      const isGood = kpi.goodWhen === 'down' ? kpi.delta < 0 : kpi.delta > 0;
      if (canvas) createSparkline(canvas, kpi.sparkline, isGood);
    });
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

  function renderFilterBar(root, filters, onChange) {
    root.innerHTML = filters.map((f) => `
      <div class="filter-chip-wrap" style="position:relative; flex-shrink:0;">
        <button type="button" class="filter-chip" data-key="${f.key}" aria-haspopup="listbox" aria-expanded="false">
          ${icon(f.icon)}<span data-label>${f.label}</span>${icon('chevronDown')}
        </button>
      </div>
    `).join('');

    function closeAll() {
      root.querySelectorAll('.filter-dropdown').forEach((d) => d.remove());
      root.querySelectorAll('.filter-chip').forEach((c) => c.setAttribute('aria-expanded', 'false'));
    }

    filters.forEach((f) => {
      const chip = root.querySelector(`.filter-chip[data-key="${f.key}"]`);
      const wrap = chip.parentElement;
      chip.addEventListener('click', () => {
        const existing = wrap.querySelector('.filter-dropdown');
        closeAll();
        if (existing) return;
        const dropdown = document.createElement('div');
        dropdown.className = 'filter-dropdown';
        Object.assign(dropdown.style, {
          position: 'absolute', top: 'calc(100% + 6px)', left: '0',
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
            chip.querySelector('[data-label]').textContent = f.options[i];
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
    container.innerHTML = `
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
    `;
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
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(chart.data.datasets.length - 1);
      ctx.save();
      ctx.font = '600 11px Inter, sans-serif';
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

  function createPerformanceChart(canvas, points, variant) {
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
          tooltip: { backgroundColor: cssVar('--color-bg-elevated'), borderColor: gridColor, borderWidth: 1, titleColor: textColor, bodyColor: '#fff', padding: 10, cornerRadius: 10, displayColors: false },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: textColor, font: { size: 11 } } },
          y: { grid: { color: gridColor, drawTicks: false }, border: { display: false }, ticks: { color: textColor, font: { size: 11 } } },
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
    // "Par club" n'a pas d'écran dédié dans le périmètre livré : carte non interactive.
    const disabled = !item.goto;
    const tag = disabled ? 'div' : 'button';
    const attrs = disabled
      ? 'class="card analysis-card analysis-card--disabled fade-up"'
      : `type="button" data-goto="${item.goto}" class="card card--interactive analysis-card fade-up"`;
    return `
      <${tag} ${attrs} style="--fade-index:${index}; text-align:left;">
        <div class="analysis-card__icon">${icon(item.icon)}</div>
        <div class="analysis-card__title">${item.title}</div>
        <div class="analysis-card__desc">${item.description}</div>
        <div class="analysis-card__arrow">${icon('chevronRight')}</div>
      </${tag}>
    `;
  }

  function renderFairwayMap(data) {
    return `
      <div class="field-map-layout">
        <div class="field-map">
          <svg viewBox="0 0 300 200" preserveAspectRatio="none">
            <polygon points="120,0 180,0 210,200 90,200" fill="rgba(199,241,31,0.22)" stroke="var(--color-accent)" stroke-width="1.5" stroke-dasharray="4 4"/>
            <polygon points="0,0 120,0 90,200 0,200" fill="rgba(255,255,255,0.04)"/>
            <polygon points="180,0 300,0 300,200 210,200" fill="rgba(255,255,255,0.04)"/>
            <line x1="150" y1="0" x2="150" y2="200" stroke="rgba(255,255,255,0.25)" stroke-dasharray="3 5"/>
            <circle cx="150" cy="14" r="5" fill="#fff" stroke="rgba(0,0,0,0.3)"/>
          </svg>
          <div class="field-map__label" style="top:44%; left:18%;"><span class="field-map__label-value">${data.leftPct}%</span><span class="field-map__label-caption">Gauche</span></div>
          <div class="field-map__label" style="top:20%; left:50%; transform:translateX(-50%);"><span class="field-map__label-value">${data.hitPct}%</span><span class="field-map__label-caption">Touchés</span></div>
          <div class="field-map__label" style="top:44%; right:16%;"><span class="field-map__label-value">${data.rightPct}%</span><span class="field-map__label-caption">Droite</span></div>
        </div>
        <div class="field-map__side-table">
          <div class="field-map__row"><span class="field-map__row-label">Fairways touchés</span><span class="field-map__row-value">${data.hitPct}%</span></div>
          <div class="field-map__row"><span class="field-map__row-label">Ratés gauche</span><span class="field-map__row-value">${data.leftPct}%</span></div>
          <div class="field-map__row"><span class="field-map__row-label">Ratés droite</span><span class="field-map__row-value">${data.rightPct}%</span></div>
          <div class="field-map__row"><span class="field-map__row-label">Distance moy. (touché)</span><span class="field-map__row-value">${data.avgDistanceHit} m</span></div>
          <div class="field-map__row"><span class="field-map__row-label">Distance moy. (raté)</span><span class="field-map__row-value">${data.avgDistanceMiss} m</span></div>
          <div class="field-map__row"><span class="field-map__row-label">Penalty</span><span class="field-map__row-value">${data.penaltyPct}%</span></div>
        </div>
      </div>
    `;
  }

  function renderApproachMap(data) {
    const z = data.zones;
    return `
      <div class="field-map-layout">
        <div class="field-map">
          <svg viewBox="0 0 300 200">
            <ellipse cx="150" cy="100" rx="140" ry="92" fill="rgba(255,255,255,0.03)"/>
            <ellipse cx="150" cy="100" rx="95" ry="62" fill="rgba(199,241,31,0.10)"/>
            <ellipse cx="150" cy="100" rx="55" ry="36" fill="rgba(199,241,31,0.22)" stroke="var(--color-accent)" stroke-width="1.5"/>
            <path d="M150 64 L150 84 M150 64 L162 70 L150 76" stroke="#fff" stroke-width="2" fill="none"/>
          </svg>
          <div class="field-map__label" style="top:10%; left:50%; transform:translateX(-50%);"><span class="field-map__label-value">${z.top}%</span><span class="field-map__label-caption">Long</span></div>
          <div class="field-map__label" style="top:46%; left:12%;"><span class="field-map__label-value">${z.left}%</span><span class="field-map__label-caption">Gauche</span></div>
          <div class="field-map__label" style="top:44%; left:50%; transform:translateX(-50%);"><span class="field-map__label-value">${z.center}%</span><span class="field-map__label-caption">GIR</span></div>
          <div class="field-map__label" style="top:46%; right:10%;"><span class="field-map__label-value">${z.right}%</span><span class="field-map__label-caption">Droite</span></div>
          <div class="field-map__label" style="bottom:6%; left:50%; transform:translateX(-50%);"><span class="field-map__label-value">${z.bottom}%</span><span class="field-map__label-caption">Court</span></div>
        </div>
        <div class="field-map__side-table">
          <div class="field-map__row"><span class="field-map__row-label">Greens en régulation</span><span class="field-map__row-value">${data.girPct}%</span></div>
          <div class="field-map__row"><span class="field-map__row-label">Proximité du trou</span><span class="field-map__row-value">${data.proximity} m</span></div>
          <div class="field-map__row"><span class="field-map__row-label">Approches &lt; 10 m</span><span class="field-map__row-value">${data.under10}%</span></div>
          <div class="field-map__row"><span class="field-map__row-label">Approches &lt; 20 m</span><span class="field-map__row-value">${data.under20}%</span></div>
          <div class="field-map__row"><span class="field-map__row-label">Approches &gt; 50 m</span><span class="field-map__row-value">${data.over50}%</span></div>
        </div>
      </div>
    `;
  }

  const DISPERSION_COLORS = { under10: '#C7F11F', under20: '#8FD11A', under50: '#5C9E14', over50: 'rgba(255,255,255,0.35)' };

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
     11) BLOCS "PAR DISTANCE" — SCORE / FAIRWAY / APPROACH / APPROCHES / PUTTS
     ======================================================================== */

  // `inverted = true` : une baisse est une bonne nouvelle (ex : score) → couleur inversée.
  function metric(label, value, delta, inverted) {
    const isGood = delta === undefined ? null : (inverted ? delta <= 0 : delta >= 0);
    return `
      <div class="metric">
        <div class="metric__label">${label}</div>
        <div class="metric__value">${value}</div>
        ${delta !== undefined ? `<div class="metric__delta ${isGood ? 'metric__delta--pos' : 'metric__delta--neg'}">${delta > 0 ? '+' : ''}${delta}</div>` : ''}
      </div>
    `;
  }

  // Chevron décoratif ("SCORE >", "FAIRWAY >"...) : présent dans la maquette
  // mais aucune navigation associée n'y est montrée → non cliquable.
  function statBlockHeader(titleIcon, title) {
    return `
      <div class="stat-block__header">
        <div class="stat-block__title">
          ${icon(titleIcon)} ${title}
          <span class="stat-block__title__chevron">${icon('chevronRight')}</span>
        </div>
        <div class="stat-block__dropdown">Sur toutes les distances ${icon('chevronDown')}</div>
      </div>
    `;
  }

  function renderScoreBlock(data) {
    return `
      <section class="stat-block fade-up">
        ${statBlockHeader('bars', 'Score')}
        <div class="stat-block__metrics">
          ${metric('Score brut moyen', data.avgGross, data.avgGrossDelta, true)}
          ${metric('Score net moyen', data.avgNet, data.avgNetDelta, true)}
          ${metric('Meilleur score', data.best)}
          ${metric('Moins bon score', data.worst)}
          ${metric('Parties jouées', data.played)}
        </div>
        <table class="data-table">
          <thead><tr><th>Distance du trou</th><th>Score moyen</th><th>Vs par</th><th>Trous</th></tr></thead>
          <tbody>
            ${data.byDistance.map((row) => `
              <tr>
                <td>${row.label}</td><td>${row.avg.toFixed(1)}</td>
                <td class="${row.vsPar > 0 ? 'val-neg' : 'val-pos'}">${row.vsPar > 0 ? '+' : ''}${row.vsPar.toFixed(1)}</td>
                <td>${row.holes}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>
    `;
  }

  function renderFairwayBlock(data) {
    return `<section class="stat-block fade-up">${statBlockHeader('flag', 'Fairway')}${renderFairwayMap(data)}</section>`;
  }

  function renderApproachBlock(data) {
    return `<section class="stat-block fade-up">${statBlockHeader('target', 'Approach')}${renderApproachMap(data)}</section>`;
  }

  function renderApprochesBlock(data) {
    return `
      <section class="stat-block fade-up">
        ${statBlockHeader('putter', 'Approches')}
        <div class="stat-block__metrics">
          ${metric('Distance moyenne', data.avgDistance + ' m')}
          ${metric('Proximité moyenne', data.proximity + ' m')}
          ${metric('Up & Down', data.upDownPct + '%')}
        </div>
        <table class="data-table">
          <thead><tr><th>Distance</th><th>Proximité</th><th>Réussite</th></tr></thead>
          <tbody>${data.byDistance.map((row) => `<tr><td>${row.label}</td><td>${row.proximity} m</td><td>${row.success}%</td></tr>`).join('')}</tbody>
        </table>
        <div>
          <div class="chart-canvas-wrap chart-canvas-wrap--sm" style="height:180px;"><canvas data-dispersion></canvas></div>
          ${renderDispersionLegend(data.proximityBands)}
        </div>
      </section>
    `;
  }

  function renderPuttsBlock(data) {
    return `
      <section class="stat-block fade-up">
        ${statBlockHeader('putter', 'Putts')}
        <div class="stat-block__metrics">
          ${metric('Putts par trou', data.perHole)}
          ${metric('1 putt', data.onePutt + '%')}
          ${metric('2 putts', data.twoPutt + '%')}
        </div>
        <table class="data-table">
          <thead><tr><th>Distance 1er putt</th><th>Putts moy.</th><th>1 putt</th><th>2 putts</th><th>3 putts+</th></tr></thead>
          <tbody>${data.byDistance.map((row) => `<tr><td>${row.label}</td><td>${row.avgPutts.toFixed(2)}</td><td>${row.one}%</td><td>${row.two}%</td><td>${row.threePlus}%</td></tr>`).join('')}</tbody>
        </table>
      </section>
    `;
  }

  /* ========================================================================
     12) INITIALISATION DES 6 ÉCRANS (appelée une seule fois, au premier accès)
     ======================================================================== */

  function initDashboard() {
    document.getElementById('dash-strokesGained').innerHTML = `
      <div class="sg-card__main">
        <div class="icon-badge">${icon('trendUp')}</div>
        <div>
          <div class="sg-card__label">Strokes Gained</div>
          <div class="sg-card__sublabel">Total</div>
          <div class="sg-card__value" data-count-to="${strokesGained.total}" data-count-prefix="+">+0.0</div>
          <div class="sg-card__caption">${strokesGained.comparisonLabel}</div>
        </div>
      </div>
      <div class="sg-card__breakdown">
        ${strokesGained.categories.map((c) => `
          <div class="sg-item">
            <div class="sg-item__label">${c.label}</div>
            <div class="sg-item__icon">${icon(c.icon)}</div>
            <div class="sg-item__value">+${c.value}</div>
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

    mountKpiCharts(kpiGrid, kpiCards);
  }

  function initParDistance() {
    // Le segmented control change le pane affiché ; il ne change pas d'écran.
    initSegmentedControl(document.getElementById('pd-modeTabs'), ['Multi', 'Traditionnel', 'SG'], 0, (i, label) => {
      showParDistancePane(label);
    });

    renderParDistanceMulti();
    renderParDistanceTraditionnel();
    // Pane "SG" : aucune maquette fournie → laissée vide intentionnellement.

    showParDistancePane('Multi');
  }

  function showParDistancePane(label) {
    const panes = { Multi: 'pd-pane-multi', Traditionnel: 'pd-pane-traditionnel', SG: 'pd-pane-sg' };
    Object.values(panes).forEach((id) => document.getElementById(id).classList.remove('is-active'));
    document.getElementById(panes[label]).classList.add('is-active');
  }

  // Pane "Multi" — image 2
  function renderParDistanceMulti() {
    renderFilterBar(document.getElementById('pd-multi-filters'), [DEFAULT_FILTERS.period, DEFAULT_FILTERS.course, DEFAULT_FILTERS.lie]);

    const blocksEl = document.getElementById('pd-multi-blocks');
    blocksEl.innerHTML =
      renderScoreBlock(distanceAnalysis.score) +
      renderFairwayBlock(distanceAnalysis.fairway) +
      renderApproachBlock(distanceAnalysis.approach) +
      renderApprochesBlock(distanceAnalysis.approches) +
      renderPuttsBlock(distanceAnalysis.putts);

    const dispersionCanvas = blocksEl.querySelector('[data-dispersion]');
    if (dispersionCanvas) createDispersionChart(dispersionCanvas, distanceAnalysis.approches.proximityBands);

    animateCounters(document.getElementById('pd-pane-multi'), 800);
  }

  // Pane "Traditionnel" — image 4
  function renderParDistanceTraditionnel() {
    renderFilterBar(document.getElementById('pd-trad-filters'), [
      { key: 'course', icon: 'flag', label: 'Tous parcours', options: DEFAULT_FILTERS.course.options },
      { key: 'period', icon: 'calendar', label: '30 derniers parcours', options: ['10 derniers parcours', '30 derniers parcours', '90 derniers parcours', 'Tout'] },
    ]);

    document.getElementById('pd-trad-title').textContent = trendSeries.label;
    document.getElementById('pd-trad-unit').textContent = `(${trendSeries.unit})`;
    document.getElementById('pd-trad-average').textContent = trendSeries.average + trendSeries.unit;
    document.getElementById('pd-trad-best').textContent = trendSeries.best.value + trendSeries.unit;
    document.getElementById('pd-trad-bestDate').textContent = trendSeries.best.date;
    document.getElementById('pd-trad-worst').textContent = trendSeries.worst.value + trendSeries.unit;
    document.getElementById('pd-trad-worstDate').textContent = trendSeries.worst.date;
    document.getElementById('pd-trad-progression').querySelector('span').textContent = `+${trendSeries.progressionPts} pts`;
    document.getElementById('pd-trad-footnote').textContent = trendSeries.footnote;

    const tabsEl = document.getElementById('pd-trad-periodTabs');
    tabsEl.innerHTML = trendSeries.ranges.map((r) => `<button type="button" class="period-tab" role="tab" aria-selected="${r === trendSeries.activeRange}">${r}</button>`).join('');
    tabsEl.querySelectorAll('.period-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        tabsEl.querySelectorAll('.period-tab').forEach((t) => t.setAttribute('aria-selected', 'false'));
        tab.setAttribute('aria-selected', 'true');
        // Ici : recharger les points du graphique pour la période sélectionnée (branchement API)
      });
    });

    createPerformanceChart(document.getElementById('pd-trad-chart'), trendSeries.points, 'bar-line');
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
        <div class="mini-stat__value">${value}</div>
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

    document.getElementById('put-value').dataset.countTo = puttingPerformance.value;
    const deltaEl = document.getElementById('put-delta');
    const isGood = puttingPerformance.delta <= 0; // baisse des putts = amélioration
    deltaEl.className = `kpi-card__trend ${isGood ? 'kpi-card__trend--good' : 'kpi-card__trend--bad'}`;
    deltaEl.textContent = `${puttingPerformance.delta > 0 ? '+' : ''}${puttingPerformance.delta} ${puttingPerformance.compareLabel}`;

    const points = puttingPerformance.points.map((y, i) => ({ x: String(i + 1), y }));
    createPerformanceChart(document.getElementById('put-chart'), points, 'line');

    animateCounters(document.getElementById('screen-putting'), 800);
  }

  const SCREEN_INIT = {
    dashboard: initDashboard,
    'par-distance': initParDistance,
    historique: initHistorique,
    putting: initPutting,
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
      const btn = e.target.closest('[data-goto]');
      if (btn) showScreen(btn.dataset.goto);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyChartDefaults();
    initNav();
    showScreen('dashboard');
  });
})();
