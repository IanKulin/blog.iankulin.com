---
title: "Displaying markdown as HTML"
date: '2023-11-08'
slug: displaying-markdown-as-html
aliases:
  - /2023/11/08/displaying-markdown-as-html/
tags:
  - express
  - javascript
  - node-js
  - possibly-useful
  - posts
  - showdown
  - templates
  - web-dev
---

In the spirit of over-complicating things, when I wanted to collect all the links to the services on my homelab into one place, I decided I needed to write them in markdown, and have them converted on the fly into HTML by a server. Then when I couldn't find exactly what I was after ([Harp](http://harpjs.com/) was closest) of course, I decided to write it.

<img src="/images/distracted.jpg" width="1000" alt="">

### Markdown

[Markdown](https://en.wikipedia.org/wiki/Markdown) has definitely been having it's moment over the last couple of years. It's a simple open format mark-up language that is quite readable in it's source form. Although it's now very fashionable as an input for static site generators, most people will have run in to it when adding simple formatting to forum comments or on instant messaging platforms.

It supports text formatting such as bold, italic and underlining as well as links, and in some extended versions, tables and so on.

### Middleware

My plan for tackling this is to have a simple Node.js/Express web server that's serving static files from a public sub-directory. As it receives requests for each file, it checks if it's a markdown file (which normally if served directly to a browser would trigger it to be downloaded instead of displayed). If it is markdown, it's translated into HTML and passed to the browser.

This is easily accomplished in a simple Express server which has the concept of '[middleware](https://expressjs.com/en/guide/using-middleware.html)'. This are just layers of processing that each request goes through. If a layer can deal with a request it does, otherwise it passes it off to the next layer. You'll often see this type of pattern (usually with more layers) in an Express app, where each of the `app.use` declarations is another middleware layer:

```js
const app = express();
app.use(mdParser);
app.use(express.static(publicDirectory));
```

In this case, `mdParser` is my middleware function that checks if a file is markdown, then if it is returns a HTML version of the file to the browser, or if not, just lets the request go through to the next layer. A simple version might look like this:

```javascript
const express = require("express");
const fs = require('fs');
const path = require('path');
const showdown = require('showdown');
const converter = new showdown.Converter();

const publicDirectory = 'public';
const staticRoot = path.join(__dirname, publicDirectory);

// middleware for processing markdown files
function mdParser(req, res, next) {
  if (req.url.endsWith('.md')) {
    const mdFilePath = path.join(staticRoot, req.url);

    fs.readFile(mdFilePath, 'utf8', (err, data) => {
      if (err) {
        res.status(404).send('File not found');
      } else {
        const htmlContent = converter.makeHtml(data);
        res.send(htmlContent);
      }
    })
  } else {
    next();
  }
};
```

The actual heavy lifting of converting the markdown into HTML is done in line 20 with a library called [ShowDown](https://showdownjs.com/). There are a few of these floating around, I tried [Marked](https://marked.js.org/) first, but it didn't immediately work how I expected without reading any documentation, so I moved on ¯\\\_(ツ)\_/¯

### Templating

This simple version works - the markdown is correctly displayed in the browser, but there's a couple of things going on that are not great.

The first is that it's not actually well formed HTML. If we load a markdown file containing this:

```markdown
# Test.md

* A sample mark down file
```

It looks like this:

<a href="/images/screen-shot-2023-10-22-at-7.42.46-am.png"><img src="/images/screen-shot-2023-10-22-at-7.42.46-am.png" width="900" alt=""></a>

But if we view the page source, it's this:

```html
<h1 id="testmd">Test.md</h1>
<ul>
<li>A sample mark down file</li>
</ul>
```

No `DOCTYPE, <html>, <head>` etc. Since forever, browsers have been expected to deal gracefully with malformed HTML, and they generally do, but as someone who still feels bound by the ethics printed on my 1991 [ACS membership certificate](https://www.acs.org.au/content/dam/acs/rules-and-regulations/Code-of-Ethics.pdf), I can't accept this low standard.

There's a second related problem I don't like, that's that the title of this page (displayed in the browser tab, and used if we bookmark the page) is "http://127.0.0.1:3000" instead of what I would like it to be - probably "Test". This is not Showdown's fault, it doesn't really have any way of guessing what we'd like for the title.

As usual, these are a class of problem that's long been solved, in this case with templates. Essentially what I need to do is take the generated (but not correctly formed) HTML output from Showdown, and insert it in the middle of some boilerplate HTML. Perhaps the template could look like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{title}}</title>
</head>
<body>
    <main>
        {{content}}
    </main>
</body>
</html>

```

I'd put the title I wanted for the page in `{{title}}` and the converted markdown into `{{content}}`. These double curly braces are a reasonably common convention for templating.

If I load the template file (which can include all sorts of lovely CSS and JS) into `templateData` at start up, I can just use a string replace when I need to serve the file at request time:

```js
if (useTemplate) {
    // Replace placeholders with title and content 
    const title = path.basename(mdFilePath);
    const templatedHtml = templateData.replace('{{title}}',
                             title).replace('{{content}}',
                             htmlContent);
    res.send(templatedHtml);
} else {
    res.send(htmlContent);
}
```

I'm just using the file name for the title here, I'll think about [how to improve that](https://github.com/IanKulin/mdserver/issues/1) in a later installment.

Now the output looks like:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>test.md</title>
</head>
<body>
    <main>
        <h1 id="testmd">Test.md</h1>
<ul>
<li>A sample mark down file</li>
</ul>
    </main>
</body>
</html>
```

Which, while [not well indented](https://github.com/IanKulin/mdserver/issues/2), at least meets the HTML specification.

### Done

I really enjoyed making this - it's one of those compact sized projects you can start and finish on a Saturday between house jobs, and although small, it does address a genuine use case - if I'd found this when I was searching for something I would have used it as is.

The [code's up on github](https://github.com/IanKulin/mdserver/blob/e9a09c4381e9bda373b86701f90cf165ea0d0e7e/server.js) if you want a look. To make it a finished product it probably needs some hardening. Also, since I need to learn how to build Docker containers, this would be a good project for that, so stand by for a future installment.
