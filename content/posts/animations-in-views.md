---
title: "Animations in Views"
date: '2022-09-23'
slug: animations-in-views
aliases:
  - /2022/09/23/animations-in-views/
tags:
  - code
  - swift5-7
  - swiftui
  - tutorial
  - xcode14
---

It's a very Apple-thinking thing to be learning about making beautiful and intuitive user experiences this early in a programing tutorial as I am with the [100 Days of Swift UI](https://www.hackingwithswift.com/100/swiftui/32) series. Here's a quick look at three different ways of doing animation in SwiftUI Views.

#### Implicit animation

An _implicit_ animation in SwiftUI is when you add a ._animation_() modifier to a view. It needs to be bound to the value that's changing so the framework knows to animate when that value changes, and the nature of the change.

<a href="/images/screen-shot-2022-09-18-at-10.21.30-am.png"><img src="/images/screen-shot-2022-09-18-at-10.21.30-am.png" width="956" alt=""></a>

https://videopress.com/v/ItGiKMzz?resizeToParent=true&cover=true&preloadContent=metadata&useAverageColor=true

In the example above, the value that's changing is `rounded`. We declare this as an @State variable, then in the .animation() modifier, we tell the framework to watch it. When it does change (because the user presses the bottom) SwiftUI considers the difference between the view rendered in rounded state, and in the non-rounded state, then generates and outputs the frames between them.

#### Binding animation

The .animation() modifier can be attached when a variable is bound to a control.

![](/images/screen-shot-2022-09-18-at-11.13.05-am.png)

I've slightly complicated things here by adding the .timingCurve() inside the .animation() - otherwise the animation wasn't obvious visually - the effect of this is just to slow down the animation so it keeps happening for a bit after you've adjusted the slider.

https://videopress.com/v/3caKJJkZ?resizeToParent=true&cover=true&autoPlay=true&controls=false&loop=true&preloadContent=metadata&useAverageColor=true

#### Explicit animation

Explicit animation is used when we want to control when the animation occurs, a common reason for this would be when we want to combine a couple of changes to take place simultaneously) .

![](/images/screen-shot-2022-09-18-at-11.38.02-am.png)

https://videopress.com/v/6dE3XCSP?resizeToParent=true&cover=true&autoPlay=true&controls=false&loop=true&preloadContent=metadata&useAverageColor=true
