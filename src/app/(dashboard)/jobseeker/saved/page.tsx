'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usersAPI } from '@/lib/api';
import { FiBookmark, FiMapPin, FiClock, FiArrowRight, FiHeart } from 'react-icons/fi';

export default function SavedJobs() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    usersAPI.getSavedJobs().then(res => setJobs(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Saved Jobs</h1>
        <p className="text-slate-500 dark:text-slate-400">Jobs you&apos;ve bookmarked</p>
      </div>

      {jobs.length === 0 ? (
        <div className="card text-center py-12">
          <FiHeart className="text-4xl text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">No saved jobs yet</p>
          <Link href="/jobs" className="btn-primary inline-flex items-center gap-2">Browse Jobs <FiArrowRight /></Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job: any) => (
            <Link key={job._id} href={`/jobs/${job._id}`} className="card card-hover group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiBookmark className="text-green-600 dark:text-green-400 text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold group-hover:text-green-600 transition truncate">{job.title}</h3>
                  <p className="text-sm text-slate-500 mb-2">{job.companyName}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><FiMapPin /> {job.location}</span>
                    <span className="flex items-center gap-1"><FiClock /> {job.employmentType}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
