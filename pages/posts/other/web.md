---
title: Web 开发技术
date: 2023-12-19 11:00
category: Web
comment: hidden
---

[[toc]]

# 鲁棒性
>鲁棒性 （Robustness）是一个广泛使用的术语，通常用来描述系统、算法或程序在面对异常情况、输入错误、环境变化或其他不确定因素时的稳定性和可靠性。简单来说，鲁棒性强的系统能够在各种复杂或意外的情况下正常运行，而不会崩溃或产生错误的结果。

## 鲁棒性的定义
1. 字面意义 ：鲁棒性来源于英文单词 "robust"，意为“强壮的”、“坚固的”。它表示系统具有抗干扰和适应变化的能力。
2. 技术意义 ：在计算机科学、工程学和其他领域中，鲁棒性指系统在面对以下情况时的表现：
- 输入数据不完整、错误或超出预期范围。
- 环境条件发生变化（如网络延迟、硬件故障等）。
- 存在噪声、误差或不确定性。

## 鲁棒性的重要性
在实际应用中，任何系统都可能面临不可预见的情况。如果系统缺乏鲁棒性，可能会导致以下问题：
- 崩溃或错误 ：系统无法处理异常输入，直接崩溃或返回错误结果。
- 性能下降 ：系统在极端情况下表现不佳，响应时间变长或资源消耗增加。
- 用户体验差 ：用户可能遇到频繁的错误提示或功能失效。

因此，设计鲁棒性强的系统是确保其可靠性和可用性的关键。

## 鲁棒性的应用场景
1. 软件开发
- 输入验证 ：对用户输入进行严格的检查和过滤，防止非法数据导致程序崩溃。
- 异常处理 ：通过 try-catch 或其他机制捕获异常，避免程序中断。
- 边界条件 ：处理极端情况（如空值、极大值、极小值）以确保逻辑正确。
2. 算法设计
- 浮点数计算 ：在几何计算或数值分析中，考虑浮点数精度问题，避免因微小误差导致错误结果。
- 噪声处理 ：在机器学习或信号处理中，算法需要能够容忍一定程度的噪声或不准确的数据。
3. 工程系统
- 容错能力 ：例如，分布式系统在部分节点失效时仍能继续运行。
- 冗余设计 ：通过备份或冗余组件提高系统的可靠性。

## 提高鲁棒性的方法
1. 数据验证与预处理
- 对输入数据进行严格检查，确保其符合预期格式和范围。
- 示例：
```js
function validatePoint(point) {
    if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') {
        throw new Error("Invalid point format");
    }
}
```
2. 容差机制
- 在涉及浮点数或近似计算的场景中，引入容差值（如 `1e-6`），避免因微小误差导致错误判断。
- 示例：
```js
const distance = Math.hypot(px - projectionX, py - projectionY);
return distance < 1e-6 ? 0 : distance; // 容差值为 1e-6
```
3. 异常处理
- 使用异常处理机制捕获潜在错误，并提供合理的回退方案。
- 示例：
```js
try {
    const result = riskyOperation();
    console.log("Result:", result);
} catch (error) {
    console.error("Error occurred:", error.message);
}
```
4. 边界条件测试
- 测试算法在极端情况下的表现，例如：
  - 输入为空。
  - 数据超出正常范围（如极大值或极小值）。
  - 特殊情况（如点正好在线段端点上）。
5. 冗余与备份
在关键系统中引入冗余设计，例如：
- 备份数据库以防数据丢失。
- 分布式系统中使用多个副本提高可用性。

## 总结
鲁棒性是衡量系统稳定性的重要指标，尤其在面对复杂或不确定环境时尤为重要。通过数据验证、容差机制、异常处理和边界条件测试等手段，可以显著提高系统的鲁棒性。无论是在软件开发、算法设计还是工程实践中，鲁棒性都是确保系统可靠性和用户体验的关键因素。
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

# json 

## json 文件里加双引号

使用反斜杠：`\"`