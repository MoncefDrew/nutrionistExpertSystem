// useHealthState.ts
import { create } from 'zustand'

export interface healthDataType {
  age: number
  gender: string
  weight: number
  height: number
  goal: string
  activityLevel: string
  dietaryRestrictions: string[]
  allergies: string[]
}


export const useHealthStore = create((set) => ({
    healthData: null,
    setHealthData: (data) => set({ healthData: data }),
  }));
