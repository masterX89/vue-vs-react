import { track, trigger } from './effect'

const baseHandler: ProxyHandler<any> = {
  get(target, key) {
    track(target, key)
    return target[key]
  },
  set(target, key, newVal) {
    target[key] = newVal
    trigger(target, key)
    return true
  },
}

export function reactive(target: object) {
  return new Proxy(target, baseHandler)
}
