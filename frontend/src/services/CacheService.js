/**
 * CacheService
 * Handles caching of API responses to respect rate limits and improve performance.
 */

const CACHE_PREFIX = 'tairis_cache_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export const CacheService = {
  /**
   * Generate a cache key based on coordinates and radius.
   * Rounds coordinates to ~100m precision (3 decimal places) to increase hit rate.
   * @param {number} lat 
   * @param {number} lon 
   * @param {number} radius 
   * @param {string} type 
   * @returns {string}
   */
  generateKey(lat, lon, radius, type) {
    const rLat = lat.toFixed(3);
    const rLon = lon.toFixed(3);
    return `${CACHE_PREFIX}${type}_${rLat}_${rLon}_${radius}`;
  },

  /**
   * Get data from cache.
   * @param {string} key 
   * @returns {any|null}
   */
  get(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item = JSON.parse(itemStr);
      const now = new Date().getTime();

      if (now > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (e) {
      console.error("Error parsing cache item", e);
      return null;
    }
  },

  /**
   * Set data in cache.
   * @param {string} key 
   * @param {any} value 
   * @param {number} ttl 
   */
  set(key, value, ttl = DEFAULT_TTL) {
    const now = new Date().getTime();
    const item = {
      value: value,
      expiry: now + ttl,
    };
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
      console.error("Error setting cache item (quota exceeded?)", e);
      // Optional: Clear old cache items if quota exceeded
    }
  },
  
  /**
   * Clear all tairis cache items.
   */
  clear() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
};
