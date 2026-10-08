const root = document.getElementById('app-root');

// Sélecteurs limités à la page Putting : d'autres modules réutilisent des noms proches (data-header, .bottom-nav...)
function puttingQuery(sel) { return document.querySelector('#page-putting ' + sel); }
function puttingQueryAll(sel) { return document.querySelectorAll('#page-putting ' + sel); }

function renderPuttingTab() {
  // Retour sur Putting : l'écran Stats de Putting n'est plus affiché, ce drapeau (resté sur body si on a quitté depuis cet écran) doit retomber
  document.body.classList.remove('is-stats-screen');
  root.innerHTML = `
<header class="page-header" data-header="main">
  <a href="#" class="page-header_back" onclick="handleMainHeaderBack(event)">
    <svg class="page-header_back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
    <span class="page-header_back-label" id="main-header-back-label">Home</span>
  </a>
  <h1 class="page-header_title" id="main-header-title">Putting</h1>
  <button type="button" class="page-header_menu" id="headerRightBtn" aria-label="Menu"><svg class="page-header_menu-icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg></button>
</header>

<header class="page-header is-hidden" data-header="stats">
  <a href="#" class="page-header_back" onclick="backToPuttingMain(event)">
    <svg class="page-header_back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
    <span class="page-header_back-label">Putting</span>
  </a>
  <h1 class="page-header_title">Performance</h1>
  <button type="button" class="page-header_menu" aria-label="Menu"><svg class="page-header_menu-icon" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg></button>
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
      </div>
    </a>
    <a href="#" class="putting_tab" data-tab="exercices" onclick="selectPuttingTab(event, 'exercices')">
      <svg class="putting_tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5"/></svg>
      <div class="putting_tab-text">
        <div class="putting_tab-title">Exercices</div>
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
          <div class="stat-card_value" id="home-sg-value">--</div>
        </div>
        <div class="stat-card">
          <div class="stat-card_icon-wrap">
            <svg class="stat-card_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5"/></svg>
          </div>
          <div class="stat-card_label">1 Putt %</div>
          <div class="stat-card_value" id="home-oneputt-value">--</div>
        </div>
      </div>

      <!-- Historique : toujours visible, liste vide si aucune activité -->
      <div class="history-card">
        <div class="history-card_header">
          <div class="history-card_title">Activité récente</div>
          <a href="#" class="history-card_link is-disabled" id="parcours-history-toggle" onclick="toggleParcoursHistory(event)">Voir tout</a>
        </div>
        <div class="history-card_list" id="parcours-history-list"></div>
      </div>

    </div>

    <!-- Sous-panneau : Analyse Distance -->
    <div class="analyse-subpanel is-hidden" data-sub="analyse-distance">

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

      <div class="chart-card compare-card is-hidden" id="compare-card-distance"></div>

      <div class="chart-card">
        <div class="chart-card_header">
          <div class="chart-card_title">
            SG vs Tour par distance
          </div>
        </div>

        <div class="bar-chart bar-chart-centered" id="distance-sg-chart">
          <div class="bar-chart_row">
            <div class="bar-chart_label">Toutes</div>
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

        <div class="bar-chart" id="distance-rate-chart">
          <div class="bar-chart_row">
            <div class="bar-chart_label">Toutes</div>
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

        <div class="bar-chart" id="distance-error-chart">
          <div class="bar-chart_row">
            <div class="bar-chart_label">Toutes</div>
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

      <div class="chart-card compare-card is-hidden" id="compare-card-pente"></div>

      <div class="chart-card">
        <div class="chart-card_header">
          <div class="chart-card_title">
            SG vs Tour
          </div>
        </div>
        <div class="radar-chart_wrap" id="pente-sg-radar"></div>
      </div>

      <div class="chart-card">
        <div class="chart-card_header">
          <div class="chart-card_title">
            Taux de réussite
          </div>
        </div>
        <div class="radar-chart_wrap" id="pente-rate-radar"></div>
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
        <div class="stat-card_value" id="exo-sessions-value">--</div>
      </div>
      <div class="stat-card">
        <div class="stat-card_icon-wrap">
          <svg class="stat-card_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <div class="stat-card_label">Taux de réussite</div>
        <div class="stat-card_value" id="exo-rate-value">--</div>
      </div>
    </div>

    <!-- Mes exercices -->
    <div class="exercises-header">
      <div class="exercises-header_title">MES EXERCICES</div>
      <button type="button" class="exercise-chip is-active" onclick="openCreativeCombineModal()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
        Créer
      </button>
    </div>
    <div class="exercise-chip-row">
      <button type="button" class="exercise-chip" onclick="toggleExerciseSort()">Tri : <span id="exercise-sort-label">Récent</span></button>
    </div>

    <div class="exercise-list" id="exercise-list-root"></div>

  </div>

</main>

<!-- Modale Nouvel exercice / Modifier -->
<div id="exercise-modal-root"></div>

<!-- Popup pavé numérique — remplace prompt() natif pour toute saisie manuelle de chiffres -->
<div id="numeric-keypad-root"></div>

<!-- Écran Saisie rapide (Nouveau parcours) -->
<main class="quick-entry-wrapper is-hidden" id="parcours-entry-root"></main>
<div id="parcours-popup-root"></div>

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
      </div>
    </a>
    <a href="#" class="putting_tab" data-tab="exercices" onclick="selectPuttingTab(event, 'exercices')">
      <svg class="putting_tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5"/></svg>
      <div class="putting_tab-text">
        <div class="putting_tab-title">Exercices</div>
      </div>
    </a>
  </div>

  <div class="page-subtitle">Suivez l'évolution de votre performance au putting.</div>

  <div class="analyse-filters">
    <button class="analyse-filter is-active" id="filter-btn-stats-sessions" onclick="openFilterSheet(event, 'stats', 'sessions')">
      <span class="analyse-filter_label">Sessions</span>
      <span class="analyse-filter_value"><span class="filter-value-text">20 dernières</span><svg class="analyse-filter_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></span>
    </button>
    <button class="analyse-filter" id="filter-btn-stats-distance" onclick="openFilterSheet(event, 'stats', 'distance')">
      <span class="analyse-filter_label">Distance</span>
      <span class="analyse-filter_value"><span class="filter-value-text">Toutes distances</span><svg class="analyse-filter_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></span>
    </button>
    <button class="analyse-filter" id="filter-btn-stats-parcours" onclick="openFilterSheet(event, 'stats', 'parcours')">
      <span class="analyse-filter_label">Parcours</span>
      <span class="analyse-filter_value"><span class="filter-value-text">Tous les parcours</span><svg class="analyse-filter_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></span>
    </button>
    <button class="analyse-filter" id="filter-btn-stats-compare" onclick="openFilterSheet(event, 'stats', 'compare')">
      <span class="analyse-filter_label">Comparer</span>
      <span class="analyse-filter_value"><span class="filter-value-text">Aucune</span><svg class="analyse-filter_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></span>
    </button>
  </div>

  <div class="chart-card compare-card is-hidden" id="compare-card-stats"></div>

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

    <svg class="line-chart" id="stats-sg-line" viewBox="-50 0 1020 520" xmlns="http://www.w3.org/2000/svg"></svg>
  </div>

  <div class="chart-card">
    <div class="line-chart_header">
      <div>
        <div class="line-chart_title">Taux de réussite &amp; mètres par round</div>
        <div class="line-chart_subtitle">Évolution</div>
      </div>
      <div class="line-chart_legend">
        <span class="line-chart_legend-item">
          <svg class="line-chart_legend-icon" viewBox="0 0 24 10" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="0" y1="5" x2="20" y2="5"/><circle cx="10" cy="5" r="3" fill="currentColor" stroke="none"/></svg>
          Taux de réussite
        </span>
        <span class="line-chart_legend-item is-b">
          <svg class="line-chart_legend-icon" viewBox="0 0 24 10" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="0" y1="5" x2="20" y2="5"/><circle cx="10" cy="5" r="3" fill="currentColor" stroke="none"/></svg>
          Mètres
        </span>
      </div>
    </div>

    <svg class="line-chart" id="stats-rate-meters-line" viewBox="-50 0 1020 520" xmlns="http://www.w3.org/2000/svg"></svg>
  </div>

  <div class="chart-card">
    <div class="line-chart_header">
      <div>
        <div class="line-chart_title">1 putt &amp; 3 putts par round</div>
        <div class="line-chart_subtitle">Évolution</div>
      </div>
      <div class="line-chart_legend">
        <span class="line-chart_legend-item">
          <svg class="line-chart_legend-icon" viewBox="0 0 24 10" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="0" y1="5" x2="20" y2="5"/><circle cx="10" cy="5" r="3" fill="currentColor" stroke="none"/></svg>
          1 Putt
        </span>
        <span class="line-chart_legend-item is-b">
          <svg class="line-chart_legend-icon" viewBox="0 0 24 10" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="0" y1="5" x2="20" y2="5"/><circle cx="10" cy="5" r="3" fill="currentColor" stroke="none"/></svg>
          3 Putts
        </span>
      </div>
    </div>

    <svg class="line-chart" id="stats-putts-bars" viewBox="-50 0 1020 520" xmlns="http://www.w3.org/2000/svg"></svg>
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
    <span class="fab-button_text">Exercice<br>rapide</span>
  </button>
</div>

<!-- Bouton de lancement : toujours visible sur l'onglet Exercices (comme wedging) -->
<div class="exercise-launch is-hidden" id="exercise-select-bar">
  <button type="button" class="exercise-launch_btn" onclick="startSelectedCombine()">Lancer l'exercice &rarr;</button>
</div>

<!-- Barre nav basse : uniquement pour l'onglet Parcours -->
<nav class="bottom-nav" data-nav="parcours">
  <a href="#" class="bottom-nav_item" data-section="analyse-distance" onclick="selectAnalyseSection(event, 'analyse-distance')">
    <svg class="bottom-nav_icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12h18"/><path d="M7 8l-4 4 4 4"/><path d="M17 8l4 4-4 4"/></svg>
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
  refreshAllAnalytics();
  syncFilterButtons();
}

// Le HTML est régénéré à chaque ouverture : on réaligne les libellés sur filterState (qui, lui, persiste)
function syncFilterButtons() {
  ['distance', 'pente', 'stats'].forEach(function (group) {
    ['sessions', 'distance', 'parcours', 'compare'].forEach(function (type) {
      updateFilterButtonUI(group, type);
    });
  });
}

function selectPuttingTab(event, tab) {
    event.preventDefault();
    if (document.body.classList.contains('is-stats-screen')) {
      puttingQuery('[data-header="stats"]').classList.add('is-hidden');
      puttingQuery('[data-header="main"]').classList.remove('is-hidden');
      puttingQuery('.stats-wrapper').classList.add('is-hidden');
      puttingQuery('.putting_wrapper').classList.remove('is-hidden');
      document.body.classList.remove('is-stats-screen');
      window.scrollTo(0, 0);
    }
    puttingQueryAll('.putting_tab').forEach(function (el) {
      el.classList.toggle('is-active', el.dataset.tab === tab);
    });
    if (tab !== 'exercices') {
      selectedCombineId = null;
      renderExerciseList();
    }
    updateExerciseSelectBar();
    puttingQueryAll('.tab-panel').forEach(function (el) {
      el.classList.toggle('is-hidden', el.dataset.panel !== tab);
    });
    puttingQueryAll('.fab-group').forEach(function (el) {
      el.classList.toggle('is-hidden', el.dataset.fab !== tab);
    });
    puttingQueryAll('.bottom-nav').forEach(function (el) {
      el.classList.toggle('is-hidden', el.dataset.nav !== tab);
    });
    // Retour à l'accueil Parcours à chaque changement d'onglet supérieur
    puttingQueryAll('.analyse-subpanel').forEach(function (el) {
      el.classList.toggle('is-hidden', el.dataset.sub !== 'home');
    });
    puttingQueryAll('.bottom-nav_item').forEach(function (el) {
      el.classList.remove('is-active');
    });
    document.getElementById('main-header-back-label').textContent = 'Home';
    document.getElementById('main-header-title').textContent = 'Putting';
    renderHomeStats();
    renderExercicesStats();
  }

  function selectAnalyseSection(event, section) {
    event.preventDefault();
    if (document.body.classList.contains('is-stats-screen')) {
      puttingQuery('[data-header="stats"]').classList.add('is-hidden');
      puttingQuery('[data-header="main"]').classList.remove('is-hidden');
      puttingQuery('.stats-wrapper').classList.add('is-hidden');
      puttingQuery('.putting_wrapper').classList.remove('is-hidden');
      document.body.classList.remove('is-stats-screen');
      window.scrollTo(0, 0);
    }
    puttingQueryAll('.analyse-subpanel').forEach(function (el) {
      el.classList.toggle('is-hidden', el.dataset.sub !== section);
    });
    puttingQueryAll('.bottom-nav_item').forEach(function (el) {
      el.classList.toggle('is-active', el.dataset.section === section);
    });
    document.getElementById('main-header-back-label').textContent = section === 'home' ? 'Home' : 'Putting';
    document.getElementById('main-header-title').textContent = section === 'analyse-distance' ? 'Distance' : 'Pente';
    if (section === 'analyse-distance') renderAnalyseDistance();
    if (section === 'analyse-pente') renderAnalysePente();
  }

  function goToStatsPerformance(event) {
    event.preventDefault();
    puttingQuery('[data-header="main"]').classList.add('is-hidden');
    puttingQuery('[data-header="stats"]').classList.remove('is-hidden');
    puttingQuery('.putting_wrapper').classList.add('is-hidden');
    puttingQuery('.stats-wrapper').classList.remove('is-hidden');
    puttingQueryAll('.putting_tab').forEach(function (el) {
      el.classList.toggle('is-active', el.dataset.tab === 'parcours');
    });
    puttingQueryAll('.fab-group').forEach(function (el) {
      el.classList.toggle('is-hidden', el.dataset.fab !== 'parcours');
    });
    puttingQueryAll('.bottom-nav_item').forEach(function (el) {
      el.classList.toggle('is-active', el.dataset.section === 'stats-performance');
    });
    document.body.classList.add('is-stats-screen');
    renderStatsPerformance();
    window.scrollTo(0, 0);
  }

  function backToPuttingMain(event) {
    event.preventDefault();
    puttingQuery('[data-header="stats"]').classList.add('is-hidden');
    puttingQuery('[data-header="main"]').classList.remove('is-hidden');
    puttingQuery('.stats-wrapper').classList.add('is-hidden');
    puttingQuery('.putting_wrapper').classList.remove('is-hidden');
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
let resumableSession = null; // session de putting à reprendre (clé putting_resume), voir loadPuttingState()

/* ============================================================
   PAVÉ NUMÉRIQUE — popup générique remplaçant prompt() natif pour
   toute saisie manuelle de chiffres (distances, nombre de trous...).
   Utilise appKeypad() (commun.js). "target" identifie le champ à
   mettre à jour au clic sur Valider, voir applyNumericKeypadValue().
   ============================================================ */
let puttingNumericKeypadPopup = null; // { title, target, value, decimal, unit }

function openNumericKeypad(title, target, currentValue, decimal, unit) {
  const start = (currentValue === null || currentValue === undefined || currentValue === '') ? '' : String(currentValue).replace('.', ',');
  puttingNumericKeypadPopup = { title: title, target: target, value: start, decimal: !!decimal, unit: unit || '' };
  renderNumericKeypad();
}

function closeNumericKeypad() {
  puttingNumericKeypadPopup = null;
  renderNumericKeypad();
}

function keypadPress(d) {
  if (!puttingNumericKeypadPopup || puttingNumericKeypadPopup.value.length >= 6) return;
  puttingNumericKeypadPopup.value += d;
  renderNumericKeypad();
}

function keypadDecimal() {
  if (!puttingNumericKeypadPopup || !puttingNumericKeypadPopup.decimal) return;
  if (puttingNumericKeypadPopup.value.indexOf(',') !== -1) return;
  puttingNumericKeypadPopup.value += (puttingNumericKeypadPopup.value === '' ? '0,' : ',');
  renderNumericKeypad();
}

function keypadBackspace() {
  if (!puttingNumericKeypadPopup) return;
  puttingNumericKeypadPopup.value = puttingNumericKeypadPopup.value.slice(0, -1);
  renderNumericKeypad();
}

function keypadClear() {
  if (!puttingNumericKeypadPopup) return;
  puttingNumericKeypadPopup.value = '';
  renderNumericKeypad();
}

function confirmNumericKeypad() {
  if (!puttingNumericKeypadPopup) return;
  applyNumericKeypadValue(puttingNumericKeypadPopup.target, puttingNumericKeypadPopup.value);
  closeNumericKeypad();
}

// Applique la valeur saisie au champ visé par "target" (voir les appels à openNumericKeypad)
function applyNumericKeypadValue(target, raw) {
  const sep = target.indexOf(':');
  const kind = sep === -1 ? target : target.slice(0, sep);
  const key = sep === -1 ? null : target.slice(sep + 1);
  const v = raw.replace(',', '.');

  if (kind === 'creative') {
    const f = puttingCreativeForm;
    const isPuttField = key === 'puttMin' || key === 'puttMax';
    if (isPuttField) {
      const n = parseFloat(v);
      if (isNaN(n) || n <= 0) return;
      f[key] = Math.round(n * 10) / 10;
    } else {
      const n2 = parseInt(v, 10);
      if (isNaN(n2) || n2 < 1) return;
      f[key] = n2;
    }
    if (key === 'puttMax' && f.puttMin != null && f.puttMax < f.puttMin) f.puttMax = f.puttMin;
    if (key === 'puttMin' && f.puttMax != null && f.puttMin > f.puttMax) f.puttMax = f.puttMin;
    if (['holesCount', 'puttMin', 'puttMax'].indexOf(key) !== -1) regenerateCreativePreview(f);
    renderExerciseModal();
  } else if (kind === 'previewM') {
    setPreviewRowM(parseInt(key, 10), v);
    renderExerciseModal();
  } else if (kind === 'previewClock') {
    setPreviewRowClock(parseInt(key, 10), v);
    renderExerciseModal();
  } else if (kind === 'parcoursRowM') {
    setParcoursRowM(parseInt(key, 10), v);
    renderNewParcoursModal();
  }
}

function renderNumericKeypad() {
  const root = document.getElementById('numeric-keypad-root');
  if (!root) return;
  if (!puttingNumericKeypadPopup) { root.innerHTML = ''; return; }
  const p = puttingNumericKeypadPopup;
  const closeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const extraKey = p.decimal ? { fn: 'keypadDecimal', label: ',' } : null;
  root.innerHTML = `
    <div class="mini-popup_overlay" onclick="closeNumericKeypad()">
      <div class="mini-popup" onclick="event.stopPropagation()">
        <div class="mini-popup_head">
          <h3 class="mini-popup_title">${p.title}</h3>
          <button type="button" class="mini-popup_close" onclick="closeNumericKeypad()" aria-label="Fermer">${closeIcon}</button>
        </div>
        <div class="app-keypad-value">${p.value === '' ? '--' : p.value}${p.value !== '' && p.unit ? ' ' + p.unit : ''}</div>
        ${appKeypad('keypadPress', 'keypadBackspace', 'keypadClear', extraKey)}
        <button type="button" class="exercise-modal_save" onclick="confirmNumericKeypad()">Valider</button>
      </div>
    </div>
  `;
}

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

/* ============================================================
   SG (Strokes Gained) — putting
   Le moteur (tables + interpolation) vit dans sg-data.js et strokes-gained.js.
   Ici : uniquement le lie "green".
   ============================================================ */

// SG d'un trou = putts attendus (référence Tour, green) - putts réellement pris (positif = mieux que le Tour)
function puttSG(distanceM, puttsTaken) {
  if (distanceM == null || puttsTaken == null || isNaN(distanceM) || isNaN(puttsTaken) || distanceM <= 0) return null;
  return sgShot('green', distanceM, null, 0, puttsTaken);
}

function fmtSG(v) {
  if (v == null || isNaN(v)) return '--';
  return (v >= 0 ? '+' : '') + v.toFixed(2);
}

function fmtPct(v) {
  if (v == null || isNaN(v)) return '--';
  return Math.round(v) + '%';
}

/* Regroupement des distances en 5 tranches (mêmes libellés que l'UI) */
function distanceBucketIndex(m) {
  if (m == null || isNaN(m)) return null;
  if (m <= 2) return 0;
  if (m <= 3) return 1;
  if (m <= 5) return 2;
  if (m <= 9) return 3;
  return 4;
}

/* Regroupement des 12 positions d'horloge (pente) en 8 catégories */
const PENTE_LABELS = ['Descente', 'Descente D→G', 'D→G', 'Montée D→G', 'Montée', 'Montée G→D', 'G→D', 'Descente G→D'];
const PENTE_CLOCK_MAP = { 12: 0, 1: 1, 2: 1, 3: 2, 4: 3, 5: 3, 6: 4, 7: 5, 8: 5, 9: 6, 10: 7, 11: 7 };
function penteCategoryIndex(clock) {
  if (clock == null || isNaN(clock)) return null;
  const c = ((Math.round(clock) - 1) % 12 + 12) % 12 + 1;
  return PENTE_CLOCK_MAP[c];
}

/* ---------- Collecte des trous (données Parcours) selon les filtres actifs ---------- */
function refreshParcoursFilterOptions() {
  const names = [];
  puttingRounds.forEach(function (r) { if (names.indexOf(r.name) === -1) names.push(r.name); });
  FILTER_PARCOURS_OPTIONS.length = 1; // conserve "Tous les parcours"
  names.forEach(function (n) { FILTER_PARCOURS_OPTIONS.push({ value: n, label: n }); });
}

function getFilteredRounds(group) {
  const s = filterState[group];
  let rounds = puttingRounds.slice();
  if (s.parcours && s.parcours !== 'all') {
    rounds = rounds.filter(function (r) { return r.name === s.parcours; });
  }
  if (s.sessions !== 'all') {
    const n = parseInt(s.sessions, 10);
    rounds = rounds.slice(-n);
  }
  return rounds;
}

function getFilteredHoles(group) {
  const s = filterState[group];
  const rounds = getFilteredRounds(group);
  let holes = [];
  rounds.forEach(function (r) {
    (r.holes || []).forEach(function (h) { if (h.putts != null) holes.push(h); });
  });
  if (s.distance && s.distance !== 'all') {
    const map = { '0-2': 0, '2-3': 1, '3-5': 2, '5-9': 3, '9+': 4 };
    const idx = map[s.distance];
    holes = holes.filter(function (h) { return distanceBucketIndex(h.m) === idx; });
  }
  return holes;
}

/* ---------- Générateurs de graphiques réutilisables ---------- */

// Remplit un bar-chart "simple" existant (valeurs déjà en %, 0-100) sans regénérer son HTML
function fillBarChart(container, values, fmt) {
  if (!container) return;
  cmpReset(container);
  const rows = container.querySelectorAll('.bar-chart_row');
  rows.forEach(function (row, i) {
    const v = values[i];
    const fill = row.querySelector('.bar-chart_fill');
    const val = row.querySelector('.bar-chart_value');
    if (v == null) { if (fill) fill.style.width = '0%'; if (val) val.textContent = '--'; return; }
    if (fill) fill.style.width = Math.max(2, Math.min(100, v)) + '%';
    if (val) val.textContent = fmt(v);
  });
}

// Remplit un bar-chart "double" (vitesse + pente) existant
function fillDualBarChart(container, speedValues, slopeValues) {
  if (!container) return;
  cmpReset(container);
  const rows = container.querySelectorAll('.bar-chart_row');
  rows.forEach(function (row, i) {
    const wraps = row.querySelectorAll('.bar-chart_bar-wrap');
    [[wraps[0], speedValues[i]], [wraps[1], slopeValues[i]]].forEach(function (pair) {
      const wrap = pair[0], v = pair[1];
      if (!wrap) return;
      const fill = wrap.querySelector('.bar-chart_fill');
      const val = wrap.querySelector('.bar-chart_value');
      if (v == null) { if (fill) fill.style.width = '0%'; if (val) val.textContent = '--'; return; }
      if (fill) fill.style.width = Math.max(2, Math.min(100, v)) + '%';
      if (val) val.textContent = Math.round(v) + '%';
    });
  });
}

// Remplit un bar-chart "centré" existant (ex : SG, positif/négatif)
function fillCenteredBarChart(container, values, fmt, scaleMax) {
  if (!container) return;
  cmpReset(container);
  const rows = container.querySelectorAll('.bar-chart_row');
  const nums = values.filter(function (v) { return v != null; }).map(Math.abs);
  const max = Math.max(scaleMax || 0.2, nums.length ? Math.max.apply(null, nums) : 0.2);
  rows.forEach(function (row, i) {
    const v = values[i];
    const fill = row.querySelector('.bar-chart_fill-centered');
    const val = row.querySelector('.bar-chart_value');
    if (v == null) {
      if (fill) { fill.style.width = '0%'; fill.style.left = '50%'; fill.classList.remove('is-negative'); }
      if (val) val.textContent = '--';
      return;
    }
    const halfPct = Math.min(50, (Math.abs(v) / max) * 50);
    if (fill) {
      fill.style.width = halfPct + '%';
      fill.style.left = (v >= 0 ? 50 : (50 - halfPct)) + '%';
      fill.classList.toggle('is-negative', v < 0);
    }
    if (val) val.textContent = fmt(v);
  });
}

// Toile d'araignée SVG à N sommets (utilisée pour l'analyse Pente, 8 sommets)
function svgRadarChart(values, labels, opts) {
  opts = opts || {};
  const cx = 150, cy = 150, R = 95;
  const n = labels.length;
  const angleFor = function (i) { return -Math.PI / 2 + i * (2 * Math.PI / n); };
  const centered = !!opts.centered;
  let min, max;
  if (centered) {
    const nums = values.concat(opts.valuesB || []).filter(function (v) { return v != null; }).map(Math.abs);
    const m = Math.max(opts.scaleMax || 0.2, nums.length ? Math.max.apply(null, nums) : 0.2);
    min = -m; max = m;
  } else { min = 0; max = 100; }
  function radiusFor(v) {
    if (v == null) return R * (centered ? 0.5 : 0);
    const t = (v - min) / (max - min);
    return Math.max(0, Math.min(1, t)) * R;
  }
  let rings = '';
  [0.25, 0.5, 0.75, 1].forEach(function (f) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = angleFor(i), r = R * f;
      pts.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1));
    }
    rings += '<polygon points="' + pts.join(' ') + '" class="radar-grid"/>';
  });
  let axes = '';
  for (let i = 0; i < n; i++) {
    const a = angleFor(i);
    axes += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + R * Math.cos(a)).toFixed(1) + '" y2="' + (cy + R * Math.sin(a)).toFixed(1) + '" class="radar-axis"/>';
  }
  let zeroRing = '';
  if (centered) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = angleFor(i), r = R * 0.5;
      pts.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1));
    }
    zeroRing = '<polygon points="' + pts.join(' ') + '" class="radar-zero"/>';
  }
  const dataPts = [];
  let dots = '';
  for (let i = 0; i < n; i++) {
    const a = angleFor(i), r = radiusFor(values[i]);
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    dataPts.push(x.toFixed(1) + ',' + y.toFixed(1));
    dots += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4" class="radar-dot"/>';
  }
  const dataPoly = '<polygon points="' + dataPts.join(' ') + '" class="radar-data"/>';
  let polyB = '';
  if (opts.valuesB) {
    const ptsB = []; let dotsB = '';
    for (let i = 0; i < n; i++) {
      const a = angleFor(i), r = radiusFor(opts.valuesB[i]);
      const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
      ptsB.push(x.toFixed(1) + ',' + y.toFixed(1));
      dotsB += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4" class="radar-dot is-b"/>';
    }
    polyB = '<polygon points="' + ptsB.join(' ') + '" class="radar-data is-b"/>' + dotsB;
  }
  let labelsHtml = '';
  const LR = R + 32;
  for (let i = 0; i < n; i++) {
    const a = angleFor(i);
    const x = cx + LR * Math.cos(a), y = cy + LR * Math.sin(a);
    let anchor = 'middle';
    if (Math.cos(a) > 0.3) anchor = 'start';
    else if (Math.cos(a) < -0.3) anchor = 'end';
    const v = values[i];
    const valTxt = opts.fmt ? opts.fmt(v) : (v == null ? '--' : v);
    labelsHtml += '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="' + anchor + '" class="radar-label">' + labels[i] + '</text>';
    labelsHtml += '<text x="' + x.toFixed(1) + '" y="' + (y + 13).toFixed(1) + '" text-anchor="' + anchor + '" class="radar-label-value">' + valTxt + '</text>';
    if (opts.valuesB) {
      const vB = opts.valuesB[i];
      labelsHtml += '<text x="' + x.toFixed(1) + '" y="' + (y + 25).toFixed(1) + '" text-anchor="' + anchor + '" class="radar-label-value is-b">' + (opts.fmt ? opts.fmt(vB) : (vB == null ? '--' : vB)) + '</text>';
    }
  }
  return '<svg class="radar-chart" viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg">' + rings + axes + zeroRing + dataPoly + dots + polyB + labelsHtml + '</svg>';
}

// Ligne (tendance dans le temps, ex : SG par round, taux de réussite par round)
// Valeurs affichées le long de l'axe des ordonnées (6 paliers, du haut/max au bas/min).
// cls = 'is-b' pour l'axe de droite (2e série d'un graphe à double échelle), sinon axe de gauche.
const Y_TICK_FRACTIONS = [0, 0.2, 0.4, 0.6, 0.8, 1];
function yAxisTicks(min, max, top, bottom, fmt, cls) {
  const isRight = cls === 'is-b';
  return Y_TICK_FRACTIONS.map(function (f) {
    const y = top + f * (bottom - top);
    const v = max - f * (max - min);
    const label = fmt ? fmt(v) : String(Math.round(v * 10) / 10);
    return '<text x="' + (isRight ? 900 : 30) + '" y="' + (y + 6).toFixed(1) + '" text-anchor="' + (isRight ? 'start' : 'end') + '" class="line-chart-ytick ' + (cls || '') + '">' + label + '</text>';
  }).join('');
}

// Libellés le long de l'axe des abscisses (dates/rounds), au plus ~6 répartis pour rester lisible
function xAxisTickLabels(labels, xAt, n) {
  if (!labels || !labels.length) return '';
  const maxLabels = 6;
  const step = n <= maxLabels ? 1 : Math.ceil(n / maxLabels);
  const idxs = [];
  for (let i = 0; i < n; i += step) idxs.push(i);
  if (idxs[idxs.length - 1] !== n - 1) idxs.push(n - 1);
  return idxs.map(function (i) {
    return '<text x="' + xAt(i).toFixed(1) + '" y="442" text-anchor="middle" class="line-chart-xtick">' + (labels[i] || '') + '</text>';
  }).join('');
}

function svgLineChart(values, opts) {
  opts = opts || {};
  const left = 40, right = 890, top = 20, bottom = 420;
  const vals = values.filter(function (v) { return v != null && !isNaN(v); });
  let grid = [0.2, 0.4, 0.6, 0.8].map(function (f) {
    const y = top + f * (bottom - top);
    return '<line x1="' + left + '" y1="' + y.toFixed(1) + '" x2="' + right + '" y2="' + y.toFixed(1) + '" class="line-chart-grid"/>';
  }).join('') + '<line x1="' + left + '" y1="' + bottom + '" x2="' + right + '" y2="' + bottom + '" class="line-chart-grid-solid"/>';
  const axisTitle = '<text x="465" y="505" text-anchor="middle" class="line-chart-axis-title">' + (opts.axisTitle || 'Rounds') + '</text>';
  if (!vals.length) {
    return grid + '<text x="465" y="240" text-anchor="middle" class="line-chart-axis-label">Pas encore de données</text>' + axisTitle;
  }
  let min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
  if (opts.forceZeroMin) min = Math.min(0, min);
  if (opts.centered) { const m = Math.max(Math.abs(min), Math.abs(max), 0.1); min = -m; max = m; }
  if (min === max) { min -= 1; max += 1; }
  const pad = (max - min) * 0.12;
  min -= pad; max += pad;
  const n = values.length;
  const stepX = n > 1 ? (right - left) / (n - 1) : 0;
  function xAt(i) { return n > 1 ? left + i * stepX : (left + right) / 2; }
  function yAt(v) { return bottom - ((v - min) / (max - min)) * (bottom - top); }
  let zeroLine = '';
  if (opts.centered) {
    const zy = yAt(0);
    zeroLine = '<line x1="' + left + '" y1="' + zy.toFixed(1) + '" x2="' + right + '" y2="' + zy.toFixed(1) + '" class="line-chart-grid-solid"/>';
  }
  let path = '', points = [];
  values.forEach(function (v, i) {
    if (v == null || isNaN(v)) return;
    const x = xAt(i), y = yAt(v);
    path += (points.length ? ' L ' : 'M ') + x.toFixed(1) + ' ' + y.toFixed(1);
    points.push({ x: x, y: y, v: v });
  });
  let areaPath = '';
  if (points.length > 1) {
    areaPath = 'M ' + points[0].x.toFixed(1) + ' ' + bottom +
      points.map(function (p) { return ' L ' + p.x.toFixed(1) + ' ' + p.y.toFixed(1); }).join('') +
      ' L ' + points[points.length - 1].x.toFixed(1) + ' ' + bottom + ' Z';
  }
  const isPtB = function (p) { return !!opts.labelAll && p.x > (left + right) / 2; };
  const dots = points.map(function (p) { return '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="6" class="line-chart-point' + (isPtB(p) ? ' is-b' : '') + '"/>'; }).join('');
  const lastPt = points[points.length - 1];
  const lblOf = function (p) { return '<text x="' + p.x.toFixed(1) + '" y="' + (p.y - 16).toFixed(1) + '" text-anchor="middle" class="line-chart-value' + (isPtB(p) ? ' is-b' : '') + '">' + (opts.fmt ? opts.fmt(p.v) : p.v) + '</text>'; };
  const lastLabel = opts.labelAll ? points.map(lblOf).join('') : (lastPt ? lblOf(lastPt) : '');
  const yTicks = yAxisTicks(min, max, top, bottom, opts.fmt);
  const xTicks = xAxisTickLabels(opts.labels, xAt, n);
  return grid + zeroLine + (areaPath ? '<path d="' + areaPath + '" class="line-chart-glow"/>' : '') + (path ? '<path d="' + path + '" class="line-chart-line"/>' : '') + dots + lastLabel + yTicks + xTicks + axisTitle;
}

// Deux lignes superposées, chacune avec sa propre échelle normalisée (utile pour comparer deux métriques d'unités différentes, ex : % et mètres)
function svgDualLineChart(valuesA, valuesB, opts) {
  opts = opts || {};
  const left = 40, right = 890, top = 20, bottom = 420;
  function scaleOf(values, forceZeroMin) {
    const vals = values.filter(function (v) { return v != null && !isNaN(v); });
    if (!vals.length) return null;
    let min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
    if (forceZeroMin) min = Math.min(0, min);
    if (min === max) { min -= 1; max += 1; }
    const pad = (max - min) * 0.12;
    return { min: min - pad, max: max + pad };
  }
  const scaleA = scaleOf(valuesA, opts.forceZeroMinA);
  const scaleB = scaleOf(valuesB, opts.forceZeroMinB);
  const axisTitle = '<text x="465" y="505" text-anchor="middle" class="line-chart-axis-title">' + (opts.axisTitle || 'Rounds') + '</text>';
  let grid = [0.2, 0.4, 0.6, 0.8].map(function (f) {
    const y = top + f * (bottom - top);
    return '<line x1="' + left + '" y1="' + y.toFixed(1) + '" x2="' + right + '" y2="' + y.toFixed(1) + '" class="line-chart-grid"/>';
  }).join('') + '<line x1="' + left + '" y1="' + bottom + '" x2="' + right + '" y2="' + bottom + '" class="line-chart-grid-solid"/>';
  if (!scaleA && !scaleB) {
    return grid + '<text x="465" y="240" text-anchor="middle" class="line-chart-axis-label">Pas encore de données</text>' + axisTitle;
  }
  const n = Math.max(valuesA.length, valuesB.length);
  const stepX = n > 1 ? (right - left) / (n - 1) : 0;
  function xAt(i) { return n > 1 ? left + i * stepX : (left + right) / 2; }
  function drawSeries(values, scale, cls, fmt) {
    if (!scale) return '';
    function yAt(v) { return bottom - ((v - scale.min) / (scale.max - scale.min)) * (bottom - top); }
    let path = '', points = [];
    values.forEach(function (v, i) {
      if (v == null || isNaN(v)) return;
      const x = xAt(i), y = yAt(v);
      path += (points.length ? ' L ' : 'M ') + x.toFixed(1) + ' ' + y.toFixed(1);
      points.push({ x: x, y: y, v: v });
    });
    const dots = points.map(function (p) { return '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="6" class="line-chart-point ' + cls + '"/>'; }).join('');
    const lastPt = points[points.length - 1];
    const lblOf = function (p) { return '<text x="' + p.x.toFixed(1) + '" y="' + (p.y - 16).toFixed(1) + '" text-anchor="middle" class="line-chart-value ' + cls + '">' + (fmt ? fmt(p.v) : p.v) + '</text>'; };
    const lastLabel = opts.labelAll ? points.map(lblOf).join('') : (lastPt ? lblOf(lastPt) : '');
    return (path ? '<path d="' + path + '" class="line-chart-line ' + cls + '"/>' : '') + dots + lastLabel;
  }
  // Axe de gauche = série A, axe de droite = série B (2 unités différentes, ex: % et mètres)
  const yTicksA = scaleA ? yAxisTicks(scaleA.min, scaleA.max, top, bottom, opts.fmtA, '') : '';
  const yTicksB = scaleB ? yAxisTicks(scaleB.min, scaleB.max, top, bottom, opts.fmtB, 'is-b') : '';
  const xTicks = xAxisTickLabels(opts.labels, xAt, n);
  return grid + drawSeries(valuesA, scaleA, '', opts.fmtA) + drawSeries(valuesB, scaleB, 'is-b', opts.fmtB) + yTicksA + yTicksB + xTicks + axisTitle;
}

// Barres groupées à deux séries sur une échelle commune (compte de trous par round, ex : 1 putt vs 3 putts)
function svgDualColumnChart(valuesA, valuesB, opts) {
  opts = opts || {};
  const left = 40, right = 890, top = 20, bottom = 420;
  const axisTitle = '<text x="465" y="505" text-anchor="middle" class="line-chart-axis-title">' + (opts.axisTitle || 'Rounds') + '</text>';
  let grid = [0.2, 0.4, 0.6, 0.8].map(function (f) {
    const y = top + f * (bottom - top);
    return '<line x1="' + left + '" y1="' + y.toFixed(1) + '" x2="' + right + '" y2="' + y.toFixed(1) + '" class="line-chart-grid"/>';
  }).join('') + '<line x1="' + left + '" y1="' + bottom + '" x2="' + right + '" y2="' + bottom + '" class="line-chart-grid-solid"/>';
  const allVals = valuesA.concat(valuesB).filter(function (v) { return v != null && !isNaN(v); });
  if (!allVals.length) {
    return grid + '<text x="465" y="240" text-anchor="middle" class="line-chart-axis-label">Pas encore de données</text>' + axisTitle;
  }
  const max = Math.max.apply(null, allVals.concat([1]));
  const n = Math.max(valuesA.length, valuesB.length);
  const slot = (right - left) / n;
  const barW = Math.min(20, slot * 0.28);
  const gap = Math.min(4, slot * 0.06);
  let bars = '';
  function xAt(i) { return left + slot * (i + 0.5); }
  for (let i = 0; i < n; i++) {
    const cx = xAt(i);
    const vA = valuesA[i], vB = valuesB[i];
    if (vA != null && !isNaN(vA)) {
      const h = Math.max(2, (vA / max) * (bottom - top));
      const y = bottom - h;
      const x = cx - gap / 2 - barW;
      bars += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="4" class="line-chart-bar"/>';
      if (opts.labelAll || i === n - 1) bars += '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (y - 12).toFixed(1) + '" text-anchor="middle" class="line-chart-value">' + vA + '</text>';
    }
    if (vB != null && !isNaN(vB)) {
      const h = Math.max(2, (vB / max) * (bottom - top));
      const y = bottom - h;
      const x = cx + gap / 2;
      bars += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="4" class="line-chart-bar is-b"/>';
      if (opts.labelAll || i === n - 1) bars += '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (y - 12).toFixed(1) + '" text-anchor="middle" class="line-chart-value is-b">' + vB + '</text>';
    }
  }
  const yTicks = yAxisTicks(0, max, top, bottom, null);
  const xTicks = xAxisTickLabels(opts.labels, xAt, n);
  return grid + bars + yTicks + xTicks + axisTitle;
}

/* ---------- Fonctions de rendu : branchent les vraies données sur l'UI existante ---------- */

function renderHomeStats() {
  const sgEl = document.getElementById('home-sg-value');
  if (!sgEl) return;
  let sum = 0, n = 0, made1 = 0, total = 0;
  puttingRounds.forEach(function (r) {
    (r.holes || []).forEach(function (h) {
      if (h.putts == null) return;
      total++;
      if (h.putts === 1) made1++;
      if (h.m != null) { const sg = puttSG(h.m, h.putts); if (sg != null) { sum += sg; n++; } }
    });
  });
  sgEl.textContent = n ? fmtSG(sum / n) : '--';
  const oneEl = document.getElementById('home-oneputt-value');
  if (oneEl) oneEl.textContent = total ? fmtPct((made1 / total) * 100) : '--';
}

// Séances "Exercices" = exercices créés (puttingSessions) + exercices rapides (puttingRounds, source 'quick')
function exerciseActivityDates() {
  const dates = puttingSessions.map(function (s) { return s.dateISO; });
  puttingRounds.forEach(function (r) { if (r.source === 'quick') dates.push(r.dateISO); });
  return dates.filter(Boolean);
}

function renderExercicesStats() {
  const sessEl = document.getElementById('exo-sessions-value');
  if (!sessEl) return;
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const thisWeek = exerciseActivityDates().filter(function (d) { return (now - new Date(d).getTime()) <= weekMs; }).length;
  sessEl.textContent = thisWeek;
  let made = 0, total = 0;
  puttingSessions.forEach(function (s) {
    (s.holes || []).forEach(function (h) {
      (h.results || []).forEach(function (r) { total++; if (r === 'made') made++; });
    });
  });
  puttingRounds.forEach(function (r) {
    if (r.source !== 'quick') return;
    (r.holes || []).forEach(function (h) {
      if (h.putts == null) return;
      total++;
      if (h.putts === 1) made++;
    });
  });
  const rateEl = document.getElementById('exo-rate-value');
  if (rateEl) rateEl.textContent = total ? fmtPct((made / total) * 100) : '--';
}

/* ============================================================
   ACCUEIL GÉNÉRAL (page-home) : encadrés [data-stat]
   Alimentés par l'activité putting : parcours + exercices rapides + exercices créés.
   Distance moyenne et Index ne dépendent pas du putting : non touchés ici.
   ============================================================ */
const GOLF_WEEKLY_GOAL = 5; // séances par semaine
const RING_CIRCUMFERENCE = 2 * Math.PI * 9; // r=9 dans le SVG de l'accueil

function allActivityDates() {
  return puttingSessions.map(function (s) { return s.dateISO; })
    .concat(puttingRounds.map(function (r) { return r.dateISO; }))
    .filter(Boolean);
}

function relativeDayLabel(iso) {
  const d = new Date(iso);
  const today = new Date();
  const dayDiff = Math.round((new Date(today.getFullYear(), today.getMonth(), today.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000);
  if (dayDiff <= 0) return "Aujourd'hui";
  if (dayDiff === 1) return 'Hier';
  if (dayDiff < 7) return 'Il y a ' + dayDiff + ' j';
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

function renderGolfHome() {
  const q = function (name) { return document.querySelector('#page-home [data-stat="' + name + '"]'); };
  const dates = allActivityDates();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const count = dates.filter(function (d) { return (now - new Date(d).getTime()) <= weekMs; }).length;
  const ratio = Math.min(1, count / GOLF_WEEKLY_GOAL);

  const ring = q('goal-ring');
  if (ring) ring.textContent = count + '/' + GOLF_WEEKLY_GOAL;
  const val = q('goal-value');
  if (val) val.textContent = count + (count > 1 ? ' séances' : ' séance');
  const fill = q('goal-progress-fill');
  if (fill) fill.style.width = Math.round(ratio * 100) + '%';
  const arc = document.querySelector('#page-home .progress-ring_progress');
  if (arc) {
    arc.setAttribute('data-progress', String(ratio));
    arc.style.strokeDasharray = RING_CIRCUMFERENCE;
    arc.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - ratio);
  }

  const lastVal = q('last-session-value');
  const lastSec = q('last-session-secondary');
  if (dates.length) {
    const lastISO = dates.slice().sort().pop();
    // Une partie saisie dans Stats (source 'stats') est une partie sur le parcours, pas du putting
    const lastIsStatsRound = puttingRounds.some(function (r) { return r.dateISO === lastISO && r.source === 'stats'; })
      && !puttingSessions.some(function (s) { return s.dateISO === lastISO; });
    if (lastVal) lastVal.textContent = relativeDayLabel(lastISO);
    if (lastSec) lastSec.textContent = lastIsStatsRound ? 'Parcours' : 'Putting';
  } else {
    if (lastVal) lastVal.textContent = '--';
    if (lastSec) lastSec.textContent = '';
  }
}

function computeBucketStats(holes, bucketIndexFn, bucketCount) {
  const rows = Array.from({ length: bucketCount }, function () { return { sgSum: 0, sgCount: 0, made1: 0, total: 0, speedErr: 0, slopeErr: 0, errTotal: 0 }; });
  const all = { sgSum: 0, sgCount: 0, made1: 0, total: 0, speedErr: 0, slopeErr: 0, errTotal: 0 };
  holes.forEach(function (h) {
    const idx = bucketIndexFn(h);
    if (idx == null) return;
    const sg = puttSG(h.m, h.putts);
    [rows[idx], all].forEach(function (acc) {
      acc.total++;
      if (h.putts === 1) acc.made1++;
      if (sg != null) { acc.sgSum += sg; acc.sgCount++; }
      if (h.resultat && h.resultat !== 'made') {
        acc.errTotal++;
        if (h.resultat.indexOf('court') !== -1 || h.resultat.indexOf('long') !== -1) acc.speedErr++;
        if (h.resultat.indexOf('gauche') !== -1 || h.resultat.indexOf('droite') !== -1) acc.slopeErr++;
      }
    });
  });
  return { all: all, rows: rows };
}

/* ---------- Mode comparaison : session A (vert) vs session B (bleu) dans le même graphe ---------- */
function getCompareRounds(group) {
  const st = filterState[group];
  if (!st.compareA || !st.compareB) return null;
  const A = puttingRounds.find(function (r) { return r.id === st.compareA; });
  const B = puttingRounds.find(function (r) { return r.id === st.compareB; });
  return (A && B) ? { A: A, B: B } : null;
}
function roundHoles(r) { return (r.holes || []).filter(function (h) { return h.putts != null; }); }

// Les barres statiques de l'HTML sont mémorisées, puis restaurées quand on quitte la comparaison
function cmpReset(container) {
  if (container && container._origHTML !== undefined) {
    container.innerHTML = container._origHTML;
    container._origHTML = undefined;
    container.classList.remove('is-compare');
  }
}
function cmpBuildRows(container, barsForRow) {
  if (!container) return;
  if (container._origHTML === undefined) container._origHTML = container.innerHTML;
  const tmp = document.createElement('div');
  tmp.innerHTML = container._origHTML;
  const labels = Array.from(tmp.querySelectorAll('.bar-chart_row .bar-chart_label')).map(function (el) { return el.innerHTML; });
  tmp.querySelectorAll('.bar-chart_row').forEach(function (r) { r.remove(); });
  const rows = labels.map(function (lab, i) {
    return '<div class="bar-chart_row"><div class="bar-chart_label">' + lab + '</div><div class="bar-chart_bar-wrap-dual">' + barsForRow(i) + '</div></div>';
  }).join('');
  container.classList.add('is-compare');
  container.innerHTML = rows + tmp.innerHTML;
}
function cmpBar(v, cls, fmt) {
  const w = v == null ? 0 : Math.max(2, Math.min(100, v));
  return '<div class="bar-chart_bar-wrap"><div class="bar-chart_fill ' + cls + '" style="width:' + w + '%;"></div><div class="bar-chart_value">' + (v == null ? '--' : fmt(v)) + '</div></div>';
}
function cmpCenteredBar(v, cls, fmt, max) {
  let w = 0, left = 50;
  if (v != null) { w = Math.min(50, (Math.abs(v) / max) * 50); left = v >= 0 ? 50 : 50 - w; }
  return '<div class="bar-chart_bar-wrap bar-chart_bar-wrap-centered"><div class="bar-chart_center-line"></div>' +
    '<div class="bar-chart_fill bar-chart_fill-centered ' + cls + '" style="width:' + w + '%;left:' + left + '%;"></div>' +
    '<div class="bar-chart_value">' + (v == null ? '--' : fmt(v)) + '</div></div>';
}

function renderAnalyseDistance() {
  const sgChart = document.getElementById('distance-sg-chart');
  if (!sgChart) return;
  refreshParcoursFilterOptions();
  const rateChart = document.getElementById('distance-rate-chart');
  const errChart = document.getElementById('distance-error-chart');
  const rowsOf = function (holes) {
    const st = computeBucketStats(holes, function (h) { return distanceBucketIndex(h.m); }, 5);
    return [st.all].concat(st.rows);
  };
  const sgOf = function (r) { return r.sgCount ? r.sgSum / r.sgCount : null; };
  const rateOf = function (r) { return r.total ? (r.made1 / r.total) * 100 : null; };
  const speedOf = function (r) { return r.errTotal ? (r.speedErr / r.errTotal) * 100 : null; };
  const slopeOf = function (r) { return r.errTotal ? (r.slopeErr / r.errTotal) * 100 : null; };
  const cmp = getCompareRounds('distance');
  if (cmp) {
    const A = rowsOf(roundHoles(cmp.A)), B = rowsOf(roundHoles(cmp.B));
    const sgA = A.map(sgOf), sgB = B.map(sgOf);
    const max = Math.max.apply(null, [0.3].concat(sgA.concat(sgB).filter(function (v) { return v != null; }).map(Math.abs)));
    cmpBuildRows(sgChart, function (i) { return cmpCenteredBar(sgA[i], '', fmtSG, max) + cmpCenteredBar(sgB[i], 'is-b', fmtSG, max); });
    const rA = A.map(rateOf), rB = B.map(rateOf);
    cmpBuildRows(rateChart, function (i) { return cmpBar(rA[i], '', fmtPct) + cmpBar(rB[i], 'is-b', fmtPct); });
    const vA = A.map(speedOf), vB = B.map(speedOf), pA = A.map(slopeOf), pB = B.map(slopeOf);
    const fV = function (v) { return 'V ' + Math.round(v) + '%'; }, fP = function (v) { return 'P ' + Math.round(v) + '%'; };
    cmpBuildRows(errChart, function (i) {
      return cmpBar(vA[i], '', fV) + cmpBar(vB[i], 'is-b', fV) + cmpBar(pA[i], '', fP) + cmpBar(pB[i], 'is-b', fP);
    });
  } else {
    const order = rowsOf(getFilteredHoles('distance'));
    fillCenteredBarChart(sgChart, order.map(sgOf), fmtSG, 0.3);
    fillBarChart(rateChart, order.map(rateOf), fmtPct);
    fillDualBarChart(errChart, order.map(speedOf), order.map(slopeOf));
  }
  renderCompareCard('distance');
}

function renderAnalysePente() {
  const sgRadar = document.getElementById('pente-sg-radar');
  if (!sgRadar) return;
  refreshParcoursFilterOptions();
  const valsOf = function (holes) {
    const st = computeBucketStats(holes, function (h) { return penteCategoryIndex(h.clock); }, 8);
    return {
      sg: st.rows.map(function (r) { return r.sgCount ? r.sgSum / r.sgCount : null; }),
      rate: st.rows.map(function (r) { return r.total ? (r.made1 / r.total) * 100 : null; }),
    };
  };
  const cmp = getCompareRounds('pente');
  const A = valsOf(cmp ? roundHoles(cmp.A) : getFilteredHoles('pente'));
  const B = cmp ? valsOf(roundHoles(cmp.B)) : null;
  sgRadar.innerHTML = svgRadarChart(A.sg, PENTE_LABELS, { centered: true, scaleMax: 0.3, fmt: fmtSG, valuesB: B ? B.sg : null });
  const rateRadar = document.getElementById('pente-rate-radar');
  if (rateRadar) rateRadar.innerHTML = svgRadarChart(A.rate, PENTE_LABELS, { fmt: fmtPct, valuesB: B ? B.rate : null });
  renderCompareCard('pente');
}

function renderStatsPerformance() {
  const svgSG = document.getElementById('stats-sg-line');
  if (!svgSG) return;
  refreshParcoursFilterOptions();
  const cmp = getCompareRounds('stats');
  const rounds = cmp ? [cmp.A, cmp.B] : getFilteredRounds('stats');
  const cmpOpts = cmp ? { labelAll: true } : {};
  // Le filtre Distance s'applique aussi ici : tout est recalculé depuis les trous filtrés de chaque round
  const distIdx = { '0-2': 0, '2-3': 1, '3-5': 2, '5-9': 3, '9+': 4 }[filterState.stats.distance];
  const holesOf = function (r) {
    return (r.holes || []).filter(function (h) {
      return h.putts != null && (distIdx === undefined || distanceBucketIndex(h.m) === distIdx);
    });
  };
  const perRound = rounds.map(function (r) { return holesOf(r); });
  const sgVals = perRound.map(function (holes) {
    let sum = 0, n = 0;
    holes.forEach(function (h) { const sg = puttSG(h.m, h.putts); if (sg != null) { sum += sg; n++; } });
    return n ? sum / n : null;
  });
  const rateVals = perRound.map(function (holes) {
    if (!holes.length) return null;
    return (holes.filter(function (h) { return h.putts === 1; }).length / holes.length) * 100;
  });
  const oneVals = perRound.map(function (holes) {
    return holes.length ? holes.filter(function (h) { return h.putts === 1; }).length : null;
  });
  const threeVals = perRound.map(function (holes) {
    return holes.length ? holes.filter(function (h) { return h.putts >= 3; }).length : null;
  });
  const meterVals = perRound.map(function (holes) {
    return holes.length ? holes.reduce(function (sum, h) { return sum + distanceForTotal(h.putts, h.m); }, 0) || null : null;
  });
  const dateLabels = rounds.map(function (r, i) { return (cmp ? (i ? 'B · ' : 'A · ') : '') + new Date(r.dateISO).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }); });

  svgSG.innerHTML = svgLineChart(sgVals, Object.assign({ centered: true, fmt: fmtSG, axisTitle: cmp ? 'Sessions comparées' : 'Rounds', labels: dateLabels }, cmpOpts));
  const rateMeterEl = document.getElementById('stats-rate-meters-line');
  if (rateMeterEl) rateMeterEl.innerHTML = svgDualLineChart(rateVals, meterVals, Object.assign({
    forceZeroMinA: true, forceZeroMinB: true,
    fmtA: fmtPct, fmtB: function (v) { return Math.round(v) + 'm'; },
    axisTitle: cmp ? 'Sessions comparées' : 'Rounds', labels: dateLabels,
  }, cmpOpts));
  const puttsEl = document.getElementById('stats-putts-bars');
  if (puttsEl) puttsEl.innerHTML = svgDualColumnChart(oneVals, threeVals, Object.assign({ axisTitle: cmp ? 'Sessions comparées' : 'Rounds', labels: dateLabels }, cmpOpts));
  renderCompareCard('stats');
}

function refreshAllAnalytics() {
  renderParcoursHistory();
  renderGolfHome();
  renderHomeStats();
  renderExercicesStats();
  renderAnalyseDistance();
  renderAnalysePente();
  renderStatsPerformance();
}

let filterSheetOpenFor = null; // { group, type }

function openFilterSheet(event, group, type) {
  event.preventDefault();
  event.stopPropagation();
  if (type === 'parcours') refreshParcoursFilterOptions();
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
  if (group === 'distance') renderAnalyseDistance();
  if (group === 'pente') renderAnalysePente();
  if (group === 'stats') renderStatsPerformance();
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
  renderCompareGroup(group);
}

function resetCompareSelection(group) {
  filterState[group].compareA = null;
  filterState[group].compareB = null;
  confirmCompareSelection(group);
}

function renderCompareGroup(group) {
  if (group === 'distance') renderAnalyseDistance();
  else if (group === 'pente') renderAnalysePente();
  else if (group === 'stats') renderStatsPerformance();
}

// Carte de comparaison : affiche côte à côte les stats de 2 séances (Parcours ou
// Exercice rapide, désormais unifiés dans puttingRounds) sélectionnées via le filtre "Comparer"
function renderCompareCard(group) {
  const el = document.getElementById('compare-card-' + group);
  if (!el) return;
  const s = filterState[group];
  if (!s.compareA || !s.compareB) { el.classList.add('is-hidden'); el.innerHTML = ''; return; }
  const rA = puttingRounds.find(function (r) { return r.id === s.compareA; });
  const rB = puttingRounds.find(function (r) { return r.id === s.compareB; });
  if (!rA || !rB) { el.classList.add('is-hidden'); el.innerHTML = ''; return; }
  const statsA = parcoursSessionStats(rA.holes || []);
  const statsB = parcoursSessionStats(rB.holes || []);
  const dateOf = function (r) { return new Date(r.dateISO).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }); };
  const rows = [
    ['SG Putting', fmtSG(statsA.sgAvg), fmtSG(statsB.sgAvg)],
    ['1 putt', fmtPct(statsA.rate), fmtPct(statsB.rate)],
    ['Moy. putts', statsA.avgPutts == null ? '--' : statsA.avgPutts.toFixed(1), statsB.avgPutts == null ? '--' : statsB.avgPutts.toFixed(1)],
    ['Putts totaux', String(statsA.putts), String(statsB.putts)],
  ];
  el.classList.remove('is-hidden');
  el.innerHTML =
    '<div class="chart-card_header">' +
      '<div class="chart-card_title">Comparaison</div>' +
      '<button type="button" class="compare-card_reset" onclick="resetCompareSelection(\'' + group + '\')">Effacer</button>' +
    '</div>' +
    '<div class="compare-table">' +
      '<div class="compare-table_row compare-table_head"><span></span><span><i class="cmp-dot"></i>' + appEscapeHtml(rA.name) + '<br><small>' + dateOf(rA) + '</small></span><span><i class="cmp-dot is-b"></i>' + appEscapeHtml(rB.name) + '<br><small>' + dateOf(rB) + '</small></span></div>' +
      rows.map(function (row) { return '<div class="compare-table_row"><span>' + row[0] + '</span><span>' + row[1] + '</span><span>' + row[2] + '</span></div>'; }).join('') +
    '</div>';
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
    if (!puttingRounds.length) {
      optionsHtml = '<div class="filter-sheet_empty">Aucune séance disponible pour le moment.</div>';
    } else {
      const resetBtn = '<button class="filter-sheet_option' + (!s.compareA && !s.compareB ? ' is-selected' : '') + '" onclick="resetCompareSelection(\'' + group + '\')">' +
        '<span>Aucune comparaison</span>' +
        '<svg class="filter-sheet_check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>' +
        '</button>';
      optionsHtml = resetBtn + puttingRounds.slice().reverse().map(function (round) {
        const isChecked = s.compareA === round.id || s.compareB === round.id;
        const dateLabel = new Date(round.dateISO).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
        const label = round.name + ' — ' + dateLabel;
        return '<button class="filter-sheet_option' + (isChecked ? ' is-selected' : '') + '" onclick="toggleCompareSession(\'' + group + '\', ' + round.id + ')">' +
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

function savePuttingState() {
  // Stockage plein ou indisponible : appSafeSetItem (commun.js) prévient la personne.
  const persistable = puttingCombines.filter(function (c) { return !c.isQuick; });
  appSafeSetItem('putting_combines', JSON.stringify(persistable));
  appSafeSetItem('putting_sessions', JSON.stringify(puttingSessions));
  appSafeSetItem('putting_rounds', JSON.stringify(puttingRounds));
  refreshAllAnalytics();
}

function loadPuttingState() {
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
loadPuttingState();

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
  appSafeSetItem('putting_resume', JSON.stringify(resumableSession));
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
  puttingQueryAll('.resume-card').forEach(function (card) {
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
const EXERCISE_ICONS = {
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  duplicate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 20V10M12 20V4M19 20v-7"/></svg>'
};
function renderExerciseList() {
  const listRoot = document.getElementById('exercise-list-root');
  if (!listRoot) return;

  const sorted = puttingCombines.filter(function (c) { return !c.isQuick; });
  if (!sorted.length) {
    listRoot.innerHTML = '<p class="exercise-empty">Aucun exercice pour le moment.</p>';
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
    const rate = last ? combineMakeRate(last) : null;
    const isSelected = selectedCombineId === c.id;
    const inProgress = !!resumableSession && resumableSession.combineId === c.id;
    const rounds = combineRounds(c);
    const formatLabel = c.puttMin + 'm → ' + c.puttMax + 'm — ' + c.holesCount + ' trous'
      + (rounds > 1 ? ' — ' + rounds + ' tours' : '')
      + ' — ' + c.attempts + (c.attempts > 1 ? ' tentatives' : ' tentative') + '/trou'
      + (c.slopedGreen === false ? ' — green plat' : '');
    const lastLine = last
      ? 'Dernière session : ' + last.dateLabel + (rate && rate.total ? ' — ' + rate.made + '/' + rate.total + ' réussis (' + rate.pct + '%)' : '')
      : '';

    return `
      <div class="exercise-card ${isSelected ? 'is-selected' : ''}" onclick="toggleExerciseSelect(${c.id})">
        <div class="exercise-card_head">
          <span class="exercise-card_title-wrap">
            <b>${appEscapeHtml(c.name)}</b>
            ${inProgress ? `<span class="exercise-card_badge" onclick="event.stopPropagation();resumeSession()">En cours</span>` : ''}
          </span>
          ${isSelected ? `
            <div class="exercise-card_actions">
              <button type="button" title="Supprimer" onclick="event.stopPropagation();deleteCombine(${c.id})">${EXERCISE_ICONS.close}</button>
              <button type="button" title="Dupliquer" onclick="event.stopPropagation();duplicateCombine(${c.id})">${EXERCISE_ICONS.duplicate}</button>
              <button type="button" title="Modifier" onclick="event.stopPropagation();editCombine(${c.id})">${EXERCISE_ICONS.edit}</button>
              <button type="button" title="Graphe" onclick="event.stopPropagation();reviewCombine(${c.id})">${EXERCISE_ICONS.chart}</button>
            </div>` : `<span class="exercise-card_date">${last ? last.dateLabel : ''}</span>`}
        </div>
        <span class="exercise-card_muted">${formatLabel}</span>
        ${lastLine ? `<div class="exercise-card_muted-sm">${lastLine}</div>` : ''}
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
  if (!bar) return;
  const exoTab = puttingQuery('[data-tab="exercices"]');
  const wrapper = puttingQuery('.putting_wrapper');
  // Visible en permanence sur l'onglet Exercices (hors flux exercice / écran stats)
  const visible = exoTab && exoTab.classList.contains('is-active') && wrapper && !wrapper.classList.contains('is-hidden');
  bar.classList.toggle('is-hidden', !visible);
}

