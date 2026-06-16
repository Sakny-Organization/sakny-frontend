import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMatches, updateFilters, resetFilters, setSortBy } from '../slices/matchSlice';
import { motion } from 'framer-motion';
import RoommateCard from '../components/cards/RoommateCard';
import Button from '../components/common/Button';
import { Filter, X, List, Loader } from 'lucide-react';
import { containerVariants, itemVariants } from '../utils/animations';
import { getSearchFilterOptions } from '../services/searchService';

const filterOptions = getSearchFilterOptions();

const SMOKING_LABELS = { NON_SMOKER: 'Non-smoker', SOMETIMES: 'Sometimes', SMOKE_OFTEN: 'Smoker' };
const PETS_LABELS = { NO_PETS: 'No pets', HAVE_PETS: 'Has pets' };
const SLEEP_LABELS = { EARLY_BIRD: 'Early bird', NIGHT_OWL: 'Night owl', FLEXIBLE: 'Flexible' };
const TYPE_LABELS = { STUDENT: 'Student', WORKING_PROFESSIONAL: 'Professional', DONT_MIND: "Don't mind" };

const Search = () => {
    const dispatch = useDispatch();
    const { items, filters, sortBy, status, empty } = useSelector((state) => state.matches);
    const [localBudgetMax, setLocalBudgetMax] = useState(filters.budgetRange?.max || 9000);

    useEffect(() => {
        dispatch(fetchMatches(filters));
    }, [dispatch, filters]);

    const sortedItems = [...items].sort((a, b) => {
        if (sortBy === 'price-low') return (a.budgetMin || 0) - (b.budgetMin || 0);
        if (sortBy === 'price-high') return (b.budgetMax || 0) - (a.budgetMax || 0);
        return b.matchPercentage - a.matchPercentage;
    });

    const handleBudgetCommit = () => {
        dispatch(updateFilters({ budgetRange: { max: localBudgetMax } }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="app-container"
        >
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-black mb-6">
                    Find Your Ideal Roommate
                </h1>
                <p className="text-gray-500 text-sm">
                    {status === 'succeeded' && `${items.length} roommate${items.length !== 1 ? 's' : ''} found`}
                </p>
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
                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">Gender</label>
                                <select
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2.5 border px-3"
                                    value={filters.gender}
                                    onChange={(e) => dispatch(updateFilters({ gender: e.target.value }))}
                                >
                                    <option value="All">Any</option>
                                    <option value="MALE">Male only</option>
                                    <option value="FEMALE">Female only</option>
                                </select>
                            </div>

                            {/* Budget */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-black">Max Budget (EGP)</label>
                                    <span className="text-sm text-gray-600">{localBudgetMax.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="500"
                                    max="20000"
                                    step="500"
                                    value={localBudgetMax}
                                    onChange={(e) => setLocalBudgetMax(Number(e.target.value))}
                                    onMouseUp={handleBudgetCommit}
                                    onTouchEnd={handleBudgetCommit}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                                />
                                <div className="flex justify-between mt-1 text-xs text-gray-400">
                                    <span>500</span>
                                    <span>20,000+</span>
                                </div>
                            </div>

                            {/* Smoking */}
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">Smoking</label>
                                <select
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2.5 border px-3"
                                    value={filters.smoking}
                                    onChange={(e) => dispatch(updateFilters({ smoking: e.target.value }))}
                                >
                                    {filterOptions.smoking.map(v => (
                                        <option key={v} value={v}>{v === 'Any' ? 'Any' : SMOKING_LABELS[v] || v}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Pets */}
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">Pets</label>
                                <select
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2.5 border px-3"
                                    value={filters.pets}
                                    onChange={(e) => dispatch(updateFilters({ pets: e.target.value }))}
                                >
                                    {filterOptions.pets.map(v => (
                                        <option key={v} value={v}>{v === 'Any' ? 'Any' : PETS_LABELS[v] || v}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sleep Schedule */}
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">Sleep Schedule</label>
                                <select
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2.5 border px-3"
                                    value={filters.sleepSchedule}
                                    onChange={(e) => dispatch(updateFilters({ sleepSchedule: e.target.value }))}
                                >
                                    {filterOptions.sleepSchedule.map(v => (
                                        <option key={v} value={v}>{v === 'Any' ? 'Any' : SLEEP_LABELS[v] || v}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Roommate Type */}
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">Roommate Type</label>
                                <select
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2.5 border px-3"
                                    value={filters.roommateType}
                                    onChange={(e) => dispatch(updateFilters({ roommateType: e.target.value }))}
                                >
                                    {filterOptions.roommateType.map(v => (
                                        <option key={v} value={v}>{v === 'Any' ? 'Any' : TYPE_LABELS[v] || v}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Results Grid */}
                <motion.div className="lg:col-span-3" variants={itemVariants}>
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <p className="text-gray-600">
                            {status === 'loading' ? 'Searching...' : (
                                <>Showing <strong>{sortedItems.length}</strong> {sortedItems.length === 1 ? 'match' : 'matches'}</>
                            )}
                        </p>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-500 whitespace-nowrap">Sort by:</label>
                            <select
                                className="text-sm border-gray-300 rounded-lg focus:ring-black focus:border-black py-1.5 px-3 border bg-white"
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
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {sortedItems.map((roommate) => (
                                <RoommateCard key={roommate.id} roommate={roommate}/>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                            <h3 className="text-lg font-semibold text-black mb-2">
                                {empty ? 'No roommates found' : 'Start searching'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {empty ? 'Try adjusting your filters to see more results.' : 'Adjust filters to find compatible roommates.'}
                            </p>
                            {empty && (
                                <Button variant="outline" onClick={() => dispatch(resetFilters())}>
                                    Clear all filters
                                </Button>
                            )}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Search;
