---
title: "Gitting Xcode to Push"
date: '2022-09-30'
slug: gitting-xcode-to-push
aliases:
  - /2022/09/30/gitting-xcode-to-push/
tags:
  - git
  - github
  - possibly-useful
  - xcode
  - xcode14
---

I'm very comfortable with doing all the routine git stuff from the command line, but it was bugging me that I hadn't for the Xcode integration working. I was able to commit locally with no problem from Xcode, but could not push up to Github. It works fine from the command line, so the error about the change to a stronger SSH authentication didn't really make sense to me.

![](/images/screen-shot-2022-09-26-at-6.57.35-am.png)

> _ERROR: You're using an RSA key with SHA-1, which is no longer allowed. Please use a newer client or a different key type_.

[This post](https://developer.apple.com/forums/thread/702389) from [pasllani](https://developer.apple.com/forums/profile/pasllani) on the Apple Developer forums was super helpful, the only thing they missed was that you need to restart Xcode before it will work. The steps were:

1.  Generate a new ECDSA SSH key with `ssh-keygen -t ecdsa -C "IanKulin@kulin.com.au"`
2.  Copy the key to the keyboard with `pbcopy < ~/.ssh/id_ecdsa.pub`
3.  On Github, add the new SSH key, and while you're there, generate a new Token in Developer Tools
4.  In XCode, delete your github account, then recreate it specifying SSH and choose the ECDSA key. It will need the access token at this stage.
5.  Restart XCode

### Other git/Github posts

-   Intro to git - [Gitting Started](/gitting-started/)
-   Common git commands - [Gitting the Hang of it](/gitting-the-hang-of-it/)
-   [Merge vs rebase](/gitting-up-to-date/)
-   [Create an Empty Folder on Github](/create-an-empty-folder-on-github/)
-   [Download a Directory from a Github repo](/download-a-directory-from-a-github-repo/)
-   [Download a File from Github](/how-to-download-a-file-from-github/)
