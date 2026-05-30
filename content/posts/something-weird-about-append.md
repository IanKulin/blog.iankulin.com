---
title: "Something weird  'append"
date: '2022-11-21'
slug: something-weird-about-append
aliases:
  - /2022/11/21/something-weird-about-append/
tags:
  - debugging
  - posts
  - swift5-7
  - swiftui
  - xcode14-1
---

I'm noodling around making sure I understand how Core Data works. Thought I'd start with a master/detail app with an array of structs, then replicate it in a Core Data implementation. I'm using an array of this struct for my data:

```swift
struct Garden {
    var id = UUID()
    var name = ""
    var address = ""
    var plants: [Plant] = []
}
```

And I thought this code to load up some sample data was pretty sweet.

```swift
Button("Sample Data") {
    var someGarden = Garden()
    someGarden.name = "White Lodge"
    someGarden.address = "72 Anderson Street, \nRothwell QLD 4022"
    gardens.append(someGarden)
    someGarden.name = "Gordon Terrace"
    someGarden.address = "95 Learmouth Street\nTahara Vic 3301"
    gardens.append(someGarden)
    someGarden.name = "Powlett Cottage"
    someGarden.address = "11 Bayfield Street\nWhite Beach Tas 7184"
    gardens.append(someGarden)
    someGarden.name = "Adams Garden"
    someGarden.address = "71 Swanston Street\nKanya Vic 3381"
    gardens.append(someGarden)
}
```

But, no. This is what happens:

![](/images/screen-shot-2022-11-18-at-7.00.49-pm.png)

The reason I thought this was okay was that structs are value types in Swift. When I pass a struct in a function or method, it's actually a copy at the other end. I could prove this by mutating the array copy and checking the original.

```swift
Button("Sample Data") {
    var someGarden = Garden()
    someGarden.name = "White Lodge"
    someGarden.address = "72 Anderson Street, \nRothwell QLD 4022"
    gardens.append(someGarden)
    gardens[0].name = "Mutated"
    print("Array: \(gardens[0].name)")
    print("Local: \(someGarden.name)")
}
```

Prints:

```bash
Array: Mutated
Local: White Lodge
```

So clearly I do understand structs/reference types correctly. They are different structs. Also, if structs were somehow reference types, they should have all had the data from the last garden, not the first one.

You'd might be thinking (as I did), perhaps the error is in the view code. That's easily checked. I forced the second one by creating a new struct, it works correctly and is in the correct position so clearly the view code is working.

![](/images/screen-shot-2022-11-18-at-7.18.59-pm.png)

The code mutating someGarden is getting run, so it's not like the compiler's eliminated those lines somehow. Also it is getting the number of entries correct - they are just somehow linking back to the first entry.

![](/images/screen-shot-2022-11-18-at-7.31.44-pm.png)

It seems impossible! This is always the way with good bugs.

I'm almost tempted to ask for help.

Before one does that, it's always a good idea to boil things down to the essence of the problem. Playgrounds is an excellent tool for such an endeavor. I just need the simplest version of an array of structs. Here's what I came up with:

```swift
import Foundation

struct Animal {
    var name: String = ""
}

var animals: [Animal] = []

var animal1 = Animal()
animal1.name = "Cat"
animals.append(animal1)
animal1.name = "Dog"
animals.append(animal1)

print(animals)
```

Produces the output:

```bash
[Page_Contents.Animal(name: "Cat"), Page_Contents.Animal(name: "Dog")]
```

Grrr. It turns out Swift works perfectly.

In the screenshot above, where I've broken on line 52, I couldn't actually see how to inspect the gardens array. Perhaps I'd be better with the classic print() debugging instead.

```bash
[
    DataDemo.Garden(
        id: 0725A8FC-D410-4A2C-B925-C34340F25B05, name: "White Lodge", address: "72 Anderson Street, \nRothwell QLD 4022", plants: []
        ), 
    DataDemo.Garden(
        id: CF30FA66-A2F2-44FB-A6E0-A22E93492578, name: "Gordon Terrace", address: "95 Learmouth Street\nTahara Vic 3301", plants: []
        ), 
    DataDemo.Garden(
        id: 0725A8FC-D410-4A2C-B925-C34340F25B05, name: "Powlett Cottage", address: "11 Bayfield Street\nWhite Beach Tas 7184", plants: []
        ), 
    DataDemo.Garden(
        id: 0725A8FC-D410-4A2C-B925-C34340F25B05, name: "Adams Garden", address: "71 Swanston Street\nKanya Vic 3381", plants: []
        )
]
```

Okay, so the bug I've been trying to fix, is not the bug at all. The array is working exactly as intended, it's my view that's the issue somehow.

![](/images/screen-shot-2022-11-18-at-7.18.59-pm-1.png)

And it's not just a general problem with the view - it's a problem with the view that goes away if I create a new Garden struct instead of recycling one... Simultaneously I have these two thoughts:

-   When I create a new struct, it gets a fresh UUID
-   What was that console spam message I've been ignoring? Oh yeah, it was `ForEach, UUID, HStack>>: the ID 0725A8FC-D410-4A2C-B925-C34340F25B05 occurs multiple times within the collection, this will give undefined results!`

You can guess the rest, my ForEach is using the UUID:

```swift
List {
    ForEach(gardens, id: \.id) {garden in
        HStack {
            Text(garden.name)
            Spacer()
            Text(garden.address)
        }
    }
}
```

If I fix the ids:

![](/images/screen-shot-2022-11-18-at-8.16.17-pm.png)

And that's how you waste a hour fixing a bug the framework warned you about in the first five minutes.
