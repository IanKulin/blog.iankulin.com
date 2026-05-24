---
title: "Openlayers &amp; Vite"
date: '2023-01-26'
slug: openlayers-vite
aliases:
  - /2023/01/26/openlayers-vite/
tags:
  - github-pages
  - openlayers
  - vite
  - web-dev
---

In Randy Pausch's [last lecture](https://www.youtube.com/watch?v=ji5_MqicxSo) he talks about the benefit of brick walls in our lives - they tell us how much we really want something. Software development is full of these brick walls - things we want to do, but there's a barrier to achieving it. Will we persevere and accomplish the thing, give up, or some other compromise.

In heroic tales, the protagonist overcomes all obstacles to achieve the goal. In life and especially in software development, that's not always the smart thing to do - to stubbornly invest in an outcome, often disproportionately to the benefit. Here's my brickwalls from today.

I had made a web page showing text of the updated lat/long of the ISS. It met the requirements, but was not very exciting. The obvious thing to do with this information would be to show it on a map.

#### Moving map

Obviously there are lots of options for this, none of them were as simple as I would have liked, and I wanted a free one. [OpenLayers](https://openlayers.org/) sounded like it would do the job, and the download to showing a map in the demo app time was about five minutes - we're off to a good start.

#### Wall 1 - complicated library

I'm not joking when I say OpenLayers is comprehensive. It appears to do everything you could possibly want. The flipside of this is complexity. I managed to get the map scrolling so the ISS position was the centre of the map, and discovered how to add a dot as a feature to represent the ISS, but then when I wanted to get that dot to move I was increasingly out of my depth.

Of course, there's nothing magical here - it's a gigantic, well documented API, and there's a smattering on answers on StackOverflow. I'm smart enough to get my head around it, find some repos using it and dissect them and so on. The question is one of cost/benefit. I'm essentially building a toy for my own amusement - would the time be better spent on moving on to the next part of my course?

#### Wall 2 - overlapping images

I have a better idea anyway - since the ISS should be at the centre of the map, I can just stick a picture of the ISS there. I assume this is possible with CSS?

This turns out to be a low wall. The CSS for my image is:

```
img {
  position: absolute;
  top: 50%;
  left: 50%;
}
```

The container (that holds the map and this image of the ISS) has `position:relative` this all works on the first try, and my ISS png is positioned perfectly in the centre of the map at it's correct location, and it changes correctly as the window is resized.

![](/images/screen-shot-2023-01-17-at-6.25.04-pm.jpg)

#### Wall 3 - Vite

The process of creating the demo app from the Getting Started instructions for OpenLayers involves something called [Vite](https://vitejs.dev/). Apparently it's a "Next Gen Frontend Tooling" which does not really tell me much. I've heard it mentioned in passing a couple of times, and know it's pronounced veet. A bit like when I was using React, there's a node build step that fills a directory with the distributed files - I'm guessing this is something to do with pulling in just the parts of the giant library I'm using - but there's 260K of JavaScript and a 1.6MB .map in there, so I feel some handcrafting or a CDN should be involved.

If the .map file is in fact the map, that's actually pretty amazing for a map of the entire world that I can zoom down to individual street level - so it's probably not, but either way it's massive overkill for what this application needs. All I really need for this is a 1000x500 px image of a map of the world. Still here we are.

So I don't really understand Vite, but I can follow the instructions enough to get the live server running for development, and to build the distribution files.

#### Wall 4 - GitHub Pages

I love GitHub pages, and have a couple of apps up on it [here](https://iankulin.github.io/calc/) and [here](https://iankulin.github.io/todo001/). It works by specifying a branch (which can include main) in the repo to expose, or by starting a repo with your GitHub username - for example, mine would be [iankulin.github.io](https://iankulin.github.io/)

I had my original (non-map) version of the iss location working on Pages as a subdirectory of the main iankulin page. For the map version, I publish it directly from the docs directory of the main branch of it's own repo. About this time, I realised that my original version was mysteriously not working. I would have been okay with that, but neither was the new version, which as usual 'wOrKEd On mY mAChiNe'.

I can see now what the problem was with my original version. I had copied the source files of the non-map version to the /iss folder of my main github.io page, so it's address had been https://iankulin.github.io/iss/. Meanwhile, I'd named the new map-version repo 'iss' and published it from that repo - so its link was, you guessed it [https://iankulin.github.io/iss/](https://iankulin.github.io/iss/) After a bit of shuffling around, the old one is now working correctly at [https://iankulin.github.io/cwd/iss/](https://iankulin.github.io/cwd/iss/)

#### Wall 5 - Vite again?

Meanwhile, the new version, with the moving map was clearly loading the HTML, but no sign of the ISS image, the .css or .js

I'm in unfamiliar territory here with Vite, but since I started with the bundled my-app app, I'm sort of expecting everything to just work, unless it's something to do this the GitHub Pages hosting. I do go down a rabbit hole about how they are designed for Jekyll. But a simpler explanation might be the links to those resources in the HTML. They all had a forward slash in front of them, like

`/assets/iss.d6272ccf.png`

where as I would have been expecting

`assets/iss.d6272ccf.png` or even `./assets/iss.d6272ccf.png`

(a side note - I have no idea why \*ix systems use `./` to mean the current directory. It would be like prefixing everyone's name with _parent's child_ when you're talking to them).

![](/images/soanyway.jpg)

So anyway, I just started manually editing the built code which doesn't seem like great practice:

![](/images/screen-shot-2023-01-18-at-10.16.35-am.png)

It didn't immediately solve my problem, but I'm not sure what the update rate for Pages is, and when I looked the next morning, it was working.

#### Wall 6 - The last 90%

[Tom Cargill](https://en.wikipedia.org/wiki/Ninety%E2%80%93ninety_rule) (Bell Labs in the 80's) is credited with noticing that the first 90% of the code accounts for the first 90% of the development time and the remaining 10% accounts for the remaining 90%. It certainly feels right that solving the problems and getting the MVP/prototype up and working - aka the fun bit, is not even the half way point in a project.

Even in this very simple app, with the shortcuts I've made, there's still significant work to do:

-   I need to disable the user's ability to scroll around the map - since it breaks the illusion that the ISS picture is map of the map (or correctly render it as a map layer).
-   There needs to be a delay or something so the first render of the map is based on a fetched ISS position.
-   It ISS picture is not quite in the centre - it's not noticeable on a laptop, but on mobile it's very evident.
-   Actually, the whole mobile experience needs a bit of work. That lat/long display does not fit as written. Better to pop the elements into a grid so we can stack them when the screen gets narrow.

Will I do these things? Is the trip worth the gas? I need to balance progressing in the course with the things I can learn by finishing everything off carefully. In this case, since I'm way, way past what the course exercise was, I'll leave it as is. Eventually I'll work back through my GitHub with a recruiter's eye, and things like this will need fixed to production standards or made private.
