import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMatches, setSortBy } from '../slices/matchSlice';
import { fetchSavedProfiles } from '../slices/savedSlice';
import { motion } from 'framer-motion';
import RoommateCard from '../components/cards/RoommateCard';
import { Loader } from 'lucide-react';
import { containerVariants, itemVariants } from '../utils/animations';

const Search = () => {
    const dispatch = useDispatch();
    const { items, sortBy, status } = useSelector((state) => state.matches);

    useEffect(() => {
        dispatch(fetchSavedProfiles());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchMatches());
    }, [dispatch]);

    const sortedItems = [...items].sort((a, b) => {
        if (sortBy === 'price-low') return (a.budgetMin || 0) - (b.budgetMin || 0);
        if (sortBy === 'price-high') return (b.budgetMax || 0) - (a.budgetMax || 0);
        return b.matchPercentage - a.matchPercentage;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="app-container"
        >
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
                    Find Your Ideal Roommate
                </h1>
                <p className="text-gray-500 text-sm">
                    Ranked by compatibility based on your profile preferences
                </p>
            </div>

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
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                >
                    {sortedItems.map((roommate) => (
                        <motion.div key={roommate.id} variants={itemVariants}>
                            <RoommateCard roommate={roommate} />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-black mb-2">No roommates found</h3>
                    <p className="text-gray-600">
                        No compatible roommates available yet. Check back later!
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default Search;
