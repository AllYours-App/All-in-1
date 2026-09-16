const root = document.getElementById('app-root');

function renderPuttingTab() {
  root.innerHTML = `
<header class="page-header" data-header="main">
  <a href="#" class="page-header_back" onclick="showPage('home')">
    <svg class="page-header_back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
    <span class="page-header_back-label">Home</span>
  </a>
  <h1 class="page-header_title">Putting</h1>
  <button class="page-header_menu" aria-label="Menu" onclick="showToast('Menu à venir')">
    <svg class="page-header_menu-icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
  </button>
</header>

<header class="page-header is-hidden" data-header="stats">
  <a href="#" class="page-header_back" onclick="backToPuttingMain(event)">
    <svg class="page-header_back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
    <span class="page-header_back-label">Putting</span>
  </a>
  <h1 class="page-header_title">Stats Performance</h1>
  <button class="page-header_menu" aria-label="Informations" onclick="showToast('Informations à venir')">
    <svg class="page-header_menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 16v-5"/><circle cx="12" cy="8.2" r="0.6" fill="currentColor" stroke="none"/></svg>
  </button>
</header>

<header class="page-header is-hidden" data-header="exercise-flow">
  <a href="#" class="page-header_back" onclick="exitExerciseFlow(event)">
    <svg class="page-header_back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
    <span class="page-header_back-label">Exercices</span>
  </a>
  <h1 class="page-header_title" id="exercise-flow-title">Exercice</h1>
  <span class="page-header_menu"></span>
</header>

<main class="putting_wrapper">

  <!-- Barre nav parcours / exercices -->
  <div class="putting_tabs">
    <a href="#" class="putting_tab is-active" data-tab="parcours" onclick="selectPuttingTab(event, 'parcours')">
      <svg class="putting_tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 21V4a1 1 0 0 1 1-1h1v6h5l-3-3"/></svg>
      <div class="putting_tab-text">
        <div class="putting_tab-title">Parcours</div>
        <div class="putting_tab-subtitle">Saisie réelle ou test</div>
      </div>
    </a>
    <a href="#" class="putting_tab" data-tab="exercices" onclick="selectPuttingTab(event, 'exercices')">
      <svg class="putting_tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5"/></svg>
      <div class="putting_tab-text">
        <div class="putting_tab-title">Exercices</div>
        <div class="putting_tab-subtitle">Entraînement structuré</div>
      </div>
    </a>
  </div>

  <!-- Panneau Parcours -->
  <div class="tab-panel" data-panel="parcours">

    <div class="page-subtitle">Petit progrès chaque jour, gros résultats demain.</div>

    <!-- Sous-panneau : accueil Parcours -->
    <div class="analyse-subpanel" data-sub="home">

      <!-- Carte reprendre : masquée par défaut, affichée par JS uniquement quand une reprise existe -->
      <div class="resume-card is-hidden">
        <div class="resume-card_image"></div>
        <div class="resume-card_content">
          <div class="resume-card_label">À reprendre</div>
          <div class="resume-card_name"></div>
          <button class="resume-card_button" disabled title="Aucune séance en cours">
            <svg class="resume-card_button-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            Reprendre
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats_grid">
        <div class="stat-card">
          <div class="stat-card_icon-wrap">
            <svg class="stat-card_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>
          </div>
          <div class="stat-card_label">SG Putting</div>
          <div class="stat-card_value">--</div>
        </div>
        <div class="stat-card">
          <div class="stat-card_icon-wrap">
            <svg class="stat-card_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5"/></svg>
          </div>
          <div class="stat-card_label">1 Putt %</div>
          <div class="stat-card_value">--</div>
        </div>
      </div>

      <!-- Historique : toujours visible, liste vide si aucune activité -->
      <div class="history-card">
        <div class="history-card_header">
          <div class="history-card_title">Activité récente</div>
          <a href="#" class="history-card_link is-disabled" onclick="event.preventDefault()">Voir tout</a>
        </div>
        <div class="history-card_list" id="parcours-history-list"></div>
      </div>

    </div>

    <!-- Sous-panneau : Analyse Distance -->
    <div class="analyse-subpanel is-hidden" data-sub="analyse-distance">

      <div class="analyse-header">
        <div class="analyse-header_top">
          <div>
            <div class="analyse-header_eyebrow">Analyse</div>
            <h2 class="analyse-header_title">Distance</h2>
          </div>
          <button class="analyse-about_button" onclick="showToast('Informations à venir')">
            À propos
            <svg class="analyse-about_button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 16v-5"/><circle cx="12" cy="8.2" r="0.6" fill="currentColor" stroke="none"/></svg>
          </button>
        </div>
        <div class="analyse-header_desc">Vos performances selon la distance des putts.</div>
      </div>

      <div class="analyse-filters">
        <button class="analyse-filter is-active" id="filter-btn-distance-sessions" onclick="openFilterSheet(event, 'distance', 'sessions')">
          <span class="analyse-filter_label">Sessions</span>
          <span class="analyse-filter_value"><span class="filter-value-text">20 dernières</span><svg class="analyse-filter_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></span>
        </button>
        <button class="analyse-filter" id="filter-btn-distance-parcours" onclick="openFilterSheet(event, 'distance', 'parcours')">
          <span class="analyse-filter_label">Parcours</span>
          <span class="analyse-filter_value"><span class="filter-value-text">Tous les parcours</span><svg class="analyse-filter_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></span>
        </button>
        <button class="analyse-filter" id="filter-btn-distance-compare" onclick="openFilterSheet(event, 'distance', 'compare')">
          <span class="analyse-filter_label">Comparer</span>
          <span class="analyse-filter_value"><span class="filter-value-text">Aucune</span><svg class="analyse-filter_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></span>
        </button>
      </div>

      <div class="chart-card">
        <div class="chart-card_header">
          <div class="chart-card_title">
            SG vs Tour par distance
          </div>
        </div>

        <div class="bar-chart bar-chart-centered">
          <div class="bar-chart_row">
            <div class="bar-chart_label">All</div>
            <div class="bar-chart_bar-wrap bar-chart_bar-wrap-centered"><div class="bar-chart_center-line"></div><div class="bar-chart_fill bar-chart_fill-centered" style="width: 0%; left: 50%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">0 à 2m</div>
            <div class="bar-chart_bar-wrap bar-chart_bar-wrap-centered"><div class="bar-chart_center-line"></div><div class="bar-chart_fill bar-chart_fill-centered" style="width: 0%; left: 50%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">&gt;2 à 3m</div>
            <div class="bar-chart_bar-wrap bar-chart_bar-wrap-centered"><div class="bar-chart_center-line"></div><div class="bar-chart_fill bar-chart_fill-centered" style="width: 0%; left: 50%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">&gt;3 à 5m</div>
            <div class="bar-chart_bar-wrap bar-chart_bar-wrap-centered"><div class="bar-chart_center-line"></div><div class="bar-chart_fill bar-chart_fill-centered" style="width: 0%; left: 50%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">&gt;5 à 9m</div>
            <div class="bar-chart_bar-wrap bar-chart_bar-wrap-centered"><div class="bar-chart_center-line"></div><div class="bar-chart_fill bar-chart_fill-centered" style="width: 0%; left: 50%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">&gt;9m</div>
            <div class="bar-chart_bar-wrap bar-chart_bar-wrap-centered"><div class="bar-chart_center-line"></div><div class="bar-chart_fill bar-chart_fill-centered" style="width: 0%; left: 50%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_axis-title">SG Putting</div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-card_header">
          <div class="chart-card_title">
            Taux de réussite par distance
          </div>
        </div>

        <div class="bar-chart">
          <div class="bar-chart_row">
            <div class="bar-chart_label">All</div>
            <div class="bar-chart_bar-wrap"><div class="bar-chart_fill" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">0 à 2m</div>
            <div class="bar-chart_bar-wrap"><div class="bar-chart_fill" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">&gt;2 à 3m</div>
            <div class="bar-chart_bar-wrap"><div class="bar-chart_fill" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">&gt;3 à 5m</div>
            <div class="bar-chart_bar-wrap"><div class="bar-chart_fill" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">&gt;5 à 9m</div>
            <div class="bar-chart_bar-wrap"><div class="bar-chart_fill" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">&gt;9m</div>
            <div class="bar-chart_bar-wrap"><div class="bar-chart_fill" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_axis">
            <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
          </div>
          <div class="bar-chart_axis-title">Taux de réussite</div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-card_header">
          <div class="chart-card_title">
            Erreurs de vitesse et de pente
          </div>
        </div>

        <div class="bar-chart_legend">
          <span class="bar-chart_legend-item"><span class="bar-chart_legend-dot bar-chart_legend-dot-speed"></span>Erreur de vitesse</span>
          <span class="bar-chart_legend-item"><span class="bar-chart_legend-dot bar-chart_legend-dot-slope"></span>Erreur de pente</span>
        </div>

        <div class="bar-chart">
          <div class="bar-chart_row">
            <div class="bar-chart_label">All</div>
            <div class="bar-chart_bar-wrap-dual">
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-speed" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-slope" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
            </div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">0 à 2m</div>
            <div class="bar-chart_bar-wrap-dual">
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-speed" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-slope" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
            </div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">&gt;2 à 3m</div>
            <div class="bar-chart_bar-wrap-dual">
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-speed" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-slope" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
            </div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">&gt;3 à 5m</div>
            <div class="bar-chart_bar-wrap-dual">
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-speed" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-slope" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
            </div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">&gt;5 à 9m</div>
            <div class="bar-chart_bar-wrap-dual">
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-speed" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-slope" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
            </div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">&gt;9m</div>
            <div class="bar-chart_bar-wrap-dual">
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-speed" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-slope" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
            </div>
          </div>
          <div class="bar-chart_axis">
            <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
          </div>
          <div class="bar-chart_axis-title">Taux d'erreur</div>
        </div>
      </div>

    </div>

    <!-- Sous-panneau : Analyse Pente -->
    <div class="analyse-subpanel is-hidden" data-sub="analyse-pente">

      <div class="analyse-header">
        <div class="analyse-header_top">
          <div>
            <div class="analyse-header_eyebrow">Analyse</div>
            <h2 class="analyse-header_title">Pente</h2>
          </div>
          <button class="analyse-about_button" onclick="showToast('Informations à venir')">
            À propos
            <svg class="analyse-about_button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 16v-5"/><circle cx="12" cy="8.2" r="0.6" fill="currentColor" stroke="none"/></svg>
          </button>
        </div>
        <div class="analyse-header_desc">Vos performances selon la pente des putts.</div>
      </div>

      <div class="analyse-filters">
        <button class="analyse-filter is-active" id="filter-btn-pente-sessions" onclick="openFilterSheet(event, 'pente', 'sessions')">
          <span class="analyse-filter_label">Sessions</span>
          <span class="analyse-filter_value"><span class="filter-value-text">20 dernières</span><svg class="analyse-filter_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></span>
        </button>
        <button class="analyse-filter" id="filter-btn-pente-distance" onclick="openFilterSheet(event, 'pente', 'distance')">
          <span class="analyse-filter_label">Distance</span>
          <span class="analyse-filter_value"><span class="filter-value-text">Toutes distances</span><svg class="analyse-filter_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></span>
        </button>
        <button class="analyse-filter" id="filter-btn-pente-parcours" onclick="openFilterSheet(event, 'pente', 'parcours')">
          <span class="analyse-filter_label">Parcours</span>
          <span class="analyse-filter_value"><span class="filter-value-text">Tous les parcours</span><svg class="analyse-filter_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></span>
        </button>
        <button class="analyse-filter" id="filter-btn-pente-compare" onclick="openFilterSheet(event, 'pente', 'compare')">
          <span class="analyse-filter_label">Comparer</span>
          <span class="analyse-filter_value"><span class="filter-value-text">Aucune</span><svg class="analyse-filter_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></span>
        </button>
      </div>

      <div class="chart-card">
        <div class="chart-card_header">
          <div class="chart-card_title">
            SG vs Tour
          </div>
        </div>

        <div class="bar-chart bar-chart-centered">
          <div class="bar-chart_row">
            <div class="bar-chart_label">Montée</div>
            <div class="bar-chart_bar-wrap bar-chart_bar-wrap-centered"><div class="bar-chart_center-line"></div><div class="bar-chart_fill bar-chart_fill-centered" style="width: 0%; left: 50%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">Montée D→G</div>
            <div class="bar-chart_bar-wrap bar-chart_bar-wrap-centered"><div class="bar-chart_center-line"></div><div class="bar-chart_fill bar-chart_fill-centered" style="width: 0%; left: 50%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">D→G</div>
            <div class="bar-chart_bar-wrap bar-chart_bar-wrap-centered"><div class="bar-chart_center-line"></div><div class="bar-chart_fill bar-chart_fill-centered" style="width: 0%; left: 50%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">Descente D→G</div>
            <div class="bar-chart_bar-wrap bar-chart_bar-wrap-centered"><div class="bar-chart_center-line"></div><div class="bar-chart_fill bar-chart_fill-centered" style="width: 0%; left: 50%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">Descente</div>
            <div class="bar-chart_bar-wrap bar-chart_bar-wrap-centered"><div class="bar-chart_center-line"></div><div class="bar-chart_fill bar-chart_fill-centered" style="width: 0%; left: 50%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">Descente G→D</div>
            <div class="bar-chart_bar-wrap bar-chart_bar-wrap-centered"><div class="bar-chart_center-line"></div><div class="bar-chart_fill bar-chart_fill-centered" style="width: 0%; left: 50%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">G→D</div>
            <div class="bar-chart_bar-wrap bar-chart_bar-wrap-centered"><div class="bar-chart_center-line"></div><div class="bar-chart_fill bar-chart_fill-centered" style="width: 0%; left: 50%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">Montée G→D</div>
            <div class="bar-chart_bar-wrap bar-chart_bar-wrap-centered"><div class="bar-chart_center-line"></div><div class="bar-chart_fill bar-chart_fill-centered" style="width: 0%; left: 50%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_axis-title">SG Putting</div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-card_header">
          <div class="chart-card_title">
            Taux de réussite
          </div>
        </div>

        <div class="bar-chart">
          <div class="bar-chart_row">
            <div class="bar-chart_label">Montée</div>
            <div class="bar-chart_bar-wrap"><div class="bar-chart_fill" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">Montée D→G</div>
            <div class="bar-chart_bar-wrap"><div class="bar-chart_fill" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">D→G</div>
            <div class="bar-chart_bar-wrap"><div class="bar-chart_fill" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">Descente D→G</div>
            <div class="bar-chart_bar-wrap"><div class="bar-chart_fill" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">Descente</div>
            <div class="bar-chart_bar-wrap"><div class="bar-chart_fill" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">Descente G→D</div>
            <div class="bar-chart_bar-wrap"><div class="bar-chart_fill" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">G→D</div>
            <div class="bar-chart_bar-wrap"><div class="bar-chart_fill" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">Montée G→D</div>
            <div class="bar-chart_bar-wrap"><div class="bar-chart_fill" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
          </div>
          <div class="bar-chart_axis">
            <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
          </div>
          <div class="bar-chart_axis-title">Taux de réussite</div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-card_header">
          <div class="chart-card_title">
            Erreurs de vitesse et de pente
          </div>
        </div>

        <div class="bar-chart_legend">
          <span class="bar-chart_legend-item"><span class="bar-chart_legend-dot bar-chart_legend-dot-speed"></span>Erreur de vitesse</span>
          <span class="bar-chart_legend-item"><span class="bar-chart_legend-dot bar-chart_legend-dot-slope"></span>Erreur de pente</span>
        </div>

        <div class="bar-chart">
          <div class="bar-chart_row">
            <div class="bar-chart_label">All</div>
            <div class="bar-chart_bar-wrap-dual">
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-speed" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-slope" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
            </div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">Montée</div>
            <div class="bar-chart_bar-wrap-dual">
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-speed" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-slope" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
            </div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">Descente</div>
            <div class="bar-chart_bar-wrap-dual">
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-speed" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-slope" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
            </div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">D→G</div>
            <div class="bar-chart_bar-wrap-dual">
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-speed" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-slope" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
            </div>
          </div>
          <div class="bar-chart_row">
            <div class="bar-chart_label">G→D</div>
            <div class="bar-chart_bar-wrap-dual">
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-speed" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
              <div class="bar-chart_bar-wrap"><div class="bar-chart_fill bar-chart_fill-slope" style="width: 0%;"></div><div class="bar-chart_value">--</div></div>
            </div>
          </div>
          <div class="bar-chart_axis">
            <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
          </div>
          <div class="bar-chart_axis-title">Taux d'erreur</div>
        </div>
      </div>

      <div class="insight-card">
        <div class="insight-card_icon-wrap">
          <svg class="insight-card_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2.3h6c0-1.1.4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg>
        </div>
        <div class="insight-card_text">Vous êtes plus performant sur les pentes descendantes. Entraînez-vous sur les pentes montantes pour équilibrer.</div>
      </div>

    </div>

  </div>

  <!-- Panneau Exercices -->
  <div class="tab-panel is-hidden" data-panel="exercices">

    <div class="page-subtitle">S'entraîner avec méthode, progresser chaque jour.</div>

    <!-- Carte reprendre : masquée par défaut, affichée par JS uniquement quand une reprise existe -->
    <div class="resume-card is-hidden">
      <div class="resume-card_image"></div>
      <div class="resume-card_content">
        <div class="resume-card_label">À reprendre</div>
        <div class="resume-card_name"></div>
        <button class="resume-card_button" disabled title="Aucune séance en cours">
          <svg class="resume-card_button-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          Reprendre
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats_grid">
      <div class="stat-card">
        <div class="stat-card_icon-wrap">
          <svg class="stat-card_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5"/></svg>
        </div>
        <div class="stat-card_label">Séances cette semaine</div>
        <div class="stat-card_value">--</div>
      </div>
      <div class="stat-card">
        <div class="stat-card_icon-wrap">
          <svg class="stat-card_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <div class="stat-card_label">Taux de réussite</div>
        <div class="stat-card_value">--</div>
      </div>
    </div>

    <!-- Mes exercices -->
    <div class="exercises-header">
      <div class="exercises-header_title">Mes exercices</div>
      <div class="exercises-header_controls">
        <span class="exercises-sort_label">Trier par</span>
        <button class="exercises-sort_select" onclick="toggleExerciseSort()">
          <span id="exercise-sort-label">Récent</span>
          <svg class="exercises-sort_select-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <button class="exercises-filter_button" aria-label="Filtrer" onclick="showToast('Filtres à venir')">
          <svg class="exercises-filter_button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16"/><path d="M8 12h8"/><path d="M11 18h2"/></svg>
        </button>
      </div>
    </div>

    <div class="exercise-list" id="exercise-list-root"></div>

  </div>

</main>

<!-- Modale Nouvel exercice / Modifier -->
<div id="exercise-modal-root"></div>

<!-- Modale Nouveau parcours -->
<div id="parcours-modal-root"></div>

<!-- Popup de filtre (Sessions / Distance / Parcours / Comparer), réutilisé par les 3 onglets Analyse -->
<div class="exercise-modal_overlay is-hidden" id="filter-sheet-overlay" onclick="closeFilterSheet()">
  <div class="exercise-modal filter-sheet" onclick="event.stopPropagation()" id="filter-sheet"></div>
</div>

<!-- Écran Stats Performance (prend le relais complet de l'écran) -->
<main class="stats-wrapper is-hidden" data-screen="stats">

  <!-- Barre nav parcours / exercices -->
  <div class="putting_tabs">
    <a href="#" class="putting_tab" data-tab="parcours" onclick="selectPuttingTab(event, 'parcours')">
      <svg class="putting_tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 21V4a1 1 0 0 1 1-1h1v6h5l-3-3"/></svg>
      <div class="putting_tab-text">
        <div class="putting_tab-title">Parcours</div>
        <div class="putting_tab-subtitle">Saisie réelle ou test</div>
      </div>
    </a>
    <a href="#" class="putting_tab" data-tab="exercices" onclick="selectPuttingTab(event, 'exercices')">
      <svg class="putting_tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5"/></svg>
      <div class="putting_tab-text">
        <div class="putting_tab-title">Exercices</div>
        <div class="putting_tab-subtitle">Entraînement structuré</div>
      </div>
    </a>
  </div>

  <div class="page-subtitle">Suivez l'évolution de votre performance au putting.</div>

  <div class="stats-filters">
    <button class="stats-filter" id="filter-btn-stats-sessions" onclick="openFilterSheet(event, 'stats', 'sessions')">
      <svg class="stats-filter_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/></svg>
      <span class="filter-value-text">20 derniers rounds</span>
      <svg class="stats-filter_chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
    </button>
    <button class="stats-filter" id="filter-btn-stats-distance" onclick="openFilterSheet(event, 'stats', 'distance')">
      <svg class="stats-filter_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5"/></svg>
      <span class="filter-value-text">Toutes distances</span>
      <svg class="stats-filter_chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
    </button>
    <button class="stats-filter" id="filter-btn-stats-parcours" onclick="openFilterSheet(event, 'stats', 'parcours')">
      <svg class="stats-filter_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 21V4a1 1 0 0 1 1-1h1v6h5l-3-3"/></svg>
      <span class="filter-value-text">Parcours</span>
      <svg class="stats-filter_chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
    </button>
    <button class="stats-filter" id="filter-btn-stats-compare" onclick="openFilterSheet(event, 'stats', 'compare')">
      <svg class="stats-filter_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="12" r="5"/><circle cx="16" cy="12" r="5"/></svg>
      <span class="filter-value-text">Comparer</span>
      <svg class="stats-filter_chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
    </button>
  </div>

  <div class="chart-card">
    <div class="line-chart_header">
      <div>
        <div class="line-chart_title">SG vs Tour par round</div>
        <div class="line-chart_subtitle">Évolution</div>
      </div>
      <div class="line-chart_legend">
        <svg class="line-chart_legend-icon" viewBox="0 0 24 10" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="0" y1="5" x2="20" y2="5"/><circle cx="10" cy="5" r="3" fill="currentColor" stroke="none"/></svg>
        SG Putting
      </div>
    </div>

    <svg class="line-chart" viewBox="-30 0 950 520" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="20" x2="890" y2="20" class="line-chart-grid"/>
      <line x1="40" y1="100" x2="890" y2="100" class="line-chart-grid"/>
      <line x1="40" y1="180" x2="890" y2="180" class="line-chart-grid"/>
      <line x1="40" y1="260" x2="890" y2="260" class="line-chart-grid"/>
      <line x1="40" y1="340" x2="890" y2="340" class="line-chart-grid"/>
      <line x1="40" y1="420" x2="890" y2="420" class="line-chart-grid-solid"/>
      <text x="465" y="485" text-anchor="middle" class="line-chart-axis-title">Rounds</text>
    </svg>
  </div>

  <div class="chart-card">
    <div class="line-chart_header">
      <div>
        <div class="line-chart_title">Taux de réussite par round</div>
        <div class="line-chart_subtitle">Évolution</div>
      </div>
      <div class="line-chart_legend">
        <svg class="line-chart_legend-icon" viewBox="0 0 24 10" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="0" y1="5" x2="20" y2="5"/><circle cx="10" cy="5" r="3" fill="currentColor" stroke="none"/></svg>
        Taux de réussite
      </div>
    </div>

    <svg class="line-chart" viewBox="-30 0 950 520" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="20" x2="890" y2="20" class="line-chart-grid"/>
      <line x1="40" y1="100" x2="890" y2="100" class="line-chart-grid"/>
      <line x1="40" y1="180" x2="890" y2="180" class="line-chart-grid"/>
      <line x1="40" y1="260" x2="890" y2="260" class="line-chart-grid"/>
      <line x1="40" y1="340" x2="890" y2="340" class="line-chart-grid"/>
      <line x1="40" y1="420" x2="890" y2="420" class="line-chart-grid-solid"/>
      <text x="465" y="485" text-anchor="middle" class="line-chart-axis-title">Rounds</text>
    </svg>
  </div>

  <div class="chart-card">
    <div class="line-chart_header">
      <div>
        <div class="line-chart_title">1 Putt par round</div>
        <div class="line-chart_subtitle">Évolution</div>
      </div>
      <div class="line-chart_legend">
        <svg class="line-chart_legend-icon" viewBox="0 0 24 10" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="0" y1="5" x2="20" y2="5"/><circle cx="10" cy="5" r="3" fill="currentColor" stroke="none"/></svg>
        1 Putt
      </div>
    </div>

    <svg class="line-chart" viewBox="-30 0 950 520" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="20" x2="890" y2="20" class="line-chart-grid"/>
      <line x1="40" y1="100" x2="890" y2="100" class="line-chart-grid"/>
      <line x1="40" y1="180" x2="890" y2="180" class="line-chart-grid"/>
      <line x1="40" y1="260" x2="890" y2="260" class="line-chart-grid"/>
      <line x1="40" y1="340" x2="890" y2="340" class="line-chart-grid"/>
      <line x1="40" y1="420" x2="890" y2="420" class="line-chart-grid-solid"/>
      <text x="465" y="485" text-anchor="middle" class="line-chart-axis-title">Rounds</text>
    </svg>
  </div>

  <div class="chart-card">
    <div class="line-chart_header">
      <div>
        <div class="line-chart_title">3 Putts par round</div>
        <div class="line-chart_subtitle">Évolution</div>
      </div>
      <div class="line-chart_legend">
        <svg class="line-chart_legend-icon" viewBox="0 0 24 10" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="0" y1="5" x2="20" y2="5"/><circle cx="10" cy="5" r="3" fill="currentColor" stroke="none"/></svg>
        3 Putts
      </div>
    </div>

    <svg class="line-chart" viewBox="-30 0 950 520" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="20" x2="890" y2="20" class="line-chart-grid"/>
      <line x1="40" y1="100" x2="890" y2="100" class="line-chart-grid"/>
      <line x1="40" y1="180" x2="890" y2="180" class="line-chart-grid"/>
      <line x1="40" y1="260" x2="890" y2="260" class="line-chart-grid"/>
      <line x1="40" y1="340" x2="890" y2="340" class="line-chart-grid"/>
      <line x1="40" y1="420" x2="890" y2="420" class="line-chart-grid-solid"/>
      <text x="465" y="485" text-anchor="middle" class="line-chart-axis-title">Rounds</text>
    </svg>
  </div>

  <div class="chart-card">
    <div class="line-chart_header">
      <div>
        <div class="line-chart_title">Total mètres par round</div>
        <div class="line-chart_subtitle">Évolution</div>
      </div>
      <div class="line-chart_legend">
        <svg class="line-chart_legend-icon" viewBox="0 0 24 10" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="0" y1="5" x2="20" y2="5"/><circle cx="10" cy="5" r="3" fill="currentColor" stroke="none"/></svg>
        Mètres
      </div>
    </div>

    <svg class="line-chart" viewBox="-30 0 950 520" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="20" x2="890" y2="20" class="line-chart-grid"/>
      <line x1="40" y1="100" x2="890" y2="100" class="line-chart-grid"/>
      <line x1="40" y1="180" x2="890" y2="180" class="line-chart-grid"/>
      <line x1="40" y1="260" x2="890" y2="260" class="line-chart-grid"/>
      <line x1="40" y1="340" x2="890" y2="340" class="line-chart-grid"/>
      <line x1="40" y1="420" x2="890" y2="420" class="line-chart-grid-solid"/>
      <text x="465" y="485" text-anchor="middle" class="line-chart-axis-title">Rounds</text>
    </svg>
  </div>

</main>

<!-- Flux Exercices : session en cours / récap / revoir -->
<main class="exercise-flow-wrapper is-hidden" data-screen="exercise-flow" id="exercise-flow-root"></main>

<!-- Boutons flottants -->
<div class="fab-group" data-fab="parcours">
  <button class="fab-button" onclick="openNewParcoursModal()">
    <svg class="fab-button_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 21V4a1 1 0 0 1 1-1h1v6h5l-3-3"/></svg>
    <span class="fab-button_text">Nouveau<br>parcours</span>
  </button>
  <button class="fab-button" onclick="startQuickExercise()">
    <svg class="fab-button_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5"/></svg>
    <span class="fab-button_text">Nouvel<br>exercice</span>
  </button>
</div>

<div class="fab-group is-hidden" data-fab="exercices">
  <button class="fab-button" onclick="openCreativeCombineModal()">
    <svg class="fab-button_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
    <span class="fab-button_text">Exercice<br>rapide</span>
  </button>
</div>

<!-- Popup bas : apparaît quand un exercice est sélectionné dans la liste -->
<div class="exercise-select-bar is-hidden" id="exercise-select-bar">
  <div class="exercise-select-bar_name" id="exercise-select-bar-name"></div>
  <button class="exercise-select-bar_launch" id="exercise-select-bar-launch">
    Lancer l'exercice
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
  </button>
</div>

<!-- Barre nav basse : uniquement pour l'onglet Parcours -->
<nav class="bottom-nav" data-nav="parcours">
  <a href="#" class="bottom-nav_item" data-section="analyse-distance" onclick="selectAnalyseSection(event, 'analyse-distance')">
    <svg class="bottom-nav_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 17l9-14 9 14"/><path d="M8 17l4-8 4 8"/></svg>
    <div class="bottom-nav_label">Analyse</div>
    <div class="bottom-nav_sublabel">Distance</div>
  </a>
  <a href="#" class="bottom-nav_item" data-section="analyse-pente" onclick="selectAnalyseSection(event, 'analyse-pente')">
    <svg class="bottom-nav_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 20h16"/><path d="M4 20L16 6"/></svg>
    <div class="bottom-nav_label">Analyse</div>
    <div class="bottom-nav_sublabel">Pente</div>
  </a>
  <a href="#" class="bottom-nav_item" data-section="stats-performance" onclick="goToStatsPerformance(event)">
    <svg class="bottom-nav_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 21V10"/><path d="M12 21V4"/><path d="M19 21v-7"/></svg>
    <div class="bottom-nav_label">Stats</div>
    <div class="bottom-nav_sublabel">Performance</div>
  </a>
</nav>
  `;
  renderExerciseList();
  renderParcoursHistory();
  renderResumeCards();
}

