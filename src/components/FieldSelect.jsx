export default function FieldSelect({ field, value, onChange }) {
  return (
    <label className="block">
      <span className="field-label">
        {field.label}
        {field.required && <span className="text-accent"> *</span>}
      </span>
      <select
        className="field-control"
        value={value || ''}
        onChange={(e) => onChange(field.key, e.target.value)}
      >
        <option value="">{field.required ? '— выберите —' : '— не задано —'}</option>
        {field.opts.map((o) => (
          <option key={o.code} value={o.code}>
            {o.code} — {o.desc}
          </option>
        ))}
      </select>
    </label>
  )
}
