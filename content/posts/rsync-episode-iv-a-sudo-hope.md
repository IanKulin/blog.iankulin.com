---
title: "rsync episode IV - a sudo hope"
date: '2023-03-30'
slug: rsync-episode-iv-a-sudo-hope
aliases:
  - /2023/03/30/rsync-episode-iv-a-sudo-hope/
tags:
  - debugging
  - homelab
  - linux
  - permissions
  - rsync
---

![](/images/imperialofficersworkingatl_62923535.png)

With all those earlier rsync bumps out of the way, I was ready to try my first rsync backup at the command line to sync my movies directory on the NAS to a (NTFS formatted) USB drive plugged into the same NAS. This is to be one of the simplest since there's no remote server involved, just copying from mount point directory to another - so no drama with remote permissions.

There's a lot of files involved, and I knew from running the dry run that there would be a lot of output. I could see a few error messages, but each of the file copies was taking a while so I was confident they, at least, were working. If you missed the last episode, here's where I landed for this rsync command.

```
rsync -avi --exclude '*@eaDir*' /volume1/media/video/Movies/ /volumeUSB1/usbshare/media/video/Movies --del
```

Before I worried about the error messages, I had a look to see if the files had been copied correctly, but they had not. Even though each file was taking about the right amount of time to copy, the new files were not making it to the destination directories. Nor did they seem to be anywhere else. So I guess go back to the error messages and try to understand them. Here's a _very_ condensed selection of the output.

```

rsync: failed to set times on "/volumeUSB1/usbshare/media/video/Movies/Jungle Book (1942)": Operation not permitted (1)

...

>f+++++++++ Jungle Book (1942)/Jungle Book (1942).mkv
>f+++++++++ Jungle Book (1942)/trailer.mp4

...

rsync: mkstemp "/volumeUSB1/usbshare/media/video/Movies/Jungle Book (1942)/.Jungle Book (1942).mkv.Wd141R" failed: Operation not permitted (1)

rsync: mkstemp "/volumeUSB1/usbshare/media/video/Movies/Jungle Book (1942)/.trailer.mp4.TNu7UC" failed: Operation not permitted (1)
```

This log is from one of my later attempts. This video was new on the NAS so an earlier running of the rsync would have had some more lines about creating the directory on the USB - and I had a through the file browser in the NAS. The correct directory had been created, but there were no files in it.

Let's have a look at this output a bit at a time:

```
rsync: failed to set times on "/volumeUSB1/usbshare/media/video/Movies/Jungle Book (1942)": Operation not permitted (1)
```

rsync is trying to update the date/time of the destination folder to match the source one - something similar to the `touch` command. `not permitted` sounds like a [permissions issue](/could-it-be-a-permissions-problem/). There was one of these messages for every directory and they were all near the start of the log.

```
>f+++++++++ Jungle Book (1942)/Jungle Book (1942).mkv
>f+++++++++ Jungle Book (1942)/trailer.mp4
```

These are not errors, but encouraging output. The code at the beginning says what's going on - they are files, and are being copied from the source to the destination. These showed up for every file that was in the source but not the destination, and the times for the file copies felt about right - the .mkv file took a while, the trailer was quick. These messages were all together in the middle of the log.

```
rsync: mkstemp "/volumeUSB1/usbshare/media/video/Movies/Jungle Book (1942)/.Jungle Book (1942).mkv.Wd141R" failed: Operation not permitted (1)

rsync: mkstemp "/volumeUSB1/usbshare/media/video/Movies/Jungle Book (1942)/.trailer.mp4.TNu7UC" failed: Operation not permitted (1)
```

`[mkstemp](https://man7.org/linux/man-pages/man3/mkstemp.3.html)` is a command for creating a temporary file. It's common in operating systems to use a hidden temporary file when transferring a file - you save into the temp file then rename it when its successfully completed. I'm guessing that's what's happening here, and it's failing for permissions reasons. What I don't understand is why they would all be grouped together at the end of the log instead of back next to each individual copy.

But anyway, this is clearly a permissions problem. I can easily check this just by trying the copy manually. I'm still logged in as the same user who executed the `rsync` command so the `cp` will have the same rights etc and so should also fail...

No - this copy worked perfectly. No error message, and when I used the NAS filebrowser, the new file had correctly copied onto the USB drive.

```
cp /volume1/media/video/Movies/'Jungle Book (1942)'/'Jungle Book (1942).mkv' /volumeUSB1/usbshare/media/video/Movies/'Jungle Book (1942)'/
```

So somehow `rsync` is running with lower permissions than `cp` when executed by the same user? Well, (grasping at straws now) what if I `sudo` it? I tried that, and (1) there's no _set times_ error, (2) all the file copies worked, and (3) no _mkstemp_ errors.

```
sudo rsync -avi --exclude '*@eaDir*' /volume1/media/video/Movies/ /volumeUSB1/usbshare/media/video/Movies --del
```

I did notice one other difference, there was lots of 'o' in the itemize changes output:

```
.d..tpo.... Jungle Book (1942)/
>f..tpo.... Jungle Book (1942)/Jungle Book (1942).mkv
>f+++++++++ Jungle Book (1942)/trailer.mp4
```

From the [man page](https://download.samba.org/pub/rsync/rsync.1#opt--itemize-changes):

`.d..tpo....` - not being copied, it's a directory, modification time is different and is being updated, permissions are different and are being updated, the owner is different and is being updated

`>f..tpo....` \- is being copied to destination, it's a file, modification time is different and is being updated, permissions are different and are being updated, the owner is different and is being updated

`>f+++++++++` - is being copied to destination, it's a file, everything is being newly created so will be the same as the source

So that's a major step forward, the files are syncing correctly, and if I rerun the rsync and haven't made any changes to the source files, it zips through. I do notice it is still updating the permissions and owner each time. This doesn't produce an error message, but since it thinks they need done every run it suggests it is not happening correctly.

It's possible the owner/permissions issue is related to the USB drive being NTFS formatted. It's also possible I can get rsync to stop trying to change those since they are not important in this context. the `-a` flag (short for archive) is a shortcut that pulls in a number of other flags. Perhaps I can just pick the ones I need and eliminate the owner and permissions ones.

Having to sudo to get this to work does not seem like a great solution - presumably this will come back to bite me when I try and automate it. So there is still some figuring out to do, but at least one step of my backup is down now.
