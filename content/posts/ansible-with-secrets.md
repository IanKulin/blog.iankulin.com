---
title: "Ansible with Secrets"
date: '2023-08-13'
slug: ansible-with-secrets
aliases:
  - /2023/08/13/ansible-with-secrets/
tags:
  - ansible
  - devops
  - homelab
  - possibly-useful
  - security
  - ssh
---

![Two men standing in front of a giant vault door](/images/danbearpig_construction_process_photos_of_an_enormous_hyper-sec_4bbf6350-647d-4e32-971b-cd2041cb52a9_webp.jpg)

We wrote a nice [little Ansible playbook](/first-ansible-playbook/) the other day to install nginx on our web servers and ensure it was running. We were able to store the usernames in the `hosts` inventory file using the a`nsible_ssh_user` variable. Then, we ran the playbook with the command:

`ansible-playbook web_installs.yaml --ask-become-pass`

This asked us the password to use with the usernames in the `hosts` file. Luckily that day, it was the same username/password combo to use for sudo on every server. What happens if that's not the case? Here's our new hosts file for today. There's a cool new sysadmin in town - Jane.

```
[vm323_deb]
100.108.154.133

[vm323_deb:vars]
ansible_ssh_user=ian

[vm324-deb]
100.77.75.14

[vm324_deb:vars]
ansible_ssh_user=jane
```

We could still use `--ask-become-pass` but it only asks us one password, and it's highly unlikely (we hope) that Jane and Ian have chosen the same password.

If you look at the inventory file above, you can see how the variables work - it's the same variable name - Ansible swaps the correct value in for each server as it accesses them. There's many of these variables in addition to `ansible_ssh_user`, including `ansible_ssh_pass`, so maybe we can do something like this:

```
[vm323_deb]
100.108.154.133

[vm323_deb:vars]
ansible_ssh_user=ian
ansible_become_password=mittens96

[vm324_deb]
100.77.75.14

[vm324_deb:vars]
ansible_ssh_user=jane
ansible_become_password=GBLEzrvc8rnUFruVrCwm
```

If you try that, it will work. However **it is a terrible idea to store our ssh passwords in that inventory file in plaintext.** They would be available to anyone who gets access to my workstation, AND when I commit my work to git, it's getting copied somewhere, probably including github. This is such a common problem there's [some business](https://www.gitguardian.com/solutions/scan-github-for-passwords) that have come into being to scan for passwords and API keys in people's repos.

There _is_ a better way. Ansible will allow us to store the secrets in a separate file as variables, and that separate file can be encrypted while it's on disk, and Ansible will decrypt it to use from memory then clean up after itself. There's a couple of new (to us) things here - variables, and the encryption. Let's look at them separately.

### Variables

`[Ansible variables](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_variables.html)` is a whole subject, we're just going to look at the minimum we need to solve out problem.

We can create another file in our project, let's call it plaintext.yaml and store our usernames and passwords in there as key: value pairs.

![](/images/screen-shot-2023-07-06-at-11.43.01-am.png)

Then we need to tell our playbook to import that `plaintext.yaml` file with `vars_files`.

![](/images/screen-shot-2023-07-06-at-11.53.25-am.png)

Then in the inventory file, we can substitute the usernames and passwords with our variables.

![](/images/screen-shot-2023-07-06-at-11.58.55-am.png)

Now, when the playbook runs, it will substitute the real values into the `host` inventory file for us. Let's check that.

![](/images/screen-shot-2023-07-06-at-12.03.09-pm.jpg)

Bingo bongo. But we haven't actually solved our security problem yet. The ssh passwords are still dangerously stored in plaintext in our file system. What we have done is learned how to have variables in an external file, pull that into the playbook and have the values substituted in. Now we need the next step - keeping those passwords safe.

### Ansible Vault

Clearly, every serious use of Ansible is going to have this issue (of needing ssh credentials, but not wanting to give them away to hackers) so of course, there is an elegant solution for it.

What if the file with all the passwords was stored encrypted, then only decrypted for use by our playbook, and it was never saved anywhere as plaintext? That solves the problem.

Ansible has a tool for this called [Ansible Vault](https://docs.ansible.com/ansible/2.8/user_guide/vault.html). We'll create the yaml file with our variables with that tool, and it will be saved encrypted. When we run the playbook we'll get it to ask us for the password to decrypt the file. It will do that in memory and run the playbook.

The command to create our file, which we'll call `vault.yaml` will be:

```
ansible-vault create vault.yaml
```

This will ask us to enter the password we want to use. The strength of this password needs to be good. If it's crackable, you are giving away root access to your systems. And it's in a file, not in a login situation where you can time out after three logins. Whoever has the file has the time to brute force password of the the [AES 256](https://www.ipswitch.com/blog/use-aes-256-encryption-secure-data) encryption.

![](/images/h4c7m5z2a2b71-copy.jpg)

Once you've entered your strong password twice, it will open up the new file in the default editor - probably vim. You may need help to use this editor.

![](/images/screen-shot-2023-07-06-at-12.46.35-pm.png)

When you're done, save the file and exit. What does this file look like:

![](/images/screen-shot-2023-07-06-at-12.51.38-pm.png)

Yep. That should do it. We still need to tell our playbook to use this file instead of the other one.

```
--- 
- name: nginx for all web servers
  vars_files: ./vault.yaml
  hosts: all
  become: yes
  tasks: 
    - name: nginx installed
      apt:
        name: nginx
        state: latest
    - name: nginx running
      service: 
        name: nginx
        state: started
        enabled: yes
```

And when we run the playbook, we need to let it know to ask us the vault password.

```
ansible-playbook web_installs.yaml --ask-vault-pass
```

![](/images/screen-shot-2023-07-06-at-1.00.16-pm.png)

If you need to edit the secrets file in the future, the command for that would be

`ansible-vault edit vault.yaml`

Once again it will ask the password, and once again it will open up in vim.
