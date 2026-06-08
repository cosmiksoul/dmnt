import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Генератор', end: true },
  { to: '/url', label: 'URL-билдер' },
  { to: '/validator', label: 'Валидатор' },
  { to: '/methodology', label: 'Методология' },
]

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center gap-6">
          <span className="font-semibold">Betera Naming Tool</span>
          <nav className="flex gap-4 text-sm">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-medium' : 'text-slate-500 hover:text-slate-800'
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
