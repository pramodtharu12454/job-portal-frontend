'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { applicationsAPI } from '@/lib/api';
import { FiFileText, FiHeart, FiEye, FiArrowRight, FiBriefcase } from 'react-icons/fi';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ applications: 0, saved: 0, interviews: 0 });
  const [recentApps, setRecentApps] = useState<any[]>([]);

  useEffect(() => {
    applicationsAPI.getApplications().then(res => {
      const apps = res.data;
      setRecentApps(apps.slice(0, 5));
      setStats({
        applications: apps.length,
        saved: user?.savedJobs?.length || 0,
        interviews: apps.filter((a: any) => a.status === 'shortlisted').length,
      });
    });
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user?.profile?.firstName}!</h1>
        <p className="text-slate-500 dark:text-slate-400">Track your job applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Applications Sent', value: stats.applications, icon: FiFileText, color: 'text-green-600 bg-green-50 dark:bg-green-900/50' },
          { label: 'Saved Jobs', value: stats.saved, icon: FiHeart, color: 'text-red-600 bg-red-100 dark:bg-red-900/50' },
          { label: 'Interviews', value: stats.interviews, icon: FiEye, color: 'text-green-600 bg-green-100 dark:bg-green-900/50' },
        ].map((stat, i) => (
          <div key={i} className="card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}><stat.icon className="text-xl" /></div>
            <div><p className="text-2xl font-bold">{stat.value}</p><p className="text-sm text-slate-500">{stat.label}</p></div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent Applications</h2>
          <Link href="/employee/applications" className="text-sm text-green-600 hover:underline flex items-center gap-1">View All <FiArrowRight /></Link>
        </div>
        {recentApps.length === 0 ? (
          <p className="text-slate-500 text-sm py-8 text-center">No applications yet. <Link href="/jobs" className="text-green-600 hover:underline">Browse jobs</Link></p>
        ) : (
          <div className="space-y-3">
            {recentApps.map((app: any) => (
              <div key={app._id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <div>
                  <p className="font-medium text-sm">{app.job?.title}</p>
                  <p className="text-xs text-slate-500">{app.job?.companyName}</p>
                </div>
                <span className={`badge text-xs ${app.status === 'hired' ? 'badge-green' : app.status === 'shortlisted' ? 'badge-primary' : app.status === 'rejected' ? 'badge-red' : 'badge-yellow'}`}>{app.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
