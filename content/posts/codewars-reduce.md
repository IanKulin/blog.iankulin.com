---
title: "Codewars / reduce"
date: '2022-08-24'
slug: codewars-reduce
aliases:
  - /2022/08/24/codewars-reduce/
tags:
  - code
  - codewars
  - posts
  - swift-language
---

<a href="https://www.codewars.com/"><img src="/images/1_0plbhkaulwnsx4u2mqyn2w.png" width="242" alt=""></a>

[codewars.com](https://www.codewars.com/) is a "coding practice" website. You chose a language and a skill level, then it offers up a task (or _kata_) for you to write a suitable function. The first one it gave me was seemed too hard, so I changed my level to beginner and skipped to the next one. This was my task:

```
 Given an array of integers, find the one that appears an odd number of times.
 
 There will always be only one integer that appears an odd number of times.
 
 Examples
 [7] should return 7, because it occurs 1 time (which is odd).
 [0] should return 0, because it occurs 1 time (which is odd).
 [1,1,2] should return 2, because it occurs 1 time (which is odd).
 [0,1,0,1,0] should return 0, because it occurs 3 times (which is odd).
 [1,2,2,3,3,3,4,3,3,3,2,2,1] should return 4, because it appears 1 time (which is odd).
```

I know there's a cool "Set" container type in Swift, so my plan was to iterate through the array, then for each number if there's no entry in the set, then add one, but if there is, remove it. That way whatever is left in the set at the end must be in the original array an odd number of times. I was pretty pleased with myself. Here's the code I Playground'd up:

func oddTimesInt(intArray: \[Int\]) -> Int {
    
    var intSet: Set<Int> = \[\]
    
    for number in intArray {
        if intSet.contains(number) {
            intSet.remove(number)
        } else {
            intSet.insert(number)
        }
    }
    
    assert(intSet.count == 1)
    if let firstNumber = intSet.first {
        return firstNumber
    } else {
        // this is guaranteed not to happen in the specification
        assert(false)
        return 0
    }
}

While you are writing your code in their webpage, you can run it against a test suite. Mine passed the first time; even more pleased with myself.

When you're ready, you can submit your code. Now it runs against a much bigger test suite. It passed again; now my head is swelling a little at just how canny I am.

There's a chance to clean up, comment, or to refactor your code before it's finally locked in. Then once you commit that, it shows you other people's solutions. This was the top one:

func findIt(\_ seq: \[Int\]) -> Int {
    seq.reduce(0, ^)
}

lol. One. Line. That'll learn me.

So, anyways.... I guess I learned there's an array method called _reduce_, and it reduces an array, but I want to argue my code is easier to understand.

[According to the docs](https://developer.apple.com/documentation/swift/array/reduce\(_:_:\)), _reduce_ "Returns the result of combining the elements of the sequence using the given closure." Basically, the 0 in the example above is the inital value of the accumulator, then the closure repeatedly operates on the accumulaotr and each value of the array, then the final result in the accumulator is returned. An example will make a lot more sense. Here's the one from the Apple documentation:

let numbers = \[1, 2, 3, 4\]
let numberSum = numbers.reduce(0, { x, y in
    x + y
})
// numberSum == 10

The closure in the winning entry used all the closure redaction tricks I think I've [complained](/closures/) about before. We could make it a bit more readable by putting syntax back.

func findIt(\_ seq: \[Int\]) -> Int {
    seq.reduce(0, {accumulator, element in accumulator ^ element} )
}

or to go back another step:

func superXOR(accumulator: Int, element:Int) -> Int {
    return accumulator ^ element
}

func findIt(\_ seq: \[Int\]) -> Int {
    seq.reduce(0, superXOR )
}

The ^ operator is XOR. I know what that does, and could even manually do it on two binary numbers.

This compact solution is based on knowing that XORing all the integers will leave the odd value, since XORing two identical numbers gives zero, and that carrying forward the XORed value of two different numbers will shake out to leave the number that only appears once. I was not going to think of that solution, even if I'd known _reduce_() existed.
