import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import propertyService from '../../services/propertyService';

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
  { key: 'furnished', label: 'Furnished', icon: <Layers size={14} /> },
  { key: 'utilitiesIncluded', label: 'Utilities included', icon: <Zap size={14} /> },
  { key: 'internetIncluded', label: 'Internet included', icon: <Wifi size={14} /> },
  { key: 'petsAllowed', label: 'Pets allowed', icon: <PawPrint size={14} /> },
  { key: 'smokingAllowed', label: 'Smoking allowed', icon: <Star size={14} /> },
];

const fade = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 } };

const PropertyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = React.useState(null);
  const [activeImage, setActiveImage] = React.useState(0);

  React.useEffect(() => {
    propertyService.getById(id).then((item) => {
      setProperty(item);
      if (item) {
        propertyService.incrementViews(id).then((updated) => {
          if (updated) setProperty(updated);
        });
      }
    });
  }, [id]);

  const { user } = useSelector((state) => state.auth);

  if (!property) return null;

  const isOwner = user?.id === property.ownerId || user?.email === property.ownerId;

  const activeGalleryImage = property.images?.[activeImage]
    || property.images?.[0]
    || 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80';

  const activeFeatures = featureFlags.filter((f) => property[f.key]);
  const availableDate = formatDate(property.availableFrom);

  const openChat = () => navigate('/messages', {
    state: {
      startConversation: {
        participant: property.owner,
        propertyId: property.id,
        propertyTitle: property.title,
      },
    },
  });

  return (
    <PageTransition>
      <div className="property-details-page">

        {/* Gallery + Summary */}
        <div className="property-details-page__top">

          {/* Gallery */}
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
            {property.images?.length > 1 && (
              <div className="property-gallery__thumbs">
                {property.images.map((image, index) => (
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

          {/* Summary panel */}
          <motion.div
            className="property-details-page__summary"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.38, delay: 0.08 }}
          >
            {/* Badges row */}
            <div className="property-details-page__badges">
              <span className="property-details-page__price-tag">
                EGP {property.price?.toLocaleString()}
                <small> / {property.paymentPeriod || 'month'}</small>
              </span>
              {property.status && (
                <Badge variant={statusVariantMap[property.status] || 'neutral'}>
                  {labelize(property.status)}
                </Badge>
              )}
              {property.type && <Badge variant="neutral">{labelize(property.type)}</Badge>}
            </div>

            <h1>{property.title}</h1>

            {(property.city || property.district) && (
              <p className="property-details-page__location">
                <MapPin size={15} />
                <span>
                  {property.district ? `${property.district}, ` : ''}
                  {property.city}
                  {property.address ? ` \u2014 ${property.address}` : ''}
                </span>
              </p>
            )}

            {/* Facts chips */}
            <div className="property-details-page__facts">
              {property.rooms ? (
                <span><BedDouble size={14} /> {property.rooms} {property.rooms === 1 ? 'bedroom' : 'bedrooms'}</span>
              ) : null}
              {property.bathrooms ? (
                <span><Bath size={14} /> {property.bathrooms} {property.bathrooms === 1 ? 'bathroom' : 'bathrooms'}</span>
              ) : null}
              {property.areaSqm ? <span><Maximize2 size={14} /> {property.areaSqm} m&sup2;</span> : null}
              {property.floor ? (
                <span>
                  <Building2 size={14} />
                  {' '}Floor {property.floor}{property.floorCount ? ` of ${property.floorCount}` : ''}
                </span>
              ) : null}
              {availableDate ? <span><Calendar size={14} /> From {availableDate}</span> : null}
            </div>

            {/* Extra specs */}
            {(property.finishingType || property.viewType || property.buildingAge || property.heatingType) && (
              <div className="property-details-page__specs">
                {property.finishingType && (
                  <div className="property-details-page__spec">
                    <span>Finishing</span>
                    <strong>{labelize(property.finishingType)}</strong>
                  </div>
                )}
                {property.viewType && (
                  <div className="property-details-page__spec">
                    <span>View</span>
                    <strong>{labelize(property.viewType)}</strong>
                  </div>
                )}
                {property.buildingAge && (
                  <div className="property-details-page__spec">
                    <span>Building age</span>
                    <strong>{property.buildingAge}</strong>
                  </div>
                )}
                {property.heatingType && (
                  <div className="property-details-page__spec">
                    <span>Cooling / Heat</span>
                    <strong>{labelize(property.heatingType)}</strong>
                  </div>
                )}
              </div>
            )}

            {/* Lease terms */}
            {(property.deposit || property.minimumStayMonths || property.maxOccupancy || (property.preferredTenant && property.preferredTenant !== 'any')) && (
              <div className="property-details-page__lease">
                {property.deposit ? (
                  <div className="property-details-page__lease-item">
                    <Banknote size={14} />
                    <span>Deposit: <strong>EGP {property.deposit.toLocaleString()}</strong></span>
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

            {/* Feature flags */}
            {activeFeatures.length > 0 && (
              <div className="property-details-page__features">
                {activeFeatures.map((f) => (
                  <span key={f.key} className="property-details-page__feature">
                    {f.icon} {f.label}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {property.description && (
              <p className="property-details-page__desc">{property.description}</p>
            )}

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="property-details-page__amenities">
                {property.amenities.map((amenity) => (
                  <span key={amenity}><Check size={13} /> {amenity}</span>
                ))}
              </div>
            )}

            {/* Nearby */}
            {(property.nearbyLandmarks || property.nearbyTransport) && (
              <div className="property-details-page__nearby">
                {property.nearbyLandmarks && (
                  <p><MapPin size={13} /> <strong>Nearby:</strong> {property.nearbyLandmarks}</p>
                )}
                {property.nearbyTransport && (
                  <p><MapPin size={13} /> <strong>Transport:</strong> {property.nearbyTransport}</p>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="property-details-page__cta">
              <Button
                variant="primary"
                size="lg"
                leading={<MessageSquareMore size={18} />}
                onClick={openChat}
              >
                Contact Owner
              </Button>
              {property.contactPhone && (
                <a className="property-details-page__phone" href={`tel:${property.contactPhone}`}>
                  <Phone size={14} /> {property.contactPhone}
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Map + Owner */}
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
            {property.location?.lat && property.location?.lng ? (
              <div className="property-map-card__map">
                <MapContainer
                  center={[property.location.lat, property.location.lng]}
                  zoom={14}
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[property.location.lat, property.location.lng]} />
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
              <img src={property.owner.avatar} alt={property.owner.name} />
              <div>
                <strong>{property.owner.name}</strong>
                <span>{property.owner.responseTime}</span>
              </div>
            </div>
            <div className="property-owner-card__stats">
              {isOwner && (
                <>
                  <div>
                    <strong>{property.views}</strong>
                    <span>Views</span>
                  </div>
                  <div>
                    <strong>{property.messages}</strong>
                    <span>Messages</span>
                  </div>
                </>
              )}
              <div>
                <strong>{property.owner.matchPercentage}%</strong>
                <span>Response</span>
              </div>
            </div>
            {/* Secondary chat button removed to avoid redundancy */}
          </Card>
        </motion.div>

      </div>
    </PageTransition>
  );
};

export default PropertyDetails;
