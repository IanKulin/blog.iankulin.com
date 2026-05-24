---
title: "Day 23 - Views and Modifiers - Part 2"
date: '2022-09-01'
slug: day-23-views-and-modifiers-part-2
aliases:
  - /2022/09/01/day-23-views-and-modifiers-part-2/
tags:
  - 100daysofswiftui
  - code
  - posts
  - swiftui
---

<img src="/images/psm_v10_d562_the_hindoo_earth-2.jpg" width="484" alt="">

Although "immutable" the view structs can contain some control statements such as if/then and for loops. So this is quite legal, and useful.

struct ContentView: View {
    @State private var likesGreen = true

    var body: some View {
        if likesGreen {
            Text("Hello World")
            .background(.green)
        }
        else
        {
            Text("Hello World")
            .background(.blue)
        }
    }
}

But Paul cautions against this, saying:

> [You can often use regular if conditions to return different views based on some state, but this actually creates more work for SwiftUI – rather than seeing one Button being used with different colors, it now sees two different Button views, and when we flip the Boolean condition it will destroy one to create the other rather than just recolor what it has.](https://www.hackingwithswift.com/books/ios-swiftui/conditional-modifiers)

Instead, he encourages the use of the ternary operator in modifiers for these situations. The ternary operator is like an if/then/else statement packaged up neatly. So the code above becomes:

struct ContentView: View {
    @State private var likesGreen = true
    
    var body: some View {
        Text("Hello World")
            .background(likesGreen ? .green : .blue)
    }
}

He's not arguing that it's neater, but also that it's more efficient - that the first version has to destroy and create a Text when the value of the flag changes, whereas the second one just changes the colour. I assume he's correct, but it's not obvious why that would be so. It must be in the magic of how SwiftUI optimises how and when it renders each part of a view.
