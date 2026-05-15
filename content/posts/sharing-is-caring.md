---
title: "Sharing is caring"
date: '2022-12-10'
slug: sharing-is-caring
aliases:
  - /2022/12/10/sharing-is-caring/
tags:
  - possibly-useful
  - share
  - swift5-7
  - swiftui
  - xcode14
  - xcode14-1
---

Continuing on with the demo project from yesterday, in which we used the ImageRenderer class to turn a view into an image, today we want to let the user share it somehow.

Typically, apps have a button using the square.and.arrow.up SF Symbol to share something from the current screen. It's probably not an accident that it's literally the first symbol in the app.

![](/images/screen-shot-2022-12-05-at-9.23.33-pm.png)

Pressing it generally opens the "share sheet" which has options for opening whatever is being shared in another app, printing it, saving it to photos, or whatever.

Here's our ticket app from a couple of days ago (the TicketView is unchanged). We're still using ImageRenderer() to make the image version of the view in OnAppear(), but this time there's a "sharelink".

```swift
struct ContentView: View {
    private var ticketView = TicketView()
    @State private var image: Image?
    
    var body: some View {
        VStack {
            Spacer()
            ticketView
            Spacer()
            
            if let image = image {
                ShareLink(item: image, preview: SharePreview("View",image: image)) {
                    Label("Share", systemImage:  "square.and.arrow.up")
                }
            }
            
        }
        .padding()
        .onAppear {
            let renderer = ImageRenderer(content: ticketView)
            if let uiImage = renderer.uiImage {
                image = Image(uiImage: uiImage)
            }
        }
    }
}
```

If we click on the share link, it looks like this:

![](/images/simulator-screen-shot-iphone-14-pro-2022-12-05-at-21.10.20.jpg)

The little thumbnail and the word "View" at the top of the share sheet is from the preview parameter in our call.

```
ShareLink(item: image, preview: SharePreview("View",image: image)) {
    Label("Share", systemImage:  "square.and.arrow.up")
```

Since this is an image, perhaps you were expecting a "Save image" option? That's the most likely thing we'd want to do with an image, but it's not there. The reason is that saving an image to the users camera roll requires a specific permission. In the app settings, choose "Info" then right click on the entries and "Add Row". Search for / add the key "Privacy - Photo Library Additions Usage Description".

![](/images/screen-shot-2022-12-07-at-8.33.52-pm.png)

The text you add in the description is what the app will show to the user when the dialogue pops up asking the user if it's okay to give this app the permission to save photos.

If we go back and and try again to share the ticket, we've now got the options to "Save Image". If we choose that for the first time, we'll be asked to grant permission to this app.

![](/images/screen-shot-2022-12-07-at-8.41.40-pm.png)

If the user chooses OK, then it will be saved to photos:

![](/images/screen-shot-2022-12-07-at-8.42.04-pm.jpg)
