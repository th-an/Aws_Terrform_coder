
import React from 'react';

export const NetworkIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2a10 10 0 00-10 10h3a7 7 0 117-7v3a10 10 0 00-7 7h3a7 7 0 117 7v3a10 10 0 0010-10h-3a7 7 0 11-7-7v3a10 10 0 007-7h-3a7 7 0 11-7 7v-3z" />
  </svg>
);
