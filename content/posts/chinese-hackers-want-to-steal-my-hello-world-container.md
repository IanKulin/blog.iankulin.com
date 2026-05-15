---
title: "Chinese Hackers Want to steal my Hello World container"
date: '2023-02-06'
slug: chinese-hackers-want-to-steal-my-hello-world-container
aliases:
  - /2023/02/06/chinese-hackers-want-to-steal-my-hello-world-container/
tags:
  - homelab
  - linux
  - security
  - server
  - ssh
---

A smart thing to do after setting up a server on the internet, is to set up SSH keys and then turn passwords off for SSH. The reason for this is that scanning for open port 22 on IP addresses, then brute forcing password files on them is pretty much hacker 101. So if you have passwords turned on, and especially if you have a weak password you are really inviting someone to take over your server as root and add it to their botnet army for liking Putin's twitter posts or whatever.

When I was writing [the post about looking for the sudo attempt](/sudo-incident-reports-where-do-they-go/) 'report', you might have noticed some sshd timeouts:

![](/images/screen-shot-2023-01-28-at-12.08.21-pm.png)

That's what's going on there. SSH has a timeout value of about a minute. I'd also guess those kex\_exchange\_identification messages are suspicious as well. I thought I'd google one of the IP addreses:

![](/images/screen-shot-2023-01-28-at-12.18.14-pm.png)

Oh, so it's China, and multiple people are reporting SSH brute force attacks:

![](/images/screen-shot-2023-01-28-at-12.20.35-pm.png)
