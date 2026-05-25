---
title: "Beginning Node App Security"
date: '2024-02-16'
slug: beginning-node-app-security
aliases:
  - /2024/02/16/beginning-node-app-security/
tags:
  - devops
  - fail2ban
  - linux
  - nginx
  - posts
  - security
  - web-dev
---

Since I'm using Tailscale to painlessly manage all my networking on the homeserver here and my remotes, I've had the luxury of being a bit casual about the security of my internal apps and self hosted dev tools. I'm currently iterating on a web app that requires public access, and is therefore up on a VPS and exposed to all the evils of the open internet.

I am in no way a security expert, but here's a few of the (reasonably simple) steps I've taken to secure my node app.

### Put it behind Nginx

I could just change the port number of the Node app to listen to port 80 and connect it directly to the world, but Nginx is battle hardened for outward facing tasks so that seems safer. Additionally, it opens up a lot of functionality such as putting my app on a subdomain and some other security options we'll come to. Putting Nginx in front of your app like this is called 'reverse proxying'.

```
	server_name sub.example.com;	location / {  		proxy_pass http://localhost:3000;			proxy_http_version 1.1;		proxy_set_header Upgrade $http_upgrade;		proxy_set_header Connection 'upgrade';		proxy_set_header Host $host;		proxy_cache_bypass $http_upgrade;	}
```

### Basic Auth

One of the Nginx options is the ability to turn on '[basic auth](https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-http-basic-authentication/)'. This can be enabled for a route, subdomain, or a whole domain. It forces a user to authenticate before being able to access resources from that area. It's basic in the sense that the password is manually set on the server in a file that the nginx conf points to. Ideally your app will have comprehensive auth built in, but (especially when you are still developing it) basic auth is a quick and easy way to prevent all of the internet from accessing your app.

```bash
	server_name sub.example.com;	location / {		auth_basic "Secure app";	        auth_basic_user_file /etc/nginx/.htpasswd;	}
```

### HTTPS

Enforcing SSL connections is much easier than it used to be (thank you L[et's Encrypt and Certbot](/certbot-lets-encrypt-are-great/)) and it keeps all the data being sent between your app and the user's browser encrypted - including the username and password you are using for your auth.

### Logging

Ensuring that logs are turned on means that you've got some chance of detecting problems and possible attacks. In fact, you'll probably be aghast at the number of bots that start accessing your server as soon as it's live. For the most part, they are probing for the existence of known vulnerabilities in well known packages - may of the php. When I look up the IP addresses for these, they almost always come from China or Eastern Europe.

Note that logging does involve some future maintenance. Logs need rotated and deleted or we'll soon be running out of disk space.

### Fail2ban

Manually checking the logs is not effective, we need to automate this a bit. The things I'm looking for in my system is brute force attempts at breaking the basic auth, and the same with SSH.

[Fail2Ban](https://github.com/fail2ban/fail2ban) can automate this (and many other things, but I'm just using these two) by scanning the logs for failed attempts. There are various settings to determine the thresholds - say check for 5 failed attempts in 10 minutes then ban the IP address for 30 minutes. Once the threshold is met, Fail2Ban updates iptables (the internal firewall) to block them.

```
ian@novel-ironic:~$ sudo fail2ban-client status sshdStatus for the jail: sshd|- Filter|  |- Currently failed:	1|  |- Total failed:	2960|  `- File list:	/var/log/auth.log`- Actions   |- Currently banned:	6   |- Total banned:	483   `- Banned IP list:	218.92.0.27 61.177.172.136 61.177.172.140 218.92.0.113 218.92.0.31 218.92.0.76ian@novel-ironic:~$ sudo fail2ban-client status nginx-http-authStatus for the jail: nginx-http-auth|- Filter|  |- Currently failed:	1|  |- Total failed:	6|  `- File list:	/var/log/nginx/error.log`- Actions   |- Currently banned:	0   |- Total banned:	1   `- Banned IP list:	ian@novel-ironic:~$ 
```

In the output above, you can see there are 6 ip addresses currently blocked for trying to crack SSH, and there's been 483 banned in the couple of days since I turned it on - so this is a very common attack vector. The basic auth one just has a single ban (from when I tested it). I'm not sure why I like looking at the list of bans so much, but I do!

### Cloud Firewall

Many VPS providers will have a cloud firewall (although they may call it something else). We can use this to lock down all the ports we are not using to massively reduce the attack surface for this machine. One of the very appealing things about this firewall which is external to the VPS is that it's accessed via the VPS provider web interface - so it's not possible to lock yourself out if you make a mistake - as opposed to when you're SSHd in and fiddling with iptables.

Since this VPS is just running web apps, I just have ports 80, 443 and 22 open.

### No root login

By default, Ubuntu does not allow root login by password, but once I've added a new user and added them to the sudo group, I turn it off entirely. Most of those SSH attempts that failed would have been trying common user names including root, so may as well take it out of the possibilities.

### SSH keys

Apart from being more convenient, well managed SSH keys are much safer than using passwords. So my new user copies up their keys and I set that user to no login with password as well.

### Updates

One of the wonderful things about open source and the modern web, is that as new vulnerabilities are being discovered, they are being patched. We only get them if we run updates though. It's possible (and recommended) to use [automatic updates](https://www.digitalocean.com/community/tutorials/how-to-keep-ubuntu-20-04-servers-updated), but I have a weekend ansible routine to do them that I like to look at the output of to check everything's healthy.

### Monitoring

I use a [very simple monitoring system](/simple-api-endpoint-in-go/) for all the VM's and containers in my Tailnet - just checking the root disk space and available memory. This is exposed as an http endpoint, then checked by [Uptime Kuma](/uptime-kuma-nfty/). That's better than nothing, but for a production system not really enough. This is one of the areas I'll revisit in the future.
