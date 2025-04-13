export function PersonalizedMealPlan(healthData: HealthData, foodToEvaluate?: string): string {
  if (!healthData) return "Please complete your health profile to receive a meal plan.";

  const {
    goal,
    dietaryRestrictions = [],
    Allergies = [],
    age,
    weight,
    height,
    gender,
    activityLevel,
  } = healthData;

  const isMale = gender?.toLowerCase() === "male";
  const bmr = isMale
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    "lightly active": 1.375,
    "moderately active": 1.55,
    "very active": 1.725,
    "extra active": 1.9,
  };

  const activity = activityLevel?.toLowerCase() || "moderately active";
  const activityMultiplier = activityMultipliers[activity] ?? 1.55;
  const tdee = bmr * activityMultiplier;

  const normalizedGoal = goal?.toLowerCase() || "maintain";
  let calories = Math.round(tdee);

  if (normalizedGoal === "lose_weight") {
    calories = Math.round(tdee - 500);
  } else if (normalizedGoal === "gain muscle") {
    calories = Math.round(tdee + 300);
  } else if (normalizedGoal === "gain_weight") {
    calories = Math.round(tdee + 500);
  }

  const avoidIngredients = Allergies.map((a) => a.toLowerCase());
  const isVegan = dietaryRestrictions.includes("vegan");
  const isVegetarian = dietaryRestrictions.includes("vegetarian");
  const isKeto = dietaryRestrictions.includes("keto");
  const isGlutenFree = dietaryRestrictions.includes("gluten-free");

  // ✅ Step: Check if the food is safe
  if (foodToEvaluate) {
    const foodLower = foodToEvaluate.toLowerCase();
    const reasons: string[] = [];

    // Allergen check
    for (const allergen of avoidIngredients) {
      if (foodLower.includes(allergen)) {
        reasons.push(`⚠️ Contains allergen: ${allergen}`);
      }
    }

    // Dietary restriction checks
    if (isVegan && /meat|chicken|fish|egg|dairy/i.test(foodLower)) {
      reasons.push("❌ Not suitable for a vegan diet.");
    }

    if (isVegetarian && /meat|chicken|fish/i.test(foodLower)) {
      reasons.push("❌ Not suitable for a vegetarian diet.");
    }

    if (isKeto && /bread|rice|pasta|sugar|carbs|potato/i.test(foodLower)) {
      reasons.push("❌ Not suitable for a keto diet (too high in carbs).");
    }

    if (isGlutenFree && /bread|wheat|barley|rye|pasta/i.test(foodLower)) {
      reasons.push("❌ Not gluten-free.");
    }

    // Goal-based check (simplified logic)
    if (normalizedGoal === "lose weight" && /fried|sugar|dessert|fast food|cake|soda/i.test(foodLower)) {
      reasons.push("⚠️ High-calorie food not ideal for weight loss.");
    }

    if (normalizedGoal === "gain muscle" && /low protein|junk food|soda/i.test(foodLower)) {
      reasons.push("⚠️ Not protein-rich enough for muscle gain.");
    }

    if (reasons.length > 0) {
      return `🍽️ **Evaluation of "${foodToEvaluate}":**\n\n❌ It is **not recommended** for your current health profile for the following reason(s):\n- ${reasons.join("\n- ")}`;
    } else {
      return `✅ **"${foodToEvaluate}" appears safe** for your current profile and dietary goals! Just keep portion size in mind.`;
    }
  }

  // 👇 (Same code below for building the meal plan)
  const filterAllergens = (meal: string): string => {
    for (const allergen of avoidIngredients) {
      const regex = new RegExp(`\\b${allergen}\\b`, "i");
      if (regex.test(meal)) {
        return `${meal} (⚠️ *contains ${allergen}*)`;
      }
    }
    return meal;
  };

  let meals = {
    breakfast: "",
    lunch: "",
    dinner: "",
    snacks: "",
  };

  if (isVegan) {
    meals.breakfast = "Tofu scramble with spinach, mushrooms, and avocado toast on whole grain bread";
    meals.lunch = "Quinoa bowl with black beans, roasted veggies, and lemon tahini dressing";
    meals.dinner = "Vegan lentil stew with sweet potatoes and kale";
    meals.snacks = "Apple slices with almond butter and a handful of walnuts";
  } else if (isKeto) {
    meals.breakfast = "Scrambled eggs with spinach, avocado, and turkey bacon";
    meals.lunch = "Grilled chicken salad with olive oil dressing and cheese";
    meals.dinner = "Salmon fillet with broccoli and mashed cauliflower";
    meals.snacks = "Boiled eggs and macadamia nuts";
  } else if (isVegetarian) {
    meals.breakfast = "Greek yogurt parfait with berries and chia seeds";
    meals.lunch = "Grilled veggie sandwich with hummus on whole grain bread";
    meals.dinner = "Stir-fried tofu with vegetables and brown rice";
    meals.snacks = "Cottage cheese with sliced peaches";
  } else {
    meals.breakfast = "Oatmeal with banana, peanut butter, and a boiled egg";
    meals.lunch = "Grilled chicken wrap with avocado and mixed greens";
    meals.dinner = "Beef stir-fry with bell peppers and steamed jasmine rice";
    meals.snacks = "Protein shake and carrot sticks with hummus";
  }

  if (isGlutenFree) {
    meals.breakfast = meals.breakfast.replace(/(toast|bread)/gi, "gluten-free $1");
    meals.lunch = meals.lunch.replace(/(wrap|sandwich|bread)/gi, "gluten-free $1");
  }

  for (const key in meals) {
    const mealKey = key as keyof typeof meals;
    meals[mealKey] = filterAllergens(meals[mealKey]);
  }

  let response = `🥗 Here's your personalized meal plan based on a **${calories} kcal** target and your profile:\n\n`;

  response += `🍳 **Breakfast:** ${meals.breakfast}\n`;
  response += `🥪 **Lunch:** ${meals.lunch}\n`;
  response += `🍽️ **Dinner:** ${meals.dinner}\n`;
  response += `🥤 **Snacks:** ${meals.snacks}\n\n`;

  response += `📋 **Goal:** ${goal || "Maintain Weight"}\n`;
  response += `🧍 **Gender:** ${gender}\n`;
  response += `🎂 **Age:** ${age}\n`;
  response += `⚖️ **Weight:** ${weight} kg\n`;
  response += `📏 **Height:** ${height} cm\n`;

  if (dietaryRestrictions.length > 0) {
    response += `🚫 **Dietary Restrictions:** ${dietaryRestrictions.join(", ")}\n`;
  }

  if (Allergies.length > 0) {
    response += `⚠️ **Allergies to avoid:** ${Allergies.join(", ")}\n`;
  }

  if (activityLevel) {
    response += `🏃 **Activity Level:** ${activityLevel}\n`;
  }

  response += `\n✅ Make sure to hydrate and stay active throughout the day. Let me know if you want recipes, substitutions, or a grocery list!`;

  return response;
}
