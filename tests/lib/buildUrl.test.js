import { describe, it, expect } from 'vitest'
import { buildUrl } from '../../src/lib/buildUrl.js'

const v = {
  l0: 'kufar',
  status: 'TC', objective: 'PF', product: 'CAS', audience: 'ACQ', geo: 'BY',
  format: 'DSP', flow: 'W2W', placement: 'DIR', targeting: 'MainPage',
  theme: 'GatesOfOlympus100500', variant: 'V1', source: 'dmt',
}

describe('buildUrl', () => {
  it('assembles a tracking URL from convention values', () => {
    const url = buildUrl(v, 'gates_of_olympus', 'OLYMP100500')
    expect(url).toContain('https://start.pm.by/gates_of_olympus?')
    expect(url).toContain('utm_source=kufar')
    expect(url).toContain('utm_campaign=TC_PF_CAS_ACQ_BY')
    expect(url).toContain('utm_medium=display')
    expect(url).toContain('utm_content=GatesOfOlympus100500_V1_dmt')
    expect(url).toContain('t_group=media')
    expect(url).toContain('conv=1')
    expect(url).toContain('promocode=OLYMP100500')
  })
  it('omits promocode when empty', () => {
    const url = buildUrl(v, 'betera_pass', '')
    expect(url).not.toContain('promocode=')
  })
})
