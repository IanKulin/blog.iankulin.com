---
title: "Where Do Docker Container Logs Go?"
date: '2023-04-08'
slug: where-do-docker-container-logs-go
aliases:
  - /2023/04/08/where-do-docker-container-logs-go/
tags:
  - debugging
  - docker
  - homelab
---

I'm still loving the Docker "just works" magic, despite their [terrible PR skills](https://www.theregister.com/2023/03/17/docker_free_teams_plan/), but sometimes I start a container, then the `docker ps -a` shows it exited almost immediately. Clearly I've made a mistake, but there's no stdout error message to tell me what I've done wrong, where is it.

Let's look at an example from today. I'm testing [Filebrowser](https://filebrowser.org/) on a dev machine before I deploy it to the remote backup machine I'm assembling. And instead of following the [official instructions](https://filebrowser.org/installation), I'm following a [blog post](https://bobcares.com/blog/filebrowser-installation-in-docker/) which has a few more details, but unfortunately also a small error.

<a href="/images/screen-shot-2023-04-02-at-1.35.16-pm.png"><img src="/images/screen-shot-2023-04-02-at-1.35.16-pm.png" width="800" alt=""></a>

The first sign of a problem is that the container is not running after I've launched it.

![](/images/screen-shot-2023-04-02-at-1.42.09-pm.jpg)

To cat the log for the exited container is simple. Note that the (randomly provided) name for the container is `eager_haslett` so to see the log we enter:

```bash
sudo docker logs eager_haslett
```

The log output was:

```bash
panic: While parsing config: invalid character '\n' in string literal

goroutine 1 [running]:
github.com/filebrowser/filebrowser/v2/cmd.initConfig()
	/home/runner/work/filebrowser/filebrowser/cmd/root.go:410 +0x346
github.com/spf13/cobra.(*Command).preRun(...)
	/home/runner/go/pkg/mod/github.com/spf13/cobra@v1.4.0/command.go:886
github.com/spf13/cobra.(*Command).execute(0x1828580, {0xc000030220, 0x0, 0x0})
	/home/runner/go/pkg/mod/github.com/spf13/cobra@v1.4.0/command.go:822 +0x44e
github.com/spf13/cobra.(*Command).ExecuteC(0x1828580)
	/home/runner/go/pkg/mod/github.com/spf13/cobra@v1.4.0/command.go:974 +0x3b4
github.com/spf13/cobra.(*Command).Execute(...)
	/home/runner/go/pkg/mod/github.com/spf13/cobra@v1.4.0/command.go:902
github.com/filebrowser/filebrowser/v2/cmd.Execute()
	/home/runner/work/filebrowser/filebrowser/cmd/cmd.go:9 +0x25
main.main()
	/home/runner/work/filebrowser/filebrowser/main.go:8 +0x17
```

There's our answer right at the top of the log - there's a newline character in the middle of a key:value pair in the config JSON. If you look at the blog page above you can see it after the database.db
