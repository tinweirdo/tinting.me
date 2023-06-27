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

> 在此之前我们约定：JS Plain Object 转换为 class 实例的操作称为反序列化，class 实例转换为 JS Plain Object 的操作称为序列化，一切前端所需的数据模型都称为 Model（包括 Entity）。

> **下文不会进行过多具体代码实现，而是通过伪代码来描述实现思路，因为实现细节并不是本文的重点。**

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

而问题的关键在于：我们不可能手动编写所有 Model 序列化和反序列化的处理逻辑，这样的工作量太大了，并且也不利于维护。我们需要一种自动化的方式来实现这种转换。而序列化与反序列化的操作前提是：我们需要预先知道 Model 身上存在哪些属性并且与 Plain Object 键值之间的映射关系，在静态语言中，这种预知工作往往在编译期就可以轻松实现，但对于 JS 动态语言来说似乎不是一件容易的事。

装饰器为我们提供一种可能。装饰器是一种函数，可以对被装饰的类、成员或方法参数进行动态扩展，并且装饰器会随着 class 的定义而被执行。因此借助装饰器我们可以为 class 属性添加额外的元信息，这些元信息保存了该属性在序列化和反序列化时的配置信息，如属性名、转换函数等。在我们的自动 序列化/反序列化 中就可以轻松获取这些元信息以确定转换策略。于是我们大致上可以这么实现：

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

以上代码定义了一个类成员装饰器 `Field`，它接受一个配置对象并将其以类成员名称作为键值保存在一个字典中，配置对象包含了该属性对应原始序列的属性名、序列化/反序列化 的转换函数等，。在 `serialize` 和 `deserialize` 函数中，我们通过 `fields` Map 获取了所有成员的配置信息，然后根据配置信息进行转换。这样我们就实现了一个简单的序列化/反序列化工具。

但要达到生产环境可用的程度还需要考虑更多的细节，比如：如何处理嵌套对象、如何处理数组、如何处理复杂的数据类型等。本质上这些问题都可以通过装饰器来解决，但显然从零开始实现一个 序列化/反序列化 工具库是一件复杂的事情。

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

对于第 2 点，其中一点尤为重要：前后端数据结构的命名规范可能不一致，大多数后端语言偏好 snake_case，但 JS/EcmaScript 标准一般使用 camelCase，为了避免额外的手动装饰 Field 和 键名配置，我们可以在 反序列化前 和 序列化后 手动实现数据字段命名风格的自动转换。

从以上 3 个目标出发，进行以下 API 设计：

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
  /* ... */
}

