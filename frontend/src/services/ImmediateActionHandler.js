import { EmergencyNumberResolver } from './EmergencyNumberResolver';

/**
 * ImmediateActionHandler
 * Constructs the IMMEDIATE_ACTION JSON response for red-flag cases.
 */

export const ImmediateActionHandler = {
  /**
   * Create immediate action response.
   * @param {string} reason - The detected red flag keyword or reason.
   * @param {string} countryCode - Optional country code for number resolution.
   * @returns {object} JSON response matching schema.
   */
  handle(reason, countryCode = null) {
    const numbers = EmergencyNumberResolver.getNumbers(countryCode);
    const primaryNumber = numbers[0];

    return {
      intent: "IMMEDIATE_ACTION",
      action: "CALL_EMERGENCY",
      preferred_emergency_numbers: numbers,
      call_uri: `tel:${primaryNumber}`,
      confirm_before_call: true,
      message: `Critical symptoms detected (${reason}). Call emergency services immediately.`,
      timestamp_utc: new Date().toISOString(),
      meta: { 
        source: "system", 
        confidence: "high" 
      }
    };
  }
};
