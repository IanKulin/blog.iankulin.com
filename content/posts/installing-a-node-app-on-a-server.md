---
title: "Installing a Node app on a server"
date: '2023-08-22'
slug: installing-a-node-app-on-a-server
aliases:
  - /2023/08/22/installing-a-node-app-on-a-server/
tags:
  - devops
  - homelab
  - node
  - systemd
  - web-dev
---

Before I write a fancy Ansible playbook to automatically set up the Nginx/Node combo on my web servers, it might be worth going through how to deploy a Node app so it can run on a server without you being logged in.

Until now, I've been running my tests on my laptop, or in a server logged in as myself - sometimes detaching from tmux. But we need a bit more professional set up than that. The process will look something like this:

<img src="/images/hqdefault.jpg" width="150" alt="">

-   Install Node and npm (I'm assuming we've done that since I've covered the playbook for it before).
-   Copy the app files over
-   Install the dependencies
-   Write the systemd config file
-   Start it up

### App files

We'll use the very simple server (`index.js`) I've written for the future Ansible post. All it does is listen on port 3000 to serve a tiny piece of text if someone hits the `/api` route.

```
const express = require('express');
const app = express();

const PORT = 3000;

app.get("/api", (req, res) => {
    res.status(200).send('Success - from /api route via node.js');
});

app.listen(PORT, () => {console.log(`Listening on port ${PORT}`)});
```

We'll also have our `package.json`, of which the only interesting thing to notice is that we've got a dependency on the `express` package which I originally installed with `npm`. All the files for our dependencies are stored in the `./node_modules` directory, but we don't need to copy them to the server.

### Where to put the app files

If I was doing this for a commercial app, I might store the app under `/var/www/<app name>` since that's where a future sysadmin might look for it if they don't have access to the playbooks. Another good place might be the home directory of the ansible/node user. Since that's me in this case, they're just going to go in my home directory - it makes the playbook commands shorter. We can use `scp` to copy the files in.

![](/images/screen-shot-2023-07-16-at-5.50.02-pm.png)

Once the files are there, we can install the dependencies with `npm install`. This looks at the `package.json`, then grabs them down.

### systemd

systemd manages the init and daemon processes in most Linux distros, so we'll be using that to get our node app running as a service. It was [a present from Red Hat](https://en.wikipedia.org/wiki/Systemd#History). Processes that run like this need a configuration file in `/lib/systemd/system`, ours will be called

`/lib/systemd/system/test-server.service`

```
[Unit]
Description=index.js - test server                     
After=network.target

[Service]
Type=simple
User=ian   
ExecStart=/usr/bin/node /home/ian/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target   
```

This file needs to say that we should wait for the network to come up before starting, what we're running and what to do if it dies. 'on-failure' means it will be restarted in pretty much any case but us stopping it cleanly. The `[multi-user.target](https://unix.stackexchange.com/questions/506347/why-do-most-systemd-examples-contain-wantedby-multi-user-target)` bit is saying we want this service up and running for the system to be considered ready as a server.

Once that file is in place, we can reload the configs, and start the service, this can be from anywhere, including a user home directory, and check it's status.

```
sudo systemctl daemon-reload
sudo systemctl start test-server
```

![](/images/screen-shot-2023-07-16-at-8.10.32-pm.png)

That all looks good, and if I visit the endpoint, there's the expected response, even after we've logged out of the server.

![](/images/screen-shot-2023-07-16-at-8.13.04-pm.png)
