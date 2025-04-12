'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { HealthForm } from '../../../components/HealthForm';
import dynamic from 'next/dynamic';
import { useAuthStore } from '../../../store/useAuthStore';
import { useMealsStore } from '../../../store/useMealsStore';

// Import MealPlanForm with no SSR
const MealPlanForm = dynamic(
  () => import('../../../components/MealPlanForm').then(mod => mod.MealPlanForm),
  { ssr: false }
)

export default function PreferencesPage() {
  const [loading, setLoading] = useState(false);
  const [healthData, setHealthData] = useState(null);
  const { user } = useAuthStore();
  const { setMealPlan, mealPlan } = useMealsStore();
  const [isUserLoaded, setIsUserLoaded] = useState(false);  // Track if user is loaded

  const fetchMealPlan = async () => {
    try {
      const response = await axios.get(`/api/client/mealsState?userId=${user.id}`);
      const mealPlanData = response.data.data;

      if (mealPlanData) {
        // Ensure all meal categories are initialized with empty arrays if missing
        const defaultMealPlan = {
          id: 0,
          breakfast: mealPlanData.breakfast || [],
          lunch: mealPlanData.lunch || [],
          dinner: mealPlanData.dinner || [],
          snacks: mealPlanData.snacks || [],
          planType: mealPlanData.planType || '', // Default planType
          mealsPerDay: mealPlanData.mealsPerDay || 3, // Default mealsPerDay
          userId: user.id.toString()  // Ensure userId is a string
        };
        {/*@ts-ignore */}
        setMealPlan(defaultMealPlan);
      }
    } catch (error) {
      console.error('Error fetching meal plan:', error);
    }
  };

  const handleHealthSubmit = async (data) => {
    setLoading(true);
    try {
      // Determine if we're creating or updating based on existing data
      const method = healthData ? 'put' : 'post';
      const response = await axios[method]('/api/health', data);
      
      setHealthData(response.data);
      toast.success(
        healthData ? 
        'Health information updated successfully' : 
        'Health information created successfully'
      );
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(
        error.response?.data?.error || 
        'Failed to save health information'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchMealPlan();
    }
    setIsUserLoaded(true);  // Set user as loaded after checking user data
  }, [user]);

  if (!isUserLoaded) {
    return <div>Loading...</div>;  // Show loading while fetching user data
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-full gap-8 flex flex-col md:flex-row mx-auto px-4 py-4">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-white mb-2">Health & Nutrition Preferences</h1>
          <p className="text-zinc-400">Manage your health information and meal preferences</p>
        </div>

        <div className="space-y-4 gap-4 flex flex-col md:flex-row">
          <HealthForm 
            onSubmit={handleHealthSubmit}
            initialData={healthData}
            loading={loading}
          />

          {/* @ts-ignore */}
          <MealPlanForm initialMealPlan={mealPlan || {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: [],
            planType: '',
            mealsPerDay: 3,
            userId: user.id.toString()  // Ensure userId is a string
          }} />
        </div>
      </div>
    </div>
  );
}
