---
title: "List Apps"
date: '2022-10-20'
slug: list-apps
aliases:
  - /2022/10/20/list-apps/
tags:
  - philosophy
  - posts
  - swiftui
---

![girl making a list at a desk, graphic novel - Stable Diffusion](/images/girl-making-a-list-at-a-desk-graphic-novel.jpg)

When I was first programming professionally, it wasn't long before I noticed that there were patterns to the sort of bread-and-butter things I was writing most times - the majority of the small business applications I wrote tracked several entities; for each entity there needed to be add/edit/delete screens, there would be some business rules around those things, and some reports and search functionality.

The [Day 47 Milestone app](https://www.hackingwithswift.com/guide/ios-swiftui/4/3/challenge) is for tracking habits - presented in a list; you need to be able to add and delete them, view details and do some business logic on them. Not only does this sound a lot like the earlier expense tracking app, but also not that different to the app idea I've got for tracking when I charge each of the rechargeable batteries in my house.

Eventually these list type apps written in SwiftUI will need a better (perhaps MVVM) architecture, but at the simple end, it seems these apps are going to be some variation on this recipe:

-   The item is going to be a struct with an id
-   It will conform to Identifiable and Codable
-   The collection of items will be a class that inherits from ObservableObject
-   The collection property will be @Published
-   The collection property will have an init() that reads the items from somewhere and a didset() that writes them
-   The instance of that collection class will be an @StateObject
-   The items will be shown as a List inside a NavigationView
-   It will probably have a toolbar with a control to add items

Patterns in development like this are convenient - they lead to high quality programs developed quickly, and being compliant with the [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/guidelines/overview/) means all the behaviours will be familiar to users as well as being accessible.

The danger is that they look and feel like every other list type app, so developers need to think carefully about what all the common use cases are, as well as appealing design, to ensure the users' needs are being addressed and the application can justify it's existence alongside all the other offerings.
