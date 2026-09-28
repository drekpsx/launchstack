import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";

import Landing from "./pages/Landing";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import Refund from "./pages/legal/Refund";

import Onboarding from "./pages/onboarding/Onboarding";
import OnboardingComplete from "./pages/onboarding/OnboardingComplete";

import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import MyBusiness from "./pages/dashboard/MyBusiness";
import ModulePage from "./pages/dashboard/ModulePage";
import Workflows from "./pages/dashboard/Workflows";
import WorkflowDetail from "./pages/dashboard/WorkflowDetail";
import Favorites from "./pages/dashboard/Favorites";
import History from "./pages/dashboard/History";
import Settings from "./pages/dashboard/Settings";

import AdminLogin from "./pages/admin/AdminLogin";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminModules from "./pages/admin/AdminModules";
import AdminTemplates from "./pages/admin/AdminTemplates";
import AdminWorkflows from "./pages/admin/AdminWorkflows";
import AdminWorkflowSteps from "./pages/admin/AdminWorkflowSteps";
import AdminUsers from "./pages/admin/AdminUsers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Marketing */}
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/legal/privacy" element={<Privacy />} />
            <Route path="/legal/terms" element={<Terms />} />
            <Route path="/legal/refund" element={<Refund />} />

            {/* Onboarding */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/complete"
              element={
                <ProtectedRoute>
                  <OnboardingComplete />
                </ProtectedRoute>
              }
            />

            {/* User dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="business" element={<MyBusiness />} />
              <Route path="modules/:slug" element={<ModulePage />} />
              <Route path="workflows" element={<Workflows />} />
              <Route path="workflows/:slug" element={<WorkflowDetail />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="history" element={<History />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="modules" element={<AdminModules />} />
              <Route path="templates" element={<AdminTemplates />} />
              <Route path="workflows" element={<AdminWorkflows />} />
              <Route path="workflows/:id" element={<AdminWorkflowSteps />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
