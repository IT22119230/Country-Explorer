import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFavorite } from '../redux/country/countriesSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiTrash2, FiEye } from 'react-icons/fi';
import CountryDetailsModal from '../Components/CountryDetails';

export default function Favourite() {
  const dispatch = useDispatch();
  const { favorites } = useSelector((state) => state.countries);
  const { currentUser } = useSelector((state) => state.user);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localFavorites, setLocalFavorites] = useState([]);

  useEffect(() => {
    // Load favorites from localStorage if user is logged in
    if (currentUser) {
      const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      setLocalFavorites(storedFavorites);
    }
  }, [currentUser, favorites]);

  const handleRemoveFavorite = (countryCode, e) => {
    e.stopPropagation();
    dispatch(removeFavorite(countryCode));
  };

  const openDetailsModal = (country, e) => {
    e.stopPropagation();
    setSelectedCountry(country);
    setIsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsModalOpen(false);
    setSelectedCountry(null);
  };

  // Use localFavorites when user is logged in, otherwise empty array
  const displayFavorites = currentUser ? localFavorites : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Favorite Countries</h1>
      
      {!currentUser ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">Please sign in to view your favorite countries</p>
        </div>
      ) : displayFavorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">You haven't added any favorites yet</p>
          <p className="text-gray-500">Search for countries and click the ♡ icon to add them here</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {displayFavorites.map((country) => (
                <motion.div
                  key={country.cca3}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={country.flags.png} 
                      alt={`Flag of ${country.name.common}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{country.name.common}</h3>
                    
                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={(e) => openDetailsModal(country, e)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <FiEye /> View Details
                      </button>
                      
                      <button
                        onClick={(e) => handleRemoveFavorite(country.cca3, e)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                        title="Remove from favorites"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                    <FiHeart className="mr-1" />
                    <span>Favorited</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            {displayFavorites.length} {displayFavorites.length === 1 ? 'country' : 'countries'} in favorites
          </div>
        </>
      )}

      <CountryDetailsModal 
        country={selectedCountry} 
        isOpen={isModalOpen}
        onClose={closeDetailsModal} 
      />
    </div>
  );
}