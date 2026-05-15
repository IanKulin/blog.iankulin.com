---
title: "Date formatting in Go is quirky"
date: '2023-12-09'
slug: date-formatting-in-go-is-quirky
aliases:
  - /2023/12/09/date-formatting-in-go-is-quirky/
tags:
  - go
  - golang
  - web-dev
---

![](/images/the_og_jay_go_programming_language_gopher_avatar._the_environme_3dc4f7dc-43b2-459e-8b76-57d9771eb9f7.jpg)

When I'm working in an unfamiliar language, I find its quicker to just ask ChatGPT to write samples of anything I need than to look it up. For instance, last night I needed to format a date in Go, and rather than Google that and pick one of the results and scroll past the ads to read something, I just asked ChatGPT to give me a code example of formatting a date I gave it to DDMMYYYY.

The answer it spat out, was something like:

`dateString := currentTime.Format("02012006")`

Well, clearly it was hallucinating - it must have gotten confused between the date I gave it and the formatting string. Odd, but this flavour of things happens. It's usually pretty good about fixing it if you point out an error, so I did that. It immediately apologised, agreed it had made an error, and gave me back the exact same thing. Poop, I guess it's back to googling some docs then.

[![](/images/gotimeformat.jpg)](https://go.dev/src/time/format.go)
*wtf*

Well there you go. 1/2 3:04:05pm 2006 - 1-2-3-4-5-6. That's what's up with Go time/date formatting. I probably would have thought that was cute when I was 20 something as well.
