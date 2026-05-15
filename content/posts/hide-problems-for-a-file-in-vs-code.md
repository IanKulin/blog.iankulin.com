---
title: "Hide 'Problems' for a file in VS Code"
date: '2023-08-25'
slug: hide-problems-for-a-file-in-vs-code
aliases:
  - /2023/08/25/hide-problems-for-a-file-in-vs-code/
tags:
  - tools
  - vs-code
  - web-dev
---

![Two white bread guys clicking away on a screen wall](/images/apollon_young_man_touching_a_transparent_wall_hiding_code_for_a_524e38cd-fa31-45a3-ab96-dc9b9ed25caa.jpg)

I'm interested in trying out [Pico CSS](https://picocss.com/) - a lightweight CSS library, but when I tossed it into my project, the linter found and reported 29 problems. One of my processes is to just keep that problems tab clear as I work, so I'd like that to go away.

![Screenshot of VS Code showing 29 problems detected.](/images/screen-shot-2023-07-20-at-6.54.06-am.jpg)

It's possible, but only by 'excluding' the file from your project - it won't show up in the file view either. That's fine with me, I never want to deal with the file so we'll do that, although it might confuse me in seven years if I come back to this project, so I'll drop a link in my .git\_ignore as a clue for future me (excluding the file in VS Code doesn't affect git finding it).

![screenshot of .gitignore file including public/pico.min.css](/images/screen-shot-2023-07-20-at-7.03.25-am.png)

Workspace settings (such as excluding a file) are stored in `./vscode/settings.json` - this has some other bits and pieces such as spelling corrections etc. It's worth letting this into your repository so your workspace is recreated when you clone the repo. The fragment you need to add is:

```
    "files.exclude": {
        "**/pico.min.css": true
    }
```

This will remove it from the files, and it will stop it being processed by your extensions including any linters. If the problems don't disappear instantly, click into a different file for a second and they should go, or occasionally, you'll need to close and open VSCode.

![Screenshot of VS Code showing settings.json and zero problems in the problems tab.](/images/screen-shot-2023-07-20-at-6.54.47-am.png)
