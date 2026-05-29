---
title: "Checkpoint 8"
date: '2022-08-17'
slug: checkpoint-8
aliases:
  - /2022/08/17/checkpoint-8/
tags:
  - 100daysofswiftui
  - checkpoint
  - code
  - posts
---

{{< youtube Ga800-Qgft4 >}}

```swift
/*
Your challenge is this: make a protocol that describes a
  building, adding various properties and methods, then 
  create two structs, House and Office, that conform to it.
 
Your protocol should require the following:
    A property storing how many rooms it has.
    A property storing the cost as an integer 
      (e.g. 500,000 for a building costing $500,000.)
    A property storing the name of the estate agent 
      responsible for selling the building.
    A method for printing the sales summary of the building,
     describing what it is along with its other properties.

https://www.hackingwithswift.com/quick-start/beginners/checkpoint-8

*/

protocol Building {
    var rooms: Int {get set}
    var cost: Int {get set}
    var realEstateAgent: String {get set}
}

extension Building {
    func printSalesSummary(){
        print("Rooms: \\(rooms) Cost: £\\(cost) Agent: \\(realEstateAgent)")
    }
}

struct House: Building {
    var rooms: Int
    var cost: Int
    var realEstateAgent: String
    var occupants: Int
}

struct Office: Building {
    var rooms: Int
    var cost: Int
    var realEstateAgent: String
    var floorArea: Int
}

var myOffice = Office(rooms: 5, cost:500\_000, realEstateAgent: "Bloggs", floorArea: 500)
var myHouse = House(rooms: 2, cost:200\_000, realEstateAgent: "Fletchers", occupants: 1)

myOffice.printSalesSummary()
myHouse.printSalesSummary()
