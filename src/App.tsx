import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AnimatePresence } from "framer-motion";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Category from "./pages/Category";
import Sell from "./pages/Sell";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import MyListings from "./pages/MyListings";
import Search from "./pages/Search";
import ListingDetail from "./pages/ListingDetail";
import EditListing from "./pages/EditListing";
import AboutUs from "./pages/AboutUs";
import HowItWorks from "./pages/HowItWorks";
import SafetyTips from "./pages/SafetyTips";
import SuccessStories from "./pages/SuccessStories";
import Blog from "./pages/Blog";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Help from "./pages/Help";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

// AnimatedRoutes component to handle page transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/category/:categoryId" element={<Category />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/edit-listing/:id" element={<EditListing />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/safety-tips" element={<SafetyTips />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/help" element={<Help />} />
        <Route path="/settings" element={<Settings />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <ScrollToTop />
              <AnimatedRoutes />
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
