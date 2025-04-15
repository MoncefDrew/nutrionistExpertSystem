"use client";
import { useForm } from "react-hook-form";
import { 
  Activity, Scale, Ruler, Target, Apple, User2, 
  Heart, Zap, AlertCircle, ChevronDown, Info, Dumbbell,
  Router
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import { toast } from "sonner";
import { useHealthStore } from "../store/useHealthStore";

export function HealthForm({ onSubmit, initialData, loading }) {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(loading);
  const [openSection, setOpenSection] = useState("basic");
  const { setHealthData } = useHealthStore();

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      age: "",
      gender: "male",
      weight: "",
      height: "",
      goal: "maintain",
      activityLevel: "moderate",
      dietaryRestrictions: "",
      allergies: "",
    },
  });

  const weight = watch("weight");
  const height = watch("height");
  const [bmi, setBmi] = useState(null);

  useEffect(() => {
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmiValue = weight / (heightInMeters * heightInMeters);
      setBmi(parseFloat(bmiValue.toFixed(1)));
    }
  }, [weight, height]);
  const router = useRouter()
  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key, initialData[key]);
      });
    }
  }, [initialData, setValue]);

  useEffect(() => {
    if (user?.id) {
      fetchHealthData();
    }
  }, [user]);

  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500", bg: "bg-blue-500/10" };
    if (bmi < 25) return { label: "Normal", color: "text-green-500", bg: "bg-green-500/10" };
    if (bmi < 30) return { label: "Overweight", color: "text-yellow-500", bg: "bg-yellow-500/10" };
    return { label: "Obese", color: "text-red-500", bg: "bg-red-500/10" };
  };

  const handleSubmitting = async (data) => {
    try {
      if (!user) {
        throw new Error("You must be logged in to submit health data");
      }

      const formattedData = {
        ...data,
        age: parseInt(data.age),
        weight: parseFloat(data.weight),
        height: parseFloat(data.height),
        dietaryRestrictions: data.dietaryRestrictions
          ? data.dietaryRestrictions.split(",").map((item) => item.trim()).filter(Boolean)
          : [],
        allergies: data.allergies
          ? data.allergies.split(",").map((item) => item.trim()).filter(Boolean)
          : [],
        userId: user.id,
      };

      const response = await axios.post("/api/client/health/create", formattedData);

      if (response.data.data.userId !== user.id) {
        throw new Error("User ID mismatch - Security check failed");
      }

      toast.success("Health information saved successfully");
      router.refresh()
      router.push('/client/chat')
      
    } catch (error) {
      toast.error("Failed to save health information");
      console.error(error);
    }
  };

  const fetchHealthData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/client/health?userId=${user.id}`);
      const healthData = response.data.data;

      if (healthData) {
        setHealthData(healthData);

        const formattedData = {
          ...healthData,
          dietaryRestrictions: healthData.dietaryRestrictions?.join(", ") || "",
          allergies: healthData.allergies?.join(", ") || "",
        };

        Object.keys(formattedData).forEach((key) => {
          setValue(key, formattedData[key]);
        });
      }
    } catch (error) {
      console.error("Error fetching health data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const AccordionSection = ({ id, title, icon, children }) => {
    const isOpen = openSection === id;
    
    return (
      <div className="border border-zinc-800 rounded-xl overflow-hidden mb-4">
        <button 
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-4 bg-zinc-800/50"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isOpen ? 'bg-blue-500/20' : 'bg-zinc-700/50'}`}>
              {icon}
            </div>
            <h3 className="text-lg font-medium text-white">{title}</h3>
          </div>
          <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="p-4 bg-zinc-900/50">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Your Health Profile</h2>
        {bmi && (
          <div className={`py-1 px-3 rounded-full flex items-center gap-2 ${getBmiCategory(bmi).bg}`}>
            <span className="text-sm text-gray-200">{bmi} BMI</span>
            <span className={`text-sm font-bold ${getBmiCategory(bmi).color}`}>
              {getBmiCategory(bmi).label}
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(handleSubmitting)} className="space-y-6">
        <AccordionSection 
          id="basic" 
          title="Personal Information" 
          icon={<User2 className="w-5 h-5 text-blue-400" />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-zinc-300">Age</label>
              <div className="relative">
                <input
                  type="number"
                  {...register("age")}
                  className="w-full p-3 pl-10 rounded-lg bg-zinc-800/70 border border-zinc-700 text-white"
                  placeholder="Enter your age"
                />
                <User2 className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
              </div>
            </div>

            <div>
              <label className="text-sm text-zinc-300">Gender</label>
              <div className="grid grid-cols-3 gap-3">
                {['male', 'female', 'other'].map((gender) => (
                  <label 
                    key={gender} 
                    className={`flex items-center justify-center p-3 rounded-lg border ${
                      watch('gender') === gender 
                        ? 'bg-blue-600/20 border-blue-500 text-white' 
                        : 'bg-zinc-800/50 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    <input
                      type="radio"
                      {...register("gender")}
                      value={gender}
                      className="sr-only"
                    />
                    <span className="capitalize">{gender}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection 
          id="measurements" 
          title="Body Measurements" 
          icon={<Ruler className="w-5 h-5 text-purple-400" />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-zinc-300">Weight (kg)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  {...register("weight")}
                  className="w-full p-3 pl-10 rounded-lg bg-zinc-800/70 border border-zinc-700 text-white"
                  placeholder="Enter your weight"
                />
                <Scale className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-zinc-300">Height (cm)</label>
              <div className="relative">
                <input
                  type="number"
                  {...register("height")}
                  className="w-full p-3 pl-10 rounded-lg bg-zinc-800/70 border border-zinc-700 text-white"
                  placeholder="Enter your height"
                />
                <Ruler className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
              </div>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection 
          id="goals" 
          title="Fitness Goals" 
          icon={<Target className="w-5 h-5 text-red-400" />}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-zinc-300">Your Goal</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { value: 'lose_weight', label: 'Lose Weight', icon: <Zap className="w-4 h-4" /> },
                  { value: 'maintain', label: 'Maintain Weight', icon: <Activity className="w-4 h-4" /> },
                  { value: 'gain_weight', label: 'Gain Weight', icon: <Scale className="w-4 h-4" /> },
                  { value: 'gain_muscle', label: 'Gain Muscle', icon: <Dumbbell className="w-4 h-4" /> }
                ].map((goal) => (
                  <label 
                    key={goal.value} 
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      watch('goal') === goal.value 
                        ? 'bg-blue-600/20 border-blue-500 text-white' 
                        : 'bg-zinc-800/50 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    <input
                      type="radio"
                      {...register("goal")}
                      value={goal.value}
                      className="sr-only"
                    />
                    <div className={`p-1 rounded-full ${watch('goal') === goal.value ? 'bg-blue-500/20' : 'bg-zinc-700/50'}`}>
                      {goal.icon}
                    </div>
                    <span>{goal.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm text-zinc-300">Activity Level</label>
              <div className="relative">
                <select
                  {...register("activityLevel")}
                  className="w-full p-3 pl-10 rounded-lg bg-zinc-800/70 border border-zinc-700 text-white appearance-none"
                >
                  <option value="sedentary">Sedentary (Little to no exercise)</option>
                  <option value="light">Light (1-3 days/week)</option>
                  <option value="moderate">Moderate (3-5 days/week)</option>
                  <option value="active">Very Active (6-7 days/week)</option>
                </select>
                <Heart className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-zinc-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection 
          id="dietary" 
          title="Dietary Preferences" 
          icon={<Apple className="w-5 h-5 text-green-400" />}
        >
          <div className="space-y-6">
            <div>
              <label className="text-sm text-zinc-300">Dietary Restrictions</label>
              <div className="relative">
                <textarea
                  {...register("dietaryRestrictions")}
                  placeholder="e.g., vegetarian, vegan, gluten-free, keto (separate with commas)"
                  className="w-full p-3 min-h-20 rounded-lg bg-zinc-800/70 border border-zinc-700 text-white"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {['vegan','diabetes','hypertension','iron-deficiency','pregnant','IBS'].map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      const current = watch('dietaryRestrictions');
                      const items = current ? current.split(',').map(i => i.trim()) : [];
                      if (!items.includes(item)) {
                        setValue('dietaryRestrictions', [...items, item].join(', '));
                      }
                    }}
                    className="text-xs px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm text-zinc-300">Allergies & Intolerances</label>
              <div className="relative">
                <textarea
                  {...register("allergies")}
                  placeholder="e.g., nuts, dairy, shellfish, eggs (separate with commas)"
                  className="w-full p-3 min-h-20 rounded-lg bg-zinc-800/70 border border-zinc-700 text-white"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {['nuts', 'dairy', 'gluten', 'eggs', 'shellfish', 'soy'].map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      const current = watch('allergies');
                      const items = current ? current.split(',').map(i => i.trim()) : [];
                      if (!items.includes(item)) {
                        setValue('allergies', [...items, item].join(', '));
                      }
                    }}
                    className="text-xs px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </AccordionSection>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl disabled:opacity-50 font-medium"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
              <span>Saving Changes...</span>
            </div>
          ) : (
            <span>Save & Continue</span>
          )}
        </button>
      </form>
    </div>
  );
}