import { useState } from 'react'

export default function NamePreview({ label, value, disabled }) {
  const [copied, setCopied] = useState(false)
  const empty = !value
  const off = disabled || empty
  const copy = async () => {
    if (off) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <div className="flex items-stretch gap-2">
      <span className="flex w-12 shrink-0 items-center font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
        {label}
      </span>
      <code
        className={`code-chip flex-1 overflow-x-auto whitespace-nowrap ${off ? 'text-ink-faint' : 'text-ink'}`}
      >
        {value || '—'}
      </code>
      <button
        type="button"
        onClick={copy}
        disabled={off}
        title="Копировать"
        aria-label="Копировать"
        className={`flex w-10 shrink-0 items-center justify-center rounded-lg border text-xs transition-colors ${
          off
            ? 'border-line text-ink-faint'
            : 'border-accent/30 bg-accent-wash text-accent hover:bg-accent hover:text-white'
        }`}
      >
        {copied ? (
          '✓'
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
        )}
      </button>
    </div>
  )
}
