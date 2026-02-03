import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Link } from 'react-router-dom';
import RoommateCard from '../components/cards/RoommateCard';
import Button from '../components/common/Button';
import { BookmarkIcon, Search } from 'lucide-react';

const SavedProfiles: React.FC = () => {
    const { list, saved } = useSelector((state: RootState) => state.roommates);

    // Get saved roommates
    const savedRoommates = list.filter(roommate => saved.includes(roommate.id));

    return (
        <div className="saved-profiles-page">
            <div>
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Saved Profiles</h1>
                        <p className="text-gray-600">
                            {savedRoommates.length} {savedRoommates.length === 1 ? 'profile' : 'profiles'} saved
                        </p>
                    </div>
                    <Link to="/search">
                        <Button variant="primary">
                            <Search size={18} />
                            Find More Roommates
                        </Button>
                    </Link>
                </div>

                {/* Content */}
                {savedRoommates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {savedRoommates.map((roommate) => (
                            <RoommateCard key={roommate.id} roommate={roommate} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <BookmarkIcon size={64} />
                        </div>
                        <h2 className="empty-state-title">No saved profiles yet</h2>
                        <p className="empty-state-description">
                            Start saving profiles you're interested in to easily find them later.
                            Click the bookmark icon on any profile to save it.
                        </p>
                        <Link to="/search">
                            <Button variant="primary" size="lg" className="mt-6">
                                <Search size={20} />
                                Browse Roommates
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedProfiles;
