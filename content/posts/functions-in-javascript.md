---
title: "Functions in JavaScript"
date: '2023-01-09'
slug: functions-in-javascript
aliases:
  - /2023/01/09/functions-in-javascript/
tags:
  - javascript
  - possibly-useful
  - web-dev
---

![](/images/pucker_factory_with_robot_workers_on_an_assembly_line_making_bo_dadc6d24-8873-48f2-97aa-df5508e6e625-1.jpg)

As with other languages, functions are a little lumps of code with their own scope. They can optionally take some arguments, and optionally return a value.

In JavaScript they often have names, can be passed around as types and have a condensed form suitable for functional programming.

```
function addNums(a, b) {
    return a+b;
}

console.log(addNums(3,4)) // 7
```

#### Scope

Arguments are passed in by value so they have local scope only in the function body.

```
function someFunction(firstNumber, secondNumber) {
    firstNumber = 7;
    return firstNumber+secondNumber;
}

let c = 5;
someFunction(c, 10);
console.log(c);
// 5
```

Of course this won't prevent the contents of reference types from being mutated:

```
function someFunction(numberArray) {
    numberArray[0] = 7;
}

let c = [5];
someFunction(c);
console.log(c);
// [7]
```

Functions can access values from the the scope they are called in:

```
const a = "hello";

function printA() {
    console.log(a);
}

printA();
// hello
```

This always seems like a bad code smell to me. The tiny bit of extra work to pass it in is worth it. It makes for more readable and testable code. In a pinch, I might use capitalised const (reminiscent of `#define PI 3.147`) but even they can usually be passed in. There's an argument about performance, but not optimising for performance till you've hit a problem is a good rule.

A variable declared inside a function should not exist outside of the function:

```
function someStuff() {
    const a = 5;
    let b = 2;
    return a+b;
}

console.log(a);
// Uncaught ReferenceError ReferenceError: a is not defined
console.log(b);
// Uncaught ReferenceError ReferenceError: b is not defined
```

Don't use `var`, but I had the same result for it in Chrome/Firefox and node.js

Functions can be nested inside other functions and that's a good idea to avoid polluting the namespace if it meets your needs:

```
function addTwo(someNumber) {
    
    let a = addOne(someNumber);
    a = addOne(a);
    return a;

    function addOne(number) {
        return number+1;
    }
}

console.log(addTwo(7));
// 9

console.log(addOne(1))
// Uncaught Reference Error
```

#### First Class Citizens and arrows

We can assign a function to a variable, then use that to invoke it:

```
function addNums(a, b) {
    return a+b;
}

const someMaths = addNums;

console.log(someMaths(3, 4));
// 7
```

We can also do that directly:

```
const someMaths = function addNums(a, b) { return a+b; };
console.log(someMaths(3, 4));
// 7
```

If we're doing that, we don't really need the old function name any more since we're not using it:

```
const someMaths = function (a, b) { return a+b; };
console.log(someMaths(3, 4));
// 7
```

It's also possible to make these even more compact in modern browsers by using "arrow functions". Just use a fat arrow between the parameters and the function body:

```
const addTwoNums = (a, b) => { return a+b; };
console.log(addTwoNums(3, 4));
// 7
```

In a one-liner we can eliminate the curly braces and return since it's implied:

```
const addTwoNums = (a, b) => a+b;
console.log(addTwoNums(3, 4));
// 7
```

If there's only one argument, we could eliminate the parentheses as well:

```
const addFive = a => a+5;
console.log(addFive(3));
// 8
```

What's the point of being able to treat functions as variables? Mainly so we can pass them into other functions, or return them from functions. Here's passing them in:

```
const addTwoNums = (a, b) => a+b;
const multiplyTwoNums = (a, b) => a*b;

function doSomeMaths(c, d, process) {
    return process(c, d)
}

const e = doSomeMaths( 4, 2, addTwoNums);
console.log(e);
// 6

const f = doSomeMaths( 4, 2, multiplyTwoNums);
console.log(f);
// 8
```

And here's returning a function.

```
function randomMathsFunc() {
    if (Math.random() > 0.5) {
        return (a, b) => a+b;
    } else {
       return (a, b) => a*b; 
    }
}

const someFunc = randomMathsFunc();
console.log(someFunc(3, 4));
// sometimes 7, sometimes 12
```

Returning functions is not super common, but passing a function around happens all the time. We frequently want to pass functions as error handlers, or to respond to events that happen later.

It's also great for some functional flavour programming. For instance a common pattern is to iterate over an array to do something to the values and create a new array. It would be great if we could encapsulate that into a method on the array - it would avoid some horrible subscript off by one crashes for a start - but the operation we want to do on the array elements is going to vary from situation to situation. To address that, we could just pass in a function that had the code for the operation we wanted.

In fact, there is an array method like this called `map`.

```
const firstArray = [2, 3, 4, 5];
const plusTwo = a => a+2;
const secondArray = firstArray.map(plusTwo);
console.log(secondArray);
//[4, 5, 6, 7]
```

Once you've got it clear in your head how the arrow functions work, it's actually clearer to eliminate the superfluous variable and pass them directly:

```
const firstArray = [2, 3, 4, 5];
const secondArray = firstArray.map(a => a+2);
console.log(secondArray);
//[4, 5, 6, 7]
```
