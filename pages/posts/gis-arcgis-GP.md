---
title: 图层坐标系纠正、合并、擦除、字段的处理
date: 2022-06-27 14:38
category: GIS
comment: hidden
---

[[toc]]

# 要求

基于 ArcGIS 10.2 内置 python 调用 GP，实现：
- 检查自定义坐标系，并纠正
- 将新增基本农田图层合并到基本农田图层
- 将项目区占用图层从基本农田图层擦除
- 按四川行政区划目录存储成果

# 代码

设置工作路径：

```python
# config.py 
import os

workPath = os.path.dirname( os.path.abspath(__file__) )

PATHS = {
'input_path' : os.path.join(workPath,'input'),
'output_path' : os.path.join(workPath,'output'),
'result_path' : os.path.join(workPath,'result')
}
```

辅助函数集合（其中函数 `checkcountyDir` 用来检测原数据目录是否和 `coordinate_list` 里的信息对应）：

```python
# util.py
# -*- coding: UTF-8 -*-
import os
from unittest import result
from config import PATHS

input_path = PATHS['input_path']

coordinate_list = [
# 行政区划信息
]

cities = {
    u'成都市': '510100',
    u'自贡市': '510300',
    u'攀枝花市': '510400',
    u'泸州市': '510500',
    u'德阳市': '510600',
    u'绵阳市': '510700',
    u'广元市': '510800',
    u'遂宁市': '510900',
    u'内江市': '511000',
    u'乐山市': '511100',
    u'南充市': '511300',
    u'眉山市': '511400',
    u'宜宾市': '511500',
    u'广安市': '511600',
    u'达州市': '511700',
    u'雅安市': '511800',
    u'巴中市': '511900',
    u'资阳市': '512000',
    u'阿坝藏族羌族自治州': '513200',
    u'甘孜藏族自治州': '513300',
    u'凉山彝族自治州': '513400',
}

# 判断city code
def getCitycode(cityname):
    return cities.get(cityname) or 'invalid city name'

citiesname = [u'成都市', u'自贡市', u'攀枝花市', u'泸州市', u'德阳市',
            u'绵阳市', u'广元市', u'遂宁市', u'内江市', u'乐山市', u'南充市',
            u'眉山市', u'宜宾市', u'广安市', u'达州市', u'雅安市', u'巴中市',
            u'资阳市', u'阿坝藏族羌族自治州', u'甘孜藏族自治州', u'凉山彝族自治州']

# 得到每个city对应的countyname、countycode
def listdirInMac(path):
    return [dir for dir in os.listdir(path) if not dir.startswith('.')]

def getcountyInfo(cityname):
    return [county for county in coordinate_list if county['city'] == cityname]

def checkcountyDir(root_path):
    for city in cities.keys():
        # 对每个城市进行循环
        # cities 是一个字典，.keys()取得所有键名
        if not os.path.exists(root_path + '/' + cities[city] + city):
            continue
        dirs = listdirInMac(root_path + '/' + cities[city] + city)
        for county in getcountyInfo(city):
            # 对某个城市的每一个区进行循环
            county_code = county['county_code']
            county_name = county['county']
            matched = ''
            for dir in dirs:
                # find dir that matched with county
                if (dir.find(county_name[:-1]) > -1):
                    matched = dir

            # 如果condition为True，a = 1，否则 a = 2
            # a = 1 if condition else 2
            code_matched = "yes" if matched[:6] == county_code else "no"
            name_matched = "yes" if matched[6:] == county_name else "no"

            # county目录不存在
            if matched == '':
                print('{0} , {1}target dir does not exists.'.format(
                    city, county['county']))
                continue

            if (code_matched == "yes"):# code对应
                if (name_matched == "yes"): # name对应
                    pass
                else:# name部分对应
                    print('{0} {1} countycode matched, but countyname partmatched.'.format(city, county['county']))            
            else:# code不对应
                if (name_matched == "yes"):# name对应
                    print('{0} {1} countycode not matched, countyname matched.'.format(city, county['county']))
                else:# name部分对应
                    print('{0} {1} countycode not matched, countyname partmatched.'.format(city, county['county']))

    print("Dir checking---------------------Done!")


JBNTpath = input_path + '/' + 'JBNT'
checkcountyDir(JBNTpath)
```

