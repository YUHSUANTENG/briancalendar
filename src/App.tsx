import { useMemo, useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useEvents } from './hooks/useEvents'
import { Auth } from './components/Auth'
import { WeekStrip } from './components/WeekStrip'
import { EventCard } from './components/EventCard'
import { EventForm } from './components/EventForm'
import { supabase } from './lib/supabase'
import { getWeekDays, isSameDay, toDateKey } from './lib/date'
import type { CalendarEvent } from './types'

const TODAY = new Date()

function App() {
  const { user, loading: authLoading } = useAuth()
  const [selected, setSelected] = useState(TODAY)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<CalendarEvent | null>(null)

  const weekDays = useMemo(() => getWeekDays(selected), [selected])
  const rangeStart = toDateKey(weekDays[0])
  const rangeEnd = toDateKey(weekDays[6])

  const { events, loading, addEvent, updateEvent, deleteEvent } = useEvents(
    user?.id,
    rangeStart,
    rangeEnd,
  )

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {}
    for (const e of events) {
      map[e.event_date] = map[e.event_date] ? [...map[e.event_date], e] : [e]
    }
    return map
  }, [events])

  const selectedKey = toDateKey(selected)
  const dayEvents = eventsByDate[selectedKey] ?? []

  function openNew() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(event: CalendarEvent) {
    setEditing(event)
    setFormOpen(true)
  }

  async function handleToggleDone(event: CalendarEvent) {
    const nextDone = !event.is_done
    await updateEvent(event.id, { is_done: nextDone, progress: nextDone ? 100 : event.progress })
  }

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-gray-400">載入中…</div>
  }

  if (!user) {
    return <Auth />
  }

  const isToday = isSameDay(selected, TODAY)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/90 px-4 pb-2 pt-[calc(env(safe-area-inset-top)+0.75rem)] backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-900">
              {isToday ? '今天' : `${selected.getMonth() + 1}月${selected.getDate()}日`}
            </h1>
            <p className="text-xs text-gray-400">{dayEvents.length} 項事項</p>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-xs text-gray-400 underline underline-offset-2"
          >
            登出
          </button>
        </div>
        <WeekStrip
          weekDays={weekDays}
          selected={selected}
          today={TODAY}
          eventsByDate={eventsByDate}
          onSelect={setSelected}
        />
      </header>

      <main className="space-y-2 px-4 pt-4">
        {loading && <p className="text-center text-sm text-gray-400">載入中…</p>}
        {!loading && dayEvents.length === 0 && (
          <p className="pt-12 text-center text-sm text-gray-400">這天還沒有安排事項</p>
        )}
        {dayEvents.map((event) => (
          <EventCard key={event.id} event={event} onToggleDone={handleToggleDone} onClick={openEdit} />
        ))}
      </main>

      <button
        onClick={openNew}
        className="fixed bottom-8 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-2xl text-white shadow-lg shadow-indigo-600/30 active:scale-95"
        aria-label="新增事項"
      >
        +
      </button>

      {formOpen && (
        <EventForm
          defaultDate={selected}
          initial={editing}
          onClose={() => setFormOpen(false)}
          onSave={async (data) => {
            if (editing) {
              await updateEvent(editing.id, data)
            } else {
              await addEvent(data)
            }
          }}
          onDelete={editing ? deleteEvent : undefined}
        />
      )}
    </div>
  )
}

export default App
