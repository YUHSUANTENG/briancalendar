import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function Auth() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSending(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    setSending(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl text-white shadow-sm">
            📅
          </div>
          <h1 className="text-xl font-semibold text-gray-900">我的行事曆</h1>
          <p className="mt-1 text-sm text-gray-500">登入以同步你的行程</p>
        </div>

        {sent ? (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-center text-sm text-indigo-700">
            登入連結已寄到 <span className="font-medium">{email}</span>，請到信箱點擊連結完成登入。
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="你的 Email"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {sending ? '傳送中…' : '傳送登入連結'}
            </button>
            {error && <p className="text-center text-sm text-red-500">{error}</p>}
          </form>
        )}
      </div>
    </div>
  )
}
