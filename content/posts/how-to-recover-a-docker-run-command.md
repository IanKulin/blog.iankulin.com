---
title: "How to recover a docker run command"
date: '2023-07-16'
slug: how-to-recover-a-docker-run-command
aliases:
  - /2023/07/16/how-to-recover-a-docker-run-command/
tags:
  - devops
  - docker
  - homelab
---

![](/images/andywatt83_a_developer_environment_in_a_container_using_docker_051f6abb-8c38-4b2d-85cf-7c3f8744118b.png)

Imagine if, lets say hypothetically, you'd set up an application months ago with a `docker run` command. Then you'd heard there had been an update to the app because of a security update. So you need to stop/remove the container, pull a new image and restart it, trouble is, you don't remember the exact `run` command you used to start it.

This didn't happen to me, since all my vm setups are in git as markdown (I'm pre-Ansible), but I did google how to do this thinking that there would be an easy way before I bothered to look through my config files.

### Short answer

There isn't a docker command that will retrieve your run command for you.

### Long answer

It's probably still in your bash history, try:

```
history | grep "docker run"
```

If that doesn't work, it must have been a long time ago.

Most likely, the crucial information you want to know will be the ports you specified, the network setup, and any directories you've bound or volumes used. All of this information is available from the `docker inspect` command, but you're going to have to trawl through it a bit. Search for `Mounts` to see what you did there:

```
"Mounts": [
            {
                "Type": "volume",
                "Name": "jellyfin-config",
                "Source": "/var/lib/docker/volumes/jellyfin-config/_data",
                "Destination": "/config",
                "Driver": "local",
                "Mode": "z",
                "RW": true,
                "Propagation": ""
            },
            {
                "Type": "bind",
                "Source": "/mnt/media/video",
                "Destination": "/media",
                "Mode": "",
                "RW": true,
                "Propagation": "rprivate"
            },
            {
                "Type": "volume",
                "Name": "jellyfin-cache",
                "Source": "/var/lib/docker/volumes/jellyfin-cache/_data",
                "Destination": "/cache",
                "Driver": "local",
                "Mode": "z",
                "RW": true,
                "Propagation": ""
            }
        ],
```

### Better Answer

Investigate `[docker compose](https://docs.docker.com/compose/compose-file/)` to save some effort next time.
