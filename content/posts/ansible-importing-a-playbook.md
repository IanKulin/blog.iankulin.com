---
title: "Ansible - Importing a Playbook"
date: '2023-11-30'
slug: ansible-importing-a-playbook
aliases:
  - /2023/11/30/ansible-importing-a-playbook/
tags:
  - ansible
  - devops
---

![](/images/billyoblivion_intricate_and_highly_detailed_portable_ansible_la_c7e1c515-a2e6-4fef-b3c5-2d35e04ba09e.png)

[Ansible](/tags/ansible/) is a system for automating server tasks, and these tasks are written in a special yaml file called a playbook. I had need to call one playbook from another today and learned a couple of things.

### Plays vs Tasks

In Ansible we run _tasks_. A group of tasks run against one particular sets of hosts is called a _play_. Here is a playbook with one play, and two tasks:

```
---
- name: Play 1 - Print the Book 1 messages
  hosts: 127.0.0.1

  tasks:
    - name: Print message 1
      debug:
        msg: Book 1, Task 1

    - name: Print message 2
      debug:
        msg: Book 1, Task 2
```

It's possible to have multiple plays in a single _playbook_. This would often be done if there was different tasks to run on different servers. For example you might want to run log rotations on you web servers, but reindexing on the database servers.

```
---
- name: Play 1 - Print the Book 1 messages
  hosts: 127.0.0.1

  tasks:
    - name: Print message 1
      debug:
        msg: Book 1, Task 1

    - name: Print message 2
      debug:
        msg: Book 1, Task 2

- name: Play 2
  hosts: 127.0.0.1

  tasks:
    - name: Print message
      debug:
        msg: This is the second play in Book 1
```

### Importing Playbooks

When you run a playbook, generally the whole playbook gets run. So if we did have a playbook that included the tasks for the web servers and database servers, they would all be executed. That makes sense a lot of the time, but what if you usually wanted to run them together, but then sometimes just the database tasks?

Ansible has an answer for this - you put the plays in different playbooks, but then import one into the top of the other one.

Let's start over. Say this is our first playbook - `book1.yml`

```
---
- name: Play 1 - Print the Book 1 messages
  hosts: 127.0.0.1

  tasks:
    - name: Print message
      debug:
        msg: Book 1, Task 1
```

If we run that with `ansible-playbook book1.yml` the output will be:

```
PLAY [Play 1 - Print the Book 1 messages] *************************************************************************

TASK [Gathering Facts] *******************************************************************************
ok: [127.0.0.1]

TASK [Print message] *******************************************************************************
ok: [127.0.0.1] => {
    "msg": "Book 1, Task 1"
}

PLAY RECAP *******************************************************************************
127.0.0.1                  : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0  
```

And we'll make a `book2,yml` very similar:

```
---
- name: Print the Book 2 messages
  hosts: 127.0.0.1

  tasks:
    - name: Print message
      debug:
        msg: Book 2, Task 1
```

You can probably imagine the output from the example above - it's identical except for the numbers in the messages.

These two playbooks can easily be run separately, but then if we wanted to run them together sometimes, we could just make a new playbook that imported both of them:

```
---
- import_playbook: book1.yml
- import_playbook: book2.yml
```

If we run this playbook, the output is:

```
PLAY [Play 1 - Print the Book 1 messages] 
TASK [Gathering Facts] *******************************************************************************ok: [127.0.0.1]TASK [Print message] *******************************************************************************ok: [127.0.0.1] => {    "msg": "Book 1, Task 1"}PLAY [Print the Book 2 messages] *******************************************************************************TASK [Gathering Facts] *******************************************************************************ok: [127.0.0.1]TASK [Print message 1] *******************************************************************************ok: [127.0.0.1] => {    "msg": "Book 2, Task 1"}PLAY RECAP *******************************************************************************127.0.0.1                  : ok=4    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0  
```

### Potential problems

Instead of making a new file to import both playbooks, you might want to just import one playbook into the other. For instance, you could achieve the same as we've done above by editing `book2.yml` to import `book1.yml`:

```
---
- import_playbook: book1.yml
- name: Print the Book 2 messages
  hosts: 127.0.0.1

  tasks:
    - name: Print message 1
      debug:
        msg: Book 2, Task 1
```

It's important to note that this has to be done at that level in the hierarchy. You can't import a playbook in the middle of a play. For example this is legal yaml, but won't work.

```
---
- name: Print the Book 2 messages
  hosts: 127.0.0.1

  import_playbook: book1.yml

  tasks:
    - name: Print message 1
      debug:
        msg: Book 2, Task 1
```

Instead, we'll get an message like `ERROR! 'hosts' is not a valid attribute for a PlaybookInclude`. However this is fine:

```
---
- name: Print the Book 2 messages
  hosts: 127.0.0.1

  tasks:
    - name: Print message 1
      debug:
        msg: Book 2, Task 1

- import_playbook: book1.yml
```

The import above is at the highest level of yaml, not inside the play, so it works well.
