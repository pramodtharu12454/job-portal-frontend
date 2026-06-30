'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authAPI, uploadAPI } from '@/lib/api';
import { FiSave, FiCamera, FiGlobe, FiMapPin, FiEdit2, FiX } from 'react-icons/fi';

export default function CompanyProfileForm() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(true);

  useEffect(() => {
    setForm(user?.company || {});
    if (user?.company?.name) setEditing(false);
  }, [user]);

  const hasCompany = !!user?.company?.name;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authAPI.updateProfile({ company: form });
      updateUser(res.data);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    const res = await uploadAPI.companyLogo(fd);
    updateUser(res.data.user);
  };

  if (!editing && hasCompany) {
    return (
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Company Profile</h1>
            <p className="text-slate-500 dark:text-slate-400">Your company information</p>
          </div>
          <button onClick={() => setEditing(true)} className="btn-primary flex items-center gap-2"><FiEdit2 /> Edit</button>
        </div>
        <div className="card space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-green-50 dark:bg-green-900/50 rounded-xl flex items-center justify-center overflow-hidden">
              {user?.company?.logo ? <img src={user.company.logo} alt="" className="w-full h-full object-cover" /> : <FiCamera className="text-3xl text-green-600 dark:text-green-400" />}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.company?.name}</h2>
              {user?.company?.industry && <p className="text-sm text-green-600">{user.company.industry}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="text-sm text-slate-500">Description</label><p className="font-medium">{user?.company?.description || 'No description'}</p></div>
            <div><label className="text-sm text-slate-500">Website</label><p className="font-medium">{user?.company?.website || 'Not set'}</p></div>
            <div><label className="text-sm text-slate-500">Phone</label><p className="font-medium">{user?.company?.phone || 'Not set'}</p></div>
            <div><label className="text-sm text-slate-500">Email</label><p className="font-medium">{user?.company?.email || 'Not set'}</p></div>
            <div><label className="text-sm text-slate-500">Industry</label><p className="font-medium">{user?.company?.industry || 'Not set'}</p></div>
            <div><label className="text-sm text-slate-500">Size</label><p className="font-medium">{user?.company?.size || 'Not set'}</p></div>
            <div><label className="text-sm text-slate-500">Location</label><p className="font-medium">{user?.company?.location || 'Not set'}</p></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{hasCompany ? 'Edit Company Profile' : 'Setup Company Profile'}</h1>
          <p className="text-slate-500 dark:text-slate-400">{hasCompany ? 'Update your company information' : 'Tell us about your company'}</p>
        </div>
        {hasCompany && <button onClick={() => { setEditing(false); setForm(user?.company || {}); }} className="btn-secondary flex items-center gap-2"><FiX /> Cancel</button>}
      </div>

      <div className="card space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-20 h-20 bg-green-50 dark:bg-green-900/50 rounded-xl flex items-center justify-center overflow-hidden">
              {user?.company?.logo ? <img src={user.company.logo} alt="" className="w-full h-full object-cover" /> : <FiCamera className="text-3xl text-green-600 dark:text-green-400" />}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 cursor-pointer transition">
              <FiCamera className="text-white" />
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.company?.name || 'Your Company'}</h2>
            <p className="text-slate-500">{user?.company?.industry || 'Industry not set'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field h-24" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <div className="relative"><FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={form.website || ''} onChange={e => setForm({ ...form, website: e.target.value })} className="input-field pl-10" placeholder="https://" /></div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="Contact number" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="Contact email" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Industry</label>
            <input value={form.industry || ''} onChange={e => setForm({ ...form, industry: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Company Size</label>
            <select value={form.size || ''} onChange={e => setForm({ ...form, size: e.target.value })} className="input-field">
              <option value="">Select size</option>
              {['1-10', '11-50', '51-200', '201-1000', '1000+'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <div className="relative"><FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} className="input-field pl-10" /></div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2"><FiSave /> {saving ? 'Saving...' : 'Save Company Profile'}</button>
      </div>
    </div>
  );
}
