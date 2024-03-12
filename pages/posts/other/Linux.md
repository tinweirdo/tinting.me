---
title: Ubuntu
date: 2024-03-12 10:30
category: Linux
comment: hidden
---

[[toc]]

# 使用 VMware 安装 Ubuntu Linux

- [下载虚拟机 VMware](https://www.52pojie.cn/thread-1804571-1-1.html)

- [下载 Ubuntu](https://ubuntu.com/download/desktop)

- [安装 Ubuntu](https://zhuanlan.zhihu.com/p/141033713)

# [使用 Ubuntu 安装软件](https://zhuanlan.zhihu.com/p/270908077)

# 安装环境

1. [安装 Node.js 和 npm](https://developer.aliyun.com/article/760687)

终端运行：

```bash
sudo apt update
sudo apt install nodejs npm
```

2. 安装 `nvm`

使用 `curl` 安装 `nvm`，首先安装 `curl`：

```bash
sudo apt update
sudo apt install curl
curl --version # 检查是否安装成功
```

安装 `nvm`：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
```

最新版可在 github 上查看 (https://github.com/nvm-sh/nvm)[https://github.com/nvm-sh/nvm]

# [VMware 虚拟机使用主机侧代理](https://blog.xzr.moe/archives/124/)

# [与主机共享文件夹](https://zhuanlan.zhihu.com/p/650638983)

注意，需要执行挂载操作，如果虚拟机重启，需要再次挂载共享文件夹

```bash
sudo mount -t fuse.vmhgfs-fuse .host:/ /mnt/hgfs -o allow_other
```
> /mnt/hgfs/ 是挂载点，我们也可以修改为其它挂载点

> -o allow_other 表示普通用户也能访问共享目录。


