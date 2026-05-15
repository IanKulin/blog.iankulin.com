---
title: "How to upgrade XCode and Swift"
date: '2022-09-18'
slug: how-to-upgrade-xcode-and-swift
aliases:
  - /2022/09/18/how-to-upgrade-xcode-and-swift/
tags:
  - posts
  - swift-language
  - swift5-6
  - tools
  - xcode
  - xcode13
---

With the September release of XCode 14 and Swift 5.7 it was time for my first update - I looked in "About" for an update link but there wasn't one - so if you're as dense as me, the tip is to head to the [Mac App Store](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjN8OGn85r6AhXlWHwKHf85DzAQFnoECBUQAQ&url=https%3A%2F%2Fapps.apple.com%2Fus%2Fapp%2Fxcode%2Fid497799835%3Fmt%3D12&usg=AOvVaw2fEvMbfRtGhB4SPHYB54NX) and have a look at the Updates page.

![](/images/screen-shot-2022-09-17-at-8.53.34-am.png)

Your current XCode version can, of course be found in the _XCode | About_ dialogue. Mine was on 13.4.1. There's a couple of ways of finding the Swift version - If you've got an XCode project open, click on the .xcodeproj in the explorer,and have a look in _Build Settings_ for _Swift Compiler - Language_ for the major version.

![](/images/screen-shot-2022-09-17-at-8.56.44-am.png)

Or for a bit more accuracy, try `xcrun swift -version` at the command line. I got a few errors, then the version 5.6.1

![](/images/screen-shot-2022-09-17-at-8.55.13-am.jpg)

I won't bang on about the [changes for XCode](https://www.youtube.com/watch?v=tYBZ8AVH0Q0) or [Swift](https://www.swift.org/blog/swift-5.7-released/) since that's already been done well elsewhere, and the Swift changes are mostly beyond my expertise level.
