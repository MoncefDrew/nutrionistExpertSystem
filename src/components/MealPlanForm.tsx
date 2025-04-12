'use client';
import { useForm } from 'react-hook-form';
import { Coffee, UtensilsCrossed } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useState } from 'react';
import debounce from 'lodash/debounce';
import { useAuthStore } from '../store/useAuthStore';
import { useMealsStore } from '../store/useMealsStore';
import { MealSelection } from './MealSelection';

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
  planType: "" | 'regular' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' ;
  mealsPerDay: number;
  breakfast: MealOption[];
  lunch: MealOption[];
  dinner: MealOption[];
  snacks: MealOption[];
}

interface MealPlanFormProps {
  initialMealPlan: MealPlan;
}



export function MealPlanForm({ initialMealPlan }: MealPlanFormProps) {
  const { user } = useAuthStore();
  const { mealPlan, setMealPlan } = useMealsStore();

  const { register, handleSubmit, setValue, watch } = useForm<MealPlan>({
    defaultValues: {
      userId: user.id,
      planType: initialMealPlan.planType || "",
      mealsPerDay: initialMealPlan.mealsPerDay || 3,
      breakfast: initialMealPlan.breakfast || [],
      lunch: initialMealPlan.lunch || [],
      dinner: initialMealPlan.dinner || [],
      snacks: initialMealPlan.snacks || [],
    }
  });

  const [searchResults, setSearchResults] = useState<{
    [key: string]: MealOption[];
  }>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  });
  const [isSearching, setIsSearching] = useState<{
    [key: string]: boolean;
  }>({
    breakfast: false,
    lunch: false,
    dinner: false,
    snacks: false
  });

  // Debounced search function
  const searchMeals = debounce(async (query: string, mealType: string) => {
    if (!query) {
      setSearchResults(prev => ({ ...prev, [mealType]: [] }));
      return;
    }

    try {
      setIsSearching(prev => ({ ...prev, [mealType]: true }));
      
      // Call your meals API endpoint that integrates with FatSecret
      const response = await axios.get(`/api/client/mealsApi/search`, {
        params: {
          query,
          mealType,
          planType: watch('planType') // Include diet type in search
        }
      });

      setSearchResults(prev => ({
        ...prev,
        [mealType]: response.data.meals
      }));
    } catch (error) {
      toast.error('Failed to search meals');
    } finally {
      setIsSearching(prev => ({ ...prev, [mealType]: false }));
    }
  }, 300);

  const handleMealSelection = (meal: MealOption, mealType: keyof Pick<MealPlan, 'breakfast' | 'lunch' | 'dinner' | 'snacks'>) => {
    const currentMeals = watch(mealType) || [];
    setValue(mealType, [...currentMeals, meal]);
    setSearchResults(prev => ({ ...prev, [mealType]: [] }));
  };

  const removeMeal = (mealId: string, mealType: keyof Pick<MealPlan, 'breakfast' | 'lunch' | 'dinner' | 'snacks'>) => {
    const currentMeals = watch(mealType) || [];
    setValue(mealType, currentMeals.filter(meal => meal.id !== mealId));
  };

  const onSubmit = async (data: MealPlan) => {
    try {
      // Log the data being sent to the API
      console.log('Submitting meal plan data:', data);

      await axios.post('/api/client/mealsState', data);
      toast.success('Meal plan preferences saved successfully');
    } catch (error) {
      toast.error('Failed to save meal plan preferences');
      console.error(error);
    }
  };

  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-4 border border-zinc-800 max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Coffee className="w-5 h-5" />
            Meal Plan Preferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Plan Type</label>
              <select
                {...register('planType')}
                className="w-full p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 focus:border-blue-500 transition-colors text-gray-300"
              >
                <option value="regular">Regular</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Meals per Day</label>
              <select
                {...register('mealsPerDay')}
                className="w-full p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 focus:border-blue-500 transition-colors text-gray-300"
              >
                <option value="3">3 meals</option>
                <option value="4">4 meals</option>
                <option value="5">5 meals</option>
                <option value="6">6 meals</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5" />
            Meal Selections
          </h2>

          {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((mealType) => (
            <MealSelection
              key={mealType}
              mealType={mealType}
              searchMeals={searchMeals}
              searchResults={searchResults}
              handleMealSelection={handleMealSelection}
              removeMeal={removeMeal}
              watch={watch}
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
        >
          Save Meal Plan
        </button>
      </form>
    </div>
  );
}