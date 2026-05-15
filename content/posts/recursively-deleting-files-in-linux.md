---
title: "Recursively Deleting Files in Linux"
date: '2023-04-14'
slug: recursively-deleting-files-in-linux
aliases:
  - /2023/04/14/recursively-deleting-files-in-linux/
tags:
  - command-line
  - homelab
  - linux
---

![](/images/nitchos_movie_scene_still_gravity_mixed_with_melancholia_univer_e6f94fb5-1e41-4b98-a749-3d6693a5ee6c.png)

I've been using this rsync command to backup files from my NAS to a USB drive. The --excludes are to avoid copying over some junk hidden files - some created by MacOS and some by Synology.

```
sudo rsync -rvit --exclude '*@eaDir*' --exclude '.DS_Store' /volume1/media/ /volumeUSB1/usbshare1-2/media --del
```

The `.DS_Store` files seem to be dropped by MacOS every time I view a directory on the NAS from my MacBook. They're not doing any harm, and they presumably do something handy for the Mac - remembering the view settings for that folder or some such. Nevertheless, they annoy me. It makes sense to not back them up - they don't serve any useful purpose in that context.

If I wanted to delete them anyway, how would I go about it? They are scattered randomly around, including in sub-directories of sub-directories. Is there some recursive flag I can add to `rm` to accomplish this?

I found a better solution on [AskUbuntu](https://askubuntu.com/questions/377438/how-can-i-recursively-delete-all-files-of-a-specific-extension-in-the-current-di), we can use the `find` command. This way it's easy to safely test your filename matching first before you destroy any files.

```
find . -name ".DS_Store" -type f
```

`-name` is clear enough, and the `-type f` option is just saying to look for files (rather than directories etc). The period at the start is the location, ie, start in the directory above so the current working directory is included. Once you've tuned this, you can add `-delete` to go nuclear.

```
find . -name ".DS_Store" -type f -delete
```
