import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { Edit, Camera, MapPin, Briefcase, Mail, Phone, CheckCircle } from 'lucide-react';

const MyProfile: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    if (!user) {
        navigate('/login');
        return null;
    }

    // Mock profile data (in real app, this would come from API)
    const profileData = {
        name: user.name,
        email: user.email,
        phone: '+20 123 456 7890',
        age: 25,
        gender: 'Male',
        occupation: 'Software Engineer',
        currentCity: 'Cairo',
        bio: 'I am a calm and organized person working in Cairo. I usually spend weekdays working and going to the gym, and I like quiet evenings at home. Weekends are more flexible for outings with friends.',
        personality: ['Calm', 'Organized', 'Quiet'],
        lifestyle: {
            smoking: 'Non-smoker',
            pets: 'No pets',
            sleepSchedule: 'Flexible',
            cleanliness: 'Very clean',
        },
        preferences: {
            budget: '3,000 - 5,000 EGP',
            locations: ['Nasr City', 'New Cairo', 'Maadi'],
            roommateGender: 'Same gender only',
            additionalPrefs: ['Non-smoker', 'Quiet', 'Clean'],
        },
        verified: {
            email: true,
            phone: true,
            id: false,
        },
        stats: {
            profileViews: 127,
            matches: 23,
            responseRate: 95,
        },
    };

    return (
        <div className="my-profile-page">
            <div className="container py-8">
                {/* Header */}
                <div className="profile-page-header">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
                        <p className="text-gray-600">Manage your profile and preferences</p>
                    </div>
                    <Button
                        variant={isEditing ? 'outline' : 'primary'}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        <Edit size={18} />
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                </div>

                <div className="profile-grid">
                    {/* Left Column - Main Profile */}
                    <div className="profile-main-column">
                        {/* Profile Card */}
                        <div className="profile-card">
                            {/* Avatar Section */}
                            <div className="profile-avatar-section">
                                <div className="avatar-container">
                                    <img
                                        src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`}
                                        alt={user.name}
                                        className="profile-avatar-large"
                                    />
                                    {isEditing && (
                                        <button className="avatar-upload-btn">
                                            <Camera size={20} />
                                        </button>
                                    )}
                                </div>
                                <div className="profile-header-info">
                                    <h2 className="profile-name-large">{profileData.name}, {profileData.age}</h2>
                                    <div className="profile-meta">
                                        <span className="meta-item">
                                            <Briefcase size={16} />
                                            {profileData.occupation}
                                        </span>
                                        <span className="meta-item">
                                            <MapPin size={16} />
                                            {profileData.currentCity}
                                        </span>
                                    </div>

                                    {/* Verification Badges */}
                                    <div className="verification-badges">
                                        {profileData.verified.email && (
                                            <span className="verified-badge">
                                                <CheckCircle size={14} />
                                                Email verified
                                            </span>
                                        )}
                                        {profileData.verified.phone && (
                                            <span className="verified-badge">
                                                <CheckCircle size={14} />
                                                Phone verified
                                            </span>
                                        )}
                                        {!profileData.verified.id && (
                                            <button className="verify-btn">
                                                Verify ID
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="profile-section">
                                <h3 className="section-title">Contact Information</h3>
                                <div className="contact-info">
                                    <div className="contact-item">
                                        <Mail size={18} className="text-gray-400" />
                                        <span>{profileData.email}</span>
                                    </div>
                                    <div className="contact-item">
                                        <Phone size={18} className="text-gray-400" />
                                        <span>{profileData.phone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="profile-section">
                                <h3 className="section-title">About Me</h3>
                                {isEditing ? (
                                    <textarea
                                        className="bio-textarea"
                                        defaultValue={profileData.bio}
                                        rows={4}
                                    />
                                ) : (
                                    <p className="bio-text">{profileData.bio}</p>
                                )}
                            </div>

                            {/* Personality */}
                            <div className="profile-section">
                                <h3 className="section-title">Personality</h3>
                                <div className="pill-group">
                                    {profileData.personality.map((trait) => (
                                        <span key={trait} className="pill-button active">
                                            {trait}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Lifestyle */}
                            <div className="profile-section">
                                <h3 className="section-title">Lifestyle</h3>
                                <div className="lifestyle-grid">
                                    <div className="lifestyle-item">
                                        <span className="lifestyle-label">Smoking</span>
                                        <span className="lifestyle-value">{profileData.lifestyle.smoking}</span>
                                    </div>
                                    <div className="lifestyle-item">
                                        <span className="lifestyle-label">Pets</span>
                                        <span className="lifestyle-value">{profileData.lifestyle.pets}</span>
                                    </div>
                                    <div className="lifestyle-item">
                                        <span className="lifestyle-label">Sleep Schedule</span>
                                        <span className="lifestyle-value">{profileData.lifestyle.sleepSchedule}</span>
                                    </div>
                                    <div className="lifestyle-item">
                                        <span className="lifestyle-label">Cleanliness</span>
                                        <span className="lifestyle-value">{profileData.lifestyle.cleanliness}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Preferences */}
                            <div className="profile-section">
                                <h3 className="section-title">Roommate Preferences</h3>
                                <div className="preferences-grid">
                                    <div className="pref-item">
                                        <span className="pref-label">Budget Range</span>
                                        <span className="pref-value">{profileData.preferences.budget}</span>
                                    </div>
                                    <div className="pref-item">
                                        <span className="pref-label">Preferred Locations</span>
                                        <div className="pill-group">
                                            {profileData.preferences.locations.map((loc) => (
                                                <span key={loc} className="pill-tag">{loc}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="pref-item">
                                        <span className="pref-label">Gender Preference</span>
                                        <span className="pref-value">{profileData.preferences.roommateGender}</span>
                                    </div>
                                    <div className="pref-item">
                                        <span className="pref-label">Additional Preferences</span>
                                        <div className="pill-group">
                                            {profileData.preferences.additionalPrefs.map((pref) => (
                                                <span key={pref} className="pill-tag">{pref}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="profile-actions">
                                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" onClick={() => setIsEditing(false)}>
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Stats & Actions */}
                    <div className="profile-sidebar-column">
                        {/* Stats Card */}
                        <div className="stats-card">
                            <h3 className="card-title">Profile Stats</h3>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <div className="stat-value">{profileData.stats.profileViews}</div>
                                    <div className="stat-label">Profile Views</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">{profileData.stats.matches}</div>
                                    <div className="stat-label">Matches</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">{profileData.stats.responseRate}%</div>
                                    <div className="stat-label">Response Rate</div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Completion */}
                        <div className="completion-card">
                            <h3 className="card-title">Profile Completion</h3>
                            <div className="completion-progress">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${user.profileCompletion}%` }}
                                    />
                                </div>
                                <span className="progress-text">{user.profileCompletion}% Complete</span>
                            </div>
                            {user.profileCompletion < 100 && (
                                <div className="completion-tips">
                                    <p className="tip-title">Complete your profile to get better matches:</p>
                                    <ul className="tip-list">
                                        <li>Add a profile photo</li>
                                        <li>Verify your phone number</li>
                                        <li>Add more personality traits</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="actions-card">
                            <h3 className="card-title">Quick Actions</h3>
                            <div className="action-buttons">
                                <Button
                                    variant="outline"
                                    fullWidth
                                    onClick={() => navigate('/profile-setup')}
                                >
                                    Update Preferences
                                </Button>
                                <Button
                                    variant="outline"
                                    fullWidth
                                    onClick={() => navigate('/search')}
                                >
                                    Find Roommates
                                </Button>
                                <Button
                                    variant="outline"
                                    fullWidth
                                    onClick={() => navigate('/saved')}
                                >
                                    Saved Profiles
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
