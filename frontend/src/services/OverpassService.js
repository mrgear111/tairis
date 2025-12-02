/**
 * OverpassService
 * Primary service for fetching medical POIs using Overpass API.
 */

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

export const OverpassService = {
  /**
   * Fetch POIs from Overpass API.
   * @param {number} lat 
   * @param {number} lon 
   * @param {number} radius (in meters)
   * @returns {Promise<any>} JSON response from Overpass
   */
  async fetchPOIs(lat, lon, radius = 5000) {
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"~"hospital|clinic|pharmacy|doctors"](around:${radius}, ${lat}, ${lon});
        way["amenity"~"hospital|clinic|pharmacy|doctors"](around:${radius}, ${lat}, ${lon});
        relation["amenity"~"hospital|clinic|pharmacy|doctors"](around:${radius}, ${lat}, ${lon});
      );
      out center tags;
    `;

    try {
      const response = await fetch(OVERPASS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `data=${encodeURIComponent(query)}`
      });

      if (response.status === 429) {
        throw new Error("Overpass rate limit exceeded (429)");
      }

      if (!response.ok) {
        throw new Error(`Overpass API error: ${response.status}`);
      }

      const data = await response.json();
      return data.elements;
    } catch (error) {
      console.error("Overpass fetch failed:", error);
      throw error;
    }
  }
};
