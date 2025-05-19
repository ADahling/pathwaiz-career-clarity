
import React from 'react';
import { X, Check, Compass, MoneyWithWings } from 'lucide-react';

const ValueProposition: React.FC = () => {
  return (
    <section id="why-pathwaiz" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Pathwaiz?</h2>
          <p className="text-pathwaiz-darkgray max-w-2xl mx-auto">
            We're transforming how people explore potential careers by creating meaningful connections.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Without Pathwaiz */}
          <div className="bg-pathwaiz-gray p-8 rounded-xl">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-white rounded-full mr-4">
                <X className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold">Without Pathwaiz</h3>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <X className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                <span>Awkward coffee chats with strangers</span>
              </li>
              <li className="flex items-start">
                <X className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                <span>Cold DMs that often go unanswered</span>
              </li>
              <li className="flex items-start">
                <X className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                <span>Committing years before knowing if a career fits</span>
              </li>
              <li className="flex items-start">
                <X className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                <span>Asking for free advice from busy professionals</span>
              </li>
            </ul>
          </div>

          {/* With Pathwaiz */}
          <div className="bg-pathwaiz-blue bg-opacity-10 p-8 rounded-xl">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-white rounded-full mr-4">
                <Check className="w-6 h-6 text-pathwaiz-blue" />
              </div>
              <h3 className="text-xl font-bold">With Pathwaiz</h3>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-pathwaiz-blue mr-3 mt-0.5" />
                <span>Private, 1-on-1 conversations with industry professionals</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-pathwaiz-blue mr-3 mt-0.5" />
                <span>Scheduled sessions with clear expectations</span>
              </li>
              <li className="flex items-start">
                <MoneyWithWings className="w-5 h-5 text-pathwaiz-blue mr-3 mt-0.5" />
                <span>Mentors get fairly compensated for their time</span>
              </li>
              <li className="flex items-start">
                <Compass className="w-5 h-5 text-pathwaiz-blue mr-3 mt-0.5" />
                <span>Clarity before committing years to a career path</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
