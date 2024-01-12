---
title: ES6
date: 2023-01-09 20:30
category: Notes
comment: hidden
---

[[toc]]

## 变量声明
### let
1. 变量不能重复声明
2. 一般说不存在变量提升，其实是存在变量提升的，但是声明前无法读取变量
3. 不影响作用域链
### let经典案例实践
```js
let items = document.getElementsByClassName('item');
for (let i = 0; i < items.length; i++) {
    items[i].onclick = function () {
        // ...
    }
}
for (var i = 0; i < items.length; i++) {
    items[i].onclick = function () {
        // ...
    }
}
```
for 循环中，使用 var 变量，i 会变量提升。循环完之后，i=3，items[3] 是不存在的元素，会报错。

### const
1. 一定要赋初始值
2. 一般常量使用大写
3. 常量的值不能修改
4. 块级作用域
5. **对于数组和对象的元素修改**，不能算作对常量的修改，不会报错，如：

## 解构赋值
ES6 允许按照一定模式从数组和对象中提取值，对变量进行赋值。
- 数组解构
- 对象解构

## 模板字符串
字符串声明方式：``
- 内容中可以直接出现换行符
- 变量拼接
```js
const out = `${name}:${age}`;
```

## 简化对象写法
- 当变量名和对象键名一致时，可以简化对象属性和方法的声明。
```js
const TEST = {
    name,
    change
}
```
- 对象中方法的简写
```js
const TEST = {
    improve : function () {
        // ...
    }
}
// 等价于
const TEST = {
    improve () {
        // ...
    }
}
```

## 箭头函数
1. this 是静态的，始终指向声明时所在作用域下的this值;
2. 箭头函数不能作为构造函数去实例化对象;
3. 不能使用 **arguments** 变量;
- arguments 是一个对应于传递给函数的参数的类数组对象。
4. 箭头函数的简写
- 参数只有一个，可以省略括号
- 当代码体只有一条语句时，可省略花括号(此时 return 必须省略，且语句的执行结果就是函数的返回值)
```js
let pow = n => n * n;
```
5. 箭头函数适合与 this 无关的回调，如定时器，数组的方法回调;
6. 不适合与 this 有关的回调，如事件回调，对象方法; 

## 函数参数的默认值设置
1. 具有默认值的参数，一般位置要靠后
```js
function add(a, b, c = 10) {
    return a + b + c;
}
let result = add(1, 2) // 13
```
2. 与解构赋值结合
```js
function connect({ name = '王五', age, sex }) {
    console.log(name);//张三
    console.log(age);//29
    console.log(sex);//male
}
connect({
    name: "张三",
    age: 29,
    sex: "male"
})
```

## rest参数
1. rest 与 arguments 的区别
- arguments:
```js
function getName() {
    console.log(arguments);// { '0': '张三', '1': '李四', '2': '王五' }
}
getName('张三','李四','王五')
```
- rest
```js
function getName(...args) {
    console.log(args);// [ '张三', '李四', '王五' ]
}
getName('张三','李四','王五')
```
2. rest 参数必须要放到所有参数最后

## 扩展运算符 ...

将数组转换为逗号分割的参数序列。

```js
const people = ['张三', '李四', '王五']

function getName() {
    console.log(arguments);
}

getName(people)// { '0': [ '张三', '李四', '王五' ] }
getName(...people)//{ '0': '张三', '1': '李四', '2': '王五' }
getName('张三', '李四', '王五')//{ '0': '张三', '1': '李四', '2': '王五' }
```

1. 数组的合并
```js
const male = ['张三','李四'];
const female = ['翠花','小娟'];

const people1 = male.concat(female);//[ '张三', '李四', '翠花', '小娟' ]
const people2 = [...male,...female];//[ '张三', '李四', '翠花', '小娟' ]
```
2. 数组的克隆
```js
const male1 = ['张三','李四',['王五','王六']];
const male2 = [...male1];//[ '张三', '李四', [ '王五', '王六' ] ]
```
注意，对于数组的拷贝是浅拷贝。


<mark>浅拷贝与深拷贝</mark>
- 浅拷贝是创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址 ，所以**如果其中一个对象改变了这个地址，就会影响到另一个对象**。
- 深拷贝是将一个对象从内存中完整的拷贝一份出来,从堆内存中开辟一个新的区域存放新对象,且**修改新对象不会影响原对象**。


3. 将伪数组转为真正的数组

```js
const divs = document.querySelectorAll('div');//divs是伪数组，实际是对象
const divArr = [...divs];
```

<mark>什么是伪数组？</mark>( Array-Like object )

