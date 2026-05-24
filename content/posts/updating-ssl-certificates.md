---
title: "Updating SSL Certificates"
date: '2023-07-12'
slug: updating-ssl-certificates
aliases:
  - /2023/07/12/updating-ssl-certificates/
tags:
  - devops
  - hosting
  - nginx
  - ssl
  - uptime-kuma
  - web
---

When I first installed my SSL certificates, [I mentioned](/installing-ssl-certificates-with-nginx-on-docker/) it's a process I need to automate before they came up for expiry, but here we are ten days out, and I haven't done that yet, but I have been keeping an eye on it though the excellent display and notifications set up in [Uptime Kuma](/uptime-kuma-nfty/).

![](/images/screen-shot-2023-07-10-at-5.36.01-pm.png)

Updating the certificates is easy. When I went into the site at PorkBun (where I purchased the domain and who do the primary DNS for the site, the next certificates were sitting there to be downloaded. My existing certificates were due to expire on 30th July, and these had been generated on 3rd July.

The bundle included the same files as last time. You might remember from last [time](/installing-ssl-certificates-with-nginx-on-docker/) that we need to join the `domain.cert.pem` and `intermediate.cert.pem` to make the `fullchain.pem` file. I had just `cat`'d them together and this had caused an issue as there's no newline character at the end of the first file. I got smarter this time and googled up this [solution](https://stackoverflow.com/questions/8183191/concatenating-files-and-insert-new-line-in-between-files/23549826#23549826) which did the trick by using echo to insert the newline:

![](/images/screen-shot-2023-07-10-at-5.57.44-pm.png)

Once that was done, I uploaded them to the nginx directory where I stored them last time. Nginx reloads the config on restart, although there's probably a neater way as well, so I just restarted the container with Docker compose to pick up the new certificates. While I was doing that I got the ping from Uptime Kuma via [ntfy](https://ntfy.sh/) to say it was down, then up. I had a look at the display, and it's showing I've got another 84 days left on the cert.

![](/images/screen-shot-2023-07-10-at-6.10.32-pm.png)

So, 84 days for me to get around to automating this.
