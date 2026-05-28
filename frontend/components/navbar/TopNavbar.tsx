'use client';

import { ArrowLeft, Bell, ChevronDown, LayoutGrid } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

export function TopNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const getBreadcrumbs = () => {
    if (pathname.includes('/output')) return 'Create New';
    if (pathname.includes('/create')) return 'Assignment';
    if (pathname.includes('/assignments')) return 'Assignment';
    return 'Dashboard';
  };

  const handleBack = () => {
    if (pathname === '/assignments') {
      router.push('/');
    } else if (pathname.includes('/create') || pathname.includes('/output')) {
      router.push('/assignments');
    } else {
      router.back();
    }
  };

  return (
    <header className="bg-white rounded-2xl px-5 py-3.5 flex items-center justify-between border border-neutral-200/80 shadow-sm w-full select-none">

      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="flex items-center gap-2 text-neutral-800">
          <LayoutGrid size={16} className="text-neutral-400" />
          <span className="text-sm font-semibold tracking-wide text-neutral-800">{getBreadcrumbs()}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#FF6A2B] border border-white" />
        </button>
        <div className="w-[1px] h-6 bg-neutral-200" />

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 hover:bg-neutral-50 p-1.5 rounded-xl transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden border border-neutral-200">
              <span className="text-xs font-bold text-neutral-700">JD</span>
            </div>
            <span className="text-sm font-bold text-neutral-800 hidden sm:inline">John Doe</span>
            <ChevronDown size={14} className="text-neutral-400" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg py-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-neutral-100">
                  <p className="text-xs text-neutral-400 font-medium">Logged in as</p>
                  <p className="text-sm font-semibold text-neutral-800 truncate">john.doe@school.edu</p>
                </div>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push('/settings');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push('/settings');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  Account Settings
                </button>
                <div className="border-t border-neutral-100 my-1" />
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
