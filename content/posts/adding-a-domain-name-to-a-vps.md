---
title: "Adding a Domain Name to a VPS"
date: '2023-04-28'
slug: adding-a-domain-name-to-a-vps
aliases:
  - /2023/04/28/adding-a-domain-name-to-a-vps/
tags:
  - devops
  - domain
  - vps
---

![](/images/sjramblings_io_aws_route_53_resolver_is_a_dns_resolution_servic_227bbb4f-1ff3-455d-84fa-5e8ea4310df8_png_92.jpg)

I've had a small [BinaryLane VPS](https://www.binarylane.com.au/) for a while that I use for homelab type stuff, but now need to serve a tiny amount of JSON from it. A longer term plan is to use it as a [Wireguard](https://www.wireguard.com/) tunnel back to my cluster at home to expose the services that need to be internet facing. I've also had a domain name I bought from [Porkbun](https://porkbun.com/products/domains) sitting round for a bit, so it's probably a good time to join them up.

When you type a domain name into your web browser it needs to be turned into an IP address in order to return the content you need from that web server. For example if I type in `google.com` it needs to be turned into `172.217.24.46` in order to fetch the front page of Google.

The things that provide this translation service are the Domain Name Service (DNS). There's several layers of DNS and if the first layer asked does not know, the request gets escalated until it is found or the request fails - but somewhere in that chain there needs to be a name server (the Authoritative DNS) that knows the domain name and the IP address. DNS is cached all over the place, so most requests don't get all the way back there (and changes sometimes take a little while to percolate around) but there must an an authoritative name server somewhere.

It's possible to have my domain pointed to the BinaryLane name servers, but it's currently pointed to the Porkbun name servers, and it's simpler for me to leave it there.

All I need to do at the Porkbun end is go into Domain Management, and open up the "DNS entries" for the domain, and edit the "A Records" to point at the IP address.

![](/images/screen-shot-2023-04-21-at-9.24.12-am.png)

And that's enough that a few minutes later, typing the domain address into a web browser pulls up the test page from the Nginx web server running in a container on my VPS.

![](/images/screen-shot-2023-04-21-at-9.35.48-am.png)
