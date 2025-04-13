'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { HealthForm } from '../../../components/HealthForm';
import dynamic from 'next/dynamic';
import { useAuthStore } from '../../../store/useAuthStore';
import { useMealsStore } from '../../../store/useMealsStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, UserCircle, Utensils, ArrowLeftRight } from 'lucide-react';

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
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [activeStep, setActiveStep] = useState(1); // Track current step: 1 for health, 2 for meal
  const router = useRouter();

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
          planType: mealPlanData.planType || '',
          mealsPerDay: mealPlanData.mealsPerDay || 3,
          userId: user.id.toString()
        };
        //@ts-ignore
        setMealPlan(defaultMealPlan);
      }
    } catch (error) {
      console.error('Error fetching meal plan:', error);
    }
  };

  const handleHealthSubmit = async (data) => {
    setLoading(true);
    try {
      const method = healthData ? 'put' : 'post';
      const response = await axios[method]('/api/health', data);
      
      setHealthData(response.data);
      toast.success(
        healthData ? 
        'Health information updated successfully' : 
        'Health information created successfully'
      );
      
      // Move to meal plan step automatically
      setActiveStep(2);
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

  const handleMealSubmit = () => {
    router.push('/client/chat');
    toast.success('Profile setup complete! Redirecting to chat.');
  };

  useEffect(() => {
    if (user && user.id) {
      fetchMealPlan();
    }
    setIsUserLoaded(true);
  }, [user]);

  if (!isUserLoaded) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
        {/* Animated purple blurs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-700/20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-indigo-700/15 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-700/10 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <p className="text-zinc-400 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col">
      {/* Animated purple blurs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-700/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-indigo-700/15 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-700/10 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Header with progress indicator */}
      <div className="w-full max-w-6xl mx-auto px-4 pt-8 pb-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-2">Profile Setup</h1>
            <p className="text-zinc-400">Complete your profile to get personalized nutrition advice</p>
          </div>
          
          {/* Progress steps */}
          <div className="flex items-center gap-1 bg-zinc-800/50 p-1 rounded-full">
            <button 
              onClick={() => setActiveStep(1)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                activeStep === 1 
                  ? "bg-blue-600 text-white" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <UserCircle className="w-4 h-4" />
              <span className="hidden md:inline">Health</span>
              <span className="md:hidden">1</span>
            </button>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
            <button 
              onClick={() => setActiveStep(2)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                activeStep === 2 
                  ? "bg-blue-600 text-white" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span className="hidden md:inline">Nutrition</span>
              <span className="md:hidden">2</span>
            </button>
          </div>
        </div>
      </div>
  
      {/* Main content */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 pb-12 relative z-10">
        {activeStep === 1 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left column: Form */}
            <div className="lg:col-span-2">
              <div className="bg-zinc-900/80 backdrop-blur-lg rounded-2xl border border-zinc-800 shadow-xl overflow-hidden">
                <div className="p-8">
                  <HealthForm 
                    onSubmit={handleHealthSubmit}
                    initialData={healthData}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
            
            {/* Right column: Information/Tips */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-2xl border border-blue-500/20 shadow-xl p-6 mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Why This Matters</h3>
                  <p className="text-zinc-300 mb-4">
                    Your health data helps us provide personalized nutrition advice thats tailored to your specific needs and goals.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Calculate your ideal caloric intake",
                      "Determine appropriate macronutrient ratios",
                      "Suggest meals aligned with your dietary preferences",
                      "Track your progress over time"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="mt-1 rounded-full bg-blue-500/20 p-1">
                          <ChevronRight className="w-3 h-3 text-blue-400" />
                        </div>
                        <span className="text-zinc-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
  
                <div className="bg-zinc-900/80 backdrop-blur-lg rounded-2xl border border-zinc-800 shadow-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Data Privacy</h3>
                  <p className="text-zinc-400 text-sm">
                    Your health information is stored securely and used solely to provide
                    personalized nutrition advice. We never share your data with third parties.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left column: Form */}
            <div className="lg:col-span-2">
              <div className="bg-zinc-900/80 backdrop-blur-lg rounded-2xl border border-zinc-800 shadow-xl overflow-hidden">
                <div className="p-8">
                  {/* @ts-ignore */}
                  <MealPlanForm 
                    initialMealPlan={mealPlan || {
                      breakfast: [],
                      lunch: [],
                      dinner: [],
                      snacks: [],
                      planType: '',
                      mealsPerDay: 3,
                      userId: user.id.toString()
                    }} 
                    onComplete={handleMealSubmit}
                  />
                </div>
              </div>
            </div>
            
            {/* Right column: Information/Tips */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-lg rounded-2xl border border-green-500/20 shadow-xl p-6 mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Meal Planning Benefits</h3>
                  <p className="text-zinc-300 mb-4">
                    Planning your meals ahead of time has several advantages for your health journey:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Helps maintain consistent nutrition intake",
                      "Reduces impulsive food choices",
                      "Saves time on daily food decisions",
                      "Makes grocery shopping more efficient"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="mt-1 rounded-full bg-green-500/20 p-1">
                          <ChevronRight className="w-3 h-3 text-green-400" />
                        </div>
                        <span className="text-zinc-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
  
                <div className="flex items-center justify-between bg-zinc-900/80 backdrop-blur-lg rounded-2xl border border-zinc-800 shadow-xl p-6">
                  <button
                    onClick={() => setActiveStep(1)}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    <span>Back to Health</span>
                  </button>
                  
                  <button
                    onClick={handleMealSubmit}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}