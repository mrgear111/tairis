/**
 * POINormalizer
 * Standardizes POI data from Overpass and Nominatim into a common format.
 */

export const POINormalizer = {
  /**
   * Calculate Haversine distance between two points in meters.
   * @param {number} lat1 
   * @param {number} lon1 
   * @param {number} lat2 
   * @param {number} lon2 
   * @returns {number} Distance in meters
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  },

  /**
   * Normalize Overpass element.
   * @param {object} element 
   * @param {number} userLat 
   * @param {number} userLon 
   * @returns {object}
   */
  normalizeOverpass(element, userLat, userLon) {
    const tags = element.tags || {};
    const lat = element.lat || element.center?.lat;
    const lon = element.lon || element.center?.lon;

    if (!lat || !lon) return null;

    return {
      id: `overpass-${element.id}`,
      name: tags.name || tags['name:en'] || 'Unknown Facility',
      type: tags.amenity || 'unknown',
      coords: { lat, lon },
      phone: tags.phone || tags['contact:phone'] || tags['emergency:phone'] || null,
      distance_m: this.calculateDistance(userLat, userLon, lat, lon),
      source: 'Overpass',
      services: this.extractServices(tags),
      rawTags: tags
    };
  },

  /**
   * Extract services from tags.
   * @param {object} tags 
   * @returns {Array<string>}
   */
  extractServices(tags) {
    const services = new Set();
    
    // Check healthcare:speciality
    if (tags['healthcare:speciality']) {
      tags['healthcare:speciality'].split(';').forEach(s => services.add(this.formatService(s)));
    }

    // Check service:* tags (e.g., service:emergency=yes)
    Object.keys(tags).forEach(key => {
      if (key.startsWith('service:') && tags[key] === 'yes') {
        services.add(this.formatService(key.replace('service:', '')));
      }
    });

    // Infer from amenity if no specific services
    if (services.size === 0 && tags.amenity === 'pharmacy') {
      services.add('Pharmacy');
    }

    return Array.from(services);
  },

  formatService(s) {
    return s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  },

  /**
   * Normalize Nominatim element.
   * @param {object} element 
   * @param {number} userLat 
   * @param {number} userLon 
   * @returns {object}
   */
  normalizeNominatim(element, userLat, userLon) {
    const lat = parseFloat(element.lat);
    const lon = parseFloat(element.lon);

    // Nominatim returns 'type' which is often the amenity (hospital, clinic, etc.)
    // 'display_name' is usually long, so we try to use 'name' from extratags or split display_name
    const name = element.extratags?.name || element.name || element.display_name.split(',')[0];
    const type = element.type || element.class || 'unknown'; // 'amenity' is mapped to 'class'/'type' often

    return {
      id: `nominatim-${element.place_id}`,
      name: name,
      type: type,
      coords: { lat, lon },
      phone: element.extratags?.phone || element.extratags?.['contact:phone'] || null,
      distance_m: this.calculateDistance(userLat, userLon, lat, lon),
      source: 'Nominatim',
      services: [], // Nominatim rarely has detailed service tags
      rawTags: element.extratags || {}
    };
  }
};
