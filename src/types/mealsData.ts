type Meal = {
  name: string
  calories: number
  nutrients?: {
    protein: number
    carbs: number
    fats: number
  }
}

type MealsJson = {
  breakfast: Meal[]
  lunch: Meal[]
  dinner: Meal[]
  snacks: Meal[]
}

type FullMealPlan = {
  userId: number
  planType: string
  mealsPerDay: number
} & MealsJson

interface MealOption {
    id: string;
    name: string;
    description: string;
    nutritionInfo: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  }
  
  interface MealPlan {
    userId: string;
    planType: "regular" | "vegetarian" | "vegan" | "keto" | "paleo";
    mealsPerDay: number;
    breakfast: MealOption[];
    lunch: MealOption[];
    dinner: MealOption[];
    snacks: MealOption[];
  }