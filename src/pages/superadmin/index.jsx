import { useMemo, useState, useEffect } from "react";
import {
  Users,
  Headset,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Star,
  Shield,
} from "lucide-react";
import BdtIcon from "@/components/icons/BdtIcon";
import { useGetOverviewQuery } from "@/features/overview/overviewApiSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SmtpSettings from "@/pages/settings/components/SmtpSettings";

const SuperAdminOverviewPage = () => {
  const { data: overviewData } = useGetOverviewQuery();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date
      .toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `BD Tk ${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const kpis = useMemo(() => {
    const kpiData = overviewData?.kpis || {};

    // Helper for trend direction
    const getTrendDir = (val) => (val >= 0 ? "up" : "down");

    // Helper for absolute percentage string
    const getTrendStr = (val) => `${Math.abs(val || 0).toFixed(1)}%`;

    return [
      {
        label: "Total Earnings",
        value: formatCurrency(kpiData.totalEarnings),
        trend: getTrendStr(kpiData.totalEarningsDelta),
        trendDir: getTrendDir(kpiData.totalEarningsDelta || 0),
        icon: BdtIcon,
        bg: "bg-violet-50 dark:bg-violet-900/20",
        color: "text-violet-600 dark:text-violet-400",
        wave: "text-violet-500",
      },
      {
        label: "Active Customers",
        value: new Intl.NumberFormat("en-US").format(
          kpiData.activeCustomers || 0,
        ),
        trend: getTrendStr(kpiData.activeCustomersDelta),
        trendDir: getTrendDir(kpiData.activeCustomersDelta || 0),
        icon: Users,
        bg: "bg-blue-50 dark:bg-blue-900/20",
        color: "text-blue-600 dark:text-blue-400",
        wave: "text-blue-500",
      },
      {
        label: "Open Support Tickets",
        value: String(kpiData.openSupportTickets || 0),
        trend: getTrendStr(kpiData.openSupportTicketsDelta),
        trendDir: getTrendDir(kpiData.openSupportTicketsDelta || 0),
        icon: Headset,
        bg: "bg-rose-50 dark:bg-rose-900/20",
        color: "text-rose-600 dark:text-rose-400",
        wave: "text-rose-500",
      },
    ];
  }, [overviewData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page header */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-[24px] bg-white dark:bg-[#1a1f26] p-4 sm:p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 w-full"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 flex-wrap">
          {/* Left Side: Greeting */}
          <div className="space-y-2 w-full md:w-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1e1b4b] dark:text-white">
              {getGreeting()}, Admin
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm md:text-base font-medium text-slate-500 dark:text-slate-400 flex-wrap">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span>Track your growth and revenue |</span>
            </div>
          </div>

          {/* Right Side: Time & Date */}
          <div className="flex flex-col items-start md:items-end text-left md:text-right w-full md:w-auto mt-2 md:mt-0">
            <div className="text-lg sm:text-xl md:text-2xl font-black text-[#1e1b4b] dark:text-white tabular-nums tracking-tight">
              {formatTime(currentTime)}
            </div>
            <div className="text-[10px] sm:text-xs md:text-sm font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mt-1">
              {formatDate(currentTime)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI cards - Wave Design */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {kpis.map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-[#1a1f26] rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-300`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                {stat.value}
              </h3>

              <div className="flex items-center gap-2">
                <span
                  className={`
                  inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md border
                  ${
                    stat.trendDir === "up"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-500/20"
                      : "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-500/20"
                  }
                `}
                >
                  {stat.trendDir === "up" ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {stat.trend}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  vs last month
                </span>
              </div>
            </div>

            {/* Wave Graphic */}
            <div
              className={`absolute bottom-0 right-0 w-32 h-24 opacity-10 ${stat.wave}`}
            >
              <svg
                viewBox="0 0 100 60"
                fill="currentColor"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                <path d="M0 60 C 20 60, 20 20, 50 20 C 80 20, 80 50, 100 50 L 100 60 Z" />
              </svg>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Two-column layout: customers + support */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Customers summary */}
        <section className="lg:col-span-2 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/20 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                Customer Activity
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Snapshot of recent customer growth and retention.
              </p>
            </div>
            <Link
              to="/superadmin/customers"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              View all customers
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-auto">
            <div className="group p-6 rounded-[24px] bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  <Star className="w-4 h-4" />
                </div>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  New (7d)
                </p>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {overviewData?.customers?.newCustomersLast7Days || 0}
              </p>
              <p className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg inline-block">
                {overviewData?.customers?.newCustomersLast7Days > 0
                  ? "+12.3% vs last week"
                  : "No new customers"}
              </p>
            </div>

            <div className="group p-6 rounded-[24px] bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                  <Activity className="w-4 h-4" />
                </div>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  Retention
                </p>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {overviewData?.customers?.returningCustomersPercentage || 0}%
              </p>
              <p className="text-xs font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-lg inline-block">
                {overviewData?.customers?.returningCustomersPercentage > 50
                  ? "Healthy loyalty"
                  : "Building loyalty"}
              </p>
            </div>

            <div className="group p-6 rounded-[24px] bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400">
                  <Shield className="w-4 h-4" />
                </div>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  At-Risk
                </p>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {overviewData?.customers?.atRiskCustomers || 0}
              </p>
              <p className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded-lg inline-block">
                {overviewData?.customers?.atRiskCustomers > 0
                  ? "Action needed"
                  : "All good!"}
              </p>
            </div>
          </div>
        </section>

        {/* Support */}
        <section className="rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 flex flex-col h-full shadow-xl shadow-slate-200/50 dark:shadow-black/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 dark:bg-rose-900/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Headset className="w-5 h-5 text-rose-500" />
              Support
            </h2>
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20">
              {overviewData?.kpis?.openSupportTickets || 0} Pending
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center p-4 relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-100 to-orange-100 dark:from-rose-900/30 dark:to-orange-900/30 flex items-center justify-center mb-6 shadow-lg shadow-rose-500/10">
              <div className="relative">
                <Headset className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                {overviewData?.kpis?.openSupportTickets > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                )}
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Help Center Inbox
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-[240px] leading-relaxed">
              You have {overviewData?.kpis?.openSupportTickets || 0} pending
              tickets waiting for your response.
            </p>

            <Link
              to="/superadmin/support"
              className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Go to Inbox
            </Link>
          </div>
        </section>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SmtpSettings scope="superadmin" />
      </motion.div>
    </motion.div>
  );
};

export default SuperAdminOverviewPage;
