---
title: "User Defaults & Horizontal Pickers"
date: '2022-09-28'
slug: user-defaults-horizontal-pickers
aliases:
  - /2022/09/28/user-defaults-horizontal-pickers/
tags:
  - 100daysofswiftui
  - swift5-7
  - swiftui
  - xcode14
---

I'm on the challenges for [Day 35](https://www.hackingwithswift.com/guide/ios-swiftui/3/3/challenge) of [100 Days of SwiftUI](https://www.hackingwithswift.com/100/swiftui), and despite Paul's very clear warning:

> _**Important:** It’s really easy to get sucked into these challenges and spend hours_...

I have spent ages fiddling around, but of course still learning. My issue is not so much getting stuck on bugs, rather I keep wanting to do things I don't know how to do.

One issue was solved for my by the wonderful [Fireside Swift](https://firesideswift.fireside.fm/) podcast. I'm working through the old (Steve & Zac) episodes, and they did one on the UserDefaults just when I wanted to be able to persist the multiplication table selection the user had made (this challenge app is a multiplication tables drill app for kids).

First, because I hate hard coded strings, and they seem to be a thing in SwiftUI, and there's no #const system, I've got an enum:

```
enum HCS: String {
    case operand = "Operand"
    case markerFeltWide = "Marker Felt Wide"
}
```

Then in the OnChange for the picker where I want to save/set the value into the default store:

```
.onChange(of: tablesSelection) { _ in  
        UserDefaults.standard.set(self.tablesSelection, 
        forKey: HCS.operand.rawValue)
    generateTable()
}
```

So basically, there's a UserDefaults class that we can call the set method of, passing it the value we want to store, and a string value for the key.

Getting it back is no harder:

```
@State private var tablesSelection =
        UserDefaults.standard.integer(forKey: HCS.operand.rawValue)
```

Super simple!

If the key doesn't exist, [it returns a zero](https://developer.apple.com/documentation/foundation/userdefaults/1407405-integer), so the slightly more complicated production version is:

```
@State private var tablesSelection =
     (UserDefaults.standard.integer(forKey: HCS.operand.rawValue) != 0) ?  
      UserDefaults.standard.integer(forKey: HCS.operand.rawValue) : 5
```

Now to my horizontal wheel picker that the user manipulates to chose which times-table they want to practice:

![](/images/screen-shot-2022-09-25-at-12.39.45-pm-1.png)

I love this little hack stolen from [James](https://stackoverflow.com/users/8279887/james-castrejon) on [Stack Overflow](https://stackoverflow.com/questions/61965315/how-to-get-a-horizontal-picker-for-swift-ui). The first trick is that a .rotationEffect is applied to the picker, and the opposite .rotationEffect is applied to the selections. The second is to chop it off using the frame to make it a bit more compact.
