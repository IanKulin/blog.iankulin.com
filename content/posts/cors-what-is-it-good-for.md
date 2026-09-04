---
title: "CORS, What is it good for?"
date: '2026-06-01'
slug: cors-what-is-it-good-for
summary: "I explain the browser's same-origin policy, covering what counts as an origin, why the restriction exists, and how it blocks JavaScript from reading cross-origin responses. I then introduce CORS as the mechanism servers use to permit specific origins via Access-Control-Allow-Origin headers."
tags:
  - cors
  - webdev
  - security
  - sop
---

Imagine you have two browser tabs open, one to your bank, and one to evil-site.com 

```
┌─────────┐┌──────────────┐              
│   BANK  ││  EVIL-SITE   │              
├─────────┴┴              ┴────────┐
│                                  │
│                                  │
│                                  │
│                                  │
│                                  │
└──────────────────────────────────┘
```

evil-site.com, knowing you're probably authenticated to your bank, sends a request to it for some data.

Luckily, your browser complies with the [Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy) and won't let the evil-site.com page see the results of this query when the response arrives.

The basic rule of Same-origin policy is that the Javascript in a web page can only read responses from the same _origin_ where the _origin_ is the combination of scheme (http vs https), hostname, and port. 

What URLs have the same origin as `https://evil-site.com`?

| URL / Resource                           | Same origin | Why                           |
| ---------------------------------------- | ----------- | ----------------------------- |
| `https://evil-site.com/page`             | Yes         | Same protocol, host, and port |
| `https://evil-site.com:443/api`          | Yes         | Port `443` matches HTTPS      |
| `https://sub.evil-site.com`              | No          | Different host/subdomain      |
| `http://evil-site.com`                   | No          | `http` vs `https` protocol    |
| `https://evil-site.com:8443`             | No          | Different port                |
| `https://evil-site.org`                  | No          | Different domain              |
| `https://www.evil-site.com`              | No          | Different `www` subdomain     |

The purpose of the same-origin policy (which has been around since about 1995) is to stop a malicious script on one page accessing the data on another page.

- It's a browser protocol - it doesn't apply to `curl` or other methods of fetching resources
- It's a Javascript thing - you can still fetch resources such as images, scripts, css etc from other origins in your page using HTML tags.

## CORS

So the same-origin policy is a pretty great sensible restriction for preventing a foreseeable and real problem in allowing web sites to run code. But it does cause some pain. Imagine this: We have a pretty React front-end application on our company website at https://example.com and we want it to fetch data from https://api.example.com It can make the request, and https://api.example.com can send the data, but our application can never see it because the browser says 'hang on, this is against my same-origin policy because these two addresses are not the same origin'.

```
┌─────────────────────┐    ┌─────────────────────────┐
│                     │    │                         │
│                     │    │                         │
│ https://example.com │    │ https://api.example.com │
│                     │    │                         │
│                     │    │                         │
└─────────────────────┘    └─────────────────────────┘
```

This is obviously bad, so what we need is a safe way to get around the same-origin policy for just this site. https://api.example.com needs some way to say "I'm happy for https://example.com to fetch my data even though we're on different origins".

Welcome to Cross Origin Resource Sharing (CORS).

All https://api.example.com has to do is set a header in its response so that the browser knows this is allowed. The headers in the response from https://api.example.com would include:

```
Access-Control-Allow-Origin: https://example.com
```

or perhaps if https://api.example.com is a public API that's happy for anyone to use it's data, it might say:
```
Access-Control-Allow-Origin: *
```

It's worth remembering that CORS is enforced by the browser, not the server — the response actually gets sent either way, the browser just refuses to hand it to your Javascript if the headers don't check out. If you use a non-browser tool (like `curl`) then CORS is not in effect. I've confused myself forgetting that more than once.

So that's CORS: The same-origin policy locks everything down by default, and CORS is the mechanism a server uses to deliberately unlock the door for specific origins it trusts. 
