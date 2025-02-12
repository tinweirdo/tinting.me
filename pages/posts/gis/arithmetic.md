---
title: GIS 相关算法
date: 2025-02-11
category: GIS
comment: hidden
---

[[toc]]

# 瓦片服务中的 XYZ

瓦片服务的 URL 地址都非常相似，因为他们遵循规则：
- Tiles are 256 × 256 pixel PNG files
- Each zoom level is a directory, each column is a subdirectory, and each tile in that column is a file
- Filename (URL) format is /zoom/x/y.png

这里有一些例子：
|Name|URL template|zoomlevels|
|----|------------|----------|
|OSM 'standard' style|https://tile.openstreetmap.org/zoom/x/y.png|0-19|
|[OpenCycleMap](https://wiki.openstreetmap.org/wiki/OpenCycleMap)|http://[abc].tile.thunderforest.com/cycle/zoom/x/y.png|0-22|
|Thunderforest Transport|http://[abc].tile.thunderforest.com/transport/zoom/x/y.png|0-22|
|[MapTiles API Standard](https://www.maptilesapi.com/)|https://maptiles.p.rapidapi.com/local/osm/v1/zoom/x/y.png?rapidapi-key=YOUR-KEY|0-19 globally|
|[MapTiles API Standard](https://www.maptilesapi.com/)|https://maptiles.p.rapidapi.com/en/map/v1/zoom/x/y.png?rapidapi-key=YOUR-KEY|0-19 globally with English labels|

URL 的第一部分指定了瓦片服务器。瓦片坐标通常由 **/zoom/x/y.png** 尾部指定。一些瓦片服务器会使用一个目录（例如“/cycle/”）来指定特定的样式表。（历史上，为了解决浏览器对每个主机的同时 HTTP 连接数的限制，经常提供几个子域名，如 a.tile, b.tile, c.tile，但对于现代浏览器来说这不那么重要了。）

这篇[文章](https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames)详细介绍了瓦片服务的相关内容，包括不同级别下瓦片数量、XYZ和经纬度的关系与转换算法。

## 瓦片数量

瓦片数量 = 2<sup>n</sup> * 2<sup>n</sup> = 2<sup>2n</sup>(n表示级数)

## XYZ 与经纬度的转换
XYZ转换成经纬度：
```js
function num2deg(xtile, ytile, zoom) {
  var n = 1 << zoom;
  var lon_deg = xtile / n * 360.0 - 180.0;
  var lat_rad = Math.atan(Math.sinh(Math.PI * (1 - 2 * ytile / n)));
  var lat_deg = lat_rad * 180.0 / Math.PI;
  return [lat_deg, lon_deg];
}
```
经纬度转换为XYZ:
```js
function deg2num(lat_deg, lon_deg, zoom) {
  // 将角度转换为弧度
  var lat_rad = lat_deg * Math.PI / 180.0;
  
  // 计算 tile 数量
  var n = 1 << zoom;
  
  // 计算 xtile 和 ytile
  var xtile = Math.floor((lon_deg + 180.0) / 360.0 * n);
  var ytile = Math.floor((1.0 - Math.asinh(Math.tan(lat_rad)) / Math.PI) / 2.0 * n);
  
  return [xtile, ytile];
}

map.on('click', function(e) {
 console.log(deg2num(e.latlng.lat, e.latlng.lng, map.getZoom()));
});
```

## [瓦片的水平距离](https://wiki.openstreetmap.org/wiki/Zoom_levels)

每个瓦片在指定纬度沿平行线测量的水平距离 S<sub>tiles</sub> = C * cos(latitude) / 2<sup>n</sup>

瓦片每个像素的水平距离 S<sub>pixel</sub> = S<sub>tiles</sub> / 256 = C * cos(latitude) / 2<sup>n + 8</sup>

其中 n 表示级数， C 表示地球在赤道的周长（40 075 016.686 m ≈ 2π ∙ 6 378 137.000 m），以上公式假设地球是完美的球形，而地球实际是椭圆形的，因此计算有误差，中纬度最大绝对误差为 0.3 %，在参考赤道和高纬度向极点处误差为零。

注意，Mapbox GL、MapLibre 默认使用的 512 * 512 像素的瓦片，所以他们的缩放级别比其他工具使用的缩放级别少一级。

