---
title: "We need to talk about Bruno"
date: '2023-10-27'
slug: we-need-to-talk-about-bruno
aliases:
  - /2023/10/27/we-need-to-talk-about-bruno/
tags:
  - api
  - bruno
  - insomnia
  - postman
  - rest
  - tools
  - web-dev
---

[![](/images/screen-shot-2023-10-01-at-6.01.17-pm.png)](https://www.usebruno.com/)

I've [mentioned before](/how-to-deploy-a-node-js-app/) that I was using Insomnia as a tool to check my REST APIs as I was developing them, and that I was avoiding Postman (which I guess is more widely used since it's worth [USD5.6 billion](https://techcrunch.com/2021/08/18/api-platform-postman-valued-at-5-6-billion-in-225-million-fundraise/)) because

> _The only reason I'm using Insomnia instead of Postman is that when I tried Postman, it straight away wanted some of my data to make it work. Insomnia hasn't forced me to do that yet._

Sadly that was prophetic. I saw [@wtpisaac@vmst.io](https://vmst.io/@wtpisaac) [mention this exact thing](https://vmst.io/@wtpisaac/111150369449470670) had happened.

![](/images/screen-shot-2023-10-01-at-5.43.52-pm.jpg)

The following day when I opened up Insomnia, it asked to upgrade and I said no, and was able to write and save a handful of new calls to test the API I was building. Sadly, I closed it, and of course on the next run, it demanded an account be created. I skipped that, and it presented me with a "sandbox" and all my saved requests were gone.

Luckily, Isaac also suggests a solution - [Bruno](https://www.usebruno.com/). This is a 1K star FOSS project by [helloanoop](https://github.com/helloanoop). There are Mac, Windows and Linux clients, as well as a CLI and VSCode plugins. One of it's selling points (apart from it's not Postman or Insomnia) is that the collections of requests are saved in very simple human readable text (a language called _bru_) so it's straightforward and sensible to commit them to source control along with your code.

![](/images/screen-shot-2023-10-01-at-6.14.09-pm.png)

This video from Anoop (with a very clickbait-y title) does a good job of explaining his project.

{{< youtube b_ctmKlEOXg >}}

I've only played around with Bruno for an afternoon, but I'm loving it so far. Seems like it will do everything I need, and the diffable files for the requests are a bonus. This is a project that deserves to be better known.
