
import React from 'react';
import { MortarBoard, ArrowsCounterclockwise, Briefcase } from 'lucide-react';

const AudienceSection: React.FC = () => {
  const audiences = [
    {
      icon: <MortarBoard className="w-12 h-12 text-pathwaiz-blue" />,
      title: "Students & Grads",
      description: "Exploring what job to pursue after school and wanting to make informed decisions.",
    },
    {
      icon: <ArrowsCounterclockwise className="w-12 h-12 text-pathwaiz-blue" />,
      title: "Career Changers",
      description: "Seeking a new direction without taking blind leaps into unfamiliar industries.",
    },
    {
      icon: <Briefcase className="w-12 h-12 text-pathwaiz-blue" />,
      title: "Ambitious Professionals",
      description: "Curious about entrepreneurship or non-traditional career paths within their field.",
    },
  ];

  return (
    <section id="who-its-for" className="section-padding bg-pathwaiz-gray">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pathwaiz is built for...</h2>
          <p className="text-pathwaiz-darkgray max-w-2xl mx-auto">
            Whether you're just starting out or looking to pivot your career, Pathwaiz provides the connections you need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {audiences.map((audience, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              <div className="mb-6 p-4 bg-pathwaiz-gray rounded-full">{audience.icon}</div>
              <h3 className="text-xl font-bold mb-3">{audience.title}</h3>
              <p className="text-pathwaiz-darkgray">{audience.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