// Lance l'exercice sélectionné dans la liste (comme "Lancer l'exercice" de wedging)
function startSelectedCombine() {
  if (!selectedCombineId) { showToast("Sélectionne d'abord un exercice dans la liste."); return; }
  exerciseFlowOriginTab = 'exercices';
  startCombine(selectedCombineId);
}

function duplicateCombine(id) {
  const c = getCombineById(id);
  if (!c) return;
  const copy = JSON.parse(JSON.stringify(c));
  copy.id = Date.now();
  copy.name = c.name + ' (copie)';
  puttingCombines.push(copy);
  selectedCombineId = copy.id;
  savePuttingState();
  renderExerciseList();
  updateExerciseSelectBar();
}

function deleteCombine(id) {
  if (!confirm('Supprimer cet exercice ?')) return;
  puttingCombines = puttingCombines.filter(function (c) { return c.id !== id; });
  if (selectedCombineId === id) selectedCombineId = null;
  savePuttingState();
  renderExerciseList();
  updateExerciseSelectBar();
}

// ============================================================
// FLUX EXERCICE : session en cours / récap / revoir
// ============================================================

// --- État du flux ---
let exerciseFlowScreen = null; // 'session' | 'recap' | 'review'
let exerciseFlowOriginTab = 'exercices'; // onglet à retrouver au retour ('parcours' | 'exercices')
let exerciseFlowFromStats = false; // true si on est entré dans le flux depuis l'écran Stats Performance
let activeCombineId = null;
let activeSession = null;      // session en cours (non sauvegardée)
let activeHoleIndex = 0;
let viewingSessionId = null;   // session déjà sauvegardée consultée en lecture seule

