---
title: "Checkpoint 9"
date: '2022-08-20'
slug: checkpoint-9
aliases:
  - /2022/08/20/checkpoint-9/
tags:
  - 100daysofswiftui
  - checkpoint
  - code
  - posts
---

{{< youtube -JmAbcISEmY >}}

/\*
Your challenge is this: write a function that accepts an 
  optional array of integers, and returns one randomly. 
  If the array is missing or empty, return a random number 
  in the range 1 through 100.

If that sounds easy, it’s because I haven’t explained 
  the catch yet: I want you to write your function in a 
  single line of code. No, that doesn’t mean you should 
  just write lots of code then remove all the line breaks 
  – you should be able to write this whole thing in one 
  line of code.

https://www.hackingwithswift.com/quick-start/beginners/checkpoint-9

\*/

func randomInt(\_ numbers:\[Int\]?) -> Int { numbers?.randomElement() ?? Int.random(in:1...100) }

print(randomInt(nil))
print(randomInt(\[2,5\]))
