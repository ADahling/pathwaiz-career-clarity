
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-12">
      <div className="container-custom">
        {/* Footer Top */}
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-black">Pathwaiz</span>
            </Link>
            <p className="text-pathwaiz-darkgray">
              Navigate your career path with confidence.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-pathwaiz-darkgray hover:text-pathwaiz-blue transition-colors">How It Works</Link></li>
              <li><Link to="/" className="text-pathwaiz-darkgray hover:text-pathwaiz-blue transition-colors">Find a Mentor</Link></li>
              <li><Link to="/" className="text-pathwaiz-darkgray hover:text-pathwaiz-blue transition-colors">Become a Mentor</Link></li>
              <li><Link to="/" className="text-pathwaiz-darkgray hover:text-pathwaiz-blue transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="font-bold text-lg mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-pathwaiz-darkgray hover:text-pathwaiz-blue transition-colors">About Us</Link></li>
              <li><Link to="/" className="text-pathwaiz-darkgray hover:text-pathwaiz-blue transition-colors">Blog</Link></li>
              <li><Link to="/" className="text-pathwaiz-darkgray hover:text-pathwaiz-blue transition-colors">Careers</Link></li>
              <li><Link to="/" className="text-pathwaiz-darkgray hover:text-pathwaiz-blue transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-bold text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-pathwaiz-darkgray hover:text-pathwaiz-blue transition-colors">Terms of Service</Link></li>
              <li><Link to="/" className="text-pathwaiz-darkgray hover:text-pathwaiz-blue transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="text-pathwaiz-darkgray hover:text-pathwaiz-blue transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="pt-8 mt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-pathwaiz-darkgray mb-4 md:mb-0">© 2025 Pathwaiz. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link to="/" className="text-pathwaiz-darkgray hover:text-pathwaiz-blue transition-colors">
                Twitter
              </Link>
              <Link to="/" className="text-pathwaiz-darkgray hover:text-pathwaiz-blue transition-colors">
                LinkedIn
              </Link>
              <Link to="/" className="text-pathwaiz-darkgray hover:text-pathwaiz-blue transition-colors">
                Instagram
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
