---
title: "Bookworm Challenges"
date: '2022-11-06'
slug: bookworm-challenges
aliases:
  - /2022/11/06/bookworm-challenges/
tags:
  - 100daysofswiftui
  - code
  - swift5-7
  - swiftui
  - xcode14
---

Another set of challenges for a [#100DaysofSwiftUI](https://www.hackingwithswift.com/100/swiftui) tutorial app. Project 11 was a book tracking app - the big new thing was using CoreData. Here's the [challenges for it](https://www.hackingwithswift.com/books/ios-swiftui/bookworm-wrap-up).

> _Right now it’s possible to select no title, author, or genre for books, which causes a problem for the detail view. Please fix this, either by forcing defaults, validating the form, or showing a default picture for unknown genres – you can choose._

The genre is already forced since it uses a picker, but I added a default (plain grey) image to deal with the situation that there's no data for it in a record. It doesn't make sense to provide defaults for the title or author, but some validation to ensure those fields are not empty is worthwhile.

```
Section {
    Button("Save") {
        let newBook = Book(context: moc)
        newBook.id = UUID()
        newBook.title = title
        newBook.author = author
        newBook.rating = Int16(rating)
        newBook.genre = genre
        newBook.review = review
        newBook.date = Date()

        try? moc.save()
        dismiss()
    }
}
.disabled(title.isEmpty || author.isEmpty || genre.isEmpty)
```

<a href="https://github.com/IanKulin/Bookworm/commit/989942b228f96540f1f46e04e91e4816f9072a38"><img src="/images/github-mark-120px-plus.png" width="34" alt=""></a>

> _Modify `ContentView` so that books rated as 1 star are highlighted somehow, such as having their name shown in red._

Straightforward, with use of the ternary operator.

![](/images/screen-shot-2022-11-04-at-6.17.12-pm.jpg)

<a href="https://github.com/IanKulin/Bookworm/commit/cc81d29a799e7bb97e9813c4ad17e66a64361e6a"><img src="/images/github-mark-120px-plus-1.png" width="35" alt=""></a>

> _Add a new “date” attribute to the Book entity, assigning `Date.now` to it so it gets the current date and time, then format that nicely somewhere in `DetailView`._

1.  Add the date field to the datamodel
2.  Set it to current date in the Save of the AddView
3.  Showing it in the Detail View was a little more interesting - adding a test to ensure it was in the database - since we've now got two versions of these records.

```
Text(book.author ?? "Unknown author")
    .font(.title)
    .foregroundColor(.secondary)

let date = book.date ?? Date()
Text(date.formatted(.dateTime.day().month().year()))
    .foregroundColor(.secondary)
    .opacity(date == book.date ? 1 : 0)
            
Text(book.review ?? "No review")
    .padding()
```

<a href="https://github.com/IanKulin/Bookworm/commit/9ec21d4d827b1ae1799c34d65b9d2366e5c4ce36"><img src="/images/github-mark-120px-plus-2.png" width="36" alt=""></a>
