'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { FiMenu, FiX } from 'react-icons/fi';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const isPublic = pathname === '/jobs' || pathname.startsWith('/jobs/');

  useEffect(() => {
    if (!loading && !user && !isPublic) {
      router.push('/login');
    }
  }, [user, loading, router, isPublic]);

  useEffect(() => { setMobileSidebar(false); }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user && !isPublic) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {user && (
        <>
          <Sidebar mobileOpen={mobileSidebar} onClose={() => setMobileSidebar(false)} />
          <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 z-30">
            <button onClick={() => setMobileSidebar(true)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <FiMenu className="text-xl text-slate-700 dark:text-slate-300" />
            </button>
            <span className="ml-3 text-lg font-bold text-slate-900 dark:text-white">Pramod Portal</span>
          </div>
        </>
      )}
      <main className={`${user ? 'lg:ml-64 pt-14 lg:pt-0 p-4 lg:p-8' : ''}`}>
        {children}
      </main>
    </div>
  );
}
