/* ============================================================
   AUTH — connexion + création de compte
   Première page affichée tant qu'aucune session n'existe.
   ============================================================ */
(function () {
  'use strict';

  // Extension des fonds d'écran : FondEcranHomePageMatin.<extension>
  var BACKGROUND_EXTENSION = 'png';
  // Dossier des fonds d'écran (relatif à index.html)
  var BACKGROUND_FOLDER = 'images/';
  var SESSION_KEY = 'golfSession';

  var root = document.getElementById('page-login');
  if (!root) return;

  var hasInteracted = false;

  /* ---------- Session (connexion unique) ---------- */

  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; }
  }

  function saveSession(email) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ email: email, createdAt: Date.now() }));
    } catch (e) {}
  }

  function clearSession() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  // Home si l'utilisateur est déjà connecté, sinon connexion
  function showStartPage() {
    document.documentElement.classList.remove('has-session');
    if (typeof showPage === 'function') showPage(getSession() ? 'home' : 'login');
  }

  // Déconnexion : window.authLogout()
  window.authLogout = function () {
    clearSession();
    document.querySelectorAll('[data-auth-form]').forEach(function (form) { form.reset(); });
    if (typeof showPage === 'function') showPage('login');
  };

  showStartPage();

  // Après "load" : on corrige uniquement si app-shell.js a remis la mauvaise page de départ
  window.addEventListener('load', function () {
    var active = document.querySelector('.app-page.active');
    var current = active ? active.id.replace('page-', '') : '';
    var wanted = getSession() ? 'home' : 'login';
    if (!hasInteracted && (current === 'home' || current === 'login') && current !== wanted) {
      showStartPage();
    }
  });

  /* ---------- Fond d'écran selon l'heure ---------- */

  // Matin 6h-11h | Midi 11h-17h | Soir 17h-21h | Nuit 21h-6h
  function getTimeSlot(date) {
    var hour = date.getHours();
    if (hour >= 6 && hour < 11) return 'Matin';
    if (hour >= 11 && hour < 17) return 'Midi';
    if (hour >= 17 && hour < 21) return 'Soir';
    return 'Nuit';
  }

  var backgrounds = document.querySelectorAll('[data-auth-background]');

  function updateBackgrounds() {
    var src = BACKGROUND_FOLDER + 'FondEcranHomePage' + getTimeSlot(new Date()) + '.' + BACKGROUND_EXTENSION;
    backgrounds.forEach(function (img) {
      if (img.getAttribute('src') !== src) {
        img.hidden = false;
        img.setAttribute('src', src);
      }
    });
  }

  // Si l'image est introuvable, on garde simplement le fond bleu nuit
  backgrounds.forEach(function (img) {
    img.addEventListener('error', function () { img.hidden = true; });
  });

  updateBackgrounds();
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) updateBackgrounds();
  });

  /* ---------- Afficher / masquer le mot de passe ---------- */

  document.querySelectorAll('[data-auth-toggle]').forEach(function (button) {
    button.addEventListener('click', function () {
      var input = button.closest('.auth_field').querySelector('.auth_input');
      var isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      button.classList.toggle('is-visible', isHidden);
      button.setAttribute('aria-label', isHidden ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
    });
  });

  /* ---------- Validation ---------- */

  function clearError(form) {
    form.querySelector('[data-auth-error]').textContent = '';
    form.querySelectorAll('.auth_field.is-error').forEach(function (el) {
      el.classList.remove('is-error');
    });
  }

  function showError(form, message, input) {
    clearError(form);
    form.querySelector('[data-auth-error]').textContent = message;
    input.closest('.auth_field').classList.add('is-error');
    input.focus();
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  // Retourne true si le formulaire est valide
  var validators = {
    login: function (form) {
      var email = form.elements['email'];
      var password = form.elements['password'];
      if (!isEmail(email.value)) { showError(form, 'Adresse e-mail invalide.', email); return false; }
      if (!password.value) { showError(form, 'Saisissez votre mot de passe.', password); return false; }
      return true;
    },
    signup: function (form) {
      var email = form.elements['email'];
      var password = form.elements['password'];
      var confirm = form.elements['password-confirm'];
      if (!isEmail(email.value)) { showError(form, 'Adresse e-mail invalide.', email); return false; }
      if (password.value.length < 8) { showError(form, 'Le mot de passe doit contenir au moins 8 caractères.', password); return false; }
      if (password.value !== confirm.value) { showError(form, 'Les mots de passe ne correspondent pas.', confirm); return false; }
      return true;
    }
  };

  document.querySelectorAll('[data-auth-form]').forEach(function (form) {
    var type = form.getAttribute('data-auth-form');

    // Efface l'erreur dès que l'utilisateur retape quelque chose
    form.addEventListener('input', function () { clearError(form); });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      hasInteracted = true;
      if (!validators[type](form)) return;

      // TODO : appel backend (connexion ou création de compte) avant d'enregistrer la session
      saveSession(form.elements['email'].value.trim());
      form.reset();
      if (typeof showPage === 'function') showPage('home');
    });
  });

  /* ---------- Navigation entre connexion / inscription ---------- */

  // Actif dès que la page cible existe (ex. "forgot-password" pas encore créée)
  document.querySelectorAll('[data-auth-goto]').forEach(function (button) {
    button.addEventListener('click', function () {
      hasInteracted = true;
      var target = button.getAttribute('data-auth-goto');
      if (typeof showPage === 'function' && document.getElementById('page-' + target)) {
        showPage(target);
      }
    });
  });
})();
