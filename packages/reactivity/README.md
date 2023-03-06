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

但是实际上 React 是可以实现依赖收集和触发的，只是它是针对应用级别的更新，无需做到这么细粒度而已。下面我就通过 《React 设计原理》、《Vue.js 设计与实现》、mini-vue 和 vue/core 项目，完成最简单的设计、测试的编写，最后实现。

## 设计

## 测试

## 实现

### Vue3

### React