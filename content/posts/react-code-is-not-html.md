---
title: "React code is not HTML"
date: '2023-01-22'
slug: react-code-is-not-html
aliases:
  - /2023/01/22/react-code-is-not-html/
tags:
  - html
  - js
  - react
  - web-dev
---

![The React atom logo fighting with some HTML  - midjourney, edited](/images/pucker_the_react_atom_logo_fighting_with_some_html_4b0d18eb-b17f-471f-a42c-a99e160b1231-copy.png)

I was looking at this ugly code in a React app:

```
<div style={{overflow: 'scroll', border: '1px solid black', height: '600px' }}>
  { props.children }
</div>
```

Since I don't need any of those CSS properties to change at any stage, I could just convert it to pure HTML/CSS right? Well no:

![](/images/screen-shot-2023-01-09-at-4.26.54-pm.png)

The newbie trap I've fallen for here is that although that `<div style= tag` looks like HTML, it's actually not. It's not a template that will be filled out in the build step, it's React code that will be used to mutate the virtual DOM.

It's not clear to me why React even bothers with this faux-HTML. If it just committed to having developers work with some sort of set of React DOM objects in JS, it would eliminate a couple of layers of complexity - although at the cost of having to learn a new thing. Once you've committed to transpilation, you might as well go the whole way!

It does make me wonder what React Native does about building a screen from elements, maybe they already have half of what they need to take that step with React. There seems to be about 500 JavaScript frameworks, so it's entirely possible someone has already done what I'm thinking about with out any of React's unarguable success.

The caveat on these thoughts is the same as always, I'm at the very start of my journey, and often the reasons for things are revealed as I go!

Edit: About five hours after writing the post above, I watched the video below. Turn out this disfigured HTML-eese was a _selling_ point of React at the time. And it seems like my idea of just having a better language to manipulate the DOM might have been tried and abandoned. 🤦‍♀️

{{< youtube Wm_xI7KntDs >}}
