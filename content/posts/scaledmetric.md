---
title: "@ScaledMetric"
date: '2022-07-29'
slug: scaledmetric
aliases:
  - /2022/07/29/scaledmetric/
tags:
  - cs193p
  - posts
  - swiftui
---

![](/images/screen-shot-2022-07-23-at-9.04.21-pm.png)

I solved the problem (well, I googled a [stackoverflow result](https://stackoverflow.com/questions/72568296/sf-symbol-images-different-sizes) to the problem) in the previous post about the different heights of the SF Symbols. The answer was to put them in a frame and lock the height. A problem that then arises from that is that when the user changes the text size, they'll be out of wack. Apple's solution to that, introduced in iOS 14 is the [@ScaledMetric property wrapper](https://developer.apple.com/documentation/swiftui/scaledmetric) that does some magic I don't fully understand yet.
