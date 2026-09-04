---
title: "Good AI Questions"
date: '2026-08-20'
slug: good-ai-questions
description: A look at my LLM supported webdev process in light of the open questions flagged by Manuel Schipper.
summary: "Prompted by Manuel Schipper's piece on technical leaders and AI, the I document my current workflow for using LLMs in web development. This approach keeps context small and explicit — frequent clearing, markdown summaries passed between stages, no background agents or MCPs — supported by a personal library of prompt playbooks that encode my stack and conventions. Work proceeds in discrete stages (exploration, plan, AI and human plan review, implement, checking) so problems surface at the document level before code gets written."
tags:
  - ai
  - llm
  - coding
  - webdev
---

Manuel Schipper writes in his blog this week about ["Technical leaders should have the largest AI exhaust"](https://schipper.ai/posts/technical-leaders-should-have-the-largest-ai-exhaust/). The thesis is that engineering leaders should be investing time (and tokens) in figuring out how to be effective with LLM tools, but most interesting for me was the set of open questions about AI development he proposes.

I won't re-produce them here, since it's about half of his short post (you should just read it). But it does prompt me to document yet again, how I'm currently using LLMs for web development.

I use LLMs in deliberately small stages, with explicit, supervised hand-offs between them, so that I can review the work before unhelpful paths are taken. My theory is that this is making the best use of the AI *and* me.

## Themes

### Context management

Along with Manuel, I continue to feel this is one of the most important concepts. Current models can have huge context windows, but whenever I get rubbish from an LLM that I can detect, it's as part of large-context process. To avoid this, all of my work is broken into short chunks, usually aimed at producing a markdown summary that will be part of the input into the next stage. I'm constantly `/clear`ing to start with an empty context. I delete these documents once they are translated into code to stop the LLM from absorbing them in its own quest for context.

Functional decomposition is as important as it ever was. I spend proportionally more time on this now; thinking about how the code is arranged and how processes are broken into parts. A pure, thoughtfully named twenty-line function is as delightfully comprehensible to an LLM as once it was to future me.  

I don't allow background agents, sub-agents or project memories. My aim is to keep the working context explicit; once context starts accumulating somewhere I can't easily see or control, I lose one of the main benefits of this workflow. Similarly, I don't use MCPs (except Playwright) or skills. I want to know the whole context - so it goes in the prompt window, or comes from the code.

### Prompt library

I have a house stack and style that I want replicated in every project where it makes sense. Then I can navigate the architecture and code competently. I don't want every problem to feel like I'm sitting down at a foreign codebase. I know LLMs can guide us through that, but if the LLM follows the conventions I've built up from experience, we avoid the problems ahead of time and/or I know where to work in order to do things.

These are not anything dramatic - the biggest one is my stack for SSR apps, others for code review, HTML/CSS audit, addressing a single tem from a code review etc. The first versions were mostly developed by an LLM pointed at all of my production repos and told to pull out the common quality practices, then as I run into issues they get added to. I used to have a template app for some of my project types that I'd copy over - this is a bit like that except it can be applied to existing projects as well.

![Screenshot of SSR playbook](/images/good-ai-questions-ssr-playbook.jpg)


### Early review

There's two reasons why I like to produce documents which form the input for the next coding stage.

#### Molehills, not mountains

In the before times, software development predominantly followed a 'waterfall' method, and young programmers knew systems such as SSM, SSADM and Yourdon/DeMarco. The intent here was that because coding was incredibly expensive and could take years to deliver, we should very carefully specify every detail up front at the start of the project and get the owner to sign off on it.

Although the pre-conditions (code cost and speed) have been inverted, it's still the case that it's easier and cheaper to fix problems earlier in the process.

#### Human input at the higher abstraction level

This is where I play the role of lead developer to the LLM. They have a summary of what they are trying to do, followed by a proposal of how to implement it. I get to tweak it, or to say 'no - you're falling into <xyz> trap', 'but what about <xyz>?', or 'here's a better way to do this because...'. 

Since I'm not reading code except to skim it or make trivial changes, this is the stage where I'm using my expertise.

## In practice

Currently my flow is something like this:

* Exploration. 

Some prompt along the lines of "I'm considering feature/bugfix/chore <xyz> by <some approach>. Have a look through the codebase and let me know if that's viable, what other things I should consider, or if there's a simpler or better way to do it."

Often there's a bit of back and forth to get it all clear in my head. I'll often have a notepad open for a larger change and be jotting down points, questions or thoughts.

* Plan. 

I'll make the decisions, clear the context, then prompt for a written plan to be saved as markdown to implement the change. This will include the intent of the change, but also resolve any of the open questions I learned from the previous step. LLMs are excellent at making assumptions for the things you don't tell them, but I don't want those assumptions to surprise me - hopefully we've surfaced them in the previous step.

* AI plan review

I'll clear the context, and prompt something like "We're trying to [achieve X]. Have a look at @plan-name.md and check that it accomplishes its goal, is correct against the codebase, and doesn't overcomplicate things.". This almost always turns up a couple of minor errors or things to clarify.

* Human plan review

I'll read the plan. The plans (I guess from the system prompt) usually contain code snippets rather than big chunks of code.

They are also usually good - depending on the model, harness, amount of conventions already established in the codebase (for example, e2e tests), and task complexity. Usually I'll make minor changes directly in the markdown document, often they are fine as is, and rarely I'll dump the whole thing or go back a couple of steps. 

* Implement

Clear the context, prompt "Implement <plan-name.md>"

* Checking

I'll usually run the lint/format/typecheck/unit test/e2e test process even if it looks like the model has. I still have PTSD from when models would claim a test must have been broken before their change. I'll exercise the new feature with any edge cases I can think of. Then I look through the diffs. This isn't a comprehensive review; I just want to see what changed and where, without being surprised by any of it. I pay some attention to test coverage, and close attention to any tests that have been removed or altered.

## Conclusion

This whole process (from initial prompt to commit) could be a few minutes to a couple of hours' work depending on the scale of the change. The longest-running implement stages where the agent is doing a very large amount of work compared to me is usually greenfield projects where it's using one of my playbooks, otherwise it's something of a pair programming approach.

I do note that some of my habits (around having a plan, then clearing the context) are built into current harnesses/system prompts these days - for example if you just prompt for a sizable change in a fresh Claude it will do some exploration in a sub-agent, then save a plan in its secret memory spot, clear its own context and implement it. I don't trust it, but do regard it as validation of my current method.

As mentioned in all my posts about how I'm using AI, this is an area of rapid development so my system will no doubt change soon.