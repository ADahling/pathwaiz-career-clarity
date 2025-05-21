import React from 'react';
import { Layout } from '@/components/Layout';
import { MentorMatching } from '@/components/matching/MentorMatching';
import './MatchingPage.css';

export const MatchingPage: React.FC = () => {
  return (
    <Layout>
      <div className="matching-page">
        <MentorMatching />
      </div>
    </Layout>
  );
};

export default MatchingPage;
