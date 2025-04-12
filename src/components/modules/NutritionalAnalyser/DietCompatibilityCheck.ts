import axios from "axios";
import { parseNutrition } from "../MealsPlanner/MealEvaluation";

type HealthData = {
  age: number;
  weight: number;
  height: number;
  gender: "male" | "female";
};

export async function DietCompatibilityCheck(healthData: HealthData | null, input: string): Promise<string> {
  const lowered = input.toLowerCase();
  const keyword = extractFoodNameFromDietQuery(input);

  if (!keyword) return "I couldn't identify the food item. Can you rephrase your question?";
  if (!healthData) return "Please complete your health profile first so I can give accurate suggestions.";

  let dietType = "";
  if (lowered.includes("keto")) dietType = "keto";
  else if (lowered.includes("vegan")) dietType = "vegan";
  else if (lowered.includes("paleo")) dietType = "paleo";
  else if (lowered.includes("intermittent fasting")) dietType = "fasting";

  try {
    const res = await axios.get(`/api/client/mealsApi/search?query=${keyword}`);
    const food = res.data?.meals?.[0] || res.data?.[0];
    if (!food) return `I couldn't find data for "${keyword}".`;

    const { calories, carbs, fat, protein } = parseNutrition(food.description);

    // Basic BMR calculation (Mifflin-St Jeor)
    const BMR = Math.round(
      10 * healthData.weight +
      6.25 * healthData.height -
      5 * healthData.age +
      (healthData.gender === "male" ? 5 : -161)
    );

    const dailyMacros = {
      calories: BMR,
      fatLimit: 70, // default average limit
      carbLimit: 300, // average daily upper limit
      proteinMin: healthData.weight * 1.2 // rough estimate
    };

    const healthAdvice =
      calories > dailyMacros.calories * 0.25
        ? `⚠️ ${food.name} is relatively high in calories compared to your daily needs.`
        : `✅ The calorie content of ${food.name} is reasonable for your daily intake.`;

    const macroNote = `
- Calories: ${calories} kcal
- Carbs: ${carbs}g (Limit: ~${dailyMacros.carbLimit}g)
- Fat: ${fat}g (Limit: ~${dailyMacros.fatLimit}g)
- Protein: ${protein}g (Minimum: ~${Math.round(dailyMacros.proteinMin)}g)
    `;

    let dietFeedback = "";
    switch (dietType) {
      case "keto":
        dietFeedback = carbs > 10
          ? `❌ ${food.name} is **too high in carbs** for a keto diet.`
          : `✅ ${food.name} is **keto-friendly**.`;
        break;
      case "vegan":
        dietFeedback = /meat|cheese|milk|egg/i.test(food.name)
          ? `❌ ${food.name} may not be vegan. Look for plant-based alternatives.`
          : `✅ ${food.name} seems **vegan-friendly**.`;
        break;
      case "paleo":
        dietFeedback = carbs > 30 || /bread|rice|processed/i.test(food.name)
          ? `❌ ${food.name} isn't ideal for paleo — too processed or high-carb.`
          : `✅ ${food.name} aligns with the **paleo** philosophy.`;
        break;
      case "fasting":
        dietFeedback = `⏳ ${food.name} is okay to eat **during your eating window** while fasting.`;
        break;
      default:
        dietFeedback = `I wasn't sure which diet you're referring to.`;
    }

    return `${dietFeedback}\n\n${healthAdvice}\n\n📊 Nutritional Breakdown:\n${macroNote}`;
  } catch (err) {
    console.error("DietCompatibilityCheck error:", err);
    return "Couldn't analyze the food right now. Please try again later.";
  }
}

function extractFoodNameFromDietQuery(input: string): string | null {
  const lower = input.toLowerCase();
  const match = lower.match(
    /(?:is|are|can i eat|is it okay to eat|is this|does)\s(.+?)\s(?:keto|vegan|paleo|fasting|compatible|suitable|fit|friendly)?[\s\?\.]?$/
  );
  return match ? match[1].trim() : input.trim(); // fallback to full input
}
