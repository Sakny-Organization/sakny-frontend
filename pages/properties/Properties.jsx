import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, SlidersHorizontal, Users } from 'lucide-react';
import PropertyGrid from '../../components/property/PropertyGrid';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import PageTransition from '../../components/common/PageTransition';
import propertyService from '../../services/propertyService';

const defaultFilters = {
  city: '',
  priceMin: 0,
  priceMax: 20000,
  rooms: 0,
  type: 'all',
  furnished: false,
  amenities: [],
};

const Properties = ({ embedded = false }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = React.useState(defaultFilters);
  const [properties, setProperties] = React.useState([]);
  const [options, setOptions] = React.useState(propertyService.getFilterOptions());
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    propertyService.getAll(filters).then((items) => {
      setProperties(items);
      setOptions(propertyService.getFilterOptions());
      setLoading(false);
    });
  }, [filters]);

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
            <button type="button" onClick={() => setFilters(defaultFilters)}>Reset</button>
          </div>

          <label className="property-field">
            <span>City</span>
            <input value={filters.city} onChange={(event) => setFilters((current) => ({ ...current, city: event.target.value }))} placeholder="Cairo, Giza, Alexandria" />
          </label>

          <div className="property-field__row">
            <label className="property-field">
              <span>Min price</span>
              <input type="number" value={filters.priceMin} onChange={(event) => setFilters((current) => ({ ...current, priceMin: Number(event.target.value) || 0 }))} />
            </label>
            <label className="property-field">
              <span>Max price</span>
              <input type="number" value={filters.priceMax} onChange={(event) => setFilters((current) => ({ ...current, priceMax: Number(event.target.value) || 0 }))} />
            </label>
          </div>

          <div className="property-field__row">
            <label className="property-field">
              <span>Rooms</span>
              <input type="number" min="0" value={filters.rooms} onChange={(event) => setFilters((current) => ({ ...current, rooms: Number(event.target.value) || 0 }))} />
            </label>
            <label className="property-field">
              <span>Type</span>
              <select value={filters.type} onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value }))}>
                <option value="all">All types</option>
                {options.types.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>
          </div>

          <label className="property-toggle property-toggle--filter">
            <span>Furnished only</span>
            <button type="button" className={`property-toggle__button ${filters.furnished ? 'is-active' : ''}`} onClick={() => setFilters((current) => ({ ...current, furnished: !current.furnished }))}>
              <span />
            </button>
          </label>

          <div className="property-filters__chips">
            {options.amenities.map((amenity) => (
              <button
                key={amenity}
                type="button"
                className={`property-amenities__chip ${filters.amenities.includes(amenity) ? 'is-active' : ''}`}
                onClick={() => setFilters((current) => ({
                  ...current,
                  amenities: current.amenities.includes(amenity)
                    ? current.amenities.filter((item) => item !== amenity)
                    : [...current.amenities, amenity],
                }))}
              >
                {amenity}
              </button>
            ))}
          </div>
        </Card>

        <div className="property-explorer__results">
          <div className="property-explorer__toolbar">
            <div>
              <strong>{loading ? 'Loading...' : `${properties.length} ${properties.length === 1 ? 'property' : 'properties'} found`}</strong>
            </div>
          </div>

          <PropertyGrid
            properties={properties}
            loading={loading}
            onViewDetails={(property) => navigate(`/properties/${property.id}`)}
            onContactOwner={(property) => navigate('/messages', { state: { startConversation: { participant: property.owner, propertyId: property.id, propertyTitle: property.title } } })}
            emptyState={(
              <div className="landlord-empty-state landlord-empty-state--compact">
                <div className="landlord-empty-state__art" />
                <div>
                  <h3>No properties matched this filter set</h3>
                  <p>Try expanding the budget range, changing city, or reducing the amenity requirements.</p>
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