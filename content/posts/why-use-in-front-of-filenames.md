---
title: "Why use './' in front of filenames?"
date: '2023-04-23'
slug: why-use-in-front-of-filenames
aliases:
  - /2023/04/23/why-use-in-front-of-filenames/
tags:
  - command-line
  - homelab
  - linux
---

![](/images/pino_path_in_the_middle_of_tall_wheat_stalks_sunset_cartoon_sty_dc2ca25c-dec8-4e9b-b204-6236bc3e8b08.jpg)

In Linux (and MS-DOS I guess) the period signifies the current directory, so if I have a file in the current directory called `test.txt`, I can refer to it as `test.txt` or `./test.txt`

```
ian@enrico-rider:~$ cat test.txt
test
ian@enrico-rider:~$ cat ./test.txt
test
```

I mostly see this in references to files in HTML and have often wondered why. Here it is being used in a Udemy course I'm following.

![](/images/screen-shot-2023-04-19-at-10.49.00-am.jpg)

It's one of those things that's difficult to Google, so these days my reflex is to ask ChatGPT such questions.

![](/images/screen-shot-2023-04-19-at-11.17.53-am.png)

Okay. That makes sense for executable files. If you just type in the name, Linux will look in the current directory, then if not found, in each of the directories in your $PATH variable. But if you add the ./ to the front, it will only look in your current directory. This claim of ChatGPT's is easily tested, lets try with `cat`.

```
ian@enrico-rider:~$ cat test.txt
test
ian@enrico-rider:~$ ./cat test.txt
-bash: ./cat: No such file or directory
ian@enrico-rider:~$ cp /usr/bin/cat cat
ian@enrico-rider:~$ ./cat test.txt
test
```

So that checks out, but it doesn't explain the main place I see it - in HTML.

![](/images/screen-shot-2023-04-19-at-12.00.12-pm.png)

Again, that makes sense. But it still doesn't answer why the instructor in my course is using it for:

```
cp /etc/passwd ./users.txt
```

![](/images/screen-shot-2023-04-19-at-12.06.52-pm.png)

Lol - I feel this is a real edge case. I can see it being more a problem with the first file rather than the second one. eg.

![](/images/screen-shot-2023-04-19-at-12.21.05-pm.png)

So, TL:DR; using './' in front of a filename can be useful when:

-   executing a shell script in the current directory (to avoid ambiguity with other executable files in your PATH);
-   when running a command that takes filenames as arguments, and the filename might be confused with an argument;
-   in HTML to avoid confusion between the directory the current file is in and the root directory of the web server.
