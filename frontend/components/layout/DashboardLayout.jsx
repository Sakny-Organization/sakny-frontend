import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../common/PageTransition';

/**
 * DashboardLayout — landlord page shell.
 *
 * No sidebar. Uses the same Navbar already rendered in App.jsx Layout.
 * The content area mirrors the `app-container py-6 md:py-8` wrapper used
 * by every roommate-facing page so the landlord experience feels unified.
 */
const DashboardLayout = ({ title, subtitle, actions, children }) => (
  <PageTransition>
    <div className="app-container py-6 md:py-8">
      {/* Page header — same visual rhythm as Dashboard h1 block */}
      <motion.div
        className="landlord-page-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">{title}</h1>
          {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
        </div>
        {actions && <div className="landlord-page-header__actions">{actions}</div>}
      </motion.div>

      {/* Body */}
      <div className="landlord-page-body">{children}</div>
    </div>
  </PageTransition>
);

export default DashboardLayout;