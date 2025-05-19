
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CallToAction: React.FC = () => {
  return (
    <section className="section-padding bg-pathwaiz-blue bg-opacity-10">
      <div className="container-custom text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to find your path?</h2>
        <p className="text-lg text-pathwaiz-darkgray max-w-2xl mx-auto mb-10">
          Start exploring your future with real insights from people living it.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            className="btn-primary flex items-center gap-2 text-lg"
            size="lg"
          >
            Browse Mentors
            <ArrowRight size={20} />
          </Button>
          <Button 
            variant="outline" 
            className="btn-secondary text-lg"
            size="lg"
          >
            Become a Mentor
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
