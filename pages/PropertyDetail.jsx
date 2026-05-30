import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  MapPin, BedDouble, Bath, Layers, Calendar, ArrowLeft,
  CheckCircle, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { fetchProperty, clearActiveProperty } from '../slices/propertySlice';
import { createReservation } from '../services/propertyApi';
import Button from '../components/common/Button';

const PropertyDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const { activeProperty, detailLoading, error } = useSelector((state) => state.properties);

  const [imageIndex, setImageIndex] = useState(0);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reserveForm, setReserveForm] = useState({ startDate: '', endDate: '', note: '' });
  const [reserving, setReserving] = useState(false);
  const [reserveError, setReserveError] = useState(null);
  const [reserveSuccess, setReserveSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchProperty(id));
    return () => dispatch(clearActiveProperty());
  }, [id, dispatch]);

  if (detailLoading) {
    return (
      <div className="app-container flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" />
      </div>
    );
  }

  if (error || !activeProperty) {
    return (
      <div className="app-container">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error || 'Property not found.'}
        </div>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/listings')}>
          Back to listings
        </Button>
      </div>
    );
  }

  const property = activeProperty;
  const images = property.images || [];
  const isOwner = user?.id === property.ownerId;

  const handleReserve = async () => {
    if (!reserveForm.startDate || !reserveForm.endDate) {
      setReserveError('Please select start and end dates.');
      return;
    }
    if (reserveForm.startDate >= reserveForm.endDate) {
      setReserveError('End date must be after start date.');
      return;
    }
    try {
      setReserving(true);
      setReserveError(null);
      await createReservation(
        {
          propertyId: property.id,
          startDate: reserveForm.startDate,
          endDate: reserveForm.endDate,
          note: reserveForm.note,
        },
        token
      );
      setReserveSuccess(true);
    } catch (err) {
      setReserveError(err.message || 'Reservation failed. Please try again.');
    } finally {
      setReserving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="app-container"
    >
      {/* Back nav */}
      <button
        onClick={() => navigate('/listings')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-black transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Back to listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Images + Details */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-video mb-6">
            {images.length > 0 ? (
              <>
                <img
                  src={images[imageIndex]?.imageUrl || images[imageIndex]?.url}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImageIndex((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 hover:bg-white transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setImageIndex((i) => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 hover:bg-white transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-colors ${idx === imageIndex ? 'bg-white' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                No photos available
              </div>
            )}
          </div>

          {/* Title + Meta */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-2xl font-bold text-black">{property.title}</h1>
              {property.isFullyFurnished && (
                <span className="bg-black text-white text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap">
                  Furnished
                </span>
              )}
            </div>
            <p className="text-gray-500 flex items-center gap-1 text-sm mb-4">
              <MapPin size={14} />
              {[property.address, property.city, property.governorate].filter(Boolean).join(', ')}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {property.propertyType && (
                <span className="capitalize">{property.propertyType.toLowerCase()}</span>
              )}
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
              {property.floorNumber != null && (
                <span className="flex items-center gap-1">
                  <Layers size={14} /> Floor {property.floorNumber}
                </span>
              )}
              {property.availableFrom && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> Available from {new Date(property.availableFrom).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-black mb-2">Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{property.description}</p>
            </div>
          )}

          {/* Amenities */}
          {property.amenities?.size > 0 || property.amenities?.length > 0 ? (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-black mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {Array.from(property.amenities || []).map((amenity) => (
                  <span
                    key={amenity.id}
                    className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-full"
                  >
                    {amenity.icon && <span>{amenity.icon}</span>}
                    {amenity.nameEn}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Right: Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 sticky top-24">
            <div className="mb-4">
              <span className="text-3xl font-bold text-black">
                {Number(property.price).toLocaleString()}
              </span>
              <span className="text-gray-500 text-sm"> EGP/mo</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(property.ownerName || 'Owner')}&background=e5e7eb&color=374151&size=32`}
                alt={property.ownerName}
                className="size-8 rounded-full"
              />
              <span>Listed by <strong>{property.ownerName || 'Owner'}</strong></span>
            </div>

            {isOwner ? (
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 text-center">
                  This is your listing
                </div>
                <Link to="/my-listings">
                  <Button variant="outline" fullWidth>Manage listings</Button>
                </Link>
              </div>
            ) : (
              <Button variant="primary" fullWidth onClick={() => setShowReserveModal(true)}>
                Reserve
              </Button>
            )}

            {property.availableFrom && (
              <p className="text-xs text-gray-400 text-center mt-3">
                Available from {new Date(property.availableFrom).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {showReserveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-black">Reserve Property</h3>
              <button
                onClick={() => { setShowReserveModal(false); setReserveSuccess(false); setReserveError(null); }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {reserveSuccess ? (
              <div className="text-center py-6">
                <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                <h4 className="text-lg font-semibold text-black mb-2">Reservation submitted!</h4>
                <p className="text-gray-500 text-sm mb-6">
                  The owner will review your request and confirm shortly.
                </p>
                <Button variant="outline" onClick={() => setShowReserveModal(false)}>
                  Close
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Start Date</label>
                    <input
                      type="date"
                      value={reserveForm.startDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setReserveForm({ ...reserveForm, startDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">End Date</label>
                    <input
                      type="date"
                      value={reserveForm.endDate}
                      min={reserveForm.startDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setReserveForm({ ...reserveForm, endDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Note <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      value={reserveForm.note}
                      onChange={(e) => setReserveForm({ ...reserveForm, note: e.target.value })}
                      placeholder="Introduce yourself to the owner…"
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                    />
                  </div>
                </div>

                {reserveError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {reserveError}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setShowReserveModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" fullWidth onClick={handleReserve} disabled={reserving}>
                    {reserving ? 'Submitting…' : 'Confirm Reservation'}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default PropertyDetail;
