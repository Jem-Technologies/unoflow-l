// Playground Sandbox Controller and UI
import Logos from '/dist/logos.esm.js';

class SandboxController {
  constructor() {
    this.offline = false;
    this.cdnFail = false;
    this.disableIdb = false;
    this.forceFallback = false;
    this.latency = 0;
  }

  async resolveLogo(key, variant = '') {
    const startTime = performance.now();

    // Simulate latency
    if (this.latency > 0) {
      await new Promise(r => setTimeout(r, this.latency));
    }

    // Simulate Offline Mode
    if (this.offline) {
      throw new Error('Network request failed: Simulation offline mode active');
    }

    // Simulate CDN Failures
    if (this.cdnFail && !key.startsWith('data:')) {
      throw new Error('CDN fetch failed: Simulated CDN outage');
    }

    // Simulate Bypass IndexedDB
    if (this.disableIdb) {
      // Temporarily mock IndexedDB
    }

    // Handle normal resolution path
    if (this.forceFallback) {
      return {
        url: Logos.GENERIC,
        source: 'Fallback System',
        time: performance.now() - startTime,
        hit: 'miss'
      };
    }

    const startCall = performance.now();
    const url = Logos.get(key, variant ? { variant } : undefined);
    const endCall = performance.now();

    // Check if the manifest holds key
    const exists = Logos.has(key);
    const hasImage = Logos.hasImage(key);

    return {
      url: url,
      source: hasImage ? 'Cloudflare CDN' : exists ? 'Favicon API' : 'Generic SVGFallback',
      time: endCall - startCall,
      hit: exists ? 'hit' : 'miss'
    };
  }
}

const sandbox = new SandboxController();

