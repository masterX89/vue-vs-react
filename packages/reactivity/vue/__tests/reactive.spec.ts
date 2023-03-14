import { describe, expect, it } from 'vitest'
import { reactive } from '../src/reactive'

describe('reactive', () => {
  it('happy path', () => {
    const original = { value: 1 }
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(observed.value).toBe(1)
    observed.value = 2
    expect(observed.value).toBe(2)
    expect(original.value).toBe(2)
  })
})
