---
title: 利用装饰器进行 OOP 开发的实践
date: 2023-06-11T14:22:50+08:00
category: Front End
---

[[toc]]

> 本文将介绍如何利用装饰器进行 OOP 开发，以及如何利用装饰器解决前端开发中的一些问题，但截至目前为止(2023-06-11T17:15:00+08:00)，装饰器在 EcmaScript 中还处于 Stage 3 阶段，因此本文实现完全基于 typescript 语法标准。

在常见的前后端分离项目中，似乎大家都遵守这种规则：对于接口一般会单独定义一个文件夹，然后在其中定义各个接口的请求函数，与之相应的类型定义（常常是interface）也会放在一起，而请求参数的组装处理常常放在组件当中进行，这样将接口与业务逻辑进行充分解耦，方便管理。但在实际开发中，这种规则下的开发体验有时并不是那么友好。

## 问题是什么

**interface 不足以定义一个数据模型**：前端需要的数据（Model）可能是经过一系列处理后的响应数据，而不是原始的接口返回（大部分可以视为 Entity），单纯通过 interface 进行类型约束常常会显得力不从心，Model 与 Entity 之间的转换会增加代码量的同时，也会使代码变的更肮脏。比如下面这个例子：

```ts
// user model and entity

// primitive entity from request
{
  uid: 1,
  first_name: 'jack',
  last_name: 'ma',
  modified_time: '2023-06-11T14:22:50+08:00',
  age: 18,
}

// forwards to model
{
  id: 1,
  firstName: 'jack',
  lastName: 'ma',
  name: 'jack ma',
  age: 18,
  modifiedTime: new Date('2023-06-11T14:22:50+08:00'),
  isAdult: true,
}
```

前端需要的数据 Model 存在 3 个由接口原始返回 Entity 处理得来的属性：由 `first_name` 和 `last_name` 组成的 `name`，以及由 `age` 计算得出的 `isAdult`，以及时间字符串转化而来的 Date 对象。这 3 个属性在接口返回的数据中并不存在，它们显然属于两种不同的数据类型，此时，如何去定义和管理 Type Declaration 显然也会变成一个棘手的问题。

**缺少对 序列化/反序列化 操作的完备支持**，序列化和反序列化是后端常见的操作，并且有着成熟完备的方案，这些方案很多都提供了强大的数据操作支持，比如对象字段名的映射、数据类型的转换等，但在前端却很少被提及，`JSON.parse()` 和 `JSON.stringify()` 基本就是前端的序列化和反序列化的全部了，它们除了 JS Object 转 JSON String 或 JSON String 转 JS Object 外就再不具备其他能力了，数据操作及转换完全需要我们手动进行，这种工作显得非常的原始和低效。

**数据模型与视图过度解耦让逻辑代码过于分散**，从设计模式上来说，API/Entity 与 视图逻辑/Model 的解耦确实让代码组织变得更加清晰也更好维护，但同时带来的问题是：功能逻辑的代码被分散成多个模块，在开发时带来不便的同时，也会使得代码的可读性变差，因为我们需要在多个模块中来回切换，才能理解一个功能的实现逻辑。

## 一种思路

> 为了更统一概念，后文中将 JS Plain Object 转换为 class 实例的操作称为反序列化，将 class 实例转换为 JS Plain Object 的操作称为序列化，一切前端所需的数据模型都称为 Model（包括 Entity）。

考虑使用 class 代替 interface 来约束 Model 数据类型，在 class 上扩展更多属于 Model 相关的操作。对于上面的例子，可以这样：

```ts
class User {
  id: number
  firstName: string
  lastName: string
  age: number
  modifiedTime: Date

  constructor(data: any) {
    this.id = data.uid
    this.firstName = data.first_name
    this.lastName = data.last_name
    this.age = data.age
    this.modifiedTime = new Date(data.modified_time)
  }

  get name() {
    return `${this.firstName} ${this.lastName}`
  }
  get isAdult() {
    return this.age >= 18
  }

  serialize() {
    return {
      id: this.id,
      first_name: this.firstName,
      last_name: this.lastName,
      age: this.age,
      modified_time: this.modifiedTime.toISOString(),
    }
  }
}

const model = new User({/* ... */}) // deserialize
const serialized = model.serialize() // serialize
```

而问题的关键在于：我们不可能手动编写所有 Model 序列化和反序列化的处理逻辑，这样的工作量太大了，并且也不利于维护。我们需要一种自动化的方式来实现这种转换。而序列化与反序列化的操作前提是：我们需要预先知道 Model 身上存在哪些属性并且与 Plain Object 键值之间的映射关系，在静态语言中，这种预知工作往往在编译期就可以轻松实现，但对于 JS 动态语言来说似乎不是一件容易的事（不考虑现今前端工程化下的代码打包和编译）。

装饰器为我们提供一种可能。装饰器是一种函数，可以对被装饰的类、成员或方法参数进行动态扩展，并且装饰器会随着 class 的定义而被执行。因此借助装饰器我们可以为 class 属性添加额外的元信息，这些元信息保存了该属性在序列化和反序列化时的配置信息，如属性名、转换函数等。在我们的自动 序列化/反序列化 中就可以轻松获取这些元信息。大致可以这么实现：

