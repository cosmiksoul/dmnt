// Sticky results card shared by Generator and UrlBuilder.
// Renders a status pill + the name/URL rows (children) + grouped validation feedback:
// hard errors (red), still-to-fill fields (calm chips), length warnings (amber), or a ready state.
export default function ResultsPanel({ title, issues = [], extraMissing = [], children }) {
  const required = issues.filter((i) => i.code === 'required').map((i) => i.label)
  const hard = issues.filter((i) => i.code === 'format' || i.code === 'cp')
  const warnings = issues.filter((i) => i.severity === 'warning')
  const missing = [...extraMissing, ...required]

  const tone = hard.length ? 'danger' : missing.length ? 'warn' : 'ok'
  const pillText = tone === 'danger' ? 'Есть ошибки' : tone === 'warn' ? `Заполнить: ${missing.length}` : 'Готово'
  const pillCls = {
    danger: 'bg-danger-wash text-danger',
    warn: 'bg-warn-wash text-warn',
    ok: 'bg-accent-wash text-accent',
  }[tone]

  return (
    <div className="card space-y-3 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink-soft">{title}</h2>
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${pillCls}`}>{pillText}</span>
      </div>

      <div className="space-y-2">{children}</div>

      <div className="space-y-2 border-t border-line pt-3">
        {hard.length > 0 && (
          <ul className="space-y-1 text-xs text-danger">
            {hard.map((e, i) => (
              <li key={i} className="flex gap-1.5">
                <span aria-hidden>⚠</span>
                <span>{e.message}</span>
              </li>
            ))}
          </ul>
        )}
        {missing.length > 0 && (
          <div className="text-xs text-ink-muted">
            <span className="font-medium text-ink-soft">Осталось заполнить:</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {missing.map((m, i) => (
                <span key={i} className="rounded-md border border-line bg-paper px-2 py-0.5 text-ink-soft">
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}
        {warnings.length > 0 && (
          <ul className="space-y-1 text-xs text-warn">
            {warnings.map((w, i) => (
              <li key={i}>{w.message}</li>
            ))}
          </ul>
        )}
        {hard.length === 0 && missing.length === 0 && (
          <p className="flex items-center gap-1.5 text-xs font-medium text-accent">
            <span aria-hidden>✓</span>Готово к копированию
          </p>
        )}
      </div>
    </div>
  )
}
