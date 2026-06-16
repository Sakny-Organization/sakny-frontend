import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfileData } from '../slices/authSlice';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import VerifiedBadge from '../components/common/VerifiedBadge';
import ProfileCompletionCard from '../components/cards/ProfileCompletionCard';
import { Edit, Camera, MapPin, Briefcase, Mail, Phone, CheckCircle } from 'lucide-react';
import { getMyProfile, updateProfile, getMyContactInfo, updateProfilePhoto } from '../services/profileApi';
import { containerVariants, itemVariants } from '../utils/animations';
import { formatSmoking, formatPets, formatSleep, formatCleanlinessLevel, formatGender } from '../utils/enumLabels';
import Input from '../components/common/Input';

const MyProfile = () => {
    const { user: authUser, token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [contactInfo, setContactInfo] = useState({ email: '', phone: '', isHidden: false });
    const fileInputRef = React.useRef(null);
    const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    // Editable state
    const [editForm, setEditForm] = useState({
        name: '',
        age: '',
        bio: '',
        phone: '',
        hideContactInfo: false,
        profilePhotoUrl: ''
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
                    hideContactInfo: profileRes.data.hideContactInfo || false,
                    profilePhotoUrl: profileRes.data.profilePhotoUrl || ''
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
            smoking: formatSmoking(profile.smoking),
            pets: formatPets(profile.pets),
            sleepSchedule: formatSleep(profile.sleepSchedule),
            cleanliness: profile.cleanliness ? formatCleanlinessLevel(profile.cleanliness) : 'Not specified',
        },
        preferences: {
            budget: profile.budgetMin && profile.budgetMax
                ? `${profile.budgetMin.toLocaleString()} - ${profile.budgetMax.toLocaleString()} EGP`
                : 'Not specified',
            locations: profile.preferredAreas?.map(area => area.city.nameEn) || [],
            roommateGender: formatGender(profile.roommateGender),
            additionalPrefs: [
                profile.prefSmoking && `Smoking: ${formatSmoking(profile.prefSmoking)}`,
                profile.prefPets && `Pets: ${formatPets(profile.prefPets)}`,
                profile.prefSleepSchedule && `Sleep: ${formatSleep(profile.prefSleepSchedule)}`,
            ].filter(Boolean),
        },
        verified: {
            email: Boolean(profile.isEmailVerified),
            phone: Boolean(profile.isPhoneVerified),
            id: Boolean(profile.isVerified),
        },
        stats: {
            profileViews: 0, // Backend doesn't provide these yet
            matches: 0,
            responseRate: 100,
        },
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        const maxSize = 5 * 1024 * 1024; // 5MB
        const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (!supportedTypes.includes(file.type)) {
            alert('Please upload a JPEG, PNG, or WebP image.');
            return;
        }

        if (file.size > maxSize) {
            alert('Image size must be 5MB or less.');
            return;
        }

        // Show preview only
        const reader = new FileReader();
        reader.onloadend = () => {
            setEditForm({ ...editForm, profilePhotoUrl: reader.result });
        };
        reader.readAsDataURL(file);

        // Store the file for later upload when user clicks Save
        setSelectedPhotoFile(file);
    };

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            // Upload photo first if a new one was selected
            if (selectedPhotoFile) {
                setUploadingPhoto(true);
                const photoResponse = await updateProfilePhoto(selectedPhotoFile, token);
                if (!photoResponse.success) {
                    alert(photoResponse.message || 'Failed to upload photo');
                    setLoading(false);
                    setUploadingPhoto(false);
                    return;
                }
                // Update Redux store with new photo URL
                if (photoResponse.data?.profilePhotoUrl) {
                    dispatch(updateProfileData({
                        profilePhotoUrl: photoResponse.data.profilePhotoUrl
                    }));
                }
                setUploadingPhoto(false);
            }

            // Then update profile data
            const updateData = {
                name: editForm.name,
                age: parseInt(editForm.age),
                bio: editForm.bio,
                phone: editForm.phone,
                hideContactInfo: editForm.hideContactInfo
            };

            const response = await updateProfile(updateData, token);
            if (response.success) {
                // Update Redux store with new profile data
                dispatch(updateProfileData({
                    name: editForm.name,
                    age: parseInt(editForm.age),
                    bio: editForm.bio
                }));

                await fetchProfileData();
                setIsEditing(false);
                setSelectedPhotoFile(null); // Clear selected photo
            } else {
                alert(response.message || 'Update failed');
            }
        } catch (err) {
            alert(err.message || 'An error occurred during update');
        } finally {
            setLoading(false);
            setUploadingPhoto(false);
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
                    <Button variant={isEditing ? 'outline' : 'primary'} onClick={() => {
                        if (isEditing) {
                            // Cancel: reset form and discard photo selection
                            setEditForm({
                                name: profile.name || authUser.name,
                                age: profile.age || '',
                                bio: profile.bio || '',
                                phone: contactInfo.phone || '',
                                hideContactInfo: profile.hideContactInfo || false,
                                profilePhotoUrl: profile.profilePhotoUrl || ''
                            });
                            setSelectedPhotoFile(null);
                        }
                        setIsEditing(!isEditing);
                    }}>
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
                                    <Avatar
                                        src={isEditing ? editForm.profilePhotoUrl : profile.profilePhotoUrl}
                                        name={profileData.name}
                                        size="2xl"
                                        className="profile-avatar-large"
                                    />
                                    {isEditing && (
                                        <>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoUpload}
                                                style={{ display: 'none' }}
                                            />
                                            <button
                                                className="avatar-upload-btn"
                                                onClick={handleCameraClick}
                                                type="button"
                                                title="Select photo"
                                            >
                                                <Camera size={20}/>
                                            </button>
                                        </>
                                    )}
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
                                        <h2 className="profile-name-large">{profileData.name}, {profileData.age} {profileData.verified.id && <VerifiedBadge size={26} />}</h2>
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
                                        {profileData.verified.email ? (
                                            <span className="verified-badge">
                                                <CheckCircle size={14}/>
                                                Email verified
                                            </span>
                                        ) : (
                                            <button className="verify-btn" onClick={() => navigate('/verify-contact', { state: { channel: 'EMAIL', identifier: profileData.email } })}>
                                                Verify email
                                            </button>
                                        )}
                                        {profileData.verified.phone ? (
                                            <span className="verified-badge">
                                                <CheckCircle size={14}/>
                                                Phone verified
                                            </span>
                                        ) : (
                                            <button className="verify-btn" onClick={() => navigate('/verify-contact', { state: { channel: 'PHONE', identifier: contactInfo.phone || authUser?.phone } })}>
                                                Verify phone
                                            </button>
                                        )}
                                        {!profileData.verified.id && (<button className="verify-btn" onClick={() => navigate('/verify-id')}>
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
                                    <Button variant="primary" onClick={handleSave} disabled={loading}>
                                        {loading ? (uploadingPhoto ? 'Uploading photo...' : 'Saving...') : 'Save Changes'}
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
                        <ProfileCompletionCard user={profile} />

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
