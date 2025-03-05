---
title: GIS 相关算法
date: 2025-02-11
category: GIS
comment: hidden
---

[[toc]]

# 点线叠置分析

## 问题背景
 - 给定一个点的坐标和一组管线的位置信息，判断该点是否位于某条管线上。
 - 如果点不在任何管线上，则找到距离该点最近的管线。
 - 对于大规模数据（如数万甚至数百万个点和管线），如何高效地完成上述计算？
这类问题的核心是**几何计算**和**性能优化** ，需要结合**空间索引、批量处理和并行计算**等技术来提升效率。

## 算法思路

1. 数据预处理
 - 管线数据结构化 ：每条管线由多个线段组成，每个线段由两个端点表示。例如，一条管线可以表示为 `[[x1, y1], [x2, y2], ..., [xn, yn]]`。
 - 构建 **R-Tree** 索引 ：使用 R-Tree 或其他空间索引结构对管线进行预处理，快速筛选出与目标点相关的候选管线。
2. 点到线段的距离计算
 - 投影参数 `t` ：通过向量投影计算点在线段方向上的位置比例 `t`。如果 `t` ∈ [0, 1]，说明点在线段范围内；否则，点在线段的延长线上，`t` < 0，投影点在线段起点的延长线上，`t` > 1，投影点在线段终点的延长线上。
 - 点到线段的距离公式 ：利用向量点积和模长计算点到线段的最短距离。
3. 批量处理与并行计算
 - 分批处理点 ：将大量点分成小批次，分别分配给不同的线程或任务处理。
 - Web Workers 并行计算 ：利用 Web Workers 将计算任务分布到多个线程中，避免阻塞主线程。
4. 缓存机制
 - 管线数据缓存 ：第一次请求管线数据后，将其缓存到内存中，避免重复请求。
 - R-Tree 缓存 ：构建一次 R-Tree 后，将其缓存起来，后续查询直接使用。

## 关键优化点

1. 浮点数精度问题
 - 在几何计算中，浮点数的微小误差可能导致错误结果。通过引入容差值（如 1e-6），确保计算结果的鲁棒性。
 - 示例：
  ```js
  const distance = Math.hypot(px - projectionX, py - projectionY);  
  return distance < 1e-6 ? 0 : distance; // 容差值为 1e-6 
  ```
2. 边界条件处理
 - 当点位于线段的端点上时，确保逻辑能够正确识别。
 - 当点位于线段的延长线上时，返回最近的端点作为结果。
3. R-Tree 查询范围
 - 扩大 R-Tree 的查询范围，确保点附近的管线都能被选中。
 - 示例：
  ```js
  const bbox = {
      minX: point.x - 1e-5,
      minY: point.y - 1e-5,
      maxX: point.x + 1e-5,
      maxY: point.y + 1e-5
  };
  ```
4. 并行计算
 - 使用 Web Workers 将点分批处理，充分利用多核 CPU 的计算能力。
 - 示例：
  ```js
  worker.postMessage({ batch, rtree: pipelineCache.rtree.toJSON() }); 
  ```
5. 调试日志
 - 在关键步骤添加调试日志，观察每一步的计算结果，便于排查问题。
 - 示例：
  ```js
  console.log(`Point (${point.x}, ${point.y}) candidates:`, candidates);  
  ``` 

## 收获与总结
1. 技术收获
 - 空间索引的重要性 ：R-Tree 等空间索引结构显著减少了不必要的计算，提升了查询效率。
 - 并行计算的价值 ：Web Workers 充分利用了多核 CPU 的性能，尤其适合处理大规模数据。
 - 浮点数精度的处理 ：在几何计算中，必须考虑浮点数的微小误差，避免因精度问题导致错误结果。
2. 实践经验
 - 模块化设计 ：将功能分解为独立的模块（如点到线段的距离计算、R-Tree 构建等），便于维护和扩展。
 - 性能测试 ：在实际应用中，务必对算法进行性能测试，确保其能够处理大规模数据。
