# UnoFlow L — Comprehensive Architecture, Productization & Technical Review

**Date:** September 2026
**Package:** `unoflow-l` (v1.0.4)
**Author/Publisher:** Jem-Technologies

---

## 1. Executive Assessment

**UnoFlow L** is a lightweight, zero-dependency client-side utility designed to resolve company, technology, and application logos by brand keys (e.g., `google`, `stripe`, `github`, `react`). It operates as a runtime client for a Cloudflare Worker CDN API backed by IndexedDB manifest caching and native browser HTTP caching.

---

## 2. Revised Findings & Priority Classification

### 🔴 Confirmed P0 Issues
1. **Broken CommonJS Package Export:** Requiring the package via `require('unoflow-l')` or `require('./dist/logos.cjs.js')` throws `ReferenceError: Logos is not defined` because the export statement in `scripts/build.js` was appended outside the IIFE wrapper scope.
2. **Potential SSR / Node Side-Effect Crashes:** Top-level execution of `boot()` triggers browser-only APIs (`window.dispatchEvent`) during manifest update if not safely guarded against non-browser environments.

### 🟡 Conditional P0 / P1 Issues
1. **Manifest Validation & `hasPending()` Fragility:** `hasPending()` checks `if (!it || !it.hasImage) return true;`. While all 98 current production entries have `hasImage: true`, entries with `hasImage: false` are valid manifest records representing fallback-only keys. Flagging them as "pending" would permanently invalidate the 24-hour IndexedDB TTL.
2. **`Logos.config()` Boot Race:** `boot()` executes immediately upon script import. Calling `Logos.config({ baseUrl })` after import requires a clean re-hydration lifecycle if the origin changes, avoiding duplicate overlapping requests or cached manifest origin mismatches.

### 🔵 P1 Issues (Ergonomics & Package Hygiene)
1. **Package Export Normalization:** Align `package.json` `exports`, `main`, `module`, and `types` with standard Node/ESM module resolution contract.
2. **Documentation Accuracy:** Update `README.md` to accurately document `Logos.ready`, synchronous `get()` behavior, 302 endpoint handling, and SSR safety.
3. **Legacy Unobits Branding Cleanup:** Remove residual `unobits-logos` mentions in `scripts/build.js`, header comments, and `package.json` keywords.
4. **TypeScript Declaration Sync:** Ensure `index.d.ts` matches all engine methods and properties.

### 🟢 P2 Issues (Future Enhancements)
1. **Custom Domain:** Provision `logos.unoflow.dev` for hosted Cloudflare Worker API.
2. **Automated Verification Script:** Add `npm test` script to run CJS, ESM, and browser bundle verification.

---

## 3. Product Definition & Lifecycle Contract

### Product Definition
> **"UnoFlow L is a zero-dependency, framework-agnostic runtime logo resolution client for CDN-hosted brand manifests."**

### Engine Lifecycle Model
1. **Import / Evaluation:** On module load, `boot()` initializes automatically in browser environments, attempting IndexedDB cache hydration followed by background manifest update if TTL expired.
2. **SSR / Node Safety:** In non-browser environments, IndexedDB and DOM dispatches are safely skipped without throwing errors.
3. **`Logos.ready`:** A Promise resolving to the hydrated manifest record.
4. **`Logos.config(cfg)` / `Logos.init(cfg)`:**
   - Updates `BASE_URL` and `TTL_MS`.
   - If `baseUrl` changes to a new target origin, resets in-memory map and dispatches a fresh manifest fetch to ensure origin consistency.
5. **`Logos.get(key)` (Synchronous):**
   - Pre-hydration or unknown key: Returns `/api/logos/:key` (which issues an HTTP 302 redirect on the Worker to generic fallback SVG).
   - Hydrated known key: Synchronously returns manifest-backed asset URL.

---

## 4. Manifest Validity & Caching Contract

- **Schema:** `{ items: Record<string, LogoItem>, source: string, ts: number }`.
- **`hasImage: boolean` Definition:** Indicates whether a custom vector/raster logo exists (`true`) or if default favicon/unavatar resolution is used (`false`).
- **Validity Contract:** Entries with `hasImage: false` are valid, permanent records.
- **`hasPending()` Logic:** Only evaluates to `true` if `record` is missing, lacks an `items` object, or `items` is empty (`Object.keys(items).length === 0`).

---

## 5. CJS / ESM / Browser Build Strategy

- **Universal Export inside `src/index.js`:**
  ```javascript
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = Logos;
  } else if (typeof define === 'function' && define.amd) {
    define([], function () { return Logos; });
  } else {
    global.Logos = Logos;
  }
  ```
- **Distribution Output (`scripts/build.js`):**
  - `dist/logos.js` (Browser IIFE global)
  - `dist/logos.min.js` (Minified IIFE global)
  - `dist/logos.esm.js` (ES Module with `export default Logos;`)
  - `dist/logos.cjs.js` (CommonJS module with UMD export)
- **Root Package Resolution (`package.json`):**
  ```json
  "main": "dist/logos.cjs.js",
  "module": "dist/logos.esm.js",
  "unpkg": "dist/logos.min.js",
  "jsdelivr": "dist/logos.min.js",
  "types": "index.d.ts",
  "exports": {
    ".": {
      "types": "./index.d.ts",
      "import": "./dist/logos.esm.js",
      "require": "./dist/logos.cjs.js",
      "script": "./dist/logos.min.js"
    }
  }
  ```

---

## 6. Required Verification Test Matrix

1. **Package Root CJS Resolution:** `const Logos = require('unoflow-l')` loads without error.
2. **Package Root ESM Resolution:** `import Logos from 'unoflow-l'` loads without error.
3. **Browser Global:** `<script src="dist/logos.min.js"></script>` attaches `window.Logos`.
4. **Pre-Hydration Lookup:** `Logos.get('google')` returns valid Worker redirect URL.
5. **Hydrated Lookup:** `await Logos.ready; Logos.get('google')` returns manifest asset URL.
6. **Manifest TTL Cache:** `hasImage: false` entries do not cause repeated manifest network requests within 24h.
7. **SSR Safety:** `require('./dist/logos.cjs.js')` in headless Node environment executes without DOM/window errors.
