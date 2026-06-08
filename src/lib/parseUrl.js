import { parseName } from './parseName.js'

// Params our convention assigns meaning to (everything else is shown as "extra").
const KNOWN = ['utm_source', 'utm_campaign', 'utm_medium', 'utm_content', 'utm_term', 't_group', 'promocode', 'conv']

// Parse a full tracking URL (or a bare query string) into its UTM params and
// decode the convention levels carried by them: L0 (utm_source), L1 (utm_campaign),
// L3 (utm_content). L2 is not transferred via UTM — only utm_medium hints its format.
export function parseUrl(input) {
  const str = (input || '').trim()
  if (!str) return null

  const q = str.indexOf('?')
  const base = q >= 0 ? str.slice(0, q) : ''
  const qs = q >= 0 ? str.slice(q + 1) : str

  const params = new URLSearchParams(qs)
  const all = [...params.entries()]
  const get = (k) => params.get(k) || ''

  const known = {}
  for (const k of KNOWN) known[k] = get(k)
  const extras = all.filter(([k]) => !KNOWN.includes(k))

  return {
    base,
    params: all,
    known,
    extras,
    l0: known.utm_source,
    medium: known.utm_medium,
    l1: known.utm_campaign ? parseName(known.utm_campaign, 'L1') : null,
    l3: known.utm_content ? parseName(known.utm_content, 'L3') : null,
  }
}
