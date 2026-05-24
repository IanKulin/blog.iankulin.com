---
title: "Document Object Model - ToDo"
date: '2023-01-02'
slug: document-object-model-todo
aliases:
  - /2023/01/02/document-object-model-todo/
tags:
  - dom
  - web
  - web-dev
---

I'm up to Section 12 of the Complete Web Developer course "DOM Manipulation" and it feels like we're finally at the stage of pulling everything (HTML, CSS & JavaScript) together to make minimal web apps. Since the course is light on building challenges, I've set myself one - to make a simple todo list (the classic step up from "hello world").

The Document Object Model is an entity representing the HTML with attached CSS for a page. The magic is that we can access this in JavaScript, and therefore change it, including hooking into events on it - such as a user pressing a button.

For our ToDo app, we'll need to allow the user to add an item by typing in some text and pressing a button to add it. There will be a list those items that grows as the user adds to it. As the user completes items, they click on them to signify they have been done - and the items are crossed out.

So for HTML, we need a text input, a button, and a list:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ToDo</title>
</head>
<body>
    <h1>Todo List</h1>
    <header>
        <input type="text" id="txtItem"> 
         <button type="button" id="btnAddItem">Add Item</button> 
    </header>
    <main>
        <ul id="ulItems">
            <li>Sample Item</li>
        </ul>
    </main>
     <script src="script.js"></script> 
</body>
</html>
```

I'm not really seeing any consistent naming conventions for element ids in the code snippets I've seen around the web. Since everything is hard coded strings this seems like inviting disaster. I've adopted a VB/Delphi convention of abbreviating the type at the start of the name and camelcasing. So the button to add an item becomes "btnAddItem". I wish (and perhaps there is) there was a VS Code extension to make the links between my HTML and JavaScript more obvious to reduce those potential errors.

#### Adding an item

The first problem, of catching the user input (pressing enter in the text, or clicking the button) was mostly solved for me by the CWD tutorial. It involves adding event listeners to both those elements.

```
var txtItem = document.getElementById("txtItem")
var btnItem = document.getElementById("btnAddItem")

txtItem.addEventListener("keydown", respondToKeyPress)
btnItem.addEventListener("click", addNewItem)
```

`document` in those first two lines is the Document Object Model (DOM) object. It has a method for finding HTML elements by the ids we assigned them in the HTML. These ids should be unique in the file, but the browsers don't enforce this. If you've used duplicate ids, getElementById() will probably return the first one it found.

Since we're using hard coded strings, an anticipatable error would be misspelling the id either in the HTML or JavaScript. If that happens, getElementByID will return null. I would have thought we should be testing for this, or at least asserting it, but I don't see either happening in the code I've seen. There is a console.assert(), but of course it's not removed for production builds by a compiler.

![](/images/screen-shot-2022-12-26-at-8.59.27-am.jpg)

`[addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)` does what it says on the box. You need to tell it which event (another string) and pass it the name of the handler function. It's not specified here, but the handlers can have access to an [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event) object which turns out to be handy. Here's the two handlers referenced in the code above:

```
function respondToKeyPress(event) {
    if (event.code === "Enter") {
        addNewItem()  
    }
}

function addNewItem() {
    if (txtItem.value.length > 0) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(txtItem.value));
        ulItems.appendChild(li);
        li.onclick = listItemClick
        txtItem.value = ""
    }
}
```

The first one just uses the Event object to check the user has pressed enter to add an item, and if so, calls the other handler to add the item. If the "Add Item" button is pressed, only the addNewItem() handler is called.

After checking that there's actually some text to add, it creates a new <li> item, appends the text to it, then appends the new item to our unordered list. The next line: `li.onclick = listItemClick` adds an eventListener for "click" to this list new item. We'll use this same handler later to detect clicks on any of the todo items in the list. This same event handler was also attached to any preexisting <li> elements at page load with:

```
var links = document.getElementsByTagName('li');
for (var i = 0; i < links.length; i++) {
    var link = links[i];
    link.onclick = listItemClick;
}
```

The very last thing that addNewItem() does is to clear the text input ready for the next item.

#### Crossing things off the list

The most satisfying thing to do with a list is to cross things off it. The UX here will be that the user clicks on an item, and it gets crossed off but stay's visible. We probably need to be able to reverse that process to. If the user accidentally crosses it off, they should be able to clock on it again to make it appear un-crossed.

First up, we need to capture the click event. We've already seen how to do that in the code snippets above. When the page is first loaded, a loop adds the listItemClick functionto the .onClick event of every <li> item, and the same function is added to each new <li> item that's created in addNewItem().

Since this single handler (addNewItem())is handling the clicks for every list item, but we need to cross them off individually, we need some way of accessing the current clicked <li> inside the handler so we can decorate it accordingly.

We saw above that the handlers can access the Event that is instigating them. Event contains a property "target" that is the element that triggered the event, so we can just use that. Here's my first attempt at the listItemClick() handler.

```
function listItemClick(event) {
    if (event.target.style.textDecoration === "line-through") {
        event.target.style.textDecoration = ""  
    } else {
        event.target.style.textDecoration = "line-through"
    }
}
```

Setting [.textDecoration](https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration) to "line-through" has the same effect as setting it in CSS - a line is drawn through the text ~like this~. This code works fine - if we click on it, the todo item has the line drawn through it, then if we click it again, the line disappears.

There's a couple of potential problems though. The first is we are mixing up the behaviour (which is rightly a JavaScript concern) with how things look (which should be a CSS concern). For example, perhaps the UI team want completed items to be faded rather than crossed out.

The second problem is related to that. We're testing if `event.target.style.textDecoration === "line-through"` when really what we are interested in is if this item is completed. There are a number of textDecorations, for example it's possible the textDecoration could be "line-through underline red" because of a CSS entry.

The solution to both these issues would be to use a class to indicate the completed/uncompleted status of each list item, and let the UI team set how these should be displayed in the CSS. If we use the class name `completed`, we could use some simple CSS like this to make a fat red line:

```
.completed {
    text-decoration-line: line-through;
    text-decoration-color: red;
    text-decoration-thickness: 3px;
}
```

And we could convert out listItemClick code to change the class with:

```
function listItemClick(event) {
    if (event.target.classList.contains("completed")) {
        event.target.classList.remove("completed") 
    }
    else {
        event.target.classList.add("completed")    
    }
}
```

That works nicely. We've separated our concerns, and .completed items are clearly and satisfyingly crossed out.

<a href="/images/screen-shot-2022-12-26-at-2.30.59-pm.png"><img src="/images/screen-shot-2022-12-26-at-2.30.59-pm.png" width="543" alt=""></a>

In fact, even this can be slightly improved on. There is a .toggle() method for turning a class off and on for an element, so we can eliminate some code by using that. As well as being simpler, we've removed the possibility of a classname typo the three times we use it. So:

```
function listItemClick(event) {
    event.target.classList.toggle("completed") 
}
```

Since our handler is down to a single line of code now, you might consider eliminating it by just passing the contents to the .onclick rather than a call to this function, however we do that in two places (the initial set up and again when each <li> is added) plus it would reduce our readability, so I'll leave it like this.

[source](https://github.com/IanKulin/iankulin.github.io/tree/main/todo001) or [try it out](https://iankulin.github.io/todo001/)
