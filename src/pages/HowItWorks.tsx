import React from 'react';
import { Search, Calendar, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      icon: <Search className="w-12 h-12 text-[#4A90E2]" />,
      title: "Explore Mentors",
      description: "Browse through our curated list of mentors based on your career interests, industry, or specific goals.",
      details: "Use powerful filters to find mentors who match your specific needs - whether by industry, expertise, company, or availability."
    },
    {
      icon: <Calendar className="w-12 h-12 text-[#4A90E2]" />,
      title: "Book a Session",
      description: "Schedule a one-on-one video call at a time that works for both you and your chosen mentor.",
      details: "Our easy booking system allows you to see mentor availability in your timezone and secure time with experienced professionals."
    },
    {
      icon: <Lightbulb className="w-12 h-12 text-[#4A90E2]" />,
      title: "Gain Insights",
      description: "Get personalized advice, ask questions, and receive honest feedback about career paths.",
      details: "Learn from someone who's walked the path you're considering - get unfiltered perspectives and practical next steps."
    }
  ];

  return (
    <Layout>
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                How <span className="text-[#4A90E2]">Pathwaiz</span> Works
              </h1>
              <p className="text-xl text-gray-700 mb-10">
                Connect with experienced professionals in just three simple steps.
                Get the career guidance you need to make informed decisions.
              </p>
            </div>
          </div>
        </section>

        {/* 3-Step Process Section */}
        <section className="py-16 px-4 bg-gray-50" id="steps">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-24 h-24 rounded-full bg-[#4A90E2] bg-opacity-10 flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Step {index + 1}: {step.title}</h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <p className="text-gray-500 text-sm">{step.details}</p>
                </div>
              ))}
            </div>
            
            {/* How It Works Diagram */}
            <div className="relative hidden md:flex justify-between items-center max-w-4xl mx-auto mb-20 px-12">
              {steps.map((_, index) => (
                <React.Fragment key={index}>
                  <div className="w-12 h-12 bg-[#4A90E2] rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-1 bg-[#4A90E2]"></div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Testimonial */}
            <div className="bg-white p-8 rounded-lg shadow-sm max-w-3xl mx-auto text-center mb-12">
              <p className="text-lg italic text-gray-700 mb-4">
                "The mentorship I received through Pathwaiz completely changed my career trajectory. 
                I got honest insights that I couldn't find anywhere else."
              </p>
              <p className="font-medium">— Sarah K., Product Designer</p>
            </div>

            {/* Call To Action */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  className="bg-[#4A90E2] hover:bg-[#3A80D2] text-white px-8 py-6 text-lg rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  Browse Mentors
                  <ArrowRight size={20} />
                </Button>
                <Button 
                  variant="outline"
                  className="border-[#4A90E2] text-[#4A90E2] hover:bg-[#4A90E2] hover:bg-opacity-10 px-8 py-6 text-lg rounded-lg w-full sm:w-auto"
                >
                  Become a Mentor
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "How much does it cost to use Pathwaiz?",
                  answer: "Pricing varies by mentor. Each mentor sets their own hourly rate based on their experience and industry. You can see pricing before booking any session."
                },
                {
                  question: "How are mentors vetted?",
                  answer: "All mentors go through a thorough application process and are verified for their professional experience and qualifications before joining the platform."
                },
                {
                  question: "Can I change or cancel my booking?",
                  answer: "Yes, you can reschedule or cancel your booking up to 24 hours before your scheduled session without any penalty."
                },
                {
                  question: "What happens during a mentorship session?",
                  answer: "Sessions are conducted via video call and typically last 30-60 minutes. You can discuss your career questions, get advice, review your resume, or practice for interviews."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default HowItWorksPage;
