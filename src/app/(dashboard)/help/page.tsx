'use client';

import { useState } from 'react';
import { helpAPI } from '@/lib/api';
import { FiHelpCircle, FiMail, FiMessageSquare, FiChevronDown, FiExternalLink, FiAlertCircle } from 'react-icons/fi';

const faqs = [
  { q: 'How do I post a job?', a: 'Log in as a Job Seeker, go to "Post a Job" from the sidebar, fill in the details, and submit. An admin will review and approve it.' },
  { q: 'How do I apply for a job?', a: 'Log in as an Employee, browse jobs from the "Browse Jobs" page, click on a job, and click "Apply Now".' },
  { q: 'How do I change my password?', a: 'Go to "Settings" in the sidebar, scroll to the "Change Password" section, enter your current and new password, then click "Update Password".' },
  { q: 'How do I update my profile?', a: 'Job Seekers can update their profile from "My Profile" or "Company Profile" in the sidebar. Employees can update from "Settings".' },
  { q: 'My application status — what does it mean?', a: 'Pending = not reviewed yet. Reviewed = seen by the job poster. Shortlisted = you are being considered. Rejected = not selected. Hired = you got the job!' },
  { q: 'How do I contact support?', a: 'Use the contact form below or email us directly at support@jobportal.com. We typically respond within 24 hours.' },
];

export default function HelpPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await helpAPI.contact(form);
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send. Try emailing us directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><FiHelpCircle /> Help Desk</h1>
        <p className="text-slate-500 dark:text-slate-400">Find answers or get in touch with us</p>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                {faq.q}
                <FiChevronDown className={`text-slate-400 transition ${openIdx === i ? 'rotate-180' : ''}`} />
              </button>
              {openIdx === i && (
                <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-400">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-2 flex items-center gap-2"><FiMail /> Contact Info</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Reach out to us anytime</p>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium text-slate-700 dark:text-slate-300">Email:</span> support@jobportal.com</p>
            <p><span className="font-medium text-slate-700 dark:text-slate-300">Response time:</span> Within 24 hours</p>
            <a href="mailto:support@jobportal.com" className="btn-primary text-sm inline-flex items-center gap-2 mt-2"><FiExternalLink /> Send Email</a>
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-2 flex items-center gap-2"><FiMessageSquare /> Send a Message</h2>
          {sent ? (
            <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-lg text-sm">Message sent! We&apos;ll get back to you soon.</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm"><FiAlertCircle /> {error}</div>}
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field text-sm" placeholder="Your name" required />
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field text-sm" placeholder="Your email" required />
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="input-field text-sm h-24" placeholder="How can we help?" required />
              <button type="submit" disabled={sending} className="btn-primary text-sm">{sending ? 'Sending...' : 'Send Message'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
