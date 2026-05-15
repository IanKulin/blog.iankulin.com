---
title: "git stash"
date: '2022-11-12'
slug: git-stash
aliases:
  - /2022/11/12/git-stash/
tags:
  - git
  - possibly-useful
---

![mila kunis standing in front of a bank vault, watercolor painting - stable diffusion](/images/mila2.png)

When I was writing the blog post for the last project, I needed the "before" code to paste into the post. I'd committed that code, so a quick way to go back without losing my changes. I hadn't committed the new code, so there is a super easy way to accomplish this.

```
git stash
```

This grabs the code since the last commit and stashes it away, reverting the directory to the last committed version. I was able to copy the code I needed to the blog post, then to go back to my changes:

```
git stash pop
```

![](/images/screen-shot-2022-11-06-at-3.31.51-pm.png)

It does get more complex than this - it's git of course. It's possible to stash multiple changes then pop them back, it's also possible name them to selectively pop them, and to view the diffs. They are like little uncommitted branches - which can also be turned into branches. There's a [good outline here](https://www.atlassian.com/git/tutorials/saving-changes/git-stash) from Atlassian.
