---
title: "VS Code Dev Containers"
date: '2026-01-10'
slug: vs-code-dev-containers
aliases:
  - /2026/01/10/vs-code-dev-containers/
tags:
  - dev-containers
  - docker
  - posts
  - ssh
  - vs-code
  - vs-code-extensions
---

### Remote-SSH

One of the things I've done a bit in Visual Studio Code is using it's ability to work on a different machine over SSH. I have a couple of LXCs on a server set up for different languages - one for C++ and another for Rust. They are things I don't work in often, and I didn't want to set them up on my laptop, but thought I might want them again sometime in the future.

This is straightforward in VS Code - You install the [remote ssh extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) locally, then choose `Remote-SSH: Connect to Host` in the command palette. A few seconds later, it appears that you're working locally, but actually you are working in a remote session on the server your VS Code instance is SSH'd into (a small indicator in the bottom left is the tell). You need to clone your project from git since you're working in the server's file system, and there's some complexity with extensions since you're sort of working in a new VS Code instance, but apart from that it feels the same as working locally.

![Remote SSH VS Code architecture from https://code.visualstudio.com/docs/remote/ssh](/images/architecture-ssh.png)

The official docs for [Remote Development using SSH are here.](https://code.visualstudio.com/docs/remote/ssh)

### Why now?

The reason I've been interested in this again lately is to provide a more secure environment for using AI agentic coding tools like Claude Code. If it's running in it's own server (that I can easily recreate from a snapshot) I don't have to worry about dramas like having [my hard drive deleted](https://www.theregister.com/2025/12/01/google_antigravity_wipes_d_drive/) by Gemini.

But what if you don't have the ability to spin up an environment on your homelab? There's a few options, but probably the easiest for VS Code users is to work in a 'Dev Container'.

### Dev Containers

Working in a Dev Container is basically the same as remoting into another server with VS Code, but in this case the other server is a container spun up in Docker.

![VS Code Dev Container architecture. From https://code.visualstudio.com/docs/devcontainers/containers](/images/architecture-containers.png)

There's a couple of important differences from working on a remote server:

-   we're working on our local files;
-   Dev containers are an important system for sharing repeatable development environments, so it's well integrated into VS Code - the tooling is nice.
-   You need Docker/Docker desktop running locally.
-   You need a container image to work with, and a `devcontainer.json` file to tell VS Code how to manage all this.

The rest of this post will focus on the basics of working in a Dev Container. There is also a good explanation of all this in the [VS Code docs](https://code.visualstudio.com/docs/devcontainers/tutorial).

## The Container

After you've installed the VS Code [extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers), and set up your local Docker environment, you're going to need a Docker container to work in. There's a [big list of existing containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) that cover most scenarios, but I prefer to roll my own. This is achieved by writing a Dockerfile.

```
FROM node:24-bookworm

# Use non-root user for development
USER node

# Development environment
ENV NODE_ENV=development

# Default command
CMD ["npm", "start"]
```

I'm going to name this `Dockerfile.dev` and put it in the `.devcontainer` directory - later we'll point to it from our `devcontainer.json`

![](/images/screenshot-2026-01-09-at-16.57.06.png)

The Dockerfile describes the system that we'll be working in when we're working on our project - it's like the specification of our remote 'server'. Sometimes you might want to install other stuff here - for example if you are a vim enthusiast, you might `apt install vim` in the Dockerfile, but generally you should keep it reasonably generic.

### devcontainer.json

Next we need to tell VS Code how to work in the container we've specified.

```
{
  "name": "Node.js Dev Container",
  "build": {
    "dockerfile": "Dockerfile.dev"
  },
  "forwardPorts": [
    3000
  ],
  "postCreateCommand": "npm install"
}
```

This goes in the .devcontainer directory. It's almost all self explanatory - we tell the extension what container we're using - in this case building it from `Dockerfile.dev`, export the port we're running on, and run a command in the terminal of our new system once it exists.

### What's missing?

Alert readers will have noticed there's a couple of things that we need which are missing.

-   VS Code Server - the way that VS Code is working in this configuration is that it's running on our local machine, but connecting to a "VS Code Server" inside the container.

-   Bind mounts to our local directory - Once we load up the dev container, all our local files will need to be available in VS Code somehow.

So how to these get in the container? We don't have to do anything to deal with these two issues. This is part of the magic that the VS Code Dev Container extension is doing for us. After the container is created, the extension:

-   installs the server binary, and starts it
-   bind mounts the local workspace to `/workspaces/<your-folder-name>`
-   And sets that as the WORKDIR in the container

### Let's go

Okay, with the `Dockerfile.dev` and `devcontainer.json` in place, we're now ready to launch our devcontainer.

In the VSCode command pallet, run `Dev Containers: Reopen in container`. The first run will take a few moments since the container has to be built first, but then it should look something like this:

![](/images/screenshot-2026-01-09-at-17.49.40.png)

The big clue that you're in the dev container now is the blue message in the bottom left corner. Most everything that we could do in the local environment we can do here in the container - for example editing code and running it.

![](/images/screenshot-2026-01-09-at-17.54.43.png)

![](/images/screenshot-2026-01-09-at-17.54.53.png)

### Extensions

![](/images/screenshot-2026-01-09-at-18.05.45.png)

If you have a look at your VS Code extensions while working in this dev container, you'll see that some are still installed, but others are now greyed out. Some extensions only effect the UI ("UI Extensions" - listed under "Local - Installed") so they live in the local VS Code, others have functionality that needs to run in the workspace environment so they ("Workspace extensions") need to live in the VS Code server part.

Any UI Extensions you had installed before will still be there since they live in the local VS Code, but they others will be greyed out and unavailable unless you install them into the dev container.

In the image here you can see my "vscode-icons" and "vscode-pdf" which only effect how things are displayed are both still available, but "Beancount" & "Cline" that need access to files need to be installed in the container if I want to use them on this project.

We can click on the "Install in Dev Container" button for any of these, and it will be installed into the dev container. I need ESLint for this project so I'll could that - then it will appear in the 'Dev Container' tab. This is a good way of mimicking the normal workflow for users, but this extension is only persisted in the container while it exists - If we make any changes to the `dockerfile` or `devcontainer.json` VS Code will rebuild the container and the extension will be gone again.

If we want a workspace extension, a more persistent way to install it is to add it to our `devcontainer.json`

### Adding extensions to devcontainer.json

Extensions added this way will be the same for anyone who uses our dev container definition (which is what I'm calling the combined `dockerfile` and `devcontainer.json`), including if they just clone the project from git. In fact, this was the original intention of dev containers - to have a fully reproducible development environment that is stored with its project.

Let's add a couple of extensions.

```
{
  "name": "Node.js Dev Container",
  "build": {
    "dockerfile": "Dockerfile.dev"
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode"
      ]
    }
  },
  "forwardPorts": [
    3000
  ],
  "postCreateCommand": "npm install"
}
```

If you make these changes in VS Code, it will probably pop up and ask you if it can rebuild the container, otherwise open the command palette and select "Dev Containers: Rebuild Container".

You might be wondering where we get the extension id's from (like `dbaeumer.vscode-eslint`) The easiest way to to right click on one in the extension list and select "Copy Extension ID". It's also listed on the extension web page.

![](/images/screenshot-2026-01-10-at-15.23.47.jpg)

### Finally

So that's the basics of getting a simple dev container set up. The code for this is on [GitHub here](https://github.com/IanKulin/devcont-demo). There's a crucial issue we haven't solved though - how to pull in your ssh keys for pushing the code to external repositories. We'll deal with that in a future post.
