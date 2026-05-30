---
title: "Share files securely with Enclosed"
date: '2025-01-27'
slug: share-files-securely-with-enclosed
aliases:
  - /2025/01/27/share-files-securely-with-enclosed/
tags:
  - file-sharing
  - homelab
  - possibly-useful
  - privacy
  - security
---

<a href="/images/screen-shot-2024-12-05-at-7.53.56-pm.png"><img src="/images/screen-shot-2024-12-05-at-7.53.56-pm.png" width="1000" alt=""></a>

My accountant works for one of those giant firms, and it bugs me that I'm emailing him password protected zip files of my accounts rather than to a secure upload facility at his firm. I can fix this with the power of self hosting, by running my own secure file dropping app on a VPS.

There's a number of applications that [do this sort of thing](https://github.com/awesome-selfhosted/awesome-selfhosted?tab=readme-ov-file#file-transfer---single-click--drag-n-drop-upload) - allow you to upload a file, get a link in return which you can then share to people to download the file. For this to be more secure than emailing, the file needs to be encrypted on the server, and we want to be able to set a password, impose limits on downloads, and limit how long the link lives for. I've previously looked at [Sharry](https://github.com/eikek/sharry) which adds the ability for unauthenticated users to _upload_ files to you securely, but for this slightly simpler job, I chose [Enclosed](https://github.com/CorentinTh/enclosed) by [Corentin Thomasset](https://corentin.tech/).

The docs provide a [simple compose file](https://docs.enclosed.cc/self-hosting/docker-compose) to get going docker. Mine is slightly more complex because it's proxy-ed with Nginx Proxy Manager, so it needs to share it's network.

```yaml
services:
  enclosed:
    container_name: enclosed
    image: corentinth/enclosed
    restart: unless-stopped
    networks:
      - nginx-proxy-manager_default

networks:
  nginx-proxy-manager_default:
    external: true
```

### Authentication

What's not well explained in the docs is how to set up authenticated login. By default, if you throw this up on a VPS, the entire world can use it to share their files. What I'd like is that I log in to share a file, but the person I send the link to can download the file without logging in. This is easy to do, we just need to add a couple of environment variables to our compose file. I always like to keep my secrets in an .env file since I source control all my home-lab and VPS setups, and I don't want the secrets in source control.

Here's a sample .env file. This just goes in the same directory as our docker-compose.yml

```bash
AUTHENTICATION_USERS=example@example.com:$$2a$$10$$n4StEr5Tcat7jItq
PUBLIC_IS_AUTHENTICATION_REQUIRED=true
```

The AUTHENTICATION\_USERS string is just the username and a bcrypt salted/hashed password. You don't need to do anything hard to create this, the project kindly provides a [tool for it](https://docs.enclosed.cc/self-hosting/users-authentication-key-generator).

The tool includes an option for escaping the '$' character correctly for docker compose files (hence the double $ in the string above.

To use this `.env` file, we pull in the values in the docker-compose thus:

```yaml
services:
  enclosed:
    container_name: enclosed
    image: corentinth/enclosed
    environment:
      - AUTHENTICATION_USERS=${AUTHENTICATION_USERS}
      - PUBLIC_IS_AUTHENTICATION_REQUIRED=${PUBLIC_IS_AUTHENTICATION_REQUIRED}
    restart: unless-stopped
    networks:
      - nginx-proxy-manager_default

networks:
  nginx-proxy-manager_default:
    external: true
```

Once that's running, the user name and password will required to upload files or write notes. The interface is clean and self-explanatory:

<a href="/images/screen-shot-2024-12-05-at-8.34.47-pm.png"><img src="/images/screen-shot-2024-12-05-at-8.34.47-pm.png" width="900" alt=""></a>
