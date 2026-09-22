import type { CalendarEvent } from '../types'
import { CATEGORY_MAP, URGENCY_DOT, URGENCY_LABEL } from '../lib/categories'

interface Props {
  event: CalendarEvent
  onToggleDone: (event: CalendarEvent) => void
  onClick: (event: CalendarEvent) => void
}

function timeRangeLabel(event: CalendarEvent): string | null {
  if (event.all_day) return '全天'
  if (!event.start_time) return null
  const start = event.start_time.slice(0, 5)
  const end = event.end_time ? event.end_time.slice(0, 5) : null
  return end ? `${start} - ${end}` : start
}

export function EventCard({ event, onToggleDone, onClick }: Props) {
  const category = CATEGORY_MAP[event.category] ?? CATEGORY_MAP.other
  const time = timeRangeLabel(event)

  return (
    <div
      className={`relative flex items-start gap-3 rounded-xl border ${category.border} ${category.bg} p-3 pr-4 transition active:scale-[0.99]`}
      onClick={() => onClick(event)}
    >
      <span
        className={`absolute right-2 top-2 h-2.5 w-2.5 rounded-full ${URGENCY_DOT[event.urgency]}`}
        title={`緊急程度：${URGENCY_LABEL[event.urgency]}`}
      />

      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleDone(event)
        }}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-xs ${
          event.is_done ? `${category.dot} border-transparent text-white` : 'border-gray-300 text-transparent'
        }`}
      >
        ✓
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-base leading-none">{category.icon}</span>
          <p className={`truncate text-sm font-medium ${event.is_done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
            {event.title}
          </p>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-500">
          {time && <span>{time}</span>}
          {event.location && <span className="truncate">📍 {event.location}</span>}
        </div>

        {!event.is_done && event.progress > 0 && (
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/70">
            <div
              className={`h-full rounded-full ${category.dot}`}
              style={{ width: `${event.progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
