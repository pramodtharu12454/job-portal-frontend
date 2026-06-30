'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiGrid, FiBriefcase, FiUsers, FiFileText, FiHeart, FiSettings, FiLogOut, FiBell, FiTrendingUp, FiCheckSquare, FiBookmark, FiMessageSquare, FiPieChart, FiLayers, FiUserCheck, FiSliders, FiSun, FiMoon, FiHelpCircle } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import { useState } from 'react';

const jobseekerLinks = [
  { href: '/jobseeker/dashboard', label: 'Dashboard', icon: FiGrid },
  { href: '/jobseeker/post-job', label: 'Post a Job', icon: FiLayers },
  { href: '/jobseeker/my-jobs', label: 'My Job Posts', icon: FiBriefcase },
  { href: '/jobseeker/applications', label: 'Applications Received', icon: FiUsers },
  { href: '/jobseeker/company', label: 'Company Profile', icon: FiUserCheck },
  { href: '/jobseeker/cv', label: 'CV Builder', icon: FiFileText },
  { href: '/help', label: 'Help Desk', icon: FiHelpCircle },
  { href: '/jobseeker/settings', label: 'Settings', icon: FiSliders },
];

const employeeLinks = [
  { href: '/employee/dashboard', label: 'Dashboard', icon: FiGrid },
  { href: '/jobs', label: 'Browse Jobs', icon: FiBriefcase },
  { href: '/employee/applications', label: 'My Applications', icon: FiFileText },
  { href: '/employee/profile', label: 'My Profile', icon: FiUserCheck },
  { href: '/jobseeker/saved', label: 'Saved Jobs', icon: FiBookmark },
  { href: '/jobseeker/cv', label: 'CV Builder', icon: FiFileText },
  { href: '/help', label: 'Help Desk', icon: FiHelpCircle },
  { href: '/employee/settings', label: 'Settings', icon: FiSliders },
];

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { href: '/admin/users', label: 'Manage Users', icon: FiUsers },
  { href: '/admin/jobs', label: 'Manage Jobs', icon: FiBriefcase },
  { href: '/admin/categories', label: 'Categories', icon: FiLayers },
  { href: '/admin/analytics', label: 'Analytics', icon: FiTrendingUp },
  { href: '/help', label: 'Help Desk', icon: FiHelpCircle },
  { href: '/admin/settings', label: 'Settings', icon: FiSliders },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'employee' ? employeeLinks : jobseekerLinks;

  const handleNav = () => { if (onClose) onClose(); };

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <Link href="/" onClick={handleNav} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
            <FiBriefcase className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white">Pramod Portal</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleNav}
              className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
            >
              <link.icon className="text-lg flex-shrink-0" />
              <span className="text-sm">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-200 dark:border-slate-700">
        {user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {user.profile?.firstName} {user.profile?.lastName}
            </p>
            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
          </div>
        )}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="sidebar-link w-full"
        >
          {theme === 'dark' ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
          <span className="text-sm">Toggle Theme</span>
        </button>
        <button
          onClick={() => { logout(); window.location.href = '/'; }}
          className="sidebar-link w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <FiLogOut className="text-lg" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 min-h-screen fixed left-0 top-0 z-40">
        {sidebarContent}
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <aside className="relative w-64 bg-white dark:bg-slate-900 h-full flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
