---
title: "Certbot &amp; Let's Encrypt are great"
date: '2023-10-12'
slug: certbot-lets-encrypt-are-great
aliases:
  - /2023/10/12/certbot-lets-encrypt-are-great/
tags:
  - certbot
  - devops
  - https
  - ssl
  - tls
---

<img src="/images/certbot.png" width="847" alt="">

I've been managing SSL certificates for my domains purchased from [PorkBun](https://porkbun.com/) by going there every 90 days downloading the certificates, [joining them together](/installing-ssl-certificates-with-nginx-on-docker/) to make the `fullchain.pem` then `scp`\-ing them to my servers. That's been sort of manageable, but less than ideal.

It also doesn't work for my Australian domains. Since there's strict rules about who can own a domain in the `.au` space (_you have to have some sort of right to the name - a random person can't obtain the `coke.com.au` domain unless that's a trading name, a trademark, or something similar_), they have to be managed by one of about eight organisations, and the offerings are much simpler.

No problem though for two wonderful reasons - [Let's Encrypt](https://letsencrypt.org/) and [Certbot](https://certbot.eff.org/).

Let’s Encrypt is a free, automated, and open certificate authority (CA), run for the public’s benefit. It is a service provided by the Internet Security Research Group. They provide free TLS certificates to allow websites to use SSL.

Certbot, managed by the Electronic Frontiers Foundation, is a utility to automatically obtain certificates for a website from Let's Encrypt, and change the server configuration files to use them.

This makes this whole process amazingly painless. There's really no excuse for not adding this to your websites, and I'd highly encourage you to donate to both projects if you use Certbot.

## Certbot

I'm running NGINX on Ubuntu LTS on my VPS's, so installation was a snap (pun intended). I just followed the [instructions](https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal) which involved installing the snap, adding a symlink to ensure it was in my path, then running the bot passing it a flag to say I was using NGINX.

<a href="/images/screen-shot-2023-09-02-at-4.35.25-pm.png"><img src="/images/screen-shot-2023-09-02-at-4.35.25-pm.png" width="900" alt=""></a>

It asks you a couple of questions, intelligently (by reading all the nginx conf files) then downloads the certificates and edits the nginx site conf files to use them. It also adds a systemd timer command to automate checking to see if they need renewed every couple of hours.

Once that's done, you just go back to your website and you've got the magical padlock, and won't have to worry about it again due to the automatic renewal.
