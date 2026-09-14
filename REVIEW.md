# UnoFlow L — Comprehensive Architecture, Productization & Technical Review

**Date:** September 2026
**Package:** `unoflow-l` (v1.0.4)
**Author/Publisher:** Jem-Technologies

---

## 1. Executive Assessment

**UnoFlow L** is a lightweight, zero-dependency client-side utility designed to resolve company, technology, and application logos by brand keys (e.g., `google`, `stripe`, `github`, `react`). It operates as a runtime client for a Cloudflare Worker CDN API backed by IndexedDB manifest caching and native browser HTTP caching.

### Key Strengths
- **Focused Scope:** The package stays true to a small, single-file utility (~200 lines of code) without heavy dependencies.
- **Fast Runtime Access:** Once hydrated, logo lookup is completely synchronous (`O(1)` memory map lookup).
- **Dual-Layer Caching Concept:** Combining IndexedDB local manifest persistence with HTTP CDN caching is an effective architecture for low-latency web logo delivery.
- **Clean Showcase UI:** The accompanying showcase website (`website/`) is built using clean, pure vanilla JS and CSS without heavy framework overhead.

### Key Weaknesses & Production Risks
1. **Broken CommonJS / Node Export (P0 Bug):** The build output for `dist/logos.cjs.js` appends `module.exports = Logos;` outside the IIFE wrapper function where `Logos` was defined with `var`. Requiring `unoflow-l` in any CommonJS or Node environment throws an immediate `ReferenceError: Logos is not defined`.
2. **Infinite Refetch / Cache Bypass Bug (P0 Bug):** The `hasPending()` function returns `true` whenever any item in the cached manifest lacks a `hasImage` flag or when items exist without complete metadata. This causes `boot()` to bypass the 24-hour IndexedDB TTL and trigger an HTTP fetch on **every single page load**.
3. **Async Initial Hydration Deficit in `get()` / `apply()`:** Calling `Logos.get('google')` before `Logos.ready` resolves returns a fallback endpoint URL (`/api/logos/google`). Fetching this endpoint directly from an `<img>` tag returns a JSON metadata payload instead of an actual image file, causing broken image renders on first render before IndexedDB hydration completes.
4. **Boot Timing Race in `Logos.config()`:** `readyPromise = boot()` executes immediately upon file evaluation. Calling `Logos.config({ baseUrl })` after importing the module does not redirect the initial `boot()` fetch because the fetch is already dispatched using the default URL.
5. **Superficial Unobits Coupling:** Build banners, `package.json` messages, keywords, and default endpoints contain legacy references to `unobits-logos` and worker dev URLs.

---

## 2. Product Definition & Positioning

### Current Positioning
> *"Client-side brand & app logo resolver with automatic runtime browser caching."*

### Honest & Stronger Product Boundary
UnoFlow L is **a lightweight runtime logo resolution client for Cloudflare CDN-hosted brand manifests**.

It is **not** an image manipulation library, static icon asset collection, or backend crawler. It is a client-side delivery bridge that resolves abstract brand keys (`google`, `slack`, `framer`) into CDN-backed image URLs with inline SVG fallbacks and local cache persistence.

---

## 3. Separation from Unobits

### Analysis of Hidden Coupling & Unobits Dependencies
- **Worker Endpoint:** Default endpoint is hardcoded to `https://unobits-logos-worker.flat-dust-248f.workers.dev`. While functional, referencing an unbranded `workers.dev` URL exposes internal development infrastructure.
- **Build Script & Header Banners:** `scripts/build.js` generates headers stating `/* unobits-logos — Client logo getter... */` and logs `📦 Building unobits-logos package distributions...`.
- **Package Keywords:** `package.json` includes `"unobits"` in keywords.
- **IndexedDB Database Name:** Is set to `unoflow-logos` in `src/index.js`, which is correctly decoupled.

**Conclusion:** The coupling is purely superficial (naming strings, build comments, default worker URL). There is no deep runtime dependency on private Unobits application APIs or authentication headers.

---

## 4. Source & Public API Correctness Review

### Code File: `src/index.js` & `scripts/build.js`

#### Issue 1: Broken CommonJS Export
- **File:** `scripts/build.js` (Lines 22–24) & `src/index.js`
- **Mechanism:** `src/index.js` wraps code inside `(function (global) { 'use strict'; var Logos = ...; })(...)`. `scripts/build.js` creates `logos.cjs.js` by appending `\nmodule.exports = Logos;\n` outside the IIFE.
- **Result:** `Logos` is scoped inside the IIFE and is undefined in the outer file scope. `require('unoflow-l')` fails with:
  `ReferenceError: Logos is not defined`

#### Issue 2: Infinite Manifest Refetching (`hasPending`)
- **File:** `src/index.js` (Lines 77–86)
```javascript
function hasPending(record) {
  var items = record && record.items;
  if (!items) return true;
  var keys = Object.keys(items);
  if (!keys.length) return true;
  for (var i = 0; i < keys.length; i++) {
    var it = items[keys[i]];
    if (!it || !it.hasImage) return true;
  }
  return false;
}
```
- **Impact:** If the hosted API returns items where some items have `hasImage: false` (e.g. key exists in manifest but image crawling is pending or fallback), `hasPending` permanently evaluates to `true`. On every page load, `boot()` ignores `fresh` TTL and re-executes `fetchManifest()`.

#### Issue 3: `Logos.get()` and Endpoint Behavior
- **File:** `src/index.js` (Lines 123–133)
- **Behavior:**
  - If key is in `MEM`, returns item URL (e.g. `/api/logos/google?variant=favicon`).
  - If key is NOT in `MEM` (e.g. initial page load before `boot()` completes), returns `resolveUrl('/api/logos/' + encodeURIComponent(k))`.
  - The endpoint `https://unobits-logos-worker.flat-dust-248f.workers.dev/api/logos/google` returns `Content-Type: application/json`, NOT an image! Passing this URL directly to `<img src="...">` fails to display an image.

