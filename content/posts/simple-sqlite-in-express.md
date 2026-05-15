---
title: "Simple SQLite in Express"
date: '2023-12-28'
slug: simple-sqlite-in-express
aliases:
  - /2023/12/28/simple-sqlite-in-express/
tags:
  - express
  - node
  - posts
  - rest
  - sqlite
  - web-dev
---

![](/images/shmbo_an_artificial_intelligence_entitys_head_embodying_the_ess_f348db7a-e7b6-4620-beda-44fdb8e565d3.jpg)

I don't have experience with [SQLite](https://www.sqlite.org/index.html) and want to shift one of my apps over from Mongoose since apparently SQLite is [much more capable](https://www.sqlite.org/whentouse.html) than I imagined. My usual tactic when trying something new is to try and get a minimal project working on it, so what follows is the simplest possible node/express REST API to demo SQLite.

The simplest possible Express app is going to look something like this. Of course we would have gone to the terminal with `npm i express` first so this could run.

```
const express = require('express');const app = express();const port = 3000;app.get('/', (req, res) => {  res.send('Hello, World!');});app.listen(port, () => {  console.log(`Server is running at http://localhost:${port}`);});
```

The only thing to add to this for the moment is some middleware to allow Express to parse JSON body payloads.

```
app.use(express.json());
```

#### Body v Query

I'll just take you on a short detour here if you're not familiar with HTTP requests. There's a couple of common ways to send some data along with a request. The oldest one is to shove it all in the URL. You will have seen these sorts of things:

`http://localhost:3000/adduser?name=Fred&email=fred@example.com`

If you want all of your data to fit in a link, these are great. They can be bookmarked and so on. You see them all the time - especially in links with heaps of tracking data. The '?' denotes it as a query.

The code to process the GET request above would look like this:

```
app.get('/adduser', (req, res) => {  const name = req.query.name;  const email = req.query.email;
```

Note that I've used a GET request here, when semantically a POST would make more sense. That's because you can only use query strings for GETs.

