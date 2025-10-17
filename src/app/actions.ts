"use server";

import { findNearestPoliceStation } from "@/ai/flows/emergency-protocol-nearest-police";

export async function getPoliceStationSuggestion(truckLocation: string) {
  try {
    const result = await findNearestPoliceStation({
      truckLocation,
      unauthorizedDoorOpening: true,
    });
    return { success: true, suggestion: result.policeStationSuggestion };
  } catch (error) {
    console.error("Error in GenAI flow:", error);
    return {
      success: false,
      error: "Failed to get suggestion. Please try again.",
    };
  }
}
