---
title: "Project Based Learning"
date: '2022-12-01'
slug: project-based-learning
aliases:
  - /2022/12/01/project-based-learning/
tags:
  - learning
  - posts
---

![young woman holding a phone outside near a lake, painting - Stable Diffusion](/images/young-woman-holding-a-phone-outside-near-a-lake-painting.png)

A couple of times in conversations on [Fireside Swift](https://firesideswift.fireside.fm/) and [Swift Over Coffee](https://podcasts.apple.com/au/podcast/swift-over-coffee/id1435076502) the presenters have talked about the danger of just doing more and more tutorials to learn programming, and the benefit, in contrast, of building your own real app. Although I am very much still benefiting from the 100DaysOfSwiftUI I have been seeing some of the upside of working on a real app in the last day and a half.

From my search history, I've learned about:

-   Exporting files
-   Regex
-   Disabling autocorrect in a search box so the search doesn't re-run incorrectly the second you click out of it
-   You can't use .onDelete without a ForEach
-   There are good websites for converting CSV to JSON, and they mostly run in the browser which is good if you're using sensitive data
-   FileDocument
-   URLs to the sandbox
-   How UUIDs are really unique (spoiler, there's only a tiny chance they're not)
-   The frustratingly large number of ways to format dates
-   Sorting a FetchRequest in reverse order
-   Change in initial values of pickers in iOS16
-   It's possible, but not as easy as I was imagining to add your own data to the Environment
-   How to extract parts of strings
-   The Array(Set(array)) method of eliminating duplicates - I actually knew, but couldn't remember the details
-   Using a toggle switch
-   Jumping around in NavigationViews
-   Making a bottom tab bar
-   Dynamic filtering of a FetchRequest - revisited the [@twostraws method](https://www.hackingwithswift.com/books/ios-swiftui/dynamically-filtering-fetchrequest-with-swiftui)
-   Adding a search bar to a list
-   Using url response to see why a fetch wasn't working
-   Refreshed the trick to convert from snake\_case in JSON
-   Copying files to a remote SSH
-   Generating fake JSON data
-   The range of an Int32
-   Installing apache on the Pi
-   Looked up what the mergeByPropertyObjectTrump rules actually are
-   How to get the XCode preview back when you accidentally close it

I think it's significant that it's a real app. When I'm just noodling around making a fun app, if something seems hard when you look into it, there's the temptation to just do something else. In a real app you need to push through. For example I was bogged on having a search bar that live updated the list of results returned from Core Data as the user types. But this was a core part of the user experience required in this app, so I had to push through and learn the answers.
