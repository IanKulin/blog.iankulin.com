---
title: "RAID Rescue"
date: '2023-04-04'
slug: raid-rescue
aliases:
  - /2023/04/04/raid-rescue/
tags:
  - homelab
  - nas
  - raid
  - synology
---

I'm in the process of shuffling disks around as I move towards my 3-2-1 storage arrangements. I thought after my extensive rsync adventures I'd mirrored everything everywhere, but then realised, with a sinking (no pun) feeling, after I'd repurposed a drive out of the 2 drive Synology as a USB caddy drive and wiped it, that I'd forgotten my audio book directory. All my rsync fiddling around had been on the video subdirectory of the media folder, not the whole media directory that included my audiobooks.

It's not the end of the world if I'd wiped them, I've just been working through downloading them from Audible and de-drming, so I could do that again in the few days I've got left till my subscription cancellation date comes around. That was a painful and slow process, so I don't really want to.

I still had one of the RAID drives that hadn't been wiped, so in theory it should have a full copy of the data, and if I put it back in the Synology by itself it should work. That would be the same situation as if one drive in the RAID pool had died completely.

A few screws, and a drive swap later and I'm looking at this:

![](/images/screen-shot-2023-03-31-at-4.35.40-pm-copy.png)

There must be a tiny bit of storage in the Synology, so it knows I've been fiddling around. I hit _Recover_, and it did the ten minute thing that I assume is it downloading and installing the new DSM.

During this process, it started beeping in a plaintive way. I couldn't access with the old Tailscale address, so I fired up the IP address to the web interface, logged in with the old credentials and was greeted with this:

![](/images/screen-shot-2023-03-31-at-4.08.58-pm.png)

It was not happy working in the degraded state, but the files were all still there, I was able to mount it to the other NAS and copy my files out. A success. The Tailscale package was still installed, so perhaps that business at the beginning was not really a new install of DSM, but some sort of checking.

This was a good experience, it is worthwhile to test these scenarios, and I'm reassured to discover the audible beeping when the RAID pool was degraded. At the moment while I get everything sorted I'm in the web interfaces a lot, but the dream is this learning and setup time comes to an end and I just consume my self-hosted services without much manual intervention. In that scenario, some un-ignorable beeping when the NAS needs attention is a good thing.