function selectPuttingTab(event, tab) {
    event.preventDefault();
    if (document.body.classList.contains('is-stats-screen')) {
      document.querySelector('[data-header="stats"]').classList.add('is-hidden');
      document.querySelector('[data-header="main"]').classList.remove('is-hidden');
      document.querySelector('.stats-wrapper').classList.add('is-hidden');
      document.querySelector('.putting_wrapper').classList.remove('is-hidden');
      document.body.classList.remove('is-stats-screen');
      window.scrollTo(0, 0);
    }
    document.querySelectorAll('.putting_tab').forEach(function (el) {
      el.classList.toggle('is-active', el.dataset.tab === tab);
    });
    if (tab !== 'exercices') {
      selectedCombineId = null;
      renderExerciseList();
    }
    updateExerciseSelectBar();
    document.querySelectorAll('.tab-panel').forEach(function (el) {
      el.classList.toggle('is-hidden', el.dataset.panel !== tab);
    });
    document.querySelectorAll('.fab-group').forEach(function (el) {
      el.classList.toggle('is-hidden', el.dataset.fab !== tab);
    });
    document.querySelectorAll('.bottom-nav').forEach(function (el) {
      el.classList.toggle('is-hidden', el.dataset.nav !== tab);
    });
    // Retour à l'accueil Parcours à chaque changement d'onglet supérieur
    document.querySelectorAll('.analyse-subpanel').forEach(function (el) {
      el.classList.toggle('is-hidden', el.dataset.sub !== 'home');
    });
    document.querySelectorAll('.bottom-nav_item').forEach(function (el) {
      el.classList.remove('is-active');
    });
  }

  function selectAnalyseSection(event, section) {
    event.preventDefault();
    if (document.body.classList.contains('is-stats-screen')) {
      document.querySelector('[data-header="stats"]').classList.add('is-hidden');
      document.querySelector('[data-header="main"]').classList.remove('is-hidden');
      document.querySelector('.stats-wrapper').classList.add('is-hidden');
      document.querySelector('.putting_wrapper').classList.remove('is-hidden');
      document.body.classList.remove('is-stats-screen');
      window.scrollTo(0, 0);
    }
    document.querySelectorAll('.analyse-subpanel').forEach(function (el) {
      el.classList.toggle('is-hidden', el.dataset.sub !== section);
    });
    document.querySelectorAll('.bottom-nav_item').forEach(function (el) {
      el.classList.toggle('is-active', el.dataset.section === section);
    });
  }

  function goToStatsPerformance(event) {
    event.preventDefault();
    document.querySelector('[data-header="main"]').classList.add('is-hidden');
    document.querySelector('[data-header="stats"]').classList.remove('is-hidden');
    document.querySelector('.putting_wrapper').classList.add('is-hidden');
    document.querySelector('.stats-wrapper').classList.remove('is-hidden');
    document.querySelectorAll('.putting_tab').forEach(function (el) {
      el.classList.toggle('is-active', el.dataset.tab === 'parcours');
    });
    document.querySelectorAll('.fab-group').forEach(function (el) {
      el.classList.toggle('is-hidden', el.dataset.fab !== 'parcours');
    });
    document.querySelectorAll('.bottom-nav_item').forEach(function (el) {
      el.classList.toggle('is-active', el.dataset.section === 'stats-performance');
    });
    document.body.classList.add('is-stats-screen');
    window.scrollTo(0, 0);
  }

  function backToPuttingMain(event) {
    event.preventDefault();
    document.querySelector('[data-header="stats"]').classList.add('is-hidden');
    document.querySelector('[data-header="main"]').classList.remove('is-hidden');
    document.querySelector('.stats-wrapper').classList.add('is-hidden');
    document.querySelector('.putting_wrapper').classList.remove('is-hidden');
    document.body.classList.remove('is-stats-screen');
    selectPuttingTab({ preventDefault: function () {} }, 'parcours');
    window.scrollTo(0, 0);
  }

