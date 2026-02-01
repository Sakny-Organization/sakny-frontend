import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Left-aligned links */}
          <div className="flex gap-6 text-sm text-gray-600">
            <a href="/about" className="hover:text-black transition-colors">About</a>
            <a href="/privacy" className="hover:text-black transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-black transition-colors">Terms</a>
            <a href="/contact" className="hover:text-black transition-colors">Contact</a>
          </div>

          {/*
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Language:</span>
            <button className="hover:text-black transition-colors font-medium">English</button>
            <span>/</span>
            <button className="hover:text-black transition-colors">العربية</button>
          </div>
          */}

        </div> {/* closes flex container */}

        {/* Copyright */}
        <div className="text-center mt-6 text-xs text-gray-500">
          © 2026 Sakny. All rights reserved.
        </div>

      </div> {/* closes container */}
    </footer>
  );
};

export default Footer;
