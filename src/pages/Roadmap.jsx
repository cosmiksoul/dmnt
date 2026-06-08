const PHASES = [
  {
    tag: 'Сейчас',
    current: true,
    title: 'Демо',
    body: 'Stateless, config-driven. Генератор, URL-билдер, валидатор, справочник — всё на статике, без бэкенда.',
  },
  {
    tag: 'Этап 1',
    title: 'Бэкенд + реестр',
    body: 'Прикрутить бэкенд и хранилище утверждённых кампаний — единый реестр имён.',
  },
  {
    tag: 'Этап 2',
    title: 'Валидация против реестра',
    body: 'Проверка новых имён на дубли и конфликты с уже существующими в базе кампаниями.',
  },
  {
    tag: 'Этап 3',
    title: 'Утверждение',
    body: 'Workflow внесения сгенерированной кампании в базу: ревью → утверждение → запись в реестр.',
  },
  {
    tag: 'Этап 4',
    title: 'Авто-правила',
    body: 'Генерация правила проверки поступающих данных на основе утверждённой кампании.',
  },
]

export default function Roadmap() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-xl font-bold tracking-tight">Планы развития</h1>
        <p className="mt-1 text-sm text-ink-muted">Куда растёт инструмент — от демо к полноценному сервису с реестром.</p>
      </header>

      <ol className="relative ml-2 space-y-4 border-l-2 border-line pl-6">
        {PHASES.map((p) => (
          <li key={p.tag} className="relative">
            <span
              className={`absolute -left-[31px] top-2 h-3 w-3 rounded-full border-2 ${
                p.current ? 'border-accent bg-accent' : 'border-line bg-surface'
              }`}
              aria-hidden
            />
            <div className="card p-5">
              <div className="mb-1 flex items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 font-mono text-xs font-semibold ${
                    p.current ? 'bg-accent-wash text-accent' : 'bg-paper text-ink-muted'
                  }`}
                >
                  {p.tag}
                </span>
                <h2 className="text-sm font-semibold">{p.title}</h2>
              </div>
              <p className="text-sm leading-relaxed text-ink-soft">{p.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
