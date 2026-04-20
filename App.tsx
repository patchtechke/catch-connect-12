import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import FAQ from "./pages/FAQ";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import FisherOverview from "./pages/fisher/FisherOverview";
import FisherCatches from "./pages/fisher/FisherCatches";
import FisherAddCatch from "./pages/fisher/FisherAddCatch";
import FisherOrders from "./pages/fisher/FisherOrders";
import FisherAnalytics from "./pages/fisher/FisherAnalytics";
import FisherEarnings from "./pages/fisher/FisherEarnings";
import FisherProfile from "./pages/fisher/FisherProfile";
import BuyerOverview from "./pages/buyer/BuyerOverview";
import BuyerMarketplace from "./pages/buyer/BuyerMarketplace";
import BuyerOrders from "./pages/buyer/BuyerOrders";
import BuyerFavorites from "./pages/buyer/BuyerFavorites";
import BuyerHistory from "./pages/buyer/BuyerHistory";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminFishers from "./pages/admin/AdminFishers";
import AdminBuyers from "./pages/admin/AdminBuyers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCatches from "./pages/admin/AdminCatches";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import { AuthProvider } from "./lib/auth";
import { ArrowUp } from "lucide-react";
import { useState, useEffect } from 'react';
import { queryClient } from "./lib/queryClient";

const App = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 200) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Switch>
            <Route path="/" component={Index} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password" component={ResetPassword} />
            <Route path="/fisher" component={FisherOverview} />
            <Route path="/fisher/catches" component={FisherCatches} />
            <Route path="/fisher/catches/add" component={FisherAddCatch} />
            <Route path="/fisher/catches/active" component={FisherCatches} />
            <Route path="/fisher/catches/sold" component={FisherCatches} />
            <Route path="/fisher/orders" component={FisherOrders} />
            <Route path="/fisher/orders/pending" component={FisherOrders} />
            <Route path="/fisher/orders/completed" component={FisherOrders} />
            <Route path="/fisher/analytics" component={FisherAnalytics} />
            <Route path="/fisher/analytics/sales" component={FisherAnalytics} />
            <Route path="/fisher/analytics/performance" component={FisherAnalytics} />
            <Route path="/fisher/analytics/customers" component={FisherAnalytics} />
            <Route path="/fisher/analytics/locations" component={FisherAnalytics} />
            <Route path="/fisher/earnings" component={FisherEarnings} />
            <Route path="/fisher/calendar" component={FisherOverview} />
            <Route path="/fisher/settings/profile" component={FisherProfile} />
            <Route path="/fisher/settings/notifications" component={FisherOverview} />
            <Route path="/fisher/settings/security" component={FisherOverview} />
            <Route path="/buyer" component={BuyerOverview} />
            <Route path="/buyer/marketplace" component={BuyerMarketplace} />
            <Route path="/buyer/orders" component={BuyerOrders} />
            <Route path="/buyer/orders/pending" component={BuyerOrders} />
            <Route path="/buyer/orders/processing" component={BuyerOrders} />
            <Route path="/buyer/orders/completed" component={BuyerOrders} />
            <Route path="/buyer/orders/cancelled" component={BuyerOrders} />
            <Route path="/buyer/favorites" component={BuyerFavorites} />
            <Route path="/buyer/history" component={BuyerHistory} />
            <Route path="/buyer/settings/profile" component={BuyerOverview} />
            <Route path="/buyer/settings/notifications" component={BuyerOverview} />
            <Route path="/buyer/settings/security" component={BuyerOverview} />
            <Route path="/admin" component={AdminOverview} />
            <Route path="/admin/users" component={AdminUsers} />
            <Route path="/admin/users/active" component={AdminUsers} />
            <Route path="/admin/users/inactive" component={AdminUsers} />
            <Route path="/admin/fishers" component={AdminFishers} />
            <Route path="/admin/fishers/verified" component={AdminFishers} />
            <Route path="/admin/fishers/pending" component={AdminFishers} />
            <Route path="/admin/buyers" component={AdminBuyers} />
            <Route path="/admin/buyers/verified" component={AdminBuyers} />
            <Route path="/admin/buyers/pending" component={AdminBuyers} />
            <Route path="/admin/orders" component={AdminOrders} />
            <Route path="/admin/orders/pending" component={AdminOrders} />
            <Route path="/admin/orders/completed" component={AdminOrders} />
            <Route path="/admin/orders/cancelled" component={AdminOrders} />
            <Route path="/admin/catches" component={AdminCatches} />
            <Route path="/admin/reports" component={AdminReports} />
            <Route path="/admin/reports/revenue" component={AdminReports} />
            <Route path="/admin/reports/trends" component={AdminReports} />
            <Route path="/admin/settings" component={AdminSettings} />
            <Route path="/admin/settings/profile" component={AdminSettings} />
            <Route path="/admin/settings/notifications" component={AdminSettings} />
            <Route path="/admin/settings/security" component={AdminSettings} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/terms-of-service" component={TermsOfService} />
            <Route path="/cookie-policy" component={CookiePolicy} />
            <Route path="/faq" component={FAQ} />
            <Route component={NotFound} />
          </Switch>
          {showBackToTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 bg-secondary text-secondary-foreground p-3 rounded-full shadow-lg hover:bg-secondary/90 transition-colors duration-300 z-50"
            >
              <ArrowUp className="h-6 w-6" />
            </button>
          )}
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
