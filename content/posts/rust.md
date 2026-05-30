---
title: "Rust"
date: '2022-08-12'
slug: rust
aliases:
  - /2022/08/12/rust/
tags:
  - posts
  - rust
  - swift-language
---

<img src="/images/rustmemelovetriangle_297886754.jpg" width="375" alt="">

It's been exciting to see some of the modern language features in Swift - it's a real joy to work in when I think back to my C++ days which was some of the last commercial programming I did.

The buzz about Carbon got me wondering about other new languages and what might be going on with them. Rust seems to keep popping up in conversations so I thought I'd have a quick look.

{{< youtube br3GIIQeefY >}}

Also read [A half-hour to learn Rust](https://fasterthanli.me/articles/a-half-hour-to-learn-rust) and [A Swift Guide to Rust](https://faq.sealedabstract.com/rust/)

Those optionals, type inference, type safety, and exhaustive switch/match statements sure look familiar. Ranges too, and although the infinite range looks cool I'm not sure of the use-case.

Blocks evaluating to a result is cute. This is allowed:

```swift
let x = {
    let y = 1; // first statement
    let z = 2; // second statement
    y + z // this is the \*tail\* - what the whole block will evaluate to
};
```

Notice the missing semicolon - that's sugar for the 'return' that would be otherwise needed. Perhaps only from habit, I do miss the semicolons when writing Swift. I'm sure I'll get used to it, but currently I start to feel uncomfortable when spreading an expression out over multiple lines (for clarity) and just expecting LVM to figure it all out.

```swift
            Button("Toggle Light", action: {
                light.toggle()}
            )
            .padding()
            .font(.title)
            .foregroundColor(.white)
            .background(Color.accentColor)
            .cornerRadius(10)
            .padding()
            Spacer()
```

Underscore as a "throwaway" value turns up, but in the guise of default for the match statement.

Variable bindings, by default (with 'let') are immutable in Rust, but can be marked as 'let mut' to make them fully variable, as with Swift's 'var'.

Rust has "traits", which currently my knowledge of Swift can't do justice to a compare and contrast, but it definitely has a superclassy feel - like protocols and extensions.

They both have closures, but again, I'm getting out of my current depth on Swift to make any worthwhile comment.

I do enjoy about Swift how clear it is to read, from what I've seen of Rust, that's not so much the case there, I guess there's some other trade off involved.
