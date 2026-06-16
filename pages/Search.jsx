import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMatches, updateFilters, resetFilters, setSortBy } from '../slices/matchSlice';
import { fetchSavedProfiles } from '../slices/savedSlice';
import { motion, AnimatePresence } from 'framer-motion';
import RoommateCard from '../components/cards/RoommateCard';
import Button from '../components/common/Button';
import { Filter, X, List, Loader, Sparkles } from 'lucide-react';
import { containerVariants, itemVariants } from '../utils/animations';
import { getSearchFilterOptions } from '../services/searchService';
import { getMyProfile } from '../services/profileApi';

const filterOptions = getSearchFilterOptions();

const SMOKING_LABELS = { NON_SMOKER: 'Non-smoker', SOMETIMES: 'Sometimes', SMOKE_OFTEN: 'Smoker' };
const PETS_LABELS = { NO_PETS: 'No pets', HAVE_PETS: 'Has pets' };
const SLEEP_LABELS = { EARLY_BIRD: 'Early bird', NIGHT_OWL: 'Night owl', FLEXIBLE: 'Flexible' };
const TYPE_LABELS = { STUDENT: 'Student', WORKING_PROFESSIONAL: 'Professional', DONT_MIND: "Don't mind" };

const Search = () => {
    const dispatch = useDispatch();
    const { items, filters, sortBy, status, empty } = useSelector((state) => state.matches);
    const { token } = useSelector((state) => state.auth);
    const [localBudgetMax, setLocalBudgetMax] = useState(filters.budgetRange?.max || 9000);
    const [useMyPreferences, setUseMyPreferences] = useState(true);
    const [myPreferences, setMyPreferences] = useState(null);
    const [loadingPreferences, setLoadingPreferences] = useState(true);

    useEffect(() => {
        dispatch(fetchSavedProfiles());
    }, [dispatch]);

    // Load user preferences on mount
    useEffect(() => {
        const loadUserPreferences = async () => {
            try {
                const response = await getMyProfile(token);
                if (response.success && response.data) {
                    const profile = response.data;
                    const smokingMap = { NON_SMOKER_ONLY: 'NON_SMOKER', DONT_MIND: 'Any' };
                    const petsMap = { NO_PETS_PREFERRED: 'NO_PETS', OKAY_WITH_PETS: 'Any' };
                    const sleepMap = { EARLY_BIRD: 'EARLY_BIRD', NIGHT_OWL: 'NIGHT_OWL', DONT_MIND: 'Any' };
                    setMyPreferences({
                        gender: profile.roommateGender || 'All',
                        budgetRange: {
                            min: profile.budgetMin || 500,
                            max: profile.budgetMax || 9000
                        },
                        smoking: smokingMap[profile.prefSmoking] || 'Any',
                        pets: petsMap[profile.prefPets] || 'Any',
                        sleepSchedule: sleepMap[profile.prefSleepSchedule] || 'Any',
                        roommateType: profile.roommateType || 'Any'
                    });
                }
            } catch (err) {
                console.error('Failed to load preferences:', err);
            } finally {
                setLoadingPreferences(false);
            }
        };

        loadUserPreferences();
    }, [token]);

    // Apply preferences when loaded or when toggle changes
    useEffect(() => {
        if (!loadingPreferences && myPreferences && useMyPreferences) {
            dispatch(updateFilters(myPreferences));
            setLocalBudgetMax(myPreferences.budgetRange.max);
        }
    }, [myPreferences, useMyPreferences, loadingPreferences, dispatch]);

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
                                onClick={() => {
                                    setUseMyPreferences(true);
                                    if (myPreferences) {
                                        dispatch(updateFilters(myPreferences));
                                        setLocalBudgetMax(myPreferences.budgetRange.max);
                                    }
                                }}
                                className="text-xs text-gray-600 font-medium hover:text-black transition-colors"
                            >
                                Reset
                            </button>
                        </div>

                        {/* Toggle: My Preferences vs Custom */}
                        {!loadingPreferences && myPreferences && (
                            <div className="mb-6">
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <div className="flex items-center cursor-pointer" onClick={() => {
                                        const newValue = !useMyPreferences;
                                        setUseMyPreferences(newValue);
                                        if (newValue && myPreferences) {
                                            dispatch(updateFilters(myPreferences));
                                            setLocalBudgetMax(myPreferences.budgetRange.max);
                                        }
                                    }}>
                                        <div className={`relative w-11 h-6 rounded-full transition-colors ${useMyPreferences ? 'bg-black' : 'bg-gray-300'}`}>
                                            <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${useMyPreferences ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <div className="flex items-center gap-1.5">
                                                <Sparkles size={14} className={useMyPreferences ? 'text-black' : 'text-gray-400'} />
                                                <span className="text-sm font-medium text-gray-900">
                                                    Use my preferences
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {useMyPreferences ? 'Showing matches based on your profile' : 'Using custom filters'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">Gender</label>
                                <select
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2.5 border px-3 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    value={filters.gender}
                                    onChange={(e) => {
                                        setUseMyPreferences(false);
                                        dispatch(updateFilters({ gender: e.target.value }));
                                    }}
                                    disabled={loadingPreferences || useMyPreferences}
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
                                    onChange={(e) => {
                                        setUseMyPreferences(false);
                                        setLocalBudgetMax(Number(e.target.value));
                                    }}
                                    onMouseUp={handleBudgetCommit}
                                    onTouchEnd={handleBudgetCommit}
                                    disabled={loadingPreferences || useMyPreferences}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2.5 border px-3 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    value={filters.smoking}
                                    onChange={(e) => {
                                        setUseMyPreferences(false);
                                        dispatch(updateFilters({ smoking: e.target.value }));
                                    }}
                                    disabled={loadingPreferences || useMyPreferences}
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
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2.5 border px-3 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    value={filters.pets}
                                    onChange={(e) => {
                                        setUseMyPreferences(false);
                                        dispatch(updateFilters({ pets: e.target.value }));
                                    }}
                                    disabled={loadingPreferences || useMyPreferences}
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
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2.5 border px-3 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    value={filters.sleepSchedule}
                                    onChange={(e) => {
                                        setUseMyPreferences(false);
                                        dispatch(updateFilters({ sleepSchedule: e.target.value }));
                                    }}
                                    disabled={loadingPreferences || useMyPreferences}
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
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2.5 border px-3 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    value={filters.roommateType}
                                    onChange={(e) => {
                                        setUseMyPreferences(false);
                                        dispatch(updateFilters({ roommateType: e.target.value }));
                                    }}
                                    disabled={loadingPreferences || useMyPreferences}
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
