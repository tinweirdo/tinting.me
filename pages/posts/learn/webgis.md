---
title: webgis开发学习路线
date: 2025-07-10 21:00
category: Learning
comment: hidden
---

[[toc]]

<Image zoom="0.4" src="/images/2025/webgis-learning.jpg"/>

# web 基础入门

## HTML5 

### HTML 本质

HTML 的本质是用标签结构化内容、实现超文本链接的标记语言，它为网页提供骨架，而 CSS 和 JavaScript 分别负责美化和交互，三者共同构建出现代 Web 的基础。

### HTML 组成

HTML 的组成可概括为：标签结构（包括语义化标签）、属性、文档结构（head/body）、表单、多媒体、元数据，以及与 CSS/JavaScript 的集成能力。这些组件共同构建了网页的内容骨架和交互基础。

1. 文档结构

HTML 文档以 `<!DOCTYPE html>` 声明开头，后跟 `<html>` 根标签，分为 head（元数据）和 body（可见内容）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>网页标题</title>
  <!-- 外部资源引入 -->
  <link rel="stylesheet" href="style.css">
  <script src="script.js"></script>
</head>
<body>
  <!-- 页面内容 -->
</body>
</html>
```

2. 标签（Tags）与元素（Elements）

- **标签**是 HTML 的基本语法单元，用尖括号表示（如 `<p>`）。
- **元素**由开始标签、内容和结束标签组成（如 `<p>文本</p>`）。
- **空元素**无需结束标签（如 `<img src="..." alt="...">`）。

```html
<h1>标题</h1>
<p>段落</p>
<a href="https://example.com">链接</a>
<img src="image.jpg" alt="图片">
<ul>
  <li>列表项</li>
</ul>
<form>
  <input type="text">
  <button>提交</button>
</form>
```

3. 属性（Attributes）

为标签提供额外信息，格式为 `name="value"`：

```html
<a href="https://example.com" target="_blank">外部链接</a>
<img src="image.jpg" alt="风景" width="300">
<div class="container" id="main">内容</div>
```

4. 语义化标签（Semantic HTML）

HTML5 引入了表达内容含义的标签，提升可访问性和 SEO(Search Engine Optimization - 搜索引擎优化)：

```html
<header>页面头部</header>
<nav>导航栏</nav>
<main>主要内容</main>
<article>独立文章</article>
<section>章节</section>
<aside>侧边栏</aside>
<footer>页脚</footer>
```

参考文章:[html5语义化标签](https://juejin.cn/post/6844903544995184653)

5. 表单（Forms）

用于用户输入，包含 `input、select、textarea` 等控件：

```html
<form action="/submit" method="POST">
  <label for="name">姓名：</label>
  <input type="text" id="name" required>
  
  <label for="gender">性别：</label>
  <select id="gender">
    <option value="male">男</option>
    <option value="female">女</option>
  </select>
  
  <button type="submit">提交</button>
</form>
```

6. 多媒体元素

嵌入音频、视频或其他资源：

```html
<img src="image.jpg" alt="图片">
<video controls width="300">
  <source src="video.mp4" type="video/mp4">
</video>
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
</audio>
```

7. 表格（Tables）

```html
<table>
  <thead>
    <tr>
      <th>姓名</th>
      <th>年龄</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>张三</td>
      <td>25</td>
    </tr>
  </tbody>
</table>
```


8. 元数据（Metadata）

在 `<head>` 中定义，描述文档属性：

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="网页描述">
<title>网页标题</title>
<link rel="icon" href="favicon.ico">
```

参考文章: [HTML基础知识巩固复习之meta（元数据）](https://blog.csdn.net/m0_61180126/article/details/133808198)



## CSS3

### 选择器

参考文章：

1. [CSS 选择器](https://www.runoob.com/cssref/css-selectors.html)
2. [`nth-child` 和: `nth-of-type` 的差异](https://www.zhangxinxu.com/wordpress/2011/06/css3%E9%80%89%E6%8B%A9%E5%99%A8nth-child%E5%92%8Cnth-of-type%E4%B9%8B%E9%97%B4%E7%9A%84%E5%B7%AE%E5%BC%82/)

### 文本属性

1. `color`	设置文本颜色
2. `direction`	设置文本方向
3. `letter-spacing`	设置字符间距
4. `line-height`	设置行高
5. `text-align`	对齐元素中的文本
6. `text-decoration`	向文本添加修饰
7. `text-indent`	缩进元素中文本的首行
8. `text-shadow`	设置文本阴影
9. `text-transform`	控制元素中的字母
10. `unicode-bidi`	设置或返回文本是否被重写 
11. `vertical-align`	设置元素的垂直对齐
12. `white-space`	设置元素中空白的处理方式
13. `word-spacing`	设置字间距