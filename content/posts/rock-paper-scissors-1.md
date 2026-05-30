---
title: "Rock, Paper, Scissors (1)"
date: '2022-09-10'
slug: rock-paper-scissors-1
aliases:
  - /2022/09/10/rock-paper-scissors-1/
tags:
  - 100daysofswiftui
  - code
  - posts
---

As I mentioned yesterday, I needed to make some progress to blog about, and I had a half working version of a Rock, Paper, Scissors for [Day 25](https://www.hackingwithswift.com/100/swiftui/25) so I pushed myself to get that working.

There's lots in the code below I don't love.

-   The rock paper scissors could be some better data structure than an array and some ints.
-   I don't love the try to win, try to lose aspect, but the client specified it
-   Having the didUserWin and didComputerWin funcs is a cop out - that should probably be a single function returning a win/lose/draw type
-   I also am unhappy with nesting them in the view namespace to use my #consts
-   duplicating the last part of the view but making the elements .hidden() to keep the same spacing seems like a kludge
-   when I added the link to the Hacking With SwiftUI page with the app brief just now, I noticed I haven't done the scoring the way it was asked for

[source on github](https://github.com/IanKulin/RockPaper/commit/b1497cccf2dc8af953b946458af797dc5ad12dc9?diff=unified#diff-223dd39ecc4f631b084c99b065a71ea40dc2deba8e36e7f5f939802e60c80186)

```swift
struct ContentView: View {
    @State var score = 0
    @State var goalIsWinThisTurn = Bool.random()
    @State var userSelection = 0
    @State var computerSelection = 0
    @State var winText = ""

    // game has two modes - revealResult - buttons don't work, and we can see the computer result
    // or not readyToPlay - user can chose their play
    @State var revealResult = false
    
    let rock = 0
    let paper = 1
    let scissors = 2
    let rpsEmoji = \["🪨", "📃", "✂️"\]
    
        
    var body: some View {
        ZStack{
            LinearGradient(colors: \[.white, .gray\], startPoint: .top, endPoint: .bottom)
            VStack{
                Button("Score: \\(score)"){
                    score = 0
                }
                .font(.title)
                .foregroundColor(.primary)
                
                Spacer()
                if goalIsWinThisTurn {
                    Text("Try to win")
                        .font(.title)
                }
                else {
                    Text("Try to lose")
                        .font(.title)
                }
                
                Spacer()
                HStack{
                    Spacer()
                    Button(rpsEmoji\[rock\]) {
                        processButton(selection: rock)
                    }
                    Spacer()
                    Button(rpsEmoji\[paper\]) {
                        processButton(selection: paper)
                    }
                    Spacer()
                    Button(rpsEmoji\[scissors\]){
                        processButton(selection: scissors)
                    }
                    Spacer()
                }.font(.system(size: 60))
                
                Spacer()
                if revealResult {
                    Text(rpsEmoji\[computerSelection\])
                        .font(.system(size: 200))
                    Text(winText).font(.title)
                    Spacer()
                    Button("Play again") {
                        goalIsWinThisTurn = Bool.random()
                        revealResult = false
                    }
                    .buttonStyle(CustomButtonStyle())
                }
                else {
                    Text(rpsEmoji\[computerSelection\])
                        .font(.system(size: 200))
                        .hidden()
                    Text(winText)
                        .font(.title)
                        .hidden()
                    Spacer()
                    Button("Play again") {
                        goalIsWinThisTurn = Bool.random()
                        revealResult = false
                    }
                    .buttonStyle(CustomButtonStyle())
                    .hidden()
                }
                Spacer()
            }
        }
    }
    
    func didUserWin(user: Int, computer: Int) -> Bool {
        switch(user) {
        case rock:
            switch(computer) {
            case scissors: return true
            default: return false
            }
        case paper:
            switch(computer) {
            case rock: return true
            default: return false
            }
        case scissors:
            switch(computer) {
            case paper: return true
            default: return false
            }
        default:
            assert(false)
            return false
        }
    }
    
    func didComputerWin(user: Int, computer: Int) -> Bool {
        switch(computer) {
        case rock:
            switch(user) {
            case scissors: return true
            default: return false
            }
        case paper:
            switch(user) {
            case rock: return true
            default: return false
            }
        case scissors:
            switch(user) {
            case paper: return true
            default: return false
            }
        default:
            assert(false)
            return false
        }
    }
    
    func processButton(selection: Int) {
        if !revealResult {
            computerSelection = Int.random(in: 0...2)
            userSelection = selection
            if didUserWin(user: userSelection, computer: computerSelection) {
                winText = "You win"
                if goalIsWinThisTurn {
                    score += 1
                    winText = "You win"
                } else {
                    score -= 1
                    winText = "You win, sorry"
                }
            } else if didComputerWin(user: userSelection, computer: computerSelection) {
                if goalIsWinThisTurn {
                    score -= 1
                    winText = "You lose, sorry"
                } else {
                    score += 1
                    winText = "You lose!"
                }
            } else {
                winText = "Draw"
            }
            revealResult = true
        }
    }
    

}

struct CustomButtonStyle : ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.title)
            .padding(10)
            .foregroundColor(.white)
            .background(Color.blue)
            .cornerRadius(5)
    }
}
```