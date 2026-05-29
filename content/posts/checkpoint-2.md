---
title: "Checkpoint 3"
date: '2022-07-08'
slug: checkpoint-2
aliases:
  - /2022/07/08/checkpoint-2/
tags:
  - 100daysofswiftui
  - checkpoint
  - code
---

```swift
 /*
 If it’s a multiple of 3, print “Fizz”
 If it’s a multiple of 5, print “Buzz”
 If it’s a multiple of 3 and 5, print “FizzBuzz”
 Otherwise, just print the number.
 */

for i in 1...100 {

    let isMultOfThree = (i % 3 == 0)
    let isMultOfFive = (i % 5 == 0)

    if (isMultOfFive && isMultOfThree) {
        print("FizzBuzz")
    } else if isMultOfThree {
        print("Fizz")
    } else if isMultOfFive {
        print("Buzz")
    } else {
        print(i)
    }
}
```
