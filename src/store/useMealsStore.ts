import { create } from 'zustand'

type Meal = {
  id: string
  name: string
  description: string
  nutritionInfo: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

type MealsJson = {
  breakfast: Meal[]
  lunch: Meal[]
  dinner: Meal[]
  snacks: Meal[]
}

type FullMealPlan = {
  id: number
  userId: number
  planType: string
  mealsPerDay: number
} & MealsJson

type MealsStore = {
  mealPlan: FullMealPlan | null
  setMealPlan: (mealPlan: FullMealPlan) => void
  updateMeal: (mealType: keyof MealsJson, mealIndex: number, updatedMeal: Meal) => void
  addMeal: (mealType: keyof MealsJson, newMeal: Meal) => void
  removeMeal: (mealType: keyof MealsJson, mealIndex: number) => void
  clearPlan: () => void
}

export const useMealsStore = create<MealsStore>((set) => ({
  mealPlan: null,

  setMealPlan: (mealPlan) => set({ mealPlan }),

  updateMeal: (mealType, mealIndex, updatedMeal) =>
    set((state) => {
      if (!state.mealPlan) return state
      const updated = [...state.mealPlan[mealType]]
      updated[mealIndex] = updatedMeal
      return {
        mealPlan: {
          ...state.mealPlan,
          [mealType]: updated,
        },
      }
    }),

  addMeal: (mealType, newMeal) =>
    set((state) => {
      if (!state.mealPlan) return state
      return {
        mealPlan: {
          ...state.mealPlan,
          [mealType]: [...state.mealPlan[mealType], newMeal],
        },
      }
    }),

  removeMeal: (mealType, mealIndex) =>
    set((state) => {
      if (!state.mealPlan) return state
      const updated = [...state.mealPlan[mealType]]
      updated.splice(mealIndex, 1)
      return {
        mealPlan: {
          ...state.mealPlan,
          [mealType]: updated,
        },
      }
    }),

  clearPlan: () => set({ mealPlan: null }),
}))
