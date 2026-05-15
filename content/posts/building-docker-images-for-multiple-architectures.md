---
title: "Building Docker images for multiple architectures"
date: '2023-11-20'
slug: building-docker-images-for-multiple-architectures
aliases:
  - /2023/11/20/building-docker-images-for-multiple-architectures/
tags:
  - buildx
  - devops
  - docker
---

![](/images/featured-image-shipping-containers.jpeg.webp)

My little mdserver app has been a good way for me to start experimenting with the the devops side of things, especially building for Docker. Since I wanted to make the Docker image available for ARM Linux & x86 Linux I had a janky shell script that looked like this:

```
#!/bin/bash

# Extract the version number from package.json using jq
VERSION=$(jq -r .version package.json)

docker build --platform linux/amd64 -t iankulin/mdserver:$VERSION -t iankulin/mdserver:latest .
docker build --platform linux/arm64 -t iankulin/mdserver:arm64-$VERSION -t iankulin/mdserver:arm64-latest .

docker push iankulin/mdserver:arm64-$VERSION 
docker push iankulin/mdserver:arm64-latest 

docker push iankulin/mdserver:$VERSION
docker push iankulin/mdserver:latest 
```

So I'd build two different versions, and use the tags to separate them. In the registry it'd look like this:

![](/images/screen-shot-2023-10-29-at-3.36.45-pm.png)

But the big official images, for instance Node, have a long list of architectures associated with each tag - these are [multi-platform images](https://docs.docker.com/build/building/multi-platform/).

To create these, we need to use the `docker buildx` feature. If you google how to do this, there's a few mentions of how to 'turn on' this 'experimental' feature. I didn't do that, so perhaps it's been mainstreamed now. What I did to enable it was to enter:

```
docker buildx create --use
```

Then to create my dual architecture image:

```
docker buildx build --push \
--platform linux/arm64,linux/amd64 \
-t iankulin/mdserver:latest .
```

Then 113 seconds later (thank you Apple silicon), this showed up in my Docker Hub:

![](/images/screen-shot-2023-10-29-at-3.47.50-pm.png)

Lovely!

Buoyed by success, I decided I should also be shipping a Raspberry Pi version, which I guess is 32 bit ARM? So I dropped this into the CLI:

```
docker buildx build --push \
--platform linux/arm64,linux/amd64,linux/arm/v7 \
-t iankulin/mdserver:latest .
```

This was somewhat less successful. I think the story of the building for other architectures with `buildx` is that the container has QEMU binaries for them - ie like it's running a little VM to do the build inside of. That's three inception layers in, so I guess that's why it's slow for an alien architecture.

In any case, this may still work, but at the time of writing, the `NPM install` had been running overnight . If this speed turns out to be typical, it's a good reason to look at outsourcing your Docker builds to GitHub actions.

![](/images/screen-shot-2023-10-30-at-7.03.18-am.jpg)

With all eight cores pegged at 100% on an M1 MacBook:

![](/images/screen-shot-2023-10-30-at-7.05.19-am.png)
