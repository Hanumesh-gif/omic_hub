import { useState, useEffect, useCallback } from 'react'
import { Search, Bookmark, FlaskConical, Microscope, LogOut } from 'lucide-react'
import { supabase, type Career, type Bookmark as BookmarkType } from './lib/supabase'
import { CareerCard } from './components/CareerCard'
import { CareerDetailModal } from './components/CareerDetailModal'
import { AuthPage } from './components/AuthPage'

type View = 'all' | 'bookmarks'

const CATEGORIES = ['All', 'Research', 'Industry', 'Clinical', 'Data Science']
const LEVELS = ['All', 'Entry', 'Mid', 'Senior']

export default function App() {
  const [careers, setCareers] = useState<Career[]>([])
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('all')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All')
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null)
  const [session, setSession] = useState<boolean | null>(null)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session)
      setAuthReady(true)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setSession(!!session)
        if (!session) {
          setBookmarks([])
        }
      })()
    })
  }, [])

  const fetchCareers = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('careers')
      .select('*')
      .order('title')
    if (error) {
      console.error('Error fetching careers:', error)
    } else if (data) {
      setCareers(data as Career[])
    }
    setLoading(false)
  }, [])

  const fetchBookmarks = useCallback(async () => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
    if (error) {
      console.error('Error fetching bookmarks:', error)
    } else if (data) {
      setBookmarks(data as BookmarkType[])
    }
  }, [])

  useEffect(() => {
    if (session) {
      fetchCareers()
      fetchBookmarks()
    }
  }, [session, fetchCareers, fetchBookmarks])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setBookmarks([])
    setView('all')
    setSelectedCareer(null)
  }

  const bookmarkIds = new Set(bookmarks.map((b) => b.career_id))

  const toggleBookmark = async (careerId: string) => {
    const existing = bookmarks.find((b) => b.career_id === careerId)
    if (existing) {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', existing.id)
      if (error) {
        console.error('Error removing bookmark:', error)
        return
      }
      setBookmarks(bookmarks.filter((b) => b.id !== existing.id))
    } else {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert({ career_id: careerId })
        .select()
        .single()
      if (error) {
        console.error('Error adding bookmark:', error)
        return
      }
      if (data) {
        setBookmarks([...bookmarks, data as BookmarkType])
      }
    }
  }

  const filteredCareers = careers.filter((c) => {
    if (view === 'bookmarks' && !bookmarkIds.has(c.id)) return false
    if (category !== 'All' && c.category !== category) return false
    if (level !== 'All' && c.experience_level !== level) return false
    if (search) {
      const q = search.toLowerCase()
      const matches =
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.key_skills.some((s) => s.toLowerCase().includes(q)) ||
        c.tools.some((t) => t.toLowerCase().includes(q))
      if (!matches) return false
    }
    return true
  })

  if (!authReady) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="logo-icon" style={{ width: 56, height: 56 }}>
            <FlaskConical size={28} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <AuthPage onSuccess={() => {}} />
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo" onClick={() => setView('all')}>
            <div className="logo-icon">
              <FlaskConical size={20} />
            </div>
            <div className="logo-text">Omic<span>Hub</span></div>
          </div>
          <nav className="nav">
            <button
              className={`nav-btn ${view === 'all' ? 'active' : ''}`}
              onClick={() => setView('all')}
            >
              <Microscope size={18} />
              <span>Careers</span>
            </button>
            <button
              className={`nav-btn ${view === 'bookmarks' ? 'active' : ''}`}
              onClick={() => setView('bookmarks')}
            >
              <Bookmark size={18} />
              <span>Saved</span>
              {bookmarks.length > 0 && (
                <span className="bookmark-badge">{bookmarks.length}</span>
              )}
            </button>
            <button className="nav-btn" onClick={handleSignOut} title="Sign out">
              <LogOut size={18} />
              <span>Sign out</span>
            </button>
          </nav>
        </div>
      </header>

      {view === 'all' && (
        <>
          <div className="hero">
            <div className="hero-badge">
              <Microscope size={14} />
              Bioinformatics Career Explorer
            </div>
            <h1>
              Discover Your Path in <span>Bioinformatics</span>
            </h1>
            <p>
              Explore career options built for bioinformatics students — from genomics
              to drug discovery, clinical data to structural biology. Find the role
              that fits your skills and passions.
            </p>
            <div className="search-bar">
              <Search className="search-icon" size={20} />
              <input
                className="search-input"
                placeholder="Search by title, skill, or tool..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-chip ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
            <select
              className="filter-select"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l === 'All' ? 'All Levels' : `${l} Level`}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <main className="content">
        {view === 'bookmarks' && (
          <div className="section-header">
            <h2 className="section-title">Saved Careers</h2>
            <span className="result-count">{filteredCareers.length} saved</span>
          </div>
        )}
        {view === 'all' && !loading && (
          <div className="section-header">
            <h2 className="section-title">
              {category !== 'All' ? category : 'All'} Careers
            </h2>
            <span className="result-count">
              {filteredCareers.length} {filteredCareers.length === 1 ? 'role' : 'roles'} found
            </span>
          </div>
        )}

        {loading ? (
          <div className="loading-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : filteredCareers.length === 0 ? (
          <div className="empty-state">
            <h3>
              {view === 'bookmarks'
                ? 'No saved careers yet'
                : 'No careers match your search'}
            </h3>
            <p>
              {view === 'bookmarks'
                ? 'Browse careers and bookmark the ones that interest you.'
                : 'Try adjusting your filters or search terms.'}
            </p>
          </div>
        ) : (
          <div className="career-grid">
            {filteredCareers.map((career) => (
              <CareerCard
                key={career.id}
                career={career}
                isBookmarked={bookmarkIds.has(career.id)}
                onClick={() => setSelectedCareer(career)}
                onBookmark={() => toggleBookmark(career.id)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedCareer && (
        <CareerDetailModal
          career={selectedCareer}
          isBookmarked={bookmarkIds.has(selectedCareer.id)}
          onClose={() => setSelectedCareer(null)}
          onBookmark={() => toggleBookmark(selectedCareer.id)}
        />
      )}

      <footer className="footer">
        OmicHub — Career Explorer for Bioinformatics Students
      </footer>
    </div>
  )
}
