---
title: "Using LLMs programmatically"
date: '2026-09-05'
slug: using-llms-programmatically
summary: "A minimal JavaScript demo of calling an LLM from your own code using the OpenAI-compatible chat completions endpoint via OpenRouter, covering API keys, model selection, and request structure. It walks through the JSON response, pointing out finish reasons, reasoning tokens, cost fields, and provider routing."
tags:
  - llm
  - ai
  - programming
  - openrouter
---

![Stone tool use by a capuchin monkey - wikimedia](/images/using-llms-programmatically_stone_tool_use_by_a_capuchin_monkey.jpg)

About a year ago (when everyone else was) I built an [AI chat app](https://github.com/IanKulin/aichat). At the time I was excited about the [Vercel AI SDK](https://vercel.com/docs/ai-sdk) for some reason. The industry is so standardised on the [OpenAI REST API](https://developers.openai.com/api/reference/overview) that I wouldn't bother using a wrapper like the Vercel one now unless I was using Next or one of the other big frameworks.

If you haven't used the API in an app before to make use of LLM functionality from your software, it's pretty simple. This post sets out a minimal demo of doing exactly that.

## API Key

To use a commercial LLM over the web, you're going to need to create an account with them, add some credit then create an API key to use those credits. The exact process varies - Gemini seems to want a subscription at the moment, but [Anthropic](https://claude.ai/settings/billing), [Deepseek](https://platform.deepseek.com), [Open AI](https://platform.openai.com), and all the others work this way.

I generally use [OpenRouter](https://openrouter.ai/) - they provide simple access to a heap of different models, and it saves me from leaving $4.32 credit in ten different places around the web. I don't love that [Stripe has bought them](https://openrouter.ai/blog/announcements/openrouter-is-joining-stripe/) for so much, but they haven't enshitified yet so they're still my favourite dollars-to-tokens provider. We'll use OpenRouter for this example.

Once you have an API key (I generate one for every project so I can scope it, and see the billing per project), let's drop it in the `.env` file:

```bash
OPENROUTER_API_KEY=sk-or-v1-cccccccd8ccccc19dcccc80ccc376ccc70accc84ccca6ccc9fccc47ccc5cccd
MODEL_NAME=z-ai/glm-5.3-flash
```
## Models

You can see I've also set an environment variable for the model name. We are spoiled for choice when it comes to models. I usually start on the [OpenRouter model comparison](https://openrouter.ai/models?output_modalities=text) page. Most of the tasks I use LLMs for are summarising or sentiment analysis - both tasks almost any model does well these days, so I put the price slider down to 10c per million then scroll through looking for flash models I recognise. If you click in to the model description, the two part model name you want will be near the top with a copy button.

## Fetch

For this simplest possible demo, we're going to hit the API endpoint, wait for the response then spit it out to the console. No streaming, and very little error checking etc. Here's the guts of it:

```js
async function callLLM(prompt) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://blog.iankulin.com',
      'X-Title': 'llm-call demo script',
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenRouter API error ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error(`No content in OpenRouter response: ${JSON.stringify(data)}`);
  }
  return text;
}
```

### Request

We're POSTing to the endpoint `'https://openrouter.ai/api/v1/chat/completions'` with a header and a body.

The header must have the `Authorization` so the API can use your API key for billing. In this example we're also providing an `HTTP-Referer'` and `'X-Title'`. These are both optional, but will appear on your billing page which is helpful for figuring out what's going on - for example if you've used the wrong API key, or your app is making calls for different tasks. There's also an [OpenRouter "Top Apps"](https://openrouter.ai/rankings#apps) ranking. If you open up an unguarded chat interface connected to a frontier model you can appear on that page briefly before your credit runs out. 

In the body, we're including the `model` name we discussed earlier, the `role` (this is the `user`, our response will be from the `assistant`) and the actual message `content` - ie our prompt.

#### Roles

In a normal chat app, you need to send the whole conversation on every round, so you'd be sending back `user` and `assistant` message content of the whole chat since this session started. In our demo, we're only ever sending a single `user` prompt.

There's also a `system` role - you might use this as some setup at the start of a session - the "You are an expert on naming cats who is always helpful" type thing.

### Response

When we get our response back, we're extracting out the text only with `const text = data.choices?.[0]?.message?.content?.trim();` I'm sure this immediately prompts you to wonder what other goodies are in the JSON that comes back. The definition for it is [here](https://developers.openai.com/api/reference/resources/responses/methods/retrieve), but there is a small amount of variability in how each company and model fill this out.

It might be fun to look at the actual response I got for "Is Sam a good cat name?"

```json
{
  "id": "gen-1788593821-aJWuwpz3bKFb026SiqDh",
  "object": "chat.completion",
  "created": 1788593821,
  "model": "z-ai/glm-5.3-flash",
  "provider": "Z.AI",
  "system_fingerprint": null,
  "service_tier": null,
  "choices": [
    {
      "index": 0,
      "logprobs": null,
      "finish_reason": "stop",
      "native_finish_reason": "stop",
      "message": {
        "role": "assistant",
        "content": "Sam is a solid choice! It's short and easy to call out across the house, which matters more than you might think when you're summoning a cat. It also works for any gender, and there's something charming about giving cats classic human names—it gives them a bit of a \"little roommate\" personality.\n\nThe only knock against it is that it's fairly common, so you probably won't be the only Sam at the vet's office. But if you like simple, timeless names, it's hard to go wrong.\n\nAre you naming a new cat?",
        "refusal": null,
        "reasoning": "The user is asking a casual, subjective question about whether \"Sam\" is a good cat name. This is a light, conversational question. There's no factual answer here—it's about opinions and considerations.\n\nWhat makes this question interesting? A few angles:\n1. \"Sam\" is actually a pretty popular cat name—it's short, easy to say, has a nice sound\n2. It works for both male and female cats (Sam can be short for Samantha)\n3. Cat name considerations: short names with certain sounds are easier for cats to recognize, names ending in vowel sounds or with \"ee\" sounds are often recommended, but short one-syllable names like Sam work well too\n4. It's a human name, which many people enjoy for pets—the \"little person\" vibe\n5. Famous Sams: Sam from the Lord of the Rings (Samwise), Uncle Sam, etc.\n\nThe question is conversational and casual, so my response should match that tone. I shouldn't over-formalize this or turn it into an essay. A friendly, conversational response works best.\n\nShould I just say \"yes\"? That's boring and not helpful. Should I give a thoughtful take? Yes, but briefly. I can affirm it's a good name and mention why—briefly—and maybe note considerations.\n\nFormat considerations: This should be conversational prose, no headers or bullet points needed for such a casual question. Keep it relatively short—a few sentences to a short paragraph or two. I could share a genuine opinion since the person is asking for one.\n\nLet me think about what's genuinely good about \"Sam\" as a cat name:\n- One syllable, easy to call across the house\n- Ends in a consonant but the \"m\" is soft\n- Gender-neutral (Sam/Samuel/Samantha)\n- It's classic and won't feel dated\n- Human names for cats are charming\n- Easy for kids/guests to remember\n\nPotential downsides (to be balanced):\n- Very common, so less unique\n- No particular meaning\n\nI think a good response affirms it's a solid choice, gives a couple reasons why, maybe adds a light touch. I shouldn't hedge endlessly or write a treatise. This is chitchat-adjacent, so warmth and brevity matter.\n\nLet me draft:\n\n\"Sam is a great cat name! It's short and punchy, which makes it easy to call out, and it works whether you have a boy or girl cat. There's also something charming about giving cats classic human names—it gives them a bit of personality, like they're a little roommate rather than a pet. Plus it's timeless; Sam won't sound dated in ten years the way trendier names might.\n\nThe only downside is that it's fairly common, so if uniqueness matters to you, there might be other Sams at the vet's office. But honestly, a simple, friendly name suits most cats well. What kind of cat are you naming?\"\n\nEnding with a question is nice here—it's a natural conversational move and shows interest. Though I shouldn't always end with questions, in this casual context it feels appropriate and warm. Actually, let me consider: the guidance says I can ask follow-up questions when appropriate in conversational contexts. This seems like a good spot for it—someone naming a cat might appreciate engagement.\n\nLength: Keep it to a short paragraph or two. No lists needed.",
        "reasoning_details": [
          {
            "type": "reasoning.text",
            "text": "The user is asking a casual, subjective question about whether \"Sam\" is a good cat name. This is a light, conversational question. There's no factual answer here—it's about opinions and considerations.\n\nWhat makes this question interesting? A few angles:\n1. \"Sam\" is actually a pretty popular cat name—it's short, easy to say, has a nice sound\n2. It works for both male and female cats (Sam can be short for Samantha)\n3. Cat name considerations: short names with certain sounds are easier for cats to recognize, names ending in vowel sounds or with \"ee\" sounds are often recommended, but short one-syllable names like Sam work well too\n4. It's a human name, which many people enjoy for pets—the \"little person\" vibe\n5. Famous Sams: Sam from the Lord of the Rings (Samwise), Uncle Sam, etc.\n\nThe question is conversational and casual, so my response should match that tone. I shouldn't over-formalize this or turn it into an essay. A friendly, conversational response works best.\n\nShould I just say \"yes\"? That's boring and not helpful. Should I give a thoughtful take? Yes, but briefly. I can affirm it's a good name and mention why—briefly—and maybe note considerations.\n\nFormat considerations: This should be conversational prose, no headers or bullet points needed for such a casual question. Keep it relatively short—a few sentences to a short paragraph or two. I could share a genuine opinion since the person is asking for one.\n\nLet me think about what's genuinely good about \"Sam\" as a cat name:\n- One syllable, easy to call across the house\n- Ends in a consonant but the \"m\" is soft\n- Gender-neutral (Sam/Samuel/Samantha)\n- It's classic and won't feel dated\n- Human names for cats are charming\n- Easy for kids/guests to remember\n\nPotential downsides (to be balanced):\n- Very common, so less unique\n- No particular meaning\n\nI think a good response affirms it's a solid choice, gives a couple reasons why, maybe adds a light touch. I shouldn't hedge endlessly or write a treatise. This is chitchat-adjacent, so warmth and brevity matter.\n\nLet me draft:\n\n\"Sam is a great cat name! It's short and punchy, which makes it easy to call out, and it works whether you have a boy or girl cat. There's also something charming about giving cats classic human names—it gives them a bit of personality, like they're a little roommate rather than a pet. Plus it's timeless; Sam won't sound dated in ten years the way trendier names might.\n\nThe only downside is that it's fairly common, so if uniqueness matters to you, there might be other Sams at the vet's office. But honestly, a simple, friendly name suits most cats well. What kind of cat are you naming?\"\n\nEnding with a question is nice here—it's a natural conversational move and shows interest. Though I shouldn't always end with questions, in this casual context it feels appropriate and warm. Actually, let me consider: the guidance says I can ask follow-up questions when appropriate in conversational contexts. This seems like a good spot for it—someone naming a cat might appreciate engagement.\n\nLength: Keep it to a short paragraph or two. No lists needed.",
            "format": "unknown",
            "index": 0
          }
        ]
      }
    }
  ],
  "usage": {
    "prompt_tokens": 19,
    "completion_tokens": 822,
    "total_tokens": 841,
    "cost": 0.000206925,
    "is_byok": false,
    "prompt_tokens_details": {
      "cached_tokens": 0,
      "cache_write_tokens": 0,
      "audio_tokens": 0,
      "video_tokens": 0
    },
    "cost_details": {
      "upstream_inference_cost": 0.000206925,
      "upstream_inference_prompt_cost": 0.000001425,
      "upstream_inference_completions_cost": 0.0002055
    },
    "completion_tokens_details": {
      "reasoning_tokens": 706,
      "image_tokens": 0,
      "audio_tokens": 0
    }
  }
}
```

I'm not going to go though all of this, but to just pick out a couple of things:

* model/provider - these are the actual ones used. This is helpful since you'll sometimes use a generic model name like "glm-flash" which will just be mapped to the current version. That way your program won't break every time a model is retired. OpenRouter (as suggested by the name) might route your request to other providers (there's many providers of all the good open weight models) based on cost or workload etc. If you were tracking down a response time issue this is a good field to look at.

* finish reasons - you might run out of credit or hit a max_tokens limit part way through a response forcing an early completion. `stop` is the happy path.

* reasoning - is always fun the first few times you see it. I'm annoyed when LLM's ask me engagement bait questions at the end, so I was interested to see how that came about. If the token usage for a request seems high, this train of thought is usually where that's happening.

* cost - if you're building LLM functionality into an app this is probably crucial

* is_byok - "Bring Your Own Key" - it's possible to use your Anthropic or other key through OpenRouter. I don't know why you'd do that, but it would show up here if that's what's been used for billing this response.

## LLM use in apps

When I updated my blog to show post summaries instead of the first paragraph, I wrote a script not unlike the one above that sent off the post text with a prompt asking for a summary which was then inserted back in the post to be used by Hugo. That's the sort of thing that plays to LLM strengths - language processing. I'll probably do something similar in the future to improve the tags.

Demo [source](https://github.com/IanKulin/demo-llm-calling)