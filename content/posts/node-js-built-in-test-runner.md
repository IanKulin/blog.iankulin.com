---
title: "Node.js built in test runner"
date: '2025-03-17'
slug: node-js-built-in-test-runner
aliases:
  - /2025/03/17/node-js-built-in-test-runner/
tags:
  - javascript
  - js
  - testing
  - tools
  - web-dev
---

For the longest time, I've been using [Mocha](https://mochajs.org/) (test runner) and [Chai](https://www.chaijs.com/) (assertion library) for my JS testing. They are reliable old friends.

One of the effects of the existence of [Bun](https://bun.sh/) and [Deno](https://deno.com/) has been to spur Node onto adding some new features, so after appearing as an experimental feature in 18, the Node test runner dropped in Node 20.

I'm not sure if the familiar unit test layout of Mocha and Node is inherited from Jest, or comes from older testing frameworks of which JUnit and NUnit were the first ones I'd ever used. Before that I just used to write tests as lumps of assertions in regular code - which worked but wasn't as pleasant to use as a proper unit test setup. Regardless, the system of bundling a few tests together and having them all run and spit out green ticks is not a new one.

If you are coming from Mocha, there are very few changes to your practice to make. I didn't read [the docs](https://nodejs.org/api/test.html#skipping-tests) to check that I had to begin my test files with 'test' or to put them into a 'test' directory. But I discovered that dragging them into a 'test-dont' directory didn't stop them from running.

### Testing

As well as what ever you're testing, you need to import a couple of things from node:

```
import { isEven } from "../index.js";
import { describe, it } from "node:test";
import assert from "node:assert";
```

Then we can write our tests, grouping them in a describe:

```
describe("isEven", () => {
  it("returns true for even numbers", (t) => {
    assert.strictEqual(isEven(4), true);
    assert.strictEqual(isEven(0), true);
    assert.strictEqual(isEven(-2), true);
  });

  it("returns false for odd numbers", (t) => {
    assert.strictEqual(isEven(7), false);
    assert.strictEqual(isEven(-3), false);
  });

  it("returns false for most floating point numbers", (t) => {
    assert.strictEqual(isEven(3.5), false);
    // sadly, this is true because JavaScript
    // assert.strictEqual(isEven(4.0000000000000000000001), false);
  });

  it("returns false for non-numbers", (t) => {
    assert.strictEqual(isEven("a"), false);
    assert.strictEqual(isEven(null), false);
    assert.strictEqual(isEven(undefined), false);
  });
});
```

Then to run them, just `node --test` and we'll get a nice summary

<img src="/images/screenshot-2025-03-07-at-20.15.43.png" width="800" alt="">

Of course there are a heap of other [assertions](https://nodejs.org/api/assert.html), as well as stuff to set-up and tear-down and to [mock things such as times](https://nodejs.org/en/learn/test-runner/mocking). What I've shown here is very much a getting started, but it also deals with about 80% of my testing needs.

I'm not entirely sure how I feel about moving to a built in test runner. The small convenience I gain has to be weighed up against a small amount of lock in to a run time. I haven't yet been tempted to Deno or Bun, but I love that they exist and are spurring on innovation. Possibly I'll continue with portable testing tools for big projects, but for little ones use the built in.
