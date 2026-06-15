import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { Building2, Eye, Key, MessageCircle, Plus, Search, TrendingUp, Users } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import PropertyGrid from '../../components/property/PropertyGrid';
import propertyService, { PROPERTY_STATUSES, resolveOwnerProfile } from '../../services/propertyService';

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
  const { user } = useSelector((state) => state.auth);
  const owner = React.useMemo(() => resolveOwnerProfile(user), [user]);
  const [stats, setStats] = React.useState({
    totalListings: 0,
    availableListings: 0,
    rentedListings: 0,
    totalViews: 0,
    newMessages: 0,
  });
  const [properties, setProperties] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filters, setFilters] = React.useState({ query: '', status: 'all' });

  const loadDashboard = React.useCallback(async () => {
    setLoading(true);
    const [nextStats, nextProperties] = await Promise.all([
      propertyService.getDashboardStats(owner.id),
      propertyService.getByOwner(owner.id),
    ]);
    setStats(nextStats);
    setProperties(nextProperties);
    setLoading(false);
  }, [owner.id]);

  React.useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const filteredProperties = properties.filter((property) => {
    const matchesQuery = !filters.query || `${property.title} ${property.city} ${property.address}`.toLowerCase().includes(filters.query.toLowerCase());
    const matchesStatus = filters.status === 'all' || property.status === filters.status;
    return matchesQuery && matchesStatus;
  });

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
            <h2>Welcome back, {owner.name.split(' ')[0]}.</h2>
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

      <section className="landlord-dashboard__section">
        <div className="landlord-dashboard__section-head">
          <div>
            <h2>Your Listings</h2>
            <p>Edit details, update availability, and track each listing.</p>
          </div>
          {/* Open portfolio button removed as per user request */}
        </div>

        <AnimatePresence mode="wait">
          {!loading && properties.length === 0 ? (
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
                loading={loading}
                mode="owner"
                onEdit={(property) => navigate(`/landlord/properties/${property.id}/edit`)}
                onDelete={async (property) => {
                  await propertyService.remove(property.id);
                  loadDashboard();
                }}
                onViewDetails={(property) => navigate(`/properties/${property.id}`)}
                onToggleStatus={async (property) => {
                  const nextStatus = property.status === PROPERTY_STATUSES.RENTED ? PROPERTY_STATUSES.AVAILABLE : PROPERTY_STATUSES.RENTED;
                  await propertyService.updateStatus(property.id, nextStatus);
                  loadDashboard();
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