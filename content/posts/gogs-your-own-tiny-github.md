---
title: "Gogs - your own tiny GitHub"
date: '2023-12-06'
slug: gogs-your-own-tiny-github
aliases:
  - /2023/12/06/gogs-your-own-tiny-github/
tags:
  - git
  - gogs
  - homelab
---

![](/images/screen-shot-2023-11-20-at-8.08.37-pm.jpg)

(edit: - I've [had a rethink about](/gogs-gitea-forgejo/) my source hosting)

Once you're familiar with coding tools, like the excellent [VS Code](https://code.visualstudio.com/), and [git](https://git-scm.com/docs/git), it's immediately apparent that these tools can be applicable for other purposes. A great example is that I now do my financial accounting in plain text (using [beancount](https://github.com/beancount/beancount)). I have a python script that converts by bank account data in to the beancount format text files, I edit them in VS Code with a [plugin](https://marketplace.visualstudio.com/items?itemName=Lencerf.beancount) that does the syntax highlighting and checks everything balances.

Naturally, I want to version control that, so my text based accounts are all committed to git. But I don't really want to push them up to GitHub, even to a private repo. I want to push them to a git server that's available for me to pull down from anywhere, and is backed up with all my other data.

It actually is possible to run a git server to do this with vanilla git, and I'm sure that's how the hairy chested [sysadmins of old](https://www.linuxfoundation.org/blog/blog/classic-sysadmin-how-to-run-your-own-git-server) do it. But I want a web gui a bit like GitGub that I'm familiar with. Of course, GutHub does all that other sweet stuff like CI/CD, but I don't need that for my accounts.

There are a couple of popular options for this job, one is [Gitea](https://about.gitea.com/) which does lean into that CI/CD functionality, and the other is [Gogs](https://gogs.io/), which being a bit simpler, is also a bit simpler to get going. When I say simpler, it's still massive overkill for my needs - you can have thousands of users, do pull requests, track issues, write project wikis - all that good stuff. It also has webhooks so you can knit together a pipeline with drone.io, Jenkins or other CI/CD tools. So I went with Gogs

### Installing

It's not mentioned on the [install page for Gogs](https://gogs.io/docs/installation), but there is an official [container build](https://hub.docker.com/r/gogs/gogs/). Possibly this is because there's a couple of rough edges that I'll get to shortly. I've talked before about how I like to run services in Docker on LXC, so I won't go over that again. Here's my docker-compose:

```yaml
version: '3'

services:
  gogs:
    image: gogs/gogs
    container_name: gogs
    ports:
      - "23:22"
      - "80:3000"
    volumes:
      - ./data:/data
    restart: always
```

However, there is a gotcha I hadn't encountered before - when I `docker compose up` with this, I got the error "failed to register layer: unlinkat /app/gogs/docker/build: invalid argument".

<a href="/images/screen-shot-2023-11-20-at-8.36.42-pm.png"><img src="/images/screen-shot-2023-11-20-at-8.36.42-pm.png" width="900" alt=""></a>

When I asked ChatGPT about this, she thought it might be to do with the storage driver. I didn't know what that was so I spent time googling around.

<a href="/images/screen-shot-2023-11-20-at-8.40.36-pm.png"><img src="/images/screen-shot-2023-11-20-at-8.40.36-pm.png" width="900" alt=""></a>

Pretty soon, I discovered [this thread](https://forum.proxmox.com/threads/docker-failed-to-register-layer-applylayer-exit-status-1-stdout-stderr-unlinkat-var-log-apt-invalid-argument.119954/). Part way down there's the suggestion to edit `/etc/docker/daemon.json` to add a different storage driver, followed by many comments of "Thanks!" and "That fixed it". I followed that advice, (it uses a different driver "vfs" rather than "aufs" as suggested by ChatGPT) and then the container came up properly.

With that out of the way, and the container live, if you go to the port you've specified in the docker-compose file (mine was :80), you'll be greeted with the "Install Steps For First-time Run".

<a href="/images/screen-shot-2023-11-20-at-8.54.19-pm.png"><img src="/images/screen-shot-2023-11-20-at-8.54.19-pm.png" width="900" alt=""></a>

They are not joking. You won't be able to guess these settings. I guess they haven't put a lot of work into the container experience - some of these settings need to be for inside the container, and some are used for prompting the user, which are outside of the container settings. I suspect this rough edge is why the container install is not on the Gogs website yet.

Anyway, after I'd ignored this suggestion, run into problems, google them, found closed issues where people had had the same problem and the devs pointed them to the perfectly clear guidelines we hadn't read...

I'll leave you to read the guidelines. The only other things of note is that I used the SQLite database to make my life simpler, and you don't need to muck around making an admin account - it just makes the first person to log in the admin. Once that's all done, you have to create a user account, then log in with it. You'll be greeted by a reasonably familiar sight.

<a href="/images/screen-shot-2023-11-20-at-9.07.30-pm.png"><img src="/images/screen-shot-2023-11-20-at-9.07.30-pm.png" width="900" alt=""></a>

If you go ahead and create a repository in Gogs, it will give you the commands to push a repo up:

<a href="/images/screen-shot-2023-11-20-at-9.09.28-pm.png"><img src="/images/screen-shot-2023-11-20-at-9.09.28-pm.png" width="900" alt=""></a>

So let's do that:

![](/images/screen-shot-2023-11-20-at-9.21.38-pm.jpg)

The back in our repo on Gogs:

<a href="/images/screen-shot-2023-11-20-at-9.22.53-pm.png"><img src="/images/screen-shot-2023-11-20-at-9.22.53-pm.png" width="1023" alt=""></a>
