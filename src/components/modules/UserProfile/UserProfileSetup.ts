export function UserProfileSetup(healthData: HealthData): string {
  const { age, weight, height, gender, activityLevel, goal } = healthData;

  // Validate input values
  if (age <= 0 || weight <= 0 || height <= 0) {
    return "Invalid input data. Please check your profile details.";
  }

  // BMR calculation (Mifflin-St Jeor Equation)
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  // Activity level multipliers
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };

  // Fallback to moderate activity if no match is found
  const activityMultiplier = activityMultipliers[activityLevel] || 1.55;

  const tdee = bmr * activityMultiplier;

  // Adjust calories based on goal
  let calories = tdee;
  switch (goal) {
    case "lose_weight":
      calories -= 500;
      break;
    case "gain_weight":
      calories += 500;
      break;
    case "maintain":
    default:
      // No adjustment for maintenance
      break;
  }

  // Macronutrient breakdown (standard percentages)
  const proteinPercentage = 0.3;
  const fatsPercentage = 0.25;
  const carbsPercentage = 0.45;

  const protein = Math.round((calories * proteinPercentage) / 4); // 30% of calories
  const fats = Math.round((calories * fatsPercentage) / 9); // 25% of calories
  const carbs = Math.round((calories * carbsPercentage) / 4); // 45% of calories

  // Build a more personalized summary
  return `
    Profile Summary:
    
    🏋️‍♂️ Activity Level: ${activityLevel}
    🎯 Goal: ${goal}
    
    Recommended Daily Intake:
    🔥 Calories: ${calories} kcal/day
    🍗 Protein: ${protein} g
    🥦 Carbs: ${carbs} g
    🥑 Fats: ${fats} g
    
    ${goal === "lose_weight" ? "⚠️ A slight calorie deficit has been applied for weight loss." : ""}
    ${goal === "gain_weight" ? "⚠️ A calorie surplus is recommended to support weight gain." : ""}
    📈 You can adjust your profile anytime to update your recommendations.
  `;
}