export function render(container) {
  const root = document.createElement('div');
  root.className = 'container section animate-slide-up';

  root.innerHTML = `
    <h2 style="margin-bottom: var(--space-sm);">Interactive Sandbox Console</h2>
    <p style="margin-bottom: var(--space-xl); max-width: 700px;">
      Inspect manifest indexes, query keys, clear client-side caches, or simulate network failures and latency models using the diagnostic dashboard below.
    </p>

    <div class="grid playground-grid">
      <!-- Left: Interactive Sandbox & Controls -->
      <div>
        <div class="card">
          <h3 style="margin-bottom: var(--space-md);">Query Brand Logo</h3>

          <div class="pg-search-container">
            <input type="text" id="logo-search-input" class="input-field" placeholder="Type key e.g. google, github, stripe, react, slack..." value="google">
            <button id="logo-search-btn" class="btn btn-glow">Resolve</button>
          </div>

          <!-- Sandbox Live Preview Frame -->
          <div class="pg-preview-card">
            <img id="sandbox-preview-img" class="pg-logo-img" src="" alt="Query Preview">
            <div id="sandbox-fallback-alert" style="margin-top: var(--space-md); font-size: 0.85rem; color: var(--accent); display: none;">
              Using Automatic Inline SVG Fallback
            </div>
          </div>

          <!-- Advanced Simulation Settings -->
          <h4 style="margin-top: var(--space-lg); margin-bottom: var(--space-md); border-top: 1px solid var(--border-color); padding-top: var(--space-md);">Simulation Settings</h4>

          <div class="pg-sandbox-controls">
            <label class="sandbox-toggle-label">
              <input type="checkbox" id="toggle-offline">
              Simulate Offline Mode
            </label>
            <label class="sandbox-toggle-label">
              <input type="checkbox" id="toggle-cdn-fail">
              Simulate CDN Outage
            </label>
            <label class="sandbox-toggle-label">
              <input type="checkbox" id="toggle-force-fallback">
              Force Inline Fallback
            </label>
            <label class="sandbox-toggle-label" style="display: flex; flex-direction: column; align-items: flex-start; gap: 4px;">
              <span style="font-size: 0.8rem; color: var(--muted-text);">Artificial Network Latency: <span id="latency-val">0ms</span></span>
              <input type="range" id="slider-latency" min="0" max="2000" step="100" value="0" style="width: 100%; accent-color: var(--accent);">
            </label>
          </div>
        </div>
      </div>

      <!-- Right: Real-time Telemetry & Diagnostics -->
      <div>
        <div class="pg-stats-pane">
          <h3 style="margin-bottom: var(--space-md);">Telemetry Diagnostics</h3>

          <div class="stat-row">
            <span class="stat-label">Resolution Route</span>
            <span id="tel-route" class="stat-value">---</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Network Latency</span>
            <span id="tel-latency" class="stat-value">---</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Local Caching</span>
            <span id="tel-cache" class="stat-value">---</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Execution Time</span>
            <span id="tel-exec-time" class="stat-value glow-cyan">---</span>
          </div>
          <div class="stat-row" style="flex-direction: column; gap: var(--space-xs); border-bottom: none; padding-top: var(--space-md);">
            <span class="stat-label">Resolved Output URL</span>
            <input type="text" id="tel-resolved-url" readonly class="input-field" style="font-family: var(--font-mono); font-size: 0.8rem; padding: var(--space-sm); background-color: var(--bg);" value="">
          </div>

          <div style="margin-top: var(--space-lg); border-top: 1px solid var(--border-color); padding-top: var(--space-md); display: flex; flex-direction: column; gap: var(--space-sm);">
            <button id="btn-clear-idb" class="btn btn-secondary" style="width: 100%; font-size: 0.85rem;">Clear Client IndexedDB Cache</button>
            <button id="btn-force-refresh" class="btn btn-secondary" style="width: 100%; font-size: 0.85rem;">Force Re-Fetch Manifest</button>
          </div>
        </div>
      </div>
    </div>
  `;

  container.appendChild(root);

  // Grab Elements
  const inputEl = root.querySelector('#logo-search-input');
  const searchBtn = root.querySelector('#logo-search-btn');
  const imgEl = root.querySelector('#sandbox-preview-img');
  const fallbackAlert = root.querySelector('#sandbox-fallback-alert');

  // Toggles
  const offlineChk = root.querySelector('#toggle-offline');
  const cdnFailChk = root.querySelector('#toggle-cdn-fail');
  const forceFallbackChk = root.querySelector('#toggle-force-fallback');
  const latencySlider = root.querySelector('#slider-latency');
  const latencyVal = root.querySelector('#latency-val');

  // Stats
  const telRoute = root.querySelector('#tel-route');
  const telLatency = root.querySelector('#tel-latency');
  const telCache = root.querySelector('#tel-cache');
  const telExecTime = root.querySelector('#tel-exec-time');
  const telUrl = root.querySelector('#tel-resolved-url');

  // Actions
  const clearIdbBtn = root.querySelector('#btn-clear-idb');
  const forceRefreshBtn = root.querySelector('#btn-force-refresh');

  // Handle Query Execution
  const executeQuery = async () => {
    const key = inputEl.value.trim().toLowerCase();
    if (!key) return;

    try {
      const res = await sandbox.resolveLogo(key);

      // Update Image element
      imgEl.onerror = () => {
        imgEl.onerror = null;
        imgEl.src = Logos.GENERIC;
        fallbackAlert.style.display = 'block';
        telRoute.textContent = 'Generic SVG Fallback';
      };

      imgEl.src = res.url;
      fallbackAlert.style.display = res.url === Logos.GENERIC ? 'block' : 'none';

      // Update Telemetry pane
      telRoute.textContent = res.source;
      telLatency.textContent = sandbox.latency > 0 ? `${sandbox.latency}ms (Simulated)` : '0ms';
      telCache.textContent = res.hit === 'hit' ? 'IndexedDB Hit' : 'IndexedDB Miss';
      telExecTime.textContent = `${res.time.toFixed(3)} ms`;
      telUrl.value = res.url;

    } catch (err) {
      // Simulated fail output
      imgEl.src = Logos.GENERIC;
      fallbackAlert.style.display = 'block';
      telRoute.textContent = 'ERROR (Outage Sim)';
      telLatency.textContent = '---';
      telCache.textContent = '---';
      telExecTime.textContent = '0.000 ms';
      telUrl.value = err.message;
    }
  };

  // Wire sliders and checkboxes
  latencySlider.addEventListener('input', (e) => {
    sandbox.latency = parseInt(e.target.value);
    latencyVal.textContent = `${sandbox.latency}ms`;
  });

  offlineChk.addEventListener('change', (e) => {
    sandbox.offline = e.target.checked;
  });

  cdnFailChk.addEventListener('change', (e) => {
    sandbox.cdnFail = e.target.checked;
  });

  forceFallbackChk.addEventListener('change', (e) => {
    sandbox.forceFallback = e.target.checked;
  });

  // Action clicks
  searchBtn.addEventListener('click', executeQuery);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') executeQuery();
  });

  clearIdbBtn.addEventListener('click', async () => {
    try {
      const DB_NAME = 'unoflow-logos';
      if (typeof indexedDB !== 'undefined') {
        const req = indexedDB.deleteDatabase(DB_NAME);
        req.onsuccess = () => {
          alert('IndexedDB manifest cache cleared successfully.');
          executeQuery();
        };
        req.onerror = () => alert('Failed to clear database.');
      }
    } catch (e) {
      alert('Error clearing cache: ' + e.message);
    }
  });

  forceRefreshBtn.addEventListener('click', async () => {
    try {
      await Logos.refresh(true);
      alert('Manifest successfully re-fetched & hydrated from the edge API worker.');
      executeQuery();
    } catch (e) {
      alert('Error refreshing manifest: ' + e.message);
    }
  });

  // Run initial query
  executeQuery();
}
