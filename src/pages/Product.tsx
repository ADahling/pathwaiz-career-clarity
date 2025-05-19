
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, MessageSquare, Rocket, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const Product: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Find Your Perfect Career <span className="text-[#4A90E2]">Mentor</span>
              </h1>
              <p className="text-xl text-gray-700 mb-10">
                Connect with experienced professionals who've walked the path you're exploring.
                Get personalized guidance to navigate your career journey with confidence.
              </p>
              <Button 
                className="bg-[#4A90E2] hover:bg-[#3A80D2] text-white px-8 py-6 text-lg rounded-lg flex items-center gap-2"
              >
                Find a Mentor Now
                <ArrowRight size={20} />
              </Button>
            </div>
          </div>
        </section>

        {/* Key Benefits Section */}
        <section className="py-16 bg-gray-50 px-4">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-16">Why Choose Pathwaiz</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#4A90E2] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="text-[#4A90E2]" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Vetted Mentors</h3>
                <p className="text-gray-600">All mentors go through a thorough vetting process to ensure quality guidance.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#4A90E2] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                  <Users className="text-[#4A90E2]" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Perfect Matching</h3>
                <p className="text-gray-600">Our algorithm pairs you with mentors who align with your career goals and values.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#4A90E2] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="text-[#4A90E2]" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Direct Communication</h3>
                <p className="text-gray-600">Seamless messaging and video calls with your mentor for personalized guidance.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#4A90E2] bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                  <Rocket className="text-[#4A90E2]" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">Career Acceleration</h3>
                <p className="text-gray-600">Get insights and strategies to help you advance faster in your chosen path.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Breakdown Sections */}
        <section className="py-16 px-4">
          <div className="container-custom">
            {/* Feature 1 */}
            <div className="flex flex-col md:flex-row items-center mb-24 gap-12">
              <div className="w-full md:w-1/2 order-2 md:order-1">
                <h2 className="text-3xl font-bold mb-6">Personalized Mentor Matching</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Our intelligent matching system connects you with mentors who have relevant experience in your desired career path.
                  You'll receive personalized recommendations based on your goals, experience level, and interests.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#4A90E2] flex items-center justify-center text-white">✓</div>
                    <span>Industry-specific mentors</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#4A90E2] flex items-center justify-center text-white">✓</div>
                    <span>Experience-level matching</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#4A90E2] flex items-center justify-center text-white">✓</div>
                    <span>Career path alignment</span>
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-1/2 order-1 md:order-2">
                <div className="bg-gray-100 h-80 rounded-lg flex items-center justify-center">
                  <div className="w-32 h-32 bg-[#4A90E2] bg-opacity-20 rounded-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-[#4A90E2] bg-opacity-30 rounded-full flex items-center justify-center">
                      <Users size={40} className="text-[#4A90E2]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center mb-24 gap-12">
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl font-bold mb-6">Flexible Session Formats</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Connect with your mentor through video calls, audio sessions, or messaging. 
                  Choose the format that works best for your learning style and schedule.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#4A90E2] flex items-center justify-center text-white">✓</div>
                    <span>HD video conferencing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#4A90E2] flex items-center justify-center text-white">✓</div>
                    <span>Secure messaging platform</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#4A90E2] flex items-center justify-center text-white">✓</div>
                    <span>Session recording (optional)</span>
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-1/2">
                <div className="bg-gray-100 h-80 rounded-lg flex items-center justify-center">
                  <div className="w-32 h-32 bg-[#4A90E2] bg-opacity-20 rounded-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-[#4A90E2] bg-opacity-30 rounded-full flex items-center justify-center">
                      <MessageSquare size={40} className="text-[#4A90E2]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col md:flex-row items-center mb-16 gap-12">
              <div className="w-full md:w-1/2 order-2 md:order-1">
                <h2 className="text-3xl font-bold mb-6">Career Growth Resources</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Access exclusive resources shared by your mentor, including industry insights, 
                  resume templates, interview preparation guides, and more.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#4A90E2] flex items-center justify-center text-white">✓</div>
                    <span>Document sharing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#4A90E2] flex items-center justify-center text-white">✓</div>
                    <span>Resource library</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#4A90E2] flex items-center justify-center text-white">✓</div>
                    <span>Personalized growth plan</span>
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-1/2 order-1 md:order-2">
                <div className="bg-gray-100 h-80 rounded-lg flex items-center justify-center">
                  <div className="w-32 h-32 bg-[#4A90E2] bg-opacity-20 rounded-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-[#4A90E2] bg-opacity-30 rounded-full flex items-center justify-center">
                      <Rocket size={40} className="text-[#4A90E2]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#4A90E2] bg-opacity-5 px-4">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Accelerate Your Career?</h2>
            <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who are navigating their career paths with confidence through Pathwaiz mentorship.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                className="bg-[#4A90E2] hover:bg-[#3A80D2] text-white px-8 py-6 text-lg rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto"
                asChild
              >
                <Link to="/auth">
                  Find Your Mentor
                  <ArrowRight size={20} />
                </Link>
              </Button>
              <Button 
                variant="outline"
                className="border-[#4A90E2] text-[#4A90E2] hover:bg-[#4A90E2] hover:bg-opacity-10 px-8 py-6 text-lg rounded-lg w-full sm:w-auto"
                asChild
              >
                <Link to="/auth">
                  Become a Mentor
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Product;
