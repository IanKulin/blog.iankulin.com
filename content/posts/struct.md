---
title: "struct"
date: '2022-07-18'
slug: struct
aliases:
  - /2022/07/18/struct/
tags:
  - 100daysofswiftui
  - posts
  - struct
  - swift-language
---

Started on [Day 10 of 100 days of etc etc](https://www.hackingwithswift.com/100/swiftui/10) today which is about structs. It was immediately clear when I first started looking at Swift and Swift UI that structs were going to be a big deal. I am used to structs being able to contain a collection of other types, but not methods. So I was confused at why tuples existed; that is now cleared up.

If structs can have methods as well as properties, it answers the question of why tuples exist, but immediately asks the question, why have classes since structs have all this power? I already know (from my podcast consumption) one of the answers for this is that structs are value types rather than references. When you:

```swift
let someConstant = someClass
```

someConstant now contains a copy of the pointer to someClass, as opposed to making a copy as similar code would do for a struct. So this code:

```swift
struct SomeStruct {
    var counter: Int = 0
}

var structInstance = SomeStruct()
var someOtherStruct = structInstance

print("structInstance:\(structInstance.counter)")
print("someOtherStruct:\(someOtherStruct.counter)")

someOtherStruct.counter += 1

print("structInstance:\(structInstance.counter)")
print("someOtherStruct:\(someOtherStruct.counter)")

print("")

class SomeClass {
    var counter: Int = 0
}

var classInstance = SomeClass()
var someOtherClass = classInstance

print("classInstance:\(classInstance.counter)")
print("someOtherClass:\(someOtherClass.counter)")

someOtherClass.counter += 1

print("classInstance:\(classInstance.counter)")
print("someOtherClass:\(someOtherClass.counter)")
```

Produces the output:

```bash
structInstance:0
someOtherStruct:0
structInstance:0
someOtherStruct:1

classInstance:0
someOtherClass:0
classInstance:1
someOtherClass:1
```

The sample code for the Hello World app in playgrounds ONLY contains structs. The app is a struct, containing a view which is a struct. That's basically all there is, so clearly structs are going to be a big deal.