3. 未来改进方向
 - GPU 加速 ：对于超大规模数据，可以尝试使用 WebGL 或 WebGPU 进行 GPU 加速。
 - 动态更新管线数据 ：如果管线数据可能发生变化，可以引入版本号或时间戳机制，动态刷新缓存。

## 示例代码片段
1. 点到线段的距离计算:
```js
function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSquared = dx * dx + dy * dy;

    if (lengthSquared === 0) {
        return Math.hypot(px - x1, py - y1);
    }

    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSquared));
    const projectionX = x1 + t * dx;
    const projectionY = y1 + t * dy;

    return Math.hypot(px - projectionX, py - projectionY);
}
```
2. Web Worker 并行计算
```js
self.onmessage = function (event) {
    const { batch, rtree } = event.data;

    const results = batch.map(point => {
        const bbox = { minX: point.x, minY: point.y, maxX: point.x, maxY: point.y };
        const candidates = rtree.search(bbox).map(item => item.pipeline);

        let nearestPipeline = null;
        let minDistance = Infinity;

        candidates.forEach((pipeline) => {
            const distance = pointToPipelineDistance(point, pipeline);
            if (distance < minDistance) {
                minDistance = distance;
                nearestPipeline = pipeline;
            }
        });

        return { point, nearestPipeline, minDistance };
    });

    self.postMessage(results);
};
```

