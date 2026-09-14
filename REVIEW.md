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

### Key Weaknesses & Verified Production Risks
1. **Broken CommonJS / Node Export (P0 Bug — Verified):** The build output for `dist/logos.cjs.js` appends `module.exports = Logos;` outside the IIFE wrapper function where `Logos` was defined with `var`. Requiring `unoflow-l` in any CommonJS or Node environment throws an immediate `ReferenceError: Logos is not defined`.
2. **Fragile `hasPending()` Cache Invalidation (P0 Fragility Risk — Verified):** The `hasPending()` function returns `true` if any item in the manifest lacks a `hasImage: true` flag. While all 98 current live entries have `hasImage: true`, any future key added without a crawled image will permanently cause `boot()` to bypass the 24-hour IndexedDB TTL and trigger an HTTP fetch on **every single page load**.
3. **Pre-Hydration URL Handling (P0 Ergonomics — Verified):** Calling `Logos.get('google')` before `Logos.ready` completes returns a fallback endpoint URL (`/api/logos/google`). On the live Worker, this endpoint issues an HTTP `302 Found` redirect to an SVG asset (`generic.svg`). While it renders safely in `<img>` tags, documentation around `Logos.ready` needs clarification to guide developers on awaiting true brand asset resolution.
4. **Boot Timing Race in `Logos.config()` (P0 Timing Edge Case — Verified):** `readyPromise = boot()` executes immediately upon file evaluation. Calling `Logos.config({ baseUrl })` after importing the module does not redirect the initial `boot()` fetch because the fetch is already dispatched using the default URL.
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

#### Issue 2: `hasPending` Fragility
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
- **Impact:** If the hosted API returns items where any item has `hasImage: false`, `hasPending` permanently evaluates to `true`. On every page load, `boot()` ignores `fresh` TTL and re-executes `fetchManifest()`.

#### Issue 3: `Logos.get()` Pre-Hydration Endpoint Behavior
- **File:** `src/index.js` (Lines 123–133)
- **Behavior:**
  - If key is in `MEM`, returns item URL (e.g. `/api/logos/google?variant=favicon`).
  - If key is NOT in `MEM` (e.g. initial page load before `boot()` completes), returns `resolveUrl('/api/logos/' + encodeURIComponent(k))`.
  - The endpoint `https://unobits-logos-worker.flat-dust-248f.workers.dev/api/logos/google` returns HTTP 302 redirecting to `generic.svg`.

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
| **Browser (Script CDN / ESM)** | Working safely | Pre-hydration returns 302 endpoint redirect URL. | Clarify `Logos.ready` awaiting in documentation. |
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
2. **Fix `hasPending()` Fragility:** Correct manifest freshness checking so `boot()` respects the 24-hour IndexedDB TTL regardless of image crawling states.
3. **Fix Pre-Hydration Ergonomics:** Synchronize documentation and fallback behavior around `Logos.ready`.
4. **Fix Configuration Timing:** Allow `Logos.config()` or `Logos.init()` to re-configure `baseUrl` cleanly.

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

## 10. Validated Findings & Implementation Proposal

### A. Validated P0 Breakdown
1. **CommonJS Export:** Confirmed crash (`ReferenceError: Logos is not defined`) when running `require('unoflow-l')`. Fixed by embedding standard UMD/CJS module export inside the wrapper closure in `src/index.js`.
2. **`hasPending()` Cache Expiration:** Verified that `hasPending()` fails if any manifest entry has `hasImage: false`. Fixed by simplifying `hasPending()` to validate manifest existence and non-emptiness rather than item-level crawling flags.
3. **Initial `get()` / `apply()` Behavior:** Confirmed that pre-hydration URL `/api/logos/:key` returns an HTTP 302 redirecting to `generic.svg`. `Logos.get()` remains strictly synchronous.
4. **`Logos.config()` Race:** Confirmed `boot()` fires on module import. Fixed by allowing `config()` and `init()` to trigger re-hydration if `baseUrl` changes.

### B. Files & Functions to Modify
- `src/index.js`: IIFE wrapper / UMD export, `hasPending()`, `config()`, `init()`.
- `scripts/build.js`: Clean bundle generation for ESM, CJS, IIFE, minified script.
- `package.json`: Explicit `"exports"` mapping with `"types"`, `"import"`, `"require"`.
- `index.d.ts`: Synchronized engine interface declaration.

### C. Test & Verification Matrix

| Test Scenario | Verification Method | Expected Result |
| :--- | :--- | :--- |
| **CommonJS `require()`** | `node -e "const Logos = require('./dist/logos.cjs.js'); console.log(Logos.get('google'))"` | Returns resolved URL string without throwing `ReferenceError`. |
| **Node ESM `import`** | `node --input-type=module -e "import Logos from './dist/logos.esm.js'; console.log(Logos.get('stripe'))"` | Resolves cleanly without ESM/CJS parsing warnings. |
| **Browser Script / CDN** | Open test page using `dist/logos.min.js` | `window.Logos` attached globally; `Logos.get('github')` works. |
| **Pre-Hydration Lookup** | Call `Logos.get('google')` before `Logos.ready` resolves | Returns fallback worker URL; `<img src="...">` renders fallback SVG via 302. |
| **Hydrated Lookup** | Await `Logos.ready`, call `Logos.get('google')` | Returns cached CDN URL from manifest map. |
| **`apply()` Behavior** | Call `Logos.apply(imgEl, 'unknown-key')` | Sets image source and handles `onerror` fallback SVG gracefully. |
| **IndexedDB Unavailable** | Disable IndexedDB in test runner | Safely falls back to network fetch without crashing. |
| **TTL Caching** | Execute `boot()` twice within 24h with valid manifest | Second execution does not trigger HTTP network request. |
| **Custom `baseUrl`** | Call `Logos.config({ baseUrl: 'https://custom.api' })` | Subsequent `get()` and manifest fetches target custom base URL. |

---

## 11. Proposed Implementation Sequence (Post-Approval)

1. **Step 1:** Modify `src/index.js` and `scripts/build.js` to fix CJS exports and module scope.
2. **Step 2:** Refactor `boot()`, `hasPending()`, and hydration logic in `src/index.js`.
3. **Step 3:** Update `Logos.get()`, `Logos.apply()`, and `Logos.config()` behavior.
4. **Step 4:** Update `package.json` (`exports`, `keywords`, descriptions) and `index.d.ts`.
5. **Step 5:** Revise `README.md` with accurate code examples and API tables.
6. **Step 6:** Run build script (`npm run build`), verify distributions in Node (CJS & ESM) and browser preview, and verify pre-commit steps.
