---
title: "Simple API endpoint in Go"
date: '2023-09-27'
slug: simple-api-endpoint-in-go
aliases:
  - /2023/09/27/simple-api-endpoint-in-go/
tags:
  - devops
  - go
  - golang
  - homelab
  - monitoring
  - rest
  - web-dev
---

![](/images/gopher.png)

I'd like a small, quick, low load endpoint on all my nodes and VM's that exposes a text keyword indicating if that machine is okay for RAM and disk space. I'm currently using [Uptime Kuma](/tags/uptime-kuma/) to monitor if these machines are pingable, but I'd love a tiny bit more information from them so I'd get a [Ntfy](/uptime-kuma-nfty/) buzz on my phone if a machine is in trouble.

I mentioned a couple of weeks ago that the benefit of doing it in C rather than Node.js was probably not worth the trouble, but then being a fickle developer, decided to write it in Go.

This was a pretty sweet experience, it's a nice language and the ecosystem is good. When writing such a small utility, you don't really get a full appreciation for a language, but there is a couple of nice things going on - one I appreciated was that unused code - for example an import that's not used, or a variable declared but not accessed is a compiler error and flagged by the intellisense as you type.

In terms of the language as written, it's fair to say C-like - there's no weirdness like the formatting being semantic. It's statically typed, but has good inference.

The code is up on [GitHub](https://github.com/IanKulin/vitals-glimpse).

It's hard-coded to port 10321 and the route is `/vitals.`

![](/images/screen-shot-2023-08-15-at-9.37.44-pm.png)

You get back this JSON. In my Uptime Kuma system, I search for the keywords `mem_okay` and `disk_okay` - no need to parse the JSON, it's just an on/off status check that will show up in red on the page if there's trouble, and ping my phone using [ntfy.sh](/uptime-kuma-nfty/).

In Uptime Kuma, there's an option when setting up a new monitor for `Http(s) Keyword`. How this works is that it will scrape that web address and look to see if a particular keyword exists. If the keyword is present on the page, that site is marked as up, if not, it's marked as down.

![](/images/screen-shot-2023-08-15-at-7.47.44-pm.png)

Testing the memory threshold for the screenshot above was fun:

```
stress-ng --vm-bytes $(awk '/MemAvailable/{printf "%d\n", $2 * 0.9;}' < /proc/meminfo)k --vm-keep -m 1
```
