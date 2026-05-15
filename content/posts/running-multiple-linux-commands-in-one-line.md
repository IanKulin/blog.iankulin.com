---
title: "Running Multiple Linux Commands in One Line"
date: '2023-04-19'
slug: running-multiple-linux-commands-in-one-line
aliases:
  - /2023/04/19/running-multiple-linux-commands-in-one-line/
tags:
  - commands
  - homelab
  - linux
---

![](/images/luc_legay_hyperrealistic_wide_angle_shot_of_a_futuristic_milita_c8fa0a81-4a16-4314-a490-c89221c4060f-1.jpg)

Since I'm constantly standing up Linux virtual machines and containers - almost always of the `apt` variety, I'm constantly typing in:

```
apt update
apt upgrade
```

Then hitting enter again to allow whatever installation is needed to proceed. I've noticed in some of the commands I've been pasting in from installation instructions or StackExchange solutions have been separated by characters that look like it allows several commands to be run one after the other. To cut a long story short, the commands above could be entered like this with double ampersands:

```
apt update && apt upgrade
```

The ampersands mean that the second command will run after the first one as long as it completes without an error. To avoid having to hit enter again, we can add the `-y` flag.

```
apt update && apt upgrade -y
```

According to the [MakeUseOf article](https://www.makeuseof.com/how-to-run-multiple-linux-commands-at-once/) I learned about the double ampersands from, we could also have used a semicolon if we want each command to run regardless of the success of the previous one, or a double pipe if you only wanted the second command run run if the first one fails.
