// Light SPA History-API Router

const ROUTES = {
  '/': () => import('/website/pages/home.js'),
  '/playground': () => import('/website/pages/playground.js'),
  '/docs': () => import('/website/pages/docs.js'),
  '/examples': () => import('/website/pages/examples.js'),
  '/performance': () => import('/website/pages/performance.js'),
  '/ecosystem': () => import('/website/pages/ecosystem.js'),
  '/changelog': () => import('/website/pages/changelog.js'),
  '/showcase': () => import('/website/pages/showcase.js'),
  '/about': () => import('/website/pages/about.js')
};

let mainContainer = null;

export function initRouter(container) {
  mainContainer = container;

  // Intercept normal anchor tag clicks to perform SPA transitions
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (href && href.startsWith('/') && !href.startsWith('//')) {
      e.preventDefault();
      navigateTo(href);
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', handleRoute);

  // Initial route resolve
  handleRoute();
}

export function navigateTo(path) {
  if (window.location.pathname === path) return;
  window.history.pushState(null, '', path);
  handleRoute();
}

async function handleRoute() {
  const path = window.location.pathname;
  const routeLoader = ROUTES[path];

  // Update active links inside Header or Sidebar
  updateActiveLinks(path);

  if (!routeLoader) {
    // 404 handler
    const notfound = await import('/website/pages/notfound.js');
    renderPage(notfound);
    return;
  }

  try {
    const pageModule = await routeLoader();
    renderPage(pageModule);
  } catch (err) {
    console.error('Error loading page module:', err);
    mainContainer.innerHTML = `<div class="container section"><h2>Failed to load page.</h2><p>${err.message}</p></div>`;
  }
}

function renderPage(module) {
  // Clear container
  mainContainer.innerHTML = '';

  // Call init/render on page module
  if (typeof module.render === 'function') {
    module.render(mainContainer);
  } else if (module.default && typeof module.default.render === 'function') {
    module.default.render(mainContainer);
  }

  // Auto scroll to top
  window.scrollTo(0, 0);
}

function updateActiveLinks(path) {
  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === path) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
