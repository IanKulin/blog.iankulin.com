---
title: "Protocols"
date: '2022-08-16'
slug: protocols
aliases:
  - /2022/08/16/protocols/
tags:
  - c
  - code
  - possibly-useful
  - protocols
  - swift-language
---

![](/images/protocoldroid-swe.jpg)

The evolution of structs into class-like things that can hold properties _and_ methods in Swift raised in my mind "what about inheritance?" - but no: structs in Swift can not use inheritance.

Swift classes implement inheritance, but only from one class; there's no multiple inheritance. Protocols neatly address both these concerns to a large extent, but perhaps before we look at how they work, we should have a brief diversion into inheritance in C++.

```c
#include <iostream>

class Shape {
    public:
    int sides;
};

class Drawable {
    public:
        virtual void draw() {}
};

class Square : public Shape, public Drawable {
    public:
        Square(){
            sides = 4;
        }
        
        void draw() {
            std::cout << "■" << std::endl;
        }
};

int main() {
    Square square;
    square.draw();
    return 0;
}
```

In the code above, there's two classes _Shape_ and _Drawable_. You could regard _Drawable_ as an _interface_ if you're coming from Java world (because the method draw() is marked _virtual_ - there's no implementation). The class _Square_ inherits from both those classes - it's a new class that is a _Shape_, but is also _Drawable_. (Line 15 above)

Perhaps in this program there's other items such as images or text - ie not shapes which might also inherit from _Drawable_. Elsewhere, we could have a method that had to draw a collection of things - it doesn't care what the items are, as long as they are _Drawable_ - they have to implement the _Draw_() method.

Swift addresses most of these needs with Protocols. A protocol defines a set of properties and methods. Then a struct, class, or even enum can _conform_ with this protocol - they contain the same properties, and are required by the compiler to implement the methods from the protocol.

Here's the Swift equivalent of the C++ above:

```swift
protocol Shape {
    var sides: Int { get set }
}

protocol Drawable {
    func draw()
}

struct Square:  Shape, Drawable {
    var sides: Int = 4
    func draw() {
        print("■")
    }
}

let square = Square()
square.draw()

So, that's cool, but not amazing. The power is really that now we can write a function that takes anything that's Drawable as if it was a real type. To wit:

class IanClass: Drawable {
    func draw() {
        print("Ian")
    }
}

func drawAThing(\_ thingToDraw: Drawable){
    thingToDraw.draw()
}

let squareStruct = Square()
let ianClass = IanClass()

drawAThing(squareStruct)
drawAThing(ianClass)
```

So the function _drawAThing()_ is happy to draw anything, as long as it conforms with the Drawable protocol by implementing the draw() method. It doesn't even matter what it is - as in this example where we've passed it a struct on one occasion, and a class on another.

Protocols are a great example of Swift being flexible while being type-safe.
