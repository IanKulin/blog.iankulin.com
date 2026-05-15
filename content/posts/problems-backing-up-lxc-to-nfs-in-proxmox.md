---
title: "Problems backing up LXC to NFS in Proxmox"
date: '2023-09-24'
slug: problems-backing-up-lxc-to-nfs-in-proxmox
aliases:
  - /2023/09/24/problems-backing-up-lxc-to-nfs-in-proxmox/
tags:
  - devops
  - homelab
  - lxc
  - nfs
  - proxmox
---

If you create an unprivileged LXC container on Proxmox, then try to back it up to an NFS share, for example on a NAS, you'll get an error when it tries to build the temporary file.

![](/images/screen-shot-2023-08-14-at-9.15.29-pm.png)

The clue is in the `Permission denied` line. It is trying to create a temporary file on my NAS, and failing because of a [permissions](/could-it-be-a-permissions-problem/) problem. If I try the same backup to the local storage, it works fine.

The solution is to build the temporary file in the local storage. To do this, you need to edit the `/etc/vzdump.conf` on the Proxmox node to set the `tmpdir: /tmp`

![](/images/screen-shot-2023-08-14-at-9.16.14-pm.png)

Then if you run the backup again, it will be able to create the temporary file, and successfully copy it to the share.

![](/images/screen-shot-2023-08-14-at-9.15.20-pm.png)

It doesn't make sense to me how it has the permissions to copy the finished backup file to the share, but not create a temporary file there - but I'm not curious enough today to find out. Shout out to user [Dunuin](https://forum.proxmox.com/members/dunuin.96080/) in the Proxmox [forums](https://forum.proxmox.com/threads/cannot-backup-only-lxc-to-nfs-vm-works.90797/) for the suggestion to change the `tmpdir` in `/etc/vzdump.conf`
