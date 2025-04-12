type HealthData = {
    age: number;
    weight: number; // in kg
    height: number; // in cm
    gender: 'male' | 'female';
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
    dietaryRestrictions?: string[];
    goal: 'maintain' | 'lose_weight' | 'gain_weight';
  };
  
  type Recommendation = {
    calories: number;
    protein: number; // in grams
    fats: number;    // in grams
    carbs: number;   // in grams
  };
  
  export function UserProfileSetup(healthData: HealthData): Recommendation {
    const { age, weight, height, gender, activityLevel, goal } = healthData;
  
    // BMR calculation (Mifflin-St Jeor Equation)
    const bmr =
      gender === 'male'
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
  
    // Activity level multipliers
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
    };
  
    const tdee = bmr * (activityMultipliers[activityLevel] || 1.55);
  
    // Adjust calories based on goal
    let calories = tdee;
    if (goal === 'lose_weight') calories -= 500;
    if (goal === 'gain_weight') calories += 500;
  
    // Macronutrient breakdown
    const protein = Math.round((calories * 0.3) / 4); // 30% of calories
    const fats = Math.round((calories * 0.25) / 9);   // 25% of calories
    const carbs = Math.round((calories * 0.45) / 4);  // 45% of calories
  
    return {
      calories: Math.round(calories),
      protein,
      fats,
      carbs,
    };
  }
  