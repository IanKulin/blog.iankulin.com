---
title: "Learning Retention"
date: '2022-07-14'
slug: learning-retention
aliases:
  - /2022/07/14/learning-retention/
tags:
  - code
  - learning
  - posts
---

In order to have something to put up on GitHub (as part of working all that out) I went back to re-write the Checkpoint 2 code that I'd written, but not saved, three or four days ago.

The task was to count the unique elements in an array. The teaching had been about the complex data types, so clearly the hint was to cast the array to a set. Although the idea of sets is new to me this year, I've come across them twice. Once in the 100 days course (the same day as having to write this code) and once from a few days earlier from a [podcast episode](https://firesideswift.fireside.fm/157). This is high quality learning - getting the same topic a couple of different ways a few days apart, then having to use the information for real.

```
/*
 This time the challenge is to create an array of strings, then write some code that prints the number of items in the array and also the number of unique items in the array.
 */

let strArray = ["one", "two", "one", "three"]
let strSet = Set(strArray)
print("Array size:\(strArray.count) unique count:\(strSet.count)")
```
