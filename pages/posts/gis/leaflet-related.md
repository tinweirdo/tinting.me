---
title: Leaflet 相关知识
date: 2023-09-26 14:22
category: GIS
comment: hidden
---

[[toc]]

# 绘制的 Marker 随地图拖动位置偏移

## 问题引出

给定坐标将图标固定在地图中的某个位置，由于图标是有具体大小，并且**大小固定不变**，在缩放过程中有明显感觉随着地图**比例尺缩小**，图标会有一定的偏移。

```js
const myIcon = L.icon({
  iconUrl: 'cdkc_pipe_yun/res/mapicon/rq/yhq_company.png'
});
const iframeContent = `<iframe width="300" height="260" style="border: none;" src="cdkc_pipe_yun/2d/base/yhqCompany_light/popup.html" tenantId="${company.id}"></iframe>`;
const marker = L.marker([latitude, longitude], { icon: myIcon })
  .bindPopup(iframeContent, { maxWidth: 900, riseOffset: 250, zIndexOffset: 1000 });
marker._leaflet_id = 'ydtqId-' + company.id;
this.featureGroup.addLayer(marker);
```

出现这个偏移的感觉主要是由**数学坐标系**和**屏幕坐标**的区别导致的。

<Image zoom="0.3" src="https://cdn.jsdelivr.net/gh/tinweirdo/images/2024/数学坐标系.png">数学坐标系</Image>

在数学坐标系中，中心是原点，向上是y轴正方向，所以我们常将一个图标的底部作为这个图标的定位点。

<Image zoom="0.3" src="https://cdn.jsdelivr.net/gh/tinweirdo/images/2024/屏幕坐标系.png">屏幕坐标系</Image>

但在屏幕坐标系，是以左上角作为坐标原点，右方向作为x轴正方向，下方向作为y轴正方向。

在屏幕坐标系中，**图标左上角固定不变**，缩放过程中，底部指向的位置一直在变，给人感觉就是图标在慢慢偏移。

<font color="red" face="宋体">注：使用 `marker` 默认图标 x 和 y 会自动偏移，使用自定义图标需要手动偏移。</font>

## 解决方式

```js
const myIcon = L.icon({
    iconUrl: 'cdkc_pipe_yun/res/mapicon/rq/yhq_company.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -20],
});
```

`iconAnchor` 参数是反符号偏移 `[20, 40]` 对应的样式是 `margin-left: -20` 和 `margin-top: -40`，这样中心点就是在图标的底部。

`popupAnchor` 是相对于 `iconAnchor` 的位置。

## 参考文章

- [1] <font size="0.1" face="宋体">[自定义图标偏移问题](https://juejin.cn/post/7255514764753764411)</font>
- [2] <font size="0.1" face="宋体">[Why my markers move when I resize my map on Leaflet?](https://gis.stackexchange.com/questions/352480/why-my-markers-move-when-i-resize-my-map-on-leaflet)</font>


# 地图在高缩放级别下标记（L.icon）发生偏移

> 当地图级别低于 23 级时，图标不会发生偏移，超过 23 级时，图标发生偏移？

## 为什么?

这主要归咎于**浮点数精度问题**。这是 **JavaScript**（和其他许多编程语言）处理非常大或非常小的数字时常见的问题。

在地图上放大到较高的缩放级别，相应的像素坐标值会变得非常大，而 JavaScript 对大数的处理并不完美，可能会出现精度缺失的问题。

另外，像素的坐标其实是连续的，而实际上计算机中的浮点数是离散的，在极大或极小的数值下，两个相邻的浮点数之间的差距（也就是精度）可能比一个像素还要大。所以当在这个级别操作的时候，可能会发现标记好像"跳跃"了一下，实际上这是由浮点数精度问题导致的。

一般解决方案是，尽量避免在这么大的级别下工作，或者在显示之前将坐标值转为整数。因此，一个可能的解决方案是添加一些代码来人工矫正偏移，或者使用一些库或插件来虚拟更高的缩放级别，这些方法通常会有一些额外的处理来避免这个问题。

## 解决

1. **使用其他库或插件**：如 `Leaflet.MarkerCluster` 插件，其可能为大量标记及高级别缩放提供了优化解决方案。
2. **限制最大缩放级别。**

# [FAQ](https://github.com/Leaflet/Leaflet/blob/main/FAQ.md)

## 支持的瓦片服务

Leaflet 是无关供应商的，这意味着只要遵守其使用条款，我们就可以使用任何地图供应商。当然也可以自己制作瓦片。其中 OpenStreetMap 是不同瓦片供应商中最受欢迎的数据源。这个[例子](https://leaflet-extras.github.io/leaflet-providers/preview/)包含了七十多种图层，包括 [MapBox](http://mapbox.com/), [Bing Maps](http://www.microsoft.com/maps/choose-your-bing-maps-API.aspx) (using a [plugin](https://github.com/shramov/leaflet-plugins)), [Esri ArcGIS](http://www.esri.com/software/arcgis/arcgisonline/maps/maps-and-map-layers) ([official plugin](https://github.com/Esri/esri-leaflet)), [Here Maps](https://developer.here.com/), and [Stadia Maps](https://docs.stadiamaps.com/tutorials/raster-maps-with-leaflet/).

这里有一份[指南](http://switch2osm.org/serving-tiles/)，介绍了如何使用 leaflet 创建自己的 OSM 服务器。

## 数据加载

这篇[文章](https://github.com/tmcw/mapmakers-cheatsheet)介绍了不同种类、数量的数据，如何使用地图库达到最佳性能。

# Leaflet 介绍

这个[视频](http://www.youtube.com/watch?v=_P2SaCPbJ4w)介绍了创造 leaflet 的故事、哲学、历史背景，他是[作者](https://agafonkin.com/)为了解决 openLayers 太过庞大，优化性能所提出的一种解决方式。