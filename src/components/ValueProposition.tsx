
import React from 'react';
import { X, Check, Compass, Banknote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ValueProposition: React.FC = () => {
  return (
    <section id="why-pathwaiz" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <Badge variant="blue" className="mb-4">Why Choose Us</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Pathwaiz?</h2>
          <p className="text-pathwaiz-darkgray max-w-2xl mx-auto">
            We're transforming how people explore potential careers by creating meaningful connections.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Without Pathwaiz */}
          <div className="bg-pathwaiz-gray p-8 rounded-2xl shadow-soft hover:shadow-hover transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-white rounded-full mr-4 shadow-soft">
                <X className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold">Without Pathwaiz</h3>
            </div>
            
            <ul className="space-y-5">
              <li className="flex items-start">
                <div className="mt-1 mr-4 p-1.5 rounded-full bg-red-100">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-pathwaiz-darkgray">Awkward coffee chats with strangers</span>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-4 p-1.5 rounded-full bg-red-100">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-pathwaiz-darkgray">Cold DMs that often go unanswered</span>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-4 p-1.5 rounded-full bg-red-100">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-pathwaiz-darkgray">Committing years before knowing if a career fits</span>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-4 p-1.5 rounded-full bg-red-100">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-pathwaiz-darkgray">Asking for free advice from busy professionals</span>
              </li>
            </ul>
          </div>

          {/* With Pathwaiz */}
          <div className="bg-pathwaiz-blue bg-opacity-5 p-8 rounded-2xl shadow-soft hover:shadow-hover transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-white rounded-full mr-4 shadow-soft">
                <Check className="w-6 h-6 text-pathwaiz-blue" />
              </div>
              <h3 className="text-xl font-bold">With Pathwaiz</h3>
            </div>
            
            <ul className="space-y-5">
              <li className="flex items-start">
                <div className="mt-1 mr-4 p-1.5 rounded-full bg-blue-100">
                  <Check className="w-4 h-4 text-pathwaiz-blue" />
                </div>
                <span className="text-pathwaiz-darkgray">Private, 1-on-1 conversations with industry professionals</span>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-4 p-1.5 rounded-full bg-blue-100">
                  <Check className="w-4 h-4 text-pathwaiz-blue" />
                </div>
                <span className="text-pathwaiz-darkgray">Scheduled sessions with clear expectations</span>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-4 p-1.5 rounded-full bg-blue-100">
                  <Banknote className="w-4 h-4 text-pathwaiz-blue" />
                </div>
                <span className="text-pathwaiz-darkgray">Mentors get fairly compensated for their time</span>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-4 p-1.5 rounded-full bg-blue-100">
                  <Compass className="w-4 h-4 text-pathwaiz-blue" />
                </div>
                <span className="text-pathwaiz-darkgray">Clarity before committing years to a career path</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
