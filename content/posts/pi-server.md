---
title: "Pi Server"
date: '2022-12-04'
slug: pi-server
aliases:
  - /2022/12/04/pi-server/
tags:
  - homelab
  - posts
---

I have a a couple of Raspberry Pi's on my home network. One is a radio interface on the [AllStar network](https://www.allstarlink.org/), and the other is just a toy server - I can't actually recall why I bought it. Both of them are Model 3B's - I'd love a 4, but they are scarce and expensive.

This doesn't have much to do with Swift, although it's possible to run [Swift on a Pi](https://lickability.com/blog/swift-on-raspberry-pi/), or even [Vapor](https://medium.com/@jhheider/installing-vapor-and-swift-on-the-raspberry-pi-45a6c7baef35). Mine is set up as a generic web server that I use as the back end for my tiny projects. It runs [Node.js](https://nodejs.org/en/about/), [apache](https://www.apache.org/) and [lighttpd](https://www.lighttpd.net/) webservers, [PHP](https://www.php.net/), [MySQL](https://www.mysql.com/), [SQLite](https://www.sqlite.org/index.html), and, when I get to that stage of my programmming, [Postgres](https://pimylifeup.com/raspberry-pi-postgresql/). I could do all that on my MacBook, but it's somehow more fun on the Pi.

A recent addition is to run [Pi-hole](https://pi-hole.net/) - a DNS sink to block advertisements on all devices on my network. It was a painless addition, and I enjoy looking at the stats as well as ads being blocked at the network level instead of depending on browser addons.

![](/images/screen-shot-2022-12-02-at-7.17.04-pm.jpg)

I'm not sure that I'll stick with Raspberry Pi. With the current shortage, it probably makes more sense to repurpose an old laptop, or buy a refurb mini pc which for a similar $400 price tag would be substantially more powerful. One con of that approach is you can spend several weekends getting everything running linux properly, whereas with the Pis that's all done for you. Another is the idle power consumption would be much higher than my slow Pi 3Bs.

![](/images/screen-shot-2022-12-02-at-8.02.59-pm-1.jpg)