/* ============================================================
   EXERCICES — Combinés créatifs (fusion avec l'ancien putting.js)
   ============================================================ */

// --- État + persistance locale ---
let puttingCombines = [];
let puttingSessions = [];
let puttingRounds = [];
let selectedCombineId = null;
let editingCombineId = null;
let puttingCreativeModalOpen = false;
let puttingCreativeForm = null;

/* ---------- Filtres de tri (Sessions / Distance / Parcours / Comparer) ---------- */
/* Communs aux 3 onglets analyse : Analyse Distance, Analyse Pente, Stats Performance */

const FILTER_SESSIONS_OPTIONS = [
  { value: '5', label: '5 dernières' },
  { value: '10', label: '10 dernières' },
  { value: '15', label: '15 dernières' },
  { value: '20', label: '20 dernières' },
  { value: 'all', label: 'Toutes' },
];

const FILTER_DISTANCE_OPTIONS = [
  { value: 'all', label: 'Toutes distances' },
  { value: '0-2', label: '0 à 2m' },
  { value: '2-3', label: '>2 à 3m' },
  { value: '3-5', label: '>3 à 5m' },
  { value: '5-9', label: '>5 à 9m' },
  { value: '9+', label: '>9m' },
];

const FILTER_PARCOURS_OPTIONS = [
  { value: 'all', label: 'Tous les parcours' },
];

