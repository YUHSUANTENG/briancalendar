// Monday-start week utilities, all in local time, dates as YYYY-MM-DD strings

export function toDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function startOfWeek(d: Date): Date {
  const copy = new Date(d)
  const day = copy.getDay() // 0 Sun .. 6 Sat
  const diff = (day === 0 ? -6 : 1) - day // shift so Monday = start
  copy.setDate(copy.getDate() + diff)
  copy.setHours(0, 0, 0, 0)
  return copy
}

export function addDays(d: Date, n: number): Date {
  const copy = new Date(d)
  copy.setDate(copy.getDate() + n)
  return copy
}

export function getWeekDays(anchor: Date): Date[] {
  const start = startOfWeek(anchor)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

const WEEKDAY_LABELS = ['一', '二', '三', '四', '五', '六', '日']

export function weekdayLabel(d: Date): string {
  const day = d.getDay()
  return WEEKDAY_LABELS[day === 0 ? 6 : day - 1]
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b)
}

export function formatMonthDay(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()}`
}
