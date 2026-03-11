import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import RedeemCoupon from "./pages/RedeemCoupon";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminGyms from "./pages/admin/AdminGyms";
import AdminTrainers from "./pages/admin/AdminTrainers";
import AdminLicenses from "./pages/admin/AdminLicenses";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminCommissions from "./pages/admin/AdminCommissions";
import AdminCommissionRules from "./pages/admin/AdminCommissionRules";
import AdminNutrition from "./pages/admin/AdminNutrition";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminUsers from "./pages/admin/AdminUsers";

import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerTrainers from "./pages/owner/OwnerTrainers";
import OwnerLicenses from "./pages/owner/OwnerLicenses";
import OwnerMembers from "./pages/owner/OwnerMembers";
import OwnerCommissions from "./pages/owner/OwnerCommissions";
import OwnerNutrition from "./pages/owner/OwnerNutrition";
import OwnerAnalytics from "./pages/owner/OwnerAnalytics";

import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import TrainerMembers from "./pages/trainer/TrainerMembers";
import TrainerCoupons from "./pages/trainer/TrainerCoupons";
import TrainerCommissions from "./pages/trainer/TrainerCommissions";
import TrainerNutrition from "./pages/trainer/TrainerNutrition";

import MemberDashboard from "./pages/member/MemberDashboard";
import MemberPlans from "./pages/member/MemberPlans";
import MemberSubscription from "./pages/member/MemberSubscription";
import MemberOnboarding from "./pages/member/MemberOnboarding";
import Settings from "./pages/Settings";

import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const RoleRedirect = () => {
  const { primaryRole, loading } = useAuth();

  if (loading) return null;
  if (!primaryRole) return <Navigate to="/login" replace />;

  const routes: Record<string, string> = {
    super_admin: '/admin',
    gym_owner: '/owner',
    trainer: '/trainer',
    member: '/member',
  };
  return <Navigate to={routes[primaryRole] || '/login'} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<RoleRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/redeem" element={<RedeemCoupon />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Super Admin */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/gyms" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminGyms /></ProtectedRoute>} />
            <Route path="/admin/trainers" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminTrainers /></ProtectedRoute>} />
            <Route path="/admin/licenses" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminLicenses /></ProtectedRoute>} />
            <Route path="/admin/coupons" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminCoupons /></ProtectedRoute>} />
            <Route path="/admin/subscriptions" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminSubscriptions /></ProtectedRoute>} />
            <Route path="/admin/commissions" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminCommissions /></ProtectedRoute>} />
            <Route path="/admin/commission-rules" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminCommissionRules /></ProtectedRoute>} />
            <Route path="/admin/nutrition" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminNutrition /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminAnalytics /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminUsers /></ProtectedRoute>} />

            {/* Gym Owner */}
            <Route path="/owner" element={<ProtectedRoute allowedRoles={['gym_owner']}><OwnerDashboard /></ProtectedRoute>} />
            <Route path="/owner/trainers" element={<ProtectedRoute allowedRoles={['gym_owner']}><OwnerTrainers /></ProtectedRoute>} />
            <Route path="/owner/licenses" element={<ProtectedRoute allowedRoles={['gym_owner']}><OwnerLicenses /></ProtectedRoute>} />
            <Route path="/owner/members" element={<ProtectedRoute allowedRoles={['gym_owner']}><OwnerMembers /></ProtectedRoute>} />
            <Route path="/owner/commissions" element={<ProtectedRoute allowedRoles={['gym_owner']}><OwnerCommissions /></ProtectedRoute>} />
            <Route path="/owner/nutrition" element={<ProtectedRoute allowedRoles={['gym_owner']}><OwnerNutrition /></ProtectedRoute>} />
            <Route path="/owner/analytics" element={<ProtectedRoute allowedRoles={['gym_owner']}><OwnerAnalytics /></ProtectedRoute>} />

            {/* Trainer */}
            <Route path="/trainer" element={<ProtectedRoute allowedRoles={['trainer']}><TrainerDashboard /></ProtectedRoute>} />
            <Route path="/trainer/members" element={<ProtectedRoute allowedRoles={['trainer']}><TrainerMembers /></ProtectedRoute>} />
            <Route path="/trainer/coupons" element={<ProtectedRoute allowedRoles={['trainer']}><TrainerCoupons /></ProtectedRoute>} />
            <Route path="/trainer/commissions" element={<ProtectedRoute allowedRoles={['trainer']}><TrainerCommissions /></ProtectedRoute>} />
            <Route path="/trainer/nutrition" element={<ProtectedRoute allowedRoles={['trainer']}><TrainerNutrition /></ProtectedRoute>} />

            {/* Member */}
            <Route path="/member/onboarding" element={<ProtectedRoute allowedRoles={['member']}><MemberOnboarding /></ProtectedRoute>} />
            <Route path="/member" element={<ProtectedRoute allowedRoles={['member']}><MemberDashboard /></ProtectedRoute>} />
            <Route path="/member/plans" element={<ProtectedRoute allowedRoles={['member']}><MemberPlans /></ProtectedRoute>} />
            <Route path="/member/subscription" element={<ProtectedRoute allowedRoles={['member']}><MemberSubscription /></ProtectedRoute>} />

            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
