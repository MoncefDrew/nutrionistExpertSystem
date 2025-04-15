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
  console.log(normalizedGoal)
  let calories = Math.round(tdee);

  if (normalizedGoal === "lose_weight") {
    calories = Math.round(tdee - 500);
  } else if (normalizedGoal === "gain_muscle") {
    calories = Math.round(tdee + 300);
  } else if (normalizedGoal === "gain_weight") {
    calories = Math.round(tdee + 500);
  }

  const avoidIngredients = Allergies.map((a) => a.toLowerCase());
  const isVegan = dietaryRestrictions.includes("vegan");
  const isVegetarian = dietaryRestrictions.includes("vegetarian");
  const isKeto = dietaryRestrictions.includes("keto");
  const isGlutenFree = dietaryRestrictions.includes("gluten-free");

  // Health scenarios
  const isDiabetic = dietaryRestrictions.includes("diabetes");


  const isAthlete = activityLevel.includes("moderate") || activityLevel.includes("very active");

  const hasHypertension = dietaryRestrictions.includes("hypertension");
  const isIronDeficient = dietaryRestrictions.includes("iron-deficiency");
  const isPregnant = dietaryRestrictions.includes("pregnant");
  const hasIBS = dietaryRestrictions.includes("IBS");
  const isCalorieRestricted = dietaryRestrictions.includes("calorie-restricted");

  // ✅ Step: Check if the food is safe
  if (foodToEvaluate) {
    const foodLower = foodToEvaluate.toLowerCase();
    const reasons: string[] = [];

    for (const allergen of avoidIngredients) {
      if (foodLower.includes(allergen)) {
        reasons.push(`⚠️ Contains allergen: ${allergen}`);
      }
    }

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

    if (normalizedGoal === "lose weight" && /fried|sugar|dessert|fast food|cake|soda/i.test(foodLower)) {
      reasons.push("⚠️ High-calorie food not ideal for weight loss.");
    }

    if (normalizedGoal === "gain muscle" && /low protein|junk food|soda/i.test(foodLower)) {
      reasons.push("⚠️ Not protein-rich enough for muscle gain.");
    }

    if (isDiabetic && /sugar|soda|cake|dessert|white bread|juice/i.test(foodLower)) {
      reasons.push("⚠️ Not suitable for diabetics (high glycemic index).");
    }

    if (hasHypertension && /salt|sodium|processed/i.test(foodLower)) {
      reasons.push("⚠️ High sodium content not ideal for hypertension.");
    }

    if (hasIBS && /onion|garlic|broccoli|beans|lactose/i.test(foodLower)) {
      reasons.push("⚠️ High-FODMAP ingredients may trigger IBS symptoms.");
    }

    if (reasons.length > 0) {
      return `🍽️ **Evaluation of "${foodToEvaluate}":**\n\n❌ It is **not recommended** for your current health profile for the following reason(s):\n- ${reasons.join("\n- ")}`;
    } else {
      return `✅ **"${foodToEvaluate}" appears safe** for your current profile and dietary goals! Just keep portion size in mind.`;
    }
  }

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

  // 🥗 Meal plan logic based on health scenario
  if (isDiabetic && age === 30 && normalizedGoal === "lose_weight") {
    meals.breakfast = "Oatmeal with cinnamon, chia seeds, and a boiled egg";
    meals.lunch = "Grilled chicken salad with olive oil vinaigrette";
    meals.dinner = "Steamed fish with quinoa and roasted vegetables";
    meals.snacks = "Carrot sticks with hummus";
  } else if (isAthlete && age === 25 && normalizedGoal === "gain_muscle") {
    meals.breakfast = "Protein smoothie with banana, peanut butter, and whey";
    meals.lunch = "Chicken breast with sweet potatoes and steamed broccoli";
    meals.dinner = "Grilled salmon with brown rice and avocado salad";
    meals.snacks = "Cottage cheese with almonds";
  } else if (hasHypertension && age === 60) {
    meals.breakfast = "Low-sodium oatmeal with blueberries and flaxseeds";
    meals.lunch = "Quinoa salad with cucumbers, tomatoes, and lemon dressing";
    meals.dinner = "Baked chicken breast with steamed greens and sweet potato";
    meals.snacks = "Unsalted nuts and apple slices";
  } else if (isVegan && isIronDeficient) {
    meals.breakfast = "Iron-fortified cereal with soy milk and a kiwi";
    meals.lunch = "Lentil salad with spinach, bell peppers, and quinoa";
    meals.dinner = "Chickpea and tofu curry with brown rice";
    meals.snacks = "Dried apricots and pumpkin seeds";
  } else if (isPregnant) {
    meals.breakfast = "Greek yogurt with berries and granola";
    meals.lunch = "Turkey sandwich on whole wheat with avocado and greens";
    meals.dinner = "Stir-fried tofu and vegetables with brown rice";
    meals.snacks = "Boiled egg and a banana";
  } else if (hasIBS) {
    meals.breakfast = "Lactose-free yogurt with strawberries and oats";
    meals.lunch = "Grilled chicken with low-FODMAP veggies and rice";
    meals.dinner = "Zucchini noodles with olive oil and grilled salmon";
    meals.snacks = "Rice cakes with almond butter";
  } else if (isCalorieRestricted || normalizedGoal === "lose_weight") {
    meals.breakfast = "Boiled egg with a slice of whole grain toast";
    meals.lunch = "Tuna salad with leafy greens and balsamic dressing";
    meals.dinner = "Grilled turkey breast with steamed veggies";
    meals.snacks = "Cucumber slices and a handful of almonds";
  } else {
    // Default meal plans
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
    response += `🚫 **Dietary Restrictions / Health Scenarios:** ${dietaryRestrictions.join(", ")}\n`;
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
