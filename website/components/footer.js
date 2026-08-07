// Footer Component

export function renderFooter(container) {
  if (!container) return;

  container.innerHTML = `
    <div class="container section flex-between" style="flex-wrap: wrap; gap: var(--space-lg); padding-top: var(--space-xl); padding-bottom: var(--space-xl);">
      <div style="max-width: 400px;">
        <div class="flex-center gap-sm" style="justify-content: flex-start; font-weight: 800; font-size: 1.1rem; color: var(--fg); margin-bottom: var(--space-sm);">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 128 128">
            <defs>
              <linearGradient id="footer-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#00E5FF"/>
                <stop offset="1" stop-color="#008080"/>
              </linearGradient>
            </defs>
            <circle cx="64" cy="64" r="56" fill="none" stroke="url(#footer-g)" stroke-width="8"/>
            <path d="M46 64h36M64 46v36" stroke="url(#footer-g)" stroke-width="10" stroke-linecap="round"/>
          </svg>
          <span>UnoFlow-L</span>
        </div>
        <p style="font-size: 0.9rem; color: var(--muted-text);">
          High-performance, vanilla logo resolution library with automatic IndexedDB manifest storage and zero-latency loading.
        </p>
      </div>

      <div class="flex gap-xl" style="flex-wrap: wrap;">
        <div>
          <h4 style="font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-sm); color: var(--fg);">Product</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: var(--space-xs); font-size: 0.9rem;">
            <li><a href="/playground" style="color: var(--muted-text);">Playground</a></li>
            <li><a href="/performance" style="color: var(--muted-text);">Performance Benchmark</a></li>
            <li><a href="/showcase" style="color: var(--muted-text);">Real-World Showcase</a></li>
          </ul>
        </div>
        <div>
          <h4 style="font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-sm); color: var(--fg);">Resources</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: var(--space-xs); font-size: 0.9rem;">
            <li><a href="/docs" style="color: var(--muted-text);">API Documentation</a></li>
            <li><a href="/examples" style="color: var(--muted-text);">Examples & Gallery</a></li>
            <li><a href="/changelog" style="color: var(--muted-text);">Timeline Changelog</a></li>
          </ul>
        </div>
        <div>
          <h4 style="font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-sm); color: var(--fg);">Company</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: var(--space-xs); font-size: 0.9rem;">
            <li><a href="/about" style="color: var(--muted-text);">Why UnoFlow-L exists</a></li>
            <li><a href="/ecosystem" style="color: var(--muted-text);">Product Roadmap</a></li>
            <li><a href="https://github.com/Jem-Technologies" target="_blank" rel="noopener noreferrer" style="color: var(--muted-text);">GitHub</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="container" style="border-top: 1px solid var(--border-color); padding-top: var(--space-md); padding-bottom: var(--space-md); font-size: 0.8rem; color: var(--muted-text); text-align: center;">
      &copy; ${new Date().getFullYear()} Jem-Technologies. Built with pure vanilla JS & CSS under the MIT License.
    </div>
  `;
}
