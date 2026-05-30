import React from 'react';

const VerifiedBadge = ({ size = 22, title = 'ID Verified' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'inline-block', flexShrink: 0, verticalAlign: 'middle' }}
        aria-label={title}
        role="img"
    >
        <title>{title}</title>
        {/* Starburst / seal shape */}
        <path
            d="M50 4
               L56 18 L70 11 L67 26 L82 24 L74 36 L88 40 L76 49 L88 60 L74 63 L82 76 L67 74 L70 89 L56 82 L50 96 L44 82 L30 89 L33 74 L18 76 L26 63 L12 60 L24 49 L12 40 L26 36 L18 24 L33 26 L30 11 L44 18 Z"
            fill="url(#badgeGrad)"
        />
        {/* White checkmark */}
        <path
            d="M32 50 L44 63 L68 37"
            stroke="white"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <defs>
            <linearGradient id="badgeGrad" x1="12" y1="4" x2="88" y2="96" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#42a5f5" />
                <stop offset="100%" stopColor="#1565c0" />
            </linearGradient>
        </defs>
    </svg>
);

export default VerifiedBadge;