// we use BaseModel to implement basic logic
class BaseModel {
  toPlain<T extends BaseModel>(): Object { /* ... */ }
  static from<T extends typeof BaseModel>(raw: any):  InstanceType<T> { /* ... */ }
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

使用 class 代替 interface 去约束数据类型不是本篇文章的最终目标，借助装饰器所带来的强大元编程能力，我们可以给 class化 的 Model 添加更多功能逻辑，通过良好的封装来减少重复代码的编写。

### CRUD

显然，Model 大多数与接口有关，对其进行 CRUD 是一个再正常不过的场景，因此，在此之前我们先定义一个 CRUD 抽象类，用以约束 Model 存在 CRUD 能力：

```ts
abstract class CRUD<Get = any, Create = Get, Update = Get, Delete = any> {
  get(): Promise<Get> {}
  create(): Promise<Create> {}
  update(): Promise<Update> {}
  delete(): Promise<Delete> {}
}
```

当一个 Model 实现了以上抽象类，就认为这个 Model 是可以进行 CRUD 操作的，假设 User Model 实现了 CRUD，那么我们可以这样使用：

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
> Yeahhhh，这样很 OOP。

如果只是这样定义一个抽象类，CRUD 的逻辑却仍需要我们手动在 Model 上实现，似乎除了给我们带来一点 OOP式 的代码开发体验外，并没有带来任何实质上的帮助，显然形式大于意义了。

不过，通常在接口设计上，对于一个 Model（Entity）的 CRUD 都遵守一定的规范，如：`GET /users` 获取用户列表，`POST /users` 创建用户，`PUT /users/:id` 更新用户，`DELETE /users/:id` 删除用户。在这种固定形式下，很容易就可以通过统一的方式给 Model 自动添加 CRUD 能力。为了将装饰器贯彻到底，考虑将其实现为一个类装饰器：

```ts

type EndPoint<T> = string | ((action: 'get' | 'create' | 'update' | 'delete', model: T) => string)

export function CRUDDeriver<T>(endpoint: EndPoint<T>) {
  return function<T extends ClassConstructor<CRUD>>(target: T) {
    target.prototype.get = function() { /* ... */ }
    target.prototype.create = function() { /* ... */ }
    target.prototype.update = function() { /* ... */ }
    target.prototype.delete = function() { /* ... */ }
  }
}

@CRUDDeriver('/users')
class User extends BaseModel { /* ... */ }

// for type checking, declare a interface that named as User Model and extends CRUD
interface User extends CRUD<User> {}
```

定义一个 CRUDDeriver，它接受一个参数 endpoint，用来确定 HTTP 请求应该发送到后端的哪个接口，endpoint 可以是一个字符串，也可以是一个函数，当它是一个函数时，它接受两个参数：action 和 model，action 表示当前请求的动作，model 表示当前请求的 Model，通过这两个参数，我们可以根据不同的动作和 Model，返回不同的 endpoint。最后将其装饰在 Model 上，就可以为 Model 添加 CRUD 能力了。

当对 Model 进行 CRUD 时，可能会传递额外的参数，因此再定义两个个抽象类。

```ts
abstract class Query<T> {
  query: T
}

abstract class Entity<T extends string | number = number> {
  id: T
}
```

Query 约束该 Model 在 CRUD 操作时，可以传递额外的查询参数，Entity 约束该 Model 对应后端数据的一个实体，它具有唯一的 id。同时在 `CRUDDeriver` 中，通过判断 Model 上的 `query` 和 `id` 属性是否存在，来为 Model 实现具体的请求逻辑。

> 抽象类并不会真的给 Model 添加这些属性，我们仍需要手动在 Model 上定义，换句话说，我们不给 Model class 添加 `implements` 也是可行的，但那样会造成这些属性意义不明确，所以，必须手动标记一下 `implements`。

### 数据校验

在涉及 Model CRUD 操作时，往往少不了数据校验工作，目前常见的检验一般在组件层面，包括对一些组件库的校验规则传参、自己手动编写的校验步骤等。从本篇文章的目标出发，我们希望能够将数据校验逻辑封装在 Model 层面，高度聚合与 Model 相关的逻辑。同样也可以将其实现为装饰器：

```ts
// decorator for validate
type ValidateFn = (v: any, model: BaseModel) => boolean
function Validator(...validate: ValidateFn) { /* ... */ }

function Required(v: string) {
  return () => v?.trim()
}

function MinLength(min: number) {
  return (v: string) => v?.trim().length >= min
}

function MaxLength(max: number) {
  return (v: string) => v?.trim().length <= max
}

class BaseModel {
  /* ... */
  validate<T extends BaseModel>(this: T, field?: keyof T): Promise<boolean> { /* ... */ }
  /* ... */
}

class User extends BaseModel {
  @Validator(Required(), MinLength(6), MaxLength(16))
  name: string
}

const user = new User()
user.name = 'Jack'
user.validate() // Promise<true>
```

以上代码定义了一个装饰器 Validator，接受多个校验函数，Model 可以直接通过调用 validate 方法来进行数据校验。当 Model 实现校验功能时，通过编写针对组件库表单的 Adaptor，就可以将 Model 的校验逻辑与组件库的校验规则进行对接，从而实现 Model 的校验逻辑在组件库表单上的应用。

## 将他们结合起来

单看以上每一个功能实现都不算得特别有用，不过当将他们结合起来，或许更能体现它的优势所在。

**表单提交** 和 **表格渲染** 是两个最为常见的、数据与视图存在较强逻辑关联的场景，两个场景中的代码往往是逻辑相似的，却又难以进行抽象进而实现高度的代码复用，最后导致我们需要编写很多重复的代码，重复意味着 ugly-prone 和 unmaintainable-prone。

从以上思路出发尝试去编写两个场景下的代码逻辑。

定义几个 Model（FormItem 和 TableColumn 为新增装饰器，分别用来存储字段的表单项 和 表格列 的配置信息）：

```ts
// User.ts
@Model()
@CRUDDeriver('/users')
export class User extends BaseModel implements Entity {
  id: number
  @FormItem({ label: 'First Name', type: 'text' })
  @TableColumn()
  @Validator(Required(), MinLength(2), MaxLength(10))
  firstName: string
  @FormItem({ label: 'First Name', type: 'text' })
  @TableColumn()
  @Validator(Required(), MinLength(2), MaxLength(10))
  lastName: string
  @Field({
    transform: {
      onSerialize: (value: Dayjs) => v.format('YYYY-MM-DD'),
      onDeserialize: (v: string) =>  dayjs(v)
    }
  })
  @FormItem({ label: 'First Name', type: 'Date' })
  @TableColumn()
  @Validator(Required())
  birthday: Dayjs
  @FormItem({ label: 'First Name', type: 'password' })
  // ignore password when deserialize, because will never get password from backend
  @Field({ ignore: { onDeserialize: true } })
  password: string = ''
  @TableColumn()
  get age() {
    return dayjs().diff(this.birthday, 'year')
  }
  @TableColumn()
  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  static fromId(id: number) {
    const user = new User()
    user.id = id
    return user.get()
  }
}

export interface User extends CRUD<User> {}

class UserListQuery extends BaseModel {
  page: number = 1
  per: number = 10
  sortBy?: string
  sort: 'asc' | 'desc' = 'asc'
  filter?: string
  filterBy?: string
}

@Model()
@CRUDDeriver('/users')
export class UserList extends BaseModel implements Query {
  query: UserListQuery = new UserListQuery()
  items: User[] = []
  total: number = 0
}

export interface UserList extends CRUD<User> {}
```

User 对应单个用户，UserList 对应多个用户，并与后端用户列表接口相关联，在表单场景下可以这么使用：

```vue
<script setup lang="ts">
// using-case of form
const user = ref(new User())
// or
// const user = ref(User.fromId(1))
// user.get().then(u => user.value = u)

const submit = () => {
  user.value.validate().then((valid) => {
    if (valid) {
      return user.value.create()
      // or
      // return user.value.update()
    }
  })
}
</script>

<template>
  <model-form :model="user" @submit="submit" />
</template>
```

`<model-form />` 组件接受一个继承 BaseModel 的 Model 实例，这里是 User，组件内部通过获取 Model 上的 FormItem 装饰器信息，来渲染表单。同时，也可以通过获取 Validator 装饰器信息来控制验证逻辑，当提交动作发生时，手动调用 Model create 或 update 方法来实现提交请求。

在表格场景下可以这么使用：

```vue
<script setup lang="ts">
// using-case of table
const userList = ref(new UserList())

const change = () => {
  userList.value.get().then(_userList => userList.value.merge(_userList, ['items']))
}
</script>

<template>
  <model-table v-model:query="userList.query" :items="userList.items" @change="userList.get()" />
</template>
```

`<model-form />` 组件接受两个参数 query 和 items ，其中 query 可以进行双向绑定，使 userList.query 可以实时与表格组件的查询条件保持同步，当 query 发生变化时，会触发 change 事件，从而调用 userList.get() 方法来获取最新的数据。

> `<model-form />` 和 `<model-table />` 的逻辑实现并不复杂，本质就是获取 Model 上的 metadata 来控制不同的行为，这里就不作具体实现了。

以上 Model 与其对应组件结合使用的代码逻辑，体现出几个特点：

1. 组件代码变得更干净；
2. 与数据有关的逻辑代码都被抽象到了 Model 中，提高了接口与数据的代码聚合度；
3. 手动的数据处理代码（命令式的）变成可配置（声明式）的；
4. 重复代码大大减少，只需要维护具有差异性的代码。

在当项目体量逐渐变大时，以上优势和特点会更加明显。到现在，最开始的问题应该已经有答案了。

不过，这仍然有一些需要注意的地方。class 和 decorator 的结合使用，本质只解决两个问题：

1. 数据序列化和反序列化的处理；
2. 合理组织 View、Model、Entity 之间的代码逻辑。

针对第一点，并不是所有接口都需要 序列化/反序列化 操作，假设有一个接口用来上传文件，响应为**文件URL**，此时就不必对此定义一个 Model，单独调用接口或许更合理。

而第二点，它的实现本质是以 Model 为中心，将 View 和 Entity 与 Model 关联起来，借助强大的装饰器和元编程，减少重复逻辑的同时，将命令式代码转换为声明式代码，提高代码的可读性和可维护性。但并不是所有与 View 相关的 (View) Model 都存在与 Entity 或后端接口的关联，有些 Model 只是为了 View 而存在，它们更应该被编写在组件代码当中。

总之就是一点，保持克制，合理利用 class model，不要过度使用。

## 结语

当我刚接触 JS 时，它不完美，当然现在也不。对于使用它来进行大型现代项目开发，我一直持怀疑态度，不过最近几年，TypeScript 的出现、ES6+ （2015~2023）规范持续演进、装饰器提案的推进、还有刚刚进入 Stage1 的模式匹配提案，这些多少缓解了我这方面的顾虑。不过提案毕竟只是提案，距离它们落地还需要很长一段时间，而且也不是所有提案都会被采纳，继续观望吧。

我已将本文的具体实现代码上传到了 GitHub：[https://github.com/WayneWu98/power-coding](https://github.com/WayneWu98/power-coding)（欢迎 Star 和 PR）。

## 参考

- [typestack/class-transformer](https://github.com/typestack/class-transformer)
- [Typescript: Documentation - Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)