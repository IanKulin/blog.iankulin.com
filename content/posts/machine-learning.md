---
title: "Machine Learning"
date: '2022-09-15'
slug: machine-learning
summary: "Reflecting on how a Tom-Tom GPS once seemed to predict my destinations, I work through Day 27 of 100 Days of SwiftUI, which covers CoreML by training a model in CreateML from Xcode and using it in an app. I note how straightforward the process was and that I'm more excited about small uses of machine learning, like better defaults for user inputs, than ambitious applications. I link to Apple's machine learning introduction."
aliases:
  - /2022/09/15/machine-learning/
tags:
  - 100daysofswiftui
  - core-ml
  - machine-learning
  - posts
---

A few years ago when I still used a Tom-Tom for car navigation, I was a little freaked out when it started offering suggestions on where to go to when I started the car - guessing, usually correctly, where I wanted to go. Like - how did it know I was leaving school for band practice two towns over?

Clearly, is must have been collecting data on times/days and departure locations to learn some of my habits. It felt quite invasive, but I thought it must have been on-device since I had the wifi turned off in the unit.

In [Day 27](https://www.hackingwithswift.com/100/swiftui/27) of 100 Days of Swift UI we CoreML and use a dataset to train a model, then incorporate it in an App. The most shocking thing about it was how straightforward it was. In the example, the model was trained in CreateML from XCode and only used on the device, rather than trained on it, but current iPhones have the power to do that.

Obviously there's some amazing things that can be done with machine learning, but I'm actually more excited about the small things - perhaps just offering better defaults for user inputs.

There's a great intro to machine learning for Apple developers [here](https://developer.apple.com/machine-learning/).
