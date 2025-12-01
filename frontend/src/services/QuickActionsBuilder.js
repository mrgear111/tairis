/**
 * QuickActionsBuilder
 * Generates action links for UI.
 */

export const QuickActionsBuilder = {
  buildCallAction(number, label = "Call Emergency") {
    return {
      label: label,
      type: "call",
      target: `tel:${number}`
    };
  },

  buildNavigateAction(lat, lon, label = "Navigate") {
    return {
      label: label,
      type: "navigate",
      target: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`
    };
  },

  buildShareAction(lat, lon, label = "Share Location") {
    // Simple map link for sharing
    return {
      label: label,
      type: "share",
      target: `https://maps.google.com/?q=${lat},${lon}`
    };
  }
};
