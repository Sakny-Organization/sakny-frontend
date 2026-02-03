import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer className="px-6 lg:px-12 py-16 border-t border-borderLight bg-white relative">
      <motion.div
        className="max-w-[1200px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Brand */}
        <div className="col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg">
              <span>∞</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">Sakny</h2>
          </div>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Redefining urban co-living through data-driven matching and verified community trust.
          </p>
        </div>

        {/* Platform Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h6 className="font-bold mb-6 uppercase text-xs tracking-widest text-muted">
            Platform
          </h6>
          <ul className="space-y-4 text-sm font-medium">
            <li>
              <a className="hover:text-primary transition-colors" href="#how-it-works">
                How it works
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="#features">
                Security
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="/">
                Pricing
              </a>
            </li>
          </ul>
        </motion.div>

        {/* Company Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h6 className="font-bold mb-6 uppercase text-xs tracking-widest text-muted">
            Company
          </h6>
          <ul className="space-y-4 text-sm font-medium">
            <li>
              <a className="hover:text-primary transition-colors" href="/">
                About Us
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="/">
                Privacy Policy
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href="/">
                Terms of Service
              </a>
            </li>
          </ul>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h6 className="font-bold mb-6 uppercase text-xs tracking-widest text-muted">
            Newsletter
          </h6>
          <div className="relative">
            <input
              className="w-full bg-card border border-borderLight rounded-lg px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Email address"
              type="email"
            />
            <button className="absolute right-2 top-2 p-1 text-primary hover:text-primary/80 transition-colors">
              →
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Copyright */}
      <motion.div
        className="max-w-[1200px] mx-auto mt-16 pt-8 border-t border-borderLight flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-muted uppercase tracking-widest"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p>© 2026 Sakny Inc. All rights reserved.</p>
      </motion.div>
    </footer>
  );
};

export default Footer;
