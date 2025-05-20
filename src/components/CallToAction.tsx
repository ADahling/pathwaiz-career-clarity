
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CallToAction: React.FC = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-pathwaiz-blue to-blue-600 text-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container-custom text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Ready to find your path?</h2>
        <p className="text-xl text-white text-opacity-90 max-w-2xl mx-auto mb-12">
          Start exploring your future with real insights from people who are living it.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-5">
          <Button 
            className="bg-white text-pathwaiz-blue hover:bg-gray-100 px-8 py-6 rounded-2xl text-lg font-medium shadow-lg flex items-center justify-center gap-2 group"
            asChild
          >
            <Link to="/find-a-mentor">
              Browse Mentors
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="border-2 border-white text-white hover:bg-white hover:bg-opacity-10 px-8 py-6 rounded-2xl text-lg font-medium"
            asChild
          >
            <Link to="/become-a-mentor">
              Become a Mentor
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
