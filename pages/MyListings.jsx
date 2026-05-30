import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, MapPin, BedDouble, Bath, Trash2, X, ChevronDown } from 'lucide-react';
import {
  fetchMyProperties,
  createProperty,
  deleteProperty,
  fetchAmenities,
  clearCreateError,
} from '../slices/propertySlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { governorates, citiesByGovernorate } from '../data/egyptLocations';

const PROPERTY_TYPES = ['APARTMENT', 'VILLA', 'STUDIO', 'ROOM', 'DUPLEX'];

const emptyForm = {
  title: '',
  description: '',
  price: '',
  propertyType: '',
  governorateId: '',
  cityId: '',
  address: '',
  roomsCount: '',
  bathroomsCount: '',
  floorNumber: '',
  isFullyFurnished: false,
  availableFrom: '',
  amenityIds: [],
};

const MyListings = () => {
  const dispatch = useDispatch();
  const { myListings, myListingsLoading, amenities, creating, createError, createFieldErrors } =
    useSelector((state) => state.properties);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    dispatch(fetchMyProperties());
    dispatch(fetchAmenities());
  }, [dispatch]);

  useEffect(() => {
    if (createFieldErrors) setFieldErrors(createFieldErrors);
  }, [createFieldErrors]);

  const filteredCities = form.governorateId
    ? citiesByGovernorate[parseInt(form.governorateId, 10)] || []
    : [];

  const handleCreate = async () => {
    const errors = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.description.trim()) errors.description = 'Description is required';
    if (!form.price || Number(form.price) <= 0) errors.price = 'Valid price is required';
    if (!form.propertyType) errors.propertyType = 'Property type is required';
    if (!form.governorateId) errors.governorateId = 'Governorate is required';
    if (!form.cityId) errors.cityId = 'City is required';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      propertyType: form.propertyType,
      governorateId: parseInt(form.governorateId, 10),
      cityId: parseInt(form.cityId, 10),
      address: form.address.trim() || null,
      roomsCount: form.roomsCount ? parseInt(form.roomsCount, 10) : null,
      bathroomsCount: form.bathroomsCount ? parseInt(form.bathroomsCount, 10) : null,
      floorNumber: form.floorNumber ? parseInt(form.floorNumber, 10) : null,
      isFullyFurnished: form.isFullyFurnished,
      availableFrom: form.availableFrom || null,
      amenityIds: form.amenityIds.length > 0 ? form.amenityIds : null,
    };

    const result = await dispatch(createProperty({ propertyData: payload, images }));
    if (createProperty.fulfilled.match(result)) {
      setForm(emptyForm);
      setImages([]);
      setShowForm(false);
      dispatch(clearCreateError());
    }
  };

  const handleDelete = async (id) => {
    await dispatch(deleteProperty(id));
    setDeleteConfirm(null);
  };

  const toggleAmenity = (id) => {
    setForm((prev) => ({
      ...prev,
      amenityIds: prev.amenityIds.includes(id)
        ? prev.amenityIds.filter((a) => a !== id)
        : [...prev.amenityIds, id],
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="app-container"
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-1">My Listings</h1>
          <p className="text-gray-500">Manage your property listings</p>
        </div>
        <Button variant="primary" onClick={() => { setShowForm(true); setFieldErrors({}); dispatch(clearCreateError()); }}>
          <Plus size={18} /> New Listing
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl my-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-black">Create New Listing</h3>
              <button
                onClick={() => { setShowForm(false); dispatch(clearCreateError()); }}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {createError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {createError}
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Spacious 2-bedroom apartment in Maadi"
                error={fieldErrors.title}
              />

              <div>
                <label className="block text-sm font-medium text-black mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the property…"
                  rows={3}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none ${fieldErrors.description ? 'border-red-500' : 'border-gray-300'}`}
                />
                {fieldErrors.description && <p className="text-red-500 text-xs mt-1">{fieldErrors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price (EGP/mo)"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="5000"
                  error={fieldErrors.price}
                />
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Property Type</label>
                  <select
                    className={`block w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black ${fieldErrors.propertyType ? 'border-red-500' : 'border-gray-300'}`}
                    value={form.propertyType}
                    onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                  >
                    <option value="">Select type…</option>
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t.charAt(0) + t.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.propertyType && <p className="text-red-500 text-xs mt-1">{fieldErrors.propertyType}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Governorate</label>
                  <select
                    className={`block w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black ${fieldErrors.governorateId ? 'border-red-500' : 'border-gray-300'}`}
                    value={form.governorateId}
                    onChange={(e) => setForm({ ...form, governorateId: e.target.value, cityId: '' })}
                  >
                    <option value="">Select…</option>
                    {governorates.map((g) => (
                      <option key={g.id} value={g.id}>{g.nameEn}</option>
                    ))}
                  </select>
                  {fieldErrors.governorateId && <p className="text-red-500 text-xs mt-1">{fieldErrors.governorateId}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">City</label>
                  <select
                    className={`block w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black ${fieldErrors.cityId ? 'border-red-500' : 'border-gray-300'}`}
                    value={form.cityId}
                    onChange={(e) => setForm({ ...form, cityId: e.target.value })}
                    disabled={!form.governorateId}
                  >
                    <option value="">{form.governorateId ? 'Select…' : 'Select governorate first'}</option>
                    {filteredCities.map((c) => (
                      <option key={c.id} value={c.id}>{c.nameEn}</option>
                    ))}
                  </select>
                  {fieldErrors.cityId && <p className="text-red-500 text-xs mt-1">{fieldErrors.cityId}</p>}
                </div>
              </div>

              <Input
                label="Address (Optional)"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Street name, building number…"
              />

              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Rooms"
                  type="number" min="1"
                  value={form.roomsCount}
                  onChange={(e) => setForm({ ...form, roomsCount: e.target.value })}
                  placeholder="2"
                />
                <Input
                  label="Bathrooms"
                  type="number" min="1"
                  value={form.bathroomsCount}
                  onChange={(e) => setForm({ ...form, bathroomsCount: e.target.value })}
                  placeholder="1"
                />
                <Input
                  label="Floor"
                  type="number" min="0"
                  value={form.floorNumber}
                  onChange={(e) => setForm({ ...form, floorNumber: e.target.value })}
                  placeholder="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Available From (Optional)</label>
                  <input
                    type="date"
                    value={form.availableFrom}
                    onChange={(e) => setForm({ ...form, availableFrom: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isFullyFurnished}
                      onChange={(e) => setForm({ ...form, isFullyFurnished: e.target.checked })}
                      className="w-4 h-4 accent-black"
                    />
                    <span className="text-sm font-medium text-black">Fully Furnished</span>
                  </label>
                </div>
              </div>

              {/* Amenities */}
              {amenities.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Amenities (Optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggleAmenity(a.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                          form.amenityIds.includes(a.id)
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {a.icon && <span className="mr-1">{a.icon}</span>}{a.nameEn}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Photos <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(e) => setImages(Array.from(e.target.files || []))}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {images.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">{images.length} file{images.length !== 1 ? 's' : ''} selected</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                fullWidth
                onClick={() => { setShowForm(false); dispatch(clearCreateError()); }}
              >
                Cancel
              </Button>
              <Button variant="primary" fullWidth onClick={handleCreate} disabled={creating}>
                {creating ? 'Creating…' : 'Create Listing'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* My Listings Grid */}
      {myListingsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : myListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {myListings.map((property) => {
            const primaryImage = property.images?.find((img) => img.isPrimary) || property.images?.[0];
            return (
              <div
                key={property.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link to={`/listings/${property.id}`}>
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    {primaryImage ? (
                      <img src={primaryImage.url} alt={property.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No photo</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-black truncate mb-1">{property.title}</h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1 mb-2">
                      <MapPin size={13} />
                      {[property.city, property.governorate].filter(Boolean).join(', ')}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                      {property.roomsCount != null && (
                        <span className="flex items-center gap-1"><BedDouble size={13} /> {property.roomsCount}</span>
                      )}
                      {property.bathroomsCount != null && (
                        <span className="flex items-center gap-1"><Bath size={13} /> {property.bathroomsCount}</span>
                      )}
                    </div>
                    <span className="font-bold text-black">
                      {Number(property.price).toLocaleString()} EGP<span className="text-xs font-normal text-gray-500">/mo</span>
                    </span>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <button
                    onClick={() => setDeleteConfirm(property.id)}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={13} /> Delete listing
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
          <Plus size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-black mb-2">No listings yet</h3>
          <p className="text-gray-600 mb-6">Create your first property listing to start receiving inquiries.</p>
          <Button variant="primary" onClick={() => setShowForm(true)}>
            Create First Listing
          </Button>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-black mb-2">Delete listing?</h3>
            <p className="text-gray-500 text-sm mb-6">
              This will permanently delete the listing and all its images.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" fullWidth onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={() => handleDelete(deleteConfirm)}
                className="!bg-red-600 hover:!bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MyListings;
