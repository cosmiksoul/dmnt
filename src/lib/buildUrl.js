import { L0 } from '../config/convention.js'
import { buildL1, buildL3 } from './buildNames.js'
import { utmMedium } from './utm.js'

const tGroupFor = (l0) => L0.find((x) => x.code === l0)?.tGroup ?? ''

export function buildUrl(values, landingSlug, promocode) {
  const params = new URLSearchParams()
  if (promocode) params.set('promocode', promocode)
  params.set('utm_source', values.l0 || '')
  params.set('utm_campaign', buildL1(values))
  params.set('utm_medium', utmMedium(values.format))
  params.set('utm_content', buildL3(values))
  const tg = tGroupFor(values.l0)
  if (tg) params.set('t_group', tg)
  params.set('conv', '1')
  // URLSearchParams keeps "_" literal (unreserved char).
  return `https://start.pm.by/${landingSlug}?${params.toString()}`
}
