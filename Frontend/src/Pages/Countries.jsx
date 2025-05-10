import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountries } from '../redux/country/countriesSlice';
import { FiSearch, FiX, FiArrowLeft } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CountryCard from '../Components/CountryCard';

export default function Countries() {
  const dispatch = useDispatch();
  const { countries, status, error } = useSelector((state) => state.countries);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [previousFilters, setPreviousFilters] = useState({
    searchTerm: '',
    regionFilter: '',
    languageFilter: '',
    searchTriggered: false
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const region = searchParams.get('region');
    const language = searchParams.get('language');

    if (region) setRegionFilter(region);
    if (language) setLanguageFilter(language);
    if (region || language) setSearchTriggered(true);
  }, [location.search]);

  const allLanguages = useMemo(() => {
    const languages = new Set();
    countries.forEach((country) => {
      if (country.languages) {
        Object.values(country.languages).forEach((lang) => languages.add(lang));
      }
    });
    return Array.from(languages).sort();
  }, [countries]);

  const handleSearch = () => {
    setPreviousFilters({
      searchTerm,
      regionFilter,
      languageFilter,
      searchTriggered
    });
    setSearchTriggered(true);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const updateURLParams = () => {
    const searchParams = new URLSearchParams();
    if (regionFilter) searchParams.set('region', regionFilter);
    if (languageFilter) searchParams.set('language', languageFilter);
    navigate(`/countries?${searchParams.toString()}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRegionFilter('');
    setLanguageFilter('');
    setSearchTriggered(false);
    navigate('/countries');
  };

  const restorePreviousFilters = () => {
    setSearchTerm(previousFilters.searchTerm);
    setRegionFilter(previousFilters.regionFilter);
    setLanguageFilter(previousFilters.languageFilter);
    setSearchTriggered(previousFilters.searchTriggered);
    updateURLParams();
  };

  const filteredCountries = useMemo(() => {
    let filtered = countries;
    if (regionFilter) {
      filtered = filtered.filter((c) => c.region === regionFilter);
    }
    if (languageFilter) {
      filtered = filtered.filter(
        (c) => c.languages && Object.values(c.languages).includes(languageFilter)
      );
    }
    if (searchTriggered && searchTerm.trim()) {
      filtered = filtered.filter((c) =>
        c.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [countries, searchTerm, regionFilter, languageFilter, searchTriggered]);

  if (status === 'loading') {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="rounded-xl bg-white shadow-md overflow-hidden">
              <Skeleton height={160} />
              <div className="p-4">
                <Skeleton count={4} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <div className="bg-red-200 text-red-800 px-4 py-3 rounded shadow">
          <strong>Error:</strong> {error}
        </div>
        <button
          onClick={() => dispatch(fetchCountries())}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="bg-white shadow-lg rounded-xl p-6 mb-10 flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
        <div className="relative w-full lg:w-2/5">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by country name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyPress}
            className="w-full py-3 pl-10 pr-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          {(searchTerm || regionFilter || languageFilter) && (
            <button
              onClick={clearFilters}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <FiX className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <select
          value={regionFilter}
          onChange={(e) => {
            setRegionFilter(e.target.value);
            const params = new URLSearchParams();
            if (e.target.value) params.set('region', e.target.value);
            if (languageFilter) params.set('language', languageFilter);
            navigate(`/countries?${params.toString()}`);
          }}
          className="w-full lg:w-1/4 py-3 pl-4 pr-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
        >
          <option value="">All Regions</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>

        <select
          value={languageFilter}
          onChange={(e) => {
            setLanguageFilter(e.target.value);
            const params = new URLSearchParams();
            if (regionFilter) params.set('region', regionFilter);
            if (e.target.value) params.set('language', e.target.value);
            navigate(`/countries?${params.toString()}`);
          }}
          className="w-full lg:w-1/4 py-3 pl-4 pr-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
        >
          <option value="">All Languages</option>
          {allLanguages.map((language) => (
            <option key={language} value={language}>{language}</option>
          ))}
        </select>
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <motion.div
                key={country.cca3}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CountryCard country={country} />
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-500 text-lg">No countries found matching your filters.</p>
              {(searchTerm || regionFilter || languageFilter) && (
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    onClick={restorePreviousFilters}
                    className="flex items-center gap-2 px-5 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg"
                  >
                    <FiArrowLeft /> Go Back
                  </button>
                  <button
                    onClick={clearFilters}
                    className="px-5 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}