const filterState = {
  distance: { sessions: '20', distance: 'all', parcours: 'all', compareA: null, compareB: null },
  pente: { sessions: '20', distance: 'all', parcours: 'all', compareA: null, compareB: null },
  stats: { sessions: '20', distance: 'all', parcours: 'all', compareA: null, compareB: null },
};

let filterSheetOpenFor = null; // { group, type }

function openFilterSheet(event, group, type) {
  event.preventDefault();
  event.stopPropagation();
  filterSheetOpenFor = { group: group, type: type };
  renderFilterSheet();
  document.getElementById('filter-sheet-overlay').classList.remove('is-hidden');
}

function closeFilterSheet() {
  document.getElementById('filter-sheet-overlay').classList.add('is-hidden');
  filterSheetOpenFor = null;
}

function filterButtonLabel(group, type) {
  const s = filterState[group];
  if (type === 'sessions') {
    const opt = FILTER_SESSIONS_OPTIONS.find(function (o) { return o.value === s.sessions; });
    return opt ? opt.label : '20 dernières';
  }
  if (type === 'distance') {
    const opt = FILTER_DISTANCE_OPTIONS.find(function (o) { return o.value === s.distance; });
    return opt ? opt.label : 'Toutes distances';
  }
  if (type === 'parcours') {
    const opt = FILTER_PARCOURS_OPTIONS.find(function (o) { return o.value === s.parcours; });
    return opt ? opt.label : 'Tous les parcours';
  }
  if (type === 'compare') {
    return (s.compareA && s.compareB) ? '2 sessions' : 'Aucune';
  }
  return '';
}

function updateFilterButtonUI(group, type) {
  const btn = document.getElementById('filter-btn-' + group + '-' + type);
  if (!btn) return;
  const textEl = btn.querySelector('.filter-value-text');
  if (textEl) textEl.textContent = filterButtonLabel(group, type);
}

function selectFilterOption(group, type, value) {
  const s = filterState[group];
  if (type === 'sessions') s.sessions = value;
  if (type === 'distance') s.distance = value;
  if (type === 'parcours') s.parcours = value;
  updateFilterButtonUI(group, type);
  closeFilterSheet();
}

function toggleCompareSession(group, sessionId) {
  const s = filterState[group];
  if (s.compareA === sessionId) { s.compareA = null; }
  else if (s.compareB === sessionId) { s.compareB = null; }
  else if (!s.compareA) { s.compareA = sessionId; }
  else if (!s.compareB) { s.compareB = sessionId; }
  else { s.compareA = sessionId; s.compareB = null; }
  renderFilterSheet();
}

function confirmCompareSelection(group) {
  updateFilterButtonUI(group, 'compare');
  closeFilterSheet();
}

function filterSheetTitle(type) {
  if (type === 'sessions') return 'Nombre de sessions';
  if (type === 'distance') return 'Distance';
  if (type === 'parcours') return 'Parcours';
  if (type === 'compare') return 'Comparer 2 sessions';
  return '';
}

function renderFilterSheet() {
  const root = document.getElementById('filter-sheet');
  if (!root || !filterSheetOpenFor) return;
  const group = filterSheetOpenFor.group;
  const type = filterSheetOpenFor.type;
  const s = filterState[group];

  let optionsHtml = '';
  if (type === 'compare') {
    if (!puttingSessions.length) {
      optionsHtml = '<div class="filter-sheet_empty">Aucune session disponible pour le moment.</div>';
    } else {
      optionsHtml = puttingSessions.slice().reverse().map(function (session) {
        const isChecked = s.compareA === session.id || s.compareB === session.id;
        const c = getCombineById(session.combineId);
        const label = (c ? c.name : 'Exercice') + ' — ' + (session.dateLabel || '');
        return '<button class="filter-sheet_option' + (isChecked ? ' is-selected' : '') + '" onclick="toggleCompareSession(\'' + group + '\', ' + session.id + ')">' +
          '<span>' + label + '</span>' +
          '<svg class="filter-sheet_check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>' +
          '</button>';
      }).join('');
      optionsHtml += '<button class="exercise-modal_save" style="margin-top:12px;" ' + (s.compareA && s.compareB ? '' : 'disabled') + ' onclick="confirmCompareSelection(\'' + group + '\')">Comparer</button>';
    }
  } else {
    const options = type === 'sessions' ? FILTER_SESSIONS_OPTIONS : type === 'distance' ? FILTER_DISTANCE_OPTIONS : FILTER_PARCOURS_OPTIONS;
    const current = s[type];
    optionsHtml = options.map(function (o) {
      const isChecked = o.value === current;
      return '<button class="filter-sheet_option' + (isChecked ? ' is-selected' : '') + '" onclick="selectFilterOption(\'' + group + '\', \'' + type + '\', \'' + o.value + '\')">' +
        '<span>' + o.label + '</span>' +
        (isChecked ? '<svg class="filter-sheet_check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>' : '') +
        '</button>';
    }).join('');
  }

  root.innerHTML =
    '<div class="exercise-modal_head">' +
      '<div class="exercise-modal_title">' + filterSheetTitle(type) + '</div>' +
      '<button class="exercise-modal_close" onclick="closeFilterSheet()">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      '</button>' +
    '</div>' +
    '<div class="filter-sheet_options">' + optionsHtml + '</div>';
}

function saveStateToLocalStorage() {
  try {
    const persistable = puttingCombines.filter(function (c) { return !c.isQuick; });
    localStorage.setItem('putting_combines', JSON.stringify(persistable));
    localStorage.setItem('putting_sessions', JSON.stringify(puttingSessions));
    localStorage.setItem('putting_rounds', JSON.stringify(puttingRounds));
  } catch (e) {
    console.warn('Sauvegarde locale impossible :', e);
  }
}

