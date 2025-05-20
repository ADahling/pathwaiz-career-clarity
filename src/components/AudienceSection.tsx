
import React from 'react';
import { Briefcase, ArrowUpFromLine, GraduationCap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AudienceSection: React.FC = () => {
  const audiences = [
    {
      icon: <GraduationCap className="w-12 h-12 text-pathwaiz-blue" />,
      title: "Students & Grads",
      description: "Exploring what job to pursue after school and wanting to make informed decisions before committing to a path.",
    },
    {
      icon: <ArrowUpFromLine className="w-12 h-12 text-pathwaiz-blue" />,
      title: "Career Changers",
      description: "Seeking a new direction without taking blind leaps into unfamiliar industries or roles.",
    },
    {
      icon: <Briefcase className="w-12 h-12 text-pathwaiz-blue" />,
      title: "Ambitious Professionals",
      description: "Curious about entrepreneurship or non-traditional career paths within their field of expertise.",
    },
  ];

  return (
    <section id="who-its-for" className="section-padding bg-gray-50 relative">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-pathwaiz-blue uppercase tracking-wider">Who We Serve</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-4">Pathwaiz is built for...</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Whether you're just starting out or looking to pivot your career, Pathwaiz provides the connections you need to make confident decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {audiences.map((audience, index) => (
            <Card 
              key={index} 
              className="bg-white rounded-2xl border-none shadow-soft hover:shadow-hover transition-all duration-300 overflow-hidden group"
            >
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="mb-6 p-5 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
                  {audience.icon}
                </div>
                <h3 className="text-2xl font-display font-bold mb-3">{audience.title}</h3>
                <p className="text-gray-600">{audience.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
