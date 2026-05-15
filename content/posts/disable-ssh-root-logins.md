---
title: "Disable SSH root logins"
date: '2023-09-18'
slug: disable-ssh-root-logins
aliases:
  - /2023/09/18/disable-ssh-root-logins/
tags:
  - homelab
  - linux
  - security
  - ssh
---

This always makes me laugh:

![Screenshot of terminal output full of lines saying "Failed password for root"](/images/screen-shot-2023-08-03-at-8.01.20-pm.jpg)

It's like half the traffic on the internet is [bots](/chinese-hackers-want-to-steal-my-hello-world-container/) trying random passwords on root accounts over ssh. This is on an Ubuntu VPS on BinaryLane that had only been spun up five minutes or so. Looks like about one attempt every 10 seconds.

This is why the number three thing on my new install list is to disable root access via ssh. Here's my system - possibly just for Ubuntu and related systems:

Add a new user, and put them in the sudo group

```
add user fred
usermod -aG sudo fred
```

Then log out, and ssh back in with the user you just created. Now we want to edit the config file for the ssh daemon. Since we're not logged in as root now, we'll have to use `sudo`, so we'll also find out if that's working.

```
sudo nano /etc/ssh/sshd_config
```

If `sudo` doesn't work, either you stuffed up adding the new username to the sudo group, or you don't have sudo installed. If the problem is the latter, log out, and ssh back in as root and install it with `apt install sudo`

There is probably a line with `PermitRootLogin` in it. It may be commented out, or set to `yes`. But we want it to end up looking like this

```
PermitRootLogin no
```

We'll need to restart the daemon to pick up the config changes.

```
sudo systemctl restart sshd
```

Now if you log out, and try to ssh back in as root, it should fail. If it doesn't, a likely issue is that there's other configuration files being included. I feel I've mentioned before that a common pattern with Linux config files, at least on the Debian based systems I use, is that there's a main config file that you probably shouldn't mess with, but it pulls in subsidiary config files, often in a subdirectory called `conf.d`

In the case of this file, there's a line up the top saying

```
Include /etc/ssh/sshd_config.d/*.conf
```

which does exactly that.

### Spy vs Spy

I'd love to know what passwords these bots are trying. I was thinking it wouldn't be all that hard to write something that would face the password login process and run it on port 22 to see. I asked ChatGPT about this, but goodie-goddie that it is, all I got was a warning about ethics and some ssh security tips.

![](/images/screen-shot-2023-08-04-at-6.04.02-pm.png)

I'm not the first person to [think of this](https://www.darkreading.com/endpoint/a-common-password-list-accounts-for-nearly-all-cyberattacks), so I might come back to this idea later. If I was running brute force ssh I guess I'd use one of the common password lists from one of the big leaks, so it might not be that exciting. It would also be interesting to see what the first command they tried to run is as well.
