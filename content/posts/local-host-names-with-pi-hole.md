---
title: "Local host names with Pi-hole"
date: '2023-02-13'
slug: local-host-names-with-pi-hole
aliases:
  - /2023/02/13/local-host-names-with-pi-hole/
tags:
  - dns
  - homelab
  - pi-hole
---

![](/images/screen-shot-2023-02-04-at-5.46.22-pm.jpg)

I run an instance of Pi-hole as a network-wide advert and surveillance blocker. It also has a setting to block individual domain which I use to force myself to really consider if 30 minutes of [Reddit](https://old.reddit.com/r/homelab/) is a good idea when I should probably just be going to bed.

As I've increased the number of real and virtual devices on my network, it's getting to be a pain remembering all of their IP addresses. So I'd like to have DNS entries for them, for example I'd much rather:

```
ssh ian@vm100-dockhost
```

than

```
ssh ian@192.168.100.29
```

Luckily, since Pi-hole works by being a DNS server (who drops requests for domains it doesn't like) it has the capability of handling these local names.

#### How to set up

Down the left side of the Pi-hole interface, there's a link for Local DNS | DNS Records. Click on that for this screen, then input the name you'd like to use and the IP address it should go to. I use the device host names so there's less confusion, but there's no rule for this - you can use whatever you like.

![](/images/screen-shot-2023-02-04-at-6.05.02-pm.png)

![](/images/screen-shot-2023-02-04-at-6.08.26-pm.png)
