---
title: "Classes in JavaScript"
date: '2023-01-07'
slug: classes-in-javascript
aliases:
  - /2023/01/07/classes-in-javascript/
tags:
  - posts
---

First lesson with classes today. First of all I was pleased to see they exists since we've just been plucking objects out of thing air like:`}`

```js
const userIan = {name: 'Ian', language: 'Indonesian'}
```

but with classes we can declare a class and instantiate an object of it:

```js
class User {
    constructor(name, language) {
      this.name = name;
      this.language = language;
    }
}

const ian = new User('Ian', 'Indonesian');
console.log(ian.name);
```

There's (at least) single inheritance:

```js
class User {
    constructor(name, language) {
      this.name = name;
      this.language = language;
    }
}

class Administrator extends User {
    constructor(name, language, permissions) {
        super(name, language)
        this.permissions = permissions
    }
}

const ian = new Administrator('Ian', 'Indonesian', '-rw-r--r--@');
console.log(ian.name);
```

Of course it's JS, so there's no named arguments, and if you miss one off in a call to the constructor there's no issue until you try to use it.

Methods are declared without a keyword:

```js
class User {
    constructor(name, language) {
      this.name = name;
      this.language = language;
    }

    asString() {
        return `name: ${this.name} language: ${this.language}`;
    }
}

const ian = new User('Ian', 'Indonesian');
console.log(ian.asString());
```

Or we could do that as. computed property using 'get':

```js
class User {
    constructor(name, language) {
      this.name = name;
      this.language = language;
    }

    get asString() {
        return `name: ${this.name} language: ${this.language}`;
    }
}

const ian = new User('Ian', 'Indonesian');
console.log(ian.asString);
```

You don't have to have a constructor, just declare the fields:

```js
class User {
    name;
    language;

    get asString() {
        return `name: ${this.name} language: ${this.language}`;
    }
}

const ian = new User;
ian.name = "Ian"
ian.language = "Indonesian"
console.log(ian.asString);
```

Probably a good idea to have default values in that case though:

```js
class User {
    name = '';
    language = 'English';

    get asString() {
        return `name: ${this.name} language: ${this.language}`;
    }
}

const ian = new User;
ian.name = "Ian"
console.log(ian.asString);
```
