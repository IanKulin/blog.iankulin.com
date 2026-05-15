---
title: "Classes in JavaScript"
date: '2023-01-07'
slug: classes-in-javascript
aliases:
  - /2023/01/07/classes-in-javascript/
tags:
  - posts
---

![futuristic machine making copies of people - midjourney](/images/pucker_futuristic_machine_making_copies_of_people_f1076d37-add2-4592-952b-ac8ac30c7a5c.png)

First lesson with classes today. First of all I was pleased to see they exists since we've just been plucking objects out of thing air like:`}`

```
const userIan = {name: 'Ian', language: 'Indonesian'}
```

but with classes we can declare a class and instantiate an object of it:

```
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

```
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

```
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

```
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

```
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

```
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
