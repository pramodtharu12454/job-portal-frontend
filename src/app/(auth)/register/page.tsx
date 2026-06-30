'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FiBriefcase, FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';

function RegisterForm() {
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') || 'jobseeker';
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: defaultRole });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      router.push(`/${form.role === 'employee' ? 'employee' : 'jobseeker'}/dashboard`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center"><FiBriefcase className="text-yellow-900 text-xl" /></div>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">Pramod Portal</span>
        </Link>
        <div className="card">
          <h2 className="text-2xl font-bold mb-2">Create account</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Start your journey today</p>
          {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          <div className="flex gap-2 mb-6">
            <button type="button" onClick={() => setForm({ ...form, role: 'jobseeker' })} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${form.role === 'jobseeker' ? 'bg-green-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>Job Seeker</button>
            <button type="button" onClick={() => setForm({ ...form, role: 'employee' })} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${form.role === 'employee' ? 'bg-green-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>Employee</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">First Name</label>
                <input type="text" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="input-field" placeholder="John" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Last Name</label>
                <input type="text" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="input-field" placeholder="Doe" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field pl-10" placeholder="you@example.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input-field pl-10 pr-10" placeholder="Min 6 characters" minLength={6} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center mt-6 text-sm text-slate-500">
            Already have an account? <Link href="/login" className="text-green-600 hover:underline font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return <Suspense><RegisterForm /></Suspense>;
}
