// effect 应该和 value 成映射关系而不是和 target
// 因此设计成如下的数据格式
// 卡老师的 React 书中细颗粒更新是使用 闭包 完成了 value 和 effect 的映射关系
const targetMap: Map<object, Map<string | symbol, Set<ReactiveEffect>>> = new Map()
const effectStack: ReactiveEffect[] = []
let activeEffect: ReactiveEffect

class ReactiveEffect {
  deps: (Set<ReactiveEffect>)[] = []
  private _fn

  constructor(fn: () => any) {
    this._fn = fn
  }

  run() {
    cleanupEffect(this)
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    activeEffect = this
    effectStack.push(activeEffect)
    this._fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
  }
}

export function effect(fn: () => any) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
  return _effect.run.bind(_effect)
}

export function track(target: object, key: string | symbol) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, depsMap = new Map())
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, deps = new Set())
  }
  if (activeEffect) {
    deps.add(activeEffect)
    activeEffect.deps.push(deps)
  }
}

export function trigger(target: object, key: string | symbol) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const deps = depsMap.get(key) || new Set()
  for (const effect of [...deps]) {
    effect.run()
  }
}

function cleanupEffect(effect: ReactiveEffect) {
  for (const deps of effect.deps) {
    deps.delete(effect)
  }
  // 这里不是很好测试, 可以查看对应的测试用例
  // should not react when reactive is not effect
  // 我把 deps 的 length 变化写出来了
  // 如果迷惑只需要记住一点 track 中 deps 会 push
  // 不能让 deps 无限增长
  effect.deps.length = 0
}
