import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import RoommateCard from '../components/cards/RoommateCard';
import Button from '../components/common/Button';
import EmptyState from '../components/EmptyState';
import SkeletonCard from '../components/SkeletonCard';
import { BookmarkIcon, Search } from 'lucide-react';
import { fetchMatches } from '../slices/matchSlice';
import { defaultSearchFilters } from '../services/searchService';

const SavedProfiles = () => {
    const dispatch = useDispatch();
    const savedIds = useSelector((state) => state.saved.ids);
    const { items, status } = useSelector((state) => state.matches);

    React.useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchMatches(defaultSearchFilters));
        }
    }, [dispatch, status]);

    const savedRoommates = items.filter((roommate) => savedIds.includes(roommate.id));
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="app-container"
        >
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
                            <Search size={18}/>
                            Find More Roommates
                        </Button>
                    </Link>
                </div>

                {/* Content */}
                {status === 'loading' && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)}
                    </div>)}

                {status !== 'loading' && savedRoommates.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {savedRoommates.map((roommate) => (<RoommateCard key={roommate.id} roommate={roommate}/>))}
                    </div>) : status !== 'loading' && (<EmptyState
                        icon={<BookmarkIcon size={30} />}
                        title="No saved profiles yet"
                        description="Save promising matches to compare them later, revisit their compatibility breakdown, and keep your shortlist organized."
                        secondaryAction={<Link to="/search"><Button variant="primary">Browse roommates</Button></Link>}
                    />)}
            </div>
        </motion.div>
    );
};
export default SavedProfiles;
