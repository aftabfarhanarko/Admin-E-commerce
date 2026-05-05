import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";

// ─── LAYOUTS (kept eager — always needed) ───────────────────────────────────
import Layout from "./layout/layout";
import SuperAdminLayout from "./layout/superadmin/layout";
import PrivateRoute from "./hooks/usePrivateRoute";
import SuperAdminPrivateRoute from "./hooks/useSuperAdminPrivateRoute";
import PermissionRoute from "./hooks/PermissionRoute";
import { FeaturePermission } from "./constants/feature-permission";

// ─── LAZY PAGE IMPORTS ───────────────────────────────────────────────────────
const ErrorPage                       = lazy(() => import("./pages/common/errorPage"));
const LoginPage                       = lazy(() => import("./pages/auth/login"));
const AdminLoginPage                  = lazy(() => import("./pages/auth/admin-login"));
const SuperAdminLoginPage             = lazy(() => import("./pages/superadmin/login"));
const UnifiedLoginPage                = lazy(() => import("./pages/auth/unified-login"));
const ResellerInactiveInfoPage        = lazy(() => import("./pages/auth/reseller-inactive"));
const ForgotPasswordRequestPage       = lazy(() => import("./pages/auth/forgot-password/password-request"));
const ResetPasswordPage               = lazy(() => import("./pages/auth/forgot-password/reset-password"));
const CheckResetPasswordEmailPage     = lazy(() => import("./pages/auth/forgot-password/check-email"));
const RegisterPage                    = lazy(() => import("./pages/auth/register"));

const DashboardPage                   = lazy(() => import("./pages/dashboard"));
const AiReportPage                    = lazy(() => import("./pages/ai-report"));
const AiLiveFeedPage                  = lazy(() => import("./pages/ai-live-feed"));
const AiSalesDirectionPage            = lazy(() => import("./pages/ai-sales-direction"));
const StatisticsPage                  = lazy(() => import("./pages/statistics"));
const ConnectedAppsPage               = lazy(() => import("./pages/connected-apps"));
const MediaPage                       = lazy(() => import("./pages/media"));
const NotificationsPage               = lazy(() => import("./pages/notifications"));

const CategoriesPage                  = lazy(() => import("./pages/categories"));
const CreateCategoryPage              = lazy(() => import("./pages/categories/create"));
const CategoryEditPage                = lazy(() => import("./pages/categories/_id/edit"));

const ProductsPage                    = lazy(() => import("./pages/products"));
const CreateProductPage               = lazy(() => import("./pages/products/create"));
const BulkUploadPage                  = lazy(() => import("./pages/products/bulk-upload"));
const ProductViewPage                 = lazy(() => import("./pages/products/_id"));
const ProductEditPage                 = lazy(() => import("./pages/products/_id/edit"));
const ProductStickerPage              = lazy(() => import("./pages/product-sticker"));
const PublicProductDetailPage         = lazy(() => import("./pages/product-detail-public"));

const InventoryPage                   = lazy(() => import("./pages/inventory"));
const InventoryHistoryPage            = lazy(() => import("./pages/inventory/history"));
const FlashSellPage                   = lazy(() => import("./pages/flash-sell"));

const CustomersPage                   = lazy(() => import("./pages/customers"));
const CreateCustomerPage              = lazy(() => import("./pages/customers/create"));
const CustomerDetailsPage             = lazy(() => import("./pages/customers/details"));

const OrdersPage                      = lazy(() => import("./pages/orders"));
const CreateOrderPage                 = lazy(() => import("./pages/orders/create"));
const OrderTrackPage                  = lazy(() => import("./pages/orders/track"));
const PublicOrderTrackingPage         = lazy(() => import("./pages/order-tracking"));
const OrderViewPage                   = lazy(() => import("./pages/orders/_id"));
const OrderEditPage                   = lazy(() => import("./pages/orders/_id/edit"));
const IncompleteOrdersPage            = lazy(() => import("./pages/incomplete-orders"));

const InvoicesPage                    = lazy(() => import("./pages/invoices"));
const CreateInvoicePage               = lazy(() => import("./pages/invoices/create"));
const SaleInvoiceDetailsPage          = lazy(() => import("./pages/invoices/[id]/details"));
const SaleInvoiceEditPage             = lazy(() => import("./pages/invoices/[id]/edit"));
const RecurringInvoicesPage           = lazy(() => import("./pages/invoices/recurring"));

