import { L1_FIELDS, L2_FIELDS, L3_FIELDS, LIMITS } from '../config/convention.js'
import { buildL1, buildL2, buildL3 } from './buildNames.js'

const ALL_FIELDS = [...L1_FIELDS, ...L2_FIELDS, ...L3_FIELDS]

// CamelCase / free-field rule: letters & digits only, must start with a letter.
// Rejects "_", spaces, cyrillic, leading digit.
export function isCamelClean(s) {
  return /^[A-Za-z][A-Za-z0-9]*$/.test(s)
}

export function validate(values) {
  const issues = []

  for (const f of ALL_FIELDS) {
    const raw = (values[f.key] ?? '').toString().trim()

    if (f.required && raw === '') {
      issues.push({ field: f.key, severity: 'error', message: `Поле «${f.label}» обязательно.` })
      continue
    }
    if (f.kind === 'camelText' && raw !== '' && !isCamelClean(raw)) {
      issues.push({
        field: f.key, severity: 'error',
        message: `«${f.label}»: только CamelCase без «_», пробелов и кириллицы (напр. GatesOfOlympus).`,
      })
    }
  }

  // Campaign required for centralized initiatives (Status = CP).
  if (values.status === 'CP' && (values.campaign ?? '').toString().trim() === '') {
    issues.push({ field: 'campaign', severity: 'error', message: 'При статусе CP имя Campaign обязательно.' })
  }

  // Soft length limits → warnings only.
  const l1 = buildL1(values)
  const l2 = buildL2(values)
  const l3 = buildL3(values)
  if (l1.length > LIMITS.L1)
    issues.push({ field: 'l1', severity: 'warning', message: `L1 длиннее ${LIMITS.L1} символов (${l1.length}).` })
  if (l2.length > LIMITS.L2)
    issues.push({ field: 'l2', severity: 'warning', message: `L2 длиннее ${LIMITS.L2} символов (${l2.length}).` })
  if (l3.length > 0 && (l3.length < LIMITS.L3[0] || l3.length > LIMITS.L3[1]))
    issues.push({ field: 'l3', severity: 'warning', message: `L3 обычно ${LIMITS.L3[0]}–${LIMITS.L3[1]} символов (${l3.length}).` })

  return issues
}

export const hasErrors = (values) => validate(values).some((i) => i.severity === 'error')
