'use client';

import { useEffect, useRef, useState } from 'react';
import { cvAPI } from '@/lib/api';
import Link from 'next/link';
import { FiFileText, FiPlus, FiDownload, FiPrinter, FiCopy, FiTrash2, FiEdit2, FiEye } from 'react-icons/fi';
import ModernTemplate from '@/components/cv-templates/ModernTemplate';
import ClassicTemplate from '@/components/cv-templates/ClassicTemplate';
import EuropeanTemplate from '@/components/cv-templates/EuropeanTemplate';
import html2pdf from 'html2pdf.js';

const templateComps: Record<string, any> = {
  modern: ModernTemplate,
  european: EuropeanTemplate,
  classic: ClassicTemplate,
};

export default function CVBuilder() {
  const [cvs, setCVs] = useState<any[]>([]);
  const [previewing, setPreviewing] = useState<any>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => { cvAPI.getCVs().then(res => setCVs(res.data)); }, []);

  const handleDuplicate = async (id: string) => {
    await cvAPI.duplicateCV(id);
    cvAPI.getCVs().then(res => setCVs(res.data));
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this CV?')) {
      await cvAPI.deleteCV(id);
      cvAPI.getCVs().then(res => setCVs(res.data));
    }
  };

  const handleDownload = (cv: any) => {
    const el = document.getElementById(`cv-preview-${cv._id}`);
    if (!el) return;
    const opt: any = {
      margin: 0.5,
      filename: `${cv.personalInfo?.firstName || 'CV'}_${cv.personalInfo?.lastName || ''}_CV.pdf`.trim(),
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(el).save();
  };

  const handlePrint = (cv: any) => {
    const el = document.getElementById(`cv-preview-${cv._id}`);
    if (!el) return;
    const win = window.open('', '_blank');
    if (!win) { window.print(); return; }
    const styles = Array.from(document.styleSheets)
      .map((ss) => {
        try { return Array.from(ss.cssRules || []).map((r) => r.cssText).join(''); }
        catch { return ''; }
      }).join('');
    win.document.write(`<html><head><style>${styles}</style></head><body>${el.innerHTML}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">CV Builder</h1>
          <p className="text-slate-500 dark:text-slate-400">Create and manage your professional CVs</p>
        </div>
        <Link href="/jobseeker/cv/new" className="btn-primary flex items-center gap-2">
          <FiPlus /> Create CV
        </Link>
      </div>

      {cvs.length === 0 ? (
        <div className="card text-center py-16">
          <FiFileText className="text-5xl text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No CVs yet</h3>
          <p className="text-slate-500 mb-6">Create your first professional CV</p>
          <Link href="/jobseeker/cv/new" className="btn-primary">Create CV</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cvs.map((cv: any) => {
            const T = templateComps[cv.template] || ModernTemplate;
            return (
              <div key={cv._id} className="card card-hover group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-green-50 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                    <FiFileText className="text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h3 className="font-semibold mb-1">{cv.title}</h3>
                <p className="text-xs text-slate-400 mb-4">{cv.template} template · Updated {new Date(cv.updatedAt).toLocaleDateString()}</p>
                <div className="flex flex-wrap gap-1.5">
                  <Link href={`/jobseeker/cv/${cv._id}`} className="btn-secondary text-xs flex items-center gap-1 py-1.5 px-3"><FiEdit2 /> Edit</Link>
                  <button onClick={() => { setPreviewing(cv); document.getElementById('cv-preview-modal')?.classList.remove('hidden'); }} className="btn-secondary text-xs flex items-center gap-1 py-1.5 px-3"><FiEye /> Preview</button>
                  <button onClick={() => handleDownload(cv)} className="btn-secondary text-xs flex items-center gap-1 py-1.5 px-3"><FiDownload /> PDF</button>
                  <button onClick={() => handlePrint(cv)} className="btn-secondary text-xs flex items-center gap-1 py-1.5 px-3"><FiPrinter /></button>
                  <button onClick={() => handleDuplicate(cv._id)} className="btn-secondary text-xs flex items-center gap-1 py-1.5 px-3"><FiCopy /></button>
                  <button onClick={() => handleDelete(cv._id)} className="btn-secondary text-xs flex items-center gap-1 py-1.5 px-3 text-red-500"><FiTrash2 /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div id="cv-preview-modal" className="hidden fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) document.getElementById('cv-preview-modal')?.classList.add('hidden'); }}>
        <div className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">{previewing?.title}</h3>
            <button onClick={() => document.getElementById('cv-preview-modal')?.classList.add('hidden')} className="text-slate-500 hover:text-slate-700 text-xl">&times;</button>
          </div>
          {previewing && (
            <div id={`cv-preview-${previewing._id}`}>
              {(() => {
                const PT = templateComps[previewing.template] || ModernTemplate;
                return <PT cv={previewing} />;
              })()}
            </div>
          )}
          {previewing && (
            <div className="flex gap-2 mt-4">
              <button onClick={() => handleDownload(previewing)} className="btn-primary text-sm flex-1 flex items-center justify-center gap-2"><FiDownload /> Download PDF</button>
              <button onClick={() => handlePrint(previewing)} className="btn-secondary text-sm flex items-center gap-2"><FiPrinter /> Print</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
