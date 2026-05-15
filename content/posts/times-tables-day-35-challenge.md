---
title: "Times Tables -Day 35 Challenge"
date: '2022-10-01'
slug: times-tables-day-35-challenge
aliases:
  - /2022/10/01/times-tables-day-35-challenge/
tags:
  - 100daysofswiftui
  - app
  - swift5-7
  - swiftui
  - xcode14
---

The challenge for [Day 35](https://www.hackingwithswift.com/guide/ios-swiftui/3/3/challenge) of [100 Days of Swift](https://www.hackingwithswift.com/100/swiftui) UI was to create a simple times tables drilling app. I've met all the requirements, so I'll move on, but I am struck by how ugly it is. Making better looking apps needs to be added to my goals. Especially since this app is intended to appeal to children, and is at the end of a few lessons on animation, this is definitely a weakness of mine at the moment.

![](/images/ui-copy.png)

I enjoyed this challenge, it had a few interesting aspects. One was the number keypad for the user to enter, and the other one was creating the dialogue shown to the user at the end of a round with the statistics. I really don't love the iOS modal dialogue boxes, so I ZStacked a rounded rectangle with some views on top of it, and controlled the visibility with .opacity. I wasn't sure what would happen to the user OnTap events - would they go through? The answer is that if you make it very see through they go through to the elements underneath, but if it's reasonably solid, they stay there.

{{< youtube lQFDcBNAr-s >}}

[Source](https://github.com/IanKulin/TimesTables/blob/719229d3caf80b12ddfff65032e0bee29036e1c9/TimesTables/ContentView.swift)
