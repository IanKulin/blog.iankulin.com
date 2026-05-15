---
title: "Download a Directory from a GitHub Repo"
date: '2022-08-30'
slug: download-a-directory-from-a-github-repo
aliases:
  - /2022/08/30/download-a-directory-from-a-github-repo/
tags:
  - github
  - posts
---

For [Challenge 2](https://www.hackingwithswift.com/books/ios-swiftui/guess-the-flag-introduction) in the 100 days, I needed to download a directory of flag images from Paul's GitHub. He has all the projects as sub-directories of a single "Hacking With Swift" repo. I didn't need to whole thing, just the directory with the images.

Strangely, git does not have any simple way of doing this. Neither does GitHub - I assumed the web interface would have a "download as zip" option as it does for tags.

[One](https://stackoverflow.com/questions/7106012/download-a-single-folder-or-directory-from-a-github-repo) of the popular solutions on StackOverflow was to use SVN, which GitHub supports and which does have this functionality. I much preferred [Avinash Takur's](https://stackoverflow.com/users/11218031/avinash-thakur) [suggestion](https://stackoverflow.com/questions/7106012/download-a-single-folder-or-directory-from-a-github-repo/70729494#70729494) to use GitHub's web based VSCode.

To access their VSCode, change the .com in the repo url to .dev. For example, instead of https://github.**com**/twostraws/HackingWithSwift/tree/main/SwiftUI/project2, go to https://github.**dev**/twostraws/HackingWithSwift/tree/main/SwiftUI/project`2`

![](/images/screen-shot-2022-08-22-at-6.50.16-pm.png)

Once that's done, right click on the directory to download it.
