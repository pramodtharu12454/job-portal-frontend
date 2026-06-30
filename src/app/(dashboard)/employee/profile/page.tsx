'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authAPI, uploadAPI } from '@/lib/api';
import { FiUser, FiSave, FiCamera, FiEdit2, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function EmployeeProfile() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({ profile: {} });

  useEffect(() => {
    setForm({ profile: { ...user?.profile } });
    if (user?.profile?.firstName) setEditing(false);
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(form);
      updateUser(res.data);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    const res = await uploadAPI.photo(fd);
    updateUser(res.data.user);
  };

  const updateField = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, profile: { ...prev.profile, [field]: value } }));
  };

  const addItem = (key: string, item: any) => {
    setForm((prev: any) => ({
      ...prev,
      profile: { ...prev.profile, [key]: [...(prev.profile[key] || []), item] },
    }));
  };

  const removeItem = (key: string, idx: number) => {
    setForm((prev: any) => ({
      ...prev,
      profile: { ...prev.profile, [key]: prev.profile[key].filter((_: any, i: number) => i !== idx) },
    }));
  };

  const updateItem = (key: string, idx: number, field: string, value: any) => {
    setForm((prev: any) => {
      const items = [...(prev.profile[key] || [])];
      items[idx] = { ...items[idx], [field]: value };
      return { ...prev, profile: { ...prev.profile, [key]: items } };
    });
  };

  if (!editing && user?.profile?.firstName) {
    return (
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold">My Profile</h1><p className="text-slate-500 dark:text-slate-400">Your personal information</p></div>
          <button onClick={() => setEditing(true)} className="btn-primary flex items-center gap-2"><FiEdit2 /> Edit</button>
        </div>
        <div className="card">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-green-50 dark:bg-green-900/50 rounded-full flex items-center justify-center overflow-hidden">
              {user?.profile?.photo ? <img src={user.profile.photo} alt="" className="w-full h-full object-cover" /> : <FiUser className="text-3xl text-green-600 dark:text-green-400" />}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.profile?.firstName} {user?.profile?.lastName}</h2>
              <p className="text-slate-500">{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><label className="text-sm text-slate-500">Phone</label><p className="font-medium">{user?.profile?.phone || 'Not set'}</p></div>
            <div><label className="text-sm text-slate-500">Age</label><p className="font-medium">{user?.profile?.age || 'Not set'}</p></div>
            <div className="col-span-2"><label className="text-sm text-slate-500">Address</label><p className="font-medium">{user?.profile?.address || 'Not set'}</p></div>
            <div className="col-span-2"><label className="text-sm text-slate-500">Summary</label><p className="font-medium">{user?.profile?.summary || 'No summary'}</p></div>
          </div>
          {user?.profile?.skills?.length > 0 && (
            <div className="mb-4"><h3 className="font-semibold mb-2">Skills</h3><div className="flex flex-wrap gap-2">{user.profile.skills.map((s: string, i: number) => (<span key={i} className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm">{s}</span>))}</div></div>
          )}
          {user?.profile?.experience?.length > 0 && (
            <div className="mb-4"><h3 className="font-semibold mb-2">Experience</h3>{user.profile.experience.map((exp: any, i: number) => (<div key={i} className="mb-2"><p className="font-medium text-sm">{exp.position} at {exp.company}</p><p className="text-xs text-slate-500">{exp.location} · {exp.startDate && new Date(exp.startDate).getFullYear()}{exp.current ? '-Present' : exp.endDate ? `-${new Date(exp.endDate).getFullYear()}` : ''}</p></div>))}</div>
          )}
          {user?.profile?.education?.length > 0 && (
            <div><h3 className="font-semibold mb-2">Education</h3>{user.profile.education.map((edu: any, i: number) => (<div key={i} className="mb-2"><p className="font-medium text-sm">{edu.degree} in {edu.field}</p><p className="text-xs text-slate-500">{edu.institution}</p></div>))}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">{user?.profile?.firstName ? 'Edit Profile' : 'Setup Profile'}</h1><p className="text-slate-500 dark:text-slate-400">{user?.profile?.firstName ? 'Update your details' : 'Fill in your personal details'}</p></div>
        {user?.profile?.firstName && <button onClick={() => { setEditing(false); setForm({ profile: { ...user?.profile } }); }} className="btn-secondary flex items-center gap-2"><FiX /> Cancel</button>}
      </div>
      <div className="card">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative group">
            <div className="w-20 h-20 bg-green-50 dark:bg-green-900/50 rounded-full flex items-center justify-center overflow-hidden">
              {user?.profile?.photo ? <img src={user.profile.photo} alt="" className="w-full h-full object-cover" /> : <FiUser className="text-3xl text-green-600 dark:text-green-400" />}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition">
              <FiCamera className="text-white text-lg" /><input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
          <div><h2 className="text-xl font-semibold">{user?.profile?.firstName} {user?.profile?.lastName}</h2><p className="text-slate-500">{user?.email}</p></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div><label className="block text-sm font-medium mb-1">First Name</label><input value={form.profile.firstName || ''} onChange={e => updateField('firstName', e.target.value)} className="input-field" /></div>
          <div><label className="block text-sm font-medium mb-1">Last Name</label><input value={form.profile.lastName || ''} onChange={e => updateField('lastName', e.target.value)} className="input-field" /></div>
          <div><label className="block text-sm font-medium mb-1">Age</label><input type="number" value={form.profile.age || ''} onChange={e => updateField('age', e.target.value)} className="input-field" /></div>
          <div><label className="block text-sm font-medium mb-1">Phone</label><input value={form.profile.phone || ''} onChange={e => updateField('phone', e.target.value)} className="input-field" /></div>
          <div className="col-span-2"><label className="block text-sm font-medium mb-1">Address</label><textarea value={form.profile.address || ''} onChange={e => updateField('address', e.target.value)} className="input-field h-20" /></div>
          <div className="col-span-2"><label className="block text-sm font-medium mb-1">Professional Summary</label><textarea value={form.profile.summary || ''} onChange={e => updateField('summary', e.target.value)} className="input-field h-24" /></div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3"><h3 className="font-semibold">Skills</h3><button onClick={() => addItem('skills', '')} type="button" className="btn-secondary text-sm flex items-center gap-1"><FiPlus /> Add</button></div>
          <div className="flex flex-wrap gap-2">
            {(form.profile.skills || []).map((skill: string, i: number) => (
              <div key={i} className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-lg">
                <input value={skill || ''} onChange={e => { const items = [...(form.profile.skills || [])]; items[i] = e.target.value; setForm({ ...form, profile: { ...form.profile, skills: items } }); }} className="bg-transparent text-sm border-none outline-none w-24" />
                <button onClick={() => removeItem('skills', i)} className="text-red-500"><FiTrash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between"><h3 className="font-semibold">Experience</h3><button onClick={() => addItem('experience', { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' })} type="button" className="btn-secondary text-sm flex items-center gap-1"><FiPlus /> Add</button></div>
          {(form.profile.experience || []).map((exp: any, i: number) => (
            <div key={i} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 space-y-3">
              <div className="flex justify-between"><span className="text-sm font-medium">Experience #{i + 1}</span><button onClick={() => removeItem('experience', i)} className="text-red-500"><FiTrash2 /></button></div>
              <div className="grid grid-cols-2 gap-3">
                <input value={exp.company || ''} onChange={e => updateItem('experience', i, 'company', e.target.value)} className="input-field text-sm" placeholder="Company" />
                <input value={exp.position || ''} onChange={e => updateItem('experience', i, 'position', e.target.value)} className="input-field text-sm" placeholder="Position" />
                <input value={exp.location || ''} onChange={e => updateItem('experience', i, 'location', e.target.value)} className="input-field text-sm" placeholder="Location" />
                <div className="flex gap-2">
                  <input type="date" value={exp.startDate?.split('T')[0] || ''} onChange={e => updateItem('experience', i, 'startDate', e.target.value)} className="input-field text-sm flex-1" />
                  {!exp.current && <input type="date" value={exp.endDate?.split('T')[0] || ''} onChange={e => updateItem('experience', i, 'endDate', e.target.value)} className="input-field text-sm flex-1" />}
                </div>
                <label className="flex items-center gap-2 text-sm col-span-2"><input type="checkbox" checked={exp.current || false} onChange={e => updateItem('experience', i, 'current', e.target.checked)} className="rounded" /> Current position</label>
                <textarea value={exp.description || ''} onChange={e => updateItem('experience', i, 'description', e.target.value)} className="input-field text-sm col-span-2 h-20" placeholder="Description" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between"><h3 className="font-semibold">Education</h3><button onClick={() => addItem('education', { institution: '', degree: '', field: '', startDate: '', endDate: '', grade: '' })} type="button" className="btn-secondary text-sm flex items-center gap-1"><FiPlus /> Add</button></div>
          {(form.profile.education || []).map((edu: any, i: number) => (
            <div key={i} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 space-y-3">
              <div className="flex justify-between"><span className="text-sm font-medium">Education #{i + 1}</span><button onClick={() => removeItem('education', i)} className="text-red-500"><FiTrash2 /></button></div>
              <div className="grid grid-cols-2 gap-3">
                <input value={edu.institution || ''} onChange={e => updateItem('education', i, 'institution', e.target.value)} className="input-field text-sm" placeholder="Institution" />
                <input value={edu.degree || ''} onChange={e => updateItem('education', i, 'degree', e.target.value)} className="input-field text-sm" placeholder="Degree" />
                <input value={edu.field || ''} onChange={e => updateItem('education', i, 'field', e.target.value)} className="input-field text-sm" placeholder="Field" />
                <div className="flex gap-2"><input type="date" value={edu.startDate?.split('T')[0] || ''} onChange={e => updateItem('education', i, 'startDate', e.target.value)} className="input-field text-sm flex-1" /><input type="date" value={edu.endDate?.split('T')[0] || ''} onChange={e => updateItem('education', i, 'endDate', e.target.value)} className="input-field text-sm flex-1" /></div>
                <input value={edu.grade || ''} onChange={e => updateItem('education', i, 'grade', e.target.value)} className="input-field text-sm" placeholder="Grade" />
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2"><FiSave /> {saving ? 'Saving...' : 'Save Profile'}</button>
      </div>
    </div>
  );
}
