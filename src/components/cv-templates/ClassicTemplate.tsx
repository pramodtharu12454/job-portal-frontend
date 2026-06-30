'use client';

export default function ClassicTemplate({ cv }: { cv: any }) {
  const c = cv.color || '#16a34a';
  const p = cv.personalInfo || {};

  return (
    <div className="bg-white text-slate-800 rounded-lg shadow-lg" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '11px', lineHeight: '1.6' }}>
      <div className="text-center p-6 border-b-2" style={{ borderColor: c }}>
        {p.photo && (
          <img src={p.photo} alt="" className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-slate-200 object-cover" />
        )}
        <h2 className="text-2xl font-bold" style={{ color: c }}>{p.firstName} {p.lastName}</h2>
        <p className="text-sm text-slate-600 mt-1">{p.title}</p>
        <div className="flex justify-center gap-4 text-xs text-slate-500 mt-2">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.address && <span>{p.address}</span>}
        </div>
      </div>
      <div className="p-6 space-y-5">
        {p.summary && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-center mb-3 pb-1 border-b" style={{ color: c, borderColor: c }}>Professional Summary</h3>
            <p className="text-slate-700 text-center italic">{p.summary}</p>
          </div>
        )}
        {cv.experience?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-center mb-3 pb-1 border-b" style={{ color: c, borderColor: c }}>Experience</h3>
            {cv.experience.map((exp: any, i: number) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <p className="font-bold text-sm">{exp.position}</p>
                  <p className="text-xs text-slate-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                </div>
                <p className="text-xs text-slate-600 italic">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                {exp.description && <p className="text-slate-700 mt-1 text-xs">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}
        {cv.education?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-center mb-3 pb-1 border-b" style={{ color: c, borderColor: c }}>Education</h3>
            {cv.education.map((edu: any, i: number) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <p className="font-bold text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                  <p className="text-xs text-slate-500">{edu.startDate} - {edu.endDate}</p>
                </div>
                <p className="text-xs text-slate-600 italic">{edu.institution}{edu.grade ? ` · ${edu.grade}` : ''}</p>
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 gap-6">
          {cv.skills?.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-center mb-3 pb-1 border-b" style={{ color: c, borderColor: c }}>Skills</h3>
              <div className="space-y-1.5">
                {cv.skills.map((s: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span>{s.name}</span>
                    <span className="text-slate-400">{'●'.repeat(s.level)}{'○'.repeat(5 - s.level)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {cv.languages?.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-center mb-3 pb-1 border-b" style={{ color: c, borderColor: c }}>Languages</h3>
              <div className="space-y-1">
                {cv.languages.map((l: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span>{l.name}</span>
                    <span className="text-slate-500 italic">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {cv.certifications?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-center mb-3 pb-1 border-b" style={{ color: c, borderColor: c }}>Certifications</h3>
            {cv.certifications.map((cert: any, i: number) => (
              <div key={i} className="text-xs text-center mb-1">
                <span className="font-medium">{cert.name}</span>
                {cert.issuer && <span className="text-slate-600"> — {cert.issuer}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
