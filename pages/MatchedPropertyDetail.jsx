import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchPropertyCompatibility, clearSelectedProperty } from '../slices/tenantPropertyMatchSlice';
import Button from '../components/common/Button';
import PageTransition from '../components/common/PageTransition';
import {
  Loader, ArrowLeft, MessageCircle, MapPin, BedDouble, Bath, Building2,
  Calendar, Layers, Wifi, Zap, PawPrint, Star, Check,
} from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  try {
    return new Intl.DateTimeFormat('en-EG', { month: 'short', year: 'numeric' }).format(new Date(dateStr));
  } catch {
    return null;
  }
};

const BREAKDOWN_LABELS = {
  budget: 'Budget Match',
  location: 'Location Match',
  smoking: 'Smoking Preference',
  pets: 'Pet Preference',
  gender: 'Gender Preference',
  tenantType: 'Tenant Type',
  cleanliness: 'Cleanliness Level',
  sleep: 'Sleep Schedule',
  furnished: 'Furnishing',
  amenities: 'Amenities',
};

const MatchedPropertyDetail = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedProperty: property, selectedStatus } = useSelector((state) => state.tenantPropertyMatch);

  useEffect(() => {
    if (propertyId) {
      dispatch(fetchPropertyCompatibility(Number(propertyId)));
    }
    return () => { dispatch(clearSelectedProperty()); };
  }, [dispatch, propertyId]);

  const handleMessage = () => {
    navigate('/messages', {
      state: {
        startConversation: {
          participant: property.owner,
          propertyId: property.id,
          propertyTitle: property.title,
        },
      },
    });
  };

  if (selectedStatus === 'loading') {
    return (
      <PageTransition>
        <div className="flex items-center justify-center py-20">
          <Loader size={32} className="animate-spin text-gray-400" />
        </div>
      </PageTransition>
    );
  }

  if (!property || selectedStatus === 'failed') {
    return (
      <PageTransition>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Property not found</h2>
          <Button onClick={() => navigate('/explore-properties')}>Back to Explore</Button>
        </div>
      </PageTransition>
    );
  }

  const matchColor = property.matchPercentage >= 75 ? 'text-green-600' :
    property.matchPercentage >= 60 ? 'text-yellow-600' : 'text-red-500';
  const matchBg = property.matchPercentage >= 75 ? 'bg-green-50 border-green-200' :
    property.matchPercentage >= 60 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';

  const breakdown = property.matchBreakdown
    ? Object.entries(property.matchBreakdown).map(([key, score]) => ({
        key,
        label: BREAKDOWN_LABELS[key] || key,
        score,
      }))
    : [];

  const coverImage = property.images?.[0]
    || 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80';
  const availableDate = formatDate(property.availableFrom);

  const featureFlags = [
    { show: property.furnished, label: 'Furnished', icon: <Layers size={14} /> },
    { show: property.utilitiesIncluded, label: 'Utilities included', icon: <Zap size={14} /> },
    { show: property.internetIncluded, label: 'Internet included', icon: <Wifi size={14} /> },
    { show: property.petsAllowed, label: 'Pets allowed', icon: <PawPrint size={14} /> },
    { show: property.smokingAllowed, label: 'Smoking allowed', icon: <Star size={14} /> },
  ].filter((f) => f.show);

  return (
    <PageTransition>
      <div>
        <div className="py-4 flex items-center">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-72 md:h-96 w-full">
                <img src={coverImage} alt={property.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4">
                  <span className="bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium capitalize">
                    {property.propertyType}
                  </span>
                </div>
              </div>
              {property.images?.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {property.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`${property.title} ${idx + 1}`} className="w-20 h-16 object-cover rounded-lg flex-shrink-0" />
                  ))}
                </div>
              )}
            </div>

            {/* Title & Location */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-black mb-2">{property.title}</h2>
              {property.city && (
                <p className="text-gray-500 flex items-center gap-1 mb-4">
                  <MapPin size={16} />
                  {property.address ? `${property.address}, ` : ''}{property.city}
                </p>
              )}
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-black">
                  EGP {Number(property.price)?.toLocaleString()}
                </span>
                <span className="text-gray-500">/ {property.paymentPeriod}</span>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-black mb-3">About this property</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            )}

            {/* Key Facts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-black mb-4">Property Details</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {property.rooms > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                      <BedDouble size={14} /> Bedrooms
                    </div>
                    <div className="text-lg font-bold text-black">{property.rooms}</div>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                      <Bath size={14} /> Bathrooms
                    </div>
                    <div className="text-lg font-bold text-black">{property.bathrooms}</div>
                  </div>
                )}
                {property.floor && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                      <Building2 size={14} /> Floor
                    </div>
                    <div className="text-lg font-bold text-black">{property.floor}</div>
                  </div>
                )}
                {availableDate && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                      <Calendar size={14} /> Available
                    </div>
                    <div className="text-lg font-bold text-black">{availableDate}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            {featureFlags.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-black mb-3">Features</h3>
                <div className="flex flex-wrap gap-3">
                  {featureFlags.map((f) => (
                    <span key={f.label} className="flex items-center gap-2 bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-full text-sm font-medium">
                      {f.icon} {f.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-black mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-3">
                  {property.amenities.map((amenity) => (
                    <span key={amenity} className="flex items-center gap-1.5 text-sm text-gray-700">
                      <Check size={14} className="text-green-500" /> {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Compatibility Breakdown */}
            {breakdown.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-black mb-4">Compatibility Breakdown</h3>
                <div className="space-y-4">
                  {breakdown.map((factor) => (
                    <div key={factor.key}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{factor.label}</span>
                        <span className="text-sm font-bold text-black">{Math.round(factor.score * 100)}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full transition-all duration-500" style={{ width: `${factor.score * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compatibility Insights */}
            {(property.strengths?.length > 0 || property.conflicts?.length > 0) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-black mb-4">Why This Property Matches You</h3>
                {property.strengths?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-green-700 mb-2">Great Fit</h4>
                    <ul className="space-y-1">
                      {property.strengths.map((s, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {property.conflicts?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-amber-700 mb-2">Things to Consider</h4>
                    <ul className="space-y-1">
                      {property.conflicts.map((c, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {property.discussionTopics?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-blue-700 mb-2">Ask the Owner About</h4>
                    <ul className="space-y-1">
                      {property.discussionTopics.map((topic, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-6">
              <div className={`text-center p-6 rounded-xl border ${matchBg}`}>
                <div className={`text-4xl font-bold ${matchColor}`}>{property.matchPercentage}%</div>
                <div className="text-sm text-gray-600 mt-1">Compatibility Score</div>
              </div>

              {/* Owner Info */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <img
                  src={property.owner.avatar}
                  alt={property.owner.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold text-black">{property.owner.name}</div>
                  <div className="text-xs text-gray-500">Property Owner</div>
                </div>
              </div>

              <div className="space-y-3">
                <Button variant="primary" fullWidth onClick={handleMessage} className="flex items-center justify-center gap-2">
                  <MessageCircle size={18} />
                  Message Owner
                </Button>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price</span>
                  <span className="font-medium text-black">EGP {Number(property.price)?.toLocaleString()}/{property.paymentPeriod}</span>
                </div>
                {property.city && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Location</span>
                    <span className="font-medium text-black">{property.city}</span>
                  </div>
                )}
                {property.rooms > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Bedrooms</span>
                    <span className="font-medium text-black">{property.rooms}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium text-black capitalize">{property.propertyType}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default MatchedPropertyDetail;
