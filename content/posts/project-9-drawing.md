---
title: "Project 9 - Drawing"
date: '2022-10-18'
slug: project-9-drawing
aliases:
  - /2022/10/18/project-9-drawing/
tags:
  - 100daysofswiftui
  - code
  - graphics
  - swift5-7
  - xcode14
---

![Screenshot of Xcode and the preview showing some fancy graphics](/images/screen-shot-2022-10-16-at-12.17.46-pm.jpg)

These few days of [#100DaysOfSwiftUI](https://www.hackingwithswift.com/100/swiftui/43) we made some pretty shapes by playing around with some of the SwiftUI systems for drawing on the screen, including paths, shapes, transformations, ImagePaint, drawingGroup() to use Metal rendering, blurs, blend modes and using animatableData for animating - which I think is the solution to an animation problem in my TimesTable app I hadn't been able to solve yet.

The challenges were:

> 1.  _Create an `Arrow` shape – having it point straight up is fine. This could be a rectangle/triangle-style arrow, or perhaps three lines, or maybe something else depending on what kind of arrow you want to draw._
> 2.  _Make the line thickness of your `Arrow` shape animatable._
> 3.  _Create a `ColorCyclingRectangle` shape that is the rectangular cousin of `ColorCyclingCircle`, allowing us to control the position of the gradient using one or more properties._

#### Arrow shape

Nothing too tricky here - define the Arrow as a Shape, then build the part for it. The rect in path has yZero at the top.

#### Animate line thickness

I was expecting to have to use animatableData in the challenges, so perhaps I've misunderstood the brief here

#### ColorCycling Rectangle

I locked in the start point for the gradient, then let the user manipulate the end point with two sliders. I wanted a vertical slider, but it wasn't as simple as rotating a slider so I abandoned that as not worth the time investment for the present.

```swift
struct ContentView: View {
    @State private var lineWidth = 10.0
    @State private var xAmount = 0.5
    @State private var yAmount = 0.5
    
    var body: some View {
        VStack {
            let endPoint = UnitPoint(x: xAmount, y: yAmount)
            ColorCyclingRectangle(startPoint: .top, endPoint: endPoint)
                .padding()
            Slider(value: $xAmount)
                .padding(.horizontal)
            Slider(value: $yAmount)
                .padding(.horizontal)
            Divider()
            Arrow()
                .stroke(.red, style: StrokeStyle(lineWidth: lineWidth, lineCap: .round, lineJoin: .round))
                .frame(width: 200, height: 400)
                .animation(.linear(duration: 1), value: lineWidth)
                .padding(.vertical)
            HStack{
                Text("Line width: ")
                Button("5") {lineWidth = 5}
                Button("10") {lineWidth = 10}
                Button("25") {lineWidth = 25}
                Button("50") {lineWidth = 50}
            }
            .padding(.vertical)
        }
    }
}
         

struct ColorCyclingRectangle: View {
    var startPoint: UnitPoint
    var endPoint: UnitPoint
    
    var body: some View {
        ZStack {
            ForEach(0..<100) { value in
                Rectangle()
                    .inset(by: Double(value))
                    .strokeBorder(
                        LinearGradient(
                            gradient: Gradient(colors: [
                                color(for: value, brightness: 1),
                                color(for: value, brightness: 0.5)
                            ]),
                            startPoint: startPoint,
                            endPoint: endPoint
                        ),
                        lineWidth: 2
                    )
            }
        }
        .drawingGroup()
    }

    func color(for value: Int, brightness: Double) -> Color {
        var targetHue = Double(value) / Double(100) + 1

        if targetHue > 1 {
            targetHue -= 1
        }

        return Color(hue: targetHue, saturation: 1, brightness: brightness)
    }
}

struct Arrow: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        // follow the points from the tip around clockwise
        path.move(to: CGPoint(x: rect.midX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY/3))
        path.addLine(to: CGPoint(x: rect.maxX/3*2, y: rect.maxY/3))
        path.addLine(to: CGPoint(x: rect.maxX/3*2, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.maxX/3, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.maxX/3, y: rect.maxY/3))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY/3))
        path.addLine(to: CGPoint(x: rect.midX, y: rect.minY))
        return path
    }
}
```

As this wasn't a real project - just scratch code of various techniques - I hadn't worried about a git repo for it, but twice that came back to bite me when I wanted to go abandon an approach and pick up at an earlier point. That's a lesson for me.
