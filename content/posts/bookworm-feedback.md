---
title: "Bookworm Feedback"
date: '2022-11-07'
slug: bookworm-feedback
aliases:
  - /2022/11/07/bookworm-feedback/
tags:
  - 100daysofswiftui
  - swift5-7
  - xcode14
---

I did so well on this one that it's not going to make a very interesting post. My first two challenge solutions were pretty much character for character the same - so not much to report.

On the third challenge, there was a minor difference in the display process. I had done this:

```
let date = book.date ?? Date()
Text(date.formatted(.dateTime.day().month().year()))
    .foregroundColor(.secondary)
    .opacity(date == book.date ? 1 : 0)
```

But @twostraws went:

```
if let date = book.date {
    Text(date.formatted(date:.abbreviated, time:.omitted))
}
```

I agree the _if let_ is neater. I was heading a warning from earlier in the series about avoiding if statements when building views as they can cause the view to have to be destroyed and recreated if it contains different elements (as opposed to a property change - which I don't fully understand since I also believed those modifier properties where causing the views to be recreated inside other views?), but I don't know if that's an issue at all for list elements - I'm guessing not if Paul is doing it this way. I have noticed (when playing with print statements in init methods) that SwiftUI is very good at only recreating the views that need recreated.

I would stand by my use of the opacity to disappear the text but save the space though - this is a good trick if you want to have a piece of a view not there, but still reserve its space.

Paul has also done better with his date format. Mine does not take into account the date formats for different locales, where as iOS will manage that with Paul's use of .abbreviated.
