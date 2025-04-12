// inferenceEngine.ts
import { useHealthStore } from "../../store/useHealthStore";
import { UserProfileSetup } from "./modules/UserProfileSetup";


// Core inference function
export function generateReply(input: string) {
  const { healthData } = useHealthStore.getState();
  const lowerInput = input.toLowerCase();
  const height = healthData.height
  const weight = healthData.weight
  const age = healthData.age
  const goal = healthData.goal
  const activityLevel = healthData.activityLevel



  if (!healthData) {
    return "I need more information about your health to provide accurate guidance. Please complete your health profile.";
  }else{

  //test
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


  //"• User Profile Setup 
    // user inputs
  if(age && height && weight && goal && activityLevel && lowerInput.includes("user profile setup")){
    return UserProfileSetup(healthData)
  }



  return (
    "I'm here to help with your nutrition questions. What Scenario are you choosing :\n\n" +
    "• User Profile Setup \n" +
    "• Personalized Meal Plan Recommendation\n" +
    "• Meal Evaluation (Food Suitability Check)\n" +
    "• Nutritional Information Lookup\n" +
    "• Diet Compatibility Check\n" +
    "• Meal Substitutions\n" +
    "• Recipe Suggestions\n" 

  )};
}
