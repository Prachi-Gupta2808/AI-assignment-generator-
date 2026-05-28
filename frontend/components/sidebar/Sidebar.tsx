'use client';

import {
  BookOpen,
  Home,
  Library,
  Plus,
  Settings,
  Sparkles,
  Users
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { SidebarItem } from './SidebarItem';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isHomeActive = pathname === '/' || pathname === '';
  const isGroupsActive = pathname.startsWith('/groups');
  const isAssignmentsActive = pathname.startsWith('/assignments') && !pathname.includes('/toolkit');
  const isToolkitActive = pathname.startsWith('/toolkit') || pathname.includes('/output') || pathname.includes('/create'); 
  const isLibraryActive = pathname.startsWith('/library');

  return (
    <aside className="w-72 hidden lg:flex flex-col bg-white p-5 border border-neutral-200/80 rounded-3xl h-[calc(100vh-2rem)] shadow-sm select-none shrink-0">
      <div className="flex items-center gap-2 px-2 py-1 mb-6 cursor-pointer select-none" onClick={() => router.push('/')}>
        <svg
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 rounded-lg shadow-sm"
        >
          <rect width="512" height="512" rx="91.4286" fill="url(#logo_gradient)" />
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
            <linearGradient id="logo_gradient" x1="256" y1="0" x2="256" y2="512" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E56820" />
              <stop offset="1" stopColor="#D45E3E" />
            </linearGradient>
          </defs>
        </svg>
        <span className="text-xl font-bold text-neutral-900 tracking-tight">
          Veda<span className="text-[#FF6A2B]">AI</span>
        </span>
      </div>

      <button
        onClick={() => router.push('/assignments/create')}
        className="w-full bg-black text-white hover:bg-neutral-800 rounded-full py-3.5 px-5 flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-300 shadow-[0_0_14px_rgba(255,106,43,0.35)] border border-[#FF6A2B]/40 hover:shadow-[0_0_18px_rgba(255,106,43,0.5)] cursor-pointer active:scale-98 mb-6"
      >
        <span className="w-5 h-5 rounded-full bg-[#FF6A2B] flex items-center justify-center text-white">
          <Plus size={12} strokeWidth={3} />
        </span>
        <span>Create Assignment</span>
      </button>

      <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto">
        <SidebarItem
          icon={<Home size={18} />}
          label="Home"
          href="/"
          isActive={isHomeActive}
        />
        <SidebarItem
          icon={<Users size={18} />}
          label="My Groups"
          href="/groups"
          isActive={isGroupsActive}
        />
        <SidebarItem
          icon={<BookOpen size={18} />}
          label="Assignments"
          href="/assignments"
          badge={10}
          isActive={isAssignmentsActive}
        />
        <SidebarItem
          icon={<Sparkles size={18} />}
          label="AI Teacher's Toolkit"
          href="/assignments/create" 
          isActive={isToolkitActive}
        />
        <SidebarItem
          icon={<Library size={18} />}
          label="My Library"
          href="/library"
          badge={32}
          isActive={isLibraryActive}
        />
      </nav>

      <div className="border-t border-neutral-100 pt-4 flex flex-col gap-4 mt-auto">
        <SidebarItem
          icon={<Settings size={18} />}
          label="Settings"
          href="/settings"
          isActive={pathname === '/settings'}
        />

        <div className="flex items-center gap-3 rounded-2xl bg-neutral-50 border border-neutral-100 p-3">
          <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center overflow-hidden border border-neutral-200">
            <span className="text-sm font-bold text-[#FF6A2B]">DPS</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-neutral-800 truncate">Delhi Public School</p>
            <p className="text-[10px] text-neutral-400 font-medium truncate">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
