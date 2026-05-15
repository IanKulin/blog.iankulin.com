---
title: "Problems mounting network share at boot"
date: '2023-03-01'
slug: problems-mounting-network-share-at-boot
aliases:
  - /2023/03/01/problems-mounting-network-share-at-boot/
tags:
  - linux
  - mount
  - nas
  - possibly-useful
---

![](/images/pucker_pretty_woman_putting_boots_on_comic_style_4590f478-67f8-4f8d-8e42-e38b9e059f37.png)

I had Jellyfin working nicely in an LXC container in Proxmox, but could not get Tailscale working in the container. Since this is going to be an important part of accessing my media away from home, I decided it was probably worth the extra bulk to run JellyFin in a VM.

Following [my own instructions](/accessing-a-synology-nas-from-linux/), I had the mount command in the /etc/fstab file so it would persist across reboots. It looked a bit like this:

```
//192.168.100.25/media /mnt/media cifs username=jelly,password=jellypass,uid=1000,gid=115,file_mode=0660,dir_mode=07
```

The problem I had was that this was not mounting the NAS at boot time, but if I reran it with `mount -a` it worked perfectly. A likely cause for this problem is that the network interface is not properly up at the time the mount is being tried.

I found a few different suggestions for this, but the one that worked for me and I liked the most is from the first answer in [this StackExchange question](https://askubuntu.com/questions/43363/how-to-auto-mount-using-sshfs/1242516#1242516).

```
//192.168.100.25/media /mnt/media cifs username=jelly,password=jellypass,noauto,x-systemd.automount,_netdev,uid=1000,gid=115,file_mode=0660,dir_mode=07
```

From that answer, the explanation for these is:

> -   `noauto` will stop the no-brainer actions like forcibly mounting whatsoever at booting regardless if the network is up or not.
> -   `x-systemd.automount` is the smart daemon that knows when to mount.
> -   The `_netdev` tag will also identify that it uses network devices, thus it will wait until the network is up.​​​​​​

I had tried `_netdev` by itself, but that wasn't enough magic. The three together was.
