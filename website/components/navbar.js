// Navbar Component
import { toggleTheme } from '/website/lib/theme.js';

export function renderNavbar(container) {
  if (!container) return;

  container.innerHTML = `
    <div class="container flex-between" style="height: 70px;">
      <!-- Logo brand -->
      <a href="/" class="flex-center gap-sm" style="text-decoration: none; font-weight: 800; font-size: 1.3rem; color: var(--fg);">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 128 128">
          <defs>
            <linearGradient id="nav-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#00E5FF"/>
              <stop offset="1" stop-color="#008080"/>
            </linearGradient>
          </defs>
          <circle cx="64" cy="64" r="56" fill="none" stroke="url(#nav-g)" stroke-width="8"/>
          <path d="M46 64h36M64 46v36" stroke="url(#nav-g)" stroke-width="10" stroke-linecap="round"/>
        </svg>
        <span>UnoFlow-L</span>
      </a>

      <!-- Desktop Links -->
      <nav class="flex gap-md header-nav-links" style="align-items: center;">
        <a href="/playground" class="nav-link">Playground</a>
        <a href="/docs" class="nav-link">Docs</a>
        <a href="/examples" class="nav-link">Examples</a>
        <a href="/performance" class="nav-link">Performance</a>
        <a href="/showcase" class="nav-link">Showcase</a>
        <a href="/about" class="nav-link">About</a>

        <!-- Theme Toggle -->
        <button class="theme-toggle-btn" aria-label="Toggle Theme">
          <!-- Sun icon -->
          <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <!-- Moon icon -->
          <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </nav>
    </div>
  `;

  // Handle active class styles
  const addActiveNavStyles = () => {
    const style = document.createElement('style');
    style.id = 'navbar-custom-styles';
    style.innerHTML = `
      .nav-link {
        color: var(--muted-text);
        text-decoration: none;
        font-weight: 500;
        font-size: 0.95rem;
        transition: color var(--transition-fast);
      }
      .nav-link:hover, .nav-link.active {
        color: var(--accent);
      }
      @media (max-width: 768px) {
        .header-nav-links .nav-link:not([href="/playground"]):not([href="/docs"]):not([href="/about"]) {
          display: none;
        }
      }
    `;
    if (!document.getElementById('navbar-custom-styles')) {
      document.head.appendChild(style);
    }
  };
  addActiveNavStyles();

  // Watch theme status and flip sun/moon indicators
  const updateThemeToggleUi = () => {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const sunIcon = container.querySelector('.sun-icon');
    const moonIcon = container.querySelector('.moon-icon');
    if (!sunIcon || !moonIcon) return;

    if (theme === 'light') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  };

  updateThemeToggleUi();

  window.addEventListener('themechanged', updateThemeToggleUi);

  // Hook event listener
  container.querySelector('.theme-toggle-btn').addEventListener('click', () => {
    toggleTheme();
  });
}
