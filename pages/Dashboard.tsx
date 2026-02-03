import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../store';
import RoommateCard from '../components/cards/RoommateCard';
import ProfileCompletionCard from '../components/cards/ProfileCompletionCard';
import Button from '../components/common/Button';
import PageTransition from '../components/common/PageTransition';
import { Link } from 'react-router-dom';
import { Search, BookmarkIcon } from 'lucide-react';
import { containerVariants, itemVariants } from '../utils/animations';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { list } = useSelector((state: RootState) => state.roommates);

  // Top 3 matches
  const topMatches = [...list].sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 3);

  if (!user) return null;

  // Get time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <PageTransition>
      <div>
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
            {greeting}, {user.name.split(' ')[0]}
          </h1>
          <p className="text-gray-600 text-lg">
            Here are your latest roommate matches and profile progress
          </p>
        </motion.div>

        {/* Top Section: Profile & Sidebar */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {/* Left Column: Profile completion */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <ProfileCompletionCard user={user} />
          </motion.div>

          {/* Right Column: Quick actions & Tips */}
          <motion.div className="space-y-6" variants={itemVariants}>
            {/* Find Roommate Card */}
            <motion.div
              className="bg-white rounded-lg p-6 shadow-lg"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-black mb-4">Quick actions</h3>
              <div className="space-y-3">
                <Link to="/search">
                  <Button variant="primary" fullWidth className="flex items-center justify-center gap-2">
                    <Search size={18} />
                    Find roommate
                  </Button>
                </Link>
                <Link to="/saved">
                  <Button variant="outline" fullWidth className="flex items-center justify-center gap-2">
                    <BookmarkIcon size={18} />
                    Saved profiles
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Tips Card */}
            <motion.div
              className="bg-white rounded-lg p-6 shadow-lg"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-bold text-black mb-3">💡 Profile Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <motion.li
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                >
                  <span className="text-black">•</span>
                  <span>Add photos to get 5x more views</span>
                </motion.li>
                <motion.li
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                >
                  <span className="text-black">•</span>
                  <span>Complete all sections for better matches</span>
                </motion.li>
                <motion.li
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                >
                  <span className="text-black">•</span>
                  <span>Update your preferences regularly</span>
                </motion.li>
              </ul>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom Section: Recommended Roommates (Full Width) */}
        <motion.section
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="flex items-center justify-between mb-6"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold text-black">Recommended roommates</h2>
            <Link to="/search">
              <Button variant="ghost" size="sm">View all matches</Button>
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            {topMatches.map((roommate) => (
              <RoommateCard key={roommate.id} roommate={roommate} />
            ))}
          </motion.div>

          {topMatches.length === 0 && (
            <motion.div
              className="bg-gray-50 rounded-lg p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-gray-600 mb-4">No matches yet. Complete your profile to get better matches!</p>
              <Link to="/search">
                <Button variant="primary">Browse Roommates</Button>
              </Link>
            </motion.div>
          )}
        </motion.section>
      </div>
    </PageTransition>
  );
};

export default Dashboard;

