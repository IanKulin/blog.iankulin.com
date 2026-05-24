---
title: "Gitting the hang of it"
date: '2022-08-04'
slug: gitting-the-hang-of-it
aliases:
  - /2022/08/04/gitting-the-hang-of-it/
tags:
  - git
  - github
  - possibly-useful
---

<a href="https://xkcd.com/1597/"><img src="/images/git_2x.png" width="253" alt=""></a>

I spent most of the day learning about, and practicing with git. I'll list some of the resources at the bottom, but for the moment, this is my understandings / cheat sheet for git. Since this could conceivably turn up in someone's google search, and slightly less conceivably be of some use, I will come back and edit it if there's something bad/wrong here. Comments would be great if you think that's the case.

It's most likely to be useful to someone using Xcode, GitHub, and the command line for git on MacOS.

**Start a new repository (repo)**

-   on GitHub create the repo, it doesn't matter if you create any files in it - they will be wiped shortly
-   while you are on GitHub, grab the SSH address for the repo - it's under the green "Code" button. If your username is IanKulin and the new repo is named GitTest it would look like this `[git@github.com](mailto:git@github.com):IanKulin/GitTest.git`
-   create your Xcode (or whatever) project. I use the repo name as the project (and therefore directory name) but that's not strictly necessary. I navigate to the Developer folder, so the new project is created as a folder inside that. Then in terminal inside that new directory:
-   `git init`
-   that marks it as a directory under source control, I usually drop a .gitignore in at this stage (more about that further down)
-   we need to add the files and commit them to the local git repo:
-   `git add -A`
-   `git commit -m "Initial commit"`
-   now we connect the local repo to your github repo
-   `git remote add origin [git@github.com](mailto:git@github.com):IanKulin/GitTest.git`
-   that just sets up the name so you can use _origin_ now to refer to the remote repo
-   push the local files up to github with
-   `git push -u -f origin main`
-   main is the name of the branch - GitHub defaults to this. If you are looking at old tutorials they are probably using _master_ rather than _main._

**Xcode**

-   once a project is set up for git like this, Xcode will realise and use it to indicate changes in files, and mark them in the file navigator as "A" or "M" (need Added, or have been Modified). There is a Source Control menu that allows you to Add and Commit (more about these further down) to the local repo which work well, but I haven't had any luck pushing up to GitHub with it - I do that from the command line. Doubtless this is something to do with the SSH key.

**About .gitignore**

-   this config file is used by git to ignore the working files that shouldn't be tracked - stuff like the different compile states and so on. Normally we'd only want the source, asset and make files etc - the stuff needed to recreate the project
-   GitHub will create a default for the language you are using if you let it
-   I usually add these lines to it:
    -   `# MacOS`
    -   `.DS_Store`
-   to show hidden files like this in Finder, COMMAND-SHIFT-DOT and the same to rehide them
-   if you do that, you'll also see the .git folder which is where git does all it's magic.

**To check how things are going**

-   use terminal in the directory where the repo is
-   `git status`
-   you'll see any files changed, or that need to be added, and if the local files are ahead of the last clone/push but not if they are behind the remote (GitHub) - until you do a `git fetch`, the local git doesn't know what changes have happened on the remote

**To add any files you've created in the project to version control from the CLI**

-   `git add .`
-   or of you just want to do a particular file
-   `git add` <filename>
-   this adds the files to the "staging area"  - they are having changes tracked, but they have not been "committed" to the local repository, or the remote

**When done editing and adding files and they need to be "saved" to the local repository**

-   this is called committing them
-   do from the XCode _Source Control_ menu, or from the CLI with
-   `git commit -a -m "Message for commit"`
-   now they've been added to the local repo. If you do a git status it will tell you you are ahead of the remote

**To "push" all the changes up to GitHub from the CLI**

-   `git push origin main`
-   "origin" is the address for the GitHub repo, it was set for us when we cloned the repo. "main" is the branch we're pushing to.
-   You can't just  create a new branch with this push?

**To tag all the files in the current local repo**

-   `git tag -a v0.2 -m "Second  draft"`
-   the _v0.2_ is the tag and _"Second  draft"_ the description - change accordingly.
-   This only does the local copy, so you need to push it to GitHub
-   `git push --tags` 
-   If you go and look on GitHub, the tags appear on the right under releases

To clone from a tag point

-   `git clone --depth 1 --branch v0.1 [git@github.com](mailto:git@github.com):IanKulin/TagTest.git`
-   where v0.1 is the tag
-   the `--depth 1` means you don't get all the history with it
-   alternatively, if you don't need all the history you could just download the zip/tarball from GitHub

Some resources

-   [How to Push an Existing Project to GitHub](https://www.digitalocean.com/community/tutorials/how-to-push-an-existing-project-to-github)
-   [MIT Missing Semester lecture - Version Control](https://missing.csail.mit.edu/2020/version-control/)
-   [Pro Git (book)](https://git-scm.com/book/en/v2)
-   [Git Tutorial for Beginners - Git & GitHub Fundamentals In Depth](https://www.youtube.com/watch?v=DVRQoVRzMIY) (Tech with Tim video)
-   [Learn git in 15 minutes](https://www.youtube.com/watch?v=USjZcfj8yxE) - Colt Steele video
-   [Fireside Swift podcast](https://podcasts.apple.com/gb/podcast/ep-11-a-fail-story-for-every-topic/id1269435221?i=1000406471235) - Ep 11
