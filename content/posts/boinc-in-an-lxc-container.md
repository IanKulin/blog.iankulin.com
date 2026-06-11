---
title: "BOINC in an LXC container"
date: '2023-10-09'
slug: boinc-in-an-lxc-container
aliases:
  - /2023/10/09/boinc-in-an-lxc-container/
tags:
  - boinc
  - homelab
  - lxc
---

![](/images/boinc_logo.png)

Years ago, I was very keen on the [SETI@home](https://youtu.be/WwxTc6pFOcU) project that used a distributed computing model whereby packets of digitized received radio data were farmed out to individuals' computers to be processed to look for any unusual signals that could potentially be from an intelligent extra-terrestrial source.

That's long since defunct, but the idea lives on with [BOINC](https://boinc.berkeley.edu/) - a system run out of Berkley that allows different science organisations to offer projects to run on individuals' computers.

I thought that figuring out how to get all that running in an LXC container would make a good blog post, and wasted about a day fiddling around with it, with limited success. I forget the exact details, but I think the projects I'd subscribed to via the [World Community Grid](https://www.worldcommunitygrid.org/) might have wanted serious GPU power which my container does not have - but I wasn't 100% sure I'd set everything up correctly. There was so many fiddly variables I wasn't confident to commit to posting about it.

It's my custom on the weekends to turn all my nodes on, and start every VM and container, even the testing ones on the dev node, then run the [Ansible playbook](/tags/ansible/) to do all of the `apt` updates. When I did that today, I noticed this CPU pulsing:

{{< youtube WwxTc6pFOcU >}}

Well, that seems like it's doing some serious work. Either I've been hacked and someone's mining crypto, or BOINC is working.

Each of the organisations enrolled in BOINC have a community page where you sign up and get an API key that identifies your computers to the project, and you can head there to see your contributions. Sure enough, I've been receiving, processing and returning packets.

![](/images/screen-shot-2023-08-27-at-7.12.05-pm.png)

This is another thing I'd like to return to later - I don't think it was as simple as following the [instructions](https://boinc.berkeley.edu/wiki/Installing_BOINC_on_Debian_or_Ubuntu) because I'd made my life a bit more complicated by running it in an LXC. It also occurs to me that this might be a good workload to use an orchestration tool like Kubernetes for - since I don't really have any actual need (excuse) to play with those.
