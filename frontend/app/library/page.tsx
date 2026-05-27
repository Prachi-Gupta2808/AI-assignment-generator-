'use client';

import { Library } from 'lucide-react';

export default function LibraryPage() {
  return (
    <div className="flex flex-col gap-6 select-none relative min-h-[calc(100vh-10rem)]">

      <div className="bg-white rounded-3xl border border-neutral-200/60 p-8 shadow-xs flex flex-col items-center justify-center text-center select-none w-full min-h-[calc(100vh-12rem)]">
        

        <div className="relative w-32 h-32 mb-6 flex items-center justify-center bg-orange-50 rounded-full text-[#FF6A2B] animate-pulse">
          <Library size={64} />
        </div>

        <h2 className="text-xl lg:text-2xl font-bold text-neutral-800 tracking-tight mb-2">
          My Library Under Construction
        </h2>
        <p className="text-neutral-500 text-xs sm:text-sm font-medium leading-relaxed mb-6 max-w-sm sm:max-w-md">
          This feature is currently not available. Soon you will be able to store your generated papers, templates, reference textbooks, and custom rubrics here!
        </p>

        <div className="inline-flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 text-neutral-500 px-4 py-2 rounded-full text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-orange-400" />
          <span>Coming Soon</span>
        </div>

      </div>
    </div>
  );
}
