import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

import HomePage from "./pages/public/HomePage";
import BrowseAdsPage from "./pages/public/BrowseAdsPage";
import AdDetailsPage from "./pages/public/AdDetailsPage";
import PackagesPage from "./pages/public/PackagesPage";
import FAQPage from "./pages/public/FAQPage";
import ContactPage from "./pages/public/ContactPage";
import TermsPage from "./pages/public/TermsPage";
import PrivacyPage from "./pages/public/PrivacyPage";
import CategoryPage from "./pages/public/CategoryPage";
import CityPage from "./pages/public/CityPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import ClientDashboard from "./pages/client/ClientDashboard";
import CreateAdPage from "./pages/client/CreateAdPage";
import MyAdsPage from "./pages/client/MyAdsPage";
import ClientLayout from "./layouts/ClientLayout";
import SelectPackagePage from "./pages/client/SelectPackagePage";
import PaymentPage from "./pages/client/PaymentPage";

import ModeratorDashboard from "./pages/moderator/ModeratorDashboard";
import ReviewAdPage from "./pages/moderator/ReviewAdPage";
import ModeratorLayout from "./layouts/ModeratorLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout";
import PaymentsPage from "./pages/admin/PaymentsPage";
import PublishAdPage from "./pages/admin/PublishAdPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/ads" element={<BrowseAdsPage />} />
      <Route path="/ads/:slug" element={<AdDetailsPage />} />
      <Route path="/packages" element={<PackagesPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/categories/:slug" element={<CategoryPage />} />
      <Route path="/cities/:slug" element={<CityPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/client"
        element={
          <ProtectedRoute roles={["client"]}>
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<ClientDashboard />} />
        <Route path="create-ad" element={<CreateAdPage />} />
        <Route path="edit-ad/:id" element={<CreateAdPage />} />
        <Route path="my-ads" element={<MyAdsPage />} />
        <Route path="package/:id" element={<SelectPackagePage />} />
        <Route path="payment/:id" element={<PaymentPage />} />
      </Route>

      <Route
        path="/moderator"
        element={
          <ProtectedRoute roles={["moderator", "admin", "super_admin"]}>
            <ModeratorLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<ModeratorDashboard />} />
        <Route path="review/:id" element={<ReviewAdPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin", "super_admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="publish/:id" element={<PublishAdPage />} />
      </Route>
    </Routes>
  );
};

export default App;