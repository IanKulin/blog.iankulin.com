---
title: "SF Symbols"
date: '2022-07-21'
slug: sf-symbols
aliases:
  - /2022/07/21/sf-symbols/
tags:
  - posts
  - sean-allen
  - ui
---

A couple of times in the App Development seminar I went to, we used system symbols in the place of images, and in his tutorial on Swift UI Basics, Sean Allen spent a few minutes talking about where they come from and how to choose them.

First, here's how they look in code - this is from the default Hello World app.

```
struct ContentView: View {
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundColor(.accentColor)
            Text("Hello world")
        }
    }
}
```

![](/images/screen-shot-2022-07-17-at-7.26.23-am.png)

The `systemName` parameter signifies the image is this type, and `"globe"` is the name of the image. The code above draws a globe with some lat/long lines. So where does "globe" come from, and how can I find and choose them?

That's where "SF Symbols" comes in. This is [an app](https://developer.apple.com/sf-symbols/) containing a collection of over 4000 (in version 4) symbols that work well with the default San Francisco font, that can be scaled and in many cases coloured. These symbols are a kind of standard that (increasingly) users will recognise - so this also supports good user interfaces.

![](/images/screen-shot-2022-07-17-at-6.50.30-am.png)

It's straightforward to search for symbols and to view them in the colour combinations you're using in your app (if that particular symbol supports it).
