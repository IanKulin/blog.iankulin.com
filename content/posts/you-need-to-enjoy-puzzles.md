---
title: "You need to enjoy puzzles"
date: '2022-10-22'
slug: you-need-to-enjoy-puzzles
aliases:
  - /2022/10/22/you-need-to-enjoy-puzzles/
tags:
  - code
  - debugging
  - swift5-7
  - swiftui
  - xcode14
---

![frustrated worker, painting - Stable Diffusion](/images/frustration.jpg)

I'm writing the Habits [list based app](/list-apps/) from #100Days and had a working MVP, then for some reason, decided to refactor by changing the subview I'd written as a function, into a struct. Some time later, I discovered that my list items were not updating correctly, so detective time.

I talked a little bit about the architecture yesterday - the item is a struct, and there's a class containing an array of the items. Something like this:

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

Then the ContentView is a NavigationView with a List. To build the list, I ForEach on the array inside the object, calling a subview on each one:

```swift
struct ContentView: View {
    @StateObject var cars = Cars()

    var body: some View {
        NavigationView {
            List {
                ForEach(cars.items) { intItem in
                    CarView(car: intItem, cars: cars)
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

When the user clicks on the button in a list item, the underlying data is amended somehow - in this pared down example the number of that type of car is incremented. Since my "car" is a value type there's no point incrementing its number, so instead I call the .increment method on the cars object that is holding my array.

Then, in that method, I have to search for the car the user intends to change, then change it.

```
func increment(_ car: Car) -> Bool {
    let index = items.firstIndex(of: car)
    if let index = index {
        items[index].number += 1
        return true
    } else {
        return false
    }
}
```

The situation of not being able to find the car should never occur, but out of longstanding habit I check for it and log an error to the console. This then happens repeatedly...

After some print statement debugging, I got it into my head that I'd caused this by changing the subview from a function (which had worked) to a struct (which was not). I decided it was a value type / reference type problem cause between the difference between these two subview approaches. Since that seems like an interesting blog post topic, I spent a long time distilling the code down to a simple looking example of this phenomena.

Then tried it, it worked correctly.

Then changed the function to the struct, it worked correctly.

Went back to the original app, changed the subview function to a struct, it worked correctly.

So I don't know what caused my original problem, or what changed to fix it. In theory I could go back through the commits (they have helpful names like "general progress" and "progress save") and find it.

But I've already spent way longer on this app than I should have, and all I have to show for it is this post about what a doofus I am.