## 完整代码
```js
// 全局缓存对象
const pipelineCache = {
    rtree: null, // 缓存的 R-Tree,避免了重复构建 R-Tree 的开销
    url: null,  // 请求的 URL
    where: null, // 查询条件
    pipelines: null,//管线的缓存
};
// 全局对象 geoUtils
const geoUtils = {
    pointToPipelineDistance(point, pipeline) {
        let minDistance = Infinity;
        let nearestSegment = null;

        for (let i = 0; i < pipeline.geometry.paths[0].length - 1; i++) {
            const p1 = pipeline.geometry.paths[0][i];
            const p2 = pipeline.geometry.paths[0][i + 1];
            const distance = this.pointToSegmentDistance(point.x, point.y, p1[0], p1[1], p2[0], p2[1]);

            if (distance < minDistance) {
                minDistance = distance;
                nearestSegment = { p1, p2 }; // 记录最近的线段
            }
        }
        return { minDistance, nearestSegment };
    },
    pointToSegmentDistance(px, py, x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const lengthSquared = dx * dx + dy * dy;

        if (lengthSquared === 0) {
            return Math.hypot(px - x1, py - y1);
        }

        // 计算投影参数 t
        const t = ((px - x1) * dx + (py - y1) * dy) / lengthSquared;

        // 投影点坐标
        let projectionX, projectionY;
        if (t < 0) {
            // 投影点在线段起点的延长线上
            projectionX = x1;
            projectionY = y1;
        } else if (t > 1) {
            // 投影点在线段终点的延长线上
            projectionX = x2;
            projectionY = y2;
        } else {
            // 投影点在线段范围内
            projectionX = x1 + t * dx;
            projectionY = y1 + t * dy;
        }

        // 返回点到投影点的距离，并允许一定的容差
        const distance = Math.hypot(px - projectionX, py - projectionY);
        return distance < 1e-6 ? 0 : distance; // 容差值为 1e-6
    },
    // 计算线段的边界框
    calculateBoundingBox(points) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        points.forEach(([x, y]) => {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        });
        return { minX, minY, maxX, maxY };
    },
    // 构建 R-Tree 索引
    buildRTree(pipelines) {
        const rtree = new RBush();
        pipelines.forEach((pipeline) => {
            const bbox = this.calculateBoundingBox(pipeline.geometry.paths[0]); // 计算管线的边界框
            rtree.insert({ ...bbox, pipeline });
        });
        return rtree;
    },
    // 辅助函数：判断点是否在线段上
    isPointOnSegment(point, segment) {
        if (!segment) return false;

        const { p1, p2 } = segment;
        const distanceToP1 = Math.hypot(point.x - p1[0], point.y - p1[1]);
        const distanceToP2 = Math.hypot(point.x - p2[0], point.y - p2[1]);
        const segmentLength = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);

        // 如果点到两端点的距离之和约等于线段长度，则点在线段上
        return Math.abs(distanceToP1 + distanceToP2 - segmentLength) < 1e-6;
    },
    // 查询最近的管线
    async findNearestPipeline(point, url, where) {
        // 检查缓存是否命中
        if (pipelineCache.url != url || pipelineCache.where != where) {
            console.log("Fetching new pipeline data...");
            // 获取管线数据并构建 R-Tree
            const response = await axios({
                method: 'post',
                url: url,
                params: {
                    where: where,
                    outFields: "globalId,map_num_s,map_num_e",
                    returnGeometry: true
                }
            });

            const pipelines = response.data.features || [];
            if (!pipelines.length) return;

            // 构建或者更新 R-Tree 并缓存
            pipelineCache.url = url;
            pipelineCache.where = where;
            pipelineCache.pipelines = pipelines;
            pipelineCache.rtree = geoUtils.buildRTree(pipelines);
        }
        // 查询候选管线
        const bbox = {
            minX: point.x - 1e-5, // 扩大范围
            minY: point.y - 1e-5,
            maxX: point.x + 1e-5,
            maxY: point.y + 1e-5
        };
        const candidates = pipelineCache.rtree.search(bbox).map(item => item.pipeline);
        // 计算每个点到候选管线的最小距离
        let nearestPipeline = null;
        let minDistance = Infinity;

        candidates.forEach((pipeline) => {
            const { minDistance: distance, nearestSegment } = this.pointToPipelineDistance(point, pipeline);

            if (distance < minDistance) {
                minDistance = distance;
                nearestPipeline = {
                    pipeline: pipeline,
                    segment: nearestSegment // 记录最近的线段
                };
            }
        });

        return {
            point,
            nearestPipeline: nearestPipeline ? nearestPipeline.pipeline.attributes : null,
            minDistance,
            onSegment: this.isPointOnSegment(point, nearestPipeline?.segment) // 判断点是否在线段上
        };
    },
};
```
测试调用：
```js
const point = { x: 104.96708481492415, y: 28.830304191216914 };

pipelineCache.pipelines = [{
    attributes: { globalId: "123", map_num_s: "A1", map_num_e: "B1" },
    geometry: {
        paths: [
            [
                [104.967086896, 28.830304956],
                [104.967147054, 28.830327013]
            ]
        ]
    }
}];
const results = await findNearestPipeline(point);
```

# 瓦片服务中的 XYZ

瓦片服务的 URL 地址都非常相似，因为他们遵循规则：
- Tiles are 256 × 256 pixel PNG files
- Each zoom level is a directory, each column is a subdirectory, and each tile in that column is a file
- Filename (URL) format is /zoom/x/y.png

这里有一些例子：
| Name                                                             | URL template                                                                    | zoomlevels                        |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------- |
| OSM 'standard' style                                             | https://tile.openstreetmap.org/zoom/x/y.png                                     | 0-19                              |
| [OpenCycleMap](https://wiki.openstreetmap.org/wiki/OpenCycleMap) | http://[abc].tile.thunderforest.com/cycle/zoom/x/y.png                          | 0-22                              |
| Thunderforest Transport                                          | http://[abc].tile.thunderforest.com/transport/zoom/x/y.png                      | 0-22                              |
| [MapTiles API Standard](https://www.maptilesapi.com/)            | https://maptiles.p.rapidapi.com/local/osm/v1/zoom/x/y.png?rapidapi-key=YOUR-KEY | 0-19 globally                     |
| [MapTiles API Standard](https://www.maptilesapi.com/)            | https://maptiles.p.rapidapi.com/en/map/v1/zoom/x/y.png?rapidapi-key=YOUR-KEY    | 0-19 globally with English labels |

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


