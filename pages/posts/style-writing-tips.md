---
title: 样式编写的几条建议
date: 2022-11-29T09:32:26+08:00
category: Coding Tips
---

[[toc]]

与逻辑层代码相比较，视图层代码并么有那么值得我们去关注，样式的编写可能 **仅在当前情况符合期望**。由于数据往往是动态的，当出现非常规数据导致的边界问题时，样式有可能就会出现不符合预期的情况；另外在组件复用、代码重构、UI调整时，**Just-Work-in-One-Case** 的样式代码同样会加重开发负担。

世界上没有零Bug的程序，但程序的编写往往就是尽量预防可能会出现的Bug，这里有几条关于样式编写的建议，我觉得非常实用。

## 不要给块组件写定宽度

这里的**块**与 HTML 块级/行内元素同义。当我们给块组件设定固定宽度，在只有一个地方使用它时，这没有任何问题。而当我们开始复用这个组件，且放置该组件的容器宽度不一时，问题就暴露了出来。

![component with constant width](https://static.wayne-wu.com/2022_11_29_12_13_21_ennjio.png)

由于容器宽度与边距的不一致，导致其内容尺寸与组件宽度不适配，为了解决这个问题，你有两个选择：要么用样式穿透强制修改，要么到组件内部修改。前者复用数量越多，需要样式穿透的处理越多，而且样式穿透会导致样式代码混乱，不易于维护；而后者需要兼顾前期代码的正常行为，徒增维护成本。

当你保持组件默认的100%宽度时，无论你把它放在哪里，它始终与容器的宽度和内边距适应，保证其向前兼容性。

## 不要给组件设外边距

类似于编程中的单一职责原则，外边距不是组件的责任范围，将外边距写在组件根节点中，无异于违反了该原则。组件的外边距增加了其容器与自己的耦合度，使它们强关联在一起。在组件复用时同样产生了样式不适应的问题。

利用 Vue 组件属性继承的特点，可以将样式/类名作为属性传递给组件。

```vue
<template>
  <ComponentWithoutMargin class="m" />
</template>

<style>
.m {
  margin: 24px;
}
</style>
```

而鉴于 **UniApp** 小程序不支持 `inheritAttrs`，则需要将组件外包一层 `view`，将外边距样式作用于该包装元素中，或者将 class 添加于组件属性中（但有时样式不生效）。

## 全圆角尽量使用高值设定

当使用相对单位设置元素圆角时，其实际圆角尺寸与元素对应边的长度有关，如果元素长宽不一致，则实际的圆角将表现为非对称的效果，固定数值则可以保证圆角半径的一致性，但表现效果最大不超过其短边尺寸，即使设定了远超长度的大小作为圆角半径。下面的例子表现了不同值下的圆角效果，通过拖动滑块以观察圆角的变化。

<iframe src="https://codesandbox.io/embed/interesting-shaw-swcmnk?autoresize=1&fontsize=14&hidenavigation=1&theme=dark&view=preview"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="interesting-shaw-swcmnk"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   />

百分比圆角在不同尺寸小表现怪异，全圆角的效果只有在长宽一致时才能实现。固定尺寸表现则没有那么怪异。当圆角半径大于边长的一半时，可以实现全圆角。或许多数情况元素尺寸已知，你仍然可以通过计算来设置全圆角，但为了兼容以及后期维护考虑，都应该使用高值来设定圆角，以防止元素尺寸主动或被动发生改变而导致圆角样式BUG的出现。

## 注意盒子尺寸模型

如果一个元素存在边框或者内边距，当指定元素宽度时，你不得不注意盒子的尺寸计算模式，在正常的盒子尺寸计算模式中（不考虑IE的怪异模式），宽/高度仅指内容区的宽/高度，不包含 `padding` 和 `border-width`。在视图层代码编写时，对照UI需要注意尺寸是否包含边框和内边距，如果包含了，则需要设置 `box-sizing: border-box;`。具体可以参考 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-sizing)。