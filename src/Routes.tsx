
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import FindAMentor from '@/pages/FindAMentor';
import HowItWorks from '@/pages/HowItWorks';
import Pricing from '@/pages/Pricing';
import Booking from '@/pages/Booking';
import Onboarding from '@/pages/Onboarding';
import MenteeProfile from '@/pages/MenteeProfile';
import MentorProfile from '@/pages/MentorProfile';
import ApiKeyManager from '@/components/admin/ApiKeyManager';
import Payment from '@/pages/Payment';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/find-a-mentor" element={<FindAMentor />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/booking/:mentorId" element={<Booking />} />
        <Route path="/payment/:bookingId" element={<Payment />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/mentee-profile" element={<MenteeProfile />} />
        <Route path="/mentor-profile" element={<MentorProfile />} />
        <Route path="/admin/api-keys" element={<ApiKeyManager />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
