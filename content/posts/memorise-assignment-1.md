---
title: "Memorise Assignment 1"
date: '2022-07-28'
slug: memorise-assignment-1
aliases:
  - /2022/07/28/memorise-assignment-1/
tags:
  - code
  - cs193p
  - posts
---

![](/images/screen-shot-2022-07-23-at-7.33.03-pm.png)

A small milestone achieved - I've completed the first assignment from the CS193p lecture series - some minor changes to the app being built in the lectures. There was a couple of things I was unhappy with:

-   The text under the SF Symbols you can see in the preview above not being vertically aligned.
-   Having duplicated code in my emoji arrays:

```
    let animalEmojis = ["🐠", "🐢", "🦋", "🐥", "🐣", "🐰", "🐝", "🦄", "🐵", "🐛"]
    let weatherEmojis = ["🌪", "🌝", "🌈", "🔥", "🌧", "🌙", "🌬", "☃️", "☔️", "🌫"]
    let transportEmojis = ["🚗", "🚕", "🚲", "🚚", "🛵", "🚜", "🛴", "🛺", "🚃", "🚡"]

    // I'm not happy with this duplication //TODO
    @State var emojis = ["🐠", "🐢", "🦋", "🐥", "🐣", "🐰", "🐝", "🦄", "🐵", "🐛"]
```

This second problem is because I couldn't just

```
@State var emojis = animalEmojis
```

When I tried it, I encountered the error:

```
Cannot use instance member 'animalEmojis' within property initializer; property initializers run before 'self' is available
```

This is vexing - the constants are defined on the lines above, so surely if this property exists, the ones before it do. Apparently that can't be depended on - probably for some good reason that will be unveiled at some stage. It's not because `emojis` is wrapped in the `@State` which probably does cause the variable to be created off somewhere else - I tried with just an ordinary var and had the same issue.

Then I read further down into the assignment, there's a "hints section" which I should clearly be reading before I being. C's get degrees.

![](/images/screen-shot-2022-07-23-at-7.42.54-pm.png)

Message received. Don't worry about the doubled up string array, and go back and watch the lecture again. There was something about locking an aspect ratio for an SF Symbol at some stage.
