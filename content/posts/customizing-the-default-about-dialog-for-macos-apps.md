---
title: "Customizing the default About dialog for MacOS apps"
date: '2022-10-07'
slug: customizing-the-default-about-dialog-for-macos-apps
aliases:
  - /2022/10/07/customizing-the-default-about-dialog-for-macos-apps/
tags:
  - macos
  - possibly-useful
  - swift5-7
  - xcode
  - xcode14
---

The default Xcode MacOS targeted app has a built in "About" dialog called up from the "About <app name>" menu item in the Mac menu bar. It wasn't immediately clear to me how to customise this, but after digging through some MacOS apps on GitHub, here's the answer.

When you app is being built, it looks for the file "Credits.rtf" in the app bundle. If that is found ([or "Credits.html" or "Credits.rtfd"](https://developer.apple.com/documentation/appkit/nsapplication/aboutpaneloptionkey/2869609-credits)) it's used to build out the About dialog along with your app icon.

After you've created the "Credits.rtf" file, you need to drop it into the folder for your project where the source files go. Then in Xcode, add it to your project in that inner folder:

![](/images/screen-shot-2022-10-03-at-1.15.45-pm.jpg)

Then when you rebuild the app, it will show in your about dialog.

![](/images/screen-shot-2022-10-03-at-1.16.33-pm.jpg)
