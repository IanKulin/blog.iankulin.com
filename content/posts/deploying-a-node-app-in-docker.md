---
title: "Deploying a Node app in Docker"
date: '2024-03-31'
slug: deploying-a-node-app-in-docker
aliases:
  - /2024/03/31/deploying-a-node-app-in-docker/
tags:
  - devops
  - docker
  - homelab
  - node
  - posts
  - web-dev
---

<a href="https://en.wikipedia.org/wiki/Cargo_ship#/media/File:Cargo_Ship_Puerto_Cortes.jpg"><img src="/images/cargo_ship_puerto_cortes.jpg" width="900" alt=""></a>

When I wrote the install instructions for mdserver (little Markdown server Node app) on it's [github page](https://github.com/IanKulin/mdserver) it was something like:

-   Have node.js installed and working
-   Clone the repo
-   Start with `npm start`

Which is great if you know [how to do those things](/installing-a-node-app-on-a-server/) (they are bread and butter to a web dev) but not if you're a self-hoster who just wants a web server that converts markdown to HTML on the fly. For any situation where you just want to use the app, what you probably want is a Docker image of the app.

### Docker

Docker _containers_ are similar to a virtual machine in the sense that they need to be hosted, and are relatively isolated from other processes except is some explicitly defined ways. Docker images are stored in repositories (the default one is [DockerHub](https://hub.docker.com/)). It probably sounds like a wasteful process to ship an entire operating system with every little app - this is somewhat overcome by the images being built up in layers, and duplicated layers don't need to be shlipped around since they are cached.

So to deploy our Node app as a Docker container, we need to build an image, and store it on Docker Hub. From there, users can deploy it from their command lines by calling it directly or declaratively with a `docker-compose.yml` file.

### Dockerfile

To create a Docker image of our app that can be distributed, we run the `docker build` command which reads a file named `Dockerfile` to create the image. Here's the `Dockerfile` for the mdserver app.

```dockerfile
# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json .

RUN npm install

# Copy the rest of the application source code to the container
COPY ./server.js .
COPY ./LICENSE .
COPY ./readme.md .

# Expose the port that the Node.js app will listen on
EXPOSE 3000

# Define the command to start your Node.js app
CMD [ "node", "server.js" ]
```

`FROM node:20-alpine`

The `FROM` keyword specifies the base image we're starting with. It could just be something like a Debian base, then in the following commands in the Dockerfile we'd install Node, but Node (and lots of other web dev tool builders) have provided [official Docker images](https://hub.docker.com/_/node/) that they have crafted to make it easier for us. In this case I'm specifying that I want the image based on the lightweight Alpine Linux distro, with version 20 of Node installed on it.

Note that when Node created the `node:20-alpine` image, their Dockerfile probably started with `FROM [alpine:3.18](https://hub.docker.com/_/alpine)` - you see? Layers.

`WORKDIR /usr/src/app`

So now we've got a container with a fully working install of Linux (or close enough to that so we can think of it like that - I'm pretty sure there's no kernel). This command is saying that all the next commands are going to refer to the working directory _inside_ the container as `/usr/src/app`. In effect its as if you'd ssh'd in and run `mkdir /usr/scr/app && cd mkdir /usr/scr/app`

`COPY package*.json .`

I've written before about the [intricacies of the package files in Node](/sorting-out-node-package-dependencies-when-cloning-old-repos/). Basically these files (`package.json` and `package-lock.json`) specify the dependencies for out project. The dependencies are all sitting in the node\_modules folder, but having a listing of them in the package files means we can just check them into source control and not worry about that bloated folder.

This `COPY` command, just copies them both into out container image - the `.` at the end just means the current working directory inside the container - ie `/usr/src/app` in our case.

`RUN npm install`

Now the package files are inside the container, we just run `npm install`, exactly the same as we would on a server, in order to download all of the dependencies for our app into the container. If that looks like you could just say `RUN` then run any old Linux command then you're getting the hang of it. You can `apt install` stuff, `echo` a line into a config file - whatever you need.

`COPY ./server.js .`

`COPY ./LICENSE .`

`COPY ./readme.md .`

For this trivial app, we only need the one source file, but I like to copy the license and readme in as well. It's possible for future users of the container to run commands in their copy of the container, so it's conceivable someone might look in here to read them. Once again, the second parameter specifies where in the container the files are copied to, and once again we've said the current work dir.

You'll very commonly see `COPY . .` in Dockerfiles. This is saying copy all the files in the current directory to the working directory inside the container image. I guess that way you don't miss anything, but do I really need a copy of my `Dockerfile`, my vscode settings, my `node_modules` folder in the image? No. There is a way to avoid copying that stuff in - add a `.dockerignore` file to your project. This works exactly like a `.gitignore` - you just list one file or directory per line, and then the `COPY` command will know not to bother with it,

`EXPOSE 3000`

My node app is set to use port 3000, so we need to tell Docker to open that port for us since by default everything's locked down. Note that the user of this container won't be stuck with this decision, when they start the container, they can specify where in the outside world this internal container is going to be mapped to. That could be port `8080`, `80` or whatever.

CMD \[ "node", "server.js" \]

Finally, Docker needs to know how to start our app. This command is not being run now (when we're building the image) it's used by Docker when it launches the containerised app. I'm not sure why it is an array of strings instead of just a string, but it is. Just break it at each space in your command to run the app.

If you look back at the list of manual steps I started this post with, you'll see that we've pretty much just re-implemented them in the Dockerfile:

-   set up a node environment
-   copy the files in
-   run server.js

Obviously there's lots more you can do with Dockerfiles, but the underlying concept is pretty straightforward - you're setting up the whole environment for your app to run in so it can be mostly independent from its host OS.

### Build Step

To create the image from the Dockerfile, you are going to need Docker. I'm working on a Mac so I've got [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed. When it's running there's the little whale up in the toolbar.

You don't need a [DockerHub](https://hub.docker.com/) account to build the image, but you'll need one to upload it, and for naming your build, so head there now and create one. It is possible to use other registries for storing your images, but by default docker looks at it's own registry, so that's the best place to start when you're figuring things out.

When you're working with Docker images and registries, to uniquely identify an image, it usually has a name format like this:

`<username>/<imagename>:<tag>`

Usually the tag will be a version number, or perhaps `:latest`. The build command for our image could be this:

`docker build -t iankulin/mdserver:latest` .

![](/images/screen-shot-2023-10-28-at-12.27.51-pm.jpg)

This will load the .dockerignore then step through the Dockerfile to build our image. The image is stored away by Docker - we don't need to worry about where. You can get the list at the command line with `docker images`, or if you're running Docker Desktop, on the 'images' tab.

<a href="/images/screen-shot-2023-10-28-at-12.36.22-pm.png"><img src="/images/screen-shot-2023-10-28-at-12.36.22-pm.png" width="900" alt=""></a>

I have skipped quite a bit of detail about the build step and options. For example I sometimes use the `--platform` flag to specify `linux/amd64` if I'm testing on one of my homelab VMs rather than `linux/arm64` if I'm running the container on the mac. Also, we don't have to just build from the local machine, it's just as straightforward to build from your GitHub repo as part of a CI/CD system. I'm not planning to go into any of that today, except I will force it to build for x86 since it is my plan to test on the homelab VM's.

`docker build --platform linux/amd64 -t iankulin/mdserver:latest .`

### The Registry

So the images can be available to anyone, we need to make it available in a Docker Registry. The most famous one of these, and the one set up as the default for all the docker commands, is [Docker Hub](https://hub.docker.com/). Despite some [missteps](https://www.docker.com/blog/no-longer-sunsetting-the-free-team-plan/), it's still the main place people and organisations store docker images.

In order to push an image to a registry, we need to be signed in to it. As I'm using Docker Desktop, and I'm signed in to Docker Hub on that. I've skipped that step, but if you needed to, you'd use the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command. Once that's sorted, the push is easy:

`docker push iankulin/mdserver:latest`

<a href="/images/screen-shot-2023-10-28-at-2.12.15-pm.png"><img src="/images/screen-shot-2023-10-28-at-2.12.15-pm.png" width="900" alt=""></a>

In this output, you can see some of the efficiencies of the layers - docker recognises (from the UUIDs) that the Alpine and Node layers are ones that I pulled down from it when I was creating the image locally, so it doesn't send them back to Docker Hub.

If we go to Docker Hub and search for mdserver, we should be able to find it now available to the public.

<a href="/images/screen-shot-2023-10-28-at-2.10.44-pm.png"><img src="/images/screen-shot-2023-10-28-at-2.10.44-pm.png" width="900" alt=""></a>

### Using the image

Now it's in the registry, anyone can use it as easily as any of the Docker images - NGINX, Jellyfin - whatever. I provide a docker-compose file in the repo, it looks like this:

```yaml
version: '3'
services:
  mdserver:
    image: iankulin/mdserver:latest
    ports:
      - "3000:3000"
    volumes:
      - ./public:/usr/src/app/public 
```

So any user can just drop that into a directory, and enter `docker compose up -d` then the image will be pulled down and run, and they'll have their server live.
