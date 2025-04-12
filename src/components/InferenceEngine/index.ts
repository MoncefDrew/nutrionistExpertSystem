// inferenceEngine.ts
import { useHealthStore } from "../../store/useHealthStore";

// Optionally re-use Health type
export interface HealthDetails {
  conditions?: string[]; // If you want to simulate conditions like "diabetes"
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;
  goal?: string;
  activityLevel?: string;
  allergies?: string[];
  dietaryRestrictions?: string[];
}

// Core inference function
export function generateReply(input: string): string {
  const { healthData } = useHealthStore.getState();
  const lowerInput = input.toLowerCase();

  if (!healthData) {
    return "I need more information about your health to provide accurate guidance. Please complete your health profile.";
  }

  if (lowerInput.includes("diet")) {
    // Simulated condition: check for diabetes in dietaryRestrictions
    const isDiabetic = healthData.dietaryRestrictions?.includes("diabetes");
    console.log(healthData.dietaryRestrictions)
    if (isDiabetic) {
      return (
        "Since you have diabetes, I recommend focusing on a balanced diet with:\n\n" +
        "• Low glycemic index foods\n" +
        "• Plenty of non-starchy vegetables\n" +
        "• Lean proteins\n\n" +
        "Would you like me to suggest a sample meal plan?"
      );
    }

    return (
      "Let's talk about your diet goals! Are you looking to:\n\n" +
      "• Lose weight\n" +
      "• Gain muscle\n" +
      "• Maintain current health\n" +
      "• Address specific concerns?"
    );
  }

  return (
    "I'm here to help with your nutrition questions. You can ask me about:\n\n" +
    "• Meal planning\n" +
    "• Dietary restrictions\n" +
    "• Supplement advice\n" +
    "• Managing health conditions through diet"
  );
}
