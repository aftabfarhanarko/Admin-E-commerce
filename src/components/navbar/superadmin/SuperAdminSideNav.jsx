import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Users,
  Headset,
  LayoutDashboard,
  Package,
  FileText,
  Palette,
  Shield,
  UserCircle,
  X,
} from "lucide-react";
import BdtIcon from "@/components/icons/BdtIcon";
import LanguageSwitcher from "@/components/language/LanguageSwitcher";

const SuperAdminSideNav = ({ onLinkClick }) => {
  const { t } = useTranslation();
  const items = [
    {
      labelKey: "superadmin.overview",
      to: "/superadmin",
      Icon: LayoutDashboard,
      end: true, // Only active if exact match
    },
    {
      labelKey: "superadmin.earnings",
      to: "/superadmin/earnings",
      Icon: BdtIcon,
    },
    {
      labelKey: "superadmin.ourCustomers",
      to: "/superadmin/customers",
      Icon: Users,
    },
    {
      labelKey: "superadmin.packages",
      to: "/superadmin/packages",
      Icon: Package,
    },
    { labelKey: "superadmin.themes", to: "/superadmin/themes", Icon: Palette },
    {
      labelKey: "superadmin.invoices",
      to: "/superadmin/invoices",
      Icon: FileText,
    },
    {
      labelKey: "superadmin.support",
      to: "/superadmin/support",
      Icon: Headset,
    },
    {
      labelKey: "superadmin.superAdmins",
      to: "/superadmin/superadmins",
      Icon: Shield,
    },
    {
      labelKey: "superadmin.myProfile",
      to: "/superadmin/profile",
      Icon: UserCircle,
    },
  ];

  return (
    <div className="h-full flex flex-col py-4 relative">
      {/* Mobile Close Button */}
      {onLinkClick && (
        <button
          onClick={onLinkClick}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Brand */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white grid place-items-center shadow-xl shadow-violet-500/30 hover:scale-110 transition-transform duration-300 cursor-pointer">
          <Shield className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
            Admin Console
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            Super Admin
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-4 pb-2 text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
          {t("superadmin.mainSections")}
        </div>
        
        {items.map(({ labelKey, to, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onLinkClick}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:translate-x-1
               ${
                 isActive
                   ? "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300"
                   : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
               }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  }`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <span>{t(labelKey)}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/50">
        <LanguageSwitcher variant="full" />
      </div>
    </div>
  );
};

export default SuperAdminSideNav;
