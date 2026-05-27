// components/assignments/EmptyAssignments.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '../ui/custom-ui';

export function EmptyAssignments() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/60 p-8 shadow-xs flex flex-col items-center justify-center text-center select-none w-full min-h-[calc(100vh-12rem)]">
      {/* Custom Vector SVG Illustration (Indistinguishable from VedaAI designs) */}
      <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full text-neutral-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Background sparkles/dots */}
          <circle cx="35" cy="55" r="3" fill="#A3A3A3" opacity="0.4" />
          <circle cx="165" cy="145" r="4" fill="#A3A3A3" opacity="0.3" />
          
          <path
            d="M25 150 L35 140 M165 45 L175 35"
            stroke="#A3A3A3"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.3"
          />

          {/* Document Sheet */}
          <g transform="translate(60, 30)">
            <rect
              x="0"
              y="0"
              width="75"
              height="100"
              rx="8"
              fill="#FFFFFF"
              stroke="#D4D4D4"
              strokeWidth="3"
            />
            {/* Sheet lines */}
            <line x1="15" y1="25" x2="60" y2="25" stroke="#E5E5E5" strokeWidth="3" strokeLinecap="round" />
            <line x1="15" y1="40" x2="60" y2="40" stroke="#E5E5E5" strokeWidth="3" strokeLinecap="round" />
            <line x1="15" y1="55" x2="45" y2="55" stroke="#E5E5E5" strokeWidth="3" strokeLinecap="round" />
            <line x1="15" y1="70" x2="55" y2="70" stroke="#E5E5E5" strokeWidth="3" strokeLinecap="round" />
            
            {/* Little floating text bubble in illustration */}
            <rect x="50" y="-12" width="20" height="12" rx="4" fill="#E5E5E5" opacity="0.8" />
            <circle cx="56" cy="-6" r="1.5" fill="#A3A3A3" />
            <circle cx="64" cy="-6" r="1.5" fill="#A3A3A3" />
          </g>

          {/* Decorative Loop Curl */}
          <path
            d="M40 70 C45 50, 60 55, 60 70 C60 85, 45 80, 52 95"
            stroke="#4B5563"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Magnifying Glass handle */}
          <line
            x1="102"
            y1="102"
            x2="135"
            y2="135"
            stroke="#9CA3AF"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <line
            x1="110"
            y1="110"
            x2="132"
            y2="132"
            stroke="#D1D5DB"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Magnifying Glass lens outer rim */}
          <circle cx="90" cy="90" r="30" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="6" />
          
          {/* Lens shine */}
          <path
            d="M75 75 A 20 20 0 0 1 105 75"
            stroke="#E5E7EB"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Red X warning circle indicator */}
          <circle cx="90" cy="90" r="18" fill="#EF4444" />
          <path
            d="M83 83 L97 97 M97 83 L83 97"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Primary Message */}
      <h2 className="text-xl lg:text-2xl font-bold text-neutral-800 tracking-tight mb-2">
        No assignments yet
      </h2>

      {/* Secondary Subtext Description */}
      <p className="text-neutral-500 text-xs sm:text-sm font-medium leading-relaxed mb-8 max-w-sm sm:max-w-md">
        Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>

      {/* Call To Action button */}
      <button
        onClick={() => router.push('/assignments/create')}
        className="bg-black text-white hover:bg-neutral-800 rounded-full px-8 py-3.5 font-bold text-xs tracking-wide shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 transition-all cursor-pointer"
      >
        <Plus size={14} strokeWidth={2.5} />
        <span>Create Your First Assignment</span>
      </button>
    </div>
  );
}
export default EmptyAssignments;
