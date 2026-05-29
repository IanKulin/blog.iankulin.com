---
title: "NGINX Proxy Manager"
date: '2024-04-15'
slug: nginx-proxy-manager
aliases:
  - /2024/04/15/nginx-proxy-manager/
tags:
  - devops
  - homelab
  - nginx
  - nginx-proxy-manager
  - reverse-proxy
  - web-dev
---

I've mentioned using NGINX as an [interface between the internet and a service](/nginx-in-front-of-a-node-js-app/) a while ago. This works by all incoming traffic coming to NGINX, and NGINX determining which service that traffic should go (from the NGINX config files) then acting as a middleman. This functionality is generally referred to as a 'reverse proxy'.

<img src="/images/nginx.png" width="959" alt="Terrible drawing of NGINX proxying requests off to different services.">

This is nice for a few reasons:

-   We can have a single point of entry to the services, easier to lock down and secure, with access centrally logged
-   The services can be running on all sorts of odd addresses and ports (for example 192.168.101.23:4002) but they can be addressed with sensible names by the user (such as todo.example.com)
-   We can add [basic auth](/quick-dirty-auth-with-nginx-node/) to any services that need it.

All this stuff is managed through the [NGINX config](/nginx-config-on-debian-ubuntu/) files. Perhaps one might look like this:

```bash
server {
    listen 80;
    server_name example.com;

    location / {
        root /var/www;
        index index.html;
    }

    location /app2/ {
        proxy_pass http://192.168.101.65:8096/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /secure_area/ {
        auth_basic "Restricted";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
}

server {
    listen 80;
    server_name app1.example.com;

    location / {
        proxy_pass http://192.168.101.23:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

These config files are powerful, and in the usual trade-off somewhat complicated and I've certainly made problems for myself in the past by making errors in them.

There is a great project, [NGINX Proxy Manager](https://nginxproxymanager.com/) that throws a nice web GUI on this process. On top of that, it makes the process of obtaining [Let's Encrypt](/certbot-lets-encrypt-are-great/) SSL certificates even easier than CertBot.

<img src="/images/npm.png" width="946" alt="Terrible drawing of NGINX Proxy Manager proxying requests off to different service, and obtaining SSL certificates for them.">

NGINX Proxy Manager is available as a docker image, and is trivial to set up if you're used to docker. Once that's done, the process of adding the proxies is simple enough that you probably don't need any instructions.

![](/images/screen-shot-2024-03-31-at-8.59.56-am.png)

### Alternatives

Rolling your own, or using NGINX Proxy Manager are not your only options. There's also:

-   [HAProxy](https://www.haproxy.org/#desc) - an industrial strength proxy/load balancer
-   [Caddy](https://caddyserver.com/docs/quick-starts/reverse-proxy) - same as NGINX but different. Has a great plugin architecture. A particular plugin [Caddy-docker-proxy](https://github.com/lucaslorentz/caddy-docker-proxy) enables configuration of each service with tables inside the service's docker-compose file which is a particularly neat trick.
-   [Traefik](https://traefik.io/traefik/) - does a similar trick to Caddy-docker-proxy of figuring out it's config from the services it's proxying. It's a serious bit of kit valuable for putting in front of huge Kubernetes swams, and is therefore probably a bit more complex to manage than Caddy-docker-proxy.

I haven't used any of these (except NGINX Proxy Manager) so take these descriptions as a starting point only.

For any self-hosted (at home or on a VPS) services, you are going to need some of this functionality, and NGINX Proxy Manager is a simple, robust approach that should definitely be considered.
