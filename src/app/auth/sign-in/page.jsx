"use client";

import { AuthHeader } from "../../../components/auth-header";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

const SignInPage = () => {
  const router = useRouter();
  const [userType, setUserType] = useState("client");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const signInMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/api/auth/sign-in', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Signed in successfully!");
      // Store user data
      localStorage.setItem('user', JSON.stringify(data.user));
      // Redirect based on role
      if (data.user.role === 'nutritionist') {
        router.push('/admin');
      } else {
        router.push('/client');
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to sign in");
    },
  });

  const onSubmit = (data) => {
    signInMutation.mutate(data);
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    reset();
  };

  return (
    <div className="min-h-screen bg-[#171717] flex">
      {/* Left Section - Sign In Form */}
      <div className="w-[750px] flex flex-col justify-center px-30">
        <AuthHeader/>
        <div className="px-8">
          <h2 className="text-[32px] font-sans text-white mb-2 font-normal">
            Welcome back
          </h2>
          <p className="text-[#B4B4B4] text-sm">
            Sign in to your account
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
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password", { required: "Password is required" })}
                  className="w-full bg-[#1C1C1C] border border-[#2D2D2D] text-white rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={signInMutation.isPending}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded transition text-sm disabled:opacity-50"
              >
                {signInMutation.isPending ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-[#B4B4B4]">
              Don't have an account?{" "}
              <a href="/auth/sign-up" className="text-white hover:underline">
                Sign Up Now
              </a>
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
              <Image
              src="/63.jpg"
              alt="Healthy food and nutrition"
              width={550}
              height={550}
              className="rounded-lg object-cover"
              priority
            />
            </div>
            <div className="text-[#4B5563]">@michael_webdev</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
