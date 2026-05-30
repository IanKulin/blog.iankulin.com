---
title: "The _ Underscore"
date: '2022-08-26'
slug: the-_-underscore
aliases:
  - /2022/08/26/the-_-underscore/
tags:
  - posts
  - swift-language
---

<a href="https://en.wikipedia.org/wiki/The_Undertaker"><img src="/images/undertaker_with_fire.jpg" width="84" alt=""></a>

I've learned (so far) an underscore can be used for a couple of things in Swift, both of them loosely translating to "doesn't really matter".

The first is in a parameter name for a function. Swift has a very cool feature I haven't seen before where an argument can have a different internal and external name. As usual, this will make more sense in code. Imagine this:

```swift
func sumNumbers(firstNumber: Int, secondNumber: Int) -> Int {
    return firstNumber + secondNumber
}

let sum = sumNumbers(firstNumber: 5, secondNumber: 3 )
```

Using the magic of internal and external parameter names, we can make the function call read a bit better. The external parameter name goes first and is separated from the internal name by a space.

```swift
func sumNumbers(numbers firstNumber: Int, and secondNumber: Int) -> Int {
    return firstNumber + secondNumber
}

let sum = sumNumbers(numbers: 5, and: 3 )
```

That makes the function call a little clearer, but we can go one better by making the external name of the first parameter optional using the underscore:

```swift
func sumNumbers(\_ firstNumber: Int, and secondNumber: Int) -> Int {
    return firstNumber + secondNumber
}

let sum = sumNumbers(5, and: 3 )
```

So that's the first use - to make a parameter of a function unnamed in the call.

The second is in loops where we don't care about the item we're extracting. Normally we want to do something with each item in a collection we're iterating through. For example, we might want to print each string in an array:

```swift
let thingStrings = \["Thing one", "Thing two", "Thing three"\]

for thing in thingStrings {
    print(thing)
}
```

But what if we didn't? Perhaps this is what we're doing:

```swift
let thingStrings = \["Thing one", "Thing two", "Thing three"\]

for thing in thingStrings {
    print("Here's the thing")
}
```

We've sort of created a variable for no purpose - it's not referenced. If that's our intention, it would be better to have the compiler know that so if we inadvertently use it, it would warn us. The underscore comes to help with this, we can just:

```swift
let thingStrings = \["Thing one", "Thing two", "Thing three"\]

for \_ in thingStrings {
    print("Here's the thing")
}
```

I have no idea if this results in better binary code - ie if LVM was reserving memory for `thing` in the previous example. Knowing Chris Lattner, it probably is smarter than that.

Although one quickly gets used to reading code like the above example, I don't really like this use of the underscore. The code does not read well, it's not Swifty enough. I'd probably say:

```swift
let thingStrings = \["Thing one", "Thing two", "Thing three"\]

for eachThing in thingStrings {
    print("Here's the thing")
}
```

Thinking about this today whilst driving back from shopping, I hit on the idea there should be a reserved word "each" to achieve the same purpose as the underscore, but perhaps the code above is as good as we can get. It will do until I find out if LVM is optimising it away. ([Paul says, obliquely, it is not](https://www.hackingwithswift.com/sixty/4/1/for-loops))

I'm not forgetting about the .forEach method on arrays. But that has the same issue - it forces me to name (or underscore) the variable to hold the value we're iterating past.

```swift
let thingStrings = \["Thing one", "Thing two", "Thing three"\]

thingStrings.forEach { \_ in
    print("Here's the thing")
}
```
