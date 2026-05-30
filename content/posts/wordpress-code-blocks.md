---
title: "Wordpress Code Blocks"
date: '2022-09-21'
slug: wordpress-code-blocks
aliases:
  - /2022/09/21/wordpress-code-blocks/
tags:
  - css
  - html
  - posts
  - wordpress
---

_edit from 2026 - since I'm no longer hosting this page on wordpress - the examples are meaningless. Best skip it._

Non-iOS post warning :- )

I'm not really happy with the way I'm sharing code in these posts. I started off with the regular Wordpress code blocks:

```
    func isPossible(word: String) -> Bool {
        var tempWord = rootWord
        for letter in word {
            if let pos = tempWord.firstIndex(of: letter) {
                tempWord.remove(at: pos)
            } else {
                return false
            }
        }
        return true
    }
```

These seem a bit large to me, but it comes with a font size choice, which I like setting to "Tiny":

```
    func isPossible(word: String) -> Bool {
        var tempWord = rootWord
        for letter in word {
            if let pos = tempWord.firstIndex(of: letter) {
                tempWord.remove(at: pos)
            } else {
                return false
            }
        }
        return true
    }
```

There's a reason why coloured syntax highlighting exists in IDE's, so obviously I'd want that for my posts. If you move to a paid tier on Wordpress, as well as eliminating the advertisements from your posts, you get a new coloured code block called "SyntaxHighlighter Code:

    func isPossible(word: String) -> Bool {
        var tempWord = rootWord
        for letter in word {
            if let pos = tempWord.firstIndex(of: letter) {
                tempWord.remove(at: pos)
            } else {
                return false
            }
        }
        return true
    }

It has a few options, line numbers, making links clickable, and highlighting lines (as I've done above), but no size, and no control of the font or colours, which are so dreadful I've mostly given up on using them. It does have a number of languages to choose from which is impressive, but the highlighting is not as good as Xcode, here's how that snippet looks with the theme I'm using.

![](/images/screen-shot-2022-09-18-at-7.34.14-am.png)

So the Wordpress block is picking out keywords and types, but not properties. In the ideal world my code examples here would look exactly like this. I could just use screenshots like this, but there's a couple of minor issues with that. The first is the problems with scaling on different devices, and the second is that non-Apple viewers don't have a simple way of selecting text from an image.

The idea solution would be that the SyntaxHighlighter code block had a few more options. Wordpress is known for the large number of plugins available, so there's possibly a plugin that solves this problem, so a possible solution is for me to learn more about Wordpress which is not a big priority for me at the moment. Related to that is the possibility of using "Additional CSS classes" which is one of the options for the code block.

I do note that when code is copied out from Xcode it includes the font and colour information (I guess as rich text?). If I copy the code above and pasted it into word and change the background colour, it looks like this:

![](/images/screen-shot-2022-09-18-at-7.43.31-am.jpg)

So that raises the prospect of pasting it into a different Wordpress block that displays rich text, but if there is such a thing, I can't see how to access it.

HTML has evolved in part to solve this sort of problem, and there is an HTML block for Wordpress. If I save the Word doc above into HTML and paste it into the HTML block I get this, which is about 75% of the way towards what I'm after.

**func** isPossible(word: String) -> Bool {

**var** tempWord = rootWord

**for** letter **in** word {

**if** **let** pos = tempWord.firstIndex(of: letter) {

tempWord.remove(at: pos)

} **else** {

**return** **false**

}

}

**return** **true**

}

The HTML source is not pretty, but I can't see why this couldn't work if I wrote something to convert the pasted rich text into nicer HTML that looks closer to the Xcode IDE version.

Other people have solved this problem. I notice Paul Hudson has exactly the presentation I'd like on his pages:

![](/images/screen-shot-2022-09-18-at-8.11.37-am.jpg)

His HTML for this (correctly) leaves the work for the CSS. I had a quick look, and other than knowing it was written by [BootStrap](https://getbootstrap.com/), it was mostly incomprehensible to me. Better HTML and CSS is on my list of coding goals, but my current level of knowledge is stuck on 1996 HTML. I'd be happy to chuck up a page with some blinking text, a visitor counter and an under construction gif for any clients looking for that.
