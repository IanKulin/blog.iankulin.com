---
title: "61 Done"
date: '2022-11-25'
slug: 61-done
aliases:
  - /2022/11/25/61-done/
tags:
  - 100daysofswiftui
  - code
  - swift5-7
  - xcode14-1
---

![](/images/green_tick.svg_.png)

I think I've finally completed the minimum work for Day 61 of [#100DaysOfSwiftUI](https://www.hackingwithswift.com/100/swiftui/61). The task was to suck up some data in JSON, decode it. back it up into a Core Data graph then display the data from the Core Data.

I got stuck on dealing with the one:many relationship and had to revisit that from a different source to get my head around it, after that it was straightforward. Other small problem I ran into was that I created the id in the CachedUser as a UUID from (newly formed) habit. Then when I went to copy it in from the JSON version, it wouldn't let me. When I realised my mistake and changed it in the data model, I still could not figure out why it wasn't working - but of course I hadn't regenerated the code for the ManagedObject. I just had to change the property type in the already generated code from UUID to string and I was back in business.

There are five ominous looking, indecipherable messages in the console log, which I assume are related to Core Data, and I think may have begun after I changed the data model and didn't regenerate the NSManagedObjects. The app seems to work perfectly, but as usualy, this leaves me with an uneasy feeling of not understanding everything going on that I couldn't tolerate in a production app.

I'm looking forwards to seeing Pauls solution for this one - I was out of my depth for a while, but think I'm on to it. I might even pause on the course and build a better add/delete/edit app with a one:many in Core Data just to ensure I've really got the basics of this topic under my belt.

[Source](https://github.com/IanKulin/FriendFace/tree/main/FriendFace)
