/* ==========================================================================
   GYM — Injection du HTML de la partie (déplacé depuis index.html, qui ne
   contient plus qu'un conteneur vide #app-root-gym, comme les autres modules).
   Placé en tout premier : le reste du fichier suppose que ces éléments
   existent déjà dans le DOM (bindings faits une seule fois au chargement,
   pas à chaque rendu — voir gymSetupTabs sur "programmes-tabs" par ex.).
   ========================================================================== */
document.getElementById("app-root-gym").innerHTML = `

    <!-- ============================== VUE : ACCUEIL ============================== -->
    <section class="gym-view" id="view-gym-home" hidden>
      <header class="gym-header">
        <a class="gym-header__back" href="#" onclick="showPage('home'); return false;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          Home
        </a>
        <span class="gym-header__title">GYM</span>
        <button class="gym-header__action" aria-label="Options">
          <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>
        </button>
      </header>

      <main class="gym-main">

        <!-- Hero : titre + accroche. Image de fond à ajouter dans .home-hero__media -->
        <div class="home-hero gym-anim-in">
          <div class="home-hero__media"></div>
          <div class="home-hero__content">
            <h1 class="gym-title-xl">Développez votre <span class="home-hero__highlight">puissance</span> physique.</h1>
            <p class="gym-subtitle">Planifiez, entraînez-vous et suivez vos progrès.</p>
            <span class="home-hero__bar"></span>
          </div>
        </div>

        <!-- Grille des 4 fonctionnalités principales. Image de fond à ajouter dans chaque .feature-card__media -->
        <div class="feature-grid gym-stagger">
          <a class="card card--interactive feature-card" href="#" onclick="gymNavigate('programmes'); return false;">
            <div class="feature-card__media feature-card__media--programmes"></div>
            <div class="feature-card__body">
              <div class="feature-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="5" y="3.5" width="12" height="16" rx="2"/>
                  <path d="M9 3.2v-.2a1.5 1.5 0 013 0v.2"/>
                  <line x1="8.5" y1="9" x2="14.5" y2="9"/>
                  <line x1="8.5" y1="12.5" x2="14.5" y2="12.5"/>
                  <line x1="8.5" y1="16" x2="12.5" y2="16"/>
                </svg>
              </div>
              <span class="feature-card__bar"></span>
              <span class="feature-card__title">Programmes</span>
              <p class="feature-card__desc">Créez et gérez vos programmes d'entraînement.</p>
              <span class="feature-card__arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </span>
            </div>
          </a>

          <a class="card card--interactive feature-card" href="#" onclick="gymNavigate('exercices'); return false;">
            <div class="feature-card__media feature-card__media--exercices"></div>
            <div class="feature-card__body">
              <div class="feature-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="1.5" y="9" width="3" height="6" rx="1"/>
                  <rect x="4.3" y="7.4" width="2.4" height="9.2" rx="1"/>
                  <path d="M6.7 12h10.6"/>
                  <rect x="17.3" y="7.4" width="2.4" height="9.2" rx="1"/>
                  <rect x="19.5" y="9" width="3" height="6" rx="1"/>
                </svg>
              </div>
              <span class="feature-card__bar"></span>
              <span class="feature-card__title">Exercices</span>
              <p class="feature-card__desc">Recherchez dans notre banque d'exercices et ajoutez-les à vos programmes.</p>
              <span class="feature-card__arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </span>
            </div>
          </a>

          <a class="card card--interactive feature-card" href="#" onclick="gymNavigate('historique'); return false;">
            <div class="feature-card__media feature-card__media--historique"></div>
            <div class="feature-card__body">
              <div class="feature-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 2.5h6M12 5v2.2"/>
                  <circle cx="12" cy="13" r="8"/>
                  <path d="M12 9v4l3 2"/>
                </svg>
              </div>
              <span class="feature-card__bar"></span>
              <span class="feature-card__title">Historique</span>
              <p class="feature-card__desc">Consultez vos séances passées et vos entraînements.</p>
              <span class="feature-card__arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </span>
            </div>
          </a>

          <a class="card card--interactive feature-card" href="#" onclick="gymNavigate('progression'); return false;">
            <div class="feature-card__media feature-card__media--progression"></div>
            <div class="feature-card__body">
              <div class="feature-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 20v-7M8 20v-11M13 20v-6"/>
                </svg>
              </div>
              <span class="feature-card__bar"></span>
              <span class="feature-card__title">Progression</span>
              <p class="feature-card__desc">Analysez vos performances et suivez votre évolution dans le temps.</p>
              <span class="feature-card__arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </span>
            </div>
          </a>
        </div>

        <!-- Prochaine séance (visible seulement si un programme est lancé) -->
        <a class="card gym-anim-in home-next-session" id="home-next-session" href="#" onclick="gymHomeNextSessionClick(); return false;" hidden>
          <span class="gym-eyebrow">Prochaine séance</span>
          <div class="next-session__row">
            <span class="next-session__icon">
              <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5v14l12-7z"/></svg>
            </span>
            <div class="next-session__body">
              <span class="next-session__title" id="home-next-session-title"></span>
              <span class="next-session__meta" id="home-next-session-meta"></span>
            </div>
            <span class="next-session__arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </span>
          </div>
        </a>

        <!-- Démarrage rapide -->
        <div class="card gym-anim-in home-quickstart">
          <span class="gym-eyebrow">Démarrer rapidement</span>
          <div class="quickstart__row">
            <a class="quickstart__item" href="#" onclick="gymOpenLaunchSheet(); return false;">
              <span class="quickstart__icon">
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5v14l12-7z"/></svg>
              </span>
              <span class="quickstart__label">Lancer une<br/>séance</span>
            </a>
            <span class="quickstart__divider"></span>
            <a class="quickstart__item" href="#" onclick="gymNavigate('creer-seance'); return false;">
              <span class="quickstart__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
              </span>
              <span class="quickstart__label">Nouvelle<br/>séance</span>
            </a>
            <span class="quickstart__divider"></span>
            <a class="quickstart__item" href="#" onclick="gymNavigate('creer-programme'); return false;">
              <span class="quickstart__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="13" r="7"/><circle cx="11" cy="13" r="3.2"/><circle cx="11" cy="13" r="0.8" fill="currentColor" stroke="none"/>
                  <path d="M17 5.2l1.4 1.4M19.6 4.6l-1 1M18.6 7.2l1-1"/>
                </svg>
              </span>
              <span class="quickstart__label">Créer un<br/>programme</span>
            </a>
          </div>
        </div>

      </main>
    </section>

    <!-- ============================== VUE : PROGRAMMES ============================== -->
    <section class="gym-view" id="view-programmes" hidden>
      <header class="gym-header">
        <a class="gym-header__back" href="#" onclick="gymNavigate('gym-home'); return false;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          GYM
        </a>
        <button class="gym-header__action" aria-label="Options">
          <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>
        </button>
      </header>

      <main class="gym-main">
        <div class="gym-anim-in" style="display:flex; flex-direction:column; gap:8px;">
          <h1 class="gym-title-xl">Programmes</h1>
          <p class="gym-subtitle">Créez et suivez vos programmes d'entraînement.</p>
        </div>

        <a class="btn btn-primary" href="#" onclick="gymNavigate('creer-programme'); return false;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Nouveau programme
        </a>

        <div class="tabs tabs--split" id="programmes-tabs">
          <button class="tab is-active" data-value="mes-programmes">Mes programmes</button>
          <button class="tab" data-value="bibliotheque">Bibliothèque</button>
        </div>

        <div class="gym-stagger" id="programmes-list" style="display:flex; flex-direction:column; gap:14px;"></div>
      </main>
    </section>

    <!-- ============================== VUE : DÉTAIL PROGRAMME ============================== -->
    <section class="gym-view" id="view-programme-detail" hidden>
      <header class="gym-header">
        <a class="gym-header__back" href="#" onclick="gymNavigate('programmes'); return false;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          GYM
        </a>
        <button class="gym-header__action" aria-label="Options">
          <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>
        </button>
      </header>

      <main class="gym-main">
        <div id="program-hero" class="gym-anim-in"></div>

        <div class="card" id="program-info-row"></div>

        <div class="card gym-anim-in" id="program-progress-card" style="display:flex; flex-direction:column; gap:16px;"></div>

        <section style="display:flex; flex-direction:column; gap:14px;">
          <div class="gym-section-head">
            <h2 class="gym-section-title">Séances</h2>
            <a class="gym-link" href="#" onclick="gymNavigate('creer-seance', {programme: gymGetParam('id','prog-force')}); return false;">Ajouter <span id="icon-add-session"></span></a>
          </div>
          <div class="gym-stagger" id="program-sessions-list" style="display:flex; flex-direction:column; gap:12px;"></div>
        </section>
      </main>
    </section>

    <!-- ============================== VUE : CRÉER UN PROGRAMME ============================== -->
    <section class="gym-view" id="view-creer-programme" hidden>
      <header class="gym-header">
        <a class="gym-header__back" href="#" onclick="gymNavigate('programmes'); return false;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          GYM
        </a>
        <button class="gym-header__action" aria-label="Réglages">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
        </button>
      </header>

      <main class="gym-main">
        <div class="cp-intro gym-anim-in">
          <div class="cp-intro__text">
            <span class="gym-eyebrow">Créer un programme</span>
            <h1 class="gym-title-xl">Ton programme sur mesure</h1>
          </div>
          <div class="hero-photo cp-hero">
            <div class="hero-photo__silhouette" style="width:90%;" id="cp-hero-icon"></div>
          </div>
        </div>

        <div class="card step step--inline gym-anim-in">
          <div class="step__head">
            <div>
              <p class="step__heading">Titre du programme</p>
            </div>
          </div>
          <label class="field">
            <span id="icon-field-titre"></span>
            <input type="text" id="input-titre" placeholder="Ex. : Prépa été" maxlength="60" />
          </label>
        </div>

        <div class="card step cp-goal gym-anim-in">
          <div class="step__head">
            <span class="step__number">1</span>
            <div>
              <p class="step__heading">Quel est ton objectif ?</p>
            </div>
          </div>
          <div class="choice-grid" id="objectif-grid"></div>
        </div>

        <div class="cp-row">
          <div class="card step gym-anim-in">
            <div class="step__head">
              <span class="step__number">2</span>
              <div>
                <p class="step__heading">Séances</p>
              </div>
            </div>
            <label class="field">
              <span id="icon-field-seances"></span>
              <input type="number" id="input-seances" min="1" max="7" placeholder="3" inputmode="numeric" />
              <span class="field__suffix">/ semaine</span>
            </label>
          </div>

          <div class="card step gym-anim-in">
            <div class="step__head">
              <span class="step__number">3</span>
              <div>
                <p class="step__heading">Durée</p>
              </div>
            </div>
            <label class="field">
              <span id="icon-field-duree"></span>
              <input type="number" id="input-duree" min="1" max="52" placeholder="8" inputmode="numeric" />
              <span class="field__suffix">semaines</span>
            </label>
          </div>
        </div>

        <div class="card card--accent cp-recap gym-anim-in">
          <div class="cp-recap__head">
            <div class="icon-circle" id="icon-recap-target"></div>
            <div>
              <p class="step__heading">Récapitulatif</p>
            </div>
          </div>
          <div class="summary-grid">
            <div class="summary-item"><span id="icon-recap-1"></span><span class="summary-item__label">Objectif</span><span class="summary-item__value" id="recap-objectif">Force</span></div>
            <div class="summary-item"><span id="icon-recap-2"></span><span class="summary-item__label">Séances</span><span class="summary-item__value" id="recap-seances">—</span></div>
            <div class="summary-item"><span id="icon-recap-3"></span><span class="summary-item__label">Durée</span><span class="summary-item__value" id="recap-duree">—</span></div>
          </div>
        </div>

        <button class="btn btn-primary" id="btn-generer">
          Générer mon programme
        </button>
      </main>
    </section>

    <!-- ============================== VUE : CRÉER UNE SÉANCE ============================== -->
    <section class="gym-view" id="view-creer-seance" hidden>
      <header class="gym-header">
        <a class="gym-header__back" href="#" onclick="gymNavigate('programme-detail', {id: gymGetParam('programme','prog-force')}); return false;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          GYM
        </a>
        <button class="gym-header__action" aria-label="Réglages">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
        </button>
      </header>

      <main class="gym-main">
        <div class="gym-anim-in" style="display:flex; flex-direction:column; gap:8px;">
          <span class="gym-eyebrow">Créer une séance</span>
          <h1 class="gym-title-xl">Configure ta séance</h1>
          <p class="gym-subtitle">Personnalise ta séance en quelques étapes. Tu pourras la modifier à tout moment.</p>
        </div>

        <div class="card" id="creer-seance-empty" style="display:none; text-align:center; flex-direction:column; align-items:center; gap:12px; padding:32px 20px;">
          <div class="icon-circle" id="creer-seance-empty-icon"></div>
          <div>
            <p class="list-row__title">Aucun programme disponible</p>
            <p class="list-row__meta">Crée d'abord un programme pour pouvoir y ajouter une séance.</p>
          </div>
          <a class="btn btn-primary" href="#" onclick="gymNavigate('creer-programme'); return false;" style="width:auto; padding:12px 22px; font-size:13.5px;">Créer un programme</a>
        </div>

        <div id="creer-seance-form" style="display:flex; flex-direction:column; gap:24px;">

        <!-- Étape 1 : programme -->
        <div class="card step gym-anim-in">
          <div class="step__head">
            <span class="step__number">1</span>
            <div>
              <p class="step__heading">Programme</p>
              <p class="step__hint">Choisis le programme dans lequel ajouter cette séance.</p>
            </div>
          </div>
          <button type="button" class="card card--interactive list-row" id="program-picker-btn" style="border-color:var(--gym-border-strong);">
            <div class="icon-circle icon-circle--sm" id="program-picker-icon"></div>
            <div class="list-row__body">
              <span class="list-row__title" id="program-picker-name">—</span>
              <span class="list-row__meta" id="program-picker-meta">—</span>
            </div>
            <span class="list-row__chevron" id="program-picker-chevron"></span>
          </button>
        </div>

        <!-- Étape 2 : catégorie -->
        <div class="card step gym-anim-in">
          <div class="step__head">
            <span class="step__number">2</span>
            <div>
              <p class="step__heading">Catégorie</p>
              <p class="step__hint">Sélectionne la catégorie principale de cette séance.</p>
            </div>
          </div>
          <div class="choice-grid" id="category-grid"></div>
        </div>

        <!-- Étape 3 : objectif -->
        <div class="card step gym-anim-in">
          <div class="step__head">
            <span class="step__number">3</span>
            <div>
              <p class="step__heading">Objectif</p>
              <p class="step__hint">Quel est l'objectif de cette séance ?</p>
            </div>
          </div>
          <div class="choice-grid" id="goal-grid"></div>
        </div>

        <!-- Étape 4 : exercices -->
        <div class="card step gym-anim-in">
          <div class="step__head" style="align-items:center;">
            <span class="step__number">4</span>
            <div style="flex:1;">
              <p class="step__heading">Exercices</p>
              <p class="step__hint">Ajoute les exercices de ta séance. Tu peux en ajouter plusieurs.</p>
            </div>
          </div>
          <button type="button" class="btn btn-primary" id="btn-add-exercise" style="width:auto; align-self:flex-end; padding:12px 18px; font-size:13.5px;">
            <span id="icon-plus-add"></span> Ajouter un exercice
          </button>
          <div id="exercise-list" style="display:flex; flex-direction:column;"></div>
        </div>

        <button class="btn btn-primary" id="btn-create-session">
          <span id="icon-check-create"></span> Créer la séance
        </button>

        </div>
      </main>
    </section>

    <!-- ============================== VUE : EXERCICES ============================== -->
    <section class="gym-view" id="view-exercices" hidden>
      <header class="gym-header">
        <a class="gym-header__back" href="#" onclick="gymNavigate('gym-home'); return false;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          GYM
        </a>
        <button class="gym-header__action" aria-label="Options">
          <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>
        </button>
      </header>

      <main class="gym-main">
        <div class="gym-anim-in" style="display:flex; gap:16px; align-items:flex-start;">
          <div style="flex:1; display:flex; flex-direction:column; gap:8px;">
            <span class="gym-eyebrow">Exercices</span>
            <h1 class="gym-title-xl">Tous les exercices</h1>
            <p class="gym-subtitle">Découvrez et explorez tous les exercices pour progresser à votre rythme.</p>
          </div>
          <div class="hero-photo" style="width:110px; height:110px; flex-shrink:0; min-height:0;">
            <div class="hero-photo__silhouette" id="ex-hero-icon" style="width:90%;"></div>
          </div>
        </div>

        <div class="tabs gym-anim-in" id="region-tabs">
          <button class="tab is-active" data-value="tous">Tous</button>
          <button class="tab" data-value="haut-du-corps">Haut du corps</button>
          <button class="tab" data-value="bas-du-corps">Bas du corps</button>
          <button class="tab" data-value="gainage">Gainage</button>
          <button class="tab" data-value="mobilite">Mobilité</button>
        </div>

        <label class="search-bar gym-anim-in">
          <span id="icon-search"></span>
          <input type="search" id="search-input" placeholder="Rechercher un exercice ou une catégorie" />
        </label>

        <div class="gym-stagger" id="category-list" style="display:flex; flex-direction:column; gap:12px;"></div>

        <button type="button" class="disclosure" id="advanced-filter-toggle">
          <span id="icon-sliders"></span>
          Filtrer les exercices
          <span id="icon-chevron-filter"></span>
        </button>

        <div class="card" id="advanced-filter-panel" style="display:none; flex-direction:column; gap:16px;">
          <div>
            <p class="step__hint" style="margin-bottom:10px;">Équipement</p>
            <div class="tabs" id="equipment-filter">
              <button class="tab is-active" data-value="tous">Tous</button>
              <button class="tab" data-value="avec-materiel">Avec matériel</button>
              <button class="tab" data-value="poids-du-corps">Poids du corps</button>
            </div>
          </div>
          <div>
            <p class="step__hint" style="margin-bottom:10px;">Niveau</p>
            <div class="tabs" id="level-filter">
              <button class="tab is-active" data-value="tous">Tous</button>
              <button class="tab" data-value="debutant">Débutant</button>
              <button class="tab" data-value="intermediaire">Intermédiaire</button>
              <button class="tab" data-value="avance">Avancé</button>
            </div>
          </div>
        </div>
      </main>
    </section>

    <!-- ============================== VUE : SÉANCE ACTIVE ============================== -->
    <section class="gym-view" id="view-seance-active" hidden>
      <div class="session-shell">

        <header class="session-header">
          <a class="session-header__back" href="#" id="seance-active-back" aria-label="Retour">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </a>
          <div class="session-header__title">
            <span class="session-header__name">Séance en cours</span>
            <span class="session-header__meta" id="session-eyebrow">—</span>
          </div>
          <div class="session-header__timer">
            <span class="session-header__timer-icon" id="icon-session-timer"></span>
            <span class="session-header__timer-value" id="session-timer">00:00:00</span>
            <button type="button" class="session-header__pause" id="btn-reset-timer" aria-label="Réinitialiser le chrono">
              <span id="icon-session-reset"></span>
            </button>
            <button type="button" class="session-header__pause" id="btn-toggle-timer" aria-label="Mettre en pause">
              <span id="icon-session-pause"></span>
            </button>
          </div>
        </header>

        <main class="session-main">

          <!-- État vide : aucune séance active -->
          <div class="gym-anim-in" id="session-empty" style="display:none; flex-direction:column; gap:10px;">
            <h1 class="gym-title-xl" id="session-empty-title">Aucune séance active</h1>
            <p class="gym-subtitle" id="session-empty-subtitle">Crée un programme et ajoute-y une séance pour commencer à t'entraîner.</p>
          </div>

          <!-- Contenu de la séance en cours -->
          <div class="gym-anim-in" id="session-content" style="display:none; flex-direction:column; gap:16px;">

            <!-- Exercice courant : navigation + titre -->
            <div class="session-exercise-hero">
              <div class="session-exercise-hero__nav">
                <button type="button" class="session-exercise-hero__arrow" id="btn-prev-exercise" aria-label="Exercice précédent">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <span class="gym-eyebrow" id="session-exo-position">EXERCICE — / —</span>
                <button type="button" class="session-exercise-hero__arrow" id="btn-next-exercise" aria-label="Exercice suivant">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
              <h1 class="session-exercise-hero__title" id="session-exercise-title">—</h1>
            </div>

            <div class="card session-summary" id="session-info-row"></div>

            <div class="session-sets-list" id="session-sets-list"></div>

          </div>

        </main>

        <div class="session-actions" id="session-actions" style="display:none;">
          <button type="button" class="btn btn-secondary session-actions__finish" id="btn-finish-session">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Terminer la séance
          </button>
          <button type="button" class="btn btn-primary session-actions__next" id="btn-next-series">
            <span id="session-next-label">Série suivante</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
        </div>

      </div>
    </section>

    <!-- ============================== VUE : PROGRESSION ============================== -->
    <section class="gym-view" id="view-progression" hidden>
      <header class="gym-header">
        <a class="gym-header__back" href="#" onclick="gymNavigate('gym-home'); return false;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          GYM
        </a>
        <button class="gym-header__action" aria-label="Options">
          <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>
        </button>
      </header>

      <main class="gym-main">
        <div class="gym-anim-in" style="display:flex; flex-direction:column; gap:8px;">
          <span class="gym-eyebrow">Progression</span>
          <h1 class="gym-title-xl">Progression</h1>
          <p class="gym-subtitle">Suivez l'évolution de vos performances et de votre condition physique.</p>
        </div>

        <div class="card gym-anim-in" style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:14px; padding:40px 24px;">
          <div class="icon-circle" id="progression-empty-icon"></div>
          <div>
            <p class="list-row__title">Pas encore de données</p>
            <p class="list-row__meta">Termine tes premières séances pour voir apparaître ta progression ici.</p>
          </div>
        </div>
      </main>
    </section>

    <!-- ============================== VUE : HISTORIQUE ============================== -->
    <section class="gym-view" id="view-historique" hidden>
      <header class="gym-header">
        <a class="gym-header__back" href="#" onclick="gymNavigate('gym-home'); return false;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          GYM
        </a>
        <button class="gym-header__action" aria-label="Options">
          <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>
        </button>
      </header>

      <main class="gym-main">
        <div class="gym-anim-in" style="display:flex; flex-direction:column; gap:8px;">
          <span class="gym-eyebrow">Historique</span>
          <h1 class="gym-title-xl">Historique</h1>
          <p class="gym-subtitle">Consultez vos séances et suivez vos entraînements.</p>
        </div>

        <div class="tabs gym-anim-in" id="history-tabs">
          <button class="tab is-active" data-value="tous">Tous</button>
          <button class="tab" data-value="programme">Programmes</button>
          <button class="tab" data-value="libre">Séances libres</button>
          <button class="tab" data-value="exercice">Exercices</button>
        </div>

        <div id="history-groups" style="display:flex; flex-direction:column; gap:24px;"></div>

        <div id="history-skeleton" style="display:none; flex-direction:column; gap:12px;">
          <div class="skeleton-row"><div class="skeleton-block" style="width:64px; height:64px; border-radius:14px;"></div><div style="flex:1; display:flex; flex-direction:column; gap:8px;"><div class="skeleton-block" style="width:60%; height:14px;"></div><div class="skeleton-block" style="width:40%; height:12px;"></div></div></div>
          <div class="skeleton-row"><div class="skeleton-block" style="width:64px; height:64px; border-radius:14px;"></div><div style="flex:1; display:flex; flex-direction:column; gap:8px;"><div class="skeleton-block" style="width:50%; height:14px;"></div><div class="skeleton-block" style="width:35%; height:12px;"></div></div></div>
        </div>

        <button type="button" class="disclosure" id="load-more-btn">
          <span id="icon-doc-more"></span>
          Plus de séances
          <span id="icon-chevron-more"></span>
        </button>
      </main>
    </section>

    <!-- ============================== VUE : OBJECTIFS ============================== -->
    <section class="gym-view" id="view-objectifs" hidden>
      <header class="gym-header">
        <a class="gym-header__back" href="#" onclick="gymNavigate('gym-home'); return false;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          GYM
        </a>
        <button class="gym-header__action" aria-label="Réglages">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
        </button>
      </header>

      <main class="gym-main">
        <div class="gym-anim-in" style="display:flex; flex-direction:column; gap:8px;">
          <span class="gym-eyebrow">Objectifs</span>
          <h1 class="gym-title-xl">Vos objectifs</h1>
          <p class="gym-subtitle">Fixez-vous des objectifs et suivez vos progrès pour atteindre vos rêves.</p>
        </div>

        <div class="card gym-anim-in" style="display:flex; align-items:center; gap:16px;">
          <div style="flex:1; display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <div class="icon-circle icon-circle--sm" id="hero-target-icon"></div>
              <span class="list-row__title" style="font-size:15px;">Un objectif clair = des résultats concrets</span>
            </div>
            <p class="list-row__meta">Que ce soit pour t'affiner, gagner en force ou améliorer ton endurance, chaque objectif compte !</p>
          </div>
          <div class="hero-photo" style="width:90px; height:90px; min-height:0; flex-shrink:0;">
            <div class="hero-photo__silhouette" style="width:85%;" id="hero-photo-icon"></div>
          </div>
        </div>

        <section style="display:flex; flex-direction:column; gap:14px;">
          <div class="gym-section-head">
            <h2 class="gym-section-title">Mes objectifs</h2>
            <a class="gym-link" href="#objectifs-grid">Voir tous <span id="icon-voir-tous"></span></a>
          </div>
          <div class="choice-grid choice-grid--2 gym-stagger" id="objectifs-grid" style="align-items:stretch;"></div>
        </section>

        <div class="card gym-anim-in" style="display:flex; flex-direction:column; gap:18px;">
          <span class="list-row__title">Comment ça marche ?</span>
          <div class="howto" id="howto-steps"></div>
        </div>

        <button class="btn btn-primary" id="btn-new-goal">
          <span id="icon-plus-goal"></span> Créer un nouvel objectif
        </button>
      </main>
    </section>

  </div>

  <!-- Bottom sheet : choix d'une séance créée à lancer (accueil) -->
  <div class="sheet-overlay" id="launch-sheet-overlay"></div>
  <div class="sheet" id="launch-sheet">
    <div class="sheet__handle"></div>
    <div class="sheet__head">
      <span class="sheet__title">Lancer une séance</span>
      <button type="button" class="icon-btn" id="launch-sheet-close" style="color:var(--gym-text);"></button>
    </div>
    <div class="sheet__body" id="launch-sheet-body"></div>
  </div>

  <!-- Bottom sheet : choix du programme (vue Créer une séance) -->
  <div class="sheet-overlay" id="program-sheet-overlay"></div>
  <div class="sheet" id="program-sheet">
    <div class="sheet__handle"></div>
    <div class="sheet__head">
      <span class="sheet__title">Choisir un programme</span>
      <button type="button" class="icon-btn" id="program-sheet-close" style="color:var(--gym-text);"></button>
    </div>
    <div class="sheet__body" id="program-sheet-body"></div>
  </div>

  <!-- Bottom sheet : ajout d'un exercice (vue Créer une séance) -->
  <div class="sheet-overlay" id="sheet-overlay"></div>
  <div class="sheet" id="exercise-sheet">
    <div class="sheet__handle"></div>
    <div class="sheet__head">
      <span class="sheet__title">Ajouter un exercice</span>
      <button type="button" class="icon-btn" id="sheet-close" style="color:var(--gym-text);"></button>
    </div>
    <div style="padding:4px 20px 12px;">
      <label class="search-bar">
        <span id="icon-sheet-search"></span>
        <input type="search" id="sheet-search-input" placeholder="Rechercher un exercice (nom, muscle...)" />
      </label>
    </div>
    <div class="sheet__body" id="sheet-body"></div>
  </div>

  <!-- Bottom sheet : création d'un objectif (vue Objectifs) -->
  <div class="sheet-overlay" id="goal-sheet-overlay"></div>
  <div class="sheet" id="goal-sheet">
    <div class="sheet__handle"></div>
    <div class="sheet__head">
      <span class="sheet__title">Nouvel objectif</span>
      <button type="button" class="icon-btn" id="goal-sheet-close" style="color:var(--gym-text);"></button>
    </div>
    <div class="sheet__body" style="gap:20px;">
      <div>
        <p class="step__hint" style="margin-bottom:10px;">Type d'objectif</p>
        <div class="choice-grid" id="goal-type-grid"></div>
      </div>
      <label class="field">
        <span id="icon-goal-title"></span>
        <input type="text" id="goal-title-input" placeholder="Nom de l'objectif" />
      </label>
      <label class="field">
        <span id="icon-goal-target"></span>
        <input type="text" id="goal-progress-input" placeholder="Ex. : 3 km / 5 km" />
      </label>
      <button class="btn btn-primary" id="btn-create-goal">Créer l'objectif</button>
    </div>
`;

