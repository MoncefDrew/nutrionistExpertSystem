import axios from "axios";
import { parseNutrition } from "../MealsPlanner/MealEvaluation";

export async function NutritionalInformation(input: string): Promise<string> {
  const keyword = extractFoodNameFromNutritionQuery(input);
  if (!keyword) return "I couldn't identify the food item. Can you rephrase your question?";

  try {
    const res = await axios.get(`/api/client/mealsApi/search?query=${keyword}`);
    const food = res.data?.meals?.[0] || res.data?.[0];

    if (!food) {
      return `I couldn't find nutrition facts for "${keyword}". Try another food.`;
    }

    const { calories, protein, fat, carbs } = parseNutrition(food.description);

    return `🍽️ **Nutrition facts for ${food.name}:**
- Calories: ${calories} kcal  
- Protein: ${protein}g  
- Carbs: ${carbs}g  
- Fat: ${fat}g

This is based on a standard serving size. Need info on vitamins or serving size? Let me know!`;
  } catch (err) {
    console.error("NutritionalInformation error:", err);
    return "Something went wrong fetching the nutrition info. Please try again later.";
  }
}

function extractFoodNameFromNutritionQuery(input: string): string | null {
  const match = input.match(/(?:calories in|nutritional value of|nutrition facts of|macros of|fat content of|protein in|carbs in)\s(.+?)(\?|$)/i);
  return match ? match[1].trim() : input.trim();
}
