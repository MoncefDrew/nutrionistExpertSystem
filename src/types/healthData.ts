type HealthData = {
    age: number;
    weight: number; // in kg
    height: number; // in cm
    Allergies:string[],
    gender: "male" | "female";
    activityLevel: "sedentary" | "light" | "moderate" | "active";
    dietaryRestrictions?: string[];
    goal: "maintain" | "lose_weight" | "gain_weight";
  };