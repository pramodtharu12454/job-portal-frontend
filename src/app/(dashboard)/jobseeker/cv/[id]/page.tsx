'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { cvAPI, uploadAPI } from '@/lib/api';
import { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiDownload, FiPrinter, FiCamera } from 'react-icons/fi';
import ModernTemplate from '@/components/cv-templates/ModernTemplate';
import ClassicTemplate from '@/components/cv-templates/ClassicTemplate';
import EuropeanTemplate from '@/components/cv-templates/EuropeanTemplate';
import html2pdf from 'html2pdf.js';

const templates = [
  { value: 'modern', label: 'Modern', desc: 'Clean & contemporary', comp: ModernTemplate },
  { value: 'european', label: 'European', desc: 'Professional European', comp: EuropeanTemplate },
  { value: 'classic', label: 'Classic', desc: 'Traditional timeless', comp: ClassicTemplate },
];

export default function CVEditor() {
  const params = useParams();
  const router = useRouter();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = rawId as string;
  const isNew = id === 'new';
  const previewRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [savingMsg, setSavingMsg] = useState('');
  const [cv, setCV] = useState<any>({
    title: 'My CV',
    template: 'modern',
    personalInfo: { firstName: '', lastName: '', email: '', phone: '', address: '', title: '', summary: '', photo: '' },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    references: [],
    customSections: [],
    color: '#16a34a',
    fontSize: 'medium',
  });

  useEffect(() => {
    if (!isNew && id) {
      cvAPI.getCV(id).then(res => setCV(res.data));
    }
  }, [id, isNew]);

  const update = (path: string, value: any) => {
    const keys = path.split('.');
    setCV((prev: any) => {
      const clone = JSON.parse(JSON.stringify(prev));
      let current = clone;
      for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
      current[keys[keys.length - 1]] = value;
      return clone;
    });
  };

  const addItem = (key: string, item: any) => {
    setCV((prev: any) => ({ ...prev, [key]: [...prev[key], item] }));
  };

  const removeItem = (key: string, idx: number) => {
    setCV((prev: any) => ({ ...prev, [key]: prev[key].filter((_: any, i: number) => i !== idx) }));
  };

  const updateItem = (key: string, idx: number, field: string, value: any) => {
    setCV((prev: any) => {
      const items = [...prev[key]];
      items[idx] = { ...items[idx], [field]: value };
      return { ...prev, [key]: items };
    });
  };

  const handleSave = async () => {
    setSavingMsg('Saving...');
    try {
      if (isNew) {
        await cvAPI.createCV(cv);
      } else {
        if (id) await cvAPI.updateCV(id, cv);
      }
      setSavingMsg('Saved!');
      setTimeout(() => setSavingMsg(''), 2000);
    } catch {
      setSavingMsg('Error saving');
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    const res = await uploadAPI.cvPhoto(fd);
    update('personalInfo.photo', res.data.url);
  };

  const handleDownload = () => {
    const el = previewRef.current;
    if (!el) return;
    const opt: any = {
      margin: 0.5,
      filename: `${cv.personalInfo.firstName || 'CV'}_${cv.personalInfo.lastName || ''}_CV.pdf`.trim(),
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(el).save();
  };

  const handlePrint = () => {
    const el = previewRef.current;
    if (!el) {
      window.print();
      return;
    }
    const win = window.open('', '_blank');
    if (!win) { window.print(); return; }
    const styles = Array.from(document.styleSheets)
      .map((ss) => {
        try {
          return Array.from(ss.cssRules || []).map((r) => r.cssText).join('');
        } catch { return ''; }
      }).join('');
    win.document.write(`<html><head><style>${styles}</style></head><body>${el.innerHTML}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  const curTemplate = templates.find(t => t.value === cv.template) || templates[0];
  const TemplateComp = curTemplate.comp;

  const tabs = ['personal', 'experience', 'education', 'skills', 'languages', 'certifications', 'references'];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/jobseeker/cv')} className="btn-secondary p-2"><FiArrowLeft /></button>
          <div>
            <input value={cv.title} onChange={e => update('title', e.target.value)} className="text-2xl font-bold bg-transparent border-none focus:outline-none w-48" />
            <p className="text-slate-500 text-sm">CV Builder — {curTemplate.label} Template</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleDownload} className="btn-secondary text-sm flex items-center gap-1.5"><FiDownload /> PDF</button>
          <button onClick={handlePrint} className="btn-secondary text-sm flex items-center gap-1.5"><FiPrinter /> Print</button>
          <button onClick={handleSave} className="btn-primary flex items-center gap-2"><FiSave /> {savingMsg || 'Save'}</button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap border-b border-slate-200 dark:border-slate-700 pb-4">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${activeTab === tab ? 'bg-green-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{tab}</button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <span className="text-sm text-slate-500 self-center">Template:</span>
        {templates.map(t => (
          <button key={t.value} onClick={() => update('template', t.value)} className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition ${cv.template === t.value ? 'border-green-600 bg-green-50 text-green-700' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}>
            {t.label}
          </button>
        ))}
        <div className="flex items-center gap-2 ml-4">
          <label className="text-sm text-slate-500">Color:</label>
          <input type="color" value={cv.color} onChange={e => update('color', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {activeTab === 'personal' && (
            <div className="card space-y-4">
              <h3 className="font-semibold">Personal Information</h3>
              <div className="relative group w-24 h-24 mb-2">
                {cv.personalInfo.photo ? (
                  <img src={cv.personalInfo.photo} alt="" className="w-24 h-24 rounded-full object-cover border-2 border-slate-200" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <FiCamera className="text-2xl" />
                  </div>
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition">
                  <FiCamera className="text-white" />
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input value={cv.personalInfo.firstName} onChange={e => update('personalInfo.firstName', e.target.value)} className="input-field" placeholder="First Name" />
                <input value={cv.personalInfo.lastName} onChange={e => update('personalInfo.lastName', e.target.value)} className="input-field" placeholder="Last Name" />
                <input value={cv.personalInfo.email} onChange={e => update('personalInfo.email', e.target.value)} className="input-field" placeholder="Email" />
                <input value={cv.personalInfo.phone} onChange={e => update('personalInfo.phone', e.target.value)} className="input-field" placeholder="Phone" />
                <input value={cv.personalInfo.address} onChange={e => update('personalInfo.address', e.target.value)} className="input-field col-span-2" placeholder="Address" />
                <input value={cv.personalInfo.title} onChange={e => update('personalInfo.title', e.target.value)} className="input-field col-span-2" placeholder="Professional Title" />
                <textarea value={cv.personalInfo.summary} onChange={e => update('personalInfo.summary', e.target.value)} className="input-field col-span-2 h-24" placeholder="Professional Summary" />
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Work Experience</h3>
                <button onClick={() => addItem('experience', { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' })} className="btn-secondary text-sm flex items-center gap-1"><FiPlus /> Add</button>
              </div>
              {cv.experience.map((exp: any, i: number) => (
                <div key={i} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Experience #{i + 1}</span>
                    <button onClick={() => removeItem('experience', i)} className="text-red-500"><FiTrash2 /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input value={exp.company} onChange={e => updateItem('experience', i, 'company', e.target.value)} className="input-field text-sm" placeholder="Company" />
                    <input value={exp.position} onChange={e => updateItem('experience', i, 'position', e.target.value)} className="input-field text-sm" placeholder="Position" />
                    <input value={exp.location} onChange={e => updateItem('experience', i, 'location', e.target.value)} className="input-field text-sm" placeholder="Location" />
                    <div className="flex gap-2">
                      <input type="date" value={exp.startDate} onChange={e => updateItem('experience', i, 'startDate', e.target.value)} className="input-field text-sm flex-1" />
                      {!exp.current && <input type="date" value={exp.endDate} onChange={e => updateItem('experience', i, 'endDate', e.target.value)} className="input-field text-sm flex-1" />}
                    </div>
                    <label className="flex items-center gap-2 text-sm col-span-2">
                      <input type="checkbox" checked={exp.current} onChange={e => updateItem('experience', i, 'current', e.target.checked)} className="rounded" />
                      Current position
                    </label>
                    <textarea value={exp.description} onChange={e => updateItem('experience', i, 'description', e.target.value)} className="input-field text-sm col-span-2 h-20" placeholder="Description" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'education' && (
            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Education</h3>
                <button onClick={() => addItem('education', { institution: '', degree: '', field: '', startDate: '', endDate: '', grade: '' })} className="btn-secondary text-sm flex items-center gap-1"><FiPlus /> Add</button>
              </div>
              {cv.education.map((edu: any, i: number) => (
                <div key={i} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Education #{i + 1}</span>
                    <button onClick={() => removeItem('education', i)} className="text-red-500"><FiTrash2 /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input value={edu.institution} onChange={e => updateItem('education', i, 'institution', e.target.value)} className="input-field text-sm" placeholder="Institution" />
                    <input value={edu.degree} onChange={e => updateItem('education', i, 'degree', e.target.value)} className="input-field text-sm" placeholder="Degree" />
                    <input value={edu.field} onChange={e => updateItem('education', i, 'field', e.target.value)} className="input-field text-sm" placeholder="Field of Study" />
                    <div className="flex gap-2">
                      <input type="date" value={edu.startDate} onChange={e => updateItem('education', i, 'startDate', e.target.value)} className="input-field text-sm flex-1" />
                      <input type="date" value={edu.endDate} onChange={e => updateItem('education', i, 'endDate', e.target.value)} className="input-field text-sm flex-1" />
                    </div>
                    <input value={edu.grade} onChange={e => updateItem('education', i, 'grade', e.target.value)} className="input-field text-sm" placeholder="Grade/GPA" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Skills</h3>
                <button onClick={() => addItem('skills', { name: '', level: 3 })} className="btn-secondary text-sm flex items-center gap-1"><FiPlus /> Add</button>
              </div>
              {cv.skills.map((skill: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <input value={skill.name} onChange={e => updateItem('skills', i, 'name', e.target.value)} className="input-field text-sm flex-1" placeholder="Skill name" />
                  <input type="range" min={1} max={5} value={skill.level} onChange={e => updateItem('skills', i, 'level', Number(e.target.value))} className="w-24" />
                  <span className="text-sm text-slate-500 w-8">{skill.level}/5</span>
                  <button onClick={() => removeItem('skills', i)} className="text-red-500"><FiTrash2 /></button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'languages' && (
            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Languages</h3>
                <button onClick={() => addItem('languages', { name: '', proficiency: 'Intermediate' })} className="btn-secondary text-sm flex items-center gap-1"><FiPlus /> Add</button>
              </div>
              {cv.languages.map((lang: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <input value={lang.name} onChange={e => updateItem('languages', i, 'name', e.target.value)} className="input-field text-sm flex-1" placeholder="Language" />
                  <select value={lang.proficiency} onChange={e => updateItem('languages', i, 'proficiency', e.target.value)} className="input-field text-sm">
                    {['Beginner', 'Intermediate', 'Advanced', 'Native'].map(p => <option key={p}>{p}</option>)}
                  </select>
                  <button onClick={() => removeItem('languages', i)} className="text-red-500"><FiTrash2 /></button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'certifications' && (
            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Certifications</h3>
                <button onClick={() => addItem('certifications', { name: '', issuer: '', date: '', url: '' })} className="btn-secondary text-sm flex items-center gap-1"><FiPlus /> Add</button>
              </div>
              {cv.certifications.map((cert: any, i: number) => (
                <div key={i} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Certification #{i + 1}</span>
                    <button onClick={() => removeItem('certifications', i)} className="text-red-500"><FiTrash2 /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input value={cert.name} onChange={e => updateItem('certifications', i, 'name', e.target.value)} className="input-field text-sm" placeholder="Certification name" />
                    <input value={cert.issuer} onChange={e => updateItem('certifications', i, 'issuer', e.target.value)} className="input-field text-sm" placeholder="Issuer" />
                    <input type="date" value={cert.date} onChange={e => updateItem('certifications', i, 'date', e.target.value)} className="input-field text-sm" />
                    <input value={cert.url} onChange={e => updateItem('certifications', i, 'url', e.target.value)} className="input-field text-sm" placeholder="URL (optional)" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'references' && (
            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">References</h3>
                <button onClick={() => addItem('references', { name: '', position: '', company: '', email: '', phone: '' })} className="btn-secondary text-sm flex items-center gap-1"><FiPlus /> Add</button>
              </div>
              {cv.references.map((ref: any, i: number) => (
                <div key={i} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Reference #{i + 1}</span>
                    <button onClick={() => removeItem('references', i)} className="text-red-500"><FiTrash2 /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input value={ref.name} onChange={e => updateItem('references', i, 'name', e.target.value)} className="input-field text-sm" placeholder="Name" />
                    <input value={ref.position} onChange={e => updateItem('references', i, 'position', e.target.value)} className="input-field text-sm" placeholder="Position" />
                    <input value={ref.company} onChange={e => updateItem('references', i, 'company', e.target.value)} className="input-field text-sm" placeholder="Company" />
                    <input value={ref.email} onChange={e => updateItem('references', i, 'email', e.target.value)} className="input-field text-sm" placeholder="Email" />
                    <input value={ref.phone} onChange={e => updateItem('references', i, 'phone', e.target.value)} className="input-field text-sm" placeholder="Phone" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="card sticky top-6">
            <h3 className="font-semibold mb-4">Preview — {curTemplate.label}</h3>
            <div id="cv-preview" ref={previewRef} className="rounded-lg overflow-hidden shadow-sm border" style={{ width: '210mm', maxWidth: '100%', transform: 'scale(0.7)', transformOrigin: 'top left' }}>
              <TemplateComp cv={cv} />
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={handleDownload} className="btn-primary text-sm flex-1 flex items-center justify-center gap-2"><FiDownload /> Download PDF</button>
              <button onClick={handlePrint} className="btn-secondary text-sm flex items-center gap-2"><FiPrinter /> Print</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
