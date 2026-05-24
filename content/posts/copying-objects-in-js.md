---
title: "Copying Objects in JS"
date: '2024-01-15'
slug: copying-objects-in-js
aliases:
  - /2024/01/15/copying-objects-in-js/
tags:
  - code
  - javascript
  - web-dev
---

I've paid for a month of Mosh to do his [React 18 course](https://codewithmosh.com/p/ultimate-react-part1), and one of the things he makes a big deal about is not to go too deep with nested objects for your state. As soon as you start to update them it becomes apparent why.

Because of the way state works in React, if we need to update part of an object it has to be deep copied, the changes applied to this copy, then that new copy passed back to React to replace the previous version. So, how we copy objects becomes a matter of particular interest.

### Spread operator

JavaScript has some good tools to help us here, the primary one being the spread operator. Imagine we want to create a value copy of this object:

```
const originalObject = { name: 'John', age: 25, hometown: 'Birmingham' };
```

We can't just assign this:

```
const newObject = originalObject;
```

Since now both 'newObject' and 'originalObject' both point to the same in-memory object. So if we changed `newObject.name = 'Ian',` then `originalObject.name` would also become `'Ian'`.

What we really want is something like this:

```
const newObject = {name: originalObject.name, age: originalObject.age, hometown: originalObject.hometown};
```

This conveys our intent really clearly, but is very quickly going to be come tedious, especially as the objects grow. Luckily, JS has a cool solution for this - the spread operator. We can replace the code above with:

```
const newObject = { ...originalObject }
```

What's even nicer (especially in the context of making changes to React state) is that we can selectively replace parts during the copy. If we needed an object for John's twin we could do this:

```
const newObject = { ...originalObject, name: 'Jill');
```

### Nested

So the above works great for flat objects, but what about when there's some nesting. Let's consider this object:

```
{  name: 'John',  age: 25,  subjects: [ 'engineering', 'anatomy' ],  hometown: 'Birmingham'}
```

Now there's an array inside the object, if we do a shallow copy with a spread:

```
const newObject = { ...originalObject }
```

The the array will only have been copied by value, to copy the whole thing properly (which we'll need to do before we alter it and give it back to React) we'll need to manually spread the array as well.

```
const updatedObject = {  ...originalObject,  subjects: [...originalObject.subjects]};
```

If we want to enroll John in maths, we can just add that in when creating the array:

```
const updatedObject = {  ...originalObject,  subjects: [...originalObject.subjects, 'maths']};
```

For removing a subject we can use JS's array.filter() method:

```
const updatedObject = {  ...originalObject,  subjects: originalObject.subjects.filter(subject => subject !== 'anatomy')};
```

You can see how this is quickly going to get messy if this was an array of objects inside out object, and we had to go down another level. Hence the advice to avoid that.
