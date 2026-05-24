---
title: "Proxmox Hypervisor"
date: '2023-02-01'
slug: proxmox-hypervisor
aliases:
  - /2023/02/01/proxmox-hypervisor/
tags:
  - homelab
  - proxmox
  - vm
---

I [mentioned a while ago](/pi-server/) that the price of the [Raspberry Pi4](https://www.raspberrypi.com/products/raspberry-pi-4-model-b/specifications/) was getting such that it's smarter to purchase one of the little business workstations instead. Depsite having little need for such a thing, I went ahead and bought an [HP Elitedesk 800 G1](https://support.hp.com/au-en/document/c04266271) "mini" PC. It has 8GB RAM (which is the max for the Pi4) as well as a 128GB SDD, the processor is an Intel i5.

![](/images/screen-shot-2023-01-26-at-10.54.25-am.jpg)

This compares pretty well with the 8GB Pi4 which only has a fraction of the storage (on an SD card) at around $400. One area where the Pi would have an edge might be in power consumption - I expect it would be a bit less. One possible catch for young players is that the HP has a 'display port' rather than HDMI for the screen connection, so pick up a $5 adapter if you're getting one. The metal case and nice finishing on the HP actually looks really great in my office compared with my Pi 3b+ dev server that's sort of hanging on the end of a cat5 cable.

My reason (excuse) for getting the HP is that I'm quite interested in getting some experience with (having a play with) deploying web apps in Docker containers. I'm also thinking that having better Linux skills and some understanding of devops would be helpful for working in IT in any capacity.

Virtualization (running several servers inside one physical server) has a number of benefits anyway, but when your main purpose is to fiddle around with things, it's the perfect tool. How this works is that you have a layer between the hardware and the virtual machines (VMs) called the hypervisor. The hypervisor deals with the hardware, and allocates resources to the separate VMs it is hosting. It's probably worth underlining separate in that sentence. The VMs can be set up to communicate via networking, or have access to shared storage, but they are running independently. If one of them crashes for some reason, the others are not affected.

In practice this means that I can install and run a number of different operating systems on my server. They can be stopped, started, exported, deleted etc all without affecting each other or any 'critical' systems I've got running in the same box. There's a number of choices for virtualization software. Microsoft has Hyper-V, VMWare is probably the most famous and has a reduced feature, free version called ESXi. That would probably be a good choice if you want directly transferable skills as VMWare have a substantial profile in the commercial world.

[![](/images/screen-shot-2023-01-26-at-12.40.24-pm.png)](https://enlyft.com/tech/virtualization-platforms)

But one of the missing features from ESXi is central management, and I want to play with my toys, and anyway, all the cool kids are using [Proxmox](https://www.proxmox.com/en/proxmox-ve).

<a href="/images/screen-shot-2023-01-26-at-12.25.13-pm.png"><img src="/images/screen-shot-2023-01-26-at-12.25.13-pm.png" width="1000" alt=""></a>

Like a couple of others on this list, Proxmox is built on Linux, and is a great choice for a home server setup. It is available for commercial use with different ([paid](https://www.proxmox.com/en/proxmox-ve/pricing)) tiers of support.

#### Installing Proxmox

There's quite a few guides around for installing and setting up Proxmox, I won't rehash all the steps here, but rather just make a couple of points, especially in relation to the HP 800 as a host.

I followed [this video from Darin Wood](https://www.youtube.com/watch?v=Flw_ycAwT3E). He did lead me a bit astray by fiddling around with the storage options using the command line. That's probably great if you are going to use an external NAS, but form my situation it would have been better to just leave all the storage defaults as they where - so when Darin gets to those commands just skip over them.

If Darin is a bit dry for you, a very enthusiastic alternative might be [this series](https://www.youtube.com/watch?v=Flw_ycAwT3E) from Jeremy Cioara ([Viatto](https://www.youtube.com/watch?v=Flw_ycAwT3E)).

Other points were:

-   I used Balena Etcher to flash the USB thumbdrive with the 7.3 [Proxmox ISO](https://www.proxmox.com/en/downloads/category/iso-images-pve)
-   To get the BIOS settings on the HP, you mash the F10 key on start up, but if you just want to choose the boot device, F9 does a better job of that (because you don't need to change it back later).
-   A couple of places mentioned having to turn virtualization on in the BIOS of the HP - it's in the [BIOS settings under security](https://h30434.www3.hp.com/t5/Desktops-Archive-Read-Only/How-to-turn-on-the-virtualization-on-hp-elitedesk-800-g1/td-p/3958272), but mine was already on, so perhaps it's on by default. [AMD and Intel processors have some special features to support virtualization](https://en.wikipedia.org/wiki/X86_virtualization#Hardware-assisted_virtualization), so that's probably what that's about.
-   There's a couple of config files to edit so you can do the updates - this is the step to make your life a bit complicated for not paying for Proxmox support. They are well explained in all the guides.

Apart from that, I pretty much just followed all the instructions and used the defaults (I used a made up email address, and `local` as my hostname), and I was soon up and running. The only other thing I did was go into my router settings to reserve the IP address that the Proxmox machine had picked up from the DHCP server to prevent (the low chance of) it changing in the future.

![](/images/screen-shot-2023-01-26-at-1.29.27-pm-copy.jpg)
