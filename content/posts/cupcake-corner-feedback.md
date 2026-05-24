---
title: "Cupcake Corner Feedback"
date: '2022-11-03'
slug: cupcake-corner-feedback
aliases:
  - /2022/11/03/cupcake-corner-feedback/
tags:
  - 100daysofswiftui
  - challenge
  - swift5-7
  - xcode14
---

As usual, here's my thoughts comparing my attempts at the challenges to Paul's. Usually he's better!

#### 1) Whitespace

The task was to validate the order address properties, not just by checking they are not empty, but also that they don't just contain spaces. I went the bruteforce route since there was no .isEmptyIncludingWhitespace method.

```
var hasValidAddress: Bool {
    let trimmedName = name.trimmingCharacters(in: .whitespacesAndNewlines)
    let trimmedStreetAddress = streetAddress.trimmingCharacters(in: .whitespacesAndNewlines)
    let trimmedCity = city.trimmingCharacters(in: .whitespacesAndNewlines)
    let trimmedZip = zip.trimmingCharacters(in: .whitespacesAndNewlines)

    if trimmedName.isEmpty || trimmedStreetAddress.isEmpty || trimmedCity.isEmpty || trimmedZip.isEmpty {
        return false
    }
    return true
}
```

As soon as Paul mentioned extending String, I facepalmed - of course, just create the method I want on string. Paul's is a one line extension - neater, and Swiftyier.

#### 2) Alert for POST fail

Paul's approach exactly the same as mine, with the addition of showing the localizedDescription of _error_ which is something that must exist in catch blocks.

#### 3) struct Wrapper

We had the same approach. I liked Paul's naming better. He named the wrapper class _SharedOrder_, then the instance _order_. Then the instance of the struct _data_. That way the name hierarchys in the code were something like _order.data.street_ which was better than mine, although they still bug me. Another difference I noticed was that the static enum for the cupcake types he put in the wrapper class whereas I had it in the order struct.

Paul left the CodingKey enum in - no problem with that, but I can't see that it's needed.

#### Bombshell

You know how I was complaining that the class.struct.propertyname things were the main downside of the class wrapping a struct approach? Next Paul pulls a rabbit out of his hat with _@dynamicMemberLookup_ combined with _keyPaths_. I'm not going to explain how these work, but the effect is that we can eliminate the struct name from our names so _order.data.street_ is just _order.street_ but it is still referencing our struct property wrapped in the class.

![](/images/screen-shot-2022-10-29-at-9.16.01-pm.jpg)
