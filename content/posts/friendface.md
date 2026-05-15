---
title: "FriendFace"
date: '2022-11-14'
slug: friendface
aliases:
  - /2022/11/14/friendface/
tags:
  - 100daysofswiftui
  - code
  - swift5-7
  - xcode14
---

The [Day 60 Milestone](https://www.hackingwithswift.com/guide/ios-swiftui/5/3/challenge) is a demo app that vacuums up some JSON and displays it in a list in a NavigationView that links to a details page. Nothing super strenuous, the steps were something like this:

1) Download the JSON and have a look at the structure. Firefox has a simple JSON viewer built in, so it was straightforward to see this is an array of users, which along with some (mostly string) properties contains an array of tag strings, and another array of friends.

![](/images/screen-shot-2022-11-12-at-3.23.28-pm.jpg)

2) Build the structs for these.

```swift
import Foundation

struct User: Codable {
    var id: String
    var isActive: Bool
    var name: String
    var age: Int
    var company: String
    var email: String
    var address: String
    var about: String
    var registered: Date
    var tags: [String]
    var friends: [Friend]
}

struct Friend: Codable {
    var id: String
    var name: String
}
```

The date you can see in the JSON is in the ISO-8601 format - and @twostraws gives the hint about using the dateDecodingStrategy for it.

3) Fetch the data. I made this a .task attached to the list, I didn't notice it loading multiple times, but Paul did caution about this, so the code checks if the array is empty before calling fetching the JSON.

```
.task {
    if users.isEmpty {
       await fetchUsers()
    }
}
```

4) Process the data into our structs. Since they are codable, this is a bit of a joy. I'd made an error and the JSON wasn't loading, but I could not see what it was. I fixed this by nesting my do/catch blocks. It seems a bit unwieldy - I feel like I should be able to do several risky steps and have the catch catch all the errors, but it didn't seem to be. This code works fine, but I feel it could be improved.

```swift
    func fetchUsers() async {
        guard let url = URL(string: "https://www.hackingwithswift.com/samples/friendface.json") else {
            print("Invalid URL")
            return
        }

        do {
            let decoder = JSONDecoder()
            decoder.dateDecodingStrategy = .iso8601

            let (data, _) = try await URLSession.shared.data(from: url)
            do {
                let decodedUsers = try decoder.decode([User].self, from: data)
                users = decodedUsers
            } catch {
                print(error)
                return
            }

        } catch {
            print(error)
            return
        }

    }
```

Note the square brackets for \[User\] - we're decoding an array of users.

5) Display it in the list, with an NavigationLink to the UserDetails view.

```swift
struct ContentView: View {

    @State private var users = [User]()

    var body: some View {
        NavigationView {
            List(users, id: \.id) { user in
                NavigationLink(destination: UserDetail(user: user)) {
                    VStack(alignment: .leading) {
                        Text(user.name)
                            .font(.headline)
                        Text(user.isActive ? "Active" : "Not active")
                    }
                }
            }
            .task {
                if users.isEmpty {
                    await fetchUsers()
                }
            }
            .navigationBarTitle("FriendFace")
        }
    }
```

5) Show the user details. This is where I started going off script. The user is passed into the detail view. I used a Form because the layout looks a bit nice, and the Friends is a little list.

The script departure was wanting to have a profile pic. As described yesterday, I used an AsyncImage for this. I would have liked to have cached the image so it doesn't re-fetch when you go out of a user and back in (this would have solved the problem of the random image I described yesterday as well) and fiddled around with trying to save a .snapshot of the AsyncImage view - but then decided I should be moving on instead of cracking that particular procrastination nut, especially because of this parting advice from Paul.

> _**Tip:** As always, the best way to solve this challenge is to keep it simple – write as little code as you can to solve the challenge, and for you to feel comfortable that it works well._

```swift
struct UserDetail: View {

    let user: User

    var body: some View {
        Form {
            Section {
                HStack {
                    Text(user.name)
                        .font(.headline)
                        .frame(maxWidth: .infinity, alignment: .center)
                }
            }
            AsyncImage(
                url: URL(string: "https://randomuser.me/api/portraits/men/\(nameHash).jpg"),
                scale: 3
            ) { image in image
                    .resizable()
                    .scaledToFit()
            } placeholder: {
                ProgressView()
            }

            Section {
                Text("Age: \(user.age)")
                Text("Company: \(user.company)")
                Text("email: \(user.email)")
                Text("Address: \(user.address)")
                Text("Registered: \(user.registered, style: .date)")

            }
            Section(header: Text("Friends")) {
                List(user.friends, id: \.id) { friend in
                    Text(friend.name)
                }
            }
        }
    }

    var nameHash: Int {
        user.name.utf8.reduce(0) { $0 + Int($1) } % 100
    }
}
```
