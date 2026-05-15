---
title: "Save Proxmox password in Chrome"
date: '2023-02-11'
slug: save-proxmox-password-in-chrome
aliases:
  - /2023/02/11/save-proxmox-password-in-chrome/
tags:
  - certificates
  - chrome
  - devops
  - homelab
  - https
  - proxmox
---

When I installed Proxmox, I'd used a secure, and therefore absurdly long and complicated root password. I do use a password manager, but don't have it integrated into Chrome, so it was buggging me having to find it and paste it in each time - why wasn't Chrome offering to save it for me?

Well, you'd guess it was something to do with this. I feel like Chrome is trying to tell me something here:

![](/images/screen-shot-2023-02-04-at-7.06.49-am.png)

Seems like a certificate thing. [These peeps](https://forum.proxmox.com/threads/how-can-i-save-pve-web-loginpassword-on-firefox-chrome.46180/) say that I need to import the CA from PVE, and one more [googlestep reveals](https://pve.proxmox.com/wiki/Import_certificate_in_browser) the certificate is on the Proxmox machine at `/etc/pve/pve-root-ca.pem` so we need to grab that.

![](/images/aint.jpg)

A while ago, I wrote a post about [using scp to copy files over ssh](/copying-a-file-via-ssh/), and you should totally know how to do that, but my daily drive for secure file copying is now [filezilla](https://filezilla-project.org/). Once you have a bundle of servers in VM's and containers that you revisit and move stuff around all the time, its just a big productivity step-up to have that list of hosts and credentials a tap away, plus having the visual arrangement of nested folders works for my brain somehow.

![](/images/screen-shot-2023-02-04-at-7.14.40-am-1.jpg)

On Mac, certificates need to live in the KeyChain, so you just drag the file into the certificates page. But it won't be trusted, so you need to go in and manually do that. Where it says "Use System Defaults" change it to "Always Trust".

![](/images/screen-shot-2023-02-04-at-7.19.54-am-1.jpg)

It was annoying at this stage to find that Chrome was still saying it was insecure - even though it had changed to saying the certificate was valid.

![](/images/screen-shot-2023-02-04-at-7.20.50-am.jpg)

Looking at the settings for the site in Chrome, there's an option for "Insecure Content" I try changing that to "Allow", but really I'm guessing by this stage.

![](/images/screen-shot-2023-02-04-at-7.21.15-am.png)

But it actually does help - I've got the little padlock. That wasn't quite the end since Chrome still wasn't offering to save the password, but clearing the cache fixed that.

![](/images/screen-shot-2023-02-04-at-7.24.08-am.png)
