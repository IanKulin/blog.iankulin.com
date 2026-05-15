---
title: "Uptime Kuma &amp; NFTY"
date: '2023-02-15'
slug: uptime-kuma-nfty
aliases:
  - /2023/02/15/uptime-kuma-nfty/
tags:
  - devops
  - homelab
  - monitoring
  - nfty
  - uptime-kuma
---

[Uptime Kuma](https://github.com/louislam/uptime-kuma) is a monitoring tool suitable for self-hosting, and as well as being a good tool for monitoring the status of your network and applications, it's a nice smallish app to get started on Docker containers.

![](/images/screen-shot-2023-02-05-at-6.41.24-am.png)

Since it's in a container, you need to create a volume for it and pass it in to persist your settings. Then it's just a matter of adding each item you want to monitor. There's a heap of fancy options for this, the only three I've used are ping - just pings an address, http(s) - requests a page and checks the header for a 200, and http(s) keyword - looks at the returned page for a keyword in the html.

You choose the time intervals for all these. Additionally you can set up a notification for each. This is a great idea - I'm not sitting in my datacentre command room watching Uptime Kuma all day, I need to know on my phone if a CAT5 cable's been pulled out inadvertently while I was vacuuming.

![](/images/pucker_modern_incident_command_center_with_a_wall_of_screens_sh_8807037d-0d9d-4f28-944f-4b8760eef8f1.png)

There's lots of options for how to do this, including messaging platforms such as Telegram and Discord. I had a look on [r/selfhosted](https://www.reddit.com/r/selfhosted/comments/z0gpr2/free_push_service_for_uptime_kuma/) to see what was recommended, and discovered [NFTY](https://ntfy.sh/) which is an amazing little service. It has Android and iOS apps, in the app you subscribe to an endpoint, then a notification can be sent to your phone with a simple http get, for example:

```
curl -d "This message will pop up on phone" ntfy.sh/ian_test
```

![](/images/screen-shot-2023-02-05-at-12.39.22-pm.png)

![](/images/img_4055.jpg)

The `ian_test` part of the url is called the _topic_, and in the app you can subscribe to several topics. It's worth noting this is all completely open. Anyone can send messages to the ian\_test topic, and anyone can receive them. You should choose a topic name that's likely to be unique, and be mindful that you're leaking intelligence. For example:

```
curl -d "CCTV offline - 12 George St" ntfy.sh/maquarie_bank
```

would not a be a good use case. Get something more secure for that application. It's probably not going to be free.

Speaking of which, NFTY is free, including the server. It is possible (and probably a good idea since then you could add a little security) to self host it. It's such a great little tool, and just so immediately and completely achieved what I wanted with zero drama and low effort, I hit the [github sponsor button for it](https://github.com/sponsors/binwiederhier).
