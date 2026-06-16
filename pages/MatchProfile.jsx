import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMatchById, clearSelectedMatch } from '../slices/matchSlice';
import { toggleSavedProfile } from '../slices/savedSlice';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import VerifiedBadge from '../components/common/VerifiedBadge';
import { Loader, ArrowLeft, Bookmark, MessageCircle, MapPin, Briefcase } from 'lucide-react';
import { computeMatchBreakdown } from '../utils/profileMapper';

const MatchProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { selectedMatch: roommate, selectedStatus } = useSelector((state) => state.matches);
    const savedIds = useSelector((state) => state.saved.ids);
    const myProfile = useSelector((state) => state.auth.user);
    const isSaved = id ? savedIds.includes(id) : false;

    useEffect(() => {
        if (id) {
            dispatch(fetchMatchById(id));
        }
        return () => {
            dispatch(clearSelectedMatch());
        };
    }, [dispatch, id]);

    const handleSave = () => {
        if (id) {
            dispatch(toggleSavedProfile(id));
        }
    };

    const handleMessage = () => {
        navigate('/messages', { state: { startWith: id } });
    };

    if (selectedStatus === 'loading') {
        return (
            <div className="app-container flex items-center justify-center py-20">
                <Loader size={32} className="animate-spin text-gray-400" />
            </div>
        );
    }

    if (!roommate || selectedStatus === 'failed') {
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

    const matchColor = roommate.matchPercentage >= 75 ? 'text-green-600' :
        roommate.matchPercentage >= 60 ? 'text-yellow-600' : 'text-red-500';

    const matchBg = roommate.matchPercentage >= 75 ? 'bg-green-50 border-green-200' :
        roommate.matchPercentage >= 60 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';

    const breakdown = computeMatchBreakdown(myProfile, roommate._raw || roommate);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="app-container"
        >
            {/* Back Button */}
            <div className="py-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-medium">Back</span>
                </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Header */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <img
                                src={roommate.image}
                                alt={roommate.name}
                                className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-2xl font-bold text-black">{roommate.name}</h2>
                                    {roommate.age && <span className="text-gray-500">, {roommate.age}</span>}
                                    {roommate.verified && <VerifiedBadge size={20} />}
                                </div>
                                {roommate.occupation && (
                                    <p className="text-gray-600 flex items-center gap-2">
                                        <Briefcase size={16} />
                                        {roommate.occupation}
                                    </p>
                                )}
                                {roommate.location && (
                                    <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                                        <MapPin size={14} />
                                        {roommate.location}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    {roommate.bio && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-black mb-3">About</h3>
                            <p className="text-gray-600 leading-relaxed">{roommate.bio}</p>
                        </div>
                    )}

                    {/* Lifestyle Tags */}
                    {roommate.tags?.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-black mb-3">Lifestyle & Traits</h3>
                            <div className="flex flex-wrap gap-2">
                                {roommate.tags.map((tag, index) => (
                                    <span key={index} className="bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-full text-sm font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Housing Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-black mb-4">Housing Preferences</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Budget</div>
                                <div className="text-lg font-bold text-black">{roommate.budget}</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Location</div>
                                <div className="text-lg font-bold text-black">{roommate.location}</div>
                            </div>
                            {roommate.gender && (
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Gender</div>
                                    <div className="text-lg font-bold text-black capitalize">{roommate.gender.toLowerCase()}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Compatibility Breakdown */}
                    {breakdown.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-black mb-4">Compatibility Breakdown</h3>
                            <div className="space-y-4">
                                {breakdown.map((factor) => (
                                    <div key={factor.key}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-700">{factor.label}</span>
                                            <span className="text-sm font-bold text-black">
                                                {Math.round((factor.score / factor.maxScore) * 100)}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-black rounded-full transition-all duration-500"
                                                style={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Actions Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-6">
                        {/* Match Score */}
                        <div className={`text-center p-6 rounded-xl border ${matchBg}`}>
                            <div className={`text-4xl font-bold ${matchColor}`}>
                                {roommate.matchPercentage}%
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Compatibility Score</div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Button variant="primary" fullWidth onClick={handleMessage} className="flex items-center justify-center gap-2">
                                <MessageCircle size={18} />
                                Send Message
                            </Button>
                            <Button variant={isSaved ? 'primary' : 'outline'} fullWidth onClick={handleSave} className="flex items-center justify-center gap-2">
                                <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                                {isSaved ? 'Saved' : 'Save Profile'}
                            </Button>
                        </div>

                        {/* Quick Info */}
                        <div className="pt-4 border-t border-gray-100 space-y-3">
                            {roommate.budget && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Budget</span>
                                    <span className="font-medium text-black">{roommate.budget}</span>
                                </div>
                            )}
                            {roommate.location && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Location</span>
                                    <span className="font-medium text-black">{roommate.location}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MatchProfile;
