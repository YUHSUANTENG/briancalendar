import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { CalendarEvent, NewCalendarEvent } from '../types'

export function useEvents(userId: string | undefined, rangeStart: string, rangeEnd: string) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', rangeStart)
      .lte('event_date', rangeEnd)
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true, nullsFirst: true })

    if (error) {
      setError(error.message)
    } else {
      setEvents(data as CalendarEvent[])
      setError(null)
    }
    setLoading(false)
  }, [userId, rangeStart, rangeEnd])

  useEffect(() => {
    reload()
  }, [reload])

  useEffect(() => {
    if (!userId) return
    const channel = supabase
      .channel(`events-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events', filter: `user_id=eq.${userId}` },
        () => {
          reload()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, reload])

  const addEvent = useCallback(
    async (event: NewCalendarEvent) => {
      if (!userId) return
      const { error } = await supabase.from('events').insert({ ...event, user_id: userId })
      if (error) setError(error.message)
    },
    [userId],
  )

  const updateEvent = useCallback(async (id: string, patch: Partial<NewCalendarEvent>) => {
    const { error } = await supabase.from('events').update(patch).eq('id', id)
    if (error) setError(error.message)
  }, [])

  const deleteEvent = useCallback(async (id: string) => {
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) setError(error.message)
  }, [])

  return { events, loading, error, addEvent, updateEvent, deleteEvent, reload }
}
