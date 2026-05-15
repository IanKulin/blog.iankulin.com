---
title: "Using Node.js to return a static file"
date: '2023-07-02'
slug: using-node-js-to-return-a-static-file
aliases:
  - /2023/07/02/using-node-js-to-return-a-static-file/
tags:
  - express
  - javascript
  - nginx
  - node
  - node-js
  - web-dev
---

![](/images/rajeshtva_node.js_609056a9-3b73-46f5-bc4f-c1f110e3a367.png)

As mentioned in the [previous post](/complicating-the-temperature-api/), stage one is just to return the same static text file, but from the Node server, rather than NGINX. That's non-trivial to a rank beginner since I need to figure out 1) how to serve a static file from Node, and 2) how to configure NGINX to hand off calls to the API to Node. This post will look at both of those, but it's first probably worth just setting out what each of the puzzle pieces are.

### NGINX

[NGINX](https://www.nginx.com/) is a web server - it listens on a port (classically 80 and 443 - http and https) and responds to those requests. Usually by returning some files. However, it can also pass those requests off to something else. This process is called Reverse Proxying. Currently I have NGINX set up to just serve a static text file, but in the change I'm proposing, NGINX will pass an API request off to Node.

{{< youtube JKxlsvZXG7c >}}

### Node.js

[Node](https://nodejs.org/en) is JavaScript packaged up to run on a server, instead of inside a browser. There's lots of different languages we can write server-side code in, and many have some strengths over Javascript. Part of the motivation for using Node might be that web developers have already invested significantly in learning JavaScript to use on the front-end, so it makes sense to use those same skills on the back end.

A major difference from some other server-side scripting languages (for example, PHP) is that Node is non-blocking, making use of call-backs to handle events resulting in high performance at scale. It's trivial to write a static web server in Node, but that is to seriously under-use it's capability.

{{< youtube jOupHNvDIq8 >}}

### Express.js

Once you start writing backends in Node, you'll find yourself writing a lot of the same code over and over to achieve some standard things - time for a framework. [Express](https://expressjs.com/) is one of the most popular web frameworks for writing APIs on Node. Using Express makes that job simpler and leaves you with cleaner, more succinct code. It's can be argued that there are better frameworks, but at around 5 miliion downloads per day, I think we can regard it as a standard approach to the problems it solves.

### Serve a static file from Node

I said it was trivial. Here's the code, then we'll discuss it:

![const express = require('express');
const app = express();
const PORT = 3000;
app.get("/api/gnp\_temp.txt", (req, res) => {
res.status(200).sendFile(\_\_dirname + '/gnp\_temp.txt');
});
app.listen(PORT, () => {console.log(\`Listening on port ${PORT}\`)});](/images/screen-shot-2023-06-25-at-8.45.20-am.png)

PORT is the port we're listening on. In this case 3000. So if I open a URL on http://localhost:3000 that request will be handled by this code. The actual work is done in these lines:

```
app.get("/api/gnp_temp.txt", (req, res) => {
    res.status(200).sendFile(__dirname + '/gnp_temp.txt');
});
```

It is only looking for requests to `:3000/api/gnp_temp.txt` - everything else is ignored. But if it gets that request, it will return a result status of `200` (success) along with the file `gnp_temp.txt` from the current directory.

If you are wondering about setting up the environment to get to the point where you can run and understand this. There are lots of great videos - [Web Dev Simplified](https://www.youtube.com/watch?v=SccSCuHhOw0), [Code with Mosh](https://www.youtube.com/watch?v=pKd0Rpw7O48), [Code with Con](https://www.youtube.com/watch?v=KNa-wMpry00)

Now that it Works on My Machine™ I need to figure out how to deploy it.