/* ==========================================================================
   GYM — Bibliothèque d'icônes SVG inline
   Style : outline, stroke=currentColor, cohérent avec le design system.
   Utilisation : ICONS.dumbbell, ICONS.chevronRight, etc.
   ========================================================================== */

const ICONS = {
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`,

  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,

  more: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>`,

  dumbbell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 7v10M4 9v6M17.5 7v10M20 9v6M8.5 12h7"/></svg>`,

  running: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="15.5" cy="5" r="1.6" fill="currentColor" stroke="none"/><path d="M9 21l2-5 2.3-2M4 13l4-2.5 2.7 1.8L14.5 9l3 1.5M11.3 12.3L9.5 17l-4 1.5"/></svg>`,

  muscle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 20c-1-3.5 0-7 2-9.5C8.5 8 9 5.5 8 4c2.5-1 5 .5 5.5 3 2-1 4 0 4.5 2.5.6 3-1 6-3 7.5-1 .8-1.5 1.7-1.5 3"/><path d="M9 20h8"/></svg>`,

  bolt: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13 2L4 14h6l-1 8 9-13h-6l1-7z"/></svg>`,

  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>`,

  calendarPlus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17M12 14v5M9.5 16.5h5"/></svg>`,

  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>`,

  timer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2h4M12 5v3"/><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5"/></svg>`,

  tempo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 11-3-6.7"/><path d="M21 3v5h-5"/></svg>`,

  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`,

  chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`,

  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>`,

  checkCircle: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.2 14.3L6.5 12l1.4-1.4 2.9 2.9 5.9-5.9 1.4 1.4-7.3 7.3z"/></svg>`,

  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`,

  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4.5h6V7M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>`,

  target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>`,

  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.6-9.7-9.3C.8 7.8 2.5 4.5 6 4c2-.3 3.7.7 6 3 2.3-2.3 4-3.3 6-3 3.5.5 5.2 3.8 3.7 7.2C19.5 15.9 12 20.5 12 20.5z"/></svg>`,

  trendUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8M15 7h6v6"/></svg>`,

  trendDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l6 6 4-4 8 8M15 17h6v-6"/></svg>`,

  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V7a4 4 0 018 0v3.5"/></svg>`,

  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>`,

  sliders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h10M18 6h2M4 12h2M8 12h12M4 18h14M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>`,

  star: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2.5l2.9 6.2 6.6.7-5 4.6 1.4 6.6L12 17.6l-5.9 3 1.4-6.6-5-4.6 6.6-.7z"/></svg>`,

  barChart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19V10M12 19V5M19 19v-6"/></svg>`,

  play: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M7 4.5v15l13-7.5z"/></svg>`,

  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l.9-4.3L16.6 4.9a1.6 1.6 0 012.3 0l.2.2a1.6 1.6 0 010 2.3L8.3 19.1 4 20z"/></svg>`,

  doc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>`,

  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/></svg>`,

  legs: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6l.6 9.5.9 8a1.5 1.5 0 01-1.5 1.5h-.6a1.5 1.5 0 01-1.5-1.3L12 13l-.9 7.7a1.5 1.5 0 01-1.5 1.3h-.6A1.5 1.5 0 017.5 20l.9-8z"/></svg>`,

  torso: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4L4 6.5 5.5 10 8 8.5V20h8V8.5l2.5 1.5L20 6.5 16 4c-1 1-2.5 1.5-4 1.5S9 5 8 4z"/></svg>`,

  abs: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="4" width="10" height="16" rx="3"/><path d="M7 9.5h10M7 14.5h10M12 4v16"/></svg>`,

  backMuscle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c-2 2-2.5 3-6 3.5M12 3c2 2 2.5 3 6 3.5M6 6.5c-1 4 0 9-2 13M18 6.5c1 4 0 9 2 13M9 10c1 3 1 7-.5 10M15 10c-1 3-1 7 .5 10M12 3v8"/></svg>`,

  shoulders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15c0-4 2-6 4-6M21 15c0-4-2-6-4-6M7 9a5 5 0 0110 0M4 20c1-3 2-5 5-5M20 20c-1-3-2-5-5-5"/></svg>`,

  arms: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4v6c0 3 1.5 5 3 5.5M7 4c2 0 3 1 3 3M14 20l-1-6-3-1.5"/><circle cx="15" cy="18" r="2.2"/></svg>`,

  glutes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5c-3 0-5 3-5 7 0 4.5 2.5 8 5.5 8 1.8 0 2.3-1.5 3.5-1.5s1.7 1.5 3.5 1.5c3 0 5.5-3.5 5.5-8 0-4-2-7-5-7-2 0-3 1-4 1s-2-1-4-1z"/></svg>`,

  mobility: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="1.6" fill="currentColor" stroke="none"/><path d="M12 6v6l-4 6M12 12l4.5 2M8 8l4 2 5-2.5"/></svg>`,

  functional: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18c2-1 2-3 4-3s2 2 4 2 2-2 4-2 2 2 4 2M4 8l3 3M17 8l3 3M9 9l3 3 3-3"/></svg>`,

  equipment: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9v6M22 9v6M6 6v12M18 6v12M6 12h12"/></svg>`,

  bodyweight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4.5" r="2"/><path d="M12 7v6M12 13l-4 6M12 13l4 6M7 9l5-2 5 2"/></svg>`,

  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 8v.01"/></svg>`,

  arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,

  sparkles: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M11 2l1.2 3.8L16 7l-3.8 1.2L11 12l-1.2-3.8L6 7l3.8-1.2z"/><path d="M18.5 13l.7 2.1L21.3 16l-2.1.7-.7 2.1-.7-2.1L15.7 16l2.1-.9z"/></svg>`,

  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-7 8 7"/><path d="M6 9.5V20h12V9.5"/></svg>`,

  pause: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg>`,

  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="6" rx="7" ry="2.6"/><path d="M5 6v5c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6"/><path d="M5 11v5c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-5"/></svg>`,

  reset: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 11-2.7-6M20 4v5h-5"/></svg>`,
};


/* ==========================================================================
   GYM — Données mockées
   Aucune donnée ne vient d'un backend : tout est généré ici pour permettre
   à chaque page de fonctionner de façon autonome.
   ========================================================================== */

/* ---- Utilitaires de date --------------------------------------------------
   Les séances/objectifs sont calculés par rapport à "aujourd'hui" pour que
   la démo reste cohérente peu importe la date à laquelle elle est ouverte. */

function gymAddDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function gymFormatDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  const mois = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
  ];
  return `${d.getDate().toString().padStart(2, "0")} ${mois[d.getMonth()]} ${d.getFullYear()}`;
}

function gymFormatMonthYear(date) {
  const d = date instanceof Date ? date : new Date(date);
  const mois = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
  ];
  return `${mois[d.getMonth()]} ${d.getFullYear()}`;
}

const GYM_TODAY = new Date();

/* ---- Exercices (source : exercises-fr.json) -------------------------------- */

