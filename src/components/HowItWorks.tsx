
import React from 'react';
import { Search, Calendar, Target } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Search className="w-12 h-12 text-pathwaiz-blue" />,
      title: "Explore Mentors",
      description: "Search by job title, company, industry, or experience type.",
    },
    {
      icon: <Calendar className="w-12 h-12 text-pathwaiz-blue" />,
      title: "Book a Session",
      description: "Schedule 1-on-1 calls with professionals who've walked the path you're considering.",
    },
    {
      icon: <Target className="w-12 h-12 text-pathwaiz-blue" />,
      title: "Gain Real Insights",
      description: "Ask questions, hear unfiltered experiences, and make more informed career choices.",
    }
  ];

  return (
    <section id="how-it-works" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Pathwaiz Works</h2>
          <p className="text-pathwaiz-darkgray max-w-2xl mx-auto">
            Our platform makes it easy to connect with mentors who can provide valuable insights into your potential career path.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-pathwaiz-gray p-8 rounded-xl flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className="mb-6 p-4 bg-white rounded-full shadow-sm">{step.icon}</div>
              <h3 className="text-xl font-bold mb-3">{`Step ${index + 1}: ${step.title}`}</h3>
              <p className="text-pathwaiz-darkgray">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <div className="bg-pathwaiz-gray p-6 rounded-lg max-w-2xl text-center">
            <p className="text-lg font-medium">
              "The entire process is designed to give you authentic career insights without the awkwardness of traditional networking."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
