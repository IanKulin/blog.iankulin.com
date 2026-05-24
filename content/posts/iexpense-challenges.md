---
title: "iExpense Challenges"
date: '2022-10-02'
slug: iexpense-challenges
aliases:
  - /2022/10/02/iexpense-challenges/
tags:
  - 100daysofswiftui
  - code
  - swift5-7
  - xcode14
---

<a href="/images/screen-shot-2022-09-29-at-6.41.29-am.png"><img src="/images/screen-shot-2022-09-29-at-6.41.29-am.png" width="308" alt=""></a>

[Day 38](https://www.hackingwithswift.com/100/swiftui/38) is three challenges on the iExpense app - a simple expense tracking app that uses UseDefaults for storing it's data.

### Locale

> _Use the user’s preferred currency, rather than always using US dollars._

One of the joys of modern programming (as opposed to mid-1990's programming) is the ability of the internet to give you answers. I knew the answer to this would be lurking in the locale environment variable, but instead of [looking it up](https://developer.apple.com/documentation/swiftui/environmentvalues/locale), just googled, and found a viable looking solution on [Reddit](https://www.reddit.com/r/SwiftUI/comments/t7g7ds/localising_currency/).

`Text(amount, format: .currency(code: Locale.current.currencyCode ?? "USD"))`

When I paste it into Xcode, another modern miracle occurs - Xcode warns me know _currencyCode_ is out of date:

`'currencyCode' was deprecated in iOS 16: renamed to 'currency.identifier'`

and offers to fix it for me:

`Use 'currency.identifier' instead`

So I'm like "sure, fix that for me". Then there's an error because the chaining is needs touched up now:

`Value of optional type 'Locale.Currency?' must be unwrapped to refer to member 'identifier' of wrapped base type 'Locale.Currency'`

and again offers to fix the chaining for me, so okay it, and end up with this:

```swift
    fileprivate func itemView(item: ExpenseItem) -> some View {
        HStack {
            VStack(alignment: .leading) {
                Text(item.name)
                    .font(.headline)
                Text(item.type)
            }

            Spacer()
            Text(item.amount, format: .currency(code: Locale.current.currency?.identifier ?? "USD"))
        }.foregroundColor((item.amount < 10) ? .purple : (item.amount < 100) ? .green : .blue)
    }
```

### Conditional formatting

> _Modify the expense amounts in `ContentView` to contain some styling depending on their value – expenses under $10 should have one style, expenses under $100 another, and expenses over $100 a third style. What those styles are depend on you._

Easy - ternary operator on HStack - see above

### Conditional list building

> _For a bigger challenge, try splitting the expenses list into two sections: one for personal expenses, and one for business expenses. This is tricky for a few reasons, not least because it means being careful about how items are deleted!_

This was tricky, but I didn't run into deletion problems. I thought I'd just run the ForEach twice and use an if inside it to build two different list sections. The compiler was very upset with this, saying something about not being able to determine the type in the view, but not being able to identify the view.

The solution for this turned out to be to put them inside a Group{}. I guess this means it's something related to the ways Views are built and the magic inside the @ViewBuilder property wrapper.

```swift
            List {
                Section(header: Text("Personal")) {
                    ForEach(expenses.items) { item in
                        Group {
                            if item.type == "Personal" {
                                itemView(item: item)
                            }
                        }
                        
                    }
                    .onDelete(perform: removeItems)
                }
                Section(header: Text("Business")) {
                    ForEach(expenses.items) { item in
                        Group {
                            if item.type == "Business" {
                                itemView(item: item)
                            }
                        }
                        
                    }
                    .onDelete(perform: removeItems)
                }
            }
            .navigationTitle("iExpense")
            .toolbar{
                Button {
                    showingAddExpense = true
                } label: {
                    Image(systemName: "plus")
                }
            }
```
