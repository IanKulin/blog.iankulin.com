---
title: "Lost in Translation"
date: '2023-01-11'
slug: lost-in-translation
aliases:
  - /2023/01/11/lost-in-translation/
tags:
  - javascript
  - tools
  - web-dev
---

We're in a pretty good place now (compared to a few years ago) in terms of being able to rely on JavaScript behaving the same on different platforms. There's still some differences (mostly in when things are implemented) but overall, not to bad once you decide to no longer support Internet Explorer.

[In times past, it was a lot more painful](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing/JavaScript). A few of approaches to deal with this arose. One is to let a library, such as [jQuery](https://jquery.com/) or a [polyfill](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills) deal with it, and the other is use a translation utility such as Babel to down convert (transpile) your modern JavaScript to something that will run in more browsers.

Babel can be run from the command line, and therefore integrated into a toolchain, but if you want to have a play with it, they have an interactive version on their web site. Here's a couple of examples of how arrow functions and backtick templates get converted to run on IE 6.

![](/images/screen-shot-2023-01-02-at-3.09.56-pm.png)
