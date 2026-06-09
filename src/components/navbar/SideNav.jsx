import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useTranslation } from "react-i18next";
import { navSections } from "./data";
import { hasPermission } from "@/constants/feature-permission";
import { userLoggedOut } from "@/features/auth/authSlice";
import { useGetCategoriesQuery } from "@/features/category/categoryApiSlice";
import { useGetCurrentUserQuery } from "@/features/auth/authApiSlice";
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  User,
} from "lucide-react";

// Custom Bag Icon Component
const BagIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="currentColor"
    {...props}
  >
    <path d="M16 6a4 4 0 10-8 0H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-3zm-6 0a2 2 0 114 0H10z"></path>
  </svg>
);

/**
 * Filter navigation items based on user permissions.
 * Employee: only items with explicit permission; show parent if any child has permission.
 */
const getFilteredNav = (user) => {
  if (!user) return [];

  const baseSections = navSections
    .filter((section) => {
      return true;
    })
    .map((section) => {
      // Handle direct link sections (like Global Navlinks)
      if (section.link) {
        if (hasPermission(user, section.permission)) {
          return section;
        }
        return null;
      }

      // For reseller role, hide specific items from the Orders section
      let sectionItems = section.items || [];
      if (user.role === "RESELLER" && section.id === "orders") {
        sectionItems = sectionItems.filter(
          (item) => item.title !== "Credit Notes" && item.title !== "Courier",
        );
      }

      return {
        id: section.id,
        title: section.title,
        tKey: section.tKey,
        icon: section.icon,
        items: sectionItems
          .filter(
            (item) =>
              hasPermission(user, item.permission) ||
              (item?.children?.length &&
                item.children.some((child) =>
                  hasPermission(user, child.permission),
                )),
          )
          .map((item) => ({
            label: item.title,
            tKey: item.tKey,
            to: item.link,
            icon: item.icon,
            badge: item.title === "Review" ? "02" : undefined,
            children: item?.children?.filter((child) =>
              hasPermission(user, child.permission),
            ),
          }))
          .filter((item) =>
            item.children?.length ? item.children.length > 0 : true,
          ),
      };
    })
    .filter((section) => section && (section.link || section.items.length > 0));

  // For reseller role, prepend direct links to reseller dashboard & profile
  if (user.role === "RESELLER") {
    const resellerDashboardLink = {
      id: "reseller-dashboard",
      title: "Merchant Dashboard",
      tKey: null,
      icon: LayoutDashboard,
      link: "/merchant",
      permission: null,
    };

    const resellerProfileLink = {
      id: "reseller-profile",
      title: "My Profile",
      tKey: null,
      icon: User,
      link: "/merchant/profile",
      permission: null,
    };

    return [resellerDashboardLink, resellerProfileLink, ...baseSections];
  }

  return baseSections;
};

/**
 * Collapsible Section Component
 * Renders a top-level Accordion Item (e.g. "Orders", "Inventory")
 */
