---
title: "Day 47 - Habits App"
date: '2022-10-27'
slug: day-47-habits-app
aliases:
  - /2022/10/27/day-47-habits-app/
tags:
  - 100daysofswiftui
  - app
  - code
  - posts
  - swift5-7
  - xcode14
---

I've been mucking around with the Habits app too long - it's started to look like procrastination. It already meets the [specification](https://www.hackingwithswift.com/100/swiftui/47), so I'm calling it an MVP and moving on.

[![](/images/github-mark-32px.png)](https://github.com/IanKulin/Habitual)

![](/images/img_3110.png)

This is the first app of mine I've loaded onto my phone and started using, and there are a couple of things I'd like to do with it. It currently just lets you specify how many days between an activity repeating - so if you say you should go to the gym every second day, and you complete that activity on Monday, "Gym" will make it's way to the top of the list on Wednesday. While it's waiting in the list for Wednesday to come around, it will show the "Due" time as being exactly 48 hours after you last pressed "done" on it. But if the habit you want is to go to the gym after work at 6:00pm that's when you want it to be due. I'd like that.

This does overlap a bit with the idea of a "ToDo" list, so maybe it's a feature creep it shouldn't have. Espeically since the reason I wanted it was because in the process of adding test activities I added "Take out the bins" and that has to be done on Wednesday nights.

Paul' has moved away from all the data being in an @State in the View to having a data model object in a separate file. It feels like only a few steps until he jumps out from behind a bush and says "You've been writting MVVM already!" although currently its a bit more like just MV.

The list of things I'm going to come back to is growing - I also have still not finished writing the custom picker so I can match the design work I paid for on the [times table app](/design-help/). Nevertheless, I've so far spent 120 days on the [#100DaysOfSwiftUI](https://www.hackingwithswift.com/100/swiftui) and I'm only up to day 47, so time to get moving.
