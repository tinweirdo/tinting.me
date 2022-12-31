---
title: 小程序的字体图标方案
date: 2022-12-31T14:10:48+08:00
category: Front End
---

[[toc]]

在 WEB 前端项目中，我们有成熟的方案来显示图标，如：

1. 制作图标字体；
2. 直接显示图像（使用 `background-img` css属性 或 `img` 标签）。

前者将图标转化为 Unicode 码点的字体图形打包进字体文件中，通过不同的字符可以显示不同的图标。这种方案的图标可以通过 `font-size` 和 `color` 修改图标的大小和颜色，与正常字体表现一致，体验非常好。

后者简单粗暴，颜色难以修改（往往不同的颜色的同一图标需要重复出图），如果使用 `svg` 图案，则能通过 `fill: currentColor` 或 `stroke: currentColor` 来设置颜色，同时它是矢量的，具有更好的灵活性，基本可以做到与字体图标相同的体验，但如果每个图标都通过 `svg` 标签嵌入，HTML 页面的大小则会受到直接的影响。

## 新颖的图标方案

[@userquin](https://github.com/userquin) 在 [unplugin-icons](https://github.com/antfu/unplugin-icons) 项目中的 [PR](https://github.com/antfu/unplugin-icons/pull/90) 中实现了一种新的图标方案。

css 的 `mask-image` 属性可以将元素按给定图像的形状进行裁剪，下面是一个实际实现：

<iframe
  src="https://codesandbox.io/embed/font-icon-solution-kyn77k?fontsize=14&hidenavigation=1&theme=dark"
  referrerpolicy="no-referrer"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="font icon solution"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
/>

其中，我们将 svg 图案作为 `mask-image` 的底图，同时为了实现图标的颜色和大小跟随字符的效果，我们还需要额外设置一些样式，因此，最简单的实现看起来是这样的：

```css
span {
  width: 1em;
  height: 1em;
  mask-image: url(url/to/icon.svg);
  mask-size: 100%;
  background-color: currentColor;
}
```

这样我们就实现了一个使用 svg 图片来作为图标，同时又具有和字体图标一样的体验性的图标方案。

而对于彩色图标，与纯色图标唯一的区别是，它的颜色是固定不变的，因此我们可以用更简单的处理方法，直接使用 `background-image` 属性引入即可：

```css
span {
  width: 1em;
  height: 1em;
  background-size: 100%;
  background-image: url(url/to/icon.svg);
}
```

## 小程序实现

如果你直接在小程序中使用上面的代码，或许在开发者工具上体验良好，但一换到真实设备，Dangdang～，出问题了，图标显示不出来。在微信开放社区这一篇来自 [@savokiss](https://developers.weixin.qq.com/community/personal/oCJUsw1Zwh-83oeSk7RSQqMleenA) 的[回答中](https://developers.weixin.qq.com/community/develop/doc/5be2d74dfae5d7688a6a721065364d26?highLine=mask-image) 可以找到答案。

我们需要给 `mask-image` 属性加上 `-webkit` 前缀，同时图片需要使用 base64 格式。于是我们得到下面的解决方案：

```css
view {
  width: 1em;
  height: 1em;
  display: inline-block;
  background-color: currentColor;
  mask-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMWVtIiBoZWlnaHQ9IjFlbSIgdmlld0JveD0iMCAwIDQwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMwLjI0MTcgMzVDMzAuMjI2NiAzNSAzMC4yMTE1IDM1IDMwLjIwMzkgMzVDMjUuOTYxOCAzNC44NzE1IDIwLjY4MzcgMzEuNjczOCAxNC41MDU3IDI1LjQ5NzVDOC4zMzUzMyAxOS4zMjEzIDUuMTM2NzEgMTQuMDUyMiA1LjAwMDU5IDkuODE4NzlDNC45NDAxIDcuODQ1NzIgOS41MTQ5NyA0LjU2NDgzIDkuNTYwMzQgNC41MjcwM0MxMC44MzgzIDMuNjQyNTUgMTIuMjU5OSAzLjk2NzYyIDEyLjg0OTcgNC43OTE2MkMxMy4yMTI3IDUuMjk4MTIgMTYuNjA3OSAxMC40Mzg3IDE2Ljk3MDkgMTEuMDIwOEMxNy40MDE5IDExLjY5MzYgMTcuMzQ4OSAxMi42ODM5IDE2LjgyNzIgMTMuNjU5MUMxNi41ODUyIDE0LjEyMDIgMTUuNzgzNyAxNS41MzM5IDE1LjM1MjYgMTYuMjg5OUMxNS44NDQyIDE2Ljk3MDIgMTcuMDA4NyAxOC40NTk1IDE5LjI2OTYgMjAuNzI3NEMyMS41MzgyIDIyLjk5NTMgMjMuMDI3OCAyNC4xNTk1IDIzLjcwODQgMjQuNjUwOEMyNC40NjQ2IDI0LjIxOTkgMjUuODc4NiAyMy40MTg2IDI2LjM0NzQgMjMuMTY5MUMyNy4zMDc4IDIyLjY2MjYgMjguMjkwOCAyMi42MDIyIDI4Ljk2MzggMjMuMDE3OUMyOS42MjE3IDIzLjQxODYgMzQuODI0MiAyNi44ODA5IDM1LjE5NDcgMjcuMTM4QzM2LjAyNjUgMjcuNzI3NiAzNi4zNjY4IDI5LjE1NjQgMzUuNDY2OSAzMC40NDE1QzM1LjQzNjcgMzAuNDg2OSAzMi4yMDAyIDM1IDMwLjI0MTcgMzVaIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIzIi8+Cjwvc3ZnPgo=');
  -webkit-mask-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMWVtIiBoZWlnaHQ9IjFlbSIgdmlld0JveD0iMCAwIDQwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTMwLjI0MTcgMzVDMzAuMjI2NiAzNSAzMC4yMTE1IDM1IDMwLjIwMzkgMzVDMjUuOTYxOCAzNC44NzE1IDIwLjY4MzcgMzEuNjczOCAxNC41MDU3IDI1LjQ5NzVDOC4zMzUzMyAxOS4zMjEzIDUuMTM2NzEgMTQuMDUyMiA1LjAwMDU5IDkuODE4NzlDNC45NDAxIDcuODQ1NzIgOS41MTQ5NyA0LjU2NDgzIDkuNTYwMzQgNC41MjcwM0MxMC44MzgzIDMuNjQyNTUgMTIuMjU5OSAzLjk2NzYyIDEyLjg0OTcgNC43OTE2MkMxMy4yMTI3IDUuMjk4MTIgMTYuNjA3OSAxMC40Mzg3IDE2Ljk3MDkgMTEuMDIwOEMxNy40MDE5IDExLjY5MzYgMTcuMzQ4OSAxMi42ODM5IDE2LjgyNzIgMTMuNjU5MUMxNi41ODUyIDE0LjEyMDIgMTUuNzgzNyAxNS41MzM5IDE1LjM1MjYgMTYuMjg5OUMxNS44NDQyIDE2Ljk3MDIgMTcuMDA4NyAxOC40NTk1IDE5LjI2OTYgMjAuNzI3NEMyMS41MzgyIDIyLjk5NTMgMjMuMDI3OCAyNC4xNTk1IDIzLjcwODQgMjQuNjUwOEMyNC40NjQ2IDI0LjIxOTkgMjUuODc4NiAyMy40MTg2IDI2LjM0NzQgMjMuMTY5MUMyNy4zMDc4IDIyLjY2MjYgMjguMjkwOCAyMi42MDIyIDI4Ljk2MzggMjMuMDE3OUMyOS42MjE3IDIzLjQxODYgMzQuODI0MiAyNi44ODA5IDM1LjE5NDcgMjcuMTM4QzM2LjAyNjUgMjcuNzI3NiAzNi4zNjY4IDI5LjE1NjQgMzUuNDY2OSAzMC40NDE1QzM1LjQzNjcgMzAuNDg2OSAzMi4yMDAyIDM1IDMwLjI0MTcgMzVaIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIzIi8+Cjwvc3ZnPgo=');
  mask-size: 100%;
  -webkit-mask-size: 100%;
}
```

而问题在于，项目的图标往往很多，如果我们将所有图标都转换为 base64 字符串硬编码在代码中，最终的构建产物体积可能会让你大吃一惊，因此我们需要换一种方式。

我们考虑将所有 svg 资源统一上传到服务器或 CDN 托管上，利用请求获取 svg 内容，将其转换为 base64 字符串后动态设置元素的 `mask-image` 属性，简单的实现可能是这样的：

```vue
// the code bases on uni framework
<template>
  <view class="icon" :style="style" />
</template>

<script>
import { encode } from 'js-base64'
export default {
  props: {
    icon: string
  },
  data() {
    return {
      style: '',
    }
  },
  watch: {
    icon: {
      immediate: true,
      handler(icon) {
        uni.request({
          url: icon,
          success: ({ data }) => {
            // avoid data race
            if (icon !== this.icon) return
            if (data.includes('currentColor')) {
              // it means the color of icon is syncing with font color when svg content contains `currentColor`
              const url = 'data:image/svg+xml;base64,' + encode(data)
              this.style = `mask-image: url('${url}'); -webkit-mask-image: url('${url}'); background-color: currentColor;`
              return
            }
            this.style = `background-image: url('${url}');`
          }
        })
      }
    }
  }
}
</script>

<style>
.icon {
  /* basic style */
  width: 1em;
  height: 1em;
  display: inline-block;
  background-size: 100%;
  mask-size: 100%;
  -webkit-mask-size: 100%;
}
</style>
```

而为了减少项目依赖，让整个架构看起来干净一点，可以将 svg 图标事先转化为 base64 进行存储，这样小程序请求到的资源无需进行 base64 编码，减少运行时损耗。当然，这是另外的事情了。

至此，我们已经得到了可以在小程序运行的图标字体方案了。