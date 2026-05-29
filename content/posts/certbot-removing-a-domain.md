---
title: "Certbot - removing a domain"
date: '2024-03-18'
slug: certbot-removing-a-domain
aliases:
  - /2024/03/18/certbot-removing-a-domain/
tags:
  - certbot
  - hosting
  - https
  - possibly-useful
  - posts
  - tls
  - web-dev
---

I had a number of domains all running on one host when I first set them up with certbot. One started to be serious, so I moved it to another host and ran certbot there. That all worked perfectly, but of course, the old domain is still part of the original certificate, so when I went to renew it, it came up with some errors.

Here's a few commands that are going to help navigate this situation if you've found yourself in the same spot:

#### Show all certificates and which domains

```bash
sudo certbot certificates
```

#### Renew just some domains

There's no way to delete a domain from a certificate, the process is to renew it, but just for the domains you want to keep. Certbot will notice you've missed some and warn you that you're effectively deleting them.

```bash
sudo certbot --cert-name <certifcate-name> -d <domain1> -d <domain-2>
```
