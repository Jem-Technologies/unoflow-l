// About Page Component (Architecture Diagrams & Motivation Story)

export function render(container) {
  const root = document.createElement('div');
  root.className = 'container section animate-slide-up';

  root.innerHTML = `
    <h2 style="margin-bottom: var(--space-sm);">Why UnoFlow-L exists</h2>
    <p style="margin-bottom: var(--space-xl); max-width: 700px;">
      The story, architectural vision, and lightweight design principles that guide the development of our vanilla logo resolver.
    </p>

    <div class="grid grid-2" style="margin-bottom: var(--space-xxl); align-items: start;">
      <div>
        <h3 style="margin-bottom: var(--space-md);">The Latency Dilemma</h3>
        <p style="font-size: 1rem; color: var(--subtle-text); margin-bottom: var(--space-md);">
          In modern client-side dashboard development, including company brand logos, credit card networks, and SaaS integrations is a standard feature. However, this traditionally involves bundle bloat from static SVG assets or high-latency multi-roundtrip loops fetching from un-cached external favicon or clearbit-like APIs.
        </p>
        <p style="font-size: 1rem; color: var(--subtle-text);">
          <strong>UnoFlow-L</strong> was engineered from the ground up to eliminate this overhead. By combining dual-layered caching—IndexedDB local manifest indexing with native long-lived browser CDN caches—developers resolve logos asynchronously with <em>literally zero latency</em> after the initial background bootstrap.
        </p>
      </div>

      <div>
        <h3 style="margin-bottom: var(--space-md);">Core Architecture</h3>
        <div class="arch-diagram">
          <div class="diagram-node highlight">Your Application Page</div>
          <div class="diagram-arrow">↓</div>
          <div class="diagram-node">UnoFlow-L Core Loader</div>
          <div class="diagram-arrow">↓</div>
          <div class="diagram-node highlight">IndexedDB Manifest Cache (24h)</div>
          <div class="diagram-arrow">↓</div>
          <div class="diagram-node">Cloudflare Edge Logo CDN</div>
        </div>
      </div>
    </div>

    <!-- Guiding Principles -->
    <h3 style="margin-bottom: var(--space-lg); text-align: center;">Our Engineering Philosophy</h3>
    <div class="grid grid-3">
      <div class="card">
        <h4 style="margin-bottom: var(--space-sm); color: var(--accent);">Vanilla First</h4>
        <p style="font-size: 0.95rem; color: var(--muted-text);">
          No bulky frameworks. No node compiling pipelines required. Just pure, native JavaScript designed to paint elements instantly.
        </p>
      </div>
      <div class="card">
        <h4 style="margin-bottom: var(--space-sm); color: var(--accent);">Resilience</h4>
        <p style="font-size: 0.95rem; color: var(--muted-text);">
          Even during total network disconnects or API worker failures, our bulletproof inline SVG templates guarantee clean visual layouts.
        </p>
      </div>
      <div class="card">
        <h4 style="margin-bottom: var(--space-sm); color: var(--accent);">Transparency</h4>
        <p style="font-size: 0.95rem; color: var(--muted-text);">
          Zero black-boxes. Developers can easily inspect local IndexedDB state entries, clear logs, and verify exact fetch timings.
        </p>
      </div>
    </div>
  `;

  container.appendChild(root);
}
