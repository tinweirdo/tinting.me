---
title: Web 开发技术
date: 2023-12-19 11:00
category: Web
comment: hidden
---

[[toc]]

# MutationObserver

**MutationObserver** 接口提供了监视对 **DOM** 树所做更改的能力。


监听某个 DOM 属性值的改变：

```js
$(document).ready(function () {
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.attributeName === 'data-value') {
        console.log('Attribute Changed!');
        observer.disconnect();
      }
    });
  });
  observer.observe($('#myDiv')[0], { attributes: true });
});
```

# ResizeObserver

**ResizeObserver** 接口监视 **Element** 内容盒或边框盒或者 **SVGElement** 边界尺寸的变化。

使用：

```js
// 监听
const resizeObserver = new ResizeObserver((entries) => {
    console.log("Size changed");
});
const divElem = document.querySelector("body > div");
resizeObserver.observe(divElem);
// 结束对指定 Element 的监听。
resizeObserver.unobserve(divElem);
// 取消特定观察者目标上所有对 Element 的监听。
resizeObserver.disconnect();
```