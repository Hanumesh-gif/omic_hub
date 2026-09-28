import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Career = {
  id: string
  title: string
  slug: string
  summary: string
  description: string
  category: string
  experience_level: string
  salary_range: string
  key_skills: string[]
  tools: string[]
  education: string
  responsibilities: string[]
  growth_outlook: string
  icon_name: string
  created_at: string
}

export type Bookmark = {
  id: string
  career_id: string
  created_at: string
}
