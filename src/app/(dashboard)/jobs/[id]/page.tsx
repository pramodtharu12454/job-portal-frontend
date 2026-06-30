'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { jobsAPI, applicationsAPI, usersAPI } from '@/lib/api';
import { FiBriefcase, FiMapPin, FiClock, FiDollarSign, FiUsers, FiHeart, FiSend, FiArrowLeft, FiCheck, FiFileText, FiCalendar, FiUser, FiDownload, FiEye, FiPhone, FiGlobe, FiMail } from 'react-icons/fi';

export default function JobDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = (Array.isArray(params.id) ? params.id[0] : params.id) as string;
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [educationFile, setEducationFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const isEmployee = user?.role === 'employee';
  const isJobseeker = user?.role === 'jobseeker';

  useEffect(() => {
    if (!id) return;
    jobsAPI.getJob(id).then(res => {
      setJob(res.data);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (user && job) {
      setFullName(`${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim());
      setAge(user.profile?.age?.toString() || '');
      setAddress(user.profile?.address || '');
      setPhone(user.profile?.phone || '');
      setSaved(user.savedJobs?.includes(job._id));
      applicationsAPI.getApplications().then(res => {
        setApplied(res.data.some((a: any) => a.job?._id === job._id));
      });
    }
  }, [user, job]);

  const handleApply = async () => {
    if (!user) { router.push('/login'); return; }
    setApplying(true);
    try {
      const fd = new FormData();
      fd.append('fullName', fullName);
      fd.append('age', age);
      fd.append('address', address);
      fd.append('phone', phone);
      if (user?.profile?.photo) fd.append('profileImage', user.profile.photo);
      if (educationFile) fd.append('educationDoc', educationFile);
      if (cvFile) fd.append('cv', cvFile);
      await applicationsAPI.apply(job._id, fd);
      setApplied(true);
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    await usersAPI.saveJob(job._id);
    setSaved(!saved);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  if (!job) return <div className="min-h-screen flex items-center justify-center"><p>Job not found</p></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button onClick={() => router.back()} className="btn-secondary p-2 mb-4 inline-flex"><FiArrowLeft /></button>

        <div className="card mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-green-50 dark:bg-green-900/50 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiBriefcase className="text-green-600 dark:text-green-400 text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
                <p className="text-lg text-slate-500 mb-3">{job.companyName}</p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><FiMapPin /> {job.location}</span>
                  <span className="flex items-center gap-1"><FiClock /> {job.employmentType}</span>
                  <span className="flex items-center gap-1"><FiDollarSign /> {job.salary?.min && job.salary?.max ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}/${job.salary.period}` : 'Salary not disclosed'}</span>
                  <span className="flex items-center gap-1"><FiUsers /> {job.applicationsCount} applicants</span>
                  <span className="flex items-center gap-1"><FiCalendar /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleSave} className={`btn-secondary p-3 ${saved ? 'text-red-500' : ''}`}><FiHeart className={saved ? 'fill-current' : ''} /></button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="font-semibold text-lg mb-4">Job Description</h2>
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line">{job.description}</p>
            </div>

            {job.responsibilities?.length > 0 && (
              <div className="card">
                <h2 className="font-semibold text-lg mb-4">Responsibilities</h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                      <FiCheck className="text-green-500 mt-1 flex-shrink-0" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements?.length > 0 && (
              <div className="card">
                <h2 className="font-semibold text-lg mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                      <FiCheck className="text-green-500 mt-1 flex-shrink-0" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits?.length > 0 && (
              <div className="card">
                <h2 className="font-semibold text-lg mb-4">Benefits</h2>
                <ul className="space-y-2">
                  {job.benefits.map((b: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                      <FiCheck className="text-purple-500 mt-1 flex-shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.skills?.length > 0 && (
              <div className="card">
                <h2 className="font-semibold text-lg mb-4">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="card sticky top-6">
              {applied ? (
                <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-lg text-center">
                  <FiCheck className="text-2xl mx-auto mb-2" />
                  <p className="font-medium">Application Received</p>
                  <p className="text-sm mt-1">Your application has been submitted</p>
                </div>
              ) : user && isEmployee ? (
                <>
                  <h2 className="font-semibold mb-4">Apply for this position</h2>
                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name *</label>
                      <input value={fullName} onChange={e => setFullName(e.target.value)} className="input-field" placeholder="Your full name" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Age</label>
                      <input type="number" value={age} onChange={e => setAge(e.target.value)} className="input-field" placeholder="Your age" min="1" max="150" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="input-field" placeholder="Your phone number" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <textarea value={address} onChange={e => setAddress(e.target.value)} className="input-field h-20" placeholder="Your current address" />
                    </div>
                    <div className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg">
                      Your skills, experience, and education from your profile will be included automatically with your application.
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Profile Image</label>
                      {user?.profile?.photo ? (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                          <img src={user.profile.photo} alt="" className="w-10 h-10 rounded-full object-cover" />
                          <span className="text-sm text-slate-500">Using your profile photo</span>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400 italic">Add a photo in <a href="/employee/profile" className="text-green-600 hover:underline">your profile</a></p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CV / Resume <span className="text-slate-400 font-normal">(PDF, JPG, PNG)</span></label>
                      <label className="flex items-center gap-2 p-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-green-400 transition">
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => { const f = e.target.files?.[0]; if (f) setCvFile(f); }} className="hidden" />
                        <FiFileText className="text-slate-400" />
                        <span className="text-sm text-slate-500 truncate">{cvFile ? cvFile.name : 'Upload CV'}</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Educational Document <span className="text-slate-400 font-normal">(PDF, JPG, PNG)</span></label>
                      <label className="flex items-center gap-2 p-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-green-400 transition">
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => { const f = e.target.files?.[0]; if (f) setEducationFile(f); }} className="hidden" />
                        <FiFileText className="text-slate-400" />
                        <span className="text-sm text-slate-500 truncate">{educationFile ? educationFile.name : 'Upload document'}</span>
                      </label>
                    </div>
                  </div>
                  <button onClick={handleApply} disabled={applying || !fullName.trim()} className="btn-primary w-full flex items-center justify-center gap-2 mb-3">
                    <FiSend /> {applying ? 'Applying...' : 'Apply Now'}
                  </button>
                </>
              ) : user && isJobseeker ? (
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg text-center">
                  <FiBriefcase className="text-3xl text-slate-300 mx-auto mb-2" />
                  <p className="font-medium text-slate-500">Recruiters cannot apply</p>
                  <p className="text-sm text-slate-400 mt-1">This option is for job seekers only</p>
                </div>
              ) : (
                <>
                  <h2 className="font-semibold mb-4">Apply for this position</h2>
                  <p className="text-sm text-slate-500 text-center py-4">You need to <a href="/login" className="text-green-600 hover:underline">sign in</a> to apply</p>
                </>
              )}

              {(job.website || job.phone || job.email) && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-sm mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm text-slate-500">
                    {job.website && <div className="flex items-center gap-2"><FiGlobe className="text-green-500 flex-shrink-0" /><a href={job.website.startsWith('http') ? job.website : `https://${job.website}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline truncate">{job.website}</a></div>}
                    {job.phone && <div className="flex items-center gap-2"><FiPhone className="text-green-500 flex-shrink-0" /><span>{job.phone}</span></div>}
                    {job.email && <div className="flex items-center gap-2"><FiMail className="text-green-500 flex-shrink-0" /><a href={`mailto:${job.email}`} className="text-green-600 hover:underline">{job.email}</a></div>}
                  </div>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-sm mb-2">Job Overview</h3>
                <div className="space-y-2 text-sm text-slate-500">
                  <div className="flex justify-between"><span>Experience</span><span className="capitalize font-medium text-slate-700 dark:text-slate-300">{job.experienceLevel}</span></div>
                  <div className="flex justify-between"><span>Category</span><span className="font-medium text-slate-700 dark:text-slate-300">{job.category?.name || 'General'}</span></div>
                  <div className="flex justify-between"><span>Positions</span><span className="font-medium text-slate-700 dark:text-slate-300">{job.positions}</span></div>
                  {job.applicationDeadline && <div className="flex justify-between"><span>Deadline</span><span className="font-medium text-slate-700 dark:text-slate-300">{new Date(job.applicationDeadline).toLocaleDateString()}</span></div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
