---
title: "dockerfile - CMD vs ENTRYPOINT"
date: '2024-07-22'
slug: dockerfile-cmd-vs-entrypoint
aliases:
  - /2024/07/22/dockerfile-cmd-vs-entrypoint/
tags:
  - devops
  - docker
  - possibly-useful
  - posts
---

There are two entries we often have at the end of a `dockerfile` (which is the file that tells Docker how an image is to be built).

They are similar in that when the container is launched from an image, these commands will be executed. For example, both of the dockerfiles below will print "Hello World" when run.

`doc-`entry:

```
FROM debian:stable-slim
ENTRYPOINT ["echo", "Hello World from ENTRYPOINT"]
```

`doc-cmd`:

```
FROM debian:stable-slim
CMD ["echo", "Hello World"]
```

![](/images/screen-shot-2024-07-03-at-1.45.26-pm.png)

The key difference between them is that CMD can be overridden:

![](/images/screen-shot-2024-07-03-at-1.47.44-pm.png)

You can see from this that the ENTRYPOINT command is just added on to by the extra command line argument, but the CMD one is replaced entirely.

It's possible to have an ENTRYPOINT and a CMD in your dockerfile:

`doc-both`:

```
FROM debian:stable-slim
ENTRYPOINT ["echo", "Hello World from ENTRYPOINT"]
CMD ["& Hello World from CMD"]
```

![](/images/screen-shot-2024-07-03-at-1.55.45-pm.jpg)

Naturally, only the CMD is overridden if we pass in extra values.

![](/images/screen-shot-2024-07-03-at-1.58.40-pm.png)

#### Other things of note

-   Although these demos are at the command line, we'd see the same behaviour if we'd added a CMD to a docker compose file and started the container that way.
-   You can have multiple ENTRYPOINTs or CMDs in a file, they are all ignored except the last one.
-   The best place to learn more about [ENTRYPOINT](https://docs.docker.com/reference/dockerfile/#entrypoint) and [CMD](https://docs.docker.com/reference/dockerfile/#cmd) is in the official [Docker docs for dockerfile](https://docs.docker.com/reference/dockerfile/), not from an AI.
-   Most times, what you're looking at the end of your dockerfile is ENTRYPOINT. Just use CMD to add a default behaviour that you're happy for your image users to overide.
-   Don't confuse either of these with RUN - that happens during the image build, ENTRYPOINT and CMD are used when the container is launched/run.
