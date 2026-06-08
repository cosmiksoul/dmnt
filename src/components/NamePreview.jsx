import { useState } from 'react'

export default function NamePreview({ label, value, disabled }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    if (disabled || !value) return
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }
  return (
    <div className="flex items-center gap-2">
      <span className="w-28 shrink-0 text-xs font-medium text-slate-500">{label}</span>
      <code className={`flex-1 truncate rounded bg-slate-100 px-2 py-1 text-sm ${disabled ? 'text-slate-400' : 'text-slate-900'}`}>
        {value || '—'}
      </code>
      <button
        type="button"
        onClick={copy}
        disabled={disabled || !value}
        className="rounded border px-2 py-1 text-xs disabled:opacity-40"
      >
        {copied ? '✓' : 'Копировать'}
      </button>
    </div>
  )
}
