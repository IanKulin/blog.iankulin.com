---
title: "Int.times()"
date: '2022-08-27'
slug: int-times
aliases:
  - /2022/08/27/int-times/
tags:
  - posts
  - stack-overflow
  - swift-language
---

When writing [yesterday's post](/the-_-underscore/) about iterating through a range or collection and using the underscore to throw away the item, I had in the back of my mind that there should be a more straightforward way of doing something a number of times.

Just to re-iterate (lol), here's the issue. If we want to print "Here's the thing" three times, in Swift the simplest we can do is:

for \_ in 1...3 {
    print("Here's the thing")
}

I had the idea, that this should really be a method of the Int type. And in fact I could write it as an extension that took a closure. Then we could just do this:

3.times {
    print("Here's the thing")
}

That feels much more like the Swift way of doing things (although I probably picked it up during a brief flirtation with Ruby). Of course, I'd implement it with a while loop and a counter, so there'd still be the counter memory allocated, but only for an Int rather than the Array element type.

With this system, the problem I was talking about yesterday:

let thingStrings = \["Thing one", "Thing two", "Thing three"\]

for \_ in thingStrings {
    print("Here's the thing")
}

would become:

let thingStrings = \["Thing one", "Thing two", "Thing three"\]

thingStrings.count.times {
    print("Here's the thing")
}

Which is, I admit, not amazingly better, but better, especially if the compiler is allocating the memory and filling it with each array value in the first example (which I don't know if it is, but am increasingly interested in finding out).

Feeling pretty pleased with myself for inventing this new Int method, I had a extra thought that in fact, the Swift community may already of invented this and incorporated it in the language, so I should google it first. It turns out it's not aprt of the official language, but neither (unsurprisingly) am I the first to think of it.

There's a [Stack Overflow answer](https://stackoverflow.com/questions/30554013/what-is-the-shortest-way-to-run-same-code-n-times-in-swift) to a question "What is the shortest way to run same code n times in Swift?"

[![](/images/screen-shot-2022-08-20-at-3.12.32-pm.png)](https://stackoverflow.com/questions/30554013/what-is-the-shortest-way-to-run-same-code-n-times-in-swift)

So shout out to [Matteo Piombo](https://stackoverflow.com/users/4358829/matteo-piombo) for doing the work for my idea seven years before I had it! It's still just for code clarity, but great use of extensions and closures.

I still maintain that `for _ in` is not great, and that `for each in` where each was a synonym for the underscore would be the prettiest solution. A likely con of this proposal is that is would be a code breaking change for any code that has already uses `for each` which could be quite common.
