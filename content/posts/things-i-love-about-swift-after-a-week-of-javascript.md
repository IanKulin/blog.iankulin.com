---
title: "Things I love about Swift after a week of JavaScript"
date: '2023-01-06'
slug: things-i-love-about-swift-after-a-week-of-javascript
aliases:
  - /2023/01/06/things-i-love-about-swift-after-a-week-of-javascript/
tags:
  - javascript
  - posts
  - swift-language
---

![Swift logo punching the JavaScript logo - Stable Diffusion](/images/swift-logo-punching-the-javascript-logo.jpg)

So, a week into JavaScript, what am I missing? The techie in me wants to say things like Automatic Reference Counting, but actually, at my junior level, I don't run into memory management issues on the day-to-day, so what really do I miss?

#### Determinism

When I build an iOS app, it's frozen in time. The functions inside are always going to stay the same. There might be a future version of iOS that won't run it, but as long as it runs, any pure functions inside it will return the same value. The process of compiling it locks that in. Likewise, any libraries that are complied with it.

As an interpreted language, that is not true for JavaScript. It can be interpreted differently. It might run differently on different versions of a browser, or browsers from different developers. For example, it would be possible to write a function that adds 1+1 that has a different result on the current version of the Opera Mini browser to Chrome do to the different way it deals with `const`.

It's a fair point to say this also does not affect me on the day-to-day, but it does worry me that something I put out there might fail unpredictably in the future. I guess [web assembly](https://webassembly.org/) fixes this, but then I could be writing in Swift!

#### IDE

I really love [VS Code](https://code.visualstudio.com/), it makes me feel differently (in a good way) about Microsoft. It's fun to write code in, and has a amazing extensions that provide all sorts of good experiences, but it's not a complete IDE. Likely there's things I can set up to get closer to debugging in VS Code while running my apps in a browser and I just haven't figured them out yet. When I'm just playing with JS using node is a good solution but I haven't arrived at a smooth solution for browser. Currently I'm using lots of console.log()s and the developer console in the browsers.

It's fair to say Swift developers don't universally love the Xcode experience, and there is definitely room to improve the extension environment, but it is a complete package for developing iOS apps.

#### Deprecated = Deleted

When Swift kills off an old language feature in a big number version change, it stays dead. It's not there any more, it haunt's no one. That's not possible with an interpreted language with millions of installed apps. Browsers have to support bad old ideas in JavaScript basically forever. I have to have [CanIUse](https://caniuse.com/) open in a tab (although I guess there's a VS Code extension for that!).

#### In JavaScript's favour

I love the low barrier to entry to JavaScript. Web development is open to anyone with an internet connection and a device. No MacBook, no Apple Developer subscription, no iPhone needed. Most anyone wanting to try it can just open the console in their browser.

In theory an interpreted language has the advantage of not needing the build step. When I first encountered Ruby and Python this was part of their charm for me. This does apply to JavaScript - you can just pull up the console and start playing. In the intervening years, compiled languages have made up this space a bit though, so it's not the big selling point it used to be. Swift in Xcode is compiled somehow as you type so you're seeing errors flagged as they occur. Building the little apps I've written is very quick, and tools like Playgrounds fill part of this need.
