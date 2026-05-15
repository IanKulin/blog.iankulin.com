---
title: "Regex to split a string with two different characters"
date: '2022-11-30'
slug: regex-to-split-a-string-with-two-different-characters
aliases:
  - /2022/11/30/regex-to-split-a-string-with-two-different-characters/
tags:
  - possibly-useful
  - regex
  - swift5-7
  - xcode14-1
---

![young woman cutting string, painting by - StableDiffusion](/images/young-woman-cutting-string-painting-by.jpg)

I'm working on the behaviour tickets app, and wanted a visually functional version to share with stakeholders this week to get some feedback. As usual in this situation, I'm pressed for time so feeling the pressure to take some liberties with code quality that I'll come back and fix one day.

In a salient lesson of why that's usually a bad idea, I've ended up googling to try and understand regex instead of writing code.

Here's the problem I was trying to quickly solve. I've used a string for what should probably have been a struct. It looks like this:

`let myString = "Some behaviour (expectation)"`

Its super easy to combine values together into a string, but substantially more difficult (and dangerous) to extract them out again. I want to get `"Some behaviour"` and `"expectation"`.

There is a String.split() function that takes a separator and returns an array of the strings split on that. That could work in this case, but I'd have to split a couple of times since I'm using two different separators. Swift 5.7 released in 2022 introduced a regex (regular expression) type, and this can be used as the argument for the split() method. Sounds perfect. Here's the code that I ended up with:

```
let myString = "Some behaviour (expectation)"
let regex = /\ \(|\)/

let splits = myString.split(separator: regex)

print(splits)
// ["Some behaviour", "expectation"]
```

I think it's fair to say that regex is powerful, but not intuitive. There are many [online tools](https://regex101.com/) to help with this. But let me step through building this expression to give you an idea of what's going on.

The first thing is that the expression is enclosed in two forward slashes. So if we just wanted to split on lower case 'o' the expression would be `/o/`

```
let myString = "Some behaviour (expectation)"
let regex = /o/

let splits = myString.split(separator: regex)

print(splits)
//["S", "me behavi", "ur (expectati", "n)"]
```

But we want to split on an opening bracket. You might think `/)/` would work, but brackets are part of the regex syntax, so they have to be escaped. This is done with a back slash.

```
let myString = "Some behaviour (expectation)"
let regex = /\(/

let splits = myString.split(separator: regex)

print(splits)
["Some behaviour ", "expectation)"]
```

I don't want that space at the end of "Some behaviour " so I'll add that to the regex. Spaces are not allowed at the start of a regex, so that needs to be escaped too.

```
let myString = "Some behaviour (expectation)"
let regex = /\ \(/

let splits = myString.split(separator: regex)

print(splits)
// ["Some behaviour", "expectation)"]
```

To match the end bracket, we'll need to add an OR to our expression. In regex, this is a | (pipe), and of course we need to escape the bracket again.

```
let myString = "Some behaviour (expectation)"
let regex = /\ \(|\)/

let splits = myString.split(separator: regex)

print(splits)
["Some behaviour", "expectation"]
```

I played with this in an Xcode playground. I normally don't use them because I love the iCloud sync that I get with the Playgrounds app to my iPad, but it seems like the app version is not on Swift 5.7 yet.