// Nombre de fois où l'exercice est enchaîné (champ "Tours"), 1 minimum
function combineRounds(c) {
  return Math.max(1, parseInt(c && c.rounds, 10) || 1);
}

function getCombineById(id) {
  return puttingCombines.find(function (c) { return c.id === id; });
}

// --- Entrée / sortie du flux ---
function enterExerciseFlow(title) {
  exerciseFlowFromStats = document.body.classList.contains('is-stats-screen');
  puttingQuery('[data-header="main"]').classList.add('is-hidden');
  puttingQuery('[data-header="stats"]').classList.add('is-hidden');
  puttingQuery('[data-header="exercise-flow"]').classList.remove('is-hidden');
  puttingQuery('.putting_wrapper').classList.add('is-hidden');
  puttingQuery('.stats-wrapper').classList.add('is-hidden');
  document.body.classList.remove('is-stats-screen');
  document.getElementById('exercise-flow-root').classList.remove('is-hidden');
  puttingQueryAll('.fab-group').forEach(function (el) { el.classList.add('is-hidden'); });
  const selectBar = document.getElementById('exercise-select-bar');
  if (selectBar) selectBar.classList.add('is-hidden');
  const navEl = puttingQuery('.bottom-nav');
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
  puttingQuery('[data-header="exercise-flow"]').classList.add('is-hidden');
  document.getElementById('exercise-flow-root').classList.add('is-hidden');
  exerciseFlowScreen = null;
  activeCombineId = null;
  activeSession = null;
  viewingSessionId = null;
  selectedCombineId = null;
  const fromStats = exerciseFlowFromStats;
  exerciseFlowFromStats = false;
  if (fromStats) {
    puttingQuery('[data-header="main"]').classList.add('is-hidden');
    puttingQuery('[data-header="stats"]').classList.remove('is-hidden');
    puttingQuery('.putting_wrapper').classList.add('is-hidden');
    puttingQuery('.stats-wrapper').classList.remove('is-hidden');
    document.body.classList.add('is-stats-screen');
    puttingQueryAll('.fab-group').forEach(function (el) {
      el.classList.toggle('is-hidden', el.dataset.fab !== 'parcours');
    });
    const navEl = puttingQuery('.bottom-nav');
    if (navEl) navEl.classList.remove('is-hidden');
    renderStatsPerformance();
  } else {
    puttingQuery('[data-header="main"]').classList.remove('is-hidden');
    puttingQuery('.putting_wrapper').classList.remove('is-hidden');
    selectPuttingTab({ preventDefault: function () {} }, exerciseFlowOriginTab);
  }
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
    // Les trous de l'exercice sont rejoués "Tours" fois, avec les mêmes distances
    holes: (function () {
      const out = [];
      for (let r = 1; r <= combineRounds(c); r++) {
        c.previewRows.forEach(function (row) {
          out.push({
            hole: row.hole,
            round: r,
            m: row.m,
            clock: c.slopedGreen === false ? null : row.clock, // pas de pente si green plat
            results: [], // 'made' | 'missed', longueur = c.attempts une fois fini
          });
        });
      }
      return out;
    })(),
  };
  exerciseFlowScreen = 'session';
  enterExerciseFlow(c.name);
  renderExerciseFlowScreen();
}

