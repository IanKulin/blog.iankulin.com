---
title: "Using Swift's map"
date: '2022-10-13'
slug: using-swifts-map
aliases:
  - /2022/10/13/using-swifts-map/
tags:
  - code
  - possibly-useful
  - swift-language
  - swift5-6
  - swift5-7
---

!["map, moon, transformation" - Stable Diffusion](/images/untitled-2.jpg)

In [Day 39'](https://www.hackingwithswift.com/100/swiftui/39)s Moonshot tutorial app, Paul uses [`.map`](https://developer.apple.com/documentation/swift/array/map\(_:\)-87c4d) on an array without much comment about what's going on. I assume this might be a common concept in modern languages, but it was new to me.

First, here's Paul's code

```swift
    init(mission: Mission, astronauts: [String: Astronaut]) {
        self.mission = mission

        self.crew = mission.crew.map { member in
            if let astronaut = astronauts[member.name] {
                return CrewMember(role: member.role, astronaut: astronaut)
            } else {
                fatalError("Missing \(member.name)")
            }
        }
    }
```

`Mission` here contains an array of `crew` which is a struct with two strings, one of them being `name`, but `self.crew` (which belongs to the view we're in) is an array of `CrewMember` which is a struct with a `role: String` and another struct `astronaut`. That sounds confusing, but essentially, an array of one type is being processed to return an array of another type where there's a 1:1 relationship between the elements of each array.

That's what `map` does - it works through a collection, and uses the code in a closure to act on each element to transform it, then adds it to the array to be returned.

Let me try to make it clearer with a simpler example. Time to open a Playground. Let's map an array of integers into an array of strings:

```
let intArray = [0, 55, 21, 13]
var stringArray = [String]()

stringArray = intArray.map{ "\($0)"}

print(stringArray)
// ["0", "55", "21", "13"]
```

$0 is a stand in for each element. This is a common Swift feature but this variable can be named for clarity if desired:

```
let intArray = [0, 55, 21, 13]
var stringArray = [String]()

stringArray = intArray.map{ number in "\(number)"}

print(stringArray)
// ["0", "55", "21", "13"]
```

If we didn't have map, we could do it the long way, something like this.

```
let intArray = [0, 55, 21, 13]
var stringArray = [String]()

intArray.forEach {
    stringArray.append("\($0)")
}

print(stringArray)
// ["0", "55", "21", "13"]
```

or, going back even further in time:

```
let intArray = [0, 55, 21, 13]
var stringArray = [String]()

for number in intArray {
    stringArray.append("\(number)")
}

print(stringArray)
// ["0", "55", "21", "13"]
```

So the .map method on a sequence returns an array of values built by applying to the passed closure to each element of the sequence.

Paul's code at the top steps through the mission.crew array which contains the crews names as strings, then attempts to look them up in the astronauts dictionary. If it finds them, it adds them (as a struct) to the crew array.
