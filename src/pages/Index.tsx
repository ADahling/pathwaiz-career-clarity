import React from 'react';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import AudienceSection from '@/components/AudienceSection';
import ValueProposition from '@/components/ValueProposition';
import CallToAction from '@/components/CallToAction';

const Index: React.FC = () => {
  return (
    <>
      <Hero />
      <HowItWorks />
      <AudienceSection />
      <ValueProposition />
      <CallToAction />
    </>
  );
};

export default Index;
