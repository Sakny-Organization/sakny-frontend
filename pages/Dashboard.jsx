import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import RoommateCard from '../components/cards/RoommateCard';
import ProfileCompletionCard from '../components/cards/ProfileCompletionCard';
import PropertyCard from '../components/property/PropertyCard';
import Button from '../components/common/Button';
import PageTransition from '../components/common/PageTransition';
import { Link } from 'react-router-dom';
import { Search, BookmarkIcon, Building2, Loader } from 'lucide-react';
import { containerVariants, itemVariants } from '../utils/animations';
import { fetchRecommendations } from '../slices/matchSlice';
import { fetchProperties } from '../slices/propertySlice';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { recommendations, recommendationsStatus } = useSelector((state) => state.matches);
    const { list: properties, loading: propertiesLoading } = useSelector((state) => state.properties);

    useEffect(() => {
        dispatch(fetchRecommendations(4));
        dispatch(fetchProperties({ page: 0 }));
    }, [dispatch]);

    if (!user) return null;

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <PageTransition>
            <div>
                {/* Header */}
                <motion.div className="mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
                        {greeting}, {user.name?.split(' ')[0] || 'there'}
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Welcome back to your dashboard
                    </p>
                </motion.div>

                {/* Dashboard Grid */}
                <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12" variants={containerVariants} initial="initial" animate="animate">
                    
                    {/* Left Column: Quick Actions */}
                    <motion.div className="space-y-6 lg:col-span-1" variants={itemVariants}>
                        <motion.div className="bg-white rounded-lg p-6 shadow-lg" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
                            <h3 className="text-xl font-bold text-black mb-4">Quick actions</h3>
                            <div className="space-y-3">
                                <Link to="/search">
                                    <Button variant="primary" fullWidth className="flex items-center justify-center gap-2">
                                        <Search size={18} />
                                        Find roommate
                                    </Button>
                                </Link>
                                <Link to="/properties">
                                    <Button variant="outline" fullWidth className="flex items-center justify-center gap-2">
                                        <Building2 size={18} />
                                        Explore properties
                                    </Button>
                                </Link>
                                <Link to="/saved">
                                    <Button variant="outline" fullWidth className="flex items-center justify-center gap-2">
                                        <BookmarkIcon size={18} />
                                        Saved profiles
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div className="bg-white rounded-lg p-6 shadow-lg" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
                            <h3 className="font-bold text-black mb-3">Profile Tips</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-black">•</span>
                                    <span>Add photos to get 5x more views</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-black">•</span>
                                    <span>Complete all sections for better matches</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-black">•</span>
                                    <span>Update your preferences regularly</span>
                                </li>
                            </ul>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Profile Progress & Properties */}
                    <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
                        <ProfileCompletionCard user={user} />
                        
                        <motion.div className="bg-white rounded-lg p-6 shadow-lg" whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-black">Latest Properties</h3>
                                <Link to="/properties">
                                    <Button variant="ghost" size="sm" className="text-sm">View all</Button>
                                </Link>
                            </div>
                            
                            {propertiesLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader size={24} className="animate-spin text-gray-400" />
                                </div>
                            ) : properties && properties.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {properties.slice(0, 2).map((property) => (
                                        <div key={property.id} className="scale-95 origin-top-left w-[105%]">
                                            <PropertyCard property={property} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-100">
                                    <p className="text-gray-500 text-sm">No new properties listed recently.</p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Recommended Roommates */}
                <motion.section variants={containerVariants} initial="initial" animate="animate">
                    <motion.div className="flex items-center justify-between mb-6" variants={itemVariants}>
                        <h2 className="text-2xl font-bold text-black">Recommended roommates</h2>
                        <Link to="/search">
                            <Button variant="ghost" size="sm">View all matches</Button>
                        </Link>
                    </motion.div>

                    {recommendationsStatus === 'loading' ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader size={28} className="animate-spin text-gray-400" />
                        </div>
                    ) : recommendations.length > 0 ? (
                        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" variants={containerVariants} initial="initial" animate="animate">
                            {recommendations.map((roommate) => (
                                <RoommateCard key={roommate.id} roommate={roommate} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div className="bg-gray-50 rounded-lg p-8 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                            <p className="text-gray-600 mb-4">No matches yet. Complete your profile to get better matches!</p>
                            <Link to="/search">
                                <Button variant="primary">Browse Roommates</Button>
                            </Link>
                        </motion.div>
                    )}
                </motion.section>
            </div>
        </PageTransition>
    );
};

export default Dashboard;
