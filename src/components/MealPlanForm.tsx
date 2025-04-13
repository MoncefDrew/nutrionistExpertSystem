"use client";
import { useForm } from "react-hook-form";
import {
  Coffee,
  UtensilsCrossed,
  Search,
  PlusCircle,
  X,
  Trash2,
  Info,
  ChevronDown,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import debounce from "lodash/debounce";
import { useAuthStore } from "../store/useAuthStore";
import { useMealsStore } from "../store/useMealsStore";
import { PersonalizedMealPlan } from "./modules/MealsPlanner/PersonalizedMealPlan";
import { useHealthStore } from "../store/useHealthStore";

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealOption {
  id: string;
  name: string;
  description: string;
  nutritionInfo: NutritionInfo;
}

interface MealPlan {
  userId: number;

  planType:
    | "regular"
    | "diabetes"
    | "vegan"
    | "hypertension"
    | "iron-deficiency"
    | "pregnant"
    | "ibs";
  mealsPerDay: number;
  breakfast: MealOption[];
  lunch: MealOption[];
  dinner: MealOption[];
  snacks: MealOption[];
}

interface MealPlanFormProps {
  initialMealPlan: MealPlan;
  onComplete?: () => void;
}

export function MealPlanForm({
  initialMealPlan,
  onComplete,
}: MealPlanFormProps) {
  const { user } = useAuthStore();
  const { mealPlan, setMealPlan } = useMealsStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "breakfast" | "lunch" | "dinner" | "snacks"
  >("breakfast");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MealOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [totalNutrition, setTotalNutrition] = useState<NutritionInfo>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const { register, handleSubmit, setValue, watch, reset } = useForm<MealPlan>({
    defaultValues: {
      userId: user?.id,
      planType: initialMealPlan.planType || "regular",
      mealsPerDay: initialMealPlan.mealsPerDay || 3,
      breakfast: initialMealPlan.breakfast || [],
      lunch: initialMealPlan.lunch || [],
      dinner: initialMealPlan.dinner || [],
      snacks: initialMealPlan.snacks || [],
    },
  });

  // Calculate total nutrition whenever meal selections change
  useEffect(() => {
    const meals = [
      ...(watch("breakfast") || []),
      ...(watch("lunch") || []),
      ...(watch("dinner") || []),
      ...(watch("snacks") || []),
    ];

    const totals = meals.reduce(
      (acc, meal) => {
        if (meal.nutritionInfo) {
          acc.calories += meal.nutritionInfo.calories || 0;
          acc.protein += meal.nutritionInfo.protein || 0;
          acc.carbs += meal.nutritionInfo.carbs || 0;
          acc.fat += meal.nutritionInfo.fat || 0;
        }
        return acc;
      },
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      }
    );

    setTotalNutrition(totals);
  }, [watch("breakfast"), watch("lunch"), watch("dinner"), watch("snacks")]);

  // Debounced search function
  const searchMeals = debounce(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setIsSearching(true);

      // Call your meals API endpoint that integrates with FatSecret
      const response = await axios.get(`/api/client/mealsApi/search`, {
        params: {
          query,
          mealType: activeTab,
          planType: watch("planType"), // Include diet type in search
        },
      });

      setSuggestions(response.data.meals || []);
    } catch (error) {
      console.error("Failed to search meals:", error);
      toast.error("Failed to search meals");
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  useEffect(() => {
    if (searchQuery) {
      searchMeals(searchQuery);
    }
  }, [searchQuery, activeTab, watch("planType")]);

  const handleAddMeal = (meal: MealOption) => {
    const currentMeals = watch(activeTab) || [];
    setValue(activeTab, [...currentMeals, meal]);
    setSuggestions([]);
    setSearchQuery("");
  };

  const handleRemoveMeal = (mealId: string) => {
    const currentMeals = watch(activeTab) || [];
    setValue(
      activeTab,
      currentMeals.filter((meal) => meal.id !== mealId)
    );
  };

  {/* const generateMealPlan = async () => {
    try {
      setIsSubmitting(true);
      toast.loading("Generating your personalized meal plan...");

      const planType = watch("planType");
      const mealsPerDay = watch("mealsPerDay");

      const healthData = useHealthStore.getState(); // Get stored health info

      const generatedMeals = await PersonalizedMealPlan({
        planType,
        mealsPerDay,
        
      });

      // Distribute meals into breakfast, lunch, dinner, and snacks
      const mealsPerSlot = Math.floor(generatedMeals.length / 3);
      const [breakfast, lunch, dinner, snacks] = [
        generatedMeals.slice(0, mealsPerSlot),
        generatedMeals.slice(mealsPerSlot, mealsPerSlot * 2),
        generatedMeals.slice(mealsPerSlot * 2),
        [], // Optional: populate with snack suggestions later
      ];

      reset({
        ...watch(),
        breakfast,
        lunch,
        dinner,
        snacks,
      });

      toast.success("Meal plan generated successfully!");
    } catch (error) {
      console.error("Failed to generate meal plan:", error);
      toast.error("Failed to generate meal plan");
    } finally {
      setIsSubmitting(false);
      toast.dismiss();
    }
  }; */}
 

  const onSubmit = async (data: MealPlan) => {
    try {
      setIsSubmitting(true);

      await axios.post("/api/client/mealsState", data);
      //@ts-ignore
      setMealPlan(data);

      toast.success("Meal plan saved successfully!");

      if (typeof onComplete === "function") {
        onComplete();
      }
    } catch (error) {
      console.error("Failed to save meal plan:", error);
      toast.error("Failed to save meal plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const mealTabs = [
    {
      id: "breakfast",
      label: "Breakfast",
      icon: <Coffee className="w-4 h-4" />,
    },
    {
      id: "lunch",
      label: "Lunch",
      icon: <UtensilsCrossed className="w-4 h-4" />,
    },
    {
      id: "dinner",
      label: "Dinner",
      icon: <UtensilsCrossed className="w-4 h-4" />,
    },
    { id: "snacks", label: "Snacks", icon: <Coffee className="w-4 h-4" /> },
  ];

  // Format number with commas for thousands
  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Meal Plan</h2>
        <button
          type="button"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>Auto Generate</span>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Plan Type Selection */}
        <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <UtensilsCrossed className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-medium text-white">Diet Type</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { value: "regular", label: "Regular" },
              { value: "diabetes", label: "Diabetes" },
              { value: "vegan", label: "Vegan" },
              { value: "hypertension", label: "Hypertension" },
              { value: "iron-deficiency", label: "Iron Deficieny" },
              { value: "pregnant", label: "Pregnant" },
              { value: "ibs", label: "IBS" },
            ].map((dietType) => (
              <label
                key={dietType.value}
                className={`flex items-center justify-center p-3 rounded-lg border ${
                  watch("planType") === dietType.value
                    ? "bg-purple-600/20 border-purple-500 text-white"
                    : "bg-zinc-800/50 border-zinc-700 text-zinc-400"
                }`}
              >
                <input
                  type="radio"
                  {...register("planType")}
                  value={dietType.value}
                  className="sr-only"
                />
                <span>{dietType.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Meals Per Day */}
        <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Coffee className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-white">Meals Per Day</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[3, 4, 5, 6].map((mealCount) => (
              <label
                key={mealCount}
                className={`flex items-center justify-center p-3 rounded-lg border ${
                  watch("mealsPerDay") === mealCount
                    ? "bg-blue-600/20 border-blue-500 text-white"
                    : "bg-zinc-800/50 border-zinc-700 text-zinc-400"
                }`}
              >
                <input
                  type="radio"
                  {...register("mealsPerDay")}
                  value={mealCount}
                  className="sr-only"
                />
                <span>{mealCount} meals</span>
              </label>
            ))}
          </div>
        </div>

        {/* Nutrition Summary */}
        {totalNutrition.calories > 0 && (
          <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
            <h3 className="text-lg font-medium text-white mb-3">
              Daily Nutrition Totals
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <span className="text-zinc-400 text-xs">Calories</span>
                <span className="text-xl font-bold text-white">
                  {formatNumber(totalNutrition.calories)}
                </span>
              </div>
              <div className="flex flex-col items-center p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <span className="text-zinc-400 text-xs">Protein</span>
                <span className="text-xl font-bold text-green-400">
                  {formatNumber(totalNutrition.protein)}g
                </span>
              </div>
              <div className="flex flex-col items-center p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <span className="text-zinc-400 text-xs">Carbs</span>
                <span className="text-xl font-bold text-blue-400">
                  {formatNumber(totalNutrition.carbs)}g
                </span>
              </div>
              <div className="flex flex-col items-center p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <span className="text-zinc-400 text-xs">Fat</span>
                <span className="text-xl font-bold text-yellow-400">
                  {formatNumber(totalNutrition.fat)}g
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Meal Selection Tabs */}
        <div className="bg-zinc-800/50 rounded-xl border border-zinc-700 overflow-hidden">
          <div className="flex overflow-x-auto">
            {mealTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-7.5 py-3 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-zinc-700 text-white border-b-2 border-blue-500"
                    : "bg-zinc-800/50 text-zinc-400"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className="ml-1 bg-zinc-700 text-zinc-300 text-xs px-2 py-0.5 rounded-full">
                  {
                    ((watch(tab.id as keyof MealPlan) as MealOption[]) || [])
                      .length
                  }
                </span>
              </button>
            ))}
          </div>

          <div className="p-4">
            {/* Search Input */}
            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search for ${activeTab} items...`}
                className="w-full p-3 pl-10 pr-12 rounded-lg bg-zinc-800/70 border border-zinc-700 text-white"
              />
              <Search className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 p-1 rounded-full text-zinc-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Results */}
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {suggestions.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex items-start justify-between gap-4 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{meal.name}</h4>
                      <p className="text-zinc-400 text-sm">
                        {meal.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs bg-zinc-700 text-white px-2 py-1 rounded">
                          {meal.nutritionInfo.calories} kcal
                        </span>
                        <span className="text-xs text-zinc-400">
                          P: {meal.nutritionInfo.protein}g
                        </span>
                        <span className="text-xs text-zinc-400">
                          C: {meal.nutritionInfo.carbs}g
                        </span>
                        <span className="text-xs text-zinc-400">
                          F: {meal.nutritionInfo.fat}g
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddMeal(meal)}
                      className="p-2 rounded-full bg-blue-600/20 text-blue-400"
                    >
                      <PlusCircle className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="py-8 text-center text-zinc-500">
                <p>No results found for `{searchQuery}`</p>
                <p className="text-sm mt-1">Try using different keywords</p>
              </div>
            ) : null}

            {/* Selected Meals */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-white capitalize">
                  {activeTab} Selections
                </h3>
                {((watch(activeTab as keyof MealPlan) as MealOption[]) || [])
                  .length > 0 && (
                  <button
                    type="button"
                    onClick={() => setValue(activeTab, [])}
                    className="flex items-center gap-1 text-xs text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {((watch(activeTab as keyof MealPlan) as MealOption[]) || [])
                  .length > 0 ? (
                  (watch(activeTab as keyof MealPlan) as MealOption[]).map(
                    (meal) => (
                      <div
                        key={meal.id}
                        className="flex items-start justify-between gap-4 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="text-white font-medium">
                            {meal.name}
                          </h4>
                          <p className="text-zinc-400 text-sm">
                            {meal.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                              {meal.nutritionInfo.calories} kcal
                            </span>
                            <span className="text-xs text-zinc-400">
                              P: {meal.nutritionInfo.protein}g
                            </span>
                            <span className="text-xs text-zinc-400">
                              C: {meal.nutritionInfo.carbs}g
                            </span>
                            <span className="text-xs text-zinc-400">
                              F: {meal.nutritionInfo.fat}g
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMeal(meal.id)}
                          className="p-2 rounded-full bg-red-600/10 text-red-400"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )
                  )
                ) : (
                  <div className="py-8 text-center border border-dashed border-zinc-700 rounded-lg bg-zinc-800/30">
                    <p className="text-zinc-500">
                      No {activeTab} items selected
                    </p>
                    <p className="text-sm text-zinc-600 mt-1">
                      Search above to add items
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-zinc-400">
            <div className="flex items-center gap-1">
              <Info className="w-4 h-4" />
              <span>Changes are saved automatically</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl disabled:opacity-50 font-medium flex items-center gap-2"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              <>
                <span>Save & Continue</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
