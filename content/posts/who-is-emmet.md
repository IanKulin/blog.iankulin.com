---
title: "Who is Emmet?"
date: '2022-12-14'
slug: who-is-emmet
aliases:
  - /2022/12/14/who-is-emmet/
tags:
  - editor
  - html
  - tools
  - vs-code
  - web-dev
---

[![](/images/css-hacks.jpg)](https://www.piqsels.com/en/public-domain-photo-ircsa)

I knew there was some magical way of entering all the the <HTML> boilerplate in Visual Studio Code as I'd seen it happen in several videos, and assumed is was some sort of macro expansion thing in the editor. Fast forward a few blog post readings and youtube viewings and I keep seeing tangential references to someone called Emmet. Turns out they're the same thing, and it's pretty cool.

It's not a new idea to have functionality in code editors to insert snippets of code. [Emmet](https://docs.emmet.io/) goes a bit further than that - and like many tools made by programmers for programmers it goes way to technical to the point where you need to memorise ridiculous amounts of combos to to some awesome stuff (I'm looking at you whoever made it possible to use vi commands in VS Code). Nevertheless, Emmet is extremely handy even at my n00b level.

The key thing to know, is that it borrows from the CSS selector syntax. So if you want to insert `<div></div>` you enter `div` and press tab.

Want a div with a class named "container"?

`div.container` becomes `<div class="container"></div>`.

The same trick works for an id - Enter

`div#emmet` becomes `<div id="emmet"></div>`

Would you like a div, with a heading inside? The greater than sign nests elements, so `div>h4` becomes:

```
<div>
  <h4></h4>
<div>
```

If you'd like some text up in there, try div>h4{Hello world}

```
<div>
 <h4>Hello world</h4>
</div>
```

You can repeat things numbers of times, so to create a list with three items, try `ul>li*3` to get:

```
<ul>
 <li></li>
 <li></li>
 <li></li>
</ul>
```

That's about as complex as I'd want to get, though of course it gets more complex. It's a super handy feature that quickly becomes second nature.
