---
title: 函数 this 指向问题
date: 2023-02-18 12:15:30
category: Work
comment: hidden
---

# 问题引出

公司代码 widget 定义的方式是：

```js
var pipe_manageLayers = L.widget.bindClass(L.widget.BaseWidget.extend({
    // ...
    initOverlaysLayerManager: function () {
        // initOverlaysLayerManager this 指向 pipe_manageLayers
        var setting = {
            callback: {
                onCheck: this.treeOverlays_onCheck,
            }
        };
    },
    treeOverlays_onCheck: function (e, treeId, treeNode) {
        
    },
}));
```

在 `pipe_manageLayers` 内定义了很多变量和函数。设计逻辑上，在这个模块上定义的所有函数，**this** 指向都是 `pipe_manageLayers`。
但是 `treeOverlays_onCheck` 不被 `pipe_manageLayers` 所调用，**this** 指向出现问题。解决方法，在 `treeOverlays_onCheck` 赋值给
`setting.callback.onCheck` 时，将 **this** 绑定为 `pipe_manageLayers`。


# bind 原理

bind() 方法创建一个**新的函数**，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

```js
const module = {
  x: 42,
  getX() {
    return this.x;
  }
};

const unboundGetX = module.getX;
// unboundGetX 是被全局调用的 this 指向 window，window 没有 x
unboundGetX(); // undefined

const boundGetX = unboundGetX.bind(module);
// 将 unboundGetX 的 this 指向 module
boundGetX();//42
```

注意：函数只能使用一次 bind，多次 bind 绑定无效，函数的 this 指向始终是第一个 bind 被调用时传入的对象。

## apply

```js
const numbers = [5, 6, 2, 3, 7];
const max = Math.max.apply(null, numbers);
```
apply() 方法调用一个具有给定 this 值的函数，以及以一个**数组（或一个类数组对象）**的形式提供的参数。

## call

call() 方法使用一个指定的 this 值和单独给出的**一个或多个参数**来调用一个函数。


备注： 该方法的语法和作用与 apply() 方法类似，只有一个区别，就是 call() 方法接受的是一个**参数列表**，而 apply() 方法接受的是一个包含多个参数的**数组**。