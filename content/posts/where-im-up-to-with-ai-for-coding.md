---
title: "Where I'm up to with AI for coding"
date: '2025-03-03'
slug: where-im-up-to-with-ai-for-coding
aliases:
  - /2025/03/03/where-im-up-to-with-ai-for-coding/
tags:
  - ai
  - codeium
  - copilot
  - llm
  - ollama
  - web-dev
---

There's still plenty of controversy about LLMs for coding, and not without reason. But I thought I'd run through what I've tried, and where I've landed for using AI. Also what the pitfalls are, where it's useful and how it's changed my practice.

### Issues

##### Training data

The training data for large language models generally is problematic. There's no doubt that they have been trained on copyright material. With code it's slightly less murky since there is a high availability of good quality open source data with attached licenses to train models on. No doubt this include code written by people who don't approve of it being used by AI, but I think the popular reading of most open source licenses is that using it for training is fine.

#### Accuracy

Another area where AI code is better than other AI use is in verifiability. It's possible to write good tests to verify a lot of software behaviour. This somewhat negates the problem of hallucinations.

#### Energy Use

Energy use is an issue I don't really have an answer for. When IT companies are investigating owning their own power stations that's a clear sign that this is a problem that the experts expect to get worse than better. I've lived through so many IT bubbles now that I'm sure that the hype around AI will die down somewhat and there won't be VC money for adding AI to products to make them worse in a few years. Hopefully, AI will be left running in the areas only where it's genuinely helpful like most of the previous IT fashions.

I also have a growing suspicion that we might have got to the end of the performance gains of making models bigger. Surely by now all of the data that can be gobbled up has been, and the improvements seem to be coming in smaller steps. I imagine future gains won't involve making models bigger, but integrating them into tasks more effectively or building them to be more focused.

Nevertheless, for the moment, the power usage, especially for training, and especially that the US energy mix now looks like it's moving away from renewables, is my main concern about AI use.

#### Leaking Data

Another issue is leaking data. This does not overly affect me since I open source my code anyway, but anyone using it in a real job would have to be following policy on this which in most cases would be - don't use it. There are a couple of problems related to the AI vacuuming up all it's context from everything in your projects that does worry me - Because I'm so comfortable in VS Code and git, I keep all my work notes as markdown and manage them in VS Code, and I also use plain text accounting (BeanCount). I don't want any of that data heading out into the AI behemoths, so I'm constantly turning the plugins off and on.

It is possible to use local models, especially if you're on a Mac. I've used [Ollama](https://ollama.com/) with the [Continue](https://marketplace.visualstudio.com/items?itemName=Continue.continue) plugin for code completion and kept my data to myself. More about this experience later.

### What I've tried

I used Github Copilot for the trial period and was so impressed with it I paid for the service for a couple of months. This was mainly for code completion although I did use the chat a bit - it just wasn't as comfortable in the editor.

I switched to [Codeium](https://codeium.com/) after hearing Kevin Howe on a [Syntax episode](https://syntax.fm/show/728/ai-superpowers-with-kevin-hou-and-codeium). For code, this seems right on par with my (now outdated) experience of Github Copilot. Copilot did seem a bit better at figuring things out from the context though - for example my plain text accounting format is probably not in the training data for either service, but when I was letting it they both would produce suggestions in the correct format, but Copilot was making better suggestions. For example it would suggest an expense was for fuel if the payee was a petrol station who appeared elsewhere in my current file.

I then discovered Ollama, and with an M1 MacBook it's a really simple matter to just pull models down and play with them. Mostly at the command line, but I did use [Open Web UI](https://github.com/open-webui/open-webui) a bit for a more ChatGPT like experience. I played around with trying to do RAG via Open Web UI but with poor results.

Using Ollama (which provides a REST type API to your models) I switched to the Continue VS Code plugin so I could do code-completion locally. This worked fine, but, 1) it was a bit slower than Copilot or Codeium. Only by a bit, but the difference was it was thinking slower than me, so I would have to wait for it, whereas with the big online services I was constantly typing over their suggestions, so I gave up on it. If my current M1 MacBook dies I'll buy an M4 and try this again.

I have used, and continue to use, a combination of Claude, ChatGPT, V0, and DeepSeek Coder in the web browser chat modes. In fact, this is probably my main use. I don't pay for any of them (thank you venture capitalists) and just move across to a different one when I run out of free queries.

Most of this use is the sort of questions you might ask your mates at work - how would you tackle this? what a good library for? what do you think of this approach? can you have a look over my code and suggest improvements? Working in webchat mode reduces the context available (compared to your entire project) but I've grown to actually prefer the tight control it gives me when I'm asking specific code questions.

### How I use it now

I use Codeium via its VS Code plugin for code completion. Sometimes this is amazing - it spits out what's in your head, and follows your naming conventions etc. Other times it doesn't and I just keep typing.

What it's really good at is anything repetitive. I especially love it for tests, once I've written a couple of tests against edge cases in my code, it gets the flavour of what I want and starts writing good ones, including some I wouldn't have thought of which is gold. This is often a tab, tab, tab, exercise.

I spend a lot of time in long form conversations in the web interfaces of the major chatbots. Usually this is quite fruitful. I often get it to generate code, or to add behaviours to code I've given it which I then transfer over manually. If it gets into a muddle, I usually clear it's memory and start a new chat or move over to a different service. Having the wrong ideas or code in the context seems to lead to a chain of stupider and stupider attempts to fix the symptoms of a problem rather than going back and identifying it. It's possible that my fresh explanation of what I'm trying to do, the code I've got and what the issue is is also helpful in this restart.

### How it's changed my style

With any tool, using it well involves understanding it's strengths and leaning into them. AI is no different, and here's the things I do to help it help me, or things that it's made possible.

The first change has just been to improve my craft in ways I should have been otherwise, but as a solo developer you can let slide. This is stuff like clear comments, thoughtful descriptive names, and good separation of ideas. This helps the AI as much as it would help someone reviewing your code, or future you when you come back to maintain it. I like my files to be smaller than I used to. 500 lines is a guideline for me.

I already liked old and popular tech before, but now I really like it. Think of the difference of the training corpus for Node/Express vs the latest iteration of SveltKit V2. You just get better answers and suggestions for things the AI knows better.

The last change is that I'm much more likely to change to an appropriate library or technology. The annoying friction of not knowing the exact syntax for things disappears since the AI can generate code with correct syntax for me. It makes my programming skills much more portable. Of course you need to invest in some of the high level understandings to know what you should want to do, but once you know that, you don't need to know what to type to achieve that in the way you did a couple of years ago.

I'm sure I should know better how to regex, and to remember the common ffmpeg or rsync flags, but I'm never going back to spend time on those jobs!
