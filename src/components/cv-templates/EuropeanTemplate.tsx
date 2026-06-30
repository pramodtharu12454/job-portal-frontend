'use client';

export default function EuropeanTemplate({ cv }: { cv: any }) {
  const c = cv.color || '#16a34a';
  const p = cv.personalInfo || {};

  return (
    <div className="bg-white text-slate-800 rounded-lg shadow-lg flex" style={{ fontFamily: 'Inter, sans-serif', fontSize: '10.5px', lineHeight: '1.5', minHeight: '500px' }}>
      <div className="w-1/3 p-5" style={{ backgroundColor: c }}>
        <div className="text-white space-y-5">
          {p.photo && (
            <img src={p.photo} alt="" className="w-24 h-24 rounded-full mx-auto border-2 border-white/30 object-cover" />
          )}
          <div className="text-center">
            <h2 className="text-lg font-bold">{p.firstName} {p.lastName}</h2>
            <p className="text-xs opacity-80 mt-0.5">{p.title}</p>
          </div>
          <div className="space-y-1.5 text-xs">
            <h4 className="text-xs font-semibold uppercase tracking-wider opacity-70">Contact</h4>
            {p.email && <p>{p.email}</p>}
            {p.phone && <p>{p.phone}</p>}
            {p.address && <p>{p.address}</p>}
          </div>
          {cv.skills?.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider opacity-70">Skills</h4>
              {cv.skills.map((s: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between text-xs">
                    <span>{s.name}</span>
                    <span className="opacity-70">{s.level}/5</span>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mt-0.5">
                    <div className="h-full rounded-full bg-white/70" style={{ width: `${(s.level / 5) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          {cv.languages?.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider opacity-70">Languages</h4>
              {cv.languages.map((l: any, i: number) => (
                <div key={i} className="flex justify-between text-xs">
                  <span>{l.name}</span>
                  <span className="opacity-70">{l.proficiency}</span>
                </div>
              ))}
            </div>
          )}
          {cv.certifications?.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider opacity-70">Certifications</h4>
              {cv.certifications.map((cert: any, i: number) => (
                <p key={i} className="text-xs">{cert.name}</p>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="w-2/3 p-5 space-y-4">
        {p.summary && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: c }}>Summary</h3>
            <p className="text-slate-600">{p.summary}</p>
          </div>
        )}
        {cv.experience?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: c }}>Experience</h3>
            {cv.experience.map((exp: any, i: number) => (
              <div key={i} className="mb-2.5 pb-2 border-b border-slate-100 last:border-0">
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold text-sm">{exp.position}</p>
                  <p className="text-xs text-slate-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                </div>
                <p className="text-xs text-slate-500">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                {exp.description && <p className="text-slate-600 mt-1">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}
        {cv.education?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: c }}>Education</h3>
            {cv.education.map((edu: any, i: number) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                  <p className="text-xs text-slate-500">{edu.startDate} - {edu.endDate}</p>
                </div>
                <p className="text-xs text-slate-500">{edu.institution}{edu.grade ? ` · ${edu.grade}` : ''}</p>
              </div>
            ))}
          </div>
        )}
        {cv.references?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: c }}>References</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {cv.references.map((ref: any, i: number) => (
                <div key={i}>
                  <p className="font-medium">{ref.name}</p>
                  <p className="text-slate-500">{ref.position} · {ref.company}</p>
                  {ref.email && <p className="text-slate-400">{ref.email}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
