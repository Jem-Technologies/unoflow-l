/* unobits-logos — ES Module */
/**
 * unoflow-l - Client-side brand & app logo resolver & runtime browser cache
 */
(function (global) {
  'use strict';

  var GENERIC = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%236ee7ff"/><stop offset="1" stop-color="%23a78bfa"/></linearGradient></defs><circle cx="64" cy="64" r="56" fill="url(%23g)" opacity="0.18"/><circle cx="64" cy="64" r="54" fill="none" stroke="url(%23g)" stroke-width="4"/><rect x="40" y="40" width="48" height="48" rx="12" fill="url(%23g)" opacity="0.22"/><path d="M46 64h36" stroke="url(%23g)" stroke-width="6" stroke-linecap="round"/><path d="M64 46v36" stroke="url(%23g)" stroke-width="6" stroke-linecap="round"/></svg>';
  var TTL_MS = 24 * 60 * 60 * 1000;
  var DB_NAME = 'unoflow-logos';
  var STORE = 'kv';
  var CACHE_KEY = 'manifest';

  var BASE_URL = 'https://unobits-logos-worker.flat-dust-248f.workers.dev'; // Dedicated Cloudflare Worker API delivery service
  var MEM = new Map();
  var SOURCE = 'favicon';
  var loadedTs = 0;

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
    var manifestUrl = resolveUrl('/api/logos/manifest');
    return fetch(manifestUrl)
      .then(function (res) {
        if (!res.ok) throw new Error('manifest status ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.ok) throw new Error('manifest payload error');
        var before = countImages();
        var record = { items: data.items || {}, source: data.source || 'favicon', ts: Date.now() };
        hydrateFromManifest(record);
        idbPut(CACHE_KEY, record);
        if (countImages() !== before) {
          try {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('logos:updated', { detail: { images: countImages() } }));
            }
          } catch (e) {}
        }
        return record;
      });
  }

  function boot() {
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
    if (!imgEl) return;
    var fallback = (opts && opts.fallback) || GENERIC;
    imgEl.onerror = function () {
      imgEl.onerror = null;
      imgEl.src = fallback;
    };
    imgEl.src = get(key, opts);
  }

  var readyPromise = null;

  function init(cfg) {
    if (cfg && cfg.baseUrl) setBaseUrl(cfg.baseUrl);
    if (cfg && cfg.ttlMs) TTL_MS = cfg.ttlMs;
    if (!readyPromise) {
      readyPromise = boot();
    }
    return readyPromise;
  }

  readyPromise = boot();

  var Logos = {
    init: init,
    config: function (cfg) {
      if (cfg && cfg.baseUrl) setBaseUrl(cfg.baseUrl);
      if (cfg && cfg.ttlMs) TTL_MS = cfg.ttlMs;
      return { baseUrl: BASE_URL, ttlMs: TTL_MS };
    },
    ready: readyPromise,
    get: get,
    has: has,
    hasImage: hasImage,
    apply: apply,
    source: function () { return SOURCE; },
    refresh: function (force) {
      if (force) return fetchManifest();
      if (Date.now() - loadedTs >= TTL_MS) return fetchManifest();
      return Promise.resolve(null);
    },
    GENERIC: GENERIC
  };

  global.Logos = Logos;
  if (typeof global !== 'undefined') {
    global.Logos = Logos;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);

export default Logos;
