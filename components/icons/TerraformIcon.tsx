
import React from 'react';

export const TerraformIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3.5 2.5v10l8.5 5v-10l-8.5-5zM3.5 12.5l8.5 5l8.5-5" />
    <path d="M12 17.5v-10l8.5-5v10l-8.5 5z" />
  </svg>
);
