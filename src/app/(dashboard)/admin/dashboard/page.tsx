'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import { FiUsers, FiBriefcase, FiFileText, FiTrendingUp, FiUserCheck } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    adminAPI.getDashboard().then(res => setStats(res.data));
  }, []);

  if (!stats) return <div className="animate-pulse space-y-6">
    <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
    <div className="grid grid-cols-4 gap-4">
      {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>)}
    </div>
  </div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Full platform overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Job Seekers', value: stats.totalUsers, icon: FiUsers, color: 'text-green-600 bg-green-50 dark:bg-green-900/50' },
          { label: 'Employers', value: stats.totalEmployers, icon: FiUserCheck, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/50' },
          { label: 'Total Jobs', value: stats.totalJobs, icon: FiBriefcase, color: 'text-green-600 bg-green-100 dark:bg-green-900/50' },
          { label: 'Applications', value: stats.totalApplications, icon: FiFileText, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/50' },
        ].map((stat, i) => (
          <div key={i} className="card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-4">Jobs by Status</h2>
          <div className="space-y-3">
            {stats.jobsByStatus?.map((item: any) => (
              <div key={item._id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <span className="capitalize font-medium">{item._id}</span>
                <span className="badge text-xs">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="font-semibold mb-4">Applications by Status</h2>
          <div className="space-y-3">
            {stats.applicationsByStatus?.map((item: any) => (
              <div key={item._id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <span className="capitalize font-medium">{item._id}</span>
                <span className="badge text-xs">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">Monthly Applications</h2>
        <div className="flex items-end gap-3 h-40">
          {stats.monthlyStats?.map((item: any) => {
            const max = Math.max(...stats.monthlyStats.map((m: any) => m.count));
            const height = (item.count / max) * 100;
            return (
              <div key={item._id} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium">{item.count}</span>
                <div className="w-full bg-green-500 rounded-t-lg transition-all" style={{ height: `${height}%` }}></div>
                <span className="text-xs text-slate-500">{item._id.slice(5)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
