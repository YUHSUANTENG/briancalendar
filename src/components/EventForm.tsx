import { useEffect, useState } from 'react'
import type { CalendarEvent, CategoryId, NewCalendarEvent, Urgency } from '../types'
import { CATEGORIES } from '../lib/categories'
import { toDateKey } from '../lib/date'

interface Props {
  defaultDate: Date
  initial?: CalendarEvent | null
  onSave: (data: NewCalendarEvent) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onClose: () => void
}

export function EventForm({ defaultDate, initial, onSave, onDelete, onClose }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [category, setCategory] = useState<CategoryId>(initial?.category ?? 'other')
  const [urgency, setUrgency] = useState<Urgency>(initial?.urgency ?? 'medium')
  const [eventDate, setEventDate] = useState(initial?.event_date ?? toDateKey(defaultDate))
  const [allDay, setAllDay] = useState(initial?.all_day ?? false)
  const [startTime, setStartTime] = useState(initial?.start_time?.slice(0, 5) ?? '')
  const [endTime, setEndTime] = useState(initial?.end_time?.slice(0, 5) ?? '')
  const [location, setLocation] = useState(initial?.location ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [isDone, setIsDone] = useState(initial?.is_done ?? false)
  const [progress, setProgress] = useState(initial?.progress ?? 0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isDone && progress < 100) setProgress(100)
  }, [isDone]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    await onSave({
      title: title.trim(),
      category,
      urgency,
      event_date: eventDate,
      all_day: allDay,
      start_time: allDay ? null : startTime ? `${startTime}:00` : null,
      end_time: allDay ? null : endTime ? `${endTime}:00` : null,
      location: location.trim() || null,
      notes: notes.trim() || null,
      is_done: isDone,
      progress: isDone ? 100 : progress,
    })
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 sm:rounded-3xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{initial ? '編輯事項' : '新增事項'}</h2>
          <button type="button" onClick={onClose} className="text-gray-400">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">標題</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：交出行銷企劃書"
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">類別</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">緊急程度</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as Urgency)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
              >
                <option value="high">🔴 緊急</option>
                <option value="medium">🟡 一般</option>
                <option value="low">🟢 不急</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">日期</label>
            <input
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} />
            全天事項
          </label>

          {!allDay && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">開始時間</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">結束時間</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">地點</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="例如：公司大樓 / 線上會議"
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">備註詳情</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="詳細資訊、待辦細節..."
              className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs font-medium text-gray-500">完成進度</label>
              <span className="text-xs text-gray-400">{isDone ? 100 : progress}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={10}
              value={isDone ? 100 : progress}
              disabled={isDone}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={isDone} onChange={(e) => setIsDone(e.target.checked)} />
            已辦理
          </label>
        </div>

        <div className="mt-6 flex gap-2">
          {initial && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(initial.id).then(onClose)}
              className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-500"
            >
              刪除
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? '儲存中…' : '儲存'}
          </button>
        </div>
      </form>
    </div>
  )
}
