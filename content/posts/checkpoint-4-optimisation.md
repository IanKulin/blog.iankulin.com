---
title: "Checkpoint 4 optimisation"
date: '2022-07-13'
slug: checkpoint-4-optimisation
aliases:
  - /2022/07/13/checkpoint-4-optimisation/
tags:
  - checkpoint
  - code
  - posts
---

The [Checkpoint 4](https://www.hackingwithswift.com/quick-start/beginners/checkpoint-4) task was to find an integer square root of numbers up to 10000. My [first pass solution](/checkpoint-4/) was:

```swift
func calculateIntSqrt(_ number:Int) throws -> Int  {
    let lowerBound = 1
    let upperBound = 10_000
    if number < lowerBound {throw IntSqrtError.low}
    if number > upperBound {throw IntSqrtError.high}
    // brute force sqrt finder
    for i in lowerBound...number {
        if i*i == number {
            return i
        }
    }
    // none found or we would have returned by now
    throw IntSqrtError.noIntRoot
}
```

Although not coded for speed, there are a couple of subtle optimisations here; the first is that it gives up once it gets to the number instead of going up to the end (it assumes the square root of a number can't be greater than the number), and the second is that it counts up from the bottom rather than down from the top - I'm assuming the bottom of the range is richer in square roots than the top.

This code works fine (there was no discernible time difference between 4 and 9999) and meets the specification, so I wouldn't want to bill the client for any further work, or to make the code uglier. Obviously however, it does spark the question of what I'd do if the function had to work over a much larger range. When I altered it to allow maxInt and passed 1,000,000,000 to it, it took just under four minutes to find in Playgrounds on an M1 MacBook.

It's possible a good mathematics student would know some good tricks for calculating square roots, the first couple of links I googled suggested a method of looking for multiples that themselves were squares. While that's a viable strategy mentally, and for reasonable size numbers, it didn't lend itself to being coded. So I guess the computer science guys would pull out the binary search.

```swift
func calculateIntSqrt(_ number:Int) throws -> Int  {
    var lowerBound = 1
    var upperBound = 2_147_483_646
    if number < lowerBound {throw IntSqrtError.low}
    if number > upperBound {throw IntSqrtError.high}
    
    var guess: Int
    var guessSquared: Int
    // ensure the answer is not in one of the bounds
    lowerBound = lowerBound-1
    upperBound = number+1
    while upperBound > lowerBound+1 {
        // pick a guess number halfway between the bounds
        guess = integerMean(lowerBound, upperBound)
        guessSquared = guess*guess
            // then use it to reduce the range between the bounds
        if guessSquared < number {
            lowerBound = guess
        } else if guessSquared > number {
            upperBound = guess
        } else { 
            // our guess was the integer square root
            return guess
        }
    }
    // none found or we would have returned by now
    throw IntSqrtError.noIntRoot
}
```

This version has no discernible speed difference between 4 and 2,147,483,644. It's a great example of the trade-offs to be considered when making programming choices. It's double the lines of code, and wanted more comments to explain the intent.

Full code available on [GitHub](https://github.com/IanKulin/HackingWithSwift/blob/main/CheckPoint04b.swift).
