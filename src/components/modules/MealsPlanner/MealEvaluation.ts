import axios from "axios";

type Meal = {
  id: string;
  name: string;
  description: string;
  nutritionInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

type HealthData = {
  age: number;
  weight: number; // in kg
  height: number; // in cm
  gender: "male" | "female";
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very active";
  goal?: "maintain" | "lose" | "gain";
};

export async function MealEvaluation(
  healthData: HealthData | null,
  input: string
): Promise<string> {
  if (!healthData) {
    return "Please complete your profile first so I can evaluate your diet properly.";
  }

  const keyword = extractFoodName(input);
  if (!keyword) {
    return "I couldn't identify the food item. Could you rephrase?";
  }

  try {
    const res = await axios.get(`/api/client/mealsApi/search?query=${keyword}`);
    const foods: Meal[] = res.data.meals || res.data;

    if (foods.length === 0) {
      return `I couldn't find any nutritional data for "${keyword}". Try another food.`;
    }

    const food = foods[0];
    const { calories, fat, carbs, protein } = parseNutrition(food.description);

    // --- Calculate user's BMR ---
    const BMR =
      10 * healthData.weight +
      6.25 * healthData.height -
      5 * healthData.age +
      (healthData.gender === "male" ? 5 : -161);

    // --- Adjust for activity ---
    const activityMultiplier = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      "very active": 1.9,
    };

    const activity = healthData.activityLevel || "moderate";
    let TDEE = BMR * activityMultiplier[activity];

    // --- Adjust for goal (weight loss/gain) ---
    switch (healthData.goal) {
      case "lose":
        TDEE -= 300; // approx deficit
        break;
      case "gain":
        TDEE += 300; // approx surplus
        break;
    }

    // --- Macro Distribution Goals (approx % of TDEE) ---
    const proteinTarget = (0.3 * TDEE) / 4; // 30% protein
    const carbTarget = (0.4 * TDEE) / 4; // 40% carbs
    const fatTarget = (0.3 * TDEE) / 9; // 30% fat

    // --- Analysis of this food ---
    const warnings: string[] = [];

    if (calories > TDEE * 0.25) {
      warnings.push("It contains a high amount of calories for one meal.");
    }

    if (fat > fatTarget * 0.3) {
      warnings.push("It's relatively high in fats.");
    }

    if (carbs > carbTarget * 0.4) {
      warnings.push("It's heavy on carbs.");
    }

    if (protein < proteinTarget * 0.1) {
      warnings.push("It’s low in protein compared to your needs.");
    }

    const suggestion = warnings.length > 0
      ? `⚠️ ${food.name} might not be ideal: ${warnings.join(" ")} Consider a healthier version or smaller portion.`
      : `✅ Yes, you can eat ${food.name}. It aligns well with your nutritional needs. Just ensure the rest of your meals today balance it out.`;

    // --- Optional: Add a detailed nutritional summary ---
    const nutritionSummary = `
        🍽️ *${food.name}*  
        Calories: ${calories} kcal  
        Protein: ${protein}g / Target: ${proteinTarget.toFixed(1)}g  
        Carbs: ${carbs}g / Target: ${carbTarget.toFixed(1)}g  
        Fat: ${fat}g / Target: ${fatTarget.toFixed(1)}g  
        Daily Calorie Goal: ${Math.round(TDEE)} kcal  
`;

    return `${nutritionSummary}\n${suggestion}`;
  } catch (error) {
    console.error("Meal Evaluation error:", error);
    return "Oops! I couldn't analyze that food right now. Please try again later.";
  }
}

export function extractFoodName(input: string): string | null {
  const lower = input.toLowerCase();
  const match = lower.match(
    /(?:can i eat|should i eat|is it okay to eat|is this healthy|is it safe to eat)\s(.+?)\??$/
  );
  return match ? match[1].trim() : input.trim();
}

export function parseNutrition(description: string) {
  const match = description.match(
    /Calories:\s*(\d+)kcal\s*\|\s*Fat:\s*([\d.]+)g\s*\|\s*Carbs:\s*([\d.]+)g\s*\|\s*Protein:\s*([\d.]+)g/
  );

  if (!match) {
    throw new Error("Failed to parse nutrition info");
  }

  return {
    calories: parseInt(match[1]),
    fat: parseFloat(match[2]),
    carbs: parseFloat(match[3]),
    protein: parseFloat(match[4]),
  };
}
