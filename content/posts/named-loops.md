---
title: "Named Loops"
date: '2022-08-21'
slug: named-loops
aliases:
  - /2022/08/21/named-loops/
tags:
  - code
  - loops
  - posts
  - swift-language
---

<img src="/images/img_2768.png" width="133" alt="">

Here’s a neat thing I haven’t seen before. Other languages I’ve worked in haven’t had a neat way to break out of a set of nested loops to a particular loop. It’s not an issue that comes up a lot, but when it has I’ve solved it by creating a continue flag and having that as the first condition of each loop.  
  
To explain, say if we had these two loops (in C):

  int i;
  int j;
  char string\[\] = "This string";
  int length = strlen(string);
  
  for (i=0; i<=3; i++) {
    
    for (j=0; j<length; j++) {
      printf("char:%c num:%d\\n", string\[j\], i);
    }
    
  }

and for some unexplained reason, we need to break out of both loops when we encounter a lowercase ‘t’. There is a C command to break out of a loop - _break_. But it only breaks out of the current loop:

  int i;
  int j;
  char string\[\] = "This string";
  int length = strlen(string);
  
  for (i=0; i<=3; i++) {
    
    for (j=0; j<length; j++) {
      printf("char:%c num:%d\\n", string\[j\], i);
      if (string\[j\] == 't') {
        break;
      }  
    }
    
  }

Since the outside loop that is iterating ‘i’ is not broken out of, we still end up looping through to the letter ‘t’ four times. Like this:

```
char:T num:0
char:h num:0
char:i num:0
char:s num:0
char:  num:0
char:s num:0
char:t num:0
char:T num:1
char:h num:1
char:i num:1
char:s num:1
char:  num:1
char:s num:1
char:t num:1
char:T num:2
char:h num:2
char:i num:2
char:s num:2
char:  num:2
char:s num:2
char:t num:2
char:T num:3
char:h num:3
char:i num:3
char:s num:3
char:  num:3
char:s num:3
char:t num:3
```

So in C/C++ I would convert the loops to _while_, and set a _continue_ flag. First the whiles:

  int i;
  int j;
  char string\[\] = "This string";
  int length = strlen(string);
  
  i = 0;
  while (i <=3) {
    
    j=0;
    while (j<length) {
      printf("char:%c num:%d\\n", string\[j\], i);
      if (string\[j\] == 't') {
        break;
      }  
      j++;
    }
    
    i++;
  }

Then the flag, which I've called _keepGoing_:

  int i;
  int j;
  char string\[\] = "This string";
  int length = strlen(string) ;

  int keepGoing = true;
  i=0;
  while (keepGoing==true && i <=3) {
    
    j=0;
    while (keepGoing==true && j<length) {
      printf("char: %c num: %d\\n", string\[j\], i);
      if (string\[j\]=='t') {
        keepGoing = false;
      }
      j++
    }
 
  }

This gives us the output we want and we can close the ticket. Note that I have  
typedef'd _true_ and _false_ off-screen in the code above.

```
char:T num: 0
char:h num: 0
char:i num: 0
char:s num: 0
char:  num: 0
char:s num: 0
char:t num: 0
```

With Swift, we can just name the loops, then break out to a named loop level:

  littleLoop: for i in 0...3 {
    bigLoop: for char in "This string" {
        print("char:\\(char) num:\\(i)")
        if char=="t"{
            break littleLoop
        }
    }
  }

Note that I didn't need to name the internal _littleLoop_, that was just showing off.
