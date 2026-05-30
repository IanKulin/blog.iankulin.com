---
title: ".self in ForEach"
date: '2022-09-07'
slug: self-in-foreach
aliases:
  - /2022/09/07/self-in-foreach/
tags:
  - 100daysofswiftui
  - code
  - posts
  - swift-language
  - swiftui
---

I'm on Day 25 of Hacking With SwiftUI, and [Paul is making a point](https://www.hackingwithswift.com/guide/ios-swiftui/2/2/key-points) about how SwiftUI can loop over an array to build a view. He starts with this:

```swift
let agents = ["Cyril", "Lana", "Pam", "Sterling"]
VStack {
    ForEach(0..<agents.count) {
        Text(agents[$0])
    }
}
```

But then proposes an alternative:

```swift
let agents = ["Cyril", "Lana", "Pam", "Sterling"]
VStack {
    ForEach(agents, id: \.self) {
        Text($0)
    }
}
```

He explains the use of \\.self here by saying

> So, we come back to how Swift can identify values in our array. When we were using a range such as `0..<5` or `0..<agents.count`, Swift knew for sure that each item was unique because it would use the numbers from the range – each number was used only once in the loop, so it would definitely be unique.
> 
> In our array of strings that’s no longer possible, but we can clearly see that each value is unique: the values in `["Cyril", "Lana", "Pam", "Sterling"]` don’t repeat. So, what we can do is tell SwiftUI that the strings themselves – “Cyril”, “Lana”, etc – are what can be used to identify each view in the loop uniquely.

I'm having a couple of problems with this.

#### Grumble One

The first is that Swift can't really use the "strings themselves". So this doesn't work:

```swift
ForEach(agents, String($0)) {
    Text($0)
}
```

It complains that there's no initialiser to take those arguments. So \\.self must be something fancier. This is something I can presumably investigate by looking at the initialisers for ForEach.

#### Grumble Two

And the second grumble is that the first formulation `ForEach(0..<agents.count)` throws a compiler warning "`Non-constant range: argument must be an integer literal`"

![](/images/screen-shot-2022-09-03-at-11.44.26-am.png)

Which is true, if I swap it for the number '4' it stops complaining. I guess in the initialiser for ForEach there's something specifying this although it's not clear to me why. Again it's an initialiser mystery because I can make the warning go away by adding the id reference to self.

![](/images/screen-shot-2022-09-03-at-2.06.48-pm.png)

Googling for the warning finds a [page on the Hacking with Swift forums](https://www.hackingwithswift.com/forums/swiftui/compiler-warning-non-constant-range-argument-must-be-an-integer-literal/14878) that throws a little bit of light on the issue by looking at the inits.

![](/images/screen-shot-2022-09-03-at-2.13.44-pm.png)

The difference between these two that we're interested in is that in the first, the type is `Range`, and the second `Data`. [@RoosterBoy](https://www.hackingwithswift.com/users/roosterboy)'s explanation for why we should use literal ints for the range is that it's to be safe from the array changing size during the loop - which is slightly unsatisfying because that could still happen with the literal int range.

#### Grumble One again

These initialisers also shed some light on my first problem, the references used by SwiftUI should be KeyPaths. [Sarun's explanation](https://sarunw.com/posts/what-is-keypath-in-swift/) of them makes them sound like actual references - ie memory addresses for the properties. That would make sense since SwiftUi wants them to keep track of things.

So I tried this:

```swift
ForEach(agents, id: \String.$0) {
    Text($0)
}
```

but the compiler is still unhappy - so clearly I am not knowledgeable enough yet to solve this one.
