import type { CategoryId, Urgency } from '../types'

export interface CategoryDef {
  id: CategoryId
  label: string
  icon: string
  // Tailwind color classes for this category
  bg: string
  text: string
  dot: string
  border: string
}

export const CATEGORIES: CategoryDef[] = [
  { id: 'mba', label: 'MBA課程', icon: '📚', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500', border: 'border-blue-200' },
  { id: 'garmin', label: 'Garmin實習', icon: '💼', bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500', border: 'border-purple-200' },
  { id: 'thesis', label: '論文', icon: '📝', bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500', border: 'border-rose-200' },
  { id: 'tutoring', label: '家教教材', icon: '✏️', bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500', border: 'border-orange-200' },
  { id: 'club', label: '商業分析社團', icon: '🤝', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200' },
  { id: 'investing', label: '投資研究', icon: '📈', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', border: 'border-amber-200' },
  { id: 'sports', label: '運動', icon: '⚽', bg: 'bg-cyan-50', text: 'text-cyan-700', dot: 'bg-cyan-500', border: 'border-cyan-200' },
  { id: 'life', label: '個人生活', icon: '🏠', bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500', border: 'border-gray-200' },
  { id: 'other', label: '其他', icon: '📌', bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500', border: 'border-slate-200' },
]

export const CATEGORY_MAP: Record<CategoryId, CategoryDef> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.id]: c }),
  {} as Record<CategoryId, CategoryDef>,
)

export const URGENCY_DOT: Record<Urgency, string> = {
  high: 'bg-red-500',
  medium: 'bg-yellow-400',
  low: 'bg-green-500',
}

export const URGENCY_LABEL: Record<Urgency, string> = {
  high: '緊急',
  medium: '一般',
  low: '不急',
}
