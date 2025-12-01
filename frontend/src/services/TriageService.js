/**
 * TriageService
 * Helper to construct the LLM prompt for emergency triage.
 */

export const TriageService = {
  /**
   * Construct the JSON prompt for the LLM.
   * @param {string} symptoms 
   * @param {string} vitals 
   * @param {Array} nearbyFacilities 
   * @returns {object} The prompt object
   */
  constructPrompt(symptoms, vitals, nearbyFacilities) {
    // Limit facilities to top 3 for emergency focus
    const topFacilities = nearbyFacilities.slice(0, 3).map((f, index) => ({
      index: index,
      name: f.name,
      type: f.type,
      distance_m: Math.round(f.distance_m),
      phone: f.phone,
      services: f.services || []
    }));

    return {
      role: "system",
      content: "You are Tairis, an emergency medical triage assistant. Your goal is SPEED and SAFETY.",
      instructions: [
        "Analyze the user's input for symptoms.",
        "Check for RED FLAGS: Unconscious, Not Breathing, Heavy Bleeding, Chest Pain, Stroke.",
        "If RED FLAG detected: Return intent 'IMMEDIATE_ACTION' with action 'CALL_EMERGENCY'.",
        "If no red flag: Determine triage level (ER, Clinic, Home).",
        "Select the best facility from the provided 'Context' list.",
        "Output STRICT JSON matching the defined schemas.",
        "NEVER invent phone numbers or facility details. Use ONLY the provided Context.",
        "Always include the disclaimer."
      ],
      context_format: `The user is near: ${JSON.stringify(topFacilities)}`,
      input_schema: {
        symptoms: symptoms,
        vitals: vitals || "Not provided"
      },
      output_schema: {
        intent: "TRIAGE_AND_RESOURCES | IMMEDIATE_ACTION",
        triage: {
          action: "CALL_AMBULANCE | GO_ER | VISIT_CLINIC | HOME_CARE",
          confidence: "low | medium | high",
          reason: "string"
        },
        recommended_facility_index: "number (index in context list, or -1)",
        disclaimer: "string"
      }
    };
  }
};
