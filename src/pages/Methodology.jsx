export default function Methodology() {
  return (
    <article className="prose-sm max-w-none space-y-6 text-sm leading-relaxed">
      <section>
        <h1 className="text-lg font-semibold">Зачем единая конвенция</h1>
        <p>Betera ведёт платное привлечение на 8+ рекламных платформах с разным именованием.
          Имена кампаний не совпадают с UTM, а те — с полями Mktg Info Lite. Кросс-платформенный
          анализ делается вручную. Конвенция даёт машиночитаемые, единые на всех платформах имена.</p>
      </section>
      <section>
        <h2 className="font-semibold">Четыре уровня</h2>
        <ul className="list-disc pl-5">
          <li><b>L0</b> — платформа/вендор/паблишер. Метаданные, не часть имени. → <code>utm_source</code>.</li>
          <li><b>L1</b> — кампания: <code>Status_Objective_Product_Audience_Geo[_Campaign]</code>. Одинаков на всех платформах.</li>
          <li><b>L2</b> — группа: <code>Format[_Device]_Flow_Placement_TargetingDetail</code>. Placement обязателен.</li>
          <li><b>L3</b> — креатив: <code>CreativeTheme_Variant_Source[_Date]</code>.</li>
        </ul>
      </section>
      <section>
        <h2 className="font-semibold">Ключевые правила</h2>
        <ul className="list-disc pl-5">
          <li>Разделитель — всегда <code>_</code>. Свободные поля — CamelCase, без <code>_</code>, пробелов и кириллицы.</li>
          <li>Цель бинарна: BA или PF. Никаких «BA-PF».</li>
          <li>Ретаргетинг — это Аудитория (RTG), а не Цель.</li>
          <li>Нет продукта APP: установки — SPO/CAS с Flow = W2A/A2A.</li>
          <li>Платформа не пишется в имени — она в L0.</li>
          <li>Для прямых медиа-закупок L1|L2|L3 пакуются в имя креатива через <code>|</code>.</li>
        </ul>
      </section>
      <section>
        <h2 className="font-semibold">Маппинг UTM</h2>
        <table className="w-full text-left">
          <thead><tr className="border-b"><th className="py-1">Параметр</th><th>Источник</th></tr></thead>
          <tbody>
            <tr className="border-b"><td className="py-1"><code>utm_source</code></td><td>L0</td></tr>
            <tr className="border-b"><td className="py-1"><code>utm_campaign</code></td><td>L1 (идентично)</td></tr>
            <tr className="border-b"><td className="py-1"><code>utm_medium</code></td><td>из L2 Format (SRC→search, DSP→display, VID→video, PSH→push…)</td></tr>
            <tr><td className="py-1"><code>utm_content</code></td><td>L3</td></tr>
          </tbody>
        </table>
      </section>
    </article>
  )
}