> [原文直达](https://daily.dev/blog/why-do-you-need-to-know-about-array-like-objects)

- 伪数组是一个对象，每个元素有索引，并且有一个非负值的长度属性
- 不能够调用数组相关方法：`push`, `pop`, `join`, `map`, etc.

```js
const arr_like = {0: 'I', 1: 'am', 2: 'array-like', length: 3};
```

伪数组和数组完全不同，不具备任何数组的属性和方法。你可以使用 `Array.isArray(arr_like)` 判断变量是否是数组。但是伪数组和数组本质上都是对象。

## Symbol

ES6 引入了一种新的**原始数据类型 Symbol** ，表示独一无二的值。它是 JavaScript 语言的第 7 种数据类型，是一种**类似**于字符串的数据类型。


Symbol 特点：
- Symbol 的值是唯一的，用以解决命名冲突的问题
    - 创建 Symbol
    ```js
    let s = Symbol();//Symbol()
    let s2 = Symbol('张三');//Symbol(张三)
    let s3 = Symbol('张三');//Symbol(张三)
    console.log(s2 === s3);//false
    ```
    - Symbol.for 创建
    ```js
    let s1 = Symbol.for('张三');//Symbol(张三)
    let s2 = Symbol.for('张三');//Symbol(张三)
    console.log(s1 === s2);//true
    ```
- Symbol 值不能与其他数据进行运算
- Symbol 定义的对象属性不能使用 `for ... in` 循环遍历，但是可以用 `Reflect.ownKeys`来获取对象的所有键名

### <mark>使用 Symbol 给对象或属性添加方法</mark>

在对象中添加唯一的方法。

```js
// 向 methods 对象中添加方法，但为确保方法名不与对象原来的属性重复，使用 Symbol 创建方法
const methods = {
    change: 'change',
    stay: 'stay',
    reshape: 'reshape'
}
// 方式一
const contain = {
    change: Symbol(),
    stay: Symbol(),
}

methods[contain.change] = () => console.log('I can change.');
methods[contain.stay] = () => console.log('I can stay.');

console.log(methods);
/**
 * {
    change: 'change',
    stay: 'stay',
    reshape: 'reshape',
    [Symbol()]: [Function (anonymous)],
    [Symbol()]: [Function (anonymous)]
  }
 */

// 方式二
const methods = {
    [Symbol('change')]: () => console.log('I can change.'),
    [Symbol('stay')]: () => console.log('I can stay.'),
    reshape: 'reshape'
}

console.log(methods);
/**
 * {
  reshape: 'reshape',
  [Symbol(change)]: [Function: [change]],
  [Symbol(stay)]: [Function: [stay]]
}
 */
```

### <mark> Symbol 内置值</mark>

控制对象在特定场景下的表现，扩展对象功能，不是很理解这一块。

## 迭代器 `Iterator`

Iterator 是一种接口，任何数据结构只要部署了 Iterator 接口，就可以完成遍历操作。

- ES6 创造了一种新的遍历命令 `for...of` ，Iterator 接口（对象中的一个属性）主要供 `for...of` 消费
- 原生具备 Iterator 接口的数据：
    1. Array
    2. Arguments
    3. Set
    4. Map
    5. String
    6. TypedArray
    7. NodeList

```js
const fruit = ['apple','oringe','peach'];

for (const fruit of fruits) {
    // 遍历元素
}

for (const index in fruits) {
    // 遍历索引
}
```

- 原理
    1. 创建一个指针对象，指向当前数据结构的起始位置；
    2. 第一次调用对象的 next 方法，指针自动指向数据结构的第一个成员;
    3. 接下来不断调用 next 方法，指针一直往后移动，直到指向最后一个成员；
    4. 每调用 next 方法返回一个包含 value 和 done 属性的对象;
    ```js
    const iterator = fruits[Symbol.iterator]();

    console.log(iterator);//Object [Array Iterator] {}
    console.log(iterator.next());//{ value: 'apple', done: false }
    console.log(iterator.next());//{ value: 'oringe', done: false }
    console.log(iterator.next());//{ value: 'peach', done: false }
    console.log(iterator.next());//{ value: undefined, done: true }
    ```

**<mark>需要自定义遍历数据时，要想到迭代器</mark>**


遍历下列对象中的 name 属性，并返回 name 数组中的每一个元素：


```js
const people = {
    age: 18,
    names: [
        '张三',
        '李四',
        '王五'
    ],
    [Symbol.iterator]() {
        let index = 0;
        return {
            next: () => {
                if (index < this.names.length) {
                    const result = { value: this.names[index], done: false };
                    index++
                    return result
                }
                else return { value: undefined, done: true }
            }
        }
    }
}

for (const name of people) {
    console.log(name);
    //张三
    //李四
    //王五
}
```

## 生成器

- 函数声明

```js
function* gen() { }
function *gen() { }
function * gen() { }
```

- 调用

```js
function * gen() {
    yield '张三';// yield 是函数代码的分隔符
    yield '李四';
    yield '王五';
 }

const iterator = gen();
console.log(iterator.next());//{ value: '张三', done: false }
console.log(iterator.next());//{ value: '李四', done: false }
console.log(iterator.next());//{ value: '王五', done: false }
console.log(iterator.next());//{ value: undefined, done: true }
```

- 生成器函数参数
    - 整体函数传参
    - next 方法的形参，且这个参数将作为上一个 yield 语句的返回结果
    ```js
    function* gen(arg) {
    console.log(arg);//iterator param
    const param1 = yield '张三';
    console.log(param1);//second
    const param2 = yield '李四';
    console.log(param2);//third
    const param3 = yield '王五';
    console.log(param3);//fourth
    }
    
    const iterator = gen('iterator param');
    console.log(iterator.next());//{ value: '张三', done: false }
    // next 方法传入实参
    console.log(iterator.next('second'));//第 2 次执行 next 方法，实参就是第 1 个 yield 语句的返回结果
    console.log(iterator.next('third'));//第 3 次执行 next 方法，实参就是第 2 个 yield 语句的返回结果
    console.log(iterator.next('fourth'));//第 4 次执行 next 方法，实参就是第 3 个 yield 语句的返回结果
    /**
     * iterator param
     * { value: '张三', done: false }
     * second
     * { value: '李四', done: false }
     * third
     * { value: '王五', done: false }
     * fourth
     * { value: undefined, done: true }
     */
    ```

- 生成器演示异步操作
    - 1s 后控制台输出 111，2s 后控制台输出 222，3s 后控制台输出 333

    ```js
    function one() {
        setTimeout(() => {
            console.log(111);
            iterator.next();
        }, 1000)
    }

    function two() {
        setTimeout(() => {
            console.log(222);
            iterator.next();
        }, 2000)
    }

    function three() {
        setTimeout(() => {
            console.log(333);
            iterator.next();//这一步可以忽略，如果注释掉，代码结果不会输出 444 ，生成器函数并没有运行完
        }, 3000)
    }

    function* gen() {
        yield one();
        yield two();
        yield three();
        console.log(444);
    }

    let iterator = gen();
    iterator.next();
    ```

    - 模拟订单
    ```js
    function getName() {
        setTimeout(() => {
            const data = '用户数据';
            iterator.next(data);//第 2 次调用 next ，作为第 1 个 yield 的返回值
        }, 1000);
    }

    function getOrders() {
        setTimeout(() => {
            const data = '订单数据';
            iterator.next(data);//第 3 次调用 next ，作为第 2 个 yield 的返回值
        }, 1000);
    }

    function getGoods() {
        setTimeout(() => {
            const data = '商品数据';
            iterator.next(data);//第 4 次调用 next ，作为第 3 个 yield 的返回值
        }, 1000);
    }

    function* gen() {
        const one = yield getName();
        console.log(one);//用户数据
        const two = yield getOrders();
        console.log(two);//订单数据
        const three = yield getGoods();
        console.log(three);//商品数据
    }

    const iterator = gen();
    iterator.next();
    ```

## Promise
### Promise 的使用
```js
const p = new Promise((resolve,reject) => {
    
});

p.then(
(value) => {
// resolve ，执行 then 方法的第 1 个函数
},
(reason) => { 
// reject ，执行 then 方法的第 2 个函数
})
```

### then

> 调用 then 方法，then 方法的返回结果是 Promise 对象，对象状态由回调函数的执行结果决定
- 如果回调函数中返回的结果是**非Promise**类型的属性，状态为成功，返回值为对象的成功返回值

```js
const p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('data');
    }, 1000);
})

const result = p.then(
value => {
        console.log(value);
        return 123;//返回值为非 Promise 类属性
    },
    reson => {
        console.warn(reson);
    }
)

console.log(result);
//result 是 Promise 对象，Promise 状态为成功，值是 123
```

- 如果回调函数中返回的结果是 **Promise** 对象，则回调函数中的 Promise 状态决定了 then 方法返回的 Promise 的状态，回调函数中的 **Promise** 的成功值，就是 then 方法返回的 Promise 的成功值
```js
const result = p.then(
value => {
    console.log(value);
    return new Promise((resolve, reject) => {//返回值是 Promise 对象
        resolve('ok')
    })
},
reson => {
    console.warn(reson);
}
)

console.log(result);
// result 是 Promise 对象，Promise 状态为成功，值是 'ok'
```

- then 的链式调用，可以只指定 1 个回调函数

```js
const p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('data');
    }, 1000);
})

p.then(value => {})
.then(value => {})
```

## Set

ES6 提供了新的数据结构 Set（集合），它类似于数组，但是成员的值是**唯一**的，集合实现了 Iterator 接口，所以可以使用 **扩展运算符** 和 **for...of** 进行遍历。

1. 声明

```js
const s = new Set();
const s2 = new Set(['apple','origin','peach','origin','peach'])
console.log(s);//Set(0) {}
console.log(typeof s);//object
console.log(s2);//Set(3) { 'apple', 'origin', 'peach' }
```

2. 方法
    - for...of 遍历

    ```js
    const s = new Set(['apple','origin','peach']);
    for(const v of s) console.log(v);
    //apple
    //origin
    //peach
    ```

    - size 获取元素个数

    ```js
    const s = new Set(['apple','origin','peach']);
    console.log(s.size);//3
    ```

    - add 添加新的元素

    ```js
    const s = new Set(['apple','origin','peach']);
    s.add('grape');
    console.log(s);// { 'apple', 'origin', 'peach', 'grape' }
    ```

    - delete 删除元素

    ```js
    const s = new Set(['apple', 'origin', 'peach', 'grape']);
    s.delete('apple');
    console.log(s);// { 'origin', 'peach', 'grape' }
    ```

    - has 检测是否有某个元素

    ```js
    const s = new Set(['apple','origin','peach']);
    console.log(s.has('origin'));//true
    console.log(s.has('water'));//false
    ```

    - clear 清空
    ```js
    const s = new Set(['apple','origin','peach']);
    s.clear()//Set(0) {}
    ```

3. Set 实践

    - arr数组去重

    ```js
    const arr = [1, 2, 3, 4, 5, 4, 3, 2, 1];
    const arr2 = [4,5,6,5,6];
    console.log(new Set(arr));//Set(5) { 1, 2, 3, 4, 5 }
    console.log(...new Set(arr));//1 2 3 4 5

    const result = [...new Set(arr)];
    console.log(result);//[ 1, 2, 3, 4, 5 ]
    ```

    - arr 与 arr2 的交集

    ```js
    const arr = [1, 2, 3, 4, 5, 4, 3, 2, 1];
    const arr2 = [4,5,6,5,6];
    const result = [...new Set(arr)].filter(item => new Set(arr2).has(item));
    console.log(result);//[ 4, 5 ]
    ```

    - arr 与 arr2 的并集合

    ```js
    const arr = [1, 2, 3, 4, 5, 4, 3, 2, 1];
    const arr2 = [4,5,6,5,6];
    const result = [...new Set([...arr,...arr2])];
    console.log(result);//[1,2,3,4,5,6]
    ```

    - arr 与 arr2 的差集

    ```js
    const arr = [1, 2, 3, 4, 5, 4, 3, 2, 1];
    const arr2 = [4,5,6,5,6];
    const result = [...new Set(arr)].filter(item => !(new Set(arr2).has(item)));
    console.log(result);//[ 1, 2, 3 ]
    ```


## Map

ES6 提供了 Map 数据结构，它类似于对象，也是键值对的集合。但是**键**的范围不限于字符串，各种类型的值（**包括对象**）都可以当作键。


Map 也实现了 iterator 接口，所以可以使用 **扩展运算符...** 和 **for...of** 进行遍历。



1. 方法

    - set 添加元素，<mark>相当于升级版的对象</mark>，任何类型都可以作为**键**

    ```js
    const map = new Map();
    map.set('name', '张三');
    map.set('change', () => console.log('I can cange。'));
    map.set({ home: 'chengdu' }, ['北京', '上海', '广州']);
    console.log(map);
    /**
     *Map(3) {
     'name' => '张三',
    'change' => [Function (anonymous)],
    { home: 'chengdu' } => [ '北京', '上海', '广州' ]
    }
    */
    ```

    - size 获取 Map 大小

    ```js
    const map = new Map();
    map.set('name', '张三');
    map.set('change', () => console.log('I can cange。'));
    map.set({ home: 'chengdu' }, ['北京', '上海', '广州']);
    console.log(map.size);//3
    ```

    - delete 删除

    ```js
    const map = new Map();
    const key = { home: 'chengdu' }

    map.set('name', '张三');
    map.set('change', () => console.log('I can cange。'));
    map.set(key, ['北京', '上海', '广州']);

    map.delete('name');
    map.delete(key);

    console.log(map);//Map(1) { 'change' => [Function (anonymous)] }
    ```

    - get 获取

    ```js
    const map = new Map();
    const key = { home: 'chengdu' }

    map.set('name', '张三');
    map.set('change', () => console.log('I can cange。'));
    map.set(key, ['北京', '上海', '广州']);

    console.log(map.get('name'));//张三
    console.log(map.get(key));//[ '北京', '上海', '广州' ]
    ```

    - clear 清空
    
    ```js
    map.clear()
    ```

    - for...of 遍历

    ```js
    const map = new Map();
    const key = { home: 'chengdu' }

    map.set('name', '张三');
    map.set('change', () => console.log('I can cange。'));
    map.set(key, ['北京', '上海', '广州']);

    for(const v of map) console.log(v);
    //[ 'name', '张三' ]
    //[ 'change', [Function (anonymous)] ]
    //[ { home: 'chengdu' }, [ '北京', '上海', '广州' ] ]
    ```

## class 类

通过 class 关键字，可以定义类，与构造函数作用一样，只是让对象的原型写法更加清晰、更像面向对象编程的语法而已，可以看做语法糖。

### 实例化对象
- 构造函数

```js
function Phone(brand, price) {
    this.brand = brand;
    this.price = price;
}
// 添加方法
Phone.prototype.call = function () {
    console.log('I can take pictures.');
}
// 实例化对象
const APPLE = new Phone('Iphone XR','4999');
APPLE.call();//I can take pictures.
console.log(APPLE);//Phone { brand: 'Iphone XR', price: '4999' }
```

- class

```js
class Phone{
    // 构造方法，名字不能修改，实例化对象时执行
    constructor(brand, price) {
        this.brand = brand;
        this.price = price;
    }

    // 方法必须使用这种语法
    call(){
        console.log('I can take pictures.');
    }
}
// 实例化对象
const APPLE = new Phone('Iphone XR','4999');
APPLE.call();//I can take pictures.
console.log(APPLE);//Phone { brand: 'Iphone XR', price: '4999' }
```

### class 静态成员

实例化对象和构造函数对象属性不互通，与函数原型的对象是互通的，对于下列中Phone的name和call叫做静态成员，只属于类，不属于实例化对象。

```js
function Phone() {

}

Phone.name = 'phone';
Phone.call = function () {
    console.log('I am calling ...');
}

// 实例化对象
const APPLE = new Phone();
// 下面两行都报错，实例化对象没有这两个属性
console.log(APPLE.name);
APPLE.call();
```

```js
class Phone {
    // 静态属性
    static name = 'tele phone'
}

const nokia = new Phone();
console.log(nokia.name);//undefined
console.log(Phone.name);//tele phone
```

## ES5 实现对象继承

```js
// 父级构造函数
function Phone(brand,price) {
    this.brand = brand;
    this.price = price;
}

Phone.prototype.call = () =>console.log('I can call.');

// 子级构造函数
function SmartPhone(brand,price,color,size) {
    Phone.call(this,brand,price);
    this.color = color;
    this.size = size;
}

// 设置子级构造函数的原型
SmartPhone.prototype = new Phone;
SmartPhone.prototype.constructor = SmartPhone;

// 声明子类方法
SmartPhone.prototype.photo = ()=> console.log('I can take photos.');

// 实例化对象
const chuizi = new SmartPhone('锤子',2499,'black','5.5inch');
console.log(chuizi);
```

## ES6 类的继承

```js
// 父类
class Phone {
    constructor(brand, price) {
        this.brand = brand;
        this.price = price;
    }

    call() {
        console.log('I can call.');
    }
}

class SmartPhone extends Phone {
    constructor(brand, price, color, size) {
        super(brand, price);
        this.color = color;
        this.size = size;
    }

    photo() {
        console.log('I can take photos.');
    }

    playGames() {
        console.log('games.');
    }

    call() {
        console.log('我可以进行视频通话.');
    }
}

const xiaomi = new SmartPhone('小米', 799, 'black', '4.7inch');
xiaomi.call();//我可以进行视频通话.
console.log(xiaomi);//SmartPhone { brand: '小米', price: 799, color: 'black', size: '4.7inch' }
```

## class 中的 getter 和 setter


```js
class Phone {
    get price(){
        console.log('price is...');
        return 'price1';
    }

    set price(param){
        console.log('price is ' + param);
    }
}

const phone = new Phone();
console.log(phone.price);
//price is...
//price1

phone.price = '$699';//price is $699
```

## 数值扩展

1. Number.EPSION 是 JavaScript 表示的最小精度；
2. 二进制和八进制

```js
const a = 0b1010;//10，二进制
const b = 0o777;//511，八进制
const x = 0xff;//255，十六进制
```

3. Number.isFinite，检测一个数值是否为有限数
4. Number.isNaN，检测一个数值是否为 NaN
5. Number.parseInt,Number.parseFloat，将字符串转为整数和小数，只对字符串中的**数字进行截取**
6. Number.isInteger，判断一个数是否是整数
7. Math.trunc，将数字的小数部分抹掉
8. Math.sign，判断一个数的正负性

```js
console.log(Math.sign(100));//1
console.log(Math.sign(0));//0
console.log(Math.sign(-100));//-1
```

## 对象方法扩展

1. Object.is，判断两个值是否完全相等

```js
console.log(Object.is(120,120));//true
// 注意类似 NaN 比较的区别
console.log(Object.is(NaN,NaN));//true
console.log(NaN === NaN);//false
```

2. Object.assign，对象的合并

```js
const config1 = {
    name: 19,
    sex: "male",
    school: "理工大学1",
    test: "test"
}

const config2 = {
    name: 20,
    sex: "female",
    school: "理工大学2"
}

const config3 = {
    name: 20,
    sex: "female",
    school: "理工大学2",
    host: "local"
}
// 将 config2 覆盖 config1
console.log(Object.assign(config1, config2));//{ name: 20, sex: 'female', school: '理工大学2', test: 'test' }
// 会保存多余的属性
console.log(Object.assign(config1, config3));//{ name: 20, sex: 'female', school: '理工大学2',test: 'test', host: 'local' }
```

第一个对象是被覆盖的对象，首先会查找出所有第二个对象与第一个对象匹配的属性，比较这里面所有的属性值是否相等，不相等取第二个对象的值。


如果第一个对象里有第二个对象里不存在的属性，直接添加进去。


如果第二个对象里有第一个对象里不存在的属性，直接添加进去。

3. Object.setPrototypeOf，设置原型对象，但不建议用这个方法设置，应该在声明类的时候就确定，Object.getPrototypeOf 获取原型对象。

```js
const school = {name:'理工大学'};
const cities = {area:['北京','成都','上海']}

Object.setPrototypeOf(school,cities);
console.log(Object.getPrototypeOf(school));
console.log(school);
```

## 模块化

模块化的优势：

1. 防止命名冲突
2. 代码复用
3. 高维护性


模块化规范产品：

ES6之前的模块化规范有：

1. CommonJS   =>    NodeJS、Browserify
2. AMD        =>    requireJS
3. CMD        =>    seaJS

### ES6 模块化语法

模块功能主要由两个命令构成：export 和 import

- export 命令用于规定模块的对外接口
- import 命令用于输入其他模块提供的功能

如，我想在 index.html 使用 main.js 里暴露的数据：

```js
// main.js
export const str1 = 'hello!';
export function teach() {
    console.log('hahaha');
}
```

```html
...
<body>
    <script type="module">
    //引入 main.js 模块内容
        import * as m1 from './main.js';
        console.log(m1);
    </script>
</body>
...   
```

也可以只引用入口文件，在入口文件操作，与上面操作类似。

```html
...   
<body>
    <script src="./app.js" type="module"></script>
</body>
...
```

### ES6 模块暴露数据语法汇总

1. 分别暴露

```js
export const str1 = 'hello!';

export function teach() {
    console.log('hahaha');
}
```

2. 统一暴露

```js
const str1 = 'hello!';

function teach() {
    console.log('hahaha');
}

export { str1, teach }
```

3. 默认暴露

```js
export default {
    str1: 'hello!',
    teach: function () {
        console.log('hahaha');
    }
}
```

### ES6 引入模块数据语法汇总

1. 通用的导入方式

> 无论是哪种暴露方式，都可以使用这种方式引用、

```js
import * as m1 from "./main.js"
```

2. 解构赋值的形式

- 分别暴露

```js
import {str1,teach} from './main.js';
```

- 统一暴露

```js
import {str1,teach} from './main.js';
// 如果有重名，可以使用：
import {str1 as str,teach as teach2} from './main2.js';
```

- 默认暴露

不能直接使用 default ，需使用别名引入。

```js
import {default as m3} from './main.js';
```

3. 简便形式

只针对默认暴露。

```js
import m3 from './main.js';
```

## bable 对 ES6 模块化代码转化

防止浏览器出现对 ES6 不兼容的情况，需对原代码进行打包，步骤：

1. 安装工具：
- <mark>babel-cli</mark>  =>   babel命令行工具
- <mark>babel-preset-env</mark>  =>   预设包，能将 ECMA 最新的特性进行转换为 ES5 的语法
- <mark>browserify/webpack</mark>  =>    打包工具

2. 安装命令：

```shell
npm i babel-cli babel-preset-env browserify -D
```

3. 对源代码进行转换

- 局部安装命令

```shell
//npx babel **(源文件目录) -d **(选择存储文件目录地址) --presets=babel-preset-env
npx babel src/js -d dist/js --presets=babel-preset-env
```

- 全局命令

```shell
babel src/js -d dist/js --presets=babel-preset-env
```

4. 对转换后的代码进行打包

```shell
npx browserify dist/js/app.js -o dist/bundle.js
```

5. 最后，页面引入 dist/bundle.js

```html
...   
<body>
    <script src="dist/bundle.js"></script>
</body>
...
```

注意：对源文件进行改动后要**重新转换和打包**，执行 babel 和 browserify 命令。

## ES6 模块化引入 npm 包

在源文件 import 引入包即可，如引入 jquery。首先，安装包：`npm i jquery`，然后在源文件入口文件中引入


```js
import $ from 'jquery';//'jquery' 是 npm 上的包名
//等价于CommonJS：const $ = require('jquery')
```

再进行转换和打包，即可。


## ES7 新特性

1. `includes` 检测数组中是否有某个元素，返回布尔值。
2. 指数操作符 `**`，用于实现幂运算

```js
2 ** 10;
// 等价于
Math.pow(2,10);
// 结果均是 1024
```

## ES8 新特性

async 和 await 两种语法结合可以让异步代码像同步代码一样。

### async 和 await 

1. async

- async 函数的返回值是 promise 对象
- promise 对象的结果由 async 函数执行的返回值决定
    - 返回的结果不是 Promise 类型对象，则 result 是成功的 Promise，**返回值**就是 result 的 Promise 的值。

    ```js
    async function fn() {
        return 'str1';
    }

    const result = fn();//Promise { 'str1' }
    ```

    - 抛出错误，则 result 是**失败的 Promise**，result 的 Promise 的值是一个失败的 Promise对象。 

    ```js
    async function fn() {
        throw new Error('出错啦!')
    }

    const result = fn()
    ```

    - 返回的结果是 Promise 对象，如果返回的是成功的 Promise，则 result 就是成功的 Promise；如果返回的是失败的 Promise，则 result 就是失败的 Promise。

    ```js
    async function fn() {

        return new Promise((resolve, reject) => {
            resolve('haha.')
        })
    }

    const result = fn();
    ```

2. await 表达式

- await 必须写在 async 函数中
- await 右侧的表达式一般为 promise 对象
- await 返回的值是**promise 成功的值**
- await 的 promise 失败了，就会抛出异常。需要通过 try...catch 捕获处理

```js
const p1 = new Promise((resolve, reject) => {
    resolve('haha.')
})

const p2 = new Promise((resolve, reject) => {
    reject('err.')
})

async function main() {
    try {
        const res1 = await p1;
        console.log(res1);
        const res2 = await p2;
    } catch (error) {
        console.log(error);
    }
}

main();
//haha.
//err.

```

3. async 与 await 结合读取文件内容

```js
function getinfo1() {
    return new Promise((resolve, reject) => {
        resolve('info1')
    })
}

function getinfo2() {
    return new Promise((resolve, reject) => {
        resolve('info2')
    })
}

function getinfo3() {
    return new Promise((resolve, reject) => {
        resolve('info3')
    })
}

async function main() {
    const res1 = await getinfo1();
    const res2 = await getinfo2();
    const res3 = await getinfo3();
    console.log(`${res1} ${res2} ${res3}`);
}

main();//info1 info2 info3
```

4. async 与 await 结合发送 ajax 请求

发送 ajax 请求，返回结果是 promise。

```js
function sendAjax(url) {
    new Promise((resolve, reject) => {
        const x = new XMLHttpRequest();
        x.open('GET', url);
        x.send();
        x.onreadystatechange = function () {
            if (x.readyState === 4) {
                if (x.status >= 200 && x.status < 300) {
                    resolve(x.response)
                }
                else reject(x.status)
            }
        }
    })
}

async function main() {
    const res1 = await sendAjax('url1');
    const res2 = await sendAjax('url2');

}

main();
```

补充：npm 的 axios 生态包，返回结果就是 promise 对象。所以使用 axios 发请求，await 接收结果会很方便。

## 对象方法扩展

1. Object.values 获取对象所有的值，返回一个数组；Object.keys 获取对象所有的键，返回一个数组；
2. Object.entries；

```js
const obj = {
    name:'张三',
    nums:[1,2,3],
}

console.log(Object.entries(obj));//[ [ 'name', '张三' ], [ 'nums', [ 1, 2, 3 ] ] ]
// 便于创建 Map
const m = new Map(Object.entries(obj));
console.log(m);//Map(2) { 'name' => '张三', 'nums' => [ 1, 2, 3 ] }
console.log(m.get('name'));//张三
```

3. Object.fromEntries 将二维数组或 Map对象 转换为一般对象；

```js
// 二维数组
const res1 = Object.fromEntries([
    ['name','张三'],
    ['age',16]
])
console.log(res1);//{ name: '张三', age: 16 }
// Map
const m = new Map();
m.set('name','张三');
const res2 = Object.fromEntries(m);
console.log(res2);//{ name: '张三' }
```


4. Object.getOwnPropertyDescriptors 返回结果是对象属性结果的描述，可以对对象进行深层次的克隆；

```text
{
  name: { value: '张三', writable: true, enumerable: true, configurable: true },
  nums: {
    value: [ 1, 2, 3 ],
    writable: true,
    enumerable: true,
    configurable: true
  }
}
```

## ES9 的新特性

Rest 参数与 spread 扩展运算符在 ES6 中已经引入，不过 ES6 中只针对数组。ES9 中为对象提供了像数组一样的 Rest 参数和扩展运算符。

```js
function connect({host,port,...user}) {
    console.log(user);//{ username: 'admin', password: '123456' }
}

connect({
    host:'127.0.0.1',
    port:3333,
    username:'admin',
    password:'123456'
})
```

将对象展开形成参数序列，便于将不同的对象属性合并。

```js
const obj1 = {host: '127.0.0.1'}
const obj2 = {port: 3333}
const obj3 = {username: 'admin'}
const obj4 = {password: '123456'}
// ...obj2 => port: 3333
const newobj = {...obj1,...obj2,...obj3,...obj4}
console.log(newobj);
/**
 * {
 *   host: '127.0.0.1',
 *   port: 3333,
 *   username: 'admin',
 *   password: '123456'
 * }
 */
```

## ES9 命名捕获分组

```js
const str = '<a href="index.htm">成都理工主站</a>';
const reg = /<a href="(?<url>.*)">(?<text>.*)<\/a>/;
const result = reg.exec(str);
console.log(result.groups.url);//index.htm
```

## 正则扩展

1. 反向断言
```js
const str = 'JS12345是一个编程语言555哈哈哈';
// 截取数字 555
// 正向断言，判断 555 数字后的是不是'哈'
const reg = /\d+(?=哈)/;
const result = reg.exec(str);
console.log(result);//[ '555', index: 14, input: 'JS12345是一个编程语言555哈哈哈', groups: undefined ]
// 反向断言，判断 555 数字前是不是'言'
const reg2 = /(?<=言)\d/;
const result2 = reg.exec(str);
console.log(result2);//[ '555', index: 14, input: 'JS12345是一个编程语言555哈哈哈', groups: undefined ]
```

2. dotAll模式

dot:'.'，元字符，表示除**换行符**以外的单个字符

## 字符串扩展方法

- str.trimStart() 清除字符串左侧空白
- str.trimEnd() 清除字符串右侧空白

## 数组方法扩展 flat 与 flatMap

1. flat 

将多维数组转化为低维数组：

```js
const arr = [1,2,3,4,[5,6]];
console.log(arr.flat());//[ 1, 2, 3, 4, 5, 6 ]
```

flat 可以传参，参数类型为数字，表示 flat 的深度，如三维数组转一维数组：

```js
const arr = [1, 2, 3, 4, [5, 6, [7, 8, 9]]];
console.log(arr.flat(2));//[ 1, 2, 3, 4, 5, 6 ,7 ,8]
```

2. flatMap 将 map 返回值的维度降低

```js
const arr = [1, 2, 3, 4];
const res = arr.map(item => item * 10);//[ 10, 20, 30, 40 ]
// 等价于
const res2 = arr.flatMap(item => [item * 10])//[ 10, 20, 30, 40 ]
```

## 私有属性

```js
class Person {
    // 公有属性
    name;
    // 私有属性
    #age;
    #weight;
    constructor(name, age, weight) {
        this.name = name;
        this.#age = age;
        this.#weight = weight;
    }

    intro() {
        console.log('name :>> ', this.name);
        console.log('#age :>> ', this.#age);
        console.log('#weight :>> ', this.#weight);
    }
}

const girl = new Person('Amy', 18, '45kg');
console.log(girl.name);// Amy
// console.log(girl.#age); //报错：Private field '#age' must be declared in an enclosing class

girl.intro()
/**
 * name :>>  Amy
 * #age :>>  18
 * #weight :>>  45kg
 */
```

## Promise.allSettled 方法

Promise.allSettled() 方法以 promise 对象组成的可迭代对象（数组）作为输入，并且返回一个 Promise 实例。


返回的结果也是 Promise ，这个 Promise 的状态一定是成功的，它的值是所传入的数组中所有 Promise 的状态和返回值。


它与 Promise.all 的区别是，allSettled 不管是否所有 Promise 都成功，继续执行，而 all 则只有在所有 Promise 都返回成功时才继续执行。

```js
const res1 = Promise.allSettled([p1,p2]);
const res2 = Promise.all([p1,p2]);
```

## 字符串扩展 

matchAll() 方法返回一个包含所有匹配正则表达式的结果及分组捕获组的迭代器。

```js
const regexp = /t(e)(st(\d?))/g;
const str = 'test1test2';

const array = [...str.matchAll(regexp)];

console.log(array[0]);
// Expected output: Array ["test1", "e", "st1", "1"]

console.log(array[1]);
// Expected output: Array ["test2", "e", "st2", "2"]
```

## 可选链操作符

```js
const a = undefined
a?.prop // 读取属性
a?.[0] // 读取数组
a?.() // 读取函数
```

## 动态 import

```js
// main.js
btn.onclick = function(){
    import('./hello.js').then(module => {
        module.hello();
    })
}

// hello.js
export const hello = () => {}
```

## BigInt

用于更大数值运算。

```js
const num1 = Number.MAX_SAFE_INTEGER//9007199254740991
const num2 = Number.MAX_SAFE_INTEGER + 1//9007199254740992
const num3 = Number.MAX_SAFE_INTEGER + 2//9007199254740992

const num4 = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(4)//9007199254740995n
```

## globalThis 始终指向全局对象 


