function loadStateFromLocalStorage() {
  try {
    const combines = localStorage.getItem('putting_combines');
    const sessions = localStorage.getItem('putting_sessions');
    const rounds = localStorage.getItem('putting_rounds');
    const resume = localStorage.getItem('putting_resume');
    puttingCombines = combines ? JSON.parse(combines) : [];
    puttingSessions = sessions ? JSON.parse(sessions) : [];
    puttingRounds = rounds ? JSON.parse(rounds) : [];
    resumableSession = resume ? JSON.parse(resume) : null;
  } catch (e) {
    puttingCombines = [];
    puttingSessions = [];
    puttingRounds = [];
    resumableSession = null;
  }
}
loadStateFromLocalStorage();

/* ---------- Carte "À reprendre" ---------- */
function saveResumableSession() {
  const c = getCombineById(activeCombineId);
  if (!c) return;
  resumableSession = {
    combineId: activeCombineId,
    name: c.name,
    activeHoleIndex: activeHoleIndex,
    session: activeSession,
    dateISO: new Date().toISOString(),
  };
  try { localStorage.setItem('putting_resume', JSON.stringify(resumableSession)); } catch (e) {}
}

function clearResumableSession() {
  resumableSession = null;
  try { localStorage.removeItem('putting_resume'); } catch (e) {}
}

function resumeSession() {
  if (!resumableSession) return;
  const c = getCombineById(resumableSession.combineId);
  if (!c) { clearResumableSession(); renderResumeCards(); return; }
  activeCombineId = resumableSession.combineId;
  activeSession = resumableSession.session;
  activeHoleIndex = resumableSession.activeHoleIndex;
  clearResumableSession();
  exerciseFlowOriginTab = 'exercices';
  exerciseFlowScreen = 'session';
  enterExerciseFlow(c.name);
  renderExerciseFlowScreen();
  renderResumeCards();
}

function renderResumeCards() {
  document.querySelectorAll('.resume-card').forEach(function (card) {
    if (!resumableSession) {
      card.classList.add('is-hidden');
      return;
    }
    card.classList.remove('is-hidden');
    const doneHoles = resumableSession.session.holes.filter(function (h) { return h.results.length > 0; }).length;
    const nameEl = card.querySelector('.resume-card_name');
    if (nameEl) nameEl.textContent = resumableSession.name + ' — ' + doneHoles + '/' + resumableSession.session.holes.length + ' trous';
    const btn = card.querySelector('.resume-card_button');
    btn.disabled = false;
    btn.removeAttribute('title');
    btn.onclick = resumeSession;
  });
}

// --- Historique / stats d'un exercice ---
function combineSessionsHistory(combineId) {
  return puttingSessions
    .filter(function (s) { return s.combineId === combineId; })
    .slice()
    .sort(function (a, b) { return new Date(a.dateISO) - new Date(b.dateISO); });
}

function combineMakeRate(session) {
  let made = 0, total = 0;
  session.holes.forEach(function (h) {
    h.results.forEach(function (r) {
      total += 1;
      if (r === 'made') made += 1;
    });
  });
  return { made: made, total: total, pct: total ? Math.round((made / total) * 100) : null };
}

