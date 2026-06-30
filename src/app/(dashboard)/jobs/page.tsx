'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { jobsAPI, categoriesAPI } from '@/lib/api';
import { FiBriefcase, FiSearch, FiMapPin, FiClock, FiSliders, FiArrowRight, FiX, FiChevronDown } from 'react-icons/fi';

function JobsPage() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<any[]>([]);

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
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    category: '',
    employmentType: '',
    experienceLevel: '',
    salaryMin: '',
    salaryMax: '',
  });

  useEffect(() => {
    categoriesAPI.getCategories().then(res => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const params: any = { page, limit: 12 };
    Object.entries(filters).forEach(([key, val]) => { if (val) params[key] = val; });
    jobsAPI.getJobs(params).then(res => {
      setJobs(res.data.jobs);
      setTotal(res.data.total);
    }).catch(() => {});
  }, [filters, page]);

  const clearFilters = () => {
    setFilters({ search: '', location: '', category: '', employmentType: '', experienceLevel: '', salaryMin: '', salaryMax: '' });
    setPage(1);
  };

  const hasFilters = Object.values(filters).some(v => v);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center"><FiBriefcase className="text-white" /></div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">Pramod Portal</span>
            </Link>
            <div className="flex-1 flex gap-3">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={filters.search} onChange={e => { setFilters({ ...filters, search: e.target.value }); setPage(1); }} className="input-field pl-10" placeholder="Search jobs..." />
              </div>
              <div className="relative flex-1 max-w-xs">
                <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={filters.location} onChange={e => { setFilters({ ...filters, location: e.target.value }); setPage(1); }} className="input-field pl-10" placeholder="Location" />
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className={`btn-secondary flex items-center gap-2 ${showFilters ? 'bg-green-50 dark:bg-green-900/30' : ''}`}><FiSliders /> Filters</button>
            </div>
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">{initials}</div>
                  <FiChevronDown className={`text-slate-500 text-sm transition ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.profile?.firstName} {user.profile?.lastName}</p>
                      <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                    </div>
                    <Link href={dashboardHref} onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">Dashboard</Link>
                    <button onClick={() => { setDropdownOpen(false); logout(); window.location.href = '/'; }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition w-full text-left">Logout</button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
          {showFilters && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl grid grid-cols-2 md:grid-cols-5 gap-3">
              <select value={filters.category} onChange={e => { setFilters({ ...filters, category: e.target.value }); setPage(1); }} className="input-field text-sm">
                <option value="">All Categories</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <select value={filters.employmentType} onChange={e => { setFilters({ ...filters, employmentType: e.target.value }); setPage(1); }} className="input-field text-sm">
                <option value="">All Types</option>
                {['full-time', 'part-time', 'contract', 'internship', 'remote'].map(t => <option key={t} className="capitalize">{t}</option>)}
              </select>
              <select value={filters.experienceLevel} onChange={e => { setFilters({ ...filters, experienceLevel: e.target.value }); setPage(1); }} className="input-field text-sm">
                <option value="">All Levels</option>
                {['entry', 'mid', 'senior', 'lead', 'executive'].map(l => <option key={l} className="capitalize">{l}</option>)}
              </select>
              <input value={filters.salaryMin} onChange={e => { setFilters({ ...filters, salaryMin: e.target.value }); setPage(1); }} className="input-field text-sm" placeholder="Min salary" type="number" />
              <input value={filters.salaryMax} onChange={e => { setFilters({ ...filters, salaryMax: e.target.value }); setPage(1); }} className="input-field text-sm" placeholder="Max salary" type="number" />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-500">{total} jobs found</p>
          {hasFilters && <button onClick={clearFilters} className="text-sm text-red-500 hover:underline flex items-center gap-1"><FiX /> Clear filters</button>}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map(job => (
            <Link key={job._id} href={`/jobs/${job._id}`} className="card card-hover group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-green-50 dark:bg-green-900/50 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <FiBriefcase className="text-green-600 dark:text-green-400 text-xl" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate group-hover:text-green-600 transition">{job.title}</h3>
                    {job.featured && <span className="badge badge-primary text-xs">Featured</span>}
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{job.companyName}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><FiMapPin /> {job.location}</span>
                    <span className="flex items-center gap-1"><FiClock /> {job.employmentType}</span>
                    <span className="badge badge-primary text-xs">{job.experienceLevel}</span>
                  </div>
                  {job.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {job.skills.slice(0, 3).map((s: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-600 dark:text-slate-400">{s}</span>
                      ))}
                      {job.skills.length > 3 && <span className="text-xs text-slate-400">+{job.skills.length - 3}</span>}
                    </div>
                  )}
                  {(job.website || job.phone || job.email) && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-1">
                      <p className="text-xs font-medium text-slate-500">Company Contact</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
                        {job.website && <span><span className="text-slate-500">Web:</span> {job.website}</span>}
                        {job.phone && <span><span className="text-slate-500">Tel:</span> {job.phone}</span>}
                        {job.email && <span className="truncate"><span className="text-slate-500">Email:</span> {job.email}</span>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="card text-center py-16">
            <FiSearch className="text-5xl text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your search filters</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        )}

        {total > 12 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(total / 12) }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-lg text-sm font-medium transition ${page === i + 1 ? 'bg-green-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Jobs() {
  return <Suspense><JobsPage /></Suspense>;
}
