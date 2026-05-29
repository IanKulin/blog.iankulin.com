---
title: "Installing service with Ansible"
date: '2023-09-30'
slug: installing-service-with-ansible
aliases:
  - /2023/09/30/installing-service-with-ansible/
tags:
  - ansible
  - devops
  - homelab
  - linux
  - service
---

Having written my little monitoring endpoint in Go, it needs pushed out to all my servers and VM's. Clearly this is a job for Ansible which I've already [dabbled my toes in](/ansible-with-secrets/). Before we get onto doing that though, we need to have a think about how to make it a service.

### Linux Services

A service in Linux is just a program, but one that's usually required to be running all the time to provide some piece of functionality. The "program" can be any executable, but to allow systemd to manage it, we need to tell it a bit about what we want in a `.service` file. This file is used by `systemd` to know how to manage the service. They can get quite complex, but here's the simple one for `vitals-glimpse` - my little monitoring API endpoint.

```bash
![\[Unit\]
Description=Memory and Disk statistics server on port 10321
After=network.target
\[Service\]
Type=simple
ExecStart=/usr/local/bin/vitals-glimpse
\[Install\]
WantedBy=default.target](/images/screen-shot-2023-08-19-at-11.23.21-am.png)
```

`ExecStart` is just saying what executable file is to be run. In this case it's my compiled Go program. It's a whopping 6MB so I'm assuming it's all statically linked and standalone, so to run it we just copy it into `/usr/local/bin` and run it from there.

The two lines mentioning `.target`s might not be obvious. These refer to the different times things happen in the machine startup sequence. `After=network.target` means "don't start this until the network is up and running". You can see how it would be pointless to start a server that's listening on a network port before networking is live. `default.target` is just the system state when everything is going and ready for the users to interact with things, so when we specify `WantedBy=default.target` we're just saying "this service needs to be running by the time we are ready for user interactions".

### Installation

I already have my hosts file listing every machine, and an encrypted vault for my secrets (we've discussed those before), so the installation Ansible playbook just needs to copy the executable file into place in `/usr/local/bin`, mark it as executable, copy the service file into place, and then start the service.

If the files are already up to date and we don't copy anything, then there's no need touch the service, but if we have copied a new file, then we want to restart the service to pick up the change. Here's how that all looks.

```yaml
---
- name: Install vitals-glimpse to a Debian based server
  # ansible-playbook vg-install.yml --ask-vault-pass 
  vars_files: ./vault.yml
  hosts: vm100-dockhost
  become: true

  tasks:
    - name: Copy service file
      ansible.builtin.copy:
        src: files/vitals-glimpse.service
        dest: /etc/systemd/system/vitals-glimpse.service
      notify: Restart vitals-glimpse

    - name: Copy executable
      ansible.builtin.copy:
        src: files/vitals-glimpse
        dest: /usr/local/bin/vitals-glimpse
        mode: '0755'  # Set the executable permissions
      notify: Restart vitals-glimpse

  handlers:
    - name: Restart vitals-glimpse
      ansible.builtin.service:
        name: vitals-glimpse
        state: restarted
        enabled: yes
```

The first thing to know is that I have a hosts inventory file in my Ansible config, and `vm100-dockhost` is just one of those hosts. The sudo credentials for that host are in the `vault.yml` file mentioned in the code as `vars_file`. I've started putting the command I need to run each playbook in a comment in the file so I don't have to remember them, the command for this one: `ansible-playbook vg-install.yml --ask-vault-pass` tells Ansible to run this playbook, and ask me for the password to decrypt the vault file.

The if/then mechanism to only do something based on something earlier happening in Ansible is usually achieved with notify/handles. We put the declarative block which is optionally executed in the `handlers:` block. The name of this block (in the case above it is `Restart vitals-glimpse`) is specified with the `notify` key. If either of the files are copied in, then the notify flag is set and the service is restarted.
