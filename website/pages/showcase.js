// Showcase Inspiration Grids Page Component
import { renderCodeBlock } from '/components/codeblock.js';
import Logos from '/dist/logos.esm.js';

export function render(container) {
  const root = document.createElement('div');
  root.className = 'container section animate-slide-up';

  root.innerHTML = `
    <h2 style="margin-bottom: var(--space-sm);">Real-World Design Showcase</h2>
    <p style="margin-bottom: var(--space-xl); max-width: 700px;">
      Explore complete component layouts and layouts inspired by premium developer tools (Stripe, Linear, Raycast). One-click copy patterns.
    </p>

    <!-- Showcase Section 1: Integrations wall -->
    <div class="card" style="margin-bottom: var(--space-xl); overflow: visible;">
      <div class="flex-between" style="border-bottom: 1px solid var(--border-color); padding-bottom: var(--space-sm); margin-bottom: var(--space-md); flex-wrap: wrap; gap: var(--space-sm);">
        <div>
          <h3 style="margin: 0;">SaaS Integrations Connect Wall</h3>
          <span style="font-size: 0.85rem; color: var(--muted-text);">Grid of connected team platforms for standard dashboards.</span>
        </div>
        <button id="btn-copy-sc1" class="btn btn-secondary btn-sm" style="font-size: 0.8rem; padding: 0.4rem 1rem;">Copy Source</button>
      </div>

      <!-- Preview -->
      <div class="flex-center" style="padding: var(--space-xl); background-color: var(--bg); border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
        <div class="grid grid-4" style="width: 100%;">
          <div class="card flex-center gap-sm" style="padding: var(--space-md); text-align: center;">
            <img id="sc1-google" style="height: 32px;" alt="Google">
            <span style="font-size: 0.85rem; font-weight:600;">Google Workspace</span>
          </div>
          <div class="card flex-center gap-sm" style="padding: var(--space-md); text-align: center;">
            <img id="sc1-slack" style="height: 32px;" alt="Slack">
            <span style="font-size: 0.85rem; font-weight:600;">Slack Channel</span>
          </div>
          <div class="card flex-center gap-sm" style="padding: var(--space-md); text-align: center;">
            <img id="sc1-github" style="height: 32px;" alt="GitHub">
            <span style="font-size: 0.85rem; font-weight:600;">GitHub Repositories</span>
          </div>
          <div class="card flex-center gap-sm" style="padding: var(--space-md); text-align: center;">
            <img id="sc1-stripe" style="height: 32px;" alt="Stripe">
            <span style="font-size: 0.85rem; font-weight:600;">Stripe Billing</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Showcase Section 2: Pricing Methods -->
    <div class="card">
      <div class="flex-between" style="border-bottom: 1px solid var(--border-color); padding-bottom: var(--space-sm); margin-bottom: var(--space-md); flex-wrap: wrap; gap: var(--space-sm);">
        <div>
          <h3 style="margin: 0;">Multi-Method Payment Footers</h3>
          <span style="font-size: 0.85rem; color: var(--muted-text);">Show checkout confidence by presenting supported gateway networks.</span>
        </div>
        <button id="btn-copy-sc2" class="btn btn-secondary btn-sm" style="font-size: 0.8rem; padding: 0.4rem 1rem;">Copy Source</button>
      </div>

      <!-- Preview -->
      <div class="flex-center" style="padding: var(--space-xl); background-color: var(--bg); border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
        <div class="flex gap-lg" style="flex-wrap: wrap; justify-content: center; align-items: center; padding: 1rem; border-radius: var(--radius-full); border: 1px solid var(--border-color);">
          <span style="font-size: 0.85rem; color: var(--muted-text); font-weight: 500;">Secured Gateways:</span>
          <img id="sc2-visa" style="height: 24px;" alt="Visa">
          <img id="sc2-mastercard" style="height: 24px;" alt="Mastercard">
          <img id="sc2-paypal" style="height: 24px;" alt="Paypal">
          <img id="sc2-apple" style="height: 24px;" alt="Apple Pay">
        </div>
      </div>
    </div>
  `;

  container.appendChild(root);

  // Apply actual image resolutions
  Logos.apply(root.querySelector('#sc1-google'), 'google');
  Logos.apply(root.querySelector('#sc1-slack'), 'slack');
  Logos.apply(root.querySelector('#sc1-github'), 'github');
  Logos.apply(root.querySelector('#sc1-stripe'), 'stripe');

  Logos.apply(root.querySelector('#sc2-visa'), 'visa');
  Logos.apply(root.querySelector('#sc2-mastercard'), 'mastercard');
  Logos.apply(root.querySelector('#sc2-paypal'), 'paypal');
  Logos.apply(root.querySelector('#sc2-apple'), 'apple');

  // Copy click handlers
  root.querySelector('#btn-copy-sc1').addEventListener('click', (e) => {
    const code = `<div class="grid grid-4">
  <div class="card flex-center gap-sm">
    <img id="google-logo" style="height: 32px;" alt="Google">
    <span>Google Workspace</span>
  </div>
</div>
<script>
  Logos.apply(document.getElementById('google-logo'), 'google');
</script>`;
    navigator.clipboard.writeText(code).then(() => {
      const btn = e.target;
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Copy Source', 2000);
    });
  });

  root.querySelector('#btn-copy-sc2').addEventListener('click', (e) => {
    const code = `<div class="flex gap-lg">
  <span>Secured Gateways:</span>
  <img id="visa-logo" style="height: 24px;" alt="Visa">
</div>
<script>
  Logos.apply(document.getElementById('visa-logo'), 'visa');
</script>`;
    navigator.clipboard.writeText(code).then(() => {
      const btn = e.target;
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Copy Source', 2000);
    });
  });
}
