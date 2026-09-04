---
title: "Animation Feedback"
date: '2022-09-24'
slug: animation-feedback
summary: "A short comparison of two solutions to the Guess The Flags animation challenge: my approach of storing animation amounts in an Int array versus Paul's more concise use of ternary operators in the modifiers. Both vary the effect depending on which flag was selected, but Paul's version needs considerably less code."
aliases:
  - /2022/09/24/animation-feedback/
tags:
  - 100daysofswiftui
  - animation
  - posts
  - swiftui
---

I had a look at Paul's version of the challenge to animate the Guess The Flags app, and like me he'd hit on altering the _amount_ of each animation depending on if it was the clicked on flag, but he'd done it with a lot less code - using the ternary operator in each of the modifiers - versus my approach of filling in an Int array for each of the effects and altering them depending on the user selection.

Another round to Paul!
