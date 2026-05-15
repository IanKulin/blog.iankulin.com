---
title: "Updating stored JSON due to a struct change"
date: '2022-10-25'
slug: updating-stored-json-due-to-a-struct-change
aliases:
  - /2022/10/25/updating-stored-json-due-to-a-struct-change/
tags:
  - code
  - data
  - json
  - persistance
  - posts
  - swift
---

![Jason Modern Art - Stable Diffusion](/images/jason-modern-art.png)

I mentioned yesterday "_I could use a renamed old version of my struct to load the existing data, and convert it across to the new model._". Since I've been testing the app on my phone, and using plausible data, it was going to be painful enough to lose it that I thought I should go through those steps.

First, I make a copy of the old struct, and renamed it with the app version number that used it. No need to bring all the computed properties into this struct, just the bits that get encoded into the JSON.

```swift
struct V01HabitItem: Identifiable, Codable, Equatable {
    var id = UUID()
    let name: String
    var started = Date()
    var timesDone = 0
    var lastDone: Date
    var daysBetweenCompletions = 1.0
}
```

Then I could go ahead and change the official struct to add the new properties it needs. Now when the JSON is attempted to be decoded into the new struct, it will fail, so we need to detect that and try with the old version of the struct.

```swift
class Habits: ObservableObject {

    @Published var items = [HabitItem]() {
        didSet {
            if let encoded = try? JSONEncoder().encode(items) {
                UserDefaults.standard.set(encoded, forKey: "Habits")
            } else {
                print("JSON encoding fail")
            }
        }
    }

    init() {
        if let savedItems = UserDefaults.standard.data(forKey: "Habits") {
            if let decodedItems = try? JSONDecoder().decode([HabitItem].self, from: savedItems) {
                items = decodedItems
                return
            } else {
                print("JSON decoding fail - trying v0.1")
                var v01Items = [V01HabitItem]()
                if let decodedItems = try? JSONDecoder().decode([V01HabitItem].self, from: savedItems) {
                    v01Items = decodedItems
                    v01Items.forEach { oldHabit in
                        items.append(HabitItem(
                            id: oldHabit.id,
                            name: oldHabit.name,
                            started: oldHabit.started,
                            timesDone: oldHabit.timesDone,
                            lastDone: oldHabit.lastDone,
                            daysBetweenCompletions: oldHabit.daysBetweenCompletions
                        ))
                    }
                    return
                } else {
                    print("JSON decoding fail")
                }
            }
        }
        items = []
    }
```

Once it's decoded, we need to ForEach through and create instances of the new struct from the old ones.

It's made my init() a bit messy, normally I'd move that out - maybe have a separate file with the old struct and a function for decoding it and copying into the new struct, but this is not a production app, it's only on my phone and on two simulations on my macBook, so this code won't stay in once I've updated each instance by running it once.

If it works correctly, I should get the debug message and the data will still be there on the first run, then on a second run the message should not appear (since the new struct version will have been written to the file.

![](/images/screen-shot-2022-10-22-at-7.41.44-pm.png)
