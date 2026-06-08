import { describe, it, expect } from 'vitest'
import { utmMedium } from '../../src/lib/utm.js'

describe('utmMedium', () => {
  it('maps documented L2 formats', () => {
    expect(utmMedium('SRC')).toBe('search')
    expect(utmMedium('DSP')).toBe('display')
    expect(utmMedium('FSC')).toBe('display')
    expect(utmMedium('TGO')).toBe('display')
    expect(utmMedium('VID')).toBe('video')
    expect(utmMedium('YTS')).toBe('video')
    expect(utmMedium('PSH')).toBe('push')
    expect(utmMedium('POP')).toBe('pop')
    expect(utmMedium('PRE')).toBe('preroll')
    expect(utmMedium('NAT')).toBe('native')
  })
  it('returns empty string for unknown format', () => {
    expect(utmMedium('ZZZ')).toBe('')
    expect(utmMedium('')).toBe('')
  })
})
