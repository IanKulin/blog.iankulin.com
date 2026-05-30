---
title: "Using the GitHub Container Registry"
date: '2024-11-04'
slug: using-the-github-container-registry
aliases:
  - /2024/11/04/using-the-github-container-registry/
tags:
  - containers
  - devops
  - docker
  - github
---

As the number of little projects I'm running on VPSs grows, I need to have a regimented system for managing all that. I could be using something like [Coolify](https://coolify.io/), but, at least for the moment, I'd rather build my own system.

Currently my system is Nginx Proxy Manager (dockerised) in front of each app. If it's a static website, that's another dockerised Nginx, started with a compose file and with `www` and `conf` sub-directories that I've `git pull`ed from the project. It's not pretty.

It occurs to me that I could just be bundling each static website _inside_ a Docker image, then the only content for each website on the VPS would be a compose file. This has the extra appeal that eventually I could use GitHub CI/CD to rebuild the container so changing a website would be pushing my edits to main, then `compose down`, `pull`, and `up` on the VPS.

Currently I've only been using DockerHub for my containers, but the free plan only allows for a single private image, whereas on GitHub the free plan doesn't have a number of packages limit - rather it has a total storage (500MB) and monthly transfers (1GB) [limits](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-packages/about-billing-for-github-packages). Along with the aforementioned integration with GitHub CI/CD, this makes it the obvious place to store these images until my scale is large enough to set up my own registry (which I would probably do with [Forgejo](https://forgejo.org/) on a VPS since the limits of running that inside my Tailscale network is starting to be a friction point anyway).

Long story short - I want to start using the GitHub container registry, and this post steps through that.

## Access Tokens

If you set up your Docker Hub a while ago, you've probably forgotten that early on, you had to log into it from the command line with the `docker login` command. With Docker Hub, that's your usual username/password combo, but GitHub has a more fine-grained system of permissions, where you generate 'Personal Access Tokens'. This is quite cool, for example you can generate a token with add/update/delete access for your main development laptop, but then generate a different token that only has read access to use on the server where you need to deploy the image.

The Personal Access Token (PAT) is just used in place of a password when you log in. As well as the benefit of being able to control the permissions for each PAT when you create it, you also name them. This would be helpful for example if your software lead had their laptop stolen, and you needed to revoke the PAT for that device. It's also possible to set expiry dates for the PATs.

Generating the PATs is done in:

`GitHub | Profile | Settings | Developer Settings (left column, bottom) | Personal Access Tokens | Tokens Classic | Generate Access Token Classic`

If you have MFA set up (you should) it will ask for that. Then give it a 'Note' and the permissions you want for "Packages" - Container images are stored in the "Packages" section of GitHub (where it's also possible to store other artifacts such as your private NPM packages). In the example below we've asked for Read/Write/Delete access.

<a href="/images/screen-shot-2024-10-06-at-11.49.54-am.png"><img src="/images/screen-shot-2024-10-06-at-11.49.54-am.png" width="900" alt=""></a>

Once that's completed, you'll be shown a list of your existing PATs, plus the new one you've just generated. This is the only time it will ever be displayed in GitHub, so you need to copy it out to where you need it.

<a href="/images/screen-shot-2024-10-06-at-11.50.11-am.png"><img src="/images/screen-shot-2024-10-06-at-11.50.11-am.png" width="900" alt=""></a>

## Logging in

Before we can push an image to the GitHub Container Registry (ghcr.io) we'll need to use this PAT to log in. I'm using the command:

```bash
docker login --username <github username> --password <PAT we just generated> ghcr.io
```

`ghcr.io` is just the URI for the container registry. It will complain about you pasting the PAT in the command line like that - I guess it's in your bash history now. I'll leave you to google how to do that more securely.

![](/images/screen-shot-2024-10-06-at-12.02.37-pm.png)

Note that you can be logged into several container registries at once. Logging into the ghcr.io won't mean that you'll need to re-logging to DockerHub later; that will still work fine.

## Pushing

Once that's done, you can push images just as you are used to with DockerHub, with the exception that you need to specify the container registry as part of your image name. It's possible to do that with `hub.docker.com` as well, but Docker privileged themselves to make it a default. To use a different registry (in our case ghcr.io) it needs to be included in the image name, along with your GitHub use name.

```bash
docker push ghcr.io/<github user name>/<container name>:<tag>
```

![](/images/screen-shot-2024-10-06-at-12.08.50-pm.jpg)

If you head to GitHub, and go into "Packages" instead of "Repositories", your container will be there.

<a href="/images/screen-shot-2024-10-06-at-12.24.10-pm.png"><img src="/images/screen-shot-2024-10-06-at-12.24.10-pm.png" width="900" alt=""></a>

## Pulling

Pulling the container is going to be even simpler, log in to the registry with the same command we used above, then just docker pull with the registry in the container name - exactly as suggested in the package page on GitHub above.

```bash
docker pull ghcr.io/<github user name>/<container name>:<tag>
```

<a href="/images/screen-shot-2024-10-06-at-12.29.33-pm.png"><img src="/images/screen-shot-2024-10-06-at-12.29.33-pm.png" width="900" alt=""></a>
