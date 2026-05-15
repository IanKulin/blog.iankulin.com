---
title: "Where's My App?"
date: '2022-10-08'
slug: wheres-my-app
aliases:
  - /2022/10/08/wheres-my-app/
tags:
  - macos
  - possibly-useful
  - xcode
  - xcode14
---

The iOS apps I've been making, can only run in the simulator or on my tethered device (which I haven't actually tried yet), but the MacOS app I made today, in theory could be zipped up and distributed to the world from my website. At the very least, I wanted to drop it into my Applications folder so I could use it, so I needed to find the .app "file", and realised I had no idea where it was. If that's your situation, then here's the steps you need.

First of all, you are currently building debug versions of your app. We need to create a new _Scheme_ for the release build. In Xcode use the menus to go to Product | Scheme | New Scheme...

![](/images/screen-shot-2022-10-03-at-1.51.03-pm.jpg)

Give it a sensible name - maybe `<app name> Release` or similar. Then Product | Scheme | Edit Scheme and on the Info tab, change it to a _Release_ build.

![](/images/screen-shot-2022-10-03-at-2.40.14-pm.png)

Build the app (Product | Build ), then back in the Product menu, there's an item "Show Build Folder in Finder". Click on that, and there's your different builds. In the Release folder will be the _<app name>.app_ file that can be copied into your applications folder.

I'm not actually sure if this is a file, more likely a folder that MacOS is pretending is a file. If you right click on it and select "Show Package Contents" you can see the actual files inside it.
