'use client';
import { useState, useEffect, Suspense } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { HealthForm } from '../../../components/HealthForm';
import { MealPlanForm } from '../../../components/MealPlanForm';

export const dynamic = 'force-dynamic'

export default function PreferencesPage() {
  const [loading, setLoading] = useState(false);
  const [healthData, setHealthData] = useState(null);


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

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-full gap-8 flex flex-col md:flex-row mx-auto px-12 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Health & Nutrition Preferences</h1>
          <p className="text-zinc-400">Manage your health information and meal preferences</p>
        </div>

        <div className="space-y-8 gap-4 flex flex-col md:flex-row">
          <HealthForm 
            onSubmit={handleHealthSubmit}
            initialData={healthData}
            loading={loading}
          />
          
          <Suspense fallback={<div>Loading...</div>}>
            <MealPlanForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 