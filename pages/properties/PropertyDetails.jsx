import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Bath, BedDouble, Building2, Banknote, Calendar, Check,
  Clock, Layers, MapPin, Maximize2, MessageSquareMore, PawPrint,
  Phone, Shield, Star, Users, Wifi, Zap,
} from 'lucide-react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { fetchProperty, fetchMyProperties, clearActiveProperty } from '../../slices/propertySlice';
import { isLandlordUser } from '../../utils/userRole';

const labelize = (v) => String(v || '').charAt(0).toUpperCase() + String(v || '').slice(1);

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  try {
    return new Intl.DateTimeFormat('en-EG', { month: 'short', year: 'numeric' }).format(new Date(dateStr));
  } catch {
    return null;
  }
};

const statusVariantMap = { available: 'success', rented: 'danger', pending: 'warning' };

const featureFlags = [
  { key: 'isFullyFurnished', label: 'Furnished', icon: <Layers size={14} /> },
  { key: 'utilitiesIncluded', label: 'Utilities included', icon: <Zap size={14} /> },
  { key: 'internetIncluded', label: 'Internet included', icon: <Wifi size={14} /> },
  { key: 'petsAllowed', label: 'Pets allowed', icon: <PawPrint size={14} /> },
  { key: 'smokingAllowed', label: 'Smoking allowed', icon: <Star size={14} /> },
];

const fade = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 } };

const PropertyDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { activeProperty: property, detailLoading, error, myListings } = useSelector((state) => state.properties);
  const { user } = useSelector((state) => state.auth);
  const [activeImage, setActiveImage] = React.useState(0);

  React.useEffect(() => {
    dispatch(fetchProperty(id));
    if (isLandlordUser(user)) {
      dispatch(fetchMyProperties());
    }
    return () => {
      dispatch(clearActiveProperty());
    };
  }, [id, dispatch, user]);

  if (detailLoading) {
    return (
      <PageTransition>
        <div className="property-details-page" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black" />
        </div>
      </PageTransition>
    );
  }

  if (error || !property) {
    return (
      <PageTransition>
        <div className="property-details-page" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h2>{error || 'Property not found'}</h2>
            <Button variant="primary" onClick={() => navigate('/properties')} style={{ marginTop: '1rem' }}>
              Back to listings
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const images = (property.images || []).map((img) => img.imageUrl || img);
  const isOwner = myListings.some((p) => p.id === property.id);
  const activeGalleryImage = images[activeImage]
    || images[0]
    || 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80';

  const activeFeatures = featureFlags.filter((f) => property[f.key]);
  const availableDate = formatDate(property.availableFrom);
  const amenities = (property.amenities || []).map((a) => a.nameEn || a);
  const location = property.latitude && property.longitude
    ? { lat: Number(property.latitude), lng: Number(property.longitude) }
    : null;

  const ownerName = property.ownerName || 'Owner';
  const ownerAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(ownerName)}&background=111827&color=ffffff`;

  const openChat = () => navigate('/messages', {
    state: {
      startConversation: {
        participant: {
          id: property.ownerId,
          name: ownerName,
          avatar: ownerAvatar,
        },
        propertyId: property.id,
        propertyTitle: property.title,
      },
    },
  });

  return (
    <PageTransition>
      <div className="property-details-page">

        <div className="property-details-page__top">

          <motion.div className="property-gallery" {...fade} transition={{ duration: 0.35 }}>
            <div className="property-gallery__primary">
              <motion.img
                key={activeImage}
                src={activeGalleryImage}
                alt={property.title}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.28 }}
              />
            </div>
            {images.length > 1 && (
              <div className="property-gallery__thumbs">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={activeImage === index ? 'is-active' : ''}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={image} alt={`${property.title} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            className="property-details-page__summary"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.38, delay: 0.08 }}
          >
            <div className="property-details-page__badges">
              <span className="property-details-page__price-tag">
                EGP {Number(property.price)?.toLocaleString()}
                <small> / {property.paymentPeriod || 'month'}</small>
              </span>
              <Badge variant="success">Available</Badge>
              {property.propertyType && <Badge variant="neutral">{labelize(property.propertyType)}</Badge>}
            </div>

            <h1>{property.title}</h1>

            {(property.city || property.governorate) && (
              <p className="property-details-page__location">
                <MapPin size={15} />
                <span>
                  {property.city || property.governorate}
                  {property.address ? ` — ${property.address}` : ''}
                </span>
              </p>
            )}

            <div className="property-details-page__facts">
              {property.roomsCount ? (
                <span><BedDouble size={14} /> {property.roomsCount} {property.roomsCount === 1 ? 'bedroom' : 'bedrooms'}</span>
              ) : null}
              {property.bathroomsCount ? (
                <span><Bath size={14} /> {property.bathroomsCount} {property.bathroomsCount === 1 ? 'bathroom' : 'bathrooms'}</span>
              ) : null}
              {property.floorNumber ? (
                <span><Building2 size={14} /> Floor {property.floorNumber}</span>
              ) : null}
              {availableDate ? <span><Calendar size={14} /> From {availableDate}</span> : null}
            </div>

            {(property.deposit || property.minimumStayMonths || property.maxOccupancy || (property.preferredTenant && property.preferredTenant !== 'any')) && (
              <div className="property-details-page__lease">
                {property.deposit ? (
                  <div className="property-details-page__lease-item">
                    <Banknote size={14} />
                    <span>Deposit: <strong>EGP {Number(property.deposit).toLocaleString()}</strong></span>
                  </div>
                ) : null}
                {property.minimumStayMonths ? (
                  <div className="property-details-page__lease-item">
                    <Clock size={14} />
                    <span>Min. stay: <strong>{property.minimumStayMonths} months</strong></span>
                  </div>
                ) : null}
                {property.maxOccupancy ? (
                  <div className="property-details-page__lease-item">
                    <Users size={14} />
                    <span>Max occupancy: <strong>{property.maxOccupancy}</strong></span>
                  </div>
                ) : null}
                {property.preferredTenant && property.preferredTenant !== 'any' ? (
                  <div className="property-details-page__lease-item">
                    <Shield size={14} />
                    <span>Preferred: <strong>{labelize(property.preferredTenant)}</strong></span>
                  </div>
                ) : null}
              </div>
            )}

            {activeFeatures.length > 0 && (
              <div className="property-details-page__features">
                {activeFeatures.map((f) => (
                  <span key={f.key} className="property-details-page__feature">
                    {f.icon} {f.label}
                  </span>
                ))}
              </div>
            )}

            {property.description && (
              <p className="property-details-page__desc">{property.description}</p>
            )}

            {amenities.length > 0 && (
              <div className="property-details-page__amenities">
                {amenities.map((amenity) => (
                  <span key={amenity}><Check size={13} /> {amenity}</span>
                ))}
              </div>
            )}

            <div className="property-details-page__cta">
              {!isOwner && (
                <Button
                  variant="primary"
                  size="lg"
                  leading={<MessageSquareMore size={18} />}
                  onClick={openChat}
                >
                  Contact Owner
                </Button>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="property-details-page__grid"
          {...fade}
          transition={{ duration: 0.35, delay: 0.18 }}
        >
          <Card className="property-map-preview">
            <div className="property-map-card__header">
              <strong>Location</strong>
              <span>Explore the neighbourhood before reaching out.</span>
            </div>
            {location ? (
              <div className="property-map-card__map" style={{ height: '280px', borderRadius: '12px', overflow: 'hidden' }}>
                <MapContainer
                  center={[location.lat, location.lng]}
                  zoom={14}
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  />
                  <Marker position={[location.lat, location.lng]} />
                </MapContainer>
              </div>
            ) : (
              <div className="landlord-empty-state landlord-empty-state--compact">
                <div className="landlord-empty-state__art" />
                <div>
                  <h3>Location not set</h3>
                  <p>The owner hasn&apos;t pinned a location yet.</p>
                </div>
              </div>
            )}
          </Card>

          <Card className="property-owner-card">
            <div className="property-owner-card__head">
              <img src={ownerAvatar} alt={ownerName} />
              <div>
                <strong>{ownerName}</strong>
                <span>Property owner</span>
              </div>
            </div>
            <div className="property-owner-card__stats">
              <div>
                <strong>{labelize(property.propertyType || 'Property')}</strong>
                <span>Type</span>
              </div>
              <div>
                <strong>{property.roomsCount || '-'}</strong>
                <span>Rooms</span>
              </div>
              <div>
                <strong>{property.isFullyFurnished ? 'Yes' : 'No'}</strong>
                <span>Furnished</span>
              </div>
            </div>
          </Card>
        </motion.div>

      </div>
    </PageTransition>
  );
};

export default PropertyDetails;
