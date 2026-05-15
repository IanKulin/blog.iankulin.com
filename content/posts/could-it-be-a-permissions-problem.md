---
title: "Could it be a permissions problem?"
date: '2023-03-05'
slug: could-it-be-a-permissions-problem
aliases:
  - /2023/03/05/could-it-be-a-permissions-problem/
tags:
  - linux
  - permissions
  - posts
---

![](/images/padlock.jpg)

Unix, and therefore Linux, was built from the ground up as a multi-user system. Thanks to this, great security is baked in, for example every file has permission attributes for it's owner, the group the owner is a member of, and then everyone. For example, it might be a good idea if I can read, write and execute my own files, but the other members of my group can just read them, and any other user on the system has none of those rights.

I [talked a bit about this](/folder-ownership-problems-with-jellyfin/) when I was solving the first round of problems with getting Jellyfin working. I actually solved all of those problems - they were permissions related. Once I'd figured out the group id of the jellyfin user and applied that when mounting the NAS I had a week of blissful media consumption on the TV (via Google TV Chromecast), on my laptop, and phone. The eventual plan for this little box is to move it offsite though, so I needed TailScale, which has worked perfectly and effortlessly everywhere else I'd tried it, but it turns out it is not happy living in an LXC container on Proxmox which is where my Jellyfin instance was running.

Googling around, it sounds like it is possible, but more work than I was prepared to invest, and didn't actually needed to. The little i3 it is going to live on has plenty of headroom to run a full VM so I decided to do that.

I started from scratch with a Debian VM and had it working perfectly, but then an hour or so after I'd downloaded all the metadata for my content, some, but not all of the posters would disappear. Once again, the problem turned out to be permissions (Jellyfin wanted write access to the media locations even though I'd told it not to save metadata there). I solved that with the [cursed 777](https://pimylifeup.com/chmod-777/) then did something terrible to the jellyfin process so now it would not start again.

Sadly, I had not saved a snapshop before I started messing around with things I only half understand.

In the process of looking for a solution to the jellyfin process retrying starting five times then dying after I'd tried to restart it for a reason I can't even recall, I stumbled on a StackExchange that was my exact problem. In the thread of answers, one of them was just "Use the container version". I took slight offence at this, as did OP, but when the commenter pointed out that these fiddly installation problems that lead you all over the place and are painful because your configuration is different to everyone else's, and the problem could lie there - is the exact problem containers are intended to solve.

I've taken that advice on board and installed the official container version. First problem I've run into - Jellyfin can't see my media folder - permissions.

ANY problem you have running something on Linux, you should always start thinking about it in terms of permissions. Who is the user, what are they acessing?
