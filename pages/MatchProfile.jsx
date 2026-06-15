import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import MatchScore from '../components/MatchScore';
import SaveButton from '../components/SaveButton';
import SkeletonCard from '../components/SkeletonCard';
import { clearSelectedMatch, fetchMatchById } from '../slices/matchSlice';

const MatchProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedMatch: roommate, selectedStatus } = useSelector((state) => state.matches);

    React.useEffect(() => {
        if (id) {
            dispatch(fetchMatchById(id));
        }

        return () => {
            dispatch(clearSelectedMatch());
        };
    }, [dispatch, id]);

    if (selectedStatus === 'loading' || (!roommate && selectedStatus === 'idle')) {
        return (
            <div className="app-container py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SkeletonCard />
                    <SkeletonCard compact />
                </div>
            </div>
        );
    }

    if (!roommate) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="app-container"
            >
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
                    <Button onClick={() => navigate('/search')}>Back to Search</Button>
                </div>
            </motion.div>
        );
    }
    
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="app-container"
        >
            {/* Page Title */}
            <div className="py-6">
                <h1 className="text-3xl font-bold">Match Profile</h1>
            </div>

            {/* Hero Image */}
            <div className="match-hero">
                <img src="https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1400&h=400&fit=crop" alt="Location" className="match-hero-image"/>
            </div>

            {/* Content */}
            <div>
                <div className="match-content">
                    {/* Left Column - Profile Details */}
                    <div className="match-main">
                        {/* Profile Header */}
                        <div className="match-header">
                            <div className="match-profile-info">
                                <img src={`https://i.pravatar.cc/80?img=${roommate.id}`} alt={roommate.name} className="match-avatar"/>
                                <div>
                                    <h2 className="match-name">{roommate.name}, {roommate.age}</h2>
                                    <p className="match-occupation">{roommate.occupation} - {roommate.locationLabel || roommate.location}</p>
                                </div>
                            </div>

                            <div className="match-compatibility">
                                <SaveButton profileId={roommate.id} iconOnly={false} />
                            </div>
                        </div>

                        <div className="match-section">
                            <MatchScore score={roommate.matchPercentage} breakdown={roommate.matchBreakdown} />
                        </div>

                        {/* Bio */}
                        <div className="match-section">
                            <p className="match-bio">
                                {roommate.bio}
                            </p>
                        </div>

                        {/* Lifestyle Tags */}
                        <div className="match-section">
                            <h3 className="match-section-title">Lifestyle:</h3>
                            <div className="lifestyle-tags">
                                {roommate.tags.map((tag, index) => (<span key={index} className="lifestyle-tag">{tag}</span>))}
                            </div>
                        </div>

                        {/* Housing Details */}
                        <div className="match-section">
                            <h2 className="match-heading">Housing details</h2>
                            <p className="match-subheading">Room and flat information for this listing.</p>

                            <div className="housing-grid">
                                <div className="housing-item">
                                    <div className="housing-label">Rent</div>
                                    <div className="housing-value">{roommate.budget.toLocaleString()} EGP / month</div>
                                </div>

                                <div className="housing-item">
                                    <div className="housing-label">Area</div>
                                    <div className="housing-value">{roommate.locationLabel || roommate.location}</div>
                                </div>

                                <div className="housing-item">
                                    <div className="housing-label">Type</div>
                                    <div className="housing-value">{roommate.housing.type}</div>
                                </div>

                                <div className="housing-item">
                                    <div className="housing-label">Roommates</div>
                                    <div className="housing-value">{roommate.housing.roommates}</div>
                                </div>
                            </div>

                            <p className="housing-note">
                                {roommate.responseTime}. Bills like electricity, gas, and internet are shared equally between roommates.
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Pricing Card */}
                    <div className="match-sidebar">
                        <div className="pricing-card">
                            <div className="pricing-header">
                                <div className="pricing-amount">{roommate.budget.toLocaleString()} EGP / month</div>
                                <div className="pricing-details">{roommate.housing.type} - {roommate.locationLabel || roommate.location}</div>
                            </div>

                            <div className="pricing-info">
                                <div className="info-item">
                                    <strong>Same-gender flat</strong>
                                </div>
                                <div className="info-item">
                                    <strong>Minimum stay:</strong> {roommate.housing.minimumStay}
                                </div>
                                <div className="info-item">
                                    <strong>Available from:</strong> {roommate.housing.availableFrom}
                                </div>
                            </div>

                            <div className="pricing-actions">
                                <Button variant="primary" fullWidth className="mb-3" onClick={() => navigate('/messages')}>
                                    Send message
                                </Button>
                                <SaveButton profileId={roommate.id} iconOnly={false} className="save-button--full" showLabel />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
export default MatchProfile;
