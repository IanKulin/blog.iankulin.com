---
title: "Fancier Website in a Docker Container"
date: '2024-11-18'
slug: fancier-website-in-a-docker-container
aliases:
  - /2024/11/18/fancier-website-in-a-docker-container/
tags:
  - busybox
  - devops
  - docker
  - possibly-useful
  - web-dev
---

The previous post went over how to bundle a static website into a Docker container. That's a neat little trick - keeping the entire website and making it trivial to install on a VPS behind Nginx Proxy Manager. It worked great for most of my little websites.

### But...

A couple of my websites had very minor 'dynamic' content. One was pulling down the local temperature from OpenWeather, then exposing a cut-down version of that as a REST endpoint so all my servers could grab it without me being rate-limited by OpenWeather for abusing my free API key. Another one re-hosted an image that changes a couple of times a day from an unreliable service.

So, can we do those sorts of jobs in our BusyBox web containers? Well yes, of course. Let's look at the image re-hosting problem, but the approach is going to be similar for other small internet tasks.

We need the container (as well as hosting the website) to repeatedly download an image from the internet, and save it into the directory in the container where the static files are being hosted. In my first attempt at this, I messed around with cron, but I was over complicating it, and since BusyBox is not a full distro with all the regular tools, lots of things (including cron) just didn't work the way I expected the first try.

Where I ended up was having a script called `update_content.sh` that has a loop with a `sleep()` in the bottom, but at the top, downloads the file we want into our `/var/www/html/` directory. Here's the script:

```
#!/bin/sh

# Define the URL and the destination path
URL="http://httpbin.org/image/jpeg"
DEST_PATH="/var/www/html/image.jpg"
FETCH_INTERVAL=120  # 2 minutes

while true; do
    # Use wget to download the file
    wget -O "$DEST_PATH" "$URL"

    # Check the exit status of wget
    if [ $? -eq 0 ]; then
        echo "File downloaded successfully to $DEST_PATH"
    else
        echo "Failed to download the file."
    fi
    sleep $FETCH_INTERVAL
done
```

Then in our `dockerfile`, the `CMD` launches the script as well as the httpd server:

```
FROM busybox:latest

# Add shell script and set executable
COPY update_content.sh /usr/local/bin/update_content.sh
RUN chmod +x /usr/local/bin/update_content.sh

# Create the directory for the web content, and copy files in
RUN mkdir -p /var/www/html
COPY www/. /var/www/html

# Expose port 80 for the web server
EXPOSE 80

# Start the httpd server
CMD ["sh", "-c", "/usr/local/bin/update_content.sh & busybox httpd -f -p 80 -h /var/www/html"]
```

The docker-compose.yml remains the same as in the previous post - if you haven't read that, I was running all these website containers behind Nginx Proxy Manager. If you are not, then just go ahead and delete out the "networks" parts.

```
services:
  example.com:
    container_name: httpd-example.com
    image: ghcr.io/iankulin/example.com:latest
    restart: unless-stopped
    networks:
      - nginx-proxy-manager_default

networks:
  nginx-proxy-manager_default:
    external: true
```

Eagle eyed readers (or people with experience of using the BusyBox version of wget) will have noticed the oddly particular image file I chose to download for this demo code:

`URL="http://httpbin.org/image/jpeg"`

I chose this, because it's one of the last image files in the world to be served over http, and wget in BusyBox chokes on TLS for reasons I'll discuss next week.
