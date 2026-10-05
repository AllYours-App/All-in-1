/* ============================================================
   AUTH — connexion + création de compte
   Première page affichée tant qu'aucune session n'existe.
   Pas de serveur pour l'instant : la "session" n'est qu'une clé localStorage.
   ============================================================ */
(function () {
  'use strict';

  const SESSION_KEY = 'golfSession';

  if (!document.getElementById('page-login')) return;

  // Dès que l'utilisateur a cliqué, le garde-fou du "load" ne le renvoie plus à la page de départ
  let hasInteracted = false;

  /* ---------- Session (connexion unique) ---------- */

  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; }
  }

  function saveSession(email) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ email, createdAt: Date.now() }));
    } catch (e) {
      console.error('Erreur d\'écriture du localStorage', e);
    }
  }

  function clearSession() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  // Home si l'utilisateur est déjà connecté, sinon connexion.
  // La classe anti-flash n'est retirée qu'une fois la bonne page affichée.
  function showStartPage() {
    showPage(getSession() ? 'home' : 'login');
    document.documentElement.classList.remove('has-session');
  }

  // Déconnexion : window.authLogout()
  window.authLogout = function () {
    clearSession();
    document.querySelectorAll('[data-auth-form]').forEach(resetForm);
    showPage('login');
  };

  showStartPage();

  // Garde-fou : si un autre module a changé de page pendant son initialisation,
  // on rétablit la page de départ (tant que l'utilisateur n'a encore rien fait)
  window.addEventListener('load', () => {
    const active = document.querySelector('.app-page.active');
    const current = active ? active.id.replace('page-', '') : '';
    const wanted = getSession() ? 'home' : 'login';
    if (!hasInteracted && (current === 'home' || current === 'login') && current !== wanted) {
      showStartPage();
    }
  });

  /* ---------- Fond d'écran selon l'heure ---------- */

  // Mêmes fonds et mêmes horaires que l'accueil : getBackgroundByHour() est définie
  // dans HomePage.js (chargé avant ce fichier), pour ne garder qu'une seule source.
  const backgrounds = document.querySelectorAll('[data-auth-background]');

  function updateBackgrounds() {
    const src = getBackgroundByHour();
    backgrounds.forEach((img) => {
      if (img.getAttribute('src') !== src) {
        img.hidden = false;
        img.setAttribute('src', src);
      }
    });
  }

  // Si l'image est introuvable, on garde simplement le fond bleu nuit
  backgrounds.forEach((img) => img.addEventListener('error', () => { img.hidden = true; }));

  updateBackgrounds();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateBackgrounds();
  });

  /* ---------- Afficher / masquer le mot de passe ---------- */

  function setPasswordVisible(button, visible) {
    button.closest('.auth_field').querySelector('.auth_input').type = visible ? 'text' : 'password';
    button.classList.toggle('is-visible', visible);
    button.setAttribute('aria-label', visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
  }

  document.querySelectorAll('[data-auth-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = button.closest('.auth_field').querySelector('.auth_input');
      setPasswordVisible(button, input.type === 'password');
    });
  });

  /* ---------- Validation ---------- */

  function clearError(form) {
    form.querySelector('[data-auth-error]').textContent = '';
    form.querySelectorAll('.auth_field.is-error').forEach((el) => el.classList.remove('is-error'));
  }

  function showError(form, message, input) {
    clearError(form);
    form.querySelector('[data-auth-error]').textContent = message;
    input.closest('.auth_field').classList.add('is-error');
    input.focus();
  }

  // form.reset() ne remet pas le type du champ mot de passe : on le remasque à la main
  function resetForm(form) {
    form.reset();
    clearError(form);
    form.querySelectorAll('[data-auth-toggle]').forEach((button) => setPasswordVisible(button, false));
  }

  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  // Chaque règle : [champ concerné, condition respectée ?, message]. La première qui échoue s'affiche.
  const emailRule = (f) => [f.email, isEmail(f.email.value), 'Adresse e-mail invalide.'];

  const RULES = {
    login: (f) => [
      emailRule(f),
      [f.password, f.password.value !== '', 'Saisissez votre mot de passe.'],
    ],
    signup: (f) => [
      emailRule(f),
      [f.password, f.password.value.length >= 8, 'Le mot de passe doit contenir au moins 8 caractères.'],
      [f['password-confirm'], f.password.value === f['password-confirm'].value, 'Les mots de passe ne correspondent pas.'],
    ],
  };

  // Retourne true si le formulaire est valide (un type inconnu est refusé)
  function validate(form, type) {
    const rules = RULES[type] && RULES[type](form.elements);
    if (!rules) return false;
    const failed = rules.find(([, ok]) => !ok);
    if (failed) showError(form, failed[2], failed[0]);
    return !failed;
  }

  document.querySelectorAll('[data-auth-form]').forEach((form) => {
    const type = form.dataset.authForm;

    // Efface l'erreur dès que l'utilisateur retape quelque chose
    form.addEventListener('input', () => clearError(form));

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      hasInteracted = true;
      if (!validate(form, type)) return;

      // TODO : appel backend (connexion ou création de compte) avant d'enregistrer la session
      saveSession(form.elements.email.value.trim());
      resetForm(form);
      showPage('home');
    });
  });

  /* ---------- Navigation entre connexion / inscription ---------- */

  // showPage() ignore une page inexistante (ex. "forgot-password" pas encore créée) :
  // le lien deviendra actif tout seul dès que la page existera
  document.querySelectorAll('[data-auth-goto]').forEach((button) => {
    button.addEventListener('click', () => {
      hasInteracted = true;
      showPage(button.dataset.authGoto);
    });
  });
})();
