'use client';

import { useEffect, useState } from 'react';
import { adminAPI, jobsAPI } from '@/lib/api';
import { FiBriefcase, FiCheckCircle, FiXCircle, FiEye } from 'react-icons/fi';

export default function AdminJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    adminAPI.getAllJobs({ status: filter || undefined, page }).then(res => {
      setJobs(res.data.jobs);
      setTotal(res.data.total);
    });
  }, [filter, page]);

  const updateStatus = async (id: string, status: string) => {
    await jobsAPI.approveJob(id, status);
    adminAPI.getAllJobs({ status: filter || undefined, page }).then(res => setJobs(res.data.jobs));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Jobs</h1>
        <p className="text-slate-500 dark:text-slate-400">Total jobs: {total}</p>
      </div>

      <div className="flex gap-2">
        {['', 'pending', 'approved', 'rejected', 'closed'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${filter === s ? 'bg-green-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>{s || 'All'}</button>
        ))}
      </div>

      <div className="space-y-3">
        {jobs.length === 0 ? (
          <div className="card text-center py-12"><FiBriefcase className="text-4xl text-slate-300 mx-auto mb-3" /><p className="text-slate-500">No jobs found</p></div>
        ) : jobs.map((job: any) => (
          <div key={job._id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold">{job.title}</h3>
                  <span className={`badge text-xs ${job.status === 'approved' ? 'badge-green' : job.status === 'pending' ? 'badge-yellow' : job.status === 'rejected' ? 'badge-red' : 'badge-slate'}`}>{job.status}</span>
                </div>
                <p className="text-sm text-slate-500">{job.companyName} · {job.location} · {job.employmentType}</p>
                <p className="text-xs text-slate-400">Posted by: {job.postedBy?.company?.name || job.postedBy?.email} · {new Date(job.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                {job.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(job._id, 'approved')} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 text-green-600"><FiCheckCircle /> Approve</button>
                    <button onClick={() => updateStatus(job._id, 'rejected')} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 text-red-500"><FiXCircle /> Reject</button>
                  </>
                )}
                <a href={`/jobs/${job._id}`} target="_blank" className="btn-secondary text-xs py-1.5 px-3"><FiEye /> View</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
