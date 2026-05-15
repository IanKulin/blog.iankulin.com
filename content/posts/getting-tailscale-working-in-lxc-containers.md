---
title: "Getting Tailscale working in LXC containers"
date: '2023-10-18'
slug: getting-tailscale-working-in-lxc-containers
aliases:
  - /2023/10/18/getting-tailscale-working-in-lxc-containers/
tags:
  - homelab
  - lxc
  - proxmox
  - tailscale
---

![](/images/stoneyhawk_wireguard_mesh_network_9cc1d03b-813c-433e-9af6-4e92ba6f6783.jpg)

I've taken to running lots of my services in LXC containers under Proxmox. I like the feeling of installing in a VM, but it's lightweight. I like the backups, I like things being isolated from each other, I like moving them around between machines easily. I'm just a big LXC lover at the moment.

I'm also a Tailscale lover, and the generous number of nodes in the free tier means I now just routinely install them in my VMs and containers without a thought.

There is an issue with unprivileged LXC containers and Tailscale though. Unprivileged containers have less access to the host system's internals, and are therefore a bit safer, but part of that reduced access includes some of the networking stuff that Tailscale needs. If you try to install Tailscale, it will look fine, until you get to the `tailscale up` command, at which point it will say something like:

```
failed to connect to local tailscaled (which appears to be running as tailscaled, pid 3121). Got error: 503 Service Unavailable: no backend
```

There is an easy way to fix this, documented in a [Tailscale how to guide](https://tailscale.com/kb/1130/lxc-unprivileged/). Basically you need to stop the container and edit the LXC conf file. These are named by the container number. My container is 354, so the conf file is `/etc/pve/lxc/354.conf`

Add the lines:

```
lxc.cgroup2.devices.allow: c 10:200 rwm
lxc.mount.entry: /dev/net/tun dev/net/tun none bind,create=file
```

![](/images/screen-shot-2023-09-19-at-8.01.13-pm.png)

This creates a TUN/TAP device (commonly used for VM networking) and creates a bind point to it inside the container. The effect of this is to enable the container to work with TUN/TAP devices and use them for networking purposes. This can be essential for various networking-related applications or services running within the container - including, in this case, Tailscale.

Start the container again, redo your `tailscale up`, and you should be in business.
