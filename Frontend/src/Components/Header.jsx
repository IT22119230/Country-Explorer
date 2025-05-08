import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signOut, signInSuccess } from '../redux/user/userSlice';
import { motion } from 'framer-motion';
import { 
  FiMenu, 
  FiX,
  FiHome, 
  FiMap, 
  FiGlobe,
  FiInfo,
  FiUser,
  FiLogOut,
  FiHeart,
  FiCompass
} from 'react-icons/fi';
import { Button } from 'flowbite-react';
import { FcGoogle } from 'react-icons/fc';
import { GoogleAuthProvider, signInWithPopup, getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          _id: user.uid,
          username: user.displayName,
          email: user.email,
          profilePicture: user.photoURL
        };
        dispatch(signInSuccess(userData));
        sessionStorage.setItem('user', JSON.stringify(userData));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  const handleSignOut = () => {
    const auth = getAuth(app);
    auth.signOut();
    dispatch(signOut());
    sessionStorage.removeItem('user');
    navigate("/");
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      
      const userData = {
        _id: result.user.uid,
        username: result.user.displayName,
        email: result.user.email,
        profilePicture: result.user.photoURL
      };

      dispatch(signInSuccess(userData));
      sessionStorage.setItem('user', JSON.stringify(userData));
      navigate('/');
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const navItems = [
    { name: "Home", path: "/", icon: <FiHome className="mr-2" /> },
    { name: "Explore", path: "/countries", icon: <FiCompass className="mr-2" /> },
    { name: "Saved", path: "/favourite", icon: <FiHeart className="mr-2" /> },
  ];

  return (
    <header className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white shadow-lg w-full z-50 sticky top-0">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 60 }}
          className="flex items-center"
        >
          <NavLink 
            to="/" 
            className="flex items-center text-2xl font-bold hover:text-white transition-colors"
          >
            <FiGlobe className="text-white mr-2 text-3xl" />
            <span className="hidden sm:inline font-serif">Global Explorer</span>
          </NavLink>
        </motion.div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white focus:outline-none p-2 rounded-full hover:bg-indigo-700 transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-4 py-2 rounded-full transition-all
                ${isActive 
                  ? "bg-white/20 text-white shadow-md" 
                  : "hover:bg-white/10 hover:text-white"}
              `}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}

          {currentUser ? (
            <div className="relative ml-4">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  src={currentUser.profilePicture || "https://avatar.vercel.sh/placeholder"}
                  alt={currentUser.username}
                  className="h-10 w-10 rounded-full border-2 border-white/30 hover:border-white transition-colors"
                />
              </button>

              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-white/20">
                    <p className="font-medium text-gray-800">{currentUser.username}</p>
                    <p className="text-sm text-gray-600">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-white/50 hover:text-red-500"
                  >
                    <FiLogOut className="mr-2" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="ml-4">
              <Button 
                type="button" 
                className="bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-full px-6 py-2 shadow-sm border border-white/20"
                onClick={handleGoogleSignIn}
              >
                <FcGoogle className="w-5 h-5 mr-2" />
                Sign in
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-gradient-to-b from-indigo-900 to-purple-900 z-40 md:hidden flex flex-col pt-24 px-6"
            onClick={() => setMenuOpen(false)}
          >
            <div className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center text-lg py-4 px-6 rounded-xl transition-all
                    ${isActive 
                      ? "bg-white/20 text-white" 
                      : "hover:bg-white/10 hover:text-white"}
                  `}
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </div>

            <div className="mt-auto mb-8">
              {currentUser ? (
                <div className="flex items-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <img
                    src={currentUser.profilePicture || "https://avatar.vercel.sh/placeholder"}
                    alt={currentUser.username}
                    className="h-12 w-12 rounded-full border-2 border-white/30"
                  />
                  <div className="ml-4">
                    <p className="font-medium">{currentUser.username}</p>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center text-sm text-white/80 hover:text-red-300 mt-1"
                    >
                      <FiLogOut className="mr-1" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Button 
                  type="button" 
                  className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-full px-6 py-3 shadow-sm border border-white/20"
                  onClick={handleGoogleSignIn}
                >
                  <FcGoogle className="w-5 h-5 mr-2" />
                  Sign in with Google
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}