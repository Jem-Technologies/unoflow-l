# unoflow-l

> **Zero-dependency runtime logo resolution client with automatic browser caching.**

`unoflow-l` lets developers stream and display company, app, and tech stack logos by key (e.g. `google`, `slack`, `github`, `stripe`, `react`) with zero latency, utilizing **IndexedDB manifest caching (24h TTL)** and **native browser HTTP CDN caching**.

---

## ⚡ Features

- **Zero Dependencies**: Lightweight client engine (<2KB minified) with zero external dependencies.
- **Key-Based Synchronous Resolution**: Resolve logos by key (`Logos.get('google')`) without embedding static assets or changing async return types.
- **Dual-Layer Runtime Cache**:
  1. **IndexedDB Manifest Cache**: Logo registry manifest (`key -> URL`) is cached in IndexedDB for 24 hours.
  2. **Browser HTTP CDN Cache**: Image files are cached in browser memory with long HTTP `Cache-Control` headers.
- **Automatic Fallbacks**: Resolves to clean SVG vector fallbacks if a custom crawled logo is not present.
- **SSR & Framework Safe**: Safe to import and evaluate in Next.js, Nuxt, Node.js, Vite, or plain HTML script tags.

---

## 🚀 Quick Start

### 1. Installation

```bash
npm install unoflow-l
```

---

### 2. Usage in React / Vite / ESM

```javascript
import Logos from 'unoflow-l';

// Fast synchronous lookup
const googleLogoUrl = Logos.get('google');

// Optional: await manifest hydration for guaranteed manifest asset URLs
await Logos.ready;
console.log('Hydrated Slack logo:', Logos.get('slack'));

// Apply logo to an <img> element with automatic error fallback
const img = document.querySelector('#company-logo');
Logos.apply(img, 'github');
```

---

### 3. Usage in CommonJS (Node.js)

```javascript
const Logos = require('unoflow-l');

const stripeLogo = Logos.get('stripe');
console.log('Stripe logo URL:', stripeLogo);
```

---

### 4. Usage in Plain HTML (CDN)

```html
<script src="https://unpkg.com/unoflow-l@latest/dist/logos.min.js"></script>

<script>
  // Get logo URL directly
  const logoUrl = Logos.get('stripe');
  console.log('Stripe logo:', logoUrl);

  // Apply directly to an img element
  Logos.apply(document.getElementById('my-logo'), 'slack');
</script>

<img id="my-logo" src="" alt="Slack Logo" />
```

---

## ⚙️ API Reference

| Method / Property | Type | Description |
| :--- | :--- | :--- |
| `Logos.get(key, opts)` | `string` | Synchronously returns resolved logo URL for `key`. |
| `Logos.apply(imgEl, key, opts)` | `void` | Sets `imgEl.src` with automatic `onerror` SVG fallback. |
| `Logos.has(key)` | `boolean` | Checks if `key` exists in the logo registry map. |
| `Logos.hasImage(key)` | `boolean` | Returns `true` if a custom crawled asset exists for `key`. |
| `Logos.ready` | `Promise` | Resolves when IndexedDB / network manifest hydration completes. |
| `Logos.config(cfg)` | `object` | Configures `baseUrl` or `ttlMs` and re-hydrates if origin changes. |
| `Logos.init(cfg)` | `Promise` | Configures settings and returns the active `ready` Promise. |
| `Logos.refresh(force)` | `Promise` | Manually re-fetches the manifest from the worker API. |
| `Logos.source()` | `string` | Returns current default resolution source (e.g., `'favicon'`). |
| `Logos.GENERIC` | `string` | Data URI of the default inline SVG vector fallback. |

---

## 📄 License

MIT © [Jem-Technologies](https://github.com/Jem-Technologies)
