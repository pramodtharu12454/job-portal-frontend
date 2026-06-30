'use client';

export default function ModernTemplate({ cv }: { cv: any }) {
  const c = cv.color || '#16a34a';
  const p = cv.personalInfo || {};

  return (
    <div className="bg-white text-slate-800 rounded-lg overflow-hidden shadow-lg" style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', lineHeight: '1.5' }}>
      <div className="p-6" style={{ backgroundColor: c }}>
        <div className="flex items-center gap-4">
          {p.photo && (
            <img src={p.photo} alt="" className="w-16 h-16 rounded-full border-2 border-white/50 object-cover" />
          )}
          <div className="text-white">
            <h2 className="text-xl font-bold">{p.firstName} {p.lastName}</h2>
            <p className="text-sm opacity-90">{p.title}</p>
            <div className="flex gap-3 text-xs mt-1 opacity-80">
              {p.email && <span>{p.email}</span>}
              {p.phone && <span>{p.phone}</span>}
              {p.address && <span>{p.address}</span>}
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-5">
        {p.summary && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: c }}>Professional Summary</h3>
            <p className="text-slate-600">{p.summary}</p>
          </div>
        )}
        {cv.experience?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: c }}>Experience</h3>
            <div className="space-y-3">
              {cv.experience.map((exp: any, i: number) => (
                <div key={i} className="relative pl-4 border-l-2" style={{ borderColor: c }}>
                  <div className="absolute w-2 h-2 rounded-full left-[-5px] top-1" style={{ backgroundColor: c }} />
                  <p className="font-semibold text-sm">{exp.position}</p>
                  <p className="text-slate-500 text-xs">{exp.company} · {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                  {exp.description && <p className="text-slate-600 mt-1">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        {cv.education?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: c }}>Education</h3>
            {cv.education.map((edu: any, i: number) => (
              <div key={i} className="mb-2">
                <p className="font-semibold text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                <p className="text-slate-500 text-xs">{edu.institution} · {edu.startDate} - {edu.endDate}{edu.grade ? ` · ${edu.grade}` : ''}</p>
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 gap-6">
          {cv.skills?.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: c }}>Skills</h3>
              <div className="space-y-2">
                {cv.skills.map((s: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span>{s.name}</span>
                      <span className="text-slate-400">{s.level}/5</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(s.level / 5) * 100}%`, backgroundColor: c }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {cv.languages?.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: c }}>Languages</h3>
              <div className="space-y-1">
                {cv.languages.map((l: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span>{l.name}</span>
                    <span className="text-slate-400">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {cv.certifications?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: c }}>Certifications</h3>
            {cv.certifications.map((cert: any, i: number) => (
              <div key={i} className="mb-1 text-xs">
                <span className="font-medium">{cert.name}</span>
                {cert.issuer && <span className="text-slate-500"> · {cert.issuer}</span>}
                {cert.date && <span className="text-slate-400"> · {cert.date}</span>}
              </div>
            ))}
          </div>
        )}
        {cv.references?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: c }}>References</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {cv.references.map((ref: any, i: number) => (
                <div key={i}>
                  <p className="font-medium">{ref.name}</p>
                  <p className="text-slate-500">{ref.position} · {ref.company}</p>
                  {ref.email && <p className="text-slate-400">{ref.email}</p>}
                  {ref.phone && <p className="text-slate-400">{ref.phone}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
