---
title: "Using NAS for Proxmox backups"
date: '2023-04-10'
slug: using-nas-for-proxmox-backups
aliases:
  - /2023/04/10/using-nas-for-proxmox-backups/
tags:
  - backups
  - devops
  - homelab
  - linux
  - proxmox
  - storage
  - synology
---

[A few weeks ago](/moving-a-vm-between-two-proxmox-hosts/), I was very excited to be able to take a snapshot of a virtual machine, copy it across the network from that Proxmox node, copy it back across the network to a different Proxmox node, start it there, and have it up and running, without it noticing it was actually on different hardware.

Backing up a VM is pretty simple, you just click on the node, choose _Backup_ and click the _Backup Now_ button. The ease, and completeness of backing up a VM is one of the main reasons I'm using Proxmox for my systems.

<a href="/images/screen-shot-2023-04-07-at-12.02.59-pm.png"><img src="/images/screen-shot-2023-04-07-at-12.02.59-pm.png" width="800" alt=""></a>

By default, VM backups are saved to the "local drive" - actually the `/var/lib/vz` directory. This would not be useful if the physical machine dies, but also it's not convenient to restore to a different machine. Ideally you'd have a central place to store these files that was accessible to all the Proxmox nodes.

This is exactly the situation I've setup with my lab, the NAS is the storage for the VM backups. Each of the Proxmox nodes uses the same directory for backups, so moving a machine from one node to another is a simple as backing it up on one node, stopping the VM, and restoring it on another node just by choosing the backup file to restore in the web GUI.

### Steps

Proxmox can use all sorts of shares as a location for backups (and other files such as the ISO's used to boot new machines), but the simplest is probably [NFS](https://en.wikipedia.org/wiki/Network_File_System). This is also straightforward to do from the Synology NAS.

In the web interface for the NAS, go into _Control Panel_, _Shared Folder_ and create a new shared folder. I called mine Proxmox. One of the tabs there is for NFS permissions - just add the IP address of the Proxmox node that you'd life to access the folder.

![](/images/screen-shot-2023-04-07-at-1.46.02-pm.png)

It's not much harder from the Proxmox end. Although the storage you add will appear at the node level in the _Server View_ of the web GUI, it is added at the _Datacenter_ level.

Go into _Storage_, select _Add_ and choose _NFS_.

<a href="/images/screen-shot-2023-04-07-at-2.00.04-pm.png"><img src="/images/screen-shot-2023-04-07-at-2.00.04-pm.png" width="800" alt=""></a>

Then enter an ID (this will be the name of the storage in Proxmox) and the IP address. If you wait half a second, then you can click the dropdown for all the folders that are shared from that IP address.

![](/images/screen-shot-2023-04-07-at-2.06.19-pm.png)

The last field is content - this refers the the type of Proxmox stuff you want to keep in there - for backups, you just need VZDumps, but I usually click on everything since I'll also use it for ISOs for new VMs and templates for LXCs.

![](/images/screen-shot-2023-04-07-at-2.11.03-pm.png)

Once you've added that, the storage will appear in the server view, but also as an option when you go into _Backup_ for a VM and select _Backup Now_.

![](/images/screen-shot-2023-04-07-at-2.15.53-pm.png)
