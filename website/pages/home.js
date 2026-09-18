// Home Page Component
import { renderTerminal } from '/components/terminal.js';
import { createInteractiveCard } from '/components/card.js';
import { renderCodeBlock } from '/components/codeblock.js';

export function render(container) {
  const section = document.createElement('div');
  section.className = 'container section animate-slide-up';

  // Hero Area
  const hero = document.createElement('div');
  hero.className = 'hero-section';
  hero.innerHTML = `
    <div class="hero-glow-back"></div>
    <h1 class="hero-title">Zero Latency Logo Streaming.</h1>
    <p class="hero-subtitle">
      Stop bundling, lazy-loading, and manually managing tech stacks, payments, and brand logos.
      Resolve them via standard keys with automatic browser runtime IndexedDB caching.
    </p>
    <div class="hero-cta">
      <a href="/playground" class="btn btn-glow">Open Playground</a>
      <a href="/docs" class="btn btn-secondary">Read Docs</a>
    </div>
  `;
  section.appendChild(hero);

  // Quick Installation Shell
  const installContainer = document.createElement('div');
  installContainer.style.marginTop = 'var(--space-xxl)';
  installContainer.style.maxWidth = '600px';
  installContainer.style.marginLeft = 'auto';
  installContainer.style.marginRight = 'auto';

  const terminal = renderTerminal('npm install unoflow-l', [
    'added 1 package, and audited 12 packages in 0.5s',
    'unoflow-l is ready to run at zero-latency!'
  ]);

  const label = document.createElement('h3');
  label.textContent = 'Get Started Instantly';
  label.style.textAlign = 'center';
  label.style.marginBottom = 'var(--space-md)';

  installContainer.appendChild(label);
  installContainer.appendChild(terminal);
  section.appendChild(installContainer);

  // Brand Logo Showcase (Infinite Moving Belt or grid)
  const showgrid = document.createElement('div');
  showgrid.style.marginTop = 'var(--space-xxl)';
  showgrid.style.textAlign = 'center';
  showgrid.innerHTML = `
    <h3 style="margin-bottom: var(--space-lg);">Supported Logos & Brands</h3>
    <div class="flex-center gap-lg" style="flex-wrap: wrap; padding: var(--space-md); border: 1px solid var(--border-color); border-radius: var(--radius-lg); background-color: var(--surface-bg);">
      <div style="text-align: center; width: 60px;"><img src="unoflow.unobits.app/api/logos/google" alt="Google" style="height:32px; filter: grayscale(1); transition: filter 0.3s;" onmouseover="this.style.filter='none'" onmouseout="this.style.filter='grayscale(1)'"><div style="font-size:0.7rem; color:var(--muted-text); margin-top:5px;">Google</div></div>
      <div style="text-align: center; width: 60px;"><img src="unoflow.unobits.app/api/logos/github" alt="GitHub" style="height:32px; filter: grayscale(1); transition: filter 0.3s;" onmouseover="this.style.filter='none'" onmouseout="this.style.filter='grayscale(1)'"><div style="font-size:0.7rem; color:var(--muted-text); margin-top:5px;">GitHub</div></div>
      <div style="text-align: center; width: 60px;"><img src="unoflow.unobits.app/api/logos/stripe" alt="Stripe" style="height:32px; filter: grayscale(1); transition: filter 0.3s;" onmouseover="this.style.filter='none'" onmouseout="this.style.filter='grayscale(1)'"><div style="font-size:0.7rem; color:var(--muted-text); margin-top:5px;">Stripe</div></div>
      <div style="text-align: center; width: 60px;"><img src="unoflow.unobits.app/api/logos/slack" alt="Slack" style="height:32px; filter: grayscale(1); transition: filter 0.3s;" onmouseover="this.style.filter='none'" onmouseout="this.style.filter='grayscale(1)'"><div style="font-size:0.7rem; color:var(--muted-text); margin-top:5px;">Slack</div></div>
      <div style="text-align: center; width: 60px;"><img src="unoflow.unobits.app/api/logos/react" alt="React" style="height:32px; filter: grayscale(1); transition: filter 0.3s;" onmouseover="this.style.filter='none'" onmouseout="this.style.filter='grayscale(1)'"><div style="font-size:0.7rem; color:var(--muted-text); margin-top:5px;">React</div></div>
      <div style="text-align: center; width: 60px;"><img src="unoflow.unobits.app/api/logos/vercel" alt="Vercel" style="height:32px; filter: grayscale(1); transition: filter 0.3s;" onmouseover="this.style.filter='none'" onmouseout="this.style.filter='grayscale(1)'"><div style="font-size:0.7rem; color:var(--muted-text); margin-top:5px;">Vercel</div></div>
    </div>
  `;
  section.appendChild(showgrid);

  // Features Grid
  const featuresHeader = document.createElement('h2');
  featuresHeader.textContent = 'Engineered for Performance and DX';
  featuresHeader.style.textAlign = 'center';
  featuresHeader.style.marginTop = 'var(--space-xxl)';
  featuresHeader.style.marginBottom = 'var(--space-lg)';
  section.appendChild(featuresHeader);

  const grid = document.createElement('div');
  grid.className = 'grid grid-3 feature-grid';

  const card1 = createInteractiveCard(
    'Dual-Layer Caching',
    'Uses an IndexedDB manifest cache combined with long-lived native browser HTTP caches for absolute instant paint times.',
    'Fast', 'cyan'
  );

  const card2 = createInteractiveCard(
    'Zero-Config Required',
    'Works straight out of the box with default Cloudflare Edge worker settings. Connect and fetch within seconds.',
    'Easy', 'purple'
  );

  const card3 = createInteractiveCard(
    'Auto Fallback System',
    'Detects crawl state and automatically falls back to lightweight, stylized inline SVG templates or custom images.',
    'Smart', 'orange'
  );

  grid.appendChild(card1);
  grid.appendChild(card2);
  grid.appendChild(card3);
  section.appendChild(grid);

  // Showcase code examples on home
  const quickCodeHeader = document.createElement('h2');
  quickCodeHeader.textContent = 'Dead Simple API';
  quickCodeHeader.style.textAlign = 'center';
  quickCodeHeader.style.marginTop = 'var(--space-xxl)';
  quickCodeHeader.style.marginBottom = 'var(--space-md)';
  section.appendChild(quickCodeHeader);

  const quickCodeText = `import Logos from 'unoflow-l';

// 1. Get resolved logo CDN url synchronously
const stripeUrl = Logos.get('stripe');

// 2. Safely apply to any HTMLImageElement with automatic error fallbacks
Logos.apply(document.getElementById('brand-logo'), 'github');`;

  const codeBox = renderCodeBlock(quickCodeText, 'javascript', 'app.js');
  codeBox.style.maxWidth = '700px';
  codeBox.style.marginLeft = 'auto';
  codeBox.style.marginRight = 'auto';
  section.appendChild(codeBox);

  container.appendChild(section);
}
