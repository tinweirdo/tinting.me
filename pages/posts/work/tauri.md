---
title: tauri
date: 2025-07-11 14:00
category: Work
comment: hidden
---

[[toc]]


# 使用 Tauri 打包为 exe 文件的步骤

## 环境准备

首先确保您的系统已安装以下必要工具：

- Rust (最新版本)
- Node.js (推荐 18+ 版本)
- Microsoft Visual Studio Build Tools (Windows 必需)

## 安装 Tauri CLI

```bash
npm install -g @tauri-apps/cli
```

## 项目配置检查

检查 `tauri.conf.json` 中已经的配置：

- 应用名称：`productName`
- 窗口大小：`app.windows`
- 图标文件路径：`bundle.icon`
- 前端资源路径：`build.frontendDist`

## 打包命令

在项目根目录下运行以下命令进行打包：

```bash
# 开发模式构建（用于测试）
npm run tauri dev

# 生产模式构建（生成 exe 文件）
npm run tauri build
```

或者直接使用 Tauri CLI：

```bash
# 开发模式
tauri dev

# 生产模式打包
tauri build
```

## 打包输出

打包完成后，exe 文件将生成在：`src-tauri/target/release/bundle/msi/`