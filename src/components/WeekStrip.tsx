import type { CalendarEvent } from '../types'
import { CATEGORY_MAP } from '../lib/categories'
import { isSameDay, toDateKey, weekdayLabel } from '../lib/date'

interface Props {
  weekDays: Date[]
  selected: Date
  today: Date
  eventsByDate: Record<string, CalendarEvent[]>
  onSelect: (d: Date) => void
}

export function WeekStrip({ weekDays, selected, today, eventsByDate, onSelect }: Props) {
  return (
    <div className="grid grid-cols-7 gap-1.5 px-4 pb-2 pt-1">
      {weekDays.map((d) => {
        const key = toDateKey(d)
        const dayEvents = eventsByDate[key] ?? []
        const isSelected = isSameDay(d, selected)
        const isToday = isSameDay(d, today)
        const dots = dayEvents.slice(0, 4)

        return (
          <button
            key={key}
            onClick={() => onSelect(d)}
            className={`flex flex-col items-center rounded-xl py-2 transition ${
              isSelected ? 'bg-indigo-600 text-white' : isToday ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600'
            }`}
          >
            <span className="text-[10px] opacity-80">{weekdayLabel(d)}</span>
            <span className="mt-0.5 text-sm font-semibold">{d.getDate()}</span>
            <span className="mt-1 flex h-1.5 gap-0.5">
              {dots.map((e, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${
                    isSelected ? 'bg-white/80' : CATEGORY_MAP[e.category]?.dot ?? 'bg-gray-300'
                  }`}
                />
              ))}
            </span>
          </button>
        )
      })}
    </div>
  )
}
