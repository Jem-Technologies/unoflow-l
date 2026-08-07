// Neon 404 Not Found Component

export function render(container) {
  const root = document.createElement('div');
  root.className = 'container section animate-slide-up flex-center';
  root.style.flexDirection = 'column';
  root.style.minHeight = '60vh';

  root.innerHTML = `
    <!-- Neon Glowing SVG Icon -->
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 128 128" style="margin-bottom: var(--space-lg); filter: drop-shadow(0 0 15px var(--accent-glow-strong));">
      <circle cx="64" cy="64" r="56" fill="none" stroke="var(--accent)" stroke-width="6"/>
      <path d="M46 46l36 36M82 46L46 82" stroke="var(--accent)" stroke-width="8" stroke-linecap="round"/>
    </svg>

    <h1 style="font-size: 5rem; margin: 0; color: var(--accent); text-shadow: 0 0 20px var(--accent-glow-strong);">404</h1>
    <h2 style="margin-bottom: var(--space-md);">Route Resolution Missed</h2>
    <p style="color: var(--muted-text); margin-bottom: var(--space-xl); text-align: center; max-width: 500px;">
      The requested document key could not be located in our routing indexes. Ensure you requested a valid endpoint.
    </p>

    <a href="/" class="btn btn-glow">Return Home</a>
  `;

  container.appendChild(root);
}