const CreditNotesPage                 = lazy(() => import("./pages/credit-notes"));
const CreateCreditNotePage            = lazy(() => import("./pages/credit-notes/create"));
const CreditNoteDetailsPage           = lazy(() => import("./pages/credit-notes/_id"));

const FraudPage                       = lazy(() => import("./pages/fraud"));
const IncomePage                      = lazy(() => import("./pages/my-cash/income"));
const ExpensePage                     = lazy(() => import("./pages/my-cash/expense"));

const BannerPage                      = lazy(() => import("./pages/banner"));
const CreateBannerPage                = lazy(() => import("./pages/banner/create"));
const BannerEditPage                  = lazy(() => import("./pages/banner/_id/edit"));

const PromocodePage                   = lazy(() => import("./pages/promocode"));
const CreatePromocodePage             = lazy(() => import("./pages/promocode/create"));
const PromocodeEditPage               = lazy(() => import("./pages/promocode/_id/edit"));

const HelpPage                        = lazy(() => import("./pages/help"));
const CreateHelpPage                  = lazy(() => import("./pages/help/create"));
const HelpDetailPage                  = lazy(() => import("./pages/help/_id"));

const ReviewsPage                     = lazy(() => import("./pages/reviews"));
const ReviewDetailPage                = lazy(() => import("./pages/reviews/_id"));

const SettingsPage                    = lazy(() => import("./pages/settings"));
const ManageUsersPage                 = lazy(() => import("./pages/manageuser"));
const CreateUserPage                  = lazy(() => import("./pages/manageuser/create"));
const EditUserPage                    = lazy(() => import("./pages/manageuser/edit"));
const PermissionManagerPage           = lazy(() => import("./pages/manageuser/permissions"));
const ActivityLogsPage                = lazy(() => import("./pages/manageuser/activity-logs"));

const BannersOffersPage               = lazy(() => import("./pages/marketing/banners-offers"));
const TopProductsPage                 = lazy(() => import("./pages/top-products"));
const TopProductsCreatePage           = lazy(() => import("./pages/top-products/create"));
const TopProductsEditPage             = lazy(() => import("./pages/top-products/_id/edit"));

const PrivacyPolicyPage               = lazy(() => import("./pages/privacy-policy"));
const CreatePrivacyPolicyPage         = lazy(() => import("./pages/privacy-policy/create"));
const EditPrivacyPolicyPage           = lazy(() => import("./pages/privacy-policy/edit"));
const TermsConditionsPage             = lazy(() => import("./pages/terms-conditions"));
const CreateTermsConditionsPage       = lazy(() => import("./pages/terms-conditions/create"));
const EditTermsConditionsPage         = lazy(() => import("./pages/terms-conditions/edit"));
const RefundPolicyPage                = lazy(() => import("./pages/refund-policy"));
const CreateRefundPolicyPage          = lazy(() => import("./pages/refund-policy/create"));
const EditRefundPolicyPage            = lazy(() => import("./pages/refund-policy/edit"));

const SteadfastPage                   = lazy(() => import("./pages/steadfast"));
const PathaoPage                      = lazy(() => import("./pages/pathao"));
const RedXPage                        = lazy(() => import("./pages/redx"));
const UpgradePlanPage                 = lazy(() => import("./pages/upgrade-plan"));
const DomainFinderPage                = lazy(() => import("./pages/domain-finder"));

const ResellerDashboardPage           = lazy(() => import("./pages/reseller"));
const ResellerProfilePage             = lazy(() => import("./pages/reseller/profile"));
const ResellersListPage               = lazy(() => import("./pages/resellers-list"));
const ResellerDetailPage              = lazy(() => import("./pages/resellers-list/detail"));

