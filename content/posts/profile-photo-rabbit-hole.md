---
title: "Profile Photo Rabbit Hole"
date: '2022-11-13'
slug: profile-photo-rabbit-hole
aliases:
  - /2022/11/13/profile-photo-rabbit-hole/
tags:
  - api
  - hash
  - posts
  - swift5-7
---

I'm on [day 60 of #100Days](https://www.hackingwithswift.com/guide/ios-swiftui/5/3/challenge), and have just wasted most of an evening's coding time going down a rabit hole I didn't need to. The app for this challenge is called "FriendFace" and is pretty straightforward: download a heap of JSON which is an array of users. Show it in a list that can be clicked through to see the details of that user.

I did that, and instead of moving onto the next project, decided I'd like to show a profile picture of each person. There's no data for that, so I'll use a fake photo. I use the Stable Diffusion AI for many of the pictures in this blog, so I assumed there would be an API for grabbing a fake profile pic from somewhere. It turns out there are several, but they are paid services.

Never mind, I know [unsplash](https://unsplash.com/) is a great source of free images, and they definitely have a portrait category. I'll get them from there. Instead of using a REST api, I just wanted to grab them from a URL. After a bit of googling around, it turns out you can just use the url https://source.unsplash.com/collection/9948714?372 and change the number after the question mark to get a different portrait.

Now all I need is a way to generate a number 1-1000 such that it's always the same for each individual user. That's basically a hash, and Swift has a hashValue property on it's string. I tried user.name.hashValue % 1\_000, but kept getting different pictures. Pulled up a playground and tried some print() debugging, and the hashValue was different each run. It would be the same if I hashed the same string twice in a row in code, but not between runs. A few googles later, I've learned this is deliberate.

So I need to write my own hash. This is not cryptography - I can just sum all the ascii values of the characters in the string and modulo them. I'm a bit hazy on how to get every character in a Swift string because of the unicode thing, but rmaddy has [this answer](https://stackoverflow.com/questions/51606011/4-bit-hash-from-string-in-swift):

```swift
extension String {
    var fourBitHash: Int {
        return self.utf8.reduce(0) { $0 + Int($1) } % 16
    }
}

let colorIndex = "John R Smith".fourBitHash
print(colorIndex)
```

Perfect. I adapt this into my code as:

```swift
func simpleHash(_ string: String) -> Int {
    string.utf8.reduce(0) { $0 + Int($1) } % 1000
}
```

And we're in business, but hang on, I'm still getting a different picture by repeatedly going into the view detail for the same user. I try pasting in the url a few times, and sure enough, unsplash are serving up random portraits for the same URL....

Okay, so I need a different source for pics. More googling, and I discover [RandomUser.me](https://randomuser.me/) They only have 100 profiles for men, and another 100 for women - but this app is only for me, and I'll probably get bored after I've clicked on three or four so that will be fine. I throw that into my AsyncImage and we're in business.

```swift
AsyncImage(
    url: URL(string: "https://randomuser.me/api/portraits/women/\(simpleHash(user.name)).jpg"),
    scale: 3
) { image in image
        .resizable()
        .scaledToFit()
} placeholder: {
    ProgressView()
}
```

I'd prefer to show the correct gender (I'm not being deliberately binary, I'd just like to double the number of photos) , and there is no gender field in my data. So, I guess I'll need an API that guesses gender based on a name input based on a giant lookup table or an AI model.

More [googling](https://stackoverflow.com/questions/1685559/find-the-gender-from-a-name), and I find [stomgren's](https://stackoverflow.com/users/1608667/stromgren) genderize api. An input of:

`[https://api.genderize.io/?name=ian](https://api.genderize.io/?name=ian)`

returns:

```swift
{
  "count": 306685,
  "gender": "male",
  "name": "ian",
  "probability": 1
}
```

or

`https://api.genderize.io/?name=kim`

```swift
{
  "count": 83361,
  "gender": "female",
  "name": "kim",
  "probability": 0.7
}
```

Perfect. So, I can just add this to my code to pull up the picture, or, you know what, I'm procrastinating and it's time for bed.
