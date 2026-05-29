---
title: "Step Ahead"
date: '2023-01-04'
slug: one-step
aliases:
  - /2023/01/04/one-step/
tags:
  - cwd
  - javascript
  - web-dev
---

I was a bit pleased with myself when I started the next content element in the Complete Web Developer course to find that one and a half of the extensions I'd made to the tutorial app for my own fun were specified as the next task.

In my previous post, I'd talked about using a class to denote if an item was completed, and using a style to indicate this by crossing it out. What I haven't discussed was that I'd captured right click events on the list items to make this delete them. I wasn't entirely happy with that for a couple of reasons:

1.  It wasn't obvious to the user how to delete if they wanted to, and perhaps worse, it might accidentally be invoked - never a good idea for a destructive action with no undo.
2.  It was accessibility un-friendly There was no way to tab through the available actions or to have them read out. This was also the case for crossing items off.

The new task was to add a delete button for each item, which is a much better idea. I decided to do both a "check off" and "delete" button to address the accessibility point above.

The HTML for them looks like:

```html
<ul id="ulItems">
    <li>
        Sample Item
        <button type="button" class="btnCheck">✔️</button>
        <button type="button" class="btnDelete">❌</button>
    </li>
</ul>
```

I might have been a bit too clever using emoji. I assume they are well supported but not really sure. I also could not change the check mark to green which I would have liked to. I wasn't sure how important the type="button" was, but [w3schools say](https://www.w3schools.com/TAGs/att_button_type.asp) to "Always" use it, so that's good enough for me.

Having two buttons complicated some of the handling code a bit. In the section where I attach the listeners to the buttons for any items that have been specified in the HTML (which could probably just be removed) it looks a bit hacky:

```js
var links = document.getElementsByTagName('li');
for (var i = 0; i < links.length; i++) {
    var link = links[i];
    link.onclick = onListItemClick;
    console.assert(link.childNodes.length === 3)
    link.childNodes.item(1).onclick = onBtnCheck
    link.childNodes.item(2).onclick = onBtnDelete
}
```

Using the indexes into the childNodes like this is quite fragile. For example, the indexes change if the buttons in the HTML are separated by a new line character, so something as simple as a linter in the build chain could break it. There's probably a way to get child nodes by tagname (_edit: there is - the well named getElementByTagName()_) but concerns about performance, along with laziness associated by knowing I'll probably remove this whole code block prevented me from using it.

I thought I'd reuse the function for clicking on an item for clicking on the check button, but of course the event contains a different caller. So they ended up like this:

```js
function onListItemClick(event) {
    if (event.target.tagName === "LI") {
        event.target.classList.toggle("completed") 
    }
}

function onBtnCheck(event) {
    event.target.parentNode.classList.toggle("completed") 
}
```

The test in onListItemClick() for the tagname is to stop this being triggered as a side effect of clicking with either of the buttons. Worth noting is that the tagname seems always to be in capitals even if it's lowercase in the HTML. Lowercase for tags seems to be the convention so that was surprising to me.

The code for adding the buttons for new items is pretty straightforward:

```js
function addNewItem() {
    if (txtItem.value.length > 0) {
        
        var btnCheck = document.createElement("button")
        btnCheck.innerText = "✔️"
        btnCheck.type="button"
        btnCheck.classList.add("btnCheck")
        btnCheck.onclick = onBtnCheck

        var btnDelete = document.createElement("button")
        btnDelete.innerText = "❌"
        btnDelete.type="button"
        btnDelete.classList.add("btnDelete")
        btnDelete.onclick = onBtnDelete

        var li = document.createElement("li");
        li.appendChild(document.createTextNode(txtItem.value));
        li.onclick = onListItemClick
        li.appendChild(btnCheck)
        li.appendChild(btnDelete)
        ulItems.appendChild(li);

        txtItem.value = ""
    }
}
```

In the code above I've used two different methods of inserting the text into an element. One by using the innerText property, and one by creating a TextNode and inserting it with the appendChild() method. In the CWD course, Andrei had commented "//Dangerous" next to innerText, but hasn't discussed it yet. There's a good discussion [here from Marian Čaikovski](https://marian-caikovski.medium.com/innerhtml-vs-appendchild-e74c763846df).

Another thing I've got two different versions of in this codebase is adding the event handlers for when things are clicked on. In some places I've got the succinct, clear onClick =, in others, addEventListener().

```js
txtItem.addEventListener("keydown", onKeyPress)
btnItem.addEventListener("click", addNewItem)

var links = document.getElementsByTagName('li');
for (var i = 0; i < links.length; i++) {
    var link = links[i];
    link.onclick = onListItemClick;
    console.assert(link.childNodes.length === 3)
    link.childNodes.item(1).onclick = onBtnCheck
    link.childNodes.item(2).onclick = onBtnDelete
}
```

It [sounds like](https://www.geeksforgeeks.org/difference-between-addeventlistener-and-onclick-in-javascript/) onClick is better supported, but really only a marginal difference. addEventListener can support more than one handler for any particular event, and covers more events.

[source](https://github.com/IanKulin/iankulin.github.io/tree/main/todo001) for this project, or [try it out here](https://iankulin.github.io/todo001/). I should also note that since I'm still working on this those might not exactly match the code above.
