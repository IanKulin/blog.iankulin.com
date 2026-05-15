---
title: "FriendFace 61 Feedback"
date: '2022-11-26'
slug: friendface-61-feedback
aliases:
  - /2022/11/26/friendface-61-feedback/
tags:
  - 100daysofswiftui
  - challenge
  - code
  - coredata
  - swift5-7
  - xcode14-1
---

As usual after a challenge, I compare my efforts to Paul's model solution. Just to quickly recap the app, it sucks up some data (Users who have multiple friends) and displays it. The change in this challenge was to convert it to add that data to a Core Data store so that if a future network error prevented accessing new data, it could still display the old.

#### Merge Policy

The first difference is that Paul adds a merge policy. A Merge policy tells Core how to deal with any constraints defined in the data model. In this app, I'd defined the CachedUser.id as a constraint. The purpose of this is that under normal conditions the app would be picking up mostly the same data each time it started up. We don't want scabs of duplicate data, so constraining users based on their unique id is smart.

![](/images/screen-shot-2022-11-23-at-4.07.02-pm.png)

The [merge policy](https://developer.apple.com/documentation/coredata/nsmergepolicy/merge_policies) tells Core Data how to deal with these conflicts. The policy Paul uses is mergeByPropertyObjectTrump - basically the memory version of an object (in this case the one just provided by the JSON) writes over a previously stored version.

For testing, I had commented out my `try? moc.save()` otherwise I might have been reminded to do this one. First round to Paul, again.

#### Data

The data model and additions to the managed object source files were all pretty similar to mine, except that Paul left his id's as UUID and it seemed to be happy with these being written to, so I need to look into that to understand what I was doing wrong,

As far as copying the data over, Paul did it all in a function in the ContentView - I preferred my concept of having these as methods in CachedUser and CachedFriend. He mentions this, and it sounds like he agrees with me, but it's a tiny project so no matter.

#### MainActor

When outlining the challenge, Paul went to a bit of trouble to explain the way to avoid a clash between updating the view (based on the data) and updating the data using `await MainActor.run`. Without really knowing what I was doing, I put this call after the fetch for the JSON. In Paul's version he has this inside the fetch when it's complete. This actually makes more sense - with my version I might be building the Core Data copy before (or even while) it's being fetched.
