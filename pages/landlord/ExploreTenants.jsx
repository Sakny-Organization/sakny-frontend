import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { fetchTenantMatches, setActiveProperty } from '../../slices/landlordMatchSlice';
import { fetchMyProperties } from '../../slices/propertySlice';
import { Loader, Users, Building2, MapPin, Briefcase } from 'lucide-react';

const ExploreTenants = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tenantMatches, activePropertyId, status } = useSelector((state) => state.landlordMatch);
  const { myListings, myListingsLoading } = useSelector((state) => state.properties);
  const [selectedPropertyId, setSelectedPropertyId] = useState(activePropertyId || '');

  useEffect(() => {
    if (!myListings.length && !myListingsLoading) {
      dispatch(fetchMyProperties());
    }
  }, [dispatch, myListings.length, myListingsLoading]);

  useEffect(() => {
    if (myListings?.length && !selectedPropertyId) {
      const first = myListings[0];
      setSelectedPropertyId(String(first.id));
      dispatch(setActiveProperty(first.id));
      dispatch(fetchTenantMatches(first.id));
    }
  }, [myListings, selectedPropertyId, dispatch]);

  const handlePropertyChange = (e) => {
    const propId = e.target.value;
    setSelectedPropertyId(propId);
    dispatch(setActiveProperty(Number(propId)));
    dispatch(fetchTenantMatches(Number(propId)));
  };

  const handleCardClick = (tenantId) => {
    navigate(`/landlord/properties/${selectedPropertyId}/tenants/${tenantId}`);
  };

  return (
    <DashboardLayout
      title="Find Tenants"
      subtitle="Browse potential tenants matched to your property preferences"
    >
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Building2 size={14} className="inline mr-1" />
          Select a property to match against
        </label>
        <select
          value={selectedPropertyId}
          onChange={handlePropertyChange}
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black"
        >
          {myListingsLoading && <option>Loading properties...</option>}
          {myListings?.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </div>

      {status === 'loading' && (
        <div className="flex items-center justify-center py-20">
          <Loader size={32} className="animate-spin text-gray-400" />
        </div>
      )}

      {status === 'succeeded' && tenantMatches.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No matches yet</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            No tenants currently match this property's preferences. As new tenants register, they'll appear here with compatibility scores.
          </p>
        </motion.div>
      )}

      {status === 'succeeded' && tenantMatches.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {tenantMatches.map((tenant) => (
            <motion.div
              key={tenant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-xl shadow-sm hover:shadow-hover border border-gray-100 overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full"
              onClick={() => handleCardClick(tenant.id)}
            >
              <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                <img src={tenant.image} alt={tenant.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                <div className="absolute top-3 right-3">
                  <div className={`${tenant.matchPercentage >= 90 ? 'bg-green-500' : tenant.matchPercentage >= 70 ? 'bg-blue-500' : 'bg-yellow-500'} text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm`}>
                    {tenant.matchPercentage}% Match
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="text-xl font-extrabold leading-tight text-white drop-shadow-md">{tenant.name}</h3>
                    {tenant.age && <span className="text-white font-bold text-sm ml-1 opacity-100 drop-shadow-sm">• {tenant.age} years</span>}
                  </div>
                  <p className="text-white/80 text-xs flex items-center gap-1">
                    <MapPin size={12} /> {tenant.location}
                  </p>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                {tenant.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tenant.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="bg-gray-50 text-gray-600 border border-gray-200 px-2.5 py-1 rounded-full text-[11px] font-medium">{tag}</span>
                    ))}
                  </div>
                )}
                {tenant.occupation && (
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <Briefcase size={16} className="mr-2 text-gray-400" />
                    {tenant.occupation}
                  </div>
                )}
                <p className="text-sm text-gray-600 mb-6 line-clamp-2 leading-relaxed flex-1">
                  {tenant.bio || 'Looking for a compatible living space.'}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Budget</span>
                    <div className="text-lg font-bold text-black">{tenant.budget}</div>
                  </div>
                  <button className="px-5 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                    View profile
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {status === 'failed' && (
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load tenant matches. Please try again.</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ExploreTenants;