```ts
interface FieldConfig {
  name: string
  onSerialize?: Function
  onDeserialize?: Function
}

const fields = new Map<string, FieldConfig>()

function Field(config: FieldConfig) {
  return function(target: any, propertyKey: string) {
    fields.set(propertyKey, config)
  }
}

/**
 * decorate each property with Field decorator, and pass a config object to it,
 * the config object contains the property name in plain object, and serialize/deserialize function if needed
 * so that we can get all members of User class and its corresponding config
 */
class User {
  // name: property name in plain object
  @Field({ name: 'uid' })
  id: string
  @Field({ name: 'first_name' })
  firstName: string
  @Field({ name: 'last_name' })
  lastName: string
  @Field({ name: 'age' })
  age: number
  // onDeserialize: how to convert plain object value to class instance value
  // onSerialize: how to convert class instance value to plain object value
  @Field({ name: 'modified_time', onDeserialize: value => new Date(value), onSerialize: value => value.toISOString() })
  modifiedTime: Date
  get name() {
    return `${this.firstName} ${this.lastName}`
  }
  get isAdult() {
    return this.age >= 18
  }
}

function serialize(raw: Record<string, any>) {
  const model = new User()
  for (const [key, config] of fields.entries()) {
    const value = raw[config.name]
    model[key] = config.onDeserialize ? config.onDeserialize(value) : value
  }
  return model
}

function deserialize(model: User) {
  const raw = {}
  for (const [key, config] of fields.entries()) {
    const value = model[key]
    raw[config.name] = config.onSerialize ? config.onSerialize(value) : value
  }
  return raw
}

// so we can use it like this:
const raw = {
  uid: 1,
  first_name: 'jack',
  last_name: 'ma',
  age: 18,
  modified_time: '2023-06-11T14:00:00.000Z',
}
const deserialized = serialize(raw)
const serialized = deserialize(model)
```

达到生产环境可用的程度还需要考虑更多的细节，比如：如何处理嵌套对象、如何处理数组、如何处理复杂的数据类型等。本质上这些问题都可以通过装饰器来解决，但显然从零开始实现一个 序列化/反序列化 工具库是一件复杂的事情。

