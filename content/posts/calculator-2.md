---
title: "Calculator"
date: '2023-01-16'
slug: calculator-2
aliases:
  - /2023/01/16/calculator-2/
tags:
  - css
  - eval
  - html
  - js
  - web-dev
---

I've been doing a bit of driving during the holidays, which means a lot of podcast listening. An episode of [JavaScript Jabber about JS features you should never use](https://topenddevs.com/podcasts/javascript-jabber/episodes/splatty-doo-and-other-javascript-features-you-should-avoid-jsj-543) sparked my interest in `[eval()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)`. `eval()` takes whatever you pass it in a string and executes it in the JS engine. This is a crazy concept if you've come from complied languages, and has obvious security implications. As with dynamic typing, I'm trying to force myself out of my comfort zone to embrace JS's unique talents so I was keen to try `eval()`.

[![](/images/screen-shot-2023-01-08-at-7.51.10-am.png)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)
*lol - challenged accepted.*

My first idea for using `eval()`was to write a calculator. Pressing the buttons would make build a string, this could just be passed off to `eval()` and the return value displayed. It's such an obvious idea I'm sure I'm not the first to have it.

To ensure I'm growing my CSS skills, I also decided to steal the design of the iPhone calculator. That's the first one below. The second is my current web app version.

<img src="/images/img_3911.png" width="577" alt="">

<img src="/images/img_02a92dbcfb55-1.jpeg" width="577" alt="">

Since the calculator display is used for two asynchronous purposes - showing the calculation string as it's being built, and showing a calculation result when we press equals, I've kept a state variable `inputState` which is true when we're building the string, and false when we're displaying a result. `btnAddClick()` is attached to all the buttons used to build the string - `0123456789()-+/*`

```js
let inputText = '';
let inputState = true;

function btnAddClick(event) {
    if (!inputState) {
        inputState = true;
        inputText = "";
    }
    inputText = inputText + event.target.innerHTML;
    txtOutput.innerHTML = inputText;
}
```

The backspace key just slices off the last character in the input string.

```js
function btnBackspaceClick() {
    if (inputState && inputText.length > 0) {
        inputText = inputText.slice(0, -1);
        txtOutput.innerHTML = inputText;
    }
}
```

Clear just empties the string and updates the display, then equals calls the dreaded `eval()` and shows the output. To make it a bit fancy, I show the input for the calculation just above the result.

```js
function btnEqualsClick() {
    inputState = false;
    let output = eval(inputText);
    txtPrevious.innerHTML = inputText+"=";
    txtOutput.innerHTML = output;
}
```

That's pretty much the entire code. Of course it doesn't quite work like a conventional calculator, but I also didn't have to learn anything about [Reverse Polish Notation](https://en.wikipedia.org/wiki/Calculator_input_methods).

The big challenge - and you can see from the screenshots above, still ongoing - is the getting the CSS to work in a way that it looks correct on different devices. My iPhone is an SE, and I had it looking good on that, then sent it to a friend with a newer iPhone and the URL area would not hide. I'll keep working at it, it has forced me to get a better understanding of grid.

I'm loving a browser developer tools to help with this. Both browsers have a "responsive mode" that allows you to resize the view to simulate phone like sizes without fiddling with your browser size all the time, and to still be able to see the tools. Dock your tools to the side, and look for the little phone/tablet button to get into responsive mode.

![](/images/screen-shot-2023-01-08-at-8.31.49-am.jpg)

One other thing I learned is that in Safari on iOS double clicking on a web page zooms it in a little. That's a great feature I guess, but a pain if you just want to enter a number like 99 on a web calculator. The solution turned out to be setting the CSS property `[touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action)` on the buttons to `manipulation`.

[source](https://github.com/IanKulin/Calc) or [try out the current version](https://iankulin.github.io/calc/)
