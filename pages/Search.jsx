import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters, resetFilters } from '../slices/roommateSlice';
import { motion } from 'framer-motion';
import RoommateCard from '../components/cards/RoommateCard';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Filter, X, List } from 'lucide-react';
import { containerVariants, itemVariants } from '../utils/animations';

const Search = () => {
    const dispatch = useDispatch();
    const { list, filters } = useSelector((state) => state.roommates);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('match');
    
    const filteredList = list.filter(item => {
        const matchesGender = filters.gender === 'All' || item.gender === filters.gender;
        const matchesBudget = item.budget >= filters.minBudget && item.budget <= filters.maxBudget;
        const matchesLocation = filters.location === '' || item.location.toLowerCase().includes(filters.location.toLowerCase());
        const matchesLifestyle = filters.lifestyle.length === 0 ||
            filters.lifestyle.every(trait => item.tags.includes(trait));
        return matchesGender && matchesBudget && matchesLocation && matchesLifestyle;
    }).sort((a, b) => {
        if (sortBy === 'price-low') return a.budget - b.budget;
        if (sortBy === 'price-high') return b.budget - a.budget;
        if (sortBy === 'match') return b.matchPercentage - a.matchPercentage;
        return 0;
    });
    
    const handleGenderChange = (e) => {
        dispatch(setFilters({ gender: e.target.value }));
    };
    
    const handleBudgetChange = (e) => {
        dispatch(setFilters({ maxBudget: Number(e.target.value) }));
    };
    
    const handleLifestyleToggle = (trait) => {
        const newLifestyle = filters.lifestyle.includes(trait)
            ? filters.lifestyle.filter(t => t !== trait)
            : [...filters.lifestyle, trait];
        dispatch(setFilters({ lifestyle: newLifestyle }));
    };
    
    const activeFilters = [];
    if (filters.location) {
        activeFilters.push({ label: `Location: ${filters.location}`, key: 'location' });
    }
    if (filters.maxBudget < 9000 || filters.minBudget > 0) {
        activeFilters.push({
            label: `Budget: ${filters.minBudget.toLocaleString()} - ${filters.maxBudget.toLocaleString()} EGP`,
            key: 'budget'
        });
    }
    if (filters.gender !== 'All') {
        activeFilters.push({ label: `Gender: ${filters.gender} only`, key: 'gender' });
    }
    filters.lifestyle.forEach(trait => {
        activeFilters.push({ label: trait, key: `lifestyle-${trait}`, type: 'lifestyle', trait });
    });
    
    const removeFilter = (filter) => {
        if (filter.key === 'location') {
            dispatch(setFilters({ location: '' }));
        } else if (filter.key === 'budget') {
            dispatch(setFilters({ minBudget: 0, maxBudget: 9000 }));
        } else if (filter.key === 'gender') {
            dispatch(setFilters({ gender: 'All' }));
        } else if (filter.type === 'lifestyle') {
            dispatch(setFilters({
                lifestyle: filters.lifestyle.filter(t => t !== filter.trait)
            }));
        }
    };
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="app-container"
        >
            {/* Header with Filter Pills */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-black mb-6">
                    Search roommates and rooms
                </h1>

                {/* Active Filter Pills */}
                <div className="flex flex-wrap items-center gap-3">
                    {activeFilters.map((filter) => (
                        <div key={filter.key} className="filter-pill">
                            <span>{filter.label}</span>
                            <button 
                                onClick={() => removeFilter(filter)} 
                                className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                            >
                                <X size={14}/>
                            </button>
                        </div>
                    ))}

                    {activeFilters.length === 0 && (
                        <p className="text-gray-500 text-sm">No filters applied</p>
                    )}

                    {/* List View Toggle */}
                    <button className="ml-auto flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors">
                        <List size={16}/>
                        List
                    </button>
                </div>
            </div>

            <motion.div 
                className="grid grid-cols-1 lg:grid-cols-4 gap-8"
                variants={containerVariants}
                initial="initial"
                animate="animate"
            >
                {/* Filters Sidebar */}
                <motion.div className="lg:col-span-1" variants={itemVariants}>
                    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-black flex items-center gap-2">
                                <Filter size={18}/> Filters
                            </h3>
                            <button 
                                onClick={() => dispatch(resetFilters())} 
                                className="text-xs text-gray-600 font-medium hover:text-black transition-colors"
                            >
                                Reset all
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">Location</label>
                                <Input 
                                    placeholder="Cairo, Giza..." 
                                    value={filters.location} 
                                    onChange={(e) => dispatch(setFilters({ location: e.target.value }))}
                                />
                                <p className="text-xs text-gray-500 mt-1">Enter city or neighborhood</p>
                            </div>

                            {/* Budget */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-black">Budget (EGP/month)</label>
                                    <span className="text-sm text-gray-600">{filters.maxBudget.toLocaleString()}</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="500" 
                                    max="9000" 
                                    step="500" 
                                    value={filters.maxBudget} 
                                    onChange={handleBudgetChange} 
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                                />
                                <div className="flex justify-between mt-1 text-xs text-gray-400">
                                    <span>500</span>
                                    <span>9,000+</span>
                                </div>
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">Gender preference</label>
                                <select 
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2.5 border px-3" 
                                    value={filters.gender} 
                                    onChange={handleGenderChange}
                                >
                                    <option value="All">Any</option>
                                    <option value="Male">Male only</option>
                                    <option value="Female">Female only</option>
                                </select>
                            </div>

                            {/* Lifestyle */}
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">Lifestyle</label>
                                <div className="space-y-2">
                                    {[
                                        { label: 'Non-smoker', trait: 'Non-smoker' },
                                        { label: 'Quiet', trait: 'Quiet' },
                                        { label: 'Pet-friendly', trait: 'Pet friendly' },
                                        { label: 'Clean', trait: 'Clean' },
                                        { label: 'Night owl', trait: 'Night owl' }
                                    ].map((item) => (
                                        <label key={item.trait} className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-gray-300 text-black focus:ring-black" 
                                                checked={filters.lifestyle.includes(item.trait)} 
                                                onChange={() => handleLifestyleToggle(item.trait)}
                                            />
                                            <span className="text-gray-700">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Results Grid */}
                <motion.div className="lg:col-span-3" variants={itemVariants}>
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <p className="text-gray-600">
                            Showing <strong>{filteredList.length}</strong> {filteredList.length === 1 ? 'result' : 'results'} for your preference
                        </p>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-500 whitespace-nowrap">Sort by:</label>
                            <select 
                                className="text-sm border-gray-300 rounded-lg focus:ring-black focus:border-black py-1.5 px-3 border bg-white" 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="match">Best Match</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {filteredList.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredList.map((roommate) => (
                                <RoommateCard key={roommate.id} roommate={roommate}/>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                                <X size={48}/>
                            </div>
                            <h3 className="text-lg font-semibold text-black mb-2">No matches found</h3>
                            <p className="text-gray-600 mb-6">Try adjusting your filters to see more results.</p>
                            <Button variant="outline" onClick={() => dispatch(resetFilters())}>
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Search;
