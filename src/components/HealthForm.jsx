'use client';
'use client';
import { useForm } from 'react-hook-form';
import { Activity, Scale, Ruler, Target, Apple, User2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';

// ... keep the HealthForm interface ...

export function HealthForm({ onSubmit, initialData, loading }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(loading);

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      age: '',
      gender: 'male',
      weight: '',
      height: '',
      goal: 'maintain',
      activityLevel: 'moderate',
      dietaryRestrictions: '',
      allergies: '',
    }
  });

  const weight = watch('weight');
  const height = watch('height');
  const [bmi, setBmi] = useState(null);

  // Calculate BMI when weight or height changes
  useEffect(() => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmiValue = weight / (heightInMeters * heightInMeters);
      setBmi(parseFloat(bmiValue.toFixed(1)));
    }
  }, [weight, height]);

  // Set initial data if provided
  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key, initialData[key]);
      });
    }
  }, [initialData, setValue]);

  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-500' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-500' };
    return { label: 'Obese', color: 'text-red-500' };
  };

  const handleSubmitting = async (data) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to submit health data');
      }

      const formattedData = {
        ...data,
        age: parseInt(data.age),
        weight: parseFloat(data.weight),
        height: parseFloat(data.height),
        dietaryRestrictions: data.dietaryRestrictions ? 
          data.dietaryRestrictions.split(',').map(item => item.trim()).filter(Boolean) : 
          [],
        allergies: data.allergies ? 
          data.allergies.split(',').map(item => item.trim()).filter(Boolean) : 
          [],
        userId: user.id
      };

      const response = await axios.post('/api/client/health/create', formattedData);
      
      if (response.data.data.userId !== user.id) {
        throw new Error('User ID mismatch - Security check failed');
      }

      router.push('/client/chat');
      
    } catch (error) {
      throw error;
    }
  };

  // Add fetchHealthData function
  const fetchHealthData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/client/health?userId=${user.id}`);
      const healthData = response.data.data;
      
      if (healthData) {
        // Format arrays back to comma-separated strings
        const formattedData = {
          ...healthData,
          dietaryRestrictions: healthData.dietaryRestrictions?.join(', ') || '',
          allergies: healthData.allergies?.join(', ') || ''
        };
        
        Object.keys(formattedData).forEach((key) => {
          setValue(key, formattedData[key]);
        });
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add useEffect to fetch data on mount
  useEffect(() => {
    if (user?.id) {
      fetchHealthData();
    }
  }, [user]);

  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl py-4 px-8 border border-zinc-800">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {bmi && (
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
              <span className={`text-sm font-medium ${getBmiCategory(bmi).color}`}>
                {getBmiCategory(bmi).label}
              </span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{bmi}</p>
            <p className="text-sm text-zinc-400">Body Mass Index</p>
          </div>
        )}
        
        {weight && (
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Scale className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{weight} kg</p>
            <p className="text-sm text-zinc-400">Current Weight</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(handleSubmitting)} className="space-y-8">
        {/* Basic Information */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <User2 className="w-5 h-5" />
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Age</label>
              <input
                type="number"
                {...register('age')}
                className="w-full p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 focus:border-blue-500 transition-colors text-gray-300 placeholder-gray-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Gender</label>
              <select
                {...register('gender')}
                className="w-full p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 focus:border-blue-500 transition-colors text-gray-300"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Body Measurements */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Ruler className="w-5 h-5" />
            Body Measurements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                {...register('weight')}
                className="w-full p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 focus:border-blue-500 transition-colors text-gray-300 placeholder-gray-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Height (cm)</label>
              <input
                type="number"
                {...register('height')}
                className="w-full p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 focus:border-blue-500 transition-colors text-gray-300 placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Goals & Activity */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Goals & Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Goal</label>
              <select
                {...register('goal')}
                className="w-full p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 focus:border-blue-500 transition-colors text-gray-300"
              >
                <option value="lose_weight">Lose Weight</option>
                <option value="gain_weight">Gain Weight</option>
                <option value="maintain">Maintain Weight</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Activity Level</label>
              <select
                {...register('activityLevel')}
                className="w-full p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 focus:border-blue-500 transition-colors text-gray-300"
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Light Activity</option>
                <option value="moderate">Moderate Activity</option>
                <option value="active">Very Active</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dietary Information */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Apple className="w-5 h-5" />
            Dietary Information
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Dietary Restrictions</label>
              <input
                type="text"
                {...register('dietaryRestrictions')}
                placeholder="E.g., vegetarian, vegan, gluten-free (separate with commas)"
                className="w-full p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 focus:border-blue-500 transition-colors text-gray-300 placeholder-gray-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Allergies</label>
              <input
                type="text"
                {...register('allergies')}
                placeholder="E.g., nuts, dairy, shellfish (separate with commas)"
                className="w-full p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 focus:border-blue-500 transition-colors text-gray-300 placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
        >
          {isLoading ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
} 