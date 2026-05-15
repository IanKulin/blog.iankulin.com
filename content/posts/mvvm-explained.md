---
title: "MVVM Explained"
date: '2022-08-07'
slug: mvvm-explained
aliases:
  - /2022/08/07/mvvm-explained/
tags:
  - emmanuel-okwara
  - mvvm
  - posts
  - video
---

The first nine minutes of [this video](https://www.youtube.com/watch?v=sLHVxnRS75w) from [Emmanuel Okwara](https://twitter.com/Its_Macco) finally gave me a clear understanding of the difference between MVC and MVVM.

{{< youtube sLHVxnRS75w >}}

In both MVC and MVVM the data & logic (Model) are separated from the part that the user interacts (View). Usually the View is a screen with controls and so on, but that's not compulsory - for example a voice mail app interface would be all audio and DTMF. The point is that in both, the user interface (view) does not mess directly with the data (model) - it has to go through some sort of gatekeeper.

The new understanding I got from Emmanuel is that in MVVM, the View Model does not know what is in the View. It does not alter the view, just broadcasts that there's been a change and lets the view go ahead and update itself. It makes sense that this would be the paradigm for SwiftUI's declarative interface style, and is also (I imagine but actually have no idea) the basis for React.js

One thing Emmanuel mentions that I'm not clear on is that each View will have it's own View Controller. Currently all my tiny apps have had one view in the SwiftUI sense. I have pulled out sub views, and some have had views within views - for example with the Navigation View. So I guess my question would be, "What constitutes a View in MVVM?"

I noped out at the nine minute mark as soon as Interface Builder showed it's face. I'm an iOS15 SwiftUI baby - I will, eventually, need to learn the old magic, but competence developing iOS apps using SwiftUI current methods is the MVP.

With this understanding, and having finished lecture 4 from the cs193p series, I think a good project for today would be the simplest possible MVVM app with the correct separations and bindings.
