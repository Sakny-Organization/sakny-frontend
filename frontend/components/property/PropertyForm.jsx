import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bath, BedDouble, Building2, FileText, Image as ImageIcon, MapPinned, Navigation, Phone, SlidersHorizontal, Tag, Wallet } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import ImageUploader from './ImageUploader';
import MapPicker from './MapPicker';
import {
  PROPERTY_AMENITIES,
  PROPERTY_BUILDING_AGES,
  PROPERTY_FINISHING_TYPES,
  PROPERTY_HEATING_TYPES,
  PROPERTY_PAYMENT_PERIODS,
  PROPERTY_TENANT_TYPES,
  PROPERTY_TYPES,
  PROPERTY_VIEW_TYPES,
} from '../../services/propertyService';

const defaultProperty = {
  title: '',
  description: '',
  type: 'apartment',
  price: '',
  currency: 'EGP',
  city: '',
  district: '',
  address: '',
  nearbyLandmarks: '',
  nearbyTransport: '',
  rooms: 1,
  bathrooms: 1,
  floor: 1,
  floorCount: '',
  areaSqm: '',
  deposit: '',
  availableFrom: '',
  minimumStayMonths: 12,
  paymentPeriod: 'monthly',
  maxOccupancy: 1,
  parkingSpots: 0,
  buildingAge: '',
  viewType: '',
  heatingType: '',
  finishingType: '',
  furnished: false,
  utilitiesIncluded: false,
  internetIncluded: false,
  petsAllowed: false,
  smokingAllowed: false,
  preferredTenant: 'any',
  amenities: [],
  images: [],
  location: null,
  contactPhone: '',
  notes: '',
};

const sectionMotion = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' } },
};

const toggleFieldConfig = [
  { key: 'furnished', label: 'Furnished', hint: 'Property comes with furniture' },
  { key: 'utilitiesIncluded', label: 'Utilities included', hint: 'Electricity & water in rent' },
  { key: 'internetIncluded', label: 'Internet included', hint: 'Broadband / fibre included' },
  { key: 'petsAllowed', label: 'Pets allowed', hint: 'Cats, dogs, or other pets' },
  { key: 'smokingAllowed', label: 'Smoking allowed', hint: 'Smoking permitted indoors' },
];

const labelize = (value) =>
  String(value || '')
    .split(' ')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

const SectionHeader = ({ step, icon, title, subtitle }) => (
  <div className="property-form__section-head">
    <div className="property-form__section-head-left">
      <div className="property-form__step-badge">{step}</div>
      <div>
        <strong>{icon} {title}</strong>
        <span>{subtitle}</span>
      </div>
    </div>
  </div>
);

