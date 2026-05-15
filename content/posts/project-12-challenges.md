---
title: "Project 12 Challenges"
date: '2022-11-10'
slug: project-12-challenges
aliases:
  - /2022/11/10/project-12-challenges/
tags:
  - 100daysofswiftui
  - challenge
  - code
  - swift5-7
  - xcode14
---

![taylor swift with ed sheeran and adel, watercolor painting - Stable Diffusion](/images/adelandco.png)

Project 12 was a series of code tutorials around developing CoreData concepts rather than a real app, but the [challenges](https://www.hackingwithswift.com/books/ios-swiftui/core-data-wrap-up) are based on a very small app that uses a subview to allow dynamic (ie changeable at runtime) filtering of a list of data. The reason this would be tricky is that the @FetchRequest is a property of a view - and therefore mutable. The trick is to have a subview to build that part of the view, and to pass parameters into it which build the fetchrequest using an underscore.

The data is three recording artists - Taylor Swift, Ed Sheeran and Adel. The ContentView is a list of their names, with some buttons to filter it. Here's the content view:

```swift
struct ContentView: View {
    
    @Environment(\.managedObjectContext) var moc
    @State private var lastNameFilter = "A"
    
    var body: some View {
        VStack {
            // list of matching singers
            FilteredList(filter: lastNameFilter)

            Button("Add Examples") {
                let taylor = Singer(context: moc)
                taylor.firstName = "Taylor"
                taylor.lastName = "Swift"

                let ed = Singer(context: moc)
                ed.firstName = "Ed"
                ed.lastName = "Sheeran"

                let adele = Singer(context: moc)
                adele.firstName = "Adele"
                adele.lastName = "Adkins"

                try? moc.save()
            }

            Button("Show A") {
                lastNameFilter = "A"
            }

            Button("Show S") {
                lastNameFilter = "S"
            }
        }
    }
}
```

And the subview that builds the FetchRequest and the filtered list:

```swift
struct FilteredList: View {
    @FetchRequest var fetchRequest: FetchedResults<Singer>
    
    var body: some View {
        List(fetchRequest, id: \.self) { singer in
            Text("\(singer.wrappedFirstName) \(singer.wrappedLastName)")
        }
    }
    
    init(filter: String) {
        _fetchRequest = FetchRequest<Singer>(sortDescriptors: [], predicate: NSPredicate(format: "lastName BEGINSWITH %@", filter))
    }
}
```

#### Task 1

> _Modify the FilteredList View we made to make it accept a string parameter that controls which predicate is applied. You can use Swift’s string interpolation to place this in the predicate._

The changes here are to the init() in the FilteredList. Just need another argument to replace the format parameter in the FetchRequest. I may have misunderstood something, because Paul hinted to use string interpolation, but I can't see that it's needed.

```
init(format: String, filter: String) {
    _fetchRequest = FetchRequest<Singer>(sortDescriptors: [], predicate: NSPredicate(format: format, filter))
}
```

Then when we call it, just pass in the format string.

```
// list of matching singers
FilteredList(format: "lastName BEGINSWITH %@", filter: lastNameFilter)
```

#### Task 2

I'm a fan of this task, because of my wariness of Hard Coded Strings.

> _Modify the predicate string parameter to be an enum such as `.beginsWith`, then make that enum get resolved to a string inside the initializer._

The enum, with attached raw values:

```
enum PredicateType: String {
    case beginsWith = "BEGINSWITH"
    case beginsWithIgnoreCase = "BEGINSWITH[c]"
    case contains = "CONTAINS"
    case equals = "=="
    case lessThan = "<"
    case greaterThan = ">"
}
```

The ContentView has a @State variable for it. The user clicks on buttons to change it, and it's passed to the subview instead of the previous string:

```swift
struct ContentView: View {
    
    @Environment(\.managedObjectContext) var moc
    @State private var lastNameFilter = "A"
    @State private var predicateType = PredicateType.beginsWith
    
    var body: some View {
        VStack {
            // list of matching singers
            FilteredList(format: predicateType, filter: lastNameFilter)

            Button("Add Examples") {
                let taylor = Singer(context: moc)
                taylor.firstName = "Taylor"
                taylor.lastName = "Swift"

                let ed = Singer(context: moc)
                ed.firstName = "Ed"
                ed.lastName = "Sheeran"

                let adele = Singer(context: moc)
                adele.firstName = "Adele"
                adele.lastName = "Adkins"

                try? moc.save()
            }

            Button("Begins with A") {
                lastNameFilter = "A"
                predicateType = .beginsWith
            }

            Button("Begins with S") {
                lastNameFilter = "S"
                predicateType = .beginsWith
            }
            Button("Contains n") {
                lastNameFilter = "n"
                predicateType = .contains
            }
            
        }
    }
}
```

Then in the subview, we grab the rawValue and interpolate that into the string. I'm just now realising that for Task 1, Paul probably didn't want the whole string passed in, just the "BEGINSWITH" operator or whatever.

```swift
struct FilteredList: View {
    
    @FetchRequest var fetchRequest: FetchedResults<Singer>
    
    var body: some View {
        List(fetchRequest, id: \.self) { singer in
            Text("\(singer.wrappedFirstName) \(singer.wrappedLastName)")
        }
    }
    
    init(format: PredicateType, filter: String) {
        _fetchRequest = FetchRequest<Singer>(sortDescriptors: [], predicate: NSPredicate(format: "lastName \(format.rawValue) %@", filter))
    }
    
}
```

#### Task 3

> _Make `FilteredList` accept an array of `SortDescriptor` objects to get used in its fetch request._

Yet another change to the init in our subview. It's getting kinda messy:

```
init(format: PredicateType, filter: String, sortDescriptors: [SortDescriptor<Singer>]) {
    _fetchRequest = FetchRequest<Singer>(sortDescriptors: sortDescriptors, predicate: NSPredicate(format: "lastName \(format.rawValue) %@", filter))
}
```

Then in the subview call:

```
// list of matching singers
FilteredList(format: predicateType, filter: lastNameFilter, sortDescriptors: [
                SortDescriptor<Singer>(\.firstName)
])
```
