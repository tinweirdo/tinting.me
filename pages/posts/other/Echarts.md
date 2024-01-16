---
title: Echarts 相关
date: 2023-12-18 15:00
category: Web
comment: hidden
---

[[toc]]

# setOption

> 有时重新渲染图表时，toolTip 会有残留。

## 解决

设置 `chart` 的 `notMerge` 为 `true`，根据新 `option` 创建所有新组件。

```js
var myChart = echarts.init(document.getElementById('echarts'));
const options = {
  // ...
}
myChart.setOption(options,true);
```

## 补充：echartsInstance.setOption

<Image zoom="0.5" src="/images/2024/echart.setOption.png"/>

- **`notMerge`** 可选。是否不跟之前设置的 `option` 进行合并。默认为 `false`。即表示合并。合并的规则，详见 组件合并模式。如果为 `true`，表示所有组件都会被删除，然后根据新 `option` 创建所有新组件。
- **`replaceMerge`** 可选。用户可以在这里指定一个或多个组件，如：`xAxis, series`，这些指定的组件会进行 "`replaceMerge`"。如果用户想删除部分组件，也可使用 "`replaceMerge`"。详见 组件合并模式。
- **`lazyUpdate`** 可选。在设置完 `option` 后是否不立即更新图表，默认为 `false`，即同步立即更新。如果为 `true`，则会在下一个 **animation frame** 中，才更新图表。
- **`silent`** 可选。阻止调用 `setOption` 时抛出事件，默认为 `false`，即抛出事件。



# [获取 series 颜色](https://stackoverflow.com/questions/70780091/is-there-a-way-on-echarts-to-get-the-series-colors)


```js
myChart.getModel().getSeries().map(s => {
  return {
    seriesIndex: s.seriesIndex,
    seriesColor: myChart.getVisual({
      seriesIndex: s.seriesIndex
    }, 'color')
  }
})
```

# 图表尺寸跟随窗口变化

## ResizeObserver

`ResizeObserver` 是一个用于监听元素尺寸变化的 `JavaScript API`，它可以用来监测元素的宽度和高度的改变。虽然 `ResizeObserver` 主要用于监测元素的尺寸变化，但它也可以在某些情况下监听元素**从隐藏到显示**的变化。

当一个元素从隐藏状态变为显示状态时，它的尺寸也会发生变化。即使在 `CSS` 中将元素的 `display` 属性设置为 `none`，当该属性被更改为 `block、inline` 或其他可见的值时，元素会重新显示并占据空间，导致其宽度和高度发生变化。这样一来，`ResizeObserver` 就能够检测到元素的尺寸变化，包括从隐藏到显示的变化。

需要注意的是，`ResizeObserver` 并不直接监听元素的显示状态的改变，而是通过检测元素尺寸的变化来推断元素的显示状态是否发生了变化。因此，当一个元素从隐藏到显示时，`ResizeObserver` 可以通过检测到其尺寸的变化来间接地判断元素的显示状态发生了改变。

## 解决 chart 不跟随窗口变化

如果监听的是 `window` 的 `resize`，当整个窗口尺寸发生变化时，chart 才会重新渲染，有时会漏掉某些情况，因为 `chart` 尺寸与父节点直接关联，应该直接监测 `chart` 父节点的尺寸变化。

```js
const chartDom = document.getElementById('chart_yhq');
const chart = echarts.init(chartDom);
const option = {
  // ...
}
chart.setOption(option);

const resizeObserver = new ResizeObserver(() => chart.resize())
resizeObserver.observe(chartDom)//监听父节点的窗口变化
```