
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-white to-gray-50 py-20">
        <div className="text-center max-w-md px-6">
          <h1 className="text-6xl sm:text-8xl font-display font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 font-display">Oops! This page has wandered off the path</p>
          <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
          <Button asChild className="group">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
