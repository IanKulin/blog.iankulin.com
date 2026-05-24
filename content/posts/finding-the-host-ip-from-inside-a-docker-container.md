---
title: "Finding the host IP from inside a Docker container"
date: '2023-08-07'
slug: finding-the-host-ip-from-inside-a-docker-container
aliases:
  - /2023/08/07/finding-the-host-ip-from-inside-a-docker-container/
tags:
  - devops
  - docker
  - homelab
  - linux
  - networking
  - nginx
  - node
---

Having successfully set up and tested my node.js api handling app behind nginx on a development VM in the homelab, I decided to move it to my VPS so I could start using it for real. I had a bit of trouble finding the nginx.conf files on the VPS, until I remembered I was running nginx in a docker container on this machine!

I got everything set up, I could hit the domain in a web browser and get served the static page, and I could <domain\_name>:3000/api/gnp\_temp.txt and get the file delivered by the node script, but if I tried <domain\_name>/api/gnp\_temp.txt - "Bad Gateway".

I looked at the nginx.conf over and over - it seemed fine. The location block was clearly being triggered, otherwise I'd be getting a 404. I dived into stack overflow to no avail. It was if http://localhost:3000 just wasn't working. But it definitely was when I `curl`ed it from the command line.

In desperation I started writing out an explanation to ChatGPT about the setup and my problem, and before I pressed enter realised - from nginx's point of view, http://localhost:3000 was an address _inside_ the container 🤦, what I needed was the address of the host, from the point of view of the docker container. Surely that must be a common requirement that's been solved.

From reading around, it seems like I should be able to just substitute `host.docker.internal` but that didn't seem to work. I opened a shell into the container to look at `ip a` or `/sbin/ip route|awk '/default/ { print $3 }'` but of course these containers are slim installs without the general tools you need.

Docker networking is a whole thing that I should learn, but I haven't yet, I just start up containers with whatever the defaults for networking are. But I figured the host must be part of the docker network, and a quick look in `ip a | grep docker` produced this:

```
3: docker0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc noqueue state DOWN group default 
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
```

Bingo. I popped that IP address into my nginx.conf and everything started working perfectly. That was forty minutes of learning I wouldn't have had to live through if I could have just turned around to a work colleague and asked.
