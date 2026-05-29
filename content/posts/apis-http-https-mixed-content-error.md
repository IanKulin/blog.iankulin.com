---
title: "APIs - http & https Mixed Content error"
date: '2023-01-24'
slug: apis-http-https-mixed-content-error
aliases:
  - /2023/01/24/apis-http-https-mixed-content-error/
tags:
  - api
  - https
  - web-dev
---

<img src="/images/screen-shot-2023-01-16-at-4.45.53-pm.jpg alt="Mixed Content: The page at '<URL>' was loaded over HTTPS, but requested an insecure resource '

Ran into a little bump today - I was calling a [cool API](http://open-notify.org/Open-Notify-API/ISS-Location-Now/) that gives the current location of the International Space Station. In a classic case of "it worked on my machine" it worked perfectly in the [Live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code on my laptop, but when I pushed it up to my GitHub space, it didn't work - throwing the error:

```bash
script.js:5 Mixed Content: The page at 'https://iankulin.github.io/iss/index.html' was loaded over HTTPS, but requested an insecure resource 'http://api.open-notify.org/iss-now.json'. This request has been blocked; the content must be served over HTTPS.
```

It turns out, as a security measure, it's not possible for a page served under an SSL certificate to call a non-secure endpoint. This makes sense since a user would be reassured by a https page knowing no data was being leaked in the URL or other calls - but if this could be circumvented by some JavaScript that would be bad.

It worked fine on my machine since it it was being served as http and calling an http api, but when I pushed it up to GitHub Pages (which is https) I ran into the error.

I tried changing the API call to https, but unfortunately that server doesn't have the SSL certificate in place to allow that. I also tried requesting the whole page from GitHub Pages as http, but it won't allow that. Googling around, there does not seem to be any way to disable this (which makes sense).

Luckily, I found another api [wheretheiss.at](https://wheretheiss.at/w/developer) which does allow https, so crisis averted.
