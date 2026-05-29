---
title: "Passing Data"
date: '2022-07-20'
slug: passing-data
aliases:
  - /2022/07/20/passing-data/
tags:
  - state
  - architecture
  - paul-hudson
  - posts
  - sean-allen
  - swiftui
---

Sean Allen has come to my notice a couple of times, once where he was mentioned as freelance contractor who is a great contributor to the community (I think perhaps that was on [Swiftcoders Podcast](https://podcasts.apple.com/au/podcast/swiftcoders-interviews-with-swift-developers/id1082937962)), and I've also bumped into him as co-host (with Paul Hudson) of the early episodes of the "[Swift over Coffee](https://podcasts.apple.com/au/podcast/swift-over-coffee/id1435076502)" podcast.

{{< youtube HXoVSbwWUIk >}}

This video I watched last night is a compilation of the first few videos of [Sean's SwiftUI course](https://seanallen.teachable.com/p/swiftui-fundamentals), and it's pretty great. In particular he does a great job of explaining how to start to refactor child views out and call them, and how all the stacks go together to make a pretty interface. What he does not do is vist/explain any of the Swift language fundamentals. If you don't already know what a struc is, and the Swift flavour of them, it may be a challenging place to start.

In the last couple of tutorials he starts on the way the views are called, and how we can pass values into them. This is great marketing for me - it's exactly where I'm up to in my journey - I'm perplexed about the structure of a SwiftUI app (where's main?!) and the engine that's watching when the UI needs updated and building the views. For example, I want to write a little hello world that just prints the time on the screen. I got this far:

```swift
struct ContentView: View {
    let today = Date.now
    var body: some View {
        Text(today, style:.time)
    }
}
```

But then a minute later when it needs changed what happens? In traditional programming there would be a loop in main where I could check the minutes have changed, and force the redraw of the label.

I feel this is the thing that's going to be explained clearly in the next few videos of Sean's course, which is cunningly behind the paywall. I'm very tempted, although my learning is already spread over two proper courses plus a shotgun blast of other reading, podcasts and self created programming tasks.

I did have one moment of confusion when Sean passes down an @State variable to a child view and said the variable in the child view needed to be made @Binding. One of the top comments points this out as being unneeded and Sean agrees.
