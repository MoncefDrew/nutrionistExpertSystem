export function UserProfileSetup(healthData: HealthData): string {
  const { age, weight, height, gender, activityLevel, goal,dietaryRestrictions } = healthData;

  if (age <= 0 || weight <= 0 || height <= 0) {
    return "Invalid input data. Please check your profile details.";
  }

  // BMR (Mifflin-St Jeor)
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };

  const activityMultiplier = activityMultipliers[activityLevel] || 1.55;
  const tdee = bmr * activityMultiplier;

  // Goal-based adjustment
  let calories = tdee;
  switch (goal) {
    case "lose_weight":
      calories -= 500;
      break;
    case "gain_weight":
      calories += 500;
      break;
  }

  // 🔁 Health scenario-based calorie tweaks
  if (dietaryRestrictions.includes("pregnant")) {
    calories += 300; // Recommended increase for pregnancy
  }

  // Macronutrient distribution (defaults)
  let proteinPct = 0.3;
  let fatPct = 0.25;
  let carbPct = 0.45;

  // Adjust macros for dietary restrictions
  if (dietaryRestrictions.includes("diabetes")) {
    carbPct = 0.35; // Lower carb intake
    proteinPct = 0.35;
    fatPct = 0.3;
  }

  if (dietaryRestrictions.includes("vegan")) {
    proteinPct = 0.25;
    fatPct = 0.3;
    carbPct = 0.45;
  }

  if (dietaryRestrictions.includes("iron-deficiency")) {
    proteinPct += 0.05; // Encourage iron-rich protein sources
    fatPct -= 0.025;
    carbPct -= 0.025;
  }

  if (dietaryRestrictions.includes("ibs")) {
    fatPct -= 0.05;
    carbPct += 0.05;
  }

  // Normalize macros to ensure total = 1
  const totalPct = proteinPct + fatPct + carbPct;
  proteinPct /= totalPct;
  fatPct /= totalPct;
  carbPct /= totalPct;

  // Calculate macros (rounded)
  const protein = Math.round((calories * proteinPct) / 4);
  const fats = Math.round((calories * fatPct) / 9);
  const carbs = Math.round((calories * carbPct) / 4);

  return `
    Profile Summary:
    
    🏋️‍♂️ Activity Level: ${activityLevel}
    🎯 Goal: ${goal}
    🩺 Health Considerations: ${dietaryRestrictions.join(", ") || "None"}

    Recommended Daily Intake:
    🔥 Calories: ${Math.round(calories)} kcal/day
    🍗 Protein: ${protein} g
    🥦 Carbs: ${carbs} g
    🥑 Fats: ${fats} g

    ${goal === "lose_weight" ? "⚠️ A slight calorie deficit has been applied for weight loss." : ""}
    ${goal === "gain_weight" ? "⚠️ A calorie surplus is recommended to support weight gain." : ""}
    ${dietaryRestrictions.includes("pregnant") ? "👶 Extra calories have been added for pregnancy." : ""}
    📈 Adjust your profile to refine these values.
  `;
}
