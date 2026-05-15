---
title: "FriendFace Feedback"
date: '2022-11-15'
slug: friendface-feedback
aliases:
  - /2022/11/15/friendface-feedback/
tags:
  - 100daysofswiftui
  - code
  - posts
---

![](/images/screen-shot-2022-11-12-at-4.38.24-pm.png)

After each app, I use my HackingWithSwift+ membership to view Paul's version of the app as a way to judge my performance. Yesterday's app was "[FriendFace](https://www.hackingwithswift.com/guide/ios-swiftui/5/3/challenge)" - download some JSON of a number of people (including their friends) and display it.

#### UUID

In my struct, I'd just specified the User.id as a string, Paul uses UUID - this makes no difference to the app as it stands, but is much better if we ever needed to add users.

#### Example

For my details preview, I created a fake user in the preview. Paul does something slightly nicer - with a static let example = User(...) as a property of the User struct. Again - not a biggy for this app, but handy if you need to use it for other previews.

#### fetchUsers()

I had a test in the .task() to prevent the double loading of data, Paul puts his here inside a guard. I think mine is simpler to read and understand, but Paul's would be better if there was a chance we might call fetchUsers() from other places in the app. If that's likely, this would be the third time out of three differences where Paul is anticipating a bigger app - it might just be a reflex for such an accomplished developer. However, I'm going to award this one to me.

#### do/catch

Paul's JSON fetching and decoding is in a single do/catch block - as mine was in my first drafting, but then it didn't work correctly so I changed it. I think we can assume Paul's works - he's a quality coder, and this code has had a lot of eyes on it by now. So this is something I need to understand better.

Apart from the two items above, the rest of fetchUsers was essentially the same.

#### List

Paul used little red or green circles to indicate the active status of users in his list - much nicer than my version of having the text. Apart from that, it was a NavigationView iwht a List with a NavigationLink to the detail view, so same same.

#### UserDetails

Instead of a form, Paul uses a List with a .listStyle of .grouped which probably follows the HIG better.

{{< youtube BmPPhnIxoHM >}}
