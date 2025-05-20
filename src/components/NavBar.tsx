
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DesktopNav from './navbar/DesktopNav';
import MobileMenu from './navbar/MobileMenu';

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileClick = () => {
    if (userRole === 'mentee') {
      navigate('/mentee-profile');
    } else if (userRole === 'mentor') {
      navigate('/mentor-profile');
    }
  };

  return (
    <nav className="py-4 bg-white sticky top-0 z-50 shadow-sm">
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-black">Pathwaiz</span>
        </Link>

        {/* Desktop Navigation */}
        <DesktopNav 
          onProfileClick={handleProfileClick} 
          currentPath={location.pathname}
        />

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-black"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
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