Often the data you want to pass is going to be more complex, or you don't want it in the URL for other reasons (for example, you wouldn't want a user to be able to bookmark a record delete request). In that case you use the [body](https://developer.mozilla.org/en-US/docs/Web/API/Request/body).

You can stuff all sorts of text data in the body. Most times you are going to want JSON. I do for this demo, so that's why I've added the `expresss.json()` middleware - all the hard work will be done for me and I can just do this to access the information that's passed as part of the request:

```
app.post('/users', (req, res) => {  const name = req.body.name;  const email = req.body.email;
```

### Adding SQLite

Once you've run `npm i sqlite3` at the terminal to install the package, at the top of our app somewhere - probably where we're requiring the other packages - we'll need this:

```
const sqlite3 = require('sqlite3').verbose();const db = new sqlite3.Database('db/test.sqlite');
```

This is just requiring the package, and giving us `db` as the variable for the SQLite database connection. The database is actually a file in the `db/` directory.

On the first run, obviously this will be empty, so somewhere before the listen command, we need to create a table.

```
// if the 'users' table doesn't exist, // create it with 'name' and 'email' columnsdb.run('CREATE TABLE IF NOT EXISTS users (name TEXT, email TEXT)');
```

If you've never encountered SQL before, and was expecting a bunch of methods being passing in structs to do this, this is going to be alarming. But no - in SQL we do things by sending the engine a string. This has created a massive [attack surface](https://en.wikipedia.org/wiki/SQL_injection), but it's also a convenient and very readable convention.

For our simple purposes today, that could be enough infrastructure for SQLite, but because we are good programmers, we'll correctly close the database when the app undergoes an orderly shutdown by adding this before the `app.listen`.

```
// close the database connection when the app is shutting downprocess.on('SIGINT', () => {  db.close((err) => {    if (err) {      console.error('Error closing SQLite database:', err.message);    } else {      process.exit(0);    }  });});
```

### Working with SQLite

That's the infrastructure out of the way. Now, onto our CRUD (create, read, update, delete) operations to manipulate our stored data. Since this is just a demo, the simplest way to show these is just to have endpoints for each one. To exercise these endpoints you could use the development tools in your browser, but most people will use an API testing tool like Postman, or Insomnia. I much prefer [Bruno](/we-need-to-talk-about-bruno/) for this job, so I'll use that (and suggest you do too, get it [here](https://www.usebruno.com/)).

#### Create (add)

We already started on that earlier, and explained the concept of passing in data via the 'body' here's the complete thing:

```
// endpoint to add a user record to the users table// expects a name and email in the JSON body of the requestapp.post('/users', (req, res) => {  const name = req.body.name;  const email = req.body.email;  const sql = `INSERT INTO users (name, email) VALUES ("${name}", "${email}")`;  db.run(sql, function(err) {    if (err) {      res.status(500).send(err.message);    } else {      res.status(201).json({ rowid: this.lastID });    }  });});
```

So this code processes a request to our server - something like `http://localhost:3000/users` and expects the body payload to contain some JSON with a name and email. It could look like this:

```
{  "name": "John Doe",  "email": "john.doe@example.com"}
```

And when run in Bruno:

![](/images/screen-shot-2023-12-16-at-10.24.54-am.png)

#### Read

There's a couple of reads we can do, one where all the data is returned, and one where only a specific record is. Let's do the big one first, since we'll use it a lot while we're writing the rest!

```
// endpoint to get all users from the users table in the databaseapp.get('/users', (req, res) => {  const sql = 'SELECT rowid, * FROM users';  db.all(sql, (err, rows) => {    if (err) {      res.status(500).send(err.message);    } else {      res.status(200).send(rows);    }  });});
```

Which looks like this in Bruno:

![](/images/screen-shot-2023-12-16-at-10.35.56-am.png)

Or if we just want one in particular, we'll pass the id in the URL.

```
// endpoint to get a single user from the users table in the database// expects an id in the URLapp.get('/user/:id', (req, res) => {  const id = req.params.id;  const sql = `SELECT rowid, * FROM users WHERE rowid = ${id}`;  db.get(sql, (err, row) => {    if (err) {      res.status(500).send(err.message);    } else {      res.status(200).send(row);    }  });});
```

![](/images/screen-shot-2023-12-16-at-10.55.25-am.png)

#### Update

You're probably getting the hang of this now.

```
// endpoint to update a user record in the users table in the database// expects a name, and email in the JSON body of the request// expects an id in the URLapp.put('/user/:id', (req, res) => {  const id = req.params.id;  const name = req.body.name;  const email = req.body.email;  const sql = `UPDATE users SET name = "${name}", email = "${email}" WHERE rowid = ${id}`;  db.run(sql, (err) => {    if (err) {      res.status(500).send(err.message);    } else {      res.status(200).send('User updated.');    }  });});
```

#### Delete

```
// endpoint to delete a user record from the users table in the database// expects an id in the URL. Doesn't complain if the id doesn't exist.app.delete('/user/:id', (req, res) => {  const id = req.params.id;  const sql = `DELETE FROM users WHERE rowid = ${id}`;  db.run(sql, (err) => {    if (err) {      res.status(500).send(err.message);    } else {      res.status(200).send();    }  });});
```

### Hardening

To keep things simple (since I was just trying to show basic examples of using sqlite) I used string interpolation when making the SQL to run against the database. That's not a great technique because of the danger of SQL injection; so we should routinely use parameterized queries instead. Here's how adding a user looks if we use parameterized queries:

```
// endpoint to add a user record to the users table// expects a name and email in the JSON body of the requestapp.post('/users', (req, res) => {  const name = req.body.name;  const email = req.body.email;  const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;  db.run(sql, [name, email], function(err) {    if (err) {      res.status(500).send(err.message);    } else {      res.status(201).json({ rowid: this.lastID });    }  });});
```

With parameterized queries, whatever the user passes in ends up in the database rather than being executed as part of the query string.

For example, imagine if an API user tried to add a user with this body:

```
{  "name": "John",  "email": "john@example.com\"); DROP TABLE users; --"}
```

Then my original add code:

```
app.post('/users', (req, res) => {  const name = req.body.name;  const email = req.body.email;  const sql = `INSERT INTO users (name, email) VALUES ("${name}", "${email}")`;  db.run(sql, function(err) {    if (err) {      res.status(500).send(err.message);    } else {      res.status(201).json({ rowid: this.lastID });    }  });});
```

would result in executing this against the database:

```
INSERT INTO users (name, email) VALUES ("John", "john@example.com"); DROP TABLE users; --")
```

which would delete the entire users table from the database. This is [widely known as the "Bobby Tables" problem](https://xkcd.com/327/).

With the parameterized version, you just end up with an ugly user record.

Changing all of these doesn't add much code, but does make it a little bit harder to follow, hence showing you the old version first.

### REST API conventions

You may have noticed in this code I've used a variety of HTTP request types - GET, POST, PUT, DELETE etc. There's no rules for these things, but if someone else (including future you) is going to have to maintain or use your API, it's a good idea to follow the conventions.

<table><tbody><tr><td><strong>Situation</strong></td><td><strong>Request</strong></td><td><strong>URL</strong></td><td><strong>Return</strong></td></tr><tr><td>Add a record</td><td>POST</td><td>/users</td><td>record id</td></tr><tr><td>Replace a whole record</td><td>PUT</td><td>/users/:id</td><td>the whole record</td></tr><tr><td>Replace part of a record</td><td>PATCH</td><td>/users/:id</td><td>the whole record</td></tr><tr><td>Get all the records</td><td>GET</td><td>/users</td><td>all the records</td></tr><tr><td>Get a particular record</td><td>GET</td><td>/users/:id</td><td>that record</td></tr><tr><td>Delete a record</td><td>DELETE</td><td>/users/:id</td><td>nothing</td></tr></tbody></table>

You might have noticed that I haven't done the PATCH - the difference between that and the PUT is that with the PATCH we don't supply the whole record, just the fields we want to change. I'm not going to worry about that for this API since our record is so small.

But I also don't return the whole record after a PUT. Unfortunately, it means a second request - but there's probably not much of a performance hit since it will be in the cache.

```
// endpoint to update a user record in the users table in the database// expects a name, and email in the JSON body of the request// expects an id in the URLapp.put('/user/:id', (req, res) => {  const id = req.params.id;  const name = req.body.name;  const email = req.body.email;  const updateSql = `UPDATE users SET name = ?, email = ? WHERE rowid = ?`;  db.run(updateSql, [name, email, id], (err) => {    if (err) {      res.status(500).send(err.message);    } else {      const selectSql = `SELECT rowid, * FROM users WHERE rowid = ?`;      db.get(selectSql, [id], (err, row) => {        if (err) {          res.status(500).send(err.message);        } else {          res.status(200).json(row);        }      });    }  });});
```

[Link to the completed project on Github](https://github.com/IanKulin/sqlite-rest-demo/blob/main/app.js).
