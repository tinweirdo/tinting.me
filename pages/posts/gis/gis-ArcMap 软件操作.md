---
title: ArcMap 软件操作
date: 2023-11-20 14:35
category: GIS
comment: enable
---

[[toc]]

# 切片
## ArcGIS
## ArcGIS Pro


# cad 转 shp 并切片
## cad 转至地理数据库

<Image zoom="0.4" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1700450814138-f2c65899-f61e-4b4d-9a57-49f6ec00725f.png"/>

<Image zoom="0.8" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1700450912334-ee6d2256-1e06-4d63-b14a-b6f9e201c9ba.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0"/>

## 删除多余要素

转换成功后，如下图，开启编辑状态，选中要素后点击 delete 键删除多余要素。
<Image zoom="0.8" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1700211494879-5301103f-f66d-443e-bb5f-1110d9861072.png?x-oss-process=image%2Fresize%2Cw_937%2Climit_0"/>

## 解决标注大小问题

在工作区点击右键，设置数据框属性显示单位，选择 meter。

<Image zoom="0.4" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1700211693335-1a85ba45-d278-4e03-bb13-93b78e207923.png"/>

<Image zoom="0.4" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1700211713201-a0c4801e-fd14-4a9a-a9ca-679d62449a83.png"/>


## [空间校正](https://desktop.arcgis.com/zh-cn/arcmap/10.3/manage-data/editing-existing-features/about-spatial-adjustment.htm)

首先要查看，右下角坐标显示是否规范。x为8位，y为6~7位。如果x为6位，缺少带号，则需要空间校正。若x为8位，则不需要。

**注：如果需要空间校正，要先进行空间校正再定义数据源坐标系，空间校正只是改变了坐标值。**

### 开启编辑模式

打开数据后，打开编辑、空间校正两个工具条。

<Image zoom="0.4" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1665244733986-73339caf-df3a-4e86-a615-e6289effdbac.png"/>
<Image zoom="0.4" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1665244748132-c5ab66dc-aac2-4cc3-81eb-5bdf306fb25f.png"/>

开启编辑模式，便于确定空间校正的数据是哪个

### 设置校正数据

选择校正图层中的所选要素还是所有要素，单击OK。

<Image zoom="0.4" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1665244990923-673e1748-a77c-4c36-8af6-c5f604575ce2.png"/>

<Image zoom="0.4" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1665245030745-3a085dbe-fa72-4260-915b-fb10471991af.png"/>

### 新建位移链接
创建位移连接，任意连接，连接越多数据，校正越精确。

<Image zoom="0.4" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1665245074368-c81c2a6b-80a0-4693-8f54-26633f62aee3.png"/>

### 修改空间校正链接表

<Image zoom="0.4" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1665245305320-aa35c4e3-03e7-4d97-8ba1-8727f645f480.png"/>

原始链接表：

<Image zoom="0.6" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1700451850185-5628b2fc-9265-4433-8006-f6d573294a54.png"/>

这是处理好的数据，原来的 X 源数据是没有带号前缀的，复制 X 源数据到 X 目标数据，并加上空间坐标系的带号作为前缀。而 Y 源数据的数据直接复制到 Y 目标数据即可。如下图所示：（带号为39）

<Image zoom="0.6" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1700451947763-6e4103d9-9428-48a4-b9ce-dd2bafebebfd.png"/>

### 校正数据

<Image zoom="0.2" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1700458732504-84504f8b-eb7e-4b22-9091-6d5549dc54af.png"/>

至此，空间校正完毕。

**注：如果校正完毕后，数据位置显示还是不对，尝试重新打开工作文件。**

<Image zoom="0.2" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1700459612978-a5739bae-e14c-4abd-9525-a5ea425eaae5.png"/>

## 设置坐标系

### 获取中央经线

