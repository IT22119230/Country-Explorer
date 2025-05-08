import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiMapPin, 
  FiUsers, 
  FiGlobe, 
  FiClock, 
  FiDollarSign,
  FiNavigation,
  FiFlag,
  FiCalendar,
  FiPhone
} from 'react-icons/fi';

export default function CountryDetailsModal({ country, isOpen, onClose }) {
  if (!country || !isOpen) return null;

  const formatCurrencies = () => {
    if (!country.currencies) return 'Not available';
    return Object.entries(country.currencies).map(([code, currency]) => (
      `${currency.name} (${currency.symbol || code})`
    )).join(', ');
  };

  const formatTimezones = () => {
    if (!country.timezones) return 'Not available';
    return country.timezones.join(', ');
  };

  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg text-blue-600">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-gray-800 font-medium">{value || 'Not available'}</p>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100">
            <img 
              src={country.flags.svg || country.flags.png} 
              alt={`Flag of ${country.name.common}`} 
              className="absolute inset-0 w-full h-full object-contain p-8"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
              aria-label="Close modal"
            >
              <FiX className="text-gray-800 text-xl" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {country.name.common}
                </h2>
                <p className="text-gray-600">
                  {country.name.official}
                </p>
              </div>
              <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {country.region}{country.subregion && ` • ${country.subregion}`}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold mb-6 text-gray-800">
                  <FiMapPin className="text-blue-600" />
                  Geography
                </h3>
                <div className="space-y-1">
                  <InfoItem 
                    icon={<FiFlag size={18} />}
                    label="Capital" 
                    value={country.capital?.join(', ')} 
                  />
                  <InfoItem 
                    icon={<FiNavigation size={18} />}
                    label="Area" 
                    value={`${country.area.toLocaleString()} km²`} 
                  />
                  <InfoItem 
                    icon={<FiGlobe size={18} />}
                    label="Borders" 
                    value={country.borders?.join(', ')} 
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold mb-6 text-gray-800">
                  <FiUsers className="text-green-600" />
                  Demographics
                </h3>
                <div className="space-y-1">
                  <InfoItem 
                    icon={<FiUsers size={18} />}
                    label="Population" 
                    value={country.population.toLocaleString()} 
                  />
                  <InfoItem 
                    icon={<FiCalendar size={18} />}
                    label="Languages" 
                    value={Object.values(country.languages || {}).join(', ')} 
                  />
                  <InfoItem 
                    icon={<FiPhone size={18} />}
                    label="Calling Code" 
                    value={country.idd?.root && country.idd.suffixes?.length 
                      ? `${country.idd.root}${country.idd.suffixes[0]}` 
                      : null} 
                  />
                </div>
              </div>

              {/* Bottom Left */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold mb-6 text-gray-800">
                  <FiDollarSign className="text-yellow-600" />
                  Economy
                </h3>
                <div className="space-y-1">
                  <InfoItem 
                    icon={<FiDollarSign size={18} />}
                    label="Currencies" 
                    value={formatCurrencies()} 
                  />
                  <InfoItem 
                    icon={<FiGlobe size={18} />}
                    label="Country Code" 
                    value={country.cca3} 
                  />
                  <InfoItem 
                    icon={<FiGlobe size={18} />}
                    label="TLD" 
                    value={country.tld?.join(', ')} 
                  />
                </div>
              </div>

              {/* Bottom Right */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold mb-6 text-gray-800">
                  <FiClock className="text-purple-600" />
                  Time & More
                </h3>
                <div className="space-y-1">
                  <InfoItem 
                    icon={<FiClock size={18} />}
                    label="Timezones" 
                    value={formatTimezones()} 
                  />
                  <InfoItem 
                    icon={<FiNavigation size={18} />}
                    label="Driving Side" 
                    value={country.car?.side ? country.car.side.charAt(0).toUpperCase() + country.car.side.slice(1) : null} 
                  />
                  <InfoItem 
                    icon={<FiGlobe size={18} />}
                    label="UN Member" 
                    value={country.unMember ? 'Yes' : 'No'} 
                  />
                </div>
              </div>
            </div>

            {/* Google Maps Link */}
            {country.maps?.googleMaps && (
              <div className="mt-8 text-center">
                <a
                  href={country.maps.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <FiMapPin /> View on Google Maps
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}