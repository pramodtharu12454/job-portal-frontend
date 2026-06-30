'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { jobsAPI, applicationsAPI } from '@/lib/api';
import { FiBriefcase, FiEye, FiUsers, FiEdit2, FiTrash2, FiPlus, FiChevronDown, FiChevronUp, FiFileText, FiCheckCircle, FiXCircle, FiStar, FiDownload, FiUser, FiMapPin, FiCalendar, FiPhone } from 'react-icons/fi';

export default function MyJobPosts() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [loadingApps, setLoadingApps] = useState(false);

  useEffect(() => { jobsAPI.getMyJobs().then(res => setJobs(res.data.jobs)); }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this job posting?')) {
      await jobsAPI.deleteJob(id);
      setJobs(jobs.filter(j => j._id !== id));
    }
  };

  const toggleExpand = async (jobId: string) => {
    if (expandedJob === jobId) {
      setExpandedJob(null);
      return;
    }
    setExpandedJob(jobId);
    setLoadingApps(true);
    try {
      const res = await applicationsAPI.getApplications({ jobId });
      setApplications(res.data);
    } finally {
      setLoadingApps(false);
    }
  };

  const updateStatus = async (appId: string, status: string) => {
    await applicationsAPI.updateStatus(appId, { status });
    const res = await applicationsAPI.getApplications({ jobId: expandedJob! });
    setApplications(res.data);
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = { pending: 'badge-yellow', shortlisted: 'badge-primary', hired: 'badge-green', rejected: 'badge-red', reviewed: 'badge-purple' };
    return <span className={`badge text-xs ${map[s] || 'badge-yellow'}`}>{s}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Job Posts</h1>
          <p className="text-slate-500 dark:text-slate-400">Jobs you have posted and their applications</p>
        </div>
        <Link href="/jobseeker/post-job" className="btn-primary flex items-center gap-2"><FiPlus /> Post a Job</Link>
      </div>

      {jobs.length === 0 ? (
        <div className="card text-center py-12">
          <FiBriefcase className="text-4xl text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">No jobs posted yet</p>
          <Link href="/jobseeker/post-job" className="btn-primary">Post Your First Job</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job: any) => (
            <div key={job._id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold">{job.title}</h3>
                    {statusBadge(job.status)}
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{job.companyName} · {job.location} · {job.employmentType}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><FiEye /> {job.views} views</span>
                    <span className="flex items-center gap-1"><FiUsers /> {job.applicationsCount} applicants</span>
                    <span className="text-xs">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleExpand(job._id)} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
                    {expandedJob === job._id ? <><FiChevronUp /> Hide</> : <><FiChevronDown /> Applications</>}
                  </button>
                  <Link href={`/jobseeker/post-job?id=${job._id}`} className="btn-secondary text-xs py-1.5 px-3"><FiEdit2 /></Link>
                  <button onClick={() => handleDelete(job._id)} className="btn-secondary text-xs py-1.5 px-3 text-red-500"><FiTrash2 /></button>
                </div>
              </div>

              {expandedJob === job._id && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="font-medium text-sm mb-3">Applications Received ({applications.filter(a => a.job?._id === job._id).length})</h4>
                  {loadingApps ? (
                    <p className="text-sm text-slate-400 text-center py-4">Loading...</p>
                  ) : applications.filter(a => a.job?._id === job._id).length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">No applications yet</p>
                  ) : (
                    <div className="space-y-3">
                      {applications.filter(a => a.job?._id === job._id).map((app: any) => (
                        <div key={app._id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {app.profileImage ? (
                                <img src={app.profileImage} alt="" className="w-full h-full object-cover" />
                              ) : app.applicant?.profile?.photo ? (
                                <img src={app.applicant.profile.photo} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <FiUser className="text-xl text-green-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold">{app.fullName || `${app.applicant?.profile?.firstName || ''} ${app.applicant?.profile?.lastName || ''}`}</h3>
                                {statusBadge(app.status)}
                              </div>
                              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-600 dark:text-slate-400 mb-3">
                                {app.age && <span>Age: {app.age}</span>}
                                {app.phone && <span className="flex items-center gap-1"><FiPhone /> {app.phone}</span>}
                                {app.address && <span className="flex items-center gap-1 col-span-2"><FiMapPin /> {app.address}</span>}
                                <span className="flex items-center gap-1"><FiCalendar /> Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                              </div>

                              {(app.cv || app.educationDoc) && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {app.cv && (
                                    <a href={`http://localhost:5000${app.cv}`} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
                                      <FiDownload /> View CV
                                    </a>
                                  )}
                                  {app.educationDoc && (
                                    <a href={`http://localhost:5000${app.educationDoc}`} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
                                      <FiDownload /> View Education Document
                                    </a>
                                  )}
                                </div>
                              )}

                              {app.applicant?.profile?.skills?.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-xs font-medium text-slate-500 mb-1">Skills</p>
                                  <div className="flex flex-wrap gap-1">
                                    {app.applicant.profile.skills.map((s: string, i: number) => (
                                      <span key={i} className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs">{s}</span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {app.applicant?.profile?.experience?.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-xs font-medium text-slate-500 mb-1">Experience</p>
                                  {app.applicant.profile.experience.slice(0, 2).map((exp: any, i: number) => (
                                    <p key={i} className="text-xs text-slate-500">{exp.position} at {exp.company} {exp.startDate && `(${new Date(exp.startDate).getFullYear()}${exp.endDate ? `-${new Date(exp.endDate).getFullYear()}` : '-Present'})`}</p>
                                  ))}
                                </div>
                              )}

                              {app.applicant?.profile?.education?.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-xs font-medium text-slate-500 mb-1">Education</p>
                                  {app.applicant.profile.education.slice(0, 2).map((edu: any, i: number) => (
                                    <p key={i} className="text-xs text-slate-500">{edu.degree} in {edu.field} at {edu.institution}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {app.status === 'pending' && (
                                <>
                                  <button onClick={() => updateStatus(app._id, 'shortlisted')} className="btn-secondary text-xs py-1 px-2 text-green-600" title="Shortlist"><FiStar /></button>
                                  <button onClick={() => updateStatus(app._id, 'hired')} className="btn-secondary text-xs py-1 px-2 text-green-600" title="Hire"><FiCheckCircle /></button>
                                  <button onClick={() => updateStatus(app._id, 'rejected')} className="btn-secondary text-xs py-1 px-2 text-red-500" title="Reject"><FiXCircle /></button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
