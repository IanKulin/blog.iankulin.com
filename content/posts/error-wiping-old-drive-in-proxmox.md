---
title: "Error wiping old drive in Proxmox"
date: '2023-08-31'
slug: error-wiping-old-drive-in-proxmox
aliases:
  - /2023/08/31/error-wiping-old-drive-in-proxmox/
tags:
  - devops
  - fdisk
  - homelab
  - linux
  - proxmox
---

<a href="/images/screen-shot-2023-07-22-at-12.19.42-pm-copy.png"><img src="/images/screen-shot-2023-07-22-at-12.19.42-pm-copy.png" width="568" alt="Error: disk/partition '/dev/sda3' has a holder (500)"></a>

When I popped in an NVME drive and freshly installed Proxmox to it, I assumed I'd just be able to wipe the SDD that had previously been the boot drive to set it up as a ZFS pool. However, when I tried to do the wipe, I was greeted with the error:

```
disk/partition '/dev/sda3' has a holder (500)
```

I assume this means there's a flag set on one of the Proxmox partitions to prevent accidental deletion or Proxmox thought that's where it was running from. It's likely that it's related to this message I had during installation that I haven't seen before:

![Detected existing 'pve' Volume Group(s)! Do you want to: rename VG backed by PV '/dev/sda3' to 'pve-OLD-D4DDE7DC' or cancel the installation?](/images/img_5830.jpg)

Since I didn't want to cancel the installation, I went ahead and told it okay. On the non-graphical 'console' version of the installer, this message is truncated, and the only option available is abort. I guess that's an installer bug. So if you are adding a extra boot drive to an existing Proxmox node, I suggest using the graphical installer.

When I Googled around for the "has a holder" error, there were several unanswered requests for help for this, several speculative answers, and [one that worked](https://www.reddit.com/r/Proxmox/comments/xff5ri/how_do_i_wipe_an_old_drive/).

<img src="/images/66d29d7d-bc29-4747-b92a-7fc7c790227f_text.gif" width="400" alt="">

You need to use `fdisk` to remove each partition. Take a note of the drive name - I could see in the Proxmox GUI that mine was sda, so the command to run was:

`fdisk /dev/sda`

You probably need to have a [read-up on](https://www.howtogeek.com/106873/how-to-use-fdisk-to-manage-partitions-on-linux/) `[fdisk](https://www.howtogeek.com/106873/how-to-use-fdisk-to-manage-partitions-on-linux/)` if you're not familiar with it, but basically, you're in the command mode, for one of the partitions (my `sda` had three) if you press the `d` key here it marks that partition for deletion. Even though the error message had said it was the last partition that was causing the headache, I just went ahead and deleted all of them. There's no warnings as you do this, and actually no changes have been made yet, that happens when you press `w` to write the changes. No warning here either. 🙂

![fdisk screenshot](/images/screen-shot-2023-07-22-at-12.29.16-pm.png)

That gave an error saying the third partition was still in use by the kernel, so I followed the advice to reboot, then I was able to wipe the drive in the Proxmox web GUI.

<a href="/images/screen-shot-2023-07-22-at-12.30.09-pm.png"><img src="/images/screen-shot-2023-07-22-at-12.30.09-pm.png" width="800" alt=""></a>
