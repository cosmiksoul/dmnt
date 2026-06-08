import { optionCodes } from '../config/convention.js'

const inDict = (name, val) => optionCodes(name).includes(val)
const isDate = (s) => /^\d{4}$/.test(s)

function parseL1(parts) {
  const fields = { status: '', objective: '', product: '', audience: '', geo: '', campaign: '' }
  const errors = []
  const [status, objective, product, audience, geo, campaign] = parts
  fields.status = status || ''
  fields.objective = objective || ''
  fields.product = product || ''
  fields.audience = audience || ''
  fields.geo = geo || ''
  fields.campaign = campaign || ''
  if (!inDict('status', status)) errors.push(`Статус «${status}» вне словаря.`)
  if (!inDict('objective', objective)) errors.push(`Цель «${objective}» вне словаря.`)
  if (!inDict('product', product)) errors.push(`Продукт «${product}» вне словаря.`)
  if (!inDict('audience', audience)) errors.push(`Аудитория «${audience}» вне словаря.`)
  if (!inDict('geo', geo)) errors.push(`Гео «${geo}» вне словаря.`)
  return { fields, errors }
}

function parseL2(parts) {
  const fields = { format: '', device: '', flow: '', placement: '', targeting: '' }
  const errors = []
  let i = 0
  fields.format = parts[i] || ''
  if (!inDict('format', fields.format)) errors.push(`Формат «${fields.format}» вне словаря.`)
  i += 1
  if (inDict('device', parts[i])) { fields.device = parts[i]; i += 1 }
  fields.flow = parts[i] || ''
  if (!inDict('flow', fields.flow)) errors.push(`Поток «${fields.flow}» вне словаря.`)
  i += 1
  fields.placement = parts[i] || ''
  if (!inDict('placement', fields.placement)) errors.push(`Плейсмент «${fields.placement}» вне словаря.`)
  i += 1
  fields.targeting = parts.slice(i).join('_')
  if (!fields.targeting) errors.push('Отсутствует TargetingDetail.')
  return { fields, errors }
}

function parseL3(parts) {
  const fields = { theme: '', variant: '', source: '', date: '' }
  const errors = []
  fields.theme = parts[0] || ''
  fields.variant = parts[1] || ''
  fields.source = parts[2] || ''
  if (parts[3] && isDate(parts[3])) fields.date = parts[3]
  if (!/^V\d+$/.test(fields.variant)) errors.push(`Вариант «${fields.variant}» должен быть V1…V10.`)
  if (!inDict('source', fields.source)) errors.push(`Источник «${fields.source}» вне словаря.`)
  return { fields, errors }
}

export function parseName(str, level) {
  const parts = (str || '').trim().split('_')
  if (level === 'L1') return parseL1(parts)
  if (level === 'L2') return parseL2(parts)
  if (level === 'L3') return parseL3(parts)
  return { fields: {}, errors: [`Неизвестный уровень: ${level}`] }
}
