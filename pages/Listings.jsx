import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, Filter, X, ChevronRight } from 'lucide-react';
import {
  fetchProperties,
  fetchAmenities,
  setPropertyFilters,
  resetPropertyFilters,
} from '../slices/propertySlice';
import Button from '../components/common/Button';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { containerVariants, itemVariants } from '../utils/animations';
import { governorates } from '../data/egyptLocations';

const PROPERTY_TYPES = ['APARTMENT', 'VILLA', 'STUDIO', 'ROOM', 'DUPLEX'];

const PropertyCard = ({ property }) => {
  const primaryImage = property.images?.find((img) => img.isPrimary) || property.images?.[0];
  return (
    <Link to={`/listings/${property.id}`}>
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div className="aspect-video bg-gray-100 overflow-hidden relative">
          {primaryImage ? (
            <img
              src={primaryImage.imageUrl || primaryImage.url}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
              No photo
            </div>
          )}
          {property.isFullyFurnished && (
            <span className="absolute top-2 left-2 bg-black text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              Furnished
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-black truncate mb-1">{property.title}</h3>
          <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
            <MapPin size={13} />
            {[property.city, property.governorate].filter(Boolean).join(', ')}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            {property.roomsCount != null && (
              <span className="flex items-center gap-1">
                <BedDouble size={14} /> {property.roomsCount} room{property.roomsCount !== 1 ? 's' : ''}
              </span>
            )}
            {property.bathroomsCount != null && (
              <span className="flex items-center gap-1">
                <Bath size={14} /> {property.bathroomsCount} bath{property.bathroomsCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-black">
              {Number(property.price).toLocaleString()} EGP
              <span className="text-xs font-normal text-gray-500">/mo</span>
            </span>
            <span className="text-xs text-gray-400 capitalize">
              {property.propertyType?.toLowerCase() || 'property'}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const Listings = () => {
  const dispatch = useDispatch();
  const { list, filters, loading, error, currentPage, totalPages, totalElements } = useSelector(
    (state) => state.properties
  );

  useEffect(() => {
    dispatch(fetchAmenities());
    dispatch(fetchProperties({ filters, page: 0 }));
  }, [filters]);

  const handleLoadMore = () => {
    if (currentPage < totalPages - 1) {
      dispatch(fetchProperties({ filters, page: currentPage + 1 }));
    }
  };

  const activeFilters = [];
  if (filters.propertyType) activeFilters.push({ label: filters.propertyType, key: 'propertyType' });
  if (filters.maxPrice) activeFilters.push({ label: `Max ${Number(filters.maxPrice).toLocaleString()} EGP`, key: 'maxPrice' });
  if (filters.furnished !== '') activeFilters.push({ label: filters.furnished === 'true' ? 'Furnished' : 'Unfurnished', key: 'furnished' });

  const removeFilter = (key) => dispatch(setPropertyFilters({ [key]: '' }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="app-container"
    >
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-6">Browse Listings</h1>
        <div className="flex flex-wrap items-center gap-3">
          {activeFilters.map((f) => (
            <div key={f.key} className="filter-pill">
              <span>{f.label}</span>
              <button
                onClick={() => removeFilter(f.key)}
                className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {activeFilters.length === 0 && (
            <p className="text-gray-500 text-sm">No filters applied</p>
          )}
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Filters Sidebar */}
        <motion.div className="lg:col-span-1" variants={itemVariants}>
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-black flex items-center gap-2">
                <Filter size={18} /> Filters
              </h3>
              <button
                onClick={() => dispatch(resetPropertyFilters())}
                className="text-xs text-gray-600 font-medium hover:text-black transition-colors"
              >
                Reset all
              </button>
            </div>

            <div className="space-y-6">
              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Property Type</label>
                <select
                  className="block w-full rounded-lg border-gray-300 shadow-sm sm:text-sm py-2.5 border px-3"
                  value={filters.propertyType}
                  onChange={(e) => dispatch(setPropertyFilters({ propertyType: e.target.value }))}
                >
                  <option value="">Any</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0) + t.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Price */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-black">Max Price (EGP/mo)</label>
                  <span className="text-sm text-gray-600">
                    {filters.maxPrice ? Number(filters.maxPrice).toLocaleString() : 'Any'}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={filters.maxPrice || 50000}
                  onChange={(e) =>
                    dispatch(setPropertyFilters({ maxPrice: e.target.value === '50000' ? '' : e.target.value }))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>500</span>
                  <span>50,000</span>
                </div>
              </div>

              {/* Furnished */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Furnishing</label>
                <select
                  className="block w-full rounded-lg border-gray-300 shadow-sm sm:text-sm py-2.5 border px-3"
                  value={filters.furnished}
                  onChange={(e) => dispatch(setPropertyFilters({ furnished: e.target.value }))}
                >
                  <option value="">Any</option>
                  <option value="true">Furnished</option>
                  <option value="false">Unfurnished</option>
                </select>
              </div>

              {/* Governorate */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Governorate</label>
                <select
                  className="block w-full rounded-lg border-gray-300 shadow-sm sm:text-sm py-2.5 border px-3"
                  value={filters.governorateId}
                  onChange={(e) =>
                    dispatch(setPropertyFilters({ governorateId: e.target.value, cityId: '' }))
                  }
                >
                  <option value="">Any</option>
                  {governorates.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div className="lg:col-span-3" variants={itemVariants}>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              {loading ? 'Loading…' : (
                <>Showing <strong>{list.length}</strong> of <strong>{totalElements}</strong> listings</>
              )}
            </p>
            <Link to="/my-listings">
              <Button variant="primary" size="sm">+ List your property</Button>
            </Link>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-6">
              {error}
            </div>
          )}

          {loading && list.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonLoader key={i} />)}
            </div>
          ) : list.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {list.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              {currentPage < totalPages - 1 && (
                <div className="mt-8 text-center">
                  <Button variant="outline" onClick={handleLoadMore} disabled={loading}>
                    {loading ? 'Loading…' : 'Load more'}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
              <X size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">No listings match your filters</h3>
              <p className="text-gray-600 mb-6">Try adjusting or clearing your filters.</p>
              <Button variant="outline" onClick={() => dispatch(resetPropertyFilters())}>
                Clear all filters
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Listings;
