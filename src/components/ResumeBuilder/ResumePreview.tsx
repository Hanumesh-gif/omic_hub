import React from 'react';
import { ResumeData } from '../../types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface ResumePreviewProps {
  resume: ResumeData;
  scale?: number;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ resume, scale = 1 }) => {
  const { personalInfo, summary, workExperiences, education, skills, projects, certifications, theme } = resume;

  return (
    <div
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      className="transition-transform duration-200"
    >
      <div
        id="printable-resume-area"
        className={`w-full max-w-[800px] min-h-[1050px] mx-auto bg-white text-slate-900 shadow-2xl p-8 sm:p-10 transition-colors ${
          theme === 'executive'
            ? 'font-serif'
            : theme === 'minimal'
            ? 'font-sans'
            : 'font-sans'
        }`}
      >
        {/* Header Section */}
        {theme === 'executive' ? (
          // Executive Theme Header: Centered & Classic with Optional Photo
          <div className="text-center pb-6 border-b-2 border-slate-900 mb-6">
            {personalInfo.photoUrl && (
              <div className="flex justify-center mb-3">
                <img
                  src={personalInfo.photoUrl}
                  alt={personalInfo.fullName || 'Candidate Photo'}
                  className="w-20 h-20 rounded-full object-cover border-2 border-slate-900 shadow-md"
                />
              </div>
            )}
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 uppercase">
              {personalInfo.fullName || 'Alex Morgan'}
            </h1>
            <p className="text-sm font-semibold text-slate-700 mt-1 italic">
              {personalInfo.headline || 'Senior Software Engineer'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-3">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>&bull; {personalInfo.phone}</span>}
              {personalInfo.location && <span>&bull; {personalInfo.location}</span>}
              {personalInfo.linkedin && <span>&bull; {personalInfo.linkedin.replace('https://', '')}</span>}
              {personalInfo.website && <span>&bull; {personalInfo.website.replace('https://', '')}</span>}
            </div>
          </div>
        ) : theme === 'minimal' ? (
          // Minimal Theme Header with Optional Photo
          <div className="pb-5 border-b border-slate-200 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {personalInfo.photoUrl && (
                  <img
                    src={personalInfo.photoUrl}
                    alt={personalInfo.fullName || 'Candidate Photo'}
                    className="w-14 h-14 rounded-full object-cover border border-slate-300 shadow-sm shrink-0"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    {personalInfo.fullName || 'Alex Morgan'}
                  </h1>
                  <p className="text-xs font-medium text-indigo-700 mt-0.5">
                    {personalInfo.headline || 'Senior Software Engineer'}
                  </p>
                </div>
              </div>
              <div className="text-xs text-slate-500 sm:text-right space-y-0.5">
                <p>{personalInfo.location} &bull; {personalInfo.phone}</p>
                <p className="text-indigo-600 font-medium">{personalInfo.email}</p>
              </div>
            </div>
          </div>
        ) : (
          // Modern Tech Header (Default): Elegant indigo accent bar with Optional Photo
          <div className="flex items-start justify-between gap-4 pb-6 border-b-2 border-indigo-600 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-black tracking-tight text-slate-950">
                {personalInfo.fullName || 'Alex Morgan'}
              </h1>
              <p className="text-sm font-bold text-indigo-600 mt-1 uppercase tracking-wide">
                {personalInfo.headline || 'Senior Full-Stack Engineer'}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 mt-3">
                {personalInfo.email && (
                  <span className="flex items-center gap-1 font-medium">
                    <Mail className="w-3.5 h-3.5 text-indigo-500" />
                    {personalInfo.email}
                  </span>
                )}
                {personalInfo.phone && (
                  <span className="flex items-center gap-1 font-medium">
                    <Phone className="w-3.5 h-3.5 text-indigo-500" />
                    {personalInfo.phone}
                  </span>
                )}
                {personalInfo.location && (
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    {personalInfo.location}
                  </span>
                )}
                {personalInfo.website && (
                  <span className="flex items-center gap-1 font-medium">
                    <Globe className="w-3.5 h-3.5 text-indigo-500" />
                    {personalInfo.website.replace('https://', '')}
                  </span>
                )}
                {personalInfo.linkedin && (
                  <span className="flex items-center gap-1 font-medium">
                    <Linkedin className="w-3.5 h-3.5 text-indigo-500" />
                    {personalInfo.linkedin.replace('https://', '')}
                  </span>
                )}
              </div>
            </div>

            {personalInfo.photoUrl && (
              <div className="shrink-0">
                <img
                  src={personalInfo.photoUrl}
                  alt={personalInfo.fullName || 'Candidate Photo'}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-md"
                />
              </div>
            )}
          </div>
        )}

        {/* Professional Summary */}
        {summary && (
          <div className="mb-6">
            <h2
              className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                theme === 'executive'
                  ? 'border-b border-slate-300 pb-1 text-slate-900'
                  : theme === 'minimal'
                  ? 'text-slate-500'
                  : 'text-indigo-900 border-b border-indigo-100 pb-1'
              }`}
            >
              Professional Summary
            </h2>
            <p className="text-xs leading-relaxed text-slate-700 text-justify">
              {summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {workExperiences.length > 0 && (
          <div className="mb-6">
            <h2
              className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                theme === 'executive'
                  ? 'border-b border-slate-300 pb-1 text-slate-900'
                  : theme === 'minimal'
                  ? 'text-slate-500 border-b border-slate-200 pb-1'
                  : 'text-indigo-900 border-b border-indigo-100 pb-1'
              }`}
            >
              Professional Experience
            </h2>

            <div className="space-y-4">
              {workExperiences.map((exp) => (
                <div key={exp.id} className="text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between font-bold text-slate-900">
                    <span className="text-sm font-bold text-slate-950">
                      {exp.role} <span className="font-normal text-slate-600">at</span> {exp.company}
                    </span>
                    <span className="text-slate-600 font-medium text-[11px]">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate} | {exp.location}
                    </span>
                  </div>

                  <ul className="mt-2 space-y-1.5 list-disc list-outside pl-4 text-slate-700 leading-relaxed">
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx} className="pl-0.5">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical & Core Skills */}
        <div className="mb-6">
          <h2
            className={`text-xs font-bold uppercase tracking-wider mb-2 ${
              theme === 'executive'
                ? 'border-b border-slate-300 pb-1 text-slate-900'
                : theme === 'minimal'
                ? 'text-slate-500 border-b border-slate-200 pb-1'
                : 'text-indigo-900 border-b border-indigo-100 pb-1'
            }`}
          >
            Technical Competencies & Skills
          </h2>
          <div className="space-y-1.5 text-xs text-slate-800">
            {skills.languages.length > 0 && (
              <p>
                <span className="font-bold text-slate-900">Languages:</span>{' '}
                {skills.languages.join(', ')}
              </p>
            )}
            {skills.frameworks.length > 0 && (
              <p>
                <span className="font-bold text-slate-900">Frameworks & Libraries:</span>{' '}
                {skills.frameworks.join(', ')}
              </p>
            )}
            {skills.cloudDevOps.length > 0 && (
              <p>
                <span className="font-bold text-slate-900">Cloud & Infrastructure:</span>{' '}
                {skills.cloudDevOps.join(', ')}
              </p>
            )}
            {skills.toolsAndDatabases.length > 0 && (
              <p>
                <span className="font-bold text-slate-900">Databases & Architecture:</span>{' '}
                {skills.toolsAndDatabases.join(', ')}
              </p>
            )}
            {skills.softSkills.length > 0 && (
              <p>
                <span className="font-bold text-slate-900">Leadership & Methodologies:</span>{' '}
                {skills.softSkills.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Featured Projects */}
        {projects.length > 0 && (
          <div className="mb-6">
            <h2
              className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                theme === 'executive'
                  ? 'border-b border-slate-300 pb-1 text-slate-900'
                  : theme === 'minimal'
                  ? 'text-slate-500 border-b border-slate-200 pb-1'
                  : 'text-indigo-900 border-b border-indigo-100 pb-1'
              }`}
            >
              Key Engineering Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <span className="font-bold text-slate-950">
                      {proj.name}
                      {proj.link && (
                        <span className="font-normal text-indigo-600 ml-2">
                          ({proj.link.replace('https://', '')})
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {proj.technologies.join(' &bull; ')}
                    </span>
                  </div>
                  <ul className="mt-1 space-y-1 list-disc list-outside pl-4 text-slate-700 leading-relaxed">
                    {proj.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Certifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {education.length > 0 && (
            <div>
              <h2
                className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                  theme === 'executive'
                    ? 'border-b border-slate-300 pb-1 text-slate-900'
                    : theme === 'minimal'
                    ? 'text-slate-500 border-b border-slate-200 pb-1'
                    : 'text-indigo-900 border-b border-indigo-100 pb-1'
                }`}
              >
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="text-xs space-y-0.5">
                  <p className="font-bold text-slate-950">{edu.degree}</p>
                  <p className="text-slate-700">{edu.institution}</p>
                  <p className="text-slate-500 text-[11px]">
                    {edu.startDate} – {edu.endDate} {edu.gpa && `| GPA: ${edu.gpa}`}
                  </p>
                  {edu.honors && <p className="text-indigo-700 italic text-[11px]">{edu.honors}</p>}
                  {edu.coursework && (
                    <p className="text-slate-600 text-[10px] mt-0.5">
                      <span className="font-semibold text-slate-700">Coursework:</span> {edu.coursework}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h2
                className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                  theme === 'executive'
                    ? 'border-b border-slate-300 pb-1 text-slate-900'
                    : theme === 'minimal'
                    ? 'text-slate-500 border-b border-slate-200 pb-1'
                    : 'text-indigo-900 border-b border-indigo-100 pb-1'
                }`}
              >
                Certifications
              </h2>
              <div className="space-y-1.5 text-xs">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <p className="font-bold text-slate-950">{cert.name}</p>
                    <p className="text-slate-600 text-[11px]">
                      {cert.issuer} &bull; {cert.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
