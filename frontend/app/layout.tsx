// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import './globals.css';

// Configure the Inter font as the primary font family
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'VedaAI - Assignment Dashboard',
  description: 'Create and manage academic assignments with AI-assisted grading',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans antialiased bg-[#444444] text-neutral-800">
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </body>
    </html>
  );
}
