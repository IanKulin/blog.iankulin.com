---
title: "Project 4 Challenges"
date: '2022-09-16'
slug: project-4-challenges
aliases:
  - /2022/09/16/project-4-challenges/
tags:
  - 100daysofswiftui
  - code
  - posts
---

![](/images/screen-shot-2022-09-13-at-7.22.43-pm.png)

I've completed the Project 4 challenges (source) of the 100 Days of SwiftUI, no biggie - the increase in difficulty between each step of Paul's bootcamp is small enough that it's never too stressful, but large enough you feel like you're progressing all the time.

Since I've paid to be a member of Hacking with Swift, one of the perks is to see Paul's video solutions. I've not worries about it before, but I should - looking at them and comparing to my efforts is probably good feedback. So here's the differences in our answers to the challenges.

#### Sections

When I changed the VStacks to Sections, I put the section title text at the top:

```
Section(header: Text("When do you want to wake up?")) {
    HStack {
        DatePicker("Please enter a time", selection: $wakeUp,       
            displayedComponents: .hourAndMinute).labelsHidden()
    }
}
```

Paul had his in a trailing closure at the bottom:

```
Section {
    DatePicker("Please enter a time", selection: $wakeUp,    
        displayedComponents: .hourAndMinute).labelsHidden()
}
header: {
  Text("When do you want to wake up?")
}
```

I thought mine was nicer, but then the very next thing he shows in the video is:

```
Section("When do you want to wake up?") {
    DatePicker("Please enter a time", selection: $wakeUp,    
        displayedComponents: .hourAndMinute).labelsHidden()
}
```

So there - I have learned something for an expert...

The next job was to change the stepper to a picker for the number of cups of coffee. I had something like this:

```
Section(header: Text("Daily coffee intake?") {
    Picker(coffeeAmount == 1 ? "1 cup" : "\(coffeeAmount) cups", 
        selection: $coffeeAmount) {
        ForEach(1...20, id: \.self) { i in
            if i == 1 {
                 Text("1 cup")
            } else {
                 Text("\(i) cups")
           }
        }
    }
}
```

And Paul:

```
Section("Daily coffee intake?") {
    Picker("Number of cups", selection: $coffeeAmount) {
        ForEach(1..<21) {
            Text(String($0))
        }
    }
}
```

so yeah, then when I looked at my output properly (see simulator image above) I noticed mine didn't make sense anyway. My bad - that's a horrid careless error.

I'm not sure about the difference in the ranges 1...20 and 1..<21 the ..< is a great habit for avoiding off by one errors with collections, perhaps that's the reason for Paul's choice there.

The third thing to do was to get rid of the alert, and show the result live as changes were made. I did mine by by adding a text field whose contents were a call to a slightly modified calculateBedtime() function. Paul moved that code up to a new computed property. I'm not sure I see any difference there except style.

So, that's a worthwhile thing to do - to look at Paul's solution and compare it to mine, so I'll go on and do that in future.
