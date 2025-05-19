
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-white to-pathwaiz-gray section-padding">
      <div className="container-custom flex flex-col lg:flex-row items-center">
        {/* Hero Text Content */}
        <div className="w-full lg:w-1/2 mb-10 lg:mb-0 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Explore Careers <br className="hidden md:block" />
            <span className="text-pathwaiz-blue">with Confidence</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl">
            Connect with professionals, entrepreneurs, and freelancers for firsthand insights into real jobs—before you commit to your next move.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="btn-primary flex items-center gap-2 text-lg"
              size="lg"
            >
              Find a Mentor
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
        
        {/* Hero Image/Illustration */}
        <div className="w-full lg:w-1/2 animate-slide-up">
          <div className="relative">
            {/* This is a placeholder for your actual illustration/image */}
            <div className="aspect-[4/3] bg-white rounded-2xl shadow-lg p-6 flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full">
                <div className="absolute w-24 h-24 bg-pathwaiz-blue rounded-full opacity-10 top-10 left-10"></div>
                <div className="absolute w-32 h-32 bg-pathwaiz-blue rounded-full opacity-10 bottom-10 right-20"></div>
                <div className="absolute w-16 h-16 bg-pathwaiz-blue rounded-full opacity-10 top-20 right-10"></div>
                
                {/* Career Path Illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-3/4 h-3/4">
                    {/* Central Figure */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-white rounded-full"></div>
                    </div>
                    
                    {/* Path Lines */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300"></div>
                    <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-300 transform -translate-x-1/2"></div>
                    
                    {/* Direction Arrows */}
                    <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-pathwaiz-blue rounded-full flex items-center justify-center text-white font-bold">↗</div>
                    <div className="absolute bottom-1/4 right-1/4 w-8 h-8 bg-pathwaiz-blue rounded-full flex items-center justify-center text-white font-bold">↘</div>
                    <div className="absolute bottom-1/4 left-1/4 w-8 h-8 bg-pathwaiz-blue rounded-full flex items-center justify-center text-white font-bold">↙</div>
                    <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-pathwaiz-blue rounded-full flex items-center justify-center text-white font-bold">↖</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
