/**
 * RedFlagDetector
 * Rule-based detection of life-threatening symptoms.
 */

const RED_FLAG_KEYWORDS = [
  "unconscious",
  "not breathing",
  "difficulty breathing",
  "heavy bleeding",
  "chest pain",
  "stroke",
  "poison",
  "heart attack",
  "severe burn",
  "anaphylaxis",
  "choking",
  "seizure"
];

export const RedFlagDetector = {
  /**
   * Check text for red flag keywords.
   * @param {string} text 
   * @returns {boolean}
   */
  detect(text) {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return RED_FLAG_KEYWORDS.some(keyword => lowerText.includes(keyword));
  },

  /**
   * Get the detected red flag keyword (for logging/reasoning).
   * @param {string} text 
   * @returns {string|null}
   */
  getDetectedKeyword(text) {
    if (!text) return null;
    const lowerText = text.toLowerCase();
    return RED_FLAG_KEYWORDS.find(keyword => lowerText.includes(keyword)) || null;
  }
};
