---
title: "Bump One"
date: '2022-08-01'
slug: bump-one
aliases:
  - /2022/08/01/bump-one/
tags:
  - posts
  - swift-language
---

Most of the things I’ve learned so far have been familiar, interesting, or cool - but now I’ve ventured far enough into the Swift Language Programming book to find something that is definitely going to take a couple of readings to piece together.

I was surprised, then pleased with functions as first class types, and the idea of passing closures around is powerful and useful.

My current difficulty is getting my head around closures capturing variables. It was tolerable (but not safe) when I just thought of it as a pointer, but when turned out the captured variable continues to exist in some sort of zombie state even after the scope where the variable was contained has ended.

To go back a bit, nested functions have access to the variables declared in the scope they are nested in.  

```
func someFunction(){
    var someInt = 4
    nestedFunction()
    print(someInt)
    
    func nestedFunction(){
        someInt += 1
    }
}
```

I don’t approve of this. It has a global variable flavour. For most purposes I’d rather pass and return the values so the intent is all contained. Nevertheless, I can see it’s a valid approach that might be useful.

I can’t explain the next bit any better than the Swift book, so here’s it’s opening on [Capturing Values](https://docs.swift.org/swift-book/LanguageGuide/Closures.html):

![](/images/34d3cb1a-730f-4afb-aee3-9c147dd3fabe.jpeg)

Here’s my slight edit to the code from the book to get it to print out the incrementing values. This prints ”10” and ”20” to the console.

```
func makeIncrementer(forIncrement amount: Int) -> () -> Int {
    var runningTotal = 0
    func incrementer() -> Int {
        runningTotal += amount
        return runningTotal
    }
    return incrementer
}

let incrementByTen = makeIncrementer(forIncrement: 10)
print(incrementByTen())
print(incrementByTen())
```

So, makeIncrementer returns its nested incrementing function which has “captured” the runningTotal variable. The scope that runningTotal lives in has gone (when makeIncrementer finished) but runningTotal is still alive. I assume that this deep magic is made possible by our friend Automatic Reference Counting. This variable capture in closures seems like a weapon that needs wielded with great care.
