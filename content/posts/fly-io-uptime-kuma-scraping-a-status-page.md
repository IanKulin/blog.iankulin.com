---
title: "Fly.io, Uptime Kuma & scraping a status page"
date: '2024-02-02'
slug: fly-io-uptime-kuma-scraping-a-status-page
aliases:
  - /2024/02/02/fly-io-uptime-kuma-scraping-a-status-page/
tags:
  - api
  - devops
  - fly-io
  - homelab
  - json
  - monitoring
  - posts
  - uptime-kuma
  - web-dev
---

<a href="https://dribbble.com/shots/5657880-Fly-io-Logo"><img src="/images/c1fef772e2dca5e1ab8c812f465c95a8.png" width="800" alt=""></a>

I've been aware since I set up [Uptime Kuma](/uptime-kuma-nfty/) for my monitoring, that having an instance on my local network monitoring my VPS websites wasn't ideal. The main reason being that the flakiest part of my infrastructure is my 4G home internet, so if that goes down I have no website monitoring, and even if I did, the notifications couldn't get out.

Of course, it would also be a simple matter to run an instance on the VPS that I host the sites on, but that has a similar problem in that if the VPS goes down, so does my monitoring of the VPS. What I really need is a third, independent space to run an instance.

### Uptime Robot

[Uptime Robot](https://uptimerobot.com/) is a monitoring service that seems somehow related to Uptime Kuma? They have some of the same terminology and colour schemes - so I'm not really sure. Perhaps it's a fork, or perhaps Uptime Kuma was inspired by Robot. Robot does have an API which is a nice addition, since ideally if my monitoring is spread around, I'd like to pull it all back into one 'pane of glass' by having my system monitor the remote for how many 'down' sites it's tracking. It also has a number of other extra features such as heartbeat monitoring.

Uptime Robot is a paid service, but like nearly all VC funded things growing a user base it has a free tier with some restrictions. I like NTFY for my notifications, but on Robot I could only access email notifications. There are iOS and Android apps, but I didn't try them.

### Third Space

Ideally, I like to run another Uptime Kuma in a VPS on a different provider. I've heard that [Oracle have a free tier](https://www.oracle.com/au/cloud/free/) which seems like it would be fine for this application, but a more interesting idea that I've been thinking of using for other projects is Fly.io.

### Fly.io

Fly.io own physical servers in colo datacentres around the world on which they offer compute based on [Firecracker VM's](https://www.amazon.science/blog/how-awss-firecracker-virtual-machines-work). The cute bit is that you give them a Docker container, and they unpack it into one of these fast baby VM's.

The exact nature of their 'free tier' is hard to figure out from their [pricing page](https://fly.io/docs/about/pricing/), but based on [some answers to questions in their forum](https://community.fly.io/t/fly-io-free-tier-billing/11432), and [blog posts from others who have set up Uptime Kuma](https://jfmadrid.notion.site/Uptime-Kuma-for-Free-on-Fly-io-e5eeead6dfb4425b8403c100ec986191) there, it sounds like the deal is that if you use one shared CPU _and_ keep your storage under 3GB _and_ the charges for your use add up to less than $5/month - then it's free. I did have to provide credit card details, so if [I get a $71,393 bill,](https://www.youtube.com/watch?v=N6lYcXjd4pg) I'll come back here and edit this. (_edit from the future: eight months later I haven't paid a cent_).

To get Uptime Kuma running on Fly.io, I followed [this guide](https://jfmadrid.notion.site/Uptime-Kuma-for-Free-on-Fly-io-e5eeead6dfb4425b8403c100ec986191), but the steps where basically:

-   Create an account on Fly.io
-   Install the Fly.io command line tools and run a command to 'create' your app
-   Create a '[fly.toml](https://github.com/lubien/fly-uptime-kuma/blob/main/fly.toml)' file which is a text config file pointing to the docker image and supplying some details such as ports and location
-   Use the CLI to set the disk space needed, and 'deploy' the app

It was impressive how simple all this was. If the intention of the free tier is to get you to try it, and show you how painless it is to deploy any dockerised app to the edge, then mission accomplished.

You can check on the status of your app at [https://fly.io/dashboard](https://fly.io/dashboard)

<a href="/images/screen-shot-2024-01-16-at-6.31.22-pm.png"><img src="/images/screen-shot-2024-01-16-at-6.31.22-pm.png" width="1000" alt=""></a>

And go to <appname>.fly.dev to see your app. On the free tier, you're on a shared IPV4 address but it is possible to use your own domain if desired - that's one of the things to set up in the .toml file.

It is remarkable what you can deploy for free in the golden age of venture capital.

### Extracting Status

One of Uptime Kuma's functions is to provide public (ie viewable without being logged in) 'status' pages, and if all the services you've added to that status group are up, it has. great big heading saying "All Systems Operational".

<a href="/images/screen-shot-2024-01-16-at-7.38.45-pm.png"><img src="/images/screen-shot-2024-01-16-at-7.38.45-pm.png" width="900" alt=""></a>

So my plan to pull this status into my homelab instance of Uptime Kuma was just to add this remote status page as a monitor, and search for the keyword 'All Systems Operational'. If that was found, I'd know everything was good. But of course, this is a modern web-app (I think using [Vue](https://vuejs.org/)), so that text does not exist in the page, it's added to the DOM by some JavaScript after the page is loaded based on some client side processing of (probably) some JSON data it pulls in.

One option would be to use a web scraping library to write something to access this piece of information. On a page like this, that would involve a headless browser rendering the DOM then exposing it.

But of course, the Javascript that is building the page we're looking at is getting its data from somewhere, so it's probably easier for us to grab that data directly and process it ourselves. How do we see where the data is from? We use the browser tools to look at the network requests when the page is loaded.

<a href="/images/screen-shot-2024-01-16-at-7.20.50-pm.png"><img src="/images/screen-shot-2024-01-16-at-7.20.50-pm.png" width="1000" alt=""></a>

So if you view the status page at `<whatever.com>/status/<page_name>`, it loads some data from `<whatever.com>/api/status-page/heartbeat/<page_name>`.

The JSON that's returned from this request contains two objects: `heartbeatlist`, and `uptimelist`.

<a href="/images/screen-shot-2024-01-16-at-8.06.05-pm.png"><img src="/images/screen-shot-2024-01-16-at-8.06.05-pm.png" width="1000" alt=""></a>

`heartbeatlist` contains the last 50 retrievals for each of the URL's being monitored. Each of these retrievals has a status (1 for up, 0 for down) and the response time. `uptimelist` is the fraction of uptime. You can see in the data above that the first URL has a lower percentage of up-time (because I failed it to check my understanding of the status data).

So I need to write an endpoint that requests this data, then checks the last array element of each of the URLs in the heartbeat list, then spit out some text saying if all the URL's in this status group are available. That's quite doable, I have the skills, but it's probably a two hour job to do properly.

Since this is an open source project, a better use of that time would be to add this functionality to Uptime Kuma so it would be available to anyone with the same problem. It might be a niche case, but the code to provide this output would be simpler inside the project and much more durable than reverse engineering it.

Let's have a look at the source and see what it's like.

<a href="/images/screen-shot-2024-01-16-at-8.34.24-pm.png"><img src="/images/screen-shot-2024-01-16-at-8.34.24-pm.png" width="1000" alt=""></a>

Well, well well. What do we have here? There's an api route that outputs an SVG badge for a status page. The badge says 'Degraded' in amber if some of the URL's are down, and 'Up' in green if they are all up. Those words are present in an aria label and the svg `<title>` tag, so they'll be detectable by the Uptime Kuma 'keyword' search.

Five minutes later, we're in business. Thank you open source!

<a href="/images/screen-shot-2024-01-16-at-8.41.52-pm.png"><img src="/images/screen-shot-2024-01-16-at-8.41.52-pm.png" width="772" alt=""></a>
