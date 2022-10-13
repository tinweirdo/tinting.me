---
title: JavaScript 模块化
subtitle: 在 JavaScript 中循环一个数组
date: 2022-10-24 12:42:32
---

在 JavaScript 中如果需要循环一个数组，可以这么写：

```javascript
const arr = [1, 2, 3, 4, 5];

for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
```

在 ES6 中

## 提前结束迭代器和可关闭的迭代器

当你不想遍历迭代所有值时，可以发出结束迭代动作。以下情况会提前结束迭代器：

1. for-of 循环通过 break、continue、return 或 throw 提前退出;
2. 解构操作并未消费所有值。

提前结束迭代器时，如果迭代器有 `return`属性（方法）则会被调用，且`return`函数必须要返回一个有效的IteratorResult 对象，该对象为一个 **Plain Object** ，最简单可以只包含一个`done`属性，如`{done: true}`，如果返回的对象不是有效的 IteratorResult ，提前结束迭代器时会抛出类型错误：

> Uncaught TypeError: Iterator result false is not an object

迭代器在迭代完成时会被关闭，已经关闭的迭代器无法再进行迭代，迭代器关闭可以发生在“提前结束”或“所有值已经迭代完毕”，但“提前结束迭代”并不一定会关闭迭代器。可选的 `return` 方法用于指定在迭代器提前关闭时执行的逻辑，该方法会在迭代器提前关闭时被调用。但并不是迭代器的`return`属性决定了迭代器是否可关闭，比如：数组迭代器，即便提前结束迭代器，`return`方法被调用了，该迭代器也是无法关闭的。如：

```javascript
let a = [1, 2, 3, 4, 5];
let iter = a[Symbol.iterator]();
for (let i of iter) {
  console.log(i);
  if (i > 2) {
		break;
  }
}
// 1 // 2 // 3
for (let i of iter) {
  console.log(i);
}
// 4 // 5
```

如果需要关闭迭代器需要添加其他逻辑，下面就是实现了一个可关闭的迭代器：

```javascript
class Counter {
  constructor() {}
  
  [Symbol.iterator]() {
    let count = 0;
    let closed = false;
    return {
      next() {
        if (count < 5 && !closed) {
          return {done: false, value: count++};
        } else {
          return {done: true};
        }
      },
      return() {
        closed = true;
        return {done: true}
      },
      [Symbol.iterator](){
        return this;
      }
    }
  }
}

const counter = new Counter()
const iter1 = counter[Symbol.iterator]()

for (let item of iter1) {
  console.log(item)
  if (item > 3) {
    break
  }
}

// 0 // 1 // 2 // 3 // 4

// break 时，return 被调用，closed 变为true

for (let item of iter1) {
  console.log(item)
}

// 这里不会有任何输出的东西，因为迭代器再调 next 方法，也是结束的值了，即迭代器已经被关闭了
```


