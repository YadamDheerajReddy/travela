import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navItems = ['Home', 'About', 'Companion', 'Contact'];

  return (
    <nav className="bg-white shadow-lg w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20">
          {/* Logo - Left */}
          <div className="flex-none flex items-center">
            <Link 
              to="/app"
              className="text-3xl font-light tracking-tight text-gray-800 hover:text-gray-600 transition-colors"
            >
              travela<span className="font-bold text-blue-500">.</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-auto flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation Links - Middle */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
            {navItems.map((item) => {
              const path = item === 'Home' ? '/app' : 
                          item === 'Companion' ? '/companion' : 
                          `/${item.toLowerCase()}`;
              const isActive = location.pathname === path;
              
              return (
                <motion.div
                  key={item}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={path}
                    className={`${
                      isActive ? 'text-blue-500 font-semibold' : 'text-gray-600'
                    } hover:text-blue-500 text-sm font-medium transition-colors relative group`}
                  >
                    {item}
                    {isActive && (
                      <motion.div 
                        className="absolute -bottom-2 left-0 right-0 h-0.5 bg-blue-500"
                        layoutId="underline"
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Logout Button - Right */}
          <div className="hidden md:flex flex-none items-center">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 
                         text-sm font-medium transition-colors shadow-md"
            >
              Logout
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item}
                  to={item === 'Home' ? '/app' : 
                      item === 'Companion' ? '/companion' : 
                      `/${item.toLowerCase()}`}
                  className="block px-3 py-2 text-gray-600 hover:text-blue-500 hover:bg-gray-50 
                           rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-500 
                           hover:bg-gray-50 rounded-md text-base font-medium"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;