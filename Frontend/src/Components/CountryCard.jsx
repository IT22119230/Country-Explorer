import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiEye } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../redux/country/countriesSlice';
import CountryDetailsModal from './CountryDetails';

export default function CountryCard({ country }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { favorites } = useSelector((state) => state.countries);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isFavorite = favorites?.some(fav => fav.cca3 === country.cca3);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFavorite(country.cca3));
    } else {
      dispatch(addFavorite(country));
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden border border-gray-100"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Flag Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={country.flags.png} 
            alt={`Flag of ${country.name.common}`} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          
          {/* Favorite Button */}
          {currentUser && (
            <button 
              onClick={toggleFavorite}
              className={`absolute top-3 right-3 p-2 rounded-full shadow-md backdrop-blur-sm ${
                isFavorite 
                  ? 'bg-red-500/90 text-white' 
                  : 'bg-white/90 text-gray-700 hover:bg-gray-100'
              } transition-colors`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <FiHeart className={isFavorite ? 'fill-current' : ''} />
            </button>
          )}
        </div>
        
        {/* Country Info */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-800 mb-2">{country.name.common}</h3>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                {country.region}{country.subregion && ` • ${country.subregion}`}
              </p>
              <p className="text-sm text-gray-500">
                {country.population.toLocaleString()} people
              </p>
            </div>
            
            <button 
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              <FiEye /> Details
            </button>
          </div>
        </div>
      </motion.div>

      <CountryDetailsModal
        country={country}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}