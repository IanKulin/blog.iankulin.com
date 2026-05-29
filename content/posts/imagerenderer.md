---
title: "ImageRenderer()"
date: '2022-12-08'
slug: imagerenderer
aliases:
  - /2022/12/08/imagerenderer/
tags:
  - code
  - ios16
  - possibly-useful
  - swift5-7
  - swiftui
  - xcode14-1
---

[ImageRenderer](https://developer.apple.com/documentation/swiftui/imagerenderer)() is a SwiftUI class that creates an image from a view. You just initialize it with the view, then extract a cgImage (Core Graphics) or uiImage that can be cast to a SwiftUI Image.

I'll need a view to work with, so here it is; a crude version of my behaviour ticket.

```swift
struct TicketView: View {
    var body: some View {
        ZStack {
            Color(.cyan)
                .frame(width: 300, height: 350)
            VStack {
                Text("Fred Bloggs")
                    .font(.largeTitle)
                Text("")
                HStack {
                    Text("Putting rubbish in the bin")
                    Image(systemName: "trash")
                }
                .foregroundColor(.purple)
                Text("")
                Text("Green Faction")
                Text("")
                Text("")
                Text("\(Date().formatted())")
            }
        }
    }
}
```

Here it is, with a couple of buttons underneath:

<img src="/images/simulator-screen-shot-iphone-14-pro-2022-12-05-at-19.56.18.png" width="209" alt="">

I've assigned the view to a property of my content view, then displayed it along with the buttons. The first button saves the image to an @State and the second one displays it if it exists.

```swift
struct ContentView: View {
    private var ticketView = TicketView()
    @State private var image: Image?
    @State private var showImage = false
    
    var body: some View {
        VStack {
            Spacer()
            ticketView
            Spacer()

            Button("Save Image") {
                let renderer = ImageRenderer(content: ticketView)
                
                if let uiImage = renderer.uiImage {
                   image = Image(uiImage: uiImage)
                }
            }.padding()
            
            Button("Toggle image") {
                withAnimation {
                    showImage.toggle()
                }
            }
            if showImage {
                if let image = image {
                    image
                        .resizable()
                        .scaledToFit()
                }
            }
            
        }
        .padding()
    }
}
```

If we save the screen:

```swift
Button("Save Image") {
    let renderer = ImageRenderer(content: ticketView)
    
    if let uiImage = renderer.uiImage {
       image = Image(uiImage: uiImage)
    }
}.padding()
```

Then it can just be inserted in the view same as any bitmap image by hitting the Toggle Image button.

<img src="/images/simulator-screen-shot-iphone-14-pro-2022-12-05-at-20.01.49.png" width="472" alt="">
