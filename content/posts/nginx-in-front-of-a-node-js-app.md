---
title: "nginx in Front of a node.js app"
date: '2023-08-04'
slug: nginx-in-front-of-a-node-js-app
aliases:
  - /2023/08/04/nginx-in-front-of-a-node-js-app/
tags:
  - devops
  - homelab
  - linux
  - nginx
  - node
  - possibly-useful
  - web-dev
---

![](/images/jonaslittorin_strictly_digital_content_web_server_technology_we_fad86a29-71f0-439c-9900-2134fea30897.png)

NGINX is a great webserver and reverse proxy - as in it can hand off requests to other web-servers. That's the situation I want to have set up on my VPS. I want NGINX to handle incoming requests - some of them will just be sorted out by returning static HTML, others (like the weather api I've been playing with) need to be handed off to other services to respond to.

In the situation I'm looking at, I want requests that have the route /api (eg example.com/api/weather) to be passed to a node.js program I've written. All the other http requests should just be treated as requests for static pages and dealt with by NGINX.

So I guess is part V of my adventures in the weather API, if you just want to know how to set up NGINX to serve static pages AND pass some routes off to node, you don't need to be up to date on these.

-   [Outside Temperature From an API in a Shell Script](/outside-temperature-from-an-api-in-a-shell-script/)
-   [Complicating the Temperature API](/complicating-the-temperature-api/)
-   [Using Node.js to serve a static file](/how-to-deploy-a-node-js-app/)
-   [How to Deploy a Node.js App](/how-to-deploy-a-node-js-app/)

### nginx Configuration

Once nginx and node.js are installed (with [the Ansible script](https://gist.github.com/IanKulin/bd6d1a78f9a9fa9a859384a26ca95235) if you want to rock the dev ops tattoo) you'll need to configure nginx. On my Debian systems, the config file `nginx.conf` is in `/etc/nginx/`

There's a line in that file that includes all the `*.conf` files in `/etc/nginx/conf.d`. This is a common pattern I see in some distros - the main config files are not really meant to be messed with, but then there's a directory to add config files to whihc are included. The theoretical advantage of this is that the distro maintainers can roll out a new version of a package and change the main config file, and your stuff will still work.

The way they have done this with the nginx.conf means that the only changes we can make in the `conf.d` directory are to do with virtual hosts, but that's going to be 99% of the things we would want to change. So much so, I'm not even going to show you the `nginx.conf` file, just our little `/etc/nginx/conf.d/nodeapi.conf`

```
        server {
            listen 80;
            server_name 192.168.100.40;

            # Serve static files
            root /var/www;

            # pass api requests to node
            location /api {
                proxy_pass http://localhost:3000;
                proxy_set_header Host $host;
            }
        }
```

Okay, we are listening on port 80, and this "server block" is only for requests like http://192.168.100.40. The purpose of `server_name` is that we might run the websites for several domains from one nginx installation. For example, we might be serving example.com and otherexample.com from the same VPS.

`root /var/www;` - tells nginx to grab the files from that directory, so that's the static web server part.

`location /api {` - is telling nginx "all the requests with /api on the end are dealt with differently, look in this block for instructions"

`proxy_pass http://localhost:3000;` - send them all to a server on this machine listening on port 3000. This is where the node/express server is running.

`proxy_set_header Host $host;` - it doesn't matter for the purposes of this api, but it's often nice to tell the server being proxied who the real host receiving the request is. If we didn't do this, the node app would only be able to see that "localhost" was making a request. By doing this, it knows the request was to the server running nginx, in this case 192.168.100.40, but usually a real domain name. This might be needed if our node app was also servicing more than one domain.

And that's it. We're done. You do need to have your node app running on port 3000 on the same machine, but as long as that's happening this should all be working. Do remember to restart nginx each time you make a config changes with `sudo service nginx restart`, and it would also be good practice to check the config files with `sudo nginx` -t before that.
