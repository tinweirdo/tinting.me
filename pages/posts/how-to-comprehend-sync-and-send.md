---
title: 如何理解 Rust 的 Sync 和 Send
date: 2023-02-17T10:52:40+08:00
category: Rust
---

[[toc]]

如果要在 Rust 进行并发编程，Sync 和 Send 一定是绕不过去的坎，这两个 trait 为线程与线程间内存同步的安全提供了保障，它们借助所有权以及生命周期机制，有效的防止了 Data Race 和 Race Condition。我在学习 Rust 并发编程的过程中，有很长一段时间被这两个 trait 所困扰，经过对大量文章/回答的阅读后，疑惑逐渐消散，以下文章是我对这两个 trait 的看法，并对几个 Rust 内置类型进行了解析。

## Sync 和 Send

Sync 和 Send 分别标识了一个值在多线程间可以 **共享访问** 和 **转移所有权**，在《The Rust Programming Language》这本书中，是这么解释的：

1. Send 表明可以一个值在多线程间安全的转移所有权；
2. Sync 表明可以在多个线程中共享一个值（通过不可变引用）。

在 Rust 中的绝大多类型都是 Send （**不是全部**），因为将它们的所有权转移到另一个线程中，意味着原来的线程和作用域内已经不再拥有这个值，此时也就只有一个线程在使用它，不会出现 Data Race 的情况。Rust 的绝大多数类型也都是 Sync 的，意味着在多线程中可以并发的通过不可变引用拿到一个值，即共享。

对于这两个 trait 有几个规律：

1. 如果 `T: Sync`，则 `&T: Send`。
2. 如果 `&mut T: Send`，则要求 `T: Send`；

第一点其实是一种双射，即相反也是成立的。如果一个值 `T: Sync` 可以在多线程间共享，各个线程需要通过不可变引用使用这个值，此时就要求它的引用 `&T: Send`，如果它的引用不能将自己的所有权转移，线程就不能引用到这个值。

第二点是针对在多线程间修改一个值（通过可变引用）的情况，它只要求类型 `T: Send`。在解释这一点之前，我们可以这么理解 Sync 和 Send：

1. Sync 类型在多线程中同时访问是安全的；
2. Send 类型只有在互斥的时刻内访问才是安全的。

Sync 的情况就不需要解释了。关于 Send，如果多个线程在同一时刻读一个值，而碰巧此时有一个线程在修改这个值，于是就会出现 Race Condition 和 Race Data，最后导致线程拿到的这个值有可能是错误的，即内存不同步了。而线程拿到 `&mut T` 意味着它可以对 `T` 进行修改，此时就不允许并发访问了，因为 `T` 以所有权移动到要使用的线程中，依靠 Rust 的所有权机制保证同一时刻只有一个线程持有 `&mut T`。

究竟 Sync 和 Send 有什么魔力，可以保证数据可以在线程间保持同步，是否可以为自定义类型手动实现 Sync 和 Send？

## 内存安全的决定因素

```rust
// std::marker
pub unsafe auto trait Sync {}
pub unsafe auto trait Send {}
```

以上是 Sync 和 Send 的内部实现，可以看到，它们只是一个标记 trait，并没有什么魔法真的让实现了该 trait 的数据在多线程间具有同步性。

真正决定数据是否可以 **安全地** 进行 **多线程同步和共享** 的是：它是否具有原子性，它的操作是否是原子操作，当这个数据类型保证了每个线程可以安全的修改和读取它所在的内存，Rust 就会给这个类型加上 Sync 或 Send 标记，通过借助这两个 trait，阻止你写出不安全的代码。即便数据真的可以在多线程间安全共享，但没有这两个 trait 实现，你仍然会被 Rust 编译器阻拦，这就是 Sync 和 Send 的意义。

Rust 为所有具有原子性的类型实现了 Send 和 Sync，同时，如果一个复合结构内部的所有成员都实现了 Send 或 Sync，那这个复合结构也会自动实现 Send 或 Sync，我们几乎不会去手动实现 Sync 和 Send，因为当你要给一个类型实现 Send 和 Sync 时，你必须保证它真的可以在多线程间安全同步和共享。Rust 在标准库向我们提供了 Arc、Mutex、RwLock 等可以进行多线程共享的类型，因而一般只有在开发第三方 lib 时可能会需要手动给类型实现 Sync 和 Send。（同时它们也是 unsafe 的，实现它们需要通过 unsafe impl，因为它们真的很危险。）

## Mutex 和 RwLock

