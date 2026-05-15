---
title: "Codable when the keys don't match"
date: '2022-10-31'
slug: codable-when-the-keys-dont-match
aliases:
  - /2022/10/31/codable-when-the-keys-dont-match/
tags:
  - api
  - codable
  - codingkey
  - json
  - possibly-useful
  - swift5-7
---

![](/images/medieval-door-lock-detailed-drawing.jpg)

A common issue when working with JSON that you vacuum up from internet APIs will be that the key names in the JSON don't match your property names. The JSON de facto standard of using snake\_case in key names could be one cause, or perhaps you just take [variable naming more seriously](https://www.freshconsulting.com/insights/blog/development-principle-1-choose-appropriate-variable-names/) than the person who wrote the API.

We saw yesterday how using codable and the JSONEncoder in Swift makes moving between an object/struct in the code and a stringish representation of it simple. With a couple of small changes, we can also deal with the mismatched key/property name issue.

Let's try yesterday's decode approach with some different JSON:

```swift
import Foundation

struct Person: Codable {
    var id: Int
    var firstName: String
    var lastName: String
    var email: String
}

let jsonString = """
{
"id": 1,
"what_I_call_them": "Jeanette",
"surname": "Penddreth",
"email": "jpenddreth0@census.gov",
}
"""

let data = Data(jsonString.utf8)

let decoder = JSONDecoder()
let newPerson = try decoder.decode(Person.self, from: data)

// never gets here
print(newPerson.lastName)
```

This will fail at line 22. If you look at the JSON you'll notice that the key names don't match our property names. i.e. `what_I_call_them` is not the same as `firstName`. We could solve that in this example just by changing our property names, but Swift has a better way to help us - CodingKey.

CodingKey is an enum that maps our property names to the key names used in the JSON. Here's something that would work for the example above:

```
enum CodingKeys: String, CodingKey {
    case id
    case firstName = "what_I_call_them"
    case lastName = "surname"
    case email
}
```

Just adding this to our struct will make the decode process work perfectly:

```swift
import Foundation

struct Person: Codable {
    var id: Int
    var firstName: String
    var lastName: String
    var email: String
    
    enum CodingKeys: String, CodingKey {
        case id
        case firstName = "what_I_call_them"
        case lastName = "surname"
        case email
    }
}

let jsonString = """
{
"id": 1,
"what_I_call_them": "Jeanette",
"surname": "Penddreth",
"email": "jpenddreth0@census.gov",
}
"""

let data = Data(jsonString.utf8)

let decoder = JSONDecoder()
let newPerson = try decoder.decode(Person.self, from: data)

print(newPerson.lastName)
// Pendreth
```

This is an elegant solution, but for the more common situation - where the JSON returned by an API uses the JavaScript convention of snake\_case instead of camelCase, there is an even easier approach. The JSONDecoder has a _.keyDecodingStrategy_ property. To deal with snake case, we just set that to ._convertFromSnakeCase_. Note line 23.

```swift

import Foundation

struct Person: Codable {
    var id: Int
    var firstName: String
    var lastName: String
    var email: String
}

let jsonString = """
{
"id": 1,
"first_name": "Jeanette",
"last_name": "Penddreth",
"email": "jpenddreth0@census.gov",
}
"""

let data = Data(jsonString.utf8)

let decoder = JSONDecoder()
decoder.keyDecodingStrategy = .convertFromSnakeCase
let newPerson = try decoder.decode(Person.self, from: data)

print(newPerson.lastName)
// Pendreth

```
