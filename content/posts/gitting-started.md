---
title: "Gitting Started"
date: '2022-07-13'
slug: gitting-started
aliases:
  - /2022/07/13/gitting-started/
tags:
  - git
  - github
  - gwen-faraday
  - posts
  - video
  - vim
---

One of my early goals was to get in the habit of using version control with Git/Github, and I've got that sorted out today. My source was this excellent, very clear video from [Gwen Faraday](https://www.youtube.com/channel/UCxA99Yr6P_tZF9_BgtMGAWA). I highly recommend it if you are just starting.

{{< youtube RGOj5yH7evk >}}

It possibly helped that I'm also on mac, so I didn't have to deal with the "or however that's done on your system" type problems. Also, where things didn't work as expected, the explanation about what was being done was clear enough that the problem was solvable. For example, the push command Gwen used was:

```bash
git push origin master
```

but GitHub had defaulted my initial branch to "main" rather than "master". Easily fixed since she immediately explained what both of those modifiers were. The only other tiny bit of troubleshooting was that my git global config wasn't set up, so my commit was followed by a big message pointing out that my real email address wasn't used for the commit:

```bash
 Committer: User Name <username@Ians-MacBook-Pro.local>
Your name and email address were configured automatically based
on your username and hostname. Please check that they are accurate.
You can suppress this message by setting them explicitly. Run the
following command and follow the instructions in your editor to edit
your configuration file:

    git config --global --edit

After doing this, you may fix the identity used for this commit with:

    git commit --amend --reset-author
```

It didn't make any difference - the file I'd created locally pushed up to the GitHub repo just fine. When I did follow those instructions to edit the file, I suddenly needed to know how to use Vim (hint: "i" to go into insert mode for editing, then ":" for command mode and "x" to exit and save).

The only real complexity in the whole process was generating the SSH key and saving that on GitHub to allow the push from your local directory up to the GitHub repository.

Ignoring that, the process was:

-   Creating the repository via on GitHub
-   Using `git clone` to download the repository to the local machine and set it up for tracking in git
-   Edit/create the files, however. Gwen used Visual Studio code, I used my tools
-   Check status with `git status`
-   `git add .` to stage the new files and freshly edited files
-   Commit those changes with `git commit -m "commit title" -m "description"`
-   Then push them up to GitHub with `git push origin main` where "main" is the branch name.

All of that was by about the 25 minute mark in the video, and is probably enough for me to go away and get some practice with. The rest covers getting an already established local git repository to GitHub, branching, forking, undoing.
