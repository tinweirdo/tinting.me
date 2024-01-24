---
title: 手机端调试（Android）
date: 2024-01-19 17:40
category: Work
comment: hidden
---

[[toc]]

# 常规

1. 安装 `Android Studio` 和 `Android SDK`

安装 `Android SDK` 通常建议通过安装 `Android Studio` 来完成，因为 `Android Studio` 已经包含了 `Android SDK` 所需的大部分组件，且会自动处理依赖和更新。

以下是通过 `Android Studio` 安装 `Android SDK` 的步骤：

- 下载并安装 `Android Studio`：你可以从 `Google` 的[官方网站](https://developer.android.com/studio?hl=zh-cn)上下载最新版本的 `Android Studio`。按照安装向导的提示进行安装。参考[链接](https://blog.csdn.net/qq_38436214/article/details/105073213)。
- 打开 `SDK Manager`：点击 `Android Studio` 顶部菜单栏中的 `Tools > SDK Manager`。
- 在 `SDK Manager` 中选择和下载 `SDK`：在 `SDK Platforms` 标签页中，你可以选择你需要的 `Android` 版本。在 `SDK Tools` 标签页中，你可以选择额外的工具，如 `Android SDK Build-Tools`, `Android SDK Platform-Tools`, `Android SDK Tools`，以及其他你可能需要的组件。
- 应用更改并等待下载完成：点击 OK 对话框中的 `Apply` 按钮开始下载并安装你选择的组件。下载完成后，`Android SDK` 就已经安装完成了。

2. [使用 Hbuilder，app 运行到 Android 模拟器](https://uniapp.dcloud.net.cn/tutorial/run/installSimulator.html)

> Android Studio 是什么？

`Android Studio` 是 `Google` 官方推出的用于 `Android` 应用开发的集成开发环境 (`IDE`)。它基于 `JetBrains` 的 `IntelliJ IDEA` 软件，并加入了用于 `Android` 开发的相关功能。

> Android SDK 是什么？

`Android SDK`（`Android Software Development Kit`）是 `Google` 提供的一套开发工具，它包含了创建 `Android` 应用所需的所有组件。它是 `Android Studio IDE`（集成开发环境）的一个组成部分，但也可以独立下载安装。

# 准备

1. [单独安装 `adb`，不安装 `sdk`](https://blog.csdn.net/x2584179909/article/details/108319973)，安装成功后需**重启**
2. 在 Hbuilder 中打开项目，初次需识别项目（右击项目根文件夹 => 识别项目类型）

# [Hbuilder 配置 MuMu 模拟器进行调试](https://blog.csdn.net/wolfqong/article/details/131583011)

在 MuMu 安装目录下运行 `adb connect 127.0.0.1:16384` 后，再运行 `adb devices`

  <Image src="/images/2024/Snipaste_2024-01-22_16-28-26.png" zoom="0.8"/>

## 运行时的一些问题

### 安装HBuilder调试基座完成，但手机中并未出现App

  <Image src="/images/2024/Snipaste_2024-01-23_09-32-58.png" zoom="0.5">显示连接成功却无响应</Image>

**原因**： App 卸载不干净造成的。
**解决方式**：
- 查看是否存在应用包：`adb shell pm  list package -3`

  <Image src="/images/2024/1705903145.png"/>

- 卸载 `adb uninstall io.dcloud.HBuilder`，注意，需替换为项目的应用包名

  <Image src="/images/2024/Hbuilder配置.png" zoom="0.5"/>

- 卸载成功

  <Image src="/images/2024/1705903145.png"/>

- 重新运行
**遇到的问题**：
- 卸载失败报错：`Failure [DELETE_FAILED_INTERNAL_ERROR]`，后续发现是拼写错误..(`uninstall` 而不是 `uninsatll`)

  <Image src="/images/2024/1705904795.png"/>

# [Hbuilder 配置夜神模拟器进行调试](https://blog.csdn.net/Greenhand_BN/article/details/116021646)

1. [查看夜神模拟器端口号](https://blog.csdn.net/lovedingd/article/details/108409634)

# 补充

- [关于 `adb` 的常用命令](https://blog.csdn.net/thundersoft230/article/details/126158186)