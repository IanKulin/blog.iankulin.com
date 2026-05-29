---
title: "Day 50 - @State vs @Observed again"
date: '2022-10-28'
slug: day-50-state-vs-obseved-again
aliases:
  - /2022/10/28/day-50-state-vs-obseved-again/
tags:
  - swift5-7
  - xcode14
---

Way back when, I was unclear about @StateObject and @ObservedObject ([here](/simple-mvvm/), and [here](/observedobject-v-stateobject/)). I still am.

But in [today's tutorial](https://www.hackingwithswift.com/books/ios-swiftui/taking-basic-order-details) video, Paul clearly says that the @StateObject is for the single place in your app where the object is created, then everywhere else, use @ObservedObject. Trouble is, I just know from the Simple MVVM app I made if you wrap the single instance of the data model with the @ObservedObject, it still works.

Half way through my #100Days and this mystery is still not solved for me. I imagine now it never will be until I can figure out how the property wrappers differ. When you hold down command, and click over a keyword, you get a list of options. One of these options is "Jump to definition".

![](/images/screen-shot-2022-10-26-at-6.28.33-pm.png)

So I should be able to do that with @StateObject and @ObservedObject then just diff the code and see right?

![](/images/screen-shot-2022-10-26-at-6.26.19-pm.jpg)

Obviously, I'm not comprehending all of this, but it looks like the main difference is this extra Wrapper struct in the ObservedObject:

```swift
@dynamicMemberLookup @frozen public struct Wrapper {
        public subscript<Subject>(dynamicMember keyPath: ReferenceWritableKeyPath<ObjectType, Subject>) -> Binding<Subject> { get }
    }
```

Yeah. I'm not going to be able to unpack that bad boy. I'll just file it in "probably something to do with reference counting, and come back to it when I'm smarter.
