
import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Import pages
const Booking = React.lazy(() => import('@/pages/Booking'));
const Payment = React.lazy(() => import('@/pages/Payment'));
const MessagingPage = React.lazy(() => import('@/pages/MessagingPage'));
const VideoSessionPage = React.lazy(() => import('@/pages/VideoSessionPage'));
const MentorProfile = React.lazy(() => import('@/pages/MentorProfile'));
const MenteeProfile = React.lazy(() => import('@/pages/MenteeProfile'));

// Loading component
const LoadingFallback = () => (
  <div className="loading-fallback">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

const Routes: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <RouterRoutes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/find-a-mentor" />} />
        
        {/* Protected routes */}
        <Route 
          path="/booking/:mentorId" 
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/payment/:bookingId" 
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/messaging" 
          element={
            <ProtectedRoute>
              <MessagingPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/video-session/:sessionId" 
          element={
            <ProtectedRoute>
              <VideoSessionPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mentor/:mentorId" 
          element={<MentorProfile />} 
        />
        <Route 
          path="/mentee/:menteeId" 
          element={
            <ProtectedRoute>
              <MenteeProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </RouterRoutes>
    </React.Suspense>
  );
};

export default Routes;
