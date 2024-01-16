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

<Image zoom="0.3" src="/images/2024/数学坐标系.png">数学坐标系</Image>

在数学坐标系中，中心是原点，向上是y轴正方向，所以我们常将一个图标的底部作为这个图标的定位点。

<Image zoom="0.3" src="/images/2024/屏幕坐标系.png">屏幕坐标系</Image>

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