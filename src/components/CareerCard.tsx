import { Bookmark } from 'lucide-react'
import { getIcon } from '../lib/icons'
import type { Career } from '../lib/supabase'

type Props = {
  career: Career
  isBookmarked: boolean
  onClick: () => void
  onBookmark: () => void
}

export function CareerCard({ career, isBookmarked, onClick, onBookmark }: Props) {
  const Icon = getIcon(career.icon_name)

  return (
    <div className="career-card" onClick={onClick}>
      <div className="card-header">
        <div className="card-icon">
          <Icon size={24} />
        </div>
        <button
          className={`bookmark-btn ${isBookmarked ? 'saved' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onBookmark()
          }}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>
      <h3 className="card-title">{career.title}</h3>
      <p className="card-summary">{career.summary}</p>
      <div className="card-tags">
        <span className="tag tag-category">{career.category}</span>
        <span className="tag">{career.experience_level}</span>
        {career.key_skills.slice(0, 2).map((skill) => (
          <span key={skill} className="tag tag-skill">{skill}</span>
        ))}
      </div>
      <div className="card-footer">
        <div className="card-meta">
          <span className="card-salary">{career.salary_range}</span>
        </div>
      </div>
    </div>
  )
}
