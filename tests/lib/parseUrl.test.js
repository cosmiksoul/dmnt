import { describe, it, expect } from 'vitest'
import { parseUrl } from '../../src/lib/parseUrl.js'

describe('parseUrl', () => {
  const url =
    'https://start.pm.by/gates_of_olympus?promocode=OLYMP100500&utm_source=kufar&utm_campaign=TC_PF_CAS_ACQ_BY&utm_medium=display&utm_content=GatesOfOlympus100500_V1_dmt&t_group=media&conv=1'

  it('splits base and extracts known params, decodes L0/L1/L3', () => {
    const r = parseUrl(url)
    expect(r.base).toBe('https://start.pm.by/gates_of_olympus')
    expect(r.l0).toBe('kufar')
    expect(r.medium).toBe('display')
    expect(r.known.promocode).toBe('OLYMP100500')
    expect(r.l1.fields).toMatchObject({ status: 'TC', objective: 'PF', product: 'CAS', audience: 'ACQ', geo: 'BY' })
    expect(r.l1.errors).toEqual([])
    expect(r.l3.fields).toMatchObject({ theme: 'GatesOfOlympus100500', variant: 'V1', source: 'dmt' })
  })

  it('accepts a bare query string (no base)', () => {
    const r = parseUrl('utm_source=yandex&utm_campaign=NS_BA_GEN_ACQ_BY')
    expect(r.base).toBe('')
    expect(r.l0).toBe('yandex')
    expect(r.l1.fields.status).toBe('NS')
    expect(r.l3).toBe(null)
  })

  it('returns null for empty input', () => {
    expect(parseUrl('')).toBe(null)
    expect(parseUrl('   ')).toBe(null)
  })
})
