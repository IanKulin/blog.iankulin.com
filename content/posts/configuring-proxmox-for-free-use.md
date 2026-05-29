---
title: "Configuring Proxmox for Free Use"
date: '2023-02-16'
slug: configuring-proxmox-for-free-use
aliases:
  - /2023/02/16/configuring-proxmox-for-free-use/
tags:
  - devops
  - homelab
  - proxmox
---

I installed Proxmox on my second server last night, and tonight when I ran `apt update` I ran into the error you get when you haven't bought a license.

```bash
Err:5 https://enterprise.proxmox.com/debian/pve bullseye InRelease             
  401  Unauthorized [IP: 103.67.14.50 443]
Reading package lists... Done                                                  
E: Failed to fetch https://enterprise.proxmox.com/debian/pve/dists/bullseye/InRelease  401  Unauthorized [IP: 103.67.14.50 443]
E: The repository 'https://enterprise.proxmox.com/debian/pve bullseye InRelease' is not signed.
N: Updating from such a repository can't be done securely, and is therefore disabled by default.
N: See apt-secure(8) manpage for repository creation and user configuration details.
```

Even though I guess it was only a month ago (let that sink in people who think the raspberry Pi they just bought is going to be the last homelab hardware they buy 😊) since I set up my first Proxmox server, I'd already forgotten there's a step to enable it to get updates without a subscription.

There's a couple of little steps for this. They are both [here on the Proxmox wiki](https://pve.proxmox.com/wiki/Package_Repositories#sysadmin_enterprise_repo).

1.  edit `/etc/apt/sources.list.d/pve-enterprise.list` to comment out the single repository listed in there.
2.  edit `/etc/apt/sources.list` to look like this:

```bash
deb http://ftp.debian.org/debian bullseye main contrib
deb http://ftp.debian.org/debian bullseye-updates main contrib

# PVE pve-no-subscription repository provided by proxmox.com,
# NOT recommended for production use
deb http://download.proxmox.com/debian/pve bullseye pve-no-subscription

# security updates
deb http://security.debian.org/debian-security bullseye-security main contrib
```

Then you'll be good to go.

![](/images/screen-shot-2023-02-07-at-8.41.15-pm.jpg)
