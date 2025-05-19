
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="py-4 bg-white sticky top-0 z-50 shadow-sm">
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-black">Pathwaiz</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/#how-it-works" className="text-black hover:text-pathwaiz-blue transition-colors">
            How It Works
          </Link>
          <Link to="/#who-its-for" className="text-black hover:text-pathwaiz-blue transition-colors">
            Who It's For
          </Link>
          <Link to="/#why-pathwaiz" className="text-black hover:text-pathwaiz-blue transition-colors">
            Why Pathwaiz
          </Link>
          <Button variant="outline" className="border-black text-black hover:bg-gray-100">
            Become a Mentor
          </Button>
          <Button className="bg-pathwaiz-blue text-white hover:bg-opacity-90">
            Find a Mentor
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-black"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 right-0 shadow-md py-4 animate-fade-in">
          <div className="container-custom flex flex-col space-y-4">
            <Link 
              to="/#how-it-works" 
              className="text-black hover:text-pathwaiz-blue transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              to="/#who-its-for" 
              className="text-black hover:text-pathwaiz-blue transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Who It's For
            </Link>
            <Link 
              to="/#why-pathwaiz" 
              className="text-black hover:text-pathwaiz-blue transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Why Pathwaiz
            </Link>
            <Button 
              variant="outline" 
              className="border-black text-black hover:bg-gray-100 w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              Become a Mentor
            </Button>
            <Button 
              className="bg-pathwaiz-blue text-white hover:bg-opacity-90 w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              Find a Mentor
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
