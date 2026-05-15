---
title: "Chris Lattner"
date: '2022-08-03'
slug: chris-lattner
aliases:
  - /2022/08/03/chris-lattner/
tags:
  - chris-lattner
  - posts
  - swift-language
---

Thank you YouTube algorithm for this recommendation - Chris Lattner, the main author of Swift (amongst other things including LVM) chatting with Lex Fridman. Ignore the clickbait title. There is a good, brief discussion about the tradeoffs in value vs references types which is a topic I've been thinking a bit about this week.

Also some interesting comments about how a language delivers it's complexity. Chris gives the funny example of what "hello world" looks like in Swift vs C++. Here's Swift: `Print("Hello world")`, here's C++:

```
#include <iostream>

int main() {
    std::cout << "Hello World!";
    return 0;
}
```

Especially when part of my interest is in exciting kids in programming, that's a stark difference. Swift does go on to do the hard things - it's used for native apps and has some of the great modern language features, but the simple things are easy. I am very happy with the idea of Swift (especially plus Playgrounds) being a smooth introduction to coding. Less so with SwiftUI - that gets complicated quickly when things go wrong.

{{< youtube UTFFR61xVbs >}}
