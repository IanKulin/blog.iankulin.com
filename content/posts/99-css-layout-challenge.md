---
title: "99 CSS Layout challenge"
date: '2022-12-23'
slug: 99-css-layout-challenge
aliases:
  - /2022/12/23/99-css-layout-challenge/
tags:
  - css
  - posts
  - web-dev
---

In the [Zero To Mastery](https://zerotomastery.io/) [Complete Web Developer](https://www.udemy.com/course/the-complete-web-developer-zero-to-mastery/) course, I'm up to the first practical challenge - to use CSS to layout a reasonably standard looking web page using flex-box and grid to make it responsive.

Frustratingly, both for writing this, and while I was trying to build the page, I'm unable to screenshot the example of the page I was supposed to be building, and instead had to keep opening the video and seeking the two second flash of the completed project, and eventually being reduced to photographing my laptop screen like a boomer relative sending me a meme:

![](/images/img_3601.jpg)

What you can't see in that image (because it was never shown for this version) is a foooter bar containing a piece of centred text.

The starting point was some html with a a handful of elements, and some unnecessarily complicated css colours.

![](/images/screen-shot-2022-12-20-at-8.06.13-am-1.png)

```
<!DOCTYPE html>
<html>
<head>
  <title>Layout Master</title>
  <link rel="stylesheet" type="text/css" href="./style.css">
</head>
<body>
  <div class="zone green">Header</div>
  <div class="zone red">Cover</div>
  <div class="zone blue">Project Grid</div>
  <div class="zone yellow">Footer</div>
</body>
</html>
```

The hint that was given, was to use a mix of flex-box and grid. Since it was stated in the same breath that everything you can do in flex, you can do in grid, I decided to just do grid. I'm not anticipating having to maintain anyone's flex code, so I felt I could reduce the amount I need to learn by eliminating flex-box.

I changed up the HTML a bit to make it more semantic, but still ended up with a couple of divs for the cover and projects.

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="style.css" rel="stylesheet">
    <title>Document</title>
</head>

<body>
     <header>
      <ul>
      <li><a href="about.html">About</a></li>
      <li><a href="products.html">Products</a></li>
      <li><a href="ourteam.html">Our Team</a></li>
      <li><a href="contact.html">Contact</a></li>
      </ul>
     </header>

     <main>
         <div class="cover">
            <img src="img/undraw.png">
         </div>

         <div class="projects">
            <img src="img/monitor_coding_2.png">
            <img src="img/desktop_analytics_2.png">
            <img src="img/files_2.png">
            <img src="img/data_storage_2_2.png">
            <img src="img/monitor_settings_2.png">
            <img src="img/server_2_2.png">
            <img src="img/server_3.png">
            <img src="img/server_safe_2.png">
         </div>

     </main>
     <footer>
        Made by IanKulin
     </footer>
</body>
</html>
```

I'll work through the CSS piece by piece. The general stuff was importing the font, the reset and setting the body defaults.

```
@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    color: white;
    font-family: 'Roboto', sans-serif;
}
```

The header/nav bar was actually the toughest job here - it needs four links; three left aligned and one right aligned. I have no doubt that this is not the most elegant solution.

```
header {
    background: #33BCFF;
    height: 3rem;
    display: grid;
    align-content: center;
}
```

This grid and align was just to get the text vertically centered.

```
header ul {
    display: grid;
    grid-template-columns: repeat(3, fit-content(150px)) 1fr;
    grid-gap: 10px;
    justify-items: end;
    padding: 20px;
}
```

The links are in an unordered list, so that's made to be a grid with three columns closely fitted to the text size, and one more column that takes up the rest of the screen width. There's a 10 pixel gap between the columns and the content in the grid is aligned to the end. That makes no difference for the first three links since they are the size of their containers, but the right end one is pushed to the edge of the screen minus the padding.

```
header li {
    list-style-type: none;
}

header a:link, header a:visited {
    color: white;
    text-decoration: none; 
}

header a:hover {
    color: black;
}
```

Even though it's convenient to have the links in a list, we don't want the bullet points, so `list-style-type: none;` eliminates them. The `text-decoration: none;` gets rid of the underline, then we add in a hover style so the user gets some feedback that this is, in fact, clickable.

```
.cover {
    height: 300px;
    display: grid;
    place-items: center;
}

.cover img {
    height: 280px;
}
```

The cover image was a bit more straightforward. I used a grid to centre it in both axes, and made the image a bit smaller than the div.

```
.projects {
     /* the grid container */
    background-color: #33BCFF;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    place-items: center;
}

.projects img {
    /* the grid items */
    height: 200px;
    width: 200px;
    margin: 1rem;
    background-color: #333;
    padding: 2rem;
}
```

The computer icons are displayed in another grid. This time the columns are auto-fill based on the browser width, but with a minimum width of the icons.

Finally, the footer is yet another grid, just to center the text on both axes.

```
footer {
    background-color: #F1948A;
    height: 3rem;
    display: grid;
    place-items: center;
}
```

[source](https://gist.github.com/IanKulin/7a30de3a7b4266850a9c16258604198b)

{{< youtube eSpsqGfL9hM >}}
