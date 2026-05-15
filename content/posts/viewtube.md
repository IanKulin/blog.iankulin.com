---
title: "ViewTube"
date: '2023-11-27'
slug: viewtube
aliases:
  - /2023/11/27/viewtube/
tags:
  - docker
  - homelab
  - posts
  - viewtube
---

![](/images/screen-shot-2023-11-18-at-5.17.47-pm.png)

Whenever I encounter one of those "What are you self-hosting?" threads, I know I'm about to waste an hour looking at, and often trying out, software I probably don't really need, and that was the case with [this post](https://lemmy.world/post/8385160) on the [lemmy.world Selfhosted](https://lemmy.world/c/selfhost@lemmy.ml) community.

The basic idea of ViewTube is that it's a self-hosted front end for YouTube, which just happens to strip out all the advertising and tracking. You can create your own local accounts which allows you to subscribe to channels and which keeps your progress so you don't start over if you go back to a video - although I couldn't see a history list. Forgetting your history might be a feature in an app designed to prevent tracking.

It only took five minutes to get it running to try out, and most of that was downloading the docker images. I just made a directory in a VM and dropped this docker compose into it.

```
version: '3'

services:
  viewtube:
    restart: unless-stopped
    # Or use mauriceo/viewtube:dev for the development version
    image: mauriceo/viewtube:latest
    # ViewTube will not start until the database and redis are ready
    depends_on:
      - viewtube-mongodb
      - viewtube-redis
    # Make sure all services are in the same network
    networks:
      - viewtube
    volumes:
      # This will map ViewTube's data directory to the local folder ./data/viewtube/
      - ./data/viewtube:/data
    environment:
      - VIEWTUBE_DATABASE_HOST=viewtube-mongodb
      - VIEWTUBE_REDIS_HOST=viewtube-redis
    ports:
      - 8066:8066

  viewtube-mongodb:
    restart: unless-stopped
    image: mongo:4.4
    networks:
      - viewtube
    volumes:
      - ./data/db:/data/db

  viewtube-redis:
    restart: unless-stopped
    image: redis:7
    networks:
      - viewtube
    volumes:
      - ./data/redis:/data

networks:
  viewtube:
```

The only change in here from the [official one](https://viewtube.wiki/installation/docker) was to change to an older version since I hadn't passed through the CPU in host mode, so there was no [AVX support which is required by newer versions](https://old.reddit.com/r/homelab/comments/yvo4jm/how_do_i_enable_avx_on_my_server/) of MongoDB.
