---
title: "Ticket to ride"
date: '2022-12-05'
slug: ticket-to-ride
aliases:
  - /2022/12/05/ticket-to-ride/
tags:
  - code
  - files
  - posts
  - ticket-app
---

![superman crashing into a train, cartoon - Stable Diffusion](/images/superman-crashing-into-a-train-cartoon-2.jpg)

A [couple of days ago](/project-based-learning/) I was lauding the learning benefits of writing your own projects over completing tutorial projects - since your own projects push your boundaries further. Of course, its also the case that the project requirements might so completely exceed your current ability that it grinds to a halt. That's the case with my [behaviour ticket app](/tickets-on-myself/).

The part of the app for collecting the data is pretty much done and how I imagined it, but the output needs to be pretty tickets that can be printed on paper. I managed to write the ticket data to a CSV file and export that to the files app with a .fileExporter, but really what I wanted is to have one of those share screens where you can chose to AirDrop, Print etc, and for the tickets to have been rendered to a PDF or series of images to be shared. That will have to wait. I'm just up to a bit in the #100Days about writing images so I'll push on with that for a bit and come back to my app.

In the meantime, it's worth going over how to create and export the text file briefly.

First of all, I stole this TextFile code from Paul Hudson ([here](https://www.hackingwithswift.com/quick-start/swiftui/how-to-create-a-document-based-app-using-filedocument-and-documentgroup)) that wraps some complexity neatly into a struct.

```swift
//
//  TextFile.swift
//  Stolen from Paul Hudson @twostraws
//  https://www.hackingwithswift.com/quick-start/swiftui/how-to-create-a-document-based-app-using-filedocument-and-documentgroup
//

import SwiftUI
import UniformTypeIdentifiers

struct TextFile: FileDocument {
    // tell the system we support only plain text
    static var readableContentTypes = [UTType.plainText]

    // by default our document is empty
    var text = ""

    // a simple initializer that creates new, empty documents
    init(initialText: String = "") {
        text = initialText
    }

    // this initializer loads data that has been saved previously
    init(configuration: ReadConfiguration) throws {
        if let data = configuration.file.regularFileContents {
            text = String(decoding: data, as: UTF8.self)
        } else {
            throw CocoaError(.fileReadCorruptFile)
        }
    }

    // this will be called when the system wants to write our data to disk
    func fileWrapper(configuration: WriteConfiguration) throws -> FileWrapper {
        let data = Data(text.utf8)
        return FileWrapper(regularFileWithContents: data)
    }
}
```

Now here's all the modifiers I've got attached to the list of tickets.

The toolbar button just assigns a string to the instance of Paul's TextFile(). The string is built by just stepping through the tickets in a for loop and appending csv strings for each ticket to the big string that becomes the file.

The .fileExporter then does the heavy lifting. It slides up a view of the files in the "On My Phone" folder, lets the user name the file and saves it.

```swift
            .navigationTitle("Tickets")
            .fileExporter(isPresented: $showingExporter, document: exportFile, contentType: .plainText) { result in
                switch result {
                case .success(let url):
                    print("Saved to \(url)")
                case .failure(let error):
                    print(error.localizedDescription)
                }
            }
            .toolbar {
                Button {
                    exportFile.text = ticketsExportText()
                    showingExporter = true
                } label: {
                    Image(systemName: "square.and.arrow.up")
                        .padding(.horizontal)
                }
            }
```
