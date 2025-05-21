import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { navLinks } from './navbar/navLinks';
import MobileMenu from './navbar/MobileMenu';
import AuthButtons from './navbar/AuthButtons';
import { useMobile } from '@/hooks/use-mobile';

export const NavBar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isMobile = useMobile();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Effect for scrolling behavior
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl">MentorMatch</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                isActive(link.path)
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground'
              )}
            >
              {link.text}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {!isMobile && <AuthButtons />}
          
          {/* Mobile menu button */}
          {isMobile && (
            <button
              className="p-2 text-muted-foreground hover:text-primary focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {!mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && <MobileMenu />}
    </header>
  );
};
