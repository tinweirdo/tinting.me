---
title: Echarts 相关
date: 2023-12-18 15:00
category: Echarts
comment: hidden
---

[[toc]]

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