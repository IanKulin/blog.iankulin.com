---
title: "You Can Take Big Steps When You Feel Safe"
date: '2022-11-09'
slug: you-can-take-big-steps-when-you-feel-safe
aliases:
  - /2022/11/09/you-can-take-big-steps-when-you-feel-safe/
tags:
  - 100daysofswiftui
  - paul-hudson
  - posts
  - teaching
---

[![](/images/forest-of-giantess-jhonair.png "Forest-of-giantess By JhonAir")](https://www.deviantart.com/jhonair/art/Forest-of-giantess-604262747)

[Day 58](https://www.hackingwithswift.com/100/swiftui/58) of [#100Days](https://www.hackingwithswift.com/100/swiftui) feels like complex topics are being dropped in pretty fast. We tackle one:many data relationships and how to set them up in CoreData, using CoreData constraints and setting a merge policy to manage conflicts, and even the underscore to access the actual property inside a wrapped property struct (needed for dynamic filtering in a view).

I've [mentioned before](/top-four-reasons-why-twostraws-is-a-good-teacher/) that I think Paul Hudson is an excellent teacher, and an example of this is that even though this was a day with a lot of challenging material, I'm not worried. I followed the discussion and tried the code, and more importantly I'm anticipating these new skills will be practiced in the next app, and probably shortly after I'll be writing an app using them.

When learners feel safe and supported, they are comfortable taking bigger risks. This has the effect of growing their Zone of Proximal Development and allows faster learning.

Some of the complexity around CoreData relates to it's pre-SwiftUI age - it has a lot of power, and does a lot for the developer but is full of non-intuitive bits. The rest of the complexity is really just related to it's job - any object graph persistence that's going to allow us to think of, and work with, our data as native objects is going to have to expose some of the complexity of what's happening underneath in order to provide the flexibility needed. What's not so evident in this implementation is Swifts progressive disclosure of complexity. It's easy to imagine a modern rewrite of a more Swift-like object persistence framework being less scary.

Since CoreData is using SQLite underneath, an interesting question is what the same code would look like if you pulled in an SQLite library and handled things manually - to approach the same functionality - ie not refetching when a view is recreated if the data hasn't changed, lazy list building etc. My guess is: a lot more complex.
