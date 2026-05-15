---
title: "Functional Javascript array methods"
date: '2025-04-14'
slug: functional-javascript-array-methods
aliases:
  - /2025/04/14/functional-javascript-array-methods/
tags:
  - arrays
  - functional-programming
  - javascript
  - posts
  - reduce
  - web-dev
---

I've been whipping up a little mock-database unit that has a few access functions but actually stores the data as arrays for a demo project for a post I'm writing. In the process I wrote this gem:

```
export function dbOrdersAdd(order) {
  const orderCopy = { ...order };
  // since id is a stringified number, finding the max is a bit of a mess
  const maxId = orders.reduce((max, o) => Math.max(max, parseInt(o.id)), 0);
  orderCopy.id = String(maxId + 1);
  orders.push(orderCopy);
  return { ...orderCopy };
}
```

In the comment I'm claiming the code is a bit of a mess (and from a readability point that's true) but actually I love the elegance of using the `reduce()` method here.

It also occurred to me, that a year or so ago, these functional array methods were completely novel to me. So I thought it my be interesting to talk about `reduce()`, and why I'm calling it a "functional" method.

## Reduce

If you think of all the things you're likely to do with a collection like an array, the most common thing is to iterate over it. Javascript has you covered - with the `forEach()` method. This just executes the callback function you pass:

```
[1, 2, 3].forEach(x => console.log(x));
```

That's super handy, and gets used a lot. But what if I wanted to do something like summing all the values in an array. In the olden days we might write something like:

```
const numbers = [1, 2, 3];
let sum = 0; 
for (let i = 0; i < numbers.length; i++) {
    sum = sum + numbers[i];
}
console.log(sum); // 6
```

But all the cool young things be like:

```
const numbers = [1, 2, 3];
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum); // 6
```

reduce() is doing a little bit more work for us than forEach(). It is a machine for "reducing" the values in an array to a single number. It takes two parameters. The first one is a function, and the second is the starting value for the 'accumulator'.

In our function above `(acc, num) => acc + num`, 'acc' is used by reduce() as the accumulator, and 'num' is the value from the array. So the steps being carried out in the code above are:

-   set acc = 0
-   apply `(acc, num) => acc + num` where num is 1 - so 0+1=1, acc is now equal to 1
-   apply `(acc, num) => acc + num` where num is 2 - so 1+2=3, acc is now 3
-   apply `(acc, num) => acc + num` where num is 3 - so 2+3=6, acc is now 6
-   save that into `sum`

If we wanted to find the max in an array of numbers we could:

```
const numbers = [1, 2, 3];
const maxnum = numbers.reduce((acc, num) => Math.max(acc, num), 0);
console.log(maxnum); // 3
```

Very nice!

## Functional Programming

There are a million explanations about what functional programming is and what it's strengths are, so for here, let's just summarise it as:

1.  functions are 'pure' - ie they have no side effects, and access and set no values from outside the function. Because of this, the same inputs always result in a particular output. They are fully encapsulated.
2.  The data passed in, and returned is immutable (data in general is immutable)
3.  Lot's of functions - functions as 'first-class-citizens', functions passed into functions. It's function focused - hence the name.

The strengths I like about a functional approach is it's high unit-test-ability, and the elegance of passing a function as a parameter to broaden the scope of a function.