[class-transformer](https://github.com/typestack/class-transformer) 是一个非常强大的 class 和 Plain Object 之间的转换工具，在这种转换之外，它提供了强大的操作支持，比如对象字段名的映射、序列化或反序列化时是否忽略、数据类型的转换等。按照官方文档的介绍，基本使用是这样的：

```ts
class User {
  @Expose({ name: 'uid' })
  id: number
  @Expose({ name: 'first_name' })
  firstName: string
  @Expose({ name: 'last_name' })
  lastName: string
  @Expose({ name: 'age' })
  age: number
  @Expose({ name: 'modified_time' })
  @Transform(value => new Date(value))
  @Exclude()
  modifiedTime: Date
  get name() {
    return `${this.firstName} ${this.lastName}`
  }
  get isAdult() {
    return this.age >= 18
  }
}

const raw = {
  uid: 1,
  first_name: 'jack',
  last_name: 'ma',
  modified_time: '2023-06-11T14:22:50+08:00',
  age: 18,
}
const deserialized = plainToInstance(User, raw)
const serialized = instanceToPlain(deserialized)
```

Expose 对类成员属性进行暴露，指定该属性对应 Plain Object 上哪个键，Transform 指定序列化/反序列化时的转换函数，Exclude 指定该属性在序列化/反序列化时是否忽略。最后通过 `plainToInstance` 和 `instanceToPlain` 两个方法即可完成序列化/反序列化的操作。

但如果只是介绍一下装饰器和 class-transformer，那就远没有达到期望中的效果。class-transformer 的使用仍然有点复杂，我们需要将它进行封装，已达成这样的效果：

1. 将各种配置统一成一个 Field 装饰器；
2. 不需要给每一个类成员都添加 Field 装饰器，也能让它按照默认规则进行转换；
3. 高度聚合 Model 基本逻辑，不需要在业务代码中关心序列化/反序列化的细节。

对于第 2 点，更为重要的是：实现数据字段命名风格的自动转换，如：当前端使用 camelCase，后端使用 snake_case 时，`first_name` 反序列化后变为 `firstName`，`firstName` 序列化后变为 `first_name`：

```ts
// Plain Object
{
  first_name: 'Jack'
}

// User Model
class User {
  firstName: string
}
```

实现以上 3 个目标的同时，进行以下 API 设计：

1. 定义一个 Field 装饰器，支持配置：字段名、转换函数、是否忽略；
2. 定义一个 BaseModel 基础类，封装两个静态方法：序列化 `toPlain` 和 反序列化 `from`，任何 Model 都从 BaseModel 进行派生，不需要在业务代码中关心序列化/反序列化的细节，使得每个 Model 在使用上可以直接调用，如: `User.from(raw)` 和 `user.toPlain()`；

翻译成代码是这样的：

```ts
interface FieldConfig {
  /**
   * how to convert value between plain object and class instance,
   * if not provided, use primitive value
   */
  transform?: { onSerialize: Function; onDeserialize: Function }
  /**
   * what field name to use in plain object,
   * if not provided, follow the strategy:
   * 
   * 1. class member name: camelCase
   * 2. plain object field name: snake_case
   * 
   * In other words, if you don't provide field name,
   * it will be converted to snake_case on serialize, and camelCase on deserialize
   */
  fieldName?: string
  /**
   * whether to ignore this field when serialize or deserialize
   */
  ignore?: { onSerialize: boolean; onDeserialize: boolean }
}

// we use Field decorator to decorate class member
function Field(config: FieldConfig = {}) {
  return function(target: any, propertyKey: string) {
    /* ... */
  }
}

// we use BaseModel to implement basic logic
class BaseModel {
  static from<T extends ClassConstructor<BaseModel>>(raw: any): InstanceType<T> {
    /* ... */
  }
  toPlain<T extends BaseModel>(): Object {
    /* ... */
  }
}
```

于是，在使用上就可以这样：

```ts
// declare a User Model that extends from BaseModel
class User extends BaseModel {
  @Field({ fieldName: 'uid' })
  id: string
  firstName: string
  lastName: string
  age: number
  @Field({ transform: { onSerialize: v => v.toISOString(), onDeserialize: v => new Date(v) } })
  modifiedTime: Date

  @Field({ ignore: { onSerialize: true, onDeserialize: false } })
  password: string

  get name() {
    return `${this.firstName} ${this.lastName}`
  }
  get isAdult() {
    return this.age >= 18
  }
}

const user = User.from(/* ... */)
const plain = user.toPlain()
```

当我们将所有 Model 都定义成这样的形式后，就可以通过在请求工具的拦截器中，对请求数据和响应数据进行统一的 序列化/反序列化 处理。

## 远不止于此

使用 class 代替 interface 去约束数据类型不是本篇文章的最终目标，当手动封装了 class-transformer 的部分逻辑以控制了 序列化/反序列化 的过程时，我发现借助装饰器可以实现更多功能，甚至重新组织 View 与 Model 之间的代码逻辑。

对一个 Model 进行 CRUD 是一个再正常不过的场景，这里我们定义一个 CRUD 抽象类，用以约束 Model 存在 CRUD 操作：

```ts
abstract class CRUD<Get = any, Create = Get, Update = Get, Delete = any> {
  get(): Promise<Get> {}
  create(): Promise<Create> {}
  update(): Promise<Update> {}
  delete(): Promise<Delete> {}
}
```

假设 User Model 实现了 CRUD，那么我们可以这样使用：

```ts
class User extends BaseModel implements CRUD<User> {
  get() { /* ... */ }
  create() { /* ... */ }
  update() { /* ... */ }
  delete() { /* ... */ }
}

// get a user
await new User().get()
// create a user
const user = await new User().create()
// update a user
user.update()
// delete a user
user.delete()
```

这样，我们把请求逻辑代码从 api 文件夹中移除，最后附加在了 Model 上，这样很 OOP。而通常在接口设计上，对于一个 Model（Entity）的 CRUD 都遵守一定的规范，如：`GET /users` 获取用户列表，`POST /users` 创建用户，`PUT /users/:id` 更新用户，`DELETE /users/:id` 删除用户。

既然如此，我们可以写一个工具函数，自动为某个 Model 实现 CRUD 请求方法，为了保持一致的代码风格，我们可以将这个工具函数实现为一个类装饰器：

```ts
export function CRUDDeriver() {
  return function<T extends ClassConstructor<CRUD>>(target: T) {
    target.prototype.get = function() { /* ... */ }
    target.prototype.create = function() { /* ... */ }
    target.prototype.update = function() { /* ... */ }
    target.prototype.delete = function() { /* ... */ }
  }
}

@CRUDDeriver()
class User extends BaseModel { /* ... */ }

// for type checking, declare a interface that named as User Model and extends CRUD
interface User extends CRUD<User> {}
```

对 Model 进行查询时，我们可能会传递额外的参数，我们再定义两个个抽象类。

```ts
abstract class Query<T> {
  query: T
}

abstract class Entity<T extends string | number = number> {
  id: T
}
```

Query 约束该 Model 在 CRUD 操作时，可以传递额外的查询参数，Entity 约束该 Model 对应后端数据的一个实体，它具有唯一的 id。同时在 `CRUDDeriver` 中，通过判断 Model 上的 `query` 和 `id` 属性是否存在，来为 Model 实现具体的请求逻辑。当实体 Model 存在 `query` 时，在请求中将它作为参数传递，当实体 Model 存在 `id` 时，查询请求将会被转换为单个实体的查询，即：`GET /users/:id`，如果  `id` 不存在，则查询请求将会被转换为列表查询，即：`GET /users`。

Model 常常处于 View 与 Service 之间，因此 View 与 Service 。

```ts