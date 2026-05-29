---
title: "Moonshot Feedback"
date: '2022-10-15'
slug: moonshot-feedback
aliases:
  - /2022/10/15/moonshot-feedback/
tags:
  - 100daysofswiftui
  - code
  - swift5-7
  - swiftui
  - xcode14
---

I've watched Paul's solution to the [Moonshot challenges](https://www.hackingwithswift.com/books/ios-swiftui/moonshot-wrap-up) (the solutions are one of the perks of being a Hacking With Swift subscriber). When I'm solo learning like this its one of the few ways I can get any feedback on my coding, so I highly value it, and usually write one of these posts as a way to ensure I reflect on it.

The second challenge was to pull out a couple of sub-views, Paul had used a struct as I had, but put them in their own files. I think that's good practice if those sections are going to be used from other views, otherwise I like them in the the file with the view they're a part of. I guess if you make it a habit pull them out into files, you'd look there for them so it would not be a drama, but XCode is pretty handy for finding what you want in a reasonable size file, so that's not a big consideration.

The challenge I was really interested to see was his use of a List for the "list" version of the main view. Although his list looked a bit nicer when he'd finished, that's more of a comment on the effort I put into the design (minimal - I just made a list version of the grid style). The List does detect that it's inside a NavigationView and has those > signs at the end of each row - so there's a visual prompt to the user that these are tappable for more. In my version, I'd just kept the existing scroll view, deleted the grid and used HStacks to build out the view for each mission.

Lists do have a heap of features - checkboxes, multiple selection, pull down for refresh, left slide for delete and all sorts of other goodies. However, none of those are needed for this app, so in that respect my solution is fine.

There is however, a generally important reason for using the standard iOS controls in the way they are intended - accessibility. There's a good example of that a few minutes later when Paul adds his toolbar to the NavigationView. Here's mine - succinct, nice use of the ternary operator:

```swift
.toolbar {
    Image(systemName: showingList ? "square.grid.2x2" : "list.bullet")
        .onTapGesture {
            showingList.toggle()
        }
```

Here's Paul's:

```swift
. toolbar { 
    Button {
    showingGrid.toggle()
} label: {
    if showingGrid
    {
        Label("Show as table", systemImage: "list.dash")
    } else {
        Label("Show as grid", systemImage: "square.grid.2x2")
    }
}
```

Essentially the same, except he's used a Button rather than an Image with an .onTapGesture. You may ask why that matters - the answer is that if you were blind and using the iOS screen reader it would matter a lot. With Paul's version the reader would know it was a button - something for collecting user input, AND it would read out the purpose contained in the label.

Apple deserve credit for the effort and thought put into their accessibility features, and as developers we get a lot of that functionality for free, or at least very cheaply - but only if we do things the Apple way with standard controls.
