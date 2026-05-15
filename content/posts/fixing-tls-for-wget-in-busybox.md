---
title: "Fixing TLS for wget in BusyBox"
date: '2024-11-25'
slug: fixing-tls-for-wget-in-busybox
aliases:
  - /2024/11/25/fixing-tls-for-wget-in-busybox/
tags:
  - busybox
  - devops
  - docker
  - possibly-useful
  - ssl
  - web-dev
---

I've been containerising my static websites with BusyBox (because it's small), and in [an earlier post](/fancier-website-in-a-docker-container/) showed how to even get the container to update parts of the site by reaching out with `wget` to download resources from elsewhere and saving them inside the container where we are serving the 'static' site from. I'd done this by including a bash script in the container with the `wget` in a loop with a `sleep`. Then started the script and the httpd server in the CMD line of the `dockerfile`.

Here's the dockerfile.

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

And the bash script:

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

This all works perfectly, as long as the file you're downloading is over http. Trying over an SSL connection (which must be 98% of the internet by now) fails. The reason for this is that [BusyBox does not contain the certificates for the root CA](/fancier-website-in-a-docker-container/). In a normal distribution, you'd just do ahead and install them, but BusyBox also does not have a package manager to help you do that, so there's no '`apk update && apk add ca-certificates`' to help us out.

A viable solution might be to just switch to an Alpine container, but I'd be going up to 12MB per containerised website then (from 4) which seems a bit much.

In a [Stack Overflow post](/fancier-website-in-a-docker-container/), [Tarun Lalwani](https://stackoverflow.com/users/2830850/tarun-lalwani) offers a couple of suggestions. One is having a multi-stage docker image build where you create an Alpine container, copy the certs out to a volume, then copy them into your busybox image. To my mind that would be a good idea to create a new image (essentially BusyBox with certs) to chuck up on a repository somewhere. Such an [image does exist,](https://hub.docker.com/r/odise/busybox-curl) but it's very old.

Another suggestion is just to bind mount the certs directory in the container to the host (as read only), and use the host's certificates. This seems like a much simpler approach to me. It's just an edit to the `docker-compose.yml` or the run command.

```
services:
  example.com:
    container_name: httpd-example.com
    image: ghcr.io/iankulin/example.com:latest
    restart: unless-stopped
    volumes:
      - /etc/ssl/certs:/etc/ssl/certs:ro  # Bind mount host's SSL certs
```

or

```
docker run --name httpd-example.com -p 80:80 -v /etc/ssl/certs:/etc/ssl/certs:ro ghcr.io/iankulin/example.com:latest
```
