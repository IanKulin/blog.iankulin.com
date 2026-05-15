---
title: "Deep Linking"
date: '2022-12-02'
slug: deep-linking
aliases:
  - /2022/12/02/deep-linking/
tags:
  - nfc
  - posts
---

I was listening to an [old episode of Fireside Swift](https://firesideswift.fireside.fm/100) today discussing NFC tags. I have a bundle of this tags in a drawer here somewhere - I thought it would be cool to tap one as I came home to turn off the CCTV and some other home automation things. But it turns out my phone (an SE2) has the capability for this, but only inside an app - not just from anywhere, whereas the proper phones can just tap anytime, and if the NFC payload is set up correctly, follow a URL, including by "deep linking" into an app.

Many years ago I worked on a project involving [injectable NFC animal tags](https://www.trovan.com/en/RFID-FAQ/rfid-animals) in emus, and fancied have one in my arm. The standard's moved on since then so probably good I didn't. Even though it seems convenient to tag emu's in their necks this is not a good idea as the tags move around in the fat layer and it can take some searching to find them with the scanner.

The podcast made me wonder about deep linking, and because the YouTube algorithm reads minds now (and possibly because I've enjoyed other Swift Arcade videos). I got served up this video this afternoon.

{{< youtube WmM4ryGcmSg >}}

Unfortunately, that's from UIKit days, for a more up to date look, [this post](https://betterprogramming.pub/scalable-navigation-with-deep-links-in-swiftui-96cea1764994) by Riccardo Cipolleschi. Is a better bet. I'll come back to it when I get a new phone ;-)
