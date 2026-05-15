---
title: "Upgrading to Forgejo 7.0.1"
date: '2024-05-06'
slug: upgrading-to-forgejo-7-0-1
aliases:
  - /2024/05/06/upgrading-to-forgejo-7-0-1/
tags:
  - devops
  - docker
  - forgejo
  - homelab
  - semantic-versions
  - versioning
---

![](/images/screen-shot-2024-04-28-at-1.08.21-pm.png)

It's not that long ago that [I wrote about](/my-web-app-update-process/) doing routine upgrades on containerised web apps using Forgejo as an example as I upgraded Forgejo (my git repository manager) between patch versions of 1.21, then a few days later, they dropped 7.0.0

[They say](https://forgejo.org/2024-04-release-v7-0/) the major version jump is due to it being an LTS (long term support) release, and changing to [semantic versioning 2.0.0](https://semver.org/spec/v2.0.0.html) , but that doesn't quite explain it to me, and I assume this is partly signifying the fork's drift away from the gitea codebase. In any case, the upgrade to 7.0.0 it does involve some breaking changes, and signifies to me that a lot has been on, which makes me keen to wait for a patch release (I'm always keen for other people to debug these things) which has now landed.

The reason I think the upgrade process is worth mentioning, is that the steps we went through to move from 1.21.0 to 1.21.8:

-   `docker compose down`
-   `docker pull codeberg.org/forgejo/forgejo:1.21`
-   `docker compose up`

will not work this time, and gives me the excuse to talk about container tags.

### Container Tags

When the developers had built their release for 1.21.8, they would have pushed the exact same image to:

-   `codeberg.org/forgejo/forgejo:1.21.8`
-   `codeberg.org/forgejo/forgejo:1.21`
-   `codeberg.org/forgejo/forgejo:1`
-   `codeberg.org/forgejo/forgejo:latest`

that way, people like me who had specified `codeberg.org/forgejo/forgejo:1.21` in their docker-compose.yml files just had to down/pull/up to be in business.

If they had released another patch version, say 1.21.10, they they would have pushed the new image to:

-   `codeberg.org/forgejo/forgejo:1.21.10`
-   `codeberg.org/forgejo/forgejo:1.21`
-   `codeberg.org/forgejo/forgejo:1`
-   `codeberg.org/forgejo/forgejo:latest`

i.e. the old 1.21.8 image would have stayed the same, so anyone who had depended on that not changing will still be fine, but people like me who want all the patch versions updated (but not a minor version change) would get the new one.

Normally you can just click on 'tags' for an image on Docker Hub, but since this one is hosted on Codeburg's Forgejo instance, you need to go [https://codeberg.org/forgejo/-/packages/container/forgejo/versions](https://codeberg.org/forgejo/-/packages/container/forgejo/versions) to see all the tags they've pushed to.

### Upgrade steps

The extra step we'll need to go through this time is to decide what level of version we want to specify in our docker-compose. I'll stick to specifying to the minor version so my new `docker-compose.yml` will be:

```
version: '3'

networks:
  forgejo:
    external: false

services:
  server:
    image: codeberg.org/forgejo/forgejo:7.0
    container_name: forgejo
    environment:
      - USER_UID=112
      - USER_GID=103
    restart: always
    networks:
      - forgejo
    volumes:
      - ./forgejo:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      - '80:3000'
      - '2200:22'
```

Once that decision is made, it's just the same:

-   backup the LXC
-   `docker compose down`
-   `docker pull codeberg.org/forgejo/forgejo:7.0`
-   `docker compose up`
-   Then some testing

We could probably skip that pull step - when you compose up the system would notice the version change and pull it for us.
