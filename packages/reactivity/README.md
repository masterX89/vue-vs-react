# reactivity

## Info

此处的 reactivity 指的是**“细粒度更新”**（Fine-Grained Reactivity），即“能自动追踪依赖的技术”，本质上是依赖收集和依赖触发。如 Vue 和 Mobx 中：

```javascript
// Vue3 中定义无副作用因变量
const y = computed(() => x.value * 2)
// Mobx 中定义无副作用因变量
const y = computed(() => x.data * 2)
```

而 React 中则无法自动追踪依赖，需要指明自变量：

```javascript
// Vue3 中定义无副作用因变量
const y = useMemo(() => x * 2, [x])
```

但是实际上 React 是可以实现依赖收集和触发的，只是它是针对应用级别的更新，无需做到这么细粒度而已。通过 《React 设计原理》、《Vue.js 设计与实现》、mini-vue 和 vue/core 项目，完成最简单的设计、测试的编写，最后实现。

## 设计

1. 自变量需要有 getter 和 setter，设计有代理模式的拦截器操作
   - getter
     - 收集依赖
     - 返回值
   - setter
     - 修改值
     - 触发依赖
2. 因变量的钩子需要完成以下内容：
   - 定义 ReactiveEffect 中的执行函数 `run`
     - 重置依赖（因此需要 effect 结构中存在 deps）
     - 推入栈顶（栈的作用：嵌套 effect 的执行）
     - 执行 cb
   - 定义 ReactiveEffect
   - 执行 effect 中的执行函数
3. 存储副作用的桶
   - Set（不够完善，但是够解释 Reactivity 了）
4. ReactiveEffect 的结构
   - effectFn
   - deps
5. effectStack 用来存放激活的 activeEffect
   - 如果只有一个 activeEffect 变量，则无法存储嵌套的 effect
   - 

## 测试

1. 

## 实现

### Vue3

### React

## One More Thing

### 存储副作用的桶结构