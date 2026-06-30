'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { jobsAPI, categoriesAPI } from '@/lib/api';
import { FiBriefcase, FiUsers, FiTrendingUp, FiSearch, FiMapPin, FiClock, FiArrowRight, FiChevronDown, FiSun, FiMoon } from 'react-icons/fi';

export default function Home() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = user?.profile?.firstName && user?.profile?.lastName
    ? `${user.profile.firstName[0]}${user.profile.lastName[0]}`.toUpperCase()
    : user?.email?.[0].toUpperCase() || '?';

  const dashboardHref = user
    ? `/${user.role === 'admin' ? 'admin' : user.role === 'employee' ? 'employee' : 'jobseeker'}/dashboard`
    : '/login';

  useEffect(() => {
    jobsAPI.getJobs({ limit: 6 }).then(res => setJobs(res.data.jobs)).catch(() => {});
    categoriesAPI.getCategories().then(res => setCategories(res.data)).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/jobs?search=${search}&location=${location}`;
  };

  return (
    <div className="min-h-screen">
      <nav className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <FiBriefcase className="text-yellow-900 text-lg" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">Pramod Portal</span>
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {theme === 'dark' ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
              </button>
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {initials}
                    </div>
                    <FiChevronDown className={`text-slate-500 text-sm transition ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {user.profile?.firstName} {user.profile?.lastName}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                      </div>
                      <Link href={dashboardHref} onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                        Dashboard
                      </Link>
                      <button onClick={() => { setDropdownOpen(false); logout(); window.location.href = '/'; }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition w-full text-left">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="btn-primary text-sm">Login</Link>
              )}
              <Link href="/jobs" className="btn-secondary text-sm">Browse Jobs</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your <span className="text-yellow-300">Dream Job</span> Today
            </h1>
            <p className="text-xl text-green-100 mb-10">
              Connect with top employers and take your career to the next level
            </p>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400" />
                <input
                  type="text"
                  placeholder="Job title, skill, or keyword"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 bg-white/95 backdrop-blur-sm border-2 border-white/30 focus:border-yellow-400 focus:ring-0 shadow-lg shadow-black/10"
                />
              </div>
              <div className="flex-1 relative">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400" />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 bg-white/95 backdrop-blur-sm border-2 border-white/30 focus:border-yellow-400 focus:ring-0 shadow-lg shadow-black/10"
                />
              </div>
              <button type="submit" className="bg-yellow-400 text-yellow-900 px-10 py-4 rounded-xl font-bold hover:bg-yellow-300 transition shadow-lg shadow-black/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Latest Job Openings</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <Link key={job._id} href={`/jobs/${job._id}`} className="card card-hover group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-50 dark:bg-green-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiBriefcase className="text-green-600 dark:text-green-400 text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 truncate group-hover:text-green-600 transition">{job.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">{job.companyName}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-slate-500 flex items-center gap-1"><FiMapPin /> {job.location}</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1"><FiClock /> {job.employmentType}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {jobs.length === 0 && (
            <p className="text-center text-slate-500">No jobs available yet. Check back soon!</p>
          )}
          <div className="text-center mt-8">
            <Link href="/jobs" className="btn-outline inline-flex items-center gap-2">
              View All Jobs <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose Pramod Portal</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center mb-12 max-w-2xl mx-auto">We make hiring and job searching simple, fast, and effective</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FiSearch, title: 'Smart Matching', desc: 'AI-powered job recommendations tailored to your skills' },
              { icon: FiUsers, title: 'Top Companies', desc: 'Connect with verified employers from leading companies' },
              { icon: FiTrendingUp, title: 'Career Growth', desc: 'Access resources and tools to advance your career' },
            ].map((item, i) => (
              <div key={i} className="card text-center card-hover">
                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-green-600 dark:text-green-400 text-2xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center"><FiBriefcase className="text-yellow-900" /></div>
                <span className="text-xl font-bold text-white">Pramod Portal</span>
              </div>
              <p className="text-sm">Your trusted platform for career opportunities</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-sm"><li><Link href="/jobs">Browse Jobs</Link></li><li><Link href="/register">Create Account</Link></li><li>CV Builder</li><li>Career Tips</li></ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Employers</h4>
              <ul className="space-y-2 text-sm"><li><Link href="/register?role=employee">Find Jobs</Link></li><li>Browse Candidates</li><li>Pricing</li><li>Resources</li></ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm"><li>Help Center</li><li>Privacy Policy</li><li>Terms of Service</li><li>Contact Us</li></ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-sm text-center">
            &copy; 2024 Pramod Portal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
