---
title: "Mock Data"
date: '2022-11-28'
slug: mock-data
aliases:
  - /2022/11/28/mock-data/
tags:
  - possibly-useful
  - security
  - tools
---

One of the things we need during app development is some data to play with. It would be unethical for me to use real student data to test my app, even if I wasn't sharing screenshots of the development here, so I'll need to build some mock data. The prospect of making 400 rows of data manually does not sound like a good use of time, so I started to think about generating it in Excel. I'd used an online "random address generator" for an earlier project, so I was contemplating pasting that sort of data into Excel workbooks and randomly selecting from it.

It occurred to me someone probably already solved this problem, and a quick search confirmed there are hundreds of web based test data generating sites. They provide data in all sorts of formats as downloads or via APIs. Somewhat at random, I selected [Mockaroo](https://www.mockaroo.com/).

[![](/images/screen-shot-2022-11-26-at-5.56.38-am.jpg)](https://www.mockaroo.com/)

In addition to letting you specify the fields, you control the type of data to go in them. They have a heap of options of specific formats such as ISBN's, airport codes and so on. The whole thing took a couple of minutes to setup.

As I was doing it, it occurred to me that a completely random date of birth didn't make perfect sense - there really should be a connection between the year group of students and their date of birth. It's completely immaterial for this project, so I didn't bother with it, but in fact Mockaroo has ruby based scripting that allows you the flexibility to make one field somehow calculated from others so that would be possible

![](/images/screen-shot-2022-11-26-at-5.56.05-am.png)

It was a simple matter to download my data as JSON, but there's also options for fetching it from a REST API.

![](/images/screen-shot-2022-11-26-at-5.59.38-am.png)

I'll download and host this on my home Raspberry Pi server that I bought for a different project, but it's possible just to pull it direct from their server.

A small note of caution is that if you sign in to save your schema, it is saved, but it's also public. That may not matter for your context, but in some situations it could be important. This could be from the data you provide as options, or even just the property names might provide intelligence useful to someone. As IT professionals we need to be mindful of the risks we're taking with client or user information and to either eliminate or explain them.
