import { X, Bookmark, Briefcase, GraduationCap, DollarSign, TrendingUp, CircleCheck as CheckCircle2, Wrench, Lightbulb } from 'lucide-react'
import { getIcon } from '../lib/icons'
import type { Career } from '../lib/supabase'

type Props = {
  career: Career
  isBookmarked: boolean
  onClose: () => void
  onBookmark: () => void
}

export function CareerDetailModal({ career, isBookmarked, onClose, onBookmark }: Props) {
  const Icon = getIcon(career.icon_name)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon">
              <Icon size={28} />
            </div>
            <div>
              <h2>{career.title}</h2>
              <div className="card-tags" style={{ marginBottom: 0 }}>
                <span className="tag tag-category">{career.category}</span>
                <span className="tag">{career.experience_level}</span>
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <p className="modal-description">{career.description}</p>

        <div className="modal-meta-grid">
          <div className="meta-card">
            <div className="meta-label">
              <DollarSign size={14} /> Salary Range
            </div>
            <div className="meta-value">{career.salary_range}</div>
          </div>
          <div className="meta-card">
            <div className="meta-label">
              <Briefcase size={14} /> Experience Level
            </div>
            <div className="meta-value">{career.experience_level}</div>
          </div>
          <div className="meta-card">
            <div className="meta-label">
              <GraduationCap size={14} /> Education
            </div>
            <div className="meta-value" style={{ fontSize: '13px' }}>{career.education}</div>
          </div>
          <div className="meta-card">
            <div className="meta-label">
              <TrendingUp size={14} /> Growth Outlook
            </div>
            <div className="meta-value" style={{ fontSize: '13px' }}>{career.growth_outlook}</div>
          </div>
        </div>

        <div className="modal-section">
          <div className="modal-section-title">
            <Lightbulb size={16} /> Key Skills
          </div>
          <div className="modal-tags">
            {career.key_skills.map((skill) => (
              <span key={skill} className="modal-tag skill">{skill}</span>
            ))}
          </div>
        </div>

        <div className="modal-section">
          <div className="modal-section-title">
            <Wrench size={16} /> Tools & Technologies
          </div>
          <div className="modal-tags">
            {career.tools.map((tool) => (
              <span key={tool} className="modal-tag tool">{tool}</span>
            ))}
          </div>
        </div>

        <div className="modal-section">
          <div className="modal-section-title">
            <CheckCircle2 size={16} /> Key Responsibilities
          </div>
          <ul className="modal-list">
            {career.responsibilities.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>

        <div className="modal-actions">
          <button
            className={`btn-primary ${isBookmarked ? 'btn-secondary' : ''}`}
            onClick={onBookmark}
          >
            <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
            {isBookmarked ? 'Bookmarked' : 'Bookmark This Career'}
          </button>
        </div>
      </div>
    </div>
  )
}
