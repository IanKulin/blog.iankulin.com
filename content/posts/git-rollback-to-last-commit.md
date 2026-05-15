---
title: "git - Rollback to last commit"
date: '2022-11-08'
slug: git-rollback-to-last-commit
aliases:
  - /2022/11/08/git-rollback-to-last-commit/
tags:
  - git
  - possibly-useful
---

![girl turning around, cartoon, colorful - Stable Diffusion](/images/girl-turning-around-out.png)

I'm on [Project 12](https://www.hackingwithswift.com/books/ios-swiftui/dynamically-filtering-fetchrequest-with-swiftui) of the [#100Days](https://www.hackingwithswift.com/100/swiftui) course, and like a number of earlier "projects" it's not really a project, but a series of type-along tutorials. Often these have the same format - there's a base amount of code to provide the setup, then this base is used to try each of the tutorial techniques. At the end of each technique, you delete all the new code you've done back to the original setup, and you're ready for the next one.

This is a perfect job for git. All I do is commit the code once the setup is done (and I've tested it). Then after I've mucked around, and want to go back.

```
git reset --hard
```

In fact this is all so simple, it's probably the perfect use case for getting started with git even if you've never used it. The steps would be:

1.  On a system with git installed (which includes macOS)
2.  Open a terminal window, and navigate to the directory you want to be able to rollback later
3.  `**git init**`
4.  Create all your content
5.  `**git add -A**`
6.  `**git commit -m "Some message"**`
7.  Make all your disposable changes, then when you're done `**git reset --hard**`
