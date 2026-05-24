---
title: "Vim"
date: '2022-08-10'
slug: vim
aliases:
  - /2022/08/10/vim/
tags:
  - editor
  - ide
  - posts
  - vim
---

<img src="/images/1-_bwvjb2jzuuzyxgxm6xwqq.png" width="191" alt="">

I've been working through the [Missing Semester](https://missing.csail.mit.edu/) lectures from MIT, and recently completed the lecture about the [Vim editor](https://github.com/vim/vim). Vim is a test editor, called from the command line, and optimised for programming - in the sense that it assumes most of the use of the editor is navigating around a big text file making small changes rather than entering large amount of test.

It uses simple, short key presses (as opposed to mouse movements or using menus or toolbars) to achieve things. This makes it highly efficient for good typists who know all the commands, and slightly incomprehensible to those who do not. An additional level of complexity is the idea of modes. Vim has several modes, the main ones being:

-   Normal - for navigating around and making those little edits. To get into this mode press the esc key
-   Insert - for entering text - ie the mode you'd assume you were in when opening an editor and not that you would have to press the letter 'i' to make that happen
-   Command - to run commands - like saving or closing VIM To get into this mode press the ':' key

Apart from [this lecture](https://missing.csail.mit.edu/2020/editors/) here are many good guides for learning VIM, a couple I've looked at are [this one from OpenSource.com](https://opensource.com/article/19/3/getting-started-vim) and [this one from Stanford](https://web.stanford.edu/class/cs107/resources/vim.html).

Even though I will never invest the time to become a power user of Vim, it's available most places you'll be using the command line, so the basics are a requirement for any programmer. Plus if you're ever hired by a film production company to advise on a computer hacking scene, you'll need it to scroll though some syntax highlighted Javascript.

[![](/images/iigrixvxp5ayn9ox7gr1dfi_rhlrotwllscafjjqjeq.webp)](https://www.vimcheatsheet.com/)
*Great cheat sheet from [https://www.vimcheatsheet.com/](https://www.vimcheatsheet.com/)*