两者都是为了并发编程而存在，通过对内存上锁，保证同一时刻只有一个内存访问（RwLock 只读时可以有多个），如果一个线程需要访问数据，需要对数据进行上锁，上锁期间其他线程无法访问该值，当线程使用完数据后释放锁，其他线程可以再次上锁对数据进行访问。这种机制意味着对数据的访问行为在时刻上是互斥的，因此保证了内存在多线程间的同步性。因此两者都实现了 Send 和 Sync，但这里要说的是对内部成员的 Send/Sync 约束。

```rust
unsafe impl<T: ?Sized + Send> Send for RwLock<T> {}
unsafe impl<T: ?Sized + Send + Sync> Sync for RwLock<T> {}

unsafe impl<T: ?Sized + Send> Send for Mutex<T> {}
unsafe impl<T: ?Sized + Send> Sync for Mutex<T> {}
```

RwLock 和 Mutex 都要求 `T: Send`，这很合理，因为它们具有内部可变性，可以对 `T` 进行修改，但为什么 RwLock 要求 `T: Sync`，而 Mutex 不需要呢？

RwLock 和 Mutex 两者最大的不同就是：RwLock 允许并发的读 `T`，而 Mutex 不允许。当多个线程需要同时读一个数据时，意味着这个数据是可共享的，即可以通过不可变引用同时取得数据，这本身要求 `T: Sync`；而 Mutex 保证了同一时刻只有一个 读/写 操作，多个线程同时读同一个数据根本不会发生，也就不需要数据实现 Sync 了。

## Rc 和 Arc

Rc 可以让一个数据拥有多个所有者，它通过内部的引用计数标识数据有多少个引用，当引用为 0 时，内存会得到释放。但它只能用于单线程中，因为它的引用计数修改操作不是原子操作，如果多个线程同时拥有，则内部的引用计数数据有可能并不等于实际拥有者的数量。

你也不可能转移它的所有权到另一个线程中，即 Rc 实现了 Send（实际没有实现），因为转移 `Rc::clone(&v)` 到另一个线程中相当于多个线程共享了同一个值。

```rust
unsafe impl<T: ?Sized + Sync + Send> Send for Arc<T> {}
unsafe impl<T: ?Sized + Sync + Send> Sync for Arc<T> {}
```

`Arc` 允许一个值在任意线程存在所有者，它的引用计数数据变更是原子操作，因此是线程安全的，它实现了 Send 和 Sync 很合理。同时，它还要求 T 实现 Send 和 Sync，Sync 很好理解，因为通过 Arc 我们可以并发获取 T 的引用，于是它要求 T 是可共享的。但 Arc 实际上只是对 T 的不可变引用，为什么还要求 T 实现 Send 呢？

首先，Arc 拥有着 T 的所有权，同时 T 不会因为 Arc 离开作用域 drop 之后被自动销毁（释放），真正使 T 被销毁的条件只有一个，就是**已经没有对 T 的引用了**，即 Arc 的引用记数为 0，此时对 T 的释放只能交由 Arc 进行（通过 Drop trait），而 Rust 的 drop 实现是变量的所有权离开作用域，因此 Arc 需要调用 `drop` 对 T 进行移动，而这个移动操作可能发生在任何一个线程中。

## Cell 和 RefCell

```rust
unsafe impl<T: ?Sized> Send for RefCell<T> where T: Send {}
impl<T: ?Sized> !Sync for RefCell<T> {}

unsafe impl<T: ?Sized> Send for Cell<T> where T: Send {}
impl<T: ?Sized> !Sync for Cell<T> {}
```

这两个类型让不可变的数据拥有内部可变性，通过和 Arc/Rc 的配合，可以使得一个数据拥有多个所有者的同时可以修改内部数据。Rust 给它们实现了 Send 但移除了 Sync，因为如果线程拿到它们的不可变引用却可以修改内部的数据，这样会出现 Race Data。如果只是将它移动到另一个线程中，保证只有一个线程拥有 Cell/RefCell，这样也就不会有问题了（前提是他内部包含的 `T` 实现了 Send）。

## 结语

所有权和生命周期机制在 Rust 中是重中之重，两者为内存安全保驾护航，联合 Sync 和 Send，很大程度上阻止了开发者写出不安全的代码。但这种新概念多少都加重了理解成本，这不是坏事，只是让我在理解的过程中感到头大😵，所幸经过不短的一段时间思考后，对 Sync 和 Send 这两个 trait 有了较为清晰的理解。

## 参考

- https://course.rs/advance/concurrency-with-threads/send-sync.html
- https://doc.rust-lang.org/std/marker/trait.Sync.html
- https://doc.rust-lang.org/std/marker/trait.Send.html
- https://doc.rust-lang.org/book/ch16-04-extensible-concurrency-sync-and-send.html
- https://www.reddit.com/r/rust/comments/9elom2/why_does_implt_send_for_mut_t_require_t_send/