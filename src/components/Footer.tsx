import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path 
                    d="M12 2L2 7L12 12L22 7L12 2Z" 
                    className="premium-gradient-bg"
                    stroke="url(#gradient-footer)" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M2 17L12 22L22 17" 
                    className="premium-gradient-bg"
                    stroke="url(#gradient-footer)" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M2 12L12 17L22 12" 
                    className="premium-gradient-bg"
                    stroke="url(#gradient-footer)" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient id="gradient-footer" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3B82F6" />
                      <stop offset="0.5" stopColor="#6366F1" />
                      <stop offset="1" stopColor="#4F46E5" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="text-xl font-bold premium-gradient-text">Pathwaiz</span>
            </Link>
            <p className="text-gray-600">
              Connecting people with mentors across all walks of life for personalized guidance and growth.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/find-a-mentor" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Find a Mentor
                </Link>
              </li>
              <li>
                <Link to="/become-a-mentor" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Become a Mentor
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-gray-600 hover:text-blue-600 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Mentorship Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Mentorship Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/find-a-mentor?category=career-development" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Career Development
                </Link>
              </li>
              <li>
                <Link to="/find-a-mentor?category=personal-growth" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Personal Growth
                </Link>
              </li>
              <li>
                <Link to="/find-a-mentor?category=business-advice" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Business Advice
                </Link>
              </li>
              <li>
                <Link to="/find-a-mentor?category=creative-pursuits" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Creative Pursuits
                </Link>
              </li>
              <li>
                <Link to="/find-a-mentor?category=technical-expertise" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Technical Expertise
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="text-blue-600 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">
                  123 Mentorship Way<br />
                  San Francisco, CA 94103
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-blue-600 mr-2 flex-shrink-0" />
                <span className="text-gray-600">(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-blue-600 mr-2 flex-shrink-0" />
                <span className="text-gray-600">contact@pathwaiz.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-200 pt-8 pb-12">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2">Subscribe to our newsletter</h3>
            <p className="text-gray-600 mb-4">
              Get the latest mentorship tips and updates delivered to your inbox.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="premium-input flex-grow rounded-r-none"
              />
              <button
                type="submit"
                className="premium-gradient-bg text-white px-4 py-2 rounded-r-md hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Pathwaiz. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-gray-500 text-sm hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-gray-500 text-sm hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="text-gray-500 text-sm hover:text-blue-600 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
