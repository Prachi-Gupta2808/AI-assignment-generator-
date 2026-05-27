// components/navbar/MobileNavbar.tsx
'use client';

import * as React from 'react';
import { useRouter as useNextRouter, usePathname as useNextPathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  Library,
  Sparkles,
  Menu,
  Bell,
  X,
  Plus,
  Users,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNavbar() {
  const router = useNextRouter();
  const pathname = useNextPathname();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const navItems = [
    { label: 'Home', icon: <Home size={18} />, href: '/' },
    { label: 'Assignments', icon: <BookOpen size={18} />, href: '/assignments' },
    { label: 'Library', icon: <Library size={18} />, href: '/library' },
    { label: 'AI Toolkit', icon: <Sparkles size={18} />, href: '/assignments/create' },
  ];

  const handleCreateNew = () => {
    router.push('/assignments/create');
  };

  return (
    <>
      {/* 1. MOBILE TOPBAR (Header) */}
      <header className="lg:hidden w-full bg-white border border-neutral-200/80 rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm select-none">
        {/* VedaAI Logo */}
        <div className="flex items-center gap-2 select-none" onClick={() => router.push('/')}>
          <svg
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 rounded-lg shadow-sm"
          >
            <rect width="512" height="512" rx="91.4286" fill="url(#mobile_logo_gradient)" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M290.906 362.985C290.906 362.985 300.218 387.842 308.751 389.398H200.92C179.197 389.398 159.808 376.969 153.597 353.662L90.7615 167.213C90.7615 167.213 85.3336 144.684 76.8 140.8H186.959C208.682 141.578 223.421 149.345 231.955 178.092L290.906 362.985Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M221.866 362.988C221.866 362.988 212.554 387.845 204.021 389.401H311.852C333.575 389.401 352.964 376.972 359.176 353.665L421.239 167.222C421.239 167.222 426.666 144.692 435.2 140.809H325.813C304.09 140.809 290.129 148.576 281.595 177.323L221.866 362.988Z"
              fill="white"
            />
            <defs>
              <linearGradient id="mobile_logo_gradient" x1="256" y1="0" x2="256" y2="512" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E56820" />
                <stop offset="1" stopColor="#D45E3E" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-base font-bold text-neutral-900 tracking-tight">
            Veda<span className="text-[#FF6A2B]">AI</span>
          </span>
        </div>

        {/* Action icons on right */}
        <div className="flex items-center gap-3">
          {/* Bell with orange dot */}
          <button className="relative w-8 h-8 rounded-full border border-neutral-100 flex items-center justify-center text-neutral-600 active:scale-95 transition-all">
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FF6A2B] border border-white" />
          </button>

          {/* User profile avatar */}
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden border border-neutral-200">
            <span className="text-xs font-bold text-neutral-700">JD</span>
          </div>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 active:scale-95 transition-all"
          >
            <Menu size={16} />
          </button>
        </div>
      </header>

      {/* 2. DRAWER OVERLAY (Slide out navigation drawer) */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-72 max-w-full bg-white z-50 shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div className="flex flex-col gap-6">
              {/* Header inside drawer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 select-none">
                  <svg
                    viewBox="0 0 512 512"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7 rounded-lg shadow-sm"
                  >
                    <rect width="512" height="512" rx="91.4286" fill="url(#drawer_logo_gradient)" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M290.906 362.985C290.906 362.985 300.218 387.842 308.751 389.398H200.92C179.197 389.398 159.808 376.969 153.597 353.662L90.7615 167.213C90.7615 167.213 85.3336 144.684 76.8 140.8H186.959C208.682 141.578 223.421 149.345 231.955 178.092L290.906 362.985Z"
                      fill="white"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M221.866 362.988C221.866 362.988 212.554 387.845 204.021 389.401H311.852C333.575 389.401 352.964 376.972 359.176 353.665L421.239 167.222C421.239 167.222 426.666 144.692 435.2 140.809H325.813C304.09 140.809 290.129 148.576 281.595 177.323L221.866 362.988Z"
                      fill="white"
                    />
                    <defs>
                      <linearGradient id="drawer_logo_gradient" x1="256" y1="0" x2="256" y2="512" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#E56820" />
                        <stop offset="1" stopColor="#D45E3E" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="text-base font-bold text-neutral-900">VedaAI Menu</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 rounded-full border border-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-50"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Sidebar CTA */}
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  handleCreateNew();
                }}
                className="w-full bg-black text-white hover:bg-neutral-800 rounded-full py-3.5 px-5 flex items-center justify-center gap-2 font-semibold text-xs transition-all shadow-[0_0_14px_rgba(255,106,43,0.3)] border border-[#FF6A2B]/40 cursor-pointer active:scale-98"
              >
                <span className="w-4 h-4 rounded-full bg-[#FF6A2B] flex items-center justify-center text-white">
                  <Plus size={10} strokeWidth={3} />
                </span>
                <span>Create Assignment</span>
              </button>

              {/* Navigation Items */}
              <nav className="flex flex-col gap-1.5">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        setDrawerOpen(false);
                        router.push(item.href);
                      }}
                      className={cn(
                        'flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all text-left w-full',
                        isActive ? 'bg-neutral-100 text-neutral-900 font-bold' : 'text-neutral-500 hover:bg-neutral-50'
                      )}
                    >
                      <span className={isActive ? 'text-black' : 'text-neutral-400'}>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    router.push('/groups');
                  }}
                  className={cn(
                    'flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all text-left w-full',
                    pathname.startsWith('/groups') ? 'bg-neutral-100 text-neutral-900 font-bold' : 'text-neutral-500'
                  )}
                >
                  <span className="text-neutral-400"><Users size={18} /></span>
                  <span>My Groups</span>
                </button>
              </nav>
            </div>

            {/* Bottom items inside drawer */}
            <div className="border-t border-neutral-100 pt-4 flex flex-col gap-4">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  router.push('/settings');
                }}
                className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-neutral-500 hover:bg-neutral-50 w-full text-left"
              >
                <Settings size={18} className="text-neutral-400" />
                <span>Settings</span>
              </button>
              
              <div className="flex items-center gap-3 rounded-2xl bg-neutral-50 border border-neutral-100 p-3">
                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center overflow-hidden border border-neutral-200">
                  <span className="text-xs font-bold text-[#FF6A2B]">DPS</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-neutral-800 truncate">Delhi Public School</p>
                  <p className="text-[10px] text-neutral-400 font-medium truncate">Bokaro Steel City</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 3. MOBILE FLOATING ACTION PLUS BUTTON */}
      {/* Visible only if not currently in creation state */}
      {!pathname.includes('/create') && !pathname.includes('/output') && (
        <button
          onClick={handleCreateNew}
          className="lg:hidden fixed bottom-24 right-6 w-12 h-12 rounded-full bg-white text-[#FF6A2B] hover:bg-neutral-50 border border-neutral-200 flex items-center justify-center shadow-lg active:scale-95 transition-all z-40"
        >
          <Plus size={24} strokeWidth={2.5} />
        </button>
      )}

      {/* 4. MOBILE BOTTOM STICKY NAVIGATION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-100 px-4 py-2 select-none shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
        <div className="bg-black rounded-full max-w-md mx-auto px-6 py-2.5 flex justify-between items-center shadow-lg border border-neutral-800">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className="flex flex-col items-center justify-center gap-0.5 text-neutral-400 hover:text-white transition-colors duration-150 relative px-2.5 py-1"
              >
                <span className={cn('transition-colors duration-150', isActive ? 'text-white scale-110' : 'text-neutral-500')}>
                  {item.icon}
                </span>
                <span className={cn('text-[9px] font-semibold transition-all duration-150', isActive ? 'text-white scale-100 font-bold' : 'text-neutral-500 scale-95')}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1.5 w-1 h-1 bg-[#FF6A2B] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
