---
title: "Caching APT updates"
date: '2023-10-03'
slug: caching-apt-updates
aliases:
  - /2023/10/03/caching-apt-updates/
tags:
  - ansible
  - apt
  - devops
  - homelab
  - linux
---

It's bothered me for a while that all these VM's are pulling down a lot of the same updates. As well as needlessly using some bandwidth, I'm hammering the update servers (that I don't pay for) with the same requests over and over. I did briefly consider running my own mirror, but that's not simple, plus I'd then be mirroring a heap of files in a complete repository that I'd never use. What I really needed was some sort of cache so once I'll pulled down an update, it would hang around for a few days being available to other machines on the local network. Luckily, that exact thing exists - [APT Cacher NG](https://www.unix-ag.uni-kl.de/~bloch/acng/html/index.html).

It works pretty much as described above - all of the machines on the LAN have their APT calls proxied through a little server. If the server doesn't have a copy of the appropriate package, it pulls it down and delivers it. If it's got a good copy already, it just provides that.

### Installing the server

I decided an unprivileged LXC container would be the perfect base for this service. I created one from the Debian 12 image with 1MB RAM but a largish 30GB drive. I don't really have any feel for how big the cache will get under normal use so I erred on the large side. It's not doing any computationally expensive work, so one CPU is plenty.

<a href="/images/screen-shot-2023-08-20-at-10.42.06-am.png"><img src="/images/screen-shot-2023-08-20-at-10.42.06-am.png" width="900" alt=""></a>

Then we just install it, and start and enable it as a service.

```
apt install apt-cacher-ng
systemctl start apt-cacher-ng
systemctl enable apt-cacher-ng
```

During the install, it asked me about https:

<a href="/images/screen-shot-2023-08-20-at-10.46.32-am.png"><img src="/images/screen-shot-2023-08-20-at-10.46.32-am.png" width="900" alt=""></a>

I said no, but then to enable it, I had to (after the installation) edit the config file at `/etc/apt-cacher-ng/acng.conf` to uncomment the line

`PassThroughPattern: .* # this would allow CONNECT to everything`

With that done, and the service restarted, we're now serving proxies at localhost:3142, and also a little web page with some advice.

![](/images/screen-shot-2023-08-20-at-2.37.46-pm.jpg)

### Installing the client

The two bits of information I've put red boxes around are the things we need to do to enable `apt` on the client machines to use the cache. We need to create a file called `/etc/apt/apt.conf.d/00aptproxy` and add the single line to it of:

`Acquire::http::Proxy "http://192.168.100.37:3142";`

Note that the ip address will be different on yours, just copy it off the little web page. Since I've got a heap of machines to do this do, I made the `conf` file once and pushed out out with Ansible.

<a href="/images/screen-shot-2023-08-20-at-3.00.26-pm.png"><img src="/images/screen-shot-2023-08-20-at-3.00.26-pm.png" width="900" alt=""></a>

The `hosts: local` in the pkaybook refers to the `local: children` group in my hosts ini file.

![](/images/screen-shot-2023-08-20-at-3.14.24-pm.jpg)

### Statistics

If you're curious to see what the savings are, there's another web page served by the cache at `<server ip>:3142/acng-report.html`

![](/images/screen-shot-2023-08-20-at-3.16.27-pm.png)

Further down on that page are some options that can be changed as well.

### Resources

I learned most of this from [this video by RickMakes](https://www.youtube.com/watch?v=t8kI4YwdvRA), and [this Linux Help page](https://www.linuxhelp.com/how-to-set-up-apt-caching-server-using-apt-cacher-ng-on-debian-11-3).
