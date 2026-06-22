import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchTenantCompatibility, clearSelectedTenant } from '../../slices/landlordMatchSlice';
import Button from '../../components/common/Button';
import VerifiedBadge from '../../components/common/VerifiedBadge';
import { Loader, ArrowLeft, MessageCircle, MapPin, Briefcase, Building2 } from 'lucide-react';

const TenantProfile = () => {
  const { propertyId, userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedTenant: tenant, selectedStatus } = useSelector((state) => state.landlordMatch);

  useEffect(() => {
    if (propertyId && userId) {
      dispatch(fetchTenantCompatibility({ propertyId: Number(propertyId), userId: Number(userId) }));
    }
    return () => { dispatch(clearSelectedTenant()); };
  }, [dispatch, propertyId, userId]);

  const handleMessage = () => {
    navigate('/messages', { state: { startConversation: { participant: { id: userId, name: tenant?.name, profilePhotoUrl: tenant?.image } } } });
  };

  if (selectedStatus === 'loading') {
    return (
      <div className="app-container flex items-center justify-center py-20">
        <Loader size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (!tenant || selectedStatus === 'failed') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="app-container">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
          <Button onClick={() => navigate('/landlord/tenants')}>Back to Tenants</Button>
        </div>
      </motion.div>
    );
  }

  const matchColor = tenant.matchPercentage >= 75 ? 'text-green-600' :
    tenant.matchPercentage >= 60 ? 'text-yellow-600' : 'text-red-500';
  const matchBg = tenant.matchPercentage >= 75 ? 'bg-green-50 border-green-200' :
    tenant.matchPercentage >= 60 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';

  const BREAKDOWN_LABELS = {
    gender: 'Gender Match',
    budget: 'Budget Overlap',
    smoking: 'Smoking Preference',
    location: 'Location Overlap',
    sleep: 'Sleep Schedule',
    cleanliness: 'Cleanliness Level',
    pets: 'Pet Preference',
    tenantType: 'Tenant Type',
  };

  const breakdown = tenant.matchBreakdown
    ? Object.entries(tenant.matchBreakdown).map(([key, score]) => ({
        key,
        label: BREAKDOWN_LABELS[key] || key,
        score,
      }))
    : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="app-container">
      <div className="py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>
        {tenant.propertyTitle && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Building2 size={14} />
            <span>Matching for: <strong className="text-gray-700">{tenant.propertyTitle}</strong></span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <img src={tenant.image} alt={tenant.name} className="w-20 h-20 rounded-full object-cover border-2 border-gray-100" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-black">{tenant.name}</h2>
                  {tenant.age && <span className="text-gray-500">, {tenant.age}</span>}
                  {tenant.verified && <VerifiedBadge size={20} />}
                </div>
                {tenant.occupation && (
                  <p className="text-gray-600 flex items-center gap-2">
                    <Briefcase size={16} />
                    {tenant.occupation}
                  </p>
                )}
                {tenant.location && (
                  <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                    <MapPin size={14} />
                    {tenant.location}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {tenant.bio && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-black mb-3">About</h3>
              <p className="text-gray-600 leading-relaxed">{tenant.bio}</p>
            </div>
          )}

          {/* Lifestyle Tags */}
          {tenant.tags?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-black mb-3">Lifestyle & Traits</h3>
              <div className="flex flex-wrap gap-2">
                {tenant.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Housing Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-black mb-4">Housing Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Budget</div>
                <div className="text-lg font-bold text-black">{tenant.budget}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Location</div>
                <div className="text-lg font-bold text-black">{tenant.location}</div>
              </div>
              {tenant.gender && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Gender</div>
                  <div className="text-lg font-bold text-black capitalize">{tenant.gender.toLowerCase()}</div>
                </div>
              )}
            </div>
          </div>

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
          {(tenant.strengths?.length > 0 || tenant.conflicts?.length > 0) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-black mb-4">Compatibility Insights</h3>
              {tenant.strengths?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-green-700 mb-2">Strengths</h4>
                  <ul className="space-y-1">
                    {tenant.strengths.map((s, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tenant.conflicts?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-amber-700 mb-2">Potential Conflicts</h4>
                  <ul className="space-y-1">
                    {tenant.conflicts.map((c, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tenant.discussionTopics?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-blue-700 mb-2">Things to Discuss</h4>
                  <ul className="space-y-1">
                    {tenant.discussionTopics.map((topic, i) => (
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
              <div className={`text-4xl font-bold ${matchColor}`}>{tenant.matchPercentage}%</div>
              <div className="text-sm text-gray-600 mt-1">Compatibility Score</div>
            </div>

            <div className="space-y-3">
              <Button variant="primary" fullWidth onClick={handleMessage} className="flex items-center justify-center gap-2">
                <MessageCircle size={18} />
                Send Message
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-3">
              {tenant.budget && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Budget</span>
                  <span className="font-medium text-black">{tenant.budget}</span>
                </div>
              )}
              {tenant.location && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium text-black">{tenant.location}</span>
                </div>
              )}
              {tenant.gender && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Gender</span>
                  <span className="font-medium text-black capitalize">{tenant.gender.toLowerCase()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TenantProfile;
