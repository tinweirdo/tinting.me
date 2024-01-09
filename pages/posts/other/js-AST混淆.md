---
title: AST 混淆及反混淆
date: 2023-11-23 10:45
category: Web
comment: enable
---

# 使用目的

去除代码中尽可能多的有意义的信息，比如注释、换行、空格、代码负号、变量重命名、属性重命名（允许的情况下）、无用代码的移除等等，
尽可能增加攻击者阅读代码的成本，是一些网站常用的**反爬**措施。

# AST

## 变量名混淆

如 `uglify-js` 把变量混淆成了短名（主要是为了进行代码压缩），而现在大部分安全方向的混淆，都会将其混淆成类16进制变量名，效果如下：

```js
var test = 'hello';
```
混淆后：

```js
var _0x7deb = 'hello';
```

注意:
1. `eval` 函数中可能使用了原来的变量名，如果不对其进行处理，可能会运行报错，如下：

```js
var test = 'hello';
eval('console.log(test)');
```

如果不对 `eval` 中的 `console.log(test)` 进行关联的混淆，则会报错。不过，如果 `eval` 语法超出了静态分析的范畴，比如：

```js
var test = 'hello';
var variableName = 'test';
eval('console.log(' + variableName + ')');
```

这种可能要进行遍历AST找到其运行结果，然后在进行混淆，貌似成本比较高。

2. 全局变量的编码，如果代码是作为 `SDK` 进行输出的，我们需要保存全局变量名的不变，比如：

```html
<script>
var $ = function(id) {
return document.getElementById(id);
};
</script>
```

`$` 变量是放在全局下的，混淆过后如下：

```html

<script>
var _0x6482fa = function(id) {
return document.getElementById(id);
};
</script>
```

那么如果依赖这一段代码的模块，使用 `$('id')` 调用自然会报错，因为这个全局变量已经被混淆了。

## 常量提取

将 `JS` 中的常量提取到数组中，调用的时候用数组下标的方式调用，这样的话直接读懂基本不可能了，要么反 `AST` 处理下，要么一步一步调试，工作量大增。

```js
// 混淆前
var test = 'hello';
// 混淆后

var _0x9d2b = ['hello'];

var _0xb7de = function (_0x4c7513) {
    var _0x96ade5 = _0x9d2b[_0x4c7513];
    return _0x96ade5;
};

var test = _0xb7de(0);
```

## 常量混淆

将常量进行加密处理，上面的代码中，虽然已经是混淆过后的代码了，但是 `hello` 字符串还是以明文的形式出现在代码中，可以利用 `JS` 中 16 进制编码会直接解码的特性将关键字的 `Unicode` 进行了 16 进制编码。如下：

```js
// 混淆前
var test = 'hello';
// 结合常量提取得到混淆结果：
var _0x9d2b = ['\x68\x65\x6c\x6c\x6f'];

var _0xb7de = function (_0x4c7513) {
    _0x4c7513 = _0x4c7513 - 0x0;
    var _0x96ade5 = _0x9d2b[_0x4c7513];
    return _0x96ade5;
};

var test = _0xb7de('0x0');
```

除了 `JS` 特性自带的 `Unicode` 自动解析以外，也可以自定义一些加解密算法，比如对常量进行 `base64` 编码，或者其他的什么 `rc4` 等等，只需要使用的时候解密就 OK，比如上面的代码用 `base64` 编码后：

```js

var _0x9d2b = ['aGVsbG8=']; // base64编码后的字符串

var _0xaf421 = function (_0xab132) {
    // base64解码函数
    var _0x75aed = function(_0x2cf82) {
        // TODO: 解码
    };
    return _0x75aed(_0xab132);
}

var _0xb7de = function (_0x4c7513) {
    _0x4c7513 = _0x4c7513 - 0x0;
    var _0x96ade5 = _0xaf421(_0x9d2b[_0x4c7513]);
    return _0x96ade5;
};

var test = _0xb7de('0x0');
```

## 运算混淆

将所有的逻辑运算符、二元运算符，还有函数调用、静态字符串都变成函数，目的也是增加代码阅读难度，让其无法直接通过静态分析得到结果。如下：

```js
var i = 1 + 2;
var j = i * 2;
var k = j || i;
```

混淆后：

```js

var _0x62fae = {
    _0xeca4f: function(_0x3c412, _0xae362) {
        return _0x3c412 + _0xae362;
    },
    _0xe82ae: function(_0x63aec, _0x678ec) {
        return _0x63aec * _0x678ec;
    },
    _0x2374a: function(_0x32487, _0x3a461) {
        return _0x32487 || _0x3a461;
    }
};

var i = _0x62fae._0e8ca4f(1, 2);
var j = _0x62fae._0xe82ae(p1, 2);
var k = _0x62fae._0x2374a(i, j);
```

## 语法丑化

将我们常用的语法混淆成我们不常用的语法，前提是不改变代码的功能。例如 `for` 换成 `do/while`，如下：

```js
for (i = 0; i < n; i++) { 
    // TODO: do something
}

var i = 0;
do {
    if (i >= n) break;

    // TODO: do something
    i++;
} while (true)
```

参考文章：
- [JS 逆向高阶 | JavaScript混淆安全加固](https://mp.weixin.qq.com/s/i_HwHaDaD7pZyurWSa6B6g)
- [【JavaScript 逆向】AST 技术反混淆](https://blog.csdn.net/Yy_Rose/article/details/124290656)