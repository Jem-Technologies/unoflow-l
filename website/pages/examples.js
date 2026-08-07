// Interactive Preset Gallery Component
import { renderCodeBlock } from '/website/components/codeblock.js';
import Logos from '/dist/logos.esm.js';

export function render(container) {
  const root = document.createElement('div');
  root.className = 'container section animate-slide-up';

  root.innerHTML = `
    <h2 style="margin-bottom: var(--space-sm);">Component Layout Presets</h2>
    <p style="margin-bottom: var(--space-xl); max-width: 700px;">
      Accelerate your design workflows with polished layout cards, payment grids, and skeleton loader modules built around the <code>unoflow-l</code> resolver.
    </p>

    <!-- Example 1: Payment Providers Grid -->
    <div class="example-section-header">
      <h3>1. Interactive Payment Wallets Bar</h3>
      <p style="font-size: 0.95rem; color: var(--muted-text);">Ideal for SaaS billing options & e-commerce footer walls.</p>
    </div>

    <div class="example-preview-box">
      <div class="payment-bar" style="background-color: var(--surface-bg);">
        <img id="logo-ex-stripe" style="height: 32px;" alt="Stripe">
        <img id="logo-ex-paypal" style="height: 32px;" alt="Paypal">
        <img id="logo-ex-apple" style="height: 32px;" alt="Apple">
        <img id="logo-ex-googlepay" style="height: 32px;" alt="Google Pay">
      </div>
    </div>
    <div class="example-code-box" id="code-ex1"></div>

    <!-- Example 2: Tech Stack / Integration Grids -->
    <div class="example-section-header">
      <h3>2. Developer Integration Matrix</h3>
      <p style="font-size: 0.95rem; color: var(--muted-text);">Visual technology stacks and seamless connection layouts.</p>
    </div>

    <div class="example-preview-box">
      <div class="tech-grid" style="width: 100%; max-width: 600px;">
        <div class="card flex-center gap-sm" style="flex-direction: column; padding: var(--space-md); text-align: center;">
          <img id="logo-ex-react" style="height: 36px;" alt="React">
          <span style="font-size: 0.8rem; font-weight:600;">React</span>
        </div>
        <div class="card flex-center gap-sm" style="flex-direction: column; padding: var(--space-md); text-align: center;">
          <img id="logo-ex-vue" style="height: 36px;" alt="Vue">
          <span style="font-size: 0.8rem; font-weight:600;">Vue</span>
        </div>
        <div class="card flex-center gap-sm" style="flex-direction: column; padding: var(--space-md); text-align: center;">
          <img id="logo-ex-svelte" style="height: 36px;" alt="Svelte">
          <span style="font-size: 0.8rem; font-weight:600;">Svelte</span>
        </div>
        <div class="card flex-center gap-sm" style="flex-direction: column; padding: var(--space-md); text-align: center;">
          <img id="logo-ex-vercel" style="height: 36px;" alt="Vercel">
          <span style="font-size: 0.8rem; font-weight:600;">Vercel</span>
        </div>
        <div class="card flex-center gap-sm" style="flex-direction: column; padding: var(--space-md); text-align: center;">
          <img id="logo-ex-github" style="height: 36px;" alt="GitHub">
          <span style="font-size: 0.8rem; font-weight:600;">GitHub</span>
        </div>
      </div>
    </div>
    <div class="example-code-box" id="code-ex2"></div>

    <!-- Example 3: Skeletons & Lazy Loading -->
    <div class="example-section-header">
      <h3>3. Skeleton Loading State Animation</h3>
      <p style="font-size: 0.95rem; color: var(--muted-text);">Simulate beautiful, responsive layout skeletons prior to resolver hydration.</p>
    </div>

    <div class="example-preview-box" style="flex-direction: column; align-items: stretch; max-width: 500px; margin-left: auto; margin-right: auto;">
      <div id="skeleton-container" class="card flex-center gap-md" style="justify-content: flex-start; min-height: 80px;">
        <!-- Initial Skeleton States -->
        <div class="skeleton"></div>
        <div>
          <div class="skeleton" style="width: 120px; height: 16px; margin-bottom: 8px;"></div>
          <div class="skeleton" style="width: 80px; height: 12px;"></div>
        </div>
      </div>
      <button id="btn-hydrate-skeleton" class="btn btn-glow" style="width: 100%; margin-top: 10px;">Hydrate Skeletons</button>
    </div>
    <div class="example-code-box" id="code-ex3"></div>
  `;

  // Attach Example Codeblocks
  const codeEx1 = renderCodeBlock(
`<div class="payment-bar">
  <img id="logo-ex-stripe" style="height: 32px;" alt="Stripe">
  <img id="logo-ex-paypal" style="height: 32px;" alt="Paypal">
</div>

<script>
  Logos.apply(document.getElementById('logo-ex-stripe'), 'stripe');
  Logos.apply(document.getElementById('logo-ex-paypal'), 'paypal');
</script>`, 'html', 'payment-bar.html');

  const codeEx2 = renderCodeBlock(
`<div class="tech-grid">
  <div class="card flex-center">
    <img id="logo-ex-react" style="height: 36px;">
    <span>React</span>
  </div>
</div>

<script>
  Logos.apply(document.getElementById('logo-ex-react'), 'react');
</script>`, 'html', 'tech-grid.html');

  const codeEx3 = renderCodeBlock(
`<!-- Visual Skeleton -->
<div id="skeleton" class="skeleton"></div>

<script>
  // Hide skeleton on image successful load
  const img = new Image();
  img.src = Logos.get('vercel');
  img.onload = () => {
    document.getElementById('skeleton').replaceWith(img);
  };
</script>`, 'html', 'skeleton-loader.html');

  root.querySelector('#code-ex1').appendChild(codeEx1);
  root.querySelector('#code-ex2').appendChild(codeEx2);
  root.querySelector('#code-ex3').appendChild(codeEx3);

  container.appendChild(root);

  // Apply actual logos
  Logos.apply(root.querySelector('#logo-ex-stripe'), 'stripe');
  Logos.apply(root.querySelector('#logo-ex-paypal'), 'paypal');
  Logos.apply(root.querySelector('#logo-ex-apple'), 'apple');
  Logos.apply(root.querySelector('#logo-ex-googlepay'), 'googlepay');

  Logos.apply(root.querySelector('#logo-ex-react'), 'react');
  Logos.apply(root.querySelector('#logo-ex-vue'), 'vue');
  Logos.apply(root.querySelector('#logo-ex-svelte'), 'svelte');
  Logos.apply(root.querySelector('#logo-ex-vercel'), 'vercel');
  Logos.apply(root.querySelector('#logo-ex-github'), 'github');

  // Interactive Skeleton Hydration Demo
  const skContainer = root.querySelector('#skeleton-container');
  const btnHydrate = root.querySelector('#btn-hydrate-skeleton');

  btnHydrate.addEventListener('click', () => {
    skContainer.innerHTML = `
      <img id="hydrated-logo" style="width: 48px; height: 48px; object-fit: contain;" alt="Slack">
      <div>
        <h4 style="margin: 0; font-size: 1rem;">Slack Integration Connected</h4>
        <p style="margin: 0; font-size: 0.8rem; color: var(--muted-text);">Resolved at zero-latency from browser IDB storage</p>
      </div>
    `;
    Logos.apply(skContainer.querySelector('#hydrated-logo'), 'slack');
    btnHydrate.disabled = true;
    btnHydrate.textContent = 'Hydrated!';
  });
}
