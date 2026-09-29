---
title: "A Beginner's Introduction to jQuery"
date: '2026-09-29'
slug: beginners-introduction-to-jquery
summary: "An introduction to the Document Object Model and basic page manipulation with JavaScript, worked through with a click-counter button example. We rewrite the same example using jQuery, covering its selector syntax, event handling, chaining, and how it differs from plain DOM methods."
tags:
  - javascript
  - jquery
  - webdev
---
## The Document Object Model

A web browser displaying a web page has, in its memory, a 'Document Object Model' (the DOM). This is the structure containing all of the structural information of the page - the title, the headings, the links, the paragraphs, the buttons - all the objects representing the document's structure and content.

```
Document
│
└── <html lang="en">
    │
    ├── <head>
    │   │
    │   ├── <meta charset="UTF-8">
    │   │
    │   ├── <title>
    │   │   └── "My Website"
    │   │
    │   └── <link rel="stylesheet" href="style.css">
    │
    └── <body>
        │
        ├── <button id="counter">
        │   └── "You clicked 0 times"
        │
        └── <script>
            └── [JavaScript code]
```

The browser uses this to display the page, but also, we can manipulate it with Javascript. For example, if we want to change the title of the page above, it could look like this:

```js
  document.title = "My New Page Title";
```

`title` is sort of a special case where we are given a convenient shortcut, usually if we want to select an element we'd probably select it from the DOM for it with:
```js
  document.querySelector("title").textContent = "My New Page Title";
```
This style works for any element, for example:
```js
  document.querySelector("button").textContent = "Press me";
```

Perhaps button is a bit general, for example it's not clear which button will have it's text changed if we have several buttons. The button above (helpfully) has an `id`, so we can use that:
```js
  document.getElementById('counter').textContent = "Press me";
```

The element returned by a query selector is an object, so usually we'd save it to a variable to avoid repeating the select and to make the code readable.
```js
  const button = document.getElementById('counter');
  button.textContent = "Press me";
```

There's many methods on `document` in addition to `querySelector()` and `getElementById()`. One of the common things we want to do is to capture events so we can execute code based on the user interaction with our elements. Usually for a button, we'd like to do something when the user clicks it:
```js
    const button = document.getElementById('counter');

    button.addEventListener('click', () => {
      console.log('clicked');
    });
``` 

## A vanilla JavaScript example

That's enough background for you to understand this:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Clicked x times</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <button id="counter">You clicked 0 times</button>

  <script>
    let count = 0;

    const button = document.getElementById('counter');

    button.addEventListener('click', () => {
      count++;
      button.textContent = `You clicked ${count} times`;
    });
  </script>
</body>
</html>
```git

We have a simple web page containing a single button. We're selecting that with `getElementById('counter')` which works because we have it that ID in the HTML `<button id="counter">`. When the user clicks on the button, our click code runs incrementing the counter and updating the text on the button.

If you open this [page in a web browser](https://iankulin.github.io/clicked-x-times/pure-js/), you can click on the button, and the button text changes to reflect how many clicks there has been.

## jQuery

If you are writing a page with more complicated behaviour than this, perhaps it gets tiresome (and the code gets large) selecting the elements over and over. You might start to think "perhaps I'll write a library to allow this with a simpler looking syntax". Well no need - there's an old (but still maintained) library for exactly this that allows you to find elements, change their attributes or attach events. The selection system leans a bit on your CSS knowledge. Here's the [jQuery version of the page](https://iankulin.github.io/clicked-x-times/jquery/) above.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Clicked x times</title>
  <link rel="stylesheet" href="style.css">

  <!-- jQuery -->
  <script src="https://code.jquery.com/jquery-4.0.0.min.js"></script>
</head>
<body>
  <button id="counter">You clicked 0 times</button>

  <script>
    let count = 0;

    $('#counter').on('click', function() {
      count++;
      $(this).text(`You clicked ${count} times`);
    });
  </script>
</body>
</html>
```

We're importing the jQuery library with `<script src="https://code.jquery.com/jquery-4.0.0.min.js"></script>`, then those `$` are doing the jQuery magic. The `$` is a call to jQuery's `$()` function, which returns a jQuery object/collection representing the matched elements.

When I said that your CSS knowledge is used, if we wanted to select the button with it's element type instead of the `id` we'd do `$('button')` instead of `$('#counter')`. And you can probably guess that if we had a class of 'clickable' set for the button, we could select it with `$('.clickable')`.

One notable difference between the pure javascript `const button = document.getElementById('counter');` and jQuery `const button = $('#counter');` is that if there is more than one button with the id 'counter' (there shouldn't be), the javascript version returns the first one, whereas the jQuery version returns all of the buttons with that id.

You might be wondering what the `this` is in:
```js
    let count = 0;

    $('#counter').on('click', function() {
      count++;
      $(this).text(`You clicked ${count} times`);
    });
```
It's the same button; inside the event handler `this` refers to the element that was clicked. It saves us from having to do something like this:
```js
    let count = 0;
    const button = $('#counter')

    button.on('click', function() {
      count++;
      button.text(`You clicked ${count} times`);
    });
```

Another nice thing jQuery does is chaining: The jQuery methods that perform actions usually return a jQuery object - so we can chain them together. For instance, this is valid:
```js
$('#counter').text('Press me').addClass('important');
```
As well as setting the text on our button, we're adding a class to it without re-selecting the element or storing it.

## Do you need it?

This 4.0.0 version of the [jQuery](https://jquery.com) library is 27K, so obviously it's doing a lot more than this. In the old days one of its jobs was to sort out the differences in behaviour of the various browsers - that's less of an issue these days. 

jQuery isn't something I'd reach for on a new project, but before the rise of React and the other Javascript frameworks it was incredibly popular - I've seen estimates that's it' still in 70% of websites, so you're bound to come across it at some stage.
