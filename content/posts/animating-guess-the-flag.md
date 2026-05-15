---
title: "Animating Guess The Flag"
date: '2022-09-24'
slug: animating-guess-the-flag
aliases:
  - /2022/09/24/animating-guess-the-flag/
tags:
  - 100daysofswiftui
  - animation
  - code
  - swift5-7
  - xcode14
---

The challenges for [Project 6](https://www.hackingwithswift.com/100/swiftui/34) of 100 Days of SwiftUI was to add some animations to the [Guess the Flag](/project-2-guess-the-flag/) app from a little while ago. The animations themselves were not particularly tricky, my main issue was that I was creating the views for the three flags in a ForEach, so the animations were applied to all three flags, but we wanted different animations for the flag the user had clicked versus those they had not.

I got around this by having the magnitude of the changes stored separately for each of the flag views - so they were all being animated, but some by a zero amount.

https://videopress.com/v/QjnVovjB?resizeToParent=true&cover=true&playsinline=true&preloadContent=metadata&useAverageColor=true

There's three animations going on here, so three @State properties in the view:

![](/images/screen-shot-2022-09-18-at-3.06.16-pm.png)

Then attached to the code to create the buttons are all the modifiers for the animation.

![](/images/screen-shot-2022-09-18-at-3.07.18-pm.png)

In the FlagTapped() method you can see attached to the button there, we just change the ones we need:

![](/images/screen-shot-2022-09-18-at-3.10.43-pm.png)

Then, to be a little bit fancy, I re-animated the flagScales after the user closes the alert. I really do not love that alert - it was part of the tutorial project, but it is not a good UI - and it covers up some of the lovely animation.

[Source](https://github.com/IanKulin/GuessTheFlag/compare/b373e1d..cfd2fd4)
