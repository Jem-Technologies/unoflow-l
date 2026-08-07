// Vertical Timeline Changelog Component

export function render(container) {
  const root = document.createElement('div');
  root.className = 'container section animate-slide-up';

  root.innerHTML = `
    <h2 style="margin-bottom: var(--space-sm);">Release History & Milestones</h2>
    <p style="margin-bottom: var(--space-xl); max-width: 700px;">
      Follow along with development milestones, API schema updates, and performance adjustments applied to the <code>unoflow-l</code> engine.
    </p>

    <div class="timeline-container">
      <!-- Milestone 4 -->
      <div class="timeline-item">
        <h4 style="margin-bottom: var(--space-xs); display: flex; align-items: center; gap: 10px;">
          <span>v1.0.4 — Fast Runtime Manifest Caching</span>
          <span class="badge badge-cyan">Latest Release</span>
        </h4>
        <p style="font-size: 0.9rem; color: var(--muted-text); margin-bottom: var(--space-sm);">Released on October 24, 2024</p>
        <ul style="margin-left: var(--space-lg); font-size: 0.95rem; color: var(--subtle-text); display: flex; flex-direction: column; gap: 4px;">
          <li>Upgraded <code>Logos.apply()</code> with optimized dynamic error fallback listeners.</li>
          <li>Implemented 24h IndexedDB TTL logic for background manifest synchronization.</li>
          <li>Added custom <code>ttlMs</code> adjustment options inside core configurations.</li>
        </ul>
      </div>

      <!-- Milestone 3 -->
      <div class="timeline-item">
        <h4 style="margin-bottom: var(--space-xs);">v1.0.2 — Fallback & Worker optimizations</h4>
        <p style="font-size: 0.9rem; color: var(--muted-text); margin-bottom: var(--space-sm);">Released on September 15, 2024</p>
        <ul style="margin-left: var(--space-lg); font-size: 0.95rem; color: var(--subtle-text); display: flex; flex-direction: column; gap: 4px;">
          <li>Migrated generic inline SVG schemas to streamlined base64 templates.</li>
          <li>Accelerated worker manifest request loops to sub-5ms response thresholds.</li>
        </ul>
      </div>

      <!-- Milestone 2 -->
      <div class="timeline-item">
        <h4 style="margin-bottom: var(--space-xs);">v1.0.0 — Initial Release</h4>
        <p style="font-size: 0.9rem; color: var(--muted-text); margin-bottom: var(--space-sm);">Released on June 01, 2024</p>
        <ul style="margin-left: var(--space-lg); font-size: 0.95rem; color: var(--subtle-text); display: flex; flex-direction: column; gap: 4px;">
          <li>Shipped the core <code>unoflow-l</code> package targeting browser and Node runtimes.</li>
          <li>Integrated multi-distribution builds supporting CommonJS, ESM, and IIFE scripts.</li>
        </ul>
      </div>
    </div>
  `;

  container.appendChild(root);
}
