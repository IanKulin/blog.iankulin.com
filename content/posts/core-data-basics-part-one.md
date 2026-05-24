---
title: "Core Data basics - Part One"
date: '2022-11-22'
slug: core-data-basics-part-one
aliases:
  - /2022/11/22/core-data-basics-part-one/
tags:
  - code
  - coredata
  - swift5-7
  - xcode14-1
---

To help me get clear on the Core Data basics ([so I can master one of the #100Days challenges](/tough-day/)), I'll write a simple master/detail app with arrays of structs, then convert it to Core Data listing out of the steps. Almost everything I know about Core Data, I learned from Paul Hudson's [100 Days of SwiftUI](https://www.hackingwithswift.com/100/swiftui) course - of which I'm up to day 61. So shout out to him. I highly recommend that course, and most of the code you'll see in this post is either inspired by, or directly copied from 100 Days, except of course the errors - those are mine. This post - Part One - just describes the app and shows the struct/array version.

### App Overview

The opening screen is a navigation view of the list of gardens, and a button. There’s a navigation link from each garden item to a detail view which shows the garden details, including a list of plants.

<img src="/images/simulator-screen-shot-iphone-14-pro-2022-11-19-at-19.40.30.png" width="138" alt="">

<img src="/images/simulator-screen-shot-iphone-14-pro-2022-11-19-at-19.40.40.png" width="138" alt="">

### Struct version

First the data. Two structs, Plant, and Garden. Garden contains a list of plants. The gardens state variable lives in the main contentview and is an array of Gardens.

```
struct Plant {
    var id = UUID()
    var name: String
}

struct Garden {
    var id = UUID()
    var name = ""
    var address = ""
    var plants: [Plant] = []
}

struct ContentView: View {
    @State private var gardens: [Garden] = []
```

To create the sample data, a button creates the struct instances and adds them to the array.

```
Button("Sample Data") {
    var someGarden = Garden()
    someGarden.name = "White Lodge"
    someGarden.address = "72 Anderson Street \nRothwell QLD 4022"
    someGarden.plants.append(Plant(name:"Rose"))
    someGarden.plants.append(Plant(name:"Palm Tree"))
    someGarden.plants.append(Plant(name:"Lawn"))
    gardens.append(someGarden)
    someGarden.id = UUID()
    someGarden.name = "Gordon Terrace"
    someGarden.address = "95 Learmouth St\nTahara Vic 3301"
    someGarden.plants = []
    gardens.append(someGarden)
}
```

The main display of the data is a list in a navigation view. With a link to a detail page.

```swift
struct ContentView: View {
    
    @State private var gardens: [Garden] = []
    
    var body: some View {
        NavigationView {
            VStack {
                List {
                    ForEach(gardens, id: \.id) {garden in
                        NavigationLink {
                            DetailView(garden: garden)
                        } label: {
                            HStack {
                                Text(garden.name)
                                Spacer()
                                Text(garden.address)
                            }
                        }
                    }
                }
                Button("Sample Data") {
                    var someGarden = Garden()
                    someGarden.name = "White Lodge"
                    someGarden.address = "72 Anderson Street \nRothwell QLD 4022"
                    someGarden.plants.append(Plant(name:"Rose"))
                    someGarden.plants.append(Plant(name:"Palm Tree"))
                    someGarden.plants.append(Plant(name:"Lawn"))
                    gardens.append(someGarden)
                    someGarden.id = UUID()
                    someGarden.name = "Gordon Terrace"
                    someGarden.address = "95 Learmouth St\nTahara Vic 3301"
                    someGarden.plants =[]
                    gardens.append(someGarden)
                    someGarden.id = UUID()
                    someGarden.name = "Powlett Cottage"
                    someGarden.address = "11 Bayfield Street\nWhite Beach 7184"
                    gardens.append(someGarden)
                    someGarden.id = UUID()
                    someGarden.name = "Adams Garden"
                    someGarden.address = "71 Swanston St\nKanya Vic 3381"
                    gardens.append(someGarden)
                }
            }
            .navigationTitle("Data Demo")
        }
    }
}
```

The DetailView is passed the selected garden. It shows a couple of details from the garden, and a list of plants if there are any.

```
struct DetailView: View {
    var garden: Garden
    
    var body: some View {
        VStack {
            Text(garden.name)
                .font(.headline)
            Text(garden.address)
            List {
                ForEach(garden.plants, id: \.id) {plant in
                    Text(plant.name)
                }
            }
        }
    }
}
```

So that's our app. [Source is on github](https://github.com/IanKulin/DataDemo/releases/tag/v0.1) here. Really, I could/should have done add/delete/edit but I just wanted something basic as a starting point for the Core Data stuff tomorrow.

[Part 2](/core-data-basics-part-two/), [Part 3](/core-data-basics-part-three/)
