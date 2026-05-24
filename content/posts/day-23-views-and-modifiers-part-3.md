---
title: "Day 23 - Views and Modifiers - Part 3"
date: '2022-09-02'
slug: day-23-views-and-modifiers-part-3
aliases:
  - /2022/09/02/day-23-views-and-modifiers-part-3/
tags:
  - 100daysofswiftui
  - code
  - posts
  - swiftui
---

<img src="/images/psm_v10_d562_the_hindoo_earth-3.jpg" width="472" alt="">

The next part of day 23 started to make my brain hurt a bit. It's easy to imagine that when presenting a complex screen - perhaps some data from a source as a mixture of images and text loaded from a database into a scroll-able view, that the view may start to get complex. Then it becomes good practice to decompose the views to make the code clearer, less error prone, and to avoid any unnecessary repetition.

Paul's first suggestion is to pull some parts of the view as _properties_ of the same view.

struct ContentView: View {

    let greenText = Text("Hello").foregroundColor(.green)
    
    var body: some View {
        VStack{
            greenText
            greenText
        }
    }
}

This works fine, and exactly how you expect, except that if you don't enclose it in the VStack, you just get one Text, but two ContentPreviews. I do not understand why yet, but its probably something to do with the @ViewBuilder property wrapper.

But... a property can't refer to another property, so this isn't compilable Swift:

![](/images/screen-shot-2022-08-31-at-8.24.46-pm.png)

To get around this, we can use a computed property. So this works:

struct ContentView: View {
    
    @State private var greeting = "Hello"

    var greenText: some View {
        Text(greeting).foregroundColor(.green)
    }

    var body: some View {
        VStack{
            greenText
            greenText
        }
    }
}

In fact, this is what I've been doing so far to decompose views, although I've been dropping the segments underneath the main body to make things subjectively neater.

Paul cautions about returning multiple views in this computed property manner. So this does not work:

![](/images/screen-shot-2022-08-31-at-8.33.20-pm.png)

That makes sense - we were relying on the implied return. Putting them in a VStack would work - because we're just returning a single view (the VStack) which happens to contain multiple views.

struct ContentView: View {
    
    @State private var greeting = "Hello"

    var body: some View {
        VStack{
            greenText
            greenText
        }
    }
    
    var greenText: some View {
        VStack{
            Text(greeting).foregroundColor(.green)
            Text(greeting).foregroundColor(.green)
        }
    }
    
}

There's another view container type called Group which is like a stack, but just contains, rather than arranging, a collection of views, that can be used in the same way.

Alternatively, and I assume this is related to the problem I had above, we can just wrap the property with the @ViewBuilder attribute.

struct ContentView: View {
    
    @State private var greeting = "Hello"

    var body: some View {
        VStack{
            greenText
            greenText
        }
    }
    
    @ViewBuilder var greenText: some View {
        Text(greeting).foregroundColor(.green)
        Text(greeting).foregroundColor(.green)
    }
    
}