```python
# main.py 
# -*- coding: UTF-8 -*-
import os
import arcpy
from util import coordinate_list,getCitycode
from config import PATHS

input_path = PATHS['input_path']
output_path = PATHS['output_path']
result_path = PATHS['result_path']

JBNTpath = input_path + '/' + 'JBNT'

# 补划图斑
BH_shp = input_path + '/' + u'四川占用补划20220530' + '/' + u'补划图斑.shp'
arcpy.MakeFeatureLayer_management(BH_shp,'BH_shp')

for coordinate in coordinate_list:
    city = coordinate['city']
    city_code = getCitycode(city)
    county_code = coordinate['county_code']
    county = coordinate['county']
    coordinate_name = coordinate['name']
    wkid = coordinate['wkid']

    inWorkspace = input_path + '/' + 'JBNT' + '/' + str(city_code) + city + '/' + county_code + county +'/'+  u'1.矢量数据'
    JBNT_shp = inWorkspace + '/' + county_code + '2014JBNTBHTB.shp'

    resultJBNT = result_path + '/' + str(city_code) + city + '/' + county_code + county
    outWorkspace = output_path  + '/' + str(city_code) + city + '/' + county_code + county
    # 转换坐标系的基本农田图层
    transWkidJBNT = outWorkspace + '/' + county_code + 'JBNT.shp'
    # print(city)
    # print(county)
    # print("loading--------------------")
    if (os.path.exists(resultJBNT)):
        pass
    elif (os.path.exists(inWorkspace)):
        if not (os.path.exists(JBNT_shp)):
            print(city)
            print(county)
            print("2014JBNTBHTB.shp don't exist")
            print("-------------")
        else:
            if not os.path.exists(outWorkspace):
                os.makedirs(outWorkspace)
            arcpy.env.workspace = inWorkspace
            # 检查自定义坐标系，并纠正
                # 获取原始数据shp文件空间参考
            spatialRef = arcpy.Describe(JBNT_shp).spatialReference
            spatialRefWkid = spatialRef.factoryCode
                # 判断wkid是否对应并纠正
            if(os.path.exists(transWkidJBNT)):
                print("already processed!")
            else:
                if not (spatialRefWkid == wkid):
                    n = n + 1
                    print(n)
                    print(city)
                    print(county)
                    print('this county need to correct wkid')
                    newSrRef = arcpy.SpatialReference(wkid)
                    arcpy.Project_management(JBNT_shp,transWkidJBNT,newSrRef)
                    print(arcpy.Describe(transWkidJBNT).spatialReference.factoryCode)
                    print("wkid have corrected--------------------------------")
                else:
                    arcpy.Copy_management(JBNT_shp,transWkidJBNT,"")
            # 合并图层
                # 筛选补划图斑
            BHQ_shp = inWorkspace + '/' + county_code + '2014JBNTBHQ.shp'
            intersectBH = arcpy.SelectLayerByLocation_management('BH_shp',"INTERSECT",BHQ_shp)
            # 输出每个区的补划图斑
            countyBH = outWorkspace + '/' + county_code + 'BHTB.shp'
                # 擦除图层
            erase_shp = input_path + '/' + u'四川占用补划20220530' + '/' + u'占地项目.shp'
                # 结果图层
            if not os.path.exists(resultJBNT):
                os.makedirs(resultJBNT)
            outBHTB = resultJBNT +'/' + county_code + '2022JBNTBHTB.shp'
            if (intersectBH):
                arcpy.CopyFeatures_management(intersectBH,countyBH)
                # 合并BHTB和JBNT
                # 定义合并字段      
                fieldMappings = arcpy.FieldMappings()
                fieldMappings.addTable(transWkidJBNT)
                merge_shp = outWorkspace + '/' + county_code + 'JBNTBHTB.shp'
                arcpy.Merge_management([transWkidJBNT,intersectBH],merge_shp,fieldMappings)
                # 删除补划图斑多余的字段
                arcpy.DeleteField_management(merge_shp,['OBJECTID','XMMC','SDM','JJBH','ID_PROVINC','ORECID'])
                # 擦除
                arcpy.Erase_analysis(merge_shp,erase_shp,outBHTB)  
            else:
                print(city)
                print(county)
                print("this county don't have BHTB, only erase it")

    else:
        n = n + 1
        print(n)
        print(city)
        print(county)
        print("don't exist county dir")
        print("--------------------------")

print("data processed-------------------------Done!")
```

# 问题

## 转换坐标系

`arcpy.DefineProjection_management` 和 `arcpy.Project_management` 有所不同。

- `arcpy.DefineProjection_management`:是会修改原数据的

<Image zoom="0.8" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1656310518082-f05b9e9f-3351-4cf4-b880-abae663ab34e.png"/>

- `arcpy.Project_management`:不会修改原数据而生成新的转换后的图层

<Image zoom="0.8" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1656310777602-00569444-b67c-4400-8d72-4241ad433ee9.png"/>

<Image zoom="0.8" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1656310836217-01bc514e-83f7-41b1-af08-a7feaf148bef.png"/>

<Image zoom="0.8" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1656310858676-c745fff5-4d5a-4c8a-ae78-b94003ee1a56.png"/>

## 合并图层

使用 `arcpy.Merge_management` 合并的时候需要注意顺序，其使用语法为:

<Image zoom="0.8" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1656311137781-8a8eb61c-72f8-443f-9312-19fe84cfcfe2.png"/>

`field_mappings` 可以对字段进行单独设置。
若 `arcpy.Merge_management([transWkidJBNT,intersectBH],merge_shp,fieldMappings)`，则坐标系是按照 `transWkidJBNT` 这个图层的坐标系来输出的。

## 擦除图层

要注意**擦除**图层和**裁剪**图层的区别。


## 删除字段

删除合并后的一些字段（所有补划图斑字段，保留字段JBNTLX）

<Image zoom="0.8" src="https://cdn.nlark.com/yuque/0/2022/png/26909650/1656309904610-bbcfd9a1-61c2-4e05-a16a-57d97a6d14ff.png"/>

上面这种删除字段的方法需要合并后的图层重新生成 `fieldMapping`，然后再创建新的图层，会有一点麻烦。
所以使用 `arcpy.DeleteField_management(merge_shp,['OBJECTID','XMMC','SDM','JJBH','ID_PROVINC','ORECID'])` 直接删除不需要的字段。
不过这种一个一个输入的方式有点不太工程化。