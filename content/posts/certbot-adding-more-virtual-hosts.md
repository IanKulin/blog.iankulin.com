---
title: "Certbot - adding more virtual hosts"
date: '2023-10-15'
slug: certbot-adding-more-virtual-hosts
aliases:
  - /2023/10/15/certbot-adding-more-virtual-hosts/
tags:
  - certbot
  - certificates
  - devops
  - homelab
  - nginx
  - ssl
---

![](/images/dangling_pointer._a_central_neural_network_bathed_in_teal_and_m_9563eacf-6a8a-481d-a9e5-7fa72cabb4ea.jpg)

I've got a domain that's not currently used, so I'm going to set it up as a virtual host under NGINX. This server is already serving two domains set up with Certbot for SSL. Is it going to be possible to add another site and have Certbot manage the certificates for it after I've run Certbot once?

When I googled around to find out, I didn't find anything - which is usually a sign I'm either asking a wrong question, or it's so little drama that no one ever mentions it. I decided just to move the site, check it was all working for the http version, then run Certbot and see what it said.

Since I already had Certbot installed, I just ran `sudo certbot --nginx`

![](/images/screen-shot-2023-09-03-at-10.03.19-am.png)

It's probably worth explaining at this point that Certbot does not obtain separate certificates for each domain (which is what I'd been doing when I was doing this manually), but instead grabs a single certificate that includes all the domains, and stores it under the the first domain - in the case above, for agnet.

I hit "E" for Expand, and Certbot did it's thing by acquiring the new certificate expanded to cover the new domain and installed it. No drama.

### What if you already have a certificate from another provider?

I've got two more domains to move from another server, but both of these already have active SSL certificates that I obtained via Porkbun. Is that going to be a problem? Can Let's Encrypt (who actually does the certificates for Porkbun) include these sites on the combined certificate on my main VPS so I can use Certbot to maintain them? Let's see.

I went through the same routine - created a nginx conf for the virtual host in `/etc/nginx/sites-available/`, created a simple index.html in `/var/www/drysea.xyz` and then symlinked the conf file into `/etc/nginx/sites-enabled`. Then changed the A records for the DNS to point to the server address and waited for them to propagate so I could test the http version of the site.

After that, I ran the sudo certbot --nginx command again, and exactly as before, it asked if I wanted to expand the existing certificate. I did that, and the site can now be visited securely with no warning about the incorrect certificate. So that's all worked well.

It is allowable for a site to have more than one active, valid SSL certificate. This often happens in the exact scenario we've got here where domains are being moved around. There is a security implication for this though. A [system](https://www.csoonline.com/article/561111/dns-record-will-help-prevent-unauthorized-ssl-certificates.html) of entering a particular DNS record that would prevent certificates being issued by all but one particular certificate authority exists, but is not widely used.

It is probably a good idea for my to change my configuration on Porkbun to stop it from going on generating certificates that are not needed though, so I'll go ahead and revoke that.
