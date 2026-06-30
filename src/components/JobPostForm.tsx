'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { jobsAPI, categoriesAPI, uploadAPI } from '@/lib/api';
import { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiCamera, FiBriefcase } from 'react-icons/fi';

export default function JobPostForm({ editId, redirectTo }: { editId?: string; redirectTo: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    title: '', description: '', category: '', employmentType: 'full-time',
    experienceLevel: 'mid', location: '', salary: { min: '', max: '', currency: 'USD', period: 'yearly' },
    skills: [], requirements: [''], responsibilities: [''], benefits: [''],
    applicationDeadline: '', positions: 1, companyName: '', companyLogo: '', website: '', phone: '', email: '',
  });
  const [newSkill, setNewSkill] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    categoriesAPI.getCategories().then(res => setCategories(res.data));
    if (editId) {
      jobsAPI.getJob(editId).then(res => {
        const j = res.data;
        setForm({
          title: j.title, description: j.description, category: j.category?._id || '',
          employmentType: j.employmentType, experienceLevel: j.experienceLevel,
          location: j.location, salary: j.salary || { min: '', max: '', currency: 'USD', period: 'yearly' },
          skills: j.skills || [], requirements: j.requirements?.length ? j.requirements : [''],
          responsibilities: j.responsibilities?.length ? j.responsibilities : [''],
          benefits: j.benefits?.length ? j.benefits : [''],
          applicationDeadline: j.applicationDeadline?.split('T')[0] || '',
          positions: j.positions || 1, companyName: j.companyName || '', companyLogo: j.companyLogo || '',
        });
      });
    } else {
      const company = user?.company;
      setForm((prev: any) => ({
        ...prev,
        companyName: company?.name || '',
        companyLogo: company?.logo || '',
        website: company?.website || '',
        phone: company?.phone || '',
        email: company?.email || user?.email || '',
        location: company?.location || prev.location,
      }));
    }
  }, [editId, user]);

  const update = (field: string, value: any) => setForm((prev: any) => ({ ...prev, [field]: value }));
  const addSkill = () => { if (newSkill.trim()) { update('skills', [...form.skills, newSkill.trim()]); setNewSkill(''); } };
  const removeSkill = (i: number) => update('skills', form.skills.filter((_: any, idx: number) => idx !== i));
  const addListItem = (key: string) => update(key, [...form[key], '']);
  const updateListItem = (key: string, i: number, value: string) => {
    const items = [...form[key]]; items[i] = value; update(key, items);
  };
  const removeListItem = (key: string, i: number) => update(key, form[key].filter((_: any, idx: number) => idx !== i));

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await uploadAPI.jobImage(fd);
      update('companyLogo', res.data.url);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      salary: {
        min: form.salary.min ? Number(form.salary.min) : undefined,
        max: form.salary.max ? Number(form.salary.max) : undefined,
        currency: form.salary.currency,
        period: form.salary.period,
      },
      requirements: form.requirements.filter((r: string) => r.trim()),
      responsibilities: form.responsibilities.filter((r: string) => r.trim()),
      benefits: form.benefits.filter((b: string) => b.trim()),
      positions: Number(form.positions),
    };

    if (editId) {
      await jobsAPI.updateJob(editId, payload);
    } else {
      await jobsAPI.createJob(payload);
    }
    router.push(redirectTo);
  };

  return (
    <div className="max-w-4xl">
      <button onClick={() => router.back()} className="btn-secondary p-2 mb-4 inline-flex"><FiArrowLeft /></button>
      <h1 className="text-2xl font-bold mb-6">{editId ? 'Edit Job' : 'Post a New Job'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <h2 className="font-semibold">Company Information</h2>
          {user?.company?.name && (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
              <div className="relative group">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                  {form.companyLogo ? (
                    <img src={form.companyLogo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <FiBriefcase className="text-2xl text-green-600 dark:text-green-400" />
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 cursor-pointer transition">
                  <FiCamera className="text-white text-sm" />
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
              <div className="flex-1">
                <p className="font-semibold">{user.company.name}</p>
                {user.company.industry && <p className="text-sm text-green-600">{user.company.industry}</p>}
                {user.company.location && <p className="text-xs text-slate-500">{user.company.location}</p>}
              </div>
              <div className="text-right">
                <p className="text-xs text-green-600 font-medium">Auto-filled from company profile</p>
                <button onClick={() => update('companyLogo', '')} type="button" className="text-xs text-red-500 hover:underline mt-1">Change image</button>
              </div>
            </div>
          )}
          <div className="flex items-center gap-6">
            <div className="relative group flex-shrink-0">
              <div className="w-20 h-20 bg-green-50 dark:bg-green-900/50 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-600">
                {form.companyLogo ? (
                  <img src={form.companyLogo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <FiBriefcase className="text-3xl text-green-600 dark:text-green-400" />
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition">
                <FiCamera className="text-white text-lg" />
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Company Image / Logo</p>
              <p className="text-xs text-slate-400 mt-1">Upload a company image to make your job post stand out</p>
              {uploading && <p className="text-xs text-green-600 mt-1">Uploading...</p>}
              {form.companyLogo && (
                <button onClick={() => update('companyLogo', '')} type="button" className="text-xs text-red-500 hover:underline mt-1">Remove image</button>
              )}
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Company Name *</label>
              <input value={form.companyName} onChange={e => update('companyName', e.target.value)} className="input-field" placeholder="Your company or business name" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Job Title *</label>
              <input value={form.title} onChange={e => update('title', e.target.value)} className="input-field" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea value={form.description} onChange={e => update('description', e.target.value)} className="input-field h-32" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select value={form.category} onChange={e => update('category', e.target.value)} className="input-field">
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Employment Type *</label>
              <select value={form.employmentType} onChange={e => update('employmentType', e.target.value)} className="input-field">
                {['full-time', 'part-time', 'contract', 'internship', 'remote'].map(t => <option key={t} className="capitalize">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Experience Level</label>
              <select value={form.experienceLevel} onChange={e => update('experienceLevel', e.target.value)} className="input-field">
                {['entry', 'mid', 'senior', 'lead', 'executive'].map(l => <option key={l} className="capitalize">{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location *</label>
              <input value={form.location} onChange={e => update('location', e.target.value)} className="input-field" required />
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold">Salary</h2>
          <div className="grid grid-cols-4 gap-3">
            <input value={form.salary.min} onChange={e => update('salary', { ...form.salary, min: e.target.value })} className="input-field" placeholder="Min" type="number" />
            <input value={form.salary.max} onChange={e => update('salary', { ...form.salary, max: e.target.value })} className="input-field" placeholder="Max" type="number" />
            <select value={form.salary.currency} onChange={e => update('salary', { ...form.salary, currency: e.target.value })} className="input-field">
              {['USD', 'EUR', 'GBP', 'INR'].map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={form.salary.period} onChange={e => update('salary', { ...form.salary, period: e.target.value })} className="input-field">
              {['hourly', 'monthly', 'yearly'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold">Skills</h2>
          <div className="flex gap-2">
            <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} className="input-field flex-1" placeholder="Type a skill and press Enter" />
            <button onClick={addSkill} type="button" className="btn-secondary"><FiPlus /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.skills.map((s: string, i: number) => (
              <span key={i} className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-sm">
                {s} <button onClick={() => removeSkill(i)} type="button" className="text-red-500">&times;</button>
              </span>
            ))}
          </div>
        </div>

        {['requirements', 'responsibilities', 'benefits'].map(section => (
          <div key={section} className="card space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold capitalize">{section}</h2>
              <button onClick={() => addListItem(section)} type="button" className="btn-secondary text-sm flex items-center gap-1"><FiPlus /> Add</button>
            </div>
            {form[section].map((item: string, i: number) => (
              <div key={i} className="flex gap-2">
                <input value={item} onChange={e => updateListItem(section, i, e.target.value)} className="input-field flex-1" placeholder={`Add ${section.slice(0, -1)}`} />
                {form[section].length > 1 && <button onClick={() => removeListItem(section, i)} type="button" className="btn-secondary p-2"><FiTrash2 /></button>}
              </div>
            ))}
          </div>
        ))}

        <div className="card space-y-4">
          <h2 className="font-semibold">Additional Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input value={form.website} onChange={e => update('website', e.target.value)} className="input-field" placeholder="https://" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className="input-field" placeholder="Contact number" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="input-field" placeholder="Contact email" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Application Deadline</label>
              <input type="date" value={form.applicationDeadline} onChange={e => update('applicationDeadline', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Number of Positions</label>
              <input type="number" value={form.positions} onChange={e => update('positions', e.target.value)} className="input-field" min={1} />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary flex items-center gap-2"><FiSave /> {editId ? 'Update Job' : 'Post Job'}</button>
      </form>
    </div>
  );
}
