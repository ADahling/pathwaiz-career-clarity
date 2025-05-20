
import React from 'react';
import { X, Check, Compass, Banknote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const ValueProposition: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="why-pathwaiz" className="section-padding bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-pathwaiz-blue opacity-5 rounded-full"></div>
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-pathwaiz-blue opacity-3 rounded-full"></div>
      
      <div className="container-custom relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <Badge variant="blue" className="mb-4 px-4 py-1 text-sm font-medium">Why Choose Us</Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 tracking-tight">Why Pathwaiz?</h2>
          <p className="text-pathwaiz-darkgray text-lg max-w-2xl mx-auto">
            We're transforming how people explore potential careers by creating meaningful connections.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* Without Pathwaiz */}
          <motion.div 
            variants={itemVariants}
            className="bg-pathwaiz-gray p-8 md:p-10 rounded-2xl shadow-soft hover:shadow-hover transition-all duration-300"
          >
            <div className="flex items-center mb-8">
              <div className="p-3 bg-white rounded-xl mr-4 shadow-soft">
                <X className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-display">Without Pathwaiz</h3>
            </div>
            
            <ul className="space-y-5">
              <li className="flex items-start group">
                <div className="mt-1 mr-4 p-1.5 rounded-full bg-red-100 transition-all duration-200 group-hover:bg-red-200">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-pathwaiz-darkgray group-hover:text-black transition-colors duration-200">Awkward coffee chats with strangers</span>
              </li>
              <li className="flex items-start group">
                <div className="mt-1 mr-4 p-1.5 rounded-full bg-red-100 transition-all duration-200 group-hover:bg-red-200">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-pathwaiz-darkgray group-hover:text-black transition-colors duration-200">Cold DMs that often go unanswered</span>
              </li>
              <li className="flex items-start group">
                <div className="mt-1 mr-4 p-1.5 rounded-full bg-red-100 transition-all duration-200 group-hover:bg-red-200">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-pathwaiz-darkgray group-hover:text-black transition-colors duration-200">Committing years before knowing if a career fits</span>
              </li>
              <li className="flex items-start group">
                <div className="mt-1 mr-4 p-1.5 rounded-full bg-red-100 transition-all duration-200 group-hover:bg-red-200">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-pathwaiz-darkgray group-hover:text-black transition-colors duration-200">Asking for free advice from busy professionals</span>
              </li>
            </ul>
          </motion.div>

          {/* With Pathwaiz */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-blue-50 to-white p-8 md:p-10 rounded-2xl shadow-soft hover:shadow-hover transition-all duration-300 border border-blue-100"
          >
            <div className="flex items-center mb-8">
              <div className="p-3 bg-pathwaiz-blue bg-opacity-10 rounded-xl mr-4 shadow-soft">
                <Check className="w-6 h-6 text-pathwaiz-blue" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-display">With Pathwaiz</h3>
            </div>
            
            <ul className="space-y-5">
              <li className="flex items-start group">
                <div className="mt-1 mr-4 p-1.5 rounded-full bg-blue-100 transition-all duration-200 group-hover:bg-blue-200">
                  <Check className="w-4 h-4 text-pathwaiz-blue" />
                </div>
                <span className="text-pathwaiz-darkgray group-hover:text-black transition-colors duration-200">Private, 1-on-1 conversations with industry professionals</span>
              </li>
              <li className="flex items-start group">
                <div className="mt-1 mr-4 p-1.5 rounded-full bg-blue-100 transition-all duration-200 group-hover:bg-blue-200">
                  <Check className="w-4 h-4 text-pathwaiz-blue" />
                </div>
                <span className="text-pathwaiz-darkgray group-hover:text-black transition-colors duration-200">Scheduled sessions with clear expectations</span>
              </li>
              <li className="flex items-start group">
                <div className="mt-1 mr-4 p-1.5 rounded-full bg-blue-100 transition-all duration-200 group-hover:bg-blue-200">
                  <Banknote className="w-4 h-4 text-pathwaiz-blue" />
                </div>
                <span className="text-pathwaiz-darkgray group-hover:text-black transition-colors duration-200">Mentors get fairly compensated for their time</span>
              </li>
              <li className="flex items-start group">
                <div className="mt-1 mr-4 p-1.5 rounded-full bg-blue-100 transition-all duration-200 group-hover:bg-blue-200">
                  <Compass className="w-4 h-4 text-pathwaiz-blue" />
                </div>
                <span className="text-pathwaiz-darkgray group-hover:text-black transition-colors duration-200">Clarity before committing years to a career path</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ValueProposition;
