import { describe, expect, it } from 'vitest'
import { effect } from '../src/effect'
import { reactive } from '../src/reactive'

describe('effect', () => {
  it('happy path', () => {
    const num = reactive({ value: 1 })
    let res
    effect(() => { res = num.value + 1 })
    expect(res).toBe(2)
    num.value = 2
    expect(res).toBe(3)
  })
})
