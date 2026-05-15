---
title: "rsync / Synology / @eaDir"
date: '2023-03-28'
slug: rsync-synology-eadir
aliases:
  - /2023/03/28/rsync-synology-eadir/
tags:
  - eadir
  - homelab
  - posts
  - rsync
  - synology
---

![](/images/extendedattributes_31636167.png)

The reason I've been figuring out rsync is to setup my backup strategy. Eventually this will partly be managed with scheduled tasks (ie cron jobs) running rsync. I wanted the SSH in and try this out, since I didn't know some basic things like the mount points of the shares.

### Mount points

My first issue was to find the paths to all my data. This turned out not to be a drama. Each of the volumes you create when the NAS is set up are just in the root directory. This includes any USB drives plugged in.

![](/images/screen-shot-2023-03-25-at-8.08.10-pm.png)

Inside each of those _volumes_ are any _shares_ you've created. At the moment I want to rsync my movies which are in a 'media' share on volume1 to the usb drive, so the directories I'll be using are:

`/volume1/media/video/Movies/`  
`/volumeUSB1/usbshare/media/video/Movies`

### rsync attempt

rsync has a cool feature whereby you can do a 'dry run' where it goes through the motions of the command you've given it, but doesn't change any files. If you combine this with the verbose output, you can clearly see what it's going to do before you let it start changing things. That's an especially good idea when you're dealing with large amounts of data, so my first pass at this included the -n option.

```
rsync -avin /volume1/media/video/Movies/ /volumeUSB1/usbshare/media/video/Movies --del
```

The situation with these two lots of data is that I've copied my media off the USB drive onto the NAS, then when I installed Jellyfin to access it, I discovered lots of misnamed items (had the years incorrect mostly) and I've been combining some directories, and renaming others and so on. So I expected this first run or rsync to pull up a heap of changes to make, which it did - thousands of lines of them.

I noticed a lot of them included this weird directory that I didn't recognise.

```
>f+++++++++ @eaDir/Tora Tora Tora (1970 PG)@SynoEAStream
>f+++++++++ @eaDir/Tora Tora Tora (1970 PG)@SynoResource
```

I've since learned it might be extended attributes, people started noticing it around the introduction of DSM7. [I don't seem to be the only user who hates](https://tech.webit.nu/synology-nas-those-eadir-folders/) Synology messing with my data. There's some consensus they are created by the indexing service (which I've turned off as much as is possible in the GUI) and when the [drives are externally mounted](https://www.reddit.com/r/synology/comments/exh5ho/preventing_eadir_from_being_created/) \- which of course I have been doing quite a bit while moving things around.

I'll tackle removing them all and trying to prevent their reoccurence another day, but for the moment, I'll just tell rsync to ignore them using the `--exclude` option.

```
rsync -avin --exclude '*@eaDir*' /volume1/media/video/Movies/ /volumeUSB1/usbshare/media/video/Movies --del
```
