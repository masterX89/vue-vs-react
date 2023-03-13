const baseHandler: ProxyHandler<any> = {
  get(target, key) {
    return target[key]
  },
  set(target, key, newVal) {
    target[key] = newVal
    return true
  },
}

export function reactive(target: object) {
  return new Proxy(target, baseHandler)
}