// --- Liste "Mes exercices" ---
function renderExerciseList() {
  const listRoot = document.getElementById('exercise-list-root');
  if (!listRoot) return;

  const sorted = puttingCombines.filter(function (c) { return !c.isQuick; });
  if (!sorted.length) {
    listRoot.innerHTML = '';
    return;
  }

  if (exerciseSortMode === 'alpha') {
    sorted.sort(function (a, b) { return a.name.localeCompare(b.name, 'fr'); });
  } else {
    sorted.reverse();
  }

  listRoot.innerHTML = sorted.map(function (c) {
    const history = combineSessionsHistory(c.id);
    const last = history[history.length - 1];
    const lastLabel = last ? ('Dernière séance : ' + last.dateLabel) : 'Jamais joué';
    const rate = last ? combineMakeRate(last) : null;
    const percentLabel = rate && rate.pct !== null ? (rate.pct + '%') : '--';
    const countLabel = rate ? (rate.made + ' / ' + rate.total + ' putts') : '';
    const isSelected = selectedCombineId === c.id;

    return `
      <div class="exercise-item ${isSelected ? 'is-selected' : ''}">
        <div class="exercise-item_thumb"></div>
        <div class="exercise-item_content" onclick="toggleExerciseSelect(${c.id})">
          <div class="exercise-item_title">${c.name}</div>
          <div class="exercise-item_tags">
            <span class="exercise-item_tag">${c.puttMin}m &rarr; ${c.puttMax}m</span>
            <span class="exercise-item_tag">${c.holesCount} trous</span>
          </div>
          <div class="exercise-item_last">${lastLabel}</div>
        </div>
        <div class="exercise-item_stats" onclick="toggleExerciseSelect(${c.id})">
          <div class="exercise-item_percent">${percentLabel}</div>
          <div class="exercise-item_count">${countLabel}</div>
        </div>
        <svg class="exercise-item_arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" onclick="toggleExerciseSelect(${c.id})"><path d="M9 6l6 6-6 6"/></svg>
        <button class="exercise-item_menu" aria-label="Options" onclick="event.stopPropagation();toggleExerciseSelect(${c.id})">
          <svg class="exercise-item_menu-icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
        </button>
        ${isSelected ? `
          <div class="exercise-item_actions">
            <button class="exercise-item_action" onclick="event.stopPropagation();reviewCombine(${c.id})">Revoir</button>
            <button class="exercise-item_action" onclick="event.stopPropagation();editCombine(${c.id})">Modifier</button>
            <button class="exercise-item_action is-danger" onclick="event.stopPropagation();deleteCombine(${c.id})">Supprimer</button>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function toggleExerciseSelect(id) {
  selectedCombineId = selectedCombineId === id ? null : id;
  renderExerciseList();
  updateExerciseSelectBar();
}

function updateExerciseSelectBar() {
  const bar = document.getElementById('exercise-select-bar');
  const fab = document.querySelector('.fab-group[data-fab="exercices"]');
  if (!bar) return;
  const combine = selectedCombineId ? getCombineById(selectedCombineId) : null;
  if (combine) {
    document.getElementById('exercise-select-bar-name').textContent = combine.name;
    document.getElementById('exercise-select-bar-launch').onclick = function () { exerciseFlowOriginTab = 'exercices'; startCombine(combine.id); };
    bar.classList.remove('is-hidden');
    if (fab) fab.classList.add('is-hidden');
  } else {
    bar.classList.add('is-hidden');
    if (fab && document.querySelector('[data-tab="exercices"]').classList.contains('is-active')) fab.classList.remove('is-hidden');
  }
}

function deleteCombine(id) {
  if (!confirm('Supprimer cet exercice ?')) return;
  puttingCombines = puttingCombines.filter(function (c) { return c.id !== id; });
  if (selectedCombineId === id) selectedCombineId = null;
  saveStateToLocalStorage();
  renderExerciseList();
  updateExerciseSelectBar();
}

// ============================================================
// FLUX EXERCICE : session en cours / récap / revoir
// ============================================================

// --- État du flux ---
let exerciseFlowScreen = null; // 'session' | 'recap' | 'review'
let exerciseFlowOriginTab = 'exercices'; // onglet à retrouver au retour ('parcours' | 'exercices')
let activeCombineId = null;
let activeSession = null;      // session en cours (non sauvegardée)
let activeHoleIndex = 0;
let reviewChartIndex = 0;
let viewingSessionId = null;   // session déjà sauvegardée consultée en lecture seule

function getCombineById(id) {
  return puttingCombines.find(function (c) { return c.id === id; });
}

// --- Entrée / sortie du flux ---
function enterExerciseFlow(title) {
  document.querySelector('[data-header="main"]').classList.add('is-hidden');
  document.querySelector('[data-header="exercise-flow"]').classList.remove('is-hidden');
  document.querySelector('.putting_wrapper').classList.add('is-hidden');
  document.getElementById('exercise-flow-root').classList.remove('is-hidden');
  document.querySelectorAll('.fab-group').forEach(function (el) { el.classList.add('is-hidden'); });
  const selectBar = document.getElementById('exercise-select-bar');
  if (selectBar) selectBar.classList.add('is-hidden');
  const navEl = document.querySelector('.bottom-nav');
  if (navEl) navEl.classList.add('is-hidden');
  document.getElementById('exercise-flow-title').textContent = title;
  window.scrollTo(0, 0);
}

function exitExerciseFlow(event) {
  if (event) event.preventDefault();
  if (exerciseFlowScreen === 'session' && !confirm('Quitter sans enregistrer cette séance ?')) return;
  if (exerciseFlowScreen === 'session' && activeSession && activeSession.holes.some(function (h) { return h.results.length > 0; }) && String(activeCombineId).indexOf('quick-') !== 0) {
    saveResumableSession();
  } else {
    clearResumableSession();
  }
  cleanupQuickCombine();
  document.querySelector('[data-header="exercise-flow"]').classList.add('is-hidden');
  document.querySelector('[data-header="main"]').classList.remove('is-hidden');
  document.getElementById('exercise-flow-root').classList.add('is-hidden');
  document.querySelector('.putting_wrapper').classList.remove('is-hidden');
  exerciseFlowScreen = null;
  activeCombineId = null;
  activeSession = null;
  viewingSessionId = null;
  selectedCombineId = null;
  selectPuttingTab({ preventDefault: function () {} }, exerciseFlowOriginTab);
  exerciseFlowOriginTab = 'exercices';
  renderExerciseList();
  updateExerciseSelectBar();
  renderResumeCards();
  window.scrollTo(0, 0);
}

/* ---------- 1. Session en cours ---------- */

function startCombine(id) {
  const c = getCombineById(id);
  if (!c) return;
  activeCombineId = id;
  activeHoleIndex = 0;
  activeSession = {
    combineId: id,
    dateISO: new Date().toISOString(),
    dateLabel: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    location: 'Non renseigné',
    greenSpeed: 'Non renseigné',
    notes: '',
    holes: c.previewRows.map(function (row) {
      return {
        hole: row.hole,
        m: row.m,
        clock: row.clock,
        results: [], // 'made' | 'missed', longueur = c.attempts une fois fini
      };
    }),
  };
  exerciseFlowScreen = 'session';
  enterExerciseFlow(c.name);
  renderExerciseFlowScreen();
}

function slopeArrowSvg(clock) {
  const angle = (clock % 12) * 30;
  return `
    <svg class="slope-visual" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="52" class="slope-visual_ring"/>
      <circle cx="60" cy="60" r="30" class="slope-visual_hole"/>
      <g transform="rotate(${angle} 60 60)">
        <line x1="60" y1="60" x2="60" y2="14" class="slope-visual_arrow"/>
        <path d="M60,8 L52,20 L68,20 Z" class="slope-visual_arrowhead"/>
      </g>
    </svg>
  `;
}

function combineAttemptsHtml(hole, attemptsCount) {
  let out = '';
  for (let i = 0; i < attemptsCount; i++) {
    const r = hole.results[i];
    const cls = r === 'made' ? 'is-made' : (r === 'missed' ? 'is-missed' : '');
    out += `<div class="session-attempt ${cls}">${i + 1}</div>`;
  }
  return out;
}

function renderExerciseFlowScreen() {
  if (exerciseFlowScreen === 'session') renderCombineSessionScreen();
  else if (exerciseFlowScreen === 'recap') renderCombineRecapScreen();
  else if (exerciseFlowScreen === 'review') renderCombineReviewScreen();
}

function renderCombineSessionScreen() {
  const flowRoot = document.getElementById('exercise-flow-root');
  const c = getCombineById(activeCombineId);
  const hole = activeSession.holes[activeHoleIndex];
  const totalAttempts = c.attempts;
  const doneHoles = activeSession.holes.filter(function (h) { return h.results.length >= totalAttempts; }).length;
  const allDone = doneHoles === activeSession.holes.length;

  flowRoot.innerHTML = `
    <div class="session-progress">
      <div class="session-progress_track"><div class="session-progress_fill" style="width:${Math.round((doneHoles / activeSession.holes.length) * 100)}%"></div></div>
      <div class="session-progress_label">${doneHoles} / ${activeSession.holes.length} trous terminés</div>
    </div>

    <div class="session-hole-card">
      <div class="session-hole-head">
        <span>Trou ${hole.hole}</span>
        <span>${hole.m} m</span>
      </div>
      ${slopeArrowSvg(hole.clock)}
      <div class="session-attempts">${combineAttemptsHtml(hole, totalAttempts)}</div>
      <div class="session-result-buttons">
        <button class="session-result-btn is-missed" onclick="setCombineResult('missed')">Manqué</button>
        <button class="session-result-btn is-made" onclick="setCombineResult('made')">Réussi</button>
      </div>
    </div>

    <div class="session-holes-nav">
      ${activeSession.holes.map(function (h, i) {
        const isDone = h.results.length >= totalAttempts;
        const state = isDone ? (h.results.indexOf('made') === -1 ? 'is-missed' : 'is-done') : (i === activeHoleIndex ? 'is-active' : '');
        return `<button class="session-holes-nav_item ${state}" onclick="goToCombineHole(${i})">${h.hole}</button>`;
      }).join('')}
    </div>

    ${allDone ? `<button class="exercise-modal_save" onclick="finishCombineSession()">Terminer la séance</button>` : ''}
  `;
}

function setCombineResult(result) {
  const c = getCombineById(activeCombineId);
  const hole = activeSession.holes[activeHoleIndex];
  if (hole.results.length >= c.attempts) return;
  hole.results.push(result);

  if (hole.results.length >= c.attempts && activeHoleIndex < activeSession.holes.length - 1) {
    activeHoleIndex += 1;
  }
  renderCombineSessionScreen();
}

function goToCombineHole(idx) {
  activeHoleIndex = idx;
  renderCombineSessionScreen();
}

/* ---------- 2. Récap de fin de séance ---------- */

function combineSessionStats(session, combine) {
  let made = 0, total = 0, onePutts = 0, totalMeters = 0;
  session.holes.forEach(function (h) {
    totalMeters += h.m;
    let holeMade = 0;
    h.results.forEach(function (r) {
      total += 1;
      if (r === 'made') { made += 1; holeMade += 1; }
    });
    if (holeMade >= 1) onePutts += 1;
  });
  const pph = total ? Math.round((total / session.holes.length) * 10) / 10 : 0;
  return { made: made, total: total, onePutts: onePutts, totalMeters: Math.round(totalMeters * 10) / 10, pph: pph };
}

function bestCombineStats(combineId, excludeSession) {
  const history = combineSessionsHistory(combineId).filter(function (s) { return s !== excludeSession; });
  if (!history.length) return null;
  let best = null;
  history.forEach(function (s) {
    const c = getCombineById(combineId);
    const stats = combineSessionStats(s, c);
    if (!best || stats.pph < best.pph) best = stats;
  });
  return best;
}

function finishCombineSession() {
  exerciseFlowScreen = 'recap';
  renderCombineRecapScreen();
}

function editSessionField(field, label) {
  const session = viewingSessionId ? puttingSessions.find(function (s) { return s.id === viewingSessionId; }) : activeSession;
  const v = prompt(label, session[field] || '');
  if (v === null) return;
  session[field] = v;
  if (viewingSessionId) saveStateToLocalStorage();
  renderCombineRecapScreen();
}

function renderCombineRecapScreen() {
  const flowRoot = document.getElementById('exercise-flow-root');
  const isViewing = !!viewingSessionId;
  const session = isViewing ? puttingSessions.find(function (s) { return s.id === viewingSessionId; }) : activeSession;
  const combine = getCombineById(session.combineId);
  const stats = combineSessionStats(session, combine);
  const best = bestCombineStats(session.combineId, isViewing ? session : null);

  document.getElementById('exercise-flow-title').textContent = combine ? combine.name : 'Exercice';

  flowRoot.innerHTML = `
    <div class="stats_grid">
      <div class="stat-card">
        <div class="stat-card_label">Putts / trou</div>
        <div class="stat-card_value">${stats.pph}</div>
        ${best ? `<div class="stat-card_trend">Meilleur : ${best.pph}</div>` : ''}
      </div>
      <div class="stat-card">
        <div class="stat-card_label">1 putt</div>
        <div class="stat-card_value">${stats.onePutts} / ${session.holes.length}</div>
        <div class="stat-card_trend">${stats.totalMeters} m au total</div>
      </div>
    </div>

    <div class="history-card">
      <div class="history-card_header"><div class="history-card_title">Détail par trou</div></div>
      <div class="recap-table">
        <div class="recap-table_row recap-table_head"><span>Trou</span><span>Distance</span><span>Résultats</span></div>
        ${session.holes.map(function (h) {
          return `<div class="recap-table_row">
            <span>${h.hole}</span>
            <span>${h.m} m</span>
            <span class="recap-table_attempts">${h.results.map(function (r) { return `<span class="recap-dot ${r === 'made' ? 'is-made' : 'is-missed'}"></span>`; }).join('')}</span>
          </div>`;
        }).join('')}
      </div>
    </div>

    <div class="history-card">
      <div class="history-card_header"><div class="history-card_title">Conditions</div></div>
      <div class="recap-fields">
        <button class="exercise-modal_field" onclick="editSessionField('location','Lieu')">
          <span class="exercise-modal_field-label">Lieu</span>
          <span class="exercise-modal_field-value">${session.location || 'Non renseigné'}</span>
        </button>
        <button class="exercise-modal_field" onclick="editSessionField('greenSpeed','Vitesse du green')">
          <span class="exercise-modal_field-label">Vitesse du green</span>
          <span class="exercise-modal_field-value">${session.greenSpeed || 'Non renseigné'}</span>
        </button>
        <button class="exercise-modal_field" onclick="editSessionField('notes','Notes')">
          <span class="exercise-modal_field-label">Notes</span>
          <span class="exercise-modal_field-value">${session.notes || '—'}</span>
        </button>
      </div>
    </div>

    ${isViewing
      ? `<button class="exercise-item_action is-danger" style="padding:14px;" onclick="deleteViewedSession()">Supprimer cette séance</button>`
      : (combine && combine.isQuick
        ? `<div class="exercise-item_actions" style="margin-top:0;">
            <button class="exercise-item_action" onclick="retryQuickExercise()">Recommencer</button>
            <button class="exercise-item_action is-primary" onclick="finishQuickExercise()">Terminer</button>
          </div>`
        : `<div class="exercise-item_actions" style="margin-top:0;">
            <button class="exercise-item_action" onclick="retryCombineSession()">Recommencer</button>
            <button class="exercise-item_action is-primary" onclick="saveCombineSessionNow()">Enregistrer</button>
          </div>`)
    }
  `;
}

function saveCombineSessionNow() {
  activeSession.id = Date.now();
  puttingSessions.push(activeSession);
  saveStateToLocalStorage();
  activeSession = null;
  exitExerciseFlow();
}

function retryCombineSession() {
  const id = activeCombineId;
  activeSession = null;
  startCombine(id);
}

function deleteViewedSession() {
  if (!confirm('Supprimer cette séance ?')) return;
  const combineId = puttingSessions.find(function (s) { return s.id === viewingSessionId; }).combineId;
  puttingSessions = puttingSessions.filter(function (s) { return s.id !== viewingSessionId; });
  saveStateToLocalStorage();
  viewingSessionId = null;
  reviewCombine(combineId);
}

/* ---------- 3. Revoir (graphiques + historique) ---------- */

function reviewCombine(id) {
  activeCombineId = id;
  reviewChartIndex = 0;
  exerciseFlowScreen = 'review';
  const c = getCombineById(id);
  enterExerciseFlow('Revoir');
  renderCombineReviewScreen();
}

const REVIEW_CHARTS = [
  { key: 'rate', label: 'Taux de réussite' },
  { key: 'pph', label: 'Putts par trou' },
  { key: 'onePutt', label: 'Nombre de 1 putt' },
];

function reviewChartValue(session, combine, key) {
  const stats = combineSessionStats(session, combine);
  if (key === 'rate') return stats.total ? Math.round((stats.made / stats.total) * 100) : 0;
  if (key === 'pph') return stats.pph;
  return stats.onePutts;
}

function miniLineChartSvg(values, labels) {
  if (!values.length) {
    return `<div class="review-chart_empty">Pas encore de séance enregistrée.</div>`;
  }
  const max = Math.max.apply(null, values.concat([1]));
  const min = 0;
  const w = 640, h = 260, padL = 30, padR = 20, padT = 20, padB = 30;
  const innerW = w - padL - padR, innerH = h - padT - padB;
  const stepX = values.length > 1 ? innerW / (values.length - 1) : 0;
  const points = values.map(function (v, i) {
    const x = padL + i * stepX;
    const y = padT + innerH - ((v - min) / (max - min || 1)) * innerH;
    return { x: x, y: y };
  });
  const path = points.map(function (p, i) { return (i === 0 ? 'M' : 'L') + p.x + ',' + p.y; }).join(' ');
  const dots = points.map(function (p) { return `<circle cx="${p.x}" cy="${p.y}" r="5" class="line-chart-point"/>`; }).join('');
  const labelsSvg = points.map(function (p, i) {
    return `<text x="${p.x}" y="${h - 8}" text-anchor="middle" class="line-chart-axis-label" font-size="16">${labels[i]}</text>`;
  }).join('');
  return `
    <svg class="line-chart" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <line x1="${padL}" y1="${padT + innerH}" x2="${w - padR}" y2="${padT + innerH}" class="line-chart-grid-solid"/>
      <path d="${path}" class="line-chart-line"/>
      ${dots}
      ${labelsSvg}
    </svg>
  `;
}

function renderCombineReviewScreen() {
  const flowRoot = document.getElementById('exercise-flow-root');
  const combine = getCombineById(activeCombineId);
  const history = combineSessionsHistory(activeCombineId);
  const chart = REVIEW_CHARTS[reviewChartIndex];
  const values = history.map(function (s) { return reviewChartValue(s, combine, chart.key); });
  const labels = history.map(function (s) { return s.dateLabel; });

  flowRoot.innerHTML = `
    <div class="chart-card">
      <div class="chart-card_header">
        <div class="chart-card_title">${combine ? combine.name : ''}</div>
      </div>
      <div class="review-chart_title">${chart.label}</div>
      ${miniLineChartSvg(values, labels)}
      <div class="review-chart_dots">
        ${REVIEW_CHARTS.map(function (rc, i) {
          return `<button class="review-chart_dot ${i === reviewChartIndex ? 'is-active' : ''}" onclick="setReviewChart(${i})"></button>`;
        }).join('')}
      </div>
    </div>

    <div class="history-card">
      <div class="history-card_header"><div class="history-card_title">Historique des séances</div></div>
      <div class="history-card_list">
        ${history.length ? history.slice().reverse().map(function (s) {
          const stats = combineSessionStats(s, combine);
          return `<a href="#" class="history-item" onclick="event.preventDefault();viewCombineSession(${s.id})">
            <div class="history-item_content">
              <div class="history-item_title">${s.dateLabel}</div>
              <div class="history-item_meta">${stats.pph} putts/trou &bull; ${stats.made} / ${stats.total} putts</div>
            </div>
            <div class="history-item_right">
              <svg class="history-item_arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
            </div>
          </a>`;
        }).join('') : `<div class="review-chart_empty">Aucune séance pour le moment.</div>`}
      </div>
    </div>
  `;
}

function setReviewChart(i) {
  reviewChartIndex = i;
  renderCombineReviewScreen();
}

function viewCombineSession(sessionId) {
  viewingSessionId = sessionId;
  exerciseFlowScreen = 'recap';
  renderCombineRecapScreen();
}

function startQuickExercise() {
  const holesCount = 18;
  const quickCombine = {
    id: 'quick-' + Date.now(),
    name: 'Exercice rapide',
    slopedGreen: true,
    holesCount: holesCount,
    rounds: 1,
    attempts: 1,
    isQuick: true,
    previewRows: Array.from({ length: holesCount }, function (_, i) {
      return {
        hole: i + 1,
        m: Math.round((1 + Math.random() * 6) * 10) / 10,
        clock: Math.floor(Math.random() * 12) + 1,
      };
    }),
  };
  puttingCombines.push(quickCombine);
  exerciseFlowOriginTab = 'parcours';
  startCombine(quickCombine.id);
}

function cleanupQuickCombine() {
  if (activeCombineId && String(activeCombineId).indexOf('quick-') === 0) {
    puttingCombines = puttingCombines.filter(function (c) { return c.id !== activeCombineId; });
  }
}

function retryQuickExercise() {
  cleanupQuickCombine();
  activeSession = null;
  startQuickExercise();
}

function finishQuickExercise() {
  cleanupQuickCombine();
  activeSession = null;
  exitExerciseFlow();
}

/* ---------- Modale Nouvel exercice / Modifier ---------- */

function regenerateCreativePreview(f) {
  f.previewRows = Array.from({ length: f.holesCount }, function (_, i) {
    return {
      hole: i + 1,
      m: Math.round((f.puttMin + Math.random() * (f.puttMax - f.puttMin)) * 10) / 10,
      clock: Math.floor(Math.random() * 12) + 1,
    };
  });
}

function openCreativeCombineModal() {
  puttingCreativeForm = {
    name: '',
    slopedGreen: true,
    puttMin: 0,
    puttMax: 0,
    holesCount: 0,
    rounds: 0,
    attempts: 0,
  };
  regenerateCreativePreview(puttingCreativeForm);
  editingCombineId = null;
  puttingCreativeModalOpen = true;
  renderExerciseModal();
}

function closeCreativeCombineModal() {
  puttingCreativeModalOpen = false;
  puttingCreativeForm = null;
  editingCombineId = null;
  renderExerciseModal();
}

function editCombine(id) {
  const c = puttingCombines.find(function (x) { return x.id === id; });
  if (!c) return;
  editingCombineId = id;
  puttingCreativeForm = {
    name: c.name,
    slopedGreen: c.slopedGreen,
    puttMin: c.puttMin,
    puttMax: c.puttMax,
    holesCount: c.holesCount,
    rounds: c.rounds,
    attempts: c.attempts,
    previewRows: c.previewRows ? JSON.parse(JSON.stringify(c.previewRows)) : [],
  };
  if (!puttingCreativeForm.previewRows.length) regenerateCreativePreview(puttingCreativeForm);
  puttingCreativeModalOpen = true;
  renderExerciseModal();
}

function setCreativeField(field, value) {
  const f = puttingCreativeForm;
  if (field === 'slopedGreen') f.slopedGreen = value === 'true';
  renderExerciseModal();
}

function updateCreativeName(value) {
  puttingCreativeForm.name = value;
  const btn = document.getElementById('creative-save-btn');
  if (btn) btn.disabled = !value.trim();
}

function promptCreativeNumber(field, label) {
  const f = puttingCreativeForm;
  const isPuttField = field === 'puttMin' || field === 'puttMax';
  const v = prompt(label, isPuttField ? String(f[field]).replace('.', ',') : f[field]);
  if (v === null) return;
  if (isPuttField) {
    const n = parseFloat((v || '').replace(',', '.'));
    if (isNaN(n) || n <= 0) return;
    f[field] = Math.round(n * 10) / 10;
  } else {
    const n2 = parseInt(v, 10);
    if (isNaN(n2) || n2 < 1) return;
    f[field] = n2;
  }
  if (field === 'puttMax' && f.puttMax < f.puttMin) f.puttMax = f.puttMin;
  if (field === 'puttMin' && f.puttMin > f.puttMax) f.puttMax = f.puttMin;
  if (['holesCount', 'puttMin', 'puttMax'].indexOf(field) !== -1) regenerateCreativePreview(f);
  renderExerciseModal();
}

function setPreviewRowM(idx, v) {
  const n = parseFloat((v || '').replace(',', '.'));
  if (!isNaN(n)) puttingCreativeForm.previewRows[idx].m = Math.round(Math.max(0, Math.min(30, n)) * 10) / 10;
}

function setPreviewRowClock(idx, v) {
  const n = parseInt(v, 10);
  if (!isNaN(n)) puttingCreativeForm.previewRows[idx].clock = Math.max(1, Math.min(12, n));
}

function saveCreativeCombine() {
  const f = puttingCreativeForm;
  if (!f.name || !f.name.trim()) {
    alert('Donne un nom à cet exercice avant de le sauvegarder.');
    return;
  }
  if (editingCombineId !== null) {
    const existing = puttingCombines.find(function (c) { return c.id === editingCombineId; });
    if (existing) {
      Object.assign(existing, {
        name: f.name.trim(), slopedGreen: f.slopedGreen, puttMin: f.puttMin, puttMax: f.puttMax,
        holesCount: f.holesCount, rounds: f.rounds, attempts: f.attempts, previewRows: f.previewRows,
      });
    }
  } else {
    puttingCombines.push({
      id: Date.now(),
      name: f.name.trim(),
      slopedGreen: f.slopedGreen,
      puttMin: f.puttMin,
      puttMax: f.puttMax,
      holesCount: f.holesCount,
      rounds: f.rounds,
      attempts: f.attempts,
      previewRows: f.previewRows,
    });
  }
  saveStateToLocalStorage();
  closeCreativeCombineModal();
  renderExerciseList();
}

function renderExerciseModal() {
  const modalRoot = document.getElementById('exercise-modal-root');
  if (!modalRoot) return;
  if (!puttingCreativeModalOpen || !puttingCreativeForm) {
    modalRoot.innerHTML = '';
    return;
  }
  const f = puttingCreativeForm;
  modalRoot.innerHTML = `
    <div class="exercise-modal_overlay" onclick="closeCreativeCombineModal()">
      <div class="exercise-modal" onclick="event.stopPropagation()">
        <div class="exercise-modal_head">
          <h3 class="exercise-modal_title">${editingCombineId !== null ? 'Modifier cet exercice' : 'Nouvel exercice'}</h3>
          <button class="exercise-modal_close" onclick="closeCreativeCombineModal()" aria-label="Fermer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>

        <input type="text" class="exercise-modal_input" id="creative-name-input" placeholder="Nom de l'exercice" value="${f.name}" oninput="updateCreativeName(this.value)">

        <div class="exercise-modal_grid exercise-modal_grid-3">
          <button type="button" class="exercise-modal_field" onclick="setCreativeField('slopedGreen', '${!f.slopedGreen}')">
            <span class="exercise-modal_field-label">Green en pente</span>
            <span class="exercise-modal_field-value">${f.slopedGreen ? 'Oui' : 'Non'}</span>
          </button>
          <button type="button" class="exercise-modal_field" onclick="promptCreativeNumber('puttMin','Distance min (m)')">
            <span class="exercise-modal_field-label">Distance min</span>
            <span class="exercise-modal_field-value">${f.puttMin} m</span>
          </button>
          <button type="button" class="exercise-modal_field" onclick="promptCreativeNumber('puttMax','Distance max (m)')">
            <span class="exercise-modal_field-label">Distance max</span>
            <span class="exercise-modal_field-value">${f.puttMax} m</span>
          </button>
        </div>

        <div class="exercise-modal_grid exercise-modal_grid-3">
          <button type="button" class="exercise-modal_field" onclick="promptCreativeNumber('holesCount','Nombre de trous')">
            <span class="exercise-modal_field-label">Trous</span>
            <span class="exercise-modal_field-value">${f.holesCount}</span>
          </button>
          <button type="button" class="exercise-modal_field" onclick="promptCreativeNumber('rounds','Nombre de tours')">
            <span class="exercise-modal_field-label">Tours</span>
            <span class="exercise-modal_field-value">${f.rounds}</span>
          </button>
          <button type="button" class="exercise-modal_field" onclick="promptCreativeNumber('attempts','Tentatives par trou')">
            <span class="exercise-modal_field-label">Tentatives</span>
            <span class="exercise-modal_field-value">${f.attempts}</span>
          </button>
        </div>

        <div class="exercise-modal_preview">
          <div class="exercise-modal_preview-row exercise-modal_preview-head">
            <span>Trou</span><span>Distance (m)</span><span>Pente (h)</span>
          </div>
          ${f.previewRows.map(function (r, i) {
            return `
            <div class="exercise-modal_preview-row">
              <span>${r.hole}</span>
              <input type="number" step="0.1" min="0" max="30" value="${r.m}" onchange="setPreviewRowM(${i}, this.value)">
              <input type="number" min="1" max="12" value="${r.clock}" onchange="setPreviewRowClock(${i}, this.value)">
            </div>`;
          }).join('')}
        </div>

        <button class="exercise-modal_save" id="creative-save-btn" onclick="saveCreativeCombine()" ${!f.name.trim() ? 'disabled' : ''}>${editingCombineId !== null ? 'Enregistrer les modifications' : 'Créer cet exercice'}</button>
      </div>
    </div>
  `;
}

/* ============================================================
   UTILITAIRE : petit message temporaire (fonctions pas encore actives)
   ============================================================ */
function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'app-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(function () {
    toast.classList.remove('is-visible');
  }, 1800);
}

