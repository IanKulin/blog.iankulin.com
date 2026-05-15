---
title: "Copying a file via SSH"
date: '2022-11-29'
slug: copying-a-file-via-ssh
aliases:
  - /2022/11/29/copying-a-file-via-ssh/
tags:
  - possibly-useful
  - tools
---

I have a Raspberry Pi on my home network that I purchased for some project that I can't actually recall. It gets used for all sorts of completely unnecessary things such as playing with node.js or a private git server. To add to the list of things that I do on pi that could be more efficiently done on my MacBook I wanted to host my sample JSON from yesterday on it.

I'd already downloaded the JSON to my laptop (although I could have skipped that step and used curl to download it directly to the pi) and just wanted to transfer it into the apache html directory.

I feel like in 2022 I should just be able to SSH to the directory on the pi, then drag and drop the file from my mac, but that's not possible (although it does usefully paste the filepath to the file which could be helpful). Of course there is a command for this, you just need to know it - `scp`

My pi is on 192.168.100.13 and I log in as ian. The file I want to copy is called sample\_students.json.

In a terminal window, on your development machine:

`scp sample_students.json ian@192.168.100.13:/home/ian`

The first argument is the file to copy, and the second is the ssh accessible machine you are copying to with the path after the colon.

![](/images/screen-shot-2022-11-26-at-7.57.13-am.jpg)

![](/images/screen-shot-2022-11-26-at-7.56.32-am.png)
