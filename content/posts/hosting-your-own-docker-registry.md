---
title: "Hosting Your Own Docker Registry"
date: '2024-03-25'
slug: hosting-your-own-docker-registry
aliases:
  - /2024/03/25/hosting-your-own-docker-registry/
tags:
  - devops
  - docker
  - homelab
  - possibly-useful
  - posts
  - registry
---

<a href="https://unsplash.com/photos/architectural-photography-of-cargo-containers-stack-hP4ZiN1_kdk?utm_content=creditShareLink&utm_medium=referral&utm_source=unsplash"><img src="/images/tri-eptaroka-mardiana-hp4zin1_kdk-unsplash.jpg" width="640" alt="Photo by Tri Eptaroka Mardianam on Unsplash
"></a>

The Docker [Personal (ie free tier) plan](https://docs.docker.com/subscription/core-subscription/details/) currently allows one private repository, but even if you want to pay for the next level where you can have unlimited repositories, you may still want to host your own private registry - it's going to be quicker inside your network, and you won't run up against Docker's pull/push limits if you are hammering it with your CI/CD system.

There are fancier tools, but in this post we'll look at the basics of how to use the official registry app from Docker.

### Initial Setup

The [registry app](https://hub.docker.com/_/registry) is (unsurprisingly) dockerised. So I've created a directory for the `docker-compose.yml` file, and a `data` sub directory.

![](/images/screen-shot-2024-03-23-at-7.50.43-am.png)

And the yaml.

```
services:  registry:    image: registry:2    container_name: registry    restart: unless-stopped    ports:    - "5000:5000"    environment:      REGISTRY_STORAGE_FILESYSTEM_ROOTDIRECTORY: /data    volumes:      - ./data:/data
```

`docker compose up`, and bingo. Our registry is live.

### Creating an image

Now our registry is up, let's jump over to another machine, and create an image to store in it. I'm only going to minimally explain this, since if you're interested in your own registry, you've probably been down this path.

![](/images/screen-shot-2024-03-23-at-1.24.50-pm.png)

`dockerfile`

```
FROM busyboxRUN mkdir /appCOPY script.sh /app/script.shWORKDIR /appRUN chmod +x script.shCMD ["./script.sh"]
```

`script.sh`

```
#!/bin/shecho "Hello from Docker!"
```

So basically, this image contains a small Linux distro, and all it does is run a script that outputs "Hello from Docker!" to the console. We can build our image by switching into the directory with the `dockerfile` and running:

```
sudo docker build -t hello-docker .
```

![](/images/screen-shot-2024-03-23-at-1.37.15-pm.jpg)

If you want to run it to check my docker skills, use

```
sudo docker run hello-docker
```

### Pushing & Insecure

Now I want to push the image we've created to the new registry we set up earlier, but we're going to run into a problem.

I'm using two Debian virtual machines (LXCs actually) both on my homelab network. They've been named with Tailscale to make things clearer in the screenshots. (If you're following along you'll probably be using IP addresses). Importantly, there are no TLS certificates, self-signed or otherwise.

First we need to tag our image to include the registry name:

```
sudo docker tag hello-docker:latest ct390-docker-reg:5000/hello-docker
```

![](/images/screen-shot-2024-03-23-at-1.53.18-pm.png)

And we'll try to push it up to our registry with:

```
docker push ct390-docker-reg:5000/hello-docker
```

![](/images/screen-shot-2024-03-23-at-2.35.40-pm.png)

What's happening is that Docker would (quite reasonably) prefer to only work over secure connections. We can override this on this machine for today's demo purposes by adding an exception for our self-hosted registry. You'll need to create the file `/etc/docker/daemon.json` and add the registry that's going to be allowed like this:

```
{    "insecure-registries" : [ "ct390-docker-reg:5000" ]}
```

If we restart docker and retry the push now, it should work:

![](/images/screen-shot-2024-03-23-at-2.43.02-pm.png)

That looks like it worked. If we wanted to check, we can just hit an endpoint on the registry:

```
curl http://ct390-docker-reg:5000/v2/_catalog
```

![](/images/screen-shot-2024-03-23-at-2.49.36-pm.png)

### Pulling & Insecure

Of course the ultimate test is going to be to use this image from a third machine, so let's spin one up with a clean docker install with no images and try to run the image we've just added to our registry.

We're going to have the same challenge pulling from a non-TLS registry as we had pushing to it, and the workaround is going to be exactly the same - add the registry to the insecure list in the `/etc/docker/daemon.json`

```
echo '{ "insecure-registries" : [ "ct390-docker-reg:5000" ]}' | sudo tee /etc/docker/daemon.jsonsudo systemctl daemon-reloadsudo systemctl restart docker
```

Now we can run it. Since we don't have the image locally yet, docker will pull it down for us from the registry before running it:

![](/images/screen-shot-2024-03-23-at-3.19.03-pm.png)

And that's it. Our own private Docker registry to store our images.

#### References

In writing this post, I relied on some these resources:

-   Digital Ocean - [How To Set Up a Private Docker Registry on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-private-docker-registry-on-ubuntu-20-04)
-   Baeldung - [Configure a Private Docker Registry](https://www.baeldung.com/ops/docker-private-registry)
-   O'Reilly - [Configuring Docker to Push or Pull from an Insecure Registry](https://www.oreilly.com/library/view/kubernetes-in-the/9781492043270/app03.html)
