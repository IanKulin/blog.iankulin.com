---
title: "Testing, testing"
date: '2022-10-09'
slug: testing-testing
aliases:
  - /2022/10/09/testing-testing/
tags:
  - possibly-useful
  - swift5-7
  - testing
  - tools
  - xcode
  - xcode14
---

I have unit testing in my goals, and if I'm going to throw this [space trimming](/codetrimmer-first-macos-app/) macOS utility up on the web, now might be a good time to figure out how to add unit tests to a project, how to write them, and how to run them. XCode is well set up for this, so it's really no drama to do.

![](/images/screen-shot-2022-10-03-at-9.09.32-pm.jpg)

Although I haven't worried with any unit testing up to this point in my iOS/Swift learning, in my previous programming work I did a lot of work with the large calculations involved in translating GPS coordinates and robotic positioning models where errors would be bad - so I've written a lot of tests over the years. I've also definitely felt the confidence you can dramatically refactor code with when you know the code has a robust test suite. I'm a big fan.

#### Adding Tests to Existing Project

<a href="/images/screen-shot-2022-10-03-at-9.28.39-pm.png"><img src="/images/screen-shot-2022-10-03-at-9.28.39-pm.png" width="239" alt=""></a>

In Xcode, with your project open, you need to add the _testing target_. `File | New | Target...` then scroll down to find the _Unit Testing Bundle_. When you add that, you'll see a new folder in the Project Navigator, and a new source file - both with the name `<app name>Tests`.

If you click into the `<app name>Test.swift` file, you'll see a couple of methods for setting up the testing environment and cleaning up after it. They are called before and after each test - you'd use them if you needed to set something up like some files in a directory or similar and wanted to ensure it was not affected by the tests run before the current test. Don't worry about them for the time being.

#### Writing Tests

Before we can write any tests, we need to import any modules with the code we want to test. In my case, I want to test the function stripSpaces() which is in the ContentView of my app called CodeTrimmer. So in the top of the CodeTrimmerTests.swift file, under the other import, I add the import:

```
import XCTest
@testable import CodeTrimmer
```

Then we can write our tests. The test functions must start with the magic prefix _test_ so that Xcode treats them as such. The usual approach in the test is to call a function with some specific input, then test the output is what is expected with a special test version of assert():

Here's a couple. My function stripSpaces() deletes a number of spaces from each line of a block of code such that the block becomes left aligned. if the XCTAsserts() pass, the test passes and I get a green tick. To run the tests I just click in the breakpoint gutter next to the function declaration.

```swift
    func testStripSpaces01() throws {
        let testString =
        """
        single line string no spaces
        """
        let resultString = stripSpaces(testString)
        XCTAssertTrue(resultString == testString, testString)
    }

    func testStripSpaces02() throws {
        let testString =
        """
            single line 4 spaces
        """
        let resultString = stripSpaces(testString)
        XCTAssertFalse(resultString == testString, testString)
        XCTAssertTrue(testString.dropFirst(4) == resultString, testString)
    }
```
