---
title: "How to install M.2 SSD in HP G2 800 Mini"
date: '2023-08-28'
slug: how-to-install-m-2-ssd-in-hp-g2-800-mini
aliases:
  - /2023/08/28/how-to-install-m-2-ssd-in-hp-g2-800-mini/
tags:
  - hardware
  - homelab
  - m-2
  - nvme
---

![](/images/img_5821-copy.jpg)

As part of my strategy to not worry about the [slightly dodgy SMART reporting](/sdd-wearout-numbers/) on the SDD's in my HP Elitedesk G2 800 Mini Proxmox nodes, I'd decided to make use of the full sized [M.2](https://en.wikipedia.org/wiki/M.2) slot to install 256GB NVME drives. That way I can boot from those, and have the SSD's running [ZFS](https://arstechnica.com/information-technology/2020/05/zfs-101-understanding-zfs-storage-and-performance/) which allows _[scrubbing](https://openzfs.github.io/openzfs-docs/man/8/zpool-scrub.8.html)_ to check the integrity of all the data. My VM disks can live on this drive.

The [G2 800 Mini](https://support.hp.com/au-en/product/hp-elitedesk-800-35w-g2-desktop-mini-pc/7633266) has two M.2 slots, a 2230 (M.2 sizes are `wwll` where `ww` is width in mm, and `ll` is length in mm) for the wireless/bluetooth adaptor and a 2280 for storage. These slots are under the SSD drive cage.

## Steps

-   Undo the large finger-operable screw on the back of the case, then slide the case off in the direction of the front of the unit.
-   Unplug the drive SATA connector

![](/images/img_5818.jpg)

-   At the right side of the SSD (when the machine is orientated per the photo above) is a lever that can be pushed a little to the right to allow the drive to slide back and be lifted out.
-   There's three giant screws holding the drive cage in numbered 1, 2 & 3. There's also several smaller screws with numbers - ignore them. The ones you are looking for have a torx in the middle, but also a slot for an ordinary flat blade screwdriver. If you can only find two, that's probably because the drive's SATA connector is covering it up.

![](/images/img_5829.jpg)

-   Once the drive cage is removed and set aside, you'll be able to see the two M.2 slots. The NVME drive slots in like SODIMM memory - sort of sprung up on the end away from the connector. I didn't like the look of those lose wires - but I assume they are for the wifi or bluetooth antennas.

![](/images/img_5821-copy.jpg)

-   Wriggle it in, then push the end down and secure it with the little M.2 screws. You did remember to [order those screws](https://www.ebay.com.au/itm/254101897159?hash=item3b29a73fc7:g:Wi4AAOSw6JpfdRiw&amdata=enc%3AAQAIAAABAFQS9v%2BRrt%2FNj4OpgTFaOvObhlzxvwZi%2BTxcYYqqbid7A6%2BkHvM6T3%2BDJ%2FegE3E9k3OH8bnHIBDJATYnIeJb9db%2FcKPWZP%2FAeNLDhwPi%2FDebbCZOJmhrSd3j0GRYLzE03YK%2F8DvMMAeLjPWLUO6mqZSUv%2FB7%2FuOs4Yz%2F5%2Bj6atvgCb0afWi9igSdklHlr6N1gqWN7DSb9WrCi2Dx62LQdasjvyrTNm%2BeDGzRj1ADzEJTG1oyJkOto6DOY2cUiGM5gLssMknszOh25RhBgXrNLf%2BUFnzUI2%2BOr5fvcamWs7zxKJJcndcMYOzbm3v%2B243SsWoGymttCsbsWi%2FLRekQRpQ%3D%7Ctkp%3ABFBMvrXWjLBi), right? My $20 Samsung PM981a 256GB drives didn't come with any, but perhaps fancy ones do.
-   Then, as 1970 [Greggory's workshop manuals](https://haynes.com/en-au/holden/kingswood/1968-1971?part=04085&selector=print&gclid=EAIaIQobChMI3u6DqfKjgAMVLtcWBR2U7gT2EAQYBiABEgIgmfD_BwE) used to say, "_Assembly is the reverse of the disassembly steps with attention to the following:_". In this case, the attention would be towards being gentle with that SSD ribbon connector.
