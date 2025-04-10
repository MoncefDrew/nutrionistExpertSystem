"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";

const HealthPreferencesPage = () => {
  const router = useRouter();
  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] = useState([]);
  const [selectedHealthConditions, setSelectedHealthConditions] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const savePreferencesMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/api/client/preferences', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Health preferences saved successfully!");
      router.push('/client/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to save preferences");
    },
  });

  const dietaryRestrictionOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Kosher",
    "Halal",
    "None"
  ];

  const healthConditionOptions = [
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "Celiac Disease",
    "Lactose Intolerance",
    "None"
  ];

  const activityLevelOptions = [
    { value: "sedentary", label: "Sedentary (little or no exercise)" },
    { value: "light", label: "Light (exercise 1-3 times/week)" },
    { value: "moderate", label: "Moderate (exercise 4-5 times/week)" },
    { value: "active", label: "Active (daily exercise)" },
    { value: "very_active", label: "Very Active (intense exercise 6-7 times/week)" }
  ];

  const goalOptions = [
    "Weight Loss",
    "Weight Gain",
    "Muscle Gain",
    "Maintenance",
    "Better Health",
    "Sports Performance"
  ];

  const onSubmit = (data) => {
    savePreferencesMutation.mutate({
      ...data,
      dietaryRestrictions: selectedDietaryRestrictions,
      healthConditions: selectedHealthConditions
    });
  };

  return (
    <div className="min-h-screen bg-[#171717] py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-normal text-white mb-2">Health Profile</h1>
        <p className="text-[#B4B4B4] mb-8">Tell us about your health to get personalized nutrition advice</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-[#1C1C1C] p-6 rounded-lg border border-[#2D2D2D]">
            <h2 className="text-xl text-white mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[#B4B4B4] text-sm mb-2 block">Age</label>
                <input
                  type="number"
                  {...register("age", { required: "Age is required", min: 18, max: 100 })}
                  className="w-full bg-[#242424] border border-[#2D2D2D] text-white rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                {errors.age && (
                  <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
                )}
              </div>

              <div>
                <label className="text-[#B4B4B4] text-sm mb-2 block">Gender</label>
                <select
                  {...register("gender", { required: "Gender is required" })}
                  className="w-full bg-[#242424] border border-[#2D2D2D] text-white rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                )}
              </div>

              <div>
                <label className="text-[#B4B4B4] text-sm mb-2 block">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register("weight", { required: "Weight is required" })}
                  className="w-full bg-[#242424] border border-[#2D2D2D] text-white rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                {errors.weight && (
                  <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
                )}
              </div>

              <div>
                <label className="text-[#B4B4B4] text-sm mb-2 block">Height (cm)</label>
                <input
                  type="number"
                  {...register("height", { required: "Height is required" })}
                  className="w-full bg-[#242424] border border-[#2D2D2D] text-white rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                {errors.height && (
                  <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Activity Level */}
          <div className="bg-[#1C1C1C] p-6 rounded-lg border border-[#2D2D2D]">
            <h2 className="text-xl text-white mb-4">Activity Level</h2>
            <select
              {...register("activityLevel", { required: "Activity level is required" })}
              className="w-full bg-[#242424] border border-[#2D2D2D] text-white rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Select activity level</option>
              {activityLevelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.activityLevel && (
              <p className="text-red-500 text-sm mt-1">{errors.activityLevel.message}</p>
            )}
          </div>

          {/* Dietary Restrictions */}
          <div className="bg-[#1C1C1C] p-6 rounded-lg border border-[#2D2D2D]">
            <h2 className="text-xl text-white mb-4">Dietary Restrictions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {dietaryRestrictionOptions.map((restriction) => (
                <label key={restriction} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={restriction}
                    checked={selectedDietaryRestrictions.includes(restriction)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDietaryRestrictions([...selectedDietaryRestrictions, restriction]);
                      } else {
                        setSelectedDietaryRestrictions(
                          selectedDietaryRestrictions.filter((item) => item !== restriction)
                        );
                      }
                    }}
                    className="rounded border-[#2D2D2D] bg-[#242424] text-emerald-500 focus:ring-0"
                  />
                  <span className="text-[#B4B4B4]">{restriction}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Health Conditions */}
          <div className="bg-[#1C1C1C] p-6 rounded-lg border border-[#2D2D2D]">
            <h2 className="text-xl text-white mb-4">Health Conditions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {healthConditionOptions.map((condition) => (
                <label key={condition} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={condition}
                    checked={selectedHealthConditions.includes(condition)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedHealthConditions([...selectedHealthConditions, condition]);
                      } else {
                        setSelectedHealthConditions(
                          selectedHealthConditions.filter((item) => item !== condition)
                        );
                      }
                    }}
                    className="rounded border-[#2D2D2D] bg-[#242424] text-emerald-500 focus:ring-0"
                  />
                  <span className="text-[#B4B4B4]">{condition}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="bg-[#1C1C1C] p-6 rounded-lg border border-[#2D2D2D]">
            <h2 className="text-xl text-white mb-4">Goals</h2>
            <select
              {...register("goals", { required: "Please select a goal" })}
              className="w-full bg-[#242424] border border-[#2D2D2D] text-white rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Select your primary goal</option>
              {goalOptions.map((goal) => (
                <option key={goal} value={goal}>
                  {goal}
                </option>
              ))}
            </select>
            {errors.goals && (
              <p className="text-red-500 text-sm mt-1">{errors.goals.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={savePreferencesMutation.isPending}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition text-sm disabled:opacity-50"
          >
            {savePreferencesMutation.isPending ? "Saving..." : "Save Preferences"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HealthPreferencesPage;
