---
title: "Saved by the qemu_guest_agent"
date: '2023-02-10'
slug: saved-by-the-qemu_guest_agent
aliases:
  - /2023/02/10/saved-by-the-qemu_guest_agent/
tags:
  - devops
  - homelab
  - sudo
  - vm
---

Literally an hour after I wrote the post [about installing the qemu guest agent](/proxmox-qemu-guest-agent/) in a VM and explaining how it can be used to inject root level commands into a VM, I had use of it due to a mistake.

I'd decided to add myself to the sudoers file. Since the last line in that file is a directive to include all the files in the /etc/sudoers.d directory, the accepted way to do that for local changes is to create a file in that directory with the necessary commands.

```
# User privilege specification
root	ALL=(ALL:ALL) ALL

# Members of the admin group may gain root privileges
%admin ALL=(ALL) ALL

# Allow members of group sudo to execute any command
%sudo	ALL=(ALL:ALL) ALL

# See sudoers(5) for more information on "@include" directives:

@includedir /etc/sudoers.d
```

The format of this command is important to get right, since if you stuff it up, sudo will not work, and I don't even have a root login for this server, so then I'd be in a pickle. It's so important to not stuff this up that there is a special command for editing the files that won't let you save them if you've made a mistake.

Out of an abundance of caution, I decided to copy the system sudoers file to the directory as a starting point since it would have the correct format and be easy to edit. It didn't occur to me that then the `@includedir` at the end would become an infinite loop.

![](/images/screen-shot-2023-01-29-at-2.06.12-pm.png)

So here I am, logged in as ian, with no sudo, needing to edit or delete a protected file, and with no root login. Luckily, it's a VM running the qemu user agent, so I can access it from Proxmox.

![](/images/screen-shot-2023-01-29-at-2.04.37-pm.png)

Saved by over-engineering! Thank you open source contributors.
