---
title: "Checkpoint 5"
date: '2022-07-16'
slug: checkpoint-5
aliases:
  - /2022/07/16/checkpoint-5/
tags:
  - 100daysofswiftui
  - checkpoint
  - code
  - posts
---

```
/*
 Your input is this:
 
 let luckyNumbers = [7, 4, 38, 21, 16, 15, 12, 33, 31, 49]
 
 Your job is to:
 
 Filter out any numbers that are even
 Sort the array in ascending order
 Map them to strings in the format “7 is a lucky number”
 Print the resulting array, one item per line
 
 So, your output should be as follows:
 
 7 is a lucky number
 15 is a lucky number
 21 is a lucky number
 31 is a lucky number
 33 is a lucky number
 49 is a lucky number
 */

let luckyNumbers = [7, 4, 38, 21, 16, 15, 12, 33, 31, 49]

func isNumberOdd(number:Int) -> Bool {
    return number%2 == 1
}

let filteredNumbers = luckyNumbers.filter(isNumberOdd)

// this closure effectively does nothing
let sortedNumbers = filteredNumbers.sorted(by: {$0<$1}) 

let mappedNumbers = sortedNumbers.map({ String($0)+" is a lucky number" })

for i in 0..<mappedNumbers.count {
    print(mappedNumbers[i])
}
```
