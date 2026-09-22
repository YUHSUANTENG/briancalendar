export type Urgency = 'high' | 'medium' | 'low'

export type CategoryId =
  | 'mba'
  | 'garmin'
  | 'thesis'
  | 'tutoring'
  | 'club'
  | 'investing'
  | 'sports'
  | 'life'
  | 'other'

export interface CalendarEvent {
  id: string
  user_id: string
  title: string
  category: CategoryId
  urgency: Urgency
  event_date: string // YYYY-MM-DD
  start_time: string | null // HH:MM:SS
  end_time: string | null
  all_day: boolean
  location: string | null
  is_done: boolean
  progress: number // 0-100
  notes: string | null
  created_at: string
  updated_at: string
}

export type NewCalendarEvent = Omit<
  CalendarEvent,
  'id' | 'user_id' | 'created_at' | 'updated_at'
>
