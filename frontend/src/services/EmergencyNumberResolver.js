/**
 * EmergencyNumberResolver
 * Resolves emergency numbers based on country code or fallback logic.
 */

const EMERGENCY_NUMBERS = {
  'US': ['911'],
  'UK': ['999', '112'],
  'EU': ['112'],
  'IN': ['112', '102', '108'], // India
  // Add more as needed
};

export const EmergencyNumberResolver = {
  /**
   * Get emergency numbers for a given country code.
   * @param {string} countryCode - ISO 3166-1 alpha-2 code (e.g., 'US', 'IN')
   * @returns {Array<string>}
   */
  getNumbers(countryCode) {
    if (countryCode && EMERGENCY_NUMBERS[countryCode]) {
      return EMERGENCY_NUMBERS[countryCode];
    }
    // Fallback for EU region if code is not specific but in EU (simplified)
    if (['DE', 'FR', 'ES', 'IT', 'NL'].includes(countryCode)) {
      return ['112'];
    }
    
    // Universal fallback
    return ['112', '911'];
  },

  /**
   * Attempt to resolve country from coordinates (using Nominatim reverse geocoding if needed in future).
   * For now, returns default fallback or accepts manual code.
   */
  async resolveFromCoords(lat, lon) {
    // Placeholder for reverse geocoding logic if needed
    // For MVP, we might rely on browser locale or default to universal
    return this.getNumbers(null);
  }
};
