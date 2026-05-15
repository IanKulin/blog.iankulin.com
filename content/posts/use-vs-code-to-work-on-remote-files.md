---
title: "Use VS Code to work on remote files"
date: '2023-09-21'
slug: use-vs-code-to-work-on-remote-files
aliases:
  - /2023/09/21/use-vs-code-to-work-on-remote-files/
tags:
  - homelab
  - vs-code
  - web-dev
---

![Cavewoman typing on a MacBook](/images/dreamshaper_v7_a_cavewoman_sitting_in_a_cave_typing_on_a_small_0.jpg)

If you've got a script, or some code to work on, and it's on a VM somewhere, you can always `ssh` in and use `nano` or [`vim`](/bloody-vim/) to make your edits. Like a caveman. With an archaic editor, no intellisense, and no spell checking.

Or....

![VS Code connected to a remote server over SSH](/images/screen-shot-2023-08-13-at-3.50.15-pm.png)

This magic - of editing a files on a remote server over SSH is achieved by using a Microsoft plugin for VS Code - "[Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh)"

[![](/images/untitled.png)](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh)

How the plugin works is that it installs a copy of [VS Code Server](https://code.visualstudio.com/docs/remote/vscode-server) on the remote machine, then connects to it over SSH.

The experience is pretty great, once it's installed (which I'll run through below) it's as if you are natively on the remote machine - the terminal is in the current directory on the remote machine, you can navigate around your files, edit them, use git, drag local files in and drop them in your remote folder and run your code.

### Setup

-   You need to be able to SSH into the remote machine, preferably with keys if you want a smooth experience. I've [talked about this](/ssh-key-login-on-vps/) before if that's new to you.
-   Install the [Remote-SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) plugin

![](/images/screen-shot-2023-08-13-at-3.29.05-pm.png)

-   Once that's done, there will be a "Remote Explorer" icon over on the left edge of the VS Code window. If you click on that, the explorer area will show a list of machines you've configured. There's a + to add a new one.
-   If you click on that, it will ask you to enter the SSH command to access a machine.

![](/images/screen-shot-2023-08-13-at-3.31.49-pm.png)

When you hit enter on that, it will ask you where to save the config file - I just chose the top one since that's where I usually go to edit `known_hosts` etc.

You can get back to this config file later by clicking on the gear icon next to SSH in the remote explorer. That's what I've done in the screenshot below to change the server name to something a bit more memorable.

-   With that all set up, just click on the "Connect in New Window" icon next to the server you want to work on.

![](/images/screen-shot-2023-08-13-at-4.59.30-pm.png)

-   Once the connection is established, new VS Code window will open up, with the files in the remote directory loaded ready for work. The status of the connection is shown in the bottom left corner of the window.

![](/images/screen-shot-2023-08-13-at-5.04.18-pm.png)

If anything here didn't make sense, there's a [good tutorial on the Visual Studio Code website](https://code.visualstudio.com/docs/remote/ssh-tutorial), or if you're more of a video person, this overenthusiastic guy has a [good quick summary](https://www.youtube.com/watch?v=7kum46SFIaY).
