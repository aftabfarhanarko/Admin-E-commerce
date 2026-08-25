import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// components
import SubmitButton from "@/components/buttons/SubmitButton";
import TextField from "@/components/input/TextField";
import { FooterLogo } from "@/components/logo/nav-logo";
import ThemeToggle from "@/components/theme/ThemeToggle";

// hooks and function
import { superadminLoggedIn } from "@/features/superadminAuth/superadminAuthSlice";
import { useSuperadminLoginMutation } from "@/features/superadminAuth/superadminAuthApiSlice";

// icons
import { letter, password } from "@/assets/icons/svgIcons";

const SuperAdminLoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { handleSubmit, register } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [superadminLogin] = useSuperadminLoginMutation();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const result = await superadminLogin({
                name: data.name,
                password: data.password,
            }).unwrap();
            
            // Verify response structure
            if (result && result.accessToken) {
                dispatch(superadminLoggedIn({
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken || null,
                    user: result.user || null,
                }));
                toast.success("Super Admin Login Successful!");
                navigate("/superadmin");
            } else {
                toast.error("Login failed: Invalid response from server.");
            }
        } catch (error) {
            // Handle different error formats
            let errorMessage = "Invalid name or password!";
            
            if (error?.data?.message) {
                errorMessage = error.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            } else if (error?.error?.data?.message) {
                errorMessage = error.error.data.message;
            } else if (error?.error?.message) {
                errorMessage = error.error.message;
            }
            
            toast.error(errorMessage);
            console.error("Superadmin login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Theme Toggle */}
            <div className="absolute top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-violet-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[70%] h-[70%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            {/* Login Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10 px-6"
            >
                <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 md:p-10 overflow-hidden relative">
                    {/* Top Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600" />
                    
                    {/* Logo Section */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="scale-110 mb-6">
                            <FooterLogo />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
                            Super Admin
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 text-center">
                            Enter your credentials to access the panel
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                        <TextField
                            placeholder="Your Name"
                            type="text"
                            register={register}
                            name="name"
                            icon={letter}
                            disabled={isLoading}
                            required
                            className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-violet-500 dark:focus:border-violet-500 rounded-xl"
                        />
                        <TextField
                            placeholder="Type your Password"
                            register={register}
                            name="password"
                            type="password"
                            icon={password}
                            disabled={isLoading}
                            required
                            className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-violet-500 dark:focus:border-violet-500 rounded-xl"
                        />

                        <SubmitButton
                            isLoading={isLoading}
                            disabled={isLoading}
                            className="mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl h-12 shadow-lg shadow-violet-500/25 transition-all duration-300 transform hover:scale-[1.02]"
                        >
                            {isLoading ? "Logging In..." : "Login to Dashboard"}
                        </SubmitButton>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            Secured by Admin Console
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SuperAdminLoginPage;