const PropertyForm = ({ initialValues, onSubmit, submitting = false, submitLabel = 'Save property' }) => {
  const [values, setValues] = React.useState({ ...defaultProperty, ...initialValues });

  React.useEffect(() => {
    setValues({ ...defaultProperty, ...initialValues });
  }, [initialValues]);

  const updateField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const toggleAmenity = (amenity) => {
    setValues((current) => ({
      ...current,
      amenities: current.amenities.includes(amenity)
        ? current.amenities.filter((item) => item !== amenity)
        : [...current.amenities, amenity],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...values,
      price: Number(values.price),
      rooms: Number(values.rooms),
      bathrooms: Number(values.bathrooms),
      floor: Number(values.floor),
      floorCount: Number(values.floorCount || 0),
      areaSqm: Number(values.areaSqm || 0),
      deposit: Number(values.deposit || 0),
      minimumStayMonths: Number(values.minimumStayMonths || 0),
      maxOccupancy: Number(values.maxOccupancy || 0),
      parkingSpots: Number(values.parkingSpots || 0),
    });
  };

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <motion.div className="property-form__sections" initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.08 } } }}>

        {/* â”€â”€ Section 1: Listing Identity â”€â”€ */}
        <motion.div variants={sectionMotion}>
          <Card className="property-form__section">
            <SectionHeader step="1" icon={<FileText size={15} />} title="Basic info" subtitle="Title and description for your listing" />
            <div className="property-form__grid property-form__grid--single">
              <label className="property-field">
                <span>Listing title <em className="property-field__required">*</em></span>
                <input
                  value={values.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g. Modern 2-bedroom apartment near AUC with AC and balcony"
                  required
                />
              </label>
              <label className="property-field">
                <span>Description <em className="property-field__required">*</em></span>
                <textarea
                  value={values.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows="5"
                  placeholder="Describe the space, layout, and what's nearby."
                  required
                />
              </label>
              <label className="property-field">
                <span>Additional notes (private)</span>
                <textarea
                  value={values.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  rows="2"
                  placeholder="Visible only to you, not shown to renters."
                />
              </label>
            </div>
          </Card>
        </motion.div>

        {/* â”€â”€ Section 2: Location â”€â”€ */}
        <motion.div variants={sectionMotion}>
          <Card className="property-form__section">
            <SectionHeader step="2" icon={<MapPinned size={15} />} title="Location" subtitle="Address and nearby landmarks" />
            <div className="property-form__grid">
              <label className="property-field">
                <span>City <em className="property-field__required">*</em></span>
                <input value={values.city} onChange={(e) => updateField('city', e.target.value)} placeholder="New Cairo" required />
              </label>
              <label className="property-field">
                <span>District / Neighbourhood <em className="property-field__required">*</em></span>
                <input value={values.district} onChange={(e) => updateField('district', e.target.value)} placeholder="Fifth Settlement" required />
              </label>
              <label className="property-field">
                <span>Street address <em className="property-field__required">*</em></span>
                <input value={values.address} onChange={(e) => updateField('address', e.target.value)} placeholder="Street name, building number, compound" required />
              </label>
              <label className="property-field">
                <span>Available from</span>
                <input type="date" value={values.availableFrom} onChange={(e) => updateField('availableFrom', e.target.value)} />
              </label>
              <label className="property-field">
                <span>Nearby landmarks</span>
                <input value={values.nearbyLandmarks} onChange={(e) => updateField('nearbyLandmarks', e.target.value)} placeholder="e.g. Near Cairo Festival City, 5 min from AUC" />
              </label>
              <label className="property-field">
                <span>Nearest public transport</span>
                <input value={values.nearbyTransport} onChange={(e) => updateField('nearbyTransport', e.target.value)} placeholder="e.g. Nearest metro station, 10 min away" />
              </label>
            </div>
          </Card>
        </motion.div>

        {/* â”€â”€ Section 3: Property Details â”€â”€ */}
        <motion.div variants={sectionMotion}>
          <Card className="property-form__section">
            <SectionHeader step="3" icon={<BedDouble size={15} />} title="Property details" subtitle="Rooms, size, and building info" />
            <div className="property-form__grid">
              <label className="property-field">
                <span>Property type <em className="property-field__required">*</em></span>
                <select value={values.type} onChange={(e) => updateField('type', e.target.value)}>
                  {PROPERTY_TYPES.map((type) => <option key={type} value={type}>{labelize(type)}</option>)}
                </select>
              </label>
              <label className="property-field">
                <span>Finishing type</span>
                <select value={values.finishingType} onChange={(e) => updateField('finishingType', e.target.value)}>
                  <option value="">Select finishing</option>
                  {PROPERTY_FINISHING_TYPES.map((type) => <option key={type} value={type}>{labelize(type)}</option>)}
                </select>
              </label>
              <label className="property-field">
                <span>Area (m²)</span>
                <input type="number" min="0" value={values.areaSqm} onChange={(e) => updateField('areaSqm', e.target.value)} placeholder="135" />
              </label>
              <label className="property-field">
                <span>Bedrooms <em className="property-field__required">*</em></span>
                <input type="number" min="1" value={values.rooms} onChange={(e) => updateField('rooms', e.target.value)} />
              </label>
              <label className="property-field">
                <span>Bathrooms <em className="property-field__required">*</em></span>
                <input type="number" min="1" value={values.bathrooms} onChange={(e) => updateField('bathrooms', e.target.value)} />
              </label>
              <label className="property-field">
                <span>Floor number</span>
                <input type="number" min="0" value={values.floor} onChange={(e) => updateField('floor', e.target.value)} placeholder="e.g. 3" />
              </label>
              <label className="property-field">
                <span>Total floors in building</span>
                <input type="number" min="1" value={values.floorCount} onChange={(e) => updateField('floorCount', e.target.value)} placeholder="e.g. 8" />
              </label>
              <label className="property-field">
                <span>Max occupancy</span>
                <input type="number" min="1" value={values.maxOccupancy} onChange={(e) => updateField('maxOccupancy', e.target.value)} />
              </label>
              <label className="property-field">
                <span>Parking spots</span>
                <input type="number" min="0" value={values.parkingSpots} onChange={(e) => updateField('parkingSpots', e.target.value)} />
              </label>
              <label className="property-field">
                <span>View type</span>
                <select value={values.viewType} onChange={(e) => updateField('viewType', e.target.value)}>
                  <option value="">Select view</option>
                  {PROPERTY_VIEW_TYPES.map((v) => <option key={v} value={v}>{labelize(v)}</option>)}
                </select>
              </label>
              <label className="property-field">
                <span>Cooling / heating</span>
                <select value={values.heatingType} onChange={(e) => updateField('heatingType', e.target.value)}>
                  <option value="">Select type</option>
                  {PROPERTY_HEATING_TYPES.map((v) => <option key={v} value={v}>{labelize(v)}</option>)}
                </select>
              </label>
              <label className="property-field">
                <span>Building age</span>
                <select value={values.buildingAge} onChange={(e) => updateField('buildingAge', e.target.value)}>
                  <option value="">Select age</option>
                  {PROPERTY_BUILDING_AGES.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </label>
            </div>
          </Card>
        </motion.div>

        {/* â”€â”€ Section 4: Pricing & Lease â”€â”€ */}
        <motion.div variants={sectionMotion}>
          <Card className="property-form__section">
            <SectionHeader step="4" icon={<Wallet size={15} />} title="Price & lease" subtitle="Rent, deposit, and how long the lease runs" />
            <div className="property-form__grid">
              <label className="property-field">
                <span>Monthly rent (EGP) <em className="property-field__required">*</em></span>
                <input type="number" min="0" value={values.price} onChange={(e) => updateField('price', e.target.value)} placeholder="8500" required />
              </label>
              <label className="property-field">
                <span>Security deposit (EGP)</span>
                <input type="number" min="0" value={values.deposit} onChange={(e) => updateField('deposit', e.target.value)} placeholder="8500" />
              </label>
              <label className="property-field">
                <span>Payment period</span>
                <select value={values.paymentPeriod} onChange={(e) => updateField('paymentPeriod', e.target.value)}>
                  {PROPERTY_PAYMENT_PERIODS.map((period) => <option key={period} value={period}>{labelize(period)}</option>)}
                </select>
              </label>
              <label className="property-field">
                <span>Minimum stay (months)</span>
                <input type="number" min="1" value={values.minimumStayMonths} onChange={(e) => updateField('minimumStayMonths', e.target.value)} />
              </label>
              <label className="property-field">
                <span>Preferred tenant</span>
                <select value={values.preferredTenant} onChange={(e) => updateField('preferredTenant', e.target.value)}>
                  {PROPERTY_TENANT_TYPES.map((option) => <option key={option} value={option}>{labelize(option)}</option>)}
                </select>
              </label>
            </div>
          </Card>
        </motion.div>

        {/* â”€â”€ Section 5: Setup & Rules â”€â”€ */}
        <motion.div variants={sectionMotion}>
          <Card className="property-form__section">
            <SectionHeader step="5" icon={<SlidersHorizontal size={15} />} title="House rules" subtitle="What's included and what rules apply" />
            <div className="property-form__toggles">
              {toggleFieldConfig.map((field) => (
                <label className="property-toggle property-toggle--card" key={field.key}>
                  <div>
                    <span>{field.label}</span>
                    {field.hint ? <small>{field.hint}</small> : null}
                  </div>
                  <button
                    type="button"
                    className={`property-toggle__button ${values[field.key] ? 'is-active' : ''}`}
                    onClick={() => updateField(field.key, !values[field.key])}
                  >
                    <span />
                  </button>
                </label>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* â”€â”€ Section 6: Amenities â”€â”€ */}
        <motion.div variants={sectionMotion}>
          <Card className="property-form__section">
            <SectionHeader step="6" icon={<Tag size={15} />} title="Amenities" subtitle="Select everything that applies" />
            <div className="property-amenities">
              {PROPERTY_AMENITIES.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  className={`property-amenities__chip ${values.amenities.includes(amenity) ? 'is-active' : ''}`}
                  onClick={() => toggleAmenity(amenity)}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* â”€â”€ Section 7: Images â”€â”€ */}
        <motion.div variants={sectionMotion}>
          <Card className="property-form__section">
            <SectionHeader step="7" icon={<ImageIcon size={15} />} title="Photos" subtitle="Add at least 5 photos for best results" />
            <ImageUploader value={values.images} onChange={(images) => updateField('images', images)} />
          </Card>
        </motion.div>

        {/* â”€â”€ Section 8: Map â”€â”€ */}
        <motion.div variants={sectionMotion}>
          <Card className="property-form__section">
            <SectionHeader step="8" icon={<Navigation size={15} />} title="Map" subtitle="Drop a pin to mark the exact location" />
            <MapPicker value={values.location} onChange={(location) => updateField('location', location)} />
          </Card>
        </motion.div>

        {/* â”€â”€ Section 9: Contact â”€â”€ */}
        <motion.div variants={sectionMotion}>
          <Card className="property-form__section">
            <SectionHeader step="9" icon={<Phone size={15} />} title="Contact" subtitle="How renters can reach you" />
            <div className="property-form__grid">
              <label className="property-field">
                <span>Contact phone number</span>
                <input
                  type="tel"
                  value={values.contactPhone}
                  onChange={(e) => updateField('contactPhone', e.target.value)}
                  placeholder="+20 10X XXX XXXX"
                />
              </label>
            </div>
          </Card>
        </motion.div>

      </motion.div>

      <div className="property-form__footer">
        <p className="property-form__footer-note">Fields marked <em className="property-field__required">*</em> are required</p>
        <Button type="submit" variant="primary" size="lg" trailing={<ArrowRight size={16} />} disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default PropertyForm;
