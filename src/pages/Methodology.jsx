const LEVELS = [
  ['L0', 'платформа / вендор / паблишер. Метаданные, не часть имени.', '→ utm_source'],
  ['L1', 'кампания: Status_Objective_Product_Audience_Geo[_Campaign].', 'Одинаков на всех платформах'],
  ['L2', 'группа: Format[_Device]_Flow_Placement_TargetingDetail.', 'Placement обязателен'],
  ['L3', 'креатив: CreativeTheme_Variant_Source[_Date].', '→ utm_content'],
]

const RULES = [
  'Разделитель — всегда «_». Свободные поля — CamelCase, без «_», пробелов и кириллицы.',
  'Цель бинарна: BA или PF. Никаких «BA-PF».',
  'Ретаргетинг — это Аудитория (RTG), а не Цель.',
  'Нет продукта APP: установки — SPO/CAS с Flow = W2A/A2A.',
  'Платформа не пишется в имени — она в L0.',
  'Для прямых медиа-закупок L1|L2|L3 пакуются в имя креатива через «|».',
]

const UTM = [
  ['utm_source', 'L0'],
  ['utm_campaign', 'L1 (идентично)'],
  ['utm_medium', 'из L2 Format (SRC→search, DSP→display, VID→video, PSH→push…)'],
  ['utm_content', 'L3'],
]

export default function Methodology() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-xl font-bold tracking-tight">Методология</h1>
        <p className="mt-1 text-sm text-ink-muted">Как устроена конвенция и почему она такая.</p>
      </header>

      <section className="card p-6">
        <h2 className="mb-2 text-base font-semibold">Зачем единая конвенция</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          Компания ведёт платное привлечение на 8+ рекламных платформах с разным именованием. Имена кампаний не
          совпадают с UTM, а те — с полями Mktg Info Lite. Кросс-платформенный анализ делается вручную. Конвенция
          даёт машиночитаемые, единые на всех платформах имена.
        </p>
      </section>

      <section className="card p-6">
        <h2 className="mb-4 text-base font-semibold">Четыре уровня</h2>
        <ul className="space-y-3">
          {LEVELS.map(([code, body, tag]) => (
            <li key={code} className="flex gap-3">
              <span className="lvl-badge mt-0.5">{code}</span>
              <p className="text-sm leading-relaxed text-ink-soft">
                {body} <span className="font-mono text-xs text-accent">{tag}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="card p-6">
        <h2 className="mb-3 text-base font-semibold">Ключевые правила</h2>
        <ul className="space-y-2">
          {RULES.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink-soft">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card p-6">
        <h2 className="mb-3 text-base font-semibold">Маппинг UTM</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
              <th className="py-2 font-semibold">Параметр</th>
              <th className="py-2 font-semibold">Источник</th>
            </tr>
          </thead>
          <tbody>
            {UTM.map(([param, src]) => (
              <tr key={param} className="border-b border-line last:border-0">
                <td className="py-2 pr-4 font-mono text-[13px] text-accent">{param}</td>
                <td className="py-2 text-ink-soft">{src}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
