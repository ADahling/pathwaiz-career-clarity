
import React from 'react';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import AudienceSection from '@/components/AudienceSection';
import ValueProposition from '@/components/ValueProposition';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <AudienceSection />
        <ValueProposition />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
