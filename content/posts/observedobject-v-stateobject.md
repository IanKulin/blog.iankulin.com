---
title: "@ObservedObject v @StateObject"
date: '2022-08-13'
slug: observedobject-v-stateobject
aliases:
  - /2022/08/13/observedobject-v-stateobject/
tags:
  - mvvm
  - posts
  - swiftui
---

The Youtube algorithm thinks I need to watch more MVVM videos, and it turns out it's probably right. A day or two ago in an [MVVM](/simple-mvvm/) post using a super simple example, I stored the view model as a property of the view using the @ObservedObject wrapper, as I created it.

struct ContentView: View {
    @ObservedObject var light = LightViewModel()
    
    var body: some View {
        VStack{
            Spacer()
            if light.isOn(){
                drawLitBulb
            }
            else{
                Image(systemName: "lightbulb.fill").font(.system(size: 72))
            }

But then today, Youtube served me up this video from [BeyondOnesAndZeros](https://www.youtube.com/c/BeyondOnesAndZeros/videos)

{{< youtube LntH6moCuo0 >}}

They start off with @ObservableObject, but then say that if the View Model is instantiated there, that this is repeated every time the View is recreated (which happens every time it's redrawn).

I don't really understand the property wrappers (like @ObservableObject) but I assume this was a type property - ie static. Apparently not. The [Apple documentation on managing data](https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app) says:

> SwiftUI might create or recreate a view at any time, so it’s important that initializing a view with a given set of inputs always results in the same view. As a result, it’s unsafe to create an observed object inside a view. Instead, SwiftUI provides the [`StateObject`](https://developer.apple.com/documentation/swiftui/stateobject) attribute for this purpose.

So that code should use @StateObject, and @ObservedObject should be used where I pass it down into other view structs in the hierarchy.

Paul Hudson gives a good example in his explanation on this topic [here](https://www.avanderlee.com/swiftui/stateobject-observedobject-differences/).
