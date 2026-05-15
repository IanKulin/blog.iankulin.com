---
title: "Retain Cycle"
date: '2022-08-02'
slug: retain-cycle
aliases:
  - /2022/08/02/retain-cycle/
tags:
  - memory
  - posts
  - swift-language
---

Variables and constants in Swift can be a _value type_ (their data is copied when they are copied) or a _reference type_ (a pointer to the data is passed when they are copied.

Structs, integers, and enums are value types, classes are reference types.

Memory management of value types is relatively straightforward - there’s a 1:1 relationship between the variable name and its data, so if the variable goes out of scope it can get the chop. With reference types, it’s possible to have several variables (or class or struct properties etc) all pointing to the data, so a more sophisticated system is needed to know when it’s safe to delete the data.  

In Swift (and some other languages), this memory management is done by Automatic Reference Counting ARC. The compiler inserts code that keeps track of what references exist in scope that point to the data in memory that could potentially be freed. When there are zero references exisiting for an object, it can be freed. Here’s an example, meet SomeClass:

```
class SomeClass{
    var name: String = ""
    var otherClass: SomeClass?
    
    init(name: String){
        self.name = name
        otherClass = nil
        print("init")
    }
    deinit{print("deinit")}
}
```

This class has a couple of properties; a name and a link to another object of the same class. The **init** and **deinit** methods are called at creation and destruction. I’ve added **print()** so we can see them.

```
func classCreationFunction(){
    print("start")
    var class1 = SomeClass(name: "class1")
    var class2 = SomeClass(name: "class2")
    class1.otherClass = class2
    print("end")
}
```

If we run this function, the output will be:

```
start
init
init
end
deinit
deinit
```

Two instances created, two released. All this is done for us (the Automatic in ARC), when I was programming in Delphi, it was often the responsibility of the programmer to explicitly deal with this problem.

A potential problem with ARC is _retain cycles_. A retain cycle is where objects (or often a chain of objects) hold references to each other. We’re done with the objects, but because they are holding the references to each other, the references have not been counted down to zero, and therefore ARC does not kill them off. In classCreationFunction above, one instance has a reference to another, and ARC cleans them both up.

What happens if we have each instance hold a reference to each other? Something like this:

```
func classCreationFunction(){
    print("start")
    var class1 = SomeClass(name: "class1")
    var class2 = SomeClass(name: "class2")
    class1.otherClass = class2
    class2.otherClass = class1
    print("end")
}
```

The output of this is:

```
start
init
init
end
```

Two instances of SomeClass created, none destroyed.
