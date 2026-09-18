// Ecosystem Product Roadmap Page Component
import { createInteractiveCard } from '/components/card.js';

export function render(container) {
  const root = document.createElement('div');
  root.className = 'container section animate-slide-up';

  root.innerHTML = `
    <h2 style="margin-bottom: var(--space-sm);">UnoFlow-L Product Ecosystem</h2>
    <p style="margin-bottom: var(--space-xl); max-width: 700px;">
      Explore our planned integrations, frameworks, and developer workflow enhancers geared to make logo stream resolution painless.
    </p>

    <div class="grid grid-3">
      <!-- Card 1: React Adapter -->
      <div class="card card-glowing" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <span class="badge badge-green" style="margin-bottom: var(--space-sm);">Prototype</span>
          <h3 style="margin-bottom: var(--space-sm);">React Adapter Component</h3>
          <p style="font-size: 0.95rem; color: var(--muted-text);">
            A gorgeous <code>&lt;Logo key="stripe" fallback="..." /&gt;</code> primitive with automated hydrate skeleton states and suspense triggers.
          </p>
        </div>
        <div style="margin-top: var(--space-lg); border-top: 1px solid var(--border-color); padding-top: var(--space-sm); font-size: 0.85rem; color: var(--accent);">
          Coming soon in v1.1.0
        </div>
      </div>

      <!-- Card 2: Vue Adapter -->
      <div class="card card-glowing" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <span class="badge badge-orange" style="margin-bottom: var(--space-sm);">Planned</span>
          <h3 style="margin-bottom: var(--space-sm);">Vue & Nuxt Integrations</h3>
          <p style="font-size: 0.95rem; color: var(--muted-text);">
            Composition-API helper scripts and reactive directives for instantaneous DOM logo paint structures in Vue environments.
          </p>
        </div>
        <div style="margin-top: var(--space-lg); border-top: 1px solid var(--border-color); padding-top: var(--space-sm); font-size: 0.85rem; color: var(--accent);">
          Coming soon in v1.2.0
        </div>
      </div>

      <!-- Card 3: CLI Developer Tool -->
      <div class="card card-glowing" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <span class="badge badge-purple" style="margin-bottom: var(--space-sm);">In Research</span>
          <h3 style="margin-bottom: var(--space-sm);">UnoFlow-L CLI Explorer</h3>
          <p style="font-size: 0.95rem; color: var(--muted-text);">
            Validate, clean, preload, or crawl your site's target brand assets directly from terminal scripts during CI pipeline builds.
          </p>
        </div>
        <div style="margin-top: var(--space-lg); border-top: 1px solid var(--border-color); padding-top: var(--space-sm); font-size: 0.85rem; color: var(--accent);">
          Coming soon in v1.3.0
        </div>
      </div>

      <!-- Card 4: VS Code Extension -->
      <div class="card card-glowing" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <span class="badge badge-orange" style="margin-bottom: var(--space-sm);">Planned</span>
          <h3 style="margin-bottom: var(--space-sm);">VS Code IntelliSense Plugin</h3>
          <p style="font-size: 0.95rem; color: var(--muted-text);">
            Inline icon auto-completes and quick-hover popups showing key validity status straight inside your editor environment.
          </p>
        </div>
        <div style="margin-top: var(--space-lg); border-top: 1px solid var(--border-color); padding-top: var(--space-sm); font-size: 0.85rem; color: var(--accent);">
          Planned Roadmap
        </div>
      </div>

      <!-- Card 5: Figma Component Library -->
      <div class="card card-glowing" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <span class="badge badge-orange" style="margin-bottom: var(--space-sm);">Planned</span>
          <h3 style="margin-bottom: var(--space-sm);">Figma Auto-Layout Component</h3>
          <p style="font-size: 0.95rem; color: var(--muted-text);">
            Drag and drop vector layouts hooked directly into identical key catalogs for design/developer parity workflows.
          </p>
        </div>
        <div style="margin-top: var(--space-lg); border-top: 1px solid var(--border-color); padding-top: var(--space-sm); font-size: 0.85rem; color: var(--accent);">
          Planned Roadmap
        </div>
      </div>
    </div>
  `;

  container.appendChild(root);
}
