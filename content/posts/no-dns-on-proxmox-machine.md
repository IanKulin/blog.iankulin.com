---
title: "No DNS on Proxmox machine"
date: '2023-03-17'
slug: no-dns-on-proxmox-machine
aliases:
  - /2023/03/17/no-dns-on-proxmox-machine/
tags:
  - homelab
  - network
  - proxmox
---

I had some more network weirdness setting up this new Proxmox machine. When I went to run the updates it couldn't resolve any of the addresses:

```
root@pve-kr01:~# apt update
Err:1 http://ftp.au.debian.org/debian bullseye InRelease
  Temporary failure resolving 'ftp.au.debian.org'
Err:2 http://download.proxmox.com/debian/pve bullseye InRelease
  Temporary failure resolving 'download.proxmox.com'
Err:3 http://security.debian.org bullseye-security InRelease
  Temporary failure resolving 'security.debian.org'
Err:4 https://enterprise.proxmox.com/debian/pve bullseye InRelease
  Temporary failure resolving 'enterprise.proxmox.com'
Err:5 http://ftp.au.debian.org/debian bullseye-updates InRelease
  Temporary failure resolving 'ftp.au.debian.org'
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
All packages are up to date.
W: Failed to fetch http://ftp.au.debian.org/debian/dists/bullseye/InRelease  Temporary failure resolving 'ftp.au.debian.org'
W: Failed to fetch http://ftp.au.debian.org/debian/dists/bullseye-updates/InRelease  Temporary failure resolving 'ftp.au.debian.org'
W: Failed to fetch http://download.proxmox.com/debian/pve/dists/bullseye/InRelease  Temporary failure resolving 'download.proxmox.com'
W: Failed to fetch http://security.debian.org/dists/bullseye-security/InRelease  Temporary failure resolving 'security.debian.org'
W: Failed to fetch https://enterprise.proxmox.com/debian/pve/dists/bullseye/InRelease  Temporary failure resolving 'enterprise.proxmox.com'
W: Some index files failed to download. They have been ignored, or old ones used instead.
```

So some sort of DNS problem. The entry for the DNS is in `/etc/resolv.conf` when I looked in there, it said:

```
search local
nameserver 127.0.0.1
```

Well, that does not seem great. I feel like it should be pointing at the DNS in my router, or even upstream at my ISP or google's DNS server. Before I dive in and start editing, I thought I'd check my other servers. The first one has clearly been altered as part of installing TailScale, so that wasn't much help, but on the dev machine it said:

```
search local
nameserver 192.168.100.1
```

Which is more like what I was expecting, that's the address given out by my DHCP server for DNS. I could just edit the new machine to this, but since this is the third lot of network related weirdness related to this install (the second was that my managed switch's web interface was down, and I couldn't ping it, but it was still passing traffic, [again](/netgear-gs108e-switch-problem/)), and the first, discussed in yesterday's post, was that DHCP had provided a dynamic address that was already assigned to another device.

I swapped out the network cable, and noticed the port lights flashing. Perhaps there is a broken pair in the other cable? It was odd that it was working sort of.

I reinstalled Proxmox from scratch, and carefully watched the console messages and checked all the network settings (it correctly picked up the reserved address and correct DNS server). Then everything worked.
