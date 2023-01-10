---
title: UniApp：在组件中使用小程序生命周期钩子
date: 2023-01-10T14:12:50+08:00
category: Code Tips
---

[[toc]]

> 以下实现基于 Vue2，UniApp Vue3 已经支持在子组件注册页面生命周期钩子。

在 UniApp 小程序中，UniApp 代理了所有小程序事件，并在事件触发时手动调用 Vue 组件实例上的对应 Hook，而页面生命周期事件只会在小程序 Page 实例上触发，UniApp 也只会调用应用页面根组件上对应的 Hook。

在这种限制下，如果组件某些行为需要依靠页面生命周期，则需要将组件的数据和逻辑提升到根组件中，为了可维护性，可以按组件划分成单独的 mixin，但这样仍然存在一些问题：

1. 组件间高度耦合；
2. 开发者工具缺少对 mixin 的智能提示；
3. 页面组件逻辑复杂。

如果可以在组件中注册页面生命周期钩子，就不会有这些问题了。

## 实现原理

既然 UniApp 代理了页面生命周期事件，并将事件转发到页面组件中，我们可以考虑将子组件的生命周期钩子写到根组件中（这不是废话吗）。不过当然不是让我们自己手动去添加，而是需要某些操作去自动添加。

为了完成这种操作，我们考虑这么实现：在全局设置一个容器，如果组件配置了相关生命周期钩子，则把这些钩子放进容器中，等到生命周期事件触发时，将这些钩子函数从容器中取出依次调用。

## Vue2 中的实现

我们通过 `Vue.mixin` 让每个组件在 `beforeCreate` 时检测当前组件配置了那些生命周期钩子，并将起放到容器中，然后在 `destroyed` 时将钩子函数从容器中移除。同时还需要给页面组件注册几个生命周期钩子，页面的生命周期钩子被调用时，组件的钩子也需要被调用（即从容器中取出进行调用）。

```javascript
const lifecycles = ['onShow', 'onHide', 'onLoad']

const mixin = {
  beforeCreate() {
    if (this === this.$root) {
      // 如果当前是根组件，初始化一个容器放在组件实例上
      // 该容器存储了对应生命周期的所有钩子函数
      this.__HOOKS_MAP = {}
      // 同时根组件的钩子函数不需要进行收集，直接返回
      return
    }
    for (const lifecycle of lifecycles) {
      // 查找组件配置中设置了的生命周期钩子
      const hooks = this.$options[lifecycle] ?? []
      const hookSet = this.$root.__HOOKS_MAP[lifecycle] ?? (this.$root.__HOOKS_MAP[lifecycle] = new Set())
      for (const hook of hooks) {
        // 跳过代理钩子
        if (hook.__IS_PROXY_HOOK) continue
        // 钩子绑定当前实例，保证钩子函数内的 this 指向
        hookSet.add(hook.bind(this))
      }
    }
  },
  destroyed() {
    for (const lifecycle of lifecycles) {
      // 组件销毁时，将钩子函数从容器中删除
      this.$root.__HOOKS_MAP[lifecycle]?.delete(this.$options[lifecycle])
    }
  },
}

for (const lifecycle of lifecycles) {
  const proxyHook = function() {
    // 该函数会注册到根组件中，代理调用子组件的生命周期钩子
    const hooks = Array.from(this?.$root?.__HOOKS_MAP[lifecycle] ?? [])
    for (const hook of hooks) hook()
  }
  // 设置 `__IS_PROXY_HOOK` 代表它是一个代理钩子
  // 钩子收集到容器的步骤需要将其跳过，不然会爆栈
  proxyHook.__IS_PROXY_HOOK = true
  mixin[lifecycle] = proxyHook
}

// 混入 mixin
Vue.mixin(mixin)
```

需要注意的是，由于 `Vue.mixin` 的混入会作用在每一个组件实例中，`proxyHook` 也会被设置到子组件中，在 `beforeCreate` 时应避免收集，如果它也被收集到容器中，它会被不断的递归调用，调用栈就爆了。

## Vu2 Composition Api 中的实现

`@vue/composition-api` 和 `uni-composition-api` 让我们可以在 Vue2 中使用组合式 API，页面生命周期的注册 Hook 都在 `uni-composition-api` 中，如果我们需要在子组件中使用组合式 API 注册页面生命周期处理函数，则需要对 `uni-composition-api` 进行改造。因为 `uni-composition-api` 已经实现了 hook 收集和代理调用，改造工作非常简单。

以下代码从 `uni-composition-api` 中摘取，事件注册钩子就是依靠它实现的，它会将组件的生命周期 hook 到当前组件的某个容器中，我们将 `currentContext` 的获取改成根组件即可，注意：组件卸载时仍然需要清理掉不需要的 hook。

```diff
// uni-composition-api/dist/index.esm.js
const createHook = (lifecycle) => {
  return (hook) => {
    const containerName = `__${lifecycle.toLocaleUpperCase()}_HOOKS__`;
-   const currentContext = getCurrentInstance();
+   const instance = getCurrentInstance();
+   const currentContext = instance?.root ?? instance;
    if (!currentContext) {
      throw Error(`\u8BFB\u53D6\u5F53\u524D\u4E0A\u4E0B\u6587\u5931\u8D25, \u8BF7\u786E\u4FDD\u5728 setup \u4E2D\u6267\u884C ${lifecycle}`);
    }
    if (Array.isArray(currentContext.proxy[containerName])) {
      currentContext.proxy[containerName].push(hook);
    } else {
      currentContext.proxy[containerName] = [hook];
    }
+   // 组件卸载时从根组件中移除 hook
+   onUnmounted(() => {
+     const pruned = currentContext.proxy[containerName].filter(addedHook => addedHook !== hook)
+     currentContext.proxy[containerName] = pruned
+   })
  };
};
```