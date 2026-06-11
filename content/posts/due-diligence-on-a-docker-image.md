---
title: "Due Diligence on a Docker Image"
date: '2024-04-08'
slug: due-diligence-on-a-docker-image
aliases:
  - /2024/04/08/due-diligence-on-a-docker-image/
tags:
  - docker
  - homelab
  - limesurvey
  - security
---

[![](/images/brett-jordan-elldklrxmoa-unsplash.jpg)](https://unsplash.com/photos/gray-figure-ELLDKLrXMoA)
*Photo by [Brett Jordan](https://unsplash.com/@brett_jordan?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/photos/gray-figure-ELLDKLrXMoA?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)*

I need a survey tool, and a quick search turned up [LimeSurvey](https://www.limesurvey.org/), there's a 'community edition' so naturally I plan to self-host it. I scrolled down to the 'installation' section of the [manual](https://manual.limesurvey.org/Installation_-_LimeSurvey_CE/en) which has a big list of PHP dependencies.

![](/images/screen-shot-2024-03-29-at-7.20.31-am.jpg)

Ain't nobody got the time for that in 2024, I scroll further looking for the docker-compose but there isn't one. Huh. No official Docker image.

Making my own docker image will be a little bit more work than just the pain of installing it manually and writing the Ansible playbook, but almost certainly someone else will have done that for us, so pop over to Docker Hub to have a look.

![](/images/screen-shot-2024-03-29-at-7.38.06-am.jpg)

We're going to want the 'trusted content' right?

### Who do you trust?

At some stage when you run software, you are going to need to decide who you trust for this application. You might say "no, as an Open Source advocate, I'm going to read through the code and compile it myself" - and that's going to be a legit approach in some circumstances. But of course you're still choosing to trust all the libraries it uses, the compiler, the operating system, and the computer chipset (or worse - your hosting provider).

If you want to go hardcore secure, you'll eventually find yourself constructing your own `[fab](https://en.wikipedia.org/wiki/Semiconductor_fabrication_plant)`. This is the concept of the Security-Convenience trade-off. More security generally equals less convenience and vice versa.

To make a sensible decision about this when choosing software I think about the threat profile, and have some rough metrics about what makes me more comfortable or less comfortable about a software artifact.

The reason this is a front-of-mind issue for me is that software packaging is an easy stage for bad actors to insert their code. We've seen a [bit of that over the past month](https://popey.com/blog/2024/02/exodus-bitcoin-wallet-490k-swindle/) in the Canonical Snap store. Nefarious bitcoin stealers were packaging their software as legit, users were downloading them and installing them and one cryptobro lost a heap of money. It's easy to imagine lots of related exploits - for example just altering the original code and packaging it. In the case of LimeSurvey (which is used by many researchers at leading universities perhaps a bad actor might want to be able to run bots from inside verifiable uni IP addresses.

### Trust Factors

What are the things that might reduce our anxiety about the software bill of materials we're dealing with? These are just mine - a complete non-expert:

-   Trusted organisation - If the Ubuntu team have signed off on something, I'm going to trust it more that some other group I never heard of till today.
-   Popular - it's not just it's reassuring that other people have decided it's trustworthy, it's also a comforting idea that if there is an exploit, it's more likely to be discovered, and to hurt someone else first. If there's a zero day exploit in MacOS I'll hear about it on Mastodon and be able to get some advice about a work-around or fix.
-   Updated - a project under current development is more likely to be applying updates to any compromised libraries, and there's probably a community of some sort where security concerns are considered.
-   Verifiable - One of the big strengths of Open Source. Even if I don't have the skills or time to read the code, there's a good chance that other people are. And in the case of a container image, I actually do sort of have the skills to read the dockerfile and know what's gone into it.

### Choosing an Image

Let's apply some of these rules-of-thumb to my LimeSurvey container needs.

When Docker Hub says something is "trusted content" they've already done some of my work for me. And when I click through to [eucm/limesurvey](https://hub.docker.com/r/eucm/limesurvey) it says that the developer (eucm) is a "[Sponsored OSS](https://docs.docker.com/trusted-content/dsos-program/#:~:text=The%20Docker-Sponsored%20Open%20Source,Insights%20and%20analytics)" which means a human at Docker thinks this developer group are legit. These are all encouraging factors.

![](/images/screen-shot-2024-03-29-at-9.47.41-am.png)

What's less encouraging is "Pulls 635" which does not seem a lot, and "Updated over 3 years ago". Also I've got no reason to think this is an official image - eucm doesn't seem to have any connection to the LimeSurvey developers. Let's look at the other images.

![](/images/screen-shot-2024-03-29-at-10.25.21-am.png)

There's more further down but all with about 100K pulls or less. Of these four, we've already eliminated the top one, and we can probably eliminate the bottom one based on it's age - although it's always interesting to see an image with so many pulls and no updates since that sometimes happens when a project changes hands or gets relisted under a different owner.

Either of the other two (acspri/limesurvey & martialblog/limesurvey) are worth investigating - there's nothing much to tell them apart in this view since they both have about the same number of stars (the number next to the pulls number). I'll start at the top.

![](/images/screen-shot-2024-03-29-at-11.34.52-am.png)

It's promising to have a good readme, including a docker-compose example, but there's no github link, and I really want a peek at the dockerfile. If I click through to the developer, they seem to be the [Australia Consortium for Social and Political Research Inc](https://www.acspri.org.au) - which it makes sense why they would be interested in a survey tool. Additionally, they seem to have an [official link to the project](https://www.acspri.org.au/limesurvey). They do have an active GitHub account, but it doesn't include a repository for this which seems, odd.

However, there is this repo [adamzammit / limesurvey-docker](https://github.com/adamzammit/limesurvey-docker) which appears to get pushed to it's own [dockerhub](https://hub.docker.com/r/adamzammit/limesurvey) as well as the ACSPRI one. There is a note on the adamzamit dockerhub saying this used to be the acspri but has been moved here - that would be more convincing if the note was on the acspri dockerhub. The github looks legit, and there was nothing suspicious (to my inexpert view) in the dockerfile.

![](/images/screen-shot-2024-03-30-at-11.33.52-am.png)

The [martialblog/limesurvey](https://hub.docker.com/u/martialblog) one also looks good - recently updated, lots of pulls, a comprehensive readme, and a github link right at the top. The only criteria it doesn't meet is "trusted organisation" but the link to an active github goes part of the way. I'd be happy to use this container for the purpose I've got in mind.
