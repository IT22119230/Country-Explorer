import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountries } from '../redux/country/countriesSlice';
import { FiCompass, FiMapPin, FiHeart, FiGlobe, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router-dom';
import CountryCard from '../Components/CountryCard';

const regions = [
  {
    name: 'Europe',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    color: 'from-indigo-500 to-purple-600'
  },
  {
    name: 'Asia',
    image: 'https://images.unsplash.com/photo-1536599424071-0b215a388ba7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    color: 'from-amber-500 to-red-600'
  },
  {
    name: 'Africa',
    image: 'https://images.unsplash.com/photo-1442530792250-81629236fe54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    color: 'from-emerald-500 to-green-600'
  },
  {
    name: 'Americas',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    name: 'Oceania',
    image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    color: 'from-sky-500 to-blue-600'
  }
];

const FeatureCard = ({ icon, title, description, index }) => {
  const colors = [
    'bg-gradient-to-br from-pink-500 to-rose-500',
    'bg-gradient-to-br from-violet-500 to-indigo-500',
    'bg-gradient-to-br from-amber-500 to-orange-500',
    'bg-gradient-to-br from-emerald-500 to-teal-500'
  ];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
    >
      <div className={`h-2 ${colors[index % colors.length]}`}></div>
      <div className="p-6">
        <div className={`w-12 h-12 ${colors[index % colors.length]} rounded-lg flex items-center justify-center text-white mb-4`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

const SectionTitle = ({ title, subtitle, highlight }) => {
  return (
    <div className="text-center mb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="inline-block px-4 py-2 bg-gray-100 rounded-full mb-4"
      >
        <span className="text-sm font-medium text-gray-600">{highlight}</span>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-gray-900 mb-3"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
        className="text-lg text-gray-600 max-w-2xl mx-auto"
      >
        {subtitle}
      </motion.p>
    </div>
  );
};

const RegionCard = ({ region, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative rounded-xl overflow-hidden shadow-lg h-64 cursor-pointer group"
      onClick={() => onClick(region.name)}
    >
      <div className={`absolute inset-0 bg-gradient-to-t ${region.color} opacity-90`} />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all" />
      <img 
        src={region.image}
        alt={region.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-end p-6 z-10">
        <div>
          <h3 className="text-white text-2xl font-bold mb-2">{region.name}</h3>
          <div className="flex items-center text-white/80 group-hover:text-white transition-colors">
            <span>Explore region</span>
            <FiChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const dispatch = useDispatch();
  const { countries, status, error } = useSelector((state) => state.countries);
  const [featuredCountries, setFeaturedCountries] = useState([]);
  const navigate = useNavigate();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  useEffect(() => {
    if (countries.length > 0) {
      const shuffled = [...countries].sort(() => 0.5 - Math.random());
      setFeaturedCountries(shuffled.slice(0, 4));
    }
  }, [countries]);

  const handleExploreClick = () => {
    navigate('/countries');
  };

  const handleRegionClick = (region) => {
    navigate(`/countries?region=${encodeURIComponent(region)}`);
  };

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <Skeleton height={160} />
              <div className="p-4">
                <Skeleton width="60%" height={24} />
                <Skeleton count={2} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-red-100"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error loading countries</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 font-medium transition-colors"
            >
              Go to Home
            </button>
            <button
              onClick={() => dispatch(fetchCountries())}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&q=80"
            alt="World map"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900/80"></div>
        </div>
        
        <div className="container mx-auto px-4 py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                Discover Our World
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
              Explore diverse cultures, breathtaking landscapes, and hidden gems across the globe
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExploreClick}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Start Exploring
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Features Section */}
        <section className="py-16">
          <SectionTitle 
            title="Why Explore With Us"
            subtitle="We make discovering the world effortless and enjoyable"
            highlight="FEATURES"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<FiCompass size={24} />}
              title="Interactive Maps"
              description="Navigate with our intuitive maps that highlight key attractions and local favorites."
              index={0}
            />
            <FeatureCard
              icon={<FiGlobe size={24} />}
              title="Global Coverage"
              description="Comprehensive information on every country, from major cities to remote villages."
              index={1}
            />
            <FeatureCard
              icon={<FiHeart size={24} />}
              title="Personalized Lists"
              description="Save your favorite destinations and create custom travel itineraries."
              index={2}
            />
            <FeatureCard
              icon={<FiMapPin size={24} />}
              title="Local Insights"
              description="Get authentic recommendations from locals and experienced travelers."
              index={3}
            />
          </div>
        </section>

        {/* Featured Destinations */}
        <section className="py-16">
          <SectionTitle 
            title="Featured Destinations"
            subtitle="Handpicked countries that showcase the diversity of our planet"
            highlight="EXPLORE"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence>
              {featuredCountries.map((country, index) => (
                <motion.div 
                  key={country.cca3}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="cursor-pointer"
                  onClick={() => navigate(`/countries/${country.cca3}`)}
                >
                  <CountryCard country={country} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Popular Regions */}
        <section className="py-16">
          <SectionTitle 
            title="Explore by Region"
            subtitle="Each region offers unique experiences and cultural treasures"
            highlight="REGIONS"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {regions.map((region) => (
              <RegionCard 
                key={region.name} 
                region={region}
                onClick={handleRegionClick}
              />
            ))}
          </div>
        </section>

        {/* Travel Tips */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 my-16"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Travel Inspiration</h2>
            <p className="text-lg text-gray-600 mb-8">
              Discover new perspectives and plan your next adventure with our curated travel guides.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-xl mb-3 text-cyan-600">Cultural Experiences</h3>
                <p className="text-gray-600">
                  Immerse yourself in local traditions, festivals, and authentic cultural encounters.
                </p>
              </div>
              <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-xl mb-3 text-emerald-600">Natural Wonders</h3>
                <p className="text-gray-600">
                  Explore breathtaking landscapes, national parks, and ecological treasures.
                </p>
              </div>
              <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-xl mb-3 text-amber-600">Urban Adventures</h3>
                <p className="text-gray-600">
                  Discover vibrant cities with rich histories, modern attractions, and local flavors.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Begin your journey today and discover the wonders of our world.
          </p>
          <button
            onClick={handleExploreClick}
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Browse All Countries
          </button>
        </motion.div>
      </div>
    </div>
  );
}