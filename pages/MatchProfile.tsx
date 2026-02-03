import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleSaveRoommate } from '../slices/roommateSlice';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const MatchProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const roommates = useSelector((state: RootState) => state.roommates.list);
    const saved = useSelector((state: RootState) => state.roommates.saved);

    // Find the roommate by ID
    const roommate = roommates.find(r => r.id === id);
    const isSaved = id ? saved.includes(id) : false;

    const handleSave = () => {
        if (id) {
            dispatch(toggleSaveRoommate(id));
        }
    };

    if (!roommate) {
        return (
            <div className="container py-12">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
                    <Button onClick={() => navigate('/search')}>Back to Search</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="match-profile-page">
            {/* Page Title */}
            <div className="py-6">
                <h1 className="text-3xl font-bold">Match Profile</h1>
            </div>

            {/* Hero Image */}
            <div className="match-hero">
                <img
                    src="https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1400&h=400&fit=crop"
                    alt="Location"
                    className="match-hero-image"
                />
            </div>

            {/* Content */}
            <div>
                <div className="match-content">
                    {/* Left Column - Profile Details */}
                    <div className="match-main">
                        {/* Profile Header */}
                        <div className="match-header">
                            <div className="match-profile-info">
                                <img
                                    src={`https://i.pravatar.cc/80?img=${roommate.id}`}
                                    alt={roommate.name}
                                    className="match-avatar"
                                />
                                <div>
                                    <h2 className="match-name">{roommate.name}, {roommate.age}</h2>
                                    <p className="match-occupation">{roommate.occupation} - {roommate.location}</p>
                                </div>
                            </div>

                            <div className="match-compatibility">
                                <div className="compatibility-label">Compatibility</div>
                                <div className="compatibility-value">{roommate.matchPercentage}% match</div>
                                <button className="compatibility-link">View breakdown</button>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="match-section">
                            <p className="match-bio">
                                I am a calm and organized person working in {roommate.location}. I usually spend weekdays
                                working and going to the gym, and I like quiet evenings at home. weekends are more
                                flexible for outings with friends.
                            </p>
                        </div>

                        {/* Lifestyle Tags */}
                        <div className="match-section">
                            <h3 className="match-section-title">Lifestyle:</h3>
                            <div className="lifestyle-tags">
                                {roommate.tags.map((tag, index) => (
                                    <span key={index} className="lifestyle-tag">{tag}</span>
                                ))}
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
                                    <div className="housing-value">{roommate.location}</div>
                                </div>

                                <div className="housing-item">
                                    <div className="housing-label">Type</div>
                                    <div className="housing-value">Private room in 3BR flat</div>
                                </div>

                                <div className="housing-item">
                                    <div className="housing-label">Roommates</div>
                                    <div className="housing-value">2 male roommates</div>
                                </div>
                            </div>

                            <p className="housing-note">
                                Bills (electricity, gas, internet) are shared equally between roommates at the end of each month.
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Pricing Card */}
                    <div className="match-sidebar">
                        <div className="pricing-card">
                            <div className="pricing-header">
                                <div className="pricing-amount">{roommate.budget.toLocaleString()} EGP / month</div>
                                <div className="pricing-details">Private room - {roommate.location}</div>
                            </div>

                            <div className="pricing-info">
                                <div className="info-item">
                                    <strong>Same-gender (male only) flat</strong>
                                </div>
                                <div className="info-item">
                                    <strong>Minimum stay:</strong> 6 months
                                </div>
                                <div className="info-item">
                                    <strong>Available from:</strong> 1 March 2025
                                </div>
                            </div>

                            <div className="pricing-actions">
                                <Button
                                    variant="primary"
                                    fullWidth
                                    className="mb-3"
                                    onClick={() => navigate('/messages')}
                                >
                                    Send message
                                </Button>
                                <Button
                                    variant={isSaved ? 'primary' : 'outline'}
                                    fullWidth
                                    onClick={handleSave}
                                >
                                    {isSaved ? 'Saved ✓' : 'Save profile'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchProfile;
