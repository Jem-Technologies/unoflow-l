// Interactive Documentation Page Component
import { renderCodeBlock } from '/components/codeblock.js';
import Logos from '/dist/logos.esm.js';

export function render(container) {
  const root = document.createElement('div');
  root.className = 'container section animate-slide-up';

  root.innerHTML = `
    <div class="grid docs-layout">
      <!-- Sidebar Navigation -->
      <aside class="docs-sidebar">
        <h4 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted-text); margin-bottom: var(--space-xs);">Guide</h4>
        <a href="#quickstart" class="docs-link active">Quick Start</a>
        <a href="#config" class="docs-link">Logos.config</a>
        <br>
        <h4 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted-text); margin-bottom: var(--space-xs);">API Reference</h4>
        <a href="#get" class="docs-link">Logos.get</a>
        <a href="#apply" class="docs-link">Logos.apply</a>
        <a href="#has" class="docs-link">Logos.has</a>
        <a href="#hasimage" class="docs-link">Logos.hasImage</a>
        <a href="#refresh" class="docs-link">Logos.refresh</a>
      </aside>

      <!-- Main Docs Content -->
      <div>
        <!-- Quick Start -->
        <section id="quickstart" style="margin-bottom: var(--space-xxl);">
          <h2 style="margin-bottom: var(--space-sm);">Quick Start Integration</h2>
          <p style="margin-bottom: var(--space-md);">
            Get up and running with <code>unoflow-l</code> in seconds. Install via npm or reference the compiled script via modern ES Module imports.
          </p>
        </section>

        <!-- Method: Logos.config -->
        <section id="config" class="api-method-card">
          <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-sm);">
            <span class="badge badge-cyan">Method</span>
            <h2 style="margin: 0;">Logos.config(options)</h2>
          </div>
          <p style="color: var(--muted-text); margin-bottom: var(--space-md);">
            Configure your worker delivery API endpoints and customize manifest storage caching lifespans globally.
          </p>

          <div style="margin-bottom: var(--space-md);">
            <strong>Arguments:</strong>
            <ul style="margin-left: var(--space-lg); font-size: 0.95rem; color: var(--subtle-text);">
              <li><code>options.baseUrl</code> (string): Custom cloudflare workers deployment baseUrl.</li>
              <li><code>options.ttlMs</code> (number): Cache manifest IndexedDB storage TTL time in milliseconds.</li>
            </ul>
          </div>

          <div class="api-interactive-sandbox">
            <strong>Interactive Live Sandbox:</strong>
            <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-sm); margin-bottom: var(--space-sm);">
              <input type="text" id="cfg-url-input" class="input-field" placeholder="Base URL e.g. https://api.yoursite.com" value="unoflow.unobits.app">
              <input type="number" id="cfg-ttl-input" class="input-field" placeholder="TTL in Ms" value="86400000">
            </div>
            <button id="btn-run-config" class="btn btn-secondary">Apply Configuration</button>
            <div class="api-interactive-output" id="out-config">Output: Ready</div>
          </div>
        </section>

        <!-- Method: Logos.get -->
        <section id="get" class="api-method-card">
          <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-sm);">
            <span class="badge badge-cyan">Method</span>
            <h2 style="margin: 0;">Logos.get(key, options)</h2>
          </div>
          <p style="color: var(--muted-text); margin-bottom: var(--space-md);">
            Synchronously extracts cached asset paths matching key, falling back gracefully if not crawled or in cache.
          </p>

          <div class="api-interactive-sandbox">
            <strong>Interactive Live Sandbox:</strong>
            <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-sm); margin-bottom: var(--space-sm);">
              <input type="text" id="get-key-input" class="input-field" placeholder="Logo key" value="google">
            </div>
            <button id="btn-run-get" class="btn btn-secondary">Run Logos.get()</button>
            <div class="api-interactive-output" id="out-get">Output: Click button to execute</div>
          </div>
        </section>

        <!-- Method: Logos.apply -->
        <section id="apply" class="api-method-card">
          <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-sm);">
            <span class="badge badge-cyan">Method</span>
            <h2 style="margin: 0;">Logos.apply(imgEl, key, options)</h2>
          </div>
          <p style="color: var(--muted-text); margin-bottom: var(--space-md);">
            Applies computed image URLs on an <code>HTMLImageElement</code> dynamically with seamless <code>onerror</code> fallbacks.
          </p>

          <div class="api-interactive-sandbox">
            <strong>Interactive Live Sandbox:</strong>
            <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-sm); margin-bottom: var(--space-sm);">
              <input type="text" id="apply-key-input" class="input-field" placeholder="Logo key" value="github">
            </div>
            <button id="btn-run-apply" class="btn btn-secondary">Run Logos.apply()</button>
            <div class="flex-center" style="margin-top: 10px; padding: 15px; border: 1px dashed var(--border-color); min-height: 80px;">
              <img id="apply-test-img" style="height: 48px;" alt="Interactive test image target">
            </div>
          </div>
        </section>

        <!-- Method: Logos.has -->
        <section id="has" class="api-method-card">
          <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-sm);">
            <span class="badge badge-cyan">Method</span>
            <h2 style="margin: 0;">Logos.has(key)</h2>
          </div>
          <p style="color: var(--muted-text); margin-bottom: var(--space-md);">
            Verifies if the manifest index registry contains entries indexed by the specified key.
          </p>

          <div class="api-interactive-sandbox">
            <strong>Interactive Live Sandbox:</strong>
            <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-sm); margin-bottom: var(--space-sm);">
              <input type="text" id="has-key-input" class="input-field" placeholder="Logo key" value="stripe">
            </div>
            <button id="btn-run-has" class="btn btn-secondary">Run Logos.has()</button>
            <div class="api-interactive-output" id="out-has">Output: Click button to execute</div>
          </div>
        </section>

        <!-- Method: Logos.hasImage -->
        <section id="hasimage" class="api-method-card">
          <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-sm);">
            <span class="badge badge-cyan">Method</span>
            <h2 style="margin: 0;">Logos.hasImage(key)</h2>
          </div>
          <p style="color: var(--muted-text); margin-bottom: var(--space-md);">
            Checks if a fully crawled R2 image is present on the storage bucket for this key.
          </p>

          <div class="api-interactive-sandbox">
            <strong>Interactive Live Sandbox:</strong>
            <div style="display: flex; gap: var(--space-sm); margin-top: var(--space-sm); margin-bottom: var(--space-sm);">
              <input type="text" id="hasimage-key-input" class="input-field" placeholder="Logo key" value="react">
            </div>
            <button id="btn-run-hasimage" class="btn btn-secondary">Run Logos.hasImage()</button>
            <div class="api-interactive-output" id="out-hasimage">Output: Click button to execute</div>
          </div>
        </section>

        <!-- Method: Logos.refresh -->
        <section id="refresh" class="api-method-card">
          <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-sm);">
            <span class="badge badge-cyan">Method</span>
            <h2 style="margin: 0;">Logos.refresh(force)</h2>
          </div>
          <p style="color: var(--muted-text); margin-bottom: var(--space-md);">
            Triggers background fetching of the latest edge logo manifest. Passing <code>force=true</code> overrides current TTL settings.
          </p>
        </section>
      </div>
    </div>
  `;

  // Insert standard installation code to quickstart
  const quickstartSection = root.querySelector('#quickstart');
  const code = renderCodeBlock(
`// Install dependencies
npm install unoflow-l

// Integrate into ESModules
import Logos from 'unoflow-l';

const url = Logos.get('stripe');`, 'javascript', 'quick-install.js');
  quickstartSection.appendChild(code);

  container.appendChild(root);

  // Hook Live Sandboxes
  // 1. Logos.config
  const cfgUrl = root.querySelector('#cfg-url-input');
  const cfgTtl = root.querySelector('#cfg-ttl-input');
  const btnConfig = root.querySelector('#btn-run-config');
  const outConfig = root.querySelector('#out-config');

  btnConfig.addEventListener('click', () => {
    try {
      const res = Logos.config({
        baseUrl: cfgUrl.value,
        ttlMs: parseInt(cfgTtl.value)
      });
      outConfig.textContent = `Output: Configuration Applied -> ${JSON.stringify(res, null, 2)}`;
    } catch (e) {
      outConfig.textContent = `Error: ${e.message}`;
    }
  });

  // 2. Logos.get
  const getKey = root.querySelector('#get-key-input');
  const btnGet = root.querySelector('#btn-run-get');
  const outGet = root.querySelector('#out-get');

  btnGet.addEventListener('click', () => {
    try {
      const url = Logos.get(getKey.value);
      outGet.textContent = `Output: "${url}"`;
    } catch (e) {
      outGet.textContent = `Error: ${e.message}`;
    }
  });

  // 3. Logos.apply
  const applyKey = root.querySelector('#apply-key-input');
  const btnApply = root.querySelector('#btn-run-apply');
  const applyImg = root.querySelector('#apply-test-img');

  btnApply.addEventListener('click', () => {
    Logos.apply(applyImg, applyKey.value);
  });

  // 4. Logos.has
  const hasKey = root.querySelector('#has-key-input');
  const btnHas = root.querySelector('#btn-run-has');
  const outHas = root.querySelector('#out-has');

  btnHas.addEventListener('click', () => {
    const val = Logos.has(hasKey.value);
    outHas.textContent = `Output: ${val}`;
  });

  // 5. Logos.hasImage
  const hasImgKey = root.querySelector('#hasimage-key-input');
  const btnHasImg = root.querySelector('#btn-run-hasimage');
  const outHasImg = root.querySelector('#out-hasimage');

  btnHasImg.addEventListener('click', () => {
    const val = Logos.hasImage(hasImgKey.value);
    outHasImg.textContent = `Output: ${val}`;
  });

  // Highlight Sidebar Anchors on scroll
  const setupScrollSpy = () => {
    const links = root.querySelectorAll('.docs-link');
    const sections = root.querySelectorAll('section');

    const handleScroll = () => {
      let currentSectionId = '';
      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 120) {
          currentSectionId = sec.id;
        }
      });

      links.forEach(link => {
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
  };
  setupScrollSpy();
}
