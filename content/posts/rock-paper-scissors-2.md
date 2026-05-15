---
title: "Rock, Paper Scissors (2)"
date: '2022-09-13'
slug: rock-paper-scissors-2
aliases:
  - /2022/09/13/rock-paper-scissors-2/
tags:
  - 100daysofswiftui
  - posts
  - swiftui
---

When I was forced by a deadline into delivering this project, I noted in its [post](https://devendevour.wordpress.com/?p=735) that there was a number of improvements to make:

> 1.  _The rock paper scissors could be some better data structure than an array and some ints._
> 2.  _I don’t love the try to win, try to lose aspect, but the client specified it_
> 3.  _Having the didUserWin and didComputerWin funcs is a cop out – that should probably be a single function returning a win/lose/draw type_
> 4.  _I also am unhappy with nesting them in the view namespace to use my #consts_
> 5.  _duplicating the last part of the view but making the elements .hidden() to keep the same spacing seems like a kludge_
> 6.  _when I added the link to the Hacking With SwiftUI page with the app brief just now, I noticed I haven’t done the scoring the way it was asked for_

Here's the progress

_The rock paper scissors could be some better data structure than an array and some ints_

Done. Made a sweet swifty enum. Read about it here. That also solved #4

_I don’t love the try to win, try to lose aspect, but the client specified it_

We can't always help what a client wants. Deal with it.

_Having the didUserWin and didComputerWin funcs is a cop out – that should probably be a single function returning a win/lose/dra_w

```
enum GameResult {
    case win
    case loss
    case draw
}

func gameResult(user: FingerShape, computer: FingerShape) -> GameResult {
    switch user {
    case .rock:
        switch computer {
        case .rock: return .draw
        case .paper: return .loss
        case .scissors: return .win
       }
    case .paper:
        switch computer {
            case .rock: return .win
            case .paper: return .draw
            case .scissors: return .loss
        }
    case .scissors:
            switch computer {
            case .rock: return .loss
            case .paper: return .win
            case .scissors: return .draw
        }
    }
}
```

_duplicating the last part of the view but making the elements .hidden() to keep the same spacing seems like a kludge_

This was an issue - not just because of the mess of code, but because (according to Paul) it's a workload issue - the view managing part of SwiftUI has to keep creating and destroying parts of our view instead of recycling them. In an earlier lesson, he encouraged the use of the ternary operator in modifiers to avoid this - but .hidden() doesn't have any arguments. Here's the sort of code I'm talking about - I've got this sort of thing several places.

```
if revealResult {
    Text(computerSelection.rawValue)
        .font(.system(size: 200))
    Text(winText).font(.title)
    Spacer()
    Button("Play again") {
        goalIsWinThisTurn = Bool.random()
        revealResult = false
        if showScores {
            score = 0
            numberOfPlays = 0
            showScores.toggle()
         }
    }
    .buttonStyle(CustomButtonStyle())
}
else {
    Text(computerSelection.rawValue)
        .font(.system(size: 200))
        .hidden()
    Text(winText)
        .font(.title)
        .hidden()
    Spacer()
    Button("Play again") {}
        .buttonStyle(CustomButtonStyle())
        .hidden()
}
```

I was surprised when googling something like "swiftui view visibility not hidden()" I found, instead of a stack overflow question, a [nice Apple tutorial](https://developer.apple.com/tutorials/swiftui-concepts/choosing-the-right-way-to-hide-a-view?changes=_3) at the top of the links.

Within was my answer - most views have an .opacity() modifier. With that, the code above becomes:

```
Group {
    Text(computerSelection.rawValue)
        .font(.system(size: 200))
    Text(winText).font(.title)
    Spacer()
    Button("Play again") {
        goalIsWinThisTurn = Bool.random()
        revealResult = false
        if showScores {
             score = 0
             numberOfPlays = 0
             showScores.toggle()
        }
    }
    .buttonStyle(CustomButtonStyle())
}
.opacity(revealResult ? 1 : 0)
```

Noice. I then when on a ternary insertion spree that dropped my view body down from 74 lines of code to 52 and improved readability substantially.

[Current source](https://github.com/IanKulin/RockPaper/blob/fe8e2eea247e9c1ab13daa3e39929100991f69c5/RockPaper/ContentView.swift)
