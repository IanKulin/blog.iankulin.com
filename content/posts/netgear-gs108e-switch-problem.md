---
title: "Netgear GS108E switch problem"
date: '2023-02-14'
slug: netgear-gs108e-switch-problem
aliases:
  - /2023/02/14/netgear-gs108e-switch-problem/
tags:
  - gs108e
  - homelab
  - issues
  - network
---

I had a weird issue today that I wouldn't have known about if I didn't have an over-engineered home network monitoring system.

I've got a new [GS108E managed switch](https://www.netgear.com/au/business/wired/switches/plus/gs108e/), purchased in anticipation of connecting a NAS to the homelab - I want to have a solid 1Gb connection between the NAS and the servers, and also in anticipation of moving to VLANs before I start to expose self-hosted services to the internet.

It sat plugged into the network for 24 hours with no load, then I moved the server over on to it. I hadn't changed any configuration on it (it comes out of the box just configured as a switch). It's IP address was set by DHCP, and I'd reserved that in my Netgear modem.

It was all working perfectly, then a day later, it suddenly stopped responding to pings and the interface was unavailable. The weird bit was that the network was still working perfectly - I could ssh to the server through it, but it didn't appear on the network. The leds on the connected ports where flashing away happily.

![](/images/screen-shot-2023-02-05-at-7.18.51-am.png)

There are a couple of search results for this switch working, but the interface not reachable - but they all seem to involve complicated VLAN setups where people have locked themselves out rather than the default config suddenly having an issue.

It will be disappointing if this is going to be a regular issue, but at least I'll have good data to investigate it!
