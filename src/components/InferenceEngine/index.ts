type Rule = {
  condition: (input: string, healthData: HealthData | null) => boolean;
  action: (input: string, healthData: HealthData | null) => string;
};

import { UserProfileSetup } from "../modules/UserProfile/UserProfileSetup";
import { PersonalizedMealPlan } from "../modules/MealsPlanner/PersonalizedMealPlan";
import { MealEvaluation } from "../modules/MealsPlanner/MealEvaluation";
import { RecipeSuggestions } from "../modules/MealsPlanner/RecipeSuggestions";
import { useHealthStore } from "../../store/useHealthStore";
import { NutritionalInformation } from "../modules/NutritionalAnalyser/NutritionalInformationLup";
import { DietCompatibilityCheck } from "../modules/NutritionalAnalyser/DietCompatibilityCheck";
import { MealSubstitutions } from "../modules/MealsPlanner/MealSubstitutions";
import { useMealsStore } from "../../store/useMealsStore";

// Add more as needed...

const rules: Rule[] = [
  // 1. User Profile Setup
  {
    condition: (input, healthData) =>
      (input.includes("user profile setup") ||
        input.includes("set up my profile") ||
        input.includes("setup profile") ||
        input.includes("start profile") ||
        input.includes("enter my info") ||
        input.includes("fill profile") ||
        input.includes("register my data")) &&
      healthData !== null &&
      !!healthData.age &&
      !!healthData.weight &&
      !!healthData.height,
    action: (_, healthData) => UserProfileSetup(healthData!),
  },

  // 2. Personalized Meal Plan Recommendation
  {
    condition: (input, healthData) =>
      (input.includes("meal plan") ||
        input.includes("recommend a diet") ||
        input.includes("diet plan") ||
        input.includes("plan my meals") ||
        input.includes("what should i eat")) &&
      healthData !== null,
    action: (_, healthData) => PersonalizedMealPlan(healthData!),
  },

  // 3. Meal Evaluation (Food Suitability Check)
  // Update action to async
{
  condition: (input) =>
    input.includes("can i eat") ||
    input.includes("is it okay to eat") ||
    input.includes("is this healthy") ||
    input.includes("should i eat") ||
    input.includes("is it safe to eat"),
    // @ts-ignore 
  action: async (input, healthData) => await MealEvaluation(healthData, input),
},


  // 4. Nutritional Information Lookup
  {
    condition: (input: string) => {
      const lowered = input.toLowerCase();
      return (
        lowered.includes("how many calories") ||
        lowered.includes("calories in") ||
        lowered.includes("nutritional value") ||
        lowered.includes("nutrition facts") ||
        lowered.includes("macros of") ||
        lowered.includes("fat content") ||
        lowered.includes("carbs in") ||
        lowered.includes("protein in") ||
        lowered.includes("what's in") ||
        lowered.startsWith("nutrition for") ||
        lowered.startsWith("tell me about") && lowered.includes("nutrition")
      );
    },
    //@ts-ignore
    action: (input: string) => NutritionalInformation(input),
  },
  

  // 5. Diet Compatibility Check
  {
    condition: (input: string) => {
      const lowered = input.toLowerCase();
      return (
        lowered.includes("keto") ||
        lowered.includes("vegan") ||
        lowered.includes("paleo") ||
        lowered.includes("intermittent fasting") ||
        lowered.includes("compatible with my diet") ||
        lowered.includes("fit my diet") ||
        lowered.includes("allowed on") ||
        lowered.includes("suitable for") ||
        lowered.includes("okay on a")
      );
    },
    //@ts-ignore
    action: (input: string, healthData: HealthData | null) =>
      DietCompatibilityCheck(healthData, input),
  }
,  

  // 6. Meal Substitutions
  {
    condition: (input) =>
      input.includes("don’t like") ||
      input.includes("i hate") ||
      input.includes("replace") ||
      input.includes("substitute") ||
      input.includes("swap out") ||
      input.includes("instead of"),
    action: (input, healthData) => MealSubstitutions(healthData, input),
  },

  // 7. Recipe Suggestions
  {
    condition: (input) =>
      input.includes("recipe") ||
      input.includes("suggest a meal") ||
      input.includes("what to cook") ||
      input.includes("cooking ideas") ||
      input.includes("meal ideas") ||
      input.includes("healthy recipe"),
      //@ts-ignore
    action: (input, healthData) => RecipeSuggestions( input, healthData.goal),
  },
];

export async function generateReply(input: string): Promise<string> {
  //@ts-ignore
  const { healthData } = useHealthStore.getState();
  const lowerInput = input.toLowerCase();

  for (const rule of rules) {
    if (rule.condition(lowerInput, healthData)) {
      return rule.action(lowerInput, healthData);
    }
  }

  return (
    "I'm here to help with your nutrition questions. What Scenario are you choosing:\n\n" +
    "• User Profile Setup\n" +
    "• Personalized Meal Plan Recommendation\n" +
    "• Meal Evaluation (Food Suitability Check)\n" +
    "• Nutritional Information Lookup\n" +
    "• Diet Compatibility Check\n" +
    "• Meal Substitutions\n" +
    "• Recipe Suggestions\n"
  );
}
