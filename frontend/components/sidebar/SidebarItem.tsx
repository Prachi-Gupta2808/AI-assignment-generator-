'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import * as React from 'react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
  isActive: boolean;
}

export function SidebarItem({ icon, label, href, badge, isActive }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer group',
        isActive
          ? 'bg-neutral-100 text-neutral-900 font-bold'
          : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
      )}
    >
      <span className={cn(
        'transition-colors duration-200',
        isActive ? 'text-black' : 'text-neutral-400 group-hover:text-neutral-700'
      )}>
        {icon}
      </span>
      
      <span className="flex-1 truncate">{label}</span>
      
      {badge !== undefined && badge > 0 && (
        <span className="flex items-center justify-center min-w-5 h-5 rounded-full bg-[#FF6A2B] text-[10px] font-bold text-white px-1">
          {badge}
        </span>
      )}
    </Link>
  );
}