const EXERCISES = [
  { id: "0001", name: "3/4 sit-up", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0002", name: "45° side bend", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0003", name: "Air bike", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1512", name: "All fours squad stretch", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0006", name: "Alternate heel touchers", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0007", name: "Alternate lateral pulldown", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1368", name: "Ankle circles", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "3293", name: "Archer pull up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "3294", name: "Archer push up", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "2355", name: "Arm slingers hanging bent knee legs", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "2333", name: "Arm slingers hanging straight legs", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3214", name: "Arms apart circular toe touch (male)", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "3204", name: "Arms overhead full sit-up (male)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0009", name: "Assisted chest dip (kneeling)", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0011", name: "Assisted hanging knee raise", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0010", name: "Assisted hanging knee raise with throw down", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "1708", name: "Assisted lying calves stretch", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1709", name: "Assisted lying glutes stretch", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1710", name: "Assisted lying gluteus and piriformis stretch", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0012", name: "Assisted lying leg raise with lateral throw down", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0013", name: "Assisted lying leg raise with throw down", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0014", name: "Assisted motion russian twist", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0015", name: "Assisted parallel close grip pull-up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0016", name: "Assisted prone hamstring", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1713", name: "Assisted prone lying quads stretch", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1714", name: "Assisted prone rectus femoris stretch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0017", name: "Assisted pull-up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1716", name: "Assisted seated pectoralis major stretch with stability ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1712", name: "Assisted side lying adductor stretch", muscle: "Adducteurs", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1758", name: "Assisted sit-up", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "1431", name: "Assisted standing chin-up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1432", name: "Assisted standing pull-up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0018", name: "Assisted standing triceps extension (with towel)", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0019", name: "Assisted triceps dip (kneeling)", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2364", name: "Assisted wide-grip chest dip (kneeling)", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "3220", name: "Astride jumps (male)", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "running" },
  { id: "3672", name: "Back and forth step", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "running" },
  { id: "1314", name: "Back extension on exercise ball", muscle: "Colonne vertébrale", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "3297", name: "Back lever", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "1405", name: "Back pec stretch", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "1473", name: "Backward jump", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0020", name: "Balance board", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0968", name: "Band alternating biceps curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0969", name: "Band alternating v-up", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0970", name: "Band assisted pull-up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0971", name: "Band assisted wheel rollerout", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "1254", name: "Band bench press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0980", name: "Band bent-over hip extension", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0972", name: "Band bicycle crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0974", name: "Band close-grip pulldown", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0975", name: "Band close-grip push-up", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0976", name: "Band concentration curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "3117", name: "Band fixed back close grip pulldown", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "3116", name: "Band fixed back underhand pulldown", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0977", name: "Band front lateral raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0978", name: "Band front raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1408", name: "Band hip lift", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0979", name: "Band horizontal pallof press", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0981", name: "Band jack knife sit-up", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0983", name: "Band kneeling one arm pulldown", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0985", name: "Band kneeling twisting crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0984", name: "Band lying hip internal rotation", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1002", name: "Band lying straight leg raise", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0986", name: "Band one arm overhead biceps curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0987", name: "Band one arm single leg split squat", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0988", name: "Band one arm standing low row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0989", name: "Band one arm twisting chest press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0990", name: "Band one arm twisting seated row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0991", name: "Band pull through", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0992", name: "Band push sit-up", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0993", name: "Band reverse fly", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0994", name: "Band reverse wrist curl", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0996", name: "Band seated hip internal rotation", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1011", name: "Band seated twist", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0997", name: "Band shoulder press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1018", name: "Band shrug", muscle: "Trapèzes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0998", name: "Band side triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0999", name: "Band single leg calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1000", name: "Band single leg reverse calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1001", name: "Band single leg split squat", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1004", name: "Band squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1003", name: "Band squat row", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1005", name: "Band standing crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "1022", name: "Band standing rear delt row", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1007", name: "Band standing twisting crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "1008", name: "Band step-up", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1009", name: "Band stiff leg deadlift", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1023", name: "Band straight back stiff leg deadlift", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1010", name: "Band straight leg deadlift", muscle: "Colonne vertébrale", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1012", name: "Band twisting overhead press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1369", name: "Band two legs calf raise - (band under both legs) v. 2", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1013", name: "Band underhand pulldown", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1014", name: "Band v-up", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "1015", name: "Band vertical pallof press", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "1016", name: "Band wrist curl", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1017", name: "Band y-raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0023", name: "Barbell alternate biceps curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0024", name: "Barbell bench front squat", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0025", name: "Barbell bench press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0026", name: "Barbell bench squat", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1316", name: "Barbell bent arm pullover", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0027", name: "Barbell bent over row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "2407", name: "Barbell biceps curl (with arm blaster)", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0028", name: "Barbell clean and press", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0029", name: "Barbell clean-grip front squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0030", name: "Barbell close-grip bench press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0031", name: "Barbell curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0032", name: "Barbell deadlift", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0033", name: "Barbell decline bench press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0034", name: "Barbell decline bent arm pullover", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0035", name: "Barbell decline close grip to skull press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1255", name: "Barbell decline pullover", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0036", name: "Barbell decline wide-grip press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0037", name: "Barbell decline wide-grip pullover", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0038", name: "Barbell drag curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1370", name: "Barbell floor calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0039", name: "Barbell front chest squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0041", name: "Barbell front raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0040", name: "Barbell front raise and pullover", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0042", name: "Barbell front squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0043", name: "Barbell full squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1461", name: "Barbell full squat (back pov)", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1462", name: "Barbell full squat (side pov)", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1545", name: "Barbell full zercher squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1409", name: "Barbell glute bridge", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "3562", name: "Barbell glute bridge two legs on bench (male)", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0044", name: "Barbell good morning", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0045", name: "Barbell guillotine bench press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0046", name: "Barbell hack squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1436", name: "Barbell high bar squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0047", name: "Barbell incline bench press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1719", name: "Barbell incline close grip bench press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0048", name: "Barbell incline reverse-grip press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0049", name: "Barbell incline row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0050", name: "Barbell incline shoulder raise", muscle: "Dentelé antérieur", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0051", name: "Barbell jefferson squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0052", name: "Barbell jm bench press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0053", name: "Barbell jump squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1410", name: "Barbell lateral lunge", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1435", name: "Barbell low bar squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0054", name: "Barbell lunge", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1720", name: "Barbell lying back of the head tricep extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0055", name: "Barbell lying close-grip press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0056", name: "Barbell lying close-grip triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0057", name: "Barbell lying extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0058", name: "Barbell lying lifting (on hip)", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0059", name: "Barbell lying preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0061", name: "Barbell lying triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0060", name: "Barbell lying triceps extension skull crusher", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0063", name: "Barbell narrow stance squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0064", name: "Barbell one arm bent over row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0065", name: "Barbell one arm floor press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0066", name: "Barbell one arm side deadlift", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0067", name: "Barbell one arm snatch", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0068", name: "Barbell one leg squat", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0069", name: "Barbell overhead squat", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1411", name: "Barbell palms down wrist curl over a bench", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1412", name: "Barbell palms up wrist curl over a bench", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "3017", name: "Barbell pendlay row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1751", name: "Barbell pin presses", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0070", name: "Barbell preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0071", name: "Barbell press sit-up", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0072", name: "Barbell prone incline curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0073", name: "Barbell pullover", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0022", name: "Barbell pullover to press", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0074", name: "Barbell rack pull", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0075", name: "Barbell rear delt raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0076", name: "Barbell rear delt row", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0078", name: "Barbell rear lunge", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0077", name: "Barbell rear lunge v. 2", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0079", name: "Barbell revers wrist curl v. 2", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2187", name: "Barbell reverse close-grip bench press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0080", name: "Barbell reverse curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0118", name: "Barbell reverse grip bent over row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1256", name: "Barbell reverse grip decline bench press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1257", name: "Barbell reverse grip incline bench press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1317", name: "Barbell reverse grip incline bench row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1721", name: "Barbell reverse grip skullcrusher", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0081", name: "Barbell reverse preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0082", name: "Barbell reverse wrist curl", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0084", name: "Barbell rollerout", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0083", name: "Barbell rollerout from bench", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0085", name: "Barbell romanian deadlift", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0086", name: "Barbell seated behind head military press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0087", name: "Barbell seated bradford rocky press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0088", name: "Barbell seated calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1371", name: "Barbell seated calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1718", name: "Barbell seated close grip behind neck triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0089", name: "Barbell seated close-grip concentration curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0090", name: "Barbell seated good morning", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0091", name: "Barbell seated overhead press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0092", name: "Barbell seated overhead triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0094", name: "Barbell seated twist", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0095", name: "Barbell shrug", muscle: "Trapèzes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0096", name: "Barbell side bent v. 2", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0098", name: "Barbell side split squat", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0097", name: "Barbell side split squat v. 2", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1756", name: "Barbell single leg deadlift", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0099", name: "Barbell single leg split squat", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "2799", name: "Barbell sitted alternate leg raise", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "2800", name: "Barbell sitted alternate leg raise (female)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0100", name: "Barbell skier", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0101", name: "Barbell speed squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "2810", name: "Barbell split squat v. 2", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0102", name: "Barbell squat (on knees)", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "2798", name: "Barbell squat jump step rear lunge", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0103", name: "Barbell standing ab rollerout", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0104", name: "Barbell standing back wrist curl", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0105", name: "Barbell standing bradford press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1372", name: "Barbell standing calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0106", name: "Barbell standing close grip curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1456", name: "Barbell standing close grip military press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "2414", name: "Barbell standing concentration curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0107", name: "Barbell standing front raise over head", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0108", name: "Barbell standing leg calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0109", name: "Barbell standing overhead triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0110", name: "Barbell standing reverse grip curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0111", name: "Barbell standing rocking leg calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0112", name: "Barbell standing twist", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "1629", name: "Barbell standing wide grip biceps curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1457", name: "Barbell standing wide military press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0113", name: "Barbell standing wide-grip curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0114", name: "Barbell step-up", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0115", name: "Barbell stiff leg good morning", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0116", name: "Barbell straight leg deadlift", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0117", name: "Barbell sumo deadlift", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "3305", name: "Barbell thruster", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0120", name: "Barbell upright row", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0119", name: "Barbell upright row v. 2", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0121", name: "Barbell upright row v. 3", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0122", name: "Barbell wide bench press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1258", name: "Barbell wide reverse grip bench press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0124", name: "Barbell wide squat", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0123", name: "Barbell wide-grip upright row", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0126", name: "Barbell wrist curl", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0125", name: "Barbell wrist curl v. 2", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0127", name: "Barbell zercher squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "3212", name: "Basic toe touch (male)", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0128", name: "Battling ropes", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "3360", name: "Bear crawl", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "running" },
  { id: "1259", name: "Behind head chest stretch", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0129", name: "Bench dip (knees bent)", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "1399", name: "Bench dip on floor", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "0130", name: "Bench hip extension", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "3019", name: "Bench pull-ups", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "3639", name: "Bent knee lying twist (male)", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1770", name: "Biceps leg concentration curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "0139", name: "Biceps narrow pull-ups", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "0140", name: "Biceps pull-up", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "0137", name: "Body-up", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "3543", name: "Bodyweight drop jump squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "3544", name: "Bodyweight incline side plank", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1771", name: "Bodyweight kneeling triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "1769", name: "Bodyweight side lying biceps curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "3168", name: "Bodyweight squatting row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "3167", name: "Bodyweight squatting row (with towel)", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "1373", name: "Bodyweight standing calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "3156", name: "Bodyweight standing close-grip one arm row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "3158", name: "Bodyweight standing close-grip row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "3162", name: "Bodyweight standing one arm row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "3161", name: "Bodyweight standing one arm row (with towel)", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "3166", name: "Bodyweight standing row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "3165", name: "Bodyweight standing row (with towel)", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "0138", name: "Bottoms-up", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1374", name: "Box jump down with one leg stabilization", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "2466", name: "Bridge - mountain climber (cross body)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1160", name: "Burpee", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "running" },
  { id: "0870", name: "Butt-ups", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1494", name: "Butterfly yoga pose", muscle: "Adducteurs", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0148", name: "Cable alternate shoulder press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0149", name: "Cable alternate triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "3235", name: "Cable assisted inverse leg curl", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0150", name: "Cable bar lateral pulldown", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0151", name: "Cable bench press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1630", name: "Cable close grip curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1631", name: "Cable concentration curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0152", name: "Cable concentration extension (on knee)", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0153", name: "Cable cross-over lateral pulldown", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0154", name: "Cable cross-over revers fly", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0155", name: "Cable cross-over variation", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0868", name: "Cable curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0157", name: "Cable deadlift", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0158", name: "Cable decline fly", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1260", name: "Cable decline one arm press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1261", name: "Cable decline press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0159", name: "Cable decline seated wide-grip row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1632", name: "Cable drag curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0160", name: "Cable floor seated wide-grip row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0161", name: "Cable forward raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0162", name: "Cable front raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0164", name: "Cable front shoulder raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0165", name: "Cable hammer curl (with rope)", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1722", name: "Cable high pulley overhead tricep extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0167", name: "Cable high row (kneeling)", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0168", name: "Cable hip adduction", muscle: "Adducteurs", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0169", name: "Cable incline bench press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1318", name: "Cable incline bench row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0171", name: "Cable incline fly", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0170", name: "Cable incline fly (on stability ball)", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0172", name: "Cable incline pushdown", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0173", name: "Cable incline triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0174", name: "Cable judo flip", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0860", name: "Cable kickback", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0175", name: "Cable kneeling crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "3697", name: "Cable kneeling rear delt row (with rope) (male)", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0176", name: "Cable kneeling triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2330", name: "Cable lat pulldown full range of motion", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0177", name: "Cable lateral pulldown (with rope attachment)", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "2616", name: "Cable lateral pulldown with v-bar", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0178", name: "Cable lateral raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0179", name: "Cable low fly", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0180", name: "Cable low seated row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1634", name: "Cable lying bicep curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0182", name: "Cable lying close-grip curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0184", name: "Cable lying extension pullover (with rope attachment)", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0185", name: "Cable lying fly", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0186", name: "Cable lying triceps extension v. 2", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0188", name: "Cable middle fly", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0189", name: "Cable one arm bent over row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0190", name: "Cable one arm curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1262", name: "Cable one arm decline chest fly", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1263", name: "Cable one arm fly on exercise ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1264", name: "Cable one arm incline fly on exercise ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1265", name: "Cable one arm incline press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1266", name: "Cable one arm incline press on exercise ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0191", name: "Cable one arm lateral bent-over", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0192", name: "Cable one arm lateral raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1633", name: "Cable one arm preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1267", name: "Cable one arm press on exercise ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "3563", name: "Cable one arm pulldown", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1635", name: "Cable one arm reverse preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0193", name: "Cable one arm straight back high row (kneeling)", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1723", name: "Cable one arm tricep pushdown", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1636", name: "Cable overhead curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1637", name: "Cable overhead curl on exercise ball", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0194", name: "Cable overhead triceps extension (rope attachment)", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1319", name: "Cable palm rotational row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0195", name: "Cable preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1268", name: "Cable press on exercise ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0196", name: "Cable pull through (with rope)", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0198", name: "Cable pulldown", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0197", name: "Cable pulldown (pro lat bar)", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1638", name: "Cable pulldown bicep curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0201", name: "Cable pushdown", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0199", name: "Cable pushdown (straight arm) v. 2", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0200", name: "Cable pushdown (with rope attachment)", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0202", name: "Cable rear delt row (stirrups)", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0203", name: "Cable rear delt row (with rope)", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0204", name: "Cable rear drive", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0205", name: "Cable rear pulldown", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0873", name: "Cable reverse crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0206", name: "Cable reverse curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2406", name: "Cable reverse grip triceps pushdown (sz-bar) (with arm blaster)", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1413", name: "Cable reverse one arm curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0209", name: "Cable reverse preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0210", name: "Cable reverse wrist curl", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0207", name: "Cable reverse-grip pushdown", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0208", name: "Cable reverse-grip straight back seated high row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1320", name: "Cable rope crossover seated row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1321", name: "Cable rope elevated seated row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1322", name: "Cable rope extension incline bench row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1639", name: "Cable rope hammer preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1724", name: "Cable rope high pulley overhead tricep extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1725", name: "Cable rope incline tricep extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1726", name: "Cable rope lying on floor tricep extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1640", name: "Cable rope one arm hammer preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1323", name: "Cable rope seated row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0211", name: "Cable russian twists (on stability ball)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "2144", name: "Cable seated chest press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0212", name: "Cable seated crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "1641", name: "Cable seated curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0213", name: "Cable seated high row (v-bar)", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0214", name: "Cable seated one arm alternate row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1642", name: "Cable seated one arm concentration curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1643", name: "Cable seated overhead curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0215", name: "Cable seated rear lateral raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0861", name: "Cable seated row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0216", name: "Cable seated shoulder internal rotation", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "2399", name: "Cable seated twist", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0218", name: "Cable seated wide-grip row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0219", name: "Cable shoulder press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0220", name: "Cable shrug", muscle: "Trapèzes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0222", name: "Cable side bend", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0221", name: "Cable side bend crunch (bosu ball)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0223", name: "Cable side crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "1717", name: "Cable squat row (with rope attachment)", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1644", name: "Cable squatting curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0224", name: "Cable standing back wrist curl", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1375", name: "Cable standing calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0225", name: "Cable standing cross-over high reverse fly", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0226", name: "Cable standing crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0874", name: "Cable standing crunch (with rope attachment)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0227", name: "Cable standing fly", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0228", name: "Cable standing hip extension", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0229", name: "Cable standing inner curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0230", name: "Cable standing lift", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0231", name: "Cable standing one arm triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1376", name: "Cable standing one leg calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0232", name: "Cable standing pulldown (with rope)", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0233", name: "Cable standing rear delt row (with rope)", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1727", name: "Cable standing reverse grip one arm overhead tricep extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0234", name: "Cable standing row (v-bar)", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0235", name: "Cable standing shoulder external rotation", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0236", name: "Cable standing twist row (v-bar)", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1269", name: "Cable standing up straight crossovers", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0238", name: "Cable straight arm pulldown", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0237", name: "Cable straight arm pulldown (with rope)", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0239", name: "Cable straight back seated row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0240", name: "Cable supine reverse fly", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "2464", name: "Cable thibaudeau kayak row", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0241", name: "Cable triceps pushdown (v-bar)", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2405", name: "Cable triceps pushdown (v-bar) (with arm blaster)", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0242", name: "Cable tuck reverse crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0243", name: "Cable twist", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0862", name: "Cable twist (up-down)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0244", name: "Cable twisting pull", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1645", name: "Cable two arm curl on incline bench", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1728", name: "Cable two arm tricep kickback", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0245", name: "Cable underhand pulldown", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1270", name: "Cable upper chest crossovers", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1324", name: "Cable upper row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0246", name: "Cable upright row", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1325", name: "Cable wide grip rear pulldown behind neck", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0247", name: "Cable wrist curl", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1407", name: "Calf push stretch with hands against wall", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1377", name: "Calf stretch with hands against wall", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1378", name: "Calf stretch with rope", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0248", name: "Cambered bar lying row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "2963", name: "Captains chair straight leg raise", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1548", name: "Chair leg extended stretch", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1271", name: "Chest and front of shoulder stretch", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "0251", name: "Chest dip", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "1430", name: "Chest dip (on dip-pull-up cage)", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "2462", name: "Chest dip on straight bar", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "1272", name: "Chest stretch with exercise ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "3216", name: "Chest tap push-up (male)", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "1326", name: "Chin-up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "0253", name: "Chin-ups (narrow parallel grip)", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "0257", name: "Circles knee stretch", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1273", name: "Clap push up", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "0258", name: "Clock push-up", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "1327", name: "Close grip chin-up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "0259", name: "Close-grip push-up", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "2398", name: "Close-grip push-up (on knees)", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "0260", name: "Cocoons", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1468", name: "Crab twist toe touch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0262", name: "Cross body crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0267", name: "Crunch (hands overhead)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0271", name: "Crunch (on stability ball)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0272", name: "Crunch (on stability ball, arms straight)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0274", name: "Crunch floor", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3016", name: "Curl-up", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3769", name: "Curtsey squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "2331", name: "Cycle cross trainer", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "running" },
  { id: "0276", name: "Dead bug", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0277", name: "Decline crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0279", name: "Decline push-up", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "0282", name: "Decline sit-up", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1274", name: "Deep push up", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0283", name: "Diamond push-up", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "0284", name: "Donkey calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1275", name: "Drop push up", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "0285", name: "Dumbbell alternate biceps curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2403", name: "Dumbbell alternate biceps curl (with arm blaster)", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1646", name: "Dumbbell alternate hammer preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1647", name: "Dumbbell alternate preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1648", name: "Dumbbell alternate seated hammer curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0286", name: "Dumbbell alternate side press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1649", name: "Dumbbell alternating bicep curl with leg raised on exercise ball", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1650", name: "Dumbbell alternating seated bicep curl on exercise ball", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2137", name: "Dumbbell arnold press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0287", name: "Dumbbell arnold press v. 2", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0288", name: "Dumbbell around pullover", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0289", name: "Dumbbell bench press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0290", name: "Dumbbell bench seated press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0291", name: "Dumbbell bench squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0293", name: "Dumbbell bent over row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1651", name: "Dumbbell bicep curl lunge with bowling motion", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1652", name: "Dumbbell bicep curl on exercise ball with leg raised", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1653", name: "Dumbbell bicep curl with stork stance", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0294", name: "Dumbbell biceps curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2401", name: "Dumbbell biceps curl (with arm blaster)", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1654", name: "Dumbbell biceps curl reverse", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1655", name: "Dumbbell biceps curl squat", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1656", name: "Dumbbell biceps curl v sit on bosu ball", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1201", name: "Dumbbell burpee", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "running" },
  { id: "0295", name: "Dumbbell clean", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1731", name: "Dumbbell close grip press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0296", name: "Dumbbell close-grip press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0297", name: "Dumbbell concentration curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "3635", name: "Dumbbell contralateral forward lunge", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0298", name: "Dumbbell cross body hammer curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1657", name: "Dumbbell cross body hammer curl v. 2", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0299", name: "Dumbbell cuban press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "2136", name: "Dumbbell cuban press v. 2", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0300", name: "Dumbbell deadlift", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0301", name: "Dumbbell decline bench press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0302", name: "Dumbbell decline fly", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0303", name: "Dumbbell decline hammer press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1276", name: "Dumbbell decline one arm fly", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1617", name: "Dumbbell decline one arm hammer press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0305", name: "Dumbbell decline shrug", muscle: "Trapèzes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0304", name: "Dumbbell decline shrug v. 2", muscle: "Trapèzes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0306", name: "Dumbbell decline triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0307", name: "Dumbbell decline twist fly", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1437", name: "Dumbbell finger curls", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0308", name: "Dumbbell fly", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1277", name: "Dumbbell fly on exercise ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1732", name: "Dumbbell forward lunge triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0310", name: "Dumbbell front raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0309", name: "Dumbbell front raise v. 2", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0311", name: "Dumbbell full can lateral raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1760", name: "Dumbbell goblet squat", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0313", name: "Dumbbell hammer curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1659", name: "Dumbbell hammer curl on exercise ball", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0312", name: "Dumbbell hammer curl v. 2", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2402", name: "Dumbbell hammer curls (with arm blaster)", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1664", name: "Dumbbell high curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "3545", name: "Dumbbell incline alternate press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0314", name: "Dumbbell incline bench press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0315", name: "Dumbbell incline biceps curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0316", name: "Dumbbell incline breeding", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0318", name: "Dumbbell incline curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0317", name: "Dumbbell incline curl v. 2", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0319", name: "Dumbbell incline fly", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1278", name: "Dumbbell incline fly on exercise ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0320", name: "Dumbbell incline hammer curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0321", name: "Dumbbell incline hammer press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1618", name: "Dumbbell incline hammer press on exercise ball", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0322", name: "Dumbbell incline inner biceps curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1279", name: "Dumbbell incline one arm fly", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1280", name: "Dumbbell incline one arm fly on exercise ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1619", name: "Dumbbell incline one arm hammer press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1620", name: "Dumbbell incline one arm hammer press on exercise ball", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0323", name: "Dumbbell incline one arm lateral raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1281", name: "Dumbbell incline one arm press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1282", name: "Dumbbell incline one arm press on exercise ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0324", name: "Dumbbell incline palm-in press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1283", name: "Dumbbell incline press on exercise ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0325", name: "Dumbbell incline raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0326", name: "Dumbbell incline rear lateral raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0327", name: "Dumbbell incline row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0328", name: "Dumbbell incline shoulder raise", muscle: "Dentelé antérieur", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0329", name: "Dumbbell incline shrug", muscle: "Trapèzes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "3542", name: "Dumbbell incline t-raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0330", name: "Dumbbell incline triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0331", name: "Dumbbell incline twisted flyes", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1733", name: "Dumbbell incline two arm extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "3541", name: "Dumbbell incline y-raise", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0332", name: "Dumbbell iron cross", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0333", name: "Dumbbell kickback", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1734", name: "Dumbbell kickbacks on exercise ball", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1660", name: "Dumbbell kneeling bicep curl exercise ball", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0334", name: "Dumbbell lateral raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0335", name: "Dumbbell lateral to front raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0336", name: "Dumbbell lunge", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1658", name: "Dumbbell lunge with bicep curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1729", name: "Dumbbell lying alternate extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0338", name: "Dumbbell lying elbow press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0337", name: "Dumbbell lying extension (across face)", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0863", name: "Dumbbell lying external shoulder rotation", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0339", name: "Dumbbell lying femoral", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0340", name: "Dumbbell lying hammer press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "2470", name: "Dumbbell lying on floor rear delt raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0341", name: "Dumbbell lying one arm deltoid rear", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0343", name: "Dumbbell lying one arm press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0342", name: "Dumbbell lying one arm press v. 2", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0344", name: "Dumbbell lying one arm pronated triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0345", name: "Dumbbell lying one arm rear lateral raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0346", name: "Dumbbell lying one arm supinated triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0347", name: "Dumbbell lying pronation", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2705", name: "Dumbbell lying pronation on floor", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1284", name: "Dumbbell lying pullover on exercise ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1328", name: "Dumbbell lying rear delt row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0348", name: "Dumbbell lying rear lateral raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1735", name: "Dumbbell lying single extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0349", name: "Dumbbell lying supination", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2706", name: "Dumbbell lying supination on floor", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1661", name: "Dumbbell lying supine biceps curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0350", name: "Dumbbell lying supine curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0351", name: "Dumbbell lying triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1662", name: "Dumbbell lying wide curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0352", name: "Dumbbell neutral grip bench press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1285", name: "Dumbbell one arm bench fly", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0292", name: "Dumbbell one arm bent-over row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1286", name: "Dumbbell one arm chest fly on exercise ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0353", name: "Dumbbell one arm concentration curl (on stability ball)", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1287", name: "Dumbbell one arm decline chest press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1288", name: "Dumbbell one arm fly on exercise ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1736", name: "Dumbbell one arm french press on exercise ball", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1663", name: "Dumbbell one arm hammer preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1621", name: "Dumbbell one arm hammer press on exercise ball", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1289", name: "Dumbbell one arm incline chest press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0354", name: "Dumbbell one arm kickback", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0355", name: "Dumbbell one arm lateral raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0356", name: "Dumbbell one arm lateral raise with support", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1290", name: "Dumbbell one arm press on exercise ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1665", name: "Dumbbell one arm prone curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1666", name: "Dumbbell one arm prone hammer curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1291", name: "Dumbbell one arm pullover on exercise ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0359", name: "Dumbbell one arm reverse fly (with support)", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1622", name: "Dumbbell one arm reverse grip press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1414", name: "Dumbbell one arm reverse preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1667", name: "Dumbbell one arm reverse spider curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0358", name: "Dumbbell one arm reverse wrist curl", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1668", name: "Dumbbell one arm seated bicep curl on exercise ball", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1669", name: "Dumbbell one arm seated hammer curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1415", name: "Dumbbell one arm seated neutral wrist curl", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0361", name: "Dumbbell one arm shoulder press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0360", name: "Dumbbell one arm shoulder press v. 2", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "3888", name: "Dumbbell one arm snatch", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1670", name: "Dumbbell one arm standing curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1671", name: "Dumbbell one arm standing hammer curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0362", name: "Dumbbell one arm triceps extension (on bench)", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0363", name: "Dumbbell one arm upright row", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0364", name: "Dumbbell one arm wrist curl", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1672", name: "Dumbbell one arm zottman preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1292", name: "Dumbbell one leg fly on exercise ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0365", name: "Dumbbell over bench neutral wrist curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0366", name: "Dumbbell over bench one arm neutral wrist curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1441", name: "Dumbbell over bench one arm reverse wrist curl", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0367", name: "Dumbbell over bench one arm wrist curl", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0368", name: "Dumbbell over bench revers wrist curl", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0369", name: "Dumbbell over bench wrist curl", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1329", name: "Dumbbell palm rotational bent over row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1623", name: "Dumbbell palms in incline bench press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0370", name: "Dumbbell peacher hammer curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0371", name: "Dumbbell plyo squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0372", name: "Dumbbell preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1673", name: "Dumbbell preacher curl over exercise ball", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1293", name: "Dumbbell press on exercise ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0373", name: "Dumbbell pronate-grip triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0374", name: "Dumbbell prone incline curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1674", name: "Dumbbell prone incline hammer curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0375", name: "Dumbbell pullover", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1294", name: "Dumbbell pullover hip extension on exercise ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1295", name: "Dumbbell pullover on exercise ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1700", name: "Dumbbell push press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0376", name: "Dumbbell raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "2292", name: "Dumbbell rear delt raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0377", name: "Dumbbell rear delt row_shoulder", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0378", name: "Dumbbell rear fly", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0380", name: "Dumbbell rear lateral raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0379", name: "Dumbbell rear lateral raise (support head)", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0381", name: "Dumbbell rear lunge", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0382", name: "Dumbbell revers grip biceps curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1624", name: "Dumbbell reverse bench press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0383", name: "Dumbbell reverse fly", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1330", name: "Dumbbell reverse grip incline bench one arm row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1331", name: "Dumbbell reverse grip incline bench two arm row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "2327", name: "Dumbbell reverse grip row (female)", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0384", name: "Dumbbell reverse preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1675", name: "Dumbbell reverse spider curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0385", name: "Dumbbell reverse wrist curl", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1459", name: "Dumbbell romanian deadlift", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0386", name: "Dumbbell rotation reverse fly", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "2397", name: "Dumbbell scott press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0387", name: "Dumbbell seated alternate front raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1676", name: "Dumbbell seated alternate hammer curl on exercise ball", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0388", name: "Dumbbell seated alternate press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "3546", name: "Dumbbell seated alternate shoulder", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0389", name: "Dumbbell seated bench extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2317", name: "Dumbbell seated bent arm lateral raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1730", name: "Dumbbell seated bent over alternate kickback", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1737", name: "Dumbbell seated bent over triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1677", name: "Dumbbell seated bicep curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0390", name: "Dumbbell seated biceps curl (on stability ball)", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "3547", name: "Dumbbell seated biceps curl to shoulder press", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1379", name: "Dumbbell seated calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0391", name: "Dumbbell seated curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0392", name: "Dumbbell seated front raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1678", name: "Dumbbell seated hammer curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0393", name: "Dumbbell seated inner biceps curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0394", name: "Dumbbell seated kickback", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0396", name: "Dumbbell seated lateral raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0395", name: "Dumbbell seated lateral raise v. 2", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0397", name: "Dumbbell seated neutral wrist curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1679", name: "Dumbbell seated one arm bicep curl on exercise ball with leg raised", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0398", name: "Dumbbell seated one arm kickback", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0399", name: "Dumbbell seated one arm rotate", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0400", name: "Dumbbell seated one leg calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1380", name: "Dumbbell seated one leg calf raise - hammer grip", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1381", name: "Dumbbell seated one leg calf raise - palm up", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0401", name: "Dumbbell seated palms up wrist curl", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0402", name: "Dumbbell seated preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0403", name: "Dumbbell seated revers grip concentration curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1738", name: "Dumbbell seated reverse grip one arm overhead tricep extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0405", name: "Dumbbell seated shoulder press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0404", name: "Dumbbell seated shoulder press (parallel grip)", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "2188", name: "Dumbbell seated triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0406", name: "Dumbbell shrug", muscle: "Trapèzes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0407", name: "Dumbbell side bend", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0408", name: "Dumbbell side lying one hand raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "3664", name: "Dumbbell side plank with rear fly", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "3548", name: "Dumbbell single arm overhead carry", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0409", name: "Dumbbell single leg calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1757", name: "Dumbbell single leg deadlift", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "2805", name: "Dumbbell single leg deadlift with stepbox support", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0410", name: "Dumbbell single leg split squat", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0411", name: "Dumbbell single leg squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0413", name: "Dumbbell squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "3560", name: "Dumbbell standing alternate hammer curl and press", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0414", name: "Dumbbell standing alternate overhead press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0415", name: "Dumbbell standing alternate raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1739", name: "Dumbbell standing alternating tricep kickback", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2143", name: "Dumbbell standing around world", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1740", name: "Dumbbell standing bent over one arm triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1741", name: "Dumbbell standing bent over two arm triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0416", name: "Dumbbell standing biceps curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0417", name: "Dumbbell standing calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0418", name: "Dumbbell standing concentration curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0419", name: "Dumbbell standing front raise above head", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "2321", name: "Dumbbell standing inner biceps curl v. 2", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0420", name: "Dumbbell standing kickback", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0421", name: "Dumbbell standing one arm concentration curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0422", name: "Dumbbell standing one arm curl (over incline bench)", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1680", name: "Dumbbell standing one arm curl over incline bench", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0423", name: "Dumbbell standing one arm extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0424", name: "Dumbbell standing one arm palm in press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0425", name: "Dumbbell standing one arm reverse curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0426", name: "Dumbbell standing overhead press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0427", name: "Dumbbell standing palms in press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0428", name: "Dumbbell standing preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0429", name: "Dumbbell standing reverse curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0430", name: "Dumbbell standing triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2293", name: "Dumbbell standing zottman preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1684", name: "Dumbbell step up single leg balance with bicep curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0431", name: "Dumbbell step-up", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "2796", name: "Dumbbell step-up lunge", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "2812", name: "Dumbbell step-up split squat", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0432", name: "Dumbbell stiff leg deadlift", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0433", name: "Dumbbell straight arm pullover", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0434", name: "Dumbbell straight leg deadlift", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "2808", name: "Dumbbell sumo pull through", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "2803", name: "Dumbbell supported squat", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0436", name: "Dumbbell tate press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1742", name: "Dumbbell tricep kickback with stork stance", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1743", name: "Dumbbell twisting bench press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0437", name: "Dumbbell upright row", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1765", name: "Dumbbell upright row (back pov)", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0864", name: "Dumbbell upright shoulder external rotation", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0438", name: "Dumbbell w-press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "5201", name: "Dumbbell waiter biceps curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0439", name: "Dumbbell zottman curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2294", name: "Dumbbell zottman preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2189", name: "Dumbbells seated triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1167", name: "Dynamic chest stretch (male)", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "3287", name: "Elbow dips", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "1772", name: "Elbow lift - reverse push-up", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "0443", name: "Elbow-to-knee", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3292", name: "Elevator", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "1332", name: "Exercise ball alternating arm ups", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1333", name: "Exercise ball back extension with arms extended", muscle: "Colonne vertébrale", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1334", name: "Exercise ball back extension with hands behind head", muscle: "Colonne vertébrale", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1335", name: "Exercise ball back extension with knees off ground", muscle: "Colonne vertébrale", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1336", name: "Exercise ball back extension with rotation", muscle: "Colonne vertébrale", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1744", name: "Exercise ball dip", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1559", name: "Exercise ball hip flexor stretch", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1338", name: "Exercise ball hug", muscle: "Colonne vertébrale", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1339", name: "Exercise ball lat stretch", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1341", name: "Exercise ball lower back stretch (pyramid)", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1342", name: "Exercise ball lying side lat stretch", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1382", name: "Exercise ball on the wall calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "3241", name: "Exercise ball on the wall calf raise (tennis ball between ankles)", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "3240", name: "Exercise ball on the wall calf raise (tennis ball between knees)", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1416", name: "Exercise ball one leg prone lower body rotation", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1417", name: "Exercise ball one legged diagonal kick hamstring curl", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1296", name: "Exercise ball pike push up", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1343", name: "Exercise ball prone leg raise", muscle: "Colonne vertébrale", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1560", name: "Exercise ball seated hamstring stretch", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1745", name: "Exercise ball seated triceps stretch", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1746", name: "Exercise ball supine triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1747", name: "Ez bar french press on exercise ball", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "3010", name: "Ez bar lying bent arms pullover", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1748", name: "Ez bar lying close grip triceps extension behind head", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1344", name: "Ez bar reverse grip bent over row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1682", name: "Ez bar seated close grip concentration curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1749", name: "Ez bar standing french press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0445", name: "Ez barbell anti gravity press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1627", name: "Ez barbell close grip preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0446", name: "Ez barbell close-grip curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0447", name: "Ez barbell curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0448", name: "Ez barbell decline close grip face press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2186", name: "Ez barbell decline triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0449", name: "Ez barbell incline triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0450", name: "Ez barbell jm bench press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0451", name: "Ez barbell reverse grip curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0452", name: "Ez barbell reverse grip preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1458", name: "Ez barbell seated curls", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0453", name: "Ez barbell seated triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0454", name: "Ez barbell spider curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1628", name: "Ez barbell spider curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2404", name: "Ez-bar biceps curl (with arm blaster)", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2432", name: "Ez-bar close-grip bench press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2741", name: "Ez-barbell standing wide grip biceps curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2133", name: "Farmers walk", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0455", name: "Finger curls", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "3303", name: "Flag", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0456", name: "Flexion leg sit up (bent knee)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0457", name: "Flexion leg sit up (straight arm)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0458", name: "Floor fly (with barbell)", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0459", name: "Flutter kicks", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1472", name: "Forward jump", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "3470", name: "Forward lunge (male)", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "3194", name: "Frankenstein squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "2429", name: "Frog crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3301", name: "Frog planche", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3296", name: "Front lever", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3295", name: "Front lever reps", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "0464", name: "Front plank with twist", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3315", name: "Full maltese", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3299", name: "Full planche", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3327", name: "Full planche push-up", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "0466", name: "Gironda sternum chin", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "3561", name: "Glute bridge march", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "3523", name: "Glute bridge two legs on bench (male)", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "3193", name: "Glute-ham raise", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0467", name: "Gorilla chin", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0469", name: "Groin crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1383", name: "Hack calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1384", name: "Hack one leg calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "3221", name: "Half knee bends (male)", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "running" },
  { id: "3202", name: "Half sit-up (male)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1511", name: "Hamstring stretch", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "2139", name: "Hands bike", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "3218", name: "Hands clasped circular toe touch (male)", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "3215", name: "Hands reversed clasped circular toe touch (male)", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "3302", name: "Handstand", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "0471", name: "Handstand push-up", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "1764", name: "Hanging leg hip raise", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0472", name: "Hanging leg raise", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1761", name: "Hanging oblique knee raise", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0473", name: "Hanging pike", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0474", name: "Hanging straight leg hip raise", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0475", name: "Hanging straight leg raise", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0476", name: "Hanging straight twisting leg hip raise", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3636", name: "High knee against wall", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "running" },
  { id: "0484", name: "Hip raise (bent knee)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1418", name: "Hug keens to chest", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "3234", name: "Hyght dumbbell fly", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0489", name: "Hyperextension", muscle: "Colonne vertébrale", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "0488", name: "Hyperextension (on bench)", muscle: "Colonne vertébrale", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "3289", name: "Impossible dips", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "1471", name: "Inchworm", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3698", name: "Inchworm v. 2", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0490", name: "Incline close-grip push-up", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "0491", name: "Incline leg hip raise (leg straight)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0492", name: "Incline push up depth jump", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "0493", name: "Incline push-up", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "3785", name: "Incline push-up (on box)", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "0494", name: "Incline reverse grip push-up", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "3011", name: "Incline scapula push up", muscle: "Dentelé antérieur", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "0495", name: "Incline twisting sit-up", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1564", name: "Intermediate hip flexor and quad stretch", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0496", name: "Inverse leg curl (bench support)", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "2400", name: "Inverse leg curl (on pull-up cable machine)", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0499", name: "Inverted row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "2300", name: "Inverted row bent knees", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "2298", name: "Inverted row on bench", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "0497", name: "Inverted row v. 2", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "0498", name: "Inverted row with straps", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "1419", name: "Iron cross stretch", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1297", name: "Isometric chest squeeze", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "0500", name: "Isometric wipers", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "0501", name: "Jack burpee", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "running" },
  { id: "3224", name: "Jack jump (male)", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "running" },
  { id: "0507", name: "Jackknife sit-up", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0508", name: "Janda sit-up", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "2612", name: "Jump rope", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "running" },
  { id: "0514", name: "Jump squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0513", name: "Jump squat v. 2", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0517", name: "Kettlebell advanced windmill", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0518", name: "Kettlebell alternating hang clean", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0520", name: "Kettlebell alternating press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0519", name: "Kettlebell alternating press on floor", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0521", name: "Kettlebell alternating renegade row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0522", name: "Kettlebell alternating row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0523", name: "Kettlebell arnold press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0524", name: "Kettlebell bent press", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0525", name: "Kettlebell bottoms up clean from the hang position", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0526", name: "Kettlebell double alternating hang clean", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0527", name: "Kettlebell double jerk", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0528", name: "Kettlebell double push press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0529", name: "Kettlebell double snatch", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0530", name: "Kettlebell double windmill", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0531", name: "Kettlebell extended range one arm press on floor", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0532", name: "Kettlebell figure 8", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0533", name: "Kettlebell front squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0534", name: "Kettlebell goblet squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0535", name: "Kettlebell hang clean", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0536", name: "Kettlebell lunge pass through", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0537", name: "Kettlebell one arm clean and jerk", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1298", name: "Kettlebell one arm floor press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0538", name: "Kettlebell one arm jerk", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0539", name: "Kettlebell one arm military press to the side", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0540", name: "Kettlebell one arm push press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0541", name: "Kettlebell one arm row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0542", name: "Kettlebell one arm snatch", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0543", name: "Kettlebell pirate supper legs", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0544", name: "Kettlebell pistol squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0545", name: "Kettlebell plyo push-up", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0546", name: "Kettlebell seated press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1438", name: "Kettlebell seated two arm military press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0547", name: "Kettlebell seesaw press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0548", name: "Kettlebell sumo high pull", muscle: "Trapèzes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0549", name: "Kettlebell swing", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0550", name: "Kettlebell thruster", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0551", name: "Kettlebell turkish get up (squat style)", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0552", name: "Kettlebell two arm clean", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0553", name: "Kettlebell two arm military press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1345", name: "Kettlebell two arm row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0554", name: "Kettlebell windmill", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0555", name: "Kick out sit", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0558", name: "Kipping muscle up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "3640", name: "Knee touch crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1420", name: "Kneeling jump squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1346", name: "Kneeling lat stretch", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "3239", name: "Kneeling plank tap shoulder (male)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3211", name: "Kneeling push-up (male)", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "3288", name: "Korean dips", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "3418", name: "L-pull-up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "3419", name: "L-sit on floor", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0562", name: "Landmine 180", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "3237", name: "Landmine lateral raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "3300", name: "Lean planche", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "2271", name: "Left hook. boxing", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "shoulders" },
  { id: "0570", name: "Leg pull in flat bench", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1576", name: "Leg up hamstring stretch", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "2287", name: "Lever alternate leg press", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0571", name: "Lever alternating narrow grip seated row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0572", name: "Lever assisted chin-up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0573", name: "Lever back extension", muscle: "Colonne vertébrale", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0574", name: "Lever bent over row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "3200", name: "Lever bent-over row with v-bar", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0575", name: "Lever bicep curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2289", name: "Lever calf press", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0577", name: "Lever chest press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0576", name: "Lever chest press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0578", name: "Lever deadlift", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1300", name: "Lever decline chest press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1253", name: "Lever donkey calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0579", name: "Lever front pulldown", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0580", name: "Lever gripless shrug", muscle: "Trapèzes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1439", name: "Lever gripless shrug v. 2", muscle: "Trapèzes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "2288", name: "Lever gripper hands", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1615", name: "Lever hammer grip preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0581", name: "Lever high row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "2286", name: "Lever hip extension v. 2", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "2611", name: "Lever horizontal one leg press", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1299", name: "Lever incline chest press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1479", name: "Lever incline chest press v. 2", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0582", name: "Lever kneeling leg curl", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0583", name: "Lever kneeling twist", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0584", name: "Lever lateral raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0585", name: "Lever leg extension", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0586", name: "Lever lying leg curl", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "3195", name: "Lever lying two-one leg curl", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0587", name: "Lever military press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0588", name: "Lever narrow grip seated row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0589", name: "Lever one arm bent over row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1356", name: "Lever one arm lateral high row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1347", name: "Lever one arm lateral wide pulldown", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0590", name: "Lever one arm shoulder press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0591", name: "Lever overhand triceps dip", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0592", name: "Lever preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1614", name: "Lever preacher curl v. 2", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2285", name: "Lever pullover", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "2736", name: "Lever reverse grip lateral pulldown", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1616", name: "Lever reverse grip preacher curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1348", name: "Lever reverse grip vertical row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0593", name: "Lever reverse hyperextension", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1349", name: "Lever reverse t-bar row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "2315", name: "Lever rotary calf", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "2335", name: "Lever seated calf press", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0594", name: "Lever seated calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1452", name: "Lever seated crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0595", name: "Lever seated crunch (chest pad)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "3760", name: "Lever seated crunch v. 2", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "1451", name: "Lever seated dip", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0596", name: "Lever seated fly", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "3759", name: "Lever seated good morning", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0597", name: "Lever seated hip abduction", muscle: "Abducteurs", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0598", name: "Lever seated hip adduction", muscle: "Adducteurs", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0599", name: "Lever seated leg curl", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0600", name: "Lever seated leg raise crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0602", name: "Lever seated reverse fly", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0601", name: "Lever seated reverse fly (parallel grip)", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1350", name: "Lever seated row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1385", name: "Lever seated squat calf raise on leg press machine", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0603", name: "Lever shoulder press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0869", name: "Lever shoulder press v. 2", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "2318", name: "Lever shoulder press v. 3", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0604", name: "Lever shrug", muscle: "Trapèzes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0605", name: "Lever standing calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "3758", name: "Lever standing chest press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0606", name: "Lever t bar row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1351", name: "Lever t-bar reverse grip row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0607", name: "Lever triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1313", name: "Lever unilateral row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0609", name: "London bridge", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "3013", name: "Low glute bridge on floor", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1352", name: "Lower back curl", muscle: "Colonne vertébrale", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "3582", name: "Lunge with jump", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1688", name: "Lunge with twist", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0613", name: "Lying (side) quads stretch", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "2312", name: "Lying elbow to knee", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0620", name: "Lying leg raise flat bench", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0865", name: "Lying leg-hip raise", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1301", name: "Machine inner chest press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0624", name: "March sit (wall)", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1353", name: "Medicine ball catch and overhead throw", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1302", name: "Medicine ball chest pass", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1303", name: "Medicine ball chest push from 3 point stance", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1304", name: "Medicine ball chest push multiple response", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1305", name: "Medicine ball chest push single response", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1312", name: "Medicine ball chest push with run release", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1701", name: "Medicine ball close grip push up", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1354", name: "Medicine ball overhead slam", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1750", name: "Medicine ball supine chest throw", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0627", name: "Mixed grip chin-up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "3217", name: "Modified hindu push-up (male)", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "1421", name: "Modified push up to lower arms", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "0628", name: "Monster walk", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0630", name: "Mountain climber", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "running" },
  { id: "0631", name: "Muscle up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "1401", name: "Muscle-up (on vertical bar)", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "2328", name: "Narrow push-up on exercise ball", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1403", name: "Neck side stretch", muscle: "Releveur de la scapula", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "0634", name: "Negative crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1495", name: "Oblique crunch v. 2", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0635", name: "Oblique crunches floor", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0636", name: "Olympic barbell hammer curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0637", name: "Olympic barbell triceps extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1355", name: "One arm against wall", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "0638", name: "One arm chin-up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "0639", name: "One arm dip", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "0640", name: "One arm slam (with medicine ball)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "1773", name: "One arm towel row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "1386", name: "One leg donkey calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1387", name: "One leg floor calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1476", name: "One leg squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0641", name: "Otis up", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0642", name: "Outside leg kick push-up", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0643", name: "Overhead triceps stretch", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "3147", name: "Pelvic tilt", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1422", name: "Pelvic tilt into bridge", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1388", name: "Peroneals stretch", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "3662", name: "Pike-to-cobra push-up", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1306", name: "Plyo push up", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "1687", name: "Posterior step to overhead reach", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1389", name: "Posterior tibialis stretch", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "3119", name: "Potty squat", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3132", name: "Potty squat with support", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0648", name: "Power clean", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "3665", name: "Power point plank", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3203", name: "Prisoner half sit-up (male)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1707", name: "Prone twist on stability ball", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0651", name: "Pull up (neutral grip)", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "0650", name: "Pull-in (on stability ball)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0652", name: "Pull-up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "1689", name: "Push and pull bodyweight", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "3638", name: "Push to run", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "running" },
  { id: "1307", name: "Push up on bosu ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0662", name: "Push-up", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "0653", name: "Push-up (bosu ball)", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0655", name: "Push-up (on stability ball)", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0656", name: "Push-up (on stability ball)", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0659", name: "Push-up (wall)", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "0658", name: "Push-up (wall) v. 2", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "0660", name: "Push-up close-grip off dumbbell", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0661", name: "Push-up inside leg kick", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0663", name: "Push-up medicine ball", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1467", name: "Push-up on lower arms", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "3145", name: "Push-up plus", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "0664", name: "Push-up to side plank", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3533", name: "Quads", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "3201", name: "Quarter sit-up", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3552", name: "Quick feet v. 2", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0666", name: "Raise single arm push-up", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "0668", name: "Rear decline bridge", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0669", name: "Rear deltoid stretch", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "shoulders" },
  { id: "0670", name: "Rear pull-up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "1582", name: "Reclining big toe pose with rope", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "3236", name: "Resistance band hip thrusts on knees (female)", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "3007", name: "Resistance band leg extension", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "3123", name: "Resistance band seated biceps curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "3124", name: "Resistance band seated chest press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "3006", name: "Resistance band seated hip abduction", muscle: "Abducteurs", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "3122", name: "Resistance band seated shoulder press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "3144", name: "Resistance band seated straight back row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0872", name: "Reverse crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0672", name: "Reverse dip", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "0673", name: "Reverse grip machine lat pulldown", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0674", name: "Reverse grip pull-up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "0675", name: "Reverse hyper extension (on stability ball)", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1423", name: "Reverse hyper on flat bench", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "3663", name: "Reverse plank with leg lift", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0677", name: "Ring dips", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "2571", name: "Rocking frog stretch", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0678", name: "Rocky pull-up pulldown", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "2208", name: "Roller back stretch", muscle: "Colonne vertébrale", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "2204", name: "Roller body saw", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "2205", name: "Roller hip lat stretch", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "2202", name: "Roller hip stretch", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "2206", name: "Roller reverse crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "2203", name: "Roller seated shoulder flexor depresor retractor", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "2209", name: "Roller seated single leg shoulder flexor depresor retractor", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "2207", name: "Roller side lat stretch", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0680", name: "Rope climb", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0685", name: "Run", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "running" },
  { id: "0684", name: "Run (equipment)", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "running" },
  { id: "1585", name: "Runners stretch", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0687", name: "Russian twist", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3012", name: "Scapula dips", muscle: "Trapèzes", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "3021", name: "Scapula push-up", muscle: "Dentelé antérieur", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "0688", name: "Scapular pull-up", muscle: "Trapèzes", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "3219", name: "Scissor jumps (male)", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "running" },
  { id: "1390", name: "Seated calf stretch (male)", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1424", name: "Seated glute stretch", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0689", name: "Seated leg raise", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0690", name: "Seated lower back stretch", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "2567", name: "Seated piriformis stretch", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0691", name: "Seated side crunch (wall)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1587", name: "Seated wide angle pose sequence", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0697", name: "Self assisted inverse leg curl", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1766", name: "Self assisted inverse leg curl", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0696", name: "Self assisted inverse leg curl (on floor)", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "3222", name: "Semi squat jump (male)", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "running" },
  { id: "3656", name: "Short stride run", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "running" },
  { id: "1763", name: "Shoulder grip pull-up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "3699", name: "Shoulder tap", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0699", name: "Shoulder tap push-up", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "1774", name: "Side bridge hip abduction", muscle: "Abducteurs", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0705", name: "Side bridge v. 2", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0709", name: "Side hip (on parallel bars)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0710", name: "Side hip abduction", muscle: "Abducteurs", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1358", name: "Side lying floor stretch", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "3667", name: "Side lying hip adduction (male)", muscle: "Adducteurs", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1775", name: "Side plank hip adduction", muscle: "Adducteurs", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0716", name: "Side push neck stretch", muscle: "Releveur de la scapula", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "0717", name: "Side push-up", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "0721", name: "Side wrist pull stretch", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "0720", name: "Side-to-side chin", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "3213", name: "Side-to-side toe touch (male)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0725", name: "Single arm push-up", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "3645", name: "Single leg bridge with outstretched leg", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0727", name: "Single leg calf raise (on a dumbbell)", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0730", name: "Single leg platform slide", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1759", name: "Single leg squat (pistol) male", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1489", name: "Sissy squat", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0735", name: "Sit-up v. 2", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3679", name: "Sit-up with arms on chest", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3361", name: "Skater hops", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "running" },
  { id: "2142", name: "Ski ergometer", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "3671", name: "Ski step", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "running" },
  { id: "3304", name: "Skin the cat", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "1425", name: "Sled 45 degrees one leg press", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1463", name: "Sled 45° leg press (side pov)", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0738", name: "Sled 45в° calf press", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0739", name: "Sled 45в° leg press", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1464", name: "Sled 45в° leg press (back pov)", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0740", name: "Sled 45в° leg wide press", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1391", name: "Sled calf press on leg press", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0741", name: "Sled closer hack squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0742", name: "Sled forward angled calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0743", name: "Sled hack squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "2334", name: "Sled lying calf press", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0744", name: "Sled lying squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1392", name: "Sled one leg calf press on leg press", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1496", name: "Sledge hammer", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0746", name: "Smith back shrug", muscle: "Trapèzes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0747", name: "Smith behind neck press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0748", name: "Smith bench press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0749", name: "Smith bent knee good morning", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1359", name: "Smith bent over row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0750", name: "Smith chair squat", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0751", name: "Smith close-grip bench press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0752", name: "Smith deadlift", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0753", name: "Smith decline bench press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0754", name: "Smith decline reverse-grip press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1433", name: "Smith front squat (clean grip)", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "3281", name: "Smith full squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0755", name: "Smith hack squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0756", name: "Smith hip raise", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0757", name: "Smith incline bench press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0758", name: "Smith incline reverse-grip press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0759", name: "Smith incline shoulder raises", muscle: "Dentelé antérieur", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0760", name: "Smith leg press", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1434", name: "Smith low bar squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1683", name: "Smith machine bicep curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1625", name: "Smith machine decline close grip bench press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1752", name: "Smith machine incline tricep extension", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1626", name: "Smith machine reverse decline close grip bench press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0761", name: "Smith narrow row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1360", name: "Smith one arm row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1393", name: "Smith one leg floor calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0762", name: "Smith rear delt row", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0763", name: "Smith reverse calf raises", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1394", name: "Smith reverse calf raises", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1361", name: "Smith reverse grip bent over row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0764", name: "Smith reverse-grip press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1395", name: "Smith seated one leg calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0765", name: "Smith seated shoulder press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1426", name: "Smith seated wrist curl", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0766", name: "Smith shoulder press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0767", name: "Smith shrug", muscle: "Trapèzes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0768", name: "Smith single leg split squat", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0769", name: "Smith sprint lunge", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0770", name: "Smith squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0771", name: "Smith standing back wrist curl", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0772", name: "Smith standing behind head military press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0773", name: "Smith standing leg calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0774", name: "Smith standing military press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "3142", name: "Smith sumo squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1396", name: "Smith toe raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0775", name: "Smith upright row", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1308", name: "Smith wide grip bench press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1309", name: "Smith wide grip decline bench press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "0776", name: "Snatch pull", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0777", name: "Spell caster", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "1362", name: "Sphinx", muscle: "Colonne vertébrale", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "0778", name: "Spider crawl push up", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1363", name: "Spine stretch", muscle: "Colonne vertébrale", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "2329", name: "Spine twist", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "2368", name: "Split squats", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0786", name: "Squat jerk", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1705", name: "Squat on bosu ball", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1685", name: "Squat to overhead reach", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1686", name: "Squat to overhead reach with twist", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "2297", name: "Stability ball crunch (full range hands behind head)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "3291", name: "Stalder press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "3669", name: "Standing archer", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "0788", name: "Standing behind neck press", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "1490", name: "Standing calf raise (on a staircase)", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1397", name: "Standing calves", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1398", name: "Standing calves calf stretch", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1599", name: "Standing hamstring and calf stretch with strap", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0794", name: "Standing lateral stretch", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "1364", name: "Standing pelvic tilt", muscle: "Colonne vertébrale", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "0795", name: "Standing single leg curl", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0796", name: "Standing wheel rollerout", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "3223", name: "Star jump (male)", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "running" },
  { id: "2138", name: "Stationary bike run v. 3", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "running" },
  { id: "0798", name: "Stationary bike walk", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "running" },
  { id: "3314", name: "Straddle maltese", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3298", name: "Straddle planche", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1427", name: "Straight leg outer hip abductor", muscle: "Abducteurs", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "0803", name: "Superman push-up", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "0805", name: "Suspended abdominal fallout", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0806", name: "Suspended push-up", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "0807", name: "Suspended reverse crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0808", name: "Suspended row", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "0809", name: "Suspended split squat", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "3433", name: "Swimmer kicks v. 2 (male)", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "3318", name: "Swing 360", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "running" },
  { id: "1753", name: "Three bench dip", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "2459", name: "Tire flip", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0811", name: "Trap bar deadlift", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0814", name: "Triceps dip", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "0812", name: "Triceps dip (bench leg)", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "0813", name: "Triceps dip (between benches)", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "0815", name: "Triceps dips floor", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "0816", name: "Triceps press", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "0817", name: "Triceps stretch", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "0871", name: "Tuck crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0818", name: "Twin handle parallel grip lat pulldown", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "1466", name: "Twist hip lift", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "2802", name: "Twisted leg raise", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "2801", name: "Twisted leg raise (female)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "3231", name: "Two toe touch (male)", muscle: "Colonne vertébrale", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "1365", name: "Upper back stretch", muscle: "Haut du dos", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "1366", name: "Upward facing dog", muscle: "Colonne vertébrale", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "3420", name: "V-sit on floor", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "0826", name: "Vertical leg raise (on parallel bars)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "2141", name: "Walk elliptical cross trainer", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "running" },
  { id: "3655", name: "Walking high knees lunge", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "running" },
  { id: "1460", name: "Walking lunge", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "3666", name: "Walking on incline treadmill", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "running" },
  { id: "2311", name: "Walking on stepmill", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "running" },
  { id: "0830", name: "Weighted bench dip", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "2987", name: "Weighted close grip chin-up on dip cage", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "3643", name: "Weighted cossack squats (male)", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0832", name: "Weighted crunch", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "3670", name: "Weighted decline sit-up", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0833", name: "Weighted donkey calf raise", muscle: "Mollets", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "1310", name: "Weighted drop push up", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "2135", name: "Weighted front plank", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0834", name: "Weighted front raise", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0866", name: "Weighted hanging leg-hip raise", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0835", name: "Weighted hyperextension (on stability ball)", muscle: "Colonne vertébrale", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "3641", name: "Weighted kneeling step with swing", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "3644", name: "Weighted lunge with swing", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "3286", name: "Weighted muscle up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "3312", name: "Weighted muscle up (on bar)", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "3290", name: "Weighted one hand pull up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0840", name: "Weighted overhead crunch (on stability ball)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0841", name: "Weighted pull-up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "backMuscle" },
  { id: "0844", name: "Weighted round arm", muscle: "Deltoïdes", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "shoulders" },
  { id: "0846", name: "Weighted russian twist", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0845", name: "Weighted russian twist (legs up)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "2371", name: "Weighted russian twist v. 2", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0847", name: "Weighted seated bicep curl (on stability ball)", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0849", name: "Weighted seated twist (on stability ball)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0850", name: "Weighted side bend (on stability ball)", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "0851", name: "Weighted sissy squat", muscle: "Quadriceps", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0852", name: "Weighted squat", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0853", name: "Weighted standing curl", muscle: "Biceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0854", name: "Weighted standing hand squeeze", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "3313", name: "Weighted straight bar dip", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "3642", name: "Weighted stretch lunge", muscle: "Fessiers", bodyRegion: "bas-du-corps", equipment: "avec-materiel", icon: "legs" },
  { id: "0856", name: "Weighted svend press", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "torso" },
  { id: "1754", name: "Weighted three bench dips", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1755", name: "Weighted tricep dips", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "1767", name: "Weighted triceps dip on high parallel bars", muscle: "Triceps", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
  { id: "0857", name: "Wheel rollerout", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "avec-materiel", icon: "abs" },
  { id: "3637", name: "Wheel run", muscle: "Cardio", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "running" },
  { id: "1429", name: "Wide grip pull-up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "1367", name: "Wide grip rear pull-up", muscle: "Grand dorsal", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "backMuscle" },
  { id: "1311", name: "Wide hand push up", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "2363", name: "Wide-grip chest dip on high parallel bars", muscle: "Pectoraux", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "torso" },
  { id: "0858", name: "Wind sprints", muscle: "Abdominaux", bodyRegion: "gainage", equipment: "poids-du-corps", icon: "abs" },
  { id: "1604", name: "World greatest stretch", muscle: "Ischio-jambiers", bodyRegion: "bas-du-corps", equipment: "poids-du-corps", icon: "legs" },
  { id: "1428", name: "Wrist circles", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "poids-du-corps", icon: "arms" },
  { id: "0859", name: "Wrist rollerer", muscle: "Avant-bras", bodyRegion: "haut-du-corps", equipment: "avec-materiel", icon: "arms" },
];

function gymGetExercise(id) {
  return EXERCISES.find((e) => e.id === id);
}

/* ---- Catégories (page Exercices) ------------------------------------------- */

// Mobilité et Fonctionnel n'ont pas de champ dédié dans EXERCISES : détection par le nom.
const GYM_MOBILITY_RE = /\bstretch\b|circles|yoga|\bpose\b|inchworm|rocking frog|\bhug\b/i;
// "clean grip" exclu : c'est une prise de barre, pas un mouvement de clean
const GYM_FUNCTIONAL_RE = /burpee|thruster|\bclean\b(?![- ]grip)|snatch|jerk|farmer|carry|get up|jump|mountain climber|bear crawl|swing|medicine ball|slam|tire flip|sledge/i;

// Exercices d'une catégorie : sert à la fois à la liste et au compteur.
function gymGetCategoryPool(categoryId) {
  if (categoryId === "mobilite") return EXERCISES.filter((e) => GYM_MOBILITY_RE.test(e.name));
  if (categoryId === "fonctionnel") return EXERCISES.filter((e) => GYM_FUNCTIONAL_RE.test(e.name));
  if (categoryId === "avec-materiel" || categoryId === "poids-du-corps") return EXERCISES.filter((e) => e.equipment === categoryId);
  return EXERCISES.filter((e) => e.bodyRegion === categoryId);
}

const EXERCISE_CATEGORIES = [
  { id: "haut-du-corps", name: "Haut du corps", description: "Pectoraux, dos, épaules, bras.", icon: "torso", regions: ["haut-du-corps"] },
  { id: "bas-du-corps", name: "Bas du corps", description: "Cuisses, fessiers, mollets.", icon: "legs", regions: ["bas-du-corps"] },
  { id: "gainage", name: "Gainage", description: "Abdominaux, dos, stabilité.", icon: "abs", regions: ["gainage"] },
  { id: "mobilite", name: "Mobilité", description: "Souplesse, posture, prévention.", icon: "mobility", regions: ["mobilite"] },
  { id: "fonctionnel", name: "Fonctionnel", description: "Mouvements complets, coordination.", icon: "functional", regions: ["haut-du-corps", "bas-du-corps"] },
  { id: "avec-materiel", name: "Avec matériel", description: "Haltères, machines, kettlebells, etc.", icon: "equipment", regions: ["haut-du-corps", "bas-du-corps"] },
  { id: "poids-du-corps", name: "Poids du corps", description: "Sans matériel, partout.", icon: "bodyweight", regions: ["haut-du-corps", "bas-du-corps", "gainage"] },
].map((c) => ({ ...c, count: gymGetCategoryPool(c.id).length })); // compteur calculé, plus en dur

/* ---- Objectifs de séance / programme --------------------------------------- */

const TRAINING_GOALS = [
  { id: "force", label: "Force", icon: "dumbbell" },
  { id: "endurance", label: "Endurance", icon: "running" },
  { id: "hypertrophie", label: "Hypertrophie", icon: "muscle" },
  { id: "vitesse", label: "Vitesse", icon: "bolt" },
];

/* ---- Catégories musculaires (Créer séance) ---------------------------------- */

const SESSION_CATEGORIES = [
  { id: "tout", label: "Tout", icon: "grid" },
  { id: "jambes", label: "Jambes", icon: "legs" },
  { id: "haut-du-corps", label: "Haut du corps", icon: "torso" },
  { id: "abdos", label: "Abdos", icon: "abs" },
  { id: "dos", label: "Dos", icon: "backMuscle" },
  { id: "epaules", label: "Épaules", icon: "shoulders" },
  { id: "bras", label: "Bras", icon: "arms" },
  { id: "fessiers", label: "Fessiers", icon: "glutes" },
];

const REST_OPTIONS = [
  { value: "30s", label: "30 sec" },
  { value: "45s", label: "45 sec" },
  { value: "60s", label: "1 min" },
  { value: "90s", label: "1 min 30" },
  { value: "120s", label: "2 min" },
];
const TEMPO_OPTIONS = ["2-0-2-0", "3-1-1-0", "4-0-1-0"];

/* ---- 5 programmes ------------------------------------------------------------
   L'application démarre vierge : aucun programme, séance, objectif ou
   historique n'est pré-rempli. Tout est créé par la personne qui utilise
   le module (via "Créer un programme" / "Créer une séance" / "Créer un
   objectif"), à partir de zéro, comme une application jamais utilisée. */

/* Enregistrement des programmes dans le localStorage du navigateur.
   Seuls les programmes enregistrés via le bouton sont rechargés au démarrage. */
const GYM_STORAGE_KEY = "gym-programs-saved";

function gymReadSavedPrograms() {
  try {
    return JSON.parse(localStorage.getItem(GYM_STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function gymWriteSavedPrograms(programs) {
  try {
    localStorage.setItem(GYM_STORAGE_KEY, JSON.stringify(programs));
  } catch (e) {
    // Stockage indisponible : on ignore.
  }
}

const PROGRAMS = gymReadSavedPrograms();

function gymSaveProgram(programId, button) {
  const program = gymGetProgram(programId);
  if (!program) return;
  const saved = gymReadSavedPrograms().filter((p) => p.id !== programId);
  saved.push(program);
  gymWriteSavedPrograms(saved);
  if (button) button.innerHTML = `${gymIcon("check")} Programme enregistré`;
  // Petite pause pour laisser voir la confirmation avant de revenir à l'accueil.
  setTimeout(() => gymNavigate("gym-home"), 600);
}

function gymGetProgram(id) {
  return PROGRAMS.find((p) => p.id === id);
}

/**
 * Supprime un programme (et toutes ses séances) après confirmation.
 */
function gymDeleteProgram(programId) {
  if (!confirm("Supprimer ce programme et toutes ses séances ? Cette action est irréversible.")) return;
  const index = GYM_DATA.programs.findIndex((p) => p.id === programId);
  if (index === -1) return;
  GYM_DATA.programs.splice(index, 1);
  gymWriteSavedPrograms(gymReadSavedPrograms().filter((p) => p.id !== programId));
  gymNavigate("programmes");
}

/**
 * Supprime une séance d'un programme après confirmation, puis renumérote
 * et redéverrouille séquentiellement les séances restantes.
 */
function gymDeleteSession(programId, sessionId) {
  const program = gymGetProgram(programId);
  if (!program) return;
  if (!confirm("Supprimer cette séance ? Cette action est irréversible.")) return;

  program.sessions = program.sessions.filter((s) => s.id !== sessionId);

  let unlockedAssigned = false;
  program.sessions.forEach((s, i) => {
    s.index = i + 1;
    if (s.status === "terminee") return;
    s.status = unlockedAssigned ? "verrouillee" : "en-cours";
    unlockedAssigned = true;
  });

  gymNavigate("programme-detail", { id: programId });
}

/* ---- Bibliothèque de modèles de programmes (onglet "Bibliothèque") --------------
   Ceci reste : c'est le catalogue fourni par l'application (comme une
   bibliothèque d'exercices), pas une donnée d'usage personnelle. */

const PROGRAM_LIBRARY = [
  { id: "lib-01", name: "Prise de masse débutant", goal: "hypertrophie", sessionsCount: 8, frequencyPerWeek: 3, level: "Débutant", icon: "muscle", description: "Une introduction progressive au volume d'entraînement pour construire du muscle en toute sécurité." },
  { id: "lib-02", name: "Powerlifting essentiel", goal: "force", sessionsCount: 16, frequencyPerWeek: 4, level: "Avancé", icon: "dumbbell", description: "Squat, développé couché et soulevé de terre au centre d'un programme de force pure." },
  { id: "lib-03", name: "Callisthénie & poids du corps", goal: "endurance", sessionsCount: 10, frequencyPerWeek: 3, level: "Intermédiaire", icon: "bodyweight", description: "Tractions, dips et gainage pour développer force et contrôle sans matériel." },
  { id: "lib-04", name: "Sprint & explosivité", goal: "vitesse", sessionsCount: 6, frequencyPerWeek: 2, level: "Intermédiaire", icon: "bolt", description: "Un cycle court centré sur la puissance et la vitesse de réaction." },
];

/* ---- Objectifs personnels (page Objectifs) --------------------------------------
   Vide au départ : la personne crée ses propres objectifs via le bouton
   "Créer un nouvel objectif". */

const GOALS = [];

/* ---- Historique ------------------------------------------------------------------
   Vide au départ : rempli uniquement par les séances réellement effectuées. */

const HISTORY = [];

function gymGroupHistoryByMonth(entries) {
  const groups = new Map();
  entries.forEach((entry) => {
    const key = gymFormatMonthYear(entry.date);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  });
  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
}

/* ---- Détail générique d'une séance active ----------------------------------------
   Construit le détail (séries / répétitions / repos / statut) d'une séance à
   partir de ses exercices et de son objectif, quelle que soit la séance —
   il n'y a plus de séance figée en dur. */

const REST_BY_GOAL = { force: "1 min 30", endurance: "45 sec", hypertrophie: "1 min", vitesse: "2 min", mobilite: "30 sec" };
const REPS_BY_GOAL = { force: "6-8", endurance: "15-20", hypertrophie: "10-12", vitesse: "8-10", mobilite: "10-12" };
const SETS_BY_GOAL = { force: 4, endurance: 3, hypertrophie: 4, vitesse: 3, mobilite: 3 };

function gymGetSessionDetail(session) {
  if (!session) return [];
  // Si la séance a été créée avec des exercices détaillés (séries/répétitions/
  // repos/tempo choisis par la personne, exercice par exercice), on les
  // utilise telles quelles — chaque champ laissé vide retombe sur une valeur
  // par défaut cohérente avec l'objectif de la séance (aucun de ces 4 champs
  // n'est obligatoire à la création).
  if (Array.isArray(session.exercises) && session.exercises.length) {
    return session.exercises.map((item, index) => {
      const exo = gymGetExercise(item.exerciseId);
      return {
        exerciseId: item.exerciseId,
        name: exo ? exo.name : "Exercice",
        sets: Number(item.sets) || SETS_BY_GOAL[session.goal] || 3,
        reps: item.reps || REPS_BY_GOAL[session.goal] || "10-12",
        rest: item.rest
          ? GYM_DATA.restOptions.find((r) => r.value === item.rest)?.label || item.rest
          : REST_BY_GOAL[session.goal] || "1 min",
        tempo: item.tempo || "",
        status: index === 0 ? "en-cours" : "a-venir",
      };
    });
  }

  // Repli pour un ancien format de séance sans détail par exercice.
  return session.exerciseIds.map((exerciseId, index) => {
    const exo = gymGetExercise(exerciseId);
    return {
      exerciseId,
      name: exo ? exo.name : "Exercice",
      sets: SETS_BY_GOAL[session.goal] || 3,
      reps: REPS_BY_GOAL[session.goal] || "10-12",
      rest: REST_BY_GOAL[session.goal] || "1 min",
      tempo: "",
      status: index === 0 ? "en-cours" : "a-venir",
    };
  });
}

/**
 * Retrouve une séance (et son programme parent) par son id, quel que soit
 * le programme. Renvoie { program: null, session: null } si rien n'existe
 * encore (cas normal d'une application vierge).
 */
function gymFindSessionById(sessionId) {
  for (const program of PROGRAMS) {
    const session = program.sessions.find((s) => s.id === sessionId);
    if (session) return { program, session };
  }
  return { program: null, session: null };
}

/* ---- Export global ---------------------------------------------------------------- */

const GYM_DATA = {
  today: GYM_TODAY,
  exercises: EXERCISES,
  categories: EXERCISE_CATEGORIES,
  trainingGoals: TRAINING_GOALS,
  sessionCategories: SESSION_CATEGORIES,
  restOptions: REST_OPTIONS,
  tempoOptions: TEMPO_OPTIONS,
  programs: PROGRAMS,
  programLibrary: PROGRAM_LIBRARY,
  goals: GOALS,
  history: HISTORY,
};

/* ==========================================================================
   GYM — Fonctions utilitaires partagées
   ========================================================================== */

/**
 * Exécute une fonction dès que le DOM est prêt.
 */
function gymOnReady(fn) {
  if (document.readyState !== "loading") fn();
  else document.addEventListener("DOMContentLoaded", fn);
}

/**
 * Anime le remplissage d'une barre de progression (largeur en %).
 * On force un léger délai pour laisser le navigateur peindre l'état à 0
 * avant de déclencher la transition CSS vers la valeur cible.
 */
function gymAnimateProgress(el, percent, delay = 80) {
  if (!el) return;
  el.style.width = "0%";
  window.requestAnimationFrame(() => {
    setTimeout(() => {
      el.style.width = `${Math.max(0, Math.min(100, percent))}%`;
    }, delay);
  });
}

/**
 * Anime un compteur numérique de 0 (ou start) jusqu'à une valeur cible.
 * `formatFn` permet d'ajouter un suffixe (%, kg, etc.).
 */
function gymAnimateCounter(el, target, { duration = 900, start = 0, formatFn } = {}) {
  if (!el) return;
  const format = formatFn || ((v) => `${v}`);
  const startTime = performance.now();
  const isFloat = !Number.isInteger(target);

  function tick(now) {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = start + (target - start) * eased;
    el.textContent = format(isFloat ? Math.round(value * 10) / 10 : Math.round(value));
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/**
 * Calcule les attributs SVG (circonférence / offset) pour un anneau de
 * progression circulaire en fonction d'un pourcentage.
 */
function gymRingProgress(percent, radius = 21) {
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, percent)) / 100) * circumference;
  return { circumference, offset };
}

/**
 * Met en place un groupe d'onglets pill (.tabs > .tab) : gère la classe
 * is-active et déclenche un callback avec l'id de l'onglet sélectionné.
 */
function gymSetupTabs(container, onChange) {
  if (!container) return;
  container.addEventListener("click", (e) => {
    const tab = e.target.closest(".tab");
    if (!tab || !container.contains(tab)) return;
    container.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    if (typeof onChange === "function") onChange(tab.dataset.value, tab);
  });
}

/**
 * Met en place une grille de choix (.choice) en sélection simple ou multiple.
 */
function gymSetupChoiceGrid(container, { multiple = false, onChange } = {}) {
  if (!container) return;
  container.addEventListener("click", (e) => {
    const choice = e.target.closest(".choice");
    if (!choice || !container.contains(choice)) return;
    if (!multiple) {
      container.querySelectorAll(".choice").forEach((c) => c.classList.remove("is-active"));
      choice.classList.add("is-active");
    } else {
      choice.classList.toggle("is-active");
    }
    if (typeof onChange === "function") {
      const active = Array.from(container.querySelectorAll(".choice.is-active")).map((c) => c.dataset.value);
      onChange(multiple ? active : active[0], choice);
    }
  });
}

/**
 * Anti-rebond simple, utilisé pour la barre de recherche.
 */
function gymDebounce(fn, delay = 200) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Formate une durée en minutes (ex : 45 -> "45 min").
 */
function gymFormatDuration(minutes) {
  return `${minutes} min`;
}

/**
 * Retourne l'icône SVG correspondant à une clé, avec repli silencieux.
 */
function gymIcon(key) {
  return (typeof ICONS !== "undefined" && ICONS[key]) || "";
}

/* ==========================================================================
   GYM — Routeur SPA
   Le module tient dans un seul fichier HTML : chaque "page" est une section
   masquée/affichée par JS plutôt qu'un vrai fichier séparé. gymNavigate()
   remplace la navigation par fichier utilisée dans la version multi-pages.
   ========================================================================== */

const GymViews = {};
let currentParams = {};

/**
 * Lit un paramètre "virtuel" de la navigation courante (équivalent d'un
 * paramètre d'URL dans la version multi-pages).
 */
function gymGetParam(name, fallback) {
  return currentParams && currentParams[name] != null ? currentParams[name] : fallback;
}

/**
 * Affiche une vue et déclenche son rendu, sans toucher à l'historique
 * (utilisé en interne par gymNavigate et par la gestion du bouton retour).
 */
function gymActivateView(view, params) {
  if (!GymViews[view]) view = "gym-home";
  currentParams = params || {};

  document.querySelectorAll(".gym-view").forEach((el) => {
    el.hidden = true;
  });
  const section = document.getElementById(`view-${view}`);
  if (section) section.hidden = false;

  // Bloque le scroll du body tant que l'accueil (écran fixe, sans défilement) est affiché.
  // Uniquement si Gym est bien le module affiché à l'écran : un popstate (retour
  // navigateur) peut appeler cette fonction alors qu'on est sur un autre module
  // (ex. Wedging, qui manipule aussi location.hash), sans quoi on verrouille le
  // scroll d'un module qui n'est même pas visible.
  const gymIsActivePage = !!document.getElementById("page-gym")?.classList.contains("active");
  document.body.classList.toggle("gym-home-locked", gymIsActivePage && view === "gym-home");
  // Créer un programme : le document ne doit pas dépasser la hauteur visible (voir gym.css).
  document.body.classList.toggle("gym-view-fit", gymIsActivePage && view === "creer-programme");

  // Filet de sécurité : referme toute bottom-sheet restée ouverte en quittant sa vue.
  document.querySelectorAll(".sheet.is-open, .sheet-overlay.is-open").forEach((el) => {
    el.classList.remove("is-open");
  });

  window.scrollTo(0, 0);

  if (GymViews[view] && typeof GymViews[view].render === "function") {
    GymViews[view].render(currentParams);
  }
}

/**
 * Point d'entrée public de navigation entre les "pages" du module.
 * Équivalent de l'ancien window.location.href = 'page.html?...'.
 */
function gymNavigate(view, params) {
  gymActivateView(view, params);
  const hash = `#${view}`;
  const state = { view, params: currentParams };
  if (location.hash !== hash) history.pushState(state, "", hash);
  else history.replaceState(state, "", hash);
}

window.addEventListener("popstate", (e) => {
  if (e.state && e.state.view) {
    gymActivateView(e.state.view, e.state.params);
  } else {
    const view = (location.hash || "#gym-home").replace("#", "");
    gymActivateView(view, {});
  }
});

/**
 * Cherche la première séance "en-cours" parmi les programmes et met à jour
 * l'encadré "Prochaine séance" de l'accueil. Masqué tant qu'aucun programme
 * n'a été lancé (ou plus aucune séance en-cours).
 */
function gymRenderHomeNextSession() {
  const box = document.getElementById("home-next-session");
  if (!box) return;

  let found = null;
  for (const program of GYM_DATA.programs) {
    const session = (program.sessions || []).find((s) => s.status === "en-cours");
    if (session) {
      found = { program, session };
      break;
    }
  }

  if (!found) {
    box.hidden = true;
    return;
  }

  box.hidden = false;
  box.dataset.sessionId = found.session.id;
  document.getElementById("home-next-session-title").textContent = `${found.program.name} — Séance ${found.session.index}`;
  document.getElementById("home-next-session-meta").textContent = `${gymFormatDuration(found.session.duration)} · ${found.session.exerciseIds.length} exercices`;
}

function gymHomeNextSessionClick() {
  const box = document.getElementById("home-next-session");
  if (!box || !box.dataset.sessionId) return;
  gymNavigate("seance-active", { session: box.dataset.sessionId });
}

/**
 * Ouvre la bottom sheet listant toutes les séances déjà créées (tous
 * programmes confondus), pour permettre d'en lancer une directement
 * depuis l'accueil ("Lancer une séance").
 */
function gymOpenLaunchSheet() {
  const body = document.getElementById("launch-sheet-body");
  const programsWithSessions = GYM_DATA.programs.filter((p) => p.sessions && p.sessions.length);

  body.innerHTML = programsWithSessions.length
    ? programsWithSessions
        .map(
          (program) => `
            <div style="display:flex; flex-direction:column; gap:8px;">
              <span class="gym-eyebrow">${program.name}</span>
              ${program.sessions.map((s) => gymRenderSessionRow(s, program.id)).join("")}
            </div>
          `
        )
        .join("")
    : `
        <div class="card" style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:12px; padding:32px 20px;">
          <div class="icon-circle">${gymIcon("dumbbell")}</div>
          <div>
            <p class="list-row__title">Aucune séance créée</p>
            <p class="list-row__meta">Crée d'abord un programme, puis une séance, pour pouvoir la lancer.</p>
          </div>
          <a class="btn btn-primary" href="#" onclick="gymCloseLaunchSheet(); gymNavigate('creer-seance'); return false;" style="width:auto; padding:12px 22px; font-size:13.5px;">Créer une séance</a>
        </div>
      `;

  document.getElementById("launch-sheet-overlay").classList.add("is-open");
  document.getElementById("launch-sheet").classList.add("is-open");
}

function gymCloseLaunchSheet() {
  document.getElementById("launch-sheet-overlay").classList.remove("is-open");
  document.getElementById("launch-sheet").classList.remove("is-open");
}

document.getElementById("launch-sheet-close").innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
document.getElementById("launch-sheet-close").addEventListener("click", gymCloseLaunchSheet);
document.getElementById("launch-sheet-overlay").addEventListener("click", gymCloseLaunchSheet);

GymViews["gym-home"] = { render: gymRenderHomeNextSession };

/* ==========================================================================
   GYM — Générateurs de composants HTML
   Chaque fonction retourne une chaîne HTML prête à être injectée via
   innerHTML. Elles ne font aucun appel réseau : uniquement du templating
   à partir des données mockées ci-dessus. La navigation se fait via
   gymNavigate() (routeur interne) plutôt que par de vrais href de fichiers.
   ========================================================================== */

/**
 * Vignette "image" : comme le module n'a pas de vraies photos, on simule
 * une vignette premium avec un dégradé sombre + un pictogramme de la
 * catégorie/muscle concerné, plutôt qu'une image cassée.
 */
function gymThumb(iconKey, sizeClass = "thumb--sm") {
  return `<div class="thumb ${sizeClass}">${gymIcon(iconKey)}</div>`;
}

/**
 * Badge de statut pour une séance de programme.
 * Statuts possibles : "terminee" | "en-cours" | "verrouillee".
 */
function gymBadgeSessionStatus(status) {
  if (status === "terminee") {
    return `<span class="badge badge--done">${gymIcon("check")} Terminée</span>`;
  }
  if (status === "en-cours") {
    return `<span class="badge badge--current">En cours</span>`;
  }
  return `<span class="badge badge--locked">${gymIcon("lock")} Verrouillée</span>`;
}

/**
 * Delta chiffré avec flèche (+12% / -3%).
 */
function gymDelta(value) {
  const isUp = value >= 0;
  return `<span class="delta ${isUp ? "delta--up" : "delta--down"}">${gymIcon(isUp ? "trendUp" : "trendDown")}${isUp ? "+" : ""}${value}%</span>`;
}

/**
 * Carte "programme" utilisée sur la page Programmes.
 */
function gymRenderProgramCard(program) {
  const total = program.sessionsCount;
  const done = program.sessions.filter((s) => s.status === "terminee").length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  const progressBlock = total
    ? `<div class="progress-track"><div class="progress-fill" data-progress="${percent}" style="width:0%"></div></div>
       <span class="list-row__meta">${done} séance${done > 1 ? "s" : ""} terminée${done > 1 ? "s" : ""} sur ${total}</span>`
    : `<span class="list-row__meta">Aucune séance ajoutée pour l'instant</span>`;

  return `
    <a class="card card--interactive list-row" href="#" onclick="gymNavigate('programme-detail', {id:'${program.id}'}); return false;" style="align-items:flex-start; flex-direction:column; gap:16px;">
      <div class="list-row" style="width:100%;">
        ${gymThumb(program.icon, "thumb--sm")}
        <div class="list-row__body">
          <span class="list-row__title">${program.name}</span>
          <span class="list-row__meta">${program.sessionsCount} séances · ${program.frequencyPerWeek}x/semaine</span>
        </div>
        <button type="button" class="icon-btn icon-btn--sm" title="Supprimer le programme" onclick="event.preventDefault(); event.stopPropagation(); gymDeleteProgram('${program.id}');">${gymIcon("trash")}</button>
      </div>
      <div style="width:100%; display:flex; flex-direction:column; gap:8px;">
        ${progressBlock}
      </div>
    </a>
  `;
}

/**
 * Ligne de séance dans le détail d'un programme.
 */
function gymRenderSessionRow(session, programId) {
  const isLocked = session.status === "verrouillee";
  const wrapperTag = isLocked ? "div" : "a";
  const hrefAttr = isLocked
    ? ""
    : `href="#" onclick="gymNavigate('seance-active', {session:'${session.id}'}); return false;"`;
  const activeStyle = session.status === "en-cours" ? "border-color: var(--gym-accent-border);" : "";

  return `
    <${wrapperTag} class="card card--interactive list-row" ${hrefAttr} style="${activeStyle}">
      <div class="icon-circle icon-circle--sm" style="background:${session.status === "en-cours" ? "var(--gym-accent)" : "rgba(255,255,255,0.06)"}; color:${session.status === "en-cours" ? "var(--gym-accent-text-on)" : "var(--gym-text)"};">
        <span style="font-weight:800; font-size:13px; color:${session.status === "en-cours" ? "var(--gym-accent-text-on)" : "var(--gym-text)"};">${session.index}</span>
      </div>
      <div class="list-row__body">
        <span class="list-row__title">Séance ${session.index}</span>
        <span class="list-row__meta">${gymFormatDate(session.date)}</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
        <span class="list-row__meta">${gymFormatDuration(session.duration)} · ${session.exerciseIds.length} exercices</span>
        <div style="display:flex; align-items:center; gap:6px;">
          ${gymBadgeSessionStatus(session.status)}
          <button type="button" class="icon-btn icon-btn--sm" title="Supprimer la séance" onclick="event.preventDefault(); event.stopPropagation(); gymDeleteSession('${programId}','${session.id}');">${gymIcon("trash")}</button>
        </div>
      </div>
    </${wrapperTag}>
  `;
}

/**
 * Ligne d'exercice dans le formulaire "Créer une séance" (avec suppression).
 * La suppression passe par un data-attribute + délégation d'événement côté
 * page (plutôt qu'un onclick inline) pour rester compatible avec la vue en
 * module (fonction de suppression scopée à la page, pas globale).
 */
function gymRenderEditableExerciseRow(exerciseId, sets, reps, rest, tempo, rowIndex) {
  const exo = gymGetExercise(exerciseId);
  if (!exo) return "";
  return `
    <div class="exercise-row" data-row-index="${rowIndex}">
      ${gymThumb(exo.icon, "thumb--sm")}
      <div class="exercise-row__info">
        <span class="exercise-row__name">${exo.name}</span>
        <span class="badge badge--tag">${exo.muscle}</span>
      </div>
      <button class="icon-btn" aria-label="Supprimer l'exercice" data-remove-index="${rowIndex}">${gymIcon("trash")}</button>
      <div class="exercise-row__stats">
        <div class="exercise-row__stat">
          <label>Séries</label>
          <select class="select-chip" data-field="sets">
            <option value="" ${!sets ? "selected" : ""}>—</option>
            ${[2, 3, 4, 5].map((n) => `<option value="${n}" ${n === sets ? "selected" : ""}>${n}</option>`).join("")}
          </select>
        </div>
        <div class="exercise-row__stat">
          <label>Répétitions</label>
          <select class="select-chip" data-field="reps">
            <option value="" ${!reps ? "selected" : ""}>—</option>
            ${["6-8", "8-10", "10-12", "12-15", "15-20"].map((r) => `<option value="${r}" ${r === reps ? "selected" : ""}>${r}</option>`).join("")}
          </select>
        </div>
        <div class="exercise-row__stat">
          <label>Repos</label>
          <select class="select-chip" data-field="rest">
            <option value="" ${!rest ? "selected" : ""}>—</option>
            ${GYM_DATA.restOptions.map((r) => `<option value="${r.value}" ${r.value === rest ? "selected" : ""}>${r.label}</option>`).join("")}
          </select>
        </div>
        <div class="exercise-row__stat">
          <label>Tempo</label>
          <select class="select-chip" data-field="tempo">
            <option value="" ${!tempo ? "selected" : ""}>—</option>
            ${GYM_DATA.tempoOptions.map((t) => `<option value="${t}" ${t === tempo ? "selected" : ""}>${t}</option>`).join("")}
          </select>
        </div>
      </div>
    </div>
  `;
}

/**
 * Carte "catégorie" pour la page Exercices.
 */
function gymRenderCategoryRow(category) {
  return `
    <a class="card card--interactive list-row" href="#" onclick="gymNavigate('exercices', {filtre:'${category.id}'}); return false;">
      ${gymThumb(category.icon, "thumb--sm")}
      <div class="list-row__body">
        <span class="list-row__title">${category.name}</span>
        <span class="list-row__meta">${category.count} exercices</span>
        <span class="list-row__meta">${category.description}</span>
      </div>
      <span class="list-row__chevron">${gymIcon("chevronRight")}</span>
    </a>
  `;
}

/**
 * Carte "objectif" avec anneau de progression circulaire.
 */
function gymRenderGoalCard(goal) {
  const { circumference, offset } = gymRingProgress(goal.percent, 15.5);
  return `
    <a class="card card--interactive" href="#" onclick="gymNavigate('objectifs'); return false;" style="display:flex; flex-direction:column; gap:12px;">
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="ring">
            <svg viewBox="0 0 40 40">
              <circle class="ring__track" cx="20" cy="20" r="15.5"></circle>
              <circle class="ring__fill" cx="20" cy="20" r="15.5" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}" data-offset="${offset}"></circle>
            </svg>
            <span class="ring__icon">${gymIcon(goal.icon)}</span>
          </div>
          <span class="list-row__title">${goal.title}</span>
        </div>
        <span class="list-row__chevron">${gymIcon("chevronRight")}</span>
      </div>
      <span style="font-size:22px; font-weight:800;" data-counter="${goal.percent}">0%</span>
      <span class="list-row__meta">${goal.progressLabel}</span>
      <div class="progress-track progress-track--thin"><div class="progress-fill" data-progress="${goal.percent}" style="width:0%"></div></div>
      <span class="list-row__meta">${gymIcon("calendar")} Objectif : ${gymFormatDate(goal.deadline)}</span>
    </a>
  `;
}

/**
 * Ligne d'historique groupée par mois.
 */
function gymRenderHistoryRow(entry) {
  const metaLine = entry.duration
    ? `${gymIcon("calendar")} ${gymFormatDate(entry.date)} · ${gymFormatDuration(entry.duration)}`
    : `${gymIcon("calendar")} ${gymFormatDate(entry.date)}`;
  const targetView = entry.type === "programme" ? "programme-detail" : "historique";
  return `
    <a class="card card--interactive list-row" href="#" onclick="gymNavigate('${targetView}'); return false;">
      ${gymThumb(entry.icon, "thumb--sm")}
      <div class="list-row__body">
        <span class="list-row__title">${entry.typeLabel}</span>
        <span class="list-row__meta">${entry.sessionLabel}</span>
        <span class="badge badge--tag" style="width:fit-content; margin-top:2px;">${entry.tag}</span>
        <span class="list-row__meta">${metaLine}</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
        ${gymDelta(entry.delta)}
        <span class="list-row__meta" style="font-size:11.5px;">${entry.deltaLabel}</span>
      </div>
    </a>
  `;
}

/* ==========================================================================
   GYM — Vue : Accueil
   Contenu statique défini directement dans le HTML, aucun rendu JS requis.
   ========================================================================== */

/* ==========================================================================
   GYM — Vue : Programmes
   ========================================================================== */

(function () {
  function renderMyPrograms() {
    const list = document.getElementById("programmes-list");
    list.innerHTML = GYM_DATA.programs.length
      ? GYM_DATA.programs.map((p) => gymRenderProgramCard(p)).join("")
      : `<div class="card" style="text-align:center; color:var(--gym-text-secondary); font-size:14px;">Aucun programme pour l'instant. Crée le premier avec le bouton ci-dessus.</div>`;
    animateProgressBars();
  }

  function renderLibrary() {
    const list = document.getElementById("programmes-list");
    list.innerHTML = GYM_DATA.programLibrary
      .map(
        (tpl) => `
        <a class="card card--interactive list-row" href="#" onclick="gymNavigate('creer-programme', {objectif:'${tpl.goal}'}); return false;">
          ${gymThumb(tpl.icon, "thumb--sm")}
          <div class="list-row__body">
            <span class="list-row__title">${tpl.name}</span>
            <span class="list-row__meta">${tpl.sessionsCount} séances · ${tpl.frequencyPerWeek}x/semaine · ${tpl.level}</span>
            <span class="list-row__meta">${tpl.description}</span>
          </div>
          <span class="list-row__chevron">${gymIcon("chevronRight")}</span>
        </a>
      `
      )
      .join("");
  }

  function animateProgressBars() {
    document.querySelectorAll("#view-programmes .progress-fill[data-progress]").forEach((el) => {
      gymAnimateProgress(el, Number(el.dataset.progress));
    });
  }

  // Liaison unique : les onglets existent dès le chargement du document.
  gymSetupTabs(document.getElementById("programmes-tabs"), (value) => {
    if (value === "bibliotheque") renderLibrary();
    else renderMyPrograms();
  });

  function render() {
    const tabs = document.getElementById("programmes-tabs");
    tabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
    tabs.querySelector('[data-value="mes-programmes"]').classList.add("is-active");
    renderMyPrograms();
  }

  GymViews["programmes"] = { render };
})();

/* ==========================================================================
   GYM — Vue : Détail d'un programme
   ========================================================================== */

(function () {
  function renderHero(program) {
    // Image selon l'objectif : images/ProgrammeForce.png, ProgrammeEndurance.png,
    // ProgrammeHypertrophie.png, ProgrammeVitesse.png
    const goalId = program.goal || "";
    const imageName = `Programme${goalId.charAt(0).toUpperCase()}${goalId.slice(1)}`;
    document.getElementById("program-hero").innerHTML = `
      <div class="hero-photo">
        <img class="hero-photo__image" src="images/${imageName}.png" alt="">
        <div class="hero-photo__content">
          <span class="gym-eyebrow">Programme</span>
          <h1 class="gym-title-xl" style="margin:6px 0 8px;">${program.name}</h1>
          <p class="gym-subtitle">${program.description}</p>
        </div>
      </div>
    `;
  }

  function renderEmptyState() {
    document.getElementById("program-hero").innerHTML = `
      <div class="card" style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:12px; padding:32px 20px;">
        <div class="icon-circle">${gymIcon("dumbbell")}</div>
        <div>
          <p class="list-row__title">Programme introuvable</p>
          <p class="list-row__meta">Il n'existe pas encore de programme à afficher ici.</p>
        </div>
        <a class="btn btn-primary" href="#" onclick="gymNavigate('programmes'); return false;" style="width:auto; padding:12px 22px; font-size:13.5px;">Retour aux programmes</a>
      </div>
    `;
    document.getElementById("program-info-row").innerHTML = "";
    document.getElementById("program-progress-card").innerHTML = "";
    document.getElementById("icon-add-session").innerHTML = "";
    document.getElementById("program-sessions-list").innerHTML = "";
  }

  function renderInfoRow(program) {
    document.getElementById("program-info-row").innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:8px; text-align:center;">
        <div class="summary-item">${gymIcon("dumbbell")}<span class="summary-item__value">${program.sessionsCount} séances</span><span class="summary-item__label">${program.frequencyPerWeek}x/semaine</span></div>
        <div class="summary-item">${gymIcon("target")}<span class="summary-item__label">Objectif</span><span class="summary-item__value">${program.objectiveLabel}</span></div>
      </div>
    `;
  }

  function renderActions(program) {
    document.getElementById("program-progress-card").innerHTML = `
      <div class="btn-grid">
        <button class="btn btn-primary" onclick="gymNavigate('creer-seance', {programme:'${program.id}'});">${gymIcon("plus")} Créer une séance</button>
        <button class="btn btn-secondary" onclick="gymSaveProgram('${program.id}', this);">${gymIcon("doc")} Enregistrer le programme</button>
        <button class="btn btn-secondary" onclick="gymNavigate('creer-programme', {id:'${program.id}'});">${gymIcon("edit")} Modifier le programme</button>
        <button class="btn btn-danger" onclick="gymDeleteProgram('${program.id}');">${gymIcon("trash")} Supprimer le programme</button>
      </div>
    `;
  }

  function renderSessionsList(program) {
    document.getElementById("icon-add-session").innerHTML = gymIcon("plus");
    const container = document.getElementById("program-sessions-list");
    container.innerHTML = program.sessions.length
      ? program.sessions.map((s) => gymRenderSessionRow(s, program.id)).join("")
      : `<div class="card" style="text-align:center; color:var(--gym-text-secondary); font-size:14px;">Tu n'as pas encore ajouté de séance à ce programme.</div>`;
  }

  function render(params) {
    const program = gymGetProgram(params.id);
    if (!program) {
      renderEmptyState();
      return;
    }
    renderHero(program);
    renderInfoRow(program);
    renderActions(program);
    renderSessionsList(program);
  }

  GymViews["programme-detail"] = { render };
})();

/* ==========================================================================
   GYM — Vue : Créer un programme
   ========================================================================== */

(function () {
  const state = {
    titre: "",
    goal: "force",
    seances: null,
    duree: null,
  };

  function fillIcons() {
    document.getElementById("cp-hero-icon").innerHTML = gymIcon("dumbbell");
    document.getElementById("icon-field-titre").innerHTML = gymIcon("edit");
    document.getElementById("icon-field-seances").innerHTML = gymIcon("calendar");
    document.getElementById("icon-field-duree").innerHTML = gymIcon("calendar");
    document.getElementById("icon-recap-target").innerHTML = gymIcon("target");
    document.getElementById("icon-recap-1").innerHTML = gymIcon("dumbbell");
    document.getElementById("icon-recap-2").innerHTML = gymIcon("calendar");
    document.getElementById("icon-recap-3").innerHTML = gymIcon("calendar");
  }

  function renderGoalGrid() {
    const grid = document.getElementById("objectif-grid");
    grid.innerHTML = GYM_DATA.trainingGoals
      .map(
        (goal) => `
        <button type="button" class="choice choice--radio ${goal.id === state.goal ? "is-active" : ""}" data-value="${goal.id}">
          ${gymIcon(goal.icon)}
          <span class="choice__label">${goal.label}</span>
          <span class="choice__radio"></span>
        </button>
      `
      )
      .join("");
  }

  function updateRecap() {
    const goal = GYM_DATA.trainingGoals.find((g) => g.id === state.goal);
    document.getElementById("recap-objectif").textContent = goal ? goal.label : "—";
    document.getElementById("recap-seances").textContent = state.seances ? `${state.seances}/semaine` : "—";
    document.getElementById("recap-duree").textContent = state.duree ? `${state.duree} sem.` : "—";
  }

  function onGenerate() {
    if (!state.seances || !state.duree) {
      // Pas de séances/durée renseignées : on met en avant le champ à compléter.
      if (!state.seances) document.getElementById("input-seances").focus();
      else document.getElementById("input-duree").focus();
      return;
    }
    const goal = GYM_DATA.trainingGoals.find((g) => g.id === state.goal);
    const customTitle = state.titre.trim();
    const newProgram = {
      id: `prog-${Date.now()}`,
      name: customTitle || `Programme ${goal ? goal.label : ""}`.trim(),
      goal: state.goal,
      description: "Ton programme personnalisé. Ajoute tes premières séances pour commencer à progresser.",
      sessionsCount: state.seances * state.duree,
      frequencyPerWeek: state.seances,
      objectiveLabel: goal ? goal.label : "",
      currentIndex: 1,
      icon: goal ? goal.icon : "dumbbell",
      sessions: [],
    };
    GYM_DATA.programs.push(newProgram);
    gymNavigate("programme-detail", { id: newProgram.id });
  }

  gymSetupChoiceGrid(document.getElementById("objectif-grid"), {
    onChange: (value) => {
      state.goal = value;
      updateRecap();
    },
  });
  document.getElementById("input-titre").addEventListener("input", (e) => {
    state.titre = e.target.value;
  });
  document.getElementById("input-seances").addEventListener("input", (e) => {
    state.seances = e.target.value ? Number(e.target.value) : null;
    updateRecap();
  });
  document.getElementById("input-duree").addEventListener("input", (e) => {
    state.duree = e.target.value ? Number(e.target.value) : null;
    updateRecap();
  });
  document.getElementById("btn-generer").addEventListener("click", onGenerate);

  function render(params) {
    state.titre = "";
    state.goal = (params && params.objectif) || "force";
    state.seances = null;
    state.duree = null;
    document.getElementById("input-titre").value = "";
    document.getElementById("input-seances").value = "";
    document.getElementById("input-duree").value = "";

    fillIcons();
    renderGoalGrid();
    updateRecap();
  }

  GymViews["creer-programme"] = { render };
})();

/* ==========================================================================
   GYM — Vue : Créer une séance
   ========================================================================== */

(function () {
  const state = {
    programId: null,
    categories: [],
    goals: [],
    rest: "90s",
    tempo: "2-0-2-0",
    exercises: [],
  };

  function closeIconSvg() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
  }

  function fillIcons() {
    document.getElementById("program-picker-chevron").innerHTML = gymIcon("chevronDown");
    document.getElementById("icon-plus-add").innerHTML = gymIcon("plus");
    document.getElementById("icon-check-create").innerHTML = gymIcon("check");
    document.getElementById("sheet-close").innerHTML = closeIconSvg();
    document.getElementById("program-sheet-close").innerHTML = closeIconSvg();
    document.getElementById("icon-sheet-search").innerHTML = gymIcon("search");
    document.getElementById("creer-seance-empty-icon").innerHTML = gymIcon("dumbbell");
  }

  /* ---- Étape 1 : sélection du programme (bottom sheet, toujours au premier plan) --- */

  function renderProgramPicker() {
    const program = gymGetProgram(state.programId);
    if (!program) return;
    document.getElementById("program-picker-icon").innerHTML = gymIcon("calendarPlus");
    document.getElementById("program-picker-name").textContent = program.name;
    document.getElementById("program-picker-meta").textContent = `${program.sessionsCount} séances · ${program.frequencyPerWeek} séances / semaine`;
  }

  function openProgramSheet() {
    document.getElementById("program-sheet-body").innerHTML = GYM_DATA.programs
      .map(
        (p) => `
        <button type="button" class="sheet__row" data-program-id="${p.id}">
          <div class="icon-circle icon-circle--sm">${gymIcon(p.icon)}</div>
          <div class="list-row__body">
            <span class="list-row__title">${p.name}</span>
            <span class="list-row__meta">${p.sessionsCount} séances · ${p.frequencyPerWeek}x/semaine</span>
          </div>
          ${p.id === state.programId ? `<span style="color:var(--gym-accent); flex-shrink:0;">${gymIcon("check")}</span>` : ""}
        </button>
      `
      )
      .join("");

    document.querySelectorAll("#program-sheet-body [data-program-id]").forEach((row) => {
      row.addEventListener("click", () => {
        state.programId = row.dataset.programId;
        renderProgramPicker();
        closeProgramSheet();
      });
    });

    document.getElementById("program-sheet-overlay").classList.add("is-open");
    document.getElementById("program-sheet").classList.add("is-open");
  }

  function closeProgramSheet() {
    document.getElementById("program-sheet-overlay").classList.remove("is-open");
    document.getElementById("program-sheet").classList.remove("is-open");
  }

  /* ---- Étape 2 : catégorie (choix multiple) -------------------------------------- */

  function renderCategoryGrid() {
    const grid = document.getElementById("category-grid");
    grid.innerHTML = GYM_DATA.sessionCategories
      .map(
        (cat) => `
        <button type="button" class="choice ${state.categories.includes(cat.id) ? "is-active" : ""}" data-value="${cat.id}">
          ${gymIcon(cat.icon)}
          <span class="choice__label">${cat.label}</span>
        </button>
      `
      )
      .join("");
  }

  /* ---- Étape 3 : objectif (choix multiple) ---------------------------------------- */

  function renderGoalGrid() {
    const grid = document.getElementById("goal-grid");
    grid.innerHTML = GYM_DATA.trainingGoals
      .map(
        (goal) => `
        <button type="button" class="choice ${state.goals.includes(goal.id) ? "is-active" : ""}" data-value="${goal.id}">
          ${gymIcon(goal.icon)}
          <span class="choice__label">${goal.label}</span>
        </button>
      `
      )
      .join("");
  }

  /* ---- Étape 4 : liste des exercices --------------------------------------------- */

  function renderExerciseList() {
    const container = document.getElementById("exercise-list");
    container.innerHTML = state.exercises.length
      ? state.exercises
          .map((item, index) => gymRenderEditableExerciseRow(item.exerciseId, item.sets, item.reps, item.rest, item.tempo, index))
          .join("")
      : `<div class="card" style="text-align:center; color:var(--gym-text-secondary); font-size:14px;">Aucun exercice ajouté pour l'instant.</div>`;

    container.querySelectorAll(".exercise-row").forEach((row) => {
      const index = Number(row.dataset.rowIndex);
      row.querySelector('[data-field="sets"]').addEventListener("change", (e) => {
        state.exercises[index].sets = e.target.value ? Number(e.target.value) : "";
      });
      row.querySelector('[data-field="reps"]').addEventListener("change", (e) => {
        state.exercises[index].reps = e.target.value;
      });
      row.querySelector('[data-field="rest"]').addEventListener("change", (e) => {
        state.exercises[index].rest = e.target.value;
      });
      row.querySelector('[data-field="tempo"]').addEventListener("change", (e) => {
        state.exercises[index].tempo = e.target.value;
      });
      row.querySelector("[data-remove-index]").addEventListener("click", () => {
        state.exercises.splice(index, 1);
        renderExerciseList();
      });
    });
  }

  /* ---- Bottom sheet : ajout d'exercice — recherche manuelle, jamais restreinte --- */

  function renderExerciseSheetList(query) {
    const raw = query.trim();
    const q = raw.toLowerCase();
    const list = q
      ? EXERCISES.filter((e) => e.name.toLowerCase().includes(q) || e.muscle.toLowerCase().includes(q))
      : EXERCISES;

    const customRow = raw
      ? `
        <button type="button" class="sheet__row" id="sheet-add-custom" style="border:1.5px dashed var(--gym-accent-border);">
          <span class="icon-circle icon-circle--sm" style="color:var(--gym-accent);">${gymIcon("plus")}</span>
          <div class="list-row__body">
            <span class="list-row__title" style="color:var(--gym-accent);">Ajouter « ${raw} »</span>
            <span class="list-row__meta">Exercice personnalisé, absent de la base</span>
          </div>
        </button>
      `
      : "";

    document.getElementById("sheet-body").innerHTML =
      customRow +
      (list.length
        ? list
            .map(
              (exo) => `
        <button type="button" class="sheet__row" data-exercise-id="${exo.id}">
          ${gymThumb(exo.icon, "thumb--sm")}
          <div class="list-row__body">
            <span class="list-row__title">${exo.name}</span>
            <span class="badge badge--tag">${exo.muscle}</span>
          </div>
          <span class="list-row__chevron" style="color:var(--gym-accent);">${gymIcon("plus")}</span>
        </button>
      `
            )
            .join("")
        : raw
        ? ""
        : `<div class="card" style="text-align:center; color:var(--gym-text-secondary); font-size:14px;">Aucun exercice ne correspond à ta recherche.</div>`);

    const addCustomRow = document.getElementById("sheet-add-custom");
    if (addCustomRow) {
      addCustomRow.addEventListener("click", () => {
        const customExercise = {
          id: `custom-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
          name: raw,
          muscle: "Exercice personnalisé",
          bodyRegion: null,
          equipment: null,
          icon: "dumbbell",
          custom: true,
        };
        EXERCISES.push(customExercise);
        state.exercises.push({ exerciseId: customExercise.id, sets: "", reps: "", rest: "", tempo: "" });
        renderExerciseList();
        closeExerciseSheet();
      });
    }

    document.querySelectorAll("#sheet-body [data-exercise-id]").forEach((row) => {
      row.addEventListener("click", () => {
        state.exercises.push({ exerciseId: row.dataset.exerciseId, sets: "", reps: "", rest: "", tempo: "" });
        renderExerciseList();
        closeExerciseSheet();
      });
    });
  }

  function openExerciseSheet() {
    const searchInput = document.getElementById("sheet-search-input");
    searchInput.value = "";
    renderExerciseSheetList("");
    document.getElementById("sheet-overlay").classList.add("is-open");
    document.getElementById("exercise-sheet").classList.add("is-open");
    searchInput.focus();
  }

  function closeExerciseSheet() {
    document.getElementById("sheet-overlay").classList.remove("is-open");
    document.getElementById("exercise-sheet").classList.remove("is-open");
  }

  /* ---- Validation finale ------------------------------------------------------------ */

  function onCreateSession() {
    const program = gymGetProgram(state.programId);
    if (!program) return;

    const categoryLabels = GYM_DATA.sessionCategories.filter((c) => state.categories.includes(c.id)).map((c) => c.label);
    const goalLabels = GYM_DATA.trainingGoals.filter((g) => state.goals.includes(g.id)).map((g) => g.label);
    const nextIndex = program.sessions.length + 1;

    const newSession = {
      id: `${program.id}-s${nextIndex}`,
      index: nextIndex,
      title: [categoryLabels.join(", "), goalLabels.join(", ")].filter(Boolean).join(" · "),
      date: new Date(),
      duration: 45,
      exerciseIds: state.exercises.map((e) => e.exerciseId),
      exercises: state.exercises.map((e) => ({ exerciseId: e.exerciseId, sets: e.sets, reps: e.reps, rest: e.rest, tempo: e.tempo })),
      status: nextIndex === 1 ? "en-cours" : "verrouillee",
      goal: state.goals[0] || null,
      focusLabel: goalLabels.join(", "),
      level: program.level,
    };

    program.sessions.push(newSession);
    program.sessionsCount = Math.max(program.sessionsCount, program.sessions.length);
    if (newSession.status === "en-cours") program.currentIndex = newSession.index;

    gymNavigate("programme-detail", { id: program.id });
  }

  // Liaisons statiques (une seule fois, les éléments existent dès le chargement).
  document.getElementById("program-picker-btn").addEventListener("click", openProgramSheet);
  document.getElementById("program-sheet-overlay").addEventListener("click", closeProgramSheet);
  document.getElementById("program-sheet-close").addEventListener("click", closeProgramSheet);
  gymSetupChoiceGrid(document.getElementById("category-grid"), {
    multiple: true,
    onChange: (values) => (state.categories = values),
  });
  gymSetupChoiceGrid(document.getElementById("goal-grid"), {
    multiple: true,
    onChange: (values) => (state.goals = values),
  });
  document.getElementById("btn-add-exercise").addEventListener("click", openExerciseSheet);
  document.getElementById("sheet-overlay").addEventListener("click", closeExerciseSheet);
  document.getElementById("sheet-close").addEventListener("click", closeExerciseSheet);
  document.getElementById("sheet-search-input").addEventListener(
    "input",
    gymDebounce((e) => renderExerciseSheetList(e.target.value), 120)
  );
  document.getElementById("btn-create-session").addEventListener("click", onCreateSession);

  function render(params) {
    fillIcons();

    if (!GYM_DATA.programs.length) {
      document.getElementById("creer-seance-empty").style.display = "flex";
      document.getElementById("creer-seance-form").style.display = "none";
      return;
    }
    document.getElementById("creer-seance-empty").style.display = "none";
    document.getElementById("creer-seance-form").style.display = "flex";

    state.programId = (params && params.programme && gymGetProgram(params.programme) && params.programme) || GYM_DATA.programs[0].id;
    state.categories = [];
    state.goals = [];
    state.exercises = [];

    renderProgramPicker();
    renderCategoryGrid();
    renderGoalGrid();
    renderExerciseList();
  }

  GymViews["creer-seance"] = { render };
})();

/* ==========================================================================
   GYM — Vue : Exercices
   ========================================================================== */

(function () {

  const state = {
    region: "tous",
    search: "",
    equipment: "tous",
    activeCategory: null,
  };

  function emptyState(message) {
    return `<div class="card" style="text-align:center; color:var(--gym-text-secondary); font-size:14px;">${message}</div>`;
  }

  function renderCategoriesList() {
    document.getElementById("region-tabs").style.display = "flex";
    let categories = GYM_DATA.categories;

    if (state.region !== "tous") {
      categories = categories.filter((c) => c.regions.includes(state.region));
    }
    if (state.search) {
      categories = categories.filter(
        (c) => c.name.toLowerCase().includes(state.search) || c.description.toLowerCase().includes(state.search)
      );
    }

    const list = document.getElementById("category-list");
    list.innerHTML = categories.length
      ? categories.map((c) => gymRenderCategoryRow(c)).join("")
      : emptyState("Aucune catégorie ne correspond à ta recherche.");
  }

  function renderCategoryDrilldown(categoryId) {
    const category = GYM_DATA.categories.find((c) => c.id === categoryId);
    if (!category) {
      state.activeCategory = null;
      renderView();
      return;
    }

    document.getElementById("region-tabs").style.display = "none";

    let pool = gymGetCategoryPool(categoryId);

    if (state.equipment !== "tous") {
      pool = pool.filter((e) => e.equipment === state.equipment);
    }
    if (state.search) {
      pool = pool.filter(
        (e) => e.name.toLowerCase().includes(state.search) || e.muscle.toLowerCase().includes(state.search)
      );
    }

    const list = document.getElementById("category-list");
    const backRow = `
      <button type="button" class="gym-link" id="back-to-categories" style="margin-bottom:4px;">
        ${gymIcon("back")} Toutes les catégories
      </button>
    `;

    if (!pool.length) {
      list.innerHTML = backRow + emptyState("Aucun exercice ne correspond à ces filtres pour l'instant.");
    } else {
      list.innerHTML =
        backRow +
        `<span class="list-row__meta" style="margin-bottom:-4px;">${category.name} · ${pool.length} exercices</span>` +
        pool
          .map(
            (exo) => `
          <div class="card card--interactive list-row">
            ${gymThumb(exo.icon, "thumb--sm")}
            <div class="list-row__body">
              <span class="list-row__title">${exo.name}</span>
              <span class="badge badge--tag" style="width:fit-content;">${exo.muscle}</span>
            </div>
            <span class="list-row__chevron">${gymIcon("chevronRight")}</span>
          </div>
        `
          )
          .join("");
    }

    document.getElementById("back-to-categories").addEventListener("click", () => {
      state.activeCategory = null;
      renderView();
    });
  }

  function renderView() {
    if (state.activeCategory) renderCategoryDrilldown(state.activeCategory);
    else renderCategoriesList();
  }

  document.getElementById("ex-hero-icon").innerHTML = gymIcon("running");
  document.getElementById("icon-search").innerHTML = gymIcon("search");
  document.getElementById("icon-sliders").innerHTML = gymIcon("sliders");
  document.getElementById("icon-chevron-filter").innerHTML = gymIcon("chevronDown");

  gymSetupTabs(document.getElementById("region-tabs"), (value) => {
    state.region = value;
    renderView();
  });
  gymSetupTabs(document.getElementById("equipment-filter"), (value) => {
    state.equipment = value;
    renderView();
  });
  gymSetupTabs(document.getElementById("level-filter"), () => {
    /* Niveau : filtre illustratif, sans donnée de niveau par exercice. */
  });
  document.getElementById("search-input").addEventListener(
    "input",
    gymDebounce((e) => {
      state.search = e.target.value.trim().toLowerCase();
      renderView();
    }, 150)
  );
  document.getElementById("advanced-filter-toggle").addEventListener("click", (e) => {
    const panel = document.getElementById("advanced-filter-panel");
    const isOpen = panel.style.display === "flex";
    panel.style.display = isOpen ? "none" : "flex";
    e.currentTarget.classList.toggle("is-open", !isOpen);
  });

  function render(params) {
    state.activeCategory = (params && params.filtre) || null;
    state.region = "tous";
    state.search = "";
    state.equipment = "tous";
    document.getElementById("search-input").value = "";

    const regionTabs = document.getElementById("region-tabs");
    regionTabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
    regionTabs.querySelector('[data-value="tous"]').classList.add("is-active");

    const equipmentTabs = document.getElementById("equipment-filter");
    equipmentTabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
    equipmentTabs.querySelector('[data-value="tous"]').classList.add("is-active");

    renderView();
  }

  GymViews["exercices"] = { render };
})();

/* ==========================================================================
   GYM — Vue : Séance active
   ========================================================================== */

(function () {
  const state = {
    program: null,
    session: null,
    exercises: [], // [{ exerciseId, name, repsLabel, restLabel, sets: [{weight, reps, target, valid, status}] }]
    exerciseIndex: 0,
    elapsedMs: 0,
    timerStart: null,
    timerInterval: null,
    isPaused: true,
  };

  /**
   * Déduit une répétition cible à partir d'une chaîne du type "8-12" ou "10"
   * (on retient la borne haute d'une plage saisie à la création).
   */
  function parseRepsTarget(reps) {
    if (typeof reps === "number") return reps;
    const match = String(reps || "").match(/(\d+)(?!.*\d)/);
    return match ? Number(match[1]) : 10;
  }

  /**
   * Construit, pour chaque exercice de la séance, le détail de ses séries
   * (poids/répétitions saisis pendant l'exécution, initialement vides).
   */
  function buildExerciseState(session) {
    return gymGetSessionDetail(session).map((item) => {
      const target = parseRepsTarget(item.reps);
      const setsCount = Math.max(1, Number(item.sets) || 1);
      return {
        exerciseId: item.exerciseId,
        name: item.name,
        repsLabel: item.reps,
        restLabel: item.rest,
        tempoLabel: item.tempo || "—",
        sets: Array.from({ length: setsCount }, (_, i) => ({
          weight: "",
          reps: 0,
          target,
          valid: false,
          status: i === 0 ? "en-cours" : "a-venir",
        })),
      };
    });
  }

  /* ---- Minuteur de séance ---------------------------------------------------- */

  function formatElapsed(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(Math.floor(totalSeconds / 3600))}:${pad(Math.floor((totalSeconds % 3600) / 60))}:${pad(totalSeconds % 60)}`;
  }

  function tickTimer() {
    const elapsed = state.elapsedMs + (state.timerStart ? Date.now() - state.timerStart : 0);
    document.getElementById("session-timer").textContent = formatElapsed(elapsed);
  }

  function stopTimerInterval() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  }

  // L'icône reflète toujours l'état réel : play = chrono arrêté, pause = chrono en marche
  function syncPauseIcon() {
    document.getElementById("icon-session-pause").innerHTML = gymIcon(state.isPaused ? "play" : "pause");
  }

  function startTimer() {
    stopTimerInterval();
    state.timerStart = Date.now();
    state.isPaused = false;
    syncPauseIcon();
    state.timerInterval = setInterval(tickTimer, 1000);
    tickTimer();
  }

  function togglePause() {
    if (state.isPaused) {
      startTimer();
      return;
    }
    state.elapsedMs += state.timerStart ? Date.now() - state.timerStart : 0;
    state.timerStart = null;
    state.isPaused = true;
    stopTimerInterval();
    syncPauseIcon();
    tickTimer(); // affiche la valeur exacte au moment de la pause
  }

  // Chrono remis à 00:00:00 et arrêté (aucune séance active)
  function resetTimer() {
    stopTimerInterval();
    state.elapsedMs = 0;
    state.timerStart = null;
    state.isPaused = true;
    syncPauseIcon();
    tickTimer();
  }

  document.getElementById("icon-session-timer").innerHTML = gymIcon("clock");
  document.getElementById("icon-session-reset").innerHTML = gymIcon("reset");
  document.getElementById("btn-toggle-timer").addEventListener("click", togglePause);
  document.getElementById("btn-reset-timer").addEventListener("click", resetTimer);
  syncPauseIcon(); // icône présente dès le chargement

  /* ---- En-tête ---------------------------------------------------------------- */

  function renderHead() {
    document.getElementById("session-eyebrow").textContent = `${state.program.name.toUpperCase()} · SÉANCE ${state.session.index}`;

    const backLink = document.getElementById("seance-active-back");
    backLink.onclick = (e) => {
      e.preventDefault();
      gymNavigate("programme-detail", { id: state.program.id });
    };
  }

  function currentExercise() {
    return state.exercises[state.exerciseIndex];
  }

  /* ---- Exercice courant : photo, titre, navigation ----------------------------- */

  function renderExerciseHero() {
    const total = state.exercises.length;
    const exo = currentExercise();

    document.getElementById("session-exo-position").textContent = `EXERCICE ${state.exerciseIndex + 1} / ${total}`;
    document.getElementById("session-exercise-title").textContent = exo.name;

    document.getElementById("btn-prev-exercise").disabled = state.exerciseIndex === 0;
    document.getElementById("btn-next-exercise").disabled = state.exerciseIndex === total - 1;
  }

  function goToExercise(index) {
    if (index < 0 || index >= state.exercises.length) return;
    state.exerciseIndex = index;
    renderExerciseHero();
    renderSummary();
    renderSetsList();
  }

  document.getElementById("btn-prev-exercise").addEventListener("click", () => goToExercise(state.exerciseIndex - 1));
  document.getElementById("btn-next-exercise").addEventListener("click", () => goToExercise(state.exerciseIndex + 1));

  /* ---- Résumé séries / répétitions / repos -------------------------------------- */

  function renderSummary() {
    const exo = currentExercise();
    const validCount = exo.sets.filter((s) => s.valid).length;
    document.getElementById("session-info-row").innerHTML = `
      <div class="session-summary__item">
        <span class="session-summary__icon">${gymIcon("layers")}</span>
        <span class="session-summary__text">
          <span class="session-summary__label">Séries</span>
          <span class="session-summary__value">${validCount} / ${exo.sets.length}</span>
        </span>
      </div>
      <div class="session-summary__item">
        <span class="session-summary__icon">${gymIcon("dumbbell")}</span>
        <span class="session-summary__text">
          <span class="session-summary__label">Répétitions</span>
          <span class="session-summary__value">${exo.repsLabel}</span>
        </span>
      </div>
      <div class="session-summary__item">
        <span class="session-summary__icon">${gymIcon("clock")}</span>
        <span class="session-summary__text">
          <span class="session-summary__label">Temps de repos</span>
          <span class="session-summary__value">${exo.restLabel}</span>
        </span>
      </div>
      <div class="session-summary__item">
        <span class="session-summary__icon">${gymIcon("tempo")}</span>
        <span class="session-summary__text">
          <span class="session-summary__label">Tempo</span>
          <span class="session-summary__value">${exo.tempoLabel}</span>
        </span>
      </div>
    `;
  }

  /* ---- Liste des séries --------------------------------------------------------- */

  function statusBadge(status) {
    if (status === "terminee") return `${gymIcon("checkCircle")} Terminée`;
    if (status === "en-cours") return `${gymIcon("timer")} En cours`;
    return `${gymIcon("timer")} À venir`;
  }

  function updateNextButtonLabel() {
    const exo = currentExercise();
    const exerciseComplete = !exo.sets.some((s) => s.status === "en-cours");
    const isLastExercise = state.exerciseIndex === state.exercises.length - 1;
    document.getElementById("session-next-label").textContent = exerciseComplete && isLastExercise ? "Terminer la séance" : "Série suivante";
  }

  function renderSetsList() {
    const exo = currentExercise();
    const list = document.getElementById("session-sets-list");

    list.innerHTML = exo.sets
      .map((set, index) => {
        const stateClass = set.status === "terminee" ? "is-terminee" : set.status === "en-cours" ? "is-en-cours" : "is-a-venir";
        return `
      <div class="set-card ${stateClass}">
        <div class="set-card__top">
          <span class="set-card__number">${index + 1}</span>
          <span class="set-card__label">Série ${index + 1}</span>
          <span class="set-card__status">${statusBadge(set.status)}</span>
        </div>
        <div class="set-card__body">
          <div class="set-card__inputs">
            <div class="set-card__field set-card__field--weight">
              <span class="set-card__field-label">Poids</span>
              <div class="set-card__weight-row">
                <input type="number" inputmode="decimal" class="set-card__weight-input" placeholder="—" value="${set.weight}" data-set-index="${index}" data-field="weight" />
                <span class="set-card__unit">kg</span>
                <span class="set-card__valid-dot">${set.valid ? gymIcon("checkCircle") : gymIcon("timer")}</span>
              </div>
            </div>
            <div class="set-card__field set-card__field--reps">
              <span class="set-card__field-label">Répétitions</span>
              <div class="set-card__reps-row">
                <input type="number" class="set-card__reps-input" value="${set.reps}" data-set-index="${index}" data-field="reps" />
                <span class="set-card__reps-target">/ ${set.target}</span>
              </div>
            </div>
          </div>
          <button type="button" class="set-card__validate ${set.valid ? "is-valid" : ""}" data-set-index="${index}">
            ${set.valid ? gymIcon("check") : gymIcon("timer")} ${set.valid ? "Série validée" : "À compléter"}
          </button>
        </div>
      </div>
    `;
      })
      .join("");

    list.querySelectorAll('[data-field="weight"]').forEach((input) => {
      input.addEventListener("input", (e) => {
        exo.sets[Number(e.target.dataset.setIndex)].weight = e.target.value;
      });
    });
    list.querySelectorAll('[data-field="reps"]').forEach((input) => {
      input.addEventListener("input", (e) => {
        exo.sets[Number(e.target.dataset.setIndex)].reps = Number(e.target.value) || 0;
      });
    });
    list.querySelectorAll(".set-card__validate").forEach((btn) => {
      btn.addEventListener("click", () => toggleSetValid(Number(btn.dataset.setIndex)));
    });

    updateNextButtonLabel();
  }

  /**
   * Coche/décoche manuellement une série (bouton "Série validée"/"À compléter").
   */
  function toggleSetValid(index) {
    const exo = currentExercise();
    const set = exo.sets[index];
    set.valid = !set.valid;

    if (set.valid) {
      set.status = "terminee";
      if (!set.reps) set.reps = set.target;
      const next = exo.sets[index + 1];
      if (next && next.status === "a-venir") next.status = "en-cours";
    } else {
      set.status = index === 0 || exo.sets[index - 1].valid ? "en-cours" : "a-venir";
      const next = exo.sets[index + 1];
      if (next && !next.valid) next.status = "a-venir";
    }

    renderSetsList();
    renderSummary();
  }

  /* ---- Actions basses : série suivante / terminer la séance ---------------------- */

  /**
   * Valide la série en cours et passe à la suivante ; enchaîne sur
   * l'exercice suivant une fois toutes les séries validées, ou termine la
   * séance si c'était le dernier exercice.
   */
  function goToNextSeries() {
    const exo = currentExercise();
    const current = exo.sets.find((s) => s.status === "en-cours");

    if (current) {
      const index = exo.sets.indexOf(current);
      current.valid = true;
      current.status = "terminee";
      if (!current.reps) current.reps = current.target;
      const next = exo.sets[index + 1];
      if (next) {
        next.status = "en-cours";
        renderExerciseHero();
        renderSummary();
        renderSetsList();
        return;
      }
    }

    if (state.exerciseIndex < state.exercises.length - 1) {
      goToExercise(state.exerciseIndex + 1);
      return;
    }

    finalizeSession();
  }

  /**
   * Marque la séance comme terminée dans les données, déverrouille la
   * séance suivante du programme (si elle existe) et revient au détail
   * du programme pour voir la progression mise à jour.
   */
  function finalizeSession() {
    if (!state.session || !state.program) return;
    stopTimerInterval();
    state.session.status = "terminee";
    const next = state.program.sessions.find((s) => s.index === state.session.index + 1);
    if (next && next.status === "verrouillee") {
      next.status = "en-cours";
      state.program.currentIndex = next.index;
    }
    gymNavigate("programme-detail", { id: state.program.id });
  }

  document.getElementById("btn-next-series").addEventListener("click", goToNextSeries);

  document.getElementById("btn-finish-session").addEventListener("click", () => {
    const totalSets = state.exercises.reduce((sum, e) => sum + e.sets.length, 0);
    const validSets = state.exercises.reduce((sum, e) => sum + e.sets.filter((s) => s.valid).length, 0);
    if (validSets < totalSets && !confirm("Il reste des séries non validées. Terminer la séance maintenant ?")) return;
    finalizeSession();
  });

  /* ---- États vide / actif -------------------------------------------------------- */

  function renderEmptyState() {
    resetTimer();
    state.program = null;
    state.session = null;
    state.exercises = [];

    document.getElementById("session-eyebrow").textContent = "";
    document.getElementById("session-empty").style.display = "flex";
    document.getElementById("session-content").style.display = "none";
    document.getElementById("session-actions").style.display = "none";
    document.getElementById("session-timer").textContent = "00:00:00";

    const backLink = document.getElementById("seance-active-back");
    backLink.onclick = (e) => {
      e.preventDefault();
      gymNavigate("gym-home");
    };
  }

  function render(params) {
    const sessionId = params && params.session;
    const found = sessionId ? gymFindSessionById(sessionId) : { program: null, session: null };

    if (!found.program || !found.session) {
      renderEmptyState();
      return;
    }

    const { program, session } = found;
    // On revient sur la séance déjà affichée (ex. retour arrière puis re-entrée) :
    // on garde l'avancement des séries et le chrono continue sans se réinitialiser.
    const isSameSession = state.session && state.session.id === session.id;

    state.program = program;
    state.session = session;

    document.getElementById("session-empty").style.display = "none";
    document.getElementById("session-content").style.display = "flex";
    document.getElementById("session-actions").style.display = "flex";

    if (!isSameSession) {
      state.exercises = buildExerciseState(session);
      state.exerciseIndex = 0;
    }

    renderHead();
    renderExerciseHero();
    renderSummary();
    renderSetsList();

    if (isSameSession) {
      tickTimer();
    } else {
      // Chrono en pause par défaut au lancement d'une séance : c'est la personne
      // qui décide quand elle démarre son chrono (bouton lecture dans le header).
      resetTimer();
    }
  }

  GymViews["seance-active"] = { render };
})();

/* ==========================================================================
   GYM — Vue : Progression
   ========================================================================== */
(function () {
  function fillIcons() {
    document.getElementById("progression-empty-icon").innerHTML = gymIcon("trendUp");
  }

  function render() {
    fillIcons();
  }

  GymViews["progression"] = { render };
})();

/* ==========================================================================
   GYM — Vue : Historique
   ========================================================================== */

(function () {
  const state = {
    filter: "tous",
    pageSize: 6,
    visibleCount: 6,
  };

  function getFilteredEntries() {
    if (state.filter === "tous") return GYM_DATA.history;
    return GYM_DATA.history.filter((e) => e.type === state.filter);
  }

  function renderList() {
    const all = getFilteredEntries();
    const visible = all.slice(0, state.visibleCount);
    const groups = gymGroupHistoryByMonth(visible);
    const container = document.getElementById("history-groups");

    if (!visible.length) {
      container.innerHTML = `<div class="card" style="text-align:center; color:var(--gym-text-secondary); font-size:14px;">Aucune séance dans cette catégorie pour le moment.</div>`;
    } else {
      container.innerHTML = groups
        .map(
          (group) => `
          <div class="month-group">
            <span class="month-group__label">${group.label}</span>
            <div class="gym-stagger" style="display:flex; flex-direction:column; gap:12px;">
              ${group.items.map((entry) => gymRenderHistoryRow(entry)).join("")}
            </div>
          </div>
        `
        )
        .join("");
    }

    document.getElementById("load-more-btn").style.display = visible.length < all.length ? "flex" : "none";
  }

  function loadMore() {
    const skeleton = document.getElementById("history-skeleton");
    const btn = document.getElementById("load-more-btn");
    skeleton.style.display = "flex";
    btn.style.display = "none";

    // Chargement progressif simulé : un court délai avant de révéler la suite.
    setTimeout(() => {
      skeleton.style.display = "none";
      state.visibleCount += state.pageSize;
      renderList();
    }, 550);
  }

  document.getElementById("icon-doc-more").innerHTML = gymIcon("doc");
  document.getElementById("icon-chevron-more").innerHTML = gymIcon("chevronDown");
  gymSetupTabs(document.getElementById("history-tabs"), (value) => {
    state.filter = value;
    state.visibleCount = state.pageSize;
    renderList();
  });
  document.getElementById("load-more-btn").addEventListener("click", loadMore);

  function render() {
    state.filter = "tous";
    state.visibleCount = state.pageSize;
    const tabs = document.getElementById("history-tabs");
    tabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
    tabs.querySelector('[data-value="tous"]').classList.add("is-active");
    renderList();
  }

  GymViews["historique"] = { render };
})();

/* ==========================================================================
   GYM — Vue : Objectifs
   ========================================================================== */

(function () {
  const GOAL_TYPES = [
    { id: "poids", label: "Perdre du poids", icon: "dumbbell" },
    { id: "muscle", label: "Gagner en muscle", icon: "muscle" },
    { id: "endurance", label: "Endurance", icon: "running" },
    { id: "sante", label: "Santé", icon: "heart" },
    { id: "performance", label: "Performance", icon: "barChart" },
    { id: "bienetre", label: "Bien-être", icon: "star" },
  ];

  const state = {
    goals: [...GYM_DATA.goals],
    newGoalType: GOAL_TYPES[0].id,
  };

  function closeIconSvg() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
  }

  function fillIcons() {
    document.getElementById("hero-target-icon").innerHTML = gymIcon("target");
    document.getElementById("hero-photo-icon").innerHTML = gymIcon("star");
    document.getElementById("icon-voir-tous").innerHTML = gymIcon("chevronRight");
    document.getElementById("icon-plus-goal").innerHTML = gymIcon("plus");
    document.getElementById("icon-goal-title").innerHTML = gymIcon("edit");
    document.getElementById("icon-goal-target").innerHTML = gymIcon("target");
    document.getElementById("goal-sheet-close").innerHTML = closeIconSvg();
  }

  function renderGoals() {
    const grid = document.getElementById("objectifs-grid");

    if (!state.goals.length) {
      grid.innerHTML = `
        <div class="card" style="grid-column: 1 / -1; text-align:center; color:var(--gym-text-secondary); font-size:14px;">
          Tu n'as pas encore défini d'objectif.
        </div>
      `;
      return;
    }

    grid.innerHTML = state.goals.map((goal) => gymRenderGoalCard(goal)).join("");

    // Animation : anneaux, compteurs et barres de progression.
    grid.querySelectorAll(".ring__fill[data-offset]").forEach((circle) => {
      const target = Number(circle.dataset.offset);
      circle.style.transition = "none";
      circle.style.strokeDashoffset = circle.getAttribute("stroke-dasharray");
      requestAnimationFrame(() => {
        circle.style.transition = `stroke-dashoffset 900ms var(--gym-ease)`;
        circle.style.strokeDashoffset = `${target}`;
      });
    });
    grid.querySelectorAll("[data-counter]").forEach((el) => {
      gymAnimateCounter(el, Number(el.dataset.counter), { formatFn: (v) => `${v}%` });
    });
    grid.querySelectorAll(".progress-fill[data-progress]").forEach((el) => {
      gymAnimateProgress(el, Number(el.dataset.progress));
    });
  }

  function renderHowto() {
    const steps = [
      { icon: "target", label: "1. Choisissez votre objectif" },
      { icon: "sliders", label: "2. Configurez vos critères" },
      { icon: "barChart", label: "3. Suivez vos progrès" },
      { icon: "star", label: "4. Atteignez vos résultats" },
    ];

    document.getElementById("howto-steps").innerHTML = steps
      .map(
        (step, index) => `
        <div class="howto__step">
          <div class="icon-circle icon-circle--sm">${gymIcon(step.icon)}</div>
          <span>${step.label}</span>
        </div>
        ${index < steps.length - 1 ? `<span class="howto__arrow">${gymIcon("chevronRight")}</span>` : ""}
      `
      )
      .join("");
  }

  function renderGoalTypeGrid() {
    const grid = document.getElementById("goal-type-grid");
    grid.innerHTML = GOAL_TYPES.map(
      (type) => `
        <button type="button" class="choice ${type.id === state.newGoalType ? "is-active" : ""}" data-value="${type.id}">
          ${gymIcon(type.icon)}
          <span class="choice__label">${type.label}</span>
        </button>
      `
    ).join("");
  }

  function openGoalSheet() {
    document.getElementById("goal-sheet-overlay").classList.add("is-open");
    document.getElementById("goal-sheet").classList.add("is-open");
  }

  function closeGoalSheet() {
    document.getElementById("goal-sheet-overlay").classList.remove("is-open");
    document.getElementById("goal-sheet").classList.remove("is-open");
  }

  function createGoal() {
    const titleInput = document.getElementById("goal-title-input");
    const progressInput = document.getElementById("goal-progress-input");
    const type = GOAL_TYPES.find((t) => t.id === state.newGoalType);

    const title = titleInput.value.trim() || type.label;
    const progressLabel = progressInput.value.trim() || "0%";

    state.goals.unshift({
      id: `g-new-${Date.now()}`,
      title,
      icon: type.icon,
      percent: 5,
      progressLabel,
      deadline: gymAddDays(GYM_DATA.today, 30),
    });

    renderGoals();
    closeGoalSheet();
    titleInput.value = "";
    progressInput.value = "";
  }

  gymSetupChoiceGrid(document.getElementById("goal-type-grid"), {
    onChange: (value) => {
      state.newGoalType = value;
    },
  });
  document.getElementById("btn-new-goal").addEventListener("click", openGoalSheet);
  document.getElementById("goal-sheet-overlay").addEventListener("click", closeGoalSheet);
  document.getElementById("goal-sheet-close").addEventListener("click", closeGoalSheet);
  document.getElementById("btn-create-goal").addEventListener("click", createGoal);

  function render() {
    fillIcons();
    renderGoals();
    renderHowto();
    renderGoalTypeGrid();
  }

  GymViews["objectifs"] = { render };
})();

/* ==========================================================================
   GYM — Démarrage de l'application
   ========================================================================== */

(function () {
  const initialView = (location.hash || "#gym-home").replace("#", "") || "gym-home";
  const resolvedView = GymViews[initialView] ? initialView : "gym-home";
  gymActivateView(resolvedView, {});
  history.replaceState({ view: resolvedView, params: {} }, "", `#${resolvedView}`);
})();
