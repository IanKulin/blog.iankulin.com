---
title: "External USB Drives in Linux"
date: '2023-02-18'
slug: external-usb-drives-in-linux
aliases:
  - /2023/02/18/external-usb-drives-in-linux/
tags:
  - linux
  - possibly-useful
  - storage
---

Many modern Linux distros will auto-mount USB drives - they just pop up in the graphical file manager as users would expect. When you're running server, older, or smaller versions, that's probably not going to be the case, and you'll have to do it old school.

Let's look at some basics. `[lsblk](https://man7.org/linux/man-pages/man8/lsblk.8.html)` will list the 'block' devices. Your output will almost certainly be a bit different than this.

```bash
root@pve:~# lsblk
NAME                         MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda                            8:0    0 119.2G  0 disk 
├─sda1                         8:1    0  1007K  0 part 
├─sda2                         8:2    0   512M  0 part /boot/efi
└─sda3                         8:3    0 118.7G  0 part 
  ├─pve-swap                 253:0    0   7.7G  0 lvm  [SWAP]
  ├─pve-root                 253:1    0  39.8G  0 lvm  /
  ├─pve-data_tmeta           253:2    0     1G  0 lvm  
  │ └─pve-data-tpool         253:4    0  54.6G  0 lvm  
  │   ├─pve-data             253:5    0  54.6G  1 lvm  
  │   ├─pve-vm--100--disk--0 253:6    0    10G  0 lvm  
  │   ├─pve-vm--101--disk--0 253:7    0    10G  0 lvm  
  │   ├─pve-vm--300--disk--0 253:8    0     8G  0 lvm  
  │   ├─pve-vm--102--disk--0 253:9    0     4M  0 lvm  
  │   └─pve-vm--102--disk--1 253:10   0    32G  0 lvm  
  └─pve-data_tdata           253:3    0  54.6G  0 lvm  
    └─pve-data-tpool         253:4    0  54.6G  0 lvm  
      ├─pve-data             253:5    0  54.6G  1 lvm  
      ├─pve-vm--100--disk--0 253:6    0    10G  0 lvm  
      ├─pve-vm--101--disk--0 253:7    0    10G  0 lvm  
      ├─pve-vm--300--disk--0 253:8    0     8G  0 lvm  
      ├─pve-vm--102--disk--0 253:9    0     4M  0 lvm  
      └─pve-vm--102--disk--1 253:10   0    32G  0 lvm 
```

If you look at the `type` column, you can see this machine has one _disk_, with three _partitions_, and the last partition has a heap of _logical volumes_. Let's plug the thumb drive in:

```bash
root@pve:~# lsblk
NAME                         MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda                            8:0    0 119.2G  0 disk 
├─sda1                         8:1    0  1007K  0 part 
├─sda2                         8:2    0   512M  0 part /boot/efi
└─sda3                         8:3    0 118.7G  0 part 
  ├─pve-swap                 253:0    0   7.7G  0 lvm  [SWAP]
  ├─pve-root                 253:1    0  39.8G  0 lvm  /
  ├─pve-data_tmeta           253:2    0     1G  0 lvm  
  │ └─pve-data-tpool         253:4    0  54.6G  0 lvm  
  │   ├─pve-data             253:5    0  54.6G  1 lvm  
  │   ├─pve-vm--100--disk--0 253:6    0    10G  0 lvm  
  │   ├─pve-vm--101--disk--0 253:7    0    10G  0 lvm  
  │   ├─pve-vm--300--disk--0 253:8    0     8G  0 lvm  
  │   ├─pve-vm--102--disk--0 253:9    0     4M  0 lvm  
  │   └─pve-vm--102--disk--1 253:10   0    32G  0 lvm  
  └─pve-data_tdata           253:3    0  54.6G  0 lvm  
    └─pve-data-tpool         253:4    0  54.6G  0 lvm  
      ├─pve-data             253:5    0  54.6G  1 lvm  
      ├─pve-vm--100--disk--0 253:6    0    10G  0 lvm  
      ├─pve-vm--101--disk--0 253:7    0    10G  0 lvm  
      ├─pve-vm--300--disk--0 253:8    0     8G  0 lvm  
      ├─pve-vm--102--disk--0 253:9    0     4M  0 lvm  
      └─pve-vm--102--disk--1 253:10   0    32G  0 lvm  
sdb                            8:16   1  14.5G  0 disk 
└─sdb1                         8:17   1  14.5G  0 part 
```

There we are, down the bottom. Our disk is `sdb`, and partition is `sdb1`. So the OS knows it exists - it's recognised, but to use it we need to `mount` it to the file system somewhere. Mounting it will let us see and interact with the files on the drive.

By convention, removable media is often mounted in `/media` or `/mnt`, but it can be wherever you like. Let's make a directory for it in `/media` and mount it there.

```bash
root@pve:/# mkdir /media/external
root@pve:/# mount /dev/sdb1 /media/external
root@pve:/# ls /media/external
'02 Advance Australia Fair 1 verse vocal.mp3'  'Year 3 Pack.pdf'
'Araw ng Kasarinl'$'\341''n.mp4'	       'Year 4 Pack.pdf'
'System Volume Information'		       'Year 5 Pack.pdf'
'Year 1 Pack.pdf'			       'Year 6 Pack.pdf'
'Year 2 Pack.pdf'
root@pve:/# 
```

Success!

If we do the lsblk again, you'll see out mount point in the listing

```bash
root@pve:/# lsblk
NAME                         MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda                            8:0    0 119.2G  0 disk 
├─sda1                         8:1    0  1007K  0 part 
├─sda2                         8:2    0   512M  0 part /boot/efi
└─sda3                         8:3    0 118.7G  0 part 

...

sdb                            8:16   1  14.5G  0 disk 
└─sdb1                         8:17   1  14.5G  0 part /media/external
```

Of course, just as in Windows, we need to tell the OS when we want to remove a removable drive to ensure that any caches are flushed and that we don't inadvertently lose data when we yank it out. This is the _unmounting_ process.

We can unmount a drive with the `[umount](https://man7.org/linux/man-pages/man8/umount.8.html)` command.

```bash
root@pve:/# ls /media/external
'02 Advance Australia Fair 1 verse vocal.mp3'  'Year 3 Pack.pdf'
'Araw ng Kasarinl'$'\341''n.mp4'	       'Year 4 Pack.pdf'
'System Volume Information'		       'Year 5 Pack.pdf'
'Year 1 Pack.pdf'			       'Year 6 Pack.pdf'
'Year 2 Pack.pdf'
root@pve:/# umount /media/external
root@pve:/# ls /media/external
root@pve:/# 
```