#### Issue 4: `Logos.config()` Initialization Timing
- **File:** `src/index.js` (Lines 149–180)
- `readyPromise = boot();` is executed immediately when `src/index.js` is imported. If a developer calls `Logos.config({ baseUrl: 'https://custom-domain.com' })` after import, the initial `boot()` fetch has already fired using the default Cloudflare worker domain.

---

## 5. Cache Architecture & Hosted Infrastructure Review

### Dual-Layer Caching Review
1. **IndexedDB Manifest Cache:** Stored under DB `unoflow-logos`, store `kv`, key `manifest`. Correctly handles browser permission blocks / missing IndexedDB with try/catch blocks.
2. **Browser HTTP CDN Cache:** The Cloudflare worker serves manifest and images with `access-control-allow-origin: *` CORS headers.
3. **Invalidation:** Dispatches `logos:updated` `CustomEvent` on `window` when manifest image count changes during background refresh.

### Hosted Service Review
- **Endpoint:** `https://unobits-logos-worker.flat-dust-248f.workers.dev`
- **CORS:** Headers present (`access-control-allow-origin: *`).
- **Reliability:** Hosted on Cloudflare Workers edge network.
- **Recommendation:** Keep current worker operational while providing clean `Logos.config({ baseUrl })` support for custom domains (e.g., `logos.unoflow.dev`).

---

## 6. Browser, SSR, and Node Compatibility Review

| Environment | Current Status | Issues Found | Recommendation |
| :--- | :--- | :--- | :--- |
| **Browser (Script CDN / ESM)** | Working with caveats | Initial load before `boot()` finishes returns JSON worker URL. | Defer or handle unhydrated keys gracefully in `get()` / `apply()`. |
| **CommonJS (Node.js)** | ❌ Broken | `ReferenceError: Logos is not defined` on `require()`. | Fix export scope in IIFE / `scripts/build.js`. |
| **ESM (Node.js)** | ⚠️ Warning | Missing `"type": "module"` or explicit extension mapping in `package.json`. | Add clean `"exports"` conditional map in `package.json`. |
| **SSR (Next.js / Nuxt)** | ⚠️ Unsafe side-effects | `boot()` immediately attempts IndexedDB/fetch on module load during server-side render. | Guard IndexedDB / window event execution safely in SSR. |

---

## 7. Build, Package, and Release Review

### Package Configuration (`package.json`)
- `"main"`: `"dist/logos.cjs.js"`
- `"module"`: `"dist/logos.esm.js"`
- `"types"`: `"index.d.ts"`
- `"exports"` field needs standard NodeJS module resolution layout:
```json
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

## 8. Prioritized Plan (P0 / P1 / P2)

### P0: Must-Fix Bugs & Production Risks
1. **Fix CommonJS Build Output:** Ensure `Logos` is properly exported in `dist/logos.cjs.js` so `require('unoflow-l')` works without errors in Node and CommonJS bundlers.
2. **Fix `hasPending()` Infinite Fetch Loop:** Correct manifest freshness checking so `boot()` respects the 24-hour IndexedDB TTL when cached items are valid.
3. **Fix Initial Load Endpoint Handling:** Ensure `Logos.get()` and `Logos.apply()` do not supply JSON API endpoint URLs to `<img>` tags before manifest hydration completes.
4. **Fix Configuration Timing:** Allow `Logos.config()` or `Logos.init()` to re-configure `baseUrl` and re-trigger/defer `boot()` cleanly.

### P1: High-Value Ergonomics & Productization
1. **Clean Unobits Branding:** Remove `unobits-logos` mentions from `scripts/build.js`, dist headers, and `package.json` keywords.
2. **Standardize `package.json` Exports & TypeScript Types:** Ensure seamless import support across Next.js, Vite, Node ESM, CommonJS, and TypeScript.
3. **Accurate Documentation:** Update `README.md` to accurately document asynchronous initialization (`Logos.ready`), fallback behavior, and SSR safety.

### P2: Nice-to-Have / Future Enhancements
1. **Custom Domain:** Provision a custom domain (e.g., `logos.unoflow.dev`) for the worker API endpoint.
2. **Automated Testing:** Add a lightweight build/import verification script (`npm test`) to prevent regressions in distribution bundles.

---

## 9. What Should Explicitly NOT Be Changed

1. **Keep Framework-Agnostic Core:** Do NOT add dependencies on React, Vue, Svelte, or external libraries.
2. **Keep Zero-Dependency Footprint:** Do NOT add heavy server-side caching or filesystem adapters for Node.js.
3. **Preserve Synchronous Lookup Design:** Do NOT force `Logos.get()` to return a Promise; preserve fast synchronous map lookup once hydrated.
4. **Maintain Minimal File Architecture:** Keep the entire runtime logic consolidated in `src/index.js` (~200 lines).

---

## 10. Proposed Implementation Sequence (Post-Approval)

1. **Step 1:** Modify `src/index.js` and `scripts/build.js` to fix CJS exports and module scope.
2. **Step 2:** Refactor `boot()`, `hasPending()`, and hydration logic in `src/index.js`.
3. **Step 3:** Update `Logos.get()`, `Logos.apply()`, and `Logos.config()` behavior.
4. **Step 4:** Update `package.json` (`exports`, `keywords`, descriptions) and `index.d.ts`.
5. **Step 5:** Revise `README.md` with accurate code examples and API tables.
6. **Step 6:** Run build script (`npm run build`), verify distributions in Node (CJS & ESM) and browser preview, and verify pre-commit steps.
