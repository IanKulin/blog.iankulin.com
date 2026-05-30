---
title: "Ranges"
date: '2022-09-25'
slug: ranges
aliases:
  - /2022/09/25/ranges/
tags:
  - 100daysofswiftui
  - swift-language
  - swift5-6
  - swift5-7
---

I wondered aloud, in a [previous post](/project-4-challenges/), about the differences in writing a range as

```swift
        ForEach(1..<21) {
            Text(String($0))
        }
```

versus

```swift
        ForEach(1...20) {
            Text(String($0))
        }
```

And that's been answered in in one of the Day 34 articles. It sounds like older versions of Swift might not have allowed the second version.

[![](/images/screen-shot-2022-09-18-at-6.51.32-pm.jpg)](https://www.hackingwithswift.com/guide/ios-swiftui/3/2/key-points)
