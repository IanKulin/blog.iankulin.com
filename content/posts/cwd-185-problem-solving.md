---
title: "CWD - 185 - Problem solving"
date: '2023-01-14'
slug: cwd-185-problem-solving
aliases:
  - /2023/01/14/cwd-185-problem-solving/
tags:
  - cwd
  - js
  - web-dev
---

![C-3PO from Star Wars on Tatooine, playing Tic-tac-toe on the side of a crashed spaceship - MidJourney](/images/pucker_c-3po_from_star_wars_on_tatooine_playing_tic-tac-toe_on__66c1149e-de97-45d4-9863-18181aa54cf7.jpg)

```javascript
/* 
Question 1: Clean the room function: given an input of [1,2,4,591,392,391,2,5,10,2,1,1,1,20,20], 
make a function that organizes these into individual array that is ordered. For example 
answer(ArrayFromAbove) should return: [[1,1,1,1],[2,2,2], 4,5,10,[20,20], 391, 392,591]. 
*/

function ctrFunction1(inputArray) {
    //  copy the array since we're mutating it
    const array = [...inputArray];
    array.sort();

    const numberObject = {};
    for (const number of array) {
        if (numberObject[number] === undefined) {
            // this property does not exist, so add it
            numberObject[number] = [];
        }
        numberObject[number].push(number);
    }

    // object now contains arrays for each number, but the ones with a
    // single element need degloved
    for (property in numberObject) {
        if (numberObject[property].length === 1) {
            numberObject[property] = numberObject[property][0];
        }
    }

    // now turn back to array 
    return Object.values(numberObject);
}

const array1 = [1, 2, 4, 591, 392, 391, 2, 5, 10, '2', 1, 1, 1, 20, 20];
const transformedArray1 = ctrFunction1(array1);
console.log(transformedArray1);
// [1, 1, 1, 1], [2, 2, '2'], 4, 5, 10, [20, 20], 391, 392, 591]
```

#### Line 10

When I'm looking at a function, I'd prefer not to also have to hold global state in my head - so I'm all for functional programming as far as that goes. I'm less concerned about side effects, so I wouldn't always bother to copy a parameter like this, but the argument is stronger for an array than an object since in other languages an array might be a value type.

The copy itself is noteworthy since I'm using the cool `[...x]` [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax). This is one of the newish iterator tools which returns any iterate-able data as an array. Since this is right at the top of our function, we're also indicating to the reader we're expecting a one-dimensional array.

#### Line 11

`array.sort()` works as expected, and in place - so our new array is mutated - hence the copying earlier. It can optionally be passed in an arrow function to determine the sort test, but if omitted assumes ascending according to the < and > rules. The format of this function is a bit different that in Swift. For the standard sort it is `array.sort((a, b) => (a - b))` whereas in Swift it would have been `( a > b )`. This is because in JS the function result is compared against zero to see if the positions are swapped. This seems odd, but I'm sure there's a reason.

#### Lines 13-20

The `for (x of y)` syntax is a neat iterator loop for when you need the item (but not index) of a collection. I slightly regret using `number` for the array element - since this is JS it could be number, string or anything.

We check the new object we created to see if it has a property with the name of the current element. For example if this element of our array is 254, we check to see if the object has a property of that name - eg `numberObject.254`. That's the square brackets on the object. It's a neat bit of meta that would be challenging in other languages.

If there's no property with that name we add it as an empty array. The value from the array is appended to this array in the object. So if we had an array of `[2, 2, 3, 4]` we'd end up with an object.

```
2 - [2, 2]
3 - [3]
4 - [4]
```

#### Lines 22-28

Where there's more than one of the same value (as in 2 above) we want an array, but if there's only a single value, we want the raw value. So the next segment of code is to work through each property of the object and change any single values to just their values instead of a single element array. This is a great example of something that's neat and clear in JS but would not be possible in a strictly typed language.

We use `for x **in** y` this time to inspect each property of an object (rather than elements in an array).

#### Line 31

values() is just a standard method that returns an array version of an object.