function CollapsibleSection({ section, isCollapsed, t }) {
  const [isOpen, setIsOpen] = useState(false); // Default closed to match accordion style usually
  const location = useLocation();
  const Icon = section.icon;

  // Auto-expand if any child is active
  useEffect(() => {
    const isChildActive = section.items.some((item) => {
      if (item.children) {
        return item.children.some((child) => {
          if (child.link.includes("?")) {
            return child.link === location.pathname + location.search;
          }
          return location.pathname.startsWith(child.link);
        });
      }
      return location.pathname.startsWith(item.to);
    });
    if (isChildActive) setIsOpen(true);
  }, [location.pathname, location.search, section.items]);

  const toggleSection = useCallback(() => {
    setIsOpen((v) => !v);
  }, []);

  if (isCollapsed) {
    // Simplified view for collapsed state
    return (
      <div className="mb-2 px-2 flex justify-center group relative">
        <button className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
          {Icon && <Icon size={20} strokeWidth={1.5} />}
        </button>
        {/* Tooltip on hover */}
        <div className="absolute left-full top-2 ml-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
          {section.tKey ? t(section.tKey) : section.title}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-1 px-4">
      {/* Section Header (Accordion Toggle) */}
      <div
        onClick={toggleSection}
        className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer select-none transition-all duration-200
          ${
            isOpen
              ? "text-black dark:text-white font-semibold"
              : "text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
          }`}
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <Icon
              size={20}
              strokeWidth={1.5}
              className={isOpen ? "text-[#8B5CF6]" : ""}
            />
          )}
          {/* Side Bar Text And COlor Size Set  */}
          <span className="text-[15px] tracking-wide font-medium capitalize">
            {(section.tKey ? t(section.tKey) : section.title).toLowerCase()}
          </span>
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </div>

      {/* Items List (Tree Structure) */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 mt-1"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1 pl-4 relative">
            {/* Vertical Tree Line */}
            <div className="absolute left-[29px] top-0 bottom-4 w-px bg-gray-200 dark:bg-gray-800" />

            {section.items.map((item, index) => (
              <Item
                key={index}
                item={item}
                isLast={index === section.items.length - 1}
                t={t}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

CollapsibleSection = memo(CollapsibleSection);

/**
 * Navigation Item Component
 * Renders individual links or nested sub-menus
 */
function Item({ item, isLast, t }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(item.to);
  const hasChildren = item.children && item.children.length > 0;

  // State for collapsible submenu
  const [isOpen, setIsOpen] = useState(false);

  // Auto-expand if child is active
  useEffect(() => {
    if (hasChildren) {
      const isChildActive = item.children.some((child) => {
        if (child.link.includes("?")) {
          return child.link === location.pathname + location.search;
        }
        return location.pathname.startsWith(child.link);
      });
      if (isChildActive) setIsOpen(true);
    }
  }, [location.pathname, location.search, hasChildren, item.children]);

  // Render Branch Connector
  const Branch = () => (
    <div className="absolute left-[-11px] top-1/2 -translate-y-1/2 w-3 h-px bg-gray-200 dark:bg-gray-800">
      {/* Curve corner effect could go here if we wanted exact curve matching, but straight lines are cleaner for dynamic lists */}
      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#8B5CF6]" : "bg-gray-200 dark:bg-gray-800"} hidden`}
      />
    </div>
  );

  if (hasChildren) {
    // If item has children (e.g. Invoices -> List, Recurring), render as collapsible sub-menu
    return (
      <div className="relative pl-10 py-1">
        <Branch />
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between cursor-pointer group pr-2 mb-1 select-none"
        >
          <div className="flex items-center gap-3">
            {item.icon && <item.icon size={16} strokeWidth={1.5} />}
            <span
              className={`text-[13px] font-medium transition-colors ${
                isOpen
                  ? "text-black dark:text-white"
                  : "text-black dark:text-white"
              }`}
            >
              {item.label}
            </span>
          </div>
          <ChevronRight
            size={14}
            className={`text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-90" : ""
            }`}
          />
        </div>

        <div
          className={`flex flex-col gap-1 border-l border-gray-200 dark:border-gray-800 pl-3 ml-1 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
        >
          {item.children.map((child, idx) => (
            <NavLink
              key={idx}
              to={child.link}
              className={({ isActive }) => {
                // Custom active check for query params
                const isExactActive = child.link.includes("?")
                  ? child.link === location.pathname + location.search
                  : isActive;

                return `flex items-center gap-2 text-[13px] py-1.5 px-2 rounded-lg transition-colors relative font-medium
                ${
                  isExactActive
                    ? "text-[#8B5CF6] bg-[#8B5CF6]/5"
                    : "text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
                }`;
              }}
            >
              {child.icon && <child.icon size={16} strokeWidth={1.5} />}
              <span>{child.title}</span>
            </NavLink>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative pl-10 pr-2">
      <Branch />
      <NavLink
        to={item.to}
        end
        className={({ isActive }) =>
          `flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-200 font-medium
           ${
             isActive
               ? "bg-white dark:bg-white/5 text-[#8B5CF6] shadow-sm border border-gray-100 dark:border-gray-800"
               : "text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5"
           }`
        }
      >
        {item.icon && <item.icon size={16} strokeWidth={1.5} />}
        <span className="text-[13px] truncate">
          {item.tKey ? t(item.tKey) : item.label}
        </span>
        {item.badge && (
          <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            {item.badge}
          </span>
        )}
      </NavLink>
    </div>
  );
}

Item = memo(Item);

/**
 * SideNav Component
 * Main sidebar navigation component
 */
export default function SideNav({ isMobileMenuOpen, setIsMobileMenuOpen }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Fetch user data
  const { data: user } = useGetCurrentUserQuery();

  // Pre-fetch categories
  useGetCategoriesQuery();

  // Filtered navigation based on user permissions (recomputed only when user changes)
  const nav = useMemo(() => getFilteredNav(user), [user]);

  const companyName =
    user?.companyName ||
    user?.company?.name ||
    user?.storeName ||
    user?.name ||
    "SquadCart";
  const companyLogo = user?.companyLogo || user?.company?.logo || user?.logo;

  const handleLogout = useCallback(() => {
    dispatch(userLoggedOut());
    navigate("/login");
  }, [dispatch, navigate]);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((v) => !v);
  }, []);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-[100] lg:sticky lg:top-0 h-screen 
        ${isCollapsed ? "w-[80px]" : "w-[280px]"} 
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} 
        bg-white dark:bg-black/95 backdrop-blur-2xl
        border-r border-gray-100 dark:border-white/5
        flex flex-col transition-all duration-300 ease-out shadow-xl lg:shadow-none`}
      >
        {/* Brand Header */}
        <div
          className={`px-6 py-6 flex items-center gap-4 transition-all duration-300 ${isCollapsed ? "justify-center px-2" : ""}`}
        >
          <div className="relative group cursor-pointer shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center shadow-lg shadow-gray-200/50 dark:shadow-none overflow-hidden transition-transform duration-300 group-hover:scale-105">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  className="w-full h-full object-cover"
                  alt="Logo"
                />
              ) : (
                <div className="bg-gradient-to-br from-violet-600 to-indigo-600 w-full h-full flex items-center justify-center text-white font-bold text-xl">
                  {companyName?.charAt(0)}
                </div>
              )}
            </div>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
              <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white tracking-tight">
                {companyName}
              </h1>
            </div>
          )}
        </div>

        {/* Dashboard Link - hidden for reseller role */}
        {user?.role !== "RESELLER" && (
          <div className="px-4 pt-4 pb-2">
            {isCollapsed ? (
              <div className="flex justify-center mb-2">
                <Link
                  to="/"
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    location.pathname === "/"
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                      : "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-white/5"
                  }`}
                >
                  <LayoutDashboard size={24} strokeWidth={1.5} />
                </Link>
              </div>
            ) : (
              <Link
                to="/"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  location.pathname === "/"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/20"
                    : "text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-white"
                }`}
              >
                {location.pathname === "/" && (
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                <LayoutDashboard
                  size={22}
                  strokeWidth={1.5}
                  className={`relative z-10 ${
                    location.pathname === "/" ? "text-white" : ""
                  }`}
                />
                <span className="font-bold text-[15px] tracking-wide relative z-10">
                  {t("nav.dashboard")}
                </span>
              </Link>
            )}
          </div>
        )}

        {/* Navigation Items - Scrollable Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
          <nav className="flex flex-col gap-1">
            {nav.map((section) =>
              section.link ? (
                isCollapsed ? (
                  <div
                    key={section.id}
                    className="mb-2 px-2 flex justify-center group relative"
                  >
                    <Link
                      to={section.link}
                      className={`p-2 rounded-xl transition-colors ${
                        location.pathname === section.link
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                          : "hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      {section.icon && (
                        <section.icon size={20} strokeWidth={1.5} />
                      )}
                    </Link>
                    <div className="absolute left-full top-2 ml-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                      {section.tKey ? t(section.tKey) : section.title}
                    </div>
                  </div>
                ) : (
                  <div key={section.id} className="px-4 mb-1">
                    <Link
                      to={section.link}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                        location.pathname === section.link
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/20"
                          : "text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-white"
                      }`}
                    >
                      {location.pathname === section.link && (
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                      {section.icon && (
                        <section.icon
                          size={22}
                          strokeWidth={1.5}
                          className={`relative z-10 ${location.pathname === section.link ? "text-white" : ""}`}
                        />
                      )}
                      <span className="font-bold text-[15px] tracking-wide relative z-10">
                        {section.tKey ? t(section.tKey) : section.title}
                      </span>
                    </Link>
                  </div>
                )
              ) : (
                <CollapsibleSection
                  key={section.id}
                  section={section}
                  isCollapsed={isCollapsed}
                  t={t}
                />
              ),
            )}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 space-y-1 mt-auto pb-6">
          <button
            onClick={toggleSidebar}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200 group ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            {isCollapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelLeftClose
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
            )}
            {!isCollapsed && (
              <span className="text-[13px] font-medium">
                {t("common.collapseSidebar")}
              </span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200 group ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <LogOut
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
            {!isCollapsed && (
              <span className="text-[13px] font-medium">
                {t("common.logout")}
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
