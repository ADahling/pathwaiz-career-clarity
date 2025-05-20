
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();

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
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/product" className="text-black hover:text-pathwaiz-blue transition-colors">
            Product
          </Link>
          <Link to="/how-it-works" className="text-black hover:text-pathwaiz-blue transition-colors">
            How It Works
          </Link>
          <Link to="/find-a-mentor" className="text-black hover:text-pathwaiz-blue transition-colors">
            Find a Mentor
          </Link>
          <Link to="/become-a-mentor" className="text-black hover:text-pathwaiz-blue transition-colors">
            Become a Mentor
          </Link>
          <Link to="/pricing" className="text-black hover:text-pathwaiz-blue transition-colors">
            Pricing
          </Link>
          <Link to="/about-us" className="text-black hover:text-pathwaiz-blue transition-colors">
            About Us
          </Link>
          <Link to="/careers" className="text-black hover:text-pathwaiz-blue transition-colors">
            Careers
          </Link>
          <Link to="/#who-its-for" className="text-black hover:text-pathwaiz-blue transition-colors">
            Who It's For
          </Link>
          <Link to="/#why-pathwaiz" className="text-black hover:text-pathwaiz-blue transition-colors">
            Why Pathwaiz
          </Link>
          
          {user ? (
            <>
              <Button 
                variant="outline" 
                className="border-black text-black hover:bg-gray-100"
                onClick={handleProfileClick}
              >
                My Profile
              </Button>
              <Button 
                className="bg-pathwaiz-blue text-white hover:bg-opacity-90"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="border-black text-black hover:bg-gray-100"
                onClick={() => navigate('/auth')}
              >
                Log In
              </Button>
              <Button 
                className="bg-pathwaiz-blue text-white hover:bg-opacity-90"
                onClick={() => {
                  navigate('/auth');
                  // Set the active tab to signup
                  document.querySelector('[value="signup"]')?.dispatchEvent(
                    new MouseEvent('click', { bubbles: true })
                  );
                }}
              >
                Sign Up
              </Button>
            </>
          )}
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
              to="/product" 
              className="text-black hover:text-pathwaiz-blue transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Product
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-black hover:text-pathwaiz-blue transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              to="/find-a-mentor" 
              className="text-black hover:text-pathwaiz-blue transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Find a Mentor
            </Link>
            <Link 
              to="/become-a-mentor" 
              className="text-black hover:text-pathwaiz-blue transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Become a Mentor
            </Link>
            <Link 
              to="/pricing" 
              className="text-black hover:text-pathwaiz-blue transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/about-us" 
              className="text-black hover:text-pathwaiz-blue transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/careers" 
              className="text-black hover:text-pathwaiz-blue transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Careers
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
            
            {user ? (
              <>
                <Button 
                  variant="outline" 
                  className="border-black text-black hover:bg-gray-100 w-full"
                  onClick={() => {
                    handleProfileClick();
                    setIsMenuOpen(false);
                  }}
                >
                  My Profile
                </Button>
                <Button 
                  className="bg-pathwaiz-blue text-white hover:bg-opacity-90 w-full"
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border-black text-black hover:bg-gray-100 w-full"
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                  }}
                >
                  Log In
                </Button>
                <Button 
                  className="bg-pathwaiz-blue text-white hover:bg-opacity-90 w-full"
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                    // Set the active tab to signup
                    setTimeout(() => {
                      document.querySelector('[value="signup"]')?.dispatchEvent(
                        new MouseEvent('click', { bubbles: true })
                      );
                    }, 100);
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
