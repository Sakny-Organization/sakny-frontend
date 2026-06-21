import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import { fetchMatchedProperties } from '../slices/tenantPropertyMatchSlice';
import {
  Loader, Building2, MapPin, BedDouble, Bath, Wifi, Zap,
  PawPrint, Calendar, Layers,
} from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  try {
    return new Intl.DateTimeFormat('en-EG', { month: 'short', year: 'numeric' }).format(new Date(dateStr));
  } catch {
    return null;
  }
};

const ExploreProperties = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { properties, status } = useSelector((state) => state.tenantPropertyMatch);

  useEffect(() => {
    dispatch(fetchMatchedProperties());
  }, [dispatch]);

  const handleCardClick = (propertyId) => {
    navigate(`/explore-properties/${propertyId}`);
  };

  return (
    <PageTransition>
      <div>
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
            Explore Properties
          </h1>
          <p className="text-gray-600 text-lg">
            Properties ranked by how well they match your preferences
          </p>
        </motion.div>

        {status === 'loading' && (
          <div className="flex items-center justify-center py-20">
            <Loader size={32} className="animate-spin text-gray-400" />
          </div>
        )}

        {status === 'succeeded' && properties.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No matched properties yet</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              As landlords add properties that match your preferences, they'll appear here with compatibility scores.
            </p>
          </motion.div>
        )}

        {status === 'succeeded' && properties.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {properties.map((property) => {
              const coverImage = property.images?.[0]
                || 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80';
              const availableDate = formatDate(property.availableFrom);

              return (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8 }}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-hover border border-gray-100 overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full"
                  onClick={() => handleCardClick(property.id)}
                >
                  <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                    <img
                      src={coverImage}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-3 right-3">
                      <div className={`${property.matchPercentage >= 90 ? 'bg-green-500' : property.matchPercentage >= 70 ? 'bg-blue-500' : 'bg-yellow-500'} text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm`}>
                        {property.matchPercentage}% Match
                      </div>
                    </div>
                    <div className="absolute top-3 left-3">
                      <div className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
                        {property.propertyType}
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-bold text-lg drop-shadow-md">
                          EGP {Number(property.price)?.toLocaleString()}
                          <span className="text-white/70 text-sm font-normal">/{property.paymentPeriod}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-black mb-1 line-clamp-1">{property.title}</h3>
                    {property.city && (
                      <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
                        <MapPin size={13} />
                        {property.address ? `${property.address}, ` : ''}{property.city}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 mb-4 text-gray-600 text-xs">
                      {property.rooms > 0 && (
                        <span className="flex items-center gap-1">
                          <BedDouble size={13} /> {property.rooms} {property.rooms === 1 ? 'bed' : 'beds'}
                        </span>
                      )}
                      {property.bathrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <Bath size={13} /> {property.bathrooms} {property.bathrooms === 1 ? 'bath' : 'baths'}
                        </span>
                      )}
                      {property.furnished && (
                        <span className="flex items-center gap-1">
                          <Layers size={13} /> Furnished
                        </span>
                      )}
                      {availableDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={13} /> From {availableDate}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {property.internetIncluded && (
                        <span className="bg-gray-50 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1">
                          <Wifi size={10} /> Internet
                        </span>
                      )}
                      {property.utilitiesIncluded && (
                        <span className="bg-gray-50 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1">
                          <Zap size={10} /> Utilities
                        </span>
                      )}
                      {property.petsAllowed && (
                        <span className="bg-gray-50 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1">
                          <PawPrint size={10} /> Pets OK
                        </span>
                      )}
                    </div>

                    {property.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed flex-1">
                        {property.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                      <div className="flex items-center gap-2">
                        <img
                          src={property.owner.avatar}
                          alt={property.owner.name}
                          className="w-7 h-7 rounded-full"
                        />
                        <span className="text-xs text-gray-600 font-medium">{property.owner.name}</span>
                      </div>
                      <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                        View details
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {status === 'failed' && (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load matched properties. Please try again.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default ExploreProperties;