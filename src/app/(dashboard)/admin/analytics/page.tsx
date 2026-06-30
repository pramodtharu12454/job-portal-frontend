'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import { FiTrendingUp, FiUsers, FiBriefcase, FiFileText, FiCalendar } from 'react-icons/fi';

export default function AdminAnalytics() {
  const [stats, setStats] = useState<any>(null);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    adminAPI.getDashboard().then(res => setStats(res.data));
  }, []);

  if (!stats) return <div className="animate-pulse space-y-6">
    {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>)}
  </div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">Platform performance and metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Job Seekers', value: stats.totalUsers, icon: FiUsers, change: '+12%', color: 'blue' },
          { label: 'Total Employees', value: stats.totalEmployers, icon: FiBriefcase, change: '+8%', color: 'purple' },
          { label: 'Active Jobs', value: stats.totalJobs, icon: FiFileText, change: '+15%', color: 'green' },
          { label: 'Applications', value: stats.totalApplications, icon: FiTrendingUp, change: '+23%', color: 'orange' },
        ].map((item, i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${item.color}-100 dark:bg-${item.color}-900/30`}>
                <item.icon className={`text-${item.color}-600 dark:text-${item.color}-400 text-xl`} />
              </div>
              <span className="text-sm text-green-600 font-medium">{item.change}</span>
            </div>
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-sm text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-4">Recent Users</h2>
          <div className="space-y-3">
            {stats.recentUsers?.map((u: any) => (
              <div key={u._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <div className="w-8 h-8 bg-green-50 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                  <FiUsers className="text-green-600 text-sm" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{u.profile?.firstName || 'N/A'} {u.profile?.lastName || ''}</p>
                  <p className="text-xs text-slate-400">{u.email} · {u.role}</p>
                </div>
                <span className="text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Recent Jobs</h2>
          <div className="space-y-3">
            {stats.recentJobs?.map((j: any) => (
              <div key={j._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                  <FiBriefcase className="text-green-600 text-sm" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{j.title}</p>
                  <p className="text-xs text-slate-400">{j.postedBy?.company?.name} · {j.status}</p>
                </div>
                <span className={`badge text-xs ${j.status === 'approved' ? 'badge-green' : j.status === 'pending' ? 'badge-yellow' : 'badge-red'}`}>{j.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold">Monthly Trends</h2>
          <select value={period} onChange={e => setPeriod(e.target.value)} className="input-field w-auto text-sm">
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div className="flex items-end gap-2 h-48">
          {stats.monthlyStats?.map((item: any) => {
            const max = Math.max(...stats.monthlyStats.map((m: any) => m.count), 1);
            const height = (item.count / max) * 100;
            return (
              <div key={item._id} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition bg-slate-900 text-white text-xs px-2 py-1 rounded">
                  {item.count} applications
                </div>
                <div className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all hover:from-green-600" style={{ height: `${Math.max(height, 2)}%` }}></div>
                <span className="text-xs text-slate-500">{item._id.slice(5)}/{item._id.slice(2, 4)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
