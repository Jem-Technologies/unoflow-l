// Theme Toggle Engine (Peak Black or Peak White)

export function initTheme() {
  const toggleBtn = document.querySelector('.theme-toggle-btn');
  const currentTheme = localStorage.getItem('unoflow-theme') || 'dark';
  setTheme(currentTheme);
}

export function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('unoflow-theme', theme);

  // Dispatch a global event so pages can adjust internal drawings/graphs
  window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme } }));
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const target = current === 'light' ? 'dark' : 'light';
  setTheme(target);
}
