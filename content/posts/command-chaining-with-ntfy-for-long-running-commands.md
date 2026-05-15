---
title: "Command chaining with NTFY for long running commands"
date: '2025-02-03'
slug: command-chaining-with-ntfy-for-long-running-commands
aliases:
  - /2025/02/03/command-chaining-with-ntfy-for-long-running-commands/
tags:
  - devops
  - homelab
  - linux
  - nohup
  - ntfy
  - possibly-useful
---

[NTFY](https://ntfy.sh/) is a great open-source push notification service that's self-hostable or free to use (although I suggest you [pay for it](https://liberapay.com/ntfy) as I do). I've written before how I use it with [UptimeKuma](/uptime-kuma-nfty/) for my uptime monitoring, but another common use is just when I'm initiating long-running commands and backgrounding them.

This magic is possible since we can just `curl` to send a NTFY notification. For example:

```
curl -d "😀 demo push message via NTFY" ntfy.sh/blog_demo
```

Since I'm subscribed to the "blog\_demo" topic in NTFY, this message will be pushed to my phone and watch:

![](/images/img_0056.png)

How I use this is with 'command chaining'. In Linux, you can stack commands together with the `&&` characters like this:

```
mkdir test_dir && echo "success"
```

This will create the directory, then print "success" to the shell. I could use it like this:

```
nohup rsync -rvits --bwlimit=20 "/volume1/media/video/Movies/Night of the Living Dead (1968)/" ds1_admin@100.78.2.105:"/volume1/media/video/Movies/Night of the Living Dead (1968)" > output.log 2>&1 && curl -d "💾 upload to vm500-kr complete" ntfy.sh/blog_demo &
```

Both commands will run in the background, and the output of the first command is directed into the 'output.log' file. If the rsync file transfer (that is going to take all night) finishes successfully, then the message saying it's complete will be sent.

What about if it fails? Well, posix has you covered here too. There's a `||` chaining operator that only runs if a command fails.

```
mkdir invalid/name && (echo "Directory created successfully.") || (echo "Failed to create directory.")
```

In the command above, if we already have a directory called `invalid`, the `mkdir` will work and we'll get the message "Directory created successfully.". If `invalid` doesn't exist, the command will fail and we'll get the message "Failed to create directory."

Note that I've added some parenthesis - it makes things clearer for the reader, and the command line parser.

Let's apply this to our slow file transfer:

```
nohup rsync -rvits --bwlimit=20 "/volume1/media/video/Movies/Night of the Living Dead (1968)/" ds1_admin@100.78.2.105:"/volume1/media/video/Movies/Night of the Living Dead (1968)" > output.log 2>&1 && curl -d "💾 upload to vm500-kr complete" ntfy.sh/blog_demo || curl -d "⚠️ upload to vm500-kr failed!" ntfy.sh/blog_demo &
```

Now we'll get a push message for completion or failure. There is one more little bit of housekeeping to do though. When we curl ntfy like this, it actually returns some JSON:

![](/images/screen-shot-2024-12-28-at-11.00.08-am.png)

Since we're running this whole thing backgrounded, we really want that to go to the `output.log` file with the other output:

```
nohup rsync -rvits --bwlimit=20 "/volume1/media/video/Movies/Night of the Living Dead (1968)/" ds1_admin@100.78.2.105:"/volume1/media/video/Movies/Night of the Living Dead (1968)" > output.log 2>&1 && curl -d "💾 upload to vm500-kr complete" ntfy.sh/blog_demo >> output.log || curl -d "⚠️ upload to vm500-kr failed!" ntfy.sh/blog_demo >> output.log &
```
