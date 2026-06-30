'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/lib/api';
import { useTheme } from 'next-themes';
import { FiSave, FiSun, FiMoon, FiBell, FiType, FiLock } from 'react-icons/fi';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState(user?.settings || { darkMode: false, emailNotifications: true, fontSize: 'medium' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState('');

  const handleSaveSettings = async () => {
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
      setPwMessage(err.response?.data?.message || 'Error changing password');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Customize your experience</p>
      </div>

      <div className="card space-y-6">
        <h2 className="font-semibold flex items-center gap-2"><FiSun /> Appearance</h2>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setTheme('light')} className={`p-4 rounded-xl border-2 text-center transition ${theme === 'light' ? 'border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
            <FiSun className="text-2xl mx-auto mb-2" />
            <span className="text-sm font-medium">Light</span>
          </button>
          <button onClick={() => setTheme('dark')} className={`p-4 rounded-xl border-2 text-center transition ${theme === 'dark' ? 'border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
            <FiMoon className="text-2xl mx-auto mb-2" />
            <span className="text-sm font-medium">Dark</span>
          </button>
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><FiBell /> Notifications</h2>
        <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
          <span className="text-sm">Email notifications</span>
          <input type="checkbox" checked={settings.emailNotifications} onChange={e => setSettings({ ...settings, emailNotifications: e.target.checked })} className="rounded" />
        </label>
      </div>

      <div className="card space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><FiType /> Font Size</h2>
        <div className="flex gap-3">
          {['small', 'medium', 'large'].map(size => (
            <button key={size} onClick={() => setSettings({ ...settings, fontSize: size })} className={`flex-1 p-4 rounded-xl border-2 text-center capitalize transition ${settings.fontSize === size ? 'border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
              {size === 'small' ? 'A' : size === 'medium' ? 'A' : 'A'}
              <span className="text-xs block mt-1">{size}</span>
            </button>
          ))}
        </div>
        <button onClick={handleSaveSettings} disabled={saving} className="btn-primary flex items-center gap-2"><FiSave /> {saving ? 'Saving...' : 'Save Settings'}</button>
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
