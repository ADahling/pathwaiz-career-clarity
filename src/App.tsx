import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import MenteeProfile from "./pages/MenteeProfile";
import MentorProfile from "./pages/MentorProfile";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Product from "./pages/Product";
import HowItWorksPage from "./pages/HowItWorks";
import FindAMentor from "./pages/FindAMentor";
import BecomeAMentor from "./pages/BecomeAMentor";
import Pricing from "./pages/Pricing";
import AboutUs from "./pages/AboutUs";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";

// Import premium styling
import '@/styles/premium-design-system.css';
import '@/styles/navbar-animations.css';

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="product" element={<Product />} />
                <Route path="how-it-works" element={<HowItWorksPage />} />
                <Route path="find-a-mentor" element={<FindAMentor />} />
                <Route path="become-a-mentor" element={<BecomeAMentor />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="about-us" element={<AboutUs />} />
                <Route path="careers" element={<Careers />} />
                <Route path="contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              
              {/* Auth route - no layout */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/booking" element={<Booking />} />
                </Route>
              </Route>
              
              {/* Role-specific protected routes */}
              <Route element={<ProtectedRoute requiredRole="mentee" />}>
                <Route element={<Layout />}>
                  <Route path="/mentee-profile" element={<MenteeProfile />} />
                </Route>
              </Route>
              
              <Route element={<ProtectedRoute requiredRole="mentor" />}>
                <Route element={<Layout />}>
                  <Route path="/mentor-profile" element={<MentorProfile />} />
                </Route>
              </Route>
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
