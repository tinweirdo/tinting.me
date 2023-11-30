---
title: 模糊锚定（Fuzzy Anchoring）
date: 2023-11-30T07:47:54.114Z
category: Front End
---

## 概述

如果你使用过 goodnotes、notability 等软件，你可能会发现，当你为文档中的某些内容添加了一些 注释/标记 后，下次打开文档时，这些注释/标记 仍然可以准确地锚定在文档中的相应位置。但是如果对文档进行修改，就有可能导致这些 注释/标记 的位置产生偏移，甚至丢失。这些 注释/标记 的准确性高度依赖于锚定位置的可信度，对于变更频繁的文档，锚定的可信度就会降低。

网页呈现在浏览器中，也是一种文档，以人的肉眼和认知系统来看，一段文字即使发生一些改变，依靠记忆和内容上下文，我们也能很快地找到他。但网页是由浏览器将其转换为 DOM树 来渲染的，即便是一些微小的改变（甚至渲染出来的内容完全不变），也可能导致 DOM 结构的变化（可能非常大）。网页位置的锚定又需要依靠 DOM 结构，因而 DOM 的变化给锚定带来了很大的不确定性。我们需要设计一种机制，来提高锚定的可信度和准确性。

## 解决思路

人的认知系统天然有模糊匹配的能力，即使是一些微小的改变，我们也能很快地找到他。我们可以借鉴这种模式，设计一种模糊锚定的机制。为了实现这种机制，我们定义三种数据，以提供后续锚定的依据：

1. RangeSelector - 准确的节点查询路径
2. TextPositionSelector - 文本在文档中的收尾偏移量
3. TextQuoteSelector - 文本内容、文本前缀内容、文本后缀内容

### RangeSelector

RangeSelector 是一种准确的节点查询路径，它可以准确地锚定到文档中的某个节点。它包含了开头节点和结尾节点的 xpath，以及开头节点和结尾节点的偏移量。它的结构如下：

```ts
interface RangeSelector {
  endContainer: string
  endOffset: number
  startContainer: string
  startOffset: number
  type: 'RangeSelector'
}
```

假设我们有如下的文档结构：

```html 
<html lang="en">
  <head>
  </head>
  <body>
    <div>hello, <span>world</span>.</div>
  </body>
</html>
```

当我们锚点在于 `llo, world` 时，我们可以得到如下的 RangeSelector：

```ts
{
  startContainer: '/html/body/div/text()[1]',
  startOffset: 2,
  endContainer: '/html/body/div/span/text()[1]',
  endOffset: 5,
  type: 'RangeSelector'
}
```

startContainer 和 startOffset 准确标记了锚点的起始位置，endContainer 和 endOffset 则标记了锚点的结束位置。通过这四个数据可以准确地锚定对应范围。当文档结构没有发生任何改变时，这种锚定方式将始终准确，但极其脆弱，一旦文档结构发生了变化，这种锚定方式就会失效。

### TextPositionSelector

TextPositionSelector 定义了两个值，分别是 start 和 end，它们分别表示文本在文档中的起始偏移量和结束偏移量。它的结构如下：

```ts
interface TextPositionSelector {
  end: number
  start: number
  type: 'TextPositionSelector'
}
```

在获取 TextPositionSelector 前，需要生成一个 DOM 到文本的双向映射表，该表让我们可以通过文本偏移量快速地找到它所属的 DOM 节点。下图表示了文本到 DOM 的映射关系：

![dom-text-mapping](https://static.wayne-wu.com/uPic/JvqxhU.png)

因此，`llo, world` 对应着 start 为 2，end 为 11 的 TextPositionSelector。使用 start 为 2，end 为 11 可以从映射表中获取到 text1 和 text2 两个 DOM 节点，以此锚定到 `llo, world`。这种方式使锚点数据不依赖于文档的结构，而始终与文档的文本内容保持一致，当在文档插入媒体节点或修改文本所在节点的样式和类型时，锚点数据仍然有效。但当文本内容改变导致文本偏移量发生变化时，锚点数据就会失效。

### TextQuoteSelector

RangeSelector 和 TextPositionSelector 两种锚定方式依赖于文档整体的结构和内容，假设锚定范围仅仅只是文档中部或末尾上的局部文本，但文档较前的部份发生了变化，此时它们都会失效，这显然不可接受。TextQuoteSelector 是一种只与文档局部内容相关的锚定方式，它定义了三个值，分别是 exact、prefix 和 suffix，它们分别表示文本内容、文本前缀内容、文本后缀内容。它的结构如下：

```ts
interface TextQuoteSelector {
  exact: string
  prefix: string
  suffix: string
  type: 'TextQuoteSelector'
}
```

当我们锚定在于 `llo, world` 时，我们可以得到如下的 TextQuoteSelector：

```ts
{
  exact: 'llo, world',
  prefix: 'he',
  suffix: '.',
  type: 'TextQuoteSelector'
}

// 注意，prefix 和 suffix 实际上是一个足够长的文本字符串，以此提高文本搜索的可信度
```

借助 DOM 到 文本 的双向映射表，用 exact、prefix 和 suffix 进行文本搜索得到锚定的首尾节点，以此锚定到 `llo, world`。在这种锚定方式下，即便文档发生了变化，只要 prefix + exact + suffix 仍然存在于文档中，锚点数据就仍然有效。

### 锚定流程