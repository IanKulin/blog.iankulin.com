---
title: "SSH & the scary warning"
date: '2023-02-08'
slug: ssh-the-scary-warning
aliases:
  - /2023/02/08/ssh-the-scary-warning/
tags:
  - devops
  - homelab
  - linux
  - ssh
---

![](/images/screen-shot-2023-01-28-at-8.41.11-pm.jpg)

The first time you connect to a new server with ssh, it asks you something like:

```bash
➜ ~ > ssh ian@192.168.100.20      
The authenticity of host '192.168.100.20 (192.168.100.20)' can't be established.
ED25519 key fingerprint is SHA256:ZcNTcOjO/0fOLC5iNChf8Q8MHN7z2d+VV0qz7XqH1g4.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.100.20' (ED25519) to the list of known hosts.
```

Once you've said yes, it adds the server 'fingerprint' to the known hosts file, then next time you ssh there, it feels safe - we know this server.

But.... if you're playing around with virtual machines. Loading them, booting them, rebuilding them, cloning them etc. You might try and connect to a VM which is a different one from before, but which has the same ip address. SSH will not be happy:

```
➜ ~ > ssh ian@192.168.100.20
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the ED25519 key sent by the remote host is
SHA256:ZcNTcOjO/0fOLC5iNChf8Q8MHN7z2d+VV0qz7XqH1g4.
Please contact your system administrator.
Add correct host key in /Users/user/.ssh/known_hosts to get rid of this message.
Offending ECDSA key in /Users/user/.ssh/known_hosts:9
Host key for 192.168.100.20 has changed and you have requested strict checking.
Host key verification failed.
```

It is right to be suspicious. From its point of view, it goes to Joe's house each day, and it's always Joe who answers the door. Today, it's someone completely different but who says they are Joe. But since we know this is a different server, this is an expected result, so I'd like to ignore it.

Although the message says to add the new fingerprint to the known\_hosts file, it's easier just to delete the old ones. Then when I try to connect to this server again, it will think it's a new one and ask me to accept it. To delete this ip address (or hostname) out of the known hosts file, I just need to:

```bash
➜ ~ > ssh-keygen -R 192.168.100.20
# Host 192.168.100.20 found: line 7
# Host 192.168.100.20 found: line 8
# Host 192.168.100.20 found: line 9
/Users/user/.ssh/known_hosts updated.
```

And we're good to go again. But thank you ssh for being so careful.
