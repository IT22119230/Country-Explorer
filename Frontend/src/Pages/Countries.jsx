import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountries } from '../redux/country/countriesSlice';
import { FiSearch, FiX, FiArrowLeft, FiFilter } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import CountryCard from '../Components/CountryCard';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Countries() {
  const dispatch = useDispatch();
  const { countries, status, error } = useSelector((state) => state.countries);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [previousFilters, setPreviousFilters] = useState({
    searchTerm: '',
    regionFilter: '',
    languageFilter: ''
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const region = searchParams.get('region');
    const language = searchParams.get('language');
    
    if (region) {
      setRegionFilter(region);
    }
    if (language) {
      setLanguageFilter(language);
    }
  }, [location.search]);

  const allLanguages = useMemo(() => {
    const languages = new Set();
    countries.forEach(country => {
      if (country.languages) {
        Object.values(country.languages).forEach(lang => languages.add(lang));
      }
    });
    return Array.from(languages).sort();
  }, [countries]);

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setPreviousFilters({
        searchTerm,
        regionFilter,
        languageFilter
      });
    }
  };

  const updateUrlFilters = () => {
    const searchParams = new URLSearchParams();
    if (regionFilter) searchParams.set('region', regionFilter);
    if (languageFilter) searchParams.set('language', languageFilter);
    navigate(`/countries?${searchParams.toString()}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRegionFilter('');
    setLanguageFilter('');
    navigate('/countries');
  };

  const restorePreviousFilters = () => {
    setSearchTerm(previousFilters.searchTerm);
    setRegionFilter(previousFilters.regionFilter);
    setLanguageFilter(previousFilters.languageFilter);
    updateUrlFilters();
  };

  const filteredCountries = useMemo(() => {
    let filtered = countries;

    if (regionFilter) {
      filtered = filtered.filter(country => country.region === regionFilter);
    }

    if (languageFilter) {
      filtered = filtered.filter(country => 
        country.languages && 
        Object.values(country.languages).includes(languageFilter)
      );
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [countries, searchTerm, regionFilter, languageFilter]);

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <Skeleton height={180} />
              <div className="p-5">
                <Skeleton width="70%" height={24} />
                <Skeleton width="50%" height={18} className="mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error loading countries</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 font-medium transition-colors"
            >
              Go Home
            </button>
            <button
              onClick={() => dispatch(fetchCountries())}
              className="px-5 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore Countries</h1>
          <p className="text-blue-100 max-w-2xl">
            Discover information about every country in the world, filter by region or language, and find your next destination.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 -mt-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search countries by name..."
              className="w-full pl-12 pr-10 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyPress}
            />
            {(searchTerm || regionFilter || languageFilter) && (
              <button
                onClick={clearFilters}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <FiX className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Mobile Filters Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden w-full flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg mb-4 transition-colors"
          >
            <FiFilter /> Filters
          </button>

          {/* Desktop Filters */}
          <div className="hidden md:flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <select
                value={regionFilter}
                onChange={(e) => {
                  setRegionFilter(e.target.value);
                  updateUrlFilters();
                }}
                className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
              >
                <option value="">All Regions</option>
                <option value="Africa">Africa</option>
                <option value="Americas">Americas</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="Oceania">Oceania</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={languageFilter}
                onChange={(e) => {
                  setLanguageFilter(e.target.value);
                  updateUrlFilters();
                }}
                className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
              >
                <option value="">All Languages</option>
                {allLanguages.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Filters Modal */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                exit={{ y: 50 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Filters</h3>
                    <button onClick={() => setMobileFiltersOpen(false)}>
                      <FiX className="text-gray-500 hover:text-gray-700" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                      <select
                        value={regionFilter}
                        onChange={(e) => {
                          setRegionFilter(e.target.value);
                          updateUrlFilters();
                        }}
                        className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
                      >
                        <option value="">All Regions</option>
                        <option value="Africa">Africa</option>
                        <option value="Americas">Americas</option>
                        <option value="Asia">Asia</option>
                        <option value="Europe">Europe</option>
                        <option value="Oceania">Oceania</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={languageFilter}
                        onChange={(e) => {
                          setLanguageFilter(e.target.value);
                          updateUrlFilters();
                        }}
                        className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50"
                      >
                        <option value="">All Languages</option>
                        {allLanguages.map(language => (
                          <option key={language} value={language}>{language}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={clearFilters}
                        className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 font-medium transition-colors"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {filteredCountries.length} {filteredCountries.length === 1 ? 'Country' : 'Countries'} Found
          </h2>
          {(searchTerm || regionFilter || languageFilter) && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Countries Grid */}
        <AnimatePresence>
          {filteredCountries.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredCountries.map((country) => (
                <motion.div
                  key={country.cca3}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CountryCard country={country} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-12 text-center border border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiSearch className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No countries found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || regionFilter || languageFilter
                  ? "Try adjusting your search or filters"
                  : "There was an issue loading countries"}
              </p>
              {(searchTerm || regionFilter || languageFilter) && (
                <div className="flex justify-center gap-3">
                  <button
                    onClick={restorePreviousFilters}
                    className="flex items-center gap-2 px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 font-medium transition-colors"
                  >
                    <FiArrowLeft /> Go Back
                  </button>
                  <button
                    onClick={clearFilters}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}