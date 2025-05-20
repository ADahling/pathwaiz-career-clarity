
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-white to-blue-50">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                About <span className="text-pathwaiz-blue">Pathwaiz</span>
              </h1>
              <p className="text-xl text-gray-700 mb-6">
                Connecting aspiring professionals with experienced mentors to guide their career journey
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3">
                  <div className="bg-blue-50 p-6 rounded-full inline-flex items-center justify-center">
                    <Users size={64} className="text-pathwaiz-blue" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                  <p className="text-lg text-gray-700 mb-4">
                    At Pathwaiz, we believe that career guidance shouldn't be limited to those with existing networks. Our mission is to democratize access to professional mentorship, making it possible for anyone to connect with experienced industry professionals who have walked the path they aspire to follow.
                  </p>
                  <p className="text-lg text-gray-700">
                    We're creating a world where decisions about education and career are made with confidence, backed by real-world insights from those who've been there before.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founding Story Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Our Founding Story</h2>
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/2">
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src="/placeholder.svg" 
                      alt="Pathwaiz founders" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-1/2">
                  <p className="text-lg text-gray-700 mb-4">
                    Pathwaiz was born from a simple observation: too many people make career decisions without access to the right information or guidance.
                  </p>
                  <p className="text-lg text-gray-700 mb-4">
                    Our founder, after making several career pivots, realized how valuable it would have been to speak with someone who had already navigated these transitions. This insight sparked the idea for a platform that connects people with mentors who have real-world experience in specific career paths.
                  </p>
                  <p className="text-lg text-gray-700">
                    Since our launch in 2023, we've helped thousands of professionals gain clarity and confidence in their career decisions through meaningful mentor connections.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Quote Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <blockquote className="relative p-8 bg-blue-50 rounded-xl">
                <div className="text-6xl font-serif text-pathwaiz-blue absolute top-2 left-4">"</div>
                <p className="text-xl text-gray-700 italic mb-6 pt-6">
                  Every day, I'm inspired by the connections made on our platform. When someone tells us they finally found clarity about their next career step after speaking with a Pathwaiz mentor, it reinforces why we built this platform. We're not just facilitating conversations—we're changing the trajectory of careers and lives.
                </p>
                <footer className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden">
                    <img 
                      src="/placeholder.svg" 
                      alt="Founder" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Alex Morgan</p>
                    <p className="text-gray-600">Founder & CEO, Pathwaiz</p>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-pathwaiz-blue bg-opacity-5">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-4">Join the Pathwaiz Community</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10">
              Whether you're seeking guidance or ready to share your experience with others, there's a place for you in our growing community of professionals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                className="bg-pathwaiz-blue text-white text-lg rounded-lg flex items-center justify-center gap-2 px-8 py-6"
                onClick={() => window.scrollTo(0, 0)}
              >
                Explore Mentors
                <ArrowRight size={20} />
              </Button>
              <Link to="/become-a-mentor">
                <Button
                  variant="outline"
                  className="border-pathwaiz-blue text-pathwaiz-blue hover:bg-pathwaiz-blue hover:bg-opacity-10 text-lg rounded-lg px-8 py-6"
                >
                  Become a Mentor
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
