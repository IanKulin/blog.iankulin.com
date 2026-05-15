---
title: "Curse of Backwards Compatibility"
date: '2022-12-29'
slug: curse-of-backwards-compatibility
aliases:
  - /2022/12/29/curse-of-backwards-compatibility/
tags:
  - philosophy
  - web-dev
---

![young woman looking back over her shoulder, Impressionist painting - Stable diffusion](/images/young-woman-looking-back-over-her-shoulder-impressionist-painting.jpg)

I was listening to a JavaScript podcast today ([JavaScript Jabber](https://www.youtube.com/watch?v=O0fvMJcca3A)) and in one of the discussions a point was made about how HTML, CSS and JavaScript have all had to maintain considerable legacy behaviors that compile-able languages do not have to. For instance, when Swift underwent some substantial changes from Swift 2 to Swift 3 - some code broke for developers and needed reworking because things had changed or been removed. Nothing broke for users - they could either still use their previously compiled applications, or they were delivered new ones from the app store.

In web world - that's not possible.

Modern browsers need to be able to correctly render HTML from the birth of the web. I have a commercial site I last updated in 1996 that uses tables for some layout - it works fine in a modern browser.

Having to bring forward all this functionality is great for web users (and people who don't maintain their websites, but it weighs down the languages and makes learning them more difficult. This is related to my dilemma about ignoring block model and flex-box; in a compiled language they could have been deprecated in favour of grids, but in CSS they need to exist forever.

This same theme was revisited in a [later episode of the same podcast](https://topenddevs.com/podcasts/javascript-jabber/episodes/jsj-421-semantic-html-with-bruce-lawson), this time in relation to semantic HTML and it's benefits. The hosts wished that some improvements to web technologies _would_ break web-sites so people would be forced to update them.
