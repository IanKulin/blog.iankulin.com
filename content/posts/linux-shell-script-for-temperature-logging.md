---
title: "Linux Shell Script for Temperature Logging"
date: '2023-04-27'
slug: linux-shell-script-for-temperature-logging
aliases:
  - /2023/04/27/linux-shell-script-for-temperature-logging/
tags:
  - hardware
  - homelab
  - linux
  - scripting
---

![](/images/jimmy_e_a_computer_melting_on_an_office_desk_in_the_style_of_da_337547b0-ed21-46d5-8857-15d6dc8f6134.png)

A potential solution to my concern about the either perfect, or nearly dead, SSD would be to add a NVMe disk to the M.2 slot in the HP Elitedesk 800 G2's. I'd use those to boot from and run Proxmox, then the existing SSD's on each node in the cluster would just be part of the CephFS pool that has some redundancy built into it and hosts the VMs that are not using the NAS for their storage.

These 'gumstick' NVMe drives are remarkably good value in the smaller sizes at the moment, with Samsung 250GB NVMe's costing less than a pack of cigarettes in Australia.

![](/images/screen-shot-2023-04-20-at-7.02.57-pm.png)

A small concern I've got about that, and about the (very cute looking) way I've just got the computers all stacked on top of each other, is about the internal temperatures. I noticed SSD temperatures in the SMART data I was looking the other day, and I've seen CPU temperatures somewhere, so this data is available. So I set out on a quest to log some of it so I could do a before and after (NMVe installation) look at the temperatures.

[This article](http://www.pyroelectro.com/tutorials/cron-automation/check.html) was very close to what I wanted - a shell script to run in a cron job that would log the drive and CPU temperatures. The script goes a fair way beyond that, but my main issue was that it uses a couple of packages - `sensors`, and `hddtemp`. I like to avoid dependencies if I can, but I also thought the temp data was pretty simple and is probably just sitting in the `/sys/` directory tree somewhere.

That sort of turned out to be true. In /sys/class/hwmon/ there's a couple of directories (actually symlinks) for bits of hardware that can be monitored for temperature, and in those directories are text files with some values, the ones we're interested in being `name` and `temp1_input`.

```
root@pve-dev1:~# tree /sys/class/hwmon/
/sys/class/hwmon/
├── hwmon0 -> ../../devices/virtual/thermal/thermal_zone0/hwmon0
├── hwmon1 -> ../../devices/platform/coretemp.0/hwmon/hwmon1
└── hwmon2 -> ../../devices/pci0000:00/0000:00:17.0/ata1/host0/target0:0:0/0:0:0:0/hwmon/hwmon2

3 directories, 0 files
root@pve-dev1:~# ls /sys/class/hwmon/hwmon0
device  name  power  subsystem  temp1_input  uevent
root@pve-dev1:~# cat /sys/class/hwmon/hwmon0/name /sys/class/hwmon/hwmon0/temp1_input
pch_skylake
45500
```

[![](/images/intel_5_series_architecture.png)](https://commons.wikimedia.org/w/index.php?curid=9817206)
*Intel 5 architecture - Anas hashmi*

The first two are temperatures of the [Platform Controller Hub (PCH)](https://commons.wikimedia.org/w/index.php?curid=9817206) and actual CPU. Both of these values were already just sitting there.

The third value, for the SSD temperature didn't appear until added by running `modprobe drivetemp` to load a kernel module.

That's the three values I want to log sorted then, but how to go about it? [That first article](http://www.pyroelectro.com/tutorials/cron-automation/check.html) I mentioned had a shell script using printf() to output some values to a log file, then the script was triggered by a cron job. Two things I've never done before, so let's dive in. Here's the finished code.

![](/images/screen-shot-2023-04-20-at-8.32.11-pm.png)

I wrote MS-DOS batch files in the 1980s so this wasn't completely alien to me. A few points were:

-   Everyone else's shell scripts start with `#!/bin/bash` so I assume that's compulsory. Other lines starting with `#` are comments.
-   In that list of variables, each one is filled with the results of the command being assigned to it in the single quotes. So if typing in `cat /sys/class/hwmon/hwmon0/name` at the terminal prompt would result in the output `pch_skylake`, then the variable `pch_name` will contain `pch_skylake`.
-   If you're not coming to this from a programming background, this printf() command is going to look weird.

```
printf "$(date +'%d/%m/%Y,%T'),%s,%d,%s,%d,%s,%d\n" $pch_name $pch_temp $cpu_name $cpu_temp $ssd_name $ssd_temp >> $log_file
```

-   How these work is that the first part is the string to print, but it has some placeholders (all those `%`letters). At runtime, the values from the end of the line are inserted into them. Like this:

```
root@pve-dev1:~# printf "Hello %s\n" "Ian"
Hello Ian
```

The `%s` is a placeholder for a some text, then we supply the text at the end - `"Ian"`. In this case, `"Ian"` is a string literal, if we'd used a variable (as in our logging script) then the contents of the variable would be used instead. The `\n` at the end of the string is a newline character so whatever comes after starts on a new line.

At this point I know enough about Linux permissions that I knew I'd have to set the shell script file to be executable with a `chmod 755`, and to call it with the `./` in front of it that I was perplexed about a couple of days ago.

Again, the original article gave an example of the line to put into /etc/crontab. It just needed the path to my script and it was good to go.

```
# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) 
# |  |  |  |  |
# *  *  *  *  * user-name command to be executed
*/5 *   * * *   root    /root/bin/tempCheck.sh 
```

Next thing you know, the log file is slowly growing at `/var/log/temps.csv`.

```
20/04/2023,20:30:01,pch_skylake,45000,coretemp,38000,drivetemp,38000
20/04/2023,20:35:01,pch_skylake,45000,coretemp,37000,drivetemp,38000
20/04/2023,20:40:01,pch_skylake,44500,coretemp,37000,drivetemp,38000
20/04/2023,20:45:01,pch_skylake,45000,coretemp,37000,drivetemp,38000
20/04/2023,20:50:01,pch_skylake,44500,coretemp,37000,drivetemp,38000
20/04/2023,20:55:01,pch_skylake,44500,coretemp,37000,drivetemp,38000
20/04/2023,21:00:01,pch_skylake,45000,coretemp,37000,drivetemp,38000
20/04/2023,21:05:01,pch_skylake,45500,coretemp,38000,drivetemp,38000
20/04/2023,21:10:01,pch_skylake,45000,coretemp,38000,drivetemp,38000
20/04/2023,21:15:01,pch_skylake,45500,coretemp,37000,drivetemp,38000
```

Obviously I'm going to graph this, and also obviously, I'm going to run a CPU stress test in a VM in the middle of the data collection.

![](/images/temp-chart.png)
