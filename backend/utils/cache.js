const NodeCache = require('node-cache');

/**
 * Practical 9: In-Memory Caching with node-cache
 * Standard TTL: 60 seconds (as required by practical)
 * checkperiod: 120 seconds for automatic expired key cleanup
 */
const cache = new NodeCache({
  stdTTL: 60,
  checkperiod: 120,
  useClones: false,
});

// Cache statistics tracker for lab measurements & debug endpoint
let cacheStats = {
  hits: 0,
  misses: 0,
  invalidations: 0,
  lastInvalidatedAt: null,
  history: [],
};

const recordHit = (key) => {
  cacheStats.hits += 1;
  cacheStats.history.unshift({
    type: 'HIT',
    key,
    timestamp: new Date().toISOString(),
  });
  if (cacheStats.history.length > 50) cacheStats.history.pop();
};

const recordMiss = (key) => {
  cacheStats.misses += 1;
  cacheStats.history.unshift({
    type: 'MISS',
    key,
    timestamp: new Date().toISOString(),
  });
  if (cacheStats.history.length > 50) cacheStats.history.pop();
};

const recordInvalidation = (keys) => {
  cacheStats.invalidations += 1;
  cacheStats.lastInvalidatedAt = new Date().toISOString();
  cacheStats.history.unshift({
    type: 'INVALIDATION',
    keys: Array.isArray(keys) ? keys : [keys],
    timestamp: cacheStats.lastInvalidatedAt,
  });
  if (cacheStats.history.length > 50) cacheStats.history.pop();
};

const getCacheStats = () => {
  const total = cacheStats.hits + cacheStats.misses;
  const hitRatio = total > 0 ? ((cacheStats.hits / total) * 100).toFixed(1) + '%' : '0.0%';
  const keys = cache.keys();

  return {
    hits: cacheStats.hits,
    misses: cacheStats.misses,
    totalRequests: total,
    hitRatio,
    activeKeys: keys,
    keyCount: keys.length,
    invalidations: cacheStats.invalidations,
    lastInvalidatedAt: cacheStats.lastInvalidatedAt,
    ttlSeconds: 60,
    recentEvents: cacheStats.history.slice(0, 10),
  };
};

const clearCache = () => {
  cache.flushAll();
  cacheStats.invalidations += 1;
  cacheStats.lastInvalidatedAt = new Date().toISOString();
};

module.exports = {
  cache,
  recordHit,
  recordMiss,
  recordInvalidation,
  getCacheStats,
  clearCache,
};

