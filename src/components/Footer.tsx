
import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-16 border-t border-gray-100">
      <div className="container-custom">
        {/* Footer Top */}
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-display font-bold text-pathwaiz-black">Pathwaiz</span>
            </Link>
            <p className="text-gray-600 max-w-xs">
              Navigate your career path with confidence through expert mentorship and real-world insights.
            </p>
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-pathwaiz-darkgray hover:bg-pathwaiz-blue hover:text-white transition-colors"
              >
                <Twitter size={18} />
                <span className="sr-only">Twitter</span>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-pathwaiz-darkgray hover:bg-pathwaiz-blue hover:text-white transition-colors"
              >
                <Linkedin size={18} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-pathwaiz-darkgray hover:bg-pathwaiz-blue hover:text-white transition-colors"
              >
                <Instagram size={18} />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
          
          {/* Product Links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/how-it-works" className="text-gray-600 hover:text-pathwaiz-blue transition-colors hover-translate inline-block">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/find-a-mentor" className="text-gray-600 hover:text-pathwaiz-blue transition-colors hover-translate inline-block">
                  Find a Mentor
                </Link>
              </li>
              <li>
                <Link to="/become-a-mentor" className="text-gray-600 hover:text-pathwaiz-blue transition-colors hover-translate inline-block">
                  Become a Mentor
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-pathwaiz-blue transition-colors hover-translate inline-block">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/product" className="text-gray-600 hover:text-pathwaiz-blue transition-colors hover-translate inline-block">
                  Features
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about-us" className="text-gray-600 hover:text-pathwaiz-blue transition-colors hover-translate inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-pathwaiz-blue transition-colors hover-translate inline-block">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-pathwaiz-blue transition-colors hover-translate inline-block">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/#who-its-for" className="text-gray-600 hover:text-pathwaiz-blue transition-colors hover-translate inline-block">
                  Who It's For
                </Link>
              </li>
              <li>
                <Link to="/#why-pathwaiz" className="text-gray-600 hover:text-pathwaiz-blue transition-colors hover-translate inline-block">
                  Why Pathwaiz
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-pathwaiz-blue transition-colors hover-translate inline-block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-pathwaiz-blue transition-colors hover-translate inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-600 hover:text-pathwaiz-blue transition-colors hover-translate inline-block">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">© 2025 Pathwaiz. All rights reserved.</p>
            <p className="text-gray-500 text-sm">
              Helping professionals find their path since 2024
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
