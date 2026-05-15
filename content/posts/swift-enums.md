---
title: "Swift enums"
date: '2022-09-12'
slug: swift-enums
aliases:
  - /2022/09/12/swift-enums/
tags:
  - enum
  - names
  - posts
  - swift-language
---

I've started on the refactoring for [Rock, paper, scissors](/rock-paper-scissors-1/). One of the things I didn't like was using Ints to signal which shape (I'm calling the rock, or paper, or scissors hand shape a _shape_) was being handed around. The Int I was using was also the index into an array of the emoji's - so if I did an off-by-one I was risking an out of bounds on the array.

I'm pleased with this solution:

![](/images/screen-shot-2022-09-08-at-6.39.53-pm.png)

If you're a refugee from C, there's a lot happening here:

1 - In C enums are actually int's inside, and you can mess with which int goes with which value. In Swift, they can be any type, but the type is specified when you define the enum. They are extracted with _.rawvalue_

2 - The Swift String type is a beast. Yes it does emojis, and a lot of other very cool unicode stuff that has a cost.

3 - enums can have methods. I know right?

When I read the [Swift book](https://docs.swift.org/swift-book/), I felt it was a travesty against nature for enums being allowed to have methods, but the code above felt like the most natural thing ever. I must be acclimatising.

Apart from eliminating the array out of bounds possibility, this also made the code more readable, and meant that I could remove the default case from all my switch statements.

[source](https://github.com/IanKulin/RockPaper/commit/ff3d81599b92ba39cfa2a41c5c8c213f1b442735?diff=split)

I might not be happy with the name of this type - _Shape_. I have spend a bit of time thinking about it, and even looked up Rock Paper Scissors on Wikipedia to see what terminology they used. It's meant to represent the shape of the hands made by the players in each round of the game. It felt unclear enough that I added a comment to make it clearer - a sure sign it's not. It may change to _FingerShape_ when I do the next lot of refactoring.
