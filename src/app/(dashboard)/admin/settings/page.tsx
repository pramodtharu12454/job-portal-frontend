'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/lib/api';
import { useTheme } from 'next-themes';
import { FiSave, FiSun, FiMoon, FiLock, FiMail } from 'react-icons/fi';

export default function AdminSettings() {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [newEmail, setNewEmail] = useState('');
  const [emailMsg, setEmailMsg] = useState('');
  const [settings, setSettings] = useState(user?.settings || {});
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState('');

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMsg('');
    try {
      const res = await authAPI.updateProfile({ email: newEmail });
      updateUser(res.data);
      setEmailMsg('Email updated');
      setNewEmail('');
    } catch (err: any) {
      setEmailMsg(err.response?.data?.message || 'Failed to update email');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authAPI.updateProfile({ settings });
      updateUser(res.data);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authAPI.changePassword(passwordForm);
      setPwMessage('Password updated successfully');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err: any) {
      setPwMessage(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">System Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Configure platform settings</p>
      </div>
      <div className="card space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><FiMail /> Admin Email</h2>
        <p className="text-sm text-slate-500">Current: <span className="font-medium text-slate-700 dark:text-slate-300">{user?.email}</span></p>
        {emailMsg && <div className={`p-3 rounded-lg text-sm ${emailMsg === 'Email updated' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{emailMsg}</div>}
        <form onSubmit={handleChangeEmail} className="flex gap-3">
          <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="input-field flex-1" placeholder="New email address" required />
          <button type="submit" className="btn-primary">Change Email</button>
        </form>
      </div>
      <div className="card space-y-6">
        <h2 className="font-semibold flex items-center gap-2"><FiSun /> Theme</h2>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setTheme('light')} className={`p-4 rounded-xl border-2 text-center ${theme === 'light' ? 'border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700'}`}><FiSun className="text-2xl mx-auto mb-2" /><span className="text-sm font-medium">Light Mode</span></button>
          <button onClick={() => setTheme('dark')} className={`p-4 rounded-xl border-2 text-center ${theme === 'dark' ? 'border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700'}`}><FiMoon className="text-2xl mx-auto mb-2" /><span className="text-sm font-medium">Dark Mode</span></button>
        </div>
      </div>
      <div className="card space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><FiLock /> Change Password</h2>
        {pwMessage && <div className={`p-3 rounded-lg text-sm ${pwMessage.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{pwMessage}</div>}
        <form onSubmit={handleChangePassword} className="space-y-3">
          <input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="input-field" placeholder="Current password" required />
          <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="input-field" placeholder="New password" minLength={6} required />
          <button type="submit" className="btn-primary">Update Password</button>
        </form>
      </div>
    </div>
  );
}
