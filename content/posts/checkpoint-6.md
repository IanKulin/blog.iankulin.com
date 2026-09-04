---
title: "Checkpoint 6"
date: '2022-07-23'
slug: checkpoint-6
summary: "My short Swift exercise solution covers structs and access control: a Car struct stores a model, seat count, and current gear. The gear is protected with private(set) access and can only be changed through my mutating gearUp and gearDown methods that stay within static min and max gear constants."
aliases:
  - /2022/07/23/checkpoint-6/
tags:
  - 100daysofswiftui
  - checkpoint
  - code
---

```swift
/*
create a struct to store information about a car, including its model, number of seats, and current gear, then add a method to change gears up or down. Have a think about variables and access control: what data should be a variable rather than a constant, and what data should be exposed publicly? Should the gear-changing method validate its input somehow?
*/

struct Car {
    static let maxGear = 10
    static let minGear = 1
    var model = "no model"
    var seats = 4
    private (set) var currentGear = Car.minGear
    
    init (model: String, seats: Int) {
        self.model = model
        self.seats = seats
    }
    
    mutating func gearUp() {
        if currentGear < Car.maxGear{
            currentGear += 1
        }
    }
    
    mutating func gearDown() {
        if currentGear > Car.minGear{
            currentGear -= 1
        }
    }
    
}

var myUte = Car(model: "Rodeo", seats:2)
print("My \(myUte.model) has \(myUte.seats) seats and is in gear: \(myUte.currentGear)")
myUte.gearDown()
print("My \(myUte.model) has \(myUte.seats) seats and is in gear: \(myUte.currentGear)")
myUte.gearUp()
print("My \(myUte.model) has \(myUte.seats) seats and is in gear: \(myUte.currentGear)")
```