function slopeArrowSvg(clock) {
  const angle = (clock % 12) * 30;
  // Chiffres 1 à 12 autour du cadran (12 en haut), comme dans le popup de pente
  const numbers = Array.from({ length: 12 }, function (_, k) { return k + 1; }).map(function (h) {
    const rad = (h / 12) * 2 * Math.PI;
    const x = (60 + 64 * Math.sin(rad)).toFixed(1);
    const y = (60 - 64 * Math.cos(rad)).toFixed(1);
    return `<text x="${x}" y="${y}" class="slope-visual_num ${Number(clock) === h ? 'is-active' : ''}">${h}</text>`;
  }).join('');
  return `
    <svg class="slope-visual" viewBox="-12 -12 144 144">
      <circle cx="60" cy="60" r="52" class="slope-visual_ring"/>
      <circle cx="60" cy="60" r="30" class="slope-visual_hole"/>
      ${numbers}
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
    const clickable = r ? ` onclick="toggleAttemptResult(${i})"` : '';
    out += `<div class="session-attempt ${cls} ${r ? 'is-editable' : ''}"${clickable}>${i + 1}</div>`;
  }
  return out;
}

// Permet de corriger une tentative déjà enregistrée (trou déjà terminé ou non) en tapant sur son pastille
function toggleAttemptResult(i) {
  const hole = activeSession.holes[activeHoleIndex];
  if (!hole.results[i]) return;
  hole.results[i] = hole.results[i] === 'made' ? 'missed' : 'made';
  renderCombineSessionScreen();
}

function renderExerciseFlowScreen() {
  if (exerciseFlowScreen === 'session') renderCombineSessionScreen();
  else if (exerciseFlowScreen === 'recap') renderCombineRecapScreen();
  else if (exerciseFlowScreen === 'review') renderCombineReviewScreen();
}

function renderCombineSessionScreen() {
  const flowRoot = document.getElementById('exercise-flow-root');
  const c = getCombineById(activeCombineId);
  if (c.isQuick) { renderQuickSessionScreen(); return; }
  const hole = activeSession.holes[activeHoleIndex];
  const totalAttempts = c.attempts;
  const totalRounds = combineRounds(c);
  const doneHoles = activeSession.holes.filter(function (h) { return h.results.length >= totalAttempts; }).length;
  const allDone = doneHoles === activeSession.holes.length;
  const isHoleDone = hole.results.length >= totalAttempts;
  // Tentative visée par les boutons Manqué / Réussi : la prochaine à jouer, ou la dernière si le trou est déjà complet (pour pouvoir la corriger)
  const targetIndex = isHoleDone ? totalAttempts - 1 : hole.results.length;
  const currentResult = hole.results[targetIndex];
  const checkIcon = '<svg class="session-result-btn_check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>';

  flowRoot.innerHTML = `
    <div class="session-progress">
      <div class="session-progress_track"><div class="session-progress_fill" style="width:${Math.round((doneHoles / activeSession.holes.length) * 100)}%"></div></div>
      <div class="session-progress_label">${doneHoles} / ${activeSession.holes.length} trous terminés</div>
    </div>

    <div class="session-hole-card">
      <div class="session-hole-head">
        <span>${totalRounds > 1 ? 'Tour ' + (hole.round || 1) + '/' + totalRounds + ' · ' : ''}Trou ${hole.hole}</span>
        <span>${hole.m} m</span>
      </div>
      ${c.slopedGreen === false ? '' : slopeArrowSvg(hole.clock)}
      ${totalAttempts > 1 ? `<div class="session-attempts">${combineAttemptsHtml(hole, totalAttempts)}</div>` : ''}
      <div class="session-result-buttons">
        <button class="session-result-btn is-missed" onclick="setCombineResult('missed')">${currentResult === 'missed' ? checkIcon : ''}Manqué</button>
        <button class="session-result-btn is-made" onclick="setCombineResult('made')">${currentResult === 'made' ? checkIcon : ''}Réussi</button>
      </div>
    </div>

    <div class="session-holes-nav">
      ${activeSession.holes.map(function (h, i) {
        const isDone = h.results.length >= totalAttempts;
        const state = isDone ? (h.results.indexOf('made') === -1 ? 'is-missed' : 'is-done') : (i === activeHoleIndex ? 'is-active' : '');
        const roundLabel = (totalRounds > 1 && (i === 0 || (activeSession.holes[i - 1].round || 1) !== (h.round || 1)))
          ? `<span class="session-holes-nav_label">Tour ${h.round || 1}</span>` : '';
        return roundLabel + `<button class="session-holes-nav_item ${state}" onclick="goToCombineHole(${i})">${h.hole}</button>`;
      }).join('')}
    </div>

    ${allDone ? `<button class="exercise-modal_save" onclick="finishCombineSession()">Terminer la séance</button>` : ''}
  `;
}

function setCombineResult(result) {
  const c = getCombineById(activeCombineId);
  const hole = activeSession.holes[activeHoleIndex];
  const isHoleDone = hole.results.length >= c.attempts;
  if (isHoleDone) {
    // Trou déjà complet : on corrige la dernière tentative au lieu d'en empiler une nouvelle
    hole.results[c.attempts - 1] = result;
  } else {
    hole.results.push(result);
    if (hole.results.length >= c.attempts && activeHoleIndex < activeSession.holes.length - 1) {
      activeHoleIndex += 1;
    }
  }
  renderCombineSessionScreen();
}

function goToCombineHole(idx) {
  activeHoleIndex = idx;
  renderCombineSessionScreen();
}

/* ---------- Exercice rapide : écran de séance ---------- */

let quickStatsInfoOpen = false;

// Icônes et helper partagés par l'écran Exercice rapide et l'écran Nouveau parcours
const QUICK_ICON_PATHS = {
  pin: '<path d="M12 21s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12z"/><circle cx="12" cy="9" r="2.3"/>',
  flag: '<path d="M6 21V4a1 1 0 0 1 1-1h1v6h5l-3-3"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  bars: '<path d="M5 21V10"/><path d="M12 21V4"/><path d="M19 21v-7"/>',
  distance: '<path d="M4 12h16"/><path d="M4 12l3-3M4 12l3 3M20 12l-3-3M20 12l-3 3"/>',
  slope: '<path d="M4 20h16"/><path d="M4 20L16 6"/>',
  putter: '<path d="M14 3l-5 15"/><path d="M4 21h7l-2-3"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"/>',
};

function quickIcon(cls, paths) {
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

// Images de putt en arrière-plan : une image par catégorie de pente (8 au total)
const QUICK_PUTT_IMAGE_DIR = 'images/'; // dossier ou URL de base des images (avec "/" final)
const QUICK_PUTT_IMAGE_EXT = '.webp';   // extension des fichiers
// Même ordre que PENTE_LABELS : Descente, Descente D→G, D→G, Montée D→G, Montée, Montée G→D, G→D, Descente G→D
const QUICK_PUTT_IMAGE_NAMES = ['GreenPuttP', 'GreenPuttPDG', 'GreenPuttDG', 'GreenPuttMDG', 'GreenPuttM', 'GreenPuttMGD', 'GreenPuttGD', 'GreenPuttPGD'];

const QUICK_PUTT_IMAGE_DEFAULT = 'GreenPuttM'; // image par défaut tant que la pente n'est pas saisie

function quickPuttImageUrl(clock) {
  const idx = penteCategoryIndex(clock);
  const name = idx == null ? QUICK_PUTT_IMAGE_DEFAULT : QUICK_PUTT_IMAGE_NAMES[idx];
  return QUICK_PUTT_IMAGE_DIR + name + QUICK_PUTT_IMAGE_EXT;
}

function toggleQuickStatsInfo() {
  quickStatsInfoOpen = !quickStatsInfoOpen;
  renderQuickSessionScreen();
}

// Passe de 9 à 18 trous (ou l'inverse) en cours d'exercice
function setQuickHolesCount(n) {
  const c = getCombineById(activeCombineId);
  if (!c || c.holesCount === n) return;
  if (n < c.holesCount) {
    const hasResults = activeSession.holes.slice(n).some(function (h) { return h.results.length > 0; });
    if (hasResults && !confirm('Les trous ' + (n + 1) + ' à ' + c.holesCount + ' seront supprimés. Continuer ?')) return;
    c.previewRows = c.previewRows.slice(0, n);
    activeSession.holes = activeSession.holes.slice(0, n);
    if (activeHoleIndex >= n) activeHoleIndex = n - 1;
  } else {
    for (let i = c.holesCount; i < n; i++) {
      const row = randomQuickHole(i);
      c.previewRows.push(row);
      activeSession.holes.push({ hole: row.hole, m: row.m, clock: row.clock, results: [] });
    }
  }
  c.holesCount = n;
  renderCombineSessionScreen();
}

// Sélection explicite du nombre de trous (9 / 18)
function selectQuickHolesCount(n) {
  const c = getCombineById(activeCombineId);
  if (!c) return;
  setQuickHolesCount(n);
}

// Sélection explicite du mode (Rapide / Détaillée)
function selectQuickMode(mode) {
  const c = getCombineById(activeCombineId);
  if (!c || c.entryMode === mode) return;
  c.entryMode = mode;
  renderCombineSessionScreen();
}

// Saisie rapide : Manqué / Réussi
function setQuickResult(result) {
  const hole = activeSession.holes[activeHoleIndex];
  hole.resultat = result === 'made' ? 'made' : null;
  setCombineResult(result);
}

// Saisie détaillée : ouvre la grille 3x3 du résultat du putt
function openQuickResultatPopup() {
  parcoursPopup = { type: 'resultat', target: 'quick' };
  renderParcoursPopup();
}

// Stats de l'exercice rapide : un putt raté compte pour 2 putts (1 putt raté + 1 putt pour finir)
function quickSessionStats(session) {
  let played = 0, made = 0, putts = 0, sg = 0, sgCount = 0;
  session.holes.forEach(function (h) {
    if (!h.results.length) return;
    const isMade = h.results[0] === 'made';
    const holePutts = isMade ? 1 : 2;
    played += 1;
    if (isMade) made += 1;
    putts += holePutts;
    const holeSg = puttSG(h.m, holePutts);
    if (holeSg != null) { sg += holeSg; sgCount += 1; }
  });
  return {
    played: played,
    made: made,
    putts: putts,
    avgPutts: played ? putts / played : null,
    sgAvg: sgCount ? sg / sgCount : null,
    rate: played ? (made / played) * 100 : null,
  };
}

function renderQuickSessionScreen() {
  const flowRoot = document.getElementById('exercise-flow-root');
  const c = getCombineById(activeCombineId);
  const holes = activeSession.holes;
  const hole = holes[activeHoleIndex];
  const totalAttempts = c.attempts;
  const doneHoles = holes.filter(function (h) { return h.results.length >= totalAttempts; }).length;
  const allDone = doneHoles === holes.length;
  const isHoleDone = hole.results.length >= totalAttempts;
  // Tentative visée par Manqué / Réussi : la prochaine à jouer, ou la dernière si le trou est déjà complet
  const targetIndex = isHoleDone ? totalAttempts - 1 : hole.results.length;
  const currentResult = hole.results[targetIndex];
  const st = quickSessionStats(activeSession);

  const esc = appEscapeHtml;
  const icon = quickIcon;
  const { pin: pinPaths, flag: flagPaths, star: starPaths, bars: barsPaths, distance: distancePaths, slope: slopePaths, putter: putterPaths, target: targetPaths, trophy: trophyPaths } = QUICK_ICON_PATHS;
  const isDetail = c.entryMode === 'complete';
  const resultatLabelText = hole.resultat ? resultatLabel(hole.resultat) : (currentResult === 'missed' ? 'Manqué' : 'Résultat du putt');

  const penteIdx = penteCategoryIndex(hole.clock);
  const penteLabel = penteIdx == null ? '' : PENTE_LABELS[penteIdx];
  const puttImage = quickPuttImageUrl(hole.clock);
  const sgClass = st.sgAvg == null ? '' : (st.sgAvg >= 0 ? 'is-accent' : 'is-negative');

  flowRoot.innerHTML = `
    <div class="quick-session">

      <div class="quick-session_bar">
        <button type="button" class="quick-session_bar-item quick-session_bar-button is-wide" onclick="editSessionField('location','Lieu')">
          ${icon('quick-session_bar-icon', pinPaths)}
          <div class="quick-session_bar-text">
            <span class="quick-session_bar-label">Lieu</span>
            <span class="quick-session_bar-value">${esc(activeSession.location || 'Non renseigné')}</span>
          </div>
        </button>
        <div class="quick-session_bar-divider"></div>
        <div class="quick-session_bar-item">
          ${icon('quick-session_bar-icon', flagPaths)}
          <div class="quick-session_bar-text">
            <span class="quick-session_bar-label">Trou</span>
            <span class="quick-session_bar-value">${activeHoleIndex + 1} / ${holes.length}</span>
          </div>
        </div>
        <div class="quick-session_bar-divider"></div>
        <div class="quick-session_bar-item">
          ${icon('quick-session_bar-icon', starPaths)}
          <div class="quick-session_bar-text">
            <span class="quick-session_bar-label">Score</span>
            <span class="quick-session_bar-value is-accent">${st.played ? st.made + ' / ' + st.played : '--'}</span>
          </div>
        </div>
        <div class="quick-session_bar-divider"></div>
        <div class="quick-session_bar-item">
          ${icon('quick-session_bar-icon', barsPaths)}
          <div class="quick-session_bar-text">
            <span class="quick-session_bar-label">SG</span>
            <span class="quick-session_bar-value ${sgClass}">${fmtSG(st.sgAvg)}</span>
          </div>
        </div>
      </div>

      <div class="quick-session_card">
        <div class="quick-session_main">
          <div class="quick-session_info">
            <div class="quick-session_hole">
              <div class="quick-session_badge">${hole.hole}</div>
              <div class="quick-session_hole-text">
                <div class="quick-session_hole-title">Trou ${hole.hole}</div>
              </div>
            </div>
            <div class="quick-session_metrics">
              <div class="quick-session_metric">
                ${icon('quick-session_metric-icon', slopePaths)}
                <div class="quick-session_metric-text">
                  <span class="quick-session_metric-label">Pente</span>
                  <span class="quick-session_metric-value">${hole.clock}h</span>
                  <span class="quick-session_metric-note">${penteLabel}</span>
                </div>
              </div>
              <div class="quick-session_metric">
                ${icon('quick-session_metric-icon', distancePaths)}
                <div class="quick-session_metric-text">
                  <span class="quick-session_metric-label">Distance</span>
                  <span class="quick-session_metric-value">${hole.m} m</span>
                </div>
              </div>
            </div>
          </div>

          <div class="quick-session_panels">
            <button type="button" class="quick-session_panel is-toggle" onclick="selectQuickMode('${isDetail ? 'express' : 'complete'}')">
              <span class="quick-session_radio is-active"><span class="quick-session_radio-dot"></span>${isDetail ? 'Détaillée' : 'Rapide'}</span>
            </button>
            <button type="button" class="quick-session_panel is-toggle" onclick="selectQuickHolesCount(${holes.length === 9 ? 18 : 9})">
              <span class="quick-session_radio is-active"><span class="quick-session_radio-dot"></span>${holes.length} trous</span>
            </button>
          </div>

        </div>

        <div class="quick-session_bg"><img class="quick-session_bg-img" src="${puttImage}" alt=""></div>

        <div class="session-result-buttons">
          ${isDetail ? `
          <button class="session-result-btn is-detail ${currentResult ? 'is-selected' : ''}" onclick="openQuickResultatPopup()">
            <span class="quick-session_btn-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${targetPaths}</svg></span>${esc(resultatLabelText)}
          </button>
          ` : `
          <button class="session-result-btn is-missed ${currentResult === 'missed' ? 'is-selected' : ''}" onclick="setQuickResult('missed')">
            <span class="quick-session_btn-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M8 8l8 8M16 8l-8 8"/></svg></span>Manqué
          </button>
          <button class="session-result-btn is-made ${currentResult === 'made' ? 'is-selected' : ''}" onclick="setQuickResult('made')">
            <span class="quick-session_btn-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></span>Réussi
          </button>
          `}
        </div>
      </div>

      <div class="quick-session_holes">
        ${holes.map(function (h, i) {
          const isDone = h.results.length >= totalAttempts;
          const state = (isDone ? (h.results.indexOf('made') === -1 ? 'is-missed' : 'is-done') : '') + (i === activeHoleIndex ? ' is-active' : '');
          return `<button type="button" class="quick-session_hole-btn ${state}" onclick="goToCombineHole(${i})">
            <span class="quick-session_hole-num">${h.hole}</span>
            <span class="quick-session_hole-dist">${h.m} m</span>
          </button>`;
        }).join('')}
      </div>

      <div class="quick-session_bar">
        <div class="quick-session_bar-item">
          ${icon('quick-session_bar-icon', putterPaths)}
          <div class="quick-session_bar-text">
            <span class="quick-session_bar-label">Moy. putts</span>
            <span class="quick-session_bar-value">${st.avgPutts == null ? '--' : st.avgPutts.toFixed(1)}</span>
          </div>
          <button type="button" class="quick-session_info-btn ${quickStatsInfoOpen ? 'is-active' : ''}" onclick="toggleQuickStatsInfo()" aria-label="Explication">i</button>
        </div>
        <div class="quick-session_bar-divider"></div>
        <div class="quick-session_bar-item">
          ${icon('quick-session_bar-icon', targetPaths)}
          <div class="quick-session_bar-text">
            <span class="quick-session_bar-label">Putts totaux</span>
            <span class="quick-session_bar-value">${st.putts}</span>
          </div>
        </div>
        <div class="quick-session_bar-divider"></div>
        <div class="quick-session_bar-item">
          ${icon('quick-session_bar-icon', trophyPaths)}
          <div class="quick-session_bar-text">
            <span class="quick-session_bar-label">Taux de réussite</span>
            <span class="quick-session_bar-value">${fmtPct(st.rate)}</span>
            <div class="quick-session_track"><div class="quick-session_track-fill" style="width:${st.rate == null ? 0 : Math.round(st.rate)}%"></div></div>
          </div>
        </div>
      </div>

      ${quickStatsInfoOpen ? `<div class="mini-popup_info-text">Un putt raté compte pour 2 putts (le putt raté et le putt pour finir). Cette règle s'applique à la moyenne, au total et au Strokes Gained.</div>` : ''}

      ${allDone ? `<button class="exercise-modal_save" onclick="finishCombineSession()">Terminer la séance</button>` : ''}
    </div>
  `;
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
  if (viewingSessionId) savePuttingState();
  renderExerciseFlowScreen();
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
            <span>${h.hole}${combine && combineRounds(combine) > 1 ? `<small class="recap-table_round">T${h.round || 1}</small>` : ''}</span>
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
  savePuttingState();
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
  savePuttingState();
  viewingSessionId = null;
  reviewCombine(combineId);
}

/* ---------- 3. Revoir (graphiques + historique) ---------- */

function reviewCombine(id) {
  activeCombineId = id;
  exerciseFlowScreen = 'review';
  const c = getCombineById(id);
  enterExerciseFlow('Revoir');
  renderCombineReviewScreen();
}

const REVIEW_CHARTS = [
  { key: 'rate', label: 'Taux de réussite', fixedMax: 100, unit: '%' },
  { key: 'pph', label: 'Putts par trou' },
  { key: 'onePutt', label: 'Nombre de 1 putt', integer: true },
];

function reviewChartValue(session, combine, key) {
  const stats = combineSessionStats(session, combine);
  if (key === 'rate') return stats.total ? Math.round((stats.made / stats.total) * 100) : 0;
  if (key === 'pph') return stats.pph;
  return stats.onePutts;
}

// Échelle "propre" : renvoie un max arrondi et 5 graduations (0 → max)
function niceAxis(maxVal, integer) {
  const raw = Math.max(maxVal, integer ? 4 : 1) / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const steps = integer ? [1, 2, 5, 10] : [1, 2, 2.5, 5, 10];
  let step = steps[steps.length - 1] * mag;
  for (let i = 0; i < steps.length; i++) {
    if (steps[i] * mag >= raw) { step = steps[i] * mag; break; }
  }
  if (integer) step = Math.max(1, Math.round(step));
  const ticks = [];
  for (let k = 0; k <= 4; k++) ticks.push(Math.round(step * k * 100) / 100);
  return { max: ticks[4], ticks: ticks };
}

// opts : { fixedMax, unit, integer }
function miniLineChartSvg(values, labels, opts) {
  opts = opts || {};
  if (!values.length) {
    return `<div class="review-chart_empty">Pas encore de séance enregistrée.</div>`;
  }
  const unit = opts.unit || '';
  const axis = opts.fixedMax
    ? { max: opts.fixedMax, ticks: [0, 25, 50, 75, 100].map(function (t) { return t * opts.fixedMax / 100; }) }
    : niceAxis(Math.max.apply(null, values), opts.integer);
  const w = 640, h = 280, padL = 66, padR = 20, padT = 20, padB = 40;
  const innerW = w - padL - padR, innerH = h - padT - padB;
  const n = values.length;
  const stepX = n > 1 ? innerW / (n - 1) : 0;
  const xOf = function (i) { return n > 1 ? padL + i * stepX : padL + innerW / 2; };
  const yOf = function (v) { return padT + innerH - (v / axis.max) * innerH; };
  const points = values.map(function (v, i) { return { x: xOf(i), y: yOf(v) }; });
  const path = points.map(function (p, i) { return (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' ');
  const dots = points.map(function (p) { return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="5" class="line-chart-point"/>`; }).join('');

  // Graduations de l'axe Y (valeurs + lignes de repère)
  const yTicks = axis.ticks.map(function (t, k) {
    const y = yOf(t);
    const grid = k === 0
      ? `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${w - padR}" y2="${y.toFixed(1)}" class="line-chart-grid-solid"/>`
      : `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${w - padR}" y2="${y.toFixed(1)}" class="line-chart-grid"/>`;
    return grid + `<text x="${padL - 10}" y="${(y + 6).toFixed(1)}" text-anchor="end" class="line-chart-ytick">${t}${unit}</text>`;
  }).join('');

  // Libellés de l'axe X : au plus ~6, répartis
  const every = Math.max(1, Math.ceil(n / 6));
  const xTicks = labels.map(function (lab, i) {
    const isLast = i === n - 1;
    const show = i % every === 0 || (isLast && ((n - 1) % every) >= Math.ceil(every / 2));
    if (!show) return '';
    return `<text x="${xOf(i).toFixed(1)}" y="${h - 10}" text-anchor="middle" class="line-chart-xtick">${lab}</text>`;
  }).join('');

  return `
    <svg class="line-chart" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      ${yTicks}
      <path d="${path}" class="line-chart-line"/>
      ${dots}
      ${xTicks}
    </svg>
  `;
}

