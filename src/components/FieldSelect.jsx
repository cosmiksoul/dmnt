export default function FieldSelect({ field, value, onChange }) {
  return (
    <label className="block text-sm">
      <span className="text-slate-600">{field.label}{field.required && ' *'}</span>
      <select
        className="mt-1 w-full rounded border border-slate-300 bg-white px-2 py-1.5"
        value={value || ''}
        onChange={(e) => onChange(field.key, e.target.value)}
      >
        <option value="">{field.required ? '— выберите —' : '— не задано —'}</option>
        {field.opts.map((o) => (
          <option key={o.code} value={o.code}>{o.code} — {o.desc}</option>
        ))}
      </select>
    </label>
  )
}
