---
title: "Challenge 1"
date: '2022-08-29'
slug: challenge-1
aliases:
  - /2022/08/29/challenge-1/
tags:
  - 100daysofswiftui
  - code
  - posts
---

![](/images/screen-shot-2022-08-22-at-8.54.26-am.png)

I'm up to Challenge 1 of 100 Days of SwiftUI ([Day 19](https://www.hackingwithswift.com/100/swiftui/19)) which is to make your own simple (no MVVM) version of the app built in the previous three days. It's about as simple as can be whilst still feeling like a real app. Something I hadn't done before was limiting the keyboard to numbers or adding a toolbar to close it, so that was nice.

Something that's not nice, is that when you touch into the text field to change the number, it's not selected ready to type over (the way they always are in browser url fields) so you need to backspace over the previous entry. That's the sort of anoying behaviour I don't like. It seems (after some googling) there's no straightforward way of addressing this in SwiftUI, with the best solution involving importing a package. I will come back to that because it is bugging me.

struct ContentView: View {
    @State private var fromDistance = 0.0
    @State private var fromUnits = "meters"
    @State private var toUnits = "kilometers"
    @FocusState private var distanceIsFocused: Bool

    let distanceUnits = \["meters", "kilometers", "yards", "miles"\]
    
    var toDistance: Double {
        var meters = 0.0
        // convert the from distance to meters
        switch fromUnits {
            case "meters": meters = fromDistance
            case "kilometers": meters = fromDistance\*1000
            case "yards": meters = fromDistance\*0.9144
            case "miles": meters = fromDistance\*1609.34
            default: assert(false)
        }
        // convert the meters to the from distance
        switch toUnits {
            case "meters": return meters
            case "kilometers": return meters/1000
            case "yards": return meters/0.9144
            case "miles": return meters/1609.34
            default : assert(false)
        }
        return 0.0
    }

    
    var body: some View {
        NavigationView {
            Form {
                
                Section {
                    TextField("Distance", value: $fromDistance, format: .number)
                        .keyboardType(.decimalPad)
                        .focused($distanceIsFocused)
                    Picker("Units", selection: $fromUnits) {
                        ForEach(distanceUnits, id: \\.self) {
                            Text($0)
                        }
                    }
                    .pickerStyle(.segmented)
                }
                header: {
                    Text("Distance")
                }
                
                Section {
                    if toDistance < 9.9 {
                        Text("\\(toDistance, specifier: "%.4f")")
                    } else if toDistance > 999 {
                        Text("\\(toDistance, specifier: "%.0f")")
                    } else {
                        Text("\\(toDistance, specifier: "%.2f")")
                    }

                    Picker("Units", selection: $toUnits) {
                        ForEach(distanceUnits, id: \\.self) {
                            Text($0)
                        }
                    }
                    .pickerStyle(.segmented)
                }
                header: {
                    Text("Converted Distance")
                }
                
            }
            .navigationTitle("Distance Conversion")
            .toolbar {
                ToolbarItemGroup(placement: .keyboard) {
                    Spacer()
                    Button("Done") {
                        distanceIsFocused = false
                    }
                }
            }
        }
    }
}

[Source on Github](https://github.com/IanKulin/HSUnitConvert)
