'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { applicationsAPI, jobsAPI } from '@/lib/api';
import { FiBriefcase, FiUsers, FiUserPlus, FiArrowRight, FiEye, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function JobSeekerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ activeJobs: 0, totalApplicants: 0, newApplications: 0 });
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [recentApps, setRecentApps] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      jobsAPI.getMyJobs(),
      applicationsAPI.getApplications(),
    ]).then(([jobsRes, appsRes]) => {
      const jobs = jobsRes.data.jobs || [];
      const apps = appsRes.data || [];
      const activeJobs = jobs.filter((j: any) => j.status === 'approved');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const newApps = apps.filter((a: any) => new Date(a.createdAt) >= today);
      setStats({
        activeJobs: activeJobs.length,
        totalApplicants: apps.length,
        newApplications: newApps.length,
      });
      setRecentJobs(jobs.slice(0, 3));
      setRecentApps(apps.slice(0, 5));
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.profile?.firstName}!</h1>
        <p className="text-slate-500 dark:text-slate-400">Here&apos;s your recruitment overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Active Jobs', value: stats.activeJobs, icon: FiBriefcase, color: 'text-green-600 bg-green-50 dark:bg-green-900/50' },
          { label: 'Total Applicants', value: stats.totalApplicants, icon: FiUsers, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/50' },
          { label: 'New Today', value: stats.newApplications, icon: FiUserPlus, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/50' },
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Your Job Posts</h2>
            <Link href="/jobseeker/my-jobs" className="text-sm text-green-600 hover:underline flex items-center gap-1">View All <FiArrowRight /></Link>
          </div>
          {recentJobs.length === 0 ? (
            <p className="text-slate-500 text-sm py-8 text-center">No jobs posted yet. Post your first job!</p>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job: any) => (
                <div key={job._id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div>
                    <p className="font-medium text-sm">{job.title}</p>
                    <p className="text-xs text-slate-500">{job.employmentType} · {job.location}{job.category?.name && <span> · {job.category.name}</span>}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-slate-400"><FiUsers /> {job.applicationsCount || 0}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Applications</h2>
            <Link href="/jobseeker/applications" className="text-sm text-green-600 hover:underline flex items-center gap-1">View All <FiArrowRight /></Link>
          </div>
          {recentApps.length === 0 ? (
            <p className="text-slate-500 text-sm py-8 text-center">No applications received yet</p>
          ) : (
            <div className="space-y-3">
              {recentApps.map((app: any) => (
                <div key={app._id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div>
                    <p className="font-medium text-sm">{app.job?.title}</p>
                    <p className="text-xs text-slate-500">{app.fullName || 'Applicant'}</p>
                  </div>
                  <span className={`badge text-xs ${
                    app.status === 'hired' ? 'badge-green' :
                    app.status === 'shortlisted' ? 'badge-primary' :
                    app.status === 'rejected' ? 'badge-red' : 'badge-yellow'
                  }`}>{app.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
