import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useGetCurrentUserQuery } from "@/features/auth/authApiSlice";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Settings, 
  Bell, 
  Building2, 
  ShieldCheck, 
  Truck, 
  CreditCard,
  KeyRound,
  Mail,
  Printer,
  ChevronLeft
} from "lucide-react";

// Import Settings Components
import PreferencesSettings from "./components/PreferencesSettings";
import PasswordSettings from "./components/PasswordSettings";
import NotificationSettings from "./components/NotificationSettings";
import AccountSettings from "./components/AccountSettings";
import UserPermissionSettings from "./components/UserPermissionSettings";
import CourierSettings from "./components/CourierSettings";
import BillingSettings from "./components/BillingSettings";
import ProfileSettings from "./components/ProfileSettings";
import SmtpSettings from "./components/SmtpSettings";

import ReceiptSettings from "./components/ReceiptSettings";

const SettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get("tab") || "profile";
  const { t } = useTranslation();
  const { data: currentUser, isLoading: isLoadingUser } =
    useGetCurrentUserQuery();

  // Redirect to default tab if none provided
  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: "profile" }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Update Password", icon: KeyRound },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "account", label: "Account", icon: Building2 },
    { id: "permissions", label: "Permissions", icon: ShieldCheck },
    { id: "courier", label: "Courier Integration", icon: Truck },
    { id: "billings", label: "Billings", icon: CreditCard },
    { id: "smtp", label: "SMTP", icon: Mail },

    { id: "receipt-print", label: "Receipt Print URL", icon: Printer },
  ];

  const renderContent = () => {
    if (
      isLoadingUser &&
      (activeTab === "profile" ||
        activeTab === "password" ||
        activeTab === "account" ||
        activeTab === "courier" ||
        activeTab === "billings" ||
        activeTab === "notifications")
    ) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-10 w-10 border-2 border-violet-600 border-t-transparent rounded-full" />
        </div>
      );
    }
    switch (activeTab) {
      case "profile":
        return <ProfileSettings user={currentUser} />;
      case "password":
        return <PasswordSettings user={currentUser} />;
      case "preferences":
        return <PreferencesSettings />;
      case "notifications":
        return <NotificationSettings user={currentUser} />;
      case "account":
        return <AccountSettings user={currentUser} />;
      case "permissions":
        return <UserPermissionSettings />;
      case "courier":
        return <CourierSettings user={currentUser} />;
      case "billings":
        return <BillingSettings user={currentUser} />;
      case "smtp":
        return <SmtpSettings />;

      case "receipt-print":
        return <ReceiptSettings />;
      default:
        return <ProfileSettings user={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-200"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                Settings
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Manage your courier orders, track deliveries, and handle returns
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="sticky top-0 z-20 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-hidden">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-[20px] p-1.5 shadow-sm">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap",
                      isActive 
                        ? "text-white" 
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-violet-500/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-gray-500 dark:text-gray-400")} />
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
