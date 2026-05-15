---
title: "HTML 001"
date: '2022-12-16'
slug: html-001
aliases:
  - /2022/12/16/html-001/
tags:
  - html
  - possibly-useful
  - web-dev
---

A HTML file is a text file that can be displayed in a web browser. It is _marked up_ in the sense that _tags_ are applied to the text to signify the purpose of that text in the structure of the document. For example:

```
<h1>Greetings</h1>
Hello Earthlings
```

The `<h1>` tag tells the browser that `Greetings` is a heading. The heading tag is _paired_. There's an opening tag `<h1>` and closing tag `</h1>` that let the browser know where the heading starts and ends. Most tags are paired, but there are some _unpaired_ tags such as <br> which inserts a line break.

If you want to go and try this out, [go here,](https://www.w3schools.com/html/tryit.asp?filename=tryhtml_intro) and paste in the code above.

HTML has a long complicated history we don't care about. But in general, the tags in HTML are semantic - they are trying to describe _what_ this part of the document _is_, rather than _how_ to _display_ it. For example, the `<h1>` heading above is usually displayed as large bold type on it's own line. So it's easy to think that's what it does, but if a user is consuming this HTML document as audio the `<h1>` might be someone saying "Heading, Greetings". The way it is expressed is different, but the meaning - that it's a heading - is still there.

#### Tags

There are just about [100 different tags](https://www.w3schools.com/TAGS/default.asp). I'm not going to go through them all, and you'll probably only end up using 20 or so regularly. But there's a few that need some explanation right at the start.

-   <html></html> - all of the document should appear between these two tags. We're saying this is HTML - hyper text markup language.
-   <head></head> - contains some information about the document (ie metadata), for example, the <title></title> which is usually shown in the browser tab.
-   <body></body> - every good HTML file should have one - the document goes in here.

#### Nesting

Tags can be nested inside other tags. So using the tags you've already met, we might build a simple web page like this:

```
<html>
<head>
    <title>Greetings</title>
</head>
<body>
    <h1>Greetings</h1>
    Hello Earthling
</body>
</html>
```

Later on, things will get much more nested. The line breaks and indents used here are entirely for clarity. The browser does not need them. It would be just as legal to write this exact same document as:

```
<html><head><title>Greetings</title></head><body><h1> Greetings</h1>Hello 
Earthling</body></html>
```

But, you know... don't do that.

#### Image tag

[`<img>`](https://www.w3schools.com/TAGS/tag_img.asp) - It you want to have an image in your web-page, you use the `<img>` tag and include a link to the image. The image could be sitting in the same directory as your html file, or anywhere else on the internet. If our image is here, and called example.png, the image tag would look like this:

```
<img src="example.png">
```

Let's add it to our Greetings page:

```
<html>
<head>
    <title>Greetings</title>
</head>
<body>
    <h1>Greetings</h1>
    Hello Earthling
    <img src="example.png">
</body>
</html>
```

You can see `<img>` is one of those unpaired tags - there's no closing tag. If the image was somewhere else on the internet, you just use the full URL as the source:

```
<html>
<head>
    <title>Greetings</title>
</head>
<body>
    <h1>Greetings</h1>
    Hello Earthling
    <img src="https://photojournal.jpl.nasa.gov/browse/PIA00114.gif"/>
</body>
</html>

```

Our web page now looks like this:

![](/images/screen-shot-2022-12-14-at-8.51.41-pm.jpg)
