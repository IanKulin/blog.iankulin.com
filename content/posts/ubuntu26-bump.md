---
title: "Ubuntu Ansible 'waiting for privilege escalation prompt'"
date: '2026-05-16'
slug: ubuntu26-bump
tags:
  - ubuntu
  - rust
  - ansible
---

I ran into a hiccup today - provisioning a new Ubuntu VPS, the ansible playbook to apply our security hardening failed.

```bash
 ~/Developer/ansible_hl % ansible-playbook ssh-harden.yml --ask-vault-pass -e @vault.yml               
Vault password: 

PLAY [Copy the hardened SSHD_CONFIG file to the remote server] ****************************************************

TASK [Gathering Facts] ********************************************************************************************
[ERROR]: Task failed: Timeout (12s) waiting for privilege escalation prompt:
fatal: [<redacted IP>]: UNREACHABLE! => {"changed": false, "msg": "Task failed: Timeout (12s) waiting for privilege escalation prompt:", "unreachable": true}
```

My routine is to run Ubuntu LTS, and when I was provisioning the server, I selected Ubuntu 26.04 LTS x64 without thinking. This LTS dropped in April, and excitingly the new versions of Ubuntu have Rust coreutils including `sudo`.

The cause of the issue above (where anisible waits for the sudo password request but never sees it) is that the password prompt in `sudo-rs` is different from real sudo. Here's the old one:

```bash
ian@iris-orca:~$ sudo lsb_release -d
[sudo] password for ian: 
No LSB modules are available.
Description:	Ubuntu 24.04.4 LTS
ian@iris-orca:~$ sudo --version
Sudo version 1.9.15p5
Sudoers policy plugin version 1.9.15p5
Sudoers file grammar version 50
Sudoers I/O plugin version 1.9.15p5
Sudoers audit plugin version 1.9.15p5
ian@iris-orca:~$ 
```

And the new one:

```bash
ian@ksd-on-syd-001:~$ sudo lsb_release -d
[sudo: authenticate] Password:                       
Description:	Ubuntu 26.04 LTS
ian@ksd-on-syd-001:~$ sudo --version
sudo-rs 0.2.13-0ubuntu1
ian@ksd-on-syd-001:~$ 
```

So, `[sudo] password for ian: ` vs `[sudo: authenticate] Password:  `.

It's not a big deal, and ansible has [already made](https://github.com/ansible/ansible/pull/86175) a fix for the incompatibility, it just hasn't flowed down to me yet. Ubuntu 24 is still LTS so I'll drop back to that.

For the adventurous, another possible approach would be to create an ansible user with passwordless ssh - I'd rather wait for the ansible update before I move to a Linux version using sudo_rs.