// ─── SUPERADMIN ──────────────────────────────────────────────────────────────
const SuperAdminOverviewPage          = lazy(() => import("./pages/superadmin"));
const SuperAdminEarningsPage          = lazy(() => import("./pages/superadmin/earnings"));
const SuperAdminCustomersPage         = lazy(() => import("./pages/superadmin/customers"));
const SuperAdminCustomerDetailPage    = lazy(() => import("./pages/superadmin/customer-detail"));
const SuperAdminCustomerEditPage      = lazy(() => import("./pages/superadmin/customer-edit"));
const SuperAdminCustomerCreatePage    = lazy(() => import("./pages/superadmin/customer-create"));
const SuperAdminSupportPage           = lazy(() => import("./pages/superadmin/support"));
const SuperAdminSupportDetailPage     = lazy(() => import("./pages/superadmin/support-detail"));
const PackageManagementPage           = lazy(() => import("./pages/superadmin/packagemanagement"));
const PackageDetailPage               = lazy(() => import("./pages/superadmin/package-detail"));
const PackageEditPage                 = lazy(() => import("./pages/superadmin/package-edit"));
const PackageCreatePage               = lazy(() => import("./pages/superadmin/package-create"));
const ThemeManagementPage             = lazy(() => import("./pages/superadmin/thememanagement"));
const ThemeCreatePage                 = lazy(() => import("./pages/superadmin/theme-create"));
const ThemeDetailPage                 = lazy(() => import("./pages/superadmin/theme-detail"));
const ThemeEditPage                   = lazy(() => import("./pages/superadmin/theme-edit"));
const InvoiceManagementPage           = lazy(() => import("./pages/superadmin/invoice"));
const SuperAdminSuperadminsPage       = lazy(() => import("./pages/superadmin/superadmins"));
const SuperAdminSuperadminDetailPage  = lazy(() => import("./pages/superadmin/superadmin-components/superadmin-detail"));
const SuperAdminProfilePage           = lazy(() => import("./pages/superadmin/profile"));

// ─── Suspense fallback ───────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
    </div>
  </div>
);

const withSuspense = (element) => <Suspense fallback={<PageLoader />}>{element}</Suspense>;

