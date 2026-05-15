---
title: "Gists for embedding code"
date: '2022-09-23'
slug: gists-for-embedding-code
aliases:
  - /2022/09/23/gists-for-embedding-code/
tags:
  - content-creation
  - gaspard-rosay
  - posts
  - tip
---

So, I might have found a slightly better method for sharing code in posts that I complained about the [other day](https://devendevour.wordpress.com/?p=858). GitHub has a thing called [Gists](https://gist.github.com/). It's like a tiny repository you can paste a code snippet into (or upload a source file). Once that's done, you can just paste the URL of the Gist into [Wordpress](https://wordpress.com/support/gist/) - it recognises it and does this:

```swift
ForEach(0..<3) { number in
    Button {
       // flag was tapped
       flagTapped(number)
       } label: {
           FlagView(flagOf: countries[number])
       }
       .rotation3DEffect(.degrees(flagSpinAmount[number]),
            axis: (x: 0, y: 1, z: 0))
       .opacity(flagOpacity[number])
       .scaleEffect(flagScale[number])
       .animation(.default, value: flagSpinAmount)
}
```

I came across this being used on a [blog post](https://blog.rosay.io/create-a-camera-app-with-swiftui-60876fcb9118) (about using the camera in apps) from [Gaspard Rosay](https://rosay.io/).
