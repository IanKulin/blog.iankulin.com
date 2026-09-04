---
title: "Basic VPS disk speed"
date: '2023-09-09'
slug: basic-vps-disk-speed
summary: "My disk benchmark results for a few VPS providers, run with fio. Binary Lane performs well despite only advertising SSD storage, while I find the difference between Digital Ocean's SSD and NVMe offerings disappointing, though contention on shared drives may explain some of that."
aliases:
  - /2023/09/09/basic-vps-disk-speed/
tags:
  - measurement
  - nvme
  - posts
  - ssd
  - vps
---

I couldn't help but measure some VPS disk speeds while I was busting out the `fio`.

![](/images/vps.png)

Binary Lane only claims "pure SSD drives" but seems pretty great. The difference between Digital Ocean SSD and NVME is disappointing. Obviously you're sharing a drive with other users, so perhaps this depends on what else is going on.
