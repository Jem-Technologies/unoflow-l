/**
 * unoflow-l - Client-side brand & app logo resolver & runtime browser cache
 */
var Logos = (function (global) {
  'use strict';

  var GENERIC = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%236ee7ff"/><stop offset="1" stop-color="%23a78bfa"/></linearGradient></defs><circle cx="64" cy="64" r="56" fill="url(%23g)" opacity="0.18"/><circle cx="64" cy="64" r="54" fill="none" stroke="url(%23g)" stroke-width="4"/><rect x="40" y="40" width="48" height="48" rx="12" fill="url(%23g)" opacity="0.22"/><path d="M46 64h36" stroke="url(%23g)" stroke-width="6" stroke-linecap="round"/><path d="M64 46v36" stroke="url(%23g)" stroke-width="6" stroke-linecap="round"/></svg>';
  var TTL_MS = 24 * 60 * 60 * 1000;
  var DB_NAME = 'unoflow-logos';
  var STORE = 'kv';
  var CACHE_KEY = 'manifest';

  var BASE_URL = 'https://unobits-logos-worker.flat-dust-248f.workers.dev';
  var MEM = new Map();
  var SOURCE = 'favicon';
  var loadedTs = 0;
  var activeFetchPromise = null;
  var requestToken = 0;

  function isBrowser() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  function setBaseUrl(url) {
    if (url && typeof url === 'string') {
      BASE_URL = url.replace(/\/+$/, '');
    }
  }

  function resolveUrl(path) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    return BASE_URL ? (BASE_URL + path) : path;
  }

  function idbOpen() {
    return new Promise(function (resolve, reject) {
      try {
        if (typeof indexedDB === 'undefined') return reject(new Error('no indexedDB'));
        var req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = function () {
          var db = req.result;
          if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
        };
        req.onsuccess = function () { resolve(req.result); };
        req.onerror = function () { reject(req.error); };
      } catch (e) { reject(e); }
    });
  }

  function idbGet(key) {
    return idbOpen().then(function (db) {
      return new Promise(function (resolve) {
        try {
          var tx = db.transaction(STORE, 'readonly');
          var rq = tx.objectStore(STORE).get(key);
          rq.onsuccess = function () { resolve(rq.result || null); };
          rq.onerror = function () { resolve(null); };
        } catch (e) { resolve(null); }
      });
    }).catch(function () { return null; });
  }

  function idbPut(key, value) {
    return idbOpen().then(function (db) {
      return new Promise(function (resolve) {
        try {
          var tx = db.transaction(STORE, 'readwrite');
          tx.objectStore(STORE).put(value, key);
          tx.oncomplete = function () { resolve(true); };
          tx.onerror = function () { resolve(false); };
        } catch (e) { resolve(false); }
      });
    }).catch(function () { return false; });
  }

  function countImages() {
    var n = 0;
    MEM.forEach(function (v) { if (v && v.hasImage) n++; });
    return n;
  }

  /**
   * Manifest Validity & Completeness Check
   *
   * Note on `hasImage`: `hasImage: false` is a valid, permanent state for keys in
   * the manifest where a custom logo was not found, falling back to default icon/unavatar.
   * `hasPending` returns `true` ONLY if the cached record is missing, malformed, or empty.
   */
  function hasPending(record) {
    if (!record || !record.items) return true;
    return Object.keys(record.items).length === 0;
  }

  function hydrateFromManifest(data) {
    if (!data || !data.items) return;
    MEM.clear();
    SOURCE = data.source || 'favicon';
    Object.keys(data.items).forEach(function (k) {
      MEM.set(String(k), data.items[k]);
    });
    loadedTs = Number(data.ts) || Date.now();
  }

  function fetchManifest() {
    var token = ++requestToken;
    var manifestUrl = resolveUrl('/api/logos/manifest');

    if (typeof fetch === 'undefined') {
      return Promise.resolve(null);
    }

    activeFetchPromise = fetch(manifestUrl)
      .then(function (res) {
        if (!res.ok) throw new Error('manifest status ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (token !== requestToken) return null; // Stale request check
        if (!data || !data.ok) throw new Error('manifest payload error');
        var before = countImages();
        var record = { items: data.items || {}, source: data.source || 'favicon', ts: Date.now() };
        hydrateFromManifest(record);
        if (isBrowser()) {
          idbPut(CACHE_KEY, record);
          if (countImages() !== before) {
            try {
              window.dispatchEvent(new CustomEvent('logos:updated', { detail: { images: countImages() } }));
            } catch (e) {}
          }
        }
        return record;
      })
      .catch(function (err) {
        if (token !== requestToken) return null;
        return null;
      });

    return activeFetchPromise;
  }

  function boot() {
    if (!isBrowser()) {
      return Promise.resolve(null);
    }

    return idbGet(CACHE_KEY).then(function (cached) {
      if (cached && cached.items) hydrateFromManifest(cached);
      var fresh = cached && (Date.now() - (Number(cached.ts) || 0) < TTL_MS) && cached.items;
      if (!fresh || hasPending(cached)) {
        return fetchManifest().catch(function () { return cached || null; });
      }
      return cached;
    }).catch(function () {
      return fetchManifest().catch(function () { return null; });
    });
  }

  function get(key, opts) {
    var k = String(key || '').trim().toLowerCase();
    if (!k) return GENERIC;
    var variant = opts && opts.variant ? String(opts.variant).toLowerCase() : '';
    if (variant === 'favicon' || variant === 'unavatar') {
      return resolveUrl('/api/logos/' + encodeURIComponent(k) + '?variant=' + variant);
    }
    var item = MEM.get(k);
    if (item && item.url) return resolveUrl(item.url);
    return resolveUrl('/api/logos/' + encodeURIComponent(k));
  }

  function has(key) {
    return MEM.has(String(key || '').trim().toLowerCase());
  }

  function hasImage(key) {
    var item = MEM.get(String(key || '').trim().toLowerCase());
    return !!(item && item.hasImage);
  }

  function apply(imgEl, key, opts) {
    if (!imgEl || !isBrowser()) return;
    var fallback = (opts && opts.fallback) || GENERIC;
    imgEl.onerror = function () {
      imgEl.onerror = null;
      imgEl.src = fallback;
    };
    imgEl.src = get(key, opts);
  }

  var readyPromise = null;

  function init(cfg) {
    var oldBaseUrl = BASE_URL;
    if (cfg && cfg.baseUrl) setBaseUrl(cfg.baseUrl);
    if (cfg && cfg.ttlMs) TTL_MS = cfg.ttlMs;

    if (!readyPromise || (cfg && cfg.baseUrl && cfg.baseUrl !== oldBaseUrl)) {
      MEM.clear();
      readyPromise = isBrowser() ? boot() : Promise.resolve(null);
    }
    return readyPromise;
  }

  readyPromise = isBrowser() ? boot() : Promise.resolve(null);

  var LogosEngine = {
    init: init,
    config: function (cfg) {
      var oldBaseUrl = BASE_URL;
      if (cfg && cfg.baseUrl) setBaseUrl(cfg.baseUrl);
      if (cfg && cfg.ttlMs) TTL_MS = cfg.ttlMs;

      if (cfg && cfg.baseUrl && cfg.baseUrl !== oldBaseUrl) {
        MEM.clear();
        readyPromise = isBrowser() ? fetchManifest() : Promise.resolve(null);
      }
      return { baseUrl: BASE_URL, ttlMs: TTL_MS };
    },
    get ready() {
      return readyPromise;
    },
    get: get,
    has: has,
    hasImage: hasImage,
    apply: apply,
    source: function () { return SOURCE; },
    refresh: function (force) {
      if (force || Date.now() - loadedTs >= TTL_MS) {
        readyPromise = fetchManifest();
        return readyPromise;
      }
      return Promise.resolve(null);
    },
    GENERIC: GENERIC
  };

  if (typeof global !== 'undefined') {
    global.Logos = LogosEngine;
  }

  return LogosEngine;
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
