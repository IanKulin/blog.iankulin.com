---
title: "ChatGPT's code writing"
date: '2022-12-11'
slug: chatgpts-code-writing
aliases:
  - /2022/12/11/chatgpts-code-writing/
tags:
  - ai
  - chatgpt
  - swift5-7
  - tools
  - xcode14-1
---

This week, the internet has been all about [ChatGPT](https://chat.openai.com/chat), the rather remarkable natural language AI with a very large model. If you're a twitter user, you were probably amazed, but now eventually tired of seeing examples of it's output. I'll add to that with an example of a SwifUI CoreData based todo app it wrote for me from a single sentence prompt below. Rather than look at other people's examples you should definitely go and play with it yourself - it is very impressive. Along with the image based AI's it's made 2022 into a historical year for AI.

ChatGPT will write software. I can't see it replacing developers, but it seems likely there'll be a bunch of interesting tools to come over the next few years. I feel like the first big effect will be the volume of mediocre internet content will increase dramatically as it is pretty great at run of the mill copy-writing. I'd like to assure my readers that all my mediocre internet content will continue to be human written - with the exception of most of the art, and the code example below :- )

> write swiftui code for a todo application where the items reoccur after a certain number of days. The items are shown in a list and the user can navigate to a detail view.
> 
> me

> Here is an example of SwiftUI code for a todo application where the items reoccur after a certain number of days:
> 
> ChatGPT

```swift
struct TodoItem: Identifiable {
    let id = UUID()
    let task: String
    let dueDate: Date
    let repeatInterval: Int // number of days until the task reoccurs
}

struct TodoList: View {
    @State var items = [TodoItem]()

    var body: some View {
        List(items) { item in
            NavigationLink(destination: TodoDetail(item: item)) {
                Text(item.task)
            }
        }
    }
}

struct TodoDetail: View {
    let item: TodoItem

    var body: some View {
        VStack {
            Text(item.task)
            Text("Due: \(item.dueDate, formatter: DateFormatter.mediumDate)")
            Text("Reoccurs every: \(item.repeatInterval) days")
        }
    }
}
```

> In the `TodoList` view, a `List` is used to display the todo items. Each item in the list is wrapped in a `NavigationLink` that takes the user to a `TodoDetail` view when tapped. The `TodoDetail` view displays the task, the due date, and the repeat interval for the selected todo item.
> 
> You can modify this code to suit your specific needs, such as adding features to add or delete items, or changing the layout and appearance of the views.
> 
> ChatGPT

That's pretty cool. I don't think that DateFormatter.mediumDate is a thing, so I changed that line to:

```swift
Text("Due: \(item.dueDate, style: .date)")
```

It's okay ChatGPT, I get confused about the variety of ways to change dates too.

> great. show me the content view code that contains the TodoList and has a button to add items.
> 
> me

> Here is an example of a `ContentView` that contains a `TodoList` and has a button to add items:
> 
> ChatGPT

```swift
struct ContentView: View {
    @State var items = [TodoItem]()

    var body: some View {
        VStack {
            TodoList(items: $items)
            Button(action: {
                // add new todo item here
            }) {
                Text("Add Item")
            }
        }
    }
}
```

> In this code, the `ContentView` contains a `TodoList` and a `Button`. The `TodoList` is initialized with the `items` array, which is marked as `@State` so that it can be modified in response to user actions. The `Button` has an action closure that is executed when the button is tapped. You can add code inside this closure to create a new `TodoItem` and add it to the `items` array.
> 
> You can modify this code to suit your specific needs, such as changing the layout and appearance of the views, or adding features to delete items from the list.
> 
> ChatGPT

To let this compile, I commented out the Preview and changed the items property in the top of the TodoList view to a binding:

```swift
struct TodoList: View {
    @Binding var items: [TodoItem]
```

> thank you. what would the code for adding an item look like
> 
> me

> Here is an example of code that you can use to add a new `TodoItem` to the `items` array when the button is tapped:
> 
> ChatGPT

```swift
struct ContentView: View {
    @State var items = [TodoItem]()

    var body: some View {
        VStack {
            TodoList(items: $items)
            Button(action: {
                let newItem = TodoItem(task: "New Task", dueDate: Date(), repeatInterval: 7)
                items.append(newItem)
            }) {
                Text("Add Item")
            }
        }
    }
}
```

> In this code, the `Button` has an action closure that creates a new `TodoItem` with the task "New Task", a due date of the current date, and a repeat interval of 7 days. The new item is then appended to the `items` array.
> 
> You can modify this code to suit your specific needs, such as prompting the user for the task name and due date, or changing the default repeat interval. You can also add additional logic to handle errors or validation failures when creating the new item.
> 
> ChateGPT

This all runs and the add item works, but the NavigationLink to get to the detail view does not. Let's wrap it in a NavigationView to fix that.

```swift
struct ContentView: View {
    @State var items = [TodoItem]()

    var body: some View {
        NavigationView {
            VStack {
                TodoList(items: $items)
                Button(action: {
                    let newItem = TodoItem(task: "New Task", dueDate: Date(), repeatInterval: 7)
                    items.append(newItem)
                }) {
                    Text("Add Item")
                }
            }
        }
    }
}
```

I went on to ask it to change this to core data for persistence, but as I wanted the app to be more and more complex, it needed me to fix more and more problems, and became less fun.

![](/images/screen-shot-2022-12-10-at-2.47.12-pm.jpg)

![](/images/screen-shot-2022-12-10-at-2.47.16-pm.jpg)
