---
title: "Codable &amp; JSON"
date: '2022-10-30'
slug: codable-json
aliases:
  - /2022/10/30/codable-json/
tags:
  - code
  - possibly-useful
  - swift-language
  - swift5-7
---

![encryption machine, comic 27970 - Stable Diffusion](/images/encryption-machine-comic-27970-.png)

If we mark a type with the protocol _Codable_, we're specifying that this type has the capability of having it's properties encoded to some format, and decoded back again.

So far in the #100Days this has been used to write and read data in UserDefaults, and to encode an object to send it as a URLRequest, then receive data back and create a new object from it. It's a handy, powerful feature baked into Swift that just requires the developer to ensure any types that need this functionality comply with the _Encodable_ and _Decodable_ protocols that make up the Codable.

I assume there's some magic (by magic I guess I mean code created during the compile/build process - or perhaps a language feature that lets us enumerate the property names of a type? ) that allows Swift to step through each property in a composite type in order to encode or decode via the encoder/decoder

#### Making a type Codable

For simple situations, you just add the Codable protocol to your type. If all the properties inside that type are Codable, then your struct/class will be to. All the straightforward built in types are.

```
struct Chair: Codable {
    var name: String = ""
    var legs: Int = 4
}
```

Since String and Int are codable, the Chair struct will be as well. I'll deal with how you fix a type that's not codable another day.

#### Encoding

To encode our data we need an encoder. We'll use the Foundation JSONEncoder, but there are others such as [XML](https://github.com/ShawnMoore/XMLParsing) and so on.

```
struct Chair: Codable {
    var name: String = ""
    var legs: Int = 4
}

let stool = Chair(name: "Stool", legs: 3)
let encoder = JSONEncoder()

do {
    let jsonData = try encoder.encode(stool)
    print(String(data: jsonData, encoding: .utf8)!)
} catch {
    print("Encoding Error")
}
```

This prints out:

`{"name":"Stool","legs":3}`

So the property names are used to build our data. The "data" returned by the JSONDeconder is a UTF8 string - this is specified by the JSON standard, and that's why the print above is not just `print(jsonData)`.

#### Decoding

```
// use # to delimit a string that contains double quotes
let jsonString = #"{"name":"Kitchen chair","legs":4}"#

// convert our Swift string into the UTF-8 data type expected
let data = Data(jsonString.utf8)

let decoder = JSONDecoder()
let newChair = try decoder.decode(Chair.self, from: data)

print(newChair.name)
// Kitchen chair
```

#### Wrap up

I've used the simplest cases here to show how the basics work, but there's a couple of common situations that require a bit more work. The most common is that the JSON you are trying to decode has non-swifty keys. It's common for JSON keys to be snake\_case rather than camelCase. Another issue is if our type needs a bit of work to make it codable. There's some overlap in these situations that well look at another time.
