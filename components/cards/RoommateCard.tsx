import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Roommate } from '../../types';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSaveRoommate } from '../../slices/roommateSlice';
import { RootState } from '../../store';
import { Bookmark, MapPin, Briefcase, CheckCircle } from 'lucide-react';

interface RoommateCardProps {
  roommate: Roommate;
}

const RoommateCard: React.FC<RoommateCardProps> = ({ roommate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const savedIds = useSelector((state: RootState) => state.roommates.saved);
  const isSaved = savedIds.includes(roommate.id);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleSaveRoommate(roommate.id));
  };

  const handleViewProfile = () => {
    navigate(`/match/${roommate.id}`);
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  return (
    <div
      className="group bg-white rounded-xl shadow-sm hover:shadow-hover border border-gray-100 overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full"
      onClick={handleViewProfile}
    >
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={roommate.image}
          alt={roommate.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

        {/* Match Badge */}
        <div className="absolute top-3 right-3">
          <div className={`${getMatchColor(roommate.matchPercentage)} text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1`}>
            <span>{roommate.matchPercentage}%</span>
            <span>Match</span>
          </div>
        </div>

        {/* Online Status */}
        {roommate.isOnline && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-medium text-gray-700">Online</span>
          </div>
        )}

        {/* Overlay Info (Mobile/Quick Glance) */}
        <div className="absolute bottom-3 left-3 text-white">
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-xl font-extrabold leading-tight text-white drop-shadow-md tracking-wide">{roommate.name}</h3>
            <span className="text-white font-bold text-sm ml-1 opacity-100 drop-shadow-sm">• {roommate.age} years</span>
          </div>
          <p className="text-white/80 text-xs flex items-center gap-1">
            <MapPin size={12} /> {roommate.location}
          </p>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {roommate.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="bg-gray-50 text-gray-600 border border-gray-200 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide">
              {tag}
            </span>
          ))}
        </div>

        {/* Occupation */}
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <Briefcase size={16} className="mr-2 text-gray-400" />
          {roommate.occupation}
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600 mb-6 line-clamp-2 leading-relaxed flex-1">
          {roommate.bio || 'Looking for a compatible roommate to share a great living space.'}
        </p>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Budget</span>
            <div className="text-lg font-bold text-black">
              EGP {roommate.budget.toLocaleString()}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${isSaved
                ? 'bg-black border-black text-white hover:bg-gray-800'
                : 'bg-white border-gray-200 text-gray-400 hover:border-black hover:text-black'
                }`}
              title={isSaved ? "Unsave Profile" : "Save Profile"}
            >
              <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
            </button>
            <Button variant="primary" size="sm" onClick={handleViewProfile} className="!px-5 whitespace-nowrap">
              View profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoommateCard;
