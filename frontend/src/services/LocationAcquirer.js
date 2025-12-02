/**
 * LocationAcquirer Service
 * Handles user consent and geolocation retrieval.
 */

const CONSENT_KEY = 'tairis_location_consent';

export const LocationAcquirer = {
  /**
   * Check if user has already granted consent.
   * @returns {boolean}
   */
  hasConsent() {
    return localStorage.getItem(CONSENT_KEY) === 'true';
  },

  /**
   * Save user consent.
   * @param {boolean} granted 
   */
  setConsent(granted) {
    if (granted) {
      localStorage.setItem(CONSENT_KEY, 'true');
    } else {
      localStorage.removeItem(CONSENT_KEY);
    }
  },

  /**
   * Get current user position.
   * @returns {Promise<{lat: number, lon: number}>}
   */
  async getCoordinates() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          let message = "Unknown error getting location.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = "User denied the request for Geolocation.";
              break;
            case error.POSITION_UNAVAILABLE:
              message = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              message = "The request to get user location timed out.";
              break;
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }
};
