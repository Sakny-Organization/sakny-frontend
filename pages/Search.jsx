import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMatches, setSortBy } from '../slices/matchSlice';
import { fetchSavedProfiles } from '../slices/savedSlice';
import { motion } from 'framer-motion';
import RoommateCard from '../components/cards/RoommateCard';
import { Loader, Filter, RotateCcw } from 'lucide-react';
import { containerVariants, itemVariants } from '../utils/animations';

const Search = () => {
    const dispatch = useDispatch();
    const { items, sortBy, status } = useSelector((state) => state.matches);

    const [filters, setFilters] = useState({
        city: '',
        budgetMin: '',
        budgetMax: '',
        gender: 'Any',
        lifestyle: [],
        smoking: 'Any',
        pets: 'Any',
        cleanliness: 'Any'
    });

    useEffect(() => {
        dispatch(fetchSavedProfiles());
        dispatch(fetchMatches());
    }, [dispatch]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleToggleLifestyle = (tag) => {
        setFilters(prev => ({
            ...prev,
            lifestyle: prev.lifestyle.includes(tag)
                ? prev.lifestyle.filter(t => t !== tag)
                : [...prev.lifestyle, tag]
        }));
    };

    const resetFilters = () => {
        setFilters({
            city: '',
            budgetMin: '',
            budgetMax: '',
            gender: 'Any',
            lifestyle: [],
            smoking: 'Any',
            pets: 'Any',
            cleanliness: 'Any'
        });
    };

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            // City
            if (filters.city && !item.location?.toLowerCase().includes(filters.city.toLowerCase())) return false;
            
            // Budget
            const bMin = Number(filters.budgetMin) || 0;
            const bMax = Number(filters.budgetMax) || Infinity;
            const itemMin = item.budgetMin || 0;
            const itemMax = item.budgetMax || Infinity;
            if (filters.budgetMin && itemMax < bMin) return false;
            if (filters.budgetMax && itemMin > bMax) return false;

            // Gender
            if (filters.gender !== 'Any' && item.gender !== filters.gender) return false;

            // Lifestyle tags
            if (filters.lifestyle.length > 0) {
                const hasAllTags = filters.lifestyle.every(tag => item.tags?.includes(tag));
                if (!hasAllTags) return false;
            }

            // Smoking
            if (filters.smoking !== 'Any') {
                if (!item.tags?.includes(filters.smoking)) return false;
            }

            // Pets
            if (filters.pets !== 'Any') {
                if (!item.tags?.includes(filters.pets)) return false;
            }

            // Cleanliness
            if (filters.cleanliness !== 'Any' && item._raw?.cleanlinessLevel) {
                const level = item._raw.cleanlinessLevel;
                if (filters.cleanliness === 'High' && level < 4) return false;
                if (filters.cleanliness === 'Medium' && (level < 2 || level > 3)) return false;
                if (filters.cleanliness === 'Low' && level > 2) return false;
            }

            return true;
        });
    }, [items, filters]);

    const sortedItems = [...filteredItems].sort((a, b) => {
        if (sortBy === 'price-low') return (a.budgetMin || 0) - (b.budgetMin || 0);
        if (sortBy === 'price-high') return (b.budgetMax || 0) - (a.budgetMax || 0);
        return b.matchPercentage - a.matchPercentage;
    });

    const activeFiltersCount = Object.values(filters).reduce((acc, val) => {
        if (Array.isArray(val)) return acc + (val.length > 0 ? 1 : 0);
        if (val === 'Any' || val === '') return acc;
        return acc + 1;
    }, 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="app-container max-w-[1400px] mx-auto py-8 px-4"
        >
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
                        Find your next roommate
                    </h1>
                    <p className="text-gray-500 text-sm">
                        API-ready search state, realistic loading patterns, and compatibility-rich results.
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full lg:w-[300px] flex-shrink-0">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-2 font-bold text-lg">
                                <Filter size={20} />
                                Filters
                            </div>
                            {activeFiltersCount > 0 && (
                                <button 
                                    onClick={resetFilters}
                                    className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-black transition-colors px-2.5 py-1.5 bg-gray-50 rounded-lg"
                                >
                                    <RotateCcw size={14} />
                                    Reset
                                </button>
                            )}
                        </div>

                        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 custom-scrollbar">
                            {/* City */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">City</label>
                                <input 
                                    type="text"
                                    placeholder="Cairo, Giza, Alexandria"
                                    value={filters.city}
                                    onChange={(e) => handleFilterChange('city', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                                />
                            </div>

                            {/* Budget */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Budget range</label>
                                <div className="flex flex-col gap-2">
                                    <input 
                                        type="number"
                                        placeholder="Min EGP"
                                        value={filters.budgetMin}
                                        onChange={(e) => handleFilterChange('budgetMin', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                                    />
                                    <input 
                                        type="number"
                                        placeholder="Max EGP"
                                        value={filters.budgetMax}
                                        onChange={(e) => handleFilterChange('budgetMax', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Gender</label>
                                <select 
                                    value={filters.gender}
                                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all appearance-none"
                                >
                                    <option value="Any">Any</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            {/* Lifestyle */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Lifestyle</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Quiet', 'Clean', 'Night owl', 'Early bird', 'Vegan', 'Gamer'].map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => handleToggleLifestyle(tag)}
                                            className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                                                filters.lifestyle.includes(tag) 
                                                    ? 'bg-black text-white border-black' 
                                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Smoking */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Smoking</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Any', 'Non-smoker', 'Occasional smoker', 'Smoker'].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => handleFilterChange('smoking', opt)}
                                            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all flex-1 text-center min-w-[80px] ${
                                                filters.smoking === opt 
                                                    ? 'bg-black text-white' 
                                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Pets */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Pets</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Any', 'Has pets', 'No pets'].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => handleFilterChange('pets', opt)}
                                            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all flex-1 text-center min-w-[80px] ${
                                                filters.pets === opt 
                                                    ? 'bg-black text-white' 
                                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cleanliness */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Cleanliness</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Any', 'High', 'Medium', 'Low'].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => handleFilterChange('cleanliness', opt)}
                                            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all flex-1 text-center min-w-[80px] ${
                                                filters.cleanliness === opt 
                                                    ? 'bg-black text-white' 
                                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Results Area */}
                <div className="flex-1 min-w-0">
                    {/* Top Bar */}
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-black">{sortedItems.length} results</span>
                            <span className="text-xs text-gray-500">Filtered for your current preferences</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-500 whitespace-nowrap">Sort by:</label>
                            <select
                                className="text-sm border-gray-200 rounded-lg focus:ring-black focus:border-black py-2 px-3 border bg-white outline-none font-medium"
                                value={sortBy}
                                onChange={(e) => dispatch(setSortBy(e.target.value))}
                            >
                                <option value="match">Best Match</option>
                                <option value="price-low">Budget: Low to High</option>
                                <option value="price-high">Budget: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {status === 'loading' ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader size={32} className="animate-spin text-gray-400" />
                        </div>
                    ) : sortedItems.length > 0 ? (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                            variants={containerVariants}
                            initial="initial"
                            animate="animate"
                        >
                            {sortedItems.map((roommate) => (
                                <motion.div key={roommate.id} variants={itemVariants} className="h-full">
                                    <RoommateCard roommate={roommate} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Filter size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-black mb-2">No exact matches found</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-6">
                                Try adjusting your filters or expanding your search criteria to see more potential roommates.
                            </p>
                            <button 
                                onClick={resetFilters}
                                className="px-6 py-2.5 bg-black text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Search;
