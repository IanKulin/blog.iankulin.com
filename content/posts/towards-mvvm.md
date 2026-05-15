---
title: "Towards MVVM"
date: '2022-12-03'
slug: towards-mvvm
aliases:
  - /2022/12/03/towards-mvvm/
tags:
  - architecture
  - mvvm
  - posts
  - video
---

![young woman swimming in spaghetti, by Hokusai  - Stable Diffusion](/images/young-woman-swimming-in-spaghetti-by-hokusai-.png)

On one of the more mediocre [episodes of Fireside Swift](https://firesideswift.fireside.fm/96), McSwiftface and Zach talk about the [SOLID principles](https://en.wikipedia.org/wiki/SOLID) of class design, although I don't hold the principles as the article of religious fervour that many interviewers apparently do, they are a useful touchstone for considering class quality. OOP had been in swing (in a commercial way) for a few years by then - I was writing in Delphi and C++. The spaghetti code era was a long way behind us and the idea of separation of responsibilities was well established.

I have been thinking about architecture a bit anyway - the introduction of Core Data into the [#100Day](https://www.hackingwithswift.com/100/swiftui) apps I'm up to (day 63) means that there's complicated looking code scattered around my views. In the [cs193p lectures](https://cs193p.sites.stanford.edu/), MVVM is right near the start, and I made [some early forays](/tags/mvvm/) into it, but so far no talk of architecture in 100Days (although I know it's coming soon.

I have certainly had the experience before of needing a layer between my apps and the database tech so they can be swapped out, and it's basically a reflex to me to always wrap any commercial external code I'm introducing in any reasonable size program to abstract it a bit and make the (likely) task of having to replace it in the future a lot easier.

Once again, YouTube serves me up a timely video.

{{< youtube ehV2gp5uVhs >}}

When I watch this, I can see why Paul Hudson might have left it for later in the course. There is a lot of complexity. It's not simple code, it's scalable code. This is good for real life apps, but it does not follow that it's good for learning programming.
