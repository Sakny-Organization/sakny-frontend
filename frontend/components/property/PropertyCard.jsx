import React from 'react';
import { motion } from 'framer-motion';
import {
  Bath,
  BedDouble,
  Calendar,
  Eye,
  MapPin,
  Maximize2,
  Pencil,
  Trash2,
  MessageCircle,
  CheckCircle2,
  Clock3,
} from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const statusVariantMap = {
  available: 'success',
  rented: 'danger',
  pending: 'warning',
};

const labelize = (value) => String(value || '').charAt(0).toUpperCase() + String(value || '').slice(1);

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  try {
    return new Intl.DateTimeFormat('en-EG', { month: 'short', year: 'numeric' }).format(new Date(dateStr));
  } catch {
    return null;
  }
};

const PropertyCard = ({
  property,
  mode = 'explore',
  onEdit,
  onDelete,
  onViewDetails,
  onToggleStatus,
  onContactOwner,
}) => {
  const coverImage = property.images?.[0] || 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80';
  const availableDate = formatDate(property.availableFrom);

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }}>
      <Card className="property-card" hoverable>
        {/* ── Cover image ── */}
        <div className="property-card__media-wrap">
          <img src={coverImage} alt={property.title} className="property-card__media" />
          <div className="property-card__overlay">
            <div className="property-card__overlay-top">
              <div className="property-card__price-tag">
                EGP {property.price.toLocaleString()}
                <small>/{property.paymentPeriod || 'month'}</small>
              </div>
              <Badge variant={statusVariantMap[property.status] || 'neutral'}>{labelize(property.status)}</Badge>
            </div>
            <div className="property-card__overlay-bottom">
              <Badge variant="dark" className="property-card__type-badge">{labelize(property.type)}</Badge>
            </div>
          </div>
        </div>

        {/* ── Card body ── */}
        <div className="property-card__body">
          {/* Title + location */}
          <div className="property-card__header">
            <div className="property-card__title-group">
              <h3 className="property-card__title">{property.title}</h3>
              <p className="property-card__location">
                <MapPin size={13} />
                <span>{property.district ? `${property.district}, ` : ''}{property.city}</span>
              </p>
            </div>
            <Badge variant={property.furnished ? 'info' : 'neutral'} className="property-card__furnished-badge">
              {property.furnished ? 'Furnished' : 'Unfurnished'}
            </Badge>
          </div>

          {/* Key facts chips */}
          <div className="property-card__facts">
            <span className="property-card__fact">
              <BedDouble size={13} />
              {property.rooms} {property.rooms === 1 ? 'bed' : 'beds'}
            </span>
            <span className="property-card__fact">
              <Bath size={13} />
              {property.bathrooms} {property.bathrooms === 1 ? 'bath' : 'baths'}
            </span>
            {property.areaSqm ? (
              <span className="property-card__fact">
                <Maximize2 size={13} />
                {property.areaSqm} m²
              </span>
            ) : null}
            {availableDate ? (
              <span className="property-card__fact">
                <Calendar size={13} />
                From {availableDate}
              </span>
            ) : null}
          </div>

          {/* Description */}
          <p className="property-card__description">{property.description}</p>

          {/* Stats row */}
          <div className="property-card__stats">
            <span><Eye size={13} /> {(property.views || 0).toLocaleString()} views</span>
            <span><MessageCircle size={13} /> {(property.messages || 0)} messages</span>
            {property.status === 'pending' ? <span><Clock3 size={13} /> Under review</span> : null}
          </div>

          {/* Action buttons */}
          {mode === 'owner' ? (
            <div className="property-card__actions property-card__actions--owner">
              <Button size="sm" variant="secondary" leading={<Pencil size={13} />} onClick={() => onEdit?.(property)}>
                Edit
              </Button>
              <Button size="sm" variant="ghost" leading={<Trash2 size={13} />} onClick={() => onDelete?.(property)}>
                Delete
              </Button>
              <Button size="sm" variant="outline" leading={<Eye size={13} />} onClick={() => onViewDetails?.(property)}>
                View
              </Button>
              <Button
                size="sm"
                variant="primary"
                leading={<CheckCircle2 size={13} />}
                onClick={() => onToggleStatus?.(property)}
              >
                {property.status === 'rented' ? 'Set Available' : 'Mark Rented'}
              </Button>
            </div>
          ) : (
            <div className="property-card__actions">
              <Button size="sm" variant="outline" onClick={() => onViewDetails?.(property)}>View Details</Button>
              <Button size="sm" variant="primary" onClick={() => onContactOwner?.(property)}>Contact Owner</Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default PropertyCard;
