"use client";

import { AuthHeader } from "../../../../components/auth-header";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

const AdminSignInPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const signInMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post('/api/auth/sign-in', data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.user.role !== 'nutritionist') {
        toast.error("Access denied. This portal is for nutritionists only.");
        return;
      }
      
      toast.success("Welcome back!");
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/admin');
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        toast.error("Invalid email or password");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    },
  });

  const onSubmit = (data) => {
    signInMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[#171717] flex">
      {/* Left Section - Sign In Form */}
      <div className="w-[750px] flex flex-col justify-center px-30">
        <AuthHeader/>
        <div className="px-8">
          <h2 className="text-[32px] font-sans text-white mb-2 font-normal">
            Nutritionist Portal
          </h2>
          <p className="text-[#B4B4B4] text-sm">
            Sign in to your nutritionist account
          </p>
        </div>

        <div className="mt-8 px-8">
          <div className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-[#B4B4B4] text-sm mb-2 block">Email</label>
                <input
                  type="email"
                  placeholder="nutritionist@example.com"
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
              Are you a client?{" "}
              <a href="/auth/client/sign-in" className="text-white hover:underline">
                Sign in here
              </a>
            </p>

            <p className="text-center text-sm text-[#B4B4B4]">
              Want to become a nutritionist?{" "}
              <a href="/auth/admin/sign-up" className="text-white hover:underline">
                Apply Now
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 px-8 text-xs text-[#B4B4B4]">
          <p>
            By continuing, you agree to our{" "}
            <a href="#" className="text-white hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-white hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>

      {/* Right Section - Professional Image */}
      <div className="flex-1 flex items-center bg-[#0f0e0e] justify-center border-l border-[#2D2D2D] p-16">
        <div className="max-w-[520px]">
          <div className="text-[80px] text-[#2D2D2D] leading-none mb-4">"</div>
          <p className="text-[24px] leading-normal text-white mb-8">
            Join our network of professional nutritionists and help people achieve their health goals through personalized nutrition plans.
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

export default AdminSignInPage;
