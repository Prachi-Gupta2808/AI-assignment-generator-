'use client';

import * as React from 'react';
import { MobileNavbar } from '../navbar/MobileNavbar';
import { TopNavbar } from '../navbar/TopNavbar';
import { Sidebar } from '../sidebar/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col lg:flex-row lg:p-4 lg:gap-4 font-sans text-neutral-800 antialiased select-none">

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 lg:gap-4">
        <div className="hidden lg:block">
          <TopNavbar />
        </div>

        <div className="lg:hidden bg-white border-b border-neutral-200/40 shrink-0">
          <MobileNavbar />
        </div>
        <main className="flex-1 p-4 lg:p-0 overflow-y-auto relative pb-24 lg:pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}
export default DashboardLayout;
