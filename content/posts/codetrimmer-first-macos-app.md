---
title: "CodeTrimmer - First MacOS App"
date: '2022-10-06'
slug: codetrimmer-first-macos-app
aliases:
  - /2022/10/06/codetrimmer-first-macos-app/
tags:
  - code
  - macos
  - swift5-7
  - swiftui
  - xcode14
---

I was listening to the StackTrace app this morning ([episode 169 - "Choosing What Bugs to Ship"](https://stacktracepodcast.fm/episodes/169/)) and one of the ideas discussed was taking the time to automate some of your development processes, partially to save time, but also because if you make a process simple and quick, you'll be more likely to do it multiple times to improve quality.

Coincidentally, I'd been thinking about how often I paste some code from Xcode in order to display it in one of these blog posts. If it's from the middle of a method, it will generally be indented a long way in, and there's no point in displaying it like that (especially for a mobile reader) so I usually manually delete a heap of spaces from each line to left align it whilst keeping the needed indentation.

Sounds like a job for a tiny MacOS app - my first! Here it is in action. You copy your code from Xcode, and paste it into the app:

![](/images/screen-shot-2022-10-03-at-11.43.38-am.png)

Then press the "Strip Spaces" button to get:

![](/images/screen-shot-2022-10-03-at-11.43.43-am.png)

I've got a few little niceties to add/tidy up, but it was a breeze converting my SwiftUI iOS development skills to MacOS - literally ticking a box.

[Source](https://github.com/IanKulin/CodeTrimmer/blob/f0fc616bc1d334f7d5268f5231630940cd14d57b/CodeTrimmer/ContentView.swift)
