---
title: "HTML 002 - Tags for structure"
date: '2022-12-21'
slug: html-002-tags-for-structure
aliases:
  - /2022/12/21/html-002-tags-for-structure/
tags:
  - posts
---

![Young woman at a computer writing html, Impressionistic - Stable Diffusion](/images/young-woman-at-a-computer-writing-html-impressionistic.jpg)

I briefly mentioned [earlier](/html-001/) that our HTML tags should flag WHAT this part of the document is rather than how to display it (we'll look at how to use CSS for making the content look how we want later). This idea is called semantic HTML. This post will look at some of the tags (often called [semantic tags](https://www.w3schools.com/html/html5_semantic_elements.asp)) we use to convey knowledge of what part of each document an element is.

#### Why do I care?

It's fair to ask "why bother?" If you know how you want your page to _look_, why not just put that in the html and be done with it? There's a couple of good answers to this:

Maintainability - when we separate how the pages should look from what's in them, that can be reused. If we have a single .css file that says which font paragraphs use, and what colour headings should be, it can be used across the site so all the pages look the same, and if the graphics designer changes their mind about the font it can be changed in a single line in one file instead of having to edit every .html file for the site.

Accessibility - not every human user will be using a conventional web-browser to consume the pages, and even if they are, they might be using accessibility features to suit their abilities. I already mentioned the obvious issues for screen readers that describe things in audio, but imagine if you do not use a mouse, how helpful it might be to be able to skip from section to section in a document using a keyboard shortcut - that's made more possible by dividing our content into sections.

Skynet - Your web pages are not only consumed by humans. Search engine web crawlers and, increasingly, AI models hungry for knowledge will also use them as input. If the different parts of your pages are marked up semantically it will improve your search engine optimisation and further the rise of our robot overlords. For example, a top-level heading <h1> can be assumed by the machine to be a good indication of the content of the page. The text between the <summary> tags could be assumed to be good to show as a snippet in some search results.

#### Headings

We've already met the `<h1>` tag which is intended to be the top level heading - there will probably only be one of these in your document and it will signify the content for the entire page. There's a decreasingly important range of sub-headings from `<h2>` down to `<h6>`. The headings will be rendered differently to indicate their importance but, thinking semantically, The different levels should indicate the role of the document parts following them.

#### Body Parts

A number of semantic tags indicate different types of content, and many are self explanatory:

-   <footer></footer>
-   <header></header>
-   <nav></nav> - collection of navigation links
-   <main></main>
-   <summary></summary>
-   <p></p> - paragraph
-   <aside></aside> - text that relates to, but is not essential to understanding the main text.
-   <main></main>
-   <figure></figure> - illustrates a point in the text. Often it will contain an <img> and a <figcaption>
-   <detail></detail> - often contains some deeper explanation which can be hidden if not needed

A couple of others are a bit vaguer, but still have semantic meaning.

-   <section></section> - the exact meaning of a section will depend on the type of content. Maybe it's a chapter of a book, maybe a group of related auto-parts.
-   <article></article> - could be a self-contained blog post, or you know, and article in a news page.

#### What's not semantic

There's a couple of tags you'll see widely used for recent historical reasons, as well as web-dev inertia. They are containers that can be used to attach CSS styles to, but don't convey any semantic meaning to the browser or future code maintainers.

-   <div></div> - short for division. Used around blocks of text, usually with a class attribute so some style can be applied to it.
-   <span></span> - similar usage as <div> but used for smaller, inline parts of texts.
