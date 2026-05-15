---
title: "Drawing Feedback"
date: '2022-10-19'
slug: drawing-feedback
aliases:
  - /2022/10/19/drawing-feedback/
tags:
  - 100daysofswiftui
  - code
  - swift5-7
  - xcode14
---

![Hedy Lamarr standing in front of a drawing, Kuvshinov Ilya - Stable Diffusion](/images/hedylamarrstandinginfront_52901467.png)

Here's the summary of my learning from comparing [my efforts](/project-9-drawing/) with Paul's solutions to the Project Nine challenges from [Day 46](https://www.hackingwithswift.com/books/ios-swiftui/drawing-wrap-up) of his [100 Days of SwiftUI course](https://www.hackingwithswift.com/100/swiftui).

> _Create an `Arrow` shape – having it point straight up is fine. This could be a rectangle/triangle-style arrow, or perhaps three lines, or maybe something else depending on what kind of arrow you want to draw._

Very similar solutions - Shape returning a Path, expect he finished off his with path.closeSubPath() rather than adding in the last line. That's a bit neater, so that point to Paul.

> _Make the line thickness of your `Arrow` shape animatable._

I did say in [my solution](/project-9-drawing/) that it seemed too simple, and I was expecting to have to use AnimatableData, and that was correct. Paul does not mean animating the _line_ _thickness_, he means the _shaft width_ of the arrow - though I can see how they're sort of the same thing. I wish he had his website code on GitHub and I would have fixed it for him, along with an error I'd spotted in one of the earlier lessons.

{{< youtube e3GAMZAVqus >}}

In any case, Paul's fix was as per the earlier lesson.

> _Create a `ColorCyclingRectangle` shape that is the rectangular cousin of `ColorCyclingCircle`, allowing us to control the position of the gradient using one or more properties._

This was just a matter of a couple of edits to the ColorCyclingCircle() struct Paul had created in one of the lessons to change the shape and to pass in values so the gradient could be manipulated. Although our solutions where similar, Paul's was a bit more thorough - controlling the start and end points of the gradient.

I'm interested that Paul uses the US spelling for colour. I've wondered about that in my code - of course Apple spell it that way in all the Swift source, so it does look odd if you stick to the UK spelling, and I guess the majority of people who learn English as a second language probably learn American spellings.