/* ---------- Tri de la liste "Mes exercices" ---------- */
let exerciseSortMode = 'recent'; // 'recent' | 'alpha'

function toggleExerciseSort() {
  exerciseSortMode = exerciseSortMode === 'recent' ? 'alpha' : 'recent';
  const label = document.getElementById('exercise-sort-label');
  if (label) label.textContent = exerciseSortMode === 'recent' ? 'Récent' : 'A-Z';
  renderExerciseList();
}

/* ============================================================
   PARCOURS — Popup "Nouveau parcours" (saisie de données)
   Inspiré de la modale "Démarrer une nouvelle session" de putting-old.js :
   choix du nombre de trous, du type de session (Express / Complète),
   puis saisie des putts (et distances en mode complet) trou par trou.
   ============================================================ */
let newParcoursModalOpen = false;
let newParcoursForm = null;

function generateParcoursRows(n) {
  return Array.from({ length: n }, function (_, i) {
    return {
      hole: i + 1,
      m: Math.round((1 + Math.random() * 6) * 10) / 10,
      putts: null,
    };
  });
}

function openNewParcoursModal() {
  newParcoursForm = {
    name: '',
    holesCount: 18,
    mode: 'express', // 'express' | 'complete'
    rows: generateParcoursRows(18),
  };
  newParcoursModalOpen = true;
  renderNewParcoursModal();
}

