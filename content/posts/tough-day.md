---
title: "Tough Day"
date: '2022-11-20'
slug: tough-day
aliases:
  - /2022/11/20/tough-day/
tags:
  - coredata
  - posts
---

![](/images/bad-day-at-sea-uspaceken.jpg)
*[Bad Day at Sea - reddit u/SpaceKen](https://www.reddit.com/r/Art/comments/7i7crd/bad_day_at_sea_ii_30_x_40_oil/)*

Day 61 of [#100DaysOfSwiftUI](https://www.hackingwithswift.com/100/swiftui/61) is a tough day. It's the first real big test of Core Data understanding, and I'm finding I didn't actually understand how the code for Core Data works. For the first time, I'm thinking of going back and redoing the days leading up to it.

To try and get it straight in my mind, here's how I think Core Data works:

1\. it's a way of persisting instances of objects - not a relational database (even though that's what's lying underneath it). I'm sure this is part of what is obstructing my thinking. Relational databases were my bread and butter for many years.

2\. Core Data won't just persist any old objects, you need to define these objects in the Data Model. They will be "NSManagedObjects"

3\. In the Data Model you can specify the "CodeGen". If it's left on the default "Class Definition" a hidden source file you can't access is generated deep in the build file so the objects exist - and therefore you can use them.

4\. If you set CodeGen to "Manual/None", it is now your responsibility to create that file. You usually select this, then tell XCode to generate them for you and add them to your project navigator by going in to Editor | Create NSManagedObject subclass. This then allows you to edit those files.

5\. To do anything these objects, you need a managaged object context. I'm not real clear on what this is. You create it in the App file, from a data controller that contains an NSPersistantObject. Then you save it to some super global called the environment.

6\. To add objects to the collection, you instantiate them using an initialiser that accepts the managed object context as an argument. Then to really persist them (as opposed to just the memory version) you call save() on the object context.

7\. To access the objects, you build a fetch request access a collection of them.

8\. It gets tricky when there are relationships between the objects.

My plan is to work through my own example of arrays of items vs a Core Data version of the same thing to ensure I've got it all straight in my head before coming back to the Day 61 challenge. I don't feel too bad about this - Paul makes a point that its a tough challenge, and I don't want to just "get it working" and move on with that uneasy feeling I might have code with errors I just haven't discovered yet.
