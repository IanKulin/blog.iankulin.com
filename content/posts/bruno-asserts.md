---
title: "Bruno asserts"
date: '2023-11-11'
slug: bruno-asserts
aliases:
  - /2023/11/11/bruno-asserts/
tags:
  - api
  - bruno
  - testing
  - tools
  - web-dev
---

![](/images/screen-shot-2023-10-22-at-12.11.09-pm.png)

I mentioned [Bruno](https://www.usebruno.com/) the other day. Although it's still very much under development, it is shaping up as a great Postman/Insomnia replacement.

One of the aspects I've been using today is asserts. As part of a request, you can add some asserts - so when you're hitting an endpoint it will check what status should it be returning, or given the data you're passing in, what should be in the response body.

When I'd asked ChatGPT to to review the mdserver code, it had suggested that I should be sanitising URL inputs better to prevent users transversing out of the 'public' file directory to other places in the file system. I thought Express had already taken care of this for me, but wanted to check. I had ChatGPT generate a bunch of pass and fail URL examples, then just created asserts for each one in Bruno.

Once that's done, you can just right click on the collection and have it run all of those.

![](/images/screen-shot-2023-10-22-at-12.19.59-pm.jpg)

An extra benefit of Bruno is that all these requests are stored as JSON-like, version-controllable text. I store them in my project and commit them along with the rest of my code.

![](/images/screen-shot-2023-10-22-at-12.25.43-pm.png)
