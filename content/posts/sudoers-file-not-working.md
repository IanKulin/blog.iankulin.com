---
title: "Sudoers' file not working"
date: '2023-02-27'
slug: sudoers-file-not-working
aliases:
  - /2023/02/27/sudoers-file-not-working/
tags:
  - homelab
  - linux
---

A couple of weeks ago, I posted [about the sudoers' file](/sudo-incident-reports-where-do-they-go/), and how there was a special tool for editing it since breaking it is a bad idea, and that in fact I needn't bother, since I can just add my user to the sudoers' group with:

```bash
usermod -a -G sudo ian
```

That worked (on Unbuntu) since `/etc/sudoers` contained a line saying:

```bash
# Allow members of group sudo to execute any command
%sudo	ALL=(ALL:ALL) ALL
```

I tried the same trick on a fresh Debian install today, and no dice:

![](/images/screen-shot-2023-02-26-at-3.32.49-pm.png)

I assumed this might mean that the `sudoers` file is different on Debian than Ubuntu, but no, that same line granting permission to the `sudo` group is there. My next guess is that I hadn't correctly added ian to that group. But no, that looks okay.

![](/images/screen-shot-2023-02-26-at-3.48.51-pm.png)

![](/images/offon.jpg)

Yup. Log out, log in...