// ─── Role-based dashboard ────────────────────────────────────────────────────
const RoleBasedDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  if (user?.role === "RESELLER") {
    return withSuspense(<ResellerDashboardPage />);
  }
  return withSuspense(
    <PermissionRoute permission={FeaturePermission.DASHBOARD}>
      <DashboardPage />
    </PermissionRoute>
  );
};

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      { path: "/", element: <RoleBasedDashboard /> },
      {
        path: "/ai-report",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.AI_REPORT}><AiReportPage /></PermissionRoute>
        ),
      },
      {
        path: "/media",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.MEDIA_MANAGEMENT}><MediaPage /></PermissionRoute>
        ),
      },
      {
        path: "/ai-live-feed",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.AI_LIVE_FEED}><AiLiveFeedPage /></PermissionRoute>
        ),
      },
      {
        path: "/ai-sales-direction",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.AI_SALES_DIRECTION}><AiSalesDirectionPage /></PermissionRoute>
        ),
      },
      {
        path: "/statistics",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.STATS}><StatisticsPage /></PermissionRoute>
        ),
      },
      {
        path: "/connected-apps",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.CONNECTED_APPS}><ConnectedAppsPage /></PermissionRoute>
        ),
      },
      {
        path: "/banners-offers",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.BANNERS_OFFERS_MARKETING}><BannersOffersPage /></PermissionRoute>
        ),
      },
      {
        path: "/top-products",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.SETTINGS}><TopProductsPage /></PermissionRoute>
        ),
      },
      {
        path: "/top-products/create",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.SETTINGS}><TopProductsCreatePage /></PermissionRoute>
        ),
      },
      {
        path: "/top-products/:id/edit",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.THEME_MANAGEMENT}><TopProductsEditPage /></PermissionRoute>
        ),
      },
      {
        path: "/categories",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.CATEGORY}><CategoriesPage /></PermissionRoute>
        ),
      },
      {
        path: "/categories/create",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.CATEGORY}><CreateCategoryPage /></PermissionRoute>
        ),
      },
      {
        path: "/categories/:id/edit",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.CATEGORY}><CategoryEditPage /></PermissionRoute>
        ),
      },
      {
        path: "/products",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.PRODUCTS}><ProductsPage /></PermissionRoute>
        ),
      },
      {
        path: "/products/create",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.PRODUCTS}><CreateProductPage /></PermissionRoute>
        ),
      },
      {
        path: "/products/bulk-upload",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.PRODUCT_BULK_UPLOAD}><BulkUploadPage /></PermissionRoute>
        ),
      },
      {
        path: "/products/:id",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.PRODUCTS}><ProductViewPage /></PermissionRoute>
        ),
      },
      {
        path: "/products/:id/edit",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.PRODUCTS}><ProductEditPage /></PermissionRoute>
        ),
      },
      {
        path: "/product-sticker",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.PRODUCTS}><ProductStickerPage /></PermissionRoute>
        ),
      },
      {
        path: "/inventory",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.INVENTORY_MANAGEMENT}><InventoryPage /></PermissionRoute>
        ),
      },
      {
        path: "/inventory/:id/history",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.INVENTORY_HISTORY}><InventoryHistoryPage /></PermissionRoute>
        ),
      },
      {
        path: "/flash-sell",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.FLASH_SELL}><FlashSellPage /></PermissionRoute>
        ),
      },
      {
        path: "/customers",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.CUSTOMERS}><CustomersPage /></PermissionRoute>
        ),
      },
      {
        path: "/customers/create",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.CUSTOMERS}><CreateCustomerPage /></PermissionRoute>
        ),
      },
      {
        path: "/customers/:id",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.CUSTOMERS}><CustomerDetailsPage /></PermissionRoute>
        ),
      },
      {
        path: "/orders",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.ORDERS}><OrdersPage /></PermissionRoute>
        ),
      },
      {
        path: "/invoices",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.ORDER_INVOICE_FINANCE}><InvoicesPage /></PermissionRoute>
        ),
      },
      {
        path: "/invoices/create",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.SALE_INVOICE_MANAGEMENT}><CreateInvoicePage /></PermissionRoute>
        ),
      },
      {
        path: "/invoices/:id/edit",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.SALE_INVOICE_MANAGEMENT}><SaleInvoiceEditPage /></PermissionRoute>
        ),
      },
      {
        path: "/invoices/:id",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.SALE_INVOICE_MANAGEMENT}><SaleInvoiceDetailsPage /></PermissionRoute>
        ),
      },
      {
        path: "/recurring-invoices",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.SALE_INVOICE_MANAGEMENT}><RecurringInvoicesPage /></PermissionRoute>
        ),
      },
      {
        path: "/credit-notes",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.ORDER_INVOICE_FINANCE}><CreditNotesPage /></PermissionRoute>
        ),
      },
      {
        path: "/credit-notes/create",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.ORDER_INVOICE_FINANCE}><CreateCreditNotePage /></PermissionRoute>
        ),
      },
      {
        path: "/credit-notes/:id",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.ORDER_INVOICE_FINANCE}><CreditNoteDetailsPage /></PermissionRoute>
        ),
      },
      {
        path: "/orders/create",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.ORDER_CREATION_MANUAL}><CreateOrderPage /></PermissionRoute>
        ),
      },
      {
        path: "/orders/track",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.ORDER_TRACKING}><OrderTrackPage /></PermissionRoute>
        ),
      },
      {
        path: "/orders/:id",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.ORDERS}><OrderViewPage /></PermissionRoute>
        ),
      },
      {
        path: "/orders/:id/edit",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.ORDER_EDIT}><OrderEditPage /></PermissionRoute>
        ),
      },
      {
        path: "/fraud",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.FRUAD_CHECKER}><FraudPage /></PermissionRoute>
        ),
      },
      {
        path: "/my-cash/income",
        element: withSuspense(<PermissionRoute><IncomePage /></PermissionRoute>),
      },
      {
        path: "/my-cash/expense",
        element: withSuspense(<PermissionRoute><ExpensePage /></PermissionRoute>),
      },
      {
        path: "/incomplete-orders",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.INCOMPLETE_ORDERS}><IncompleteOrdersPage /></PermissionRoute>
        ),
      },
      {
        path: "/banners",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.BANNERS}><BannerPage /></PermissionRoute>
        ),
      },
      {
        path: "/banners/create",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.BANNERS}><CreateBannerPage /></PermissionRoute>
        ),
      },
      {
        path: "/banners/:id/edit",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.BANNERS}><BannerEditPage /></PermissionRoute>
        ),
      },
      {
        path: "/promocodes",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.PROMOCODES}><PromocodePage /></PermissionRoute>
        ),
      },
      {
        path: "/promocodes/create",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.PROMOCODES}><CreatePromocodePage /></PermissionRoute>
        ),
      },
      {
        path: "/promocodes/:id/edit",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.PROMOCODES}><PromocodeEditPage /></PermissionRoute>
        ),
      },
      {
        path: "/help",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.HELP}><HelpPage /></PermissionRoute>
        ),
      },
      {
        path: "/help/create",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.HELP}><CreateHelpPage /></PermissionRoute>
        ),
      },
      {
        path: "/help/:id",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.HELP}><HelpDetailPage /></PermissionRoute>
        ),
      },
      {
        path: "/reviews",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.REVIEW}><ReviewsPage /></PermissionRoute>
        ),
      },
      {
        path: "/reviews/:id",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.REVIEW}><ReviewDetailPage /></PermissionRoute>
        ),
      },
      {
        path: "/settings",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.SETTINGS}><SettingsPage /></PermissionRoute>
        ),
      },
      {
        path: "/manage-users",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.STAFF}><ManageUsersPage /></PermissionRoute>
        ),
      },
      {
        path: "/manage-users/create",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.STAFF}><CreateUserPage /></PermissionRoute>
        ),
      },
      {
        path: "/manage-users/edit/:id",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.STAFF}><EditUserPage /></PermissionRoute>
        ),
      },
      {
        path: "/manage-users/permissions/:id",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.STAFF}><PermissionManagerPage /></PermissionRoute>
        ),
      },
      {
        path: "/manage-users/activity-logs",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.LOG_ACTIVITY}><ActivityLogsPage /></PermissionRoute>
        ),
      },
      {
        path: "/merchants",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.RESELLER_MANAGEMENT}><ResellersListPage /></PermissionRoute>
        ),
      },
      {
        path: "/merchants/:id",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.RESELLER_MANAGEMENT}><ResellerDetailPage /></PermissionRoute>
        ),
      },
      { path: "/merchant",         element: withSuspense(<ResellerDashboardPage />) },
      { path: "/merchant/profile", element: withSuspense(<ResellerProfilePage />) },
      {
        path: "/privacy-policy",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.PRIVACY_POLICY_MANAGEMENT}><PrivacyPolicyPage /></PermissionRoute>
        ),
      },
      {
        path: "/privacy-policy/create",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.PRIVACY_POLICY_MANAGEMENT}><CreatePrivacyPolicyPage /></PermissionRoute>
        ),
      },
      {
        path: "/privacy-policy/edit",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.PRIVACY_POLICY_MANAGEMENT}><EditPrivacyPolicyPage /></PermissionRoute>
        ),
      },
      {
        path: "/terms-conditions",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.TERMS_CONDITIONS_MANAGEMENT}><TermsConditionsPage /></PermissionRoute>
        ),
      },
      {
        path: "/terms-conditions/create",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.TERMS_CONDITIONS_MANAGEMENT}><CreateTermsConditionsPage /></PermissionRoute>
        ),
      },
      {
        path: "/terms-conditions/edit",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.TERMS_CONDITIONS_MANAGEMENT}><EditTermsConditionsPage /></PermissionRoute>
        ),
      },
      {
        path: "/refund-policy",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.REFUND_POLICY_MANAGEMENT}><RefundPolicyPage /></PermissionRoute>
        ),
      },
      {
        path: "/refund-policy/create",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.REFUND_POLICY_MANAGEMENT}><CreateRefundPolicyPage /></PermissionRoute>
        ),
      },
      {
        path: "/refund-policy/edit",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.REFUND_POLICY_MANAGEMENT}><EditRefundPolicyPage /></PermissionRoute>
        ),
      },
      {
        path: "/steadfast",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.STEARDFAST}><SteadfastPage /></PermissionRoute>
        ),
      },
      {
        path: "/pathao",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.PATHAO}><PathaoPage /></PermissionRoute>
        ),
      },
      {
        path: "/redx",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.REDX}><RedXPage /></PermissionRoute>
        ),
      },
      {
        path: "/notifications",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.NOTIFICATION_SETTINGS}><NotificationsPage /></PermissionRoute>
        ),
      },
      {
        path: "/upgrade-plan",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.SETTINGS}><UpgradePlanPage /></PermissionRoute>
        ),
      },
      {
        path: "/domain-finder",
        element: withSuspense(
          <PermissionRoute permission={FeaturePermission.CUSTOM_DOMAIN}><DomainFinderPage /></PermissionRoute>
        ),
      },
    ],
  },
  {
    path: "/superadmin",
    element: (
      <SuperAdminPrivateRoute>
        <SuperAdminLayout />
      </SuperAdminPrivateRoute>
    ),
    children: [
      {
        path: "/superadmin",
        element: withSuspense(<SuperAdminPrivateRoute><SuperAdminOverviewPage /></SuperAdminPrivateRoute>),
      },
      {
        path: "/superadmin/earnings",
        element: withSuspense(<SuperAdminPrivateRoute><SuperAdminEarningsPage /></SuperAdminPrivateRoute>),
      },
      {
        path: "/superadmin/customers",
        element: withSuspense(<SuperAdminPrivateRoute><SuperAdminCustomersPage /></SuperAdminPrivateRoute>),
      },
      {
        path: "/superadmin/customers/create",
        element: withSuspense(<SuperAdminPrivateRoute><SuperAdminCustomerCreatePage /></SuperAdminPrivateRoute>),
      },
      {
        path: "/superadmin/customers/:id",
        element: withSuspense(<SuperAdminPrivateRoute><SuperAdminCustomerDetailPage /></SuperAdminPrivateRoute>),
      },
      {
        path: "/superadmin/customers/edit/:id",
        element: withSuspense(<SuperAdminPrivateRoute><SuperAdminCustomerEditPage /></SuperAdminPrivateRoute>),
      },
      {
        path: "/superadmin/support",
        element: withSuspense(<SuperAdminPrivateRoute><SuperAdminSupportPage /></SuperAdminPrivateRoute>),
      },
      {
        path: "/superadmin/support/:id",
        element: withSuspense(<SuperAdminPrivateRoute><SuperAdminSupportDetailPage /></SuperAdminPrivateRoute>),
      },
      {
        path: "/superadmin/packages",
        element: withSuspense(<SuperAdminPrivateRoute><PackageManagementPage /></SuperAdminPrivateRoute>),
      },
      {
        path: "/superadmin/packages/create",
        element: withSuspense(<SuperAdminPrivateRoute><PackageCreatePage /></SuperAdminPrivateRoute>),
      },
      {
        path: "/superadmin/packages/:id",
        element: withSuspense(<SuperAdminPrivateRoute><PackageDetailPage /></SuperAdminPrivateRoute>),
      },
      {
        path: "/superadmin/packages/:id/edit",
        element: withSuspense(<SuperAdminPrivateRoute><PackageEditPage /></SuperAdminPrivateRoute>),
      },
      {
        path: "/superadmin/themes",
        element: withSuspense(<SuperAdminPrivateRoute><ThemeManagementPage /></SuperAdminPrivateRoute>),
      },
      {
        path: "/superadmin/themes/create",
        element: withSuspense(<SuperAdminPrivateRoute><ThemeCreatePage /></SuperAdminPrivateRoute>),
      },
      {
        path: "/superadmin/themes/:id",
        element: withSuspense(<SuperAdminPrivateRoute><ThemeDetailPage /></SuperAdminPrivateRoute>),
      },
      {
        path: "/superadmin/themes/:id/edit",
        element: withSuspense(<SuperAdminPrivateRoute><ThemeEditPage /></SuperAdminPrivateRoute>),
      },
      {
        path: "/superadmin/invoices",
        element: withSuspense(<SuperAdminPrivateRoute><InvoiceManagementPage /></SuperAdminPrivateRoute>),
      },
      {
        path: "/superadmin/superadmins",
        element: withSuspense(<SuperAdminPrivateRoute><SuperAdminSuperadminsPage /></SuperAdminPrivateRoute>),
      },
      {
        path: "/superadmin/superadmins/:id",
        element: withSuspense(<SuperAdminPrivateRoute><SuperAdminSuperadminDetailPage /></SuperAdminPrivateRoute>),
      },
      {
        path: "/superadmin/profile",
        element: withSuspense(<SuperAdminPrivateRoute><SuperAdminProfilePage /></SuperAdminPrivateRoute>),
      },
    ],
  },

  { path: "/login",                    element: withSuspense(<LoginPage />) },
  { path: "/merchant-inactive",        element: withSuspense(<ResellerInactiveInfoPage />) },
  { path: "/register",                 element: withSuspense(<RegisterPage />) },
  { path: "/forgot-password",          element: withSuspense(<ForgotPasswordRequestPage />) },
  { path: "/forgot-password/check-email", element: withSuspense(<CheckResetPasswordEmailPage />) },
  { path: "/reset-password",           element: withSuspense(<ResetPasswordPage />) },
  { path: "/order-tracking",           element: withSuspense(<PublicOrderTrackingPage />) },
  { path: "/p/:id",                    element: withSuspense(<PublicProductDetailPage />) },
  { path: "*",                         element: withSuspense(<ErrorPage />) },
]);
