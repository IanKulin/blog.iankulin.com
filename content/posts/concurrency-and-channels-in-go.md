---
title: "Concurrency and channels in Go"
date: '2023-12-12'
slug: concurrency-and-channels-in-go
aliases:
  - /2023/12/12/concurrency-and-channels-in-go/
tags:
  - code
  - concurrency
  - go
  - posts
  - web-dev
---

![](/images/portal-logo.jpg)

In the long ago times, I'd done several years of commercial programming before I ever had to worry about dealing with multiple things happening at the same time. Perhaps because of the rarity of this problem, doing it in traditional languages was not always elegant.

In the modern world of everything happening on the network, and systems being build out of micro-services and APIs, the beginning programmer probably has to deal with this stuff in Programming 102. Luckily, modern languages have these considerations built in, and one language with a particular reputation for that is Go.

In Go, we have _Goroutines_. This is basically a way of calling a function in such a way that the function goes away and does it's thing and the rest of the program doesn't wait for it. To do this, you just pop a go directive in front of the function call. Consider this little program:

```
package main

import (
	"fmt"
	"math/rand"
	"time"
)

func waitAndReportWorker() {
	for {
		sleepTime := time.Duration(rand.Intn(5)) * time.Second
		time.Sleep(sleepTime)
		fmt.Printf("Worker slept for %s", sleepTime)
	}
}

func main() {
	waitAndReportWorker()
}
```

If we run this, main hands control over to the worker, which sleeps for a bit, prints a message then repeats (normally the worker would some, like, actual work; but for our demo purposes, having a little nap then reporting it it fine).

![](/images/screen-shot-2023-11-23-at-8.34.12-pm.png)

We can convert it to a Goroutine, just by putting a go in front of the function call,

```
func main() {
	go waitAndReportWorker()
}
```

Yay! Our first baby Goroutine. Sadly, this program will exit before the worker ever reports, so let's add an infinite loop after we've launched the Goroutine. And we'll do something in the loop so you can see that there things are happening concurrently in our program.

![](/images/screen-shot-2023-11-23-at-8.46.11-pm.png)

### Collisions

In my confected example, it's extremely unlikely that the message from the worker would collide with the message being printed in the main loop, but it's possible. But if we scaled up to a worldwide networked system processing millions of something a minute, it becomes almost guaranteed. Maybe a couple of sentences being mangled in output to the terminal is no big drama, but if we were writing something to a memory location, a file, a heart surgery robot interface, a database etc it could be bad. So we need to avoid that.

The way Go deals with this is with _channels_. A channel is like a portal between the main program in sequential procedural program land, to the worker function. When the worker needs to interact in some way with the main program it passes something back through the portal, and Go deals with it to avoid the dreaded collision. The portal/channel works the other way as well - the main program can pass information through the portal to the worker function.

Let's have a look at the changes for this, then tease them out a little:

```
func waitAndReportWorker(resultChan chan<- string) {
	for {
		sleepTime := time.Duration(rand.Intn(5)) * time.Second
		time.Sleep(sleepTime)
		resultChan <- fmt.Sprintf("\nWorker slept for %s\n", sleepTime)
	}
}

func main() {

	resultChan := make(chan string)

	go waitAndReportWorker(resultChan)
	for {
		time.Sleep(250 * time.Millisecond)
		fmt.Print("Nothing happening here ")
		result := <-resultChan
		fmt.Println(result)
	}
}
```

We create the channel with the `make` function. The type for the channel is the type that we're going to be passing through it. We pass the channel to our worker, where the function signature is:

`func waitAndReportWorker(resultChan chan<- string)`

I like this little arrow, it's showing which way the portal works. In this case its a portal (channel) for passing a string out of the worker back to the main program. Channels can go the other way, ie. to pass things into the worker, or they can be bi-directional, which I don't really think I'd do - I'd just add another channel.

In our worker, we stuff something into the channel with that same arrow:

`resultChan <- fmt.Sprintf("\nWorker slept for %s\n", sleepTime)`

On the other end of our portal/channel (I wish they'd just called them portals - it's no quirkier than the date formatting) in the main program we use another arrow to pull the value out:

`result := <-resultChan`

If we run this code, it works, sort of.

![](/images/screen-shot-2023-11-24-at-4.51.21-pm.png)

If you look at the output at the bottom, you can see that extracting the string out of our channel is a blocking operation. The program is waiting there until it gets a value. That's no use - we could have done that without mucking about with channels.

Of course, there is a way around this. What we really want to to is check if there's a value in the channel. If there is, process it, or if not, travel around our loop again. What we do is put the retrieval of the channel value as a case in a select block.

```
func main() {

	resultChan := make(chan string)
	go waitAndReportWorker(resultChan)

	for {
		select {
		case result := <-resultChan:
			fmt.Println(result)
		default:
			time.Sleep(250 * time.Millisecond)
			fmt.Print("Nothing happening here ")
		}
	}
}
```

This version of the program will work exactly how we want. The worker goroutine will execute independently of the main loop which runs permanently, but then when the worker goroutine has something to say, it uses the channel to pass it back to the main routine which deals with it at the first opportunity.

![](/images/screen-shot-2023-11-24-at-6.04.35-pm.png)

Even though this is all working how we'd like, there is bit of programming craftsmanship needed. You may already know `make()` from using it for slices. When we're using it we're allocating some resources - so now we have the responsibility to release them.

To release the channel we made above, we close it:

`close(resultChan)`

Let's add that for completeness. I'll the time to exit my infinite loop. In practice You'll have some other condition.

```
package main

import (
	"fmt"
	"math/rand"
	"time"
)

func waitAndReportWorker(resultChan chan<- string) {
	for {
		sleepTime := time.Duration(rand.Intn(5)) * time.Second
		time.Sleep(sleepTime)
		resultChan <- fmt.Sprintf("\nWorker slept for %s\n", sleepTime)
	}
}

func main() {

	resultChan := make(chan string)
	go waitAndReportWorker(resultChan)

	startTime := time.Now()

	for {
		select {
		case result := <-resultChan:
			fmt.Println(result)
		default:
			time.Sleep(250 * time.Millisecond)
			fmt.Print("Nothing happening here ")
		}
		if time.Since(startTime).Seconds() >= 10 {
			break
		}
	}

	close(resultChan)
}
```

This is pretty much the minimal set up you need to get going with concurrency with Go:

-   the channel
-   a goroutine
-   a select in a loop
-   some cleanup by closing the channel

[code on github](https://github.com/IanKulin/gochanneldemo)
