import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import RoommateCard from '../components/cards/RoommateCard';
import Button from '../components/common/Button';
import { BookmarkIcon, Search, Loader } from 'lucide-react';
import { fetchSavedProfiles } from '../slices/savedSlice';
import { profileToCard } from '../utils/profileMapper';

const SavedProfiles = () => {
    const dispatch = useDispatch();
    const { profiles, loading } = useSelector((state) => state.saved);
    const myProfile = useSelector((state) => state.auth.user);

    useEffect(() => {
        dispatch(fetchSavedProfiles());
    }, [dispatch]);

    const savedRoommates = profiles.map(p => profileToCard(p, myProfile));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="app-container"
        >
            <div>
                <div className="page-header">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Saved Profiles</h1>
                        <p className="text-gray-600">
                            {savedRoommates.length} {savedRoommates.length === 1 ? 'profile' : 'profiles'} saved
                        </p>
                    </div>
                    <Link to="/search">
                        <Button variant="primary">
                            <Search size={18}/>
                            Find More Roommates
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader size={24} className="animate-spin text-gray-400" />
                    </div>
                ) : savedRoommates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {savedRoommates.map((roommate) => (
                            <RoommateCard key={roommate.id} roommate={roommate}/>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <BookmarkIcon size={64}/>
                        </div>
                        <h2 className="empty-state-title">No saved profiles yet</h2>
                        <p className="empty-state-description">
                            Start saving profiles you're interested in to easily find them later.
                            Click the bookmark icon on any profile to save it.
                        </p>
                        <Link to="/search">
                            <Button variant="primary" size="lg" className="mt-6">
                                <Search size={20}/>
                                Browse Roommates
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
export default SavedProfiles;
