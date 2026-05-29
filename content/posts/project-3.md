---
title: "Project 3"
date: '2022-09-05'
slug: project-3
aliases:
  - /2022/09/05/project-3/
tags:
  - 100daysofswiftui
  - code
  - posts
  - swiftui
---

This one's not really a project, just a couple of little updates to earlier work, and a code snippet.

#### Challenge 1

> _Go back to project 1 and use a conditional modifier to change the total amount text view to red if the user selects a 0% tip._

The first one is pretty simple - a ternary condition to make the total red if the tip is set to zero.

![](/images/screen-shot-2022-09-02-at-5.10.56-pm.png)

Text(grandTotal, format: currencyCode)
    .foregroundColor(tipPercentage == 0 ? .red : .primary)

The _ternary operator_ is like a little inline if then else statement. It has the format:

```
(w ? t : f)
```

where w is the condition, t is the code if the condition is true and f is the code if the condition is false. So the code above checks if the tipPercentage is zero, if it is, the grandTotal text is red, otherwise it's coloured _.primary_ - one of the semantic colors. The semantic colours are colours set by the system and referred to by their purpose. In this case it will be black (the "primary" text colour), unless I change the theme to dark mode, in which case it will be white.

[Source](https://github.com/IanKulin/WeSplit/compare/v1.0...v1.1)

#### Challenge 2

> _Go back to project 2 and replace the_ `Image` _view used for flags with a new_ `FlagImage`_`()` view that renders one flag image using the specific set of modifiers we had._

Again, pretty straightforward. I just made a new view struct in the main view.

```swift
struct FlagView: View {
        var flagOf: String
        
        var body: some View {
            Image(flagOf)
                .renderingMode(.original)
                .shadow(radius: 5)
        }
}
```

Then called it with our flag name.

```swift
ForEach(0..<3) { number in
    Button {
        // flag was tapped
        flagTapped(number)
    } label: {
        FlagView(flagOf: countries\[number\])
    }
}
```

[Source](https://github.com/IanKulin/GuessTheFlag/compare/v1.0...v1.1)

#### Challenge 3

> _Create a custom_ `ViewModifier` _(and accompanying_ `View` _extension) that makes a view have a large, blue font suitable for prominent titles in a view._

```swift
struct ContentView: View {
    var body: some View {
        VStack{
            Text("Hello World")
                .titleStyle()
            Spacer()
        }
    }
}

struct ProminentTitle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .font(.largeTitle)
            .foregroundColor(.blue)
            .padding()
    }
}

extension View {
    func titleStyle() -> some View {
        modifier(ProminentTitle())
    }
}
```
