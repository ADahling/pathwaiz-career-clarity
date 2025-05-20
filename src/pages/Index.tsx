
import React from 'react';
import { Layout } from '@/components/Layout';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import AudienceSection from '@/components/AudienceSection';
import ValueProposition from '@/components/ValueProposition';
import CallToAction from '@/components/CallToAction';

const Index: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <HowItWorks />
      <AudienceSection />
      <ValueProposition />
      <CallToAction />
    </Layout>
  );
};

export default Index;
