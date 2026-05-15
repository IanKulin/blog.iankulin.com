---
title: "Using LLMs for coding"
date: '2024-07-01'
slug: using-llms-for-coding
aliases:
  - /2024/07/01/using-llms-for-coding/
tags:
  - ai
  - chatgpt
  - code
  - codium
  - copilot
  - llm
  - posts
  - vscode
  - web-dev
---

[![Ghost in the Shell
© Manga Entertainment 1996
](/images/ghost-in-the-shell_07.png)](https://madmuseum.org/events/ghost-shell)

This post looks at the context for some of my thinking about AI for supporting software development, and where I've landed on it for the time being.

### The landscape

I [briefly wrote about ChatGPT's](/chatgpts-code-writing/) coding ability at the end of 2022. The wide availability of this tool marked the beginning of what I think can fairly be described as a revolution. The controversies that have crystalised since have not dampened my amazement of this step forward in what compute can do, especially around natural language processing.

The next big news in this story was Microsoft's launch of Github Copilot. In business terms this was a brilliant move - owning the most popular code editor, and leveraging the world's biggest collection of public code to create a product that [millions of people](https://visualstudiomagazine.com/Articles/2024/02/05/copilot-numbers.aspx) are prepared to pay $10 a month for can only be regarded as a success.

At the same time as Microsoft established a new revenue stream, LLMs have been an exciting area of open source growth, especially the excellent Python libraries and the tools in the LangChain ecosystem.

It's not all rainbows and unicorns though - there's a few valid points that AI skeptics have coalesced around.

-   Training data - although this is a bigger issue for general models (where masses of web content has been vacuumed up) than it is for code, it is still an issue. If a model is trained on some non-permissively licensed code, and the generative AI I'm using includes that code in a commit, then a license, or at least some ethics have been breached.
-   Quality (1) - You can see from the feature images in many of the posts in this blog during my MidJourney enthusiasm that generative AI is not perfect. Before I abandoned them I started to prefer the mangled writing and fingers of the engines, but no one wants the software equivalent of mangled fingers in their codebases. I suspect this particular aspect of the quality of the code will probably have a technological solution - we're in the very early days after all.
-   Quality (2) - A trickier quality problem is people writing code using AI where they do not fully understand the code they are committing. I imagine this is going to be a growing issue for projects, especially anything with a profit motive such as bug bonuses. Projects have mechanisms like code reviews and pull requests, but if submissions can be low-effort and checking them is high-effort, that asymmetry is going to be painful.
-   Poisoned well - As the amount of AI code in codebases increases, then AI is trained on those codebases this will quickly become a snake eating it's tail as AI is training itself on it's own code. If allowed, this would tend to slowly evolve future codebases to use techniques favoured by early coding LLMs. The current amount of machine influenced code on [GitHub is definitely not 41%](https://decrypt.co/147191/no-human-programmers-five-years-ai-stability-ceo) but it must be some, and is likely to increase, so this is a factor that will need some thought.
-   Exfiltrating code - if you use an external LLM, such as GitHub Copilot to write commercial code, who can see your code? Since it's being transmitted to the AI in order to make autocomplete suggestions, the answer is Microsoft, or some other company. How does that intersect with your company's policies? I assume, based on the questions I've asked Copilot over the last year, that I'd never be considered for a coding job at Microsoft :-)

### I, for one, welcome our new robot overlords

![](/images/hailants-1.jpg)

In an industry particularly known for excessive hype-cycles, it's important to critically examine what we're doing, but for the moment, I've landed on the position that these are good tools for me to use. Here's my thinking.

My situation is that I'm a very experienced developer, with solid expertise in several languages and programing paradigms, and with a degree that was strong in looking at the meta level of languages and software development processes, but, I've got no professional experience in modern languages. Because of this, a lot of my process has been knowing what I wanted to do, using google or stack overflow to figure out the mechanics of that in whatever language I'm using, then translating that into the context of the code I'm working on. Generative AI fits extremely well into that need - instead of jumping into a browser window to look something up, I'm just writing a descriptive comment of my intentions, then tabbing through the suggestions to chose an approach.

My particular style is also well suited to these tools - I like clear, simple to reason about code. If I can write a pure function for something, I do. I like to break my code up into separated concerns with clear interfaces, I don't prematurely optimise. I use descriptive variable, function and object names. I like to work with established, well documented languages and popular libraries, and I prefer to reduce external dependencies. All of these habits make it easier for an AI assistant to access the context of what I'm doing, and therefore to make better quality suggestions.

### My journey

I started out using ChatGPT 3 then 3.5 as a sort of super-google/stack-overflow eliminator.

Then with the public launch of [GitHub Copilot](https://github.com/features/copilot), I trialed that in VSCode and it was a great experience. I guess they didn't invent the idea for the greyed out auto-complete suggestion you can tab to accept, but it feels like a natural way to work with this stuff.

I paid for Copilot for a couple of months. But then heard about [Codium](https://codeium.com/), probably on [Syntax](https://syntax.fm/show/728/ai-superpowers-with-kevin-hou-and-codeium), which is free for individual developers (for now - thank you VC funding). I haven't done any careful comparisons, but its definitely of the same order. I suspect Copilot is doing something better with the local context. For example I use a plain text accounting system called [Bean Count](https://beancount.github.io/docs/beancount_language_syntax.html#transactions) in VSCode. Copilot is able to understand these transactions and make much useful suggestions than Codium. I assume this is just inferred from my local files since there would not be much training data for them, and it suggests the correct accounts based on the payees which must be from local context.

I've probably done more work with Codium, 80% of it on Javascript, than with Copilot. It's definitely a workable solution and a great choice if you want a Copilot type experience without paying for it, or have questions about Microsoft's training data.

More recently I've started playing with local models to avoid the problem of exfiltrating my code - I strongly feel I can't use AI assisted coding with client code if I don't know what's happening it. If I can run a local model, that problem is avoided.

I code on an early M1 MacBook, so [Ollama](https://ollama.com/) is an easy to use choice. I've tried [llama3](https://ai.meta.com/blog/meta-llama-3/) and [codeqwen1.5](https://qwenlm.github.io/blog/codeqwen1.5/) in the terminal for a bit, but missed the ChatGPT web experience. To get that back, I've been running [Open WebUI](https://openwebui.com/) in a docker container.

More recently, I've installed the [Continue](https://docs.continue.dev/intro) VSCode extension that allows those Ollama managed models to work in VSCode, including the auto-suggestions (following [Dave Gray's blog post](https://www.davegray.codes/posts/bye-copilot-how-to-create-a-local-ai-coding-assistant-for-free)). I've got a few long flights coming up over the next week, so it will be good to be able to work offline with that help.

I haven't really done more than play with CodeQwen in VSCode via Continue so far, but my initial impression is that it's comparable to Copilot, although the extra second of waiting for auto-suggestions did make me look up M3max MacBook pricing. Logic tells you that a 4GB model on a MacBook is going to be less capable than the giant GPT4 powered Copilot, but [this comparison](https://qwenlm.github.io/blog/codeqwen1.5/) suggests the difference is not an order of magnitude (although the model size is). From limited playing around in small JavaScript codebases, they seem similar, with the local model just being a bit slower.

If this is a revolution, it's one we're at the start of, and I certainly reserve the right to change my mind about AI assistance in coding, but I suspect it's our future and I'm excited at the productivity boost it currently gives me working in languages I'm new to.
