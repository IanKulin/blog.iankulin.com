---
title: "Complicating the Temperature API"
date: '2023-06-28'
slug: complicating-the-temperature-api
aliases:
  - /2023/06/28/complicating-the-temperature-api/
tags:
  - api
  - express
  - homelab
  - node
  - posts
  - rest
  - video
  - web-dev
---

I've been slammed with other work, so my web dev learning has fallen well behind. Luckily, the YouTube procrastination algorithm noticed this and suggested I watch a video from [CodeWithCon](https://www.youtube.com/@codewithcon) titled [Learn Backend in 10 MINUTES](https://www.youtube.com/watch?v=KNa-wMpry00&list=PLkJHe6eU_tzeoe7vKUEa4MrS74CpVEwdI&index=3&t=305s).

{{< youtube KNa-wMpry00 >}}

Since I was watching a video of a guy learning to land a C152 at St Baths (a skill I do _not_ need) at the time, it was hard to argue with myself that I didn't have ten minutes to learn all of backend programming.

I mean, _all_ of backend programming in 10 minutes is a big claim, but the video did do a surprising good job of simple REST APIs in [Node](https://nodejs.org/en) using the [Express](http://expressjs.com/) framework.

I abandoned iOS programming a year ago when I started to think about the sort of applications I wanted to develop, and saw they would need to run against cloud databases, and so I was going to have to learn backend web dev at some stage anyway, and if so, learning that, then writing the front-ends for web seemed like a lower friction, and wider audience approach.

I have _sort_ of created an API to solve my [temperature logging problem](/outside-temperature-from-an-api-in-a-shell-script/). A Python script runs as a cron job every 5 minutes on a VPS, calls a weather API, parses the json and drops the values I want into a text file on an NGINX server which can be called with a straightforward GET.

While that was great to learn a bit of Python, it's not pretty, or standard. It does solve the problem I intended (I wanted that weather data for three servers running at home, but didn't want to hammer the weather API I was using for free) it has a few other problems. As the cron job on the VPS runs each five minutes, the data there can be up to five minutes behind the API, and since the cron jobs on my servers are running on the same five minute intervals, and the call to the Australian VPS is quicker than the API call to the US based API, I'm always returning the VPS data from five minutes ago - so now my data is up to ten minutes old.

Does that matter for this application? No, but the whole exercise was for learning, and this is a good enough reason to improve it my making it even more unnecessarily complicated.

I think my new system will be that the homelab servers will still poll the VPS, but the VPS will be a Node.js endpoint. When it receives a GET from one of the servers, it will check the age of it's current weather data. If it's less than a minute, it will return that, if it's older than a minute, it will call the weather API, store that and return it.

![](/images/20230624-weather.drawio-1.png)

Apart from reducing the latency of the outside temperature data, this has a couple of other benefits. The first is that my VPS won't go on for ever requesting the weather API data after I've reloaded the operating system on the home servers and completely forgotten about this project. The second is that the temperatures in the data I'm getting back look like they only change every 20 minutes, so probably they are stale before I ever get them from Open Weather. There are live weather station web pages that I could scrape for better data, so doing things in node on the VPS leaves a good option open for that future improvement.

To chunk the project down to really small bite sizes, I'll to it in two parts.

-   The first will just be to replicate the current system - return a text file when receiving a GET - in Node. That way I will have dealt with the issue of running Node behind NGINX on the VPS.
-   The second part will be to expand that to call the weather API from inside the Node program when it's needed.
-   A possible third part would be to convert it all to JSON instead of text, and then deal with that in the Python scripts running on the servers.

That's the plan.
