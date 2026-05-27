'use client';

import { Button } from '@/components/ui/custom-ui';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GroupsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-lg mx-auto select-none min-h-[calc(100vh-16rem)] lg:min-h-0 animate-in fade-in duration-200">
      <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full text-neutral-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="35" cy="55" r="3" fill="#A3A3A3" opacity="0.4" />
          <circle cx="165" cy="145" r="4" fill="#A3A3A3" opacity="0.3" />
          <rect x="50" y="40" width="100" height="70" rx="12" fill="#FFFFFF" stroke="#D4D4D4" strokeWidth="3" />
          
          <circle cx="80" cy="70" r="10" fill="#E5E5E5" />
          <path d="M70 92 C70 82, 90 82, 90 92" stroke="#A3A3A3" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          
          <circle cx="120" cy="70" r="10" fill="#E5E5E5" />
          <path d="M110 92 C110 82, 130 82, 130 92" stroke="#A3A3A3" strokeWidth="2.5" strokeLinecap="round" fill="none" />


          <circle cx="100" cy="115" r="22" fill="#FF6A2B" />

          <rect x="92" y="109" width="16" height="12" rx="2" fill="#FFFFFF" />
          <path d="M96 109 V104 A4 4 0 0 1 104 104 V109" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      <h2 className="text-xl lg:text-2xl font-bold text-neutral-800 tracking-tight mb-2">
        Groups is currently not enabled
      </h2>
      <p className="text-neutral-500 text-xs sm:text-sm font-medium leading-relaxed mb-8 max-w-sm sm:max-w-md">
        The student groups and class management module is currently being finalized. You will be able to organize students, sync rosters, define custom marking rubrics, and track class group performance soon.
      </p>
      <Button
        onClick={() => router.push('/assignments')}
        variant="primary"
        size="lg"
        className="rounded-full shadow-lg font-bold gap-2 px-8 py-3.5"
      >
        <ArrowLeft size={15} strokeWidth={2.5} />
        <span>Go Back to Assignments</span>
      </Button>
    </div>
  );
}
