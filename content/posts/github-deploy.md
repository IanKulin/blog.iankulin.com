---
title: "Cloning a Private Repo"
date: '2026-05-19'
slug: github-deploy
tags:
  - git
  - github
  - linux
  - ssh
draft: true
---

If you need a copy of the code in a repository on a git forge (such as github or codeberg) it's pretty straightforward:

```bash
git clone https://codeberg.org/kitten/app.git
```

or if you just want the current code without all the git history
```bash
git clone --depth 1 https://github.com/left-pad/left-pad.git
```

I have my VPS setup as a git repo - All the configs and docker compose files together, so to move to a different VPS I just clone that repo and add my .env files and restore the backups. But that's in a private repo, so cloning won't work.

```bash
ian@ct390-test:~$ git clone --depth 1 git@github.com:IanKulin/VPS-prod-01.git
Cloning into 'VPS-prod-01'...
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
ian@ct390-test:~$ 
```



