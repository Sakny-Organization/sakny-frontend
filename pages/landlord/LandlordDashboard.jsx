import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { Building2, Eye, Key, MessageCircle, Plus, Search, Users } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import PropertyGrid from '../../components/property/PropertyGrid';
import { fetchMyProperties, deleteProperty, toggleStatus } from '../../slices/propertySlice';
import { fetchLandlordRecommendations } from '../../slices/landlordMatchSlice';
import { PROPERTY_STATUSES } from '../../services/propertyService';

const AnimatedCounter = ({ value }) => {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => rounded.on('change', (latest) => setDisplayValue(latest)), [rounded]);
  React.useEffect(() => {
    const controls = animate(motionValue, value || 0, { duration: 0.8 });
    return () => controls.stop();
  }, [motionValue, value]);

  return <span>{displayValue.toLocaleString()}</span>;
};

const statCards = [
  { key: 'totalListings', label: 'Total Listings', icon: <Building2 size={18} />, accent: 'mono' },
  { key: 'availableListings', label: 'Available Listings', icon: <Key size={18} />, accent: 'mono' },
  { key: 'rentedListings', label: 'Rented Listings', icon: <Users size={18} />, accent: 'mono' },
  { key: 'totalViews', label: 'Total Views', icon: <Eye size={18} />, accent: 'mono' },
  { key: 'newMessages', label: 'New Messages', icon: <MessageCircle size={18} />, accent: 'mono' },
];

const LandlordDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myListings, myListingsLoading } = useSelector((state) => state.properties);
  const { recommendations, recommendationsStatus } = useSelector((state) => state.landlordMatch);
  const [filters, setFilters] = React.useState({ query: '', status: 'all' });

  React.useEffect(() => {
    dispatch(fetchMyProperties());
    dispatch(fetchLandlordRecommendations(4));
  }, [dispatch]);

  const stats = React.useMemo(() => ({
    totalListings: myListings.length,
    availableListings: myListings.filter((p) => !p.status || p.status.toUpperCase() === 'AVAILABLE').length,
    rentedListings: myListings.filter((p) => p.status?.toUpperCase() === 'RENTED').length,
    totalViews: 0,
    newMessages: 0,
  }), [myListings]);

  const filteredProperties = myListings.filter((property) => {
    const matchesQuery = !filters.query ||
      `${property.title} ${property.city} ${property.address}`.toLowerCase().includes(filters.query.toLowerCase());
    const matchesStatus = filters.status === 'all' || property.status?.toLowerCase() === filters.status;
    return matchesQuery && matchesStatus;
  });

  const ownerName = user?.name || 'there';

  return (
    <DashboardLayout
      title="Properties"
      subtitle="Your listings at a glance"
      actions={<Button variant="primary" leading={<Plus size={16} />} onClick={() => navigate('/landlord/properties/new')}>Add Property</Button>}
    >
      <motion.div className="landlord-dashboard__hero" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Card className="landlord-dashboard__welcome">
          <div>
            <span className="landlord-dashboard__eyebrow">Overview</span>
            <h2>Welcome back, {ownerName.split(' ')[0]}.</h2>
            <p>Your listings, availability, and messages — all in one place.</p>
          </div>
        </Card>
      </motion.div>

      <section className="landlord-stats-grid">
        {statCards.map((card, index) => (
          <motion.div key={card.key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.24 }}>
            <Card className={`landlord-stat-card landlord-stat-card--${card.accent}`} hoverable>
              <div className="landlord-stat-card__icon">{card.icon}</div>
              <div>
                <span>{card.label}</span>
                <strong><AnimatedCounter value={stats[card.key]} /></strong>
              </div>
            </Card>
          </motion.div>
        ))}
      </section>

      {recommendations.length > 0 && (
        <section className="landlord-dashboard__section">
          <div className="landlord-dashboard__section-head">
            <div>
              <h2>Top Tenant Matches</h2>
              <p>Highest-compatibility tenants across your properties</p>
            </div>
            <Button variant="secondary" onClick={() => navigate('/landlord/tenants')}>View all</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map((match) => (
              <motion.div
                key={`${match.propertyId}-${match.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/landlord/properties/${match.propertyId}/tenants/${match.id}`)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img src={match.image} alt={match.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-black truncate">{match.name}</p>
                    <p className="text-xs text-gray-500 truncate">{match.location}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${match.matchPercentage >= 75 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {match.matchPercentage}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">{match.propertyTitle}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section className="landlord-dashboard__section">
        <div className="landlord-dashboard__section-head">
          <div>
            <h2>Your Listings</h2>
            <p>Edit details, update availability, and track each listing.</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!myListingsLoading && myListings.length === 0 ? (
            <motion.div key="empty" className="landlord-empty-state" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>
              <div className="landlord-empty-state__art" />
              <div>
                <h3>You have not added any property yet</h3>
                <p>Create your first listing to unlock the full landlord dashboard, inquiries, and performance tracking.</p>
              </div>
              <Button variant="primary" leading={<Plus size={16} />} onClick={() => navigate('/landlord/properties/new')}>
                Add your first property
              </Button>
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card className="property-management__toolbar" style={{ marginBottom: '1.5rem' }}>
                <label className="property-field property-management__search">
                  <span>Search listings</span>
                  <div className="property-management__search-input">
                    <Search size={16} />
                    <input
                      value={filters.query}
                      onChange={(e) => setFilters(f => ({ ...f, query: e.target.value }))}
                      placeholder="Search by title, city, or address"
                    />
                  </div>
                </label>

                <label className="property-field">
                  <span>Status</span>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                  >
                    <option value="all">All statuses</option>
                    {Object.values(PROPERTY_STATUSES).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </label>

                <div className="property-management__actions">
                  <Button variant="secondary" onClick={() => setFilters({ query: '', status: 'all' })}>Reset</Button>
                  <Button variant="primary" onClick={() => navigate('/landlord/properties/new')}>Add Property</Button>
                </div>
              </Card>

              <PropertyGrid
                properties={filteredProperties}
                loading={myListingsLoading}
                mode="owner"
                onEdit={(property) => navigate(`/landlord/properties/${property.id}/edit`)}
                onDelete={async (property) => {
                  await dispatch(deleteProperty(property.id));
                }}
                onViewDetails={(property) => navigate(`/properties/${property.id}`)}
                onToggleStatus={async (property) => {
                  await dispatch(toggleStatus(property.id));
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </DashboardLayout>
  );
};

export default LandlordDashboard;
