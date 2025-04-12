
export function PersonalizedMealPlan(healthData: HealthData): string {
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

  // Step 1: Determine Calorie Target Based on Goal
  const calorieTargetMap: Record<string, number> = {
    "lose weight": 1600,
    "maintain weight": 2000,
    "gain muscle": 2500,
    "gain weight": 2800,
  };

  const normalizedGoal = goal?.toLowerCase() || "maintain weight";
  const calories = calorieTargetMap[normalizedGoal] || 2000;

  // Step 2: Adjust meals based on restrictions
  const isVegan = dietaryRestrictions.includes("vegan");
  const isVegetarian = dietaryRestrictions.includes("vegetarian");
  const isKeto = dietaryRestrictions.includes("keto");
  const isGlutenFree = dietaryRestrictions.includes("gluten-free");

  const avoidIngredients = Allergies.map(a => a.toLowerCase());

  // Helper to filter allergen ingredients
  const filterAllergens = (meal: string): string => {
    for (const allergen of avoidIngredients) {
      if (meal.toLowerCase().includes(allergen)) {
        return `${meal} (⚠️ *contains ${allergen}*)`;
      }
    }
    return meal;
  };

  // Step 3: Build realistic meals
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
    // General meal plan
    meals.breakfast = "Oatmeal with banana, peanut butter, and a boiled egg";
    meals.lunch = "Grilled chicken wrap with avocado and mixed greens";
    meals.dinner = "Beef stir-fry with bell peppers and steamed jasmine rice";
    meals.snacks = "Protein shake and carrot sticks with hummus";
  }

  // Gluten-free adjustments (override bread-based meals)
  if (isGlutenFree) {
    if (meals.breakfast.includes("toast") || meals.breakfast.includes("bread")) {
      meals.breakfast = meals.breakfast.replace(/toast|bread/g, "gluten-free toast");
    }
    if (meals.lunch.includes("wrap") || meals.lunch.includes("sandwich")) {
      meals.lunch = meals.lunch.replace(/wrap|sandwich/g, "gluten-free wrap");
    }
  }

  // Step 4: Filter meals for allergies
  meals = {
    breakfast: filterAllergens(meals.breakfast),
    lunch: filterAllergens(meals.lunch),
    dinner: filterAllergens(meals.dinner),
    snacks: filterAllergens(meals.snacks),
  };

  // Step 5: Build response
  let response = `🥗 Here's your personalized meal plan based on a **${calories}-calorie target** and your profile:\n\n`;

  response += `🍳 **Breakfast:** ${meals.breakfast}\n`;
  response += `🥪 **Lunch:** ${meals.lunch}\n`;
  response += `🍽️ **Dinner:** ${meals.dinner}\n`;
  response += `🥤 **Snacks:** ${meals.snacks}\n\n`;

  response += `📋 **Goal:** ${goal || "Maintain Weight"}\n`;

  if (dietaryRestrictions.length > 0) {
    response += `🚫 **Dietary Restrictions:** ${dietaryRestrictions.join(", ")}\n`;
  }

  if (Allergies.length > 0) {
    response += `⚠️ **Allergies to avoid:** ${Allergies.join(", ")}\n`;
  }

  if (activityLevel) {
    response += `🏃 **Activity Level:** ${activityLevel}\n`;
  }

  response += `\n✅ Make sure to hydrate and stay active throughout the day. Let me know if you want recipes, meal substitutions, or a grocery list!`;

  return response;
}
