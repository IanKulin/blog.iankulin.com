---
title: "JSON encode/decode"
date: '2022-10-24'
slug: json-encode-decode
aliases:
  - /2022/10/24/json-encode-decode/
tags:
  - codable
  - code
  - json
  - swift
  - swift5-7
  - xcode14
---

![Screenshop of Habits app](/images/img_3110.png)

As usual, I'm spending way more time on the apps written from scratch in the [100Days series](https://www.hackingwithswift.com/guide/ios-swiftui/4/3/challenge). The Habit tracking app I'm working on has been good practice, especially of the architecture of the simple [list based app](/list-apps/).

My version has a couple of refinements I quite like. I'm using a checkmark in a rectangle as the button to mark that activity as done, and I've added a nice fade to the checkmark as time goes on to represent the percentage of time from when it is done until it becomes due again.

Until this app I've purely been using the preview and simulator for looking and and checking the operation of the app. But now I've started using my own iPhone for testing and actually trying to use the app from day to day. There's a noticeable difference between thinking up use-cases in your head or [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) it. This has led to several improvements, but now I'm at a crossroads with one to do with the data persistence.

I'm using the Swift [built in JSON](https://www.ralfebert.com/ios/json-handling-in-swift/) encode/decode which has been quite painless. It uses the struct property names (so not really in line with the JSON snakecase convention) and just magics everthing up for you. Here's the structs, and the JSON produced after a week of using the app.

```swift
struct HabitItem: Identifiable, Codable, Equatable {
    var id = UUID()
    let name: String
    var started = Date()
    var timesDone = 0
    var lastDone: Date
    var daysBetweenCompletions = 1.0
}

class Habits: ObservableObject {

    @Published var items = [HabitItem]() {
        didSet {
            if let encoded = try? JSONEncoder().encode(items) {
                UserDefaults.standard.set(encoded, forKey: "Habits")
            }
        }
    }

    init() {
        if let savedItems = UserDefaults.standard.data(forKey: "Habits") {
            if let decodedItems = try? JSONDecoder().decode([HabitItem].self, from: savedItems) {
                items = decodedItems
                return
            }
        }

        items = []
    }
}
```

```json
[
   {
      "id":"5D52B636-030A-4571-8B6E-2117AFD69304",
      "timesDone":2,
      "daysBetweenCompletions":1,
      "name":"Dishes",
      "lastDone":687916240.08548605,
      "started":687741044.36479199
   },
   {
      "id":"26D89BA0-D3FA-49CF-BB01-249A19E90871",
      "timesDone":4,
      "daysBetweenCompletions":1,
      "name":"Bed",
      "lastDone":688060851.81663799,
      "started":687702031.59694302
   },
   {
      "id":"C73234ED-3FA9-4B91-AC24-42E7391E3BE1",
      "timesDone":10,
      "daysBetweenCompletions":0.5,
      "name":"Eating ",
      "lastDone":688108866.69676399,
      "started":687702494.12051105
   },
   {
      "id":"0940450A-2A5E-4B11-B049-9B33F9C01F7D",
      "timesDone":6,
      "daysBetweenCompletions":0.5,
      "name":"Brush teeth",
      "lastDone":688110048.34211302,
      "started":687702045.01338601
   },
   {
      "id":"FA6556A8-17A8-4556-8690-9522A5B22856",
      "timesDone":4,
      "daysBetweenCompletions":1,
      "name":"Write code",
      "lastDone":688108275.33836806,
      "started":687702594.956689
   },
   {
      "id":"DA2A1F85-1274-4C58-B411-D6FF9B2A2AAF",
      "timesDone":0,
      "daysBetweenCompletions":7,
      "name":"Walk exercise",
      "lastDone":687702620.82404804,
      "started":687702620.82411301
   },
   {
      "id":"155D50A7-1403-47C6-AFCA-12DB13270A55",
      "timesDone":1,
      "daysBetweenCompletions":7,
      "name":"Bins out",
      "lastDone":687879744.60854602,
      "started":687702107.33206701
   },
   {
      "id":"86FE01B9-4716-4C2C-B768-1AC8E3B03DDB",
      "timesDone":1,
      "daysBetweenCompletions":7,
      "name":"Roomba kitchen",
      "lastDone":687916244.61723006,
      "started":687702077.16412401
   },
   {
      "id":"EEA3D2CD-3717-49DD-B5E2-924956F41189",
      "timesDone":2,
      "daysBetweenCompletions":7,
      "name":"Washing",
      "lastDone":688115581.30661595,
      "started":687702096.33233297
   }
]
```

The problem I've got now I'd like to change the struct to add some different functionality. As soon as I change the struct, on the next run the JSON decode will fail and my data model will be empty. This can be caught, and I could use a renamed old version of my struct to load the existing data, and convert it across to the new model. What I'd really like is an option in the JSON decoder that if a property is missing, and I've provided a default in the struct, that it just uses that.

I'm not the first developer to have this wish, and there's a [number of solid solutions](https://stackoverflow.com/questions/44575293/with-jsondecoder-in-swift-4-can-missing-keys-use-a-default-value-instead-of-hav), but they all seem to require a bit more work than my simple dream above.
