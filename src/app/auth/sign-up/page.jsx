"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AuthHeader } from "../../../components/auth-header";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function SignUpPage() {
  const router = useRouter();
  const [userType, setUserType] = useState("client");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const password = watch("password");

  const signUpMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/api/auth/sign-up', {
        ...data,
        role: userType,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Account created successfully!");
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push(userType === 'nutritionist' ? '/admin' : '/client');
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
    
    // Remove confirmPassword before sending to API
    const { confirmPassword, agreeToTerms, ...signUpData } = data;
    signUpMutation.mutate(signUpData);
  };

  return (
    <div className="min-h-screen bg-[#171717] flex">
      <div className="w-[750px] flex flex-col justify-center px-30">
        <AuthHeader/>
        <div className="px-8">
        <h2 className="text-[32px] font-sans text-white mb-2 font-normal">
        Create new account
          </h2>
          <p className="text-[#B4B4B4] text-sm">
            Sign up for free
          </p>
        </div>

        <div className="mt-8 px-8">
          <div className="space-y-4">
            <button className="w-full flex items-center bg-[#242424] justify-center gap-2 border border-[#2D2D2D] hover:bg-[#2D2D2D] text-white py-2 px-4 rounded transition text-sm">
              <span>Continue with GitHub</span>
            </button>

            <button className="w-full flex items-center bg-[#242424] justify-center gap-2 border border-[#2D2D2D] hover:bg-[#2D2D2D] text-white py-2 px-4 rounded transition text-sm">
              <span>Continue with SSO</span>
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2D2D2D]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#171717] text-[#4B5563]">or</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-[#B4B4B4] text-sm mb-2 block">Username</label>
                <input
                  type="text"
                  placeholder="johndoe"
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

              <div>
                <label className="text-[#B4B4B4] text-sm mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    className="w-full bg-[#1C1C1C] border border-[#2D2D2D] text-white rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="text-[#B4B4B4] text-sm mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    className="w-full bg-[#1C1C1C] border border-[#2D2D2D] text-white rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563]"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
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
                  <Link href="/terms" className="text-white hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-white hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded transition text-sm"
              >
                Sign Up
              </button>
            </form>

            <p className="text-center text-sm text-[#B4B4B4]">
              Already have an account?{" "}
              <Link href="/auth/sign-in" className="text-white hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8  px-8 text-xs text-[#B4B4B4]">
          <p>
            By continuing, you agree to Supabase's{" "}
            <a href="#" className="text-white hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-white hover:underline">Privacy Policy</a>,
            and to receive periodic emails with updates.
          </p>
        </div>
      </div>

      {/* Right Section - Testimonial */}
      <div className="flex-1 flex items-center bg-[#0f0e0e] justify-center border-l border-[#2D2D2D] p-16">
        <div className="max-w-[520px]">
          <div className="text-[80px] text-[#2D2D2D] leading-none mb-4">"</div>
          <p className="text-[24px]  leading-normal text-white mb-8">
            Did a website with @supabase last week with no prior experience with it.
            Up and running in 20 minutes. It's awesome to use. Thumbs up
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2D2D2D]">
              {/* Profile image placeholder */}
            </div>
            <div className="text-[#4B5563]">@michael_webdev</div>
          </div>
        </div>
      </div>
    </div>
  );
}
