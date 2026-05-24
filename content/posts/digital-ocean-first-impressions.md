---
title: "Digital Ocean first impressions"
date: '2023-08-19'
slug: digital-ocean-first-impressions
aliases:
  - /2023/08/19/digital-ocean-first-impressions/
tags:
  - devops
  - hosting
  - ux
  - vps
---

I've been thinking about the time it takes me to provision a guest VM in Proxmox. I seem to remember on [BinaryLane](https://www.binarylane.com.au/) it was seconds rather than minutes. This seemed to be a good excuse to use the free credit I've heard about for [Linode](https://www.linode.com/lp/free-credit-100/?promo=sitelin100-02162023&promo_value=100&promo_length=60&utm_source=google&utm_medium=cpc&utm_campaign=11178784684_109179223363&utm_term=g_kwd-2629795801_e_linode&utm_content=466889596558&locationid=1000676&device=c_c&gclid=CjwKCAjw-7OlBhB8EiwAnoOEk9lQtzb_l17rAJmoU1KzhTUcWc6TF6C8KBTZU3j6tJ3d1qLWqqiRgxoC6qUQAvD_BwE) or Digital Ocean hundreds of times in podcast adverts, so I claimed the [$200 credit for being a Late Night Linux listener](http://do.co/lnl) at Digital Ocean. They extracted $5 out of me in the process, so I guess they are in front on that transaction. $200 would run a little VM for a couple of years at their rates, but of course it's limited to two months, at the end of which I will have an account sitting there, with my credit card already recorded - so all the friction is gone if I need an internet facing machine for some purpose - which is clearly their dastardly plan

<a href="/images/screen-shot-2023-07-11-at-7.50.07-pm.png"><img src="/images/screen-shot-2023-07-11-at-7.50.07-pm.png" width="351" alt=""></a>

The process of creating a 'droplet' (that's what they call their VM's) was straightforward - select the datacentre, machine size etc You can upload your SSH key which is a nice touch.

When I got to the end of all that, I hit create and timed the boot up of the Debian 12 system I'd chosen - 42.13 seconds.

I could ping the public IP, so it existed, but couldn't ssh in as root, and didn't know my user name. After trawling through their Getting Started docs, I found one that said to use your email that you signed up with. That didn't make sense or work. I [watched a video](https://www.youtube.com/watch?v=kzThZOZj1S4&t=417), then searched further and found I should have gone into the advanced options and written a script to add a user - a sample one was provided.

I destroyed the first machine and created a second one with the sample user script (which I've since gone back and searched for but could not find) which basically adds the user and assigns the ssh key. Once that was booted I could ssh in, but not sudo since I didn't know the password.

There is a 'console' so I used that to set a password for the user the script had created, then was able to both ssh in and use sudo. I guess the idea of the script is great if you know what you're doing and going to be creating a lot of VM's, but this was a painful start compared to [BinaryLane](https://www.binarylane.com.au/) or my homelab. I figured out afterwards, this was because I'd chosen Debian for the distro - you can't ssh in as root. If I choose a more relaxed distro, I could do that, and create my user then patch up the root access.

The rest of the experience was fine - the web interface is clear enough apart from my initial grumble. I couldn't paste into the web console, and I've noticed that in Proxmox as well so I guess that's some sort of limitation. In any case, once you've set up your ssh user properly you never need use it again.
