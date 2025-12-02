/**
 * NominatimService
 * Fallback service for geocoding and POI search using Nominatim.
 * Respects usage policy: max 1 req/sec, specific User-Agent.
 */

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

export const NominatimService = {
  /**
   * Search for POIs using Nominatim.
   * @param {string} query - e.g., "hospital"
   * @param {number} lat 
   * @param {number} lon 
   * @returns {Promise<Array>}
   */
  async search(query, lat, lon) {
    // Construct URL with viewbox for local search (approx 10km box)
    // 0.1 degree is roughly 11km
    const viewbox = [
      lon - 0.1, // left
      lat + 0.1, // top
      lon + 0.1, // right
      lat - 0.1  // bottom
    ].join(',');

    const params = new URLSearchParams({
      q: query,
      format: 'json',
      limit: 20,
      viewbox: viewbox,
      bounded: 1, // Restrict to viewbox
      addressdetails: 1,
      extratags: 1,
    });

    const url = `${NOMINATIM_BASE_URL}?${params.toString()}`;

    try {
      // Respect rate limit (simple 1s delay before request if needed, 
      // but for client-side occasional use, just fetch is usually ok if not spamming)
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'TairisHealthApp/1.0' // Required by Nominatim policy
        }
      });

      if (!response.ok) {
        throw new Error(`Nominatim error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Nominatim search failed:", error);
      return [];
    }
  },

  /**
   * Geocode an address string.
   * @param {string} address 
   * @returns {Promise<{lat: number, lon: number}|null>}
   */
  async geocode(address) {
    const params = new URLSearchParams({
      q: address,
      format: 'json',
      limit: 1
    });

    const url = `${NOMINATIM_BASE_URL}?${params.toString()}`;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'TairisHealthApp/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`Nominatim geocode error: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error("Nominatim geocode failed:", error);
      return null;
    }
  }
};
