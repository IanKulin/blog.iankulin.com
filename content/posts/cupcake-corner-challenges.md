---
title: "Cupcake Corner challenges"
date: '2022-11-02'
slug: cupcake-corner-challenges
aliases:
  - /2022/11/02/cupcake-corner-challenges/
tags:
  - 100daysofswiftui
  - challenge
  - swift5-7
  - swiftui
  - xcode14
---

[Day 52](https://www.hackingwithswift.com/books/ios-swiftui/cupcake-corner-wrap-up) of [#100Days](https://www.hackingwithswift.com/100/swiftui) was the challenges to the Cupcake Corner app - an app that allows you to build a one-row order, encode it as JSON and submit it to an API with a URLSession. To allow the order to be passed around, it's an @ObservedObject which meant that a few extra hoops needed to be jumped through to make it Codable.

#### 1) Whitespace validation

The tutorial app validates the order address by checking that each field is not empty, but it can be fooled by just entering some spaces. The first challenge was to fix that.

The tutorial version of the app accomplished the checking with a computed property in the Order struct - which is a good place for it. Here it is:

```swift
var hasValidAddress: Bool {
    if name.isEmpty || streetAddress.isEmpty || city.isEmpty || zip.isEmpty {
        return false
    }
    return true
}
```

There's no .isEmptyIfYouIgnoreWhiteSpace method, so I did this:

```swift
var hasValidAddress: Bool {
    let trimmedName = name.trimmingCharacters(in: .whitespacesAndNewlines)
    let trimmedStreetAddress = streetAddress.trimmingCharacters(in: .whitespacesAndNewlines)
    let trimmedCity = city.trimmingCharacters(in: .whitespacesAndNewlines)
    let trimmedZip = zip.trimmingCharacters(in: .whitespacesAndNewlines)

    if trimmedName.isEmpty || trimmedStreetAddress.isEmpty || trimmedCity.isEmpty || trimmedZip.isEmpty {
        return false
    }

    return true
}
```

[source](https://github.com/IanKulin/CupcakeCorner/commit/2bd1247d268c41b8cb83c07af55ca4bb6f291e81#diff-5d943085c2460b6ea685f488eec227df2a6fec0aa2155bc7ffa85d457604c91e)

#### 2) Show an alert if the POST fails

In the tute version, this is just a print statement. This challenge just involves adding a second alert to the checkout view. [Source](https://github.com/IanKulin/CupcakeCorner/commit/cfb2347c3e48fd68ac47b4f2153cc1faa01149ee)

#### 3) Change order to struct

This is a bit more complicated. A reason for preferring a struct is that all of the extra work we did to make the class Codable is eliminated. We need the thing being passed around to be an object because we want a reference type that can be mutated inside the view hierarchy, and because we want it to be an @Observed Object. The change proposed here is sort of the best of both worlds - have the object, but it's sole property is the struct.

I created a wrapper class, with the struct as an @Published var.

```swift
class Wrapper: ObservableObject {
    @Published var order = Order()

    deinit {
    }
}
```

Then I changed the Order class to a struct, removed @Published from all the properties and deleted the encode/decode code. Then in all the views, I had to go through and fix the names. I did not love the less readable names I was creating; for example `wrapped.order.streetAddress` instead of just `order.streetAddress`. But that all worked.

[source](https://github.com/IanKulin/CupcakeCorner/commit/c8559232b681f527c72ee9b2d89bfba997894d84#diff-5d943085c2460b6ea685f488eec227df2a6fec0aa2155bc7ffa85d457604c91e)
