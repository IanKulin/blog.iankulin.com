---
title: "99 CSS Layout Feedback"
date: '2022-12-25'
slug: 99-css-layout-feedback
aliases:
  - /2022/12/25/99-css-layout-feedback/
tags:
  - css
  - ios-dev
---

I've been in the swing with the [#100DaysOfSwiftUI](https://www.hackingwithswift.com/100/swiftui) course of having frequent assignments to test my understanding of the course content up to that point, then watching the feedback video and reflecting on it here. So far, in the [Complete Web Developer](https://www.udemy.com/course/the-complete-web-developer-zero-to-mastery/) I've only had this single CSS assignment, so I was excited to see how I got on.

I was a bit chuffed that one of Andrei's first actions was to edit the html to make it more semantic - I'd used <header> for the top bit, he used <nav> which is probably better, and then I could have recycled <header> for the cover. Although in general, there was a lot of use of classes, where I had just used selectors carefully. I guess my thinking here was that the html should be free of information about how to display it - and we break that if we say add `class="sticky"` to the nav bar. The argument could be made the other way though - with my system I'm building dependency on a particular page structure into the CSS if I use a selector to pick out the last child in a list to apply a style to it.

Andrei also used an unordered list for his links - I saw this in a CSS video so it might be a common idea. He used a flexbox, and an auto left-margin to move the last link to the right edge of the screen which was neater than the fiddling around I did - but I think that's down to me as I could probably have done the equivalent trick i grid.

There were a couple of new things introduced in the solution, which felt a bit unfair, although its a valid teaching approach I guess. One was vh units, and the other was using @media queries to change things based on the screen size. It wouldn't have been possible for me to have used either since I hadn't been taught them yet, but both were good in this context.

Same with the sticky nav bar, I'd actually considered this in my design, but hadn't figured out how to do it. It was done with:

```
nav {
    position: fixed;
    top: 0;
    width: 100%;
}
```

But when I tried it in my page, I'd lost the vertical centering in the div below, so obviously I needed to do something to that to make it start at the bottom of the newly sticky nav bar which had been happening without any intervention before.
