# 为什么推荐学源码时直接使用 ts

我发现在学习源码的时候，如果只使用 JavaScript 会对数据结构不够直观
例如清理 effect 时候，deps 的结构只能看到是：

```javascript
deps = []
```

对于 ts 则可以很直观地看到内部结构：

```typescript
deps: (Set<ReactiveEffect>)[] = []
```

所以一开始在学习源码时，可以关注点分离用 anyscript，但是后续深入，我觉得还是使用 ts 更好一些。

所以我现在也在用 ts 重写 mini-vue。

还有一个点是可以很好理解 class，比如《React 设计原理》中，细粒度更新章节实现 `useEffect`：

```javascript
function useEffect(callback) {
    const execute = () => {
        cleanup(effect);
        effectStack.push(effect);
        callback();
        effectStack.pop();
    }
    const effect = {
        execute,
        deps: new Set()
    };
    execute();
}
```

其实就是两步，定义 effect，并执行 effect 中的执行函数。

但是执行函数的内容中，需要对当前的 effect 进行操作。

在《Vue.js 设计与实现》中，`effect` mini 实现如下：

```javascript
function effect(fn) {
    const effectFn = () => {
        cleanup(effectFn)
        effectStack.push(effectFn)
        fn()
		effectStack.pop()
    }
    effectFn.deps = []
    effectFn()
}
```

函数是一等公民，直接把 effectFn 函数作为对象使用在其上挂载 deps 是完全 ok 的。

但是上述两种写法都会感觉怪怪的，第一种写法需要静态提升，第二种写法需要让函数同时作为对象使用。

究其原因是因为 effect 的内部执行函数，需要对当前的 effect 进行操作。这完全就是 class 中使用 this 的场景。

所以如果接受了 ts 的思想，这里就可以自然而然使用 class，更加便于理解。