function renderCombineReviewScreen() {
  const flowRoot = document.getElementById('exercise-flow-root');
  const combine = getCombineById(activeCombineId);
  const history = combineSessionsHistory(activeCombineId);
  const labels = history.map(function (s) { return s.dateLabel; });

  flowRoot.innerHTML = `
    <div class="chart-card">
      <div class="chart-card_header">
        <div class="chart-card_title">${combine ? combine.name : ''}</div>
      </div>
      ${REVIEW_CHARTS.map(function (chart) {
        const values = history.map(function (s) { return reviewChartValue(s, combine, chart.key); });
        return `<div class="review-chart">
          <div class="review-chart_title">${chart.label}</div>
          ${miniLineChartSvg(values, labels, chart)}
        </div>`;
      }).join('')}
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

function viewCombineSession(sessionId) {
  viewingSessionId = sessionId;
  exerciseFlowScreen = 'recap';
  renderCombineRecapScreen();
}

function randomQuickHole(i) {
  return {
    hole: i + 1,
    m: Math.round((1 + Math.random() * 6) * 10) / 10,
    clock: Math.floor(Math.random() * 12) + 1,
  };
}

function startQuickExercise(holesCount, entryMode) {
  holesCount = holesCount || 18;
  const quickCombine = {
    id: 'quick-' + Date.now(),
    name: 'Exercice rapide',
    slopedGreen: true,
    holesCount: holesCount,
    rounds: 1,
    attempts: 1,
    isQuick: true,
    entryMode: entryMode || 'express', // 'express' (Rapide) | 'complete' (Détaillée)
    previewRows: Array.from({ length: holesCount }, function (_, i) { return randomQuickHole(i); }),
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
  const current = getCombineById(activeCombineId);
  const holesCount = current ? current.holesCount : 18;
  const entryMode = current ? current.entryMode : 'express';
  cleanupQuickCombine();
  activeSession = null;
  startQuickExercise(holesCount, entryMode);
}

// Convertit une séance d'exercice rapide (modèle "results[]") en round au format
// "Parcours" (modèle "putts"), pour que Home / Analyse Distance / Analyse Pente /
// Stats Performance / Activité récente traitent les deux sources de la même façon.
function quickSessionToRound(session, combine) {
  const rows = session.holes.map(function (h) {
    const played = h.results && h.results.length > 0;
    const isMade = played && h.results[0] === 'made';
    const putts = played ? (isMade ? 1 : 2) : null;
    return {
      hole: h.hole,
      m: h.m,
      clock: h.clock,
      putts: putts,
      resultat: h.resultat || (isMade ? 'made' : null),
    };
  });
  const onePutts = rows.filter(function (r) { return r.putts === 1; }).length;
  const threePutts = rows.filter(function (r) { return r.putts !== null && r.putts >= 3; }).length;
  const totalPutts = rows.reduce(function (sum, r) { return sum + (r.putts || 0); }, 0);
  const totalMeters = rows.reduce(function (sum, r) { return sum + distanceForTotal(r.putts, r.m); }, 0);
  const name = (session.location && session.location !== 'Non renseigné') ? session.location : 'Exercice rapide';
  return {
    id: Date.now(),
    name: name,
    dateISO: session.dateISO || new Date().toISOString(),
    mode: combine ? combine.entryMode : 'express',
    holesCount: rows.length,
    onePutts: onePutts,
    threePutts: threePutts,
    totalPutts: totalPutts,
    totalMeters: Math.round(totalMeters * 10) / 10,
    holes: rows,
    source: 'quick',
  };
}

function finishQuickExercise() {
  const combine = getCombineById(activeCombineId);
  const played = activeSession && activeSession.holes && activeSession.holes.some(function (h) { return h.results && h.results.length; });
  if (played) {
    const round = quickSessionToRound(activeSession, combine);
    puttingRounds.push(round);
    savePuttingState();
    renderParcoursHistory();
    showToast('Exercice enregistré');
  }
  cleanupQuickCombine();
  activeSession = null;
  exitExerciseFlow();
}

/* ---------- Modale Nouvel exercice / Modifier ---------- */

function regenerateCreativePreview(f) {
  const hasRange = f.puttMin != null && f.puttMax != null;
  f.previewRows = Array.from({ length: f.holesCount }, function (_, i) {
    return {
      hole: i + 1,
      m: hasRange ? Math.round((f.puttMin + Math.random() * (f.puttMax - f.puttMin)) * 10) / 10 : null,
      clock: Math.floor(Math.random() * 12) + 1,
    };
  });
}

function openCreativeCombineModal() {
  puttingCreativeForm = {
    name: '',
    slopedGreen: true,
    puttMin: null,
    puttMax: null,
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

// Stepper +/- (même principe que les balles/distance de wedging)
function incCreativeField(field, delta) {
  const f = puttingCreativeForm;
  const max = { holesCount: 36, rounds: 20, attempts: 30 }[field] || 30;
  const cur = f[field] || 0;
  f[field] = Math.max(cur ? 1 : 0, Math.min(max, cur + delta));
  if (field === 'holesCount') regenerateCreativePreview(f);
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
  openNumericKeypad(label, 'creative:' + field, f[field], isPuttField, isPuttField ? 'm' : '');
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
  if (f.puttMin == null || f.puttMax == null) {
    alert('Renseigne la distance min et la distance max.');
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
  savePuttingState();
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
  const sloped = f.slopedGreen !== false;
  // Position de défilement conservée d'un rendu à l'autre (le innerHTML la remettrait à 0)
  const prevModal = modalRoot.querySelector('.exercise-modal');
  const prevPreview = modalRoot.querySelector('.exercise-modal_preview');
  const savedModalScroll = prevModal ? prevModal.scrollTop : 0;
  const savedPreviewScroll = prevPreview ? prevPreview.scrollTop : 0;
  const stepper = function (field, label, promptLabel) {
    return `
          <div class="exercise-modal_stepper">
            <div class="exercise-modal_field-label">${label}</div>
            <div class="exercise-modal_stepper-controls">
              <button type="button" onclick="incCreativeField('${field}', -1)" aria-label="Moins">&minus;</button>
              <span class="exercise-modal_stepper-value" onclick="promptCreativeNumber('${field}','${promptLabel}')">${f[field]}</span>
              <button type="button" onclick="incCreativeField('${field}', 1)" aria-label="Plus">+</button>
            </div>
          </div>`;
  };
  modalRoot.innerHTML = `
    <div class="exercise-modal_overlay" onclick="closeCreativeCombineModal()">
      <div class="exercise-modal" onclick="event.stopPropagation()">
        <div class="exercise-modal_head">
          <h3 class="exercise-modal_title">${editingCombineId !== null ? 'Modifier cet exercice' : 'Nouvel exercice'}</h3>
          <button class="exercise-modal_close" onclick="closeCreativeCombineModal()" aria-label="Fermer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>

        <div class="exercise-modal_fieldset">
          <label class="exercise-modal_label" for="creative-name-input">Titre</label>
          <input type="text" class="exercise-modal_input" id="creative-name-input" placeholder="Titre de l'exercice" value="${appEscapeHtml(f.name)}" oninput="updateCreativeName(this.value)">
        </div>

        <div class="exercise-modal_grid">
          <button type="button" class="exercise-modal_field" onclick="promptCreativeNumber('puttMin','Distance min (m)')">
            <span class="exercise-modal_field-label">Distance min</span>
            <span class="exercise-modal_field-value">${f.puttMin == null ? '--' : f.puttMin + ' m'}</span>
          </button>
          <button type="button" class="exercise-modal_field" onclick="promptCreativeNumber('puttMax','Distance max (m)')">
            <span class="exercise-modal_field-label">Distance max</span>
            <span class="exercise-modal_field-value">${f.puttMax == null ? '--' : f.puttMax + ' m'}</span>
          </button>
        </div>

        <div class="exercise-modal_toggle">
          <div class="exercise-modal_field-label">Green en pente</div>
          <div class="exercise-modal_toggle-pair">
            <button type="button" class="${sloped ? 'is-active' : ''}" onclick="setCreativeField('slopedGreen', 'true')">Oui</button>
            <button type="button" class="${sloped ? '' : 'is-active'}" onclick="setCreativeField('slopedGreen', 'false')">Non</button>
          </div>
        </div>

        <div class="exercise-modal_grid exercise-modal_grid-3">
          ${stepper('holesCount', 'Trous', 'Nombre de trous')}
          ${stepper('rounds', 'Tours', 'Nombre de tours')}
          ${stepper('attempts', 'Tentatives', 'Tentatives par trou')}
        </div>

        <div class="exercise-modal_preview">
          <div class="exercise-modal_preview-row exercise-modal_preview-head ${sloped ? '' : 'exercise-modal_preview-row-2col'}">
            <span>Trou</span><span>Distance (m)</span>${sloped ? '<span>Pente (h)</span>' : ''}
          </div>
          ${f.previewRows.map(function (r, i) {
            return `
            <div class="exercise-modal_preview-row ${sloped ? '' : 'exercise-modal_preview-row-2col'}">
              <span>${r.hole}</span>
              <button type="button" onclick="openNumericKeypad('Distance trou ${r.hole} (m)', 'previewM:${i}', ${r.m == null ? 'null' : r.m}, true, 'm')">${r.m == null ? '--' : r.m + ' m'}</button>
              ${sloped ? `<button type="button" onclick="openNumericKeypad('Pente trou ${r.hole} (h)', 'previewClock:${i}', ${r.clock}, false, 'h')">${r.clock} h</button>` : ''}
            </div>`;
          }).join('')}
          ${f.previewRows.length ? '' : '<div class="exercise-modal_preview-empty">Ajoute des trous pour générer le tableau.</div>'}
        </div>

        <button class="exercise-modal_save" id="creative-save-btn" onclick="saveCreativeCombine()" ${!f.name.trim() ? 'disabled' : ''}>${editingCombineId !== null ? 'Enregistrer les modifications' : 'Enregistrer'}</button>
      </div>
    </div>
  `;
  const newModal = modalRoot.querySelector('.exercise-modal');
  const newPreview = modalRoot.querySelector('.exercise-modal_preview');
  if (newModal) newModal.scrollTop = savedModalScroll;
  if (newPreview) newPreview.scrollTop = savedPreviewScroll;
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
   Express : distance, pente, putts. Détaillée : distance, pente, putts, résultat.
   ============================================================ */
let newParcoursModalOpen = false;
let newParcoursForm = null;
let parcoursModalFromStats = false; // true si la modale a été ouverte depuis l'écran Stats Performance

// État du popup pente (horloge) / résultat, partagé par les 2 modes de saisie
let parcoursPopup = null; // { type: 'clock' | 'resultat', rowIndex, infoOpen }

// Grille 3x3 affichée dans le popup "Résultat du putt", "Rentré" au centre
const PARCOURS_RESULTAT_GRID = [
  { value: 'long_gauche', label: 'Long gauche' },
  { value: 'long', label: 'Long' },
  { value: 'long_droite', label: 'Long droite' },
  { value: 'gauche', label: 'Gauche' },
  { value: 'made', label: 'Rentré' },
  { value: 'droite', label: 'Droite' },
  { value: 'court_gauche', label: 'Court gauche' },
  { value: 'court', label: 'Court' },
  { value: 'court_droite', label: 'Court droite' },
];

function resultatLabel(value) {
  const found = PARCOURS_RESULTAT_GRID.find(function (o) { return o.value === value; });
  return found ? found.label : '--';
}

function blankParcoursRow(i) {
  return { hole: i + 1, m: 0, clock: null, putts: null, resultat: null };
}

function generateParcoursRows(n) {
  return Array.from({ length: n }, function (_, i) { return blankParcoursRow(i); });
}

function openNewParcoursModal() {
  newParcoursForm = {
    name: '',
    holesCount: 18,
    mode: 'express', // 'express' (Rapide) | 'complete' (Détaillée)
    rows: generateParcoursRows(18),
    activeIndex: 0,
    statsInfoOpen: false,
    screen: 'entry', // 'entry' | 'recap'
  };
  newParcoursModalOpen = true;
  parcoursPopup = null;
  parcoursModalFromStats = document.body.classList.contains('is-stats-screen');
  puttingQuery('[data-header="stats"]').classList.add('is-hidden');
  puttingQuery('[data-header="main"]').classList.remove('is-hidden');
  puttingQuery('.stats-wrapper').classList.add('is-hidden');
  document.body.classList.remove('is-stats-screen');
  puttingQuery('.putting_wrapper').classList.add('is-hidden');
  puttingQueryAll('.fab-group').forEach(function (el) { el.classList.add('is-hidden'); });
  const navEl = puttingQuery('.bottom-nav');
  if (navEl) navEl.classList.add('is-hidden');
  document.getElementById('parcours-entry-root').classList.remove('is-hidden');
  document.getElementById('main-header-back-label').textContent = 'Putting';
  document.getElementById('main-header-title').textContent = 'Parcours';
  renderNewParcoursModal();
  window.scrollTo(0, 0);
}

function closeNewParcoursModal(event) {
  if (event) event.preventDefault();
  newParcoursModalOpen = false;
  newParcoursForm = null;
  parcoursPopup = null;
  renderParcoursPopup();
  document.getElementById('parcours-entry-root').classList.add('is-hidden');
  document.getElementById('main-header-back-label').textContent = 'Home';
  document.getElementById('main-header-title').textContent = 'Putting';
  puttingQueryAll('.fab-group').forEach(function (el) {
    el.classList.toggle('is-hidden', el.dataset.fab !== 'parcours');
  });
  const navEl = puttingQuery('.bottom-nav');
  if (navEl) navEl.classList.remove('is-hidden');
  if (parcoursModalFromStats) {
    puttingQuery('[data-header="main"]').classList.add('is-hidden');
    puttingQuery('[data-header="stats"]').classList.remove('is-hidden');
    puttingQuery('.stats-wrapper').classList.remove('is-hidden');
    document.body.classList.add('is-stats-screen');
    renderStatsPerformance();
  } else {
    puttingQuery('.putting_wrapper').classList.remove('is-hidden');
  }
  parcoursModalFromStats = false;
  window.scrollTo(0, 0);
}

function handleMainHeaderBack(event) {
  if (newParcoursModalOpen) {
    closeNewParcoursModal(event);
    return;
  }
  const activeSub = puttingQuery('.analyse-subpanel:not(.is-hidden)');
  if (activeSub && activeSub.dataset.sub !== 'home') {
    event.preventDefault();
    selectPuttingTab({ preventDefault: function () {} }, 'parcours');
    window.scrollTo(0, 0);
    return;
  }
  renderGolfHome();
  showPage('home');
}

function setParcoursHoles(n) {
  const f = newParcoursForm;
  if (f.holesCount === n) return;
  if (n < f.holesCount) {
    const hasData = f.rows.slice(n).some(function (r) { return r.m || r.clock !== null || r.putts !== null; });
    if (hasData && !confirm('Les trous ' + (n + 1) + ' à ' + f.holesCount + ' seront supprimés. Continuer ?')) return;
  }
  const oldRows = f.rows;
  f.holesCount = n;
  // Conserve les données déjà saisies pour les trous existants, n'en génère de nouveaux que si besoin
  f.rows = Array.from({ length: n }, function (_, i) { return oldRows[i] || blankParcoursRow(i); });
  if (f.activeIndex >= n) f.activeIndex = n - 1;
  renderNewParcoursModal();
}

// Sélection explicite du nombre de trous (9 / 18)
function selectParcoursHoles(n) {
  setParcoursHoles(n);
}

// Sélection explicite du mode (Rapide / Détaillée)
function selectParcoursMode(mode) {
  const f = newParcoursForm;
  if (f.mode === mode) return;
  f.mode = mode;
  renderNewParcoursModal();
}

function goToParcoursHole(idx) {
  newParcoursForm.activeIndex = idx;
  renderNewParcoursModal();
}

function toggleParcoursStatsInfo() {
  newParcoursForm.statsInfoOpen = !newParcoursForm.statsInfoOpen;
  renderNewParcoursModal();
}

// Passe au trou suivant une fois le résultat saisi (sauf sur le dernier trou)
function advanceParcoursHole() {
  const f = newParcoursForm;
  if (f.activeIndex < f.rows.length - 1) f.activeIndex += 1;
  renderNewParcoursModal();
}

function updateParcoursName(value) {
  newParcoursForm.name = value;
}

// Saisie rapide : 1, 2 ou 3 putts (1 putt = vert). La distance de base saisie par
// l'utilisateur est toujours conservée telle quelle (elle sert au Strokes Gained,
// aux buckets d'analyse par distance, etc.). Seul le total de mètres comptabilisé
// pour la séance utilise 0,5 m au-delà d'1 putt — voir distanceForTotal().
function setParcoursRowPuttsExpress(idx, putts) {
  const row = newParcoursForm.rows[idx];
  row.putts = putts;
  row.resultat = putts === 1 ? 'made' : null;
  advanceParcoursHole();
}

// Distance comptabilisée dans le total de mètres d'une séance : la distance de
// base si 1 putt, sinon un forfait de 0,5 m (putt(s) restant(s) considéré(s)
// comme courts). Le Strokes Gained, lui, utilise toujours la distance de base
// (voir puttSG / parcoursSessionStats) — cette fonction ne sert qu'au total de mètres.
function distanceForTotal(putts, m) {
  if (putts === null || putts === undefined) return 0;
  return putts > 1 ? 0.5 : (m || 0);
}

function setParcoursRowM(idx, v) {
  if ((v || '').trim() === '') { newParcoursForm.rows[idx].m = 0; return; }
  const n = parseFloat((v || '').replace(',', '.'));
  if (!isNaN(n)) newParcoursForm.rows[idx].m = Math.round(Math.max(0, n) * 10) / 10;
}

// Saisie de la distance via le pavé numérique, pour la carte compacte du mode express
function promptParcoursRowM(idx) {
  const current = newParcoursForm.rows[idx].m;
  openNumericKeypad('Distance (m)', 'parcoursRowM:' + idx, current || '', true, 'm');
}

// Ouvre le popup horloge pour choisir la pente du trou idx
function openSlopePopup(idx) {
  parcoursPopup = { type: 'clock', rowIndex: idx, infoOpen: false };
  renderParcoursPopup();
}

// Ouvre le popup grille 3x3 pour choisir le résultat du 1er putt du trou idx
function openResultatPopup(idx) {
  parcoursPopup = { type: 'resultat', rowIndex: idx };
  renderParcoursPopup();
}

function closeParcoursPopup() {
  parcoursPopup = null;
  renderParcoursPopup();
}

function toggleParcoursPopupInfo(event) {
  if (event) event.stopPropagation();
  if (!parcoursPopup) return;
  parcoursPopup.infoOpen = !parcoursPopup.infoOpen;
  renderParcoursPopup();
}

function pickSlopeClock(h) {
  if (!parcoursPopup) return;
  newParcoursForm.rows[parcoursPopup.rowIndex].clock = h;
  parcoursPopup = null;
  renderParcoursPopup();
  renderNewParcoursModal();
}

// Choix d'un résultat dans la grille 3x3 : "Rentré" au centre = réussi (1 putt), tout le reste = manqué (2 putts)
// Sert à la saisie détaillée de Nouveau parcours et de l'Exercice rapide (parcoursPopup.target === 'quick')
function pickResultat(value) {
  if (!parcoursPopup) return;
  const isQuick = parcoursPopup.target === 'quick';
  if (isQuick) {
    activeSession.holes[activeHoleIndex].resultat = value;
  } else {
    const row = newParcoursForm.rows[parcoursPopup.rowIndex];
    row.resultat = value;
    row.putts = value === 'made' ? 1 : 2;
  }
  parcoursPopup = null;
  renderParcoursPopup();
  if (isQuick) setCombineResult(value === 'made' ? 'made' : 'missed');
  else advanceParcoursHole();
}

function renderParcoursPopup() {
  const root = document.getElementById('parcours-popup-root');
  if (!root) return;
  const isQuick = !!parcoursPopup && parcoursPopup.target === 'quick';
  if (!parcoursPopup || (!isQuick && !newParcoursForm)) { root.innerHTML = ''; return; }
  const row = isQuick ? activeSession.holes[activeHoleIndex] : newParcoursForm.rows[parcoursPopup.rowIndex];
  const closeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  if (parcoursPopup.type === 'clock') {
    const current = row.clock;
    const points = Array.from({ length: 12 }, function (_, k) { return k + 1; }).map(function (h) {
      const angle = (h / 12) * 2 * Math.PI - Math.PI / 2;
      const x = (100 + 76 * Math.cos(angle)).toFixed(1);
      const y = (100 + 76 * Math.sin(angle)).toFixed(1);
      return `<g class="clock-picker_point ${current === h ? 'is-active' : ''}" onclick="pickSlopeClock(${h})">
        <circle cx="${x}" cy="${y}" r="15"/>
        <text x="${x}" y="${y}">${h}</text>
      </g>`;
    }).join('');

    root.innerHTML = `
      <div class="mini-popup_overlay" onclick="closeParcoursPopup()">
        <div class="mini-popup" onclick="event.stopPropagation()">
          <div class="mini-popup_head">
            <h3 class="mini-popup_title">Pente</h3>
            <div class="mini-popup_head-actions">
              <button type="button" class="mini-popup_info ${parcoursPopup.infoOpen ? 'is-active' : ''}" onclick="toggleParcoursPopupInfo(event)" aria-label="Explication">i</button>
              <button type="button" class="mini-popup_close" onclick="closeParcoursPopup()" aria-label="Fermer">${closeIcon}</button>
            </div>
          </div>
          ${parcoursPopup.infoOpen ? `<div class="mini-popup_info-text">La pente est représentée comme le cadran d'une horloge, avec le trou au centre : l'heure correspond à la pente (12h = putt en descente, 6h = putt en montée, 9h = putt gauche-droite).</div>` : ''}
          <div class="clock-picker">
            <svg class="clock-picker_svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="90" class="clock-picker_ring"/>
              ${points}
              <circle cx="100" cy="100" r="5" class="clock-picker_center"/>
            </svg>
          </div>
        </div>
      </div>
    `;
  } else {
    const current = row.resultat;
    root.innerHTML = `
      <div class="mini-popup_overlay" onclick="closeParcoursPopup()">
        <div class="mini-popup" onclick="event.stopPropagation()">
          <div class="mini-popup_head">
            <h3 class="mini-popup_title">Résultat du putt</h3>
            <button type="button" class="mini-popup_close" onclick="closeParcoursPopup()" aria-label="Fermer">${closeIcon}</button>
          </div>
          <div class="resultat-grid">
            ${PARCOURS_RESULTAT_GRID.map(function (o) {
              const isCenter = o.value === 'made';
              return `<button type="button" class="resultat-grid_btn ${isCenter ? 'is-center' : ''} ${current === o.value ? 'is-active' : ''}" onclick="pickResultat('${o.value}')">${o.label}</button>`;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }
}

// La distance de chaque trou est désormais obligatoire (le lieu, lui, reste optionnel)
function parcoursAllHolesComplete(f) {
  return f.rows.every(function (r) { return r.putts !== null && r.putts !== undefined && r.m > 0; });
}

function goToParcoursRecap() {
  if (!parcoursAllHolesComplete(newParcoursForm)) return;
  newParcoursForm.screen = 'recap';
  renderNewParcoursModal();
  window.scrollTo(0, 0);
}

function backToParcoursEntry() {
  newParcoursForm.screen = 'entry';
  renderNewParcoursModal();
  window.scrollTo(0, 0);
}

function saveNewParcours() {
  const f = newParcoursForm;
  if (!parcoursAllHolesComplete(f)) {
    alert('Merci de renseigner la distance et le résultat de chaque trou avant d\'enregistrer.');
    return;
  }
  const rows = f.rows;
  const onePutts = rows.filter(function (r) { return r.putts === 1; }).length;
  const threePutts = rows.filter(function (r) { return r.putts !== null && r.putts >= 3; }).length;
  const totalPutts = rows.reduce(function (sum, r) { return sum + (r.putts || 0); }, 0);
  const totalMeters = rows.reduce(function (sum, r) { return sum + distanceForTotal(r.putts, r.m); }, 0);

  puttingRounds.push({
    id: Date.now(),
    name: (f.name && f.name.trim()) ? f.name.trim() : 'Parcours',
    dateISO: new Date().toISOString(),
    mode: f.mode,
    holesCount: f.holesCount,
    onePutts: onePutts,
    threePutts: threePutts,
    totalPutts: totalPutts,
    totalMeters: Math.round(totalMeters * 10) / 10,
    holes: JSON.parse(JSON.stringify(f.rows)),
  });
  savePuttingState();
  closeNewParcoursModal();
  renderParcoursHistory();
  showToast('Parcours enregistré');
}

// Import depuis Stats (saisie détaillée) : une partie = un "Parcours" Putting en mode Détaillée.
// Reçoit { statsKey, name, dateISO, holes: [{ hole, m, putts, resultat }] } (un trou par premier putt).
// Pas de pente (clock) côté Stats : elle reste à null, ces trous sont ignorés de l'analyse par pente.
function importPuttingRoundFromStats(data) {
  if (!data || !data.statsKey || !Array.isArray(data.holes)) return false;
  if (puttingRounds.some(function (r) { return r.statsKey === data.statsKey; })) return false;

  const validResults = PARCOURS_RESULTAT_GRID.map(function (o) { return o.value; });
  const rows = data.holes
    .filter(function (h) { return h && h.m > 0 && Number.isInteger(h.putts) && h.putts >= 1; })
    .map(function (h) {
      return {
        hole: h.hole,
        m: Math.round(h.m * 10) / 10,
        clock: null,
        putts: h.putts,
        resultat: validResults.indexOf(h.resultat) !== -1 ? h.resultat : null,
      };
    });
  if (!rows.length) return false;

  const usedIds = puttingRounds.map(function (r) { return r.id; });
  let id = Date.now();
  while (usedIds.indexOf(id) !== -1) id++;

  puttingRounds.push({
    id: id,
    name: data.name || 'Parcours',
    dateISO: data.dateISO || new Date().toISOString(),
    mode: 'complete',
    holesCount: rows.length,
    onePutts: rows.filter(function (r) { return r.putts === 1; }).length,
    threePutts: rows.filter(function (r) { return r.putts >= 3; }).length,
    totalPutts: rows.reduce(function (sum, r) { return sum + r.putts; }, 0),
    totalMeters: Math.round(rows.reduce(function (sum, r) { return sum + distanceForTotal(r.putts, r.m); }, 0) * 10) / 10,
    holes: rows,
    source: 'stats',
    statsKey: data.statsKey,
  });
  savePuttingState(); // enregistre + rafraîchit les analyses et l'accueil
  return true;
}
window.importPuttingRoundFromStats = importPuttingRoundFromStats;

// --- Récap de fin de session (même esprit que le récap de l'exercice rapide) ---
function renderNewParcoursRecapScreen() {
  const root = document.getElementById('parcours-entry-root');
  if (!root) return;
  const f = newParcoursForm;
  const st = parcoursSessionStats(f.rows);
  const esc = appEscapeHtml;

  root.innerHTML = `
    <div>
      <a href="#" class="quick-entry_back" onclick="event.preventDefault();backToParcoursEntry()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
        Retour
      </a>
    </div>

    <div class="stats_grid">
      <div class="stat-card">
        <div class="stat-card_label">SG Putting</div>
        <div class="stat-card_value">${fmtSG(st.sgAvg)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card_label">1 putt</div>
        <div class="stat-card_value">${fmtPct(st.rate)}</div>
        <div class="stat-card_trend">${st.putts} putts au total</div>
      </div>
    </div>

    <input type="text" class="exercise-modal_input" placeholder="Lieu (optionnel)" value="${esc(f.name)}" oninput="updateParcoursName(this.value)">

    <div class="history-card">
      <div class="history-card_header"><div class="history-card_title">Détail par trou</div></div>
      <div class="recap-table">
        <div class="recap-table_row recap-table_head"><span>Trou</span><span>Distance</span><span>Putts</span></div>
        ${f.rows.map(function (r) {
          return `<div class="recap-table_row">
            <span>${r.hole}</span>
            <span>${r.m} m</span>
            <span class="${r.putts === 1 ? 'recap-table_value-accent' : ''}">${r.putts != null ? r.putts : '--'}</span>
          </div>`;
        }).join('')}
      </div>
    </div>

    <div class="exercise-item_actions" style="margin-top:0;">
      <button class="exercise-item_action" onclick="backToParcoursEntry()">Modifier</button>
      <button class="exercise-item_action is-primary" onclick="saveNewParcours()">Enregistrer</button>
    </div>
  `;
}

// Stats de la saisie en cours : mêmes règles que l'Exercice rapide (Manqué = 2 putts, Réussi = 1 putt)
function parcoursSessionStats(rows) {
  let played = 0, made = 0, putts = 0, sg = 0, sgCount = 0;
  rows.forEach(function (r) {
    if (r.putts === null || r.putts === undefined) return;
    played += 1;
    if (r.putts === 1) made += 1;
    putts += r.putts;
    const rowSg = puttSG(r.m, r.putts); if (rowSg != null) { sg += rowSg; sgCount += 1; }
  });
  return {
    played: played,
    made: made,
    putts: putts,
    avgPutts: played ? putts / played : null,
    sgAvg: sgCount ? sg / sgCount : null,
    rate: played ? (made / played) * 100 : null,
  };
}

function renderNewParcoursModal() {
  const root = document.getElementById('parcours-entry-root');
  if (!root) return;
  if (!newParcoursModalOpen || !newParcoursForm) {
    root.innerHTML = '';
    return;
  }
  const f = newParcoursForm;
  if (f.screen === 'recap') { renderNewParcoursRecapScreen(); return; }
  const isDetail = f.mode === 'complete';
  const rows = f.rows;
  const idx = f.activeIndex;
  const row = rows[idx];
  const st = parcoursSessionStats(rows);
  const allDone = parcoursAllHolesComplete(f);
  const esc = appEscapeHtml;
  const icon = quickIcon;
  const { pin: pinPaths, flag: flagPaths, star: starPaths, bars: barsPaths, distance: distancePaths, slope: slopePaths, putter: putterPaths, target: targetPaths, trophy: trophyPaths } = QUICK_ICON_PATHS;

  const hasClock = row.clock !== null && row.clock !== undefined;
  const penteIdx = hasClock ? penteCategoryIndex(row.clock) : null;
  const penteLabel = penteIdx == null ? '' : PENTE_LABELS[penteIdx];
  const puttImage = quickPuttImageUrl(row.clock);
  const sgClass = st.sgAvg == null ? '' : (st.sgAvg >= 0 ? 'is-accent' : 'is-negative');
  const currentResult = row.putts === null || row.putts === undefined ? null : (row.putts === 1 ? 'made' : 'missed');
  const resultatLabelText = row.resultat ? resultatLabel(row.resultat) : (currentResult === 'missed' ? 'Manqué' : 'Résultat du putt');

  root.innerHTML = `
    <div>
      <a href="#" class="quick-entry_back" onclick="closeNewParcoursModal(event)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
        Retour
      </a>
    </div>

    <div class="quick-session">

      <div class="quick-session_bar">
        <div class="quick-session_bar-item is-wide">
          ${icon('quick-session_bar-icon', pinPaths)}
          <div class="quick-session_bar-text">
            <span class="quick-session_bar-label">Lieu</span>
            <input type="text" class="quick-session_bar-input" id="parcours-name-input" placeholder="Lieu (optionnel)" value="${esc(f.name)}" oninput="updateParcoursName(this.value)">
          </div>
        </div>
        <div class="quick-session_bar-divider"></div>
        <div class="quick-session_bar-item">
          ${icon('quick-session_bar-icon', flagPaths)}
          <div class="quick-session_bar-text">
            <span class="quick-session_bar-label">Trou</span>
            <span class="quick-session_bar-value">${idx + 1} / ${rows.length}</span>
          </div>
        </div>
        <div class="quick-session_bar-divider"></div>
        <div class="quick-session_bar-item">
          ${icon('quick-session_bar-icon', starPaths)}
          <div class="quick-session_bar-text">
            <span class="quick-session_bar-label">Score</span>
            <span class="quick-session_bar-value is-accent">${st.played ? st.made + ' / ' + st.played : '--'}</span>
          </div>
        </div>
        <div class="quick-session_bar-divider"></div>
        <div class="quick-session_bar-item">
          ${icon('quick-session_bar-icon', barsPaths)}
          <div class="quick-session_bar-text">
            <span class="quick-session_bar-label">SG</span>
            <span class="quick-session_bar-value ${sgClass}">${fmtSG(st.sgAvg)}</span>
          </div>
        </div>
      </div>

      <div class="quick-session_card">
        <div class="quick-session_main">
          <div class="quick-session_info">
            <div class="quick-session_hole">
              <div class="quick-session_badge">${row.hole}</div>
              <div class="quick-session_hole-text">
                <div class="quick-session_hole-title">Trou ${row.hole}</div>
              </div>
            </div>
            <div class="quick-session_metrics">
              <button type="button" class="quick-session_metric is-editable" onclick="openSlopePopup(${idx})">
                ${icon('quick-session_metric-icon', slopePaths)}
                <div class="quick-session_metric-text">
                  <span class="quick-session_metric-label">Pente</span>
                  <span class="quick-session_metric-value">${hasClock ? row.clock + 'h' : '--'}</span>
                  <span class="quick-session_metric-note">${penteLabel}</span>
                </div>
              </button>
              <button type="button" class="quick-session_metric is-editable" onclick="promptParcoursRowM(${idx})">
                ${icon('quick-session_metric-icon', distancePaths)}
                <div class="quick-session_metric-text">
                  <span class="quick-session_metric-label">Distance</span>
                  <span class="quick-session_metric-value">${row.m ? row.m + ' m' : '--'}</span>
                </div>
              </button>
            </div>
          </div>

          <div class="quick-session_panels">
            <button type="button" class="quick-session_panel is-toggle" onclick="selectParcoursMode('${isDetail ? 'express' : 'complete'}')">
              <span class="quick-session_radio is-active"><span class="quick-session_radio-dot"></span>${isDetail ? 'Détaillée' : 'Rapide'}</span>
            </button>
            <button type="button" class="quick-session_panel is-toggle" onclick="selectParcoursHoles(${f.holesCount === 9 ? 18 : 9})">
              <span class="quick-session_radio is-active"><span class="quick-session_radio-dot"></span>${f.holesCount} trous</span>
            </button>
          </div>
        </div>

        <div class="quick-session_bg"><img class="quick-session_bg-img" src="${puttImage}" alt=""></div>

        <div class="session-result-buttons ${isDetail ? '' : 'is-triple'}">
          ${isDetail ? `
          <button class="session-result-btn is-detail ${currentResult ? 'is-selected' : ''}" onclick="openResultatPopup(${idx})">
            <span class="quick-session_btn-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${targetPaths}</svg></span>${esc(resultatLabelText)}
          </button>
          ` : `
          <button class="session-result-btn is-made ${row.putts === 1 ? 'is-selected' : ''}" onclick="setParcoursRowPuttsExpress(${idx}, 1)">1 putt</button>
          <button class="session-result-btn is-missed ${row.putts === 2 ? 'is-selected' : ''}" onclick="setParcoursRowPuttsExpress(${idx}, 2)">2 putts</button>
          <button class="session-result-btn is-missed ${row.putts === 3 ? 'is-selected' : ''}" onclick="setParcoursRowPuttsExpress(${idx}, 3)">3 putts</button>
          `}
        </div>
      </div>

      <div class="quick-session_holes">
        ${rows.map(function (r, i) {
          const isDone = r.putts !== null && r.putts !== undefined;
          const state = (isDone ? (r.putts <= 1 ? 'is-done' : 'is-missed') : '') + (i === idx ? ' is-active' : '');
          return `<button type="button" class="quick-session_hole-btn ${state}" onclick="goToParcoursHole(${i})">
            <span class="quick-session_hole-num">${r.hole}</span>
            <span class="quick-session_hole-dist">${r.m ? r.m + ' m' : '--'}</span>
          </button>`;
        }).join('')}
      </div>

      <div class="quick-session_bar">
        <div class="quick-session_bar-item">
          ${icon('quick-session_bar-icon', putterPaths)}
          <div class="quick-session_bar-text">
            <span class="quick-session_bar-label">Moy. putts</span>
            <span class="quick-session_bar-value">${st.avgPutts == null ? '--' : st.avgPutts.toFixed(1)}</span>
          </div>
          <button type="button" class="quick-session_info-btn ${f.statsInfoOpen ? 'is-active' : ''}" onclick="toggleParcoursStatsInfo()" aria-label="Explication">i</button>
        </div>
        <div class="quick-session_bar-divider"></div>
        <div class="quick-session_bar-item">
          ${icon('quick-session_bar-icon', targetPaths)}
          <div class="quick-session_bar-text">
            <span class="quick-session_bar-label">Putts totaux</span>
            <span class="quick-session_bar-value">${st.putts}</span>
          </div>
        </div>
        <div class="quick-session_bar-divider"></div>
        <div class="quick-session_bar-item">
          ${icon('quick-session_bar-icon', trophyPaths)}
          <div class="quick-session_bar-text">
            <span class="quick-session_bar-label">Taux de réussite</span>
            <span class="quick-session_bar-value">${fmtPct(st.rate)}</span>
            <div class="quick-session_track"><div class="quick-session_track-fill" style="width:${st.rate == null ? 0 : Math.round(st.rate)}%"></div></div>
          </div>
        </div>
      </div>

      ${f.statsInfoOpen ? `<div class="mini-popup_info-text">Au-delà d'1 putt, le total de mètres de la séance compte 0,5 m pour ce trou (putt(s) restant(s) considéré(s) comme courts). Le Strokes Gained continue d'utiliser la distance de base saisie.</div>` : ''}

      ${allDone ? `
      <button class="exercise-modal_save quick-entry_save" onclick="goToParcoursRecap()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>
        Voir le récapitulatif
      </button>
      ` : `<div class="quick-entry_hint">Renseigne la distance et le résultat de chaque trou pour terminer (${rows.filter(function (r) { return r.putts !== null && r.putts !== undefined && r.m > 0; }).length} / ${rows.length}).</div>`}
    </div>
  `;
}

/* ---------- Historique des parcours (accueil Parcours) ---------- */
// Activité récente : 5 dernières séances, "Voir tout" déplie la liste complète
const PARCOURS_HISTORY_PREVIEW = 5;
let parcoursHistoryExpanded = false;

function toggleParcoursHistory(event) {
  if (event) event.preventDefault();
  parcoursHistoryExpanded = !parcoursHistoryExpanded;
  renderParcoursHistory();
}

function renderParcoursHistory() {
  const listRoot = document.getElementById('parcours-history-list');
  if (!listRoot) return;
  const toggle = document.getElementById('parcours-history-toggle');
  if (toggle) {
    toggle.classList.toggle('is-disabled', puttingRounds.length <= PARCOURS_HISTORY_PREVIEW);
    toggle.textContent = parcoursHistoryExpanded ? 'Réduire' : 'Voir tout';
  }
  if (!puttingRounds.length) {
    listRoot.innerHTML = '';
    return;
  }
  const sortedAll = puttingRounds.slice().reverse();
  const sorted = parcoursHistoryExpanded ? sortedAll : sortedAll.slice(0, PARCOURS_HISTORY_PREVIEW);
  listRoot.innerHTML = sorted.map(function (r) {
    const date = new Date(r.dateISO);
    const dateLabel = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    const modeLabel = r.mode === 'complete' ? 'Détaillée' : 'Express';
    return `
      <div class="history-item" onclick="openRoundDetail(${r.id})" role="button" tabindex="0">
        <div class="history-item_content">
          <div class="history-item_title">${appEscapeHtml(r.name)}</div>
          <div class="history-item_meta">${dateLabel} &middot; ${r.holesCount} trous &middot; ${modeLabel} &middot; ${r.totalPutts} putts</div>
        </div>
        <div class="history-item_right">
          <svg class="history-item_arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </div>
      </div>
    `;
  }).join('');
}

/* ---------- Détail d'une séance (Parcours ou Exercice rapide) depuis Activité récente ---------- */
let viewingRoundId = null;

function openRoundDetail(id) {
  const r = puttingRounds.find(function (round) { return round.id === id; });
  if (!r) return;
  viewingRoundId = id;
  parcoursModalFromStats = document.body.classList.contains('is-stats-screen');
  puttingQuery('[data-header="stats"]').classList.add('is-hidden');
  puttingQuery('[data-header="main"]').classList.remove('is-hidden');
  puttingQuery('.stats-wrapper').classList.add('is-hidden');
  document.body.classList.remove('is-stats-screen');
  puttingQuery('.putting_wrapper').classList.add('is-hidden');
  puttingQueryAll('.fab-group').forEach(function (el) { el.classList.add('is-hidden'); });
  const navEl = puttingQuery('.bottom-nav');
  if (navEl) navEl.classList.add('is-hidden');
  document.getElementById('main-header-back-label').textContent = 'Putting';
  document.getElementById('main-header-title').textContent = 'Détail';
  document.getElementById('parcours-entry-root').classList.remove('is-hidden');
  renderRoundDetailScreen(r);
  window.scrollTo(0, 0);
}

function closeRoundDetail() {
  viewingRoundId = null;
  document.getElementById('parcours-entry-root').classList.add('is-hidden');
  document.getElementById('main-header-back-label').textContent = 'Home';
  document.getElementById('main-header-title').textContent = 'Putting';
  puttingQueryAll('.fab-group').forEach(function (el) {
    el.classList.toggle('is-hidden', el.dataset.fab !== 'parcours');
  });
  const navEl = puttingQuery('.bottom-nav');
  if (navEl) navEl.classList.remove('is-hidden');
  if (parcoursModalFromStats) {
    puttingQuery('[data-header="main"]').classList.add('is-hidden');
    puttingQuery('[data-header="stats"]').classList.remove('is-hidden');
    puttingQuery('.stats-wrapper').classList.remove('is-hidden');
    document.body.classList.add('is-stats-screen');
    renderStatsPerformance();
  } else {
    puttingQuery('.putting_wrapper').classList.remove('is-hidden');
  }
  parcoursModalFromStats = false;
  window.scrollTo(0, 0);
}

function renderRoundDetailScreen(r) {
  const root = document.getElementById('parcours-entry-root');
  if (!root) return;
  const st = parcoursSessionStats(r.holes || []);
  const dateLabel = new Date(r.dateISO).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const modeLabel = r.mode === 'complete' ? 'Détaillée' : 'Express';
  const esc = appEscapeHtml;

  root.innerHTML = `
    <div>
      <a href="#" class="quick-entry_back" onclick="event.preventDefault();closeRoundDetail()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
        Retour
      </a>
    </div>

    <div class="history-card">
      <div class="history-card_header"><div class="history-card_title">${esc(r.name)}</div></div>
      <div class="history-item_meta">${dateLabel} &middot; ${r.holesCount} trous &middot; ${modeLabel}</div>
    </div>

    <div class="stats_grid">
      <div class="stat-card">
        <div class="stat-card_label">SG Putting</div>
        <div class="stat-card_value">${fmtSG(st.sgAvg)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card_label">1 putt</div>
        <div class="stat-card_value">${fmtPct(st.rate)}</div>
        <div class="stat-card_trend">${st.putts} putts au total</div>
      </div>
    </div>

    <div class="history-card">
      <div class="history-card_header"><div class="history-card_title">Détail par trou</div></div>
      <div class="recap-table">
        <div class="recap-table_row recap-table_head"><span>Trou</span><span>Distance</span><span>Putts</span></div>
        ${(r.holes || []).map(function (h) {
          return `<div class="recap-table_row">
            <span>${h.hole}</span>
            <span>${h.m != null ? h.m + ' m' : '--'}</span>
            <span class="${h.putts === 1 ? 'recap-table_value-accent' : ''}">${h.putts != null ? h.putts : '--'}</span>
          </div>`;
        }).join('')}
      </div>
    </div>
  `;
}

// Les encadrés de l'accueil général sont remplis dès le chargement, sans attendre l'ouverture du Putting
renderGolfHome();

// Expose renderPuttingTab globalement pour être appelée depuis index.html
window.renderPuttingTab = renderPuttingTab;
window.renderGolfHome = renderGolfHome;

