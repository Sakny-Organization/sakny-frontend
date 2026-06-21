import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Users } from 'lucide-react';
import PropertyGrid from '../../components/property/PropertyGrid';
import Card from '../../components/ui/Card';
import PageTransition from '../../components/common/PageTransition';
import { fetchProperties, setPropertyFilters, resetPropertyFilters } from '../../slices/propertySlice';
import { PROPERTY_TYPES } from '../../services/propertyService';

const Properties = ({ embedded = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: properties, loading, filters, totalElements } = useSelector((state) => state.properties);

  React.useEffect(() => {
    dispatch(fetchProperties({ filters }));
  }, [dispatch, filters]);

  const updateFilter = (key, value) => {
    dispatch(setPropertyFilters({ [key]: value }));
  };

  const handleReset = () => {
    dispatch(resetPropertyFilters());
  };

  const mappedProperties = properties.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    type: p.propertyType?.toLowerCase() || 'apartment',
    city: p.city || p.governorate || '',
    district: p.address || '',
    address: p.address || '',
    rooms: p.roomsCount || 0,
    bathrooms: p.bathroomsCount || 0,
    floor: p.floorNumber,
    areaSqm: null,
    furnished: p.isFullyFurnished || false,
    status: 'available',
    paymentPeriod: p.paymentPeriod || 'monthly',
    images: (p.images || []).map((img) => img.imageUrl || img),
    amenities: (p.amenities || []).map((a) => a.nameEn || a),
    views: 0,
    messages: 0,
    availableFrom: p.availableFrom,
    owner: {
      id: p.ownerId,
      name: p.ownerName || 'Owner',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.ownerName || 'Owner')}&background=111827&color=ffffff`,
      responseTime: 'Fast response',
      matchPercentage: 96,
    },
    ownerId: p.ownerId,
    deposit: p.deposit,
    minimumStayMonths: p.minimumStayMonths,
    maxOccupancy: p.maxOccupancy,
    utilitiesIncluded: p.utilitiesIncluded,
    internetIncluded: p.internetIncluded,
    petsAllowed: p.petsAllowed,
    smokingAllowed: p.smokingAllowed,
    preferredTenant: p.preferredTenant,
    location: p.latitude && p.longitude ? { lat: Number(p.latitude), lng: Number(p.longitude) } : null,
  }));

  const content = (
    <div className={`property-explorer ${embedded ? 'property-explorer--embedded' : ''}`}>
      {!embedded ? (
        <div className="property-explorer__hero">
          <div>
            <span className="property-explorer__eyebrow">Browse listings</span>
            <h1>Rooms, studios, and apartments across Egypt</h1>
            <p>Filter by city, price, room count, and amenities to find the right place.</p>
          </div>
          <motion.div
            className="property-explorer__switch-card"
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => navigate('/search')}
          >
            <div className="property-explorer__switch-icon">
              <Users size={20} />
            </div>
            <div className="property-explorer__switch-text">
              <strong>Switch to roommate search</strong>
              <span>Find people to share a place with</span>
            </div>
          </motion.div>
        </div>
      ) : null}

      <div className="property-explorer__layout">
        <Card className="property-filters">
          <div className="property-filters__head">
            <strong><SlidersHorizontal size={16} /> Filters</strong>
            <button type="button" onClick={handleReset}>Reset</button>
          </div>

          <label className="property-field">
            <span>Property type</span>
            <select value={filters.propertyType || ''} onChange={(e) => updateFilter('propertyType', e.target.value)}>
              <option value="">All types</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type.toUpperCase()}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </label>

          <div className="property-field__row">
            <label className="property-field">
              <span>Min price</span>
              <input type="number" value={filters.minPrice || ''} onChange={(e) => updateFilter('minPrice', e.target.value)} placeholder="0" />
            </label>
            <label className="property-field">
              <span>Max price</span>
              <input type="number" value={filters.maxPrice || ''} onChange={(e) => updateFilter('maxPrice', e.target.value)} placeholder="20000" />
            </label>
          </div>

          <label className="property-toggle property-toggle--filter">
            <span>Furnished only</span>
            <button type="button" className={`property-toggle__button ${filters.furnished === 'true' ? 'is-active' : ''}`} onClick={() => updateFilter('furnished', filters.furnished === 'true' ? '' : 'true')}>
              <span />
            </button>
          </label>
        </Card>

        <div className="property-explorer__results">
          <div className="property-explorer__toolbar">
            <div>
              <strong>{loading ? 'Loading...' : `${totalElements || mappedProperties.length} ${totalElements === 1 ? 'property' : 'properties'} found`}</strong>
            </div>
          </div>

          <PropertyGrid
            properties={mappedProperties}
            loading={loading}
            onViewDetails={(property) => navigate(`/properties/${property.id}`)}
            onContactOwner={(property) => navigate('/messages', { state: { startConversation: { participant: property.owner, propertyId: property.id, propertyTitle: property.title } } })}
            emptyState={(
              <div className="landlord-empty-state landlord-empty-state--compact">
                <div className="landlord-empty-state__art" />
                <div>
                  <h3>No properties found</h3>
                  <p>Try expanding the budget range or changing the filter criteria.</p>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return <PageTransition>{content}</PageTransition>;
};

export default Properties;