function closeNewParcoursModal() {
  newParcoursModalOpen = false;
  newParcoursForm = null;
  renderNewParcoursModal();
}

function setParcoursHoles(n) {
  const f = newParcoursForm;
  if (f.holesCount === n) return;
  const oldRows = f.rows;
  f.holesCount = n;
  // Conserve les données déjà saisies pour les trous existants, n'en génère de nouveaux que si besoin
  f.rows = Array.from({ length: n }, function (_, i) {
    return oldRows[i] || { hole: i + 1, m: Math.round((1 + Math.random() * 6) * 10) / 10, putts: null };
  });
  renderNewParcoursModal();
}

function setParcoursMode(mode) {
  if (newParcoursForm.mode === mode) return;
  newParcoursForm.mode = mode;
  renderNewParcoursModal();
}

function updateParcoursName(value) {
  newParcoursForm.name = value;
  const btn = document.getElementById('parcours-save-btn');
  if (btn) btn.disabled = !value.trim();
}

function setParcoursRowPutts(idx, v) {
  const n = parseInt(v, 10);
  newParcoursForm.rows[idx].putts = isNaN(n) ? null : Math.max(0, Math.min(10, n));
}

function setParcoursRowM(idx, v) {
  const n = parseFloat((v || '').replace(',', '.'));
  if (!isNaN(n)) newParcoursForm.rows[idx].m = Math.round(Math.max(0, Math.min(30, n)) * 10) / 10;
}

function saveNewParcours() {
  const f = newParcoursForm;
  if (!f.name || !f.name.trim()) {
    alert('Donne un nom à ce parcours avant de l\'enregistrer.');
    return;
  }
  const rows = f.rows;
  const onePutts = rows.filter(function (r) { return r.putts === 1; }).length;
  const threePutts = rows.filter(function (r) { return r.putts !== null && r.putts >= 3; }).length;
  const totalPutts = rows.reduce(function (sum, r) { return sum + (r.putts || 0); }, 0);
  const totalMeters = rows.reduce(function (sum, r) { return sum + (f.mode === 'complete' ? (r.m || 0) : 0); }, 0);

  puttingRounds.push({
    id: Date.now(),
    name: f.name.trim(),
    dateISO: new Date().toISOString(),
    mode: f.mode,
    holesCount: f.holesCount,
    onePutts: onePutts,
    threePutts: threePutts,
    totalPutts: totalPutts,
    totalMeters: totalMeters,
    holes: JSON.parse(JSON.stringify(f.rows)),
  });
  saveStateToLocalStorage();
  closeNewParcoursModal();
  renderParcoursHistory();
}

function renderNewParcoursModal() {
  const modalRoot = document.getElementById('parcours-modal-root');
  if (!modalRoot) return;
  if (!newParcoursModalOpen || !newParcoursForm) {
    modalRoot.innerHTML = '';
    return;
  }
  const f = newParcoursForm;
  modalRoot.innerHTML = `
    <div class="exercise-modal_overlay" onclick="closeNewParcoursModal()">
      <div class="exercise-modal" onclick="event.stopPropagation()">
        <div class="exercise-modal_head">
          <h3 class="exercise-modal_title">Nouveau parcours</h3>
          <button class="exercise-modal_close" onclick="closeNewParcoursModal()" aria-label="Fermer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>

        <input type="text" class="exercise-modal_input" id="parcours-name-input" placeholder="Nom du parcours" value="${f.name}" oninput="updateParcoursName(this.value)">

        <div class="exercise-modal_grid">
          <button type="button" class="exercise-modal_field ${f.holesCount === 9 ? 'is-active' : ''}" onclick="setParcoursHoles(9)">
            <span class="exercise-modal_field-label">Trous</span>
            <span class="exercise-modal_field-value">9</span>
          </button>
          <button type="button" class="exercise-modal_field ${f.holesCount === 18 ? 'is-active' : ''}" onclick="setParcoursHoles(18)">
            <span class="exercise-modal_field-label">Trous</span>
            <span class="exercise-modal_field-value">18</span>
          </button>
        </div>

        <div class="exercise-modal_grid">
          <button type="button" class="exercise-modal_field ${f.mode === 'express' ? 'is-active' : ''}" onclick="setParcoursMode('express')">
            <span class="exercise-modal_field-label">Session express</span>
            <span class="exercise-modal_field-value">Putts par trou</span>
          </button>
          <button type="button" class="exercise-modal_field ${f.mode === 'complete' ? 'is-active' : ''}" onclick="setParcoursMode('complete')">
            <span class="exercise-modal_field-label">Session complète</span>
            <span class="exercise-modal_field-value">Distance + putts</span>
          </button>
        </div>

        <div class="exercise-modal_preview">
          <div class="exercise-modal_preview-row exercise-modal_preview-head ${f.mode === 'express' ? 'exercise-modal_preview-row-2col' : ''}">
            <span>Trou</span>${f.mode === 'complete' ? '<span>Distance (m)</span>' : ''}<span>Putts</span>
          </div>
          ${f.rows.map(function (r, i) {
            return `
            <div class="exercise-modal_preview-row ${f.mode === 'express' ? 'exercise-modal_preview-row-2col' : ''}">
              <span>${r.hole}</span>
              ${f.mode === 'complete' ? `<input type="number" step="0.1" min="0" max="30" value="${r.m}" onchange="setParcoursRowM(${i}, this.value)">` : ''}
              <input type="number" min="0" max="10" placeholder="--" value="${r.putts !== null ? r.putts : ''}" onchange="setParcoursRowPutts(${i}, this.value)">
            </div>`;
          }).join('')}
        </div>

        <button class="exercise-modal_save" id="parcours-save-btn" onclick="saveNewParcours()" ${!f.name.trim() ? 'disabled' : ''}>Enregistrer ce parcours</button>
      </div>
    </div>
  `;
}

/* ---------- Historique des parcours (accueil Parcours) ---------- */
function renderParcoursHistory() {
  const listRoot = document.getElementById('parcours-history-list');
  if (!listRoot) return;
  if (!puttingRounds.length) {
    listRoot.innerHTML = '';
    return;
  }
  const sorted = puttingRounds.slice().reverse();
  listRoot.innerHTML = sorted.map(function (r) {
    const date = new Date(r.dateISO);
    const dateLabel = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    const modeLabel = r.mode === 'complete' ? 'Complète' : 'Express';
    return `
      <div class="history-item">
        <div class="history-item_content">
          <div class="history-item_title">${r.name}</div>
          <div class="history-item_meta">${dateLabel} &middot; ${r.holesCount} trous &middot; ${modeLabel} &middot; ${r.totalPutts} putts</div>
        </div>
        <div class="history-item_right">
          <svg class="history-item_arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </div>
      </div>
    `;
  }).join('');
}

