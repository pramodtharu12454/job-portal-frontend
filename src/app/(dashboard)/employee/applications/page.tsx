'use client';

import { useEffect, useState } from 'react';
import { applicationsAPI } from '@/lib/api';
import { FiFileText, FiCheckCircle, FiClock, FiXCircle, FiStar } from 'react-icons/fi';

export default function EmployeeApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    applicationsAPI.getApplications({ status: filter || undefined }).then(res => setApplications(res.data));
  }, [filter]);

  const statusIcon = (status: string) => {
    switch (status) {
      case 'hired': return <FiCheckCircle className="text-green-500" />;
      case 'shortlisted': return <FiStar className="text-green-500" />;
      case 'rejected': return <FiXCircle className="text-red-500" />;
      default: return <FiClock className="text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Applications</h1>
        <p className="text-slate-500 dark:text-slate-400">Track your job applications</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['', 'pending', 'reviewed', 'shortlisted', 'rejected', 'hired'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === s ? 'bg-green-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {applications.length === 0 ? (
          <div className="card text-center py-12">
            <FiFileText className="text-4xl text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No applications found</p>
          </div>
        ) : applications.map((app: any) => (
          <div key={app._id} className="card card-hover flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/50 rounded-xl flex items-center justify-center">
                {statusIcon(app.status)}
              </div>
              <div>
                <h3 className="font-semibold">{app.job?.title}</h3>
                <p className="text-sm text-slate-500">{app.job?.companyName} · {app.job?.location}</p>
                <p className="text-xs text-slate-400">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <span className={`badge ${app.status === 'pending' ? 'badge-yellow' : app.status === 'shortlisted' ? 'badge-primary' : app.status === 'hired' ? 'badge-green' : app.status === 'rejected' ? 'badge-red' : 'badge-purple'}`}>
              {app.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
