import { describe, expect, it, vi } from 'vitest'
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

  // targetMap -> depsMap -> deps 的理由
  it('should observe properties not reactive object', () => {
    const nums = reactive({ num1: 0, num2: 1 })
    const dummy: any = {}
    const fnSpy = vi.fn(() => (dummy.num1 = nums.num1))
    effect(fnSpy)
    expect(fnSpy).toHaveBeenCalledTimes(1)
    expect(dummy).toEqual({ num1: 0 })
    nums.num2 = 5
    expect(fnSpy).toHaveBeenCalledTimes(1)
    expect(dummy).toEqual({ num1: 0 })
    nums.num1 = 4
    expect(dummy).toEqual({ num1: 4 })
    expect(fnSpy).toHaveBeenCalledTimes(2)
  })

  // 思考一个问题: cleanup 是不是会性能消耗?
  // 具体可以看这个 PR #4017 https://github.com/vuejs/core/pull/4017
  it('should not react when reactive is not effect', () => {
    const obj = reactive({ ok: true, msg: 'cleanup' })
    let dummy
    const fnSpy = vi.fn(() => dummy = obj.ok ? obj.msg : 'not cleanup')
    effect(fnSpy)
    // effect.deps.length: 0 -> cleanup -> 0 -> track -> 2
    expect(fnSpy).toHaveBeenCalledTimes(1)
    expect(dummy).toBe('cleanup')
    obj.ok = false
    // effect.deps.length: 2 -> cleanup -> 0 -> track -> 1
    expect(fnSpy).toHaveBeenCalledTimes(2)
    obj.msg = ''
    expect(fnSpy).toHaveBeenCalledTimes(2)
    expect(dummy).toBe('not cleanup')
    obj.ok = true
    // effect.deps.length: 1 -> cleanup -> 0 -> track -> 2
    obj.ok = false
    // effect.deps.length: 2 -> cleanup -> 0 -> track -> 1
  })
  it('should run the passed function once (wrapped by a effect)', () => {
    const fnSpy = vi.fn(() => {})
    effect(fnSpy)
    expect(fnSpy).toHaveBeenCalledTimes(1)
  })

  it('should observe basic properties', () => {
    let dummy
    const counter = reactive({ num: 0 })
    effect(() => (dummy = counter.num))

    expect(dummy).toBe(0)
    counter.num = 7
    expect(dummy).toBe(7)
  })

  it('should observe multiple properties', () => {
    let dummy
    const counter = reactive({ num1: 0, num2: 0 })
    effect(() => (dummy = counter.num1 + counter.num1 + counter.num2))

    expect(dummy).toBe(0)
    counter.num1 = 10
    counter.num2 = 7
    expect(dummy).toBe(27)
  })

  it('should handle multiple effects', () => {
    let dummy1, dummy2
    const counter = reactive({ num: 0 })
    effect(() => (dummy1 = counter.num))
    effect(() => (dummy2 = counter.num))

    expect(dummy1).toBe(0)
    expect(dummy2).toBe(0)
    counter.num++
    expect(dummy1).toBe(1)
    expect(dummy2).toBe(1)
  })

  it('should allow nested effects', () => {
    const nums = reactive({ num1: 0, num2: 1, num3: 2 })
    const dummy: any = {}

    const childSpy = vi.fn(() => (dummy.num1 = nums.num1))
    const childeffect = effect(childSpy)
    const parentSpy = vi.fn(() => {
      dummy.num2 = nums.num2
      childeffect()
      dummy.num3 = nums.num3
    })
    effect(parentSpy)

    expect(dummy).toEqual({ num1: 0, num2: 1, num3: 2 })
    expect(parentSpy).toHaveBeenCalledTimes(1)
    expect(childSpy).toHaveBeenCalledTimes(2)
    // this should only call the childeffect
    nums.num1 = 4
    expect(dummy).toEqual({ num1: 4, num2: 1, num3: 2 })
    expect(parentSpy).toHaveBeenCalledTimes(1)
    expect(childSpy).toHaveBeenCalledTimes(3)
    // this calls the parenteffect, which calls the childeffect once
    nums.num2 = 10
    expect(dummy).toEqual({ num1: 4, num2: 10, num3: 2 })
    expect(parentSpy).toHaveBeenCalledTimes(2)
    expect(childSpy).toHaveBeenCalledTimes(4)
    // this calls the parenteffect, which calls the childeffect once
    nums.num3 = 7
    expect(dummy).toEqual({ num1: 4, num2: 10, num3: 7 })
    expect(parentSpy).toHaveBeenCalledTimes(3)
    expect(childSpy).toHaveBeenCalledTimes(5)
  })
})
