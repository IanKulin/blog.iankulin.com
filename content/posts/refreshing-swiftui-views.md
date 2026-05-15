---
title: "Refreshing SwiftUI Views"
date: '2022-10-23'
slug: refreshing-swiftui-views
aliases:
  - /2022/10/23/refreshing-swiftui-views/
tags:
  - code
  - possibly-useful
  - swift5-7
  - swiftui
  - xcode14
---

![refreshing view, Rococo - Stable Diffusion](/images/refreshing-view-rococo.png)

SwiftUI does some property wrapper magic to (very efficiently) refresh your views, but what if you want to force a refresh for some reason? Here's the techniques I'm currently using to do that.

The tricks are below, but just so you can see them in context, here's the sample app we're working on. It's a list of cars so you can keep track of how many of each kind you own. Here's our data:

```swift
struct Car: Identifiable, Codable, Equatable {
    var id = UUID()
    let model: String
    var number = 0
}

class Cars: ObservableObject {

    @Published var items = [Car]()

    init() {
        let car1 = Car(model: "Station wagon")
        let car2 = Car(model: "Sedan")
        let car3 = Car(model: "Hatchback")
        items = [car1, car2, car3]
    }

    func increment(_ car: Car) -> Bool {
        let index = items.firstIndex(of: car)
        if let index = index {
            items[index].number += 1
            return true
        } else {
            return false
        }
    }

    deinit {
    }

}
```

The app is a list inside a navigation stack. The view for each car is split out into a subview:

```swift
struct ContentView: View {
    @StateObject var cars = Cars()
    
    var body: some View {
        NavigationView {
            List {
                ForEach(cars.items) { car in
                    CarView(car: car, cars: cars)
                }
            }
            .navigationTitle("Cars")
        }
    }
}

struct CarView: View {
    var car: Car
    var cars: Cars
    
    var body: some View {
        HStack {
            Text("\(Int.random(in: 10...99)) ")
            VStack(alignment: .leading) {
                Text(car.model)
                    .font(.headline)
            }
            Spacer()
            Text(" \(car.number)  ")
            Button {
                if !cars.increment(car) {
                    print("Unexpected error - car not found:\(car.model)")
                }
            } label: {
                Image(systemName: "plus")
            }
        }
    }
}
```

The random Int is just so we can get a visual indication that our view has refreshed.

#### Trick 1 - change a value

All the other tricks rely on this trick. SwiftUI reacts to any @State property changing, so to force a change, there just needs to be a @State property we change. I add a:

```
@State var refresh = false
```

to my ContentView. Whenever this changes, ie refresh.toggle() the view will be redrawn. Of course we don't want just the ContentView redrawn, but the subview as well, so it needs to be passed into the subview. We don't do anything with it there, just pass it in.

```swift
struct ContentView: View {
    @StateObject var cars = Cars()
    @State private var refresh = false

    var body: some View {
        NavigationView {
            List {
                ForEach(cars.items) { intItem in
                    CarView(car: intItem, cars: cars, refresh: refresh)
                }
            }
            .navigationTitle("Cars")
        }
    }
}

struct CarView: View {
    var car: Car
    var cars: Cars
    var refresh: Bool
    
    var body: some View {
        HStack {
            Text("\(Int.random(in: 10...99)) ")
            VStack(alignment: .leading) {
                Text(car.model)
                    .font(.headline)
            }
            Spacer()
            Text(" \(car.number)  ")
            Button {
                if !cars.increment(car) {
                    print("Unexpected error - car not found:\(car.model)")
                }
            } label: {
                Image(systemName: "plus")
            }
        }
    }
}
```

#### Trick 2 - .refreshable()

That's the infrastructure in place, so now we can use it. We could add a button that the user could click to refresh, but 2022 users have been trained to pull down on views to make them refresh, so let's do that. Just add a `.refreshable()` modifier to our list, then toggle refresh in the closure.

```swift
struct ContentView: View {
    @StateObject var cars = Cars()
    @State private var refresh = false

    var body: some View {
        NavigationView {
            List {
                ForEach(cars.items) { intItem in
                    CarView(car: intItem, cars: cars, refresh: refresh)
                }
            }
            .navigationTitle("Cars")
            .refreshable {
                refresh.toggle()
            }
        }
    }
}
```

Now when the user pulls the list down, the familiar wait wheel appears, the view, and the car subviews, all redraw.

#### Trick 3 - OnChange(of: scene)

In my Habit app, the activities are going to appear with a temporal description of when they should be done, like "next week", "in a few minutes", or "tomorrow". Those will be created from the date/time the activity was last done, how often the activity should be done, and the current date/time. So if our app has been in the background and we open it up, we want fresh calculations. We can do that by detecting a `scenePhase` change to `.active`.

We have to declare a variable for it, and then add the .onChange to the view:

```swift
struct ContentView: View {
    @StateObject var cars = Cars()
    @State private var refresh = false
    @Environment(\.scenePhase) var scenePhase

    var body: some View {
        NavigationView {
            List {
                ForEach(cars.items) { intItem in
                    CarView(car: intItem, cars: cars, refresh: refresh)
                }
            }
            .navigationTitle("Cars")
        }
        .onChange(of: scenePhase) { newPhase in
            if newPhase == .active {
                refresh.toggle()
            }
        }
    }
}
```

#### Trick 4 - a timer

![a watch face containing a refreshing view - stable diffusion](/images/a-watch-face-containing-a-refreshing-view.png)

Even if our user leaves the app open and foregrounded, eventually the descriptions will be out of date, so another thing we could do is use a timer. We have to add a timer property, and add an .onReceive() to the view. The timer interval in seconds is set when the timer is created. The example below is going to trigger every second.

```swift
struct ContentView: View {
    @StateObject var cars = Cars()
    @State private var refresh = false
    
    let timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    var body: some View {
        NavigationView {
            List {
                ForEach(cars.items) { intItem in
                    CarView(car: intItem, cars: cars, refresh: refresh)
                }
            }
            .navigationTitle("Cars")
        }
        .onReceive(timer, perform: { _ in
            refresh.toggle()
                })
    }
}
```
