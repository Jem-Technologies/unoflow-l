# unoflow-l

> **Client-side brand & app logo resolver with automatic runtime browser caching.**

`unoflow-l` lets developers stream and display company, app, and tech stack logos by key (e.g. `google`, `slack`, `github`, `stripe`, `react`) with zero latency, utilizing **IndexedDB manifest caching (24h TTL)** and **native browser HTTP CDN caching**.

---

## ⚡ Features

- **Zero-Config Hosted Delivery**: Connects directly to the hosted logo server out of the box.
- **Key-Based Resolution**: Ask for logos by name (`Logos.get('google')`) without embedding static assets.
- **Dual-Layer Runtime Cache**:
  1. **IndexedDB Manifest Cache**: The logo manifest (`key -> URL`) is cached in IndexedDB for 24 hours.
  2. **Browser HTTP CDN Cache**: Image files are cached in browser memory with long HTTP `Cache-Control` headers.
- **Automatic Fallback**: If a logo hasn't been crawled yet, it falls back to a clean inline SVG icon or custom fallback image.
- **Framework Agnostic**: Works in React, Vue, Svelte, Next.js, Vite, Node, or plain HTML script tags.

---

## 🚀 Quick Start

### 1. Installation

```bash
npm install unoflow-l
```

---

### 2. Usage in React / Vite / Modern JS

```javascript
import Logos from 'unoflow-l';

// Zero configuration needed!
const googleLogoUrl = Logos.get('google');

// Apply logo to an <img> element with automatic error fallback
const img = document.querySelector('#company-logo');
Logos.apply(img, 'github');
```

---

### 3. Usage in Plain HTML (CDN)

```html
<script src="https://unpkg.com/unoflow-l@latest/dist/logos.min.js"><script>

<script>
  // Get logo URL directly
  const logoUrl = Logos.get('stripe');
  console.log('Stripe logo:', logoUrl);
</script>

<img id="my-logo" src="" alt="Logo" />
<script>
  Logos.apply(document.getElementById('my-logo'), 'slack');
</script>
```

---

## ⚙️ API Reference

| Method | Description |
| :--- | :--- |
| `Logos.get(key, { variant, fallback })` | Synchronously returns resolved logo URL for `key`. |
| `Logos.apply(imgEl, key, { fallback })` | Sets `imgEl.src` with automatic `onerror` fallback. |
| `Logos.has(key)` | Checks if `key` exists in the logo registry. |
| `Logos.hasImage(key)` | Returns `true` if a crawled image exists for this key. |
| `Logos.config({ baseUrl, ttlMs })` | (Optional) Configures a custom logo worker URL or TTL. |
| `Logos.refresh(force)` | Manually re-fetches the manifest from the worker API. |

---

## 📄 License

MIT © [Jem-Technologies](https://github.com/Jem-Technologies)
