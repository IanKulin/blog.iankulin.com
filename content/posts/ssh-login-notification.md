---
title: "SSH login notification"
date: '2024-05-13'
slug: ssh-login-notification
aliases:
  - /2024/05/13/ssh-login-notification/
tags:
  - devops
  - ntfy
  - security
  - ssh
---

<a href="https://unsplash.com/photos/brown-bell-on-white-concrete-wall-4VRzuA4UxSY?utm_content=creditShareLink&utm_medium=referral&utm_source=unsplash"><img src="/images/nick-fewings-4vrzua4uxsy-unsplash.jpg" width="400" alt="Photo by Nick Fewings Unsplash
"></a>

My VPS's are usually locked down so just ports 80 & 443 (for web server) and 22 (for ssh) are open. That's great for reducing the attack surface, but having ssh open is a potentially disastrous vulnerability. For this reason I often close that at the cloud firewall level as well, but it has to be open when I'm making changes or running the weekly ansible update/cleanup playbooks.

To make things a bit safer, I run [Fail2Ban](/beginning-node-app-security/) on the ssh logs, and also have notifications turned on via [Ntfy](https://ntfy.sh/). Ntfy is so useful I make an annual donation to support it's development and help with Phil's server costs. I recommend you do to. In fact, my setup for getting a notification on my watch everytime someone ssh's into one of my VPS's is just copied directly from [Phil's examples](https://docs.ntfy.sh/examples/#__tabbed_1_1).

### Changes

If you're not logged in as root (that should be turned off) you'll need to run all these as sudo.

Edit `/etc/pam.d/sshd` to add these lines to the bottom:

```bash
# at the end of the file
session optional pam_exec.so /usr/bin/ntfy-ssh-login.sh
```

Then create the file `/usr/bin/ntfy-ssh-login.sh`

```bash
#!/bin/bash
if [ "${PAM_TYPE}" = "open_session" ]; then
  curl \
    -H prio:high \
    -H tags:warning \
    -d "SSH login: ${PAM_USER} from ${PAM_RHOST}" \
    ntfy.sh/your-unique-notification-string
fi
```

but replace `your-unique-notification-string` with whatever string you're monitoring with the app. Note that if you're using the shared (rather than self hosted) service, these are public. If I'd used mine here, you'd be able to use it to spam my phone with alerts. For this reason, many people use GUIDs.

We need to make this executable:

```bash
chmod +x /usr/bin/ntfy-ssh-login.sh
```

And restart the ssh daemon

```bash
sudo systemctl restart sshd
```

Then log out, and ssh back in, and you should get the notification.
