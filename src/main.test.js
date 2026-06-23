import { describe, it, expect } from 'vitest'
import { judgeTiming } from './game/timing.js'

describe('judgeTiming', () => {
  const windowCenter = 1000
  const windowHalf = 50

  it('returns hit when press is within window', () => {
    const r = judgeTiming(1000, windowCenter, windowHalf)
    expect(r.result).toBe('hit')
    expect(r.delta).toBe(0)
  })

  it('returns hit at window boundary', () => {
    expect(judgeTiming(1050, windowCenter, windowHalf).result).toBe('hit')
    expect(judgeTiming(950, windowCenter, windowHalf).result).toBe('hit')
  })

  it('returns early when press is before window', () => {
    const r = judgeTiming(900, windowCenter, windowHalf)
    expect(r.result).toBe('early')
    expect(r.delta).toBeLessThan(0)
  })

  it('returns late when press is after window', () => {
    const r = judgeTiming(1100, windowCenter, windowHalf)
    expect(r.result).toBe('late')
    expect(r.delta).toBeGreaterThan(0)
  })

  it('returns early just before boundary', () => {
    expect(judgeTiming(949, windowCenter, windowHalf).result).toBe('early')
  })

  it('returns late just after boundary', () => {
    expect(judgeTiming(1051, windowCenter, windowHalf).result).toBe('late')
  })

  it('handles zero window half', () => {
    expect(judgeTiming(1000, windowCenter, 0).result).toBe('hit')
    expect(judgeTiming(1001, windowCenter, 0).result).toBe('late')
  })
})
