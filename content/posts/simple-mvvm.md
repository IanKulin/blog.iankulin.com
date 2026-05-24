---
title: "Simple MVVM"
date: '2022-08-11'
slug: simple-mvvm
aliases:
  - /2022/08/11/simple-mvvm/
tags:
  - code
  - mvvm
  - possibly-useful
  - swiftui
---

MVVM (Model-View-View Model) is an architectural pattern for apps that separates the data (Model) from the user interface (View). The communication between these two parts is facilitated by a View Model.

Model <-> View Model <-> View

### Model

The _Model_ is platform independent - we should be able to pluck it out and add it to a different application running on a different platform without any trouble. Any business rules will be part of the Model along with the data. For example, if it's a rule that every customer has a sales contact, this can be enforced in the Model.

<a href="/images/screen-shot-2022-08-06-at-4.20.38-pm.png"><img src="/images/screen-shot-2022-08-06-at-4.20.38-pm.png" width="85" alt=""></a>

The Model (or Models - an app could have more than one) does not know anything about the _View_ or the _View Model_. In a SwiftUI app, we'll almost always have the model in its own file.

Our simple example app for this post is going to be a light bulb app. There will be a picture of a light bulb, and a button which will toggle the light off an on. It's difficult to think of a simpler Model. This is what I've come up with.

struct Light{
    var on: Bool = false
}

A Model in a real application could be massive - with connections to online data stores and complex business rules. Our light just has two exclusive states - off and on. We could make it more complex - it could be an incandescent light with a particular resistance and a formula for the brightness output for any particular voltage that was applied. All of that would go into the Model. But for today, we'll just have _on_ or not.

In all of the SwiftUI examples I've seen so far, the Model has been a struct. Perhaps it can be other things, but Swift has deep magic (structs are mysteriously immutable, so they are [actually rebuilt when any properties change](https://www.hackingwithswift.com/books/ios-swiftui/why-state-only-works-with-structs)) for efficiently knowing if structs have changed, so perhaps not.

### View Model

The _View Model_ will have the _Model_ as a property. That way it can do things to the Model, and to access the bits it needs to pass off to the View. The View Model is always a class, as it needs to comply with the protocol of ObservableObject. If _protocol_ and _ObservableObject_ are foreign to you, don't panic. You don't need to understand any more than that the View needs to know when the View Model changes, so it observes the View Model, and for that magic to happen, the View Model needs to be a class having that ability (of being observed) which it gets from having the protocol ObservableObject.

The View Model will also have properties or methods that the View can use to access the Model data. Remember the Model is completely hidden from the View, so the View Model provides that access. In a real situation, it would also do whatever translation or packaging was required to make the View's life easy. In our example it is rather simple.

class LightViewModel: ObservableObject {
    @Published private var lightBulb = Light(on: false)
    
    func toggle() {
        lightBulb.on = !lightBulb.on
    }
    
    var isOn: Bool { return lightBulb.on }
    
}

Again, the View Model is in it's own file. The only thing we haven't mentioned is the _@Published_ used in the property for our Model. This is just part of the magic mentioned earlier in the discussion about [ObservableObject](https://developer.apple.com/documentation/combine/observableobject) which allows the View to know that something has changed, and that it needs to react to this by rebuilding the View.

### View

The View is just our regular SwiftUI view. A crucial part is that it holds the View Model for the light as a property wrapped with the @ObservedObject. This completes out connections between the three parts of our architecture.

-   The Model View is an @ObservableObject which has the Model as a @Published property
-   The View contains the View Model as an @StateObject property

These connections have these effects

-   The View cannot ever access the Model directly
-   If the Model changes, the View Model is aware, and broadcasts this in a way that the View knows about
-   The View just redraws itself if that happens
-   As the View does this, it asks the View Model for the parts of the data it needs
-   This both protects and hides the Model from the view, and is an opportunity for the View Model to do any work it needs to to the data to make it easy for the View to put on the screen.
-   Any user interaction that occurs in the View is passed to the View Model to deal with.

struct ContentView: View {
    @StateObject var light = LightViewModel()
    
    var body: some View {
        VStack{
            Spacer()
            if light.isOn {
                drawLitBulb
            }
            else {
                Image(systemName: "lightbulb.fill").font(.system(size: 72))
            }
            Spacer()
            Button("Toggle Light", action: {
                light.toggle()}
            )
            .padding()
            .font(.title)
            .foregroundColor(.white)
            .background(Color.accentColor)
            .cornerRadius(10)
            .padding()
        }
    }
    
    var drawLitBulb: some View {
        // view of an iluminated bulb
        ZStack{
            Circle().fill(.yellow).frame(width: 150, height: 150)
            Image(systemName: "lightbulb").font(.system(size: 72))
        }
    }
}

To make the code read nicely, the View Model is called "light", and it's an @StateObject so for the redrawing trigger to work correctly. The rest of the code should be reasonably clear if you've made a few SwiftUI views.

We check if the light is on (by asking the View Model), if it is, we draw a lit bulb, if not, an unlit bulb is drawn. The last UI element is our Button() whose action is the toggle() method of light - our View Model.

The source for this project is on [GitHub here](https://github.com/IanKulin/MVVMLight).