打开数据源，通过ArcMap右下角显示的x、y坐标位数，判断是六度带还是三度带，再确定当地带号。通过[文档](https://www.yuque.com/office/yuque/0/2023/docx/26909650/1700451122129-d9c9f627-5999-411c-b06d-23ad12dc697f.docx?from=https%3A%2F%2Fwww.yuque.com%2Ftinweirdo%2Fdutzky%2Frkwe9gis3t9n3658)查找中央经线，或者利用百度坐标拾取查询该地区的中央经度。如黄山屯溪，可以知道，中央经度大致为117.7。

通过文档，该数据坐标系为 **CGCS2000 3 Degree GK（Gauss-Kruger 高斯克吕格） Zone 39**。

<Image zoom="0.8" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1700459031079-a841681d-290a-4c52-984d-4caf84010ba9.png"/>

打开数据源属性框。

<Image zoom="0.3" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1700458853126-da0f065c-9961-404d-9930-21fb8be75961.png"/>

### 修改中央经线

查找对应坐标系，右键复制修改中央经线，重命名坐标系，确认后应用即可。

<Image zoom="0.4" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1700459243065-0f2a8a1d-9fda-4483-a762-1cb830be6663.png"/>

<Image zoom="0.4" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1700459291787-02583980-93e8-46f4-a0f5-596f8db6aec7.png"/>

## 添加外部服务底图
### 公司

<Image zoom="0.3" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1700207920659-223f51d0-0a84-46e0-849b-d1e585da043c.png"/>

<Image zoom="0.7" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1700207947555-a651de9a-2223-43e0-9099-07e479e05e7a.png"/>

### 天地图
#### 申请服务端 key

进入控制台，申请 key，应用类型选择“服务端”，提交即可。

<Image zoom="0.8" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1693378958443-e227c889-5f39-44ab-895d-83d273a166ad.png?x-oss-process=image%2Fresize%2Cw_1031%2Climit_0"/>

如何调用，以及底图类型，参考：[链接](http://lbs.tianditu.gov.cn/server/MapService.html)

##### ArcMap

1. 打开 Catalog，双击 "添加 WMTS 服务器"

<Image zoom="0.4" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1693379257883-f4ae6413-9822-416e-a9dc-ca9f0f2e3b34.png"/>

2. 填写服务地址，以及请求参数。（注意：ArcMap 10.5 及以上版本才能正常使用）
<Image zoom="0.4" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1693379477146-7bcd4cf1-8d1b-4387-9040-03062f0f6846.png"/>

3. 点击“获取图层”，后续参考：[链接](http://zhihu.geoscene.cn/article/3911)
   
##### ArcGIS Pro
1. 连接 - 服务器 - 新建 WMTS 服务
<Image zoom="0.6" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1693379613463-661d5829-abd5-40be-aff5-21a9009ca042.png"/>

2. 填写地址和 key 等参数，如果底图加载有问题，地址里可填上 esri 试一下
<Image zoom="0.4" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1693379876166-1bc37586-ed49-4d1d-9f04-52ad0f89cf00.png"/>

# 配置样式
## 切片中显示标注
右击图层，选择属性设置

<Image zoom="0.4" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1668739734360-f79e31fd-ba99-45c5-bf9c-d01715e62406.png"/>

勾选上*Label features in this layer*

<Image zoom="0.6" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1668739799840-b6c02d45-3d5d-42b8-b7bc-99c9f3cc8775.png?x-oss-process=image%2Fresize%2Cw_451%2Climit_0"/>

选择要显示的标注字段：

<Image zoom="0.6" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1668739867492-e38ee13b-a031-4e2f-a80e-53805b41ca47.png?x-oss-process=image%2Fresize%2Cw_716%2Climit_0"/>

类似这种语法拼接：

<Image zoom="0.5" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1668739892078-e09610e5-c360-4bbc-a557-0792fa95b6f0.png?x-oss-process=image%2Fresize%2Cw_499%2Climit_0"/>

默认选中VB语法:

<Image zoom="0.5" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1668739976698-1711f8fa-779f-4016-81b7-b7f2355062f2.png?x-oss-process=image%2Fresize%2Cw_503%2Climit_0"/>

调整标注展示的层级：

<Image zoom="0.6" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1668740041824-46e3300c-33f4-47d2-a8e9-b7bc3bab6bb7.png?x-oss-process=image%2Fresize%2Cw_694%2Climit_0"/>

如，比例尺大于1:3,,000不显示标注

<Image zoom="0.6" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1668740304284-2f1ccb53-3494-454b-90e2-d6517808f4db.png?x-oss-process=image%2Fresize%2Cw_678%2Climit_0"/>

## 通过模板快速配置图标样式
如果已经配置过图标样式，右击图层，选择保存
<Image zoom="0.4" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1668740440320-28e97814-9b51-49dc-af95-f533491573d8.png"/>

保存为*.lyr格式
<Image zoom="0.4" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1668740474973-9aabc1ed-550c-4128-bed0-5a8eaed9723a.png"/>

如果下次有相同的样式需要设置，只需右击图层，选择属性-样式中的import
<Image zoom="0.4" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1668740530301-7a395504-104b-41c8-8ce6-95ba6c241bd5.png"/>

<Image zoom="0.6" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1668740596912-afb79bec-60f2-4e5b-894c-df4c2fde6f87.png?x-oss-process=image%2Fresize%2Cw_561%2Climit_0"/>

选择对应的*.lyr文件即可
<Image zoom="0.8" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1668740720058-16b21a55-630a-4476-8f4e-c1a1b870c5f2.png?x-oss-process=image%2Fresize%2Cw_1031%2Climit_0"/>


# 加载 EXCEL 数据
1. 地图-添加数据-XY点数据
<Image zoom="0.8" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1693380086948-15203b08-9d13-48ec-acb8-4557f3b2c6e2.png"/>

数据格式：
<Image zoom="0.5" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1693380185378-603b48dc-b04c-4b52-b3c2-5471c5fd24e0.png"/>

2. 通过数据的中央经线，处理表格数据，并选择对应坐标系即可。
<Image zoom="0.4" src="https://cdn.nlark.com/yuque/0/2023/png/26909650/1693380282011-22498da9-090c-4711-9e73-3dbe6e0d6b37.png"/>

# [WMS、WFS、WCS、WPS、WMTS、WMSC、TMS等常见地图服务的区别](https://www.cnblogs.com/ssjxx98/p/12531525.html)
