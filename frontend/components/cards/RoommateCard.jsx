import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { Briefcase, MapPin } from 'lucide-react';
import MatchScore from '../../components/MatchScore';
import SaveButton from '../../components/SaveButton';

const RoommateCard = ({ roommate }) => {
    const navigate = useNavigate();
    const handleViewProfile = () => {
        navigate(`/match/${roommate.id}`);
    };
    return (<motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} whileHover={{ y: -4, scale: 1.02 }} className="match-card" onClick={handleViewProfile}>
      <div className="match-card__media">
        <img src={roommate.image} alt={roommate.name} className="match-card__image"/>
        <div className="match-card__overlay" />
        <div className="match-card__top-row">
          {roommate.isOnline && (<span className="match-card__status">Online</span>)}
          <SaveButton profileId={roommate.id} className="match-card__save" />
        </div>
      </div>

      <div className="match-card__body">
        <div className="match-card__header">
          <div>
            <h3 className="match-card__name">{roommate.name}, {roommate.age}</h3>
            <p className="match-card__subtle">
              <MapPin size={14} /> {roommate.locationLabel || roommate.location}
            </p>
          </div>
          <MatchScore score={roommate.matchPercentage} breakdown={roommate.matchBreakdown} compact />
        </div>

        <p className="match-card__occupation">
          <Briefcase size={15} /> {roommate.occupation}
        </p>

        <div className="match-card__tags">
          {roommate.tags.slice(0, 3).map((tag) => (<span key={tag} className="match-card__tag">{tag}</span>))}
        </div>

        <p className="match-card__bio">{roommate.bio || 'Looking for a compatible roommate to share a calm and well-managed home.'}</p>

        <div className="match-card__footer">
          <div>
            <span className="match-card__label">Budget</span>
            <strong className="match-card__budget">EGP {roommate.budget.toLocaleString()}</strong>
          </div>
          <Button variant="primary" size="sm" onClick={handleViewProfile} className="!px-5 whitespace-nowrap">
            View profile
          </Button>
        </div>
      </div>
    </motion.article>);
};
export default RoommateCard;
