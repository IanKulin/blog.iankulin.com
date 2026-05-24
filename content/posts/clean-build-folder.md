---
title: "Clean Build Folder"
date: '2022-11-17'
slug: clean-build-folder
aliases:
  - /2022/11/17/clean-build-folder/
tags:
  - debugging
  - xcode14-1
---

Working on adding Core Data to the FriendFace app, and burnt up 20 minutes figuring out a bug. To set the scene, all I've changed in the app is to add a couple of core data entities. The plan is that when the JSON is fetched, and decoded into the objects, a copy of the graph will be persisted.

Problem One was that I was getting a build errors saying the core data classes had been re-declared, and others saying that my class name was ambiguous. Since XCode had generated this code when I'd told it to "Create NSManagedObject subclass". This is what you do when you want to be able to edit the NSManagedObject for example to created computed properties to unwrap the real properties. If you don't need that flexibility, you just leave the default setting in the entity for XCode to create internally.

<a href="/images/screen-shot-2022-11-15-at-7.52.05-pm.png"><img src="/images/screen-shot-2022-11-15-at-7.52.05-pm.png" width="885" alt=""></a>

Eventually I figured out my error - when I'd turned off the CodeGen in the data model inspector, I'd only done it for one of the two entities. Now the CodeGen version was duplicating the code in the "manually" generated version. Solved!

So I'd just need to change the CodeGen setting to manual, and I should be able to build it - but no, same error. I deleted the generated files out of the Project Navigator and tried the build again. Now I was getting a different error, about a class not found. The weird thing was, the file the error was coming from didn't seem to exist in my project directory. It was one of the data classes that I thought I deleted. By clicking around XCode, I found I could right click and ask to see the file in finder, only to discover it was deep in the XCode subfolders in the Library.

![](/images/screen-shot-2022-11-15-at-8.00.49-pm.jpg)

My first instinct was to delete it, but then I remembered seeing "Clean Build Folder" in the Project menu. I ran that, then did a fresh build (which took longer than usual) and lo and behold, all good.

So the answer to the question you've never asked "what happens when I leave my Core Data entities set to CodeGen?" is that it creates the swift for the NSManagedObject deep in the build folders - and it doesn't delete it if you change the CodeGen setting to Manual.
