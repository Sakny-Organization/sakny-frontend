import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import { Edit, Camera, MapPin, Briefcase, Mail, Phone, CheckCircle } from 'lucide-react';
import { getMyProfile, updateProfile, getMyContactInfo } from '../services/profileApi';
import { containerVariants, itemVariants } from '../utils/animations';
import Input from '../components/common/Input';

const MyProfile = () => {
    const { user: authUser, token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [contactInfo, setContactInfo] = useState({ email: '', phone: '', isHidden: false });
    
    // Editable state
    const [editForm, setEditForm] = useState({
        name: '',
        age: '',
        bio: '',
        phone: '',
        hideContactInfo: false
    });

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const profileRes = await getMyProfile(token);
            if (profileRes.success) {
                setProfile(profileRes.data);

                // Fetch user's own contact info using the token-based endpoint
                const contactRes = await getMyContactInfo(token);
                if (contactRes.success) {
                    setContactInfo(contactRes.data);
                }

                // Initialize edit form
                setEditForm({
                    name: profileRes.data.name || authUser.name,
                    age: profileRes.data.age || '',
                    bio: profileRes.data.bio || '',
                    phone: contactRes.success ? contactRes.data.phone : '',
                    hideContactInfo: profileRes.data.hideContactInfo || false
                });
            } else {
                setError(profileRes.message || 'Failed to fetch profile');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (token && authUser) {
            fetchProfileData();
        }
    }, [token, authUser]);

    if (!authUser) {
        navigate('/login');
        return null;
    }

    if (loading) {
        return (
            <div className="app-container flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="app-container">
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                    {error || 'Profile not found. Please complete your profile setup.'}
                    <Button variant="primary" className="mt-4" onClick={() => navigate('/profile-setup')}>
                        Complete Profile
                    </Button>
                </div>
            </div>
        );
    }

    // Map backend ProfileResponse to UI needs
    const profileData = {
        name: profile.name || authUser.name,
        email: authUser.email,
        phone: contactInfo.phone || 'Not provided',
        age: profile.age || 'N/A',
        gender: profile.gender || 'N/A',
        occupation: profile.occupation || profile.universityOrSchool || profile.companyName || 'Not specified',
        currentCity: profile.currentCity?.nameEn || 'Not specified',
        bio: profile.bio || 'No bio provided yet.',
        personality: profile.personalityTraits || [],
        lifestyle: {
            smoking: profile.smoking || 'Not specified',
            pets: profile.pets || 'Not specified',
            sleepSchedule: profile.sleepSchedule || 'Not specified',
            cleanliness: profile.cleanliness ? `Level ${profile.cleanliness}` : 'Not specified',
        },
        preferences: {
            budget: profile.budgetMin && profile.budgetMax
                ? `${profile.budgetMin.toLocaleString()} - ${profile.budgetMax.toLocaleString()} EGP`
                : 'Not specified',
            locations: profile.preferredAreas?.map(area => area.city.nameEn) || [],
            roommateGender: profile.roommateGender || 'Any',
            additionalPrefs: [
                profile.prefSmoking && `Smoking: ${profile.prefSmoking}`,
                profile.prefPets && `Pets: ${profile.prefPets}`,
                profile.prefSleepSchedule && `Sleep: ${profile.prefSleepSchedule}`,
            ].filter(Boolean),
        },
        verified: {
            email: true, // Assuming true if they can log in
            phone: !!contactInfo.phone,
            id: false,
        },
        stats: {
            profileViews: 0, // Backend doesn't provide these yet
            matches: 0,
            responseRate: 100,
        },
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const updateData = {
                name: editForm.name,
                age: parseInt(editForm.age),
                bio: editForm.bio,
                phone: editForm.phone,
                hideContactInfo: editForm.hideContactInfo
            };
            
            const response = await updateProfile(updateData, token);
            if (response.success) {
                await fetchProfileData();
                setIsEditing(false);
            } else {
                alert(response.message || 'Update failed');
            }
        } catch (err) {
            alert(err.message || 'An error occurred during update');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="app-container"
        >
            <div>
                {/* Header */}
                <div className="profile-page-header">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
                        <p className="text-gray-600">Manage your profile and preferences</p>
                    </div>
                    <Button variant={isEditing ? 'outline' : 'primary'} onClick={() => setIsEditing(!isEditing)}>
                        <Edit size={18}/>
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
                                    <img src={profile.profilePhotoUrl || `https://i.pravatar.cc/150?u=${authUser.id}`} alt={profileData.name} className="profile-avatar-large"/>
                                    {isEditing && (<button className="avatar-upload-btn">
                                            <Camera size={20}/>
                                        </button>)}
                                </div>
                                <div className="profile-header-info">
                                    {isEditing ? (
                                        <div className="flex flex-col gap-2 mb-4">
                                            <Input
                                                label="Full Name"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            />
                                            <Input
                                                label="Age"
                                                type="number"
                                                value={editForm.age}
                                                onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                                            />
                                        </div>
                                    ) : (
                                        <h2 className="profile-name-large">{profileData.name}, {profileData.age}</h2>
                                    )}
                                    <div className="profile-meta">
                                        <span className="meta-item">
                                            <Briefcase size={16}/>
                                            {profileData.occupation}
                                        </span>
                                        <span className="meta-item">
                                            <MapPin size={16}/>
                                            {profileData.currentCity}
                                        </span>
                                    </div>

                                    {/* Verification Badges */}
                                    <div className="verification-badges">
                                        {profileData.verified.email && (<span className="verified-badge">
                                                <CheckCircle size={14}/>
                                                Email verified
                                            </span>)}
                                        {profileData.verified.phone && (<span className="verified-badge">
                                                <CheckCircle size={14}/>
                                                Phone verified
                                            </span>)}
                                        {!profileData.verified.id && (<button className="verify-btn">
                                                Verify ID
                                            </button>)}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="profile-section">
                                <h3 className="section-title">Contact Information</h3>
                                {isEditing ? (
                                    <div className="flex flex-col gap-4">
                                        <Input
                                            label="Phone Number"
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                        />
                                        <div className="flex items-center gap-2 mt-2">
                                            <input
                                                type="checkbox"
                                                id="hideContact"
                                                checked={editForm.hideContactInfo}
                                                onChange={(e) => setEditForm({ ...editForm, hideContactInfo: e.target.checked })}
                                                className="w-4 h-4"
                                            />
                                            <label htmlFor="hideContact" className="text-sm font-medium">
                                                Hide contact info from others
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="contact-info">
                                        <div className="contact-item">
                                            <Mail size={18} className="text-gray-400"/>
                                            <span>{profileData.email}</span>
                                        </div>
                                        <div className="contact-item">
                                            <Phone size={18} className="text-gray-400"/>
                                            <span>{profileData.phone}</span>
                                            {contactInfo.isHidden && (
                                                <span className="text-xs text-gray-400 ml-2">(Hidden from others)</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Bio */}
                            <div className="profile-section">
                                <h3 className="section-title">About Me</h3>
                                {isEditing ? (
                                    <textarea
                                        className="bio-textarea"
                                        value={editForm.bio}
                                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                        rows={4}
                                    />
                                ) : (
                                    <p className="bio-text whitespace-pre-wrap">{profileData.bio}</p>
                                )}
                            </div>

                            {/* Personality */}
                            <div className="profile-section">
                                <h3 className="section-title">Personality</h3>
                                <div className="pill-group">
                                    {profileData.personality.map((trait) => (<span key={trait} className="pill-button active">
                                            {trait}
                                        </span>))}
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
                                            {profileData.preferences.locations.map((loc) => (<span key={loc} className="pill-tag">{loc}</span>))}
                                        </div>
                                    </div>
                                    <div className="pref-item">
                                        <span className="pref-label">Gender Preference</span>
                                        <span className="pref-value">{profileData.preferences.roommateGender}</span>
                                    </div>
                                    <div className="pref-item">
                                        <span className="pref-label">Additional Preferences</span>
                                        <div className="pill-group">
                                            {profileData.preferences.additionalPrefs.map((pref) => (<span key={pref} className="pill-tag">{pref}</span>))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isEditing && (<div className="profile-actions">
                                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" onClick={handleSave}>
                                        Save Changes
                                    </Button>
                                </div>)}
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
                                    <div className="progress-fill" style={{ width: `${profile.isComplete ? 100 : authUser.profileCompletion}%` }}/>
                                </div>
                                <span className="progress-text">{profile.isComplete ? 100 : authUser.profileCompletion}% Complete</span>
                            </div>
                            {(!profile.isComplete) && (<div className="completion-tips">
                                    <p className="tip-title">Complete your profile to get better matches:</p>
                                    <ul className="tip-list">
                                        <li>Add a profile photo</li>
                                        <li>Verify your phone number</li>
                                        <li>Add more personality traits</li>
                                    </ul>
                                </div>)}
                        </div>

                        {/* Quick Actions */}
                        <div className="actions-card">
                            <h3 className="card-title">Quick Actions</h3>
                            <div className="action-buttons">
                                <Button variant="outline" fullWidth onClick={() => navigate('/profile-setup', { state: { edit: true } })}>
                                    Update Preferences
                                </Button>
                                <Button variant="outline" fullWidth onClick={() => navigate('/search')}>
                                    Find Roommates
                                </Button>
                                <Button variant="outline" fullWidth onClick={() => navigate('/saved')}>
                                    Saved Profiles
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MyProfile;
