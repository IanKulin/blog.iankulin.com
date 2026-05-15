---
title: "Your own Aussie server on BinaryLane"
date: '2023-02-05'
slug: your-own-aussie-server-on-binarylane
aliases:
  - /2023/02/05/your-own-aussie-server-on-binarylane/
tags:
  - binarylane
  - homelab
  - vps
  - web-dev
---

Listening to podcasts, I've been jealous of US developers who seem to have masses of $5/month VPS (Virtual Private Server) options. When I looked for similar Australian offerings a few months ago, they all seem to start at around $35 which is outside of my 'have a play with something' budget range.

I could of course use one of the international options, but one of the main apps on my app ideas list needs to be hosted in Australia and work under Australian data privacy rules. That might be the case for Digital Ocean (or other US companies) if you select an AU server, but I'm not a lawyer. For the imaginary clients of my imaginary app, me being able to say that the hosting is with an Australian company in Australia would be a plus.

I was having another look recently and discovered that [Mammoth](https://www.mammoth.com.au/) (who are reputable Australian VPS providers) have a service branded "[binary lane](https://www.binarylane.com.au/)" that is aimed at developers needing to quickly stand up test servers that are at this low end price point.

[![](/images/screen-shot-2023-01-28-at-12.49.14-pm.png)](https://www.binarylane.com.au/)

I mean, "ex GST" is a bit sly, but still, this is definitely in the starting price category I'm interested in. Naturally the prices scale up as your needs do.

I started hitting buttons to make an account, and true to the advertising, I was logged into an Ubuntu (you can chose from a heap of ISOs or upload your own) server that was live on the internet, hosted from Sydney, with it's own IP address inside a minute. A few minutes after that, I'd done updates, installed Docker and had a website live on the internet.

It has a nice panel interface in their web site with a console and some vital statistics and information.

![](/images/screen-shot-2023-01-28-at-1.09.06-pm.png)

Although convenient, the webpage console has a tiny lag I find unsettling, so as soon as I had the basics sorted out I switched to ssh from my MacBook terminal.

This was a super painless experience, and super affordable. Since they are in the business of selling you more VPS capacity, it looks like the process of scaling up your virtual machine as needed is going to be painless as well.

My plan for this VPS is to use it to learn how to add a domain, set up SSL, and eventually just keep it as a test server for apps and api endpoints.
