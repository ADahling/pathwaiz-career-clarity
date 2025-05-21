import React from 'react';
import { Layout } from '@/components/Layout';

const AboutUs: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          About Us
        </h1>
        {/* Content goes here */}
      </div>
    </Layout>
  );
};

export default AboutUs;
