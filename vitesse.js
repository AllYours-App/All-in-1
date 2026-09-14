const rootVitesse = document.getElementById('app-root-vitesse');

function renderVitesseTab() {
  rootVitesse.innerHTML = `
<header class="page-header" data-header="main">
  <a href="#" class="page-header_back" onclick="showPage('home')">
    <svg class="page-header_back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
    <span class="page-header_back-label">Home</span>
  </a>
  <h1 class="page-header_title">Vitesse</h1>
  <span class="page-header_menu"></span>
</header>

<main class="screen">

  <div class="empty-state">
    <span class="icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
    </span>
    <h4>Fonctionnalités à venir</h4>
    <p>Le module Vitesse est en préparation. Revenez bientôt pour suivre vos progrès.</p>
  </div>

</main>
`;
}
