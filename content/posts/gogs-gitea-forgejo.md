---
title: "Gogs, Gitea, Forgejo"
date: '2023-12-18'
slug: gogs-gitea-forgejo
aliases:
  - /2023/12/18/gogs-gitea-forgejo/
tags:
  - devops
  - forgejo
  - gitea
  - gogs
  - homelab
  - posts
  - web-dev
---

<img src="/images/img_7071-1.png" width="640" alt="">

I've been really pleased with [Gogs](/tags/gogs/) - it's lightweight, was simple to spin up, and has worked perfectly. But then this morning on Mastodon, there's a [post from @Codeberg.org](https://mastodon.social/@Codeberg@social.anoxinon.de/111471407276450348) describing a security vulnerability in their Git hosting project Forgejo. This issue also apparently affects Gitea and Gogs - what's up with that?

I actually already did spend a bit of time comparing Gogs and Gitea before deciding on Gogs, since I'd heard of people running Gitea over the past year or so, but only seen that Gogs seemed to be popular with self-hosters in a Lemmy post I'd read. My first impression was that Gitea was more focused on CI/CD and seemed to have a more complicated install process.

What I didn't do, was think about the project management and teams. It turns out that [Gitea](https://about.gitea.com/) was forked from [Gogs](https://gogs.io/) by contributors in 2016 due to [disagreements about the project management](https://blog.gitea.com/welcome-to-gitea/). Then at the end of 2022 [Forgejo](https://forgejo.org/) was forked from Gitea due to [Gitea moving the trademarks and domain into a company](https://forgejo.org/2022-12-15-hello-forgejo/) providing Gitea support.

The [CVE announcement from Forgeo](https://forgejo.org/2023-11-release-v1-20-5-1/), while a little snarky about their ancestors, does give the impression of a functional organisation that's able to deal with issues as they come up. It's a credit to the group to be in that position after just a year, and their [repo](https://codeberg.org/forgejo/forgejo) (which is dogfooded) seems plenty active.

I've only just started on Gogs, so it's still easy to move if that's what I decide. I guess my learning from stumbling upon this security announcement is more that I should:

-   take into account more than just project features when making these decisions
-   I need to be subscribed to the channels where I'd learn about security issues in the projects I'm using and their major dependencies.
