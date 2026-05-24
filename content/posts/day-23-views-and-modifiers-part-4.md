---
title: "Day 23 - Views and Modifiers - Part 4"
date: '2022-09-03'
slug: day-23-views-and-modifiers-part-4
aliases:
  - /2022/09/03/day-23-views-and-modifiers-part-4/
tags:
  - 100daysofswiftui
  - code
  - posts
  - swiftui
---

<img src="/images/psm_v10_d562_the_hindoo_earth-3.jpg" width="417" alt="This image has an empty alt attribute; its file name is psm\_v10\_d562\_the\_hindoo\_earth-3.jpg">

Then the last trick for for decomposing the views, is to remember we can pass values when we init a struct. So something like this:

struct ContentView: View {

    var body: some View {
        VStack{
            GreenPaddedText(text: "Hello")
            GreenPaddedText(text: "world")
        }
    }
    
    
    struct GreenPaddedText: View {
        var text: String

        var body: some View {
            Text(text)
                .foregroundColor(.green)
                .padding()
        }
    }
    
}

This is probably my favourite - because although in this example I've created the mini-view struct in the body, if it's a building block I can use elsewhere in a different view, it's super portable.
