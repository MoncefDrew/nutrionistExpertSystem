"use client";

import { AuthHeader } from "../../../../components/auth-header";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const AdminSignUpPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const signUpMutation = useMutation({
    mutationFn: async (data) => {
      // Include role as nutritionist
      const response = await axios.post('/api/auth/sign-up', {
        ...data,
        role: 'nutritionist'
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Account created successfully!");
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/auth/admin/sign-in');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to create account");
    },
  });

  const onSubmit = (data) => {
    if (!data.agreeToTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy");
      return;
    }
    // Remove confirmPassword and agreeToTerms before sending
    const { confirmPassword, agreeToTerms, ...signUpData } = data;
    signUpMutation.mutate(signUpData);
  };

  return (
    <div className="min-h-screen bg-[#171717] flex">
      {/* Left Section - Sign Up Form */}
      <div className="w-[750px] flex flex-col justify-center px-30">
        <AuthHeader />
        <div className="px-8">
          <h2 className="text-[32px] font-sans text-white mb-2 font-normal">
            Join as a Nutritionist
          </h2>
          <p className="text-[#B4B4B4] text-sm">
            Create your professional nutritionist account
          </p>
        </div>

        <div className="mt-8 px-8">
          <div className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-[#B4B4B4] text-sm mb-2 block">Username</label>
                <input
                  type="text"
                  placeholder="dr.smith"
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters"
                    }
                  })}
                  className="w-full bg-[#1C1C1C] border border-[#2D2D2D] text-white rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="text-[#B4B4B4] text-sm mb-2 block">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="w-full bg-[#1C1C1C] border border-[#2D2D2D] text-white rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="relative">
                <label className="text-[#B4B4B4] text-sm mb-2 block">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters"
                    }
                  })}
                  className="w-full bg-[#1C1C1C] border border-[#2D2D2D] text-white rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-gray-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="relative">
                <label className="text-[#B4B4B4] text-sm mb-2 block">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: value => value === password || "Passwords do not match"
                  })}
                  className="w-full bg-[#1C1C1C] border border-[#2D2D2D] text-white rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-8 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  {...register("agreeToTerms")}
                  className="rounded border-[#2D2D2D] bg-transparent text-emerald-600 focus:ring-0"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-[#B4B4B4]">
                  I agree to the{" "}
                  <a href="#" className="text-white hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-white hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={signUpMutation.isPending}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded transition text-sm disabled:opacity-50"
              >
                {signUpMutation.isPending ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-[#B4B4B4]">
              Already have an account?{" "}
              <a href="/auth/admin/sign-in" className="text-white hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Professional Image */}
      <div className="flex-1 flex items-center bg-[#0f0e0e] justify-center border-l border-[#2D2D2D] p-16">
        <div className="max-w-[520px]">
          <div className="text-[80px] text-[#2D2D2D] leading-none mb-4">"</div>
          <p className="text-[24px] leading-normal text-white mb-8">
            Join our network of professional nutritionists and make a difference in people's lives through personalized nutrition guidance.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2D2D2D]">
              <Image
                src="/63.jpg"
                alt="Professional nutritionist"
                width={40}
                height={40}
                className="object-cover"
                priority
              />
            </div>
            <div className="text-[#4B5563]">Dr. Sarah Johnson</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignUpPage; 