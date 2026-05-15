---
title: "Clean code"
date: '2022-12-09'
slug: clean-code
aliases:
  - /2022/12/09/clean-code/
tags:
  - code
  - comments
  - philosophy
  - posts
  - swift5-7
  - xcode14-1
---

![young woman cleaning a computer, painting - stable diffusion](/images/young-woman-cleaning-a-computer-painting.png)

I've been listening to the [latest episode of the Empower Apps](https://www.youtube.com/watch?v=YVrHPCZnC50) podcast, this one with [Jill Scott](https://twitter.com/Jilsco9) talking about "Humane" development - in the sense of being humane to whoever (probably you) is going to be reading this code in the future. It helped me clarify my thoughts about a couple of things.

None of these ideas are particularly new or groundbreaking, and although I think of them as my personal style, they are very common, and in Swift could be regarded as part of the culture. Some of these concepts support each other, some represent a trade off between two opposing ideas that require us to make a choice.

![](/images/onion-belt.gif)

#### The Custom at the Time

If other people or bots are going to read your code, or you need to comprehend theirs, there is a lot of value in following the conventions in the language of community you work in. It helps in a couple of ways - 1) you are not expending energy deciding if equals signs should have a space each side, and 2) fluency of reading and writing will improve.

#### Natural Language

If it's possible to make choices in a piece of code to make it read more like a description of what is happening, then usually do that. Swift (and probably other modern languages - I wouldn't know) has some great language features to support this. For example:

```
answer = resultOf(6, plus: 7)
```

I also appreciate the Swift convention of using auxiliary verbs. I think `isPaused` or `hasCompleted` is clearer that `paused` or `completed`.

#### Decomposed

There's probably a reason why paragraphs exist in writing, and are about the length they usually are, deep in the science of how memory works in humans and the interplay between working memory and what else goes on in comprehending something.

I start to get uncomfortable if a chunk of code I'm trying to understand or write is more than a couple of 13" laptop screens long. I thought [code folding](https://davidstechtips.com/2012/05/folding-code-in-xcode/comment-page-1/) would help but haven't really found that. I aim to have each chunk (I'm using "chunk" for function, method, computed property etc) express a single idea. If part of it is getting long, I consider if that can be removed somewhere else and replaced with a helpful function name in the piece I'm working on.

#### Less Magic

When I'm working with some code, I don't want it to need too much context to understand. This principle means anything used in this code should come in through the obvious interface. Global variables, environment variables, or stuff captured from the enclosing scope are undesirable. If I use them, I try and put them near the top since that's where people (me) look when they encounter something part way through the code and don't know where it came from.

In an ideal world, I could grab a piece of code and paste it into a [gist](https://gist.github.com/discover) to share here and it would be comprehensible.

#### Evaporated Comments

I doubt I invented this, but I haven't seen it mentioned anywhere else either. The way I most commonly use comments is to clarify my thoughts before I write any code, something like:

```
func sendFile(fileName: String, link: NetworkTube) -> SendResultCode {
  // check link is operational
  // attempt to open file
  // step through each line sending it, wait for ack 
  // close file
  // return code
} 
```

Then as I flesh out the function, I delete the comment if the code is straight forward. Usually this results in all of the comments being deleted. In my Swift code, comments are quite rare. Where there are comments, it's probably a sign I need to name things better.

I just went back through the code for that apps I actually use on my phone, and these are the only comments I could find outside of a header.

```
var fractionDue: Double {
    // when a habit is overdue, or due now, the fractionDue is 1.0
    // when it's not due at all - just been done, the fractioDue is 0.0
    if isDueNow {
        return 1.0
    } else {
        let daysSinceDone = Date().timeIntervalSince(lastDone) / 86_400
        assert(daysBetweenCompletions > 0.0)
        return daysSinceDone / daysBetweenCompletions
    }
}
```

This is a computed variable in a "Habit" struct. I wanted to have little ticks next to each habit when they were done, which would slowly fade to be completely gone when this habit was due again. To achieve this I needed to calculate an opacity value for the tick. I think it's fair to say this needs re-working. I don't recall if I wrote the comment first, or put it there later recognising the code wasn't self explanatory - it could have been either.

I'm not sure I could fix this to the point it wouldn't need a comment at all. There's a couple of name changes that would help. I think `daysSinceDone` would be better as `daysSinceLastCompleted`, and instead of calling the property `fractionDue`, I might call it `freshness`. Instead of dividing the time interval by 86,400 I could have a `millisecondsToDays()`function.
