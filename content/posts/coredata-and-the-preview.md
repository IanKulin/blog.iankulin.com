---
title: "CoreData and the Preview"
date: '2022-11-04'
slug: coredata-and-the-preview
aliases:
  - /2022/11/04/coredata-and-the-preview/
tags:
  - 100daysofswiftui
  - coredata
  - posts
  - swift5-7
  - xcode14
---

I've noticed Paul is inclined to ignore the preview and run his code in the simulator to check its operation. That's valid, but it seems quicker, and reassuring, to see it in the preview as I type.

This led to a small problem with [Day 53](https://www.hackingwithswift.com/books/ios-swiftui/how-to-combine-core-data-and-swiftui) that uses CoreData. When I added a student in the preview, it looked like this, and was immediately followed with a crash report.

![](/images/screen-shot-2022-10-30-at-11.32.07-am.jpg)

It ran fine in the simulator, and in the text for Day 53 there was a comment about adding the managed object context to the preview, but without a hint about how.

![](/images/screen-shot-2022-10-30-at-11.34.07-am.jpg)

I tried a few things - it felt like I should be able to get it from the @Environment somehow, but ended up using [this](https://www.hackingwithswift.com/forums/100-days-of-swiftui/day-53-question-how-to-set-up-a-managed-object-context-in-xcode-s-swiftui-previews/16686) solution from fellow HWS student [@Fly0strich](https://www.hackingwithswift.com/users/Fly0strich).

![](/images/screen-shot-2022-10-30-at-11.47.51-am.jpg)
