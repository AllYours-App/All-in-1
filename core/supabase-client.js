/* ============================================================
   SUPABASE — client unique de l'appli (connexion + base de données)
   Expose window.appSupabase (ou null si la bibliothèque n'a pas chargé).
   La bibliothèque vient de vendor/supabase.umd.min.js (supabase-js 2.117.2).

   La clé ci-dessous est la clé PUBLIQUE ("publishable") : elle est faite pour être
   visible dans le code. Ce sont les règles RLS des tables (supabase/schema.sql) qui
   protègent les données. Ne jamais mettre ici la clé "secret" ni "service_role".
   ============================================================ */
(function () {
  'use strict';

  const SUPABASE_URL = 'https://kszmszroxzunhmlfuite.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_JWKI64mBjmEh7mY5ShL7BA_iqHlYwcc';

  // Clé localStorage de la session. Lue aussi par le <head> de index.html (anti-flash) et par menu.js.
  window.APP_SESSION_KEY = 'golfSupabaseAuth';

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('Supabase : bibliothèque absente (vendor/supabase.umd.min.js).');
    window.appSupabase = null;
    return;
  }

  window.appSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storageKey: window.APP_SESSION_KEY,
      persistSession: true,
      autoRefreshToken: true,
      // Les liens reçus par e-mail (confirmation, mot de passe oublié) sont lus par auth.js :
      // le <head> de index.html met leur hash de côté avant que Gym et Wedging ne lisent location.hash.
      detectSessionInUrl: false,
      // "implicit" et non "pkce" : le lien de l'e-mail s'ouvre souvent dans Safari alors que l'appli
      // est installée sur l'écran d'accueil (stockage séparé), ce que pkce ne supporte pas.
      flowType: 'implicit',
    },
  });
})();
