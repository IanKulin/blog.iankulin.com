---
title: "Expired packages"
date: '2023-01-30'
slug: expired-packages
aliases:
  - /2023/01/30/expired-packages/
tags:
  - cwd
  - web-dev
---

At several points in the [Complete Web Developer](https://www.udemy.com/course/the-complete-web-developer-zero-to-mastery/) course, deprecated packages have been used, with the slide before the video explaining what's happening, and giving a work around, or sometimes - as is the case for the bit I'm just starting - exhorting the benefits of dropping you into a non-working mess and having you figure it out yourself.

While this argument can be reasonably made - that figuring things out on your own is a valuable skill - it's also a useful fig leaf to cover up the fact that they haven't bothered to fix the course to make it work out of the box.

A recent example of this was the particles.js library. The card preceding the video says the library used in the video is no longer available, but hey, this other one is pretty much the same. And, I mean it was very similar, but the instructions on it's npm page for using it were different from what was in the video, the video instructions didn't work with it, and following the install page instructions led to one of those repeated `npm audit fix --force` cycles where you keep just breaking more things.

I got it going eventually, but only by starting with a new create-react app with the particles template then slowly adding back my previous code from git a bit at a time and fixing errors as they came up. The whole process from watching the video to having the project working as per the video was probably four or five hours. Was this a good investment of learning time? Probably not.

![](/images/img_3996.jpg)

Straight out of that experience, Andrei advises that the next section uses a deprecated api, that he's persisting with because he wants to teach REST apis. In order to make it work, we need to downgrade the react-scripts version which he assures will not cause any problems. Naturally there is a list of critical warnings, and the server can't start because of a heap of errors.

![](/images/screen-shot-2023-01-23-at-11.14.08-am.jpg)

```
Starting the development server...

Error: error:0308010C:digital envelope routines::unsupported
    at new Hash (node:internal/crypto/hash:71:19)
    at Object.createHash (node:crypto:133:10)
    at module.exports (/Users/ianbailey/Developer/CWD/facerecognitionbrain/node_modules/webpack/lib/util/createHash.js:135:53)
    at NormalModule._initBuildHash (/Users/ianbailey/Developer/CWD/facerecognitionbrain/node_modules/webpack/lib/NormalModule.js:417:16)
    at handleParseError (/Users/ianbailey/Developer/CWD/facerecognitionbrain/node_modules/webpack/lib/NormalModule.js:471:10)
    at /Users/ianbailey/Developer/CWD/facerecognitionbrain/node_modules/webpack/lib/NormalModule.js:503:5
    at /Users/ianbailey/Developer/CWD/facerecognitionbrain/node_modules/webpack/lib/NormalModule.js:358:12
    at /Users/ianbailey/Developer/CWD/facerecognitionbrain/node_modules/loader-runner/lib/LoaderRunner.js:373:3
    at iterateNormalLoaders (/Users/ianbailey/Developer/CWD/facerecognitionbrain/node_modules/loader-runner/lib/LoaderRunner.js:214:10)
    at iterateNormalLoaders (/Users/ianbailey/Developer/CWD/facerecognitionbrain/node_modules/loader-runner/lib/LoaderRunner.js:221:10)
/Users/ianbailey/Developer/CWD/facerecognitionbrain/node_modules/react-scripts/scripts/start.js:19
  throw err;
  ^

Error: error:0308010C:digital envelope routines::unsupported
    at new Hash (node:internal/crypto/hash:71:19)
    at Object.createHash (node:crypto:133:10)
    at module.exports (/Users/ianbailey/Developer/CWD/facerecognitionbrain/node_modules/webpack/lib/util/createHash.js:135:53)
    at NormalModule._initBuildHash (/Users/ianbailey/Developer/CWD/facerecognitionbrain/node_modules/webpack/lib/NormalModule.js:417:16)
    at /Users/ianbailey/Developer/CWD/facerecognitionbrain/node_modules/webpack/lib/NormalModule.js:452:10
    at /Users/ianbailey/Developer/CWD/facerecognitionbrain/node_modules/webpack/lib/NormalModule.js:323:13
    at /Users/ianbailey/Developer/CWD/facerecognitionbrain/node_modules/loader-runner/lib/LoaderRunner.js:367:11
    at /Users/ianbailey/Developer/CWD/facerecognitionbrain/node_modules/loader-runner/lib/LoaderRunner.js:233:18
    at context.callback (/Users/ianbailey/Developer/CWD/facerecognitionbrain/node_modules/loader-runner/lib/LoaderRunner.js:111:13)
    at /Users/ianbailey/Developer/CWD/facerecognitionbrain/node_modules/babel-loader/lib/index.js:59:103 {
  opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ],
  library: 'digital envelope routines',
  reason: 'unsupported',
  code: 'ERR_OSSL_EVP_UNSUPPORTED'
}

Node.js v18.12.1
➜ ~/Developer/CWD/facerecognitionbrain >                                                                      git:(main) ✗ 
```

Clearly this (or perhaps the next step) is a spot in the course that receives a few complaints, since Andrei goes to the effort of making a special video in front of it extolling the virtues of solving your own problems, and saying he has a script that runs weekly on his code for this section proving it does work. He also explains that after the app is built with the deprecated REST API, he'd got a new video using the new package, then after that we'll be removing all this code anyway to move this functionality to a node server.

So I've got a few options in front of me.

1.  Try and wind back all of the packages that are causing problems until the app runs again.
2.  Just watch the REST API content but don't bother trying it.
3.  Clone Andrie's project and see if he's actually managed to get it going with the outdated script somehow and figure out how and bring that technique over to my project.

(2) is the logical option, but it's frustrating since the point of this section is to learn REST API's. In an ideal world, ZTM would have rewritten this part of the course to use a REST API that works. No doubt this would mean coming up with a new app and remaking some videos, but really that's what they need to do.

Slightly compounding the frustration is that support for the course is community based centred around a Discord, and there's no channel for this course.

I decide to watch the videos first then make a decision, and in the meantime revert back to the current version of react-script. Of course, when I do this, it suddenly has some critical vulnerabilities in webpack 🤦. I run the force, and now I've got 80 critical vulnerabilities and the server won't run due to errors five deep in Babel somewhere.

To be continued...
