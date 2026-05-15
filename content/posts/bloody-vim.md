---
title: "Bloody VIM"
date: '2023-08-10'
slug: bloody-vim
aliases:
  - /2023/08/10/bloody-vim/
tags:
  - homelab
  - linux
  - vi
  - vim
---

![](/images/mikemol_female_oracle_database_administrator_seething_over_a_de_41a485b2-af77-47db-9db0-73dfa14e4ad0.jpg)

> _Vim is a highly configurable text editor built to make creating and changing any kind of text very efficient. It is included as "vi" with most UNIX systems and with Apple OS X._
> 
> [vim.org](https://www.vim.org/)

You will encounter vi/vim as the incomprehensible text editor that pops up by default when you need to edit something in your sysadmin journey. Perhaps you issued the command to edit your Ansible vault, perhaps you forgot to add a message to a commit. It's going to be unavoidable.

Here is the minimum knowledge you need to survive these encounters.

-   It has modes. When it opens up, you are in 'moving around mode'. Use the cursor keys to get to where you need to.
-   When you actually want to edit something, press `i` now you're in _INSERT_ mode and it's behaving how 99% of the world expect an editor to behave. When you type things, they go into the document where the cursor is.
-   When you are done, press _escape_ to get out of INSERT mode, then these keys one at a time `: w q`

The underlying theory of Vim - that you spend more time moving around in text than editing it, is true of most sysadmin and programming tasks. So Vim has powerful, non-intuitive commands to do that efficiently. It's impressive to watch people who have learned these arcane ways move around a file. They don't have girlfriends. There are also powerful, non-intuitive commands for editing.
