---
title: "Don't ship your secrets"
date: '2026-09-09'
slug: dont-ship-your-secrets
summary: "The 404 requests I logged on a domain within seconds of Traefik requesting its Let's Encrypt certificate, all from four IP addresses. The list is dominated by bot probes for exposed .env files and git metadata, along with fingerprinting for software like Jira and Exchange."
tags:
  - env
  - security
  - webdev
  - SSL
---
Here's the 404's for a domain in the first few seconds after Traefik had requested a Let's Encrypt cert for it. These were from four IP addresses. I've sorted them and removed the duplicates. All these .env files are low hanging fruit for the bot army. Most of the others are information signals for followups - ie is this Jira?, is this Microsoft Exchange? etc. 

* I like how hopeful `/..%2F.env` is. I was like "aww dude - old school path traversal!"
* My followup for secrets being committed is to delete them from the history, force that to the repo, and rotate them. Even though I do not intend to ship `.git/`, that still seems validated.
* `GET /.well-known/security.txt` is one of the most interesting to me - I'm not sure what the motivation would be here - perhaps looking for a bug bounty signal?

*None* of them looked for `/robots.txt` - terrible manners these bots!

```bash
GET /___proxy_subdomain_cpanel
GET /___proxy_subdomain_whm/login
GET /..%2F.env
GET /.DS_Store
GET /.env
GET /.env.backup
GET /.env.bak
GET /.env.dev
GET /.env.live
GET /.env.local
GET /.env.old
GET /.env.prod
GET /.env.production
GET /.env.save
GET /.env.stage
GET /.env.staging
GET /.git/config
GET /.git/HEAD
GET /.vscode/sftp.json
GET /.well-known/security.txt
GET /@vite/env
GET /about
GET /actuator/env
GET /api/.env
GET /app/.env
GET /application/.env
GET /backend/.env
GET /config.json
GET /config/.env
GET /console/
GET /debug/default/view?panel=config
GET /ecp/Current/exporttool/microsoft.exchange.ediscovery.exporttool.application
GET /env
GET /functions/.env
GET /info.php
GET /login.action
GET /s/736313e2832313e2732323e2336313/_/;/META-INF/maven/com.atlassian.jira/jira-webapp-dist/pom.properties
GET /server
GET /server-status
GET /telescope/requests
GET /trace.axd
GET /v2/_catalog
POST /api
POST /api/gql
POST /api/graphql
POST /graphql
POST /graphql/api
```