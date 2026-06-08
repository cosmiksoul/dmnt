import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Генератор', end: true },
  { to: '/url', label: 'URL-билдер' },
  { to: '/validator', label: 'Валидатор' },
  { to: '/methodology', label: 'Методология' },
  { to: '/reference', label: 'Справочник' },
]

export default function Layout() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-surface/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent font-mono text-xs font-bold text-white">
              B
            </span>
            <span className="font-semibold tracking-tight">
              Betera <span className="font-normal text-ink-muted">Naming Tool</span>
            </span>
          </div>
          <nav className="flex flex-wrap gap-1 text-sm">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 transition-colors ${
                    isActive
                      ? 'bg-accent-wash font-semibold text-accent'
                      : 'text-ink-muted hover:bg-paper hover:text-ink'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">
        <Outlet />
      </main>
    </div>
  )
}
