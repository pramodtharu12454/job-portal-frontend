'use client';

import { useEffect, useState } from 'react';
import { applicationsAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { FiFileText, FiCheckCircle, FiClock, FiXCircle, FiStar, FiUserCheck, FiSend, FiUser, FiMapPin, FiDownload, FiPhone, FiCalendar } from 'react-icons/fi';

export default function Applications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [tab, setTab] = useState<'sent' | 'received'>('received');

  useEffect(() => {
    applicationsAPI.getApplications({ status: filter || undefined }).then(res => setApplications(res.data));
  }, [filter]);

  const sentApps = applications.filter((a: any) => a.applicant?._id === user?._id);
  const receivedApps = applications.filter((a: any) => a.applicant?._id !== user?._id);
  const displayApps = tab === 'sent' ? sentApps : receivedApps;

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
        <h1 className="text-2xl font-bold">Applications</h1>
        <p className="text-slate-500 dark:text-slate-400">Track your applications and received applications</p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab('sent')} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2 ${tab === 'sent' ? 'bg-green-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
          <FiSend /> Sent ({sentApps.length})
        </button>
        <button onClick={() => setTab('received')} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2 ${tab === 'received' ? 'bg-green-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
          <FiUserCheck /> Received ({receivedApps.length})
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['', 'pending', 'reviewed', 'shortlisted', 'rejected', 'hired'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === s ? 'bg-green-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {displayApps.length === 0 ? (
          <div className="card text-center py-12">
            <FiFileText className="text-4xl text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">{tab === 'sent' ? 'No applications sent yet' : 'No applications received yet'}</p>
          </div>
        ) : displayApps.map((app: any) => (
          <div key={app._id} className="card card-hover">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-green-50 dark:bg-green-900/50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                {tab === 'received' ? (
                  app.profileImage ? <img src={app.profileImage} alt="" className="w-full h-full object-cover" /> : app.applicant?.profile?.photo ? <img src={app.applicant.profile.photo} alt="" className="w-full h-full object-cover" /> : <FiUser className="text-xl text-green-600" />
                ) : (
                  statusIcon(app.status)
                )}
              </div>
              <div className="flex-1 min-w-0">
                {tab === 'sent' ? (
                  <>
                    <h3 className="font-semibold">{app.job?.title}</h3>
                    <p className="text-sm text-slate-500">{app.job?.companyName} · {app.job?.location}</p>
                    <p className="text-xs text-slate-400">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{app.fullName || `${app.applicant?.profile?.firstName || ''} ${app.applicant?.profile?.lastName || ''}`}</h3>
                      <span className={`badge text-xs ${app.status === 'pending' ? 'badge-yellow' : app.status === 'shortlisted' ? 'badge-primary' : app.status === 'hired' ? 'badge-green' : app.status === 'rejected' ? 'badge-red' : 'badge-purple'}`}>
                        {app.status === 'pending' ? 'Application Received' : app.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-2">Applied for {app.job?.title}</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {app.age && <span>Age: {app.age}</span>}
                      {app.phone && <span className="flex items-center gap-1"><FiPhone /> {app.phone}</span>}
                      {app.address && <span className="flex items-center gap-1 col-span-2"><FiMapPin /> {app.address}</span>}
                      <span className="flex items-center gap-1"><FiCalendar /> Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>

                    {(app.cv || app.educationDoc) && (
                      <div className="flex flex-wrap gap-2 mb-2">
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
                      <div className="mb-1">
                        <p className="text-xs font-medium text-slate-500 mb-1">Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {app.applicant.profile.skills.map((s: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {app.applicant?.profile?.experience?.length > 0 && (
                      <div className="mb-1">
                        <p className="text-xs font-medium text-slate-500 mb-1">Experience</p>
                        {app.applicant.profile.experience.slice(0, 2).map((exp: any, i: number) => (
                          <p key={i} className="text-xs text-slate-500">{exp.position} at {exp.company} ({new Date(exp.startDate).getFullYear()}{exp.endDate ? `-${new Date(exp.endDate).getFullYear()}` : '-Present'})</p>
                        ))}
                      </div>
                    )}

                    {app.applicant?.profile?.education?.length > 0 && (
                      <div className="mb-1">
                        <p className="text-xs font-medium text-slate-500 mb-1">Education</p>
                        {app.applicant.profile.education.slice(0, 2).map((edu: any, i: number) => (
                          <p key={i} className="text-xs text-slate-500">{edu.degree} in {edu.field} at {edu.institution}</p>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
              {tab === 'received' && (
                <div className="flex flex-col gap-1 flex-shrink-0">
                  {app.status === 'pending' && (
                    <>
                      <button onClick={async () => { await applicationsAPI.updateStatus(app._id, { status: 'shortlisted' }); applicationsAPI.getApplications({ status: filter || undefined }).then(res => setApplications(res.data)); }} className="btn-secondary text-xs py-1 px-2 text-green-600"><FiStar /></button>
                      <button onClick={async () => { await applicationsAPI.updateStatus(app._id, { status: 'hired' }); applicationsAPI.getApplications({ status: filter || undefined }).then(res => setApplications(res.data)); }} className="btn-secondary text-xs py-1 px-2 text-green-600"><FiCheckCircle /></button>
                      <button onClick={async () => { await applicationsAPI.updateStatus(app._id, { status: 'rejected' }); applicationsAPI.getApplications({ status: filter || undefined }).then(res => setApplications(res.data)); }} className="btn-secondary text-xs py-1 px-2 text-red-500"><FiXCircle /></button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
