// src/store/useExpertSession.ts
import {create} from 'zustand';

interface HealthDetails {
  conditions?: string[];
  dietaryRestrictions?: string[];
  allergies?: string[];
  // Add other health-related fields as needed
}

interface ExpertSessionState {
  healthDetails: HealthDetails | null;
  setHealthDetails: (details: HealthDetails) => void;
  clearHealthDetails: () => void;
}

export const useExpertSession = create<ExpertSessionState>((set) => ({
  healthDetails: null, // Initial state

  // Method to set health details
  setHealthDetails: (details: HealthDetails) => set({ healthDetails: details }),

  // Method to clear health details
  clearHealthDetails: () => set({ healthDetails: null }),
}));