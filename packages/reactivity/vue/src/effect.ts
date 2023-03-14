const bucket: Set<ReactiveEffect> = new Set()

let activeEffect: ReactiveEffect

class ReactiveEffect {
  // deps: (Set<ReactiveEffect>)[] = []
  private _fn

  constructor(fn: () => any) {
    this._fn = fn
  }

  run() {
    // cleanup effects
    // effectStack: ReactiveEffect[] 处理嵌套 effect
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    activeEffect = this
    this._fn()
  }
}

export function effect(fn: () => any) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

export function track() {
  if (activeEffect) {
    bucket.add(activeEffect)
  }
}

export function trigger() {
  for (const effect of [...bucket]) {
    effect.run()
  }
}
