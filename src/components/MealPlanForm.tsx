'use client';
import { useForm } from 'react-hook-form';
import { Coffee, UtensilsCrossed } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { useAuthStore } from '../store/useAuthStore';

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
  planType: 'regular' | 'vegetarian' | 'vegan' | 'keto' | 'paleo';
  mealsPerDay: number;
  breakfast: MealOption[];
  lunch: MealOption[];
  dinner: MealOption[];
  snacks: MealOption[];
  
}



const MealSelection = ({ mealType, searchMeals, searchResults, handleMealSelection, removeMeal, watch }) => (
  <div className="mb-6">
    <label className="text-sm font-medium text-zinc-300 capitalize">{mealType} Options</label>
    <div className="relative">
      <input
        type="text"
        onChange={(e) => searchMeals(e.target.value, mealType)}
        placeholder={`Search for ${mealType} options...`}
        className="w-full p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 focus:border-blue-500 transition-colors text-gray-300 placeholder-gray-500"
      />
      {searchResults[mealType]?.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-zinc-800 rounded-lg border border-zinc-700 max-h-60 overflow-auto">
          {searchResults[mealType].map((meal) => (
            <button
              key={meal.id}
              type="button"
              onClick={() => handleMealSelection(meal, mealType)}
              className="w-full p-3 text-left hover:bg-zinc-700 text-gray-300"
            >
              <div className="font-medium">{meal.name}</div>
              <div className="text-sm text-gray-400">
                {meal.nutritionInfo.calories} cal | P: {meal.nutritionInfo.protein}g | 
                C: {meal.nutritionInfo.carbs}g | F: {meal.nutritionInfo.fat}g
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
    <div className="mt-2 space-y-2">
      {watch(mealType).map((meal: MealOption) => (
        <div key={meal.id} className="flex items-center justify-between p-2 bg-zinc-800/50 rounded-lg">
          <span className="text-gray-300">{meal.name}</span>
          <button
            type="button"
            onClick={() => removeMeal(meal.id, mealType)}
            className="text-red-500 hover:text-red-400"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  </div>
);

export function MealPlanForm() {
  const { user } = useAuthStore();
  const { register, handleSubmit, setValue, watch } = useForm<MealPlan>({
    defaultValues: {
      userId: '',  // We'll update this after user check
      planType: 'regular',
      mealsPerDay: 3,
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
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

  // Add guard clause after hooks
  if (!user) {
    return <div>Loading...</div>; // or redirect to login
  }

  // Update form values when user is available
  useEffect(() => {
   
      setValue('userId', user.id);
    
  }, [user, setValue]);

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
    }
  };


  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-8 border border-zinc-800">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Coffee className="w-5 h-5" />
            Meal Plan Preferences
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              
            </div>
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
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
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
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
        >
          Save Meal Plan
        </button>
      </form>
    </div>
  );
} 