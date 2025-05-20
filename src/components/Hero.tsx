
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="section-padding pt-24 bg-gradient-to-br from-white to-blue-50 overflow-hidden">
      <div className="container-custom flex flex-col lg:flex-row items-center">
        {/* Hero Text Content */}
        <div className="w-full lg:w-1/2 mb-12 lg:mb-0 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
            Explore Careers <br className="hidden md:block" />
            <span className="text-gradient">with Confidence</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl">
            Connect with professionals, entrepreneurs, and freelancers for firsthand insights into real jobs—before you commit to your next move.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="btn-primary px-8 py-6 rounded-2xl text-lg font-medium flex items-center gap-2 shadow-soft hover:shadow-hover transition-shadow"
              asChild
            >
              <Link to="/find-a-mentor">
                Find a Mentor
                <ArrowRight size={20} />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="btn-secondary px-8 py-6 rounded-2xl text-lg font-medium shadow-soft hover:shadow-hover transition-shadow"
              asChild
            >
              <Link to="/become-a-mentor">
                Become a Mentor
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Hero Image/Illustration */}
        <div className="w-full lg:w-1/2 animate-slide-up relative">
          <div className="relative">
            <div className="aspect-[4/3] bg-white rounded-2xl shadow-soft hover:shadow-hover transition-all duration-500 p-10 flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full">
                {/* Decorative Elements */}
                <div className="absolute w-24 h-24 bg-pathwaiz-blue rounded-full opacity-10 top-10 left-10 animate-pulse"></div>
                <div className="absolute w-32 h-32 bg-pathwaiz-blue rounded-full opacity-10 bottom-10 right-20 animate-pulse" style={{animationDelay: "1s"}}></div>
                <div className="absolute w-16 h-16 bg-pathwaiz-blue rounded-full opacity-10 top-20 right-10 animate-pulse" style={{animationDelay: "0.5s"}}></div>
                
                {/* Career Path Illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-3/4 h-3/4">
                    {/* Central Element */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-black bg-opacity-90 rounded-full flex items-center justify-center z-10 shadow-md">
                      <div className="w-10 h-10 bg-white rounded-full"></div>
                    </div>
                    
                    {/* Path Lines */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2"></div>
                    <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-200 transform -translate-x-1/2"></div>
                    
                    {/* Directional Elements */}
                    <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-pathwaiz-blue rounded-full flex items-center justify-center text-white font-bold shadow-lg transform hover:scale-110 transition-transform">↗</div>
                    <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-pathwaiz-blue rounded-full flex items-center justify-center text-white font-bold shadow-lg transform hover:scale-110 transition-transform">↘</div>
                    <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-pathwaiz-blue rounded-full flex items-center justify-center text-white font-bold shadow-lg transform hover:scale-110 transition-transform">↙</div>
                    <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-pathwaiz-blue rounded-full flex items-center justify-center text-white font-bold shadow-lg transform hover:scale-110 transition-transform">↖</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating Stats Card */}
          <div className="absolute -bottom-6 -right-6 md:bottom-10 md:right-10 bg-white p-4 rounded-xl shadow-soft rotate-3 transform hover:rotate-0 transition-transform">
            <p className="text-sm text-gray-500">Trusted by</p>
            <p className="text-xl font-bold text-pathwaiz-black">1,200+ Mentors</p>
          </div>
          
          {/* Floating Testimonial */}
          <div className="absolute -top-4 -left-4 md:top-10 md:left-0 bg-white p-4 rounded-xl shadow-soft -rotate-2 transform hover:rotate-0 transition-transform max-w-[180px]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <p className="text-sm font-medium">Alex K.</p>
            </div>
            <p className="text-xs text-gray-600">"Found my dream career through Pathwaiz mentorship!"</p>
          </div>
        </div>
      </div>
      
      {/* Curved Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{
        clipPath: "ellipse(50% 60% at 50% 100%)"
      }}></div>
    </section>
  );
};

export default Hero;
