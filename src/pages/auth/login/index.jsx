import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Lottie from "lottie-react";
import { Mail, Lock } from "lucide-react";

// components
import SubmitButton from "@/components/buttons/SubmitButton";
import TextField from "@/components/input/TextField";

// hooks and function
import { useLoginSystemuserMutation } from "@/features/systemuser/systemuserApiSlice";
import { useSuperadminLoginMutation } from "@/features/superadminAuth/superadminAuthApiSlice";
import { userLoggedIn } from "@/features/auth/authSlice";
import { superadminLoggedIn } from "@/features/superadminAuth/superadminAuthSlice";
import { decodeJWT } from "@/utils/jwt-decoder";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const { handleSubmit, register } = useForm({
    defaultValues: {
      email: email || "",
      password: "",
    },
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/enterprice.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error("Error loading animation:", error));
  }, []);

  const [loginSystemuser, { isLoading: loginLoading }] =
    useLoginSystemuserMutation();
  const [superadminLogin, { isLoading: superadminLoading }] =
    useSuperadminLoginMutation();

  const isLoading = loginLoading || superadminLoading;

  const onSubmit = async (data) => {
    try {
      const loginCredential = data.email;
      if (!data.password) {
        toast.error(t("auth.passwordRequired"));
        return;
      }

      // 1st: Try systemuser login (uses email)
      const loginRes = await loginSystemuser({
        email: loginCredential,
        password: data.password,
      });

      if (loginRes?.data) {
        const responseData = loginRes.data;
        const accessToken =
          responseData?.accessToken || responseData?.data?.accessToken;
        const refreshToken =
          responseData?.refreshToken || responseData?.data?.refreshToken;

        if (accessToken) {
          const { payload } = decodeJWT(accessToken);
          const userRole = payload.role || responseData?.user?.role;

          if (
            userRole === "SYSTEM_OWNER" ||
            userRole === "EMPLOYEE" ||
            userRole === "RESELLER"
          ) {
            dispatch(
              userLoggedIn({ accessToken, refreshToken, rememberMe: false }),
            );
            toast.success(t("auth.loginSuccess"));
            if (userRole === "RESELLER") {
              navigate("/merchant");
            } else {
              navigate("/");
            }
            return;
          }
        }
      } else if (loginRes?.error?.data?.message) {
        const msg = loginRes.error.data.message;
        if (
          typeof msg === "string" &&
          msg.toLowerCase().includes("reseller account is inactive")
        ) {
          navigate("/merchant-inactive", { state: { message: msg } });
          return;
        }
      }

      // 2nd: Try superadmin login if systemuser failed
      let superadminResult;
      try {
        superadminResult = await superadminLogin({
          email: loginCredential,
          password: data.password,
        }).unwrap();
      } catch (superadminErr) {
        // Both failed, show exact error toast
        const errorMessage =
          loginRes?.error?.data?.message ||
          superadminErr?.data?.message ||
          "Invalid email or password";
        
        toast.error(typeof errorMessage === "string" ? errorMessage : "Invalid email or password");
        return;
      }

      let accessToken = null;
      let refreshToken = null;
      let user = null;

      if (superadminResult?.accessToken) {
        accessToken = superadminResult.accessToken;
        refreshToken = superadminResult.refreshToken || null;
        user = superadminResult.user || null;
      }

      if (accessToken) {
        const { payload } = decodeJWT(accessToken);
        if (payload.role === "SUPER_ADMIN") {
          dispatch(superadminLoggedIn({ accessToken, refreshToken, user }));
          toast.success(t("auth.superadminLoginSuccess"));
          navigate("/superadmin");
          return;
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left Side - Branding & Illustration (50%) */}
      <div className="hidden md:flex md:w-1/2 bg-white flex-col relative px-12 py-12 justify-between border-r border-gray-50">
        <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 leading-tight mb-2 tracking-tight">
            Seamlessly Manage Your
          </h1>
          <h1 className="text-4xl lg:text-5xl font-bold text-[#7c3aed] leading-tight mb-4 tracking-tight">
            Enterprise Operations
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-md leading-relaxed">
            Streamline your supply chain, optimize inventory, and scale your
            business with our next-gen admin console.
          </p>

          <div className="relative w-full aspect-square max-w-7xl mx-auto flex items-center justify-center">
            {animationData ? (
              <Lottie
                animationData={animationData}
                loop={true}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                Loading animation...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form (50%) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 bg-white relative">
        <div className="absolute top-0 right-0 p-8">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto bg-white p-10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)]  border border-gray-100">
          <div className="mb-10 text-center">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#7c3aed]">
              <Lock size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
              Welcome Back <br />
              <span className="text-[#7c3aed]">Your Company Console</span>
            </h2>
            <p className="text-gray-500 text-sm">
              Please enter your details to sign in
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <TextField
                  placeholder="people05squadcart@gmail.com"
                  type="email"
                  register={register}
                  name="email"
                  disabled={isLoading}
                  icon={<Mail size={18} />}
                  inputClassName="!rounded-xl !border-gray-200 !bg-gray-50/50 focus:!bg-white focus:!border-[#7c3aed] focus:!ring-[#7c3aed]/20 !py-3.5 !text-sm !font-medium !text-gray-900 !placeholder-gray-400 transition-all duration-300"
                  className="!mb-0"
                />
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest ml-1">
                    Password
                  </label>
                  <TextField
                    placeholder="Enter password"
                    register={register}
                    name="password"
                    type="password"
                    disabled={isLoading}
                    icon={<Lock size={18} />}
                    inputClassName="!rounded-xl !border-gray-200 !bg-gray-50/50 focus:!bg-white focus:!border-[#7c3aed] focus:!ring-[#7c3aed]/20 !py-3.5 !text-sm !font-medium !text-gray-900 !placeholder-gray-400 transition-all duration-300"
                    className="!mb-0"
                  />

                  <div className="flex items-center justify-end mt-4">
                    <Link
                      to="/forgot-password"
                      className="text-xs text-[#7c3aed] hover:text-[#6d28d9] font-bold transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <SubmitButton
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full !bg-gradient-to-r !from-[#7c3aed] !to-[#6d28d9] hover:!from-[#6d28d9] hover:!to-[#5b21b6] !text-white !font-bold !py-4 !rounded-xl !mt-4 shadow-indigo-500/30 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              {isLoading ? t("auth.loggingIn") : "Sign In to Console"}
            </SubmitButton>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400 font-medium">
                © 2026 Aftab Farhan. All rights reserved.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
