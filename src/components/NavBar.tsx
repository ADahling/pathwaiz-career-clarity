import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, ChevronDown, Bell, User, Settings } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { navLinks } from './navbar/navLinks';

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3); // Mock notification count
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle scroll effect for navbar with enhanced animation
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

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleProfileClick = () => {
    if (userRole === 'mentee') {
      navigate('/mentee-profile');
    } else if (userRole === 'mentor') {
      navigate('/mentor-profile');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Group navigation links into categories for dropdown menus
  const navCategories = {
    'Find Mentorship': [
      { text: 'Find a Mentor', path: '/find-a-mentor' },
      { text: 'Browse by Industry', path: '/browse/industry' },
      { text: 'Browse by Expertise', path: '/browse/expertise' },
      { text: 'Top Rated Mentors', path: '/top-mentors' },
    ],
    'Offer Mentorship': [
      { text: 'Become a Mentor', path: '/become-a-mentor' },
      { text: 'Mentor Guidelines', path: '/mentor-guidelines' },
      { text: 'Success Stories', path: '/success-stories' },
    ],
    'About': [
      { text: 'About Us', path: '/about-us' },
      { text: 'How It Works', path: '/how-it-works' },
      { text: 'Pricing', path: '/pricing' },
      { text: 'Careers', path: '/careers' },
      { text: 'Contact', path: '/contact' },
    ],
  };

  // Logo animation variants
  const logoVariants = {
    normal: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { 
        duration: 0.3,
        yoyo: Infinity,
        ease: "easeInOut" 
      }
    }
  };

  // Path animation for the logo
  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeInOut"
      }
    }
  };

  return (
    <nav 
      className={cn(
        "py-4 bg-white sticky top-0 z-50 transition-all duration-300",
        scrolled ? 
          "shadow-lg backdrop-blur-md bg-white/90 py-3" : 
          "shadow-sm py-4"
      )}
    >
      <div className="container-custom flex justify-between items-center">
        {/* Animated Logo */}
        <Link to="/" className="flex items-center group">
          <motion.div
            initial="normal"
            whileHover="hover"
            variants={logoVariants}
            className="flex items-center"
          >
            <div className="mr-2 relative w-10 h-10 flex items-center justify-center">
              <motion.svg 
                width="40" 
                height="40" 
                viewBox="0 0 40 40" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                initial="hidden"
                animate="visible"
              >
                <motion.path 
                  d="M20 5L30 15L20 25L10 15L20 5Z" 
                  stroke="#3B82F6" 
                  strokeWidth="2"
                  variants={pathVariants}
                />
                <motion.path 
                  d="M20 25L30 35L20 35L10 35L20 25Z" 
                  stroke="#3B82F6" 
                  strokeWidth="2"
                  variants={pathVariants}
                />
                <motion.circle 
                  cx="20" 
                  cy="15" 
                  r="3" 
                  fill="#3B82F6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                />
              </motion.svg>
            </div>
            <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300">
              Pathwaiz
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation with Dropdowns */}
        <div className="hidden lg:flex items-center space-x-1">
          {/* Product Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center px-3 py-2 text-base font-medium">
                Product
                <ChevronDown size={16} className="ml-1 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 backdrop-blur-md bg-white/95 border border-gray-200 shadow-xl rounded-xl p-2">
              <DropdownMenuItem asChild>
                <Link to="/product" className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-blue-50">
                  <div className="w-8 h-8 mr-3 rounded-full bg-blue-100 flex items-center justify-center">
                    <Settings size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Overview</p>
                    <p className="text-xs text-gray-500">Platform features</p>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/how-it-works" className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-blue-50">
                  <div className="w-8 h-8 mr-3 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Settings size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium">How It Works</p>
                    <p className="text-xs text-gray-500">Our process</p>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/pricing" className="flex items-center cursor-pointer rounded-lg p-2 hover:bg-blue-50">
                  <div className="w-8 h-8 mr-3 rounded-full bg-green-100 flex items-center justify-center">
                    <Settings size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Pricing</p>
                    <p className="text-xs text-gray-500">Plans & pricing</p>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Find Mentorship Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center px-3 py-2 text-base font-medium">
                Find Mentorship
                <ChevronDown size={16} className="ml-1 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 backdrop-blur-md bg-white/95 border border-gray-200 shadow-xl rounded-xl p-2">
              {navCategories['Find Mentorship'].map((item, index) => (
                <DropdownMenuItem key={index} asChild>
                  <Link 
                    to={item.path} 
                    className={cn(
                      "flex items-center cursor-pointer rounded-lg p-2 hover:bg-blue-50",
                      location.pathname === item.path && "bg-blue-50"
                    )}
                  >
                    {item.text}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Offer Mentorship Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center px-3 py-2 text-base font-medium">
                Offer Mentorship
                <ChevronDown size={16} className="ml-1 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 backdrop-blur-md bg-white/95 border border-gray-200 shadow-xl rounded-xl p-2">
              {navCategories['Offer Mentorship'].map((item, index) => (
                <DropdownMenuItem key={index} asChild>
                  <Link 
                    to={item.path} 
                    className={cn(
                      "flex items-center cursor-pointer rounded-lg p-2 hover:bg-blue-50",
                      location.pathname === item.path && "bg-blue-50"
                    )}
                  >
                    {item.text}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* About Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center px-3 py-2 text-base font-medium">
                About
                <ChevronDown size={16} className="ml-1 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 backdrop-blur-md bg-white/95 border border-gray-200 shadow-xl rounded-xl p-2">
              {navCategories['About'].map((item, index) => (
                <DropdownMenuItem key={index} asChild>
                  <Link 
                    to={item.path} 
                    className={cn(
                      "flex items-center cursor-pointer rounded-lg p-2 hover:bg-blue-50",
                      location.pathname === item.path && "bg-blue-50"
                    )}
                  >
                    {item.text}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center space-x-2">
          {/* Search Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-blue-50"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={20} className="text-gray-700" />
          </Button>

          {/* Auth Buttons or User Menu */}
          {user ? (
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 relative">
                    <Bell size={20} className="text-gray-700" />
                    {notifications > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center p-0 rounded-full">
                        {notifications}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 backdrop-blur-md bg-white/95 border border-gray-200 shadow-xl rounded-xl p-2">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-y-auto">
                    <div className="p-2 hover:bg-blue-50 rounded-lg cursor-pointer">
                      <p className="font-medium">New message from Sarah</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                    <div className="p-2 hover:bg-blue-50 rounded-lg cursor-pointer">
                      <p className="font-medium">Upcoming session with David</p>
                      <p className="text-xs text-gray-500">Tomorrow at 3:00 PM</p>
                    </div>
                    <div className="p-2 hover:bg-blue-50 rounded-lg cursor-pointer">
                      <p className="font-medium">New review on your profile</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer justify-center text-blue-600">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-0 h-10 w-10 overflow-hidden hover:ring-2 hover:ring-blue-200">
                    <Avatar>
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 backdrop-blur-md bg-white/95 border border-gray-200 shadow-xl rounded-xl p-2">
                  <div className="px-2 py-1.5">
                    <p className="font-medium">{user.email}</p>
                    <p className="text-xs text-gray-500 capitalize">{userRole || 'User'}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                    <User size={16} className="mr-2" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                    <Settings size={16} className="mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                className="font-medium hover:bg-blue-50 hover:text-blue-600"
                onClick={() => navigate('/auth')}
              >
                Log In
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => navigate('/auth')}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-2 lg:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-blue-50"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={20} className="text-gray-700" />
          </Button>
          
          <Button 
            variant="ghost"
            size="icon"
            className="text-pathwaiz-black hover:text-pathwaiz-blue hover:bg-blue-50 transition-colors rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div 
              className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden mx-4"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearchSubmit} className="flex items-center p-4">
                <Search size={20} className="text-gray-400 mr-2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search mentors, topics, or industries..."
                  className="flex-1 outline-none text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSearchOpen(false)}
                >
                  <X size={20} />
                </Button>
              </form>
              <div className="border-t border-gray-100 p-4">
                <p className="text-sm text-gray-500 mb-2">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {['Software Development', 'Career Change', 'Leadership', 'UX Design', 'Marketing'].map((term) => (
                    <Badge 
                      key={term} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => {
                        setSearchQuery(term);
                        searchInputRef.current?.focus();
                      }}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="container-custom py-4">
              <div className="space-y-4">
                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  {Object.entries(navCategories).map(([category, links]) => (
                    <div key={category} className="space-y-1">
                      <h3 className="text-sm font-semibold text-gray-500 px-2">{category}</h3>
                      {links.map((link, index) => (
                        <Link
                          key={index}
                          to={link.path}
                          className={cn(
                            "block px-2 py-2 rounded-lg text-base font-medium",
                            location.pathname === link.path
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-800 hover:bg-gray-50"
                          )}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.text}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Mobile Auth Buttons */}
                <div className="pt-4 border-t border-gray-100">
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 px-2 py-2">
                        <Avatar>
                          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                          <AvatarFallback>
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.email}</p>
                          <p className="text-xs text-gray-500 capitalize">{userRole || 'User'}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          handleProfileClick();
                          setIsMenuOpen(false);
                        }}
                      >
                        <User size={16} className="mr-2" />
                        My Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          navigate('/dashboard');
                          setIsMenuOpen(false);
                        }}
                      >
                        <Settings size={16} className="mr-2" />
                        Dashboard
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                      >
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          navigate('/auth');
                          setIsMenuOpen(false);
                        }}
                      >
                        Log In
                      </Button>
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                        onClick={() => {
                          navigate('/auth');
                          setIsMenuOpen(false);
                        }}
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;
