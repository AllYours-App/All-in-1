/* ============================================================
   AUTH — connexion, création de compte, mot de passe oublié
   Première page affichée tant qu'aucune session n'existe.
   Authentification : Supabase Auth (client : core/supabase-client.js, window.appSupabase).
   La session est gardée par supabase-js dans le localStorage, sous la clé 'golfSupabaseAuth'.
   ============================================================ */
(function () {
  'use strict';

  const SESSION_KEY = window.APP_SESSION_KEY || 'golfSupabaseAuth';
  const sb = window.appSupabase || null;

  // Ancienne "session" locale (avant Supabase) : plus utilisée
  try { localStorage.removeItem('golfSession'); } catch (e) {}

  const loginPage = document.getElementById('page-login');
  if (!loginPage) return;

  // html.login-locked n'existe que tant que la page de connexion est affichée (même principe que html.home-locked,
  // voir auth.css : sur iPhone en appli installée, un document qui ne défile pas n'obtient que 762 pt sur 812).
  const syncLoginLock = () => document.documentElement.classList.toggle('login-locked', loginPage.classList.contains('active'));
  new MutationObserver(syncLoginLock).observe(loginPage, { attributes: true, attributeFilter: ['class'] });
  syncLoginLock();

  // Dès que l'utilisateur a cliqué, on ne le renvoie plus de force à la page de départ
  let hasInteracted = false;

  // showPage() vient de app-shell.js, chargé en premier ; le typeof protège seulement d'un oubli de la balise <script>
  const goTo = (page) => { if (typeof showPage === 'function') showPage(page); };

  /* ---------- Données du compte ----------
     Les données appartiennent au compte : core/data.js (window.appData) les lit et les écrit dans Supabase,
     et vide la copie locale quand un autre compte se connecte ou à la déconnexion.
     Au chargement avec une session déjà présente, data.js démarre tout seul. Ici on le démarre
     seulement après une connexion, une inscription ou un lien reçu par e-mail.
     Retourne true si la copie locale a été remplacée : la page doit alors être rechargée
     (les modules gardent leurs données en mémoire). */
  async function loadAccountData(userId) {
    if (!userId || !window.appData) return false;
    try { return await window.appData.start(userId); } catch (e) { console.warn('Auth : chargement des données impossible', e); return false; }
  }

  /* ---------- Session ---------- */

  // Lecture synchrone du localStorage (pour afficher tout de suite la bonne page, sans attendre le réseau).
  // supabase-js renouvelle ou invalide la session ensuite : un échec déclenche SIGNED_OUT (voir plus bas).
  function hasStoredSession() {
    try {
      const s = JSON.parse(localStorage.getItem(SESSION_KEY));
      return !!(s && s.access_token && s.refresh_token);
    } catch (e) { return false; }
  }

  // Lien reçu par e-mail (confirmation, mot de passe oublié) : le <head> de index.html a mis son hash de côté
  // dans window.__authHash. Tant qu'il n'est pas traité, on n'affiche ni la connexion ni l'accueil.
  const emailLinkParams = window.__authHash ? new URLSearchParams(window.__authHash) : null;
  let emailLinkPending = !!(emailLinkParams && emailLinkParams.get('access_token'));

  // Home si l'utilisateur est déjà connecté, sinon connexion.
  // La classe anti-flash n'est retirée qu'une fois la bonne page affichée.
  function showStartPage() {
    if (typeof showPage !== 'function' || emailLinkPending) return;
    showPage(hasStoredSession() ? 'home' : 'login');
    document.documentElement.classList.remove('has-session');
  }

  // Déconnexion : window.authLogout()
  window.authLogout = async function () {
    // Envoie d'abord les dernières modifications : ensuite la session et la copie locale sont retirées.
    // Attente limitée : sans réseau, l'envoi ne peut pas aboutir.
    try {
      if (window.appData) await Promise.race([window.appData.flush(), new Promise((r) => setTimeout(r, 8000))]);
    } catch (e) {}
    // Mode hors ligne : des saisies n'ont pas encore été envoyées. Se déconnecter vide la copie locale, elles seraient perdues.
    if (window.appData && window.appData.hasPending() && typeof appConfirm === 'function') {
      const ok = await appConfirm(
        'Des modifications n\'ont pas encore été envoyées au serveur (pas de connexion). Si vous vous déconnectez maintenant, elles seront perdues.',
        { confirmLabel: 'Se déconnecter', cancelLabel: 'Rester connecté', danger: true }
      );
      if (!ok) return;
    }
    // scope 'local' : déconnecte cet appareil seulement. Hors ligne, l'appel réseau peut échouer : on efface la clé à la main.
    if (sb) sb.auth.signOut({ scope: 'local' }).catch(() => {});
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
    if (window.appData) window.appData.clearLocal();
    // Rechargement : remet à zéro les données gardées en mémoire par les modules ; sans session, la connexion s'affiche
    location.reload();
  };

  // Session perdue (expirée, révoquée, supprimée depuis un autre appareil) : retour à la connexion
  if (sb) {
    sb.auth.onAuthStateChange((event) => {
      // Pas d'appel à Supabase ici (risque de blocage) : seulement de l'affichage
      if (event !== 'SIGNED_OUT') return;
      // Les données d'un compte déconnecté ne doivent pas rester sur l'appareil
      if (window.appData && window.appData.clearLocal()) { location.reload(); return; }
      document.querySelectorAll('[data-auth-form]').forEach(resetForm);
      const active = document.querySelector('.app-page.active');
      const current = active ? active.id.replace('page-', '') : '';
      if (!['login', 'signup', 'forgot-password'].includes(current)) goTo('login');
    });
  }

  showStartPage();

  // Après "load" : on corrige uniquement si app-shell.js a remis la mauvaise page de départ
  window.addEventListener('load', () => {
    const active = document.querySelector('.app-page.active');
    const current = active ? active.id.replace('page-', '') : '';
    const wanted = hasStoredSession() ? 'home' : 'login';
    if (!emailLinkPending && !hasInteracted && (current === 'home' || current === 'login') && current !== wanted) {
      showStartPage();
    }
    // Filet de sécurité : la page de connexion ne doit jamais rester masquée
    if (!emailLinkPending) document.documentElement.classList.remove('has-session');
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
    const box = form.querySelector('[data-auth-error]');
    box.textContent = '';
    box.classList.remove('is-info');
    form.querySelectorAll('.auth_field.is-error').forEach((el) => el.classList.remove('is-error'));
  }

  // input facultatif : sans lui, le message s'affiche sans surligner de champ
  function showError(form, message, input) {
    clearError(form);
    form.querySelector('[data-auth-error]').textContent = message;
    if (input) {
      input.closest('.auth_field').classList.add('is-error');
      input.focus();
    }
  }

  // Message d'information (et non d'erreur), affiché sur le formulaire du type donné ('login', 'signup'...)
  function showNotice(formType, message) {
    const form = document.querySelector('[data-auth-form="' + formType + '"]');
    if (!form) return;
    clearError(form);
    const box = form.querySelector('[data-auth-error]');
    box.textContent = message;
    box.classList.add('is-info');
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
    forgot: (f) => [emailRule(f)],
    reset: (f) => [
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

  /* ---------- Appels Supabase ---------- */

  // Messages en français pour les erreurs Supabase (le texte d'origine est en anglais et technique)
  function friendlyError(err) {
    const code = (err && err.code) || '';
    const msg = String((err && err.message) || '');
    if (code === 'invalid_credentials' || /invalid login credentials/i.test(msg)) return 'E-mail ou mot de passe incorrect.';
    if (code === 'email_not_confirmed' || /email not confirmed/i.test(msg)) return 'Adresse e-mail non confirmée : ouvrez le lien reçu par e-mail.';
    if (code === 'user_already_exists' || code === 'email_exists' || /already registered/i.test(msg)) return 'Un compte existe déjà avec cette adresse. Connectez-vous.';
    if (code === 'weak_password') return 'Mot de passe trop faible : choisissez-en un plus long ou plus varié.';
    if (code === 'same_password') return 'Le nouveau mot de passe doit être différent de l\'ancien.';
    if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit' || (err && err.status === 429)) return 'Trop de tentatives. Réessayez dans quelques minutes.';
    if (/session missing|not authenticated/i.test(msg)) return 'Lien expiré. Refaites une demande de mot de passe oublié.';
    if ((err && err.name === 'AuthRetryableFetchError') || /failed to fetch|network|load failed/i.test(msg) || navigator.onLine === false) {
      return 'Connexion impossible. Vérifiez votre réseau et réessayez.';
    }
    return 'Une erreur est survenue. Réessayez.';
  }

  // Adresse de retour des e-mails : la racine du site (doit figurer dans les Redirect URLs de Supabase)
  const siteUrl = () => location.origin + '/';

  const HANDLERS = {
    async login(form) {
      const { data, error } = await sb.auth.signInWithPassword({
        email: form.elements.email.value.trim(),
        password: form.elements.password.value,
      });
      if (error) throw error;
      resetForm(form);
      if (data.user && await loadAccountData(data.user.id)) { location.reload(); return; }
      goTo('home');
    },

    async signup(form) {
      const email = form.elements.email.value.trim();
      const { data, error } = await sb.auth.signUp({
        email,
        password: form.elements.password.value,
        options: { emailRedirectTo: siteUrl() },
      });
      if (error) throw error;
      // E-mail déjà utilisé : avec la confirmation d'e-mail activée, Supabase ne renvoie pas d'erreur
      // (pour ne pas révéler quelles adresses ont un compte), mais l'utilisateur renvoyé n'a aucune identité
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        throw { code: 'user_already_exists' };
      }
      resetForm(form);
      if (data.session) { // confirmation d'e-mail désactivée : déjà connecté
        if (data.user && await loadAccountData(data.user.id)) { location.reload(); return; }
        goTo('home');
        return;
      }
      goTo('login');
      showNotice('login', 'Compte créé. Ouvrez le lien envoyé à ' + email + ' pour le confirmer, puis connectez-vous.');
    },

    async forgot(form) {
      const { error } = await sb.auth.resetPasswordForEmail(form.elements.email.value.trim(), { redirectTo: siteUrl() });
      if (error) throw error;
      resetForm(form);
      goTo('login');
      // Même message que l'adresse existe ou non
      showNotice('login', 'Si un compte existe pour cette adresse, un e-mail avec un lien vient d\'être envoyé.');
    },

    async reset(form) {
      const { data, error } = await sb.auth.updateUser({ password: form.elements.password.value });
      if (error) throw error;
      resetForm(form);
      if (data.user && await loadAccountData(data.user.id)) { location.reload(); return; }
      goTo('home');
    },
  };

  document.querySelectorAll('[data-auth-form]').forEach((form) => {
    const type = form.dataset.authForm;
    const submitButton = form.querySelector('[type="submit"]');

    // Efface l'erreur dès que l'utilisateur retape quelque chose
    form.addEventListener('input', () => clearError(form));

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      hasInteracted = true;
      if (form.dataset.busy) return;
      if (!validate(form, type)) return;
      if (!sb || !HANDLERS[type]) {
        showError(form, 'Service de connexion indisponible. Rechargez la page.');
        return;
      }

      // Un seul envoi à la fois (double appui)
      form.dataset.busy = '1';
      if (submitButton) submitButton.disabled = true;
      try {
        await HANDLERS[type](form);
      } catch (err) {
        console.warn('Auth :', type, err);
        showError(form, friendlyError(err), form.elements.password || form.elements.email);
      } finally {
        delete form.dataset.busy;
        if (submitButton) submitButton.disabled = false;
      }
    });
  });

  /* ---------- Lien reçu par e-mail ---------- */

  // Confirmation d'inscription ou mot de passe oublié : le lien ramène sur le site avec la session dans le hash
  // (#access_token=...&refresh_token=...&type=recovery), ou avec une erreur (#error=...&error_code=otp_expired).
  function handleEmailLink() {
    if (!emailLinkParams) return;
    const p = emailLinkParams;
    const done = (page, notice, formType) => {
      emailLinkPending = false;
      goTo(page);
      document.documentElement.classList.remove('has-session');
      if (notice) showNotice(formType || 'login', notice);
    };

    if (p.get('access_token') && p.get('refresh_token') && sb) {
      sb.auth.setSession({ access_token: p.get('access_token'), refresh_token: p.get('refresh_token') }).then(async ({ data, error }) => {
        if (error) { done('login', 'Ce lien n\'est plus valable. Connectez-vous, ou refaites une demande.'); return; }
        if (p.get('type') === 'recovery') { done('reset-password'); return; } // le chargement des données se fait après le nouveau mot de passe
        if (data && data.user && await loadAccountData(data.user.id)) { location.reload(); return; }
        done('home');
      }).catch(() => done('login', 'Connexion impossible. Vérifiez votre réseau et réessayez.'));
    } else if (p.get('error') || p.get('error_code')) {
      const expired = p.get('error_code') === 'otp_expired';
      done('login', expired ? 'Ce lien a expiré ou a déjà servi. Connectez-vous, ou refaites une demande.' : 'Ce lien n\'est pas valable.');
    } else {
      emailLinkPending = false;
    }
  }
  handleEmailLink();

  /* ---------- Navigation entre connexion / inscription ---------- */

  // Actif dès que la page cible existe (ex. "forgot-password" pas encore créée)
  document.querySelectorAll('[data-auth-goto]').forEach((button) => {
    button.addEventListener('click', () => {
      hasInteracted = true;
      const target = button.dataset.authGoto;
      if (document.getElementById('page-' + target)) goTo(target);
    });
  });
})();
