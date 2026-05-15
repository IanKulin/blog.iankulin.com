---
title: "Moonshot Challenges"
date: '2022-10-14'
slug: moonshot-challenges
aliases:
  - /2022/10/14/moonshot-challenges/
tags:
  - 100daysofswiftui
  - code
  - swift-language
  - swift5-7
  - xcode14
---

![](/images/screen-shot-2022-10-09-at-2.00.26-pm.png)

Another few coding challenges at the end of a tutorial app in the [100 Days of SwiftUI](https://www.hackingwithswift.com/books/ios-swiftui/moonshot-wrap-up) course. The app is a sort of information app - composed of navigation views going down into more detail about the Apollo space missions. The most exciting revelation for me was how straightforward it is to pull JSON into your apps data structures.

#### Challenge 1

> _Add the launch date to `MissionView`, below the mission badge. You might choose to format this differently given that more space is available, but it’s down to you._

Adding a text view, but also another computed property to the Mission type to retrieve a longer version of the date string.

#### Challenge 2

> _Extract one or two pieces of view code into their own new SwiftUI views – the horizontal scroll view in `MissionView` is a great candidate, but if you followed my styling then you could also move the `Rectangle` dividers out too._

One of the [SwiftLint](/tags/swiftlint/) rules is about the length of views, and I recall Paul Hegarty saying something in the first couple of CS193p lectures about views needing to be kept short. I never know the pros and cons of extracting parts of them as a function or as another struct. And if I do extract them as a struct, it always seems odd to me to just be able to "call" a struct exactly as a function - although since this is declarative programing and we're just describing a view I guess it's fine.

For this change, I pulled it out the crew view and a custom divider as structs. I had to move a baby data struct out of the MissionView namespace to make it available to the new view. An alternative have been keeping the new struct also in the main view, but I don't love doing that too much. The trade off here was the potential advantages of reusing the new sub-view somewhere else, ease of testing and shorter views, vs polluting the namespace and putting things in the global app scope that do not need to be there. Deciding factor for me in this case was just ease of understanding the code.

[source](https://github.com/IanKulin/MoonShot/commit/1e5c84ccc4692df06026425684831fab60300215)

#### Challenge 3

> _For a tough challenge, add a toolbar item to `ContentView` that toggles between showing missions as a grid and as a list._

It's some combination of unsettling and pleasing if Paul thinks something should be hard and I knock it out quickly. I never know if I've missed some crucial point or I'm just getting the hang of things.

For this one I pulled out all the code that showed the grid inside a ScrollView(), duplicated it and edited the new one into a "list" by deleting the enclosing GridView(), changing a couple of VStacks to HStacks and tweaking some sizes. I added a @State variable for showing the grid, and a SF Symbol to the toolbar to swap between the views.

We've previously been advised to avoid an if statement to chose between two views as a state changes since it causes the new view to be created (rather than a ternary operator on a modifier or similar), but there's no real way of avoiding it here - the user is literally asking us for a new view - so that goes into the main view where I extracted the other code from.

[source](https://github.com/IanKulin/MoonShot/commit/9faa8c5fe99628264fef184112685365330e60fd)

When I read down into the hints after completing this, Paul talks about some gotchas with List() - which I hadn't used, so I'll be interested to see his wrap up to see if a List would have been better than my solution.
