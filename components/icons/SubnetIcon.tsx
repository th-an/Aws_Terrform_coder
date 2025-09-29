
import React from 'react';

export const SubnetIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 10v4" />
    <path d="M12 18v-2" />
    <path d="M12 8V6" />
    <path d="M12 2v2" />
    <path d="M7 14h10" />
    <rect x="3" y="12" width="18" height="10" rx="2" />
  </svg>
);
