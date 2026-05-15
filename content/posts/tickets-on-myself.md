---
title: "Tickets on Myself"
date: '2022-11-27'
slug: tickets-on-myself
aliases:
  - /2022/11/27/tickets-on-myself/
tags:
  - app-ideas
  - posts
---

Way back on Day 47 I wrote a little habit tracking app. It was the challenge at the end of a JSON tutorial, so the persistence is done by writing the JSON to UserDefaults as a string. Basic as it is, it's installed on my phone and I check it a couple of times a day, and haven't missed a day of coding, or the weekly bin day since. It's strangely motivating.

I feel I've got enough Core Data skills now to write a small real app. This will be for teachers to record the reward tickets they issue for students. Two entities, Tickets and Students.

![](/images/img_2792.jpg)

![](/images/img_2793.jpg)

School staff need to be able to search for a student, and add a ticket for them. The tickets are for behaviours in particular categories and sub-categories, and can have a text description.

Eventually these tickets will have to be exportable somehow. Also it would be tedious to enter all the student data manually, so that needs to be importable. For the time being, the categories and sub-categories can just be a list that grows as they are entered, but eventually they should be importable as well. That data would be part of a bundle along with teacher names etc - again, importable somehow.

All this importing could be from a simple webserver inside the school network for the moment - I learned how to download a JSON file in an earlier tutorial, and can setup apache or similar on my pi here at home for testing. That probably does not scale to a commercial solution, but it gets around having to build a real back end with authentication etc for now.

Getting the data off is a similar problem. If I'm going to use the app for real at my school, it needs to integrate with an existing paper system, so exporting a PDF to my macBook would be lovely, or a text file to iCloud would be a good start.
