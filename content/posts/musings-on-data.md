---
title: "Musings on Data"
date: '2022-10-16'
slug: musings-on-data
aliases:
  - /2022/10/16/musings-on-data/
tags:
  - data
  - noodling
  - posts
---

I've been feeling my enthusiasm for the online courses I started waning a little, additionally, I have enough progress under my belt that I could actually start working on some of the projects in my "App Ideas" notebook. I'm not sure if starting on them is a smart idea, or just a way of procrastinating. One thing most of those apps have in common, and that I haven't substantively learned yet is persisting data. Their data requirements vary from a sort of specialised todo list only required on that device, to relational data that needs to be live synced across devices including macOS and needs to support rolling back transactions to resolve conflicts.

The [iExpense](/iexpense-challenges/) app from the [100 Days course](https://www.hackingwithswift.com/books/ios-swiftui/archiving-swift-objects-with-codable) included encoding data to JSON then saving it in UserDefaults, but that's the extent of my data expertise so far. And, that would be fine for a prototype version of a couple of the app ideas for now.

I know these things exist:

-   Core Data (and, I imagine CloudKit for saving the SQLite in iCloud)
-   FireBase - the Google database engine that seems popular for serious apps that need to share data
-   It's possible to just save files in the apps sandbox (which I don't know how to do, but sounds a bit more legit that using UserDefaults)

In programming terms, I grew up on large relational databases - on disk. RAM used to be much more precious and capricious, and saving a file much slower - so I have some thinking adjustments to do. For my Todo type app that's not likely to have more than 100 records, it's probably legit to just encode the whole thing to JSON and write it to a file for every add/edit/delete.

I'm not sure what I'll do - the logical thing is to buckle down and work through the 100 days until I get to databases in the tutorials, but if working on apps is more engaging and leads to more programming that could be better. My jobby-job was particularly demanding this week, so perhaps the weekend will fix this problem for me.
