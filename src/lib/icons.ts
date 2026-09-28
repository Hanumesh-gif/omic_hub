import {
  FlaskConical, Brain, Dna, Database, Pill, Stethoscope,
  Code, Activity, Microscope, Atom, GraduationCap, ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  FlaskConical,
  Brain,
  Dna,
  Database,
  Pill,
  Stethoscope,
  Code,
  Activity,
  Microscope,
  Atom,
  GraduationCap,
  ShieldCheck,
}

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? FlaskConical
}
