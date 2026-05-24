---
title: "Unlearning Relational DB"
date: '2023-07-09'
slug: unlearning-relational-db
aliases:
  - /2023/07/09/unlearning-relational-db/
tags:
  - database
  - mongodb
  - nosql
  - web-dev
---

Some of my first university programming was writing [CICS](https://en.wikipedia.org/wiki/CICS) COBOL transactions against IBM's [DB2](https://en.wikipedia.org/wiki/IBM_Db2) relational database. My commercial work after uni was mostly written in Clipper which was a sort of compiled version of [dBase](https://en.wikipedia.org/wiki/DBase) and used the same data file format. The minimal web work I did in the before times relied on [MySQL](https://en.wikipedia.org/wiki/MySQL).

All of which is to say, I'm very comfortable designing relational database schema, and I understand what's going on at the disk level when they are being accessed and written to.

But the world moves on, and now developers have some amazing [NoSQL](https://en.wikipedia.org/wiki/NoSQL) databases. Of these, the document store types such as MongoDB, CouchDB, and Firebase are of the most interest to me. My stack for my first couple of realistic scale web-apps is likely to be Node/Express/EJS/MongoDB.

In a document database, each collection contains a number of documents. In the ones I'm looking at these are basically JSON objects, so this could be a document:

[![](/images/screen-shot-2023-07-01-at-8.14.06-am.png)](https://www.mongodb.com/docs/manual/introduction/)

In this example (from the MongoDB manual) `groups` is an array of string, but it could just as easily be an array of objects. Documents can be big ([Fireship says try to keep them under 1MB](https://www.youtube.com/watch?v=jm66TSlVtcc)) so a large collection of child objects is a realistic possibility.

This all raises a couple of questions for me. What are the factors to consider when designing a database schema for a document store database?, and (probably less importantly) what are the implementation details? If we add an extra group to the example above, does a new document get written and this one voided?

### Designing Database Schema

Lots of good stuff available about this. I started here:

{{< youtube 3GHZd0zv170 >}}

### Implementation

In a fixed-sized record database (most relational databases) you can edit records in place since you know the offsets. Or if you want to ensure the changes are atomic, write the edited record to a blank slot, and mark the old one as available to be reused. By necessity, each document in a nosql database can be any size, so they can't be edited in place. As well as that, it's possible for a document to grow during an edit (for example if we added a new group to the array in the example above).

The best (from a dev point of view) answer to this is don't worry about it. It's abstracted away so you don't have to think about it. Of course there are edge cases, usually involving large scale implementations, where these things would start to affect database design decisions, but for most cases not.

The actuall answer is going to be complex, but it is going to involve a couple of things for sure.

The first is that modern situations make good use of memory caches so nearly all edits occur in memory rather than disk. Often this is paralleled with writing a journal to disk to allow for a recovery in an unexpected power down situation.

Another strategy is to write deltas for documents, such that a complete up to date document might consist of the original document, then a list of changes to it that can be used to recreate the document when it is retrieved.

Both of these strategies suggest that some periodic maintenance is required - rewriting the full documents to disk (often called snapshots). Implementations will be doing parts this maintenance in spare cycles as they go along, on a time basis, or manually - for example the [WiredTiger](https://www.mongodb.com/docs/manual/core/wiredtiger/) storage engine from MongoDB has a `[compact](https://www.mongodb.com/docs/manual/reference/command/compact/)` command that goes through, writing all the documents in full and rebuilding all the indexes to save disk space and speed up operations.

But again, best not to worry about all that, and to rather focus on how your app needs to access and use the data, and build your schema with those factors in mind.
