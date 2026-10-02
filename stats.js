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
    comparisonLabel: '',
    categories: [
      { key: 'driving', label: 'Driving', value: null, icon: 'club' },
      { key: 'approach', label: 'Approche', value: null, icon: 'flag' },
      { key: 'shortgame', label: 'Petit jeu', value: null, icon: 'bowl' },
      { key: 'putting', label: 'Putting', value: null, icon: 'putter' },
    ],
  };

  // API: GET /api/stats/kpis?period=30d
  const kpiCards = [
    { key: 'fairways', title: 'Fairways', subtitle: 'Touchés', value: null, unit: '%', delta: null, goodWhen: 'up',
      compareLabel: 'vs période précédente', sparkline: [], icon: 'flag' },
    { key: 'gir', title: 'Greens en', subtitle: 'Régulation', value: null, unit: '%', delta: null, goodWhen: 'up',
      compareLabel: 'vs période précédente', sparkline: [], icon: 'target' },
    { key: 'putts', title: 'Putts', subtitle: 'Par tour', value: null, unit: '', delta: null, goodWhen: 'down',
      compareLabel: 'vs période précédente', sparkline: [], icon: 'putter' },
    { key: 'birdies', title: 'Birdies', subtitle: 'Par tour', value: null, unit: '', delta: null, goodWhen: 'up',
      compareLabel: 'vs période précédente', sparkline: [], icon: 'bird' },
  ];

  // API: GET /api/stats/analyses
  const detailedAnalyses = [
    // "Par club" : aucun écran dédié fourni dans les maquettes → carte non interactive (voir note de livraison).
    { key: 'par-club', title: 'Par club', description: 'Performance par club, coups moyens, dispersion, etc.', icon: 'bag', goto: null },
    { key: 'par-distance', title: 'Par distance', description: 'Résultats selon la distance initiale : GIR, proximité du trou, score, etc.', icon: 'arc', goto: 'par-distance' },
    { key: 'statistiques', title: 'Statistiques', description: "Vue d'ensemble : scoring, putting, scrambling, tendances, etc.", icon: 'bars', goto: 'putting' },
  ];

  // API: GET /api/rounds?limit=6&sort=date_desc
  const roundsHistory = [];

  // API: GET /api/rounds/summary
  const roundsSummary = {
    avgScore: null, avgScoreDelta: null, bestScore: null, bestScoreDelta: null, played: null,
    avgGrossScore: null, avgGrossDelta: null, birdiesTotal: null, doubleBogeyPlus: null,
  };

  // API: GET /api/stats/par-distance?mode=multi&period=30d&course=all&lie=all
  const distanceAnalysis = {
    score: {
      avgGross: null, avgGrossDelta: null, avgNet: null, avgNetDelta: null,
      best: null, worst: null, played: null,
      byDistance: [],
    },
    fairway: { hitPct: null, leftPct: null, rightPct: null, avgDistanceHit: null, avgDistanceMiss: null, penaltyPct: null },
    approach: { girPct: null, proximity: null, under10: null, under20: null, over50: null,
      zones: { center: null, top: null, left: null, right: null, bottom: null } },
    approches: {
      avgDistance: null, proximity: null, upDownPct: null,
      byDistance: [],
      proximityBands: [],
    },
    putts: {
      perHole: null, onePutt: null, twoPutt: null, threePlusPutt: null, avgFirstPuttDistance: null,
      byDistance: [],
    },
  };

  // API: GET /api/stats/trend?metric=fairways-touches&range=3m
  const trendSeries = {
    label: 'Fairways touchés', unit: '%',
    ranges: ['1M', '3M', '6M', '1A', 'TOUT'], activeRange: '3M',
    points: [],
    progressionPts: null, average: null, best: { value: null, date: null }, worst: { value: null, date: null },
    footnote: 'Pourcentage de fairways touchés depuis le tee de départ.',
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
    const hasDelta = kpi.delta !== null && kpi.delta !== undefined;
    const isUp = hasDelta && kpi.delta > 0;
    const trendIcon = isUp ? icon('trendUp') : icon('trendDown');
    const isGood = kpi.goodWhen === 'down' ? !isUp : isUp;
    const trendClass = hasDelta ? (isGood ? 'kpi-card__trend--good' : 'kpi-card__trend--bad') : '';
    const sign = hasDelta && kpi.delta > 0 ? '+' : '';
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
        <div class="kpi-card__value">${fmt(kpi.value)}<sup>${kpi.unit}</sup></div>
        <div class="kpi-card__trend ${trendClass}">
          ${hasDelta ? `${trendIcon} ${sign}${kpi.delta}${kpi.unit}` : ''}
          <span class="kpi-card__compare">${kpi.compareLabel}</span>
        </div>
        <div class="kpi-card__sparkline"><canvas aria-hidden="true" data-sparkline="${kpi.key}"></canvas></div>
      </article>
    `;
  }

  function mountKpiCharts(container, kpis) {
    kpis.forEach((kpi) => {
      if (!kpi.sparkline || !kpi.sparkline.length) return;
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
        <span class="analysis-card__info" tabindex="0" aria-label="${item.description}" onclick="event.stopPropagation(); this.classList.toggle('is-open')">i</span>
        <div class="analysis-card__icon">${icon(item.icon)}</div>
        <div class="analysis-card__title">${item.title}</div>
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
          <div class="field-map__label" style="top:44%; left:18%;"><span class="field-map__label-value">${fmt(data.leftPct, '%')}</span><span class="field-map__label-caption">Gauche</span></div>
          <div class="field-map__label" style="top:20%; left:50%; transform:translateX(-50%);"><span class="field-map__label-value">${fmt(data.hitPct, '%')}</span><span class="field-map__label-caption">Touchés</span></div>
          <div class="field-map__label" style="top:44%; right:16%;"><span class="field-map__label-value">${fmt(data.rightPct, '%')}</span><span class="field-map__label-caption">Droite</span></div>
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
    return `
      <div class="field-map-layout">
        <div class="field-map">
          <svg viewBox="0 0 300 200">
            <ellipse cx="150" cy="100" rx="140" ry="92" fill="rgba(255,255,255,0.03)"/>
            <ellipse cx="150" cy="100" rx="95" ry="62" fill="rgba(199,241,31,0.10)"/>
            <ellipse cx="150" cy="100" rx="55" ry="36" fill="rgba(199,241,31,0.22)" stroke="var(--color-accent)" stroke-width="1.5"/>
            <path d="M150 64 L150 84 M150 64 L162 70 L150 76" stroke="#fff" stroke-width="2" fill="none"/>
          </svg>
          <div class="field-map__label" style="top:10%; left:50%; transform:translateX(-50%);"><span class="field-map__label-value">${fmt(z.top, '%')}</span><span class="field-map__label-caption">Long</span></div>
          <div class="field-map__label" style="top:46%; left:12%;"><span class="field-map__label-value">${fmt(z.left, '%')}</span><span class="field-map__label-caption">Gauche</span></div>
          <div class="field-map__label" style="top:44%; left:50%; transform:translateX(-50%);"><span class="field-map__label-value">${fmt(z.center, '%')}</span><span class="field-map__label-caption">GIR</span></div>
          <div class="field-map__label" style="top:46%; right:10%;"><span class="field-map__label-value">${fmt(z.right, '%')}</span><span class="field-map__label-caption">Droite</span></div>
          <div class="field-map__label" style="bottom:6%; left:50%; transform:translateX(-50%);"><span class="field-map__label-value">${fmt(z.bottom, '%')}</span><span class="field-map__label-caption">Court</span></div>
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
  // `suffix` : unité optionnelle (' m', '%'...) ajoutée uniquement si la valeur est présente.
  function metric(label, value, delta, inverted, suffix) {
    const hasDelta = delta !== undefined && delta !== null;
    const isGood = !hasDelta ? null : (inverted ? delta <= 0 : delta >= 0);
    return `
      <div class="metric">
        <div class="metric__label">${label}</div>
        <div class="metric__value">${fmt(value, suffix)}</div>
        ${hasDelta ? `<div class="metric__delta ${isGood ? 'metric__delta--pos' : 'metric__delta--neg'}">${delta > 0 ? '+' : ''}${delta}</div>` : ''}
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
          ${metric('Distance moyenne', data.avgDistance, undefined, undefined, ' m')}
          ${metric('Proximité moyenne', data.proximity, undefined, undefined, ' m')}
          ${metric('Up & Down', data.upDownPct, undefined, undefined, '%')}
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
          ${metric('1 putt', data.onePutt, undefined, undefined, '%')}
          ${metric('2 putts', data.twoPutt, undefined, undefined, '%')}
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
    const hasTotal = strokesGained.total !== null && strokesGained.total !== undefined;
    const sgValueHtml = hasTotal
      ? `<div class="sg-card__value" data-count-to="${strokesGained.total}" data-count-prefix="+">+0.0</div>`
      : `<div class="sg-card__value">--</div>`;

    document.getElementById('dash-strokesGained').innerHTML = `
      <div class="sg-card__main">
        <div class="icon-badge">${icon('trendUp')}</div>
        <div>
          <div class="sg-card__label">Strokes Gained</div>
          <div class="sg-card__sublabel">Total</div>
          ${sgValueHtml}
          <div class="sg-card__caption">${strokesGained.comparisonLabel}</div>
        </div>
      </div>
      <div class="sg-card__breakdown">
        ${strokesGained.categories.map((c) => `
          <div class="sg-item">
            <div class="sg-item__label">${c.label}</div>
            <div class="sg-item__icon">${icon(c.icon)}</div>
            <div class="sg-item__value">${c.value !== null && c.value !== undefined ? '+' + c.value : '--'}</div>
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

    // Bouton flottant unique : ouvre le popup de paramétrage (voir openNewRound)
    const fabRow = document.createElement('div');
    fabRow.className = 'fab-row';
    fabRow.innerHTML = `<button class="fab" type="button" data-new-round>${icon('flag')} Nouveau parcours</button>`;
    document.getElementById('screen-dashboard').appendChild(fabRow);
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
    document.getElementById('pd-trad-average').textContent = fmt(trendSeries.average, trendSeries.unit);
    document.getElementById('pd-trad-best').textContent = fmt(trendSeries.best.value, trendSeries.unit);
    document.getElementById('pd-trad-bestDate').textContent = trendSeries.best.date || '--';
    document.getElementById('pd-trad-worst').textContent = fmt(trendSeries.worst.value, trendSeries.unit);
    document.getElementById('pd-trad-worstDate').textContent = trendSeries.worst.date || '--';
    document.getElementById('pd-trad-progression').querySelector('span').textContent = fmt(trendSeries.progressionPts !== null && trendSeries.progressionPts !== undefined ? `+${trendSeries.progressionPts}` : null, ' pts');
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
    // Mode rapide : ouvre l'écran de saisie par trou (le mode détaillé n'a pas encore d'écran)
    if (newRound.mode === 'saisie-rapide') {
      const firstOpen = !initialized.has('saisie-rapide'); // 1ʳᵉ ouverture : l'init charge déjà currentRound
      showScreen('saisie-rapide');
      if (!firstOpen && saisieRapide) saisieRapide.load(); // sinon on repart de la nouvelle partie
    }
  }

  /* ========================================================================
     SAISIE RAPIDE — écran de saisie trou par trou
     Les données du trou (numéro, par, handicap, distance) viennent de
     currentRound, construit au clic sur "Commencer la partie" avec le parcours
     et le départ choisis dans les réglages. Chaque trou garde sa propre saisie
     (score, putts, fairway, green) ; elle est retrouvée en naviguant.
     ======================================================================== */

  // Image de fond de l'encadré Green : dossier "images", fichier "FondGreenRond".
  // L'extension est détectée automatiquement parmi GREEN_BG_EXT.
  const GREEN_BG_BASE = 'images/FondGreenRond';
  const GREEN_BG_EXT = ['png', 'webp', 'jpg', 'jpeg', 'svg'];

  // Icônes du pavé numérique
  const PAD_ICONS = {
    backspace: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M9 5h10a2 2 0 012 2v10a2 2 0 01-2 2H9l-6-7z"/><path d="M12 10l4 4M16 10l-4 4"/></svg>`,
    check: `<svg viewBox="0 0 24 24" ${STROKE}><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`,
  };

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
    const subtitleEl = q('.page-header__subtitle');
    const greenRoot = document.getElementById('qr-green-root');
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
      renderHeader();
      renderHole();
    }

    /* ---------- Affichage ---------- */
    function renderHeader() {
      const parts = [round.courseName, optionLabel('tee', round.tee), `${round.holes.length} trous`];
      setText(subtitleEl, parts.filter(Boolean).join(' · '));
    }

    function renderBadge() {
      if (!badgeEl) return;
      const score = entry().score;
      badgeEl.textContent = score === null ? '–' : score;
      badgeEl.classList.toggle('is-empty', score === null);
    }

    function renderStats() {
      if (!statList) return;
      let total = 0, scored = 0, vsPar = 0, vsParHoles = 0, putts = 0, puttsHoles = 0, gir = 0, girHoles = 0;
      entries.forEach((e, i) => {
        const par = round.holes[i].par;
        if (e.score !== null) {
          total += e.score; scored++;
          if (par !== null) { vsPar += e.score - par; vsParHoles++; }
        }
        if (e.putts !== null) { putts += e.putts; puttsHoles++; }
        if (e.green !== null) { girHoles++; if (e.green === 'Centre') gir++; }
      });
      const rows = [
        ['Score', scored ? total : '--', true],
        ['Vs par', vsParHoles ? (vsPar > 0 ? `+${vsPar}` : String(vsPar)) : '--'],
        ['Putts', puttsHoles ? putts : '--'],
        ['Greens', girHoles ? `${gir}/${girHoles}` : '--'],
      ];
      statList.innerHTML = rows.map(([label, value, accent]) => `
        <div class="saisie-rapide_stat">
          <span class="saisie-rapide_stat-label">${label}</span>
          <span class="saisie-rapide_stat-value${accent ? ' is-accent' : ''}">${value}</span>
        </div>`).join('');
    }

    function renderNav() {
      const last = idx === round.holes.length - 1;
      [prevBtn, nextBtn].forEach((b) => { if (b) { b.type = 'button'; b.removeAttribute('data-goto'); } });
      if (prevBtn) {
        prevBtn.innerHTML = `${icon('back')}<span>Trou précédent</span>`;
        prevBtn.disabled = idx === 0;
      }
      if (nextBtn) {
        nextBtn.innerHTML = `<span>${last ? 'Terminer' : 'Trou suivant'}</span>${icon('arrowRight')}`;
      }
    }

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
      fairwayOptions.forEach((o) => o.setAttribute('aria-checked', String(optionKey(o) === e.fairway)));
      setText(puttsEl, e.putts === null ? '–' : e.putts);
      renderGreenWheel();
      renderStats();
      renderNav();
    }

    // Libellé d'un choix de fairway (sert de valeur enregistrée)
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
    });

    /* ---------- Putts : flèches, de 0 à 9 ---------- */
    screen.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-qr-putts]');
      if (!btn || !round) return;
      const e0 = entry();
      e0.putts = Math.min(9, Math.max(0, (e0.putts === null ? 0 : e0.putts) + Number(btn.dataset.qrPutts)));
      setText(puttsEl, e0.putts);
      renderStats();
    });

    /* ---------- Roue du green (reprise de Wedging) ----------
       Centre = green touché, 8 secteurs = direction du raté */
    const DIRECTIONS = ['Long', 'Long-Droite', 'Droite', 'Court-Droite', 'Court', 'Court-Gauche', 'Gauche', 'Long-Gauche'];
    let greenBgUrl = null;

    // Tracé d'un secteur d'anneau entre deux angles (0° = haut, sens horaire)
    function sectorPath(cx, cy, rIn, rOut, a0, a1) {
      const rad = (d) => (d - 90) * Math.PI / 180;
      const pt = (r, d) => `${(cx + r * Math.cos(rad(d))).toFixed(2)} ${(cy + r * Math.sin(rad(d))).toFixed(2)}`;
      return `M ${pt(rOut, a0)} A ${rOut} ${rOut} 0 0 1 ${pt(rOut, a1)} L ${pt(rIn, a1)} A ${rIn} ${rIn} 0 0 0 ${pt(rIn, a0)} Z`;
    }

    function renderGreenWheel() {
      if (!greenRoot || !round) return;
      const greenZone = entry().green;
      const cx = 100, cy = 100, rHole = 42, rOut = 100;
      let sectors = '';
      let ball = '';
      DIRECTIONS.forEach((dir, i) => {
        const a0 = i * 45 - 22.5, a1 = a0 + 45;
        const sel = greenZone === dir;
        sectors += `<path d="${sectorPath(cx, cy, rHole, rOut, a0, a1)}" class="saisie-rapide_wheel-sector${sel ? ' is-selected' : ''}" data-zone="${dir}"/>`;
        if (sel) {
          const rMid = (rHole + rOut) / 2, a = ((a0 + a1) / 2 - 90) * Math.PI / 180;
          ball = `<circle cx="${(cx + rMid * Math.cos(a)).toFixed(2)}" cy="${(cy + rMid * Math.sin(a)).toFixed(2)}" r="7" class="saisie-rapide_wheel-ball"/>`;
        }
      });
      const centerSel = greenZone === 'Centre';
      if (centerSel) ball = `<circle cx="${cx}" cy="${cy}" r="7" class="saisie-rapide_wheel-ball"/>`;
      const poleX = cx - 13, poleTop = cy - 16, poleBottom = cy + 18;
      // L'image de fond est dans le SVG : elle reste alignée sur les secteurs à toute taille d'écran
      const bg = greenBgUrl ? `<image href="${greenBgUrl}" x="0" y="0" width="200" height="200" preserveAspectRatio="xMidYMid slice" class="saisie-rapide_wheel-bg"/>` : '';
      greenRoot.innerHTML = `<svg viewBox="0 0 200 200" class="saisie-rapide_wheel" role="group" aria-label="Green en régulation">
        ${bg}
        ${sectors}
        <circle cx="${cx}" cy="${cy}" r="${rHole}" class="saisie-rapide_wheel-center${centerSel ? ' is-selected' : ''}" data-zone="Centre"/>
        <line x1="${poleX}" y1="${poleBottom}" x2="${poleX}" y2="${poleTop}" class="saisie-rapide_wheel-pole"/>
        <polygon points="${poleX},${poleTop} ${cx + 11},${cy - 9} ${poleX},${cy - 2}" class="saisie-rapide_wheel-flag"/>
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
        renderStats();
      });
    }

    // Cherche images/FondGreenRond.<ext> puis redessine la roue quand elle est trouvée
    (function loadGreenBackground() {
      let i = 0;
      const tryNext = () => {
        if (i >= GREEN_BG_EXT.length) { console.warn(`Image du green introuvable : ${GREEN_BG_BASE}.(${GREEN_BG_EXT.join('|')})`); return; }
        const url = `${GREEN_BG_BASE}.${GREEN_BG_EXT[i++]}`;
        const img = new Image();
        img.onload = () => { greenBgUrl = url; renderGreenWheel(); };
        img.onerror = tryNext;
        img.src = url;
      };
      tryNext();
    })();

    /* ---------- Navigation entre les trous ---------- */
    function go(step) {
      const next = idx + step;
      if (next < 0) return;
      if (next >= round.holes.length) { finishRound(); return; }
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

    function padConfirm() {
      entry().score = pad.value ? Number(pad.value) : null;
      closePad();
      renderBadge();
      renderStats();
    }

    function onPadKeydown(e) {
      if (e.key === 'Escape') closePad();
      else if (e.key === 'Enter') { e.preventDefault(); padConfirm(); }
      else if (e.key === 'Backspace') padBackspace();
      else if (/^[0-9]$/.test(e.key)) padDigit(e.key);
    }

    function ensurePad() {
      if (pad.el) return;
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
            <span class="saisie-rapide_pad-value" data-pad-value></span>
            <span class="saisie-rapide_pad-result" data-pad-result></span>
          </div>
          <div class="saisie-rapide_pad-keys">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button type="button" class="saisie-rapide_pad-key" data-pad-digit="${n}">${n}</button>`).join('')}
            <button type="button" class="saisie-rapide_pad-key is-secondary" data-pad-back aria-label="Effacer">${PAD_ICONS.backspace}</button>
            <button type="button" class="saisie-rapide_pad-key" data-pad-digit="0">0</button>
            <button type="button" class="saisie-rapide_pad-key is-primary" data-pad-ok aria-label="Valider le score">${PAD_ICONS.check}</button>
          </div>
        </div>`;
      getStatsRoot().appendChild(pad.el);

      pad.el.addEventListener('click', (e) => {
        if (e.target === pad.el || e.target.closest('[data-pad-close]')) { closePad(); return; }
        const digit = e.target.closest('[data-pad-digit]');
        if (digit) { padDigit(digit.dataset.padDigit); return; }
        if (e.target.closest('[data-pad-back]')) { padBackspace(); return; }
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

  const SCREEN_INIT = {
    dashboard: initDashboard,
    'par-distance': initParDistance,
    historique: initHistorique,
    putting: initPutting,
    'saisie-rapide': initSaisieRapide,
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
