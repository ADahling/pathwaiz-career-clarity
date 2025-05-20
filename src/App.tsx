
import React from "react";
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
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/product" element={<Layout><Product /></Layout>} />
              <Route path="/how-it-works" element={<Layout><HowItWorksPage /></Layout>} />
              <Route path="/find-a-mentor" element={<Layout><FindAMentor /></Layout>} />
              <Route path="/become-a-mentor" element={<Layout><BecomeAMentor /></Layout>} />
              <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
              <Route path="/about-us" element={<Layout><AboutUs /></Layout>} />
              <Route path="/careers" element={<Layout><Careers /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <Layout><Onboarding /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/mentee-profile" element={
                <ProtectedRoute requiredRole="mentee">
                  <Layout><MenteeProfile /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/mentor-profile" element={
                <ProtectedRoute requiredRole="mentor">
                  <Layout><MentorProfile /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;

import '@/styles/navbar-animations.css';
