---
title: "Adding Front Matter To mdserver"
date: '2023-11-24'
slug: adding-front-matter-to-mdserver
aliases:
  - /2023/11/24/adding-front-matter-to-mdserver/
tags:
  - front-matter
  - markdown
  - node
  - showdown
  - web-dev
  - webdev
---

![](/images/brobinhook_sketch_design_of_a_modern_landing_page_for_a_webdev__79beff03-b181-4195-90b9-ff9c41b9f138.jpg)

The very first issue I opened on [mdserver](/displaying-markdown-as-html/) - my server project that serves HTML from markdown files - was that the title of the page (which shows in the browser tab, and is used for browser bookmarks) needed to be set _inside_ the markdown file, rather than generated from the file name. I didn't invent this idea - I've seen this sort of metadata in the top of Jekyll and Hugo markdown. Here's an example from the [Jekyll website](https://jekyllrb.com/docs/front-matter/):

```
---
layout: post
title: Blogging Like a Hacker
---
```

You can't really see in this example, but the format is YAML. Although I might be interested in using it for other things (such as selecting a template) later, for now, all I need is a title. The process would be that the server would extract the title from the front matter, then inject that into the template HTML so the page had a proper title.

I'm using the [Showdown](https://showdownjs.com/) library to do the conversion from markdown. Here's a short demo of how that works:

```
const showdown = require('showdown');
const converter = new showdown.Converter();

const markdown = `
# heading
Some random Text
* list item
* another`

const rawHtml = converter.makeHtml(markdown);

console.log(rawHtml);
```

This would output:

```
<h1 id="heading">heading</h1>
<p>Some random Text</p>
<ul>
<li>list item</li>
<li>another</li>
</ul>
```

Showdown is an 827K dependency, so I figured it might already deal with front matter, or would at least have some sort of extension hooks so I could write something to scrape the title out. In fact it has both.

To enable front matter, you just have to set a flag in the converter, then there's a .getMetadata() method on the converter to get an object of all the metadata. Let's flesh out my demo code a bit to show this, I'll highlight the changes.

```
const showdown = require('showdown');
const converter = new showdown.Converter({metadata: true});

const markdown = `
---
title: Test Title
---
# heading
Some random Text
* list item
* another`

const rawHtml = converter.makeHtml(markdown);

//console.log(rawHtml);
console.log(converter.getMetadata().title);
```

This simply outputs `Test Title`.

If you're wondering if that YAML pollutes the HTML output at all, it does not. The HTML from this second example is exactly the same as the first example above without the YAML.
