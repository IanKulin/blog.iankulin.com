---
title: "De-structuring objects in JS"
date: '2023-01-20'
slug: de-structuring-objects-in-js
aliases:
  - /2023/01/20/de-structuring-objects-in-js/
tags:
  - js
  - web-dev
---

I've worked through my first React tutorial app, and obviously that's a lot - I'm struct by how messy mixing HTML, JS and React is.

One language feature that's being used quite a bit, and that is apparently a JS ability I'd never seen is 'destructuring' object properties. It's very cool and obviously useful. It's a way of extracting just the properties you need from an object and then using them without accesing them via the object. An example will make it clearer.

Imagine we've got a couple of food objects, and we want to test them and provide some dietary advice.

```
const hotDog = {name: 'hot dog', calories: 290, colors: ['red', 'wheat']};
const lettuce = {name: 'lettuce', calories: 0, colors: ['green']};

function eatRecomendation(food) {
    if (food.calories > 200) {
        console.log(`Eat ${food.name} in moderation`);
    } else {
         console.log(`Eat ${food.name} as often as you please`);       
    }
}

eatRecomendation(lettuce);
// Eat lettuce as often as you please
```

The parameter in eatRecomendation() could be destructured like so:

```
function eatRecomendation( {name, calories} ) {
    if (calories > 200) {
        console.log(`Eat ${name} in moderation`);
    } else {
         console.log(`Eat ${name} as often as you please`);       
    }
}

eatRecomendation(lettuce);
// Eat lettuce as often as you please
```

It's still called with the food object, but the destructuring creates just the properties we need as local variables. If you don't love doing this as the object is passed in - I don't because it arguably makes it harder to see from the signature what should be passed to this function - you can keep the object parameter and destructure it inside the function body:

```
function eatRecomendation(food) {
    const {name, calories} = food;
    if (calories > 200) {
        console.log(`Eat ${name} in moderation`);
    } else {
         console.log(`Eat ${name} as often as you please`);       
    }
}

evenBetterRecomendation(lettuce);
// Eat lettuce as often as you please
```
