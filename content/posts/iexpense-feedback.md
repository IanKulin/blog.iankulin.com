---
title: "iExpense Feedback"
date: '2022-10-12'
slug: iexpense-feedback
aliases:
  - /2022/10/12/iexpense-feedback/
tags:
  - 100daysofswiftui
  - code
  - debugging
  - swift5-7
  - xcode14
---

I finally got around to looking at Paul's solutions for the [iExpense challenges](/iexpense-challenges/).

> _Use the user’s preferred currency, rather than always using US dollars._

Same approach as me,

`.currency(code: Locale.current.currency?.identifier ?? "USD")`

except that he does the work in a local variable which is a bit neater. Since it appears in two places - the display view and the view for adding an expense, this would mean duplicating it, making it global (not rare for user default type settings) or passing it down through the view hierarchy. I feel either of the first two options are fine for this project, but Paul is thorough and extends the FormatStyle protocol, only for currency, to have a new computed property .localcurrency - which is a great solution.

> _Modify the expense amounts in `ContentView` to contain some styling depending on their value – expenses under $10 should have one style, expenses under $100 another, and expenses over $100 a third style. What those styles are depend on you._

I'd done this with ternary operator modifiers:

```
            Text(item.amount, format: .currency(code: Locale.current.currency?.identifier ?? "USD"))
        }.foregroundColor((item.amount < 10) ? .purple : (item.amount < 100) ? .green : .blue)
```

But Paul, again, goes one better with another extension, this time of View, to create a style(for: Item) - this is a better approach, especially if (as would be likely in a real app) it was going to need to be reused.

I also note that Paul added new files for both these extensions. I think that's wise for the currency one, but perhaps this one could probably have lived wherever the ExpenceItem was defined.

> _For a bigger challenge, try splitting the expenses list into two sections: one for personal expenses, and one for business expenses. This is tricky for a few reasons, not least because it means being careful about how items are deleted!_

This is where things get weird. I split the types up by running to ForEach in their own groups. Paul had warned that deleting would be tricky because the offset into the array would not necessarily match the offset being passed to the remove method - so the wrong one might be deleted. I implemented my solution without worrying about that and it seemed to work, so I assumed I'd just come up with a better solution and moved on. But it does bear thinking about. Say (starting from no records) I create two business expenses names _Bus1_ & _Bus 2_, and then two personal expenses names _Per 1_ and _Per 2_. My array of expense objects is going to look a bit like this:

```
Bus 1 [0]
Bus 2 [1]
Per 1 [2]
Per 2 [3]
```

But my code is going to list the personal expenses first, then the business ones:

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
```

<a href="/images/screen-shot-2022-10-08-at-3.06.30-pm.png"><img src="/images/screen-shot-2022-10-08-at-3.06.30-pm.png" width="283" alt=""></a>

The numbers in the brackets are what I think their array indexes should be. If what I understand Paul to be saying, if I now try to delete _Per 2,_ its offset in the list would be 1 (the second item in the list), but the remove call to the array is going to delete the expense at index 1, which is actually _Bus 2_. But actually, it just deletes the correct one:

<a href="/images/screen-shot-2022-10-08-at-3.14.51-pm.png"><img src="/images/screen-shot-2022-10-08-at-3.14.51-pm.png" width="736" alt=""></a>

<a href="/images/screen-shot-2022-10-08-at-3.14.56-pm.png"><img src="/images/screen-shot-2022-10-08-at-3.14.56-pm.png" width="734" alt=""></a>

Perplexed, now that I'm thinking carefully about it. I did some print statement debugging:

```swift
    func removeItems(at offsets: IndexSet) {
        for i in offsets {
            print("Offset:\(i)")
        }
        print("Before remove")
        for item in expenses.items {
            print(item.name)
        }
        expenses.items.remove(atOffsets: offsets)
        print("After remove")
        for item in expenses.items {
            print(item.name)
        }
    }
```

Which outputs this:

```
Offset:3
Before remove
Bus 1 [0]
Bus 2 [1]
Per 1 [2]
Per 2 [3]
After remove
Bus 1 [0]
Bus 2 [1]
Per 1 [2]
```

So actually, the IndexSet that SwiftUI passes to .onDelete() has already correctly identified the correct array index (shown as "Offset: 3" above). I assume as it's built the List for me. That's lovely, but I was perplexed about what Paul is talking about then.

In Paul's solution, he adds computed properties to the Expenses class to return arrays of either personal or business expenses. he does this with the arrays filter() method. This is a cool method (which I didn't know about) but it returns a new array with elements meeting the filter condition. So it makes sense that when you create the index set from this, it's indexed into the new smaller (filtered) array, so of course you need to account for this.

In that case, this might be the first occasion when I think my solution is better than Paul's!
