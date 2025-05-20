
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DesktopNav from './navbar/DesktopNav';
import MobileMenu from './navbar/MobileMenu';

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleProfileClick = () => {
    if (userRole === 'mentee') {
      navigate('/mentee-profile');
    } else if (userRole === 'mentor') {
      navigate('/mentor-profile');
    }
  };

  return (
    <nav 
      className={`py-4 bg-white sticky top-0 z-50 transition-all duration-200 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <span className="text-2xl font-display font-bold text-pathwaiz-black group-hover:text-pathwaiz-blue transition-colors duration-200">
            Pathwaiz
          </span>
        </Link>

        {/* Desktop Navigation */}
        <DesktopNav 
          onProfileClick={handleProfileClick} 
          currentPath={location.pathname}
        />

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-pathwaiz-black hover:text-pathwaiz-blue transition-colors p-1 rounded-md"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        onProfileClick={handleProfileClick}
        currentPath={location.pathname}
      />
    </nav>
  );
};

export default NavBar;
