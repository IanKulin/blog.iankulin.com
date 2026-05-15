---
title: ".git stuffed"
date: '2022-09-11'
slug: git-stuffed
aliases:
  - /2022/09/11/git-stuffed/
tags:
  - posts
---

I'm in a bit of a swing with my git process. I usually develop locally committing as needed, then when I reach some sort of first milestone, create an empty repo on GitHub the push up to it by:

```
git remote add origin git@github.com:IanKulin/RockPaper.git
git branch -M main
git push -u origin main
```

or, I start on GitHub, create a new repo with a readme.md in it, and then use the -f (force) flag when I push to it and override the contents. I think forgetting about this might have been the source of tonight's problems with "unrelated histories".

![](/images/screen-shot-2022-09-07-at-8.26.16-pm.png)

I'll try and reproduce it on the weekend - I thought I could just pull down the readme from github and the push up all my local changes, but I for the unrelated histories error. I started googling and entering git commands I knew nothing about for a while before just deleting the .git folder, and the github repo, and starting again.
