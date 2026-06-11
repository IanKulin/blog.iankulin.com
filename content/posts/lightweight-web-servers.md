---
title: "Lightweight Web Servers"
date: '2023-09-15'
slug: lightweight-web-servers
aliases:
  - /2023/09/15/lightweight-web-servers/
tags:
  - flask
  - homelab
  - monitoring
  - node
  - python
  - uptime-kuma
  - web-dev
---

![](/images/screen-shot-2023-08-02-at-9.09.48-pm-2.png)

I've been using the excellent [Uptime Kuma](https://github.com/louislam/uptime-kuma) for my monitoring, but a couple of recent incidents - an external USB mount disappeared on a remote machine, an NVME drive filled up on a different node and stopped backups working because of a configuration error - have made me start to think about more robust monitoring.

The are many great tools for this - [Nagios](https://www.nagios.org/), [Prometheus](https://prometheus.io/) etc. but they are pretty substantial time investments for the excellent power. They can save time series data and display them beautifully. However, all I really want is to add some extra ability to Uptime Kuma.

Uptime Kuma is already pretty great - it can parse a webpage to search for a particular phrase, it can execute searches in popular databases, it can ping, check a docker container is running and all sorts of other tricks - but it can't check memory use of a service, or if a machine is running out of disk space. Uptime Kuma works in binary - things either pass a check, or they don't. It does do some nice graphs of ping times, but that's about all.

I could expose some of this data - disk space free, CPU temp, checking a mount is working - pretty easily in a little Node endpoint. But it thinking about this, it made me wonder what the overhead of running Node (probably with Express) to carry out this menial task might be. I was thinking that the alternatives would be to use python/flask, or just to write it in C or Golang.

[![](/images/screen-shot-2023-08-02-at-9.34.50-pm.png)](https://dev.to/wickdchromosome/is-the-pain-worth-the-gain-writing-webapps-in-c-benchmarks-vs-flask-and-nodejs-14l0)

Whilst searching for answers about this, I found this excellent article from Bence Cotis. It turns out, that for very low loads (I'll probably hit these endpoints once every five minutes) C is a bit better, but probably not (in my opinion) worth the hassle. I'll stick to Node.
