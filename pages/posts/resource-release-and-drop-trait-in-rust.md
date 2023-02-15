---
title: Rust 中的资源释放以及 Drop trait
date: 2023-02-15T10:52:40+08:00
category: Rust
---

[[toc]]

在 C 语言中，内存资源需要手动管理，如果一份资源已经不再使用了，则需要手动调用 `free` 对相关内存资源进行释放，否则，将会导致内存泄漏。而在一些提供了垃圾回收机制（GC，Garbage Collection）的语言中，如果堆内存的某个对象在栈内存中已经不存在引用了，则该堆内存会自动进行释放。

一般来说，栈内存所分配的资源会随着其所在调用栈被弹出时被释放，该过程由计算机系统及 CPU 统一管理。如果某个栈内存中持有堆内存的指针（或引用），当栈弹出时，其所对应的堆内存也应该被释放；如果内存对象持有系统资源，当对象销毁时，其所持有的系统资源也应该被释放，从而使得操作系统可以对该内存区域以及相关系统资源进行再次分配。

## 资源释放

Rust 没有 GC 机制，但也不需要我们手动进行内存管理，这依靠其所有权机制以及 Drop trait。

```rust
pub trait Drop {
    fn drop(&mut self);
}
```

Drop trait 只有一个方法 `drop`，它规定了变量在离开作用域时的收尾工作（资源释放）如何进行。当变量离开所有权所在的作用域时，该变量会自动调用 `Drop::drop`。Rust 为几乎所有内置类型都实现了 Drop trait，而对于自定义类型（结构体、枚举），Rust 会自动对其内部字段调用 `Drop::drop`，因此在程序编写时，我们很少去为类型手动实现 Drop trait。只有当一个对象持有 Rust 无法自动释放的资源时（文件描述符、网络 Socket 等），我们才需要手动实现 Drop trait，绝大多数情况都不需要手动实现，因为根本就没什么资源需要手动释放。

`Drop::drop` 和其他编程语言的 **构造函数**、**析构函数** 非常相似，因为 Drop trait 本质上是一种 RAII 实现，只不过只有析构函数。

> [RAII](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization) 规定了一个对象在创建时自动调用构造函数，在销毁时自动调用析构函数，也就是说，构造函数实现了对象创建时的资源分配，析构函数完成对象销毁时的资源释放。

## 手动释放

手动调用类型的 `Drop::drop` 方法是非法的，它只提供给 Rust 在变量真的走出作用域时进行自动调用，因为 `Drop::drop` 只是一种通用的编程概念（RAII），不应该手动调用，在命令行运行 `rustc --explain E0040` 可以得到相关解释。

Rust 在 prelude 中提供了 `drop` 函数以供我们手动释放不需要的变量和内存，该函数的内部实现为：

```rust
pub fn drop<T>(_x: T) {}
```

搞什么，它只是个空函数！！！它的确是一个没有任何逻辑实现的空函数。它实际上是通过移动变量的所有权实现的内存自动释放。参考下面的代码：

```rust
let b = Box::new(1);
drop(b);

println!("{:?}", b); // 这里将报错
```

当调用 `drop(b)` 时，b 的所有权被移动到 `drop` 函数中，当 `drop` 函数调用完毕，b 已经离开了作用域，它将会被自动销毁（`Drop::drop` 将被自动调用），因为 b 的所有权已经移动了，后续再使用将会报错。

> Rust 团队对 `drop` 的实现过于惊人。

## Copy 和 Drop 互斥

在标准库文档中关于两者互斥的描述：

> You cannot implement both Copy and Drop on the same type. Types that are Copy get implicitly duplicated by the compiler, making it very hard to predict when, and how often destructors will be executed. As such, these types cannot have destructors.
>
> 你不能在同一类型上同时实现 Copy 和 Drop。Copy 类型被编译器隐式复制，这使得很难预测何时以及将执行析构函数的频率。因此，这些类型不能有析构函数。

在 Rust 实现中，Copy trait 只是一种标记 trait，内部不存在任何逻辑实现，仅仅是告诉编译器：实现了 Copy trait 的类型可以浅拷贝。这个标记导致浅拷贝行为覆盖了所有权转移行为，如果一个实现了 Drop trait 的类型同时也允许浅拷贝，该类型持有文件描述符，当其离开作用域时会关闭该文件描述符，当该类型的变量作为函数参数或其他情况发生浅拷贝时，会有多个值同时持有同一个资源（文件描述符），你无法预测它们离开作用域的规律，而当它们真的要离开作用域时，`Drop::drop` 被多次调用，此时资源被重复释放（文件描述符被重复关闭），最后导致难以预测的问题。

## 结语

Rust 的所有权机制让我们无需管理内存，也不用担心发生内存泄漏，而 Drop trait 提供了我们释放系统资源的的手段，只需要为类型实现 Drop trait，后续资源都会跟随变量被销毁自动进行释放。而手动释放内存资源 `drop` 的实现，由于所有权机制的存在，保证了释放之后的变量不会被再次使用。这些都降低了我们对于资源管理的心理负担，保证了程序的可靠性。