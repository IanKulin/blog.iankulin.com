---
title: "npm ERR! Exit handler never called!"
date: '2024-10-21'
slug: npm-err-exit-handler-never-called
aliases:
  - /2024/10/21/npm-err-exit-handler-never-called/
tags:
  - debugging
  - node
  - npm
  - security
  - web-dev
---

I quite like GitHub scanning all my code and sending me security advisories. Here's today's:

<a href="/images/screen-shot-2024-09-27-at-11.31.03-am.png"><img src="/images/screen-shot-2024-09-27-at-11.31.03-am.png" width="800" alt=""></a>

With these, and my [dependabot](https://github.com/dependabot) alerts, fixing them is usually just a matter of pulling down the project, running an `npm update`, building any artifacts, then pushing it back up. But today, not so:

<a href="/images/screen-shot-2024-09-27-at-11.36.57-am.png"><img src="/images/screen-shot-2024-09-27-at-11.36.57-am.png" width="900" alt=""></a>

### package-lock.json

It's probably worth revisiting what the `package-lock.json` does. It contains all the versions of any packages you've imported, and their dependencies. The idea is that this will make the build reproducible. We don't commit the node\_modules folder (that actually contains all that package code), but npm can reproduce it exactly by using the version information in the package-lock.json file. Here's a snippet where you can see all those versions:

```json
    "node_modules/body-parser": {
      "version": "1.20.2",
      "resolved": "https://registry.npmjs.org/body-parser/-/body-parser-1.20.2.tgz",
      "integrity": "sha512-ml9pReCu3M61kGlqoTm2umSXTlRTuGTx0bfYj+uIUKKYycG5NtSbeetV3faSU6R7ajOPw0g/J1PvK4qNy7s5bA==",
      "dependencies": {
        "bytes": "3.1.2",
        "content-type": "~1.0.5",
        "debug": "2.6.9",
        "depd": "2.0.0",
        "destroy": "1.2.0",
        "http-errors": "2.0.0",
        "iconv-lite": "0.4.24",
        "on-finished": "2.4.1",
        "qs": "6.11.0",
        "raw-body": "2.5.2",
        "type-is": "~1.6.18",
        "unpipe": "1.0.0"
      },
      "engines": {
        "node": ">= 0.8",
        "npm": "1.2.8000 || >= 1.4.16"
      }
    },
```

For me, I don't really care that I'm using "iconv-lite" version 0.4.24, but if I'm working on a project with someone else, it might be important that we're using the same version so we're not chasing our tails trying to sort out a bug.

### npm update

There are some rules about how the versions of packages are entered in `package.json`; when we run `npm update`, it uses those rules to look in the npm registry to find the most recent version of all the packages it's allowed. Then it updates them in `package-lock.json`, and downloads the code into the `node_modules` directory.

This is potentially a substantial change to your app, so you'd definitely want to be running your testing process again afterwards.

### The Error

```bash
npm ERR! Exit handler never called!

npm ERR! This is an error with npm itself. Please report this error at:
npm ERR!     <https://github.com/npm/cli/issues>
```

This sounds quite serious, but before you head off to report it, try this:

```bash
npm install --no-package-lock
```

This just runs the update ignoring the package-lock.json file - as if you'd just deleted it. If that works, it was a problem with the `package-lock.json` file, which in this context of just wanting all the latest versions we don't care about. We do want to rebuild the `package-lock.json` file though, so go ahead and delete it and run `npm install` to create a nice new one.

<a href="/images/screen-shot-2024-09-27-at-12.03.23-pm.png"><img src="/images/screen-shot-2024-09-27-at-12.03.23-pm.png" width="900" alt=""></a>

Now your project will have a couple of version changes in those package files. You'll need to redo all your testing and rebuild any Docker images etc, and then you're all up to date and secure again!